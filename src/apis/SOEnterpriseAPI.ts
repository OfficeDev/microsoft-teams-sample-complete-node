import * as builder from "botbuilder";
import { SOEnterpriseRequestAPI } from "./SOEnterpriseRequestAPI";
import * as querystring from "querystring";
import * as config from "config";

/**
 * This class makes api calls as defined here:
 * https://stackoverflow.microsoft.com/api/docs
 */
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

    public async getNewQuestions(fromDate: string, session: builder.Session, useGlobalKey?: boolean): Promise<any> {
        let args = {
            "fromdate": fromDate,
            "filter": "withbody",
        };
        let url = this.soeBaseURI + "questions?" + querystring.stringify(args);
        let resp = await this.requestAPI.getAsync(url, session, useGlobalKey);
        let body = JSON.parse(resp);
        return body;
    }

    // min here is used as the minimum timestamp for fetching questions based on last_activity_date
    // by setting fromdate to 1 (include everything) and using min for filtering last_activity_date, we can use this api call to fetch
    // the most recently new/updated questions
    public async getNewAndUpdatedQuestions(min: string, session: builder.Session, useGlobalKey?: boolean): Promise<any> {
        let args = {
            "fromdate": "1",
            "filter": "withbody",
            "min": min,
            "sort": "activity",
        };
        let url = this.soeBaseURI + "questions?" + querystring.stringify(args);
        let resp = await this.requestAPI.getAsync(url, session, useGlobalKey);
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
        tagString += `***[${tag}](https://${SOEnterpriseAPI.soeTenantBase()}/questions/tagged/${tag})*** `;
    }
    return tagString;
}
