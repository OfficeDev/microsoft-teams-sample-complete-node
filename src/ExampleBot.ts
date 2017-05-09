import * as builder from "botbuilder";
let config = require("config");
import { RootDialog } from "./dialogs/RootDialog";
import { StripBotAtMentions } from "./middleware/StripBotAtMentions";
import { Strings } from "./locale/locale";
import { loadSessionAsync } from "./utils/DialogUtils";

// =========================================================
// Bot Setup
// =========================================================

export class ExampleBot extends builder.UniversalBot {

    constructor(
        public _connector: builder.IConnector,
    ) {
        super(_connector);
        this.set("persistConversationData", true);

        // Root dialog
        new RootDialog(this).createChildDialogs();

        // Handle invoke events
        this._connector.onInvoke((event, cb) => { this.onInvoke(event, cb); });

        // Add middleware
        this.use(
            // builder.Middleware.sendTyping(),
            new StripBotAtMentions(),
        );

        this.on("conversationUpdate", async (event) => {
            let session = await loadSessionAsync(this, event.address);

            if (event.membersAdded && event.membersAdded[0].id && event.membersAdded[0].id.endsWith(config.get("bot.botId"))) {
                session.send(Strings.bot_introduction); // probably only works in Teams
            } else {
                session.send(Strings.bot_welcome_to_new_person);
            }
        });
    }

    // Handle incoming invoke
    private async onInvoke(event: builder.IEvent, cb: (err: Error, body: any, status?: number) => void): Promise<void> {
        let eventName = (event as any).name;
        if (eventName && eventName.match(/^composeExtension/)) {
            // Compose extension
            let session = await loadSessionAsync(this, event.address);
            if (session) {
                let newCard = new builder.HeroCard(session)
                    .title(Strings.default_title)
                    .subtitle(Strings.default_subtitle)
                    .text(Strings.default_text)
                    .images([
                        new builder.CardImage(session)
                            .url(config.get("app.baseUri") + "/assets/computer_person.jpg")
                            .alt(session.gettext(Strings.img_default)),
                    ]);

                let response = {
                    inputExtension: {
                        type: "result",
                        attachmentLayout: "list",
                        attachments: [ newCard.toAttachment() ],
                    },
                };
                cb(null, response);
                // cb(null, response, 200);
            }
        } else {
            let session = await loadSessionAsync(this, event.address);
            if (session) {
                // Clear the stack on invoke, as many builtin dialogs don't play well with invoke
                // Invoke messages should carry the necessary information to perform their action
                session.clearDialogStack();

                // Invokes don't participate in middleware
                session.sendTyping();

                let payload = (event as any).value;

                if (payload && payload.dialog) {
                    session.beginDialog(payload.dialog, payload);
                }
            }
            cb(null, "", 200);
        }
    }
}
