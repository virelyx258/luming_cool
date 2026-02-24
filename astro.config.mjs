import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components";/* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";/* Handle directives */
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { expressiveCodeConfig } from "./src/config.ts";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";
import vue from "@astrojs/vue";

// 新增：引入 astro-compress 插件
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
    site: "https://luming.cool/",
    base: "",
    trailingSlash: "always",
    // 🔽 新增：禁用 Astro 内置图片优化
    image: {
        service: {
            entrypoint: 'astro/assets/services/noop'
        }
    },
    integrations: [
        tailwind({
            nesting: true,
        }),
        swup({
            theme: false,
            animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
            // the default value `transition-` cause transition delay
            // when the Tailwind class `transition-all` is used
            containers: ["main", "#toc"],
            smoothScrolling: true,
            cache: true,
            preload: true,
            accessibility: true,
            updateHead: true,
            updateBodyClass: false,
            globalInstance: true,
        }),
        icon({
            include: {
                "preprocess: vitePreprocess(),": ["*"],
                "fa6-brands": ["*"],
                "fa6-regular": ["*"],
                "fa6-solid": ["*"],
            },
        }),
        expressiveCode({
            themes: [expressiveCodeConfig.theme, expressiveCodeConfig.theme],
            plugins: [
                pluginCollapsibleSections(),
                pluginLineNumbers(),
                pluginLanguageBadge(),
                pluginCustomCopyButton()
            ],
            defaultProps: {
                wrap: true,
                overridesByLang: {
                    'shellsession': {
                        showLineNumbers: false,
                    },
                },
            },
            styleOverrides: {
                codeBackground: "var(--codeblock-bg)",
                borderRadius: "0.75rem",
                borderColor: "none",
                codeFontSize: "0.875rem",
                codeFontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                codeLineHeight: "1.5rem",
                frames: {
                    editorBackground: "var(--codeblock-bg)",
                    terminalBackground: "var(--codeblock-bg)",
                    terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
                    editorTabBarBackground: "var(--codeblock-topbar-bg)",
                    editorActiveTabBackground: "none",
                    editorActiveTabIndicatorBottomColor: "var(--primary)",
                    editorActiveTabIndicatorTopColor: "none",
                    editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
                    terminalTitlebarBorderBottomColor: "none"
                },
                textMarkers: {
                    delHue: 0,
                    insHue: 180,
                    markHue: 250
                }
            },
            frames: {
                showCopyToClipboardButton: false,
            }
        }),
        svelte(),
        sitemap(),
        vue(),
        // 新增：压缩插件配置，禁用图片压缩，保留其他压缩
        compress({
            Image: false,   // 禁止图片压缩，确保图片内容不变 → 哈希稳定
            CSS: true,      // 压缩 CSS
            HTML: true,     // 压缩 HTML
            JavaScript: true, // 压缩 JS
            SVG: false,     // 可选：禁止 SVG 压缩（根据需求调整）
        })
    ],
    markdown: {
        remarkPlugins: [
            remarkMath,
            remarkReadingTime,
            remarkExcerpt,
            remarkGithubAdmonitionsToDirectives,
            remarkDirective,
            remarkSectionize,
            parseDirectiveNode,
        ],
        rehypePlugins: [
            rehypeKatex,
            rehypeSlug,
            [
                rehypeComponents,
                {
                    components: {
                        github: GithubCardComponent,
                        note: (x, y) => AdmonitionComponent(x, y, "note"),
                        tip: (x, y) => AdmonitionComponent(x, y, "tip"),
                        important: (x, y) => AdmonitionComponent(x, y, "important"),
                        caution: (x, y) => AdmonitionComponent(x, y, "caution"),
                        warning: (x, y) => AdmonitionComponent(x, y, "warning"),
                    },
                },
            ],
            [
                rehypeAutolinkHeadings,
                {
                    behavior: "append",
                    properties: {
                        className: ["anchor"],
                    },
                    content: {
                        type: "element",
                        tagName: "span",
                        properties: {
                            className: ["anchor-icon"],
                            "data-pagefind-ignore": true,
                        },
                        children: [
                            {
                                type: "text",
                                value: "#",
                            },
                        ],
                    },
                },
            ],
        ],
    },
    vite: {
        build: {
            rollupOptions: {
                onwarn(warning, warn) {
                    // temporarily suppress this warning
                    if (
                        warning.message.includes("is dynamically imported by") &&
                        warning.message.includes("but also statically imported by")
                    ) {
                        return;
                    }
                    warn(warning);
                },
            },
        },
    },
});