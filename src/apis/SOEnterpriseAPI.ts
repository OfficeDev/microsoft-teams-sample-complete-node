import * as builder from "botbuilder";
import { SOEnterpriseRequestAPI } from "./SOEnterpriseRequestAPI";
import * as querystring from "querystring";
import * as config from "config";

export class SOEnterpriseAPI {

    private requestAPI: SOEnterpriseRequestAPI;
    private soeBaseURI: string;

    public static soeTenantBase(): string {
        return config.get("stackOverflowEnterprise.soeTenantBase");
    }

    constructor () {
        this.requestAPI = new SOEnterpriseRequestAPI();
        const soeApiVersion = "2.2";
        this.soeBaseURI =  `https://${SOEnterpriseAPI.soeTenantBase()}/api/${soeApiVersion}/`; // E.g. "https://stackoverflow.microsoft.com/api/2.2/"
    }

    public async getNewQuestions(fromDate: string, session: builder.Session): Promise<any> {
        let args = {
            "fromdate": fromDate,
            "filter": "withbody",
        };
        let url = this.soeBaseURI + "questions?" + querystring.stringify(args);
        let resp = await this.requestAPI.getAsync(url, session);
        let body = JSON.parse(resp);
        return body;
    }
}

// Helper functions for the API

// Function that takes an array of tags and returns a Markdown-formatted string of those tags
export function renderTags(tags: string[]): string {
    let tagString = "";
    for (let tag of tags) {
        // Markdown in the form: [tag](https://<stackOverflowEnterpriseBaseURI>/questions/tagged/<tag>)
        tagString += `*[${tag}](https://${SOEnterpriseAPI.soeTenantBase()}/questions/tagged/${tag})* `;
    }
    return tagString;
}
