import * as builder from "botbuilder";
import { TriggerDialog } from "../../utils/TriggerDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import { Strings } from "../../locale/locale";

export class ResetBotStateTrigDialog extends TriggerDialog {

    private static async resetState(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        delete session.userData.vsts_access_token;
        delete session.userData.vsts_refresh_token;

        session.clearDialogStack();

        session.send(Strings.reset_complete);
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.ResetBotStateTrigDialogId,
            DialogMatches.resetBotStateMatch,
            ResetBotStateTrigDialog.resetState,
        );
    }
}
