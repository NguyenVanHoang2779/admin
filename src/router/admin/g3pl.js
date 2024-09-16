import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/g3pl',
    component: LayoutAdmin,
    children: [
      {
        path: 'booking/create',
        name: 'g3pl-booking-create',
        component: () => import('components/pages/G3PL/CreateBookingTruck')
      }
    ]
  }
]
