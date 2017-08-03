import * as express from "express";
// import * as config from "config";

export class VSTSAuthFlowEndPopUp {
    public static buildPage(): express.RequestHandler {
        return async function (req: any, res: any, next: any): Promise<void> {
            try {
                let htmlPage = `<!DOCTYPE html>
                    <html>
                    <head>
                        <title>Bot Info</title>
                        <meta charset="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <script src='https://statics.teams.microsoft.com/sdk/v1.0/js/MicrosoftTeams.min.js'></script>
                        <script src='https://code.jquery.com/jquery-1.11.3.min.js'></script>
                    </head>

                    <body>
                        <p>Auth Flow End</p>
                        <script>
                            var microsoftTeams;

                            $(document).ready(function () { 
                                microsoftTeams.initialize();
                            
                                microsoftTeams.authentication.notifySuccess('Success!!! You are now logged in to use the bot and the tab.');
                            });
                        </script>
                    </body>
                    </html>`;
                    // if (context.subEntityId && context.subEntityId === 'allCommands') {
                    //     window.location = window.location.protocol + "//" + window.location.host + "/allCommands";
                    // } else {
                    //     window.location = window.location.protocol + "//" + window.location.host + "/default";
                    // }

                    // window.location = "${config.get("app.baseUri") + "/allCommands"}";
                    // window.location = "${config.get("app.baseUri") + "/default"}";

                    // <p>Loading...</p>
                    // <img src="${config.get("app.baseUri") + "/assets/wave_blue.gif"}" alt="image"></img>

                    // <script>
                    //     var microsoftTeams;

                    //     $(document).ready(function () {
                    //         microsoftTeams.initialize();

                    //         microsoftTeams.getContext((context) => {
                    //             if (context.subEntityId && context.subEntityId === 'allCommands') {
                    //                 window.location = window.location.protocol + "//" + window.location.host + "/allCommands";
                    //             } else {
                    //                 window.location = window.location.protocol + "//" + window.location.host + "/default";
                    //             }
                    //         });
                    //     });

                    //     function showAllCommands() {
                    //         window.location = "${config.get("app.baseUri") + "/allCommands"}";
                    //     }

                    //     function getDeeplink() {
                    //         microsoftTeams.shareDeepLink({subEntityId: "stuff", subEntityLabel: "stuff2"});
                    //     }

                    //     function showContext() {
                    //         microsoftTeams.getContext((context) => {
                    //             document.getElementById("contextOutput").innerHTML = JSON.stringify(context);
                    //         });
                    //     }
                    // </script>

                res.send(htmlPage);
            } catch (e) {
                // Don't log expected errors - error is probably from there not being example dialogs
                res.send(`<html>
                    <body>
                    <p>
                        Sorry.  There was an error.
                    </p>
                    <br>
                    <img src="/tab/error_generic.png" alt="default image" />
                    </body>
                    </html>`);
            }
        };
    }
}
