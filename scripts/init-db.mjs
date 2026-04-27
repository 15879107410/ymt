import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

// 这里统一约定数据库文件位置，避免不同命令在相对路径上解析不一致。
const databasePath = resolve(process.cwd(), "prisma/dev.db");
const initSqlPath = resolve(process.cwd(), "prisma/init.sql");

// 先确保数据库目录存在，再去执行 sqlite 初始化脚本。
mkdirSync(dirname(databasePath), { recursive: true });

// 如果数据库文件还不存在，就先创建一个空文件占位。
if (!existsSync(databasePath)) {
  execFileSync("touch", [databasePath], { stdio: "inherit" });
}

// 用 sqlite3 执行初始化 SQL，把表结构和索引一次性建好。
execFileSync("sqlite3", [databasePath], {
  input: readFileSync(initSqlPath, "utf8"),
  stdio: ["pipe", "inherit", "inherit"],
});

console.log(`Database initialized at ${databasePath}`);
