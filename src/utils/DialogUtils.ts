import * as builder from "botbuilder";

export interface MatchActionPair {
    match: RegExp | RegExp[] | string | string[];
    action: builder.IDialogWaterfallStep | builder.IDialogWaterfallStep[];
}

export function loadSessionAsync (bot: builder.UniversalBot, event: builder.IEvent): Promise<builder.Session> {
    let address = event.address;
    return new Promise<builder.Session>((resolve, reject) => {
        bot.loadSession(address, (err: any, session: builder.Session) => {
            if (!err) {
                let locale = getLocaleFromEvent(event);
                if (locale) {
                    (session as any)._locale = locale;
                    session.localizer.load(locale, (err2) => {
                        resolve(session);
                    });
                } else {
                    resolve(session);
                }
            } else {
                reject(err);
            }
        });
    });
};

export function getLocaleFromEvent(event: builder.IEvent): string {
    // Casting to keep away typescript errors
    let currEvent = (event as any);
    if (currEvent.entities && currEvent.entities.length) {
        for (let i = 0; i < currEvent.entities.length; i++) {
            if (currEvent.entities[i].type &&
                currEvent.entities[i].type === "clientInfo" &&
                currEvent.entities[i].locale)
            {
                return currEvent.entities[i].locale;
            }
        }
    }
    return null;
}

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
    ValidateVSTSAuthUserTrigDialogId: "ValidateVSTSAuthUserTrigDialog",
    QuizQ1TrigDialogId: "QuizQ1TrigDialog",
    QuizQ2TrigDialogId: "QuizQ2TrigDialog",
    QuizQ3TrigDialogId: "QuizQ3TrigDialog",
    QuizTrigDialogId: "QuizTrigDialog",
    O365ConnectorCardDialogId: "O365ConnectorCardDialog",
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
    ResetUserStateTrigDialogId: "ResetUserStateTrigDialog",
    AtMentionTrigDialogId: "AtMentionTrigDialog",
    // *************************** END OF EXAMPLES *********************************

    // Add entries for dialog ids

};
