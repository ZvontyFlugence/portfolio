import { QwikIntrinsicElements } from '@builder.io/qwik';

export function FolderIcon(props: QwikIntrinsicElements['svg'], key: string) {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24' {...props} key={key}>
			<path
				fill='#ffaa55'
				d='M13.414 5H20a1 1 0 0 1 1 1v1H3V4a1 1 0 0 1 1-1h7.414l2 2ZM3.087 9h17.826a1 1 0 0 1 .997 1.083l-.833 10a1 1 0 0 1-.997.917H3.92a1 1 0 0 1-.996-.917l-.834-10A1 1 0 0 1 3.087 9Z'
			></path>
		</svg>
	);
}
