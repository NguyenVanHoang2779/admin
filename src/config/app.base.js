// import environment from 'config/environment'
let isDev = process.env.NODE_ENV && process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'prod'

const domain = process.env.VUE_APP_DOMAIN
const domainApiOld = process.env.VUE_APP_DOMAIN_API || ''
const domainApiNew = process.env.VUE_APP_DOMAIN_API_NEW
const domainApiNewKpi = process.env.VUE_APP_DOMAIN_API_NEW_KPI
const domainIamClientId = process.env.VUE_APP_DOMAIN_IAM_CLIENT_ID
const domainIamUrl = process.env.VUE_APP_DOMAIN_IAM_URL
const domainAuth = process.env.VUE_APP_DOMAIN_AUTH_GHTK
const gchatAuthDomain = process.env.VUE_APP_DOMAIN_GCHAT_AUTH
const domainHrmUni = process.env.VUE_APP_DOMAIN_API_HRM_UNI
const gchatDomain = process.env.VUE_APP_DOMAIN_GCHAT
const domainGhtkAdmin = process.env.VUE_APP_DOMAIN_GHTK_ADMIN
const domainInter = process.env.VUE_APP_DOMAIN_API_INTER
const domainNewBag = process.env.VUE_APP_DOMAIN_API_NEW_BAG
const domainHrmFe = process.env.VUE_APP_DOMAIN_HRM_FE
const domainQLTSFe = process.env.VUE_APP_DOMAIN_QLTS_FE
const domainApiQLTS = process.env.VUE_APP_DOMAIN_API_QLTS
const domainHrmTicket = process.env.VUE_APP_DOMAIN_HRM_TICKET

let environment = {
  isDev: isDev,
  domain: domain
}

const oidc = {
  clientId: domainIamClientId + '',
  issuer: domainAuth + '',
  redirectUri: domain + '/auth/callback',
  scopes: ['openid'],
  pkce: true,
  isAuthzBackground: false,
  authnUrl: domainIamUrl + '',
  tokenIamStorage: 'ghtk-token-storage',
  tokenSessionStorage: 'ecom-session-token'
}

const gchat = {
  authDomain: gchatAuthDomain,
  authStorage: 'gchat_auth'
}

let config = {
  // All config value will be here
  baseUrl: '/adm',
  domainDownloadFile: 'https://cache.giaohangtietkiem.vn/',
  baseApiUrl: domainApiOld + '/admin/',
  baseApiReportUrl: '/report/',
  baseApiErpUrl: domainApiOld + '/erp/',
  baseApiG3PLUrl: '/admin/G3PL/',
  baseApiHrmNewUrl: domainApiNew + '/erp/',
  baseApiKpiNewUrl: domainApiNewKpi + '',
  baseApiHrmUniUrl: domainHrmUni + '',
  baseApiInterUrl: domainInter + '/api/',
  baseApiNewBagUrl: domainNewBag + '/',
  bearerKeyEcom: 'BearerKpi',
  bearerKey: 'Bearer',
  gchatDomain: gchatDomain,
  domainGhtkAdmin: domainGhtkAdmin,
  domainHrmFe: domainHrmFe,
  domainHrmTicket: domainHrmTicket,
  domainQLTSFe: domainQLTSFe,
  domainApiQLTS: domainApiQLTS,
  domainApiHrm: domainApiNew
}

config = {...config, ...environment, oidc: {...oidc}, gchat: gchat}

export default config
