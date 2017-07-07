import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../utils/TriggerActionDialog";
import { DialogIds, isMessageFromChannel } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import * as teams from "botbuilder-teams";

export class FetchRosterPayloadTrigDialog extends TriggerActionDialog {

    private static async fetchRosterPayload(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        // casting to keep away typescript errors
        let teamsChatConnector = (session.connector as teams.TeamsChatConnector);
        let msgAddress = (session.message.address as builder.IChatConnectorAddress);
        let msgServiceUrl = msgAddress.serviceUrl;

        // if a message is from a channel, use the team.id to fetch the roster
        let currId = null;
        if (isMessageFromChannel(session.message)) {
            currId = session.message.sourceEvent.team.id;
        } else {
            currId = session.message.address.conversation.id;
        }

        teamsChatConnector.fetchMemberList(
            msgServiceUrl,
            currId,
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
