## mysql 考核总结

### 1. 表设计

- id
一般设置为自增主键，数据类型为BIGINT, 且不为空, BIGINT 可以存储更大的数据，且占用空间更小, NOT NULL 表示该字段不能为空, PRIMARY KEY 表示该字段为主键, AUTO_INCREMENT 表示该字段自增. id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT
- 索引
 索引是提高查询效率的重要手段，但并不是越多越好，索引的建立需要根据查询条件来建立，而不是盲目建立。且索引一般放到建表最后

### 2. 表修改字段

- 新增字段
ALTER TABLE table_name ADD COLUMN column_name data_type;
- 修改字段
ALTER TABLE table_name MODIFY COLUMN column_name data_type;
- 删除字段
ALTER TABLE table_name DROP COLUMN column_name;

### 3. 表插入值

INSERT INTO table_name (column1, column2, column3, ...) VALUES (value1, value2, value3, ...);

### 4. 考核题目

用户相关查询

1. 用户数据分析
查询最活跃用户 TOP 10 (综合发帖数、评论数、获赞数等维度,计算活跃度)
2. 热门文章分析
统计过去30天内的热门文章(根据浏览量、评论数、点赞数等多维度加权计算)
3. 文章互动分析
查询评论回复层级最深的文章(需要递归统计评论的父子关系深度)
4. 用户行为分析
统计每个用户平均获得的评论数和互动率(评论数/文章数)
5. 时间维度分析
按月统计网站的内容增长情况(新增用户数、文章数、评论数等)
6. 用户关系网络
查找二度好友关系(找出与我的好友有互动的其他用户)
7. 内容推荐分析
基于用户最近浏览/评论/点赞的文章标签,推荐相似文章
8. 活跃度趋势
统计用户连续活跃天数(发帖或评论视为活跃)
9. 互动质量分析
统计平均每篇文章的有效评论数(排除垃圾评论)和评论字数
10. 用户画像分析
基于用户的发帖时间、文章类型、互动对象等数据,分析用户画像特征
这些复杂查询涉及多表关联、子查询、窗口函数、递归等高级 SQL 特性,能够帮助我们深入分析博客系统的运营数据。

### 操作总结

1. 多个sum(),要分别操作后，才可以进行计算

```
SELECT 
SUM(views) * 0.1 + SUM(comments) * 1.5 + SUM(likes) * 1.0 AS total_heat_score
FROM 
    blog;
```

2. 在建立表时，可以对某个属性添加comment(注释说明)
3. 对已建立的表添加新属性，使用ALTER TABLE table_name ADD COLUMN column_name data_type;
4. 使用了聚合函数，必须使用GROUP BY,聚合函数包含SUM(),AVG(),MAX(),MIN(),COUNT()，
5. 使用窗口函数，必须使用ORDER BY,窗口函数包含ROW_NUMBER(),RANK(),DENSE_RANK(),LAG(),LEAD()
