import { Signal } from '@builder.io/qwik';
import { DesktopManager } from '~/managers/desktop-manager';
import { FileSystemManager } from '~/managers/file-system/manager';
import { FSDir, FSNodeType } from '~/managers/file-system/initial-fs';

interface CommandInfo {
	cmd: string;
	description: string;
}

export const commandList: CommandInfo[] = [
	{ cmd: 'help', description: 'Display this help menu' },
	{ cmd: 'ls', description: 'Display files at the current path' },
	{ cmd: 'cd', description: 'Move to another directory in the filesystem' },
	// { cmd: 'echo', description: 'Print input into console' },
	{ cmd: 'clear', description: 'Clear terminal command history buffer' },
	{ cmd: 'touch', description: 'Update modification time of a file, creating a new empty file if it does not exist' },
	{ cmd: 'mkdir', description: 'Create a new empty folder' },
];

export async function cd(path: string, locSig: Signal<string>, fsManager: FileSystemManager): Promise<string> {
	const target = await fsManager.findPath(path, locSig.value);
	if (!target) return 'Path not found';
	if (target.type !== FSNodeType.Folder) return `'${path}' is not a directory`;

	locSig.value = target.path + target.name;
	return '';
}

export async function ls(location: string, fsManager: FileSystemManager): Promise<string> {
	if (!location) return '';

	const cwd = await fsManager.findPath(location);
	if (!cwd) return 'Path not found';
	if (cwd.type !== FSNodeType.Folder) return 'Current location is not a directory';

	return (cwd as FSDir).children.map((child) => child.name).join(' ');
}

export async function help(): Promise<string> {
	return commandList.map(({ cmd, description: desc }) => `${cmd}\t\t${desc}`).join('\n');
}

export async function touch(name: string, location: string, fsManager: FileSystemManager, desktopManager: DesktopManager): Promise<string> {
	if (!name) return 'usage: touch file';
	const [output, createdFile] = await fsManager.createFile(name, location);
	await desktopManager.load(fsManager);
	return output;
}

export async function mkdir(name: string, location: string, fsManager: FileSystemManager, desktopManager: DesktopManager): Promise<string> {
	if (!name) return 'usage: mkdir directory_name';
	const [output, createdFolder] = await fsManager.createFolder(name, location);
	await desktopManager.load(fsManager);
	return output;
}

export async function rm(
	args: string[],
	pathOrName: string,
	location: string,
	fsManager: FileSystemManager,
	desktopManager: DesktopManager
): Promise<string> {
	if (!pathOrName) return 'usage: rm [-fr] fileOrDirectory';

	const validModes: Record<string, boolean> = { f: false, r: false };
	for (let arg of args) {
		let argParts = [];
		arg = arg.replace('-', '');
		if (arg.length > 1) {
			argParts = arg.split('');
		} else {
			argParts.push(arg);
		}

		for (let splitArg of argParts) {
			switch (splitArg) {
				case 'f':
				case 'r':
					validModes[splitArg] = true;
					break;
				default:
					break;
			}
		}
	}

	const [output, removedNode] = await fsManager.delete(pathOrName, location, validModes);
	// if (removedNode) delete desktopManager.slottedItems[removedNode.id];
	await desktopManager.load(fsManager);
	return output;
}
