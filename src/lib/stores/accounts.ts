import { writable } from 'svelte/store';
import type { Account, AccountCredentials } from '$lib/data.ts';
import { browser } from '$app/environment';
import type { Email } from '$lib/data';

// accounts

let initialAccounts: Account[] = [];

if (browser) {
    const storedAccounts = localStorage.getItem('accounts');
    initialAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];
}

export const accounts = writable<Set<Account>>(new Set(initialAccounts));

accounts.subscribe((value) => {
    if (browser) {
        localStorage.setItem('accounts', JSON.stringify(Array.from(value)));
    }
});

// currentAccount

let initialCurrentAccount: AccountCredentials | null = null;

if (browser) {
    const storedCurrentAccount = localStorage.getItem('currentAccount');
    initialCurrentAccount = storedCurrentAccount ? JSON.parse(storedCurrentAccount) : null;
}

export const currentAccount = writable<AccountCredentials | null>(initialCurrentAccount);

currentAccount.subscribe((value) => {
    if (browser && value != null) {
        localStorage.setItem('currentAccount', JSON.stringify(value));
    }
});

// selectedSorting

let initialSelectedSorting = null;

if (browser) {
    const storedSorting = localStorage.getItem('selectedSorting');
    initialSelectedSorting = storedSorting ? storedSorting : 'created';
}

export const selectedSorting = writable<string | null>(initialSelectedSorting);

selectedSorting.subscribe((value) => {
    if (browser && value != null) {
        localStorage.setItem('selectedSorting', value);
    }
});

// mailStore

type MailStore = {
    selected: Email | null;
};

function createMailStore() {
    const store = writable<MailStore>({ selected: null });

    return {
        subscribe: store.subscribe,
        setMail: (email: Email) => {
            store.update((store) => ({ ...store, selected: email }));
        },
        clearMail: () => {
            store.update((store) => ({ ...store, selected: null }));
        }
    };
}

export const mailStore = createMailStore();

// emails

export const emails = writable<Email[]>([]);

export const currentPageEmails = writable(1);
export const isLoadingEmails = writable(false);