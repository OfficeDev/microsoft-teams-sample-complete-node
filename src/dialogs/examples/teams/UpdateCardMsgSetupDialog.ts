import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";

export class UpdateCardMsgSetupDialog extends TriggerActionDialog {

    private static async setupCardMessage(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let tempCard = new builder.HeroCard(session).title(Strings.loading);
        let msg = new builder.Message(session).addAttachment(tempCard);

        session.send(msg).sendBatch((err, addresses) => {
            if (!err) {
                session.conversationData.updateCardCounter = 0;
                session.save().sendBatch();
                session.beginDialog(DialogIds.UpdateCardMsgDialogId, { address: addresses[0] });
            } else {
                session.error(err);
                session.endDialog();
            }
        });
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.UpdateCardMsgSetupDialogId,
            DialogMatches.UpdateCardMsgSetupDialogMatch,
            UpdateCardMsgSetupDialog.setupCardMessage,
        );
    }
}
