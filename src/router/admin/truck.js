import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/trucks',
    component: LayoutAdmin,
    children: [
      {
        path: 'post-offices/',
        name: 'post-offices-configs',
        component: () => import('components/cods/PostOfficesConfig'),
        props: true
      }
    ]
  }
]
