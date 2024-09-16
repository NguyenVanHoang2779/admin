import { mount } from '@vue/test-utils'
import TrainingBoard from '@/components/pages/erp/ClosingShift/TrainingBoard.vue'

import GlobalComponents from '@test/unit/globalComponents'
import InfiniteLoading from 'vue-infinite-loading'

describe('TrainingBoard.vue', () => {
  it('HRM-13324: check logic sort list user', async () => {
    const data = {
      listUsers: [
        {
          explanation_reason_id: 1,
          id: 1,
          logs: [
            {
              action: 'explainLockShift',
              created: '2024-01-23 10:55:58',
              created_by: '674921',
              id: 1,
              message: 'lienht6 - Nhân sự Đào tạo giải trình học viên Trần Viết Dũng (dungtv143) chưa điểm danh: <b>HR không xếp lớp</b>'
            },
            {
              action: 'otherAction',
              created: '2024-02-23 10:55:55',
              created_by: '674921',
              id: 2,
              message: 'lienht6 - Nhân sự Đào Tạo comment'
            },
            {
              action: 'explainLockShift',
              created: '2024-02-23 10:55:55',
              created_by: '674921',
              id: 3,
              message: 'lienht6 - Nhân sự Đào tạo giải trình học viên Trần Viết Dũng (dungtv143) chưa điểm danh: <b>HR không xếp lớp</b>'
            }
          ]
        },
        {
          explanation_reason_id: null,
          id: 2
        },
        {
          explanation_reason_id: 1,
          id: 3,
          logs: [
            {
              action: 'otherAction',
              created: '2024-02-24 10:55:55',
              created_by: '674921',
              id: 2,
              message: 'lienht6 - Nhân sự Đào Tạo comment'
            },
            {
              action: 'explainLockShift',
              created: '2024-01-23 10:55:55',
              created_by: '674921',
              id: 3,
              message: 'lienht6 - Nhân sự Đào tạo giải trình học viên Trần Viết Dũng (dungtv143) chưa điểm danh: <b>HR không xếp lớp</b>'
            }
          ]
        },
      ]
    }
    const wrapper = mount(TrainingBoard, {
      ...GlobalComponents,
      stubs: {
        InfiniteLoading: true,
        'b-btn': true,
        'b-modal': true
      }
    })

    await wrapper.setData(data)

    wrapper.vm.sortListUsers()

    expect(wrapper.vm.listUsers[0].id).toBe(2)
    expect(wrapper.vm.listUsers[2].id).toBe(1)
  })

  it('HRM-13324: check logic get last explained log', () => {
    const data = {
      listUsers: [
        {
          explanation_reason_id: 1,
          id: 1
        },
        {
          explanation_reason_id: null,
          id: 2
        }
      ]
    }
    const wrapper = mount(TrainingBoard, {
      ...GlobalComponents,
      stubs: {
        InfiniteLoading: true,
        'b-btn': true,
        'b-modal': true
      }
    })

    wrapper.setData(data)

    let listLogs = [
      {
        action: 'explainLockShift',
        created: '2024-01-23 10:55:58',
        created_by: '674921',
        id: 1,
        message: 'lienht6 - Nhân sự Đào tạo giải trình học viên Trần Viết Dũng (dungtv143) chưa điểm danh: <b>HR không xếp lớp</b>'
      },
      {
        action: 'otherAction',
        created: '2024-02-23 10:55:55',
        created_by: '674921',
        id: 2,
        message: 'lienht6 - Nhân sự Đào Tạo comment'
      },
      {
        action: 'explainLockShift',
        created: '2024-02-23 10:55:55',
        created_by: '674921',
        id: 3,
        message: 'lienht6 - Nhân sự Đào tạo giải trình học viên Trần Viết Dũng (dungtv143) chưa điểm danh: <b>HR không xếp lớp</b>'
      }
    ]
    let lastLog = wrapper.vm.getLastExplainedLog(listLogs)

    expect(lastLog.id).toBe(3)
  })
})
