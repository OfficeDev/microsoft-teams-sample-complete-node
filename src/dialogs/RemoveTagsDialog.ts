import * as builder from "botbuilder";
import { TriggerActionDialog } from "../utils/TriggerActionDialog";
import { DialogIds } from "../utils/DialogIds";
import { DialogMatches } from "../utils/DialogMatches";
import { Strings } from "../locale/locale";
import { isMessageFromChannel } from "../utils/DialogUtils";
// import { MongoDbTagStorage } from "../storage/MongoDbTagStorage";
import { ChannelData } from "../utils/ChannelData";
import { SOEBot } from "../SOEBot";

export class RemoveTagsDialog extends TriggerActionDialog {

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
            builder.Prompts.text(session, "Enter tags to remove");
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
        let messageText = "You are about to STOP FOLLOWING tags:<br>";
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

            let conversationIdToRemove = null;
            if (isMessageFromChannel(session.message)) {
                conversationIdToRemove = session.message.sourceEvent.channel.id;
            } else {
                conversationIdToRemove = session.message.address.conversation.id;
            }

            // let tagStorage = await MongoDbTagStorage.createConnection();
            let tagStorage = (session.library as SOEBot).getTagStorage();
            // don't need to await because it is loaded to the session in middleware
            let channelData = ChannelData.get(session);
            if (!channelData.followedTags) {
                channelData.followedTags = [];
            }
            let messageText = "Tags Successfully Removed:<br>";
            for (let currTag of tags) {
                let tagEntry = await tagStorage.getTagAsync(currTag);

                // check to make sure conversation.id is not already following the current tag
                // let conversationIdAlreadyFollows = false;
                let indexOfNotificationEntryToRemove = -1;
                for (let i = 0; i < tagEntry.notificationEntries.length; i++) {
                    let currNotificationEntry = tagEntry.notificationEntries[i];
                    if (conversationIdToRemove === currNotificationEntry.conversationId) {
                        indexOfNotificationEntryToRemove = i;
                        break;
                    }
                }

                // if > -1 then match was found
                let notificationEntryRemoved = false;
                if (indexOfNotificationEntryToRemove > -1) {
                    // remove the desired entry
                    tagEntry.notificationEntries.splice(indexOfNotificationEntryToRemove, 1);
                    notificationEntryRemoved = true;
                }

                if (notificationEntryRemoved) {
                    await tagStorage.saveTagAsync(tagEntry);
                    // find index of currTag in channelData.tags and remove
                    let indexOfTagChannelData = channelData.followedTags.indexOf(tagEntry._id);
                    if (indexOfTagChannelData > -1) {
                        // this is the case that we found an entry
                        channelData.followedTags.splice(indexOfTagChannelData, 1);
                    }
                    messageText += "**" + currTag + "**<br>";
                } else {
                    messageText += "**" + currTag + "** - not removed - was not following<br>";
                }
            }

            // await tagStorage.close();
            await ChannelData.saveToStorage(session, (session.library as SOEBot).get("channelStorage"));

            session.send(messageText);
        } else {
            session.send("No tags removed");
        }
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.RemoveTagsDialogId,
            [
                DialogMatches.RemoveTagsDialogMatch, // match is /unfollow tags?(.*)/i
                DialogMatches.RemoveTagsDialogMatch2, // match is /remove tags?(.*)/i
            ],
            [
                RemoveTagsDialog.promptForTags,
                RemoveTagsDialog.getTags,
                RemoveTagsDialog.confirmTags,
            ],
        );
    }
}
