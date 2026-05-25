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
