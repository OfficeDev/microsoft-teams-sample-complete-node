// Regular Expressions and intent strings for Dialogs
// tslint:disable-next-line:variable-name
export const DialogMatches = {
    // *************************** BEGINNING OF EXAMPLES ***************************
    multiTrigTest1Match: /run multi trig 1/i,
    multiTrigTest1Match2: /multi trig 1 run/i,
    multiTrigTest2Match: /run multi trig 2/i,
    promptFlowGameMatch: /run game/i,
    promptFlowGameMatch2: /run flow game/i,
    showLastDialogMatch: /show dialog/i,
    showLastDialogMatch2: /how/i,
    set_alarm_intent: "builtin.intent.alarm.set_alarm",
    delete_alarm_intent: "builtin.intent.alarm.delete_alarm",
    authorizeAppMatch: /authorize/i,
    oauthTestMatch: /run oauth test/i,
    quizQuestionMatch: /run quiz question/i,
    startQuizMatch: /run quiz/i,
    start1to1Match: /send 1:1/i,
    testTrigMatch: /run trig/i,
    beginDialogMatch: /run begin dialog/i,
    constructorArgsMatch: /run constructor args/i,
    setupTextUpdateMsgMatch: /setup text message/i,
    updateTextUpdateMsgMatch: /update text message/i,
    setupCardUpdateMsgMatch: /setup card message/i,
    update_card_update_msg: "update_card_update_msg",
    fetchRosterMatch: /fetch roster/i,
    fetchRosterMatch2: /get roster/i,
    fetchRosterPayloadMatch: /fetch roster payload/i,
    fetchRosterPayloadMatch2: /get roster payload/i,
    resetBotStateMatch: /reset/i,
    // *************************** END OF EXAMPLES *********************************

    // Add regex or string intent matches for dialogs

};
