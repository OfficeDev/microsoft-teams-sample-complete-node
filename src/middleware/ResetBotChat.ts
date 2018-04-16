import * as builder from "botbuilder";

// Handle requests to reset the bot chat
export class ResetBotChat implements builder.IMiddlewareMap {

    constructor(private bot: builder.UniversalBot) {
    }

    public readonly botbuilder = (session: builder.Session, next: Function): void => {
        let message = session.message;
        if (message &&
            !message.address.conversation.isGroup &&    // Reset bot chat is only for 1:1 chats
            message.text === "/resetbotchat")           // The magic command
        {
            // Forget everything we know about the user
            session.userData = {};
            session.conversationData = {};
            session.privateConversationData = {};
            session.save().sendBatch();

            // If you need to reset the user state in other services your app uses, do it here.

            // Synthesize a conversation update event
            // Note that this is a fake event, as Teams does not support deleting a 1:1 conversation and re-creating it
            let conversationUpdateEvent: builder.IConversationUpdate = {
                type: "conversationUpdate",
                agent: message.agent,
                source: message.source,
                sourceEvent: message.sourceEvent,
                user: message.user,
                address: message.address,
                membersAdded: [ message.address.bot ],
            };
            this.bot.receive(conversationUpdateEvent);

            // Stop processing the original trigger message
        } else {
            next();
        }
    }
}
