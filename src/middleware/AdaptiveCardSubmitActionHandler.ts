import * as builder from "botbuilder";

// Set the text field on message events to "adaptive card", if request is from an adaptive card
export class AdaptiveCardSubmitActionHandler implements builder.IMiddlewareMap {

    public readonly receive = (event: builder.IEvent, next: Function): void => {
        if (event.type === "message")
        {
            let currEvent = (event as builder.IMessage);

            // if event text is blank, replyToId is not null, event value is has isFromAdaptiveCard and messageText (please find these two fields in \src\dialogs\examples\basic\AdaptiveCardDialog.ts,
            // submit action data field) in incoming payload to check if incoming request is from an adaptive card then set event text to messageText "adaptive card" to trigger Adaptive Card dialog,
            // it's a work around that will be cleaned up later
            if (currEvent.text === "" && currEvent.replyToId && currEvent.value && currEvent.value.isFromAdaptiveCard && currEvent.value.messageText)
            {
                currEvent.text = currEvent.value.messageText;
            }
        }

        next();
    }
}
