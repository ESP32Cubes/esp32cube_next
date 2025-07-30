const { execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

/**
 * 生成所有文章的 git 时间数据
 */
async function generateGitTimes() {
    console.log('🔍 开始生成 git 时间数据...');

    const contentDirectory = path.join(process.cwd(), 'content');
    const outputFile = path.join(process.cwd(), 'lib/git-times.json');

    try {
        // 获取所有 markdown 文件
        const markdownFiles = await getAllMarkdownFiles(contentDirectory);
        console.log(`找到 ${markdownFiles.length} 个 markdown 文件`);

        const gitTimes = {};

        for (const { filePath, relativePath } of markdownFiles) {
            try {
                console.log(`处理文件: ${relativePath}`);

                // 获取文件的相对路径（相对于 git 仓库根目录）
                const gitRelativePath = path.relative(process.cwd(), filePath);

                // 获取文件的创建时间（第一次提交）
                const createdTimeOutput = execSync(
                    `git log --follow --format="%aI" --reverse -- "${gitRelativePath}"`,
                    { encoding: 'utf8', cwd: process.cwd() }
                ).trim();

                const createdTime = createdTimeOutput.split('\n')[0] || '';

                // 获取文件的最后修改时间（最后一次提交）
                const updatedTime = execSync(
                    `git log --follow --format="%aI" -1 -- "${gitRelativePath}"`,
                    { encoding: 'utf8', cwd: process.cwd() }
                ).trim();

                gitTimes[relativePath] = {
                    created_at: createdTime,
                    updated_at: updatedTime
                };

                console.log(`  ✅ 创建时间: ${createdTime || '未找到'}`);
                console.log(`  ✅ 更新时间: ${updatedTime || '未找到'}`);

            } catch (error) {
                console.warn(`  ⚠️  处理文件 ${relativePath} 时出错:`, error.message);
                gitTimes[relativePath] = {
                    created_at: '',
                    updated_at: ''
                };
            }
        }

        // 写入 JSON 文件
        await fs.writeFile(outputFile, JSON.stringify(gitTimes, null, 2), 'utf8');
        console.log(`\n✅ Git 时间数据已生成: ${outputFile}`);
        console.log(`共处理 ${Object.keys(gitTimes).length} 个文件`);

    } catch (error) {
        console.error('❌ 生成 git 时间数据失败:', error);
        process.exit(1);
    }
}

/**
 * 递归获取所有 markdown 文件
 */
async function getAllMarkdownFiles(dir, baseDir = '') {
    const files = [];

    try {
        const items = await fs.readdir(dir, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            const relativePath = path.join(baseDir, item.name);

            if (item.isDirectory()) {
                const subFiles = await getAllMarkdownFiles(fullPath, relativePath);
                files.push(...subFiles);
            } else if (item.isFile() && item.name.endsWith('.md')) {
                files.push({
                    filePath: fullPath,
                    relativePath
                });
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
    }

    return files;
}

// 运行生成器
generateGitTimes(); 