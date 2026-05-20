# Palantir AIP Ontology 深析

> 来源：官方文档 + 微信图解 + 研究文章（2026-05-20 更新）
> 参考：[Palantir 官方 Ontology 文档](https://www.palantir.com/docs/foundry/ontology/overview) | [Ontology Explained](https://zerofuturetech.substack.com/p/palantir-ontology-explained-why-its)

---

## 一句话定义

> **Palantir Ontology 是企业的数字孪生——一个活的、可操作的语义层，让人和 AI 都能理解、查询、并直接操作企业业务世界。**

官方原话：
> "The Foundry Ontology is the digital twin of an organization, a rich semantic layer that sits on top of the digital assets integrated into Foundry."

---

## 前置澄清：Foundry / Ontology / AIP 是三层不同的东西

读 Palantir 资料最容易混淆的概念，先在这里钉死：

```
┌─────────────────────────────────────────────────────────┐
│   AIP（Artificial Intelligence Platform）                │   ← AI 应用层
│   AIP Logic / Workshop / Assist / Agent Studio / Threads │     LLM 编排、Agent、对话式产品
├─────────────────────────────────────────────────────────┤
│   Ontology                                              │   ← 语义 / 逻辑 / 执行层
│   Object Types + Link Types + Action Types              │     企业的"数字孪生"
│   + Functions + Interfaces + Roles                      │
├─────────────────────────────────────────────────────────┤
│   Foundry                                               │   ← 数据平台层
│   Pipeline Builder / Code Repo / Dataset / Compute       │     ETL、数据治理、计算引擎
└─────────────────────────────────────────────────────────┘
```

| 层 | 它是什么 | 它解决的问题 |
|----|---------|------------|
| **Foundry** | 基础**数据平台**。负责把 ERP/CRM/IoT/文件 等异构数据源接入、清洗、构建管道，沉淀为统一治理的 Dataset | 数据集成与治理（80% 的工程量在这里） |
| **Ontology** | 构建在 Foundry 之上的**语义层 + 逻辑层 + 执行层**。把 Dataset 映射成业务对象、关系和可执行的行动 | 让数据可以被业务和 AI"理解 + 操作" |
| **AIP** | 构建在 Foundry + Ontology 之上的 **AI 应用层**。所有 AIP 产品都通过 Ontology 与企业数据世界交互 | LLM 与企业业务的安全编排 |

**容易踩的概念陷阱**：

- "Palantir Foundry" 有时被用作整个平台的代称——严格来说 AIP 是 Foundry 之上的产品，不是平级。
- "Ontology" 既是一个抽象概念（业务语义模型），也是 Foundry 里一个具体的产品组件。
- 微信图解里说的"Palantir AIP Ontology"严格说是个不严谨的叠加叫法。**本文档沿用了这个习惯标题，但讨论的核心是 Ontology 本身**——它既是 Foundry 的核心模块，也是 AIP 真正用来与企业数据互动的接口。

> 一句话记法：**Foundry 管数据，Ontology 管语义和操作，AIP 管 AI 体验。**

---

## 从"数据表"到"业务世界"

传统方式，AI 看到的是：

```
t_orders 表有 5,000,000 行
order_id | customer_id | product_id | status | created_at
```

有了 Ontology，AI 看到的是：

```
客户 Acme Corp 的第三笔订单——
包含 5 个涡轮叶片，目前在汉堡仓库质检，
关联 DHL 运单 #DHL-88492，
预计下周二抵达上海
```

差异的本质：Ontology 不只存数据，它把 ERP/CRM/SCM/IoT 的碎片**缝合成一个可理解的业务世界**。

---

## Ontology 的完整概念体系

官方文档把 Ontology 分为两类要素：

```
语义元素（Semantic Elements）—— 描述"世界是什么样的"
├── Object Type（对象类型）
├── Properties（属性）
├── Shared Properties（共享属性）
├── Link Types（关联类型）
└── Interfaces（接口）

动力元素（Kinetic Elements）—— 定义"可以做什么"
├── Action Types（行动类型）
├── Functions（函数）
└── Roles（权限角色）
```

---

## 1. Object Type（对象类型）

### 概念

| 概念 | 类比（数据库） | 说明 |
|------|--------------|------|
| Object Type（对象类型） | Dataset / 表 | 实体的 Schema 定义 |
| Object（对象） | Row / 行 | 一个具体实例 |
| Object Set（对象集合） | 查询结果集 | 多个对象的集合 |
| Property（属性） | Column / 列 | 实体的特征定义 |
| Property Value（属性值） | Field / 单元格 | 具体实例的属性值 |

### 典型 Object Type

```
Customer（客户）
├── 主键：customer_id
├── name: "Acme Corp"
├── industry: "Manufacturing"
├── region: "Americas"
├── lifetime_spend: $24,500
└── last_order_date: 2024-10-15
```

### Shared Properties（共享属性）

跨多个 Object Type 复用同一属性定义。例如 `status`、`created_at`、`owner` 可以被 Order、Ticket、Flight 等多个对象类型共用，统一数据建模标准。

### Derived Properties（派生属性）

不存储在数据源里，而是通过 Function 实时计算得出的属性。例如：`days_since_last_order`、`risk_score`、`inventory_remaining`。

---

## 2. Link Types（关联类型）

### 概念

Link Type = 两个 Object Type 之间关系的 Schema 定义  
Link = 两个具体 Object 之间的一条关系实例

### 典型关联

| 关联 | 方向 | 基数 |
|------|------|------|
| Customer → placed → Order | 有向 | 1:N |
| Order → contains → Product | 有向 | N:N |
| Factory → produces → Product | 有向 | 1:N |
| Factory → ships via → Delivery | 有向 | 1:N |

### Links 的价值：多跳推理

```
"订单 #123 的产品，是哪个工厂生产的，目前配送状态如何？"

Order #123
  └─[contains]→ Product (涡轮叶片)
       └─[produced by]→ Factory (汉堡工厂)
            └─[ships via]→ Delivery (DHL-88492)
                 └─ status: "质检中"，ETA: 下周二
```

AI 的查询是**遍历图结构**，而不是写多表 JOIN。

---

## 3. Interfaces（接口）— 重要的新概念

`[引入时间待核实]` 2023–2024 年期间引入的重要特性，类似 OOP 中的接口/抽象类。

### 作用

Interface 描述一类 Object Type 的**公共形状和能力**，提供多态性（Polymorphism）。

### 例子

```
Interface: Ticket（工单）
├── 共同属性：title, status, priority, created_at
└── 共同行动：close_ticket, reassign_ticket

Object Type: Bug（实现了 Ticket）
├── 继承 Ticket 的属性和行动
└── 额外属性：severity, stack_trace

Object Type: FeatureRequest（实现了 Ticket）
├── 继承 Ticket 的属性和行动
└── 额外属性：business_value, target_version
```

### 实际用处

- 可以写一个 `close_ticket` Action 同时作用于 Bug 和 FeatureRequest
- AI Agent 可以用 Interface 级别的查询，不需要知道具体是哪种 Ticket
- 跨部门统一数据建模标准

---

## 4. Action Types（行动类型）— 核心差异点

### 官方定义

> An action is a **single transaction** that changes the properties of one or more objects, based on user-defined logic.

Action 不是简单的 API 调用——它是**带有完整治理框架的业务操作单元**。

### Action 的完整结构

```
Action Type: Assign Employee（调整员工角色）
│
├── Parameters（参数）
│   └── new_role: string（新角色名称）
│
├── Rules（规则）
│   ├── 修改 Employee.role = new_role
│   └── 创建 Employee →[reports_to]→ Manager 的链接
│
├── Submission Criteria（提交条件/校验）
│   └── 只有 HR 部门人员可以执行
│
├── Side Effects（副作用）
│   ├── 通知旧 Manager：员工已调离
│   └── 通知新 Manager：新员工加入
│
└── Action Log（操作审计日志）
    └── 记录：谁、何时、改了什么
```

### Action 的三类 Rules

| Rule 类型 | 作用 |
|----------|------|
| 修改属性规则 | 直接设置对象的属性值 |
| 创建/删除链接规则 | 建立或断开对象之间的关联 |
| Function-backed Rule | 用代码函数实现复杂逻辑（最强大） |

> `[细节待核实]` 当配置了 Function-backed Rule 时，其他 Rule 不能共存——Function 可以完成一切其他 Rule 能做的事，且能处理任意复杂逻辑。（来源是分析文章而非官方文档，需回到 Action Types 官方文档核对）

### 思维模型

> **"给遥控器加按钮——每个按钮有自己的锁，不是所有人都能按每个按钮。"**

---

## 5. Functions（函数）— 逻辑层

### 官方定义

> A function is a piece of code-based logic that takes in input parameters and returns an output. Functions are natively integrated with the Ontology.

### Function vs Action 的区别

| | Action | Function |
|-|--------|----------|
| 形式 | 声明式配置 | 代码逻辑（TypeScript/Python） |
| 用途 | 单次业务操作 | 复杂计算、自定义查询、AI 推理 |
| 输入 | 用户填写的参数 | Object Set、属性值、模型输出 |
| 输出 | 写回 Ontology | 可以是任意值，也可以写回 |

### Functions 支持的语言

- TypeScript v2（推荐，最新）
- TypeScript v1（旧版）
- Python

> `[体系归属待核实]` Foundry 历史上 TypeScript Functions 与 Python Functions 是相对独立的产物（基础设施、部署方式都不同）。是否真正统一到同一套 Functions 体系下，需要回到官方 Functions 文档确认当前形态。

### Functions 的典型用场景

```
1. 自定义聚合（不是简单 COUNT/SUM）
   → "计算所有在风险等级 >7 的供应商的总采购敞口"

2. 派生属性计算
   → "根据历史订单数据，计算客户流失风险分"

3. Action 的复杂规则
   → 调用 ML 模型判断审批是否通过

4. AIP Logic 中的 AI 推理节点
   → 结合 LLM 对对象集合进行分析并输出结构化结论
```

---

## 6. Roles（权限角色）— 治理层

Ontology 有独立的权限体系，与文件系统权限分开管理。

### 两级权限控制

```
Ontology 级别权限
└── 谁可以查看/使用整个 Ontology

Object Type 级别权限（细粒度）
├── 谁可以读取某类对象
├── 谁可以修改某类对象
└── 谁可以执行某个 Action
```

**关键设计**：权限沿"数据层 → Ontology Roles → OSDK Token → AI 应用"逐层传递，**架构上**保证 AI 应用对 Ontology 的访问遵循调用者的角色权限——这是 Palantir 的核心治理承诺。

> ⚠️ 工程上要更精确地理解这句话：
>
> - 架构保证的是"对 Ontology 的访问"受权限约束，**不保证**开发者塞进 LLM prompt 的具体内容也受同样约束
> - 实际安全等级取决于开发者**是否始终通过 Ontology 接口取数**，以及对 LLM 输出的处理（避免越权对象被反推、避免敏感字段被回显等）
> - 营销话术"AI 看不到人看不到的数据"成立的前提是：所有 AI 入口的数据都经过 Ontology + OSDK 鉴权，且没有绕过 Ontology 的旁路数据通道

---

## 7. OAG：Ontology 如何改变 AI 的检索方式

RAG（Retrieval-Augmented Generation，检索增强生成）是目前主流做法，本节用 OAG（Ontology-Augmented Generation）描述 Palantir 路线带来的范式差异。

> ⚠️ **术语提示**：**"OAG" 不是 Palantir 官方主推的标准术语**，更多出现在社区分析文章中（如 zerofuturetech 等）。Palantir 官方更倾向用 "Ontology-based AI"、"AIP Logic"、"semantic layer for AI" 等说法。本文使用 OAG 仅为了与 RAG 形成对照，便于讨论范式差异，**引用时请避免把它当作 Palantir 官方概念**。
>
> 此外，关于 RAG vs OAG 的具体比较是否过于一边倒、以及"现代 RAG"已经能做哪些事，请见 §12.4 的反方论述。

### RAG vs OAG 对比

| 维度 | RAG + Tool Use（主流做法） | OAG（Palantir 路线） |
|------|---------------------------|---------------------|
| 检索对象 | 文本片段 + 结构化数据（通过 function calling） | 结构化业务对象 + 实时关联关系（原生） |
| 结果质量 | 依赖检索策略，复杂查询仍有幻觉风险 | 基于 Ontology 的确定性匹配，grounded in live data |
| 后续动作 | 通过 function calling 可写回业务系统，但治理分散 | 可直接触发 Action（审批/创建工单/发通知），权限和审计原生集成 |
| 治理一体化 | 各层分别实现，需自行对齐 | 语义层 / 操作层 / 权限层在同一框架内 |

### 场景示意：供应链中断

> 以下为基于 Palantir 公开 demo 场景的假设性描述，用于说明 OAG 的工作方式，非真实客户案例数据。

**手动方式**：检查 20 个系统，拼凑数据，写报告 → 3-5 天

**假设的 OAG + AIP 方式**（5步）：
```
1. IoT 传感器自动触发异常警报
2. AI 遍历关联订单，计算潜在损失
3. 优化引擎生成 3 个替代采购方案（含成本和时效模拟）
4. 供应链经理审核选择最优方案
5. 自动创建采购订单 + 更新 ERP + 通知客户
```

> **这不是"AI 比人聪明"，而是"AI 消灭了人工在 20 个系统里找数据的痛苦"。**

---

## 8. OSDK：开发者如何使用 Ontology

OSDK（Ontology SDK）是开发者对接 Ontology 的编程接口，让外部应用可以读写 Ontology 数据。

### 支持的语言

| 语言 | 包管理器 |
|------|---------|
| TypeScript | NPM |
| Python | Pip / Conda |
| Java | Maven |
| 其他语言 | OpenAPI Spec 生成客户端 |

### OSDK 的核心优势

1. **强类型安全**：SDK 代码根据你的 Ontology 自动生成，类型和函数名就是你的业务对象名，在编辑器里有完整智能提示
2. **Token 权限隔离**：每个应用只能访问它被授权的 Object Type，用户权限之上还有应用级权限
3. **Foundry 作为后端**：不用自己搭 API Server，Foundry 直接提供高性能查询能力

### OSDK 示例（Python 风格伪码）

> `[API 形态待核实]` 下面是风格示意，**实际 OSDK Python 的 API 命名/链式语法以官方文档为准**——Python OSDK 较新、版本演进较快，实际可能在客户端构造、对象查询、链路遍历的写法上与下面差异较大。读者请把这段代码看作"心智模型"，不要直接复制使用。

```python
# 查询高风险客户
from my_ontology import Customer, Order

high_risk_customers = client.objects(Customer) \
    .filter(Customer.lifetime_spend < 10000) \
    .filter(Customer.last_order_date < "2024-01-01") \
    .fetch_page()

# 遍历关联订单
for customer in high_risk_customers:
    orders = customer.links.orders.all()
    print(f"{customer.name}: {len(orders)} orders")

# 触发 Action
client.actions.send_retention_email(
    customer=customer,
    template="win_back_30day"
)
```

---

## 9. 完整技术架构图

```
┌─────────────────────────────────────────────────────────────┐
│                     应用与集成层                              │
│  AIP Chatbot  |  Workshop  |  AIP Logic  |  Agent  |  API   │
└────────────────────────┬────────────────────────────────────┘
                         │ 读写
┌────────────────────────▼────────────────────────────────────┐
│                   Palantir Ontology                          │
│                                                             │
│  语义层：Object Types + Properties + Link Types + Interfaces │
│  逻辑层：Functions（TypeScript/Python）                      │
│  执行层：Action Types（含权限/校验/副作用/审计）              │
│  权限层：Roles（从数据到 AI 的统一权限控制）                  │
└────────────────────────┬────────────────────────────────────┘
                         │ 映射
┌────────────────────────▼────────────────────────────────────┐
│                  Palantir Foundry                            │
│         数据接入 | Pipeline Builder | 数据集管理              │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     数据源                                   │
│  ERP  |  CRM  |  WMS  |  MES  |  IoT  |  外部 API  |  文件  │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Palantir 的护城河到底是什么

> **不是大模型，而是 Ontology。**

任何人都可以调用 GPT 或 Claude，但把一家企业里所有实体、关系、规则、权限建模成 AI 可理解的语义系统，需要深度领域理解和持续工程投入。

| 护城河要素 | 说明 |
|-----------|------|
| 建模成本 | Ontology 建好后，每个新场景都能复用；竞争对手要重新建 |
| 数据飞轮 | 用户每次操作 Action 都写回 Ontology，数据越来越准确 |
| 权限完整性 | 权限从数据层贯穿到 AI 层，企业安全合规的底线 |
| FDE 执行力 | Ontology 再好，没人推就白搭——FDE 保障落地 |

---

## 11. 与同类概念的比较

> 以下对比有意列出每项技术**能做到什么**，而不是只写它"缺什么"。真实差距是"一体化深度"，不是单项能力的有无。

| 技术 | 能做到什么 | 与 Palantir 的真实差距 |
|------|-----------|----------------------|
| 知识图谱（Neo4j） | 实体+关系建模，图查询，Cypher 写入，APOC 存储过程 | 缺少对象级权限治理和 AI 原生 Action 绑定——是数据库，不是平台 |
| 数据仓库（+dbt semantic layer） | 存储+查询+指标语义，星型建模 | 语义停留在"度量"层，不是 AI 可操作的"业务对象"；跨系统关系建模非其设计目标 |
| ORM（Hibernate/JPA） | 对象化数据访问+关系映射（@OneToMany 等）+级联操作 | 限于单应用内，无跨系统统一治理和 AI 集成 |
| RAG + Tool Use | 文本检索+函数调用+可写回业务系统 | 治理分散在各工具层，无统一权限和审计链 |
| **Palantir Ontology** | **以上所有能力的平台级一体化** | **代价：高许可费用 + 供应商锁定（见 §12）** |

---

## 12. 局限、批评与替代方案（独立审视）

前面的论述基本是从 Palantir 视角出发的，下面把另一面也摆出来。**任何把 Palantir 当作"唯一正确答案"的判断，都需要先消化下面这几点。**

### 12.1 商业模式与价格争议

- **合同规模**：Palantir 的企业合同通常**起步 $1M+/年，大客户合同上亿美元**。Ontology 不是 SaaS 订阅式的轻量产品。
- **"软件还是咨询"的长期质疑**：相当一部分收入来自 FDE 驻场服务，业内长期讨论 Palantir 究竟是软件公司还是高端咨询。这影响估值逻辑，也影响"能不能用 Palantir 范式 = 能不能直接买 Palantir"的判断。
- **中小企业实际无法负担**——Ontology + FDE 范式的"完整版"对绝大多数企业不现实，**这就是为什么对国内大多数团队来说，研究 Palantir 只能是借鉴方法论**。

### 12.2 锁定效应（Vendor Lock-in）

- Ontology 一旦建好，**业务对象、关系、Action 规则、权限策略**都绑在 Foundry 上。
- 数据虽然名义上还在客户的存储里，但**业务语义层**完全是 Palantir 私有形态，**离开 Palantir 等于重建语义层**。
- 这是护城河的另一面——对 Palantir 是收入保障，对客户是退出成本。

### 12.3 FDE 模式不是稳态，是正在演变的过渡形态

- 02 文档讲的 FDE 模式有效，但**Palantir 自己近年的产品演进（OSDK、Workshop 模板化、AIP Assist）目标恰恰是降低对 FDE 的依赖**——因为 FDE 模式本质是人头堆出来的服务，扩展性受限。
- 把 FDE 当成"稳态最佳实践"来论述会过时。更准确的判断是：**FDE 是冷启动期的必要投入，Palantir 在尝试让"配置 + 模板 + Agent"逐步替代部分 FDE 工作**。
- 推论：国内想复刻"驻场工程师"模式时，应该已经规划好**FDE 工作如何沉淀为可复用资产**，否则会陷入"永远在堆人"的困局。

### 12.4 OAG > RAG 的相对性

第 7 节对 OAG 的描述有理想化倾向，需要补一段反方观点：

- **OAG 的前提是已经有 Ontology**。建好 Ontology 的工程量 ≫ 搭一套 RAG 的工程量。把"OAG 比 RAG 好"和"建 Ontology 比建 RAG 难"放在一起看，结论是"前期投入换长期回报"，**不是 OAG 在所有阶段都优于 RAG**。
- **现代 RAG ≠ 朴素文本检索**。Agent + Tool Use + 结构化检索 + 函数调用（function calling）已经能做很多 OAG 主张的"读 + 写"组合，只是没有统一治理框架。
- **真正的差异不在检索范式，而在治理一体化**：Palantir 把权限/审计/Action/语义放在同一套框架内交付，这是范式优势；至于"检索的具体方式"反而是次要的。

### 12.5 真正可比的替代方案对比

01 §11 的对比表（知识图谱 / 数据仓库 / ORM / RAG）只覆盖了"概念层面相似的技术"，**没有覆盖商业上真正在和 Palantir 竞争的方案**。下面这张表是补充。

| 方案 | 类似能力 | 主要差距 | 适用场景 |
|------|---------|---------|---------|
| **Databricks**（Lakehouse + Unity Catalog + Genie + Agent Bricks） | 数据治理、AI Agent、SQL 自然语言查询 | 没有显式"对象 + Action"语义模型；治理统一性弱于 Foundry | 已有数据团队、偏数据驱动的中大型企业 |
| **Microsoft Fabric + Copilot Studio** | 数据平台 + 低代码 AI 应用 | 与 M365/Azure 生态强绑定；Action 化能力弱 | 微软重度用户、办公场景为主 |
| **Snowflake Cortex AI** | 数据仓库 + 内置 LLM / Agent | 跨系统集成能力弱；本质还是仓库内 AI | Snowflake 用户、数据已经集中的场景 |
| **开源组合**（dbt + Neo4j/Dgraph + LangGraph/LlamaIndex + 自建权限层） | 理论上每一层都能找到对应组件 | 整合成本极高，需要强工程能力，治理统一性几乎靠自己造 | 工程能力强、预算紧、愿意长期投入平台建设 |
| **国产方案**（阿里通义企业版 + Hologres、字节豆包企业版、华为盘古、智谱企业版等） | 语义查询、业务集成、合规部署 | Ontology 抽象未成熟、FDE 角色弱、Action 治理框架缺失 | 数据合规要求高的国内企业 |
| **Palantir Foundry + AIP** | 语义 + Action + 治理 + AI 应用一体化 | 价格高、锁定强、不进中国市场 | 大型跨国企业、政府/军工 |

**关键判断**：

- "Palantir 是唯一选择"是错觉。商业上有真正的替代品，**只是没有任何一家把"Ontology + FDE + 治理"这套组合做到 Palantir 这种完整度**。
- 国内场景下，**没有现成可买的完整版**——通常需要"国产数据平台 + 自建语义层 + 业务侧驻场团队"的组合，**这本质上是一个 self-built Foundry+Ontology+FDE 的工程项目**，难度极高但可行。

### 12.6 地缘政治前提

- Palantir 与美国情报、国防和情报承包业务关系紧密（CIA In-Q-Tel 早期投资、Gotham 在国防情报场景被广泛使用）。
- **Palantir 不进中国市场**，无论本土公司还是中国设立的 Palantir 实体都不存在。
- 这意味着对国内团队来说，**研究 Palantir = 研究方法论，不是研究采购选项**。这个前提应贯穿后续所有"如何落地"的讨论。

### 12.7 已公开的失败案例与争议

只讲成功故事会形成幸存者偏差，下面是几个**公开讨论过的争议/失败案例**（具体细节待后续案例研究展开）：

- **NHS（英国国家医疗服务体系）合同**：2023 年中标后被法律挑战，数据治理与中标流程在英国引发持续争论。
- **WPP / NHS COVID 数据合同**：因数据隐私问题被公开质疑。
- **JPMorgan Chase**：早期客户之一，但后续把部分能力收回自建。
- **多家欧洲客户**：因 GDPR 合规和"美国公司处理欧洲敏感数据"的政治压力而撤出或缩减。

> 推论：**Palantir 真正难的不是技术，是政治、合规和数据主权问题**。这部分在国内场景下会以另一种形式（数据出境、国产化要求）出现。

---

## 关键洞察（核心结论）

1. **Ontology 是 AI 的"入职手册"**：LLM 不了解你的业务，Ontology 给 AI 提供了完整的企业知识结构，让它从"实习生"变成"老员工"。

2. **Actions 是护城河中的护城河**：Ontology 能"读"，Actions 让它能"写"——AI 不只提建议，它能直接操作业务系统，且带完整权限和审计。

3. **"一次建模，处处复用"**：和 iOS 让 App 使用手机硬件一样，Ontology 让所有 AI 应用和业务应用共享同一套语义基础，不用每个项目重新对接数据。

4. **Human-in-the-Loop 是设计选择**：Palantir 自己的话："We don't sell autonomous driving. We sell a copilot." 建议 → 人审批 → 执行，这是刻意的。

5. **安全与治理是一等公民**：权限从数据层贯穿到 AI 层——但前提是所有数据入口都经过 Ontology 鉴权，且没有旁路数据通道。合规是架构约束不是事后补丁，但执行细节（prompt 注入防护、输出越权检查）仍需开发者负责。

---

## 参考资料

- [Palantir Ontology 官方概述](https://www.palantir.com/docs/foundry/ontology/overview)
- [Palantir Ontology 核心概念](https://www.palantir.com/docs/foundry/ontology/core-concepts)
- [Action Types 官方文档](https://www.palantir.com/docs/foundry/action-types/overview)
- [OSDK 官方文档](https://www.palantir.com/docs/foundry/ontology-sdk/overview)
- [Palantir Ontology Explained: Why It's the Operating System for Enterprise AI Agents](https://zerofuturetech.substack.com/p/palantir-ontology-explained-why-its)
