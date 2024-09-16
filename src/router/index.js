import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

import globals from '@/globals'

import errorRoutes from './admin/errors'
import payslipRoutes from './admin/payslip'
import partnershipPayslipRoutes from './admin/partnership-payslip'
import staffManagerRoutes from './admin/erp'
import salaryRoutes from './admin/salary'
import dashboardV2 from './admin/dashboardV2'
import billsRoutes from './admin/bills'
import shopRoutes from './admin/shop'
import dashboardV4 from './admin/dashboardV4'
import dashBoardExternal from './admin/dashboard-external'
import auditsRoutes from './admin/audits'
import dashboardErpRoutes from './admin/dashboardErp'
import dashboardV5 from './admin/dashboardV5'
import evaluationManage from './admin/evaluation-manage'
import profileRoutes from './admin/profile'
import profileCompanyRoutes from './admin/profile-company'
import templateRoutes from './admin/template'
import userRoutes from './admin/user'
import candidateRoutes from './admin/candidate'
import hrteamRoutes from './admin/hrteam'
import profileStatisticRoutes from './admin/profile-statistic'
import saleRoutes from './admin/sales'
import customercareRoutes from './admin/customer-care'
import deductionsRoutes from './admin/deductions'
import executiveRoutes from './admin/executive'
import transferRoutes from './admin/transfer'
import internalSos from './admin/internal-sos'
import couponRoutes from './admin/coupon'
import ctvtv from './admin/ctvtv'
import positionRoutes from './admin/position'
import wifiRoutes from './admin/wifi'
import dependantPerson from './admin/dependant-person'
import union from './admin/union'
import kpiCods from './admin/kpi/cods'
import profileUser from './admin/kpi/profile'
import kpiCtvs from './admin/kpi/ctvs'
import kpiModules from './admin/kpi/modules'
import kpiPenalties from './admin/kpi/penalties'
import configCancelPenalties from './admin/kpi/config-cancel-penalties'
import dashboardSalary from './admin/kpi/dashboard-salary'
import shiftManage from './admin/kpi/shifts'
import permissionManager from './admin/permission-manager'
import codeNoteManager from './admin/cods'
import salaryHr from './admin/manage-salary-hr-hc'
import couponsXTeam from './admin/coupons-x-team'
import route from './admin/route'
import shopVote from './admin/shop-vote'
import hrOrder from './admin/hr-order'
import g3pl from './admin/g3pl'
import prohibitPackage from './admin/prohibit-package'
import logBagOrder from './admin/log-bag-order'
import staffReview from './admin/staff-review'
import autoAssign from './admin/auto-assign'
import driverx from './admin/driverx'
import workSchedule from './admin/work-schedule'
import dxteam from './admin/dxteam'
import medal from './admin/medal'
import frailPackage from './admin/frail-package'
import configCapacity from './admin/config-capacity'
import configBag from './admin/config-bag'
import configStation from './admin/config-station'
import truck from './admin/truck'
import xteamRoute from './admin/xteam-route'
import xteamRouteNew from './admin/xteam-route-new'
import bonus from './admin/kpi/bonus'
import manageListCod from './admin/manage-list-cod'
import ekyc from './admin/ekyc'
import manageListBagBox from './admin/manage-list-bag-box'
import manageListCart from './admin/manage-list-cart'
import uploadFileTaxCodeAndAccountNumber from './admin/upload-file-tax-account'
import parking from './admin/parking'
import HolidayErp from './admin/holiday'
import truckIncidentRoutes from './admin/truck-incident'
import profileTruck from './admin/profile-truck'
import profileStation from './admin/profile-station'
import profileManager from './admin/profile-manager'
import smartLocker from './admin/smart-locker'
import incomeTax from './admin/income-tax'

// ERP
import Insurance from './erp/insurance'
import KpiConfig from './erp/kpi-config'
import area from './admin/area'
import training from './admin/training'
import test from './erp/test'
import staffWork from './erp/staff-work'
import recruitment from './erp/recruitment'
import configRole from './erp/configRole'
import truckMonitor from './erp/truckMonitor'
import teamConfig from './erp/team-config'
import rolePermissionManagement from './erp/rolePermissionManagement'

// Layouts
// import Layout1 from '@/layout/Layout1'
import LayoutAdmin from 'components/layout/LayoutAdmin'
import empPosition from './admin/empPosition'
import staffLog from './admin/staff-log'
import {OAuth2CallbackHandler, GhtkAuth} from './../vendor/libs/gmjs/lib'
import config from 'config/app.base'

Vue.use(Router)
Vue.use(Meta)

