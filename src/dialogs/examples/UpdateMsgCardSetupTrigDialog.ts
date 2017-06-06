import * as builder from "botbuilder";
import { TriggerDialog } from "../../utils/TriggerDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import { Strings } from "../../locale/locale";

export class UpdateMsgCardSetupTrigDialog extends TriggerDialog {

    private static async setupCardMessage(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let tempCard = new builder.HeroCard(session).title(Strings.loading);
        let msg = new builder.Message(session).addAttachment(tempCard);

        session.send(msg).sendBatch((err, addresses) => {
            if (!err) {
                session.conversationData.updateCardCounter = 0;
                session.save().sendBatch();
                session.beginDialog(DialogIds.UpdateMsgCardUpdateTrigDialogId, { address: addresses[0] });
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
            DialogIds.UpdateMsgCardSetupTrigDialogId,
            DialogMatches.setupCardUpdateMsgMatch,
            UpdateMsgCardSetupTrigDialog.setupCardMessage,
        );
    }
}
