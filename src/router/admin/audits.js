import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/audit-shopee',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Audits/AuditShopee')
      }
    ]
  },
  {
    path: '/audit/upload-manage',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Audits/UploadManage')
      }
    ]
  },
  {
    path: '/audit/download-manage',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Audits/DownloadManage')
      }
    ]
  },
  {
    path: '/new-audit-manual',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Audits/NewAuditManual')
      }
    ]
  },
  {
    path: '/export-bill-audit',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Audits/ExportBillAudit')
      }
    ]
  },
  {
    path: '/audit-config-holiday',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Audits/AuditConfigHoliday')
      }
    ]
  }
]
