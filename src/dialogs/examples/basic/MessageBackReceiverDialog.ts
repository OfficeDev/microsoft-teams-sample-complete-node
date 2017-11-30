import * as builder from "botbuilder";
import * as config from "config";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { TokenResponse } from "../../../apis/AADAPI";
import { AADRequestAPI } from "../../../apis/AADRequestAPI";

export class MessageBackReceiverDialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        switch (session.message.value.action)
        {
            case "signout":
                session.userData.aadTokens = {};
                session.send("Ok, I've cleared your tokens.");
                break;

            case "getProfile":
                // See if we have an AAD token
                const graphResource = "https://graph.microsoft.com";
                let aadTokens = session.userData.aadTokens || {};
                let graphToken = aadTokens[graphResource] as TokenResponse;

                if (!graphToken) {
                    // We don't have a Graph token for the user, ask them to sign in
                    session.send(new builder.Message(session)
                        .addAttachment(new builder.HeroCard(session)
                            .text("You're not yet signed in. Please click on the Sign In button to log in.")
                            .buttons([
                                new builder.CardAction(session)
                                    .type("signin")
                                    .title("Sign In")
                                    .value(config.get("app.baseUri") + "/bot-auth/simple-start?width=5000&height=5000"),
                                ])));
                } else {
                    // Use the Graph token to get the basic profile
                    try {
                        let requestHelper = new AADRequestAPI();
                        let response = await requestHelper.getAsync("https://graph.microsoft.com/v1.0/me/", { Authorization: "Bearer " + graphToken.access_token }, null);

                        let info = JSON.parse(response);
                        session.send(info.displayName + "<br />" + info.mail + "<br />" + info.officeLocation);
                    } catch (e) {
                        console.log(e);
                        session.send("There was an error getting the user's profile.");
                    }
                }
                break;
        }

        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.MessageBackReceiverDialogId,
            DialogMatches.MessageBackReceiverDialogMatch,
            MessageBackReceiverDialog.step1,
        );
    }
}
