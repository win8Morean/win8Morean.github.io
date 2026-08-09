---
title: "PHP 学习"
description: "PHP 基础语法与常用写法笔记。"
date: "2026-07-17"
updated: "2026-07-17"
categories: ["Web"]
tags: ["PHP","Notes"]
type: tech
permalink: "/php-学习"
---
---

### 一、基本语法

#### PHP 标签

PHP 脚本以 `<?php` 开始，以 `?>` 结束，可以放在文档中的任何位置。文件默认扩展名为 `.php`。

```php
<?php
// PHP 代码
?>
```

> 纯 PHP 文件建议省略结尾 `?>`，避免意外输出空白字符。

#### 输出内容

两种基础输出指令：

```php
<?php
echo "Hello World";        // 可输出多个参数，无返回值
print "Hello World";       // 只能输出一个参数，返回 1
?>
```

#### 语句分隔

每条语句末尾必须以分号 `;` 结束。

```php
<?php
$x = 1;
$y = 2;
echo $x + $y;
?>
```

---

### 二、变量与数据类型

#### 变量

变量以 `$` 开头，区分大小写，无需声明类型。

```php
<?php
$name = "Alice";
$age  = 25;
$pi   = 3.14;
?>
```

#### 作用域

- **局部变量**：函数内部声明，仅函数内可访问
- **全局变量**：函数外声明，函数内需用 `global` 关键字或 `$GLOBALS` 数组访问
- **静态变量**：`static $x = 0;` — 函数调用结束后不销毁

```php
<?php
$x = 10;                   // 全局

function test() {
    global $x;             // 引入全局变量
    static $count = 0;     // 静态变量
    $count++;
    echo $x + $count;
}
?>
```

#### 数据类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `string` | 字符串 | `"hello"` |
| `int` | 整数 | `42` |
| `float` | 浮点数 | `3.14` |
| `bool` | 布尔值 | `true` / `false` |
| `array` | 数组 | `[1, 2, 3]` |
| `object` | 对象 | `new Foo()` |
| `null` | 空值 | `null` |
| `callable` | 可调用 | 回调函数 |
| `resource` | 资源 | 文件句柄等 |

#### 常量

```php
<?php
define("SITE_NAME", "My Blog");           // 传统方式
const VERSION = "2.0";                    // 编译时定义（更快）

echo SITE_NAME;
?>
```

#### 魔术常量

| 常量 | 含义 |
|------|------|
| `__LINE__` | 当前行号 |
| `__FILE__` | 文件完整路径 |
| `__DIR__` | 文件所在目录 |
| `__FUNCTION__` | 当前函数名 |
| `__CLASS__` | 当前类名 |
| `__METHOD__` | 当前方法名 |
| `__NAMESPACE__` | 当前命名空间 |

---

### 三、运算符

#### 算术运算符

`+` `-` `*` `/` `%` `**`（乘方）

#### 赋值运算符

`=` `+=` `-=` `*=` `/=` `%=` `.=`（字符串拼接赋值）

#### 比较运算符

| 运算符 | 含义 |
|--------|------|
| `==` | 等于（值相等） |
| `===` | 全等（值与类型均相等） |
| `!=` / `<>` | 不等于 |
| `!==` | 不全等 |
| `>` / `<` | 大于 / 小于 |
| `>=` / `<=` | 大于等于 / 小于等于 |
| `<=>` | 太空船（返回 -1/0/1） |

#### 逻辑运算符

`&&` / `and`、`||` / `or`、`!`、`xor`

#### 字符串运算符

`.` 拼接、`.=` 拼接赋值

#### 三元与空合并

```php
<?php
$result = $x > 0 ? "positive" : "non-positive";   // 三元
$name   = $_GET["name"] ?? "default";              // null 合并（PHP 7+）
$name   = $_GET["name"] ?: "default";              // 短路三元（falsy 时取默认）
?>
```

---

### 四、控制结构

#### 条件语句

```php
<?php
// if / elseif / else
if ($a > $b) {
    echo "a > b";
} elseif ($a == $b) {
    echo "a == b";
} else {
    echo "a < b";
}

// switch
switch ($color) {
    case "red":
        echo "红色";
        break;
    case "blue":
        echo "蓝色";
        break;
    default:
        echo "其他颜色";
}

// match（PHP 8.0+，严格比较，返回结果）
$result = match($code) {
    200     => "OK",
    404     => "Not Found",
    default => "Unknown",
};
?>
```

#### 循环

```php
<?php
// while
$i = 0;
while ($i < 5) { echo $i; $i++; }

// do...while
$i = 0;
do { echo $i; $i++; } while ($i < 5);

// for
for ($i = 0; $i < 5; $i++) { echo $i; }

// foreach（遍历数组/对象）
foreach ($arr as $value) { echo $value; }
foreach ($arr as $key => $value) { echo "$key: $value"; }
?>
```

#### 跳转语句

- `break` — 跳出循环/switch
- `continue` — 跳过本次循环剩余代码
- `return` — 终止函数并返回值
- `goto` — 跳转到指定标签（不推荐）

---

### 五、注释

#### 单行注释

```php
<?php
// 这是单行注释
echo "Hello"; // 也可以放在语句后面

# 这是另一种单行注释
echo "World";
?>
```

#### 多行注释

```php
<?php
/*
这是多行注释
可以写多行文字
不会被执行
*/
echo "PHP";
?>
```

#### 文档注释（DocBlock）

用于生成 API 文档，配合 IDE 或 phpDocumentor 使用。

```php
<?php
/**
 * 打印问候语
 *
 * @param string $name 用户名
 * @return string 返回问候语
 */
function sayHello($name) {
    return "Hello, $name!";
}
?>
```

