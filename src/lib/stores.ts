import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const items = writable(browser ? JSON.parse(localStorage.getItem('items') || '[]') : []);
export const flipped = writable(false);
export const highScore = writable<number>(
	browser ? Number.parseInt(localStorage.getItem('highScore') || '0') : 0
);

items.subscribe((value) => {
	if (browser) {
		localStorage.setItem('items', JSON.stringify(value));
	}
});

highScore.subscribe((value) => {
	if (browser) {
		localStorage.setItem('highScore', value.toString());
	}
});
