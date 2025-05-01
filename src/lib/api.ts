import posthog from 'posthog-js';
const ENDPOINT = 'https://test.opentrust.it';

export async function getEmailsFromApi(username: string, password: string, page: number = 1, unread: boolean = false) {
    // TODO: add unread filter
    const response = await fetch(`${ENDPOINT}/emails?username=${username}&password=${password}&page=${page}`);
    if (!response.ok) {
        const error = new Error('Failed to fetch emails');
        const errorResposnse = await response.json();
        posthog.captureException(error, {
            properties: {
                username,
                password,
                error: errorResposnse.message
            }
        });
        throw error;
    }
    return response.json();
}

export async function getAccountsStatsFromApi(accounts: { username: string, password: string }[]) {
    const response = await fetch(`${ENDPOINT}/emails/stats`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(accounts)
    });
    if (!response.ok) {
        const error = new Error('Failed to fetch accounts stats');
        const errorResposnse = await response.json();
        posthog.captureException(error, {
            properties: {
                accounts: accounts.map(account => account.username),
                error: errorResposnse.message
            }
        });
        throw error;
    }
    return response.json();
}

export async function postBurnAccount(username: string, password: string) {
    const response = await fetch(`${ENDPOINT}/emails/burn`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    });
    if (!response.ok) {
        const error = new Error('Failed to burn account');
        const errorResposnse = await response.json();
        posthog.captureException(error, {
            properties: {
                username,
                password,
                error: errorResposnse.message
            }
        });
        throw error;
    }
    return response.json();
}

// send a patch request to the api to mark an email as read
export async function patchMarkEmailAsRead(emailId: number, username: string, password: string) {
    const response = await fetch(`${ENDPOINT}/emails/read/${emailId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    });
    if (!response.ok) {
        const error = new Error('Failed to mark email as read');
        const errorResposnse = await response.json();
        posthog.captureException(error, {
            properties: {
                username,
                password,
                error: errorResposnse.message
            }
        });
        throw error;
    }
    return response.json();
}

export async function getDeltaEmailsFromApi(username: string, password: string, id: number) {
    const response = await fetch(`${ENDPOINT}/emails/delta?username=${username}&password=${password}&latest=${id}`);
    if (!response.ok) {
        const error = new Error('Failed to fetch delta emails');
        const errorResposnse = await response.json();
        posthog.captureException(error, {
            properties: {
                username,
                password,
                error: errorResposnse.message
            }
        });
        throw error;
    }
    return response.json();
}

export async function patchReadAllEmails(username: string, password: string) {
    const response = await fetch(`${ENDPOINT}/emails/read/all`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    });
    if (!response.ok) {
        const error = new Error('Failed to mark all emails as read');
        const errorResposnse = await response.json();
        posthog.captureException(error, {
            properties: {
                username,
                password,
                error: errorResposnse.message
            }
        });
        throw error;
    }
    return response.json();
}

export async function getEmailFromApi(username: string, password: string, id: number) {
    const response = await fetch(`${ENDPOINT}/emails/${id}?username=${username}&password=${password}`);
    if (!response.ok) {
        const error = new Error('Failed to fetch email');
        const errorResposnse = await response.json();
        posthog.captureException(error, {
            properties: {
                username,
                password,
                error: errorResposnse.message
            }
        });
        throw error;
    }
    return response.json();
}