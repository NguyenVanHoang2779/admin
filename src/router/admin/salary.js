import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    // Layout 2
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'update-area',
        component: () => import('components/pages/erp/Salary/UpdatePackageSalaryArea')
      }
    ]
  },
  {
    // Layout 2
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'export-work-data',
        component: () => import('components/pages/erp/Salary/ExportDataWork')
      }
    ]
  },
  {
    // Layout 2
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'update-package-area-excel',
        component: () => import('components/pages/erp/Salary/UpdatePackageAreaExcel')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'show-area-packages',
        component: () => import('components/pages/erp/Salary/ShowAreaSalaryPackages')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'update-area-by-cod',
        component: () => import('components/pages/erp/Salary/UpdatePackageAreaByCod')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'extra-route-configs',
        component: () => import('components/pages/erp/Salary/ExtraRouteConfig')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'collection-salary-tools',
        component: () => import('components/pages/erp/Salary/CollectionSalaryTools')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'driver-data-work-manager',
        component: () => import('components/pages/erp/Salary/DriverDataWorkManager')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'wh-staff-salary-tools',
        component: () => import('components/pages/erp/Salary/WHStaffSalaryTools')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'export-province-office-staff-salary',
        component: () => import('components/pages/erp/Salary/ExportProvinceOfficeStaffSalary')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'export-city-office-staff-salary',
        component: () => import('components/pages/erp/Salary/ExportCityOfficeStaffSalary')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'export-office-staff-online-salary',
        component: () => import('components/pages/erp/Salary/ExportOfficeStaffOnlineSalary')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'minimum-cod-salary',
        component: () => import('components/pages/erp/Salary/ConfigMinimumCodSalary')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'transit-data-work-manager',
        component: () => import('components/pages/erp/Salary/TransitDataWorkManager')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'config-checkin-cod',
        component: () => import('components/pages/erp/Salary/ConfigCheckinCod')
      },
      // {
      //   path: 'config-checkin-cod-v2',
      //   component: () => import('components/pages/erp/Salary/ConfigCheckinCodV2')
      // },
      {
        path: 'manage-checkin-cod',
        component: () => import('components/pages/erp/Salary/ManageCheckinCod')
      },
      {
        path: 'config-checkin-pkbus',
        component: () => import('components/pages/erp/Salary/ConfigCheckinPkbus')
      },
      {
        path: 'config-checkin-cod-v3',
        component: () => import('components/pages/erp/Salary/ConfigCheckinCodV3')
      },
      // {
      //   path: 'export-data-checkin-pk',
      //   component: () => import('components/pages/erp/Salary/ManageDataCheckinPk')
      // },
      {
        path: 'export-data-checkin-pkV2',
        component: () => import('components/pages/erp/Salary/ManageDataCheckinPkV2')
      },
      {
        path: 'manage-export-excel',
        component: () => import('components/pages/erp/Salary/ConfigCheckinComponent/ManageExportExcel')
      },
      {
        path: 'manage-salary-cod-province',
        component: () => import('components/pages/erp/Salary/CodProvince/ManageSalaryCodProvince')
      },
      {
        path: 'config-cod-index',
        component: () => import('components/pages/erp/Salary/ConfigCodIndex/index')
      },
      {
        path: 'export-salary-lv',
        component: () => import('components/pages/erp/Salary/ExportSalaryLV')
      },
      {
        path: 'optimize-salary-cod-province',
        component: () => import('components/pages/erp/Salary/CodProvince/OptimizeCodProvince')
      },
      {
        path: 'config-salary-cod',
        component: () => import('components/pages/erp/Salary/ConfigSalaryCod/ConfigSalaryCod')
      },
      {
        path: 'sgw-config-pk-part-time',
        component: () => import('components/pages/erp/Salary/SgwConfigPkPartTime')
      },
      {
        path: 'export-salary-nv',
        component: () => import('components/pages/erp/Salary/ErpSalaryNV')
      },
      {
        path: 'export-salary',
        component: () => import('components/pages/erp/Salary/ErpExportSalary')
      }
    ]
  },
  {
    // xuat luong cho tai xe
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'export-driver-salary',
        component: () => import('components/pages/erp/Salary/ExportSalaryDriver')
      }
    ]
  },
  {
    // bo toan trinh
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'quality-config-v2',
        component: () => import('components/pages/erp/Salary/BoToanTrinh/RemoveQuality')
      }
    ]
  },
  {
    // xuat thong tin thao tac bot cua tai xe
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'export-bot-driver',
        component: () => import('components/pages/erp/Salary/ExportBotDriver')
      }
    ]
  },
  {
    // Xuat cuoc xe thue
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'export-rent-truck-price',
        component: () => import('components/pages/erp/Salary/RentTruckPrice')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'review-driver-ot-session',
        component: () => import('components/pages/erp/Salary/ReviewDriverOtSession')
      }
    ]
  },
  {
    // Xuất lương cho cod trung chuyển tỉnh
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'export-transit-cod',
        component: () => import('components/pages/erp/Salary/ExportTransitCodSalary')
      }
    ]
  },
  {
    // Lấy dữ liệu lương cho tài xế
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'driver-salary-data',
        component: () => import('components/pages/erp/Salary/DriverStatistic/ShowDriverSalaryInMonth')
      }
    ]
  },
  {
    // Lấy dữ liệu phiên của tài xế theo id phiên
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'driver-session-data',
        component: () => import('components/pages/erp/Salary/DriverStatistic/DriverDataSessionbyId')
      }
    ]
  },
  {
    // Lấy dữ liệu xe thuê theo người dùng và kỳ lương
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'rent-truct-cost-data',
        component: () => import('components/pages/erp/Salary/DriverStatistic/RentTruckCostInMonth')
      }
    ]
  },
  {
    // Lấy dữ liệu xe thuê theo người dùng và kỳ lương
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'cod-start',
        component: () => import('components/pages/erp/kpi/cods/CodStar.vue')
      }
    ]
  },
  {
    path: '/salary',
    component: LayoutAdmin,
    children: [
      {
        path: 'training-cod',
        component: () => import('components/pages/erp/kpi/cods/CodTrainingHouse.vue')
      }
    ]
  },
  {
    // lịch sử cod trung chuyen tinh
    path: '/historytransits',
    component: LayoutAdmin,
    children: [{
      path: '',
      component: () => import('components/pages/erp/Salary/SalaryTransitsCodHistory')
    }]
  },
  {
    // Xuất dữ liệu điểm dừng tài xế
    path: '/export-driver-session-point',
    component: LayoutAdmin,
    children: [{
      path: '',
      component: () => import('components/pages/erp/Salary/ExportSessionPointDriver')
    }]
  },
  {
    // Xuất dữ liệu điểm dừng tài xế
    path: '/export-salary-pk-parttime',
    component: LayoutAdmin,
    children: [{
      path: '',
      component: () => import('components/pages/erp/Salary/ExportSalaryPkParttime')
    }]
  },
  {
    // Xuất dữ liệu điểm dừng tài xế
    path: '/export-salary-xlh-2021',
    component: LayoutAdmin,
    children: [{
      path: '',
      component: () => import('components/pages/erp/Salary/ExportSalaryXLH2021')
    }]
  },
  {
    // Xuất dữ liệu điểm dừng tài xế
    path: '/export-salary-xlh-buucuc-2021',
    component: LayoutAdmin,
    children: [{
      path: '',
      component: () => import('components/pages/erp/Salary/ExportSalaryXLHBuuCuc2021')
    }]
  },
  {
    // Xuất dữ liệu lương xlh-onsite
    path: '/salary/export-salary-xlh-onsite-2020',
    component: LayoutAdmin,
    children: [{
      path: '',
      component: () => import('components/pages/erp/Salary/ExportSalaryXlhOnsite2020')
    }]
  },
  {
    // Màn config các chỉ số
    path: '/config-driver-value',
    component: LayoutAdmin,
    children: [{
      path: '',
      component: () => import('components/pages/erp/Salary/DriverConfig/AdminDriverConfig')
    }]
  }
]
