<script lang="ts">
import { onMount } from "svelte";

export let postsData: { date: string; words: number }[] = [];

const YEARS = [2024, 2025, 2026];
const WEEKS_PER_YEAR = 53;
const YEAR_LABEL_WIDTH = 40;
const CELL_HEIGHT = 16;
const ROW_GAP = 8;
const CARD_PADDING_X = 32;

interface WeekCell {
    week: number;
    words: number;
    level: number;
}

let yearRows: { year: number; weeks: WeekCell[] }[] = [];
let containerWidth = 0;
let visible = false;

function getLevel(words: number): number {
    if (words === 0) return 0;
    if (words < 1000) return 1;
    if (words < 3000) return 2;
    if (words < 8000) return 3;
    return 4;
}

function getLevelColor(level: number): string {
    return `var(--heatmap-${level})`;
}

function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getWeekDateRange(year: number, week: number): string {
    const jan4 = new Date(year, 0, 4);
    const startDay = jan4.getDay() || 7;
    const weekStart = new Date(year, 0, 4 + (week - 1) * 7 - startDay + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const s = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    const e = `${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`;
    return `${year}年 ${s} - ${e}`;
}

onMount(() => {
    const wordsByWeek: Record<string, number> = {};
    for (const p of postsData) {
        const d = new Date(p.date + "T00:00:00");
        const year = d.getFullYear();
        if (!YEARS.includes(year)) continue;
        const week = getWeekNumber(d);
        const key = `${year}-W${week}`;
        wordsByWeek[key] = (wordsByWeek[key] || 0) + p.words;
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentWeek = getWeekNumber(today);

    const result: { year: number; weeks: WeekCell[] }[] = [];
    for (const year of YEARS) {
        const maxWeek = year === currentYear ? currentWeek : WEEKS_PER_YEAR;
        const weeks: WeekCell[] = [];
        for (let w = 1; w <= maxWeek; w++) {
            const key = `${year}-W${w}`;
            const words = wordsByWeek[key] || 0;
            weeks.push({ week: w, words, level: getLevel(words) });
        }
        result.push({ year, weeks });
    }

    yearRows = result;
});

function checkVisible(width: number) {
    if (width < 100) return;
    visible = true;
}

$: checkVisible(containerWidth);
</script>

<div bind:clientWidth={containerWidth} class="hidden md:block">
{#if visible && yearRows.length > 0}
    {@const maxWeeks = Math.max(...yearRows.map(y => y.weeks.length))}
    <div class="card-base px-6 py-7 mb-4">
        <div class="flex items-center justify-between mb-4">
            <div class="font-semibold text-lg text-75">写作热力图</div>
            <div class="flex items-center text-xs text-50 gap-1">
                <span>少</span>
                {#each [0, 1, 2, 3, 4] as level}
                    <div style="width: {CELL_HEIGHT}px; height: {CELL_HEIGHT}px; background-color: {getLevelColor(level)};"></div>
                {/each}
                <span>多</span>
            </div>
        </div>

        <!-- Grid: rows = years, columns = weeks -->
        <div class="flex">
            <!-- Year labels column -->
            <div class="flex flex-col shrink-0" style="width: {YEAR_LABEL_WIDTH}px; padding-right: 8px; gap: {ROW_GAP}px;">
                {#each yearRows as row}
                    <div class="flex items-center" style="height: {CELL_HEIGHT}px;">
                        <span class="text-sm font-bold text-75 font-mono">{row.year}</span>
                    </div>
                {/each}
            </div>

            <!-- Week columns -->
            <div class="flex flex-1">
                {#each Array(maxWeeks) as _, ci}
                    {@const colIndex = ci}
                    <div class="flex flex-col flex-1" style="gap: {ROW_GAP}px;">
                        {#each yearRows as row}
                            {@const cell = colIndex < row.weeks.length ? row.weeks[colIndex] : null}
                                {#if cell && cell.words > 0}
                                    <div class="relative group/hcell" style="height: {CELL_HEIGHT}px;">
                                        <div class="cursor-default w-full h-full" style="background-color: {getLevelColor(cell.level)};"></div>
                                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs font-medium bg-[var(--card-bg)] text-black dark:text-white/70 border border-black/10 dark:border-white/20 shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover/hcell:opacity-100 transition-opacity duration-200 z-50">
                                            {row.year} W{String(cell.week).padStart(2, "0")} · {cell.words.toLocaleString()}字
                                        </div>
                                    </div>
                                {:else if cell}
                                    <div style="height: {CELL_HEIGHT}px; background-color: {getLevelColor(cell.level)};"></div>
                                {:else}
                                    <div style="height: {CELL_HEIGHT}px;"></div>
                                {/if}
                        {/each}
                    </div>
                {/each}
            </div>
        </div>

        <!-- Week labels at bottom -->
        <div class="flex mt-1" style="padding-left: {YEAR_LABEL_WIDTH}px;">
            {#each Array(maxWeeks) as _, wi}
                <div class="flex-1 text-xs text-50 text-center font-mono">
                    {#if [1, 14, 27, 40, 53].includes(wi + 1)}
                        W{String(wi + 1).padStart(2, "0")}
                    {/if}
                </div>
            {/each}
        </div>
    </div>
{/if}
</div>
