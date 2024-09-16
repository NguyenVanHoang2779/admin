import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/ekyc',
    component: LayoutAdmin,
    children: [
      {
        path: 'ekyc-reports',
        name: 'ekyc-reports',
        component: () => import('components/pages/erp/Ekyc/Report.vue')
      }
    ]
  }
]
