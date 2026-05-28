# Hack The Box · Misc 两题速记

最近顺手做了两道很适合拿来练自动化思路的 Misc 题。题本身不算特别绕，但都很适合提醒自己一句话：能脚本化的事情，尽量不要手点。

## 1. Character

这题的交互非常直接：服务端一次只返回 `flag` 的一个字符。思路可以拆成三步：

1. 先不断递增 `index`，确认 `flag` 的总长度。
2. 再从 `0` 遍历到 `len - 1`，逐个拿字符。
3. 最后把字符拼起来，得到完整 `flag`。

手动一个个输当然也能做，但实在太慢，所以直接写脚本自动化。

```python
import socket
import re

HOST = "154.57.164.81"
PORT = 31853

def get_char(index):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(5)
    s.connect((HOST, PORT))
    s.recv(4096)  # 吞掉提示
    s.sendall(f"{index}\n".encode())
    data = s.recv(4096)
    s.close()
    return data.decode(errors='ignore')

def main():
    flag = ""
    for i in range(200):
        resp = get_char(i)

        if "Index out of range" in resp:
            print(f"[!] 终止于 index={i}")
            break

        m = re.search(r"Character at Index \d+: (.)", resp)
        if m:
            flag += m.group(1)
            print(f"[{i:03d}] {m.group(1)}  -> {flag}")

    print(f"\n{'=' * 50}")
    print(f"FLAG: {flag}")
    print(f"{'=' * 50}")

if __name__ == "__main__":
    main()
```

最后拿到的 `flag`：

```text
HTB{tH1s_1s_4_r3aLly_l0nG_fL4g_i_h0p3_f0r_y0Ur_s4k3_tH4t_y0U_sCr1pTEd_tH1s_oR_elS3_iT_t0oK_qU1t3_l0ng!!}
```

`flag` 长度一共是 **104 个字符**，对应 `index 0 ~ 103`。

## 2. Stop Drop and Roll

这题更像一个文字小游戏，本质还是 socket 自动化。

### 游戏规则

| 输入 | 输出 |
| --- | --- |
| `GORGE` | `STOP` |
| `PHREAK` | `DROP` |
| `FIRE` | `ROLL` |

如果一轮里出现多个词，就按顺序映射后用 `-` 连接。比如：

```text
GORGE, FIRE, PHREAK -> STOP-ROLL-DROP
```

同样直接写脚本自动打。

```python
import socket
import re
import time

HOST = "154.57.164.77"
PORT = 30123

MAP = {
    "GORGE": "STOP",
    "PHREAK": "DROP",
    "FIRE": "ROLL",
}

def recv_until(s, marker, timeout=10):
    """接收数据直到出现 marker"""
    s.settimeout(timeout)
    buf = ""
    while marker not in buf:
        try:
            chunk = s.recv(4096).decode(errors='ignore')
            if not chunk:
                break
            buf += chunk
        except socket.timeout:
            break
    return buf

def main():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((HOST, PORT))

    data = recv_until(s, "ready? (y/n)")
    print(data, end='')

    s.sendall(b"y\n")

    time.sleep(0.3)
    data = recv_until(s, "What do you do?", timeout=5)
    print(data, end='')

    round_count = 0
    while True:
        if re.search(r'HTB\{|htb\{', data):
            print("\n🎀 FLAG FOUND!")
            break

        if "What do you do?" not in data:
            extra = recv_until(s, "What do you do?", timeout=3)
            data += extra
            print(extra, end='')
            if "What do you do?" not in data:
                print("[!] 意外数据:", data)
                break

        for line in data.split('\n'):
            if any(k in line for k in MAP):
                scenarios = [w.strip() for w in line.split(',')]
                answer = '-'.join(MAP[s] for s in scenarios if s in MAP)
                print(f" -> {answer}")
                s.sendall(f"{answer}\n".encode())
                round_count += 1
                break

        time.sleep(0.2)
        data = recv_until(s, "What do you do?", timeout=5)
        print(data, end='')

    try:
        s.settimeout(2)
        remaining = s.recv(4096).decode(errors='ignore')
        print(remaining)
    except:
        pass

    s.close()
    print(f"\n完成 {round_count} 轮")

if __name__ == "__main__":
    main()
```

脚本大概跑了两分钟，最后成功打完 500 轮：

```text
Fantastic work! The flag is HTB{1_wiLl_sT0p_dR0p_4nD_r0Ll_mY_w4Y_oUt!}
🎀 FLAG FOUND!
完成 500 轮
```

## 小结

这两题都不复杂，但都很适合练一个意识：

- 面对重复交互，先想能不能脚本化。
- 先把规则抽象出来，再去写自动化。
- 自动化不只是为了省时间，也能减少手动操作带来的低级失误。
