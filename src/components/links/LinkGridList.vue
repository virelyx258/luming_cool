<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 my-4">
    <LinkCard
      v-for="link in randomLinks"
      :key="link.link"
      :title="link.title"
      :desc="link.desc"
      :link="link.link"
      :img="link.img"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import LinkCard from "./LinkCard.vue";

const links: { title: string; link: string; desc: string; img: string }[] = [
	{
		title: '岚天小窝',
		img: 'https://gravatar.ltya.top/avatar/5af06b461740fb2bd7467b8561399703?s=500',
		desc: '一只鸽子住在这里~',
		link: 'https://blog.ltya.top/',
	},
	{
		title: 'MC_Kero blog',
		img: 'https://img.cdn1.vip/i/68f3418995084_1760772489.png',
		desc: '依稀当年泪目干',
		link: 'https://blog.mckero.com/',
	},
	{
		title: "杜老师说",
		img: "https://cdn.dusays.com/favicon.ico",
		desc: "云计算运维讲师杜老师私人技术博客，主要分享一些运维技术、经验。",
		link: "https://dusays.com/",
	},
	{
		title: "白熊阿丸的小屋",
		img:
			"https://cravatar.cn/avatar/21531185e8296f70da566b68d3fc9785?s=400&d=mp",
		desc: "在这里可以看到一个真实的我，我会在这里书写我的一切",
		link: "https://blog.bxaw.name",
	},
	{
		title: "Vei Blog",
		img: "https://cloud.230456.xyz/Logo/VeiLogoN.png",
		desc: "松窗竹户，万千潇洒",
		link: "https://blog.veitzn.top/",
	},
	{
		title: "GLIMMER",
		img: "https://media.duckxu.com/blogfiles/public/iduckxucom.jpg",
		desc: "只有不活在他人的期待中，才可以成为更好的自己。",
		link: "https://i.duckxu.com/",
	},
	{
		title: "希记",
		img: "https://q1.qlogo.cn/g?b=qq&nk=3188468169&s=640",
		desc: "做一条，逆流的鱼。",
		link: "https://note.moxiify.cn/",
	},
	{
		title: "往日信笺",
		img: "https://www.xingmail.cn/favicon.ico",
		desc: "一个Xing分享自己的故事的地方",
		link: "https://www.xingmail.cn/",
	},
	{
		title: "柳橙睿",
		img: "https://www.liuchengrui.cn/myphoto.png",
		desc: "其实我是一个假柳橙",
		link: "https://www.liuchengrui.cn/",
	},
	{
		title: "阿锋的小宇宙",
		img: "https://cravatar.cn/avatar/868740183b995d2707e307ce0a89633a?s=200",
		desc: "沧海一粟，微亮渺小一只虫。",
		link: "https://feng.pub/",
	},
	{
		title: "CC米饭的小世界",
		img: "https://gravatar.loli.net/avatar/39bab898a41e6fa8d7357abd9c283bb7",
		desc: "是全新的世界！",
		link: "https://world.ccrice.com/",
	},
	{
		title: "老陈爱刷机",
		img: "http://blog.chenyuxia.com/wp-content/uploads/2025/01/cropped-dc57b0460b95b3e21479f93643b556e9.jpg",
		desc: "由老陈爱刷机搭建的网站，更新些好玩的东西。",
		link: "https://tc.chenyuxia.com/",
	},
	{
		title: "小改学习志",
		img: "https://www.haoyu233.com/wp-content/uploads/2025/11/b7a92341f346e9c6c3bbfabca684ce19.webp",
		desc: "Make It Possible.",
		link: "https://www.haoyu233.com/",
	},
	{
		title: "Echo",
		img: "https://www.liveout.cn/wp-content/uploads/2024/09/1.jpg",
		desc: "漂泊于互联网中的小窝",
		link: "https://www.liveout.cn/",
	},
	{
		title: "makotowu",
		img: "https://www.haoyu233.com/wp-content/uploads/2025/02/b03cbea61a7d4e5ebd96651eb18869a5.webp",
		desc: "makotowu运营笔记",
		link: "https://makotowu.cnstlapy.cn/",
	},
	{
		title: "XXYの博客",
		img: "http://q2.qlogo.cn/headimg_dl?dst_uin=3429924750&spec=5",
		desc: "爱折腾，爱分享.",
		link: "https://blog.xuxiny.top/",
	},
	{
		title: "松種小窝",
		img: "https://pineseed.cn/wp-content/uploads/2024/08/picture.jpg",
		desc: "花开又花落，时节暗中迁",
		link: "https://pineseed.cn/",
	},
	{
		title: "Horean's Blog",
		img: "https://cdn-images.hxrch.top/blog-logo_128x128.png",
		desc: "Spread the Knowledge Wisely & Widely",
		link: "https://blog.hxrch.top",
	},
	{
		title: "云晓晨",
		img: "https://cdn.kaiqi.wang/favicon.svg",
		desc: "未来路远 • 勿忘初心",
		link: "https://blog.kaiqi.wang",
	},
	{
		title: "圆周率",
		img: "https://www.yuanzj.top/img/favicon.jpg",
		desc: "My Blog!",
		link: "https://www.yuanzj.top",
	},
	{
		title: "Limitz_",
		img: "https://q1.qlogo.cn/g?b=qq&nk=66870019&s=100",
		desc: "记得给我的世界加上故事与咖啡.",
		link: "https://limitz.top",
	},
	{
		title: "Levi",
		img: "https://i.postimg.cc/cJmdWqkn/Snipaste-2024-04-24-16-54-57.png",
		desc: "一个有意思的Blog，工作记录，日常分享，欢迎访问",
		link: "https://leviqin.top/",
	},
	{
		title: "KFACBT",
		img: "https://blog.gytxtx.top/img/logo.jpg",
		desc: "主要记录分享一些技术文章，以后或许还有别的东西（？）",
		link: "https://blog.gytxtx.top/",
	},
	{
		title: "Bensz",
		img: "https://blognas.hwb0307.com/logo.jpg",
		desc: "百代繁华一朝都，谁非过客；千秋明月吹角寒，花是主人。",
		link: "https://blognas.hwb0307.com/",
	},
	{
		title: "Pinpe 的云端",
		img: "https://pinpe.top/head.jpg",
		desc: "一个属于自己的云朵。",
		link: "https://pinpe.top/",
	},
];

const randomLinks = computed(() => links.sort(() => Math.random() - 0.5));
</script>
