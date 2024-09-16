import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/shop-vote',
    component: LayoutAdmin,
    children: [
      {
        path: 'manage',
        name: 'shop-vote-manage',
        component: () => import('components/pages/ShopVote/ShopVoteManage')
      }
    ]
  }
]
