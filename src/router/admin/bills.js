import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/bills/billCod',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Bills/BillCod')
      }
    ]
  },
  {
    path: '/bills/download-manage',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Bills/DownloadManage')
      }
    ]
  },
  {
    path: '/bills/pay-part-debt',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Bills/PayPartDebt')
      }
    ]
  }
]
