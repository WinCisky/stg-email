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