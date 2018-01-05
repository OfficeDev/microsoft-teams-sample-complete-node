import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import * as config from "config";

export class PopupSignInDialog extends TriggerActionDialog {

    private static async PopUpSignIn(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let cards = new Array<builder.HeroCard>();

        let buttons = new Array<builder.CardAction>();
            /**
             *  This is PopUp SignIn Dialog Class.
             *  main purpose of this class is to Display the PopUp SignIn Card
             */

            // let input = "";
            // if (args.response) {
            //     input = args.response;
            // }

        let popUpUrl = config.get("app.baseUri") + "/botViews/popUpSignin.html";

        buttons.push(new builder.CardAction(session)
            .type("signin")
            .title("Sign In")
            .value(popUpUrl),
        );

        let newCard = new builder.HeroCard(session)
            .title("Please click below for Popup Sign-In experience")
            .buttons(buttons);

        cards.push(newCard);

        session.send(new builder.Message(session)
            .attachments(cards));
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.PopupSignInDialogId,
            DialogMatches.PopUpSignInDialogMatch,
            PopupSignInDialog.PopUpSignIn,
        );
    }
}
