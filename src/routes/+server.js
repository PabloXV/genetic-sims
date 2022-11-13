import { getContext } from 'svelte';
import { writable } from 'svelte/store';

export const canvas = writable();
export const key = Symbol();

export const renderable = (render) => {
	const api = getContext(key);
	const element = {
		render: render,
	};
  
	api.add(element);
}