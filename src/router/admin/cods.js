import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/cods',
    component: LayoutAdmin,
    children: [
      {
        path: 'note',
        component: () => import('components/cods/ManagerCodNote')
      },
      {
        path: 'message',
        component: () => import('components/cods/MessageCod')
      },
      {
        path: 'ctv',
        component: () => import('components/cods/CtvCod')
      },
      {
        path: 'ctv-check',
        name: 'ctv-checkSalary',
        component: () => import('components/cods/CtvCheckSalary')
      },
      {
        path: 'cod-order',
        name: 'cod-order',
        component: () => import('components/cods/CtvOrder')
      },
      {
        path: 'cod-penalties',
        name: 'cod-penalties',
        component: () => import('components/cods/ConfirmPenaltiesCod')
      }
    ]
  },
  {
    path: '/manager-files',
    component: LayoutAdmin,
    children: [
      {
        path: '/',
        component: () => import('components/pages/erp/FileDocument/FileDoc')
      }
    ]
  }
]
