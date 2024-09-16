import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/profile-manager',
    component: LayoutAdmin,
    children: [
      // {
      //   path: '/',
      //   name: 'profile-manager',
      //   component: () => import('components/pages/erp/ProfileManager/ProfileManager')
      // },
      {
        path: '/config-type',
        name: 'config-type',
        component: () => import('components/pages/erp/ProfileManager/ConfigTypes')
      },
      {
        path: '/config',
        name: 'config-position',
        component: () => import('components/pages/erp/ProfileManager/ConfigPositionDocument')
      },
      {
        path: '/analytic',
        name: 'document-analytic',
        component: () => import('components/pages/erp/ProfileManager/Analytic')
      }
    ]
  }
]
