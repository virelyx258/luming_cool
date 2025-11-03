import type {
	CommentConfig,
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "路明笔记",
	subtitle: "Luming Notes",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "/banner/banner.webp", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 1, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// Recommended: Add multiple sizes and formats for better compatibility
		{
			src: "/favicon/icon.webp", // Path of the favicon, relative to the /public directory
			theme: "light", // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
			sizes: "32x32", // (Optional) Size of the favicon, set only if you have favicons of different sizes
		},
		// Uncomment and add more favicon sizes/formats if you have them:
		// {
		// 	src: "/favicon/icon-16x16.png",
		// 	sizes: "16x16",
		// },
		// {
		// 	src: "/favicon/icon-32x32.png",
		// 	sizes: "32x32",
		// },
		// {
		// 	src: "/favicon/icon-192x192.png",
		// 	sizes: "192x192",
		// },
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.Friends,
		LinkPreset.About,
		LinkPreset.Travellings,
	],
};

export const profileConfig: ProfileConfig = {
	avatar:
		"https://cn.cravatar.com/avatar/302380667bdaf4e1390800e62494d4af?s=500&r=X", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "RiseForever",
	bio: "高一学生，博主，开发者。",
	links: [
		{
			name: "Twitter",
			icon: "fa6-brands:twitter", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://x.com/Luming_258",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/virelyx258",
		},
				{
			name: "RSS",
			icon: "material-symbols:rss-feed",
			url: "https://luming.cool/rss.xml",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

export const commentConfig: CommentConfig = {
  giscus: {
    repo: "virelyx258/luming_cool",
    repoId: "R_kgDOP6afIA",
    category: "Announcements",
    categoryId: "DIC_kwDOP6afIM4CwIHM",
    mapping: "title",
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "1",
    inputPosition: "top",
    theme: "reactive",
    lang: "zh-CN",
    loading: "lazy",
  },
};