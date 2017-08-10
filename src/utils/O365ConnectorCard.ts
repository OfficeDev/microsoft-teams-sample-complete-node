import * as sprintf from "sprintf-js";
import { Message, Session, IAttachment, IIsAttachment } from "botbuilder";
import * as msTeams from "botbuilder-teams";

export class O365ConnectorCard implements IIsAttachment {
    protected data: any = {
        contentType: "application/vnd.microsoft.teams.card.o365connector",
        content: {} as msTeams.O365ConnectorCard,
    };

    constructor(protected session?: Session) {

    }

    public title(text: string, ...args: any[]): this {
        if (text) {
            this.data.content.title = fmtText(this.session, text, args);
        }
        return this;
    }

    public text(text: string, ...args: any[]): this {
        if (text) {
            this.data.content.text = fmtText(this.session, text, args);
        }
        return this;
    }

    public themeColor(color: string, ...args: any[]): this {
        if (color) {
            color = color.toLowerCase();
            // Strip off leading # if present
            if (color.charAt(0) === "#") {
                color = color.slice(1, color.length);
            }
            switch (color) {
                case "good":
                    this.data.content.themeColor = "2ea34e"; // Green
                    break;
                case "warning":
                    this.data.content.themeColor = "de9d30"; // Gold/Yellow
                    break;
                case "danger":
                    this.data.content.themeColor = "d50000"; // Red
                    break;
                default:
                    this.data.content.themeColor = color; // hex number
            }
        }
        return this;
    }

    public sections(list: msTeams.O365ConnectorCardSection|IIsO365ConnectorCardSection|msTeams.O365ConnectorCardSection[]|IIsO365ConnectorCardSection[]): this {
        this.data.content.sections = [];
        if (list) {
            if (Array.isArray(list)) {
                for (let item of list) {
                    this.data.content.sections.push((item as IIsO365ConnectorCardSection).toSection ? (item as IIsO365ConnectorCardSection).toSection() : (item as msTeams.O365ConnectorCardSection));
                }
            } else {
                this.data.content.sections.push((list as IIsO365ConnectorCardSection).toSection ? (list as IIsO365ConnectorCardSection).toSection() : (list as msTeams.O365ConnectorCardSection));
            }
        }
        return this;
    }

    // public potentialAction(list: msTeams.O365ConnectorCardActionBase[]|IIsO365ConnectorCardActionBase[]): this {
    public potentialAction(list: any[]|IIsO365ConnectorCardActionBase[]): this {
        this.data.content.potentialAction = [];
        if (list) {
            for (let action of list) {
                let obj = (action as IIsO365ConnectorCardActionBase).toAction ?
                        // (action as IIsO365ConnectorCardActionBase).toAction() : (action as msTeams.O365ConnectorCardActionBase);
                        (action as IIsO365ConnectorCardActionBase).toAction() : (action as any);
                this.data.content.potentialAction.push(o365ActionToPayload(obj));
            }
        }
        return this;
    }

    public toAttachment(): IAttachment {
        return this.data;
    }
}

export class O365ConnectorCardSection implements IIsO365ConnectorCardSection {
    // private data: msTeams.O365ConnectorCardSection = {};
    private data: any = {};

    public static create(session: Session, title: string, text?: string, activityTitle?: string, activityImage?: string, activitySubtitle?: string, activityText?: string, images?: string|string[], facts?: string[]): O365ConnectorCardSection {
        // Helper function to convert 1D array to an ND array
        // From: https://stackoverflow.com/questions/4492385/how-to-convert-simple-array-into-two-dimensional-arraymatrix-in-javascript-or
        const toMatrix = (arr, width) =>
            arr.reduce((rows, key, index) => (index % width === 0 ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows, []);
        let imageList: O365ConnectorCardImage[] = [];
        let factList: O365ConnectorCardFact[] = [];
        if (images) {
            if (Array.isArray(images)) {
                for (let url of images) {
                    imageList.push(O365ConnectorCardImage.create(session, url));
                }
            } else {
                imageList.push(O365ConnectorCardImage.create(session, images));
            }
        }
        if (facts) {
            // Convert the incoming 1D array of strings to a 2D array
            let factArray: string[] = toMatrix(facts, 2);
            for (let i = 0; i < factArray.length; i++) {
                factList.push(O365ConnectorCardFact.create(session, factArray[i][0], factArray[i][1]));
            }
        }
        return new O365ConnectorCardSection(session)
            .title(title).text(text)
            .activityTitle(activityTitle).activityImage(activityImage).activitySubtitle(activitySubtitle).activityText(activityText)
            .images(imageList)
            .facts(factList);
    }

    constructor(protected session?: Session) {

    }

    public title(text: string, ...args: any[]): this {
        if (text) {
            this.data.title = fmtText(this.session, text, args);
        }
        return this;
    }

    public text(text: string, ...args: any[]): this {
        if (text) {
            this.data.text = fmtText(this.session, text, args);
        }
        return this;
    }

    public activityTitle(text: string, ...args: any[]): this {
        if (text) {
            this.data.activityTitle = fmtText(this.session, text, args);
        }
        return this;
    }

    public activitySubtitle(text: string, ...args: any[]): this {
        if (text) {
            this.data.activitySubtitle = fmtText(this.session, text, args);
        }
        return this;
    }

    public activityText(text: string, ...args: any[]): this {
        if (text) {
            this.data.activityText = fmtText(this.session, text, args);
        }
        return this;
    }

    public activityImage(url: string, ...args: any[]): this {
        if (url) {
            this.data.activityImage = url;
        }
        return this;
    }

    public facts(list: msTeams.O365ConnectorCardFact[]|IIsO365ConnectorCardFact[]): this {
        this.data.facts = [];
        if (list) {
            for (let fact of list) {
                this.data.facts.push((fact as IIsO365ConnectorCardFact).toFact ? (fact as IIsO365ConnectorCardFact).toFact() : (fact as msTeams.O365ConnectorCardFact));
            }
        }
        return this;
    }

    public images(list: msTeams.O365ConnectorCardImage[]|IIsO365ConnectorCardImage[]): this {
        this.data.images = [];
        if (list) {
            for (let image of list) {
                this.data.images.push((image as IIsO365ConnectorCardImage).toImage ? (image as IIsO365ConnectorCardImage).toImage() : (image as msTeams.O365ConnectorCardImage));
            }
        }
        return this;
    }

    // public potentialAction(list: msTeams.O365ConnectorCardActionBase[]|IIsO365ConnectorCardActionBase[]): this {
    public potentialAction(list: any[]|IIsO365ConnectorCardActionBase[]): this {
        this.data.potentialAction = [];
        if (list) {
            for (let action of list) {
                let obj = (action as IIsO365ConnectorCardActionBase).toAction ?
                        // (action as IIsO365ConnectorCardActionBase).toAction() : (action as msTeams.O365ConnectorCardActionBase);
                        (action as IIsO365ConnectorCardActionBase).toAction() : (action as any);
                this.data.potentialAction.push(o365ActionToPayload(obj));
            }
        }
        return this;
    }

    public toSection(): msTeams.O365ConnectorCardSection {
        return this.data;
    }
}

export class O365ConnectorCardFact implements IIsO365ConnectorCardFact {
    // private data: msTeams.O365ConnectorCardFact = { name: "", value: "" };
    private data: any = { name: "", value: "" };

