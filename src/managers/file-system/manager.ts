import { $, QRL } from '@builder.io/qwik';
import { v4 as uuidv4 } from 'uuid';
import { DesktopIconType } from '~/components/ui/desktop-icon';
import { FSDir, FSFile, FSNode, FSNodeType, rootNode } from './initial-fs';

export interface FileSystemManager {
	root: FSNode;
	iconAssociations: Record<FSNodeType, DesktopIconType>;
	initialize: QRL<() => void>;
	resolvePath: QRL<(path: string, cwd: string) => string>;
	findPath: QRL<(path: string, cwd?: string) => Promise<FSNode | null>>;
	createFile: QRL<(name: string, cwd?: string) => Promise<[string, FSNode | null]>>;
	createFolder: QRL<(name: string, cwd?: string) => Promise<[string, FSNode | null]>>;
	delete: QRL<(pathOrName: string, cwd?: string, modes?: Record<string, boolean>) => Promise<[string, FSNode | null]>>;
	commitChanges: QRL<() => Promise<void>>;
}

export const fsManager: FileSystemManager = {
	root: rootNode,
	iconAssociations: {} as Record<FSNodeType, DesktopIconType>,
	initialize: $(function (this: FileSystemManager) {
		if (!localStorage.getItem('vda1')) {
			const serialized = JSON.stringify({
				...this,
				initialize: undefined,
				resolvePath: undefined,
				findPath: undefined,
				createFile: undefined,
				createFolder: undefined,
				commitChanges: undefined,
			});
			localStorage.setItem('vda1', serialized);
			return;
		}

		const disk = JSON.parse(localStorage.getItem('vda1')!) as FileSystemManager;
		this.root = disk.root;
		this.iconAssociations = disk.iconAssociations;
	}),
	resolvePath: $(function (path: string, cwd: string): string {
		if (!path) return '/home/guest';
		const pathParts = cwd.replace('~', '/home/guest').split('/');
		const relativeParts = path.replace('~', '/home/guest').split('/');

		if (relativeParts.at(0) === '') return relativeParts.join('/');
		if (pathParts.at(-1) === '') pathParts.pop();

		for (let dir of relativeParts) {
			if (dir === '..') pathParts.pop();
			else if (dir === '.' || !dir) continue;
			else pathParts.push(dir);
		}

		return pathParts.join('/');
	}),
	findPath: $(async function (this: FileSystemManager, path: string, cwd: string = ''): Promise<FSNode | null> {
		const resolvedPath = await this.resolvePath(path, cwd);

		let currentPath = '';
		let currentNode = this.root;
		const seen: Record<string, boolean> = {};
		while (currentPath !== resolvedPath) {
			if (seen[currentNode.id]) return null;

			if (currentNode.type !== FSNodeType.Folder) {
				if (resolvedPath === currentNode.path + currentNode.name) return currentNode;
				return null;
			}

			currentPath = currentNode.path + currentNode.name;
			seen[currentNode.id] = true;

			// Cast to unknown first because for some reason TypeScript thinks `currentNode` is a `FSFile` but that is impossible at this point
			for (let child of (currentNode as FSDir).children) {
				if (resolvedPath.includes(child.path + child.name)) {
					currentNode = child;
					break;
				}
			}
		}

		return currentNode;
	}),
	createFile: $(async function (this: FileSystemManager, name: string, cwd: string = ''): Promise<[string, FSNode | null]> {
		// Get file parent folder
		let targetFolder: FSDir;
		if (name.includes('/')) {
			const path = await this.resolvePath(name, cwd);
			const folder = (await this.findPath(path, cwd)) as FSDir | null;
			if (!folder) return [`${path}: No such file or directory`, null];
			targetFolder = folder;
		} else {
			const folder = (await this.findPath(cwd)) as FSDir | null;
			if (!folder) return [`${cwd}/${name}: No such file or directory`, null];
			targetFolder = folder;
		}

		// If file already exists, only update the lastModified time
		const filePath = `${targetFolder.path + targetFolder.name}/`;
		const existingFile = await this.findPath(filePath + name, cwd);
		if (existingFile) {
			existingFile.lastModified = new Date();
			await this.commitChanges();
			return ['', null];
		}

		const file: FSFile = {
			id: uuidv4(),
			type: FSNodeType.Unknown,
			name,
			path: filePath,
			content: '',
			createDate: new Date(),
			lastModified: new Date(),
		};

		targetFolder.children.push(file);
		await this.commitChanges();
		return ['', file];
	}),
	createFolder: $(async function (this: FileSystemManager, name: string, cwd: string = ''): Promise<[string, FSNode | null]> {
		// Get file parent folder
		let targetFolder: FSDir;
		if (name.includes('/')) {
			const path = await this.resolvePath(name, cwd);
			const folder = (await this.findPath(path, cwd)) as FSDir | null;
			if (!folder) return [`${path}: No such file or directory`, null];
			targetFolder = folder;
		} else {
			const folder = (await this.findPath(cwd)) as FSDir | null;
			if (!folder) return [`${cwd}/${name}: No such file or directory`, null];
			targetFolder = folder;
		}

		const folderPath = `${targetFolder.path + targetFolder.name}/`;
		const existingFolder = await this.findPath(folderPath + name, cwd);
		if (existingFolder) {
			return [`${name}: File or directory already exists`, null];
		}

		const folder: FSDir = {
			id: uuidv4(),
			type: FSNodeType.Folder,
			name,
			path: folderPath,
			createDate: new Date(),
			lastModified: new Date(),
			children: [],
		};

		targetFolder.children.push(folder);
		await this.commitChanges();
		return ['', folder];
	}),
	commitChanges: $(async function (this: FileSystemManager) {
		const serialized = JSON.stringify({
			...this,
			initialize: undefined,
			resolvePath: undefined,
			findPath: undefined,
			createFile: undefined,
			createFolder: undefined,
			commitChanges: undefined,
		});

		localStorage.setItem('vda1', serialized);
	}),
	delete: $(async function (
		this: FileSystemManager,
		pathOrName: string,
		cwd: string = '',
		modes: Record<string, boolean> = {}
	): Promise<[string, FSNode | null]> {
		const target = await this.findPath(pathOrName, cwd);
		if (!target) return [`${pathOrName}: No such file or directory`, null];

		if (target.type === FSNodeType.Folder && !modes['r']) {
			return [`${pathOrName}: is a directory`, null];
		}

		const parentFolder = await this.findPath(target.path.substring(0, target.path.length - 1), cwd);

		// This should always be the case for a valid target parent folder, except for the root node
		// which should not ever be deleted anyways
		if (parentFolder) {
			const idx = (parentFolder as FSDir).children.indexOf(target);
			idx !== -1 && (parentFolder as FSDir).children.splice(idx, 1);
			await this.commitChanges();
			return ['', target];
		}

		return ['Permission denied', null];
	}),
};
