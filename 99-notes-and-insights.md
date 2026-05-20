# 碎片洞察与问题记录

> 学习过程中随时记录的想法、疑问、灵感

---

## 2026-05-20

### 两张图的核心信息

**图1：Palantir AIP Ontology**
- 结构：对象（名词）+ 关系（连接）+ 行动（可执行操作）
- 评论里写"有点像知识图谱里的三元组"——准确，但 Actions 才是真正的差异点
- 完整链路：多源数据 → Foundry → Ontology → AI 应用层（Chatbot/Agent/Workshop）

**图2：FDE（Forward Deployed Engineer）**
- 核心定位：驻场工程师，填补产品与客户之间的鸿沟
- 四种身份：技术专家 + 客户伙伴 + 问题解决者 + 推动者
- 五步流程：调研 → 设计 → 实施 → 部署 → 持续优化

### 初步洞察

1. Palantir 的护城河不是大模型，而是**Ontology + FDE 的组合**——这两件事大模型厂商做不了，因为需要深度嵌入客户业务。

2. OntoFlow（上一篇微信文章）想做的事和 Palantir 非常相似，但走"1人业务+1人开发"的轻量路线，能否真正替代 FDE 模式？这是个值得追问的问题。

3. **"AI 落地失败"很少是技术问题**：数据不通、语义不对、没人推、业务不信——这些才是主因。Ontology + FDE 正是在解决这些非技术问题。

---

---

## 2026-05-20（深度研究 Ontology 后）

### 重要的新发现

