import * as builder from "botbuilder";
import { TriggerActionDialog } from "../utils/TriggerActionDialog";
import { DialogIds } from "../utils/DialogIds";
import { DialogMatches } from "../utils/DialogMatches";
// import { Strings } from "../locale/locale";
import { ChannelData } from "../utils/ChannelData";

export class ChannelDataDialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let channelData = ChannelData.get(session);
        if (!channelData.testNumb) {
            channelData.testNumb = 0;
        }
        channelData.testNumb++;

        if (!session.conversationData.testNumb) {
            session.conversationData.testNumb = 0;
        }
        session.conversationData.testNumb++;

        session.send("Channel testNumb: " + channelData.testNumb);
        session.send("Conversation testNumb: " + session.conversationData.testNumb);

        await ChannelData.saveToStorage(session, args.constructorArgs.bot.get("channelStorage"));

        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.ChannelDataDialogId,
            DialogMatches.ChannelDataDialogMatch, // /channel data/i,
            ChannelDataDialog.step1,
        );
    }
}
