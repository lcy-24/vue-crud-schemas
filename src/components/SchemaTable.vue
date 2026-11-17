<script setup lang="ts">
import type { CrudColumn } from '../types'

interface Props {
  columns: CrudColumn[]
  data: Record<string, any>[]
  loading?: boolean
  pagination?: boolean
  total?: number
  page?: number
  pageSize?: number
  pageSizes?: number[]
  border?: boolean
  stripe?: boolean
  selection?: boolean
  rowKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  pagination: true,
  total: 0,
  page: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  border: true,
  stripe: true,
  selection: false,
  rowKey: 'id',
})

const emit = defineEmits<{
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'selection-change', rows: Record<string, any>[]): void
  (e: 'sort-change', value: any): void
  (e: 'row-click', row: Record<string, any>): void
}>()

function formatCell(row: Record<string, any>, col: CrudColumn): string {
  return col.formatter ? col.formatter(row, col, row[col.field]) : String(row[col.field] ?? '')
}
</script>

<template>
  <div class="vcs-table">
    <el-table
      v-loading="loading"
      :data="data"
      :border="border"
      :stripe="stripe"
      :row-key="rowKey"
      @selection-change="(v: Record<string, any>[]) => emit('selection-change', v)"
      @sort-change="(v: any) => emit('sort-change', v)"
      @row-click="(row: Record<string, any>) => emit('row-click', row)"
    >
      <el-table-column v-if="selection" type="selection" width="55" align="center" />
      <el-table-column
        v-for="col in columns"
        :key="col.field"
        :prop="col.field"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :fixed="col.fixed"
        :sortable="col.sortable"
        :align="col.align"
        :show-overflow-tooltip="col.showOverflowTooltip"
      >
        <template v-if="col.type === 'slot' || col.slot" #default="{ row }">
          <slot :name="col.slot" :row="row" :value="row[col.field]" :field="col.field">
            {{ formatCell(row, col) }}
          </slot>
        </template>
        <template v-else-if="col.formatter" #default="{ row }">
          {{ formatCell(row, col) }}
        </template>
      </el-table-column>
    </el-table>

    <div v-if="pagination" class="vcs-table__pagination">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        :page-sizes="pageSizes"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @current-change="(v: number) => emit('update:page', v)"
        @size-change="(v: number) => emit('update:pageSize', v)"
      />
    </div>
  </div>
</template>

<style scoped>
.vcs-table__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
