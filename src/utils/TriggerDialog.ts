import * as builder from "botbuilder";
import { BaseTriggerDialog } from "./BaseTriggerDialog";

export abstract class TriggerDialog extends BaseTriggerDialog {

    constructor(
        protected bot: builder.UniversalBot,
        protected dialogId: string,
        protected match: RegExp | RegExp[] | string | string[],
        protected action: builder.IDialogWaterfallStep | builder.IDialogWaterfallStep[],
        protected constructorArgs?: any,
    ) {
        super(dialogId);

        this.addDialogWithTriggerActionToBot(bot, this.getDialogId(), match, action, constructorArgs);
    }
}
