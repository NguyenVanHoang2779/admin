import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [{
  path: '/config-capacity',
  component: LayoutAdmin,
  children: [
    {
      path: 'index',
      component: () => import('components/pages/ConfigCapacity/CapacityCOD')
    }
  ]
}]
