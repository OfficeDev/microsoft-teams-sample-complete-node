import * as express from "express";
// let fs = require("fs");
// let path = require("path");
import * as builder from "botbuilder";
import * as config from "config";
import { AADRequestAPI } from "./AADRequestAPI";
import { MongoDbTempTokensStorage } from "../storage/MongoDbTempTokensStorage";

export class AADUserValidation {
    public static validateUser(bot: builder.UniversalBot): express.RequestHandler {
        return async function (req: any, res: any, next: any): Promise<void> {
            try {
                let clientId = config.get("bot.botId");
                // let clientSecret = config.get("bot.botPassword");
                // let authorityHostUrl = "https://login.windows.net";
                // let tenant = "####";
                // let authorityUrl = authorityHostUrl + "/" + tenant;
                let redirectUri = config.get("app.baseUri") + "/api/success";
                // let templateAuthzUrl = "https://login.microsoftonline.com/" + tenant + "/oauth2/v2.0/authorize?response_type=code&client_id=" + clientId + "&redirect_uri=" + redirectUri + "&state=<state>&scope=openid%20profile";
                let templateAuthzUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=code&client_id=" + clientId + "&redirect_uri=" + redirectUri + "&state=<state>&scope=openid%20profile";

                let createAuthorizationUrl = (state) => {
                    return templateAuthzUrl.replace("<state>", state);
                };

                let authorizationUrl = createAuthorizationUrl(req.query.validationNumb);
                res.redirect(authorizationUrl);
            } catch (e) {
                // Don't log expected errors - error is probably from there not being example dialogs
                res.send(`<html>
                    <body>
                    <p>
                        Sorry - There has been an error.` +
                        e.toString() +
                    `</p>
                    <br>
                    <img src="/tab/error_generic.png" alt="default image" />
                    </body>
                    </html>`,
                );
            }
        };
    }

    public static success(bot: builder.UniversalBot): express.RequestHandler {
        return async function (req: any, res: any, next: any): Promise<void> {
            try {
                let cert = "####";
                // let finalCert = (cert) => {
                let beginCert = "-----BEGIN CERTIFICATE-----";
                let endCert = "-----END CERTIFICATE-----";
                cert = cert.replace("\n", "");
                cert = cert.replace(beginCert, "");
                cert = cert.replace(endCert, "");
                let result = beginCert;
                while (cert.length > 0) {
                    if (cert.length > 64) {
                        result += "\n" + cert.substring(0, 64);
                        cert = cert.substring(64, cert.length);
                    } else {
                        result += "\n" + cert;
                        cert = "";
                    }
                }
                if (result[result.length ] !== "\n") {
                    result += "\n";
                }
                result += endCert + "\n";
                    // return result
                // }

                // .post('grant_type=authorization_code&client_id=' + clientId + '&client_secret=' + clientSecret + '&redirect_uri=' + redirectUri + '&code=' + req.query.code + '&scope=User.Read%20Group.ReadWrite.All%20User.ReadWrite.All%20offline_access')((err, resp, body) =>
                // .post()((err, resp, body) =>
                //     @robot.logger.debug "#{LogPrefix} client err='#{err}'"
                //     @robot.logger.debug "#{LogPrefix} client resp='#{resp}'"
                //     @robot.logger.debug "#{LogPrefix} client body='#{body}'"
                //     data = JSON.parse(body)
                //     @robot.logger.debug "#{LogPrefix} client data='#{data}'"
                //     res.send(data)
                // );

                // let tempTokensStorage = new MongoDbTempTokensStorage("temp-tokens-test", config.get("mongoDb.connectionString"));
                let tempTokensDbConnection = await MongoDbTempTokensStorage.createConnection();
                // make this call something we can await?
                let tempTokensEntry = await tempTokensDbConnection.getTempTokensAsync(req.query.state);

                await tempTokensDbConnection.deleteTempTokensAsync(req.query.state);

                await tempTokensDbConnection.close();

                let clientId = config.get("bot.botId");
                let clientSecret = config.get("bot.botPassword");
                // let authorityHostUrl = "https://login.windows.net";
                // let tenant = "####";
                // let authorityUrl = authorityHostUrl + "/" + tenant;
                let redirectUri = config.get("app.baseUri") + "/api/success";

                let args = {
                    grant_type: "authorization_code",
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                    code: req.query.code,
                    scope: "openid profile",
                };
                // let postResultData = await new AADRequestAPI().postAsync("https://login.microsoftonline.com/" + tenant + "/oauth2/v2.0/token", args);
                let postResultData = await new AADRequestAPI().postAsync("https://login.microsoftonline.com/common/oauth2/v2.0/token", args);

                let htmlPage = `
                    <html>
                    <head>
                    </head>
                    <body>
                        <h1>You did it!!!</h1>
                        <p>`;

                htmlPage += "Params: " +
                    JSON.stringify(req.params) +
                    "<br><br>Body: " +
                    JSON.stringify(req.body) +
                    "<br><br>Query: " +
                    JSON.stringify(req.query);

                htmlPage += "<br><br>PostResultData: " +
                    JSON.stringify(postResultData);

                htmlPage += "<br><br>Cleaned Cert: " +
                    result;

                htmlPage += "<br><br>Entry in DB: " +
                    JSON.stringify(tempTokensEntry);

                // https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration
                // https://login.microsoftonline.com/####/v2.0/.well-known/openid-configuration

                htmlPage += `
                        </p>
                    </body>
                    </html>`;

                res.send(htmlPage);
            } catch (e) {
                // Don't log expected errors - error is probably from there not being example dialogs
                res.send(`<html>
                    <body>
                    <p>
                        Sorry.  There has been an error.` +
                        e.toString() +
                    `</p>
                    <br>
                    <img src="/tab/error_generic.png" alt="default image" />
                    </body>
                    </html>`,
                );
            }
        };
    }
}
