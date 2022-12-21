import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

//import './style.css'

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';


const pinia = createPinia()
import App from './App.vue'

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
