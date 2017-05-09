import * as builder from "botbuilder";
import { TriggerDialog } from "../../utils/TriggerDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import { Strings } from "../../locale/locale";

export class QuizTrigDialog extends TriggerDialog {

    private static async send(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.beginDialog(DialogIds.QuizQ1TrigDialogId, {});
    }

    private static async send2(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.beginDialog(DialogIds.QuizQ2TrigDialogId, {});
    }

    private static async send3(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.beginDialog(DialogIds.QuizQ3TrigDialogId, {});
    }

    private static async send4(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.send(Strings.quiz_completed);
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.QuizTrigDialogId,
            DialogMatches.startQuizMatch,
            [
                QuizTrigDialog.send,
                QuizTrigDialog.send2,
                QuizTrigDialog.send3,
                QuizTrigDialog.send4,
            ],
        );
    }
}
