import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [{
  path: '/dashboard/erp',
  component: LayoutAdmin,
  children: [
    {
      path: '',
      component: () => import('components/pages/home/DashboardErp.vue')
    }
  ]
}]
