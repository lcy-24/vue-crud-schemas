import type { App } from 'vue'
import { useCrudSchemas } from './useCrudSchemas'
import SchemaTable from './components/SchemaTable.vue'
import SchemaSearch from './components/SchemaSearch.vue'
import SchemaForm from './components/SchemaForm.vue'
import FieldControl from './components/FieldControl.vue'
import type {
  CrudColumn,
  CrudSchemas,
  ColumnSource,
  FieldType,
  SelectOption,
} from './types'

export { useCrudSchemas, SchemaTable, SchemaSearch, SchemaForm, FieldControl }
export type {
  CrudColumn,
  CrudSchemas,
  ColumnSource,
  FieldType,
  SelectOption,
}

export default {
  install(app: App) {
    app.component('SchemaTable', SchemaTable)
    app.component('SchemaSearch', SchemaSearch)
    app.component('SchemaForm', SchemaForm)
    app.component('FieldControl', FieldControl)
  },
}
