import * as builder from "botbuilder";
import { Strings } from "../locale/locale";
import { DialogIds } from "../utils/DialogIds";
// let config = require("config");

// *************************** BEGINNING OF EXAMPLES ***************************
import { AuthorizeAppTrigDialog } from "./examples/AuthorizeAppTrigDialog";
import { ValidateVSTSAuthUserTrigDialog } from "./examples/ValidateVSTSAuthUserTrigDialog";
import { BeginDialogExampleTrigDialog } from "./examples/BeginDialogExampleTrigDialog";
import { GetLastDialogUsedTrigDialog } from "./examples/GetLastDialogUsedTrigDialog";
import { NatLangMultiTrigDialog } from "./examples/NatLangMultiTrigDialog";
import { OAuthTestTrigDialog } from "./examples/OAuthTestTrigDialog";
import { PromptFlowGameTrigDialog } from "./examples/PromptFlowGameTrigDialog";
import { QuizQ1TrigDialog } from "./examples/QuizQ1TrigDialog";
import { QuizQ2TrigDialog } from "./examples/QuizQ2TrigDialog";
import { QuizQ3TrigDialog } from "./examples/QuizQ3TrigDialog";
import { QuizTrigDialog } from "./examples/QuizTrigDialog";
import { O365ConnectorCardDialog } from "./examples/O365ConnectorCardDialog";
import { SendProactiveMsgToChannelDialog } from "./examples/SendProactiveMsgToChannelDialog";
import { Start1to1TrigDialog } from "./examples/Start1to1TrigDialog";
import { TestMultiTrigDialog } from "./examples/TestMultiTrigDialog";
import { TestTrigDialog } from "./examples/TestTrigDialog";
import { ConstructorArgsTrigDialog } from "./examples/ConstructorArgsTrigDialog";
import { UpdateMsgTextSetupTrigDialog } from "./examples/UpdateMsgTextSetupTrigDialog";
import { UpdateMsgTextUpdateTrigDialog } from "./examples/UpdateMsgTextUpdateTrigDialog";
import { UpdateMsgCardSetupTrigDialog } from "./examples/UpdateMsgCardSetupTrigDialog";
import { UpdateMsgCardUpdateTrigDialog } from "./examples/UpdateMsgCardUpdateTrigDialog";
import { FetchRosterTrigDialog } from "./examples/FetchRosterTrigDialog";
import { FetchRosterPayloadTrigDialog } from "./examples/FetchRosterPayloadTrigDialog";
import { ResetUserStateTrigDialog } from "./examples/ResetUserStateTrigDialog";
import { AtMentionTrigDialog } from "./examples/AtMentionTrigDialog";
// *************************** END OF EXAMPLES *********************************

// Add imports for dialogs

// Main dialog that handles commands
export class RootDialog extends builder.IntentDialog {

    constructor(
        private bot: builder.UniversalBot,
    ) {
        super();
        this.onDefault((session) => { this._onDefault(session); });

        bot.dialog(DialogIds.RootDialogId, this);

        // Add LUIS recognizer for natural language processing
        // let luisEndpoint = config.get("luis.endpointUri");
        // if (luisEndpoint) {
        //     bot.recognizer(new builder.LuisRecognizer(luisEndpoint));
        // }
    }

    // Create the child dialogs and attach them to the bot
    public createChildDialogs(): void {
        let bot = this.bot;

        // *************************** BEGINNING OF EXAMPLES ***************************
        new AuthorizeAppTrigDialog(bot);
        new ValidateVSTSAuthUserTrigDialog(bot);
        new BeginDialogExampleTrigDialog(bot);
        new GetLastDialogUsedTrigDialog(bot);
        new NatLangMultiTrigDialog(bot);
        new OAuthTestTrigDialog(bot);
        new PromptFlowGameTrigDialog(bot);
        new QuizQ1TrigDialog(bot);
        new QuizQ2TrigDialog(bot);
        new QuizQ3TrigDialog(bot);
        new QuizTrigDialog(bot);
        new O365ConnectorCardDialog(bot);
        new SendProactiveMsgToChannelDialog(bot);
        new Start1to1TrigDialog(bot);
        new TestMultiTrigDialog(bot);
        new TestTrigDialog(bot);
        new ConstructorArgsTrigDialog(bot, "12345");
        new UpdateMsgTextSetupTrigDialog(bot);
        new UpdateMsgTextUpdateTrigDialog(bot);
        new UpdateMsgCardSetupTrigDialog(bot);
        new UpdateMsgCardUpdateTrigDialog(bot);
        new FetchRosterTrigDialog(bot);
        new FetchRosterPayloadTrigDialog(bot);
        new ResetUserStateTrigDialog(bot);
        new AtMentionTrigDialog(bot);
        // *************************** END OF EXAMPLES *********************************

        // Add child dialogs

    }

    // Handle unrecognized input
    private _onDefault(session: builder.Session): void {
        session.conversationData.currentDialogName = DialogIds.RootDialogId;
        session.send(Strings.root_dialog_on_default);
    }
}
