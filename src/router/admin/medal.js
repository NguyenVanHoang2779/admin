import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/medal',
    component: LayoutAdmin,
    children: [
      {
        name: 'medal-manage',
        path: 'manage',
        component: () => import('components/pages/erp/Medal/MedalManage')
      }
    ]
  }
]
