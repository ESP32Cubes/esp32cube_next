const net = require('net');
const dns = require('dns').promises;

async function diagnoseNetwork() {
    const host = '81.68.94.171';
    const port = 3306;

    console.log('🔍 开始网络诊断...');
    console.log(`目标服务器: ${host}:${port}`);

    // 1. DNS解析测试
    try {
        console.log('\n1. DNS解析测试...');
        const addresses = await dns.lookup(host);
        console.log(`✅ DNS解析成功: ${host} -> ${addresses.address}`);
    } catch (error) {
        console.error(`❌ DNS解析失败: ${error.message}`);
    }

    // 2. 端口连接测试
    console.log('\n2. 端口连接测试...');
    const socket = new net.Socket();

    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            console.log('⏰ 连接超时 (10秒)');
            socket.destroy();
            resolve();
        }, 10000);

        socket.connect(port, host, () => {
            clearTimeout(timeout);
            console.log('✅ 端口连接成功！');
            console.log(`本地地址: ${socket.localAddress}:${socket.localPort}`);
            console.log(`远程地址: ${socket.remoteAddress}:${socket.remotePort}`);
            socket.destroy();
            resolve();
        });

        socket.on('error', (error) => {
            clearTimeout(timeout);
            console.error(`❌ 连接错误: ${error.message}`);
            console.error(`错误代码: ${error.code}`);

            // 提供具体的错误分析
            switch (error.code) {
                case 'ECONNREFUSED':
                    console.log('💡 分析: 连接被拒绝 - MySQL服务可能未运行或未监听该端口');
                    break;
                case 'ETIMEDOUT':
                    console.log('💡 分析: 连接超时 - 可能是网络问题或防火墙阻止');
                    break;
                case 'ENOTFOUND':
                    console.log('💡 分析: 主机未找到 - 检查IP地址是否正确');
                    break;
                default:
                    console.log('💡 分析: 其他网络连接问题');
            }
            resolve();
        });
    });
}

// 3. 测试不同的连接方式
async function testAlternativeConnections() {
    console.log('\n3. 测试替代连接方式...');

    const configs = [
        { host: '81.68.94.171', port: 3306, desc: '标准MySQL端口' },
        { host: '81.68.94.171', port: 33060, desc: 'MySQL X Protocol端口' },
        { host: '81.68.94.171', port: 3307, desc: '备用MySQL端口' }
    ];

    for (const config of configs) {
        console.log(`\n测试 ${config.desc} (${config.host}:${config.port})...`);
        const socket = new net.Socket();

        await new Promise((resolve) => {
            const timeout = setTimeout(() => {
                console.log('  ⏰ 超时');
                socket.destroy();
                resolve();
            }, 5000);

            socket.connect(config.port, config.host, () => {
                clearTimeout(timeout);
                console.log(`  ✅ 连接成功`);
                socket.destroy();
                resolve();
            });

            socket.on('error', () => {
                clearTimeout(timeout);
                console.log(`  ❌ 连接失败`);
                resolve();
            });
        });
    }
}

// 执行诊断
async function runDiagnosis() {
    await diagnoseNetwork();
    await testAlternativeConnections();

    console.log('\n📋 诊断总结:');
    console.log('1. 如果DNS解析成功但端口连接失败，问题可能在MySQL配置');
    console.log('2. 如果所有连接都超时，可能是网络或防火墙问题');
    console.log('3. 建议检查MySQL的bind-address配置');
    console.log('4. 确认MySQL服务正在运行');
}

runDiagnosis(); 