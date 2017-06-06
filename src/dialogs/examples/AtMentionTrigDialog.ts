import * as builder from "botbuilder";
import { TriggerDialog } from "../../utils/TriggerDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import { Strings } from "../../locale/locale";
import * as teams from "botbuilder-teams";

export class AtMentionTrigDialog extends TriggerDialog {

    private static async atMentionUser(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let atMention: builder.IIdentity = {
            // name to display for at-mention
            name: session.message.address.user.name,
            // user id of person to at-mention
            id: session.message.address.user.id,
        };

        let msg = new teams.TeamsMessage(session)
            .addMentionToText(atMention)
            .text(Strings.at_mention);

        session.send(msg);
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.AtMentionTrigDialogId,
            DialogMatches.atMentionMatch,
            AtMentionTrigDialog.atMentionUser,
        );
    }
}
