import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/profile-company',
    component: LayoutAdmin,
    children: [
      {
        path: 'masters',
        name: 'manager-master-company-profile',
        component: () => import('components/pages/erp/ProfileCompany/MasterProfileCompanyManager')
      },
      {
        path: 'master-company/add',
        name: 'add-master-profile-company',
        component: () => import('components/pages/erp/ProfileCompany/UpdateProfileCompany')
      },
      {
        path: 'master-company/edit/:id',
        name: 'edit-master-profile-company',
        component: () => import('components/pages/erp/ProfileCompany/UpdateProfileCompany')
      }
    ]
  },
  {
    path: '/user-company',
    component: LayoutAdmin,
    children: [
      {
        path: 'add/:id?',
        name: 'add-user-company',
        component: () => import('components/pages/erp/ProfileCompany/UpdateUserCompany')
      },
      {
        path: 'edit/:id',
        name: 'edit-user-company',
        component: () => import('components/pages/erp/ProfileCompany/UpdateUserCompany')
      },
      {
        path: 'detail/:id',
        name: 'detail-user-company',
        component: () => import('components/pages/erp/ProfileCompany/UpdateUserCompany')
      }
    ]
  },
  {
    path: '/vehicle-company',
    component: LayoutAdmin,
    children: [
      {
        path: 'add/:id?',
        name: 'add-vehicle-company',
        component: () => import('components/pages/erp/ProfileCompany/UpdateTrucks')
      },
      {
        path: 'edit/:id',
        name: 'edit-vehicle-company',
        component: () => import('components/pages/erp/ProfileCompany/UpdateTrucks')
      },
      {
        path: 'detail/:id',
        name: 'detail-vehicle-company',
        component: () => import('components/pages/erp/ProfileCompany/UpdateTrucks')
      },
      {
        path: 'maintenance/:id',
        name: 'edit-trucks-maintenance',
        component: () => import('components/pages/erp/ProfileCompany/UpdateTrucksMaintenanceV2')
      },
      {
        path: 'maintenance/add/:id',
        name: 'add-trucks-maintenance',
        component: () => import('components/pages/erp/ProfileCompany/UpdateTrucksMaintenanceV2')
      }
    ]
  },
  {
    path: '/air-line',
    component: LayoutAdmin,
    children: [
      {
        path: 'awbs',
        name: 'manage-awbs',
        component: () => import('components/pages/erp/AirLine/ManageAwb')
      },
      {
        path: 'awb-price',
        name: 'awb-price',
        component: () => import('components/pages/erp/AirLine/AwbPrice')
      }
    ]
  },
  {
    path: '/train',
    component: LayoutAdmin,
    children: [
      {
        path: 'train-bill',
        name: 'train-bill',
        component: () => import('components/pages/erp/Train/TrainBill')
      }
    ]
  },
  {
    path: '/truck',
    component: LayoutAdmin,
    children: [
      {
        path: 'manage/:code?',
        name: 'manage-trucks',
        component: () => import('components/pages/erp/Truck/ManageTruck')
      },
      {
        path: 'config-oil-limit',
        name: 'config-oil-limit',
        component: () => import('components/pages/erp/Truck/ConfigOilLimit')
      }
    ]
  },
  {
    path: '/truck-routes',
    component: LayoutAdmin,
    children: [
      {
        path: 'manage',
        name: 'manage-truck-routes',
        component: () => import('components/pages/erp/Truck/ManageTruckRoutes')
      },
      {
        path: 'add',
        name: 'add-truck-route',
        component: () => import('components/pages/erp/Truck/TruckRoutes')
      },
      {
        path: 'edit/:id',
        name: 'edit-truck-route',
        component: () => import('components/pages/erp/Truck/TruckRoutes')
      }
    ]
  },
  {
    path: '/bag',
    component: LayoutAdmin,
    children: [
      {
        path: 'bag-config',
        name: 'bag-config',
        component: () => import('components/pages/erp/BagConfig/BagConfig')
      }
    ]
  },
  {
    path: '/quality-config',
    component: LayoutAdmin,
    children: [
      {
        path: 'ws-quality-config',
        name: 'ws-quality-config',
        component: () => import('components/pages/erp/ConfigPhienToanTrinh/WsQualityConfig')
      },
      {
        path: 'create-ws-quality-config',
        name: 'create-ws-quality-config',
        component: () => import('components/pages/erp/ConfigPhienToanTrinh/CreateAndUpdateWsQualityConfig')
      }
    ]
  },
  {
    path: '/module',
    component: LayoutAdmin,
    children: [
      {
        path: 'module-province',
        name: 'module-province',
        component: () => import('components/pages/erp/Manager/ModuleProvince/ModuleProvince')
      }
    ]
  },
  {
    path: '/rent-truck',
    component: LayoutAdmin,
    children: [
      {
        path: 'config-province',
        name: 'config-province',
        component: () => import('components/pages/erp/RentTruck/ManageProvinceRentTruck')
      },
      {
        path: 'plan/add/:id?',
        name: 'add-truck-plan',
        component: () => import('components/pages/erp/ProfileCompany/UpdateTruckPlan')
      },
      {
        path: 'edit/:id',
        name: 'edit-truck-plan',
        component: () => import('components/pages/erp/ProfileCompany/UpdateTruckPlan')
      }
    ]
  },
  {
    path: '/rent-truck-driver',
    component: LayoutAdmin,
    children: [
      {
        path: 'add/:id?',
        name: 'add-truck-driver',
        component: () => import('components/pages/erp/ProfileCompany/UpdateTruckDriver')
      },
      {
        path: 'edit/:id',
        name: 'edit-truck-driver',
        component: () => import('components/pages/erp/ProfileCompany/UpdateTruckDriver')
      }
    ]
  }
]
