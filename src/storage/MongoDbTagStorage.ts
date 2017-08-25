import * as mongodb from "mongodb";
import * as config from "config";

// tslint:disable-next-line:variable-name
export interface TagEntry {
    _id: string; // make sure it is lower case
    notificationEntries: NotificationEntry[];
};

// tslint:disable-next-line:variable-name
export interface NotificationEntry {
    conversationId: string;
    serviceUrl: string;
    locale: string;
    isChannel: boolean;
};

/** Replacable storage system. */
export class MongoDbTagStorage {

    private mongoDb: mongodb.Db;
    private tagCollection: mongodb.Collection;

    // public static async createConnection(): Promise<MongoDbTagStorage> {
    //     let collectionName = config.get("mongoDb.tagCollection");
    //     let connectionString = config.get("mongoDb.connectionString");
    //     let resultMongoDbTagStorage = new MongoDbTagStorage(collectionName, connectionString);
    //     await resultMongoDbTagStorage.initialize();
    //     return resultMongoDbTagStorage;
    // }

    public static createConnection(): MongoDbTagStorage {
        let collectionName = config.get("mongoDb.tagCollection");
        let connectionString = config.get("mongoDb.connectionString");
        let resultMongoDbTagStorage = new MongoDbTagStorage(collectionName, connectionString);
        // await resultMongoDbTagStorage.initialize();
        resultMongoDbTagStorage.initialize();
        return resultMongoDbTagStorage;
    }

    constructor(
        private collectionName: string,
        private connectionString: string) {
    }

    // Reads in data from storage
    public async getTagAsync(_id: string): Promise<TagEntry> {
        if (!this.tagCollection) {
            return ({} as any);
        }

        _id = _id.toLowerCase();
        let filter = { "_id": _id };
        let tagEntry = await this.tagCollection.findOne(filter);

        if (tagEntry) {
            return tagEntry;
        } else {
            return {
                _id: _id,
                notificationEntries: [],
            };
        }
    }

    // Writes out data from storage
    public async saveTagAsync(tagEntry: TagEntry): Promise<void> {
        if (!this.tagCollection) {
            return;
        }

        tagEntry._id = tagEntry._id.toLowerCase();
        let filter = { "_id": tagEntry._id };

        await this.tagCollection.updateOne(filter, tagEntry, { upsert: true });
    }

    // Deletes data from storage
    public async deleteTagAsync(_id: string): Promise<void> {
        if (!this.tagCollection) {
            return;
        }

        _id = _id.toLowerCase();
        let filter = { "_id": _id };

        await this.tagCollection.deleteMany(filter);
    }

    // Close the connection to the database
    public async close(): Promise<void> {
        this.tagCollection = null;
        if (this.mongoDb) {
            await this.mongoDb.close();
            this.mongoDb = null;
        }
    }

    // Initialize this instance
    private async initialize(): Promise<void> {
        if (!this.mongoDb) {
            try {
                this.mongoDb = await mongodb.MongoClient.connect(this.connectionString);
                this.tagCollection = await this.mongoDb.collection(this.collectionName);
            } catch (e) {
                // console.log(e.toString());
                await this.close();
            }
        }
    }
}
