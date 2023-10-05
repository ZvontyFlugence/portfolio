import Terminal from '../ui/terminal';
import { SearchResult } from './global-search';

export enum SearchResultType {
	Application = 'Application',
	File = 'File',
	Folder = 'Folder',
}

interface ApplicationList {
	[key: string]: SearchResult;
}

export const applicationList: ApplicationList = {
	terminal: { name: 'Terminal', item: Terminal, type: SearchResultType.Application },
};
