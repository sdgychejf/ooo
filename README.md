# LLM 应用开发课程大作业

本项目是一个基于 Next.js 构建的综合性 Web 应用，深度集成了 QAnything 本地知识库问答、WakaTime 编码活动统计，并整合了本学期以来的所有课程练习。项目旨在探索和实践大型语言模型（LLM）在实际 Web 应用中的集成与开发，同时展现了组件化、模块化的现代前端开发思想。

## 技术栈

- **框架**: Next.js
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **API 通信**: SWR
- **环境管理**: uv (Python)

## 核心功能亮点

- **QAnything API 自主集成**: 采用路径二，自主设计前端交互界面，直接调用 QAnything 后端 API，实现了包括流式响应在内的完整问答体验。
- **WakaTime 数据可视化**: 动态获取并展示 WakaTime 个人编码时长，通过环境变量安全管理 API Key。
- **模块化课程练习**: 将过往所有课程练习组件化，并通过独立的路由进行组织和展示。
- **清晰的项目结构**: 合理的目录组织，易于理解和维护。

## QAnything 集成实现 (路径二)

我们选择了挑战性更高但也更灵活的"路径二"，即通过直接调用 QAnything 服务端 API 的方式，从零构建问答服务的前端交互界面。

### 1. 路径选择原因

- **完全的控制力与定制化**: 相比于直接嵌入 HTML 页面，自行开发前端能让我们对 UI/UX 进行完全的控制，可以根据项目整体风格进行定制，打造无缝、一致的用户体验。
- **更深入的技术探索**: 该路径促使我们深入理解 QAnything API 的工作机制，包括身份验证、参数构造、流式数据处理等，是更宝贵的后端服务集成经验。
- **为未来功能扩展打下基础**: 自主开发的架构使得未来集成更多高级功能（如会话历史、知识库管理等）成为可能。

### 2. 实现细节

- **API 理解与调用**: 我们分析了 QAnything 的 API 文档（或通过网络调试工具抓取），实现了与 `/api/local_doc_qa/chat` 等核心端点的交互。
- **API Key 安全管理**: 敏感的 `API Key` 被存储在 `.env.local` 文件中，并通过 Next.js 的服务端 API 路由进行代理调用，从未暴露在客户端，确保了安全性。
- **前端交互功能**:
    - **输入与提问**: 用户可以通过输入框提交问题。
    - **加载状态**: 在等待 API 响应时，界面会显示明确的加载提示。
    - **流式输出**: 我们成功实现了对流式（Streaming）响应的处理，让答案能够像打字机一样逐字显示，极大地提升了用户体验。
    - **错误处理**: 对 API 请求可能出现的网络错误或服务错误进行了捕获和友好提示。
- **后端代理**: 创建了一个 Next.js API Route (`/api/chat`) 作为后端代理，负责接收前端请求，然后将请求（附带 `API Key`）转发给真实的 QAnything 服务，避免了浏览器的跨域（CORS）问题和 `API Key` 泄露。

## WakaTime API 集成

为了动态展示个人的编程活动，我们集成了 WakaTime API。

1.  **获取 API Key**: 登录 WakaTime 账户，在 `Settings > Account` 页面找到 `Secret API Key`。
2.  **安全存储**: 将获取到的 `API Key` 存储在 `.env.local` 文件中：`WAKATIME_API_KEY=your_secret_key`。
3.  **API 路由**: 创建了一个 Next.js API 路由 (`/api/wakatime/stats/[range]`) 来获取数据。这个路由从环境变量中读取 `API Key`，向 WakaTime API (`https://wakatime.com/api/v1/users/current/stats/{range}`) 发起请求，并将获取到的数据返回给前端。这样做同样保证了 `API Key` 不会泄露到客户端。
4.  **前端展示**: 在应用的页脚（Footer）组件中，使用 `SWR` 或 `useEffect` + `fetch` 调用我们自己创建的 `/api/wakatime/stats/all_time` 接口，获取总编码时长并展示。

## 课程练习整合

本学期所有的课程练习都被整合到了这个 Next.js 应用中，并按照以下方式进行组织：

- **统一入口**: 在主导航栏中有一个"课程作业"入口。
- **独立路由**: 每个练习都被视为一个独立的页面，拥有自己的路由，例如 `/homework/exercise-1`，`/homework/exercise-2` 等。
- **组件化改造**: 每个练习的核心功能被封装成独立的 React 组件，然后在对应的页面中进行渲染。这体现了组件化开发的思想，提高了代码的复用性和可维护性。
- **静态资源管理**: 练习中用到的图片、CSS 等静态资源被统一存放在 `public` 和 `src/app/homework` 目录下，由 Next.js 进行高效管理。

## 项目结构

```
.
├── src/
│   ├── app/
│   │   ├── api/                  # 后端 API 路由
│   │   │   ├── chat/             # QAnything 代理 API
│   │   │   └── wakatime/         # WakaTime 代理 API
│   │   ├── chat/                 # QAnything 问答页面
│   │   ├── homework/             # 课程练习页面
│   │   └── ...                   # 其他页面和布局
│   ├── components/               # 可复用的 React 组件
│   │   ├── chat/                 # 问答界面相关组件
│   │   ├── ui/                   # 通用 UI 组件 (Button, Input, etc.)
│   │   └── navigation.tsx        # 主导航栏
│   ├── lib/                      # 辅助函数、客户端等
│   │   └── services/                 # 服务层 (如果需要)
├── public/                       # 静态资源
├── .env.local                    # 环境变量 (需要自行创建)
└── README.md                     # 就是你正在看的这个文件
```

## 运行指南

1.  **克隆仓库**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置环境变量**
    复制 `.env.example` (如果提供) 或手动创建一个 `.env.local` 文件，并填入以下内容：

    ```env
    # QAnything 服务地址
    QANYTHING_API_URL=http://your_qanything_host:port
    # QAnything API Key
    QANYTHING_API_KEY=your_qanything_api_key
    
    # WakaTime API Key
    WAKATIME_API_KEY=your_wakatime_secret_api_key
    ```
    *请确保你的 QAnything 服务正在运行。*

4.  **启动开发服务器**
    ```bash
    npm run dev
    ```

5.  在浏览器中打开 `http://localhost:3000` 查看。

## 功能截图

### 1. QAnything 问答服务运行截图

![image-20250630235555189](/Users/night/Documents/Codes/SaltyFish/250530-qanything-all/250530-qanything-7/assets/image-20250630235555189.png)![image-20250630235559906](/Users/night/Documents/Codes/SaltyFish/250530-qanything-all/250530-qanything-7/assets/image-20250630235559906.png)![image-20250630235605237](/Users/night/Documents/Codes/SaltyFish/250530-qanything-all/250530-qanything-7/assets/image-20250630235605237.png)

![image-20250630235622208](/Users/night/Documents/Codes/SaltyFish/250530-qanything-all/250530-qanything-7/assets/image-20250630235622208.png)

### 2. WakaTime API 集成展示截图

![image-20250630235644737](/Users/night/Documents/Codes/SaltyFish/250530-qanything-all/250530-qanything-7/assets/image-20250630235644737.png)

### 3. Next.js 课程练习组织截图

![image-20250630235633378](/Users/night/Documents/Codes/SaltyFish/250530-qanything-all/250530-qanything-7/assets/image-20250630235633378.png)
