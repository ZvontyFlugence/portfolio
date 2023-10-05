import { $, QRL, component$, useSignal } from '@builder.io/qwik';
import { ExpandIcon } from '../icons/expand';
import { MinimizeIcon } from '../icons/minimize';
import { CloseIcon } from '../icons/close';
import { ContractIcon } from '../icons/contract';

interface WindowControlsProps {
	onClose: QRL<() => void>;
	onMinimize: QRL<() => void>;
	onExpand: QRL<() => void>;
	onShrink: QRL<() => void>;
}

export default component$<WindowControlsProps>(({ onClose, onMinimize, onExpand, onShrink }) => {
	const isExpanded = useSignal<boolean>(false);

	const handleExpand = $(async () => {
		!isExpanded.value ? await onExpand() : await onShrink();
		isExpanded.value = !isExpanded.value;
	});

	return (
		<div class='absolute top-0 left-0 group flex items-center gap-1 w-fit p-2'>
			<div class='h-3 w-3 rounded-full bg-red-500 cursor-pointer' onClick$={onClose}>
				<CloseIcon class='hidden group-hover:block' color='#00000077' />
			</div>
			<div class='h-3 w-3 rounded-full bg-yellow-500 cursor-pointer' onClick$={onMinimize}>
				<MinimizeIcon class='hidden group-hover:block' color='#00000077' />
			</div>
			<div class='h-3 w-3 rounded-full bg-green-500 cursor-pointer' onClick$={handleExpand}>
				{!isExpanded.value ? (
					<ExpandIcon class='hidden group-hover:block -rotate-45' color='#00000077' />
				) : (
					<ContractIcon class='hidden group-hover:block -rotate-45' color='#00000077' />
				)}
			</div>
		</div>
	);
});
