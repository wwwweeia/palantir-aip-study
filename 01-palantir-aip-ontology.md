# Palantir AIP Ontology 深析

> 来源：官方文档 + 微信图解 + 研究文章（2026-05-20 更新）
> 参考：[Palantir 官方 Ontology 文档](https://www.palantir.com/docs/foundry/ontology/overview) | [Ontology Explained](https://zerofuturetech.substack.com/p/palantir-ontology-explained-why-its)

---

## 一句话定义

> **Palantir Ontology 是企业的数字孪生——一个活的、可操作的语义层，让人和 AI 都能理解、查询、并直接操作企业业务世界。**

官方原话：
> "The Foundry Ontology is the digital twin of an organization, a rich semantic layer that sits on top of the digital assets integrated into Foundry."

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

2024年引入的重要特性，类似 OOP 中的接口/抽象类。

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

> 当配置了 Function-backed Rule 时，其他 Rule 不能共存——Function 可以完成一切其他 Rule 能做的事，且能处理任意复杂逻辑。

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

**关键设计**：AI 只能看到人能看到的数据——权限贯穿从数据层到 AI 层。

---

## 7. OAG：Ontology 如何改变 AI 的检索方式

RAG（检索增强生成）是目前主流做法，OAG（Ontology 增强生成）是 Palantir 的进阶版本。

### RAG vs OAG 对比

| 维度 | RAG | OAG |
|------|-----|-----|
| 检索对象 | 文本片段 | 结构化业务对象 + 实时关联关系 |
| 结果质量 | LLM 拼凑，可能幻觉 | 确定性匹配，grounded in live data |
| 后续动作 | 仅输出文字建议 | 可直接触发 Action（审批/创建工单/发通知） |
| 可信度 | 依赖模型 | 数据来自真实系统，权限受控 |

### 真实场景：供应链中断

**手动方式**：检查 20 个系统，拼凑数据，写报告 → 3-5 天

**OAG + AIP 方式**（15分钟，5步）：
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

| 技术 | 相似点 | 关键差距 |
|------|--------|---------|
| 知识图谱（Neo4j） | 实体+关系建模 | 没有 Action 层，纯"读"不"写" |
| 数据仓库 | 存储+查询 | 无语义，无关联，AI 看不懂 |
| ORM（Hibernate） | 对象化数据访问 | 无关系语义，无权限，无 AI 集成 |
| RAG | AI + 企业知识 | 只查文本，不能操作业务系统 |
| **Palantir Ontology** | **以上都有** | **Objects + Links + Actions + Functions + 权限 全部一体化** |

---

## 关键洞察（核心结论）

1. **Ontology 是 AI 的"入职手册"**：LLM 不了解你的业务，Ontology 给 AI 提供了完整的企业知识结构，让它从"实习生"变成"老员工"。

2. **Actions 是护城河中的护城河**：Ontology 能"读"，Actions 让它能"写"——AI 不只提建议，它能直接操作业务系统，且带完整权限和审计。

3. **"一次建模，处处复用"**：和 iOS 让 App 使用手机硬件一样，Ontology 让所有 AI 应用和业务应用共享同一套语义基础，不用每个项目重新对接数据。

4. **Human-in-the-Loop 是设计选择**：Palantir 自己的话："We don't sell autonomous driving. We sell a copilot." 建议 → 人审批 → 执行，这是刻意的。

5. **安全与治理是一等公民**：权限从数据层贯穿到 AI 层，AI 看不到人看不到的数据，企业合规不是事后补丁。

---

## 参考资料

- [Palantir Ontology 官方概述](https://www.palantir.com/docs/foundry/ontology/overview)
- [Palantir Ontology 核心概念](https://www.palantir.com/docs/foundry/ontology/core-concepts)
- [Action Types 官方文档](https://www.palantir.com/docs/foundry/action-types/overview)
- [OSDK 官方文档](https://www.palantir.com/docs/foundry/ontology-sdk/overview)
- [Palantir Ontology Explained: Why It's the Operating System for Enterprise AI Agents](https://zerofuturetech.substack.com/p/palantir-ontology-explained-why-its)
