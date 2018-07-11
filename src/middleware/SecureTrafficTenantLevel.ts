import * as builder from "botbuilder";
const config = require("config");
// Strip bot mentions from the message text
export class SecureTrafficTenantLevel implements builder.IMiddlewareMap {

    public readonly botbuilder = (session: builder.Session, next: Function): void => {
        let targetTenant = typeof(config.OFFICE_365_TENANT_FILTER) !== "undefined" ? config.OFFICE_365_TENANT_FILTER : null;
        let currentMsgTenant = typeof(session.message.sourceEvent.tenant) !== "undefined" ? session.message.sourceEvent.tenant.id : null;
        if (targetTenant !== null && targetTenant !== "#ANY#") {
          if (targetTenant === currentMsgTenant) {
            next();
          }
          else {
            session.send("MS Teams: Attempted access from a different Office 365 tenant (" + currentMsgTenant + "): message rejected");
          }
        }
        else {
          next();
        }
    }
}
