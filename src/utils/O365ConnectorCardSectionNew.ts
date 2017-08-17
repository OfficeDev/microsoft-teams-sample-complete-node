import { Session } from "botbuilder";
import * as msTeams from "botbuilder-teams";

export class O365ConnectorCardSectionNew extends msTeams.O365ConnectorCardSection {
    public static create(session: Session, title: string, text?: string, activityTitle?: string, activityImage?: string, activitySubtitle?: string, activityText?: string, images?: string|string[], facts?: string[]): msTeams.IO365ConnectorCardSection[] {
        // Helper function to convert 1D array to an ND array
        // From: https://stackoverflow.com/questions/4492385/how-to-convert-simple-array-into-two-dimensional-arraymatrix-in-javascript-or
        const toMatrix = (arr, width) =>
            arr.reduce((rows, key, index) => (index % width === 0 ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows, []);
        let imageList: O365ConnectorCardImageNew[] = [];
        let factList: O365ConnectorCardFactNew[] = [];
        if (images) {
            if (Array.isArray(images)) {
                for (let url of images) {
                    imageList.push(O365ConnectorCardImageNew.create(session, url));
                }
            } else {
                imageList.push(O365ConnectorCardImageNew.create(session, images));
            }
        }
        if (facts) {
            // Convert the incoming 1D array of strings to a 2D array
            let factArray: string[] = toMatrix(facts, 2);
            for (let i = 0; i < factArray.length; i++) {
                factList.push(O365ConnectorCardFactNew.create(session, factArray[i][0], factArray[i][1]));
            }
        }
        let sections = [];
        sections.push(new msTeams.O365ConnectorCardSection(session)
            .title(title).text(text)
            .activityTitle(activityTitle).activityImage(activityImage).activitySubtitle(activitySubtitle).activityText(activityText)
            .images(imageList)
            .facts(factList)
            .toSection());
        return sections;
    }
}

export class O365ConnectorCardFactNew extends msTeams.O365ConnectorCardFact {
    public static create(session: Session, name: string, value: string): msTeams.O365ConnectorCardFact {
        return new msTeams.O365ConnectorCardFact(session).name(name).value(value);
    }
}

export class O365ConnectorCardImageNew extends msTeams.O365ConnectorCardImage {
    public static create(session: Session, url: string): msTeams.O365ConnectorCardImage {
        return new msTeams.O365ConnectorCardImage(session).image(url);
    }
}
