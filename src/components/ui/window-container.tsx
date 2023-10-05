import { $, component$ } from '@builder.io/qwik';
import { Window } from '~/managers/window-manager';

interface WindowContainerProps {
	window: Window;
}

// Magic numbers to get the positioning to look more accurate
const X_OFFSET: number = 15;
const Y_OFFSET: number = 40;

export default component$<WindowContainerProps>(({ window }) => {
	const { id, App, isExpanded } = window;

	const handleMoveWindow = $((x: number, y: number) => {
		window.position = [x - X_OFFSET, y - Y_OFFSET];
	});

	return (
		<div
			key={id}
			class='absolute'
			style={{ top: `${isExpanded ? -9 : window.position[1]}px`, left: `${isExpanded ? -15 : window.position[0]}px` }}
		>
			<App win_id={id} isExpanded={isExpanded} onMoveWindow$={handleMoveWindow} />
		</div>
	);
});
