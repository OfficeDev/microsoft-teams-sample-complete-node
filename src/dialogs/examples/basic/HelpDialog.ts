import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
import * as config from "config";

export class HelpDialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let buttons = new Array<builder.CardAction>();
        let botId = "28:" + config.get("bot.botId");
        let entityId = "1on1test123";
        // hardCodedUrl has url encoded {"subEntityId":"allCommands"} set as the context
        let hardCodedUrl = "https://teams.microsoft.com/l/entity/" + botId + "/" + entityId + "?conversationType=chat&context=%7B%22subEntityId%22%3A%22allCommands%22%7D";
        buttons.push(builder.CardAction.openUrl(session, hardCodedUrl, Strings.all_commands_button));

        let newCard = new builder.HeroCard(session)
            .text(Strings.help_msg)
            .buttons(buttons);

        session.send(new builder.Message(session)
            .addAttachment(newCard));

        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.HelpDialogId,
            DialogMatches.HelpDialogMatch,
            HelpDialog.step1,
        );
    }
}
