import { QwikIntrinsicElements } from '@builder.io/qwik';

export function ExpandIcon(props: QwikIntrinsicElements['svg'], key: string) {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' width='0.75em' height='0.75em' viewBox='0 0 24 24' {...props} key={key}>
			<path fill='currentColor' d='m18 9l-6-6l-6 6h12Zm0 6l-6 6l-6-6h12Z'></path>
		</svg>
	);
}
