import { $, QwikDragEvent, component$, useContext, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import startsWith from 'lodash/startsWith';
import split from 'lodash/split';
import WindowControls from '../window-controls';
import { SystemContext } from '~/root';
import { find, trim, uniqueId } from 'lodash';
import * as commands from './commands';
import { AppProps } from '~/managers/window-manager';
import TerminalOutput, { TerminalOutputProps } from './output';

export interface CommandHistory {
	cmd: string;
	location: string;
	output: string;
}

const Terminal = component$<AppProps>(({ win_id, isExpanded, onMoveWindow$ }) => {
	const state = useContext(SystemContext);
	const location = useSignal<string>('/home/guest');

	// Terminal Positioning / Resizing State
	const dragOffsets = useStore({ x: 0, y: 0 });
	const containerRef = useSignal<HTMLDivElement | undefined>();
	const inputRef = useSignal<HTMLInputElement | undefined>();

	// Terminal Command State
	const cmdInput = useSignal<string>('');
	const cmdHistory = useSignal<CommandHistory[]>([]);
	const cmdHints = useSignal<string[]>([]);
	const pointer = useSignal<number>(-1);

	// Window Management
	const onClose = $(() => {
		state.windowManager?.closeWindow(win_id);
	});

	const onMinimize = $(() => {
		state.windowManager?.minimizeWindow(win_id);
	});

	const onExpand = $(() => {
		state.windowManager?.expandWindow(win_id);
	});

	const onShrink = $(() => {
		state.windowManager?.shrinkWindow(win_id);
	});

	const handleDragStart = $((event: QwikDragEvent<HTMLDivElement>, element: HTMLDivElement) => {
		const rect = (event.target as HTMLDivElement).getBoundingClientRect();
		dragOffsets.x = event.clientX - rect.x;
		dragOffsets.y = event.clientY - rect.y;

		requestAnimationFrame(() => {
			element.style.visibility = 'hidden';
		});
	});

	const handleDrag = $((event: QwikDragEvent<HTMLDivElement>, element: HTMLDivElement) => {
		const { clientX, clientY } = event;
		const [x, y] = [clientX - dragOffsets.x, clientY - dragOffsets.y];
		onMoveWindow$(x, y);

		element.style.visibility = 'visible';
	});

	// Terminal Input Management
	useVisibleTask$(({ track }) => {
		const termInput = track(() => inputRef.value);

		termInput?.addEventListener('keydown', (e: KeyboardEvent) => {
			// Completions
			if (e.key === 'Tab') {
				e.preventDefault();
				if (!cmdInput.value) return;

				let hints: string[] = [];
				commands.commandList.forEach(({ cmd }) => {
					if (startsWith(cmd, cmdInput.value)) {
						hints.push(cmd);
					}
				});

				if (hints.length > 1) {
					cmdHints.value = hints;
				} else if (hints.length === 1) {
					const currCmd = split(cmdInput.value, ' ');
					cmdInput.value = currCmd.length !== 1 ? [...currCmd, hints[0]].join(' ') : hints[0];
					cmdHints.value = [];
				}
			}

			// Go To Previous Command
			if (e.key === 'ArrowUp') {
				if (pointer.value >= cmdHistory.value.length) return;
				if (pointer.value + 1 === cmdHistory.value.length) return;

				cmdInput.value = cmdHistory.value.at(pointer.value + 1)?.cmd ?? '';
				++pointer.value;
				inputRef.value?.blur();
			}

			// Go To Next Command
			if (e.key === 'ArrowDown') {
				if (pointer.value < 0) return;
				if (pointer.value === 0) {
					cmdInput.value = '';
					pointer.value = -1;
					return;
				}

				cmdInput.value = cmdHistory.value.at(pointer.value - 1)?.cmd ?? '';
				--pointer.value;
				inputRef.value?.blur();
			}
		});
	});

	useVisibleTask$(({ track }) => {
		track(() => cmdInput.value);

		cmdHints.value = [];
	});

	const clearHistory = $(() => {
		cmdHistory.value = [];
		cmdHints.value = [];
	});

	const handleCommand = $(async (input: string): Promise<string> => {
		const [cmd, ...args] = split(trim(input), ' ');

		switch (cmd) {
			case 'cd':
				return commands.cd(args.at(0) ?? '', location, state.fsManager);
			case 'clear': {
				await clearHistory();
				return '';
			}
			case 'help':
				return commands.help();
			case 'ls':
				return commands.ls(location.value, state.fsManager);
			case 'mkdir':
				return commands.mkdir(args.at(0) ?? '', location.value, state.fsManager, state.desktopManager);
			case 'rm':
				const pathOrName = args.at(-1) ?? '';
				const restArgs = args.slice(0, -1);
				return commands.rm(restArgs, pathOrName, location.value, state.fsManager, state.desktopManager);
			case 'touch':
				return commands.touch(args.at(0) ?? '', location.value, state.fsManager, state.desktopManager);
			default:
				return `command not found: ${cmd}`;
		}
	});

	const handleSubmit = $(async () => {
		cmdHistory.value = [{ cmd: cmdInput.value, location: location.value, output: '' }, ...cmdHistory.value];
		cmdHistory.value.at(0)!.output = await handleCommand(cmdInput.value);
		cmdInput.value = '';
		cmdHints.value = [];
		pointer.value = -1;
	});

	const unResolvePath = $(() => {
		return location.value.replace('/home/guest', '~');
	});

	return (
		<div
			key={win_id}
			ref={containerRef}
			class={`relative glass !p-1 !rounded-xl flex flex-col gap-1 overflow-hidden ${isExpanded ? '!h-screen !w-screen' : ''}`}
			style={{ width: '600px', height: '300px' }}
			draggable={!isExpanded}
			preventdefault:drag
			onDragStart$={handleDragStart}
			onDragEnd$={handleDrag}
		>
			<div class='flex justify-center items-center'>
				<WindowControls onClose={onClose} onMinimize={onMinimize} onExpand={onExpand} onShrink={onShrink} />
				<span class='text-sm'>guest@zvontyf.dev: {unResolvePath()}</span>
			</div>
			<div class='flex flex-1 flex-col overflow-y-auto bg-black p-2 !rounded-xl text-sm'>
				{[...cmdHistory.value].reverse().map(({ cmd, location: loc, output }, index) => {
					const cmdArr = split(trim(cmd), ' ');
					const ctx: TerminalOutputProps = {
						cmd,
						location: loc.replace('/home/guest', '~'),
						output,
					};

					return (
						<div key={uniqueId(`${cmd}_`)} class='pb-2'>
							<div class='flex items-center gap-1'>
								<span class='font-semibold'>
									guest@<span class='text-primary'>zvontyf.dev</span>:{loc.replace('/home/guest', '~')}$
								</span>
								<span>{cmd}</span>
							</div>
							{cmd === '' ? <></> : <TerminalOutput {...ctx} />}
						</div>
					);
				})}
				<form class='flex items-center gap-2' preventdefault:submit onSubmit$={handleSubmit}>
					<label for={`terminal-input-${win_id}`} class='font-semibold'>
						guest@<span class='text-primary'>zvontyf.dev</span>:{unResolvePath()}$
					</label>
					<input
						id={`terminal-input-${win_id}`}
						ref={inputRef}
						type='text'
						name='cmd-prompt'
						class='bg-transparent !outline-none !ring-0 !border-none'
						autoComplete='off'
						autoCapitalize='off'
						spellcheck={false}
						bind:value={cmdInput}
						autoFocus
					/>
				</form>
				<div class='flex items-center gap-4'>
					{cmdHints.value.map((hint) => (
						<span key={hint}>{hint}</span>
					))}
				</div>
			</div>
		</div>
	);
});

export default Terminal;
