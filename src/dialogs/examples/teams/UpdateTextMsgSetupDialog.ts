import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
import { ChannelData } from "../../../utils/ChannelData";

export class UpdateTextMsgSetupDialog extends TriggerActionDialog {

    private static async setupTextMessage(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.send(Strings.set_text_msg).sendBatch(async (err, addresses) => {
            if (!err) {
                // session.conversationData.lastTextMessage = addresses[0];
                let channelData = ChannelData.get(session);
                channelData.lastTextMessage = addresses[0];
                await ChannelData.saveToStorage(session, args.constructorArgs.bot.get("channelStorage"));

                // session.save().sendBatch();
            } else {
                session.error(err);
            }
            session.endDialog();
        });
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.UpdateTextMsgSetupDialogId,
            DialogMatches.UpdateTextMsgSetupDialogMatch,
            UpdateTextMsgSetupDialog.setupTextMessage,
        );
    }
}
