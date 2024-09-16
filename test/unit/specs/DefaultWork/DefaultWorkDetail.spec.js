import { mount } from '@vue/test-utils'
import Component from '@/components/pages/erp/profile/DefaultWorkDetail.vue'

import GlobalComponents from '@test/unit/globalComponents'

describe('DefaultWorkDetail.vue', () => {
  it('HRM-12833: should render correct contents', () => {
    const wrapper = mount(Component, {
      ...GlobalComponents,
      propsData: {
        configDefaultWork: [
          {
            from_date: '2023-12-21',
            to_date: '2023-12-31',
            alias_job: ['labeling']
          }
        ]
      }
    })

    // Assert the rendered text of the component
    expect(wrapper.text()).toContain('Chia hàng')
  })
})

describe('DefaultWorkDetail.vue', () => {
  it('HRM-12833: remove first config', done => {
    const wrapper = mount(Component, {
      ...GlobalComponents,
      propsData: {
        configDefaultWork: [
          {
            from_date: '2023-12-21',
            to_date: '2024-01-11',
            alias_job: ['labeling']
          },
          {
            from_date: '2024-01-12',
            to_date: null,
            alias_job: ['sorting_bag']
          }
        ]
      }
    })

    // Assert the rendered text of the component
    wrapper.find('button.remove-config').trigger('click')
      .then(() => {
        wrapper.vm.removeConfig(0)
        expect(wrapper.vm.default_work.length).toBe(1)
        expect(wrapper.vm.default_work[0].from_date).toBe('2024-01-12')
        done()
      })
  })
})

describe('DefaultWorkDetail.vue', () => {
  it('HRM-12833: remove last config', done => {
    const configDefaultWork = [
      {
        from_date: '2023-12-21',
        to_date: '2024-01-11',
        alias_job: ['labeling']
      },
      {
        from_date: '2024-01-12',
        to_date: null,
        alias_job: ['sorting_bag']
      }
    ]
    const wrapper = mount(Component, {
      ...GlobalComponents,
      propsData: {
        configDefaultWork: configDefaultWork
      }
    })

    // Assert the rendered text of the component
    wrapper.find('button.remove-config').trigger('click')
      .then(() => {
        wrapper.vm.removeConfig(configDefaultWork.length - 1)
        expect(wrapper.vm.default_work.length).toBe(1)
        expect(wrapper.vm.default_work[0].from_date).toBe('2023-12-21')
        done()
      })
  })
})
