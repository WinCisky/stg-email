import type { Email as PostalMimeEmail } from "postal-mime";

export type AccountCredentials = {
    name: string;
    password: string;
};

export type Account = {
	name: string;
	password: string;
    total: number | null;
    unread: number | null;
    last: Date | null;
    lastUpdate: Date | null;
};

export interface Email extends PostalMimeEmail {
    is_read: boolean;
}