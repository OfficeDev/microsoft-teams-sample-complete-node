import * as builder from "botbuilder";
import { TriggerDialog } from "../../utils/TriggerDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import * as teams from "botbuilder-teams";

export class FetchRosterPayloadTrigDialog extends TriggerDialog {

    private static async fetchRosterPayload(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        // casting to keep away typescript errors
        let msgConnector: any = session.connector;
        let msgAddress: builder.IChatConnectorAddress = session.message.address;
        let msgServiceUrl = msgAddress.serviceUrl;

        msgConnector.fetchMemberList(msgServiceUrl,
            session.message.address.conversation.id,
            teams.TeamsMessage.getTenantId(session.message),
            (err, result) => {
                if (!err) {
                    session.send(JSON.stringify(result));
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
            DialogIds.FetchRosterPayloadTrigDialogId,
            [
                DialogMatches.fetchRosterPayloadMatch,
                DialogMatches.fetchRosterPayloadMatch2,
            ],
            FetchRosterPayloadTrigDialog.fetchRosterPayload,
        );
    }
}