    public static create(session: Session, name: string, value: string): O365ConnectorCardFact {
        return new O365ConnectorCardFact(session).name(name).value(value);
    }

    constructor(private session?: Session) {
    }

    public name(text: string, ...args: any[]): this {
        if (text) {
            this.data.name = fmtText(this.session, text, args);
        }
        return this;
    }

    public value(val: string): this {
        this.data.value = val || "";
        return this;
    }

    public toFact(): msTeams.O365ConnectorCardFact {
        return this.data;
    }
}

export class O365ConnectorCardImage implements IIsO365ConnectorCardImage {
    // private data: msTeams.O365ConnectorCardImage = { image: "" };
    private data: any = { image: "" };

    public static create(session: Session, url: string): O365ConnectorCardImage {
        return new O365ConnectorCardImage(session).image(url);
    }

    constructor(private session?: Session) {
    }

    public image(url: string, ...args: any[]): this {
        if (url) {
            this.data.image = url;
        }
        return this;
    }

    public toImage(): msTeams.O365ConnectorCardImage {
        return this.data;
    }
}

export abstract class O365ConnectorCardActionBase implements IIsO365ConnectorCardActionBase {
    // protected data: msTeams.O365ConnectorCardActionBase = {} as msTeams.O365ConnectorCardActionBase;
    protected data: any = {} as any;

    constructor(protected session?: Session) {
        this.data.type = this.type;
    }

    public name(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.name = fmtText(this.session, text, args);
        }
        return this;
    }

    public id(actionId: string): this {
        if (actionId) {
            this.data.id = actionId;
        }
        return this;
    }

    protected abstract get type(): string;

    // public toAction(): msTeams.O365ConnectorCardActionBase {
    public toAction(): any {
        return this.data;
    }
}

export class O365ConnectorCardViewAction extends O365ConnectorCardActionBase {
    constructor(protected session?: Session) {
        super(session);
    }

    public target(targetUrl: string): this {
        if (targetUrl) {
            // (this.data as msTeams.O365ConnectorCardViewAction).target = [targetUrl];
            (this.data as any).target = [targetUrl];
        }
        return this;
    }

    protected get type(): string {
        return "ViewAction";
    }
}

export function fmtText(session: Session, prompts: string|string[], args?: any[]): string {
    let fmt = Message.randomPrompt(prompts);
    if (session) {
        // Run prompt through localizer
        fmt = session.gettext(fmt);
    }
    return args && args.length > 0 ? sprintf.vsprintf(fmt, args) : fmt;
}

// export function o365ActionToPayload(obj: msTeams.O365ConnectorCardActionBase): msTeams.O365ConnectorCardActionBase {
export function o365ActionToPayload(obj: any): any {
    if (obj.type) {
        obj["@type"] = obj.type;
        delete obj.type;
    }
    if (obj.id) {
        obj["@id"] = obj.id;
        delete obj.id;
    }
    return obj;
}

// Implemented by classes that can create sections */
interface IIsO365ConnectorCardSection {
    /** Returns the JSON object for the section. */
    toSection(): msTeams.O365ConnectorCardSection;
}

// Implemented by classes that can create facts */
interface IIsO365ConnectorCardFact {
    /** Returns the JSON object for the fact. */
    toFact(): msTeams.O365ConnectorCardFact;
}

// Implemented by classes that can create images */
interface IIsO365ConnectorCardImage {
    /** Returns the JSON object for the image. */
    toImage(): msTeams.O365ConnectorCardImage;
}

export interface IIsO365ConnectorCardActionBase {
    // toAction(): msTeams.O365ConnectorCardActionBase;
    toAction(): any;
}
