import { Signal } from '@builder.io/qwik';

export function useClickOutside(target: Signal<HTMLElement | undefined>, callback: () => void) {
	if (!target.value) return;

	window.addEventListener('click', (event: MouseEvent) => {
		if (!target.value) return;

		for (let child of target.value.childNodes ?? []) {
			if (child.contains(event.target as HTMLElement)) {
				return;
			}
		}

		if (!(event.target instanceof HTMLElement) || !target.value.contains(event.target as HTMLElement)) {
			callback();
		}
	});
}
