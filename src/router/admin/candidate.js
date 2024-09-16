import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/candidate',
    component: LayoutAdmin,
    children: [
      {
        name: 'list-candidate',
        path: 'list/:name_cmnd_phone_mail?',
        component: () => import('components/pages/Candidate/CandidateManager.vue'),
        props: true
      },
      {
        name: 'create-candidate',
        path: 'create',
        component: () => import('components/pages/erp/Uni/Recruitment/CreateCandidate.vue'),
        props: true
      },
      {
        name: 'add-candidate',
        path: 'add',
        component: () => import('components/pages/Candidate/ModalEditCandidate.vue'),
        props: {
          Hrview: true,
          type: 'create'
        }
      },
      {
        name: 'edit-candidate',
        path: 'edit/:id',
        component: () => import('components/pages/Candidate/ModalEditCandidate.vue'),
        props: {
          Hrview: true,
          type: 'edit'
        }
      },
      {
        name: 'evaluate-candidate',
        path: 'evaluate/:id',
        component: () => import('components/pages/Candidate/EvaluateCandidate.vue'),
        props: {
          Hrview: true,
          type: 'evaluate'
        }
      }
    ]
  },
  {
    path: '/ref-reward',
    component: LayoutAdmin,
    children: [
      {
        name: 'ref-reward',
        path: '/',
        component: () => import('components/pages/Candidate/ReferenceRewardManage.vue')
      }
    ]
  }
]
