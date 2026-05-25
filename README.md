# Palantir AIP → FDE → 企业 AI 落地 学习路径

**在线文档站**：[wwwweeia.github.io/palantir-aip-study](https://wwwweeia.github.io/palantir-aip-study/)

## 目标

深入理解 Palantir 的技术体系与工程文化，最终服务于：**如何在真实企业中让 AI 应用落地**。

## 研究前提（重要）

**Palantir 不进中国市场，因此本研究不以"使用 Palantir"为目的，而是借鉴其方法论。**

具体来说：

- **Ontology 范式** — 借鉴其"语义层 + 行动层 + 治理一体化"的设计思路，而非直接使用 Foundry
- **FDE 模式** — 借鉴其"驻场工程师 + 业务深度嵌入"的角色定位，思考国内甲乙方文化下如何变形
- **落地工程哲学** — 借鉴其数据先行、小步迭代、人在回路（Human-in-the-Loop）的取舍

**最终要回答的问题**：在国产化技术栈、国内企业现实约束（合规、组织、预算）下，能否搭出一套近似 Palantir 范式的方法论框架。

> 注意：所有文档保留对 Palantir 的**批判视角**——它的优点和局限同等重要，不做软文。

## 学习路径

**第一阶段：理解底层模型**

`01-palantir-aip-ontology.md` — Palantir Ontology 核心概念深析
- Foundry / Ontology / AIP 三层关系前置澄清
- Object、Link、Action、Function、Rule、Interface 逐一拆解，配传统数据表对比
- §12 局限与替代方案：Databricks / Microsoft Fabric / Snowflake / 开源 / 国产横向对比
- `[待核实]` 标注已基本核实（Interfaces 2024-08 Beta、Rule 互斥性、OSDK API、AIP Assist 定位），仅剩 2 处保留

**第二阶段：理解落地角色**

`02-fde-forward-deployed-engineer.md` — FDE 是谁、为什么这个角色存在、边界在哪
- 四个身份为什么缺一不可（逆向拆解：拆掉任何一个会退化成客户已有的什么角色）
- 工作流程核心不是五步本身，而是步骤之间的双轨判断密度（技术可行性 ↔ 业务优先级同步）
- FDE 不适合的场景：需求已明确 / 客户不打算建自主能力 / 产品高度标准化 / 决策权碎片化
- 演变弧线：FDE 1.0（人力密集）→ 2.0（工具辅助）→ 3.0（资产复用），FDE 是过渡形态而非稳态
- 中国移植三种变形：退化为驻场外包 / 演变为业务架构师 / 轻量化为技术合伙人式 CSM

**第三阶段：从理论到落地**

`03-enterprise-ai-landing.md` — 企业 AI 落地方法论
- 落地五步法（Step 3"构建语义模型"用制造业物料追踪场景对比了 SQL 表 vs Ontology 关系显式化的差异）
- 没有 Foundry 时的开源/国产替代路径：语义层（Amundsen/DataHub）+ 操作层（Dify/Coze）+ 治理层（Apache Ranger）
- 从 POC 到规模化的五类常见坑：数据质量悬崖、治理债、成功的反噬、第二场景失效、模型漂移
- 行业切入视角：制造（资产中心）/ 金融（合规墙）/ 政务（数据权属）

**附录（持续更新）**

**第四阶段：收束与行动**

`04-action-guide-domestic-ai.md` — 国产化 AI 落地行动指南
- 回答 README 核心问题："国产化技术栈下能否搭出近似 Palantir 范式？"
- 三档决策框架：路径 A（RAG + 工作流）/ 路径 B（加语义抽象层）/ 路径 C（深度建模 + 平台化）
- 三条路径各自的工具链、成本、第一步做什么、撞墙信号
- 三个必须避的坑 + 自我批判节

**第五阶段：工程化实施模式**

`05-ontology-engineering-patterns.md` — Ontology 工程落地模式：从概念到受控执行
- 为什么"有了图数据库"还不够：两端（数据底座 + AI 上层）中间缺失的语义执行层
- 模式一：现有四层数据模型 → Ontology 6 要素的映射（寄生扩展，不另起炉灶）
- 模式二：受控执行三条不变原则（LLM 只申请 / 业务系统是 SoT / 每次执行有审计）
- 模式三：语义路由链——动态向量检索替代静态 System Prompt 的工程实现
- 模式四：一致性分级（EVENTUAL vs STRONG_ON_READ）的务实取舍
- 模式五：子图按"查询闭环"切，不按数据源切
- GraphRAG vs Ontology-driven 的本质区别：非结构化问答 vs 受控业务执行
- 建模四步法 + 语义索引层（召回质量的真正决定因素）

**第六阶段：开源实现参考**

`06-umodel-alibaba-semantic-runtime.md` — 阿里开源 UModel：国产最接近 Palantir Ontology 语义层的参考实现
- 概念对照表：Palantir Object Type / Link / OSDK → UModel EntitySet / Topology / 生成式 SDK
- SPL 三种查询类型（`.umodel` / `.entity` / `.topo`）代码示例
- Agent 反射机制（`__list_method__()`）与 Palantir AIP Assist 的本质差异
- 支付网关故障排查真实示例（三层领域跨域建模）
- 批判节：API 不稳定风险、功能边界、社区体量对比
- 在 04 篇三档路径框架中的定位

**附录（持续更新）**

`99-notes-and-insights.md` — 学习过程中的碎片洞察与追问，按日期分节追加

## 学习进度

- [x] 初始化目录结构
- [x] Palantir Ontology 深析（2026-05-20，基于官方文档全面更新）
- [x] Ontology 文档第二轮独立审视修订（2026-05-20，补充层级关系澄清、局限与替代方案、研究前提、若干 `[待核实]` 标注）
- [x] Q4 事实核实（2026-05-20，核实 8 处 `[待核实]` 中的 6 处，2 处因无公开资料保留）
- [x] FDE 角色与工作方式——D1 深化版（2026-05-20，新增 FDE 演变弧线、中国移植三种变形）
- [x] 企业 AI 落地方法论——D2 深化版（2026-05-20，新增非 Palantir 开源/国产路径、规模化坑、行业切入视角）
- [x] Q1/Q2/Q3 质量修订（2026-05-20：02-FDE 前半升级路线B + 03-落地 Step 3 升级 + 02/03 承接句）
- [x] 04-国产化 AI 落地行动指南——D3 初版（2026-05-20：三档决策框架 + 工具链 + 避坑 + 自我批判）
- [x] 05-Ontology 工程落地模式——初版（2026-05-21：受控执行三原则 + 语义路由链 + GraphRAG 辨析 + 建模四步法）
- [x] 06-UModel 阿里开源语义运行时——初稿（2026-05-25：概念对照 + SPL 三种查询 + Agent 反射机制 + 批判节）
