import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const DIVISIONS = [
	{ amount: 60, name: "seconds" },
	{ amount: 60, name: "minutes" },
	{ amount: 24, name: "hours" },
	{ amount: 7, name: "days" },
	{ amount: 4.34524, name: "weeks" },
	{ amount: 12, name: "months" },
	{ amount: Number.POSITIVE_INFINITY, name: "years" },
] as const;

const formatter = new Intl.RelativeTimeFormat(undefined, {
	numeric: "auto",
});

export function formatTimeAgo(date: Date, time: Date | null = null) {
	const currentTime = time || new Date();
	let duration = (date.getTime() - currentTime.getTime()) / 1000;

	for (let i = 0; i <= DIVISIONS.length; i++) {
		const division = DIVISIONS[i];
		if (Math.abs(duration) < division.amount) {
			return formatter.format(Math.round(duration), division.name);
		}
		duration /= division.amount;
	}
}

export function stripHtml(html: string) {
	let doc = new DOMParser().parseFromString(html, 'text/html');
	return doc.body.textContent || "";
}

export function getGreeting() {
	const hour = new Date().getHours();
	if (hour < 12) {
		return "Good morning";
	} else if (hour < 18) {
		return "Good afternoon";
	} else {
		return "Good evening";
	}
}