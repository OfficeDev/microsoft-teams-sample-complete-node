import * as builder from "botbuilder";
import { DialogMatches } from "../utils/DialogMatches";

// Set the text field on message events to "adaptive card", if request is from an adaptive card
export class AdapticeCardSubmitAction implements builder.IMiddlewareMap {

    public readonly receive = (event: builder.IEvent, next: Function): void => {
        let currEvent = (event as any);

        // if event text is blank, replyToId is not null and if defined key in adaptive card data is present in incoming payload
        // to check if this request is from an adaptive card then set event text "adaptive card" to trigger Adaptive Card dialog,
        // it's a work around that will be cleaned up later
        if (currEvent.text === "" && currEvent.replyToId && currEvent.value)
        {
            let payload = currEvent.value;
            if (payload && payload.dialog)
            {
                currEvent.text = DialogMatches.AdaptiveCardDailogSubmitAction;
            }
        }

        next();
    }
}
