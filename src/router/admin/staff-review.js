import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/staff-review',
    component: LayoutAdmin,
    children: [
      {
        path: '/',
        name: 'staff-review',
        component: () => import('components/pages/erp/StaffReview/ManagerStaffReview')
      }
    ]
  }
]
