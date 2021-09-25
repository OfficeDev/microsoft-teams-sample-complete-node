import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";

export class TaskModuleAdaptiveCardDialog extends TriggerActionDialog {
    private static async sendAdaptiveCard(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        // Check for the property in the value set by the adaptive card submit action
        if (session.message.value && session.message.value.isFromAdaptiveCard)
        {
            session.send(JSON.stringify(session.message.value));
        } else { // create new adaptive card
            let adaptiveCardMessage = new builder.Message(session)
                .addAttachment(TaskModuleAdaptiveCardDialog.getAdaptiveCardAttachment());
            session.send(adaptiveCardMessage);
        }
    }

    // Get the adaptive card attachment
    private static getAdaptiveCardAttachment(): any {
        let adaptiveCardJson = {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
                type: "AdaptiveCard",
                version: "1.0",
                body: [
                    {
                        type : "Container",
                        items:
                        [
                            {
                                type: "TextBlock",
                                size: "large",
                                weight: "bolder",
                                color: null,
                                isSubtle: false,
                                text: "Task Module Adaptive Card!",
                                horizontalAlignment: "left",
                                wrap: false,
                                maxLines: 0,
                                speak: "<s>Adaptive card!</s>",
                                separation: null,
                            },
                        ],
                    },
                ],
                actions: [
                    {
                        type: "Action.Submit",
                        title: "Invoke Task Module(Adaptive Card) -single step",
                        id: "adaptivecardSingleStep",
                        data: {
                            "msteams": {
                                  "type": "task/fetch",
                              },
                              "taskModule": "adaptivecardsinglestep",
                        },
                    },

                    {
                        type: "Action.Submit",
                        title: "Invoke Task Module(Adaptive Card) -Multi step",
                        id: "adaptivecardmultistep",
                        data: {
                          "msteams": {
                                "type": "task/fetch",
                            },
                            "taskModule": "adaptivecardMultiStep",
                        },
                    },
                    {
                        type: "Action.Submit",
                        title: "Invoke Task Module(Html) -Single step",
                        id: "singlestephtmlcard",
                        data: {
                            "msteams": {
                                  "type": "task/fetch",
                              },
                              "taskModule": "singlestephtmlcard",
                        },
                    },

                    {
                        type: "Action.Submit",
                        title: "Invoke Task Module(Html) -Multi step",
                        id: "multistephtmlcard",
                        data: {
                            "msteams": {
                                "type": "task/fetch",
                            },
                            "taskModule": "multistephtmlcard",
                        },
                    },
                ],
            },
        };
        return adaptiveCardJson;
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.TaskModuleAdaptiveCardId,
            [
                DialogMatches.TaskModuleAdaptiveCardDialogMatch,
            ],
            TaskModuleAdaptiveCardDialog.sendAdaptiveCard,
        );
    }
}
