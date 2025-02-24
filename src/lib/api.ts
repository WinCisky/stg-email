const ENDPOINT = 'https://test.opentrust.it';

export async function getEmailsFromApi(username: string, password: string, page: number = 1) {
    const response = await fetch(`${ENDPOINT}/emails?username=${username}&password=${password}&page=${page}`);
    if (!response.ok) {
        throw new Error('Failed to fetch emails');
    }
    return response.json();
}

export async function getAccountsStatsFromApi(accounts: { username: string, password: string }[]) {
    const response = await fetch(`${ENDPOINT}/emails/stats`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({accounts: accounts})
    });
    if (!response.ok) {
        throw new Error('Failed to fetch accounts stats');
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
        throw new Error('Failed to burn account');
    }
    return response.json();
}