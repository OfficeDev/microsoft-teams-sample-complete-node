import * as builder from "botbuilder";
let config = require("config");
import { RootDialog } from "./dialogs/RootDialog";
import { StripBotAtMentions } from "./middleware/StripBotAtMentions";
import { Strings } from "./locale/locale";
import { loadSessionAsync } from "./utils/DialogUtils";
import * as teams from "botbuilder-teams";
import { VSTSAPI } from "./apis/VSTSAPI";

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
        // // parameters should be identical to manifest
        // if (query.parameters[0].name !== "query2") {
        //     return callback(new Error("Parameter mismatch in manifest"), null, 500);
        // }

        // let logo: builder.ICardImage = {
        //     alt: "logo",
        //     url: config.get("app.baseUri") + "/assets/computer_person.jpg",
        //     tap: null,
        // };

        // try {
        //     let card = new builder.ThumbnailCard()
        //         .title("sample title")
        //         .images([logo])
        //         .text("sample text")
        //         .buttons([
        //             {
        //                 type: "openUrl",
        //                 title: "Go to somewhere",
        //                 value: "https://www.bing.com",
        //             },
        //         ]);
        //     let response = teams.ComposeExtensionResponse.result("list").attachments([card.toAttachment()]);
        //     callback(null, response.toResponse(), 200);
        // }
        // catch (e) {
        //     callback(e, null, 500);
        // }

        // parameters should be identical to manifest
        if (query.parameters[0].name !== "query2") {
            return callback(new Error("Parameter mismatch in manifest"), null, 500);
        }

        let logo: builder.ICardImage = {
            alt: "logo",
            url: config.get("app.baseUri") + "/assets/computer_person.jpg",
            tap: null,
        };

        try {
            let session = await loadSessionAsync(this, event.address);
            let vstsAPI = new VSTSAPI();
            let body = await vstsAPI.getWorkItem(query.parameters[0].value, session);

            let card = new builder.ThumbnailCard()
                .title(body.value[0].fields["System.Title"])
                // .title("Test title")
                .images([logo])
                .text("sample text")
                .buttons([
                    {
                        type: "openUrl",
                        title: "Go to somewhere",
                        value: "https://www.bing.com",
                    },
                ]);
            let response = teams.ComposeExtensionResponse.result("list").attachments([card.toAttachment()]);
            callback(null, response.toResponse(), 200);
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
