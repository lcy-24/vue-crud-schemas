import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
// vue-crud-schemas 的组件内部使用 el-* 全局组件，需全局注册 Element Plus
app.use(ElementPlus)
app.mount('#app')
