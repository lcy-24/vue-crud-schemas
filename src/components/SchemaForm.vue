<script setup lang="ts">
import FieldControl from './FieldControl.vue'
import type { CrudColumn } from '../types'

interface Props {
  columns: CrudColumn[]
  modelValue: Record<string, any>
  labelWidth?: string
  labelPosition?: 'left' | 'right' | 'top'
}

const props = withDefaults(defineProps<Props>(), {
  labelWidth: '100px',
  labelPosition: 'right',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

function setField(field: string, value: any) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>

<template>
  <el-form :model="modelValue" :label-width="labelWidth" :label-position="labelPosition" class="vcs-form">
    <el-row :gutter="16">
      <el-col v-for="col in columns" :key="col.field" :span="col.span ?? 24">
        <el-form-item :label="col.label" :prop="col.field" :rules="col.rules">
          <slot
            v-if="col.formType === 'slot' || col.type === 'slot'"
            :name="col.slot"
            :model="modelValue"
            :field="col.field"
            :value="modelValue[col.field]"
          />
          <FieldControl
            v-else
            :type="col.formType ?? col.type ?? 'input'"
            :model-value="modelValue[col.field]"
            :options="col.options"
            :placeholder="col.placeholder"
            :disabled="col.disabled"
            v-bind="col.props"
            @update:model-value="(v: any) => setField(col.field, v)"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
