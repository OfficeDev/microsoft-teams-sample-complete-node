
import * as constants from "../../constants";
import { renderACAttachment } from "../../utils/CardUtils";
import * as config from "config";

// Function that works both in Node (where window === undefined) or the browser
export function appRoot(): string {
    if (typeof window === "undefined") {
        return config.get("app.baseUri");
    } else {
        return window.location.protocol + "//" + window.location.host;
    }
}

export const cardTemplates: any = {
    adaptiveCard: {
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "separator": true,
                "size": "Large",
                "weight": "Bolder",
                "text": "Enter Command:",
                "isSubtle": true,
                "wrap": true,
            },
            {
                "type": "Input.Text",
                "id": "commandToBot",
                "placeholder": "E.g. timezone",
            },
        ],
        "actions": [
            {
                "type": "Action.Submit",
                "id": "postCommand",
                "title": "Post Command",
                "data": {
                   "taskResponse": "{{responseType}}",
                },
            },
            {
                "type": "Action.Submit",
                "id": "cancel",
                "title": "Cancel",
            },
        ],
        "version": "1.0",
    },
    adaptiveCardSubmitResponse: {
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "weight": "Bolder",
                "text": "Action.Submit Results",
            },
            {
                "type": "TextBlock",
                "separator": true,
                "size": "Medium",
                "text": "{{results}}",
                "wrap": true,
            },
        ],
        "actions": [
            {
                "type": "Action.Submit",
                "title": "OK",
                "data": {
                    "taskResponse": "final",
                    "taskModule": "acResponse",
                },
            },
        ],
        "version": "1.0",
    },
};

export const fetchTemplates: any = {
    adaptivecardsinglestep: {
        "task": {
            "type": "continue",
            "value": {
                "title": constants.TaskModuleTitles.AdaptiveCardSingleStepTitle,
                "height": constants.TaskModuleSizes.adaptivecard.height,
                "width": constants.TaskModuleSizes.adaptivecard.width,
                // Below wraps it as a builder.Attachment
                "card": renderACAttachment(cardTemplates.adaptiveCard, { responseType: "message" }),
            },
        },
    },
    adaptivecardmultistep: {
        "task": {
            "type": "continue",
            "value": {
                "title": constants.TaskModuleTitles.AdaptiveCardMultiStepTitle,
                "height": constants.TaskModuleSizes.adaptivecard.height,
                "width": constants.TaskModuleSizes.adaptivecard.width,
                "fallbackUrl": null,
                // Below wraps it as a builder.Attachment
                "card": renderACAttachment(cardTemplates.adaptiveCard, { responseType: "continue" }),
            },
        },
    },

    singlestephtmlcard: {
        "task": {
            "type": "continue",
            "value": {
                "title": constants.TaskModuleTitles.SingleStepHtmlCardTitle,
                "height": constants.TaskModuleSizes.customform.height,
                "width": constants.TaskModuleSizes.customform.width,
                "fallbackUrl": `${appRoot()}/${constants.TaskModuleIds.CustomForm}?type=singlestep`,
                "url": `${appRoot()}/${constants.TaskModuleIds.CustomForm}?type=singlestep`,
            },
        },
    },
    multistephtmlcard: {
        "task": {
            "type": "continue",
            "value": {
                "title": constants.TaskModuleTitles.MultistepHtmlCardTitle,
                "height": constants.TaskModuleSizes.customform.height,
                "width": constants.TaskModuleSizes.customform.width,
                "fallbackUrl": `${appRoot()}/${constants.TaskModuleIds.CustomForm}?type=multistep`,
                "url": `${appRoot()}/${constants.TaskModuleIds.CustomForm}?type=multistep`,
            },
        },
    },
    submitMessageResponse: {
        "task": {
            "type": "message",
            "value": "Task completed!",
        },
    },

    submitResponse: {
        "task": {
            "type": "continue",
            "value": {
                "title": constants.TaskModuleTitles.ActionSubmitResponseTitle,
                "height": "small",
                "width": "medium",
                "card": {},
            },
        },
    },
};
