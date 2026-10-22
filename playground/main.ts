import { createSchemaForm } from '@yoanmarchal/vue-schema-form'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App)
  .use(createSchemaForm())
  .mount('#app')
