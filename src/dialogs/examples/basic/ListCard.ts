import * as builder from "botbuilder";

// class that simplifies building list cards. List cards provides rich layout to show items in list layout.
export class ListCard {
    public contentType: string;
    public title: string;
    public items: ListCardItem[];
    public buttons: Array<builder.CardAction>;

    constructor()
    {
        this.contentType = "application/vnd.microsoft.teams.card.list";
    }
    public ToAttachment(): builder.IAttachment
    {
        let attachment: builder.IAttachment = {
            contentType: this.contentType,
            content: this,
        };

        return attachment;
    }
}

// class that simplifies building list items for list card.
export class ListCardItem {
    public id: string;
    public type: ListCardItemType;
    public title: string;
    public subtitle: string;
    public icon: string;
    public tap: builder.CardAction;
}

// below enum represent differnt item type supported in list card.
export enum ListCardItemType {
    Person = "person",
    File = "file",
    Separator = "separator",
    ResultItem = "resultItem",
}
