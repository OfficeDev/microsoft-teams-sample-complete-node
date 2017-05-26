import * as request from "request";
import * as builder from "botbuilder";
let http = require("http");
import { VSTSTokenOAuth2API } from "./VSTSTokenOAuth2API";

// Callback for HTTP requests
export interface RequestCallback {
    (error: any, body?: any): void;
}

// API wrapper
export class VSTSRequestAPI {

    // Creates a new request wrapper for a given API.
    constructor() {
        // do nothing
    }

    private async getAccessToken(session: builder.Session): Promise<any> {
        let auth = new VSTSTokenOAuth2API();
        // sets tokens in session.userData.vsts_access_token and session.userData.vsts_refresh_token
        await auth.refreshTokens(session);

        session.sendTyping();

        let args = { vsts_access_token: session.userData.vsts_access_token };

        return args;
    };

    // Make a GET request to API.
    // Syntax: .get(uri, [query], callback)
    private get(url: string, argsOrCallback?: any | RequestCallback, callback?: RequestCallback): void {
        this.request("GET", url, argsOrCallback, callback);
    };

    // tslint:disable-next-line:member-ordering
    public async getAsync(url: string, session: builder.Session): Promise<any> {
        let args = await this.getAccessToken(session);

        return new Promise((resolve, reject) => {
            this.get(url, args, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    // Make a DELETE request to API.
    // Syntax: .delete(uri, [query], callback)
    private del(url: string, argsOrCallback?: any | RequestCallback, callback?: RequestCallback): void {
        this.request("DELETE", url, argsOrCallback, callback);
    };

    // tslint:disable-next-line:member-ordering
    public async delAsync(url: string, session: builder.Session): Promise<any> {
        let args = await this.getAccessToken(session);

        return new Promise((resolve, reject) => {
            this.del(url, args, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    // Make a POST request to API.
    // Syntax: .post(uri, [query], callback)
    private post(url: string, argsOrCallback?: any | RequestCallback, callback?: RequestCallback): void {
        this.request("POST", url, argsOrCallback, callback);
    };

    // tslint:disable-next-line:member-ordering
    public async postAsync(url: string, session: builder.Session): Promise<any> {
        let args = await this.getAccessToken(session);

        return new Promise((resolve, reject) => {
            this.post(url, args, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    // Make a PUT request to API.
    // Syntax: .put(uri, [query], callback)
    private put(url: string, argsOrCallback?: any | RequestCallback, callback?: RequestCallback): void {
        this.request("PUT", url, argsOrCallback, callback);
    };

    // tslint:disable-next-line:member-ordering
    public async putAsync(url: string, session: builder.Session): Promise<any> {
        let args = await this.getAccessToken(session);

        return new Promise((resolve, reject) => {
            this.put(url, args, (err, result) => {
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
    private request(method: string, url: string, argsOrCallback?: any | RequestCallback, callback?: RequestCallback): void {
        let args: any;

        if (callback) {
            args = argsOrCallback;
        } else {
            callback = argsOrCallback;
            args = {};
        }

        let options: request.Options = {
            url: url,
            method: method,
            headers: {
                "authorization": "bearer " + args.vsts_access_token,
            },
        };

        let requestCallback = function (err: any, response: any, body: any): void {
            if (!err && response.statusCode >= 400) {
                err = new Error(body);
                err.statusCode = response.statusCode;
                err.responseBody = body;
                err.statusMessage = http.STATUS_CODES[response.statusCode];
            }

            callback(err, body);
        };

        switch (method.toLowerCase())
        {
            case "get":
                request.get(options, requestCallback);
                break;
            case "post":
                request.post(options, requestCallback);
                break;
            case "put":
                request.put(options, requestCallback);
                break;
            case "delete":
                request.delete(options, requestCallback);
                break;
        }
    };
}
