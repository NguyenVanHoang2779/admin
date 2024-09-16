import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/parking',
    component: LayoutAdmin,
    children: [
      {
        name: '',
        path: 'manage',
        component: () => import('components/pages/erp/StationParking/ParkingManagement.vue')
      }
    ]
  }
]
