import * as express from "express";
import * as config from "config";

export class ManifestCreatorStart {

    public static getRequestHandler(): express.RequestHandler {
        return async function (req: any, res: any, next: any): Promise<void> {
            let baseUri = config.get("app.baseUri");
            let appId = config.get("bot.botId");

            res.render("manifest-creator/manifestCreatorStart", {
                baseUri: baseUri,
                appId: appId,
                buttonEnabled: baseUri && appId,
            });
        };
    }
}
