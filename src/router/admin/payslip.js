import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [{
  // Layout 2
  path: '/erp/payslip',
  component: LayoutAdmin,
  children: [
    {
      path: 'manager',
      name: 'payslip-manager',
      component: () => import('components/pages/Payslip/PayslipManager')
    },
    {
      path: 'detail/:id',
      component: () => import('components/pages/Payslip/PayslipDetail.vue')
    },
    {
      path: 'adjust-upload',
      component: () => import('components/pages/Payslip/AdjustUpload.vue')
    },
    {
      path: 'deposit',
      name: 'deposit-manager',
      component: () => import('components/pages/Payslip/Deposit/Deposit.vue')
    },
    {
      path: 'deposit/config',
      name: 'config-initial-deposit',
      component: () => import('components/pages/Payslip/Deposit/ConfigInitialDeposit.vue')
    },
    {
      path: 'deposit/config/manage',
      name: 'config-deposit-manage',
      component: () => import('components/pages/Payslip/Deposit/ConfigDepositManage.vue')
    }
  ]
}]