const ROUTES = [
  {
    path: '/',
    component: LayoutAdmin,
    children: [{
      path: '',
      beforeEnter () {
        window.location.href = `${window.location.origin}/admin`
      }
    }]
  },
  ...errorRoutes,
  ...staffManagerRoutes,
  ...partnershipPayslipRoutes,
  ...payslipRoutes,
  ...salaryRoutes,
  ...dashboardV2,
  ...billsRoutes,
  ...shopRoutes,
  ...dashboardV4,
  ...dashBoardExternal,
  ...auditsRoutes,
  ...dashboardErpRoutes,
  ...dashboardV5,
  ...profileRoutes,
  ...profileCompanyRoutes,
  ...userRoutes,
  ...candidateRoutes,
  ...hrteamRoutes,
  ...profileStatisticRoutes,
  ...saleRoutes,
  ...customercareRoutes,
  ...deductionsRoutes,
  ...executiveRoutes,
  ...transferRoutes,
  ...internalSos,
  ...evaluationManage,
  ...couponRoutes,
  ...ctvtv,
  ...positionRoutes,
  ...dependantPerson,
  ...union,
  ...wifiRoutes,
  ...kpiCods,
  ...profileUser,
  ...kpiCtvs,
  ...kpiModules,
  ...kpiPenalties,
  ...shiftManage,
  ...configCancelPenalties,
  ...dashboardSalary,
  ...permissionManager,
  ...templateRoutes,
  ...codeNoteManager,
  ...salaryHr,
  ...couponsXTeam,
  ...route,
  ...shopVote,
  ...hrOrder,
  ...g3pl,
  ...prohibitPackage,
  ...staffReview,
  ...autoAssign,
  ...driverx,
  ...workSchedule,
  ...frailPackage,
  ...configCapacity,
  ...medal,
  ...Insurance,
  ...configBag,
  ...configStation,
  ...truck,
  ...KpiConfig,
  ...area,
  ...dxteam,
  ...training,
  ...empPosition,
  ...logBagOrder,
  ...xteamRoute,
  ...test,
  ...staffLog,
  ...manageListCod,
  ...bonus,
  ...ekyc,
  ...manageListBagBox,
  ...staffWork,
  ...recruitment,
  ...xteamRouteNew,
  ...manageListCart,
  ...uploadFileTaxCodeAndAccountNumber,
  ...parking,
  ...HolidayErp,
  ...configRole,
  ...truckIncidentRoutes,
  ...profileTruck,
  ...profileStation,
  ...profileManager,
  ...smartLocker,
  ...truckMonitor,
  ...incomeTax,
  ...teamConfig,

  ...rolePermissionManagement,
  {
    path: '*',
    redirect: '/error/404'
  }
]

const router = new Router({
  base: '/adm/',
  mode: 'history',
  routes: ROUTES
})

router.afterEach(() => {
  // On small screens collapse sidenav
  if (window.layoutHelpers && window.layoutHelpers.isSmallScreen() && !window.layoutHelpers.isCollapsed()) {
    setTimeout(() => window.layoutHelpers.setCollapsed(true, true), 10)
  }

  // Scroll to top of the page
  globals().scrollTop(0, 0)
})

window.popStateDetected = false
window.addEventListener('popstate', () => {
  window.popStateDetected = true
})

router.addRoutes([
  {
    path: '/auth/callback',
    beforeEnter: async (to, from, next) => {
      try {
        const handler = OAuth2CallbackHandler(config.oidc)
        if (await handler.handle()) {
          // Login successfully
          window.location.href = handler.getRefererPath() || '/adm/'
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  {
    path: '/signout',
    beforeEnter: async (to, from, next) => {
      const ghtkAuth = new GhtkAuth(config.oidc)

      try {
        await ghtkAuth.signOut({
          revokeAccessToken: true,
          postLogoutRedirectUri: `${config.oidc.authnUrl}/sign-out`
        })
      } catch (e) {
        window.location.href = `${config.oidc.authnUrl}/sign-out`
      }
    }
  }
])

function nextFactory (context, middleware, index) {
  const subsequentMiddleware = middleware[index]
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters)
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1)
    subsequentMiddleware({ ...context, next: nextMiddleware })
  }
}

router.beforeEach((to, from, next) => {
  window.popStateDetected = false
  // Set loading state
  document.body.classList.add('app-loading')
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware]

    const context = {
      from,
      next,
      router,
      to
    }
    const nextMiddleware = nextFactory(context, middleware, 1)

    return middleware[0]({ ...context, next: nextMiddleware })
  }
  // Add tiny timeout to finish page transition
  setTimeout(() => next(), 10)
})

export default router
