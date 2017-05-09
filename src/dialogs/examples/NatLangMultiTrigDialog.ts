import * as builder from "botbuilder";
import { MultiTriggerDialog } from "../../utils/MultiTriggerDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import { Strings } from "../../locale/locale";

export class NatLangMultiTrigDialog extends MultiTriggerDialog {

    private static async setAlarmIntent(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.send(Strings.set_alarm_msg);
        session.endDialog();
    }

    private static async deleteAlarmIntent(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.send(Strings.delete_alarm_msg);
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.NatLangMultiTrigDialogId, [
                {
                    match: DialogMatches.set_alarm_intent,
                    action: NatLangMultiTrigDialog.setAlarmIntent,
                },
                {
                    match: DialogMatches.delete_alarm_intent,
                    action: NatLangMultiTrigDialog.deleteAlarmIntent,
                },
        ]);
    }
}
