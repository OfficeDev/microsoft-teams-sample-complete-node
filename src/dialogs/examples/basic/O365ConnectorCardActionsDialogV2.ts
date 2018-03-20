import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
import * as teams from "botbuilder-teams";

export class O365ConnectorCardActionsDialogV2 extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        // multiple choice examples
        let cardAction1 = new teams.O365ConnectorCardActionCard(session)
                            .id("CardsTypesection1")
                            .name(Strings.multiple_choice)
                            .inputs([
                                new teams.O365ConnectorCardMultichoiceInput(session)
                                    .id("list-1")
                                    .title(Strings.combo_box_title)
                                    .isMultiSelect(true)
                                    .isRequired(false)
                                    .style("compact")
                                    .choices([
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Hero Card").value("Hero Card"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Thumbnail Card").value("Thumbnail Card"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("O365 Connector Card").value("O365 Connector Card"),
                                    ]),
                                new teams.O365ConnectorCardMultichoiceInput(session)
                                    .id("list-2")
                                    .title(Strings.pick_a_time)
                                    .isMultiSelect(true)
                                    .isRequired(false)
                                    .style("compact")
                                    .choices([
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Bot").value("Bot"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Tab").value("Tab"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Connector").value("Connector"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Compose Extension").value("Compose Extension"),
                                    ]),
                                new teams.O365ConnectorCardMultichoiceInput(session)
                                    .id("list-3")
                                    .title(Strings.pick_a_time)
                                    .isMultiSelect(false)
                                    .style("compact")
                                    .choices([
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Bot").value("Bot"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Tab").value("Tab"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Connector").value("Connector"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Compose Extension").value("Compose Extension"),
                                    ]),
                                new teams.O365ConnectorCardMultichoiceInput(session)
                                    .id("list-4")
                                    .title(Strings.pick_a_time)
                                    .isMultiSelect(false)
                                    .style("compact")
                                    .choices([
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Bot").value("Bot"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Tab").value("Tab"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Connector").value("Connector"),
                                        new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Compose Extension").value("Compose Extension"),
                                    ]),
                            ])
                            .actions([
                                new teams.O365ConnectorCardHttpPOST(session)
                                    .id("cardAction-1-btn-1")
                                    .name(Strings.send)
                                    .body(JSON.stringify({
                                        list1: "{{list-1.value}}",
                                        list2: "{{list-2.value}}",
                                        list3: "{{list-3.value}}",
                                        list4: "{{list-4.value}}",
                                    })),
                            ]);

        // text input examples
        let cardAction3 = new teams.O365ConnectorCardActionCard(session)
                            .id("cardAction-3")
                            .name(Strings.text_input)
                            .inputs([
                                new teams.O365ConnectorCardTextInput(session)
                                    .id("Input Card")
                                    .title(Strings.text_box_title)
                                    .isMultiline(true),
                            ])
                            .actions([
                                new teams.O365ConnectorCardHttpPOST(session)
                                    .id("cardAction-3-btn-1")
                                    .name(Strings.send)
                                    .body(JSON.stringify({
                                        text1: "{{text-1.value}}",
                                    })),
                            ]);

        let section1 = new teams.O365ConnectorCardSection(session)
                        .markdown(true)
                        .text("")
                        .potentialAction([cardAction1, cardAction3]);
        let card = new teams.O365ConnectorCard(session)
                        .summary(Strings.o365_card_summary)
                        .themeColor("#E67A9E")
                        .title(Strings.work_today)
                        .text("")
                        .sections([section1]);

        let msg = new teams.TeamsMessage(session)
                    .summary(Strings.message_summary)
                    .attachments([card]);

        session.send(msg);
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.O365ConnectorCardActionsDialogV2Id,
            DialogMatches.O365ConnectorCardActionsDialogV2Match,
            O365ConnectorCardActionsDialogV2.step1,
        );
    }
}
