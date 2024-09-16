import axios from 'axios'
import config from 'config/app.base'

const httpG3PL = axios.create({
  baseURL: config.baseApiG3PLUrl
})

export default httpG3PL
