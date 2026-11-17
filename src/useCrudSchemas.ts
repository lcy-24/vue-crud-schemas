import { computed, isRef, reactive } from 'vue'
import type { ColumnSource, CrudColumn, CrudSchemas } from './types'

/**
 * 从一份列配置推导出表格列、搜索列、表单列，并生成初始 searchModel / formModel。
 *
 * @example
 * const schemas = useCrudSchemas(columns)
 * // schemas.tableColumns / schemas.searchColumns / schemas.formColumns
 * // schemas.searchModel / schemas.formModel
 */
export function useCrudSchemas(columns: ColumnSource): CrudSchemas {
  const list = computed<CrudColumn[]>(() => (isRef(columns) ? columns.value : columns))

  const tableColumns = computed(() => list.value.filter((c) => c.table !== false))
  const searchColumns = computed(() => list.value.filter((c) => c.search === true))
  const formColumns = computed(() => list.value.filter((c) => c.form === true))

  const searchModel = reactive<Record<string, any>>({})
  const formModel = reactive<Record<string, any>>({})

  for (const c of searchColumns.value) {
    searchModel[c.field] = c.defaultValue ?? defaultValue(c.searchType ?? c.type)
  }
  for (const c of formColumns.value) {
    formModel[c.field] = c.defaultValue ?? defaultValue(c.formType ?? c.type)
  }

  return {
    columns: list.value,
    tableColumns: tableColumns.value,
    searchColumns: searchColumns.value,
    formColumns: formColumns.value,
    searchModel,
    formModel,
  }
}

function defaultValue(type?: string): any {
  switch (type) {
    case 'switch':
      return false
    case 'checkbox':
      return []
    default:
      return ''
  }
}
