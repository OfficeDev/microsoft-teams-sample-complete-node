import * as builder from "botbuilder";
import { TriggerActionDialog } from "../utils/TriggerActionDialog";
import { DialogIds } from "../utils/DialogIds";
import { DialogMatches } from "../utils/DialogMatches";
import { Strings } from "../locale/locale";
import { isMessageFromChannel, getLocaleFromEvent } from "../utils/DialogUtils";
import { MongoDbTagStorage, ConversationEntry } from "../storage/MongoDbTagStorage";

export class PromptForTagsDialog extends TriggerActionDialog {

    private static async promptForTags(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let tagInput = args.intent.matched[1].trim();
        if (tagInput) {
            next({ response: tagInput });
        } else {
            builder.Prompts.text(session, "Enter tags - (Only enter one for now)");
        }
    }

    private static async getTags(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let tags = args.response.trim().toLowerCase(); // need to setup ability to enter more than one
        session.dialogData.tags = tags;
        let buttonText = session.gettext(Strings.tags_confirmation_yes) + "|" + session.gettext(Strings.tags_confirmation_no);
        builder.Prompts.choice(session, "You are about to setup tag " + tags, buttonText, { listStyle: builder.ListStyle["button"] });
    }

    private static async confirmTags(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let tags = session.dialogData.tags;

        if (args.response.entity === session.gettext(Strings.tags_confirmation_yes)) {
            if (!tags) {
                session.send("There are no tags...");
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

            let tagStorage = await MongoDbTagStorage.createConnection();
            // should check if args.tags exist - also need to handle list
            let tagEntry = await tagStorage.getTagAsync(tags);

            // need to check if tagEntry.conversationEntries already has current conversation.id
            let newConversationEntry: ConversationEntry = {
                conversationId: conversationIdToNotify,
                serviceUrl: msgServiceUrl,
                locale: getLocaleFromEvent(session.message),
            };

            tagEntry.conversationEntries.push(newConversationEntry);
            await tagStorage.saveTagAsync(tagEntry);
            await tagStorage.close();

            session.send("Tags (one for now) Successfully Set up: " + tags);
        } else {
            session.send("No tags setup - " + tags + " failed to be set");
        }
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.PromptForTagsDialogId,
            DialogMatches.PromptForTagsDialogMatch, // match is /setup tags(.*)/i
            [
                PromptForTagsDialog.promptForTags,
                PromptForTagsDialog.getTags,
                PromptForTagsDialog.confirmTags,
            ],
        );
    }
}
