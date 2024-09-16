import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/team-config',
    component: LayoutAdmin,
    children: [
      {
        name: 'list-team-config',
        path: 'list',
        component: () => import('components/pages/erp/TeamConfig/TeamConfigBoard'),
        meta: {
          // middleware: [authIam]
        }

      },
      {
        name: 'list-team-config-new',
        path: 'list-new',
        component: () => import('components/pages/erp/TeamConfig/TeamConfigBoardNew'),
        meta: {
          // middleware: [authIam]
        }

      }
    ]
  }
]
