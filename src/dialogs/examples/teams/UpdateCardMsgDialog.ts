import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
let config = require("config");

export class UpdateCardMsgDialog extends TriggerActionDialog {

    private static async updateCardMessage(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        if (session.conversationData.updateCardCounter !== null) {
            session.conversationData.updateCardCounter = session.conversationData.updateCardCounter + 1;
        }

        if (args.address) {
            let buttons = new Array<builder.CardAction>();

            buttons.push(new builder.CardAction(session)
                .type("invoke")
                .title(Strings.update_card_button, session.conversationData.updateCardCounter)
                .value("{" +
                    "\"dialog\": \"" + DialogIds.UpdateCardMsgDialogId + "\", " +
                    "\"address\": " + JSON.stringify(args.address) + "" +
                "}"),
            );

            let newCard = new builder.HeroCard(session)
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
                .address(args.address)
                .addAttachment(newCard);

            session.connector.update(msg.toMessage(), (err, address) => {
                if (!err) {
                    // do not need to save the incoming address because Teams does not change it
                    session.send(Strings.updated_msg_confirmation);
                } else {
                    session.error(err);
                }
                session.endDialog();
            });
        } else {
            session.send(Strings.no_msg_to_update);
            session.endDialog();
        }
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.UpdateCardMsgDialogId,
            DialogMatches.Update_Card_Msg_Dialog_Intent,
            UpdateCardMsgDialog.updateCardMessage,
        );
    }
}
