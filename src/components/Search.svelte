<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import type { SearchResult } from "@/global";

let keywordDesktop = "";
let keywordMobile = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;
let manuallyClosedDesktop = false; // 用户是否手动关闭了桌面端搜索结果
let manuallyClosedMobile = false; // 用户是否手动关闭了移动端搜索结果

const fakeResult: SearchResult[] = [
	{
		url: url("/"),
		meta: {
			title: "This Is a Fake Search Result",
		},
		excerpt:
			"Because the search cannot work in the <mark>dev</mark> environment.",
	},
	{
		url: url("/"),
		meta: {
			title: "If You Want to Test the Search",
		},
		excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
	},
];

const togglePanel = () => {
	const panel = document.getElementById("search-panel");
	if (!panel) return;
	
	const isClosed = panel.classList.contains("float-panel-closed");
	panel.classList.toggle("float-panel-closed");
	
	// 如果用户手动关闭了面板，记录状态
	if (!isClosed) {
		// 面板被关闭了
		manuallyClosedMobile = true;
	}
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
	const panel = document.getElementById("search-panel");
	if (!panel || !isDesktop) return;

	const wasClosed = panel.classList.contains("float-panel-closed");

	if (show) {
		// 如果用户手动关闭过，则不显示
		if (manuallyClosedDesktop) {
			return;
		}
		panel.classList.remove("float-panel-closed");
	} else {
		// 如果面板之前是打开的，且有关键词，说明是手动关闭
		if (!wasClosed && (keywordDesktop || keywordMobile)) {
			manuallyClosedDesktop = true;
		}
		panel.classList.add("float-panel-closed");
	}
};

const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
	if (!keyword) {
		setPanelVisibility(false, isDesktop);
		result = [];
		// 清空输入时，重置手动关闭标志
		if (isDesktop) {
			manuallyClosedDesktop = false;
		} else {
			manuallyClosedMobile = false;
		}
		return;
	}

	if (!initialized) {
		return;
	}

	// 如果用户手动关闭了搜索结果，则不执行搜索显示
	if ((isDesktop && manuallyClosedDesktop) || (!isDesktop && manuallyClosedMobile)) {
		return;
	}

	isSearching = true;

	try {
		let searchResults: SearchResult[] = [];

		if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
			const response = await window.pagefind.search(keyword);
			searchResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
		} else if (import.meta.env.DEV) {
			searchResults = fakeResult;
		} else {
			searchResults = [];
			console.error("Pagefind is not available in production environment.");
		}

		result = searchResults;
		setPanelVisibility(result.length > 0, isDesktop);
	} catch (error) {
		console.error("Search error:", error);
		result = [];
		setPanelVisibility(false, isDesktop);
	} finally {
		isSearching = false;
	}
};

onMount(() => {
	const initializeSearch = () => {
		initialized = true;
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";
		console.log("Pagefind status on init:", pagefindLoaded);
		if (keywordDesktop) search(keywordDesktop, true);
		if (keywordMobile) search(keywordMobile, false);
	};

	// 监听点击外部区域关闭搜索面板的事件
	// Layout.astro 中的 setClickOutsideToClose 会关闭面板
	// 我们需要检测这种情况并标记为手动关闭
	const panel = document.getElementById("search-panel");
	if (panel) {
		// 监听面板class的变化，检测是否是外部点击导致关闭
		const observer = new MutationObserver(() => {
			// 如果面板被关闭，且有关键词，且不是通过搜索框焦点触发的
			if (panel.classList.contains("float-panel-closed") && 
			    (keywordDesktop || keywordMobile)) {
				const activeElement = document.activeElement;
				const isClickingSearchBar = activeElement?.closest("#search-bar") !== null;
				const isClickingSearchPanel = activeElement?.closest("#search-panel") !== null;
				const isClickingSearchSwitch = activeElement?.id === "search-switch";
				
				// 如果不是点击搜索相关元素，说明是手动关闭
				if (!isClickingSearchBar && !isClickingSearchPanel && !isClickingSearchSwitch) {
					if (window.innerWidth >= 1024) {
						manuallyClosedDesktop = true;
					} else {
						manuallyClosedMobile = true;
					}
				}
			}
		});
		
		observer.observe(panel, {
			attributes: true,
			attributeFilter: ["class"]
		});
	}

	if (import.meta.env.DEV) {
		console.log(
			"Pagefind is not available in development mode. Using mock data.",
		);
		initializeSearch();
	} else {
		document.addEventListener("pagefindready", () => {
			console.log("Pagefind ready event received.");
			initializeSearch();
		});
		document.addEventListener("pagefindloaderror", () => {
			console.warn(
				"Pagefind load error event received. Search functionality will be limited.",
			);
			initializeSearch(); // Initialize with pagefindLoaded as false
		});

		// Fallback in case events are not caught or pagefind is already loaded by the time this script runs
		setTimeout(() => {
			if (!initialized) {
				console.log("Fallback: Initializing search after timeout.");
				initializeSearch();
			}
		}, 2000); // Adjust timeout as needed
	}
});

$: if (initialized && keywordDesktop && !manuallyClosedDesktop) {
	(async () => {
		await search(keywordDesktop, true);
	})();
}

$: if (initialized && keywordMobile && !manuallyClosedMobile) {
	(async () => {
		await search(keywordMobile, false);
	})();
}
</script>

<!-- search bar for desktop view -->
<div id="search-bar" class="hidden lg:flex transition-all items-center h-11 mr-2 rounded-lg
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
">
    <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
    <input placeholder="{i18n(I18nKey.search)}" bind:value={keywordDesktop} on:focus={() => {
		manuallyClosedDesktop = false;
		search(keywordDesktop, true);
	}}
           class="transition-all pl-10 text-sm bg-transparent outline-0
         h-full w-40 active:w-60 focus:w-60 text-black/50 dark:text-white/50"
    >
</div>

<!-- toggle btn for phone/tablet view -->
<button on:click={() => {
	// 如果面板是关闭的，打开时重置手动关闭标志
	const panel = document.getElementById("search-panel");
	if (panel && panel.classList.contains("float-panel-closed")) {
		manuallyClosedMobile = false;
	}
	togglePanel();
}} aria-label="Search Panel" id="search-switch"
        class="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90">
    <Icon icon="material-symbols:search" class="text-[1.25rem]"></Icon>
</button>

<!-- search panel -->
<div id="search-panel" class="float-panel float-panel-closed search-panel absolute md:w-[30rem]
top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-2">

    <!-- search bar inside panel for phone/tablet -->
    <div id="search-bar-inside" class="flex relative lg:hidden transition-all items-center h-11 rounded-xl
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
  ">
        <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
        <input placeholder="Search" bind:value={keywordMobile} on:focus={() => {
		manuallyClosedMobile = false;
		search(keywordMobile, false);
	}}
               class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
               focus:w-60 text-black/50 dark:text-white/50"
        >
    </div>

    <!-- search results -->
    {#each result as item}
        <a href={item.url}
           class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
       rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]">
            <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
                {item.meta.title}<Icon icon="fa6-solid:chevron-right" class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"></Icon>
            </div>
            <div class="transition text-sm text-50">
                {@html item.excerpt}
            </div>
        </a>
    {/each}
</div>

<style>
  input:focus {
    outline: 0;
  }
  .search-panel {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }
</style>
