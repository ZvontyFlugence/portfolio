import { $, QwikDragEvent, component$, useContext, useStore } from '@builder.io/qwik';
import { SystemContext } from '~/root';
import { FolderIcon, UnknownFileIcon } from '../icons';

export enum DesktopIconType {
	File,
	Folder,
}

interface DesktopIconProps {
	slot_id: string;
	props: Record<string, any>;
}

export default component$<DesktopIconProps>(({ slot_id, props }) => {
	const systemState = useContext(SystemContext);
	const dragOffsets = useStore({ x: 0, y: 0 });

	const getIcon = () => {
		switch (props['type']) {
			case DesktopIconType.Folder:
				return <FolderIcon class='h-16 w-16 object-contain' />;
			case DesktopIconType.File:
			default:
				return <UnknownFileIcon class='h-16 w-16 object-contain' />;
		}
	};

	const handleClick = $(() => {
		const row = systemState.desktopManager.slots.find((row) => row.find((slot) => slot.id === slot_id));
		if (!row) return;

		const slot = row?.find((slot) => slot.id === slot_id);
		if (!slot) return;

		switch (slot.selected) {
			case true:
				slot.selected = false;
				// TODO: Open FileReader
				break;
			case false:
			default:
				slot.selected = true;
				break;
		}
	});

	const handleDragStart = $((event: QwikDragEvent<HTMLDivElement>, element: HTMLDivElement) => {
		const rect = (event.target as HTMLDivElement).getBoundingClientRect();
		dragOffsets.x = event.clientX - rect.x;
		dragOffsets.y = event.clientY - rect.y;

		systemState.desktopManager.draggedItem = element;

		requestAnimationFrame(() => {
			element.style.visibility = 'hidden';
		});
	});

	return (
		<div
			class='flex flex-col items-center justify-center h-full w-full gap-2 cursor-pointer'
			onClick$={handleClick}
			draggable
			preventdefault:drag
			onDragStart$={handleDragStart}
		>
			{getIcon()}
			<span class='text-sm'>{props['name']}</span>
		</div>
	);
});
