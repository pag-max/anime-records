# 娱乐记录本 (anime-records)

追番 / 追漫的本地记录本。分类 → 分组 → 条目三层结构，支持评分、进度、外链。

![tech](https://img.shields.io/badge/Electron-31-47848F) ![license](https://img.shields.io/badge/license-MIT-blue)

## 功能

- 三层结构：分类（`cats`）→ 分组（`groups`）→ 条目（`items`）
- 条目支持：名称、封面、集数进度、评分、状态、备注、外部链接
- 封面网格视图，支持拖拽排序
- 数据全本地：一个 `records.json` 走天下，支持导出导入

## 运行

```bash
npm install
npm start
```

## 数据结构

见 `records.example.json`。字段含义：

| 字段 | 类型 | 说明 |
|---|---|---|
| `cats` | array | 分类，如「番剧」「漫画」 |
| `groups` | array | 分组，归属某个分类 |
| `items` | array | 条目，归属某个分组 |
| `links` | array | 条目关联的外部链接 |
| `removedCats` | array | 已删除分类的墓碑，用于同步 |

## 数据存放

与 `exam-records` 相同的四级兜底策略（环境变量 → 便携版真实目录 → exe 上一级 → userData）。
