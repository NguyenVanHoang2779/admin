import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [{
  path: '/log-bag-order',
  component: LayoutAdmin,
  children: [
    {
      path: 'list',
      component: () => import('components/pages/logBagOrder/LogBagOrder')
    }
  ]
}]
