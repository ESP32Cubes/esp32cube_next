-- 检查MySQL配置的SQL脚本
-- 请在MySQL服务器上执行这些查询

-- 1. 检查MySQL是否监听所有IP地址
SHOW VARIABLES LIKE 'bind_address';

-- 2. 检查端口配置
SHOW VARIABLES LIKE 'port';

-- 3. 检查用户权限
SELECT user, host FROM mysql.user WHERE user = 'esp32cube';

-- 4. 检查用户详细权限
SHOW GRANTS FOR 'esp32cube'@'%';

-- 5. 检查MySQL进程列表（查看当前连接）
SHOW PROCESSLIST;

-- 6. 检查MySQL状态
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections'; 