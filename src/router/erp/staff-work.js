import ContractSign from 'components/pages/erp/HrOrder/ContractSign'
import MasterProfileManager from 'components/pages/erp/profile/MasterProfileManager'
import DriverX from 'components/pages/erp/Driverx/ListJobs'
import ClassManager from 'components/pages/erp/TrainingJob/ClassManager'
import Deposit from 'components/pages/Payslip/Deposit/Deposit'
import EvaluationManager from 'components/pages/Evaluation/EvaluationManager'
import StationOperationDash from 'components/pages/erp/StationDash/StationOperationDash'
import WorkDashboard from 'components/pages/erp/StaffWork/WorkDashboard'
import StopWorkDashboard from 'components/pages/erp/StaffStopWork/StopWorkDashboard'
import ClosingShiftBoard from 'components/pages/erp/ClosingShift/ClosingShiftBoard'
import CheckinManager from 'components/pages/erp/CheckinManager/CheckinManager'
import ContentWorkIframe from 'components/pages/erp/StaffWork/ContentWorkIframe'
// import CandidateManager from 'components/pages/erp/Candidate/CandidateManager'
import StaffOnboardDashboard from 'components/pages/erp/StaffOnboard/StaffOnboardDashboard'
import EducationBoard from 'components/pages/erp/Education/EducationBoard'
import StaffResignWorkDashboard from 'components/pages/erp/StaffResignWork/StaffResignWorkDashboard'
import QuestionsManagement from '../../components/pages/erp/Education/QuestionsManagement'
import RookieManager from 'components/pages/erp/TrainingJob/RookieManager'
import StaffManagement from '../../components/pages/erp/StaffManagement/StaffManagement.vue'
import authIam from '../middleware/auth-iam'
import ManagerTags from 'components/pages/erp/ManagerTags/ManagerTags'
// import StaffSupportWorkDashboard from 'components/pages/erp/StaffEngagementProposal/StaffSupportWorkDashboard'
import CandidateManagement from '../../components/pages/erp/Uni/Recruitment/CandidateManagement.vue'
import TakeCare from 'components/pages/erp/TakeCare/TakeCare'

export default [
  {
    name: 'statistic',
    path: '/staff-work',
    component: ContentWorkIframe,
    children: [
      // {
      //   path: 'recruitment',
      //   component: CandidateManager,
      //   props: {
      //     blankMode: true
      //   }
      // },
      {
        path: 'recruitment',
        component: CandidateManagement,
        props: {
          blankMode: true
        }
      },
      {
        path: 'onboard',
        component: StaffOnboardDashboard,
        props: {
          scrollMode: true
        }
      },
      {
        path: 'contracts',
        component: ContractSign,
        props: {
          class: 'w-100'
        }
      },
      {
        path: 'master-profile',
        component: MasterProfileManager,
        props: {
          blankMode: true,
          profileStatus: 'not_verified'
        }
      },
      {
        path: 'driverx',
        component: DriverX,
        props: {
          class: "{'font-smaller': true}",
          menuWork: true,
          scrollMode: true,
          smallScreen: true,
          blankMode: true
        }
      },
      {
        name: 'class-manager',
        path: 'classes',
        component: ClassManager,
        props: {
          menuWork: true
        }
      },
      {
        name: 'syllabus-manager',
        path: 'syllabus',
        component: EducationBoard,
        props: {
          scrollMode: true
        }
      },
      {
        path: 'rookie',
        component: RookieManager,
        props: {
          scrollMode: true
        }
      },
      {
        path: 'tags-management',
        component: ManagerTags,
        props: {
          scrollMode: true
        }
      },
      {
        path: 'questions',
        component: QuestionsManagement
      },
      {
        path: 'deposit',
        component: Deposit,
        props: {
          scrollMode: true
        }
      },
      {
        path: 'f-star',
        component: EvaluationManager,
        props: {
          scrollMode: true
        }
      },
      {
        path: 'station-operation',
        component: StationOperationDash
      },
      // {
      //   path: 'hubs',
      //   component: HubDashboard
      // },
      {
        path: 'works',
        component: WorkDashboard
      },
      {
        path: 'stop-working',
        component: StopWorkDashboard
      },
      {
        path: 'closing-shift',
        component: ClosingShiftBoard
      },
      {
        path: 'checkin',
        component: CheckinManager,
        props: {
          scrollMode: true
        }
      },
      {
        path: 'staff-resign',
        component: StaffResignWorkDashboard,
        props: {
          scrollMode: true
        }
      },
      {
        path: 'staff-management',
        component: StaffManagement,
        props: {
          scrollMode: true
        },
        meta: {
          middleware: [authIam]
        }
      },
      /*
      {
        path: 'staff-support',
        component: StaffSupportWorkDashboard,
        props: {
          scrollMode: true
        }
      },
      */
      {
        path: 'take-care',
        component: TakeCare,
        props: {
          scrollMode: true
        }
      }
    ]
  }
]
