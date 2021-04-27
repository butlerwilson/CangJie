# API 接口
> 使用时需要先指明环境

- [API 接口](#api-接口)
  - [randomGetter](#randomgetter)
    - [状态](#状态)
    - [使用权限](#使用权限)
    - [Request](#request)
    - [Response](#response)
  - [charList](#charlist)
    - [状态](#状态-1)
    - [使用权限](#使用权限-1)
    - [Request](#request-1)
    - [Response](#response-1)

## randomGetter

> 随机获得指定个数的数据库项

### 状态
- 已完成并部署

### 使用权限
- 仅创建者可读写

### Request

```javascript
wx.cloud.callFunction({
    name: "randomGetter",
    data: {
        size: 1000 // size 表示想要获取的条目个数
    }
})
```

### Response

```javascript
[
    // 数组大小与请求 size 相同
    {
        "_id": xxx, // 在数据库中的 id，唯一标识符
        "key": X, // 该条目对应的文字
        "value": [[x1, x2, ...], ...,[...]] // 一个二维数组，二维数组中的每个数组都表示一个可行的拆字方案
    },
    ...
    {
        "_id": xxx,
        "key": X,
        "value": [[x1, x2, ...], ...,[...]]
    }
]
```


## charList

> 返回一个随机部首以及这些随机部首所能组成的字

### 状态

- 已完成但未部署，只能本地调试

### 使用权限

- 仅创建者可读写

### Request

```javascript
wx.cloud.callFunction({
    name: "charList",
    data: {
        size: 1000 // size 表示想要获取的条目个数
    }
})
```

### Response

```javascript
{
    "char_list": [ 
        // 部首的列表
        {
            "char": x1, // 部首
            "ans_index": idx1 // 该部首对应的答案在 ans_list 中的坐标
        },
        ...
        {
            "char": xn,
            "ans_index": idxn
        }
    ],
    "ans_list": [
        // 数组大小与请求 size 有关
        {
            "char": X, // 拼字后的结果
            "ans": [id1, id2, ...]  // 部首在 char_list 中的索引
        },
        ...
        {
            "char": X,
            "ans": [id1, id2, ...]
        }
    ]
}
```
