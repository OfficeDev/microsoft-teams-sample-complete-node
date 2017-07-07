import * as builder from "botbuilder";
import { BaseTriggerActionDialog } from "./BaseTriggerActionDialog";
import { MatchActionPair } from "./DialogUtils";

export abstract class MultiTriggerActionDialog extends BaseTriggerActionDialog {

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
