import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 源图标路径（相对于项目根目录）
const sourceIcon = join(__dirname, '../public/favicon/icon.webp');
const outputDir = join(__dirname, '../public/favicon');

// 确保输出目录存在
if (!existsSync(outputDir)) {
	mkdirSync(outputDir, { recursive: true });
}

// 检查源文件是否存在
if (!existsSync(sourceIcon)) {
	console.error(`❌ 错误: 找不到源图标文件: ${sourceIcon}`);
	console.error('请确保 /public/favicon/icon.webp 文件存在');
	process.exit(1);
}

console.log('🚀 开始生成 Favicon 文件...\n');

try {
	const image = sharp(sourceIcon);
	const metadata = await image.metadata();
	console.log(`📐 源图标尺寸: ${metadata.width}x${metadata.height}\n`);

	// 需要生成的文件列表
	const favicons = [
		// 标准 favicon.ico（根目录）
		{ path: join(__dirname, '../public/favicon.ico'), size: 32 },
		// PNG 格式，多种尺寸
		{ path: join(outputDir, 'icon-16x16.png'), size: 16 },
		{ path: join(outputDir, 'icon-32x32.png'), size: 32 },
		{ path: join(outputDir, 'icon-192x192.png'), size: 192 },
		// Apple Touch Icon
		{ path: join(outputDir, 'apple-touch-icon.png'), size: 180 },
	];

	// 生成所有 favicon 文件
	for (const favicon of favicons) {
		try {
			await image
				.clone()
				.resize(favicon.size, favicon.size, {
					fit: 'contain',
					background: { r: 0, g: 0, b: 0, alpha: 0 }, // 透明背景
				})
				.toFile(favicon.path);

			const format = favicon.path.endsWith('.ico') ? 'ICO' : 'PNG';
			console.log(`✅ 已生成: ${favicon.path.replace(__dirname + '/../', '')} (${format}, ${favicon.size}x${favicon.size})`);
		} catch (error) {
			console.error(`❌ 生成失败: ${favicon.path} - ${error.message}`);
		}
	}

	// 生成 ICO 文件需要特殊处理
	// sharp 不直接支持 ICO，所以我们生成 PNG 然后转换为 ICO
	// 或者我们可以使用第三方库，但为了简单起见，先生成 PNG 格式放在根目录
	// 大多数现代浏览器会接受 PNG 格式的 favicon
	const icoPath = join(__dirname, '../public/favicon.ico');
	try {
		// 尝试生成 ICO，如果失败则生成 PNG
		await image
			.clone()
			.resize(32, 32, {
				fit: 'contain',
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			})
			.png()
			.toFile(icoPath.replace('.ico', '.png'));

		// 将 PNG 复制为 ICO（浏览器通常可以读取）
		const fs = await import('node:fs/promises');
		await fs.copyFile(icoPath.replace('.ico', '.png'), icoPath);
		await fs.unlink(icoPath.replace('.ico', '.png'));
		console.log(`✅ 已生成: favicon.ico (ICO, 32x32)`);
	} catch (error) {
		console.warn(`⚠️  ICO 生成警告: ${error.message}`);
		console.log('   提示: 浏览器通常也接受 PNG 格式的 favicon');
	}

	console.log('\n✨ Favicon 生成完成！');
	console.log('\n📝 注意事项:');
	console.log('   1. favicon.ico 已放置在 /public/ 根目录');
	console.log('   2. 其他图标文件在 /public/favicon/ 目录');
	console.log('   3. 请确保所有文件都已正确部署到服务器');
	console.log('   4. 如果某些文件仍然无法显示，请检查服务器配置和缓存');
} catch (error) {
	console.error('❌ 生成失败:', error);
	process.exit(1);
}

