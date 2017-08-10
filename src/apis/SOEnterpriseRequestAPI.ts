import * as request from "request";
import * as builder from "botbuilder";
let http = require("http");
// import { DialogIds } from "../utils/DialogIds";
// import { Strings } from "../locale/locale";
import * as config from "config";
// import { isMessageFromChannel } from "../utils/DialogUtils";
import * as querystring from "querystring";

// Callback for HTTP requests
export interface RequestCallback {
    (error: any, body?: any): void;
}

// API wrapper
export class SOEnterpriseRequestAPI {
    private soeGlobalApiKey: string;

    // Creates a new request wrapper for a given API.
    constructor() {
        this.soeGlobalApiKey = config.get("stackOverflowEnterprise.soeGlobalApiKey");
    }

    // COMMENTED OUT TO KEEP TSLINT FROM COMPLAINING
    // private isUserValidated(session: builder.Session): boolean {
    //     let isValidated = false;
    //     if (session.userData && session.userData.soeAPIKey) {
    //         isValidated = true;
    //     } else {
    //         // do nothing
    //     }
    //     if (!isValidated) {
    //         session.send(Strings.need_to_log_in);
    //         // TODO - Implement SOELoginDialog - it exists but is a clone of VSTSLogInDialog
    //         session.beginDialog(DialogIds.SOELoginDialogId);
    //     }
    //     return isValidated;
    // }

    private async getAccessToken(session: builder.Session): Promise<any> {
        // TEMPORARY HACK TO KEEP SYSTEM WORKING
        let args = { key: null };
        args.key = this.soeGlobalApiKey;
        return args;

        // let args = { key: null };
        // if (isMessageFromChannel(session.message)) {
        //     args.key = this.soeGlobalApiKey;
        //     return args;
        // } else {
        //     if (this.isUserValidated(session)) {
        //         args.key = session.userData.soeAPIKey;
        //         return args;
        //     } else {
        //         // TODO: Temporary hack to test API call functionality
        //         args.key = this.soeGlobalApiKey;
        //         return args;
        //         // return null;
        //     }
        // }
    }

    // Make a GET request to API.
    // Syntax: .get(uri, [query], callback)
    private get(url: string, argsOrCallback?: any | RequestCallback, callback?: RequestCallback): void {
        this.request("GET", url, argsOrCallback, callback);
    };

    // tslint:disable-next-line:member-ordering
    public async getAsync(url: string, session: builder.Session): Promise<any> {
        let args = await this.getAccessToken(session);
        if (!args) {
            return null;
        }

        return new Promise((resolve, reject) => {
            this.get(url, args, (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(err);
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
        if (!args) {
            return null;
        }

        return new Promise((resolve, reject) => {
            this.del(url, args, (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(err);
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
        if (!args) {
            return null;
        }

        return new Promise((resolve, reject) => {
            this.post(url, args, (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(err);
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
        if (!args) {
            return null;
        }

        return new Promise((resolve, reject) => {
            this.put(url, args, (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(err);
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
            url: url + "&" + querystring.stringify(args),
            method: method,
            gzip: true,
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
