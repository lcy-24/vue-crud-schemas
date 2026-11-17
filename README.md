# vue-crud-schemas

Schema 驱动的 Vue3 CRUD 组件库，基于 Element Plus。**一份列配置，同时驱动表格、搜索表单、编辑表单**，告别三套重复代码。

全量 TypeScript，自带类型推导。适合中后台管理系统的快速搭建，也是从大型项目 shared-ui 组件库中提炼出的可复用方案。

## 特性

- 📋 **Schema 驱动**：用一份 `CrudColumn[]` 配置同时生成表格列、搜索项、表单项
- 🧩 **内置常用控件**：input / textarea / number / select / radio / checkbox / date / datetime / switch
- 🎛 **自定义插槽**：任意单元格、表单项都可用具名插槽自定义渲染
- 📄 **分页开箱即用**：内置 `el-pagination`，支持 `v-model:page` / `v-model:pageSize`
- 🔧 **`useCrudSchemas` 组合式函数**：一键推导表格列 / 搜索列 / 表单列 + 初始模型
- ✅ **类型安全**：`CrudColumn` / `SelectOption` 等类型完整导出

## 安装

```bash
npm install vue-crud-schemas
```

> 依赖 peer：`vue >= 3.3`、`element-plus >= 2.6`。请确保项目中已**全局引入 Element Plus**（`app.use(ElementPlus)`）。

## 快速开始

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  useCrudSchemas,
  SchemaTable,
  SchemaSearch,
  SchemaForm,
  type CrudColumn,
} from 'vue-crud-schemas'

const columns: CrudColumn[] = [
  {
    field: 'name',
    label: '名称',
    search: true,
    form: true,
    rules: [{ required: true, message: '请输入名称' }],
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    search: true,
    form: true,
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
  {
    field: 'createdAt',
    label: '创建时间',
    type: 'datetime',
    table: true,
    form: true,
    formatter: (_row, _col, val) => String(val).slice(0, 19),
  },
  {
    field: 'operation',
    label: '操作',
    type: 'slot',
    slot: 'operation',
  },
]

// 一键推导 + 初始模型
const schemas = useCrudSchemas(columns)

const list = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)

async function fetchData() {
  loading.value = true
  // 调用接口，用 schemas.searchModel 作为查询条件
  const res = await api.getList({ ...schemas.searchModel, page: page.value, pageSize: pageSize.value })
  list.value = res.list
  total.value = res.total
  loading.value = false
}
</script>

<template>
  <div>
    <SchemaSearch v-model="schemas.searchModel" :columns="schemas.searchColumns" @search="fetchData" />

    <SchemaTable
      :columns="schemas.tableColumns"
      :data="list"
      :loading="loading"
      :total="total"
      v-model:page="page"
      v-model:page-size="pageSize"
    >
      <!-- 自定义「操作」列 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="onEdit(row)">编辑</el-button>
      </template>
    </SchemaTable>

    <SchemaForm v-model="schemas.formModel" :columns="schemas.formColumns" />
  </div>
</template>
```

## API

### `useCrudSchemas(columns)`

```ts
const schemas = useCrudSchemas(columns)
// schemas.tableColumns / searchColumns / formColumns
// schemas.searchModel / formModel（reactive，可直接 v-model）
```

### 组件

| 组件 | Props | 说明 |
| --- | --- | --- |
| `SchemaTable` | `columns` `data` `loading` `total` `page` `pageSize` `pagination` `selection` `border` `stripe` | 表格 + 分页 |
| `SchemaSearch` | `columns` `modelValue` `labelWidth` | 行内搜索表单 |
| `SchemaForm` | `columns` `modelValue` `labelWidth` `labelPosition` | 栅格化编辑表单 |

## 字段类型对照

| `type` | 渲染控件 |
| --- | --- |
| `input` / `textarea` | `el-input` |
| `number` | `el-input-number` |
| `select` | `el-select` |
| `radio` | `el-radio-group` |
| `checkbox` | `el-checkbox-group` |
| `date` / `datetime` | `el-date-picker` |
| `switch` | `el-switch` |
| `slot` | 具名插槽自定义 |

## License

MIT
