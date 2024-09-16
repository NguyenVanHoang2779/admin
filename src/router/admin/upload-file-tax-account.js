import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [{
  path: '/upload-file/tax-or-account',
  component: LayoutAdmin,
  children: [{
    path: '',
    component: () => import('components/pages/home/UploadTaxCodeAndAccountNumber')
  }]
}]
