import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [{
  path: '/erp/profile',
  component: LayoutAdmin,
  children: [
    {
      path: 'template-manage',
      name: 'template-manage',
      component: () => import('components/pages/erp/Template/TemplateManage')
    }
  ]
}]
