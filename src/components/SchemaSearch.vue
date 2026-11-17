<script setup lang="ts">
import FieldControl from './FieldControl.vue'
import type { CrudColumn } from '../types'

interface Props {
  columns: CrudColumn[]
  modelValue: Record<string, any>
  labelWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  labelWidth: 'auto',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'search'): void
  (e: 'reset'): void
}>()

function setField(field: string, value: any) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

function onSearch() {
  emit('search')
}

function onReset() {
  const next: Record<string, any> = {}
  for (const c of props.columns) {
    next[c.field] = c.defaultValue ?? ''
  }
  emit('update:modelValue', next)
  emit('reset')
}
</script>

<template>
  <el-form inline :label-width="labelWidth" class="vcs-search" @submit.prevent="onSearch">
    <el-form-item v-for="col in columns" :key="col.field" :label="col.label">
      <FieldControl
        :type="col.searchType ?? col.type ?? 'input'"
        :model-value="modelValue[col.field]"
        :options="col.options"
        :placeholder="col.searchPlaceholder ?? col.placeholder"
        :disabled="col.disabled"
        v-bind="col.props"
        @update:model-value="(v: any) => setField(col.field, v)"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit">查询</el-button>
      <el-button @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.vcs-search {
  margin-bottom: 8px;
}
</style>
