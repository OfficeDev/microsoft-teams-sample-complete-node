import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
let config = require("config");

export class UpdateCardMsgSetupDialog extends TriggerActionDialog {
    // setup the card message and then user can update the card using below update dialog file
    // microsoft-teams-sample-complete-node\src\dialogs\examples\teams\UpdateCardMsgDialog.ts
    private static async setupCardMessage(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let buttons = new Array<builder.CardAction>();
        let updateCardCounter = 0;

        let messageBackButtonValue = JSON.stringify({ updateCounterKey: ++updateCardCounter });
        let messageBackButton = builder.CardAction.messageBack(session, messageBackButtonValue)
            .displayText(Strings.messageBack_button_display_text)
            .title(Strings.update_card_button, updateCardCounter)
            .text("update card message");

        buttons.push(messageBackButton);

        let card = new builder.HeroCard(session)
        .title(Strings.default_title)
        .subtitle(Strings.default_subtitle)
        .text(Strings.default_text)
        .images([
            new builder.CardImage(session)
                .url(config.get("app.baseUri") + "/assets/computer_person.jpg")
                .alt(session.gettext(Strings.img_default)),
        ])
        .buttons(buttons);

        let msg = new builder.Message(session)
        .addAttachment(card);

        session.send(msg);
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.UpdateCardMsgSetupDialogId,
            DialogMatches.UpdateCardMsgSetupDialogMatch,
            UpdateCardMsgSetupDialog.setupCardMessage,
        );
    }
}
