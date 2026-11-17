<script setup lang="ts">
import type { FieldType, SelectOption } from '../types'

interface Props {
  type: FieldType
  modelValue?: any
  options?: SelectOption[]
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  placeholder: '请选择',
  clearable: true,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

function update(value: any) {
  emit('update:modelValue', value)
}
</script>

<template>
  <el-input
    v-if="type === 'input' || type === 'textarea'"
    :model-value="modelValue"
    :type="type === 'textarea' ? 'textarea' : 'text'"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    @update:model-value="update"
  />
  <el-input-number
    v-else-if="type === 'number'"
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="update"
  />
  <el-select
    v-else-if="type === 'select'"
    :model-value="modelValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    @update:model-value="update"
  >
    <el-option
      v-for="o in options"
      :key="String(o.value)"
      :label="o.label"
      :value="o.value"
      :disabled="o.disabled"
    />
  </el-select>
  <el-radio-group
    v-else-if="type === 'radio'"
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="update"
  >
    <el-radio v-for="o in options" :key="String(o.value)" :value="o.value" :disabled="o.disabled">
      {{ o.label }}
    </el-radio>
  </el-radio-group>
  <el-checkbox-group
    v-else-if="type === 'checkbox'"
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="update"
  >
    <el-checkbox v-for="o in options" :key="String(o.value)" :value="o.value" :disabled="o.disabled">
      {{ o.label }}
    </el-checkbox>
  </el-checkbox-group>
  <el-date-picker
    v-else-if="type === 'date' || type === 'datetime'"
    :model-value="modelValue"
    :type="type === 'datetime' ? 'datetime' : 'date'"
    value-format="YYYY-MM-DD HH:mm:ss"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    @update:model-value="update"
  />
  <el-switch
    v-else-if="type === 'switch'"
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="update"
  />
</template>
