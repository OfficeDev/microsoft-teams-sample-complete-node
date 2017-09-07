// Copyright (c) Microsoft. All rights reserved.

import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as config from "config";
import { OpenIdMetadata } from "../utils/OpenIdMetadata";

// Validate the AAD token in the Authorization header and return the decoded token
export class ValidateAADToken {

    public static listen(): express.RequestHandler {
        let msaOpenIdMetadata = new OpenIdMetadata("https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration");
        return (req: express.Request, res: express.Response) => {
            // Get bearer token
            let authHeaderMatch = /^Bearer (.*)/i.exec(req.headers["authorization"]);
            if (!authHeaderMatch) {
                console.error("No Authorization token provided");
                res.sendStatus(401);
                return;
            }

            // Decode token and get signing key
            const encodedToken = authHeaderMatch[1];
            const decodedToken = jwt.decode(encodedToken, { complete: true });
            msaOpenIdMetadata.getKey(decodedToken.header.kid, (key) => {
                if (!key) {
                    console.error("Invalid signing key or OpenId metadata document");
                    res.sendStatus(500);
                }

                // Verify token
                const verifyOptions: jwt.VerifyOptions = {
                    algorithms: ["RS256", "RS384", "RS512"],
                    issuer: "https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/",
                    audience: config.get("app.appId"),
                    clockTolerance: 300,
                };
                try {
                    let token = jwt.verify(encodedToken, key.key, verifyOptions);
                    res.status(200).send(token);
                } catch (e) {
                    console.error("Invalid bearer token", e);
                    res.sendStatus(401);
                }
            });
        };
    }

}