**Interfaces 于 2024-08-27 以 Beta 形式发布**（[官方公告](https://palantir.com/docs/foundry/announcements/2024-08/)），是 Ontology 多态性的关键支撑。
- 类似 OOP 里的接口/抽象类，提供跨 Object Type 的多态性
- 实际价值：一个 Action 可以同时作用于多种对象类型，AI Agent 查询时不需要知道具体类型
- 这对建模复杂业务域（如各类工单、各类审批）非常有价值

**Functions 是被低估的组件**
- 图解里没有突出，但实际上 Functions 是 Ontology 的"大脑"
- 它用代码（TypeScript/Python）封装复杂业务逻辑，既可以做计算，也可以作为 Action 的执行引擎
- AIP Logic 中的 AI 推理节点本质上就是在 Functions 里调用 LLM

**OAG vs RAG 的核心差异**
- RAG：检索文本 → LLM 生成文字答案 → 人再去手动执行
- OAG：查询业务对象 → 确定性匹配 → 直接触发 Action 执行
- 简单说：RAG 是"AI 告诉你该怎么做"，OAG 是"AI 替你做了"

**权限是从底层设计进去的，不是补丁**
- 数据层权限 → Ontology 权限 → OSDK Token 权限，三层叠加
- AI 看不到人看不到的数据——这不是口号，是架构约束
- 这对企业安全合规至关重要，也是很多国产平台的短板

### 产生的新问题

- [ ] Palantir Ontology 和 W3C OWL/RDF 标准本体的关系？Palantir 是否与标准兼容？
- [ ] Functions 的性能上限是什么？大规模 Object Set 计算会不会成为瓶颈？
- [ ] Derived Properties 是实时计算还是预计算？对查询性能的影响？
- [ ] OSDK 的 Token 权限和企业 SSO/LDAP 怎么集成？

---

## 2026-05-20（第二轮独立审视后的修订）

### 触发动机

第一轮笔记完成后做了一次独立研究者视角的批判性审视，识别出三类问题：
1. **概念框架缺失**：Foundry / Ontology / AIP 三者层级关系没讲透，全文出现"Palantir AIP Ontology"这种不严谨的叠加叫法
2. **追捧倾向**：几乎全是 Palantir 视角的赞美，缺少商业批评、锁定效应、FDE 模式局限、真正的替代方案对比
3. **若干事实性细节缺乏出处**：Interfaces 引入时间、Function-backed Rule 的互斥规则、Functions 多语言体系归属、OSDK Python API 形态

### 本轮修正动作

- README 顶部新增"研究前提"：明确 Palantir 不进中国市场、本研究目的是方法论借鉴
- 01 新增 §"前置澄清：Foundry / Ontology / AIP 是三层不同的东西"，钉死三者层级
- 01 新增 §12"局限、批评与替代方案"：商业模式批评、锁定效应、FDE 模式演变、OAG 相对性、Databricks/Fabric/Snowflake/开源/国产方案对比表、地缘政治前提、公开争议案例
- 01 §3 / §4 / §5 / §6 / §7 / §8 多处增加 `[待核实]` 标注或精确化表述（OAG 不是官方术语、AI 看不到人看不到的数据软化为工程化表达等）

### 衍生的新追问（留待后续阶段处理）

- [ ] Palantir 价格区间的可信公开数据来源（年报、招股书、媒体披露），用作 §12.1 的引用证据
- [ ] FDE 模式在 Palantir 内部正在如何被 AIP/OSDK 替代——是否有官方表态或财报口径变化
- [ ] 国内"自建 Foundry+Ontology+FDE"的工程项目，现实成本与人力投入估算
- [ ] §12.7 列出的 NHS / JPM 案例的具体争议细节与时间线（用于 03 文档的失败案例展开）

---

## 2026-05-20（D1 深化：FDE 演变弧线与中国移植分析）

### 核心新洞察

**FDE 的内嵌矛盾**：越优秀的 FDE 越难复制——判断力和信任资本天然无法转移。这不是可以靠流程优化解决的问题，而是人力密集型模式的结构性上限。

**知识晶体化路径**：FDE 的真正价值不是"完成工作"，而是"把工作变成工具"。每一个被产品化的 FDE 经验，都降低了未来的 FDE 依赖度。这个反馈回路是 Palantir 商业模式的护城河，也是它能规模化增长的底层逻辑。

**中国移植的核心障碍**：不是技术栈，不是成本，而是**采购目标的根本差异**——"建能力" vs "买交付物"。这个差异在合同签订那一刻就已经决定了后续会走向哪种变形。

### 从 02 文档迁入的追问（原"待深入"节）

- [ ] Palantir FDE 的选拔标准和培养路径（偏百科，优先级低）
- [ ] FDE 与 CSM（客户成功经理）的协作模式（偏百科，优先级低）
- [ ] 国内有哪些公司在践行类似的"嵌入式工程师"模式（D1 收尾时值得做一次 tavily-search）

### D1 新产生的追问

- [ ] Palantir 是否公开过 FDE 人力/客户比？从财报看 FDE 密度的变化趋势（可用于验证"FDE 占比在下降"的推论）
- [x] AIP Assist 的当前能力边界：**已确认**——它是 LLM 驱动的文档/平台导航助手，能回答 Foundry 使用问题，支持上下文感知（知道你在哪个应用），可添加自定义文档源。但它**不能操作 Ontology**（官方文档明确"does not access your data"），不替代 FDE 的建模和集成工作。来源：[官方 AIP Assist 文档](https://palantir.com/docs/foundry/assist/overview/)
- [ ] 变形 1（驻场外包）的退出机制：什么合同结构能从源头防止这种退化？

---

## 2026-05-20（D2 深化：非 Palantir 路径 + 规模化坑 + 行业视角）

### 核心新洞察

**"胶水层"是开源替代方案的真实成本**：每一层（语义/操作/治理）单独都可以找到 80% 的替代品，但 Palantir 的价值正在于三层的一体化——权限、可见性、Action 在同一系统里保持一致。开源路线省许可费，花的是工程时间和集成复杂度，没有免费午餐。

**最难复制的是治理层的"架构保证"**：开源方案的权限控制是"人工约定"，Palantir 是"系统保证"。这个差异在 POC 阶段看不出来，规模化后会成为最大的隐患。

**行业差异的本质是"谁拥有推动权"**：制造的障碍是 OT 系统；金融的障碍是合规要求；政务的障碍是数据权属。三个行业的 AI 落地失败，表面原因不同，深层都是"技术问题之外的组织/权力问题"。

### 从 03 文档迁入的追问（原"待展开"节）

- [ ] Ontology 建模的实操步骤（偏百科，优先级低）
- [ ] 如何评估一个 AI 落地项目的 ROI（通用方法论，去掉 Palantir 三字也成立，优先级低）

### D2 新产生的追问

- [ ] dbt Semantic Layer 和 LlamaIndex Knowledge Graph 的实际集成案例：有没有人真的用这两个搭出了"业务对象"层？
- [x] Dify 当前版本的工具调用能力边界：**已确认支持 HITL**——v1.13.0（2026-03-03）引入 Human Input 节点，工作流可暂停等待人工审批/修改/转发。来源：[Dify 官方博客](https://dify.ai/blog/the-human-input-node-bringing-human-judgment-into-automated-workflows)
- [ ] 制造业 OT/IT 融合的主流解法：Kepware / OPC-UA 这类协议网关在国内的实际落地情况
- [ ] 政务联邦学习的落地案例：国内有没有真实的跨部门联邦学习实施，不只是 POC？（用于 03 的落地建议）

---

## 2026-05-20（Q1/Q2/Q3 质量修订）

### 本次修订内容

**02-FDE 前半升级（路线 B）**：
- "FDE 如何开展工作" → 重写为"四个身份为什么缺一不可"，用逆向拆解表格替代 ASCII 图
- "典型工作流程" → 保留骨架，核心改为"FDE 特有的是步骤之间的双轨判断密度"
- 删除"FDE 为客户创造的价值"节（销售 PPT 语言，无分析价值）
- "FDE 适合场景" → 改写为"FDE 不适合的场景"（边界比范围更有意义）
- 顶部加"阅读前提"承接句（02 = 让 Ontology 语义层在组织里活起来的角色）

**03-落地 Step 3 升级**：
- 用制造业物料追踪具体场景，对比"传统 SQL 表 vs Ontology 关系显式化"的差异
- 让读者理解 Ontology 为什么能让 AI"理解业务上下文"而不只是查数据
- 顶部加"阅读前提"承接句（03 = 没有 Palantir 的团队能拼出类似路径吗？坑在哪？）

### 修订产生的洞察

**"拆掉身份法"是理解复合角色的有效框架**：不问"这个角色有什么能力"，而问"缺掉任意一个能力后会退化成什么"——退化终态就是"客户已有的替代品"，这才能说清楚为什么需要这个新角色。这个思路可以复用到任何"复合型岗位"的分析上。

**Ontology 的核心价值在关系显式化，不在数据建模**：SQL 表也是数据建模，差异在于 Ontology 把"业务实体之间的关联"提升为一等公民——AI 沿关系遍历，不需要人工写查询逻辑。这个具体化之后，"为什么 Ontology 让 AI 理解业务"就不再是抽象说法了。

---

## 2026-05-20（D3：04 行动指南初版）

### 核心洞察

**"你的场景配不配得上这个复杂度"比"能不能搭"更重要**：Palantir 范式的三层一体化确实可以拼出 70-80%，但大多数团队的真实需求其实是 RAG + 工作流就够了。过早追求"Ontology 级"的架构，是在为不需要的复杂度买单。

**三档路径的核心判断维度不是技术，是组织和场景**：数据复杂度、场景需求、组织成熟度——三个维度任一达到"中"就需要升级路径。其中"组织成熟度"（有没有桥梁角色）是最容易被忽视的。

**"谁来建模"是路径 B/C 的生死线**：语义建模不是 DBA 建表，是业务翻译。没有桥梁角色就不要走路径 B。

### 新产生的追问

- [ ] 三档路径的"撞墙信号"需要实际案例验证——有没有团队在路径 A 撞墙后成功升级到路径 B 的公开经验？
- [ ] 国内 DataHub / dbt Semantic Layer 的实际落地案例——有没有企业真的用它做了"业务对象"层？`[待核实]`（搜索未找到公开案例，可能需要社区渠道打听）
- [ ] 路径 B 的"最小拼法"工具链成本估算需要更精确——3-6 人月是粗略判断，实际取决于数据源数量和治理复杂度

---

## 2026-05-20（Q4 事实核实）

### 核实结论

| 问题 | 结果 | 来源 |
|------|------|------|
| Interfaces 引入时间 | 2024-08-27 Beta 发布 | [官方公告 2024-08](https://palantir.com/docs/foundry/announcements/2024-08/) |
| Function-backed Rule 互斥 | 官方确认："a function rule cannot be combined with other Ontology rules" | [官方文档](https://palantir.com/docs/foundry/action-types/function-actions-getting-started/) |
| Functions 多语言体系 | 概念统一（TS v1/v2 + Python），但特性支持不同 | [官方文档](https://palantir.com/docs/foundry/functions/language-feature-support/) |
| OSDK Python API 形态 | `client.ontology.objects.Type.where(Type.object_type.prop == value)` | [官方文档](https://palantir.com/docs/foundry/ontology-sdk/python-osdk/) |
| AIP Assist 能力边界 | 文档/平台导航助手，不操作 Ontology，不替代 FDE | [官方文档](https://palantir.com/docs/foundry/assist/overview/) |
| Dify HITL 支持 | v1.13.0（2026-03-03）引入 Human Input 节点 | [官方博客](https://dify.ai/blog/the-human-input-node-bringing-human-judgment-into-automated-workflows) |
| FDE 演变阶段时间节点 | **未核实**：无公开资料精确划分 | — |
| 国内 DataHub/dbt 落地案例 | **未核实**：搜索无果 | — |