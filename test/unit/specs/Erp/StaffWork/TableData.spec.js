import { mount } from '@vue/test-utils'
import TableData from '@/components/pages/erp/StaffWork/TableData.vue'

import GlobalComponents from '@test/unit/globalComponents'
import InfiniteLoading from 'vue-infinite-loading'
import CheckinLogDetailV2 from "../../../../../src/components/pages/erp/StaffWork/checkinLogDetailV2";
import ContractLogDetail from "../../../../../src/components/pages/erp/StaffWork/ContractLogDetail";
import ProfileWalletRowData from "../../../../../src/components/pages/erp/StaffWork/ProfileWalletRowData";
import ModalNote from "../../../../../src/components/pages/erp/StaffWork/ModalNote";
import CensorV3 from "../../../../../src/components/pages/erp/StaffOnboard/CensorV3";
import ModalExplanation from "../../../../../src/components/pages/erp/ClosingShift/ModalExplanation";

describe('TrainingBoard.vue', () => {
  it('HRM-13347: check logic get last explained log', () => {
    const data = {
      listData: [
        {
          order_id: 1,
          explained: true,
          logs: [
            {
              type: 'explain',
              id: 1,
            }
          ]
        },
      ]
    }
    const wrapper = mount(TableData, {
      ...GlobalComponents,
      stubs: {
        InfiniteLoading: true,
        'b-btn': true,
        'b-modal': true,
        EkycImageChangeRowData: true,
        ReportLostIdentityCard: true,
        ModalUpdateCheckin: true,
        DetailWorkShift: true,
        CheckinLogDetailV2: true,
        OrderRowDataV2: true,
        Censor: true,
        CensorV2: true,
        HrTagModal: true,
        ContractLogDetail: true,
        UpdateOrder: true,
        ProfileWalletRowData: true,
        ModalNote: true,
        CensorV3: true,
        ModalExplanation: true,
        ModalCheckBeforeApproveContract: true
      }
    })

    wrapper.setData(data)

    let listLogs = [
      {
        id: 2,
        type: 'create',
        created: '2024-02-23 10:55:55',
        created_by: '674921',
        message: 'tạo đề xuất do hồ sơ nhân sự mới được duyệt'
      },
      {
        id: 2,
        type: 'explain',
        created: '2024-03-13 10:55:58',
        created_by: '674921',
        message: 'giai trinh'
      },
      {
        id: 3,
        action: 'explain',
        created: '2024-02-23 10:55:55',
        created_by: '674921',
        message: 'giai trinh 2'
      }
    ]
    let lastLog = wrapper.vm.getLastExplainedLog(listLogs)

    expect(lastLog.id).toBe(2)
  })
})
