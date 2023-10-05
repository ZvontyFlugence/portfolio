import { $, Component, QRL } from '@builder.io/qwik';
import { v4 as uuidv4 } from 'uuid';
import DesktopIcon, { DesktopIconType } from '~/components/ui/desktop-icon';
import { FileSystemManager } from './file-system/manager';
import { FSDir, FSNodeType } from '~/managers/file-system/initial-fs';

export type DesktopItemProps = {
	slot_id: string;
	props: Record<string, any>;
};

export type DesktopSlot = {
	id: string;
	Content?: Component<DesktopItemProps>;
	props: Record<string, any>;
	selected: boolean;
};

export type DesktopManager = {
	rows: number;
	columns: number;
	slots: DesktopSlot[][];
	draggedItem: HTMLDivElement | undefined;
	// slottedItems: { [key: string]: string }; // Maps FSNode id (uuid) to DesktopSlot id (uuid)
	load: QRL<(fsManger: FileSystemManager) => Promise<void>>;
	resize: QRL<(width: number, height: number) => void>;
};

export type DesktopManagerStore = { desktopManager: DesktopManager };

const initialSlots: DesktopSlot[][] = Array.from<DesktopSlot[]>({ length: 8 }).map(() =>
	Array.from<DesktopSlot>({ length: 12 }).map(() => ({ id: uuidv4(), props: {}, selected: false }))
);

export const desktopManager = {
	rows: 8,
	columns: 12,
	slots: initialSlots,
	draggedItem: undefined,
	// slottedItems: {},
	load: $(async function (this: DesktopManager, fsManager: FileSystemManager) {
		const desktopFolder = (await fsManager.findPath('~/Desktop')) as FSDir | null;
		if (!desktopFolder || desktopFolder.type !== FSNodeType.Folder) return;

		// Place items starting by row in the last available column for the row
		let row = 0;
		let col = this.columns - 1;
		this.slots = Array.from<DesktopSlot[]>({ length: this.rows }).map(() =>
			Array.from<DesktopSlot>({ length: this.columns }).map(() => ({ id: uuidv4(), props: {}, selected: false }))
		);
		for (let item of desktopFolder.children) {
			// Make sure this item wasn't isnt supposed to be in another slot
			// and that this slot isn't supposed to have another item in it
			// if (!this.slottedItems[item.id] && !Object.values(this.slottedItems).includes(this.slots[row][col].id)) {
			this.slots[row][col].props = {
				type: item.type === FSNodeType.Folder ? DesktopIconType.Folder : DesktopIconType.File,
				name: item.name,
			};
			this.slots[row][col].Content = DesktopIcon;
			// this.slottedItems[item.id] = this.slots[row][col].id;

			row = (row + 1) % this.rows;
			if (row === 0) {
				col = (col - 1) % this.columns;
			}
			// } else {
			// 	let [correctRow, correctCol] = [-1, -1];
			// 	for (let i = this.columns - 1; i >= 0; --i) {
			// 		for (let j = 0; j < this.rows; ++j) {
			// 			if (this.slots[j][i].id === this.slottedItems[item.id]) {
			// 				correctRow = j;
			// 				correctCol = i;
			// 				break;
			// 			}
			// 		}
			// 	}

			// 	if (correctRow === -1 || correctCol === -1) {
			// 		console.log('Is this actually happening?', this.slottedItems);
			// 		return; // Should not happen, but just in case
			// 	}

			// 	this.slots[correctRow][correctCol].props = {
			// 		type: item.type === FSNodeType.Folder ? DesktopIconType.Folder : DesktopIconType.File,
			// 		name: item.name,
			// 	};
			// 	this.slots[correctRow][correctCol].Content = DesktopIcon;
			// }
		}
	}),
	resize: $(function (this: DesktopManager, width: number, height: number) {
		// TODO: Implement calculation of rows/columns
		// TODO: Create new 2d slot array
		// TODO: Reposition items into new slots
	}),
};
