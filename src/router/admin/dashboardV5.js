import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [{
  path: '/dashboard/v5',
  component: LayoutAdmin,
  children: [{
    path: '',
    component: () => import('components/pages/home/DashboardV5')
  }]
}]
