import * as builder from "botbuilder";
import * as config from "config";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { ListCard, ListCardItem, ListCardItemType } from "../basic/ListCard";
import { Strings } from "../../../locale/locale";

export class ListCardDialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let list = Array<ListCardItem>();

        // list item1
        let item1 = new ListCardItem();
        item1.type = ListCardItemType.ResultItem;
        item1.icon = config.get("app.baseUri") + "/assets/computer_people.jpg";
        item1.title = session.gettext(Strings.list_card_item1_title);
        item1.subtitle = session.gettext(Strings.list_card_item1_subtitle);

        // list item2
        let item2 = new ListCardItem();
        item2.type = ListCardItemType.ResultItem;
        item2.icon = config.get("app.baseUri") + "/assets/computer_person.jpg";
        item2.title = session.gettext(Strings.list_card_item2_title);
        item2.subtitle = session.gettext(Strings.list_card_item1_subtitle);

        // we have added only two items for this sample, list card support multiple items as needed
        list.push(item1);
        list.push(item2);

        let card = new ListCard();
        card.title = session.gettext(Strings.list_card_title);
        card.items = list;

        let message = new builder.Message(session);
        message.addAttachment(card.ToAttachment());
        session.send(message);
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.ListCardDialogId,
            DialogMatches.ListCardDialogMatch,
            ListCardDialog.step1,
        );
    }
}
