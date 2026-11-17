<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  useCrudSchemas,
  SchemaSearch,
  SchemaTable,
  SchemaForm,
  type CrudColumn,
} from 'vue-crud-schemas'

/* ---------- 一份列配置，同时驱动表格 / 搜索 / 表单 ---------- */
const columns: CrudColumn[] = [
  {
    field: 'name',
    label: '商品名称',
    search: true,
    form: true,
    rules: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    search: true,
    form: true,
    slot: 'status', // 表格列用自定义插槽渲染
    options: [
      { label: '上架', value: 1 },
      { label: '下架', value: 0 },
    ],
  },
  {
    field: 'category',
    label: '分类',
    type: 'radio',
    form: true,
    options: [
      { label: '数码', value: 'digital' },
      { label: '家居', value: 'home' },
      { label: '食品', value: 'food' },
    ],
  },
  { field: 'price', label: '价格(元)', type: 'number', form: true },
  { field: 'stock', label: '库存', type: 'number', form: true },
  {
    field: 'createdAt',
    label: '创建时间',
    type: 'datetime',
    form: true,
    formatter: (_row, _col, val) => String(val ?? '').slice(0, 19),
  },
  {
    field: 'operation',
    label: '操作',
    type: 'slot',
    slot: 'operation',
    width: 160,
    fixed: 'right',
  },
]

const schemas = useCrudSchemas(columns)

/* ---------- 模拟数据 ---------- */
interface Item {
  id: number
  name: string
  status: number
  category: string
  price: number
  stock: number
  createdAt: string
}

const rawData: Item[] = [
  { id: 1, name: 'iPhone 15 Pro', status: 1, category: 'digital', price: 7999, stock: 120, createdAt: '2024-01-15 10:20:00' },
  { id: 2, name: '小米 14', status: 1, category: 'digital', price: 3999, stock: 300, createdAt: '2024-01-16 09:10:00' },
  { id: 3, name: 'MacBook Air', status: 1, category: 'digital', price: 8999, stock: 45, createdAt: '2024-01-18 14:30:00' },
  { id: 4, name: '人体工学椅', status: 1, category: 'home', price: 1299, stock: 80, createdAt: '2024-02-02 11:00:00' },
  { id: 5, name: '升降桌', status: 0, category: 'home', price: 1999, stock: 0, createdAt: '2024-02-05 16:45:00' },
  { id: 6, name: '有机燕麦', status: 1, category: 'food', price: 59, stock: 500, createdAt: '2024-02-10 08:30:00' },
  { id: 7, name: '蓝山咖啡豆', status: 1, category: 'food', price: 128, stock: 200, createdAt: '2024-02-12 10:05:00' },
  { id: 8, name: 'AirPods Pro', status: 1, category: 'digital', price: 1899, stock: 150, createdAt: '2024-02-20 13:15:00' },
  { id: 9, name: '4K 显示器', status: 0, category: 'digital', price: 2699, stock: 0, createdAt: '2024-03-01 15:40:00' },
  { id: 10, name: '实木书架', status: 1, category: 'home', price: 899, stock: 60, createdAt: '2024-03-05 09:50:00' },
  { id: 11, name: '筋膜枪', status: 1, category: 'home', price: 499, stock: 180, createdAt: '2024-03-10 17:20:00' },
  { id: 12, name: '坚果礼盒', status: 1, category: 'food', price: 199, stock: 400, createdAt: '2024-03-15 12:00:00' },
]

const list = ref<Item[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(5)

function fetchData() {
  loading.value = true
  setTimeout(() => {
    const { name, status } = schemas.searchModel
    const filtered = rawData.filter((d) => {
      if (name && !d.name.includes(String(name))) return false
      if (status !== '' && status !== null && status !== undefined && d.status !== status) return false
      return true
    })
    total.value = filtered.length
    list.value = filtered.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
    loading.value = false
  }, 250)
}

onMounted(fetchData)
watch([page, pageSize], fetchData)

/* ---------- 新增 / 编辑 ---------- */
const dialogVisible = ref(false)
const dialogTitle = ref('新增商品')
const editingId = ref<number | null>(null)

function openCreate() {
  editingId.value = null
  dialogTitle.value = '新增商品'
  for (const c of schemas.formColumns) {
    schemas.formModel[c.field] = c.defaultValue ?? (c.field === 'status' ? 1 : '')
  }
  dialogVisible.value = true
}

function openEdit(row: Item) {
  editingId.value = row.id
  dialogTitle.value = '编辑商品'
  for (const c of schemas.formColumns) {
    schemas.formModel[c.field] = (row as any)[c.field]
  }
  dialogVisible.value = true
}

function handleSubmit() {
  const { name } = schemas.formModel
  if (!name) return
  if (editingId.value === null) {
    rawData.push({ id: Date.now(), ...JSON.parse(JSON.stringify(schemas.formModel)) })
    ElMessage.success('新增成功（演示数据）')
  } else {
    const idx = rawData.findIndex((d) => d.id === editingId.value)
    if (idx > -1) Object.assign(rawData[idx], JSON.parse(JSON.stringify(schemas.formModel)))
    ElMessage.success('保存成功（演示数据）')
  }
  dialogVisible.value = false
  fetchData()
}

function handleDelete(row: Item) {
  ElMessageBox.confirm(`确认删除「${row.name}」？`, '提示', { type: 'warning' })
    .then(() => {
      const idx = rawData.findIndex((d) => d.id === row.id)
      if (idx > -1) rawData.splice(idx, 1)
      ElMessage.success('已删除（演示数据）')
      fetchData()
    })
    .catch(() => {})
}
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1>vue-crud-schemas</h1>
      <p>Schema 驱动的 Vue3 CRUD 组件库 · 一份列配置同时驱动表格、搜索、表单</p>
    </header>

    <el-card shadow="never" class="card">
      <SchemaSearch v-model="schemas.searchModel" :columns="schemas.searchColumns" @search="fetchData" @reset="fetchData" />
    </el-card>

    <el-card shadow="never" class="card">
      <div class="toolbar">
        <el-button type="primary" @click="openCreate">新增商品</el-button>
      </div>
      <SchemaTable
        :columns="schemas.tableColumns"
        :data="list"
        :loading="loading"
        :total="total"
        v-model:page="page"
        v-model:page-size="pageSize"
      >
        <template #status="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
            {{ row.status === 1 ? '上架' : '下架' }}
          </el-tag>
        </template>
        <template #operation="{ row }">
          <el-button type="primary" link @click="openEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </SchemaTable>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px">
      <SchemaForm v-model="schemas.formModel" :columns="schemas.formColumns" />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style>
body {
  margin: 0;
  background: #f5f6f8;
}
</style>

<style scoped>
.page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 16px 60px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 26px;
  color: #1f2329;
}

.page-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.card {
  margin-bottom: 16px;
}

.toolbar {
  margin-bottom: 12px;
}
</style>
