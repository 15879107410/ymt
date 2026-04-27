# YMT Local MVP

这是一个按当前确认范围实现的本地生活类 MVP 项目，核心目标是先跑通最小交易闭环：

- 商家注册并自动通过
- 商家填写店铺资料
- 商家发布和管理商品
- 消费者注册登录
- 消费者浏览商品并下单
- 商家和消费者都可以查看订单

## 当前技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- SQLite
- Prisma Client

## 当前实现边界

当前只实现已经确认过的 MVP，不主动扩需求。

已实现：

- 假登录 / 注册
- 商家自动通过入驻
- 商品管理
- 平台内下单
- 基础订单状态流转

暂不实现真实逻辑：

- 真实支付
- 物流追踪
- 骑手配送
- 推荐系统
- 微信登录
- 手机号验证码登录

## 本地启动

在项目根目录执行：

```bash
npm install
npm run dev
```

默认访问：

- [http://localhost:3000](http://localhost:3000)

## 数据库说明

当前使用本地 SQLite：

- 数据库文件：`prisma/dev.db`
- 初始化 SQL：`prisma/init.sql`
- Prisma Schema：`prisma/schema.prisma`

如果你需要重新初始化数据库，可执行：

```bash
npm run db:init
npm run db:generate
npm run db:seed
```

## 演示账号

- 消费者：`consumer-demo / 123456`
- 商家：`merchant-demo / 123456`

## 常用命令

```bash
npm run dev
npm run lint
npm run build
npm run db:init
npm run db:generate
npm run db:seed
npm run smoke
```

`npm run build` 当前默认走 `next build --webpack`，这样可以避开部分环境里
`Turbopack` 对 CSS 子进程的权限限制，让本地和受限环境下的构建更稳定。

## 烟雾测试

如果本地开发服务已经启动，可以执行：

```bash
npm run smoke
```

这条命令会自动验证：

- 消费者登录
- 消费者下单
- 商家登录
- 商家接单

## 说明

当前 UI 会尽量贴近 `stitch` 原型，但开发实现严格收敛在已经确认过的 MVP 范围内。
