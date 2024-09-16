import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/prohibit-package',
    component: LayoutAdmin,
    children: [
      {
        path: 'image-product',
        name: 'prohibit-package-image-product',
        component: () => import('components/pages/ProhibitPackage/GetImageProduct')
      }
    ]
  }
]
