import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [{
  // Layout 2
  path: '/erp/partnership-payslip',
  component: LayoutAdmin,
  children: [
    {
      path: 'manager',
      name: 'partnership-payslip-manager',
      component: () => import('components/pages/PartnershipPayslip/PayslipManager')
    },
    {
      path: 'detail/:id',
      component: () => import('components/pages/PartnershipPayslip/PayslipDetail.vue')
    }
  ]
}]
