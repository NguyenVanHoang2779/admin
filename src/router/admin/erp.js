import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
  // Layout 2
    path: '/staff',
    component: LayoutAdmin,
    children: [
      /* {
        path: 'search',
        component: () => import('components/pages/erp/staff/StaffSearch')
      }, */
      {
        path: 'whsearch',
        component: () => import('components/pages/erp/staff/WHStaffSearch')
      },
      {
        path: 'config',
        component: () => import('components/pages/erp/staff/ConfigLeaderAndStaff')
      }
    ]
  },
  {
    path: '/contract',
    component: LayoutAdmin,
    children: [
      {
        name: 'contract-manager',
        path: 'manager',
        component: () => import('components/pages/erp/contract/ContractManager')
      },
      {
        name: 'contract-detail',
        path: 'detail/:id?',
        component: () => import('components/pages/erp/contract/ContractDetail')
      },
      {
        name: 'contract-create',
        path: 'create/:username?',
        component: () => import('components/pages/erp/contract/ContractCreate')
      },
      {
        name: 'appendix-detail',
        path: 'appendix/:id',
        component: () => import('components/pages/erp/contract/Appendix'),
        props: true
      },
      {
        name: 'contract-edit',
        path: 'edit/:id',
        component: () => import('components/pages/erp/contract/ContractUpdate')
      },
      {
        name: 'position-detail-edit',
        path: 'position-edit',
        component: () => import('components/pages/erp/contract/PositionDetailEdit')
      }
    ]
  },
  {
    path: '/erp' +
     '/token',
    component: LayoutAdmin,
    children: [{
      name: 'manage-token',
      path: 'manage',
      component: () => import('components/pages/erp/Token/ManageToken')
    }]
  },
  {
    path: '/erp/document',
    component: LayoutAdmin,
    children: [
      {
        name: 'manage-document',
        path: 'manage',
        component: () => import('components/pages/erp/Document/DocumentManage')
      },
      {
        path: 'add/',
        name: 'document-add',
        component: () => import('components/pages/erp/Document/DocumentAddEdit')
      },
      {
        path: 'edit/:id',
        name: 'document-edit',
        component: () => import('components/pages/erp/Document/DocumentAddEdit')
      },
      {
        path: 'detail/:id',
        name: 'document-detail',
        component: () => import('components/pages/erp/Document/DocumentDetail')
      }
    ]
  }
]
