import * as builder from "botbuilder";
import { TriggerActionDialog } from "../utils/TriggerActionDialog";
import { DialogIds } from "../utils/DialogIds";
import { DialogMatches } from "../utils/DialogMatches";
// import { Strings } from "../locale/locale";

export class SendSimpleTagNotificationDialog extends TriggerActionDialog {

    private static async sendQuestionNotification(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let tagName: string = args.tagName;

        // this is the case where the tag notification testing endpoint was used to begin this dialog - args.tagName should have been added
        if (tagName) {
            session.send("Hi! I just notified you because of tag " + args.tagName);
        } else {
            // something went wrong - send nothing and end dialog
        }

        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.SendSimpleTagNotificationDialogId,
            DialogMatches.Send_Simple_Tag_Notification_Dialog_Intent, // intent so it is not triggered by a user
            SendSimpleTagNotificationDialog.sendQuestionNotification,
        );
    }
}
