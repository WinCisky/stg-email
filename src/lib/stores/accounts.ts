import { writable } from 'svelte/store';
import type { Account, AccountCredentials } from '$lib/data.ts';
import type Mail from '$lib/components/mail.svelte';
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

// mailStore

type MailStore = {
	selected: Mail["id"] | null;
};

function createMailStore() {
	const store = writable<MailStore>({ selected: null });

	return {
		subscribe: store.subscribe,
		setMail: (id: Mail["id"]) => {
			store.update((store) => ({ ...store, selected: id }));
		},
	};
}

export const mailStore = createMailStore();
