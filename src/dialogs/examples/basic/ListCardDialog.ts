import * as builderteams from "botbuilder-teams";
import * as builder from "botbuilder";
import * as config from "config";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";

export class ListCardDialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let card = new builderteams.ListCard(session)
                        .title(session.gettext(Strings.list_card_title))
                        // item1
                        .addItem(new builderteams.ListCardItem(session)
                            .icon(config.get("app.baseUri") + "/assets/computer_people.jpg")
                            .title(session.gettext(Strings.list_card_item1_title))
                            .subtitle(session.gettext(Strings.list_card_item1_subtitle)))
                        // item2
                        .addItem(new builderteams.ListCardItem(session)
                            .icon(config.get("app.baseUri") + "/assets/computer_person.jpg")
                            .title(session.gettext(Strings.list_card_item2_title))
                            .subtitle(session.gettext(Strings.list_card_item2_subtitle)));

        session.send(new builder.Message(session)
                        .addAttachment(card));
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
