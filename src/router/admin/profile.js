import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/profile',
    component: LayoutAdmin,
    children: [
      {
        path: 'masters',
        name: 'manager-master-profile',
        component: () => import('components/pages/erp/profile/MasterProfileManager')
      },
      {
        path: 'update-main-profile',
        name: 'update-main-profile',
        component: () => import('components/pages/erp/profile/UpdateMainProfile')
      },
      {
        path: 'master/add',
        name: 'add-master-profile',
        component: () => import('components/pages/erp/common/ScreenClosed'),
        props: {
          'message': 'Màn này hiện đã đóng, vui lòng vào màn Tuyển dụng để tiếp tục thao tác hoặc liên hệ HR kho để được hỗ trợ!'
        }
      },
      {
        path: 'master/edit/:id?',
        name: 'edit-master-profile',
        component: () => import('components/pages/erp/profile/UpdateMasterProfile'),
        props: true
      },
      {
        path: 'user-lock',
        name: 'manager-user-lock',
        component: () => import('components/pages/erp/profile/UserLockAppManager')
      }
    ]
  }
]
