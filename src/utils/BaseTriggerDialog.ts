import * as builder from "botbuilder";
import { BaseDialog } from "./BaseDialog";
import { DialogIds } from "./DialogUtils";

export abstract class BaseTriggerDialog extends BaseDialog {

    // private static needNextCalled(session: builder.Session): boolean {
    //     let needNextCalledResult = session.dialogData
    //         && session.dialogData["BotBuilder.Data.WaterfallStep"] !== undefined
    //         && session.dialogData["BotBuilder.Data.WaterfallStep"] !== null;
    //     return needNextCalledResult;
    // }

    constructor (
        protected dialogId: string,
    ) {
        super(dialogId);
    }

    protected addDialogWithTriggerActionToBot(
        bot: builder.UniversalBot,
        dialogId: string,
        match: RegExp | RegExp[] | string | string[],
        action: builder.IDialogWaterfallStep | builder.IDialogWaterfallStep[],
        constructorArgs?: any): void {
            let newActionList = new Array<builder.IDialogWaterfallStep>();
            newActionList.push((session, args, next) => { this.setDialogIdAsCurrent(session, args, next); });
            if (constructorArgs) {
                newActionList.push((session, args, next) => {
                    args.constructorArgs = constructorArgs;
                    next(args);
                });
            }
            if (Array.isArray(action)) {
                newActionList = newActionList.concat((action as builder.IDialogWaterfallStep[]));
                // let currActionList = (action as builder.IDialogWaterfallStep[]);
                // for (let i = 0; i < currActionList.length; i++) {
                //     newActionList.push((session, args, next) => {
                //         currActionList[i](session, args, next);
                //         if (BaseTriggerDialog.needNextCalled(session)) {
                //             next(args);
                //         }
                //     });
                // }
            } else {
                newActionList.push((action as builder.IDialogWaterfallStep));
                // let currAction = (action as builder.IDialogWaterfallStep);
                // newActionList.push((session, args, next) => {
                //     currAction(session, args, next);
                //     if (BaseTriggerDialog.needNextCalled(session)) {
                //         next(args);
                //     }
                // });
            }
            newActionList.push((session, args, next) => { session.endDialogWithResult(args); });

            bot.dialog(dialogId, newActionList)
                .triggerAction({
                    matches: match,
                });
                // .cancelAction("default_cancel",
                //     Strings.base_dialog_on_cancel,
                //     {
                //         matches: /.*/i,
                // });
                // .endConversationAction("cancel",
                //     "I'm done here - end conversation.",
                //     {
                //         matches: /.*/i,
                // });
    }

    private async setDialogIdAsCurrent(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        if (this.getDialogId() !== DialogIds.GetLastDialogUsedTrigDialogId) {
            session.conversationData.currentDialogName = this.getDialogId();
        }
        next(args);
    }
}
