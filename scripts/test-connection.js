const mysql = require('mysql2/promise');

// 数据库配置
const dbConfig = {
    host: '81.68.94.171',
    user: 'esp32cube',
    password: 'KC32KPYaw33ASMXw',
    database: 'esp32cube',
    port: 3306,
    connectTimeout: 10000, // 10秒连接超时
    acquireTimeout: 10000,
    timeout: 10000,
    reconnect: true,
    charset: 'utf8mb4'
};

async function testConnection() {
    console.log('🔍 开始测试数据库连接...');
    console.log('配置信息:');
    console.log(`  主机: ${dbConfig.host}`);
    console.log(`  端口: ${dbConfig.port}`);
    console.log(`  用户: ${dbConfig.user}`);
    console.log(`  数据库: ${dbConfig.database}`);
    console.log(`  连接超时: ${dbConfig.connectTimeout}ms`);

    try {
        console.log('\n正在尝试连接...');
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ 连接成功！');

        // 测试查询
        console.log('\n正在测试查询...');
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ 查询测试成功:', rows);

        // 检查数据库是否存在
        console.log('\n正在检查数据库...');
        const [databases] = await connection.execute('SHOW DATABASES');
        const dbExists = databases.some(db => db.Database === dbConfig.database);
        console.log(`数据库 '${dbConfig.database}' ${dbExists ? '存在' : '不存在'}`);

        if (dbExists) {
            // 检查表
            console.log('\n正在检查现有表...');
            const [tables] = await connection.execute('SHOW TABLES');
            if (tables.length > 0) {
                console.log('现有表:');
                tables.forEach(table => {
                    console.log(`  - ${Object.values(table)[0]}`);
                });
            } else {
                console.log('数据库中没有表');
            }
        }

        await connection.end();
        console.log('\n🎉 连接测试完成！');

    } catch (error) {
        console.error('\n❌ 连接失败:', error.message);
        console.error('错误代码:', error.code);
        console.error('错误号:', error.errno);

        // 提供解决方案建议
        console.log('\n💡 可能的解决方案:');
        if (error.code === 'ETIMEDOUT') {
            console.log('1. 检查网络连接是否正常');
            console.log('2. 确认服务器IP地址是否正确');
            console.log('3. 检查防火墙设置是否允许3306端口');
            console.log('4. 确认MySQL服务是否正在运行');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('1. 确认MySQL服务正在运行');
            console.log('2. 检查MySQL是否配置为允许远程连接');
            console.log('3. 检查bind-address配置');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('1. 检查用户名和密码是否正确');
            console.log('2. 确认用户是否有远程访问权限');
        }
    }
}

testConnection(); 