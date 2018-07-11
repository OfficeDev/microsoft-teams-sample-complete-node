import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
import * as teams from "botbuilder-teams";

export class NotifyDialog extends TriggerActionDialog {
    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        if (session.message.source === "msteams")
        {
            // Actvity notications will only work in 1 to 1 chat
            if (session.message.sourceEvent.channel == null)
            {
                let msg = new teams.TeamsMessage(session).text(Strings.notify_msg);
                let alertFlag = teams.TeamsMessage.AlertFlag();
                let notification = (msg as teams.TeamsMessage).sourceEvent({
                "msteams" : alertFlag,
                });
                session.send(notification);
                session.endDialog();
            }
            else
            {
                // it won't work in channel
                session.send(Strings.notifyemulator_msg);
                session.endDialog();
            }
        }
        else if (session.message.source === "emulator")
        {
            session.send(Strings.notifyemulator_msg);
            session.endDialog();
        }
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.NotifyDialogId,
            DialogMatches.NotifyDialogMatch,
            NotifyDialog.step1,
        );
    }
}
