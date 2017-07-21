import { Request, Response } from "express";
let express = require("express");
let favicon = require("serve-favicon");
let http = require("http");
let path = require("path");
let config = require("config");
import { Bot } from "./Bot";
import { VSTSTokenOAuth2API } from "./apis/VSTSTokenOAuth2API";
import * as teams from "botbuilder-teams";
import { DefaultTab } from "./tab/DefaultTab";
import { MongoDbBotStorage } from "./storage/MongoDbBotStorage";
import { MongoDbBotChannelStorage } from "./storage/MongoDbBotChannelStorage";
import { AADUserValidation } from "./apis/AADUserValidation";

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
app.get("/tabDisplay", DefaultTab.buildTab());

// Create Teams connector for the bot
let connector = new teams.TeamsChatConnector({
    appId: config.get("bot.botId"),
    appPassword: config.get("bot.botPassword"),
});

// Create storage for the bot
let channelStorage = null;
let botStorage = null;
if (config.get("channelStorageType") === "mongoDb") {
    channelStorage = new MongoDbBotChannelStorage(config.get("mongoDb.botStateCollection"), config.get("mongoDb.connectionString"));
    botStorage = new MongoDbBotStorage(config.get("mongoDb.botStateCollection"), config.get("mongoDb.connectionString"));
};

let botSettings = {
    channelStorage: channelStorage,
    storage: botStorage,
};

let bot = new Bot(connector, botSettings);

// Configure bot routes
app.post("/api/messages", connector.listen());
app.get("/api/VSTSOauthCallback", VSTSTokenOAuth2API.setUserAccessToken(bot));
app.get("/api/validateUser", AADUserValidation.validateUser(bot));
app.get("/api/success", AADUserValidation.success(bot));

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
