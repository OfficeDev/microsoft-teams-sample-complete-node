import * as builder from "botbuilder";
import { BaseTriggerDialog } from "./BaseTriggerDialog";
import { MatchActionPair } from "./DialogUtils";

export abstract class MultiTriggerDialog extends BaseTriggerDialog {

    constructor(
        protected bot: builder.UniversalBot,
        protected dialogId: string,
        protected matchActionPairList: MatchActionPair[],
        protected constructorArgs?: any,
    ) {
        super(dialogId);

        if (matchActionPairList) {
            for (let i = 0; i < matchActionPairList.length; i++) {
                let currMatchActionPair = matchActionPairList[i];
                this.addDialogWithTriggerActionToBot(bot,
                    this.getDialogId() + i,
                    currMatchActionPair.match,
                    currMatchActionPair.action,
                    constructorArgs);
            }
        }
    }
}
