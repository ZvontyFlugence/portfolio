import { QwikIntrinsicElements } from '@builder.io/qwik';

export function UnknownFileIcon(props: QwikIntrinsicElements['svg'], key: string) {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24' {...props} key={key}>
			<path
				fill='currentColor'
				d='M21 9v11.992A1 1 0 0 1 20.007 22H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.447 2 3.998 2H14v6a1 1 0 0 0 1 1h6Zm0-2h-5V2.003L21 7Z'
			></path>
		</svg>
	);
}
