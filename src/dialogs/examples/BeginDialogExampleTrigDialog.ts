import * as builder from "botbuilder";
import { TriggerDialog } from "../../utils/TriggerDialog";
import { DialogMatches } from "../../utils/DialogMatches";
import { DialogIds } from "../../utils/DialogUtils";
import { Strings } from "../../locale/locale";

export class BeginDialogExampleTrigDialog extends TriggerDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.send(Strings.step_1);
        next();
    }

    private static async step2(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.send(Strings.step_2);
        session.beginDialog(DialogIds.TestTrigDialogId);

        // IMPORTANT: within a waterfall step make sure you do not call anything after next(), beginDialog(), builder.Prompts, or any other built in function
        // that will start a new dialog
    }

    private static async step3(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.send(Strings.step_3);
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.BeginDialogExampleTrigDialogId,
            DialogMatches.beginDialogMatch,
            [
                BeginDialogExampleTrigDialog.step1,
                BeginDialogExampleTrigDialog.step2,
                BeginDialogExampleTrigDialog.step3,
            ],
        );
    }
}
