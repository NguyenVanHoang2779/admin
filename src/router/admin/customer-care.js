import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/customer-cares',
    component: LayoutAdmin,
    children: [
      {
        path: 'leader-member-b2c',
        component: () => import('components/pages/erp/CustomerCare/ManagerCSKHB2C')
      },
      {
        path: 'export-salary',
        component: () => import('components/pages/erp/CustomerCare/ExportSalary')
      },
      {
        path: 'export-shop-gone-away',
        component: () => import('components/pages/erp/CustomerCare/ExportShopGoneAway')
      },
      {
        path: 'check-data-salary',
        component: () => import('components/pages/erp/CustomerCare/CheckDataSalary')
      },
      {
        path: 'run-export-salary-c2c',
        component: () => import('components/pages/erp/CustomerCare/ExportSalaryC2c')
      },
      {
        path: 'manage-shop-duplicate',
        component: () => import('components/pages/erp/CustomerCare/ManageDuplicateShop')
      },
      {
        path: 'export-order',
        component: () => import('components/pages/erp/CustomerCare/ExportOrderShop')
      }
    ]
  }
]
