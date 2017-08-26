import * as builder from "botbuilder";
import { TriggerActionDialog } from "../utils/TriggerActionDialog";
import { DialogIds } from "../utils/DialogIds";
import { DialogMatches } from "../utils/DialogMatches";

export class HelpDialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let text = "";
        text += "'follow tags [tagA, tagB, ...] - Used to start following tags in this conversation<br>";
        text += "'remove tags [tagA, tagB, ...] - Used to stop following tags in this conversation<br>";
        text += "'settings' - Used to view and setup the settings for this conversation<br>";

        session.send(text);

        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.HelpDialogId,
            DialogMatches.HelpDialogMatch, // match is regexCreator("help")
            HelpDialog.step1,
        );
    }
}
