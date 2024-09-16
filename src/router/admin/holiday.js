import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/holiday-workshift',
    component: LayoutAdmin,
    children: [
      {
        path: 'manage',
        component: () => import('components/pages/erp/Holiday-config/HolidayworkshiftManage')
      }
    ]
  }
]
