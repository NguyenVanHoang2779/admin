import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/sales',
    component: LayoutAdmin,
    children: [
      {
        path: 'show-salary',
        component: () => import('components/pages/erp/Sale/ShowSaleSalary')
      },
      {
        path: 'team-process',
        component: () => import('components/pages/erp/Sale/ProcessTeam')
      },
      {
        path: 'check-duplicate-shop',
        component: () => import('components/pages/erp/Sale/CheckDuplicateShop')
      },
      {
        path: 'update-shop-package',
        component: () => import('components/pages/erp/Sale/UpdateShopPackage')
      },
      {
        path: 'export-data-shop',
        component: () => import('components/pages/erp/Sale/ExportDataShop')
      },
      {
        path: 'manager-sale-team',
        component: () => import('components/pages/erp/Sale/ManagerSaleTeam')
      },
      {
        path: 'manage-export-sale-salary',
        component: () => import('components/pages/erp/Sale/ManageExportSaleSalary')
      },
      {
        path: 'manage-export-excel',
        component: () => import('components/pages/erp/Salary/ConfigCheckinComponent/ManageExportExcel')
      },
      {
        path: 'export-sale-day',
        component: () => import('components/pages/erp/Sale/ExportSalaryDay')
      },
      {
        path: 'check-incident-sale',
        component: () => import('components/pages/erp/Sale/CheckIncidentSale')
      },
      {
        path: 'sale-formula',
        component: () => import('components/pages/erp/Sale/SaleFormula')
      },
      {
        path: 'sale-region',
        component: () => import('components/pages/erp/Sale/ConfigRegionSale')
      },
      {
        path: 'support-salary-sale',
        component: () => import('components/pages/erp/Sale/SupportSalarySale')
      },
      {
        path: 'export-data-shop-bbs',
        component: () => import('components/pages/erp/Sale/ExportDataShopBbs')
      }
    ]
  }
]
