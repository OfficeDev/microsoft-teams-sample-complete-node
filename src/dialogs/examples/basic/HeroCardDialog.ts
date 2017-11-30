import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
import * as config from "config";

export class HeroCardDialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let cards = new Array<builder.HeroCard>();
        let numCards = 1;

        for (let i = 0; i < numCards; i++) {
            let buttons = new Array<builder.CardAction>();
            buttons.push(new builder.CardAction(session)
                .type("signin")
                .title("Sign In")
                .value(config.get("app.baseUri") + "/bot-auth/simple-start?width=5000&height=5000"),
            );

            let messageBackButton = builder.CardAction.messageBack(session, JSON.stringify({ action: "getProfile" }), "Get Profile")
                .displayText("Get Profile")
                .text(Strings.messageBack_button_text); // this matches match for MessageBackReceiverDialog
            buttons.push(messageBackButton);

            let messageBackButton2 = builder.CardAction.messageBack(session, JSON.stringify({ action: "signout" }), "Sign Out")
            .displayText("Sign Out")
            .text(Strings.messageBack_button_text); // this matches match for MessageBackReceiverDialog
            buttons.push(messageBackButton2);

            let newCard = new builder.HeroCard(session)
                .title("Authentication sample")
                .buttons(buttons)
                .tap(builder.CardAction.imBack(session, session.gettext(Strings.hello_imback)));

            cards.push(newCard);
        }

        session.send(new builder.Message(session)
            .attachmentLayout("carousel")
            .attachments(cards));

        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.HeroCardDialogId,
            DialogMatches.HeroCardDialogMatch,
            HeroCardDialog.step1,
        );
    }
}
