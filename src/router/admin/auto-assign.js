import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [{
  path: '/auto-assign',
  component: LayoutAdmin,
  children: [
    {
      path: 'list',
      component: () => import('components/pages/AutoAssignPackage/AutoAssign')
    },
    {
      path: 'add',
      component: () => import('components/pages/AutoAssignPackage/AddConfig'),
      props: {
        Hrview: true,
        type: 'add'
      }
    },
    {
      path: 'edit/:id',
      component: () => import('components/pages/AutoAssignPackage/AddConfig'),
      props: {
        Hrview: true,
        type: 'edit'
      }
    },
    {
      path: 'config-cart/:id',
      component: () => import('components/pages/AutoAssignPackage/AddConfigCart')
    }
  ]
}]
