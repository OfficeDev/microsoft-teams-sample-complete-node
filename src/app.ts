import { Request, Response } from "express";
let express = require("express");
let favicon = require("serve-favicon");
let http = require("http");
let path = require("path");
let config = require("config");
import { ExampleBot } from "./ExampleBot";
import { VSTSTokenOAuth2API } from "./apis/VSTSTokenOAuth2API";
import * as teams from "botbuilder-teams";
import { TabSetup } from "./tab/TabSetup";

// Configure instrumentation - tooling with Azure
// let appInsights = require("applicationinsights");
// let instrumentationKey = config.get("app.instrumentationKey");
// if (instrumentationKey) {
//     appInsights.setup(instrumentationKey).start();
// }

let app = express();

app.set("port", process.env.PORT || 3978);
app.use(express.static(path.join(__dirname, "../../public")));
app.use(express.static(path.join(__dirname, "./public"))); // used for static dialogs
app.use(favicon(path.join(__dirname, "../../public/assets", "favicon.ico")));
app.get("/tabDisplay", TabSetup.buildTab());

// Create bot using Teams connector
let connector = new teams.TeamsChatConnector({
    appId: config.get("bot.botId"),
    appPassword: config.get("bot.botPassword"),
});
let bot = new ExampleBot(connector);

// Configure bot routes
app.post("/api/messages", connector.listen());
app.get("/api/oauthCallback", VSTSTokenOAuth2API.setUserAccessToken(bot));

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: Function) => {
    let err: any = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function(err: any, req: Request, res: Response, next: Function): void {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err,
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err: any, req: Request, res: Response, next: Function): void {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {},
    });
});

http.createServer(app).listen(app.get("port"), function (): void {
    console.log("Express server listening on port " + app.get("port"));
    console.log("Bot running at endpoint + /api/messages.  E.g. localhost:" + app.get("port") + "/api/messages");
});

module.exports = app;
