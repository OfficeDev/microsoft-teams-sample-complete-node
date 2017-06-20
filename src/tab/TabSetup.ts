import * as express from "express";
let fs = require("fs");
let path = require("path");

export class TabSetup {
    public static buildTab(): express.RequestHandler {
        return async function (req: any, res: any, next: any): Promise<void> {
            try {
                let htmlPage = `<!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Bot Info</title>
                    </head>
                    <body>
                        
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <script src='https://statics.teams.microsoft.com/sdk/v1.0/js/MicrosoftTeams.min.js'></script>
                        <script src='https://code.jquery.com/jquery-1.11.3.min.js'></script>
                    </head>

                    <body>
                        <p>
                            These are links to the source code for all of the example dialogs given in the template.
                        </p>`;

                let files = fs.readdirSync("./public/exampleDialogs");
                for (let i = 0; i < files.length; i++) {
                    let currFile = files[i];
                    let fileName = path.parse(currFile).name;
                    let fileExtension = path.parse(currFile).ext;
                    if (fileExtension === ".txt") {
                        htmlPage += `<br>
                        <a href="/exampleDialogs/` + fileName +  `.txt">` + fileName + `.ts</a>`;
                    }
                }

                htmlPage += `
                    <br>
                    <br>
                    <br>
                    <button onclick="showContext()">Click to Show Tab's Context</button>
                    <br>
                    <p id="contextOutput"></p>
                    <script>
                        var microsoftTeams;

                        $(document).ready(function () {
                            microsoftTeams.initialize();
                        });

                        function showContext() {
                            microsoftTeams.getContext((context) => {
                                document.getElementById("contextOutput").innerHTML = JSON.stringify(context);
                            });
                        }
                    </script>
                    </body>
                    </html>
                    
                    </body>
                    </html>`;

                res.send(htmlPage);
            } catch (e) {
                // Don't log expected errors - error is probably from there not being example dialogs
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
        };
    }
}
