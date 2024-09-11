import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const items = writable(browser ? JSON.parse(localStorage.getItem('items') || '[]') : []);

items.subscribe((value) => {
	if (browser) {
		localStorage.setItem('items', JSON.stringify(value));
	}
});
