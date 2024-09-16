import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/new-quick-transfer',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Transfer/NewQuickTransfer')
      }
    ]
  },
  {
    path: '/confirm-quick-transfer',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Transfer/ConfirmQuickTransfer')
      }
    ]
  }
]
