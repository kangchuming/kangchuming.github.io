### 前端接口传参：query vs body

基于示例对比：
- 方式一（Body）：
```ts
  public static postAnswerRecordUserCourse(
    quizAnswerRecordUserCourseParam: QuizAnswerRecordUserCourseParam,
  ): Promise<UserCourseResult_userCourseDTO_[]> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/tiku-service/quiz/answer/record/get/userCourse',
      body: quizAnswerRecordUserCourseParam,
    });
  }
});
```
```ts 
// body传参
  const getUserCourse = async (quizId: number, userId: string) => {
    try {
      const requestParams = {
        quizId,
        userId,
      };
      const res = await TikuManager.postAnswerRecordUserCourse(requestParams);
      if (res === undefined) {
        setCourseList([]);
      } else {
```

- 方式二（Query）：
```ts
  public static postAnswerRecordUserCourse(
    quizId: number,
    userId: string,
  ): Promise<UserCourseResult_userCourseDTO_[]> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/tiku-service/quiz/answer/record/get/userCourse',
      query: {
        quizId: quizId,
        userId: userId,
      },
    });
  }
```
```ts
// query使用
  const getUserCourse = async (quizId: number, userId: string) => {
    try {
      const res = await TikuManager.postAnswerRecordUserCourse(quizId, userId);
      if (res === undefined) {
        setCourseList([]);
      } else {
```

## 一、query 与 body 的定位
- query（URL 查询参数）
  - 放在 URL 上：`/path?quizId=1&userId=xxx`
  - 适合筛选、分页、排序等“定位/过滤”类轻量参数
  - 天然可缓存、可书签、易于日志排查
- body（请求体）
  - 放在 HTTP 报文体中
  - 适合结构化/复杂/体积较大的数据
  - 常用于新增、修改等需要提交实体数据的场景

## 二、常见搭配
- GET + query：查询、列表、筛选
- POST + body：创建、复杂查询（参数多/结构嵌套）
- POST + query：少见，不推荐；偶见用于简单开关或历史包袱

## 三、选择准则（实用）
- 参数是否需要被“直观展示/复现”（URL 共享、可回放）→ query
- 参数是否复杂、数量多、含对象数组/文件 → body
- 是否依赖缓存/CDN（GET+query 更友好）→ query
- 是否涉及敏感数据（URL 可能落日志）→ 优先 body
- 是否有长度限制（URL 有限制）→ body

## 四、服务端约定与规范
- 明确接口契约：参数放哪，类型是什么（OpenAPI/TS类型）
- POST 场景下尽量放 body，避免 query/ body 混用增加心智负担
- Content-Type：
  - JSON：`application/json`
  - 表单：`application/x-www-form-urlencoded` 或 `multipart/form-data`（上传）

## 五、错误与排查建议
- 传参位置对不上（后端读 body，你却发 query）→ 400/参数缺失
- 缺少 Content-Type → 读取失败
- URL 过长（query 参数过多）→ 浏览器/网关限制
- 敏感信息泄露（query 会写入日志/浏览器历史）→ 改用 body

## 六、简要结论
- 查询/过滤、小而轻且需可复现 → 用 query
- 提交实体/复杂结构/较大体积/敏感数据 → 用 body
- POST 请求优先 body；GET 请求用 query 更自然

以上规则落地后，可避免“POST 却用 query”的混乱与隐患，提高接口一致性与可维护性。