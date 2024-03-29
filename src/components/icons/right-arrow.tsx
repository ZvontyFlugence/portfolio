import { QwikIntrinsicElements } from '@builder.io/qwik';

export function RightArrow(props: QwikIntrinsicElements['svg'], key: string) {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24' {...props} key={key}>
			<path fill='currentColor' d='m16.172 11l-5.364-5.364l1.414-1.414L20 12l-7.778 7.778l-1.414-1.414L16.172 13H4v-2h12.172Z'></path>
		</svg>
	);
}
