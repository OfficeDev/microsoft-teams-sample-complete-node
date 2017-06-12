import * as builder from "botbuilder";
import { TriggerDialog } from "../../utils/TriggerDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import { Strings } from "../../locale/locale";

export class Start1to1TrigDialog extends TriggerDialog {

    // Below is another way to send a direct 1:1 message.  It is completely encapsulated within a waterfall
    // step, but is limited to only sending a message and cannot call beginDialog()
    // To Use: comment out the async function in the constructor, uncomment the line in the constructor
    // which references the send1to1Msg function, uncomment the send1to1Msg function definition below

    // private static async send1to1Msg(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): Promise<void> {
    //     // casting to keep away typescript error
    //     let msgAddress: builder.IChatConnectorAddress = session.message.address;
    //     let msgServiceUrl = msgAddress.serviceUrl;

    //     let newAddress =
    //     {
    //         channelId: "msteams",
    //         user: { id: session.message.address.user.id },
    //         channelData: {
    //             tenant: {
    //                 id: session.message.sourceEvent.tenant.id,
    //             },
    //         },
    //         bot: {
    //             id: session.message.address.bot.id,
    //             name: session.message.address.bot.name,
    //         },
    //         serviceUrl: msgServiceUrl,
    //         useAuth: true,
    //     };

    //     session.connector.startConversation(newAddress, (err, resultAddress) => {
    //         if (!err) {
    //             let msg = new builder.Message(session)
    //                 .address(resultAddress)
    //                 .text("*123");
    //             session.send(msg);

    //             session.send(Strings.one_on_one_message_sent);
    //         } else {
    //             session.error(err);
    //         }
    //         session.endDialog();
    //     });
    // }

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.Start1to1TrigDialogId,
            DialogMatches.start1to1Match,

            async (session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void) => {
                // casting to keep away typescript error
                let msgAddress: builder.IChatConnectorAddress = session.message.address;
                let msgServiceUrl = msgAddress.serviceUrl;

                let address =
                {
                    channelId: "msteams",
                    user: { id: session.message.address.user.id },
                    channelData: {
                        tenant: {
                            id: session.message.sourceEvent.tenant.id,
                        },
                    },
                    bot: {
                        id: session.message.address.bot.id,
                        name: session.message.address.bot.name,
                    },
                    serviceUrl: msgServiceUrl,
                    useAuth: true,
                };
                bot.beginDialog(address, DialogIds.TestTrigDialogId);

                session.send(Strings.one_on_one_message_sent);
                session.endDialog();
            },

            // Below is another way to send a direct 1:1 message.  It is completely encapsulated within a waterfall
            // step, but is limited to only sending a message and cannot call beginDialog()
            // To Use: comment out the function directly above, uncomment the line below, uncomment the send1to1Msg
            // function definition above the constructor

            // Start1to1TrigDialog.send1to1Msg,

        );
    }
}
