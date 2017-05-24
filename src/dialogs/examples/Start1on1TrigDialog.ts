import * as builder from "botbuilder";
import { TriggerDialog } from "../../utils/TriggerDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import { Strings } from "../../locale/locale";
// import { loadSessionAsync } from "../../utils/DialogUtils";

export class Start1on1TrigDialog extends TriggerDialog {

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.Start1on1TrigDialogId,
            DialogMatches.start1on1Match,
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

                // session.connector.startConversation(address, (err, address2) => {
                //     if (!err) {
                //         let msg = new builder.Message(session)
                //             .address(address2)
                //             .text("testing123");
                //         session.send(msg);
                //         session.send(Strings.one_on_one_message_sent);
                //         session.endDialog();
                //     } else {
                //         session.error(err);
                //         session.endDialog();
                //     }
                // });
            },
        );
    }
}
