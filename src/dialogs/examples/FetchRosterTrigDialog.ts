import * as builder from "botbuilder";
import { TriggerDialog } from "../../utils/TriggerDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import * as teams from "botbuilder-teams";

export class FetchRosterTrigDialog extends TriggerDialog {

    private static async fetchRoster(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        // casting to keep away typescript errors
        let msgConnector: any = session.connector;
        let msgAddress: builder.IChatConnectorAddress = session.message.address;
        let msgServiceUrl = msgAddress.serviceUrl;

        msgConnector.fetchMemberList(msgServiceUrl,
            session.message.address.conversation.id,
            teams.TeamsMessage.getTenantId(session.message),
            (err, result) => {
                if (!err) {
                    let response = "";
                    for (let i = 0; i < result.length; i++) {
                        response += result[i].givenName + " " + result[i].surname + "<br>";
                    }
                    session.send(response);
                } else {
                    session.error(err);
                }
                session.endDialog();
            },
        );
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.FetchRosterTrigDialogId,
            [
                DialogMatches.fetchRosterMatch,
                DialogMatches.fetchRosterMatch2,
            ],
            FetchRosterTrigDialog.fetchRoster,
        );
    }
}
