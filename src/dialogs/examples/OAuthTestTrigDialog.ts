import * as builder from "botbuilder";
import { TriggerDialog } from "../../utils/TriggerDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import { Strings } from "../../locale/locale";
import { VSTSAPI } from "../../apis/VSTSAPI";

export class OAuthTestTrigDialog extends TriggerDialog {

    private static async promptForWorkItemId(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        builder.Prompts.text(session, Strings.prompt_for_work_item_id);
    }

    private static async showWorkItem(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let desiredWorkItemId = args.response;
        let vstsAPI = new VSTSAPI();
        let body = await vstsAPI.getWorkItem(desiredWorkItemId, session);

        session.send(session.gettext(Strings.title_of_work_item_template, body.value[0].fields["System.Title"]));
        session.send(session.gettext(Strings.get_html_info_for_work_item_template, body.value[0].url));

        let urlEncodedProject = encodeURIComponent(body.value[0].fields["System.TeamProject"]);
        let hardCodedUrl = "https://teamsbot.visualstudio.com/" + urlEncodedProject + "/_workitems?id=" + desiredWorkItemId + "&_a=edit";
        session.send(session.gettext(Strings.go_to_work_item_template, hardCodedUrl));

        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.OAuthTestTrigDialogId,
            DialogMatches.oauthTestMatch,
            [
                OAuthTestTrigDialog.promptForWorkItemId,
                OAuthTestTrigDialog.showWorkItem,
            ],
        );
    }
}
