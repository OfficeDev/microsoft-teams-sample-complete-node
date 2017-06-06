import * as request from "request";
import * as querystring from "querystring";
import * as config from "config";
let http = require("http");
import * as express from "express";
import * as builder from "botbuilder";
import { loadSessionAsync } from "../utils/DialogUtils";
import { Strings } from "../locale/locale";

// Callback for HTTP requests
export interface RequestCallback {
    (error: any, body?: any): void;
}

// API wrapper
export class VSTSTokenOAuth2API {

    public static getUserAuthorizationURL(session: builder.Session): string {
        let args = {
            client_id: config.get("vstsApp.appId"),
            response_type: "Assertion",
            state: JSON.stringify(session.message.address),
            scope: "vso.work",
            redirect_uri: config.get("app.baseUri") + "/api/oauthCallback",
        };

        let url = "https://app.vssps.visualstudio.com/oauth2/authorize/?" + querystring.stringify(args);
        return url;
    }

    public static setUserAccessToken (bot: builder.UniversalBot): express.RequestHandler {
        return async function (req: any, res: any, next: any): Promise<void> {
            try {
                let code = req.query.code;
                let state = req.query.state;

                let address: builder.IAddress = JSON.parse(state);
                let session = await loadSessionAsync(bot, address);

                let auth = new VSTSTokenOAuth2API();
                session.sendTyping();

                // Change to create an actual random number
                let randomValidationNumber = "12345";

                auth.setupTokens(session, code, randomValidationNumber);

                res.send(session.gettext(Strings.please_return_to_teams, randomValidationNumber));
            } catch (e) {
                // Don't log expected errors
                res.redirect("/tab/error_generic.png");
            }
        };
    }

    constructor() {
        // do nothing
    }

    public async setupTokens(session: builder.Session, code: string, randomValidationNumber: string): Promise<void> {
        session.sendTyping();
        let args = {
            assertion: code,
            tokenRequestType: "get_token",
         };

        let resp = await this.postAsync("", args);

        let body = JSON.parse(resp);

        session.userData.vstsAuth = {
            token: body.access_token,
            refreshToken: body.refresh_token,
            isValidated: false,
            randomValidationNumber: randomValidationNumber,
        };

        // START VALIDATION DIALOG
        // session.send(Strings.tokens_set_confirmation);

        // try to save the tokens in case no other messages are sent
        session.save().sendBatch();
    }

    public async refreshTokens(session: builder.Session): Promise<void> {
        session.sendTyping();
        let args = {
            vsts_refresh_token: session.userData.vstsAuth.refreshToken,
            tokenRequestType: "refresh_token",
         };

        let resp = await this.postAsync("", args);

        let body = JSON.parse(resp);

        session.userData.vstsAuth.token = body.access_token;
        session.userData.vstsAuth.refreshToken = body.refresh_token;

        session.send(Strings.tokens_refreshed_confirmation);

        // try to save the tokens in case no other messages are sent
        session.save().sendBatch();
    }

    // Make a POST request to API.
    // Syntax: .post(uri, [query], callback)
    public post(uri: string, argsOrCallback?: any | RequestCallback, callback?: RequestCallback): void {
        this.request("POST", uri, argsOrCallback, callback);
    };

    public postAsync(uri: string, args: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.post(uri, args, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    // Make a request to API.
    // Syntax: .request(method, uri, [query], callback)
    private request(method: string, uri: string, argsOrCallback?: any | RequestCallback, callback?: RequestCallback): void {
        let args: any;

        if (callback) {
            args = argsOrCallback;
        } else {
            callback = argsOrCallback;
            args = {};
        }

        let options: request.Options = {
            url: "https://app.vssps.visualstudio.com/oauth2/token",
            method: method,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
        };

        if (args.tokenRequestType === "get_token") {
            options.body = "client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer" +
                "&client_assertion=" + config.get("vstsApp.appSecret") +
                "&grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer" +
                "&assertion=" + args.assertion +
                "&redirect_uri=" + config.get("app.baseUri") + "/api/oauthCallback";

        } else if (args.tokenRequestType === "refresh_token") {
            options.body = "client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer" +
                "&client_assertion=" + config.get("vstsApp.appSecret") +
                "&grant_type=refresh_token" +
                "&assertion=" + args.vsts_refresh_token +
                "&redirect_uri=" + config.get("app.baseUri") + "/api/oauthCallback";
        }

        let requestCallback = function (err: any, response: any, body: any): void {
            if (!err && response.statusCode >= 400) {
                err = new Error(body);
                err.statusCode = response.statusCode;
                err.responseBody = body;
                err.statusMessage = http.STATUS_CODES[response.statusCode];
            }

            callback(err, body);
        };

        request.post(options, requestCallback);
    };
}
