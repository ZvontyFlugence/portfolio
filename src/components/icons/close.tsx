import { QwikIntrinsicElements } from '@builder.io/qwik';

export function CloseIcon(props: QwikIntrinsicElements['svg'], key: string) {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' width='0.75em' height='0.75em' viewBox='0 0 24 24' {...props} key={key}>
			<path
				fill='currentColor'
				d='m12 10.586l4.95-4.95l1.415 1.415l-4.95 4.95l4.95 4.95l-1.415 1.414l-4.95-4.95l-4.95 4.95l-1.413-1.415l4.95-4.95l-4.95-4.95L7.05 5.638l4.95 4.95Z'
			></path>
		</svg>
	);
}
