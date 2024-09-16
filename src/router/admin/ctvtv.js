import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/ctvtv',
    component: LayoutAdmin,
    children: [
      {
        path: 'config',
        name: 'config-remuneration-package',
        component: () => import('components/pages/Ctvtv/Config')
      },
      {
        path: 'campaign',
        name: 'manager-campaign',
        component: () => import('components/pages/Ctvtv/Campaign')
      },
      {
        path: 'config-campaign',
        name: 'config-campaign',
        component: () => import('components/pages/Ctvtv/ConfigCampaign')
      }
    ]
  }
]
