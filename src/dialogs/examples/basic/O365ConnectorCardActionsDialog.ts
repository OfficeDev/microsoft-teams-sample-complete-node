import * as builder from "botbuilder";
import { TriggerActionDialog } from "../../../utils/TriggerActionDialog";
import { DialogIds } from "../../../utils/DialogIds";
import { DialogMatches } from "../../../utils/DialogMatches";
import { Strings } from "../../../locale/locale";
import * as teams from "botbuilder-teams";
let config = require("config");

export class O365ConnectorCardActionsDialog extends TriggerActionDialog {

    private static async step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let choice = session.gettext(Strings.choice);

        // get the input number for the example to show if the user passed it into the command - e.g. 'show connector card 2'
        let inputNumber = args.intent.matched[1].trim();

        // this is the default example's content
        // multiple choice examples
        let cardAction1 =
            new teams.O365ConnectorCardActionCard(session)
                .id("cardAction-1")
                .name(Strings.multiple_choice)
                .inputs([
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-1")
                        .title(Strings.pick_multiple_options)
                        .isMultiSelect(true)
                        .isRequired(true)
                        .style("expanded")
                        .choices([
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display(choice + " 1").value("1"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display(choice + " 2").value("2"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display(choice + " 3").value("3"),
                            ]),
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-2")
                        .title(Strings.pick_multiple_options)
                        .isMultiSelect(true)
                        .isRequired(true)
                        .style("compact")
                        .choices([
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display(choice + " 4").value("4"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display(choice + " 5").value("5"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display(choice + " 6").value("6"),
                            ]),
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-3")
                        .title(Strings.pick_an_option)
                        .isMultiSelect(false)
                        .style("expanded")
                        .choices([
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display(choice + " a").value("a"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display(choice + " b").value("b"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display(choice + " c").value("c"),
                            ]),
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-4")
                        .title(Strings.pick_an_option)
                        .isMultiSelect(false)
                        .style("compact")
                        .choices([
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display(choice + " x").value("x"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display(choice + " y").value("y"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display(choice + " z").value("z"),
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
        let cardAction2 =
            new teams.O365ConnectorCardActionCard(session)
                .id("cardAction-2")
                .name(Strings.text_input)
                .inputs([
                    new teams.O365ConnectorCardTextInput(session)
                        .id("text-1")
                        .title(Strings.multiline_no_max)
                        .isMultiline(true),
                    new teams.O365ConnectorCardTextInput(session)
                        .id("text-2")
                        .title(Strings.singleline_no_max)
                        .isMultiline(false),
                    new teams.O365ConnectorCardTextInput(session)
                        .id("text-3")
                        .title(Strings.multiline_max_ten)
                        .isMultiline(true)
                        .isRequired(true)
                        .maxLength(10),
                    new teams.O365ConnectorCardTextInput(session)
                        .id("text-4")
                        .title(Strings.singleline_max_ten)
                        .isMultiline(false)
                        .isRequired(true)
                        .maxLength(10),
                        ])
                .actions([
                    new teams.O365ConnectorCardHttpPOST(session)
                        .id("cardAction-2-btn-1")
                        .name(Strings.send)
                        .body(JSON.stringify({
                            text1: "{{text-1.value}}",
                            text2: "{{text-2.value}}",
                            text3: "{{text-3.value}}",
                            text4: "{{text-4.value}}",
                            })),
                        ]);
        // date / time input examples
        let cardAction3 =
            new teams.O365ConnectorCardActionCard(session)
                .id("cardAction-3")
                .name(Strings.date_input)
                .inputs([
                    new teams.O365ConnectorCardDateInput(session)
                        .id("date-1")
                        .title(Strings.date_with_time)
                        .includeTime(true)
                        .isRequired(true),
                    new teams.O365ConnectorCardDateInput(session)
                        .id("date-2")
                        .title(Strings.date_only)
                        .includeTime(false)
                        .isRequired(false),
                    ])
                .actions([
                    new teams.O365ConnectorCardHttpPOST(session)
                        .id("cardAction-3-btn-1")
                        .name(Strings.send)
                        .body(JSON.stringify({
                            date1: "{{date-1.value}}",
                            date2: "{{date-2.value}}",
                        })),
                    ]);
        let section =
            new teams.O365ConnectorCardSection(session)
                .markdown(true)
                .title(Strings.section_title)
                .text(Strings.section_text)
                .activityTitle(Strings.activity_title)
                .activitySubtitle(Strings.activity_subtitle)
                .activityImage("http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg")
                .activityText(Strings.activity_text)
                .facts([
                    new teams.O365ConnectorCardFact(session).name(Strings.fact_name_1).value(Strings.fact_value_1),
                    new teams.O365ConnectorCardFact(session).name(Strings.fact_name_2).value(Strings.fact_value_2),
                    ])
                .images([
                    new teams.O365ConnectorCardImage(session).title(Strings.image_one).image("http://connectorsdemo.azurewebsites.net/images/WIN12_Anthony_02.jpg"),
                    new teams.O365ConnectorCardImage(session).title(Strings.image_two).image("http://connectorsdemo.azurewebsites.net/images/WIN12_Scene_01.jpg"),
                    new teams.O365ConnectorCardImage(session).title(Strings.image_three).image("http://connectorsdemo.azurewebsites.net/images/WIN12_Anthony_02.jpg"),
                    ]);
        let card =
            new teams.O365ConnectorCard(session)
                .summary(Strings.o365_card_summary)
                .themeColor("#E67A9E")
                .title(Strings.card_title)
                .text(Strings.card_text)
                .sections([section])
                .potentialAction([
                    cardAction1,
                    cardAction2,
                    cardAction3,
                    new teams.O365ConnectorCardViewAction(session)
                        .name(Strings.view_action)
                        .target("http://microsoft.com"),
                    new teams.O365ConnectorCardOpenUri(session)
                        .id("open-uri")
                        .name(Strings.open_uri)
                        .default("http://microsoft.com")
                        .iOS("http://microsoft.com")
                        .android("http://microsoft.com")
                        .windowsPhone("http://microsoft.com"),
                        ]);
        // multisection example with multiple choice, text box and date
        if (inputNumber === "1")
        {
        // multiple choice examples
        cardAction1 =
            new teams.O365ConnectorCardActionCard(session)
                .id("CardsTypeSection1")
                .name(Strings.multiple_choice)
                .inputs([
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-1")
                        .title(Strings.pick_a_app)
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
                        .title(Strings.pick_a_card)
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
                        .title(Strings.pick_a_card)
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
                        .title(Strings.pick_a_card)
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
        let section1 =
            new teams.O365ConnectorCardSection(session)
                .markdown(true)
                .title(Strings.section_title1)
                .potentialAction([cardAction1]);
        cardAction2 =
            new teams.O365ConnectorCardActionCard(session)
                .id("CardsTypeSection2")
                .name(Strings.multiple_choice)
                .inputs([
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-5")
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
                        .id("list-6")
                        .title(Strings.pick_a_card)
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
                        .id("list-7")
                        .title(Strings.pick_a_card)
                        .isMultiSelect(false)
                        .style("compact")
                        .choices([
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Bot").value("Bot"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Tab").value("Tab"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Connector").value("Connector"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Compose Extension").value("Compose Extension"),
                            ]),
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-8")
                        .title(Strings.pick_a_card)
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
                        .id("cardAction-1-btn-2")
                        .name(Strings.send)
                        .body(JSON.stringify({
                            list5: "{{list-5.value}}",
                            list6: "{{list-6.value}}",
                            list7: "{{list-7.value}}",
                            list8: "{{list-8.value}}",
                            })),
                        ]);
        // text input examples
        cardAction3 =
            new teams.O365ConnectorCardActionCard(session)
                .id("cardAction-3")
                .name(Strings.text_input)
                .inputs([
                    new teams.O365ConnectorCardTextInput(session)
                        .id("text-1")
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
        // date / time input examples
        let cardAction4 =
            new teams.O365ConnectorCardActionCard(session)
                .id("cardAction-4")
                .name(Strings.date_input)
                .inputs([
                    new teams.O365ConnectorCardDateInput(session)
                        .id("date-1")
                        .title(Strings.default_title)
                        .includeTime(false)
                        .isRequired(false),
                        ])
                .actions([
                    new teams.O365ConnectorCardHttpPOST(session)
                        .id("cardAction-4-btn-1")
                        .name(Strings.send)
                        .body(JSON.stringify({
                            date1: "{{date-1.value}}",
                        })),
                    ]);
        let section2 =
            new teams.O365ConnectorCardSection(session)
                .markdown(true)
                .title(Strings.section_title2)
                .potentialAction([cardAction2, cardAction3, cardAction4]);
        card =
            new teams.O365ConnectorCard(session)
                .summary(Strings.o365_card_summary)
                .themeColor("#E67A9E")
                .title(Strings.actionable_card_title)
                .sections([section1, section2]);
        }
        // section example with multiple choice and text box
        if (inputNumber === "2")
        {
        // multiple choice examples
        cardAction1 =
            new teams.O365ConnectorCardActionCard(session)
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
                        .title(Strings.pick_a_card)
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
                        .title(Strings.pick_a_card)
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
                        .title(Strings.pick_a_card)
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
        cardAction3 =
            new teams.O365ConnectorCardActionCard(session)
                .id("cardAction-3")
                .name(Strings.text_input)
                .inputs([
                    new teams.O365ConnectorCardTextInput(session)
                        .id("text-1")
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
        let section1 =
            new teams.O365ConnectorCardSection(session)
                .markdown(true)
                .potentialAction([cardAction1, cardAction3]);
        card =
            new teams.O365ConnectorCard(session)
                .summary(Strings.o365_card_summary)
                .themeColor("#E67A9E")
                .title(Strings.actionable_card_title)
                .sections([section1]);
        }
        // multisection example with expanded multiple choice, compact multiple choice, section title, section image, required example
        if (inputNumber === "3")
        {
        // multiple choice examples
        cardAction1 =
            new teams.O365ConnectorCardActionCard(session)
                .id("CardsTypesection1")
                .name(Strings.multiple_choice)
                .inputs([
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-1")
                        .title(Strings.pick_multiple_options)
                        .isMultiSelect(true)
                        .isRequired(true)
                        .style("expanded")
                        .choices([
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Hero Card").value("Hero Card"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Thumbnail Card").value("Thumbnail Card"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("O365 Connector Card").value("O365 Connector Card"),
                                ]),
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-2")
                        .title(Strings.pick_multiple_options)
                        .isMultiSelect(true)
                        .isRequired(true)
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
                            })),
                        ]);
        let baseUri = config.get("app.baseUri");
        let imageUrl = baseUri + "/public/assets/ActionableCardIconImage.png";
        let section1 =
            new teams.O365ConnectorCardSection(session)
                .markdown(true)
                .activityTitle(Strings.actionable_message_section1)
                .activityImage(imageUrl)
                .activityText(Strings.actionable_message_section1_text)
                .potentialAction([cardAction1]);
        cardAction2 =
            new teams.O365ConnectorCardActionCard(session)
                .id("CardsTypesection2")
                .name(Strings.multiple_choice)
                .inputs([
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-5")
                        .title(Strings.pick_multiple_options)
                        .isMultiSelect(true)
                        .isRequired(true)
                        .style("expanded"),
                    ])
                .actions([
                    new teams.O365ConnectorCardHttpPOST(session)
                        .id("cardAction-1-btn-2")
                        .name(Strings.send)
                        .body(JSON.stringify({
                            list5: "{{list-5.value}}",
                        })),
                    ]);
        let blank =
            new teams.O365ConnectorCardSection(session)
                .markdown(true)
                .title("----------------------------------------------------------------------------------------------------------------------------------------")
                .text("")
                .potentialAction([cardAction2]);
        cardAction3 =
            new teams.O365ConnectorCardActionCard(session)
                .id("CardsTypesection2")
                .name(Strings.multiple_choice)
                .inputs([
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-5")
                        .title(Strings.combo_box_title)
                        .isMultiSelect(true)
                        .isRequired(true)
                        .style("compact")
                        .choices([
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Hero Card").value("Hero Card"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Thumbnail Card").value("Thumbnail Card"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("O365 Connector Card").value("O365 Connector Card"),
                            ]),
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-6")
                        .title(Strings.pick_a_card)
                        .isMultiSelect(true)
                        .isRequired(true)
                        .style("compact")
                        .choices([
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Bot").value("Bot"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Tab").value("Tab"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Connector").value("Connector"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Compose Extension").value("Compose Extension"),
                                ]),
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-7")
                        .title(Strings.pick_a_card)
                        .isMultiSelect(false)
                        .style("compact")
                        .choices([
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Bot").value("Bot"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Tab").value("Tab"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Connector").value("Connector"),
                            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Compose Extension").value("Compose Extension"),
                            ]),
                    new teams.O365ConnectorCardMultichoiceInput(session)
                        .id("list-8")
                        .title(Strings.pick_a_card)
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
                        .id("cardAction-1-btn-2")
                        .name(Strings.send)
                        .body(JSON.stringify({
                            list5: "{{list-5.value}}",
                            list6: "{{list-6.value}}",
                            list7: "{{list-7.value}}",
                            list8: "{{list-8.value}}",
                            })),
                        ]);
        // text input examples
        let cardAction4 =
            new teams.O365ConnectorCardActionCard(session)
                .id("cardAction-3")
                .name(Strings.text_input)
                .inputs([
                    new teams.O365ConnectorCardTextInput(session)
                        .id("text-1")
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
        // date / time input examples
        let cardAction5 =
            new teams.O365ConnectorCardActionCard(session)
                .id("cardAction-4")
                .name(Strings.date_input)
                .inputs([
                    new teams.O365ConnectorCardDateInput(session)
                        .id("date-1")
                        .title(Strings.default_title)
                        .includeTime(true)
                        .isRequired(true),
                       ])
                .actions([
                    new teams.O365ConnectorCardHttpPOST(session)
                        .id("cardAction-4-btn-1")
                        .name(Strings.send)
                        .body(JSON.stringify({
                            date1: "{{date-1.value}}",
                        })),
                    ]);
        let section2 =
            new teams.O365ConnectorCardSection(session)
                .markdown(true)
                .activityTitle(Strings.actionable_message_section2)
                .activityText(Strings.actionable_message_section2_text)
                .potentialAction([cardAction3, cardAction4, cardAction5]);
        card =
            new teams.O365ConnectorCard(session)
                .summary(Strings.o365_card_summary)
                .themeColor("#E67A9E")
                .title(Strings.actionable_card_title)
                .sections([section1, blank, section2]);
        }

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
            DialogIds.O365ConnectorCardActionsDialogId,
            DialogMatches.O365ConnectorCardActionsDialogMatch,
            O365ConnectorCardActionsDialog.step1,
        );
    }
}
