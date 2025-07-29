import mysql from 'mysql2/promise';

// 使用 Vercel 环境变量配置数据库连接
export const db = mysql.createPool({
  host: process.env.DB_HOST,        // 从环境变量中获取数据库主机
  user: process.env.DB_USER,        // 从环境变量中获取数据库用户名
  password: process.env.DB_PASSWORD,// 从环境变量中获取数据库密码
  database: process.env.DB_DATABASE,// 从环境变量中获取数据库名
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});