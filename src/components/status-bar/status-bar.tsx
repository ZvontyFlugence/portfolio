import { $, QwikMouseEvent, component$, useContext, useSignal } from '@builder.io/qwik';
import { format } from 'date-fns';
import { SystemContext } from '~/root';
import { useClickOutside } from '~/utils/outside-click';
import terminal from '../ui/terminal';
import { AppType } from '~/managers/window-manager';

/**
 * The StatusBar component represents the status bar of a desktop OS.
 * It will display the Date and Time, and potentially additional widgets.
 */
export const StatusBar = component$(() => {
	const showTerminalOptions = useSignal<boolean>(false);
	const terminalOptionsRef = useSignal<HTMLUListElement | undefined>();
	const state = useContext(SystemContext);

	useClickOutside(terminalOptionsRef, () => (showTerminalOptions.value = false));

	const handleTerminalClick = $((event: QwikMouseEvent<HTMLSpanElement, MouseEvent>) => {
		event.stopPropagation();
		showTerminalOptions.value = !showTerminalOptions.value;
	});

	const handleNewTerminalWindow = $(() => {
		state.windowManager.openWindow(terminal, AppType.Terminal);
		showTerminalOptions.value = false;
	});

	const handleShowAllTerminalWindows = $(async () => {
		console.log('All Windows Count:', state.windowManager.windows.length);

		let termCount = 0;
		for (let { id: win_id, type: appType } of state.windowManager.windows) {
			if (appType === AppType.Terminal) {
				termCount++;
				await state.windowManager.activateWindow(win_id);
			} else {
				await state.windowManager.minimizeWindow(win_id);
			}
		}

		console.log('Terminal Window Count:', termCount);

		showTerminalOptions.value = false;
	});

	return (
		<div class='absolute top-0 left-0 glass-around !rounded-none flex !w-screen justify-between text-sm p-1 z-50'>
			<div class='flex gap-4'>
				<div class='relative'>
					<span class='cursor-pointer' onClick$={handleTerminalClick}>
						Terminal
					</span>
					{showTerminalOptions.value && (
						<ul ref={terminalOptionsRef} class='absolute top-8 left-0 glass text-sm'>
							<li class='cursor-pointer' onClick$={handleNewTerminalWindow}>
								New Window
							</li>
							<li class='cursor-pointer' onClick$={handleShowAllTerminalWindows}>
								Show All Windows
							</li>
						</ul>
					)}
				</div>
			</div>
			<div class='flex justify-end gap-4'>
				<span class='text-white'>{format(new Date(), 'iii MMM dd')}</span>
				<span class='text-white'>{format(new Date(), 'hh:mm a')}</span>
			</div>
		</div>
	);
});
