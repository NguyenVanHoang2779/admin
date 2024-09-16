import axios from 'axios'
import config from 'config/app.base'

const httpErpConfig = axios.create({
  baseURL: config.baseApiErpUrl
  // Add header or another config here
})

httpErpConfig.interceptors.request.use(config => {
  // let token = window.localStorage.getItem('gchat_token') || ''
  // if (token) config.headers.Authorization = token

  return config
})

export default httpErpConfig
