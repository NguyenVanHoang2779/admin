import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/shops/shopIncorrectBankInfo',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/ShopIncorrectBankInfo')
      }
    ]
  },
  {
    path: '/shops/leader-sale-b2c',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/AssignLeaderSaleB2C')
      }
    ]
  },
  {
    path: '/shops/return-coupon',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/ReturnCoupon')
      }
    ]
  },
  {
    path: '/shops/return-coupon-result',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/ReturnCouponResult')
      }
    ]
  },
  {
    path: '/shops/return-coupon-update',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/ReturnCouponUpdate')
      }
    ]
  },
  {
    path: '/shops/manage-new-deduction',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Deductions/ManageNewDeduction')
      }
    ]
  },
  {
    path: '/shops/new-deduction',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/NewDeduction')
      }
    ]
  },
  {
    path: '/shops/new-deduction-result',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/NewDeductionResult')
      }
    ]
  },
  {
    path: '/shops/new-deduction-update',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/NewDeductionUpdate')
      }
    ]
  },
  {
    path: '/shops/download-b2c-shop',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/DownloadB2cShop')
      }
    ]
  },
  {
    path: '/shops/info-shop-debt',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/InfoShopDebt')
      }
    ]
  },
  {
    path: '/shops/assign-pkonsite',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/AssignPkOnsite')
      }
    ]
  },
  {
    path: '/shops/award',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/ShopAward')
      }
    ]
  },
  {
    path: '/shops/assign-presenter',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/AssignPresenter')
      }
    ]
  },
  {
    path: '/shops/cause',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/ManageCause')
      }
    ]
  },
  {
    path: '/shops/branch',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/ManageBranch')
      }
    ]
  },
  {
    path: '/shops/download-zip-file-deduction',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Shops/DownloadZipFileDeduction')
      }
    ]
  }
]
