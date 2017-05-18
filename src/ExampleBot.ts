import * as builder from "botbuilder";
let config = require("config");
import { RootDialog } from "./dialogs/RootDialog";
import { StripBotAtMentions } from "./middleware/StripBotAtMentions";
import { Strings } from "./locale/locale";
import { loadSessionAsync } from "./utils/DialogUtils";
import * as teams from "botbuilder-teams";

// =========================================================
// Bot Setup
// =========================================================

export class ExampleBot extends builder.UniversalBot {

    constructor(
        // public _connector: builder.IConnector,
        private _connector: teams.TeamsChatConnector,
    ) {
        super(_connector);
        this.set("persistConversationData", true);

        // Root dialog
        new RootDialog(this).createChildDialogs();

        // Handle invoke events
        this._connector.onInvoke((event, callback) => { this.invokeHandler(event, callback); });
        this._connector.onQuery("search123", (event, query, callback) => { this.composeExtensionHandler(event, query, callback); });
        this.on("conversationUpdate", (event) => { this.conversationUpdateHandler(event); });

        // Add middleware
        this.use(
            // builder.Middleware.sendTyping(),
            new StripBotAtMentions(),
        );
    }

    // Handle incoming invoke
    private async invokeHandler(event: builder.IEvent, callback: (err: Error, body: any, status?: number) => void): Promise<void> {
        let session = await loadSessionAsync(this, event.address);
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
            let session = await loadSessionAsync(this, event.address);
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

    private async conversationUpdateHandler(event: any): Promise<void> {
        let session = await loadSessionAsync(this, event.address);

        if (event.membersAdded && event.membersAdded[0].id && event.membersAdded[0].id.endsWith(config.get("bot.botId"))) {
            session.send(Strings.bot_introduction); // probably only works in Teams
        } else {
            session.send(Strings.bot_welcome_to_new_person);
        }
    }
}
