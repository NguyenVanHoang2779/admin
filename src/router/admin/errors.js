import LayoutError from 'components/layout/LayoutError'

export default [{
  // Layout 2
  path: '/error',
  component: LayoutError,
  children: [
    {
      path: '404',
      name: 'error-404',
      component: () => import('components/pages/Errors/404')
    },
    {
      path: '403',
      name: 'error-403',
      component: () => import('components/pages/Errors/403')
    }
  ]
}]
