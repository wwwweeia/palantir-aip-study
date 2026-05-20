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

**Interfaces 是 2024 年引入的关键新特性**
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

