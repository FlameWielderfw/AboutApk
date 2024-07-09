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

// 配置 Axios 的默认请求参数
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.timeout = 10000

app.use(ElementPlus)
app.use(router).mount('#app')