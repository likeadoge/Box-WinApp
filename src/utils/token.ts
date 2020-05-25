let token: string | null = null

export const setToken = (s: string) => { token = s }
export const getToken = () => token
export const delToken = () => { token = null }