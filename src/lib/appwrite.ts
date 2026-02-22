import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const sdk = {
    account,
    databases,
    storage,
};

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

export const COLLECTIONS = {
    POSTS: process.env.NEXT_PUBLIC_APPWRITE_TABLE_POSTS!,
    JOB_VACANCY: process.env.NEXT_PUBLIC_APPWRITE_TABLE_JOB_VACANCY!,
    JOB_APPLICATIONS: process.env.NEXT_PUBLIC_APPWRITE_TABLE_JOB_APPLICATIONS!,
    ENQUIRIES: process.env.NEXT_PUBLIC_APPWRITE_TABLE_ENQUIRIES!,
    CONTACT: process.env.NEXT_PUBLIC_APPWRITE_TABLE_CONTACT!,
    CATEGORIES: process.env.NEXT_PUBLIC_APPWRITE_TABLE_CATEGORIES!,
    USERS: process.env.NEXT_PUBLIC_APPWRITE_TABLE_USERS!,
};

export { ID, Query } from "appwrite";
