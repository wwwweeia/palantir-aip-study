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
- 多处 `[待核实]` 标注，保留不确定性

**第二阶段：理解落地角色**

`02-fde-forward-deployed-engineer.md` — FDE 是谁、怎么工作、为什么有效
- FDE 的四个身份：问题翻译者 / 快速原型师 / 产品反馈者 / 变革推动者
- 演变弧线：FDE 1.0（人力密集）→ 2.0（工具辅助）→ 3.0（资产复用），FDE 是过渡形态而非稳态
- 中国移植三种变形：退化为驻场外包 / 演变为业务架构师 / 轻量化为技术合伙人式 CSM

**第三阶段：从理论到落地**

`03-enterprise-ai-landing.md` — 企业 AI 落地方法论
- Palantir 落地五步法（含批判：哪些步骤去掉 Palantir 三字也成立，哪些有独特价值）
- 没有 Foundry 时的开源/国产替代路径：语义层（Amundsen/DataHub）+ 操作层（Dify/Coze）+ 治理层（Apache Ranger）
- 从 POC 到规模化的五类常见坑：数据质量悬崖、治理债、成功的反噬、第二场景失效、模型漂移
- 行业切入视角：制造（资产中心）/ 金融（合规墙）/ 政务（数据权属）

**附录（持续更新）**

`99-notes-and-insights.md` — 学习过程中的碎片洞察与追问，按日期分节追加

## 学习进度

- [x] 初始化目录结构
- [x] Palantir Ontology 深析（2026-05-20，基于官方文档全面更新）
- [x] Ontology 文档第二轮独立审视修订（2026-05-20，补充层级关系澄清、局限与替代方案、研究前提、若干 `[待核实]` 标注）
- [x] FDE 角色与工作方式——D1 深化版（2026-05-20，新增 FDE 演变弧线、中国移植三种变形）
- [x] 企业 AI 落地方法论——D2 深化版（2026-05-20，新增非 Palantir 开源/国产路径、规模化坑、行业切入视角）
