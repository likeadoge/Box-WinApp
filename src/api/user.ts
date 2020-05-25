import * as http from './tool/http'

export const login = (info: { username: string; password: string }) => {
    return http.post('/sys/login', info)
}

// export const logout = () => { }