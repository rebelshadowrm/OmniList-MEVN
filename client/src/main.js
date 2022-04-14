import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import SmartTable from 'vuejs-smart-table'
import './assets/styles.css';


createApp(App)
    .use(router)
    .use(SmartTable)
    .mount('#app')