| 用途 | 推荐形式 | 示例 |
|------|----------|------|
| 简单说明一行 | `//` 或 `#` | `// 输出信息` |
| 说明代码块 | `/* ... */` | 逻辑分块注释 |
| 函数/类文档 | `/** ... */` DocBlock | `@param` `@return` `@var` `@author` |

---

### 六、字符串

```php
<?php
// 单引号：不解析变量、转义字符
$s1 = 'Hello $name';        // 输出: Hello $name

// 双引号：解析变量和转义字符
$s2 = "Hello $name";        // 输出: Hello Alice
$s3 = "Hello {$name}s";     // 花括号明确变量边界

// Heredoc（类似双引号）
$s4 = <<<EOT
多行字符串，解析 {$name}
EOT;

// Nowdoc（类似单引号，PHP 5.3+）
$s5 = <<<'EOT'
多行字符串，不解析 $name
EOT;
?>
```

**常用函数**：`strlen()` `str_replace()` `strpos()` `substr()` `strtolower()` `strtoupper()` `trim()` `explode()` `implode()` `sprintf()`

---

### 七、数组

```php
<?php
// 索引数组
$arr1 = [1, 2, 3];
$arr1 = array(1, 2, 3);              // 旧语法

// 关联数组（键值对）
$arr2 = ["name" => "Alice", "age" => 25];

// 多维数组
$arr3 = [[1, 2], [3, 4]];

// 常用操作
$arr1[] = 4;                          // 追加元素
$count = count($arr1);                // 元素个数
$has   = in_array(2, $arr1);         // 检查值是否存在
$has   = array_key_exists("name", $arr2); // 检查键是否存在
unset($arr1[0]);                      // 删除元素

// 展开运算符（PHP 7.4+）
$merged = [...$arr1, ...$arr2];
?>
```

**常用函数**：`array_merge()` `array_filter()` `array_map()` `array_reduce()` `array_keys()` `array_values()` `sort()` `array_push()` `array_pop()`

---

### 八、函数

```php
<?php
// 基本函数
function greet($name = "Guest") {
    return "Hello, $name!";
}

// 类型声明（PHP 7+）
function add(int $a, int $b): int {
    return $a + $b;
}

// 可变参数
function sum(...$nums) {
    return array_sum($nums);
}
echo sum(1, 2, 3, 4);    // 10

// 匿名函数（闭包）
$double = function($x) { return $x * 2; };

// 箭头函数（PHP 7.4+）
$triple = fn($x) => $x * 3;
?>
```

---

### 九、类与对象

```php
<?php
class Person {
    // 属性
    public    $name;
    protected $age;
    private   $id;

    // 构造方法
    public function __construct(string $name, int $age) {
        $this->name = $name;
        $this->age  = $age;
    }

    // 方法
    public function greet(): string {
        return "Hi, I'm {$this->name}";
    }

    // 静态方法
    public static function species(): string {
        return "Homo sapiens";
    }
}

// 实例化
$alice = new Person("Alice", 25);
echo $alice->greet();

// 继承
class Student extends Person {
    public function __construct(string $name, int $age, private string $school) {
        parent::__construct($name, $age);
    }
}
?>
```

| 关键字 | 含义 |
|--------|------|
| `public` | 任何地方可访问 |
| `protected` | 自身及子类可访问 |
| `private` | 仅自身可访问 |
| `static` | 静态属性/方法 |
| `readonly` | 只读属性（PHP 8.1+） |
| `abstract` | 抽象类/方法 |
| `final` | 不可被继承/重写 |
| `interface` | 定义接口规范 |
| `trait` | 代码复用机制 |
| `enum` | 枚举（PHP 8.1+） |

---

### 十、包含文件

```php
<?php
include "file.php";       // 包含（文件不存在仅警告，继续执行）
require "file.php";       // 包含（文件不存在则致命错误，停止执行）
include_once "file.php";  // 仅包含一次
require_once "file.php";  // 仅包含一次（最常用）
?>
```

---

### 十一、超全局变量

| 变量 | 用途 |
|------|------|
| `$_GET` | URL 查询参数 |
| `$_POST` | POST 表单数据 |
| `$_REQUEST` | GET + POST + COOKIE 合集 |
| `$_SERVER` | 服务器和执行环境信息 |
| `$_COOKIE` | Cookie 数据 |
| `$_SESSION` | 会话数据 |
| `$_FILES` | 上传文件信息 |
| `$_ENV` | 环境变量 |
| `$GLOBALS` | 所有全局变量 |

---

### 十二、错误处理

```php
<?php
// try-catch-finally
try {
    // 可能出错的代码
    throw new Exception("出错了");
} catch (Exception $e) {
    echo "错误：" . $e->getMessage();
} finally {
    // 无论是否异常都会执行
}
?>
```

---

### 十三、命名空间

```php
<?php
namespace App\Models;

use App\Utils\Helper;

class User {
    // ...
}
?>
```

---

### 十四、常用内置函数速查

| 类别 | 函数 |
|------|------|
| 输出 | `echo` `print` `var_dump()` `print_r()` |
| 字符串 | `strlen()` `strpos()` `substr()` `str_replace()` `trim()` |
| 数组 | `count()` `array_merge()` `array_filter()` `array_map()` `sort()` |
| 文件 | `file_get_contents()` `file_put_contents()` `fopen()` `fclose()` |
| JSON | `json_encode()` `json_decode()` |
| 日期 | `date()` `time()` `strtotime()` |
| 数学 | `abs()` `round()` `ceil()` `floor()` `rand()` `max()` `min()` |
| 变量 | `isset()` `empty()` `is_null()` `gettype()` |
| 其他 | `die()` / `exit()` `sleep()` `header()` |

