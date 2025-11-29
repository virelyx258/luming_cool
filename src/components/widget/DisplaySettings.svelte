<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { getDefaultHue, getHue, setHue } from "@utils/setting-utils";

// 中国风主题色定义
const themeColors = [
  { name: "鹞冠紫", hue: 280, hsl: "hsl(280, 60%, 70%)" },
  { name: "锦葵红", hue: 345, hsl: "hsl(345, 60%, 70%)" },
  { name: "桃粉", hue: 355, hsl: "hsl(355, 60%, 80%)" },
  { name: "栀黄", hue: 45, hsl: "hsl(45, 70%, 80%)" },
  { name: "柳芽绿", hue: 120, hsl: "hsl(120, 50%, 70%)" },
  { name: "竹青", hue: 160, hsl: "hsl(160, 50%, 70%)" },
  { name: "天青蓝", hue: 200, hsl: "hsl(200, 60%, 70%)" },
  { name: "藕荷色", hue: 260, hsl: "hsl(260, 50%, 80%)" }
];

let hue = getHue();
const defaultHue = getDefaultHue();

// 获取当前颜色名称
function getColorName(currentHue: number) {
  // 查找最接近的纯色
  const closestColor = themeColors.reduce((prev, curr) => {
    return Math.abs(curr.hue - currentHue) < Math.abs(prev.hue - currentHue) ? curr : prev;
  });
  
  // 查找相邻颜色
  const sortedColors = [...themeColors].sort((a, b) => a.hue - b.hue);
  let prevColor = sortedColors[sortedColors.length - 1];
  let nextColor = sortedColors[0];
  
  for (let i = 0; i < sortedColors.length; i++) {
    if (sortedColors[i].hue === closestColor.hue) {
      prevColor = sortedColors[i === 0 ? sortedColors.length - 1 : i - 1];
      nextColor = sortedColors[i === sortedColors.length - 1 ? 0 : i + 1];
      break;
    }
  }
  
  // 检查是否在纯色位置附近（±10度）
  if (Math.abs(closestColor.hue - currentHue) <= 10) {
    return closestColor.name;
  }
  
  // 检查是否在两个颜色之间
  const isBetweenPrevAndCurrent = (currentHue > prevColor.hue && currentHue < closestColor.hue) || 
                                 (prevColor.hue > closestColor.hue && (currentHue > prevColor.hue || currentHue < closestColor.hue));
  
  const isBetweenCurrentAndNext = (currentHue > closestColor.hue && currentHue < nextColor.hue) || 
                                  (closestColor.hue > nextColor.hue && (currentHue > closestColor.hue || currentHue < nextColor.hue));
  
  if (isBetweenPrevAndCurrent) {
    return `${prevColor.name} · ${closestColor.name}`;
  } else if (isBetweenCurrentAndNext) {
    return `${closestColor.name} · ${nextColor.name}`;
  }
  
  return closestColor.name;
}

// 滑块停顿效果
function handleSliderInput(event: Event) {
  const target = event.target as HTMLInputElement;
  let currentHue = parseInt(target.value);
  
  // 检查是否接近某个纯色，实现停顿效果
  const closestColor = themeColors.reduce((prev, curr) => {
    return Math.abs(curr.hue - currentHue) < Math.abs(prev.hue - currentHue) ? curr : prev;
  });
  
  // 如果在纯色附近（±5度），自动吸附到纯色
  if (Math.abs(closestColor.hue - currentHue) <= 5) {
    hue = closestColor.hue;
  } else {
    hue = currentHue;
  }
}

function resetHue() {
  hue = getDefaultHue();
}

$: if (hue || hue === 0) {
  setHue(hue);
}

// 当前颜色名称
$: colorName = getColorName(hue);
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            {i18n(I18nKey.themeColor)}
            <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md  active:scale-90 will-change-transform"
                    class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} on:click={resetHue}>
                <div class="text-[var(--btn-content)]">
                    <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                </div>
            </button>
        </div>
        <div class="flex gap-1">
            <div id="hueValue" class="transition bg-[var(--btn-regular-bg)] px-3 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)] whitespace-nowrap">
                {colorName}
            </div>
        </div>
    </div>
    <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none relative">
        <!-- 纯色标记点 -->
        {#each themeColors as color}
            <div 
                class="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-white dark:bg-neutral-800 rounded-full pointer-events-none"
                style={`left: ${(color.hue / 360) * 100}%`}
            ></div>
        {/each}
        <input 
            aria-label={i18n(I18nKey.themeColor)} 
            type="range" 
            min="0" 
            max="360" 
            bind:value={hue}
            class="slider" 
            id="colorSlider" 
            step="1" 
            style="width: 100%"
            on:input={handleSliderInput}
        >
    </div>
</div>


<style lang="stylus">
    #display-setting
      input[type="range"]
        -webkit-appearance none
        height 1.5rem
        background-image var(--color-selection-bar)
        transition background-image 0.15s ease-in-out

        /* Input Thumb */
        &::-webkit-slider-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-moz-range-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          border-width 0
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-ms-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

</style>
