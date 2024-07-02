import './assets/main.css'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from "axios";
import router from "@/router/router.js";


const app = createApp(App)
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 配置 Axios 的请求头
axios.defaults.headers.common['Authorization'] = 'Bearer your_access_token'
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 创建 Axios 实例
const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000, // 请求超时时间为10秒
    headers: {
        'Authorization': 'Bearer your_access_token',
        'Content-Type': 'application/json'
    }
})

// 将 Axios 实例挂载到 Vue 实例上
app.config.globalProperties.$http = instance

app.use(ElementPlus)
app.use(router).mount('#app')