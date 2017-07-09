import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../utils/TriggerActionDialog";
import { DialogIds } from "../../utils/DialogIds";
import { DialogMatches } from "../../utils/DialogMatches";
import { VSTSTokenOAuth2API } from "../../apis/VSTSTokenOAuth2API";
import { Strings } from "../../locale/locale";
let config = require("config");

export class AuthorizeAppTrigDialog extends TriggerActionDialog {

    private static async sendAuthorizeMsg(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let url = VSTSTokenOAuth2API.getUserAuthorizationURL(session);

        let buttons = [];

        buttons.push(builder.CardAction.openUrl(session, url, Strings.sign_in));

        let newCard = new builder.HeroCard(session)
            .title(Strings.default_title)
            .subtitle(Strings.default_subtitle)
            .text(Strings.default_text)
            .images([
                new builder.CardImage(session)
                    .url(config.get("app.baseUri") + "/assets/computer_person.jpg")
                    .alt(Strings.img_default),
            ])
            .buttons(buttons);

        // Just for development to see what the session.message.address values are
        // session.send(encodeURIComponent(JSON.stringify(session.message.address)));

        session.endDialog(new builder.Message(session).addAttachment(newCard));
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.AuthorizeAppTrigDialogId,
            DialogMatches.authorizeAppMatch,
            AuthorizeAppTrigDialog.sendAuthorizeMsg,
        );
    }
}
