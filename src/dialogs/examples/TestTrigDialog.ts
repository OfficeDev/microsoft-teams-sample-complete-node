import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../utils/TriggerActionDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import { Strings } from "../../locale/locale";

export class TestTrigDialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.send(Strings.test_trig_dialog_msg);
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.TestTrigDialogId,
            DialogMatches.testTrigMatch,
            TestTrigDialog.step1,
        );
    }
}
