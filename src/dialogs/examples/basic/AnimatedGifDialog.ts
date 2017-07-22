import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
import * as config from "config";

export class AnimatedGifDialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let cards = new Array<builder.HeroCard>();

        let blueWaveCard = new builder.HeroCard(session)
            .images([
                new builder.CardImage(session)
                    .url(config.get("app.baseUri") + "/assets/wave_blue.gif")
                    .alt(session.gettext(Strings.img_default)),
            ]);
        cards.push(blueWaveCard);

        let greenWaveCard = new builder.HeroCard(session)
            .images([
                new builder.CardImage(session)
                    .url(config.get("app.baseUri") + "/assets/wave_green.gif")
                    .alt(session.gettext(Strings.img_default)),
            ]);
        cards.push(greenWaveCard);

        session.send(new builder.Message(session)
            .attachmentLayout("list")
            // .attachmentLayout("carousel")
            .attachments(cards));

        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.AnimatedGifDialogId,
            DialogMatches.AnimatedGifDialogMatch,
            AnimatedGifDialog.step1,
        );
    }
}
