import { $, Component, QRL, component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { AppProps } from '~/managers/window-manager';
import { SystemContext } from '~/root';
import { SearchResultType, applicationList } from './constants';
import { uniqueId } from 'lodash';
import { useClickOutside } from '~/utils/outside-click';

export interface SearchResult {
	icon?: Component<any>;
	name: string;
	item: Component<AppProps>;
	type: SearchResultType;
}

interface GlobalSearchProps {
	onClickOutside$: QRL<() => void>;
}

const GlobalSearch = component$<GlobalSearchProps>(({ onClickOutside$ }) => {
	const state = useContext(SystemContext);
	const searchRef = useSignal<HTMLDivElement | undefined>();

	useClickOutside(searchRef, async () => {
		await onClickOutside$();
	});

	const input = useSignal<string>('');
	const searchValue = useSignal<string>('');
	const searchResults = useSignal<SearchResult[]>([]);

	useTask$(({ track, cleanup }) => {
		const inputValue = track(() => input.value);

		const timerId = setTimeout(() => {
			searchValue.value = inputValue;
		}, 500);

		cleanup(() => clearTimeout(timerId));
	});

	useTask$(({ track }) => {
		const searchText = track(() => searchValue.value);
		// Clear old results
		searchResults.value = [];

		// Search constant applications array
		const matchedApps = Object.entries(applicationList)
			.filter(([key, _]) => key.includes(searchText))
			.map(([_, result]) => result);

		searchResults.value.push(...matchedApps);

		// TODO: Search file system

		// TODO: Add link to search in browser
	});

	const handleSelectResult = $(() => {});

	return (
		<div class='absolute h-screen w-screen flex justify-center items-center gap-8'>
			<div ref={searchRef} class='flex flex-col items-center gap-8'>
				<div class='glass-around rounded-lg p-3'>
					<input class='w-[600px] bg-transparent focus-within:outline-none focus-within:border-none' type='text' bind:value={input} />
				</div>
				<div class='flex-1 flex justify-center max-h-[30rem] w-[600px]'>
					{searchValue.value.length > 0 && (
						<div class='glass-around rounded-lg !px-2 !py-3 !h-fit !w-full'>
							{searchResults.value.length > 0 ? (
								searchResults.value.map((it) => (
									<div
										key={uniqueId(`search_result_${it.name}_`)}
										class='flex items-center justify-between cursor-pointer hover:bg-[#ffffff55] p-2 rounded-lg'
										onClick$={handleSelectResult}
									>
										<span>{it.name}</span>
										<span>{it.type}</span>
									</div>
								))
							) : (
								<p class='text-center w-full'>No items found</p>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
});

export default GlobalSearch;
