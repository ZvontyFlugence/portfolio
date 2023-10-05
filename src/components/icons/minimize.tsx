import { QwikIntrinsicElements } from '@builder.io/qwik';

export function MinimizeIcon(props: QwikIntrinsicElements['svg'], key: string) {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' width='0.75em' height='0.75em' viewBox='0 0 24 24' {...props} key={key}>
			<path fill='currentColor' d='M19 11H5v2h14v-2Z'></path>
		</svg>
	);
}
