import axios from 'axios'
import config from 'config/app.base'

const httpRp = axios.create({
  baseURL: config.baseApiReportUrl
  // Add header or another config here
})

export default httpRp
