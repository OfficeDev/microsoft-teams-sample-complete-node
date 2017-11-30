import * as builder from "botbuilder";
import * as config from "config";
import { RootDialog } from "./dialogs/RootDialog";
import { SetLocaleFromTeamsSetting } from "./middleware/SetLocaleFromTeamsSetting";
import { StripBotAtMentions } from "./middleware/StripBotAtMentions";
import { LoadBotChannelData } from "./middleware/LoadBotChannelData";
import { Strings } from "./locale/locale";
import { loadSessionAsync } from "./utils/DialogUtils";
import * as teams from "botbuilder-teams";
import { ComposeExtensionHandlers } from "./composeExtension/ComposeExtensionHandlers";
import { AADAPI } from "./apis/AADAPI";

// =========================================================
// Bot Setup
// =========================================================

export class Bot extends builder.UniversalBot {

    constructor(
        private _connector: teams.TeamsChatConnector,
        private botSettings: any,
    ) {
        super(_connector, botSettings);
        this.set("persistConversationData", true);

        // Root dialog
        new RootDialog(this).createChildDialogs();

        // Add middleware
        this.use(
            // currently this middleware cannot be used because there is an error using it
            // with updating messages examples
            // builder.Middleware.sendTyping(),

            // set on "receive" of message
            new SetLocaleFromTeamsSetting(),

            // set on "botbuilder" (after session created)
            new StripBotAtMentions(),
            // new SetAADObjectId(),
            new LoadBotChannelData(this.get("channelStorage")),
        );

        // setup invoke payload handler
        this._connector.onInvoke(this.getInvokeHandler(this));

        // setup O365ConnectorCard action handler
        this._connector.onO365ConnectorCardAction(this.getO365ConnectorCardActionHandler(this));

        // setup conversation update handler for things such as a memberAdded event
        this.on("conversationUpdate", this.getConversationUpdateHandler(this));

        // setup compose extension handlers
        // onQuery is for events that come through the compose extension itself including
        // config and auth responses from popups that were started in the compose extension
        // onQuerySettingsUrl is only used when the user selects "Settings" from the three dot option
        // next to the compose extension's name on the list of compose extensions
        // onSettingsUpdate is only used for the response from the popup created by the
        // onQuerySettingsUrl event
        this._connector.onQuery("search123", ComposeExtensionHandlers.getOnQueryHandler(this));
        this._connector.onQuerySettingsUrl(ComposeExtensionHandlers.getOnQuerySettingsUrlHandler());
        this._connector.onSettingsUpdate(ComposeExtensionHandlers.getOnSettingsUpdateHandler(this));
    }

    // Handle incoming invoke
    private getInvokeHandler(bot: builder.UniversalBot): (event: builder.IEvent, callback: (err: Error, body: any, status?: number) => void) => void {
        return async function (
            event: builder.IEvent,
            callback: (err: Error, body: any, status?: number) => void,
        ): Promise<void>
        {
            let session = await loadSessionAsync(bot, event);
            if (session) {
                session.sendTyping();

                let eventAsAny = event as any;
                if (eventAsAny.name === "signin/verifyState") {
                    let aadApi = new AADAPI();
                    const graphResource = "https://graph.microsoft.com";
                    const botRedirectUri = config.get("app.baseUri") + "/bot-auth/simple-end";

                    try
                    {
                        // Redeem the authorization code for access & refresh tokens
                        let queryParams = JSON.parse(eventAsAny.value.state);
                        console.log(queryParams);

                        let tokenResponse = await aadApi.getAccessTokenV1Async(queryParams.code, botRedirectUri, graphResource);
                        console.log(tokenResponse);

                        // Save the tokens in the user state (remember to use data store that is encrypted at rest!)
                        let aadTokens = session.userData.aadTokens || {};
                        aadTokens[tokenResponse.resource] = tokenResponse;
                        session.userData.aadTokens = aadTokens;
                    } catch (e) {
                        console.log(e);
                        session.send("There was an error redeeming the authorization code.");
                        callback(null, "", 200);    // Return success, otherwise chat service will retry the invoke
                        return;
                    }

                    // Sign in successful, welcome the user
                    session.send(`Hello, ${session.message.address.user.name}!`);
                    callback(null, "", 200);
                    return;
                }

                // Clear the stack on invoke, as many builtin dialogs don't play well with invoke
                // Invoke messages should carry the necessary information to perform their action
                session.clearDialogStack();

                let payload = (event as any).value;

                // Invokes don't participate in middleware
                // If payload has an address, then it is from a button to update a message so we do not what to send typing
                if (!payload.address) {
                    session.sendTyping();
                }

                if (payload && payload.dialog) {
                    session.beginDialog(payload.dialog, payload);
                }
            }
            callback(null, "", 200);
        };
    }

    // set incoming event to any because membersAdded is not a field in builder.IEvent
    private getConversationUpdateHandler(bot: builder.UniversalBot): (event: any) => void {
        return async function(event: any): Promise<void> {
            let session = await loadSessionAsync(bot, event);

            if (event.membersAdded && event.membersAdded[0].id && event.membersAdded[0].id.endsWith(config.get("bot.botId"))) {
                session.send(Strings.bot_introduction); // probably only works in Teams
            } else {
                session.send(Strings.bot_welcome_to_new_person);
            }
        };
    }

    // handler for handling incoming payloads from O365ConnectorCard actions
    private getO365ConnectorCardActionHandler(bot: builder.UniversalBot): (event: builder.IEvent, query: teams.IO365ConnectorCardActionQuery, callback: (err: Error, result: any, statusCode: number) => void) => void {
        return async function (event: builder.IEvent, query: teams.IO365ConnectorCardActionQuery, callback: (err: Error, result: any, statusCode: number) => void): Promise<void> {
            let session = await loadSessionAsync(bot, event);

            let userName = event.address.user.name;
            let body = JSON.parse(query.body);
            let msg = new builder.Message(session)
                        .text(Strings.o365connectorcard_action_response, userName, query.actionId, JSON.stringify(body, null, 2));

            session.send(msg);

            callback(null, null, 200);
        };
    }
}
