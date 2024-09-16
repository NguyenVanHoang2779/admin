import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/truck-incident',
    component: LayoutAdmin,
    children: [
      {
        path: 'manage',
        name: 'manage-truck-incident',
        component: () => import('components/pages/erp/Truck/ManageTruckIncident')
      },
      {
        path: 'add/:id?',
        name: 'add-incident',
        component: () => import('components/pages/erp/Truck/UpdateIncidents')
      },
      {
        path: 'edit/:id',
        name: 'edit-incident',
        component: () => import('components/pages/erp/Truck/UpdateIncidents')
      }
    ]
  }
]
