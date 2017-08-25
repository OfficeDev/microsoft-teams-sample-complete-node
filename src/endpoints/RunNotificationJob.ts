import * as express from "express";
import { SOEBot } from "../SOEBot";
// import { MongoDbTagStorage, NotificationEntry } from "../storage/MongoDbTagStorage";
import { NotificationEntry } from "../storage/MongoDbTagStorage";
import { loadSessionAsync_New } from "../utils/DialogUtils";
import { SOEnterpriseAPI } from "../apis/SOEnterpriseAPI";
import { DialogIds } from "../utils/DialogIds";
import { UpdateEntry } from "../storage/MongoDbSOEQuestionStorage";

export class RunNotificationJob {
    public static runNotificationJob(bot: SOEBot): express.RequestHandler {
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

    private static async tagNameNotification(bot: SOEBot, req: any, res: any, next: any): Promise<void> {
        // let tagStorage = await MongoDbTagStorage.createConnection();
        let tagStorage = bot.getTagStorage();
        let tagEntry = await tagStorage.getTagAsync(req.query.tag.toLowerCase());
        // await tagStorage.close();

        for (let i = 0; i < tagEntry.notificationEntries.length; i++) {
            let currNotificationEntry = tagEntry.notificationEntries[i];
            let currSession = await loadSessionAsync_New(
                    bot,
                    currNotificationEntry.conversationId,
                    currNotificationEntry.serviceUrl,
                    currNotificationEntry.locale,
                );

            currSession.beginDialog(DialogIds.SendSimpleTagNotificationDialogId, { tagName: req.query.tag });
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

    private static async timestampNotification(bot: SOEBot, req: any, res: any, next: any): Promise<void> {
        let timestamp = req.query.timestamp;
        let soeAPI = new SOEnterpriseAPI();
        let body = await soeAPI.getNewAndUpdatedQuestions(timestamp, null, true);
        if (!body) {
            RunNotificationJob.respondWithError(req, res, next);
            return;
        }

        let questions: any = body.items;
        // let tagStorage = await MongoDbTagStorage.createConnection();
        // let soeQuestionStorage = await MongoDbSOEQuestionStorage.createConnection();
        // let promisesOfCompletion = new Array<Promise<void>>();
        let tagStorage = bot.getTagStorage();
        let soeQuestionStorage = bot.getSOEQuestionStorage();

        // HERE IS WHERE WE NEED THROTTLING BY BATCHING TO 7 QUESTIONS EACH
        for (let q of questions) {
            // let currentPromise = new Promise<void>(async (resolve, reject) => {
                // This logic is to create a map that is a unified list, based on the question's tags, of which conversation.ids should
                // be notified
                // map will be of entries <notificationEntry.conversationId, notificationEntry>
                let notificationEntriesToNotifyMap = new Map<string, NotificationEntry>();
                for (let tag of q.tags) {
                    let currTag = tag.toLowerCase();
                    let tagEntry = await tagStorage.getTagAsync(currTag);
                    for (let i = 0; i < tagEntry.notificationEntries.length; i++) {
                        let currNotificationEntry = tagEntry.notificationEntries[i];
                        if (!notificationEntriesToNotifyMap.has(currNotificationEntry.conversationId)) {
                            notificationEntriesToNotifyMap.set(
                                currNotificationEntry.conversationId,
                                currNotificationEntry,
                            );
                        }
                    }
                }

                // at this point we have a combined list of all conversation.ids that want to be notified based on the tags of the question
                // we now need to see, from that list, who has already been notified about this question and who has not been notified about it
                // if they have been notified, then they will get an update to their previous notification (1:1 chat may still get a new notification saying "Updated")
                // if they haven't been notified, then they will get a new notification

                let questionId = q.question_id;
                let currSOEQuestionEntry = await soeQuestionStorage.getSOEQuestionAsync(questionId, q);

                // need to finale lists of who has already been notified and needs an entry updated and who needs a new notification
                // list for those needing update is updateEntriesNeedingUpdate
                // list for those needing a new notification is notificationEntriesToNotifyMap
                let updateEntriesNeedingUpdate = new Array<UpdateEntry>();
                for (let currUpdateEntry of currSOEQuestionEntry.updateEntries) {
                    if (!notificationEntriesToNotifyMap.has(currUpdateEntry.notificationEntryConversationId)) {
                        // this is a situation of a conversation.id that used to be following it and now no longer is
                        // do not add the currUpdateEntry to the updateEntriesNeedingUpdate
                        // NOTE: we should consider using this as an opportunity to delete this from the updateEntries[], the question we need to ask
                        // is what happens if they start following the tag again? If we do remove it here, then we probably need a new list which we would
                        // overwrite the currSOEQuestionEntry.updateEntries array with so that when we pass it to SendSOEQuestionNotificationDialog, it
                        // has the proper list to save
                    } else {
                        // this means notificationEntriesToNotifyMap.has(currUpdateEntry.conversationId) is true
                        // this means we have a notification to update and there is still some tag that conversation is following
                        // this means we need to update an already existing notification so add to updateEntriesNeedingUpdate
                        // this is a full copy, but I don't think we need this
                        // updateEntriesNeedingUpdate.push({
                        //     messageId: currUpdateEntry.messageId,
                        //     conversationId: currUpdateEntry.conversationId,
                        //     serviceUrl: currUpdateEntry.serviceUrl,
                        //     locale: currUpdateEntry.locale,
                        //     isChannel: currUpdateEntry.isChannel,
                        //     notificationEntryConversationId: currUpdateEntry.notificationEntryConversationId,
                        // });
                        updateEntriesNeedingUpdate.push(currUpdateEntry);
                        // this also means that conversation.id does not need a new notification sent so remove from list
                        notificationEntriesToNotifyMap.delete(currUpdateEntry.notificationEntryConversationId);
                    }
                }

                // at this point the remaining entries in notificationEntriesToNotifyMap are the NotificationEntry that need to be sent a new message
                // and updateEntriesNeedingUpdate holds an array of UpdateEntry that need to be updated

                // let resolvePromiseCallback = () => {
                //     resolve();
                // };
                let needToSaveQuestion = false;

                // this loop is used to notify the conversations that need to be sent a new message
                for (let notificationEntryMapEntry of notificationEntriesToNotifyMap) {
                    // the actual notificationEntry is the value, index 1, of each map entry
                    let currNotificationEntry = notificationEntryMapEntry[1];
                    let currSession = await loadSessionAsync_New(
                            bot,
                            currNotificationEntry.conversationId,
                            currNotificationEntry.serviceUrl,
                            currNotificationEntry.locale,
                        );

                    currSession.beginDialog(
                        DialogIds.SendSOEQuestionNotificationDialogId,
                        {
                            questionToSend: q,
                            soeQuestionEntry: currSOEQuestionEntry,
                            // soeQuestionStorage: soeQuestionStorage,
                            notificationEntry: currNotificationEntry,
                            // resolvePromiseCallback: resolvePromiseCallback,
                        },
                    );

                    needToSaveQuestion = true;
                }

                // this loop is used to update already existing notifications
                for (let updateEntry of updateEntriesNeedingUpdate) {
                    let currSession = await loadSessionAsync_New(
                            bot,
                            updateEntry.conversationId,
                            updateEntry.serviceUrl,
                            updateEntry.locale,
                        );

                    currSession.beginDialog(
                        DialogIds.UpdateSOEQuestionNotificationDialogId,
                        {
                            questionToSend: q,
                            soeQuestionEntry: currSOEQuestionEntry,
                            updateEntry: updateEntry,
                            // soeQuestionStorage: soeQuestionStorage,
                            // notificationEntry: currNotificationEntry,
                            // resolvePromiseCallback: resolvePromiseCallback,
                        },
                    );

                    needToSaveQuestion = true;
                }

                if (needToSaveQuestion) {
                    currSOEQuestionEntry.soeQuestion = q;
                    await soeQuestionStorage.saveSOEQuestionAsync(currSOEQuestionEntry);
                }
            // });

            // promisesOfCompletion.push(currentPromise);
        }

        // // when all saves and gets are completed and all promises are resolved, then close the database connections
        // Promise.all(promisesOfCompletion).then(async () => {
        //     await soeQuestionStorage.close();
        //     await tagStorage.close();
        // });

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
