import * as builder from "botbuilder";
import { TriggerActionDialog } from "../utils/TriggerActionDialog";
import { DialogIds } from "../utils/DialogIds";
import { DialogMatches } from "../utils/DialogMatches";
import { Strings } from "../locale/locale";
import { isMessageFromChannel, getLocaleFromEvent } from "../utils/DialogUtils";
import { MongoDbTagStorage, ConversationEntry } from "../storage/MongoDbTagStorage";

export class EnterTagsDialog extends TriggerActionDialog {

    private static async promptForTags(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let tagInputString = args.intent.matched[1].trim();
        if (tagInputString) {
            next({ response: tagInputString });
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

        let unfilteredTags = tagInputString.split(/,\s*|;\s*|s+/);

        // need to filter to get rid of any duplicates
        let tags = new Array<string>();
        for (let currUnfilteredTag of unfilteredTags) {
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
            if (isMessageFromChannel(session.message)) {
                conversationIdToNotify = session.message.sourceEvent.channel.id;
            } else {
                conversationIdToNotify = session.message.address.conversation.id;
            }

            // casting to keep away typescript error
            let msgAddress = (session.message.address as builder.IChatConnectorAddress);
            let msgServiceUrl = msgAddress.serviceUrl;

            let locale = getLocaleFromEvent(session.message);

            let tagStorage = await MongoDbTagStorage.createConnection();
            let messageText = "Tags Successfully Set up:<br>";
            for (let currTag of tags) {
                let tagEntry = await tagStorage.getTagAsync(currTag);

                let newConversationEntry: ConversationEntry = {
                    conversationId: conversationIdToNotify,
                    serviceUrl: msgServiceUrl,
                    locale: locale,
                };

                // check to make sure conversation.id is not already following the current tag
                let conversationIdAlreadyFollows = false;
                for (let currConversationEntry of tagEntry.conversationEntries) {
                    if (newConversationEntry.conversationId === currConversationEntry.conversationId) {
                        conversationIdAlreadyFollows = true;
                        break;
                    }
                }

                if (!conversationIdAlreadyFollows) {
                    tagEntry.conversationEntries.push(newConversationEntry);
                    await tagStorage.saveTagAsync(tagEntry);
                    messageText += "**" + currTag + "**<br>";
                } else {
                    messageText += "**" + currTag + "** - already been following<br>";
                }
            }

            await tagStorage.close();

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
            DialogIds.EnterTagsDialogId,
            DialogMatches.EnterTagsDialogMatch, // match is /setup tags(.*)/i
            [
                EnterTagsDialog.promptForTags,
                EnterTagsDialog.getTags,
                EnterTagsDialog.confirmTags,
            ],
        );
    }
}
