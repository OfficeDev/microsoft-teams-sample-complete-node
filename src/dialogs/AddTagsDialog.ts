import * as builder from "botbuilder";
import { TriggerActionDialog } from "../utils/TriggerActionDialog";
import { DialogIds } from "../utils/DialogIds";
import { DialogMatches } from "../utils/DialogMatches";
import { Strings } from "../locale/locale";
import { isMessageFromChannel, getLocaleFromEvent } from "../utils/DialogUtils";
import { ChannelData } from "../utils/ChannelData";
import { NotificationEntry } from "../storage/MongoDbTagStorage";
import { SOEBot } from "../SOEBot";

export class AddTagsDialog extends TriggerActionDialog {

    private static async promptForTags(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        // set the bot in dialogData for later waterfall steps because prompts erase the args
        // session.dialogData.bot = args.constructorArgs.bot;

        let tagInputString = null;
        if (args && args.intent && args.intent.matched && args.intent.matched[1]) {
            tagInputString = args.intent.matched[1].trim();
        }
        let tagInputStringFromSettingsCard = null;
        if (args.tagInputStringFromSettingsCard) {
            tagInputStringFromSettingsCard = args.tagInputStringFromSettingsCard.trim();
        }

        if (tagInputString) {
            next({ response: tagInputString });
        } else if (tagInputStringFromSettingsCard) {
            next({ response: tagInputStringFromSettingsCard });
        } else {
            builder.Prompts.text(session, "Enter tags");
        }
    }

    private static async getTags(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let tagInputString = args.response.trim();
        if (!tagInputString) {
            session.send("You did not enter any tags");
            session.endDialog();
            return;
        }

        let unfilteredTags = tagInputString.split(/,\s*|;\s*|\s+/);

        // need to filter to get rid of any undesirable entries
        let tags = new Array<string>();
        for (let currUnfilteredTag of unfilteredTags) {
            // do not add null, undefined, or an empty string to the list
            if (!currUnfilteredTag) {
                continue;
            }

            // have to do this iteration rather than using indexOf to test for tag name capitalization inconsistency
            let tagAlreadyEntered = false;
            for (let currTag of tags) {
                if (currUnfilteredTag.toLowerCase() === currTag.toLowerCase()) {
                    tagAlreadyEntered = true;
                    break;
                }
            }

            if (!tagAlreadyEntered) {
                tags.push(currUnfilteredTag);
            }
        }

        session.dialogData.tags = tags;
        let buttonText = session.gettext(Strings.tags_confirmation_yes) + "|" + session.gettext(Strings.tags_confirmation_no);
        let messageText = "You are about to setup tags:<br>";
        for (let currTag of tags) {
            messageText += "**" + currTag + "**<br>";
        }
        builder.Prompts.choice(session, messageText, buttonText, { listStyle: builder.ListStyle["button"] });
    }

    private static async confirmTags(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let tags = session.dialogData.tags;

        if (args.response.entity === session.gettext(Strings.tags_confirmation_yes)) {
            if (!tags || tags.length === 0) {
                session.send("You did not enter any tags");
                session.endDialog();
                return;
            }

            let conversationIdToNotify = null;
            let isChannel = false;
            if (isMessageFromChannel(session.message)) {
                conversationIdToNotify = session.message.sourceEvent.channel.id;
                isChannel = true;
            } else {
                conversationIdToNotify = session.message.address.conversation.id;
                isChannel = false;
            }

            // casting to keep away typescript error
            let msgAddress = (session.message.address as builder.IChatConnectorAddress);
            let msgServiceUrl = msgAddress.serviceUrl;

            let locale = getLocaleFromEvent(session.message);

            // let tagStorage = await MongoDbTagStorage.createConnection();
            let tagStorage = (session.library as SOEBot).getTagStorage();
            // don't need to await because it is loaded to the session in middleware
            let channelData = ChannelData.get(session);
            if (!channelData.followedTags) {
                channelData.followedTags = [];
            }
            let messageText = "Tags Successfully Set up:<br>";
            for (let currTag of tags) {
                let tagEntry = await tagStorage.getTagAsync(currTag);

                let newNotificationEntry: NotificationEntry = {
                    conversationId: conversationIdToNotify,
                    serviceUrl: msgServiceUrl,
                    locale: locale,
                    isChannel: isChannel,
                };

                // check to make sure conversation.id is not already following the current tag
                let conversationIdAlreadyFollows = false;
                for (let currNotificationEntry of tagEntry.notificationEntries) {
                    if (newNotificationEntry.conversationId === currNotificationEntry.conversationId) {
                        conversationIdAlreadyFollows = true;
                        break;
                    }
                }

                if (!conversationIdAlreadyFollows) {
                    tagEntry.notificationEntries.push(newNotificationEntry);
                    await tagStorage.saveTagAsync(tagEntry);
                    channelData.followedTags.push(tagEntry._id);
                    messageText += "**" + currTag + "**<br>";
                } else {
                    messageText += "**" + currTag + "** - already been following<br>";
                }
            }

            // await tagStorage.close();
            await ChannelData.saveToStorage(session, (session.library as SOEBot).get("channelStorage"));

            session.send(messageText);
        } else {
            session.send("No tags setup");
        }
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.AddTagsDialogId,
            [
                DialogMatches.AddTagsDialogMatch, // match is /follow tags?(.*)/i
                DialogMatches.AddTagsDialogMatch2, // match is /add tags?(.*)/i,
            ],
            [
                AddTagsDialog.promptForTags,
                AddTagsDialog.getTags,
                AddTagsDialog.confirmTags,
            ],
        );
    }
}
