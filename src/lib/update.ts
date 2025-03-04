
import PostalMime from "postal-mime";
import {
    emails,
    isLoadingEmails,
} from "$lib/stores/accounts.js";
import { getDeltaEmailsFromApi, getEmailsFromApi } from "$lib/api";
import { get } from 'svelte/store';

const emailsPerPage = 10;

export async function loadDeltaEmails(name: string, password: string, firstId: number) {
    const apiData = await getDeltaEmailsFromApi(
        name,
        password,
        firstId,
    );
    if (apiData.length > 0) {
        for (const email of apiData) {
            const parsed = await PostalMime.parse(email.content);
            emails.update((currentEmails) => {
                const index = currentEmails.findIndex((e) => e.id === email.id);
                if (index !== -1) {
                    const updatedEmails = [...currentEmails];
                    updatedEmails[index] = {
                        ...parsed,
                        is_read: email.is_read == 1,
                        id: email.id,
                        raw: email.content,
                    };
                    return updatedEmails;
                }
                return [
                    {
                        ...parsed,
                        is_read: email.is_read == 1,
                        id: email.id,
                        raw: email.content,
                    },
                    ...currentEmails,
                ];
            });
        }
    }
}

export async function loadEmails(name: string, password: string, page: number) {
    if (get(isLoadingEmails)) return;

    try {
        isLoadingEmails.set(true);

        const apiData = await getEmailsFromApi(
            name,
            password,
            page,
        );

        // Se non ci sono più email da caricare
        if (apiData.length === 0) {
            return false;
        }

        for (const email of apiData) {
            const parsed = await PostalMime.parse(email.content);
            emails.update((currentEmails) => {
            const index = currentEmails.findIndex((e) => e.id === email.id);
            if (index !== -1) {
                const updatedEmails = [...currentEmails];
                updatedEmails[index] = {
                    ...parsed,
                    is_read: email.is_read == 1,
                    id: email.id,
                    raw: email.content,
                };
                return updatedEmails;
            }
            return [
                ...currentEmails,
                {
                    ...parsed,
                    is_read: email.is_read == 1,
                    id: email.id,
                    raw: email.content,
                },
            ];
        });
        }

        return apiData.length === emailsPerPage;
    } catch (error) {
        console.error("Error retrieving data:", error);
        return false;
    } finally {
        isLoadingEmails.set(false);
    }
}