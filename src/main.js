import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ant from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import Axios from 'axios'
import vuea from 'vue-axios'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import hljs from "highlight.js";
import "highlight.js/styles/default.css";
dayjs.locale('zh-cn');





createApp(App).use(store).use(router).use(ant).use(vuea, Axios).use(hljs.vuePlugin).mount('#app')
