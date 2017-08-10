import * as express from "express";
// import * as config from "config";
import * as builder from "botbuilder";
import { MongoDbTagStorage, ConversationEntry } from "../storage/MongoDbTagStorage";
import { loadSessionAsync_New } from "../utils/DialogUtils";
import { SOEnterpriseAPI, renderTags } from "../apis/SOEnterpriseAPI";
import * as o365card from "../utils/O365ConnectorCard";
import { Strings } from "../locale/locale";

export class RunNotificationJob {
    public static runNotificationJob(bot: builder.UniversalBot): express.RequestHandler {
        return async function (req: any, res: any, next: any): Promise<void> {
            try {
                if (req.query.tag) {
                    RunNotificationJob.tagNameNotification(bot, req, res, next);
                } else if (req.query.timestamp) {
                    RunNotificationJob.timestampNotification(bot, req, res, next);
                } else {
                    RunNotificationJob.noNotificationResponse(req, res, next);
                }
            } catch (e) {
                // Don't log expected errors - error is probably from there not being example dialogs
                RunNotificationJob.respondWithError(req, res, next);
            }
        };
    }

    private static async tagNameNotification(bot: builder.UniversalBot, req: any, res: any, next: any): Promise<void> {
        let tagStorage = await MongoDbTagStorage.createConnection();
        let tagEntry = await tagStorage.getTagAsync(req.query.tag);
        await tagStorage.close();

        for (let i = 0; i < tagEntry.conversationEntries.length; i++) {
            let currConversationEntry = tagEntry.conversationEntries[i];
            let currSession = await loadSessionAsync_New(
                    bot,
                    currConversationEntry.conversationId,
                    currConversationEntry.serviceUrl,
                    currConversationEntry.locale,
                );
            currSession.send("Hi! I just notified you because of tag " + req.query.tag);
        }

        let htmlPage = `<!DOCTYPE html>
            <html>
            <head>
                <title>Bot Info</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <h1>
                    Notification Job ran successfully with tag: ${req.query.tag}
                </h1>
            </body>
            </html>`;

        res.send(htmlPage);
    }

    private static async timestampNotification(bot: builder.UniversalBot, req: any, res: any, next: any): Promise<void> {
        let timestamp = req.query.timestamp;
        let soeAPI = new SOEnterpriseAPI();
        // let body = await soeAPI.getNewQuestions(timestamp, session);
        // null as session for now with hack to always use global credentials
        let body = await soeAPI.getNewQuestions(timestamp, null);
        if (!body) {
            RunNotificationJob.respondWithError(req, res, next);
            return;
        }

        let questions: any = body.items;
        let tagStorage = await MongoDbTagStorage.createConnection();
        for (let q of questions) {
            // map will be of entries <conversationEntry.conversationId, conversationEntry>
            let conversationEntriesToNotify = new Map<string, ConversationEntry>();
            for (let tag of q.tags) {
                let currTag = tag.toLowerCase();
                let tagEntry = await tagStorage.getTagAsync(currTag);
                for (let i = 0; i < tagEntry.conversationEntries.length; i++) {
                    let currConversationEntry = tagEntry.conversationEntries[i];
                    if (!conversationEntriesToNotify.has(currConversationEntry.conversationId)) {
                        conversationEntriesToNotify.set(
                            currConversationEntry.conversationId,
                            currConversationEntry,
                        );
                    }
                }
            }

            for (let conversationEntry of conversationEntriesToNotify) {
                // the actual conversationEntry is the value, index 1, of each map entry
                let currConversationEntry = conversationEntry[1];
                let currSession = await loadSessionAsync_New(
                        bot,
                        currConversationEntry.conversationId,
                        currConversationEntry.serviceUrl,
                        currConversationEntry.locale,
                    );

                let msg = new builder.Message(currSession)
                    .textFormat(builder.TextFormat.markdown)
                    .attachments([
                        new o365card.O365ConnectorCard(currSession)
                            .title(q.title)
                            .sections(
                                o365card.O365ConnectorCardSection.create(
                                    currSession,
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
                                new o365card.O365ConnectorCardViewAction(currSession)
                                    .name(Strings.view_so_question_label)
                                    .target(q.link),
                            ]),
                    ]);
                currSession.send(msg);
            }
        }
        await tagStorage.close();

        let htmlPage = `<!DOCTYPE html>
            <html>
            <head>
                <title>Bot Info</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <h1>
                    Notification Job ran successfully with timestamp: ${req.query.timestamp}
                </h1>
                <p>
                    Response from Stack Overflow:<br><br>
                    ${JSON.stringify(body)}
                </p>
            </body>
            </html>`;

        res.send(htmlPage);
    }

    private static async noNotificationResponse(req: any, res: any, next: any): Promise<void> {
        let htmlPage = `<!DOCTYPE html>
            <html>
            <head>
                <title>Bot Info</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <h1>
                    No tag or timestamp query param entered - no notifications sent.
                </h1>
            </body>
            </html>`;

        res.send(htmlPage);
    }

    private static async respondWithError(req: any, res: any, next: any): Promise<void> {
        res.send(`<html>
                    <body>
                    <p>
                        Sorry.  There are no example dialogs to display.
                    </p>
                    <br>
                    <img src="/tab/error_generic.png" alt="default image" />
                    </body>
                    </html>`);
    }
}
