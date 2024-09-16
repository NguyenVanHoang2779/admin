import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/recruitment',
    component: LayoutAdmin,
    children: [
      {
        name: 'create-candidate',
        path: 'candidate/create',
        component: () => import('components/pages/erp/Uni/Recruitment/CreateCandidate.vue'),
        props: true
      },
      {
        name: 'update-candidate',
        path: 'candidate/edit/:id',
        component: () => import('components/pages/erp/Uni/Recruitment/UpdateCandidate.vue'),
        props: true
      },
      {
        name: 'candidates',
        path: 'recruitment',
        component: () => import('components/pages/erp/Uni/Recruitment/CandidateManagement'),
        props: true
      }
    ]
  }
]
