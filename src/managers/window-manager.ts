import { $, Component, QRL } from '@builder.io/qwik';
import { v4 as uuidv4 } from 'uuid';
import terminal from '~/components/ui/terminal';

export type AppProps = {
	win_id: string;
	isExpanded: boolean;
	onMoveWindow$: QRL<(x: number, y: number) => void>;
	[key: string]: any;
};

export enum AppType {
	Terminal,
}

export type Window = {
	id: string;
	type: AppType;
	App: Component<AppProps>;
	position: [number, number];
	dimensions: [number, number];
	isExpanded: boolean;
};

export interface WindowManager {
	windows: Window[];
	activeWindows: Window[];
	openWindow: QRL<(App: Component<AppProps>, type: AppType) => void>;
	activateWindow: QRL<(win_id: string) => void>;
	minimizeWindow: QRL<(win_id: string) => void>;
	expandWindow: QRL<(win_id: string) => void>;
	shrinkWindow: QRL<(win_id: string) => void>;
	closeWindow: QRL<(win_id: string) => void>;
}

export type WindowManagerStore = { windowManager: WindowManager };

const initialTerminal: Window = {
	id: uuidv4(),
	type: AppType.Terminal,
	App: terminal,
	position: [0, 0],
	dimensions: [600, 300],
	isExpanded: false,
};

export const windowManager: WindowManager = {
	windows: [initialTerminal],
	activeWindows: [initialTerminal],

	openWindow: $(function (this: WindowManager, App: Component<AppProps>, type: AppType) {
		const newWindow: Window = {
			id: uuidv4(),
			type,
			App,
			position: [0, 0],
			dimensions: [600, 300],
			isExpanded: false,
		};

		this.windows.push(newWindow);
		this.activeWindows.push(newWindow);
	}),
	activateWindow: $(function (this: WindowManager, win_id: string) {
		let window = this.windows.find((win) => win.id === win_id);
		if (!window) return;

		if (this.activeWindows.indexOf(window) !== -1) return;

		this.activeWindows.push(window);
	}),
	minimizeWindow: $(function (this: WindowManager, win_id: string) {
		let index = this.activeWindows.findIndex((win) => win.id === win_id);
		if (index === -1) return;

		this.activeWindows.splice(index, 1);
	}),
	expandWindow: $(function (this: WindowManager, win_id: string) {
		let window = this.activeWindows.find((win) => win.id === win_id);
		if (!window) return;

		window.isExpanded = true;
	}),
	shrinkWindow: $(function (this: WindowManager, win_id: string) {
		let window = this.activeWindows.find((win) => win.id === win_id);
		if (!window) return;

		window.isExpanded = false;
	}),
	closeWindow: $(function (this: WindowManager, win_id: string) {
		let index = this.windows.findIndex((win) => win.id === win_id);
		if (index === -1) return;

		const target = this.windows.splice(index, 1).at(0);
		if (!target) return;

		index = this.activeWindows.indexOf(target);
		this.activeWindows.splice(index, 1);
	}),
};
