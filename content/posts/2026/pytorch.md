---
title: "PyTorch 学习"
description: "PyTorch 张量与基础用法笔记。"
date: "2026-08-05"
updated: "2026-08-05"
categories: ["AI"]
tags: ["PyTorch","AI","Notes"]
type: tech
permalink: "/pytorch"
---
## 张量（Tensor）

张量是一个多维数组，可以是标量、向量、矩阵或更高维度的数据结构。

在 PyTorch 中，张量（Tensor）是数据的核心表示形式，类似于 NumPy 的多维数组，但具有更强大的功能，例如支持 GPU 加速和自动梯度计算。

张量支持多种数据类型（整型、浮点型、布尔型等）。

张量可以存储在 CPU 或 GPU 中，GPU 张量可显著加速计算。

---

## 创建张量

张量创建的方式有：

| **方法**                            | **说明**                                               | **示例代码**                                |
| ----------------------------------- | ------------------------------------------------------ | ------------------------------------------- |
| `torch.tensor(data)`                | 从 Python 列表或 NumPy 数组创建张量。                  | `x = torch.tensor([[1, 2], [3, 4]])`        |
| `torch.zeros(size)`                 | 创建一个全为零的张量。                                 | `x = torch.zeros((2, 3))`                   |
| `torch.ones(size)`                  | 创建一个全为 1 的张量。                                | `x = torch.ones((2, 3))`                    |
| `torch.empty(size)`                 | 创建一个未初始化的张量。                               | `x = torch.empty((2, 3))`                   |
| `torch.rand(size)`                  | 创建一个服从均匀分布的随机张量，值在 `[0, 1)` 。       | `x = torch.rand((2, 3))`                    |
| `torch.randn(size)`                 | 创建一个服从正态分布的随机张量，均值为 0，标准差为 1。 | `x = torch.randn((2, 3))`                   |
| `torch.arange(start, end, step)`    | 创建一个一维序列张量，类似于 Python 的 `range` 。      | `x = torch.arange(0, 10, 2)`                |
| `torch.linspace(start, end, steps)` | 创建一个在指定范围内等间隔的序列张量。                 | `x = torch.linspace(0, 1, 5)`               |
| `torch.eye(size)`                   | 创建一个单位矩阵（对角线为 1，其他为 0）。             | `x = torch.eye(3)`                          |
| `torch.from_numpy(ndarray)`         | 将 NumPy 数组转换为张量。                              | `x = torch.from_numpy(np.array([1, 2, 3]))` |

使用 torch.tensor() 函数，你可以将一个列表或数组转换为张量：

## 实例

import torch  

tensor = torch.tensor(\[1, 2, 3\])  
print(tensor)

输出如下：

tensor([1, 2, 3])

如果你有一个 NumPy 数组，可以使用 torch.from\_numpy() 将其转换为张量：


print("Shape:", tensor\_2d.shape) # 形

---

## 张量的属性

张量的属性如下表：

| **属性**           | **说明**                         | **示例**                 |
| ------------------ | -------------------------------- | ------------------------ |
| `.shape`           | 获取张量的形状                   | `tensor.shape`           |
| `.size()`          | 获取张量的形状                   | `tensor.size()`          |
| `.dtype`           | 获取张量的数据类型               | `tensor.dtype`           |
| `.device`          | 查看张量所在的设备 (CPU/GPU)     | `tensor.device`          |
| `.dim()`           | 获取张量的维度数                 | `tensor.dim()`           |
| `.requires_grad`   | 是否启用梯度计算                 | `tensor.requires_grad`   |
| `.numel()`         | 获取张量中的元素总数             | `tensor.numel()`         |
| `.is_cuda`         | 检查张量是否在 GPU 上            | `tensor.is_cuda`         |
| `.T`               | 获取张量的转置（适用于 2D 张量） | `tensor.T`               |
| `.item()`          | 获取单元素张量的值               | `tensor.item()`          |
| `.is_contiguous()` | 检查张量是否连续存储             | `tensor.is_contiguous()` |

---

## 张量的操作

#### 基础操作：

| **操作**                | **说明**                       | **示例代码**                  |
| ----------------------- | ------------------------------ | ----------------------------- |
| `+`, `-`, `*`, `/`      | 元素级加法、减法、乘法、除法。 | `z = x + y`                   |
| `torch.matmul(x, y)`    | 矩阵乘法。                     | `z = torch.matmul(x, y)`      |
| `torch.dot(x, y)`       | 向量点积（仅适用于 1D 张量）。 | `z = torch.dot(x, y)`         |
| `torch.sum(x)`          | 求和。                         | `z = torch.sum(x)`            |
| `torch.mean(x)`         | 求均值。                       | `z = torch.mean(x)`           |
| `torch.max(x)`          | 求最大值。                     | `z = torch.max(x)`            |
| `torch.min(x)`          | 求最小值。                     | `z = torch.min(x)`            |
| `torch.argmax(x, dim)`  | 返回最大值的索引（指定维度）。 | `z = torch.argmax(x, dim=1)`  |
| `torch.softmax(x, dim)` | 计算 softmax（指定维度）。     | `z = torch.softmax(x, dim=1)` |

#### 形状操作

| **操作**                 | **说明**                       | **示例代码**                   |
| ------------------------ | ------------------------------ | ------------------------------ |
| `x.view(shape)`          | 改变张量的形状（不改变数据）。 | `z = x.view(3, 4)`             |
| `x.reshape(shape)`       | 类似于 `view` ，但更灵活。     | `z = x.reshape(3, 4)`          |
| `x.t()`                  | 转置矩阵。                     | `z = x.t()`                    |
| `x.unsqueeze(dim)`       | 在指定维度添加一个维度。       | `z = x.unsqueeze(0)`           |
| `x.squeeze(dim)`         | 去掉指定维度为 1 的维度。      | `z = x.squeeze(0)`             |
| `torch.cat((x, y), dim)` | 按指定维度连接多个张量。       | `z = torch.cat((x, y), dim=1)` |

---

## 张量的 GPU 加速

将张量转移到 GPU：

```
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
x = torch.tensor([1.0, 2.0, 3.0], device=device)
```

检查 GPU 是否可用：

```
torch.cuda.is_available()  # 返回 True 或 False
```

---

## 张量与 NumPy 的互操作

张量与 NumPy 的互操作如下表所示：

| **操作**                    | **说明**                                   |           **示例代码**           |
| --------------------------- | ------------------------------------------ | :------------------------------: |
| `torch.from_numpy(ndarray)` | 将 NumPy 数组转换为张量。                  | `x = torch.from_numpy(np_array)` |
| `x.numpy()`                 | 将张量转换为 NumPy 数组（仅限 CPU 张量）。 |       np_array = x.numpy()       |

