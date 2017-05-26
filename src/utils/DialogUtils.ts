import * as builder from "botbuilder";

export interface MatchActionPair {
    match: RegExp | RegExp[] | string | string[];
    action: builder.IDialogWaterfallStep | builder.IDialogWaterfallStep[];
}

export function loadSessionAsync (bot: builder.UniversalBot, address: builder.IAddress): Promise<builder.Session> {
    return new Promise<builder.Session>((resolve, reject) => {
        bot.loadSession(address, (err: any, session: builder.Session) => {
            if (!err) {
                resolve(session);
            } else {
                reject(err);
            }
        });
    });
};

export function isMessageFromChannel(message: builder.IMessage): boolean {
    return (message.sourceEvent && message.sourceEvent.channel && message.sourceEvent.channel.id);
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
    Start1to1TrigDialogId: "Start1to1TrigDialog",
    TestTrigDialogId: "TestTrigDialog",
    BeginDialogExampleTrigDialogId: "BeginDialogExampleTrigDialog",
    PromptFlowGameTrigDialogId: "PromptFlowGameTrigDialog",
    ConstructorArgsTrigDialogId: "ConstructorArgsTrigDialog",
    UpdateMsgTextSetupTrigDialogId: "UpdateMsgTextSetupTrigDialog",
    UpdateMsgTextUpdateTrigDialogId: "UpdateMsgTextUpdateTrigDialog",
    UpdateMsgCardSetupTrigDialogId: "UpdateMsgCardSetupTrigDialog",
    UpdateMsgCardUpdateTrigDialogId: "UpdateMsgCardUpdateTrigDialog",
    FetchRosterTrigDialogId: "FetchRosterTrigDialog",
    FetchRosterPayloadTrigDialogId: "FetchRosterPayloadTrigDialog",
    ResetBotStateTrigDialogId: "ResetBotStateTrigDialog",
    // *************************** END OF EXAMPLES *********************************

    // Add entries for dialog ids

};
