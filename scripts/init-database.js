const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// 从环境变量读取数据库配置
const dbConfig = {
    host: process.env.DB_HOST || '81.68.94.171',
    user: process.env.DB_USER || 'esp32cube',
    password: process.env.DB_PASSWORD || 'KC32KPYaw33ASMXw',
    database: process.env.DB_DATABASE || 'esp32cube',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

async function initDatabase() {
    let connection;

    try {
        console.log('正在连接数据库...');
        console.log(`主机: ${dbConfig.host}`);
        console.log(`数据库: ${dbConfig.database}`);
        console.log(`用户: ${dbConfig.user}`);

        // 创建数据库连接
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ 数据库连接成功！');

        // 读取SQL文件
        const sqlFilePath = path.join(process.cwd(), 'database-schema.sql');
        console.log(`正在读取SQL文件: ${sqlFilePath}`);

        const sqlContent = await fs.readFile(sqlFilePath, 'utf-8');
        console.log('✅ SQL文件读取成功！');

        // 分割SQL语句（按分号分割）
        const sqlStatements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`找到 ${sqlStatements.length} 个SQL语句`);

        // 逐个执行SQL语句
        for (let i = 0; i < sqlStatements.length; i++) {
            const statement = sqlStatements[i];
            if (statement.trim()) {
                try {
                    console.log(`执行第 ${i + 1} 个语句...`);
                    await connection.execute(statement);
                    console.log(`✅ 第 ${i + 1} 个语句执行成功`);
                } catch (error) {
                    console.error(`❌ 第 ${i + 1} 个语句执行失败:`, error.message);
                    // 继续执行其他语句
                }
            }
        }

        console.log('🎉 数据库初始化完成！');

        // 验证表是否创建成功
        console.log('\n正在验证表结构...');
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('已创建的表:');
        tables.forEach(table => {
            console.log(`  - ${Object.values(table)[0]}`);
        });

    } catch (error) {
        console.error('❌ 数据库初始化失败:', error.message);
        console.error('详细错误信息:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('数据库连接已关闭');
        }
    }
}

// 执行初始化
initDatabase(); 