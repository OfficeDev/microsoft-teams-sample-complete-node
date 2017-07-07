import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../utils/TriggerActionDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import { Strings } from "../../locale/locale";

export class GetLastDialogUsedTrigDialog extends TriggerActionDialog {

    private static async returnLastDialogUsed(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let msg = session.gettext(Strings.current_dialog_template, session.conversationData.currentDialogName);
        session.send(msg);
        session.conversationData.currentDialogName = DialogIds.GetLastDialogUsedTrigDialogId;
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(
            bot,
            DialogIds.GetLastDialogUsedTrigDialogId,
            [
                DialogMatches.showLastDialogMatch,
                DialogMatches.showLastDialogMatch2,
            ],
            GetLastDialogUsedTrigDialog.returnLastDialogUsed,
        );
    }
}
