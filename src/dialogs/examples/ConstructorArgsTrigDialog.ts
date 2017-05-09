import * as builder from "botbuilder";
import { TriggerDialog } from "../../utils/TriggerDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import { Strings } from "../../locale/locale";

export class ConstructorArgsTrigDialog extends TriggerDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.send(session.gettext(Strings.constructor_args_template, args.constructorArgs));
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
        constructorArgs: any,
    ) {
        super(bot,
            DialogIds.ConstructorArgsTrigDialogId,
            DialogMatches.constructorArgsMatch,
            ConstructorArgsTrigDialog.step1,
            constructorArgs,
        );
    }
}
