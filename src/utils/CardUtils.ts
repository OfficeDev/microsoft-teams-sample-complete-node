import * as builder from "botbuilder";
import * as stjs from "stjs";

export function renderACAttachment(template: any, data: any): builder.AttachmentType {
    // ToDo:
    // 1. Optionally validate that the schema is valid (postponed as there are tool/schema issues)

    // Pre-process the template so that template placeholders don't show up for null data values
    // Regex: Find everything between {{}} and prepend "#? " to it
    template = JSON.parse(JSON.stringify(template).replace(/{{(.+?)}}/g, "{{#? $1}}"));

    // No error handling in the call to stjs functions - what you pass in may be garbage, but it always returns a value
    let ac = stjs.select(data)
        .transformWith(template)
        .root();
    return {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: ac,
    };
}
