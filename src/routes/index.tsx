import { $, QwikDragEvent, component$, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { uniqueId } from 'lodash';
import GlobalSearch from '~/components/global-search/global-search';
import WindowContainer from '~/components/ui/window-container';
import { SystemContext } from '~/root';

export default component$(() => {
	const systemState = useContext(SystemContext);
	const showGlobalSearch = useSignal<boolean>(true);

	const activeWindows = useComputed$(() => {
		return systemState.windowManager.activeWindows;
	});

	const desktopSlots = useComputed$(() => {
		return systemState.desktopManager.slots;
	});

	const handleDragOver = $((event: QwikDragEvent<HTMLDivElement>, _element: HTMLDivElement) => {
		event.dataTransfer.dropEffect = 'move';
	});

	const handleDrop = $((_event: QwikDragEvent<HTMLDivElement>, element: HTMLDivElement) => {
		if (systemState.desktopManager.draggedItem) {
			systemState.desktopManager.draggedItem.parentNode?.removeChild(systemState.desktopManager.draggedItem);
			element.replaceChildren(systemState.desktopManager.draggedItem);
			systemState.desktopManager.draggedItem.style.visibility = 'visible';
			systemState.desktopManager.draggedItem = undefined;
		}
	});

	const handleCloseSearch = $(() => {
		showGlobalSearch.value = false;
	});

	return (
		<div class='relative flex h-screen mt-8' preventdefault:dragover onDragOver$={handleDragOver}>
			{activeWindows.value.map((window) => (
				<WindowContainer key={window.id} window={window} />
			))}
			<div class='grid w-full md:grid-rows-8 sm:grid-rows-6 xs:grid-rows-4 gap-4 py-2 pb-10'>
				{desktopSlots.value.map((row, i) => (
					<div key={uniqueId(`slot_row_${i}`)} class='row-span-1 grid grid-cols-12'>
						{row.map((slot) => (
							<div
								key={slot.id}
								class={`col-span-1 h-full w-full overflow-hidden ${slot.selected ? 'glass-bg' : ''}`}
								preventdefault:dragover
								onDragOver$={handleDragOver}
								onDrop$={handleDrop}
							>
								{slot.Content ? <slot.Content slot_id={slot.id} props={slot.props} /> : <></>}
							</div>
						))}
					</div>
				))}
			</div>
			{showGlobalSearch.value && <GlobalSearch onClickOutside$={handleCloseSearch} />}
		</div>
	);
});

export const head: DocumentHead = {
	title: 'Zvonty Flugence | Portfolio',
	meta: [
		{
			name: 'description',
			content: 'Personal portfolio website for Software Engineer Zvonty Flugence',
		},
	],
};
