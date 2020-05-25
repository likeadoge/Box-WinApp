import { axios } from './axios'
import store from '../../store/index';

const transform = (e: any) => e as {
    success: boolean;
    message: string;
    code: number;
    timestamp: number;
    result: any;
}

const dealSucc = (e: any) => Promise.resolve(transform(e)).then(e => {
    if (e.success) return e.result
    else throw e.message
})

//post method= {post | put}
export default function httpAction(url: string, parameter: any, method: "post" | "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "POST" | "put" | "PUT" | "patch" | "PATCH" | "link" | "LINK" | "unlink" | "UNLINK" | undefined) {
    return axios({
        url: url,
        method: method,
        data: parameter
    }).then(dealSucc)
}

//post
export function post(url: string, parameter: any) {
    return axios({
        url: url,
        method: 'post',
        data: parameter
    }).then(dealSucc)
}

//put
export function put(url: string, parameter: any) {
    return axios({
        url: url,
        method: 'put',
        data: parameter
    }).then(dealSucc)
}

//get
export function get(url: string, parameter: any) {
    return axios({
        url: url,
        method: 'get',
        params: parameter
    }).then(dealSucc)
}

//deleteAction
export function del(url: string, parameter: any) {
    return axios({
        url: url,
        method: 'delete',
        params: parameter
    }).then(dealSucc)
}


function convertRes2Blob(data: any, name: string) {
    // 提取文件名
    const filename = name
    // 将二进制流转为blob
    const blob = new Blob([data], { type: 'application/octet-stream' })
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
        window.navigator.msSaveBlob(blob, decodeURI(filename))
    } else {
        // 创建新的URL并指向File对象或者Blob对象的地址
        const blobURL = window.URL.createObjectURL(blob)
        // 创建a标签，用于跳转至下载链接
        const tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = blobURL
        tempLink.setAttribute('download', decodeURI(filename))
        // 兼容：某些浏览器不支持HTML5的download属性
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank')
        }
        // 挂载a标签
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        // 释放blob URL地址
        window.URL.revokeObjectURL(blobURL)
    }
}

const delay = <T>(timeout: number) => (arg: T) => {
    return new Promise<T>(res => {
        setTimeout(() => { res(arg) }, timeout);
    })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function file(url: string, parameter: any, name: string) {
    // const src = baseURL +url +"?"+ Object.keys(parameter).map(key=>{
    //     const v = parameter[key]
    //     return `${key}=${v}`
    // }).join('&')

    store.dispatch('LoadingBegin', '正在下载中')

    return axios({
        url: url,
        method: 'get',
        params: parameter,
        responseType: 'blob'
    }).then(delay(0)).then((...arg) => {
        convertRes2Blob(arg[0], name)
    }).finally(()=>{
        store.dispatch('LoadingEnd')
    })
}


