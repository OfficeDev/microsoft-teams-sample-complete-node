import * as builder from "botbuilder";
import { TriggerActionDialog } from "../utils/TriggerActionDialog";
import { DialogIds } from "../utils/DialogIds";
import { DialogMatches } from "../utils/DialogMatches";
import * as msTeams from "botbuilder-teams";
import { renderTags } from "../apis/SOEnterpriseAPI";
import { O365ConnectorCardSectionNew } from "../utils/O365ConnectorCardSectionNew";
import { Strings } from "../locale/locale";
import { startReplyChainInChannel } from "../utils/DialogUtils";
import { MongoDbSOEQuestionStorage, SOEQuestionEntry } from "../storage/MongoDbSOEQuestionStorage";
import { NotificationEntry } from "../storage/MongoDbTagStorage";
import { SOEBot } from "../SOEBot";

export class SendSOEQuestionNotificationDialog extends TriggerActionDialog {

    private static async sendQuestionNotification(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let q: any = args.questionToSend;
        let soeQuestionEntry: SOEQuestionEntry = args.soeQuestionEntry;
        // let soeQuestionStorage: MongoDbSOEQuestionStorage = args.soeQuestionStorage;
        let soeQuestionStorage: MongoDbSOEQuestionStorage = (args.constructorArgs.bot as SOEBot).getSOEQuestionStorage();
        let notificationEntry: NotificationEntry = args.notificationEntry;
        // let resolvePromiseCallback: () => void = args.resolvePromiseCallback;

        // something has gone wrong if any one of these does not exist
        // if (!q || !soeQuestionEntry || !soeQuestionStorage || !notificationEntry || !resolvePromiseCallback) {
        if (!q || !soeQuestionEntry || !soeQuestionStorage || !notificationEntry) {
            // send nothing
            // resolvePromiseCallback(); // this callback resolves one of the promises that the database connections in src/endpoints/RunNotificationJob.ts are waiting on to close
            session.endDialog();
            return;
        }

        let msg = new builder.Message(session)
            .textFormat(builder.TextFormat.markdown)
            .attachments([
                new msTeams.O365ConnectorCard(session)
                    .title(q.title)
                    .sections(
                        O365ConnectorCardSectionNew.create(session,
                            null, // section title
                            q.body, // section text
                            `[${q.owner.display_name}](${q.owner.link})`, // activityTitle
                            q.owner.profile_image, // activityImage
                            null, // activitySubtitle
                            null, // activityText
                            null, // images
                            [ "Tags", renderTags(q.tags), "Answered:", String(q.is_answered), "# answers:", String(q.answer_count) ], // facts
                            // tslint:disable-next-line:trailing-comma
                        )
                    )
                    .potentialAction([
                        new msTeams.O365ConnectorCardViewAction(session)
                            .name(Strings.view_so_question_label)
                            .target(q.link),
                    ]),
            ]);

        // check if notification is being sent to a channel
        if (!notificationEntry.isChannel) {
            // this is the case of notification being sent to a 1:1 chat

            session.send(msg).sendBatch(async (err, addresses) => {
                if (!err) {
                    // casting to keep away typescript error
                    let currAddress = (addresses[0] as builder.IChatConnectorAddress);
                    soeQuestionEntry.updateEntries.push({
                        messageId: currAddress.id,
                        conversationId: currAddress.conversation.id,
                        serviceUrl: currAddress.serviceUrl,
                        locale: notificationEntry.locale,
                        isChannel: false,
                        notificationEntryConversationId: notificationEntry.conversationId,
                    });
                    await soeQuestionStorage.saveSOEQuestionAsync(soeQuestionEntry);
                } else {
                    session.error(err);
                }

                // resolvePromiseCallback(); // this callback resolves one of the promises that the database connections in src/endpoints/RunNotificationJob.ts are waiting on to close
                session.endDialog();
            });
        } else {
            // this is the case of notification being sent to a channel
            let replyChainAddress = await startReplyChainInChannel((session.connector as any), msg, notificationEntry.conversationId);

            soeQuestionEntry.updateEntries.push({
                messageId: replyChainAddress.id,
                conversationId: replyChainAddress.conversation.id,
                serviceUrl: replyChainAddress.serviceUrl,
                locale: notificationEntry.locale,
                isChannel: true,
                notificationEntryConversationId: notificationEntry.conversationId,
            });
            await soeQuestionStorage.saveSOEQuestionAsync(soeQuestionEntry);

            // resolvePromiseCallback(); // this callback resolves one of the promises that the database connections in src/endpoints/RunNotificationJob.ts are waiting on to close
        }

        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.SendSOEQuestionNotificationDialogId,
            DialogMatches.Send_SOE_Question_Notification_Dialog_Intent, // intent so it is not triggered by a user
            SendSOEQuestionNotificationDialog.sendQuestionNotification,
        );
    }
}
