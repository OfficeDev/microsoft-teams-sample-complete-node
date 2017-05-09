import * as builder from "botbuilder";
import { TriggerDialog } from "../../utils/TriggerDialog";
import { DialogIds } from "../../utils/DialogUtils";
import { DialogMatches } from "../../utils/DialogMatches";
import { Strings } from "../../locale/locale";

export class Start1on1TrigDialog extends TriggerDialog {

    constructor(
        bot: builder.UniversalBot,
    ) {
        super(bot,
            DialogIds.Start1on1TrigDialogId,
            DialogMatches.start1on1Match,
            (session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void) => {
                // setting it this way to keep away typescript error
                // because the interface is not completely up to date
                let msgAddress: any = session.message.address;
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
        );
    }
}
