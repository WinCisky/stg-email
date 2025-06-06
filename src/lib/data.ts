import type { Email as PostalMimeEmail } from "postal-mime";

export type AccountCredentials = {
    name: string;
    password: string;
};

export type Account = {
    name: string;
    password: string;
    total: number | null;
    last: string | null;
    lastUpdate: Date | null;
};

export interface Email extends PostalMimeEmail {
    is_read: boolean;
    id: number;
    raw: string;
}

export type SearchFiltersOptions = {
    sender: boolean,
    receiver: boolean,
    subject: boolean,
    content: boolean,
    attachment: boolean,
}