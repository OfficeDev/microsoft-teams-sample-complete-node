import * as builder from "botbuilder";
let config = require("config");
import { RootDialog } from "./dialogs/RootDialog";
import { SetLocaleFromTeamsSetting } from "./middleware/SetLocaleFromTeamsSetting";
import { StripBotAtMentions } from "./middleware/StripBotAtMentions";
import { LoadBotChannelData } from "./middleware/LoadBotChannelData";
import { Strings } from "./locale/locale";
import { loadSessionAsync } from "./utils/DialogUtils";
import { DialogIds } from "./utils/DialogIds";
import * as teams from "botbuilder-teams";
import { MongoDbTagStorage } from "./storage/MongoDbTagStorage";
import { MongoDbSOEQuestionStorage } from "./storage/MongoDbSOEQuestionStorage";

// =========================================================
// Bot Setup
// =========================================================

export class SOEBot extends builder.UniversalBot {

    private static getOnO365ConnectorCardActionHandler(bot: builder.UniversalBot): (event: builder.IEvent, query: teams.IO365ConnectorCardActionQuery, callback: (err: Error, result: any, statusCode: number) => void) => void {
        return async function (
            event: builder.IEvent,
            query: teams.IO365ConnectorCardActionQuery,
            callback: (err: Error, result: any, statusCode: number) => void,
        ): Promise<void>
        {
            let session = await loadSessionAsync(bot, event);
            if (query.actionId && query.actionId === "removeTags" && query.body) {
                let body = JSON.parse(query.body);
                session.beginDialog(DialogIds.RemoveTagsDialogId, { tagInputStringFromSettingsCard: body.tagInputStringFromSettingsCard });
            } else if (query.actionId && query.actionId === "addTags" && query.body) {
                let body = JSON.parse(query.body);
                session.beginDialog(DialogIds.AddTagsDialogId, { tagInputStringFromSettingsCard: body.tagInputStringFromSettingsCard });
            } else {
                let userName = event.address.user.name;
                let body = JSON.parse(query.body);
                let msg = new builder.Message()
                    .address(event.address)
                    .summary("Thanks for your input!")
                    .textFormat("xml")
                    .text(`<h2>Thanks, ${userName}!
                        </h2><br>
                        <h3>Your input action ID:</h3><br>
                        <pre>${query.actionId}</pre><br>
                        <h3>Your input body:</h3><br>
                        <pre>${JSON.stringify(body, null, 2)}</pre>
                    `);
                session.send(msg);
            }

            callback(null, null, 200);
        };
    }

    public getTagStorage(): MongoDbTagStorage {
        return this.get("tagStorage");
    }

    public getSOEQuestionStorage(): MongoDbSOEQuestionStorage {
        return this.get("soeQuestionStorage");
    }

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
            new LoadBotChannelData(this.get("channelStorage")),
        );

        // Handle invoke events
        this._connector.onInvoke((event, callback) => { this.invokeHandler(event, callback); });
        this._connector.onQuery("search123", (event, query, callback) => { this.composeExtensionHandler(event, query, callback); });
        this.on("conversationUpdate", (event) => { this.conversationUpdateHandler(event); });

        this._connector.onO365ConnectorCardAction(SOEBot.getOnO365ConnectorCardActionHandler(this));
    }

    // Handle incoming invoke
    private async invokeHandler(event: builder.IEvent, callback: (err: Error, body: any, status?: number) => void): Promise<void> {
        let session = await loadSessionAsync(this, event);
        if (session) {
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
    }

    private async composeExtensionHandler(event: builder.IEvent, query: teams.ComposeExtensionQuery, callback: (err: Error, result: teams.IComposeExtensionResponse, statusCode: number) => void): Promise<void> {
        let manifestInitialRun = "initialRun";
        let manifestParameterName = "query";

        if (query.parameters[0].name !== manifestInitialRun && query.parameters[0].name !== manifestParameterName) {
            return callback(new Error("Parameter mismatch in manifest"), null, 500);
        }

        try {
            let session = await loadSessionAsync(this, event);
            let title = "";

            // parameters should be identical to manifest
            if (query.parameters[0].name === manifestInitialRun) {
                title = session.gettext(Strings.initial_run_title);
            } else if (query.parameters[0].name === manifestParameterName) {
                title = query.parameters[0].value;
            }

            let cards = Array<builder.IAttachment>();
            for (let i = 0; i < 3; i++) {
                let card = new builder.ThumbnailCard()
                    .title(title + " " + (i + 1))
                    .images([
                        new builder.CardImage(session)
                            .url(config.get("app.baseUri") + "/assets/computer_person.jpg")
                            .alt(session.gettext(Strings.img_default)),
                    ])
                    .text(session.gettext(Strings.default_text))
                    .buttons([
                        builder.CardAction.openUrl(session, "https://www.bing.com", Strings.go_to_bing_button),
                    ]);
                cards.push(card.toAttachment());
            }

            let response = teams.ComposeExtensionResponse.result("list").attachments(cards);

            return callback(null, response.toResponse(), 200);
        }
        catch (e) {
            callback(e, null, 500);
        }
    }

    // set incoming event to any because membersAdded is not a field in builder.IEvent
    private async conversationUpdateHandler(event: any): Promise<void> {
        let session = await loadSessionAsync(this, event);

        if (event.membersAdded && event.membersAdded[0].id && event.membersAdded[0].id.endsWith(config.get("bot.botId"))) {
            session.send(Strings.bot_introduction); // probably only works in Teams
        } else {
            session.send(Strings.bot_welcome_to_new_person);
        }
    }
}
