import * as builder from "botbuilder";
import { Strings } from "../locale/locale";
import { DialogIds } from "../utils/DialogIds";
// let config = require("config");

// *************************** BEGINNING OF EXAMPLES ***************************
import { ResetUserStateDialog } from "./examples/auth/ResetUserStateDialog";
import { VSTSAPICallDialog } from "./examples/auth/VSTSAPICallDialog";
import { VSTSAuthValidateUserDialog } from "./examples/auth/VSTSAuthValidateUserDialog";
import { VSTSLogInDialog } from "./examples/auth/VSTSLogInDialog";
import { AnimatedGifDialog } from "./examples/basic/AnimatedGifDialog";
import { DeeplinkDialog } from "./examples/basic/DeeplinkDialog";
import { GetLastDialogUsedDialog } from "./examples/basic/GetLastDialogUsedDialog";
import { HelloDialog } from "./examples/basic/HelloDialog";

import { HeroCardDialog } from "./examples/basic/HeroCardDialog";
import { MultiDialog } from "./examples/basic/MultiDialog";
import { O365ConnectorCardDialog } from "./examples/basic/O365ConnectorCardDialog";
import { ThumbnailCardDialog } from "./examples/basic/ThumbnailCardDialog";
import { BeginDialogFlowDialog } from "./examples/moderate/BeginDialogFlowDialog";
import { ConstructorArgsDialog } from "./examples/moderate/ConstructorArgsDialog";
import { ListNamesDialog } from "./examples/moderate/ListNamesDialog";
import { LuisRecognizerNatLanguageDialog } from "./examples/moderate/LuisRecognizerNatLanguageDialog";
import { PromptDialog } from "./examples/moderate/PromptDialog";
import { QuizFullDialog } from "./examples/moderate/QuizFullDialog";
import { QuizQ1Dialog } from "./examples/moderate/QuizQ1Dialog";
import { QuizQ2Dialog } from "./examples/moderate/QuizQ2Dialog";
import { QuizQ3Dialog } from "./examples/moderate/QuizQ3Dialog";
import { AtMentionDialog } from "./examples/teams/AtMentionDialog";
import { FetchRosterDialog } from "./examples/teams/FetchRosterDialog";
import { ProactiveMsgTo1to1Dialog } from "./examples/teams/ProactiveMsgTo1to1Dialog";
import { ProactiveMsgToChannelDialog } from "./examples/teams/ProactiveMsgToChannelDialog";
import { UpdateCardMsgDialog } from "./examples/teams/UpdateCardMsgDialog";
import { UpdateCardMsgSetupDialog } from "./examples/teams/UpdateCardMsgSetupDialog";
import { UpdateTextMsgDialog } from "./examples/teams/UpdateTextMsgDialog";
import { UpdateTextMsgSetupDialog } from "./examples/teams/UpdateTextMsgSetupDialog";
// *************************** END OF EXAMPLES *********************************

// Add imports for Stack Overflow Enterprise dialogs
import { SOELoginDialog } from "./SOELoginDialog";
import { SOEShowQuestionsDialog } from "./SOEShowQuestionsDialog";
import { AddTagsDialog } from "./AddTagsDialog";
import { ChannelDataDialog } from "./ChannelDataDialog";
import { HelpDialog } from "./HelpDialog";
import { RemoveTagsDialog } from "./RemoveTagsDialog";
import { SendSimpleTagNotificationDialog } from "./SendSimpleTagNotificationDialog";
import { SendSOEQuestionNotificationDialog } from "./SendSOEQuestionNotificationDialog";
import { UpdateSOEQuestionNotificationDialog } from "./UpdateSOEQuestionNotificationDialog";
import { SettingsDialog } from "./SettingsDialog";

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
        new ResetUserStateDialog(bot);
        new VSTSAPICallDialog(bot);
        new VSTSAuthValidateUserDialog(bot);
        new VSTSLogInDialog(bot);
        new AnimatedGifDialog(bot);
        new DeeplinkDialog(bot);
        new GetLastDialogUsedDialog(bot);
        new HelloDialog(bot);

        new HeroCardDialog(bot);
        new MultiDialog(bot);
        new O365ConnectorCardDialog(bot);
        new ThumbnailCardDialog(bot);
        new BeginDialogFlowDialog(bot);
        new ConstructorArgsDialog(bot, "12345");
        new ListNamesDialog(bot);
        new LuisRecognizerNatLanguageDialog(bot);
        new PromptDialog(bot);
        new QuizFullDialog(bot);
        new QuizQ1Dialog(bot);
        new QuizQ2Dialog(bot);
        new QuizQ3Dialog(bot);
        new AtMentionDialog(bot);
        new FetchRosterDialog(bot);
        new ProactiveMsgTo1to1Dialog(bot);
        new ProactiveMsgToChannelDialog(bot);
        new UpdateCardMsgDialog(bot);
        new UpdateCardMsgSetupDialog(bot);
        new UpdateTextMsgDialog(bot);
        new UpdateTextMsgSetupDialog(bot);
        // *************************** END OF EXAMPLES *********************************

        // Add child dialogs
        new SOELoginDialog(bot);
        new SOEShowQuestionsDialog(bot);
        new AddTagsDialog(bot);
        new ChannelDataDialog(bot);
        new HelpDialog(bot);
        new RemoveTagsDialog(bot);
        new SendSimpleTagNotificationDialog(bot);
        new SendSOEQuestionNotificationDialog(bot);
        new UpdateSOEQuestionNotificationDialog(bot);
        new SettingsDialog(bot);
    }

    // Handle unrecognized input
    private _onDefault(session: builder.Session): void {
        session.conversationData.currentDialogName = DialogIds.RootDialogId;
        session.send(Strings.root_dialog_on_default);
    }
}
