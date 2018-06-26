import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { isMessageFromChannel } from "../../../utils/DialogUtils";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
import * as teams from "botbuilder-teams";

export class FetchTeamsInfoDialog extends TriggerActionDialog {

    private static async fetchTeamsInfoPayload(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        // casting to keep away typescript errors
        let teamsChatConnector = (session.connector as teams.TeamsChatConnector);
        let msgAddress = (session.message.address as builder.IChatConnectorAddress);
        let msgServiceUrl = msgAddress.serviceUrl;

        // if a message is from a channel, use the team.id to fetch the roster
        if (!isMessageFromChannel(session.message))
        {
            session.send(Strings.aadid_1to1_error);
        }
        else
        {
            let teamId =  session.message.sourceEvent.team.id;

            teamsChatConnector.fetchTeamInfo(msgServiceUrl, teamId,
                (err, result) => {
                    if (!err) {
                        session.send(JSON.stringify(result));
                    } else {
                        session.error(err);
                    }
                },
            );
        }

        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.FetchTeamsInfoDialogId,
            DialogMatches.FetchTeamsInfoDialogMatch,
            FetchTeamsInfoDialog.fetchTeamsInfoPayload,
        );
    }
}
