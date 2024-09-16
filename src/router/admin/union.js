import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/union',
    component: LayoutAdmin,
    children: [
      {
        path: 'manager/:id?',
        name: 'union',
        component: () => import('components/pages/Union/ManagerUnion')
      }
    ]
  }
]
