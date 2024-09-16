import axios from 'axios'
import config from 'config/app.base'

const tokenIamStorage = config.oidc.tokenIamStorage
const iamToken = JSON.parse(localStorage.getItem(tokenIamStorage))
let accessToken = ''
if (iamToken && iamToken.accessToken) {
  accessToken = iamToken.accessToken.accessToken
}

const httpErp = axios.create({
  baseURL: config.baseApiErpUrl,
  // Add header or another config here
  headers: {
    'Authorization': `${config.bearerKeyEcom} ${accessToken}`
  }
})

export default httpErp
