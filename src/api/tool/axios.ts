import axios from 'axios'
import { Modal, notification } from 'ant-design-vue'
import store from 'store';
import { ipcRenderer } from 'electron'
import vuexStore from '../../store/index';

const {baseURL} = ipcRenderer.sendSync('config')
// 创建 axios 实例
const service = axios.create({
    baseURL, // api base_url
    timeout: -1 // 请求超时时间
})

const err = (error: any) => {
    if (error.response) {
        const data = error.response.data
        const token = store.get('ACCESS_TOKEN')
        console.log("------异常响应------", token)
        console.log("------异常响应------", error.response.status)
        switch (error.response.status) {
            case 403:
                notification.error({ message: '系统提示', description: '拒绝访问', duration: 4 })
                break
            case 500:
                if (token && data.message == "Token失效，请重新登录") {
                    Modal.error({
                        title: '登录已过期',
                        content: '很抱歉，登录已过期，请重新登录',
                        okText: '重新登录',
                        mask: false,
                        onOk: () => {
                           vuexStore.dispatch('Logout')
                        }
                    })
                } else {
                    notification.error({
                        message: '系统提示',
                        description: data.message,
                        duration: 4
                    })
                }
                break
            case 404:
                notification.error({ message: '系统提示', description: '很抱歉，资源未找到!', duration: 4 })
                break
            case 504:
                notification.error({ message: '系统提示', description: '网络超时' })
                break
            case 401:
                notification.error({ message: '系统提示', description: '未授权，请重新登录', duration: 4 })
                if (token) {
                    vuexStore.dispatch('Logout')
                }
                break
            default:
                notification.error({
                    message: '系统提示',
                    description: data.message,
                    duration: 4
                })
                break
        }
    }
    return Promise.reject(error)
};

// request interceptor
service.interceptors.request.use((config: any) => {
    const token = store.get('ACCESS_TOKEN')
    if (token) {
        config.headers['X-Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
    if (config.method == 'get') {
        if (config.url.indexOf("sys/dict/getDictItems") < 0) {
            config.params = {
                // _t: Date.parse(new Date().toString()) / 1000,
                ...config.params
            }
        }
    }
    return config
}, (error) => {
    console.log(error)
    return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use((response) => {
    return response.data
}, err)

export {
    service as axios,
    baseURL
}