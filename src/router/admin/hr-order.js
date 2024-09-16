import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/hr-order',
    component: LayoutAdmin,
    children: [
      {
        name: 'list-order',
        path: 'list/:orderCode?',
        component: () => import('components/pages/erp/HrOrder/OrderDashboardChat.vue'),
        props: true
      },
      {
        name: 'create-order',
        path: 'create/:profileId?/:orderType?',
        component: () => import('components/pages/erp/HrOrder/UpdateOrder.vue'),
        props: true
      },
      {
        name: 'update-order',
        path: 'update/:idOrder?',
        component: () => import('components/pages/erp/HrOrder/UpdateOrder.vue'),
        props: true
      }
    ]
  }
]
