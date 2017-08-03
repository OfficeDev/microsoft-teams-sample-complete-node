import * as builder from "botbuilder";
import { TriggerActionDialog } from "../utils/TriggerActionDialog";
import { DialogIds } from "../utils/DialogIds";
import { DialogMatches } from "../utils/DialogMatches";
import { Strings } from "../locale/locale";
import { SOEnterpriseAPI, renderTags } from "../apis/SOEnterpriseAPI";
import * as o365card from "../utils/O365ConnectorCard";

export class SOEShowQuestionsDialog extends TriggerActionDialog {

    // private static async o365ConnectorTest(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
    //     let msg = new builder.Message(session)
    //         .textFormat(builder.TextFormat.markdown);
    //     msg.attachments([
    //         new o365card.O365ConnectorCard(session)
    //             .title("This is the card title")
    //             .text("This is the **card's text** property. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
    //             .themeColor("good")
    //             .sections([
    //                 o365card.O365ConnectorCardSection.create(session,
    //                     "Section title", "Activity text with `markdown`", "Activity title", "http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg", "Activity subtitle", "Activity text",
    //                     ["http://connectorsdemo.azurewebsites.net/images/WIN12_Scene_01.jpg", "http://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAoRTeZ.img?h=450&w=540&m=6&q=60&u=t&o=t&l=f&f=jpg&x=1291&y=1012"],
    //                     ["name1", "value1", "name2", "value2", "name3"]),
    //                 o365card.O365ConnectorCardSection.create(session, "Section Two!!", "Activity text with **even more** `markdown`", "Activity title", "", "Activity subtitle", "Activity text"),
    //             ]),
    //     ]);
    //     session.send(msg);
    //     session.endDialog();
    // }

    private static async promptForTimestamp(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        builder.Prompts.text(session, Strings.prompt_for_timestamp);
    }

    private static async showQuestions(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
        let timestamp = args.response.trim();
        let soeAPI = new SOEnterpriseAPI();
        let body = await soeAPI.getNewQuestions(timestamp, session);
        if (!body) {
            session.endDialog();
            // return is needed because endDialog does not quit out of function
            return;
        }

        let questions: any = body.items;
        for (let q of questions) {
            let msg = new builder.Message(session)
                .textFormat(builder.TextFormat.markdown)
                .attachments([
                    new o365card.O365ConnectorCard(session)
                        .title(q.title)
                        .sections(
                            o365card.O365ConnectorCardSection.create(session,
                                null, // section title
                                q.body, // section text
                                `[${q.owner.display_name}](${q.owner.link})`, // activityTitle
                                q.owner.profile_image, // activityImage
                                null, // activitySubtitle
                                null, // activityText
                                null, // images
                                [ "Tags", renderTags(q.tags), "Answered:", String(q.is_answered), "# answers:", String(q.answer_count) ], // facts
                                // tslint:disable-next-line:trailing-comma
                            )
                        )
                        .potentialAction([
                            new o365card.O365ConnectorCardViewAction(session)
                                .name(Strings.view_so_question_label)
                                .target(q.link),
                        ]),
                ]);
            session.send(msg);
        }
        session.endDialog();
    }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.SOEShowQuestionsId,
            DialogMatches.SOEShowQuestionsMatch,
            [
                // SOEShowQuestionsDialog.o365ConnectorTest,
                SOEShowQuestionsDialog.promptForTimestamp,
                SOEShowQuestionsDialog.showQuestions,
            ],
        );
    }
}
