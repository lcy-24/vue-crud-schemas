import type { ComputedRef } from 'vue'

/** 字段控件类型 */
export type FieldType =
  | 'input'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'datetime'
  | 'switch'
  | 'slot'

export interface SelectOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

/**
 * 单个列配置：一份配置同时驱动表格列、搜索表单项、编辑表单项。
 * 这是整个库的核心数据结构，对应「Schema 驱动」的理念。
 */
export interface CrudColumn {
  /** 字段名，绑定到数据对象的 key */
  field: string
  /** 表头 / 表单项 label */
  label: string
  /** 控件类型，默认 input；表格里配合 slot 使用表示自定义渲染 */
  type?: FieldType

  /* ---------------- 表格列 ---------------- */
  width?: number | string
  minWidth?: number | string
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean | 'custom'
  align?: 'left' | 'center' | 'right'
  showOverflowTooltip?: boolean
  /** 是否在表格中显示，默认 true */
  table?: boolean
  /** 自定义插槽名，type 为 slot 或需要自定义单元格时使用 */
  slot?: string
  /** 单元格格式化函数 */
  formatter?: (row: Record<string, any>, column: CrudColumn, value: any) => string

  /* ---------------- 搜索表单 ---------------- */
  /** 是否进入搜索表单 */
  search?: boolean
  searchType?: FieldType
  searchPlaceholder?: string

  /* ---------------- 编辑表单 ---------------- */
  /** 是否进入编辑表单 */
  form?: boolean
  formType?: FieldType

  /* ---------------- 通用 ---------------- */
  options?: SelectOption[]
  placeholder?: string
  defaultValue?: any
  disabled?: boolean
  rules?: any[]
  /** 表单项栅格宽度（el-col span，默认 24） */
  span?: number
  /** 透传给底层 el-xxx 组件的额外 props */
  props?: Record<string, any>
  /** 任意扩展 */
  [key: string]: any
}

export interface CrudSchemas {
  /** 所有列 */
  columns: CrudColumn[]
  /** 表格列（table !== false） */
  tableColumns: CrudColumn[]
  /** 搜索列（search === true） */
  searchColumns: CrudColumn[]
  /** 表单列（form === true） */
  formColumns: CrudColumn[]
  /** 初始搜索条件对象（reactive，可直接 v-model） */
  searchModel: Record<string, any>
  /** 初始表单数据对象（reactive，可直接 v-model） */
  formModel: Record<string, any>
}

export type ColumnSource = CrudColumn[] | ComputedRef<CrudColumn[]>
