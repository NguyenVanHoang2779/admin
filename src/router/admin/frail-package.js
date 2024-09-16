import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/frail-package',
    component: LayoutAdmin,
    children: [
      {
        path: 'list',
        name: 'frail-package',
        component: () => import('components/pages/ManageFrailPackage/FrailPackage')
      }
    ]
  }
]
