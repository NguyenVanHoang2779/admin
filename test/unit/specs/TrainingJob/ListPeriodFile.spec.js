import Component from '@/components/pages/erp/TrainingJob/ListPeriodFile.vue'
import { mount } from '@vue/test-utils'
import GlobalComponents from '../../globalComponents'

describe('ListPeriodFile.vue', () => {
  it('HRM-13003: should render correct contents', () => {
    const wrapper = mount(Component, {
      ...GlobalComponents,
      propsData: {
        periods: [
          {
            ErpTpClassPeriod: {
              id: 1223
            },
            ErpTpPeriod: {
              content: "Hướng dẫn thực hiện Quy định Tuân thủ tại GHTK",
              order_number: 1
            },
            file: [{
              file_id: "4032",
              title: "video"
            }],
            num_file: 1
          },
          {
            ErpTpClassPeriod: {
              id: 122
            },
            ErpTpPeriod: {
              content: "Hướng dẫn thực hiện Quy định Tuân thủ tại GHTK",
              order_number: 2
            },
            file: [
              {
                file_id: null,
                title: "CS BUYER T3+T4"
              },
              {
                file_id: null,
                title: "CS BUYER T3+T4"
              }
            ],
            num_file: 2
          }
        ]
      }
    })

    // Assert the rendered text of the component
    expect(wrapper.text()).toContain('Tài liệu buổi 1')
  })
})
