import * as builder from "botbuilder";
let config = require("config");
import { isMessageFromChannel } from "../../../utils/DialogUtils";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { MultiTriggerActionDialog } from "../../../utils/MultiTriggerActionDialog";
import { Strings } from "../../../locale/locale";
import * as querystring from "querystring";
// import * as exampleAPI from "../../apis/ExampleAPI";

export class MultiDialog extends MultiTriggerActionDialog {

    private static async test1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        session.send(Strings.multi_dialog_1);
        session.endDialog();
    }

    private static async test2(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        /**
         * This is an example of getting data from the args/user data from a MultiTrigDialog
         * begin called with beginDialog()
         */
        // let twitterAccount = "";
        // if (args.response) {
        //     twitterAccount = args.response;
        // } else if (session.userData.args && session.userData.args.desiredUser) {
        //     twitterAccount = session.userData.args.desiredUser;
        // }
        // twitterAccount = twitterAccount.replace("@", "").toLowerCase();

        /**
         * This is an example of making an api call
         */
        // let api = new ExampleOAuth1API();
        // let body = await api.getAsync("/url/ending/for/call", {q: "name", result_type: "recent", count: "5"});
        // session.send(JSON.stringify(body.text));

        let cards = new Array<builder.HeroCard>();
        let numbCards = 3;

        for (let i = 0; i < numbCards; i++) {
                let buttons = new Array<builder.CardAction>();
                /**
                 * This is an example of a button calling an invoke of a MulitWaterfall Dialog with
                 * the desiredIntent and passing information.
                 */
                buttons.push(new builder.CardAction(session)
                    .type("invoke")
                    .title(Strings.invoke_button_multi_dialog_1)
                    .value("{" +
                        "\"dialog\": \"" + DialogIds.MultiDialogId + "\", " +
                        "\"response\": \"Information for called intent\"" +
                    "}"),
                );

                buttons.push(new builder.CardAction(session).type("invoke").title(Strings.invoke_button_hello_dialog).value("{\"dialog\": \"" + DialogIds.HelloDialogId + "\"}"));

                if (isMessageFromChannel(session.message)) {
                    // create button to deep link to the channel tab - channel tab must have added for this to work
                    // pattern for channel tab deep link:
                    // https://teams.microsoft.com/l/entity/APP_ID/ENTITY_ID?webUrl=<entityWebUrl>&label=<entityLabel>&context=<context>
                    // APP_ID is the appId assigned in the manifest
                    // ENTITY_ID is the entityId that is set for that channel tab when your config page creates it
                    // context is a url encoded json object with a channelId parameter inside of it
                    let appId = config.get("app.appId");
                    let entityId = "test123";
                    let context = querystring.stringify({ context: "{\"channelId\":\"" + session.message.sourceEvent.channel.id + "\"}" });
                    let hardCodedUrl = "https://teams.microsoft.com/l/entity/" + appId + "/" + entityId + "?" + context;
                    buttons.push(builder.CardAction.openUrl(session, hardCodedUrl, Strings.open_channel_tab));
                } else {
                    // create a button to deep link to the static tab located in the 1:1 chat with the bot
                    // pattern for static tab deep link:
                    // (at a minimum to get to the static tab)
                    // https://teams.microsoft.com/l/entity/28:BOT_ID/ENTITY_ID?conversationType=chat

                    // (for sending data to that tab)
                    // https://teams.microsoft.com/l/entity/28:BOT_ID/ENTITY_ID?conversationType=chat&context=%7B%22subEntityId%22%3A%22SUB_ENTITY_ID_DATA%22%7D

                    // BOT_ID is the bot id that comes from your bot registration with 28: added to the front
                    // ENTITY_ID is the entityId that is set for that static tab in the manifest
                    // context is a url encoded json object with a subEntityId parameter inside of it – this is how you can pass data to your static tab
                    let botId = "28:" + config.get("bot.botId");
                    let entityId = "1on1test123";
                    let hardCodedUrl = "https://teams.microsoft.com/l/entity/" + botId + "/" + entityId + "?conversationType=chat";
                    buttons.push(builder.CardAction.openUrl(session, hardCodedUrl, Strings.open_static_tab));
                }

                // let newCard = new builder.ThumbnailCard(session)
                let newCard = new builder.HeroCard(session)
                    .title(Strings.default_title)
                    .subtitle(Strings.default_subtitle)
                    .text(Strings.default_text)
                    .images([
                        new builder.CardImage(session)
                            .url(config.get("app.baseUri") + "/assets/computer_person.jpg")
                            .alt(session.gettext(Strings.img_default)),
                    ])
                    .buttons(buttons)
                    .tap(builder.CardAction.imBack(session, "123"));    // this will not get the bot to do something but will show the functionality of a tap

                cards.push(newCard);
        }
        session.endDialog(new builder.Message(session)
            // .attachmentLayout("list")
            .attachmentLayout("carousel")
            .attachments(cards));
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            [
                {
                    dialogId: DialogIds.MultiDialogId,
                    match: DialogMatches.MultiDialogMatch,
                    action: MultiDialog.test1,
                },
                {
                    dialogId: DialogIds.MultiDialog2Id,
                    match: DialogMatches.MultiDialog2Match,
                    action: MultiDialog.test2,
                },
            ],
        );
    }
}
