import * as builder from "botbuilder";
import { TriggerDialog } from "../../utils/TriggerDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import { Strings } from "../../locale/locale";

export class UpdateMsgTextSetupTrigDialog extends TriggerDialog {

    private static async setupTextMessage(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.send(Strings.set_text_msg).sendBatch((err, addresses) => {
            session.conversationData.lastTextMessage = addresses[0];
            session.save().sendBatch();
        });
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.UpdateMsgTextSetupTrigDialogId,
            DialogMatches.setupTextUpdateMsgMatch,
            UpdateMsgTextSetupTrigDialog.setupTextMessage,
        );
    }
}
