import posthog from 'posthog-js';

// Local development against a local backend: VITE_API_ENDPOINT=http://localhost:3628 pnpm dev
const ENDPOINT: string = import.meta.env.VITE_API_ENDPOINT ?? 'https://test.opentrust.it';

// The API accepts at most this many accounts per stats request
const STATS_BATCH_SIZE = 100;

/** An email as returned by the API (`content` is the raw message). */
export type ApiEmail = {
    id: number;
    username: string;
    sender: string;
    recipients: string;
    subject: string;
    content: string;
    timestamp: string;
    is_read: number;
};

export type ApiAccountStats = {
    username: string;
    password: string;
    totalEmails: number;
    lastEmailDate: string | null;
};

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

/** `Authorization: Basic` value, UTF-8 encoded. */
function basicAuthorization(username: string, password: string): string {
    let binary = '';
    for (const byte of new TextEncoder().encode(`${username}:${password}`)) {
        binary += String.fromCharCode(byte);
    }
    return `Basic ${btoa(binary)}`;
}

async function request<T>(operation: string, path: string, init: RequestInit): Promise<T> {
    // Responses contain private emails: never store them in the HTTP cache
    const response = await fetch(`${ENDPOINT}${path}`, { ...init, cache: 'no-store' });
    if (!response.ok) {
        const body = await response.json().catch(() => null);
        const reason = typeof body?.error === 'string' ? `: ${body.error}` : '';
        const error = new ApiError(`${operation} failed (HTTP ${response.status})${reason}`, response.status);
        // Never send credentials, addresses or email contents to analytics
        posthog.captureException(error, { properties: { operation, status: response.status } });
        throw error;
    }
    return response.json();
}

/**
 * GET with the inbox credentials in the Authorization header: unlike the query string,
 * headers don't end up in server/proxy logs. Basic credentials can't have a ":" in the
 * username: only in that case the (encoded) query string is used.
 */
function getForAccount<T>(
    operation: string,
    path: string,
    params: Record<string, string>,
    username: string,
    password: string,
): Promise<T> {
    const query = new URLSearchParams(params);
    const headers: Record<string, string> = {};
    if (username.includes(':')) {
        query.set('username', username);
        query.set('password', password);
    } else {
        headers.Authorization = basicAuthorization(username, password);
    }
    const search = query.toString();
    return request<T>(operation, search ? `${path}?${search}` : path, { headers });
}

function sendJson<T>(operation: string, method: 'POST' | 'PATCH', path: string, body: unknown): Promise<T> {
    return request<T>(operation, path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

export function getEmailsFromApi(username: string, password: string, page: number = 1, unread: boolean = false) {
    // TODO: add unread filter
    return getForAccount<ApiEmail[]>('Fetch emails', '/emails', { page: String(page) }, username, password);
}

export function getDeltaEmailsFromApi(username: string, password: string, id: number) {
    return getForAccount<ApiEmail[]>('Fetch new emails', '/emails/delta', { latest: String(id) }, username, password);
}

export function getEmailFromApi(username: string, password: string, id: number) {
    return getForAccount<ApiEmail>('Fetch email', `/emails/${encodeURIComponent(id)}`, {}, username, password);
}

export async function getAccountsStatsFromApi(accounts: { username: string; password: string }[]) {
    const batches: Promise<ApiAccountStats[]>[] = [];
    for (let i = 0; i < accounts.length; i += STATS_BATCH_SIZE) {
        const batch = accounts.slice(i, i + STATS_BATCH_SIZE);
        batches.push(sendJson('Fetch accounts stats', 'POST', '/emails/stats', batch));
    }
    return (await Promise.all(batches)).flat();
}

export function postBurnAccount(username: string, password: string) {
    return sendJson('Burn account', 'POST', '/emails/burn', { username, password });
}

export function patchMarkEmailAsRead(emailId: number, username: string, password: string) {
    return sendJson('Mark email as read', 'PATCH', `/emails/read/${encodeURIComponent(emailId)}`, { username, password });
}

export function patchReadAllEmails(username: string, password: string) {
    return sendJson('Mark all emails as read', 'PATCH', '/emails/read/all', { username, password });
}
