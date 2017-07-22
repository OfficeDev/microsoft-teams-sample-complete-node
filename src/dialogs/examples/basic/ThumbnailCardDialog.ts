import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
import * as config from "config";

export class ThumbnailCardDialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let cards = new Array<builder.ThumbnailCard>();
        let numbCards = 3;

        for (let i = 0; i < numbCards; i++) {
            let buttons = new Array<builder.CardAction>();
            /**
             * This is an example of a button using invoke to begin a new dialog
             * the response field is used as a way to pass data to the newly begun dialog
             * the response field is not needed
             */
            buttons.push(new builder.CardAction(session)
                .type("invoke")
                .title(Strings.invoke_button_hello_dialog)
                .value("{" +
                    "\"dialog\": \"" + DialogIds.HelloDialogId + "\", " +
                    "\"response\": \"Information for called intent\"" +
                "}"),
            );

            buttons.push(builder.CardAction.imBack(session, session.gettext(Strings.hello_imback), Strings.imback_button_hello_dialog));

            let newCard = new builder.ThumbnailCard(session)
                .title(Strings.default_title)
                .subtitle(Strings.default_subtitle)
                .text(Strings.default_text)
                .images([
                    new builder.CardImage(session)
                        .url(config.get("app.baseUri") + "/assets/computer_person.jpg")
                        .alt(session.gettext(Strings.img_default)),
                ])
                .buttons(buttons)
                .tap(builder.CardAction.imBack(session, session.gettext(Strings.hello_imback)));

            cards.push(newCard);
        }

        session.send(new builder.Message(session)
            // .attachmentLayout("list")
            .attachmentLayout("carousel")
            .attachments(cards));

        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.ThumbnailCardDialogId,
            DialogMatches.ThumbnailCardDialogMatch,
            ThumbnailCardDialog.step1,
        );
    }
}
