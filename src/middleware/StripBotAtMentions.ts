import * as builder from "botbuilder";

// Strip bot mentions from the message text
export class StripBotAtMentions implements builder.IMiddlewareMap {

    public readonly botbuilder = (session: builder.Session, next: Function): void => {
        let message = session.message;
        if (message) {
            let botMri = message.address.bot.id.toLowerCase();
            let botAtMention = message.entities && message.entities.find(
                (entity) => (entity.type === "mention") && (entity.mentioned.id.toLowerCase() === botMri));
            if (botAtMention) {
                // Save original text as property of the message
                (message as any).textWithBotMentions = message.text;
                message.text = message.text.replace(botAtMention.text, "").trim();
            }
        }
        next();
    }

}
