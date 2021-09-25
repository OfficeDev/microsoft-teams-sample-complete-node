import * as express  from "express";
import * as config from "config";

export class TaskModuleTab {
    public static getRequestHandler(): express.RequestHandler {
        return async function (req: any, res: any, next: any): Promise<void> {
            try{
                let htmlPage = `<!DOCTYPE html>   <head>
                <title>Bot Info</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://unpkg.com/@microsoft/teams-js@1.3.7/dist/MicrosoftTeams.min.js" integrity="sha384-glExfvkpce98dO2oN+diZ/Luv/5qrZJiOvWCeR8ng/ZxlhpvBgHKeVFRURrh+NEC" crossorigin="anonymous"></script>
                <script src='https://code.jquery.com/jquery-1.11.3.min.js'></script>
                </head>

            <body>  
            <button class="taskModuleButton" id="commandList">Invoke Task Module- Result Tab</button>
            <br>
            <label id="taskModuleResult"></label>
            <br>
            <br>
            <button class="taskModuleButton" id="adaptiveCardResultBot">Invoke Task Module- Result Bot</button>
             <script>
             var microsoftTeams;

             var  adaptiveCard = {
                "type": "AdaptiveCard",
                "body": [
                    {
                        "type": "TextBlock",
                        "separator": true,
                        "size": "Large",
                        "weight": "Bolder",
                        "text": "Enter Command:",
                        "isSubtle": true,
                        "wrap": true,
                    },
                    {
                        "type": "Input.Text",
                        "id": "commandToBot",
                        "placeholder": "E.g. timezone",
                    },
                ],
                "actions": [
                    {
                        "type": "Action.Submit",
                        "id": "postCommand",
                        "title": "Post Command",
                    },
                    {
                        "type": "Action.Submit",
                        "id": "cancel",
                        "title": "Cancel",
                    },
                ],
                "version": "1.0",
            };

             $(document).ready(function () {
                 microsoftTeams.initialize();
                 microsoftTeams.registerOnThemeChangeHandler(function(theme) {
                     document.getElementById('currentTheme').innerHTML = theme;
                 });
             });
             
             function acAttachment(ac) {
                return {
                    contentType: "application/vnd.microsoft.card.adaptive",
                    content: ac,
                };
            }

             document.addEventListener("DOMContentLoaded", function(){
                let taskModuleButtons = document.getElementsByClassName("taskModuleButton");
                let taskInfo = {
                    title: null,
                    height: null,
                    width: null,
                    url: null,
                    card: null,
                    fallbackUrl: null,
                    completionBotId: null,
                };
                
                taskInfo.height = 510;
                taskInfo.width = 510;
                let submitHandler = (err, result) => {
                    document.getElementById('taskModuleResult').innerHTML="you enterd the command: " + result.commandToBot;
                   };
            
                for (let btn of taskModuleButtons) {
                     btn.addEventListener("click",
                        function (){
                            switch (this.id){
                                case "commandList" :
                                taskInfo.url =  "${config.get("app.baseUri") + "/customform"}";
                                taskInfo.title = "Task Module From Tab - Result Tab";
                                microsoftTeams.tasks.startTask(taskInfo, submitHandler);
                                break;

                                case "adaptiveCardResultBot":
                                taskInfo.title = "Task Module From Tab - Result Bot";
                                taskInfo.url=null;
                                taskInfo.card = acAttachment(adaptiveCard);
                                taskInfo.completionBotId = "${config.get("app.appId")}";
                                microsoftTeams.tasks.startTask(taskInfo);
                                break;
                            }
                            
                        });
                     }
            });
            
           
           </script>
            </body>
          </html>`;
                res.send(htmlPage);

            }catch (e){
             res.send(`<html> <body>
             <p>Some error has occured</p>
             </body></html>`);
            }
        };
    }

}
