import { v4 as uuidv4 } from 'uuid';

export enum FSNodeType {
	Folder,
	Unknown,
}

interface FSBaseNode {
	id: string;
	type: FSNodeType;
	name: string;
	path: string;
	createDate: Date;
	lastModified: Date;
}

export interface FSDir extends FSBaseNode {
	type: FSNodeType.Folder;
	children: FSNode[];
}

export interface FSFile extends FSBaseNode {
	content: string; // TODO: What type would be best here?
}

export type FSNode = FSDir | FSFile;

// Initial Paths
// '/' => ['bin', 'etc', 'home', 'tmp', 'usr', 'var']
// '/home' => ['guest']
// '/home/guest' => ['Desktop', 'Documents', 'Downloads', 'Pictures']
const binFolder: FSDir = {
	id: uuidv4(),
	type: FSNodeType.Folder,
	name: 'bin',
	path: '/',
	createDate: new Date(),
	lastModified: new Date(),
	children: [],
};

const etcFolder: FSDir = {
	id: uuidv4(),
	type: FSNodeType.Folder,
	name: 'etc',
	path: '/',
	createDate: new Date(),
	lastModified: new Date(),
	children: [],
};

const desktopFolder: FSDir = {
	id: uuidv4(),
	type: FSNodeType.Folder,
	name: 'Desktop',
	path: '/home/guest/',
	createDate: new Date(),
	lastModified: new Date(),
	children: [],
};

const guestFolder: FSDir = {
	id: uuidv4(),
	type: FSNodeType.Folder,
	name: 'guest',
	path: '/home/',
	createDate: new Date(),
	lastModified: new Date(),
	children: [desktopFolder],
};

const homeFolder: FSDir = {
	id: uuidv4(),
	type: FSNodeType.Folder,
	name: 'home',
	path: '/',
	createDate: new Date(),
	lastModified: new Date(),
	children: [guestFolder],
};

const tmpFolder: FSDir = {
	id: uuidv4(),
	type: FSNodeType.Folder,
	name: 'tmp',
	path: '/',
	createDate: new Date(),
	lastModified: new Date(),
	children: [],
};

const usrFolder: FSDir = {
	id: uuidv4(),
	type: FSNodeType.Folder,
	name: 'usr',
	path: '/',
	createDate: new Date(),
	lastModified: new Date(),
	children: [],
};

const varFolder: FSDir = {
	id: uuidv4(),
	type: FSNodeType.Folder,
	name: 'var',
	path: '/',
	createDate: new Date(),
	lastModified: new Date(),
	children: [],
};

export const rootNode: FSDir = {
	id: uuidv4(),
	type: FSNodeType.Folder,
	name: '/',
	path: '',
	createDate: new Date(),
	lastModified: new Date(),
	children: [binFolder, etcFolder, homeFolder, tmpFolder, usrFolder, varFolder],
};
