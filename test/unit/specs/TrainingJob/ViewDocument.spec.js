import Component from '@/components/pages/erp/TrainingJob/ViewDocument.vue'
import { mount } from '@vue/test-utils'
import GlobalComponents from '../../globalComponents'

describe('ViewDoc.vue', () => {
  it('HRM-13003: should render correct contents', () => {
    const wrapper = mount(Component, {
      ...GlobalComponents,
      propsData: {
        lessons: [
          {
            id: 12,
            title: "test"
          },
          {
            id: 13,
            title: "test 2"
          }
        ]
      }
    })

    // Assert the rendered text of the component
    expect(wrapper.text()).toContain('test 2')
  })
})
