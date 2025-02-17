import { writable } from 'svelte/store';
import type { Account, AccountCredentials } from '$lib/data.ts';
import { browser } from '$app/environment';

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