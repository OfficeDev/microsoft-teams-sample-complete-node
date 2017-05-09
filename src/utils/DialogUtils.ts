import * as builder from "botbuilder";

export interface MatchActionPair {
    match: RegExp | RegExp[] | string | string[];
    action: builder.IDialogWaterfallStep | builder.IDialogWaterfallStep[];
}

export function loadSessionAsync (bot: builder.UniversalBot, address: builder.IAddress): Promise<builder.Session> {
    return new Promise<builder.Session>((resolve, reject) => {
        bot.loadSession(address, (err: any, session: builder.Session) => {
            if (err) {
                reject(err);
            } else {
                resolve(session);
            }
        });
    });
};

export function isMessageFromChannel(message: builder.IMessage): boolean {
    if (message.sourceEvent && message.sourceEvent.channel && message.sourceEvent.channel.id) {
        return true;
    } else {
        return false;
    }
}

// tslint:disable-next-line:variable-name
export const DialogIds = {
    // Base dialog Ids - DO NOT DELETE
    RootDialogId: "/",
    GetLastDialogUsedTrigDialogId: "GetLastDialogUsedTrigDialog",

    // *************************** BEGINNING OF EXAMPLES ***************************
    TestMultiTrigDialogId: "TestMultiTrigDialog",
    NatLangMultiTrigDialogId: "NatLangMultiTrigDialog",
    OAuthTestTrigDialogId: "OAuthTestTrigDialog",
    AuthorizeAppTrigDialogId: "AuthorizeAppTrigDialog",
    QuizQ1TrigDialogId: "QuizQ1TrigDialog",
    QuizQ2TrigDialogId: "QuizQ2TrigDialog",
    QuizQ3TrigDialogId: "QuizQ3TrigDialog",
    QuizTrigDialogId: "QuizTrigDialog",
    Start1on1TrigDialogId: "Start1on1TrigDialog",
    TestTrigDialogId: "TestTrigDialog",
    BeginDialogExampleTrigDialogId: "BeginDialogExampleTrigDialog",
    PromptFlowGameTrigDialogId: "PromptFlowGameTrigDialog",
    ConstructorArgsTrigDialogId: "ConstructorArgsTrigDialog",
    UpdateMsgTextSetupTrigDialogId: "UpdateMsgTextSetupTrigDialog",
    UpdateMsgTextUpdateTrigDialogId: "UpdateMsgTextUpdateTrigDialog",
    UpdateMsgCardSetupTrigDialogId: "UpdateMsgCardSetupTrigDialog",
    UpdateMsgCardUpdateTrigDialogId: "UpdateMsgCardUpdateTrigDialog",
    FetchRosterTrigDialogId: "FetchRosterTrigDialog",
    ResetBotStateTrigDialogId: "ResetBotStateTrigDialog",
    // *************************** END OF EXAMPLES *********************************

    // Add entries for dialog ids

};
