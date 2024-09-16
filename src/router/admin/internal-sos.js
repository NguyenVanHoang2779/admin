import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/sos-noi-bo',
    component: LayoutAdmin,
    children: [
      {
        path: 'thong-ke',
        component: () => import('components/pages/Ticket/InternalSos/StatisticTicket')
      },
      // {
      //   path: 'xu-ly-sos',
      //   name: 'execution-sos',
      //   component: () => import('components/pages/Ticket/InternalSos/InternalSosTicket')
      // },
      {
        path: 'config-type',
        component: () => import('components/pages/Ticket/InternalSos/ConfigTypeTicket')
      }
    ]
  }
]
