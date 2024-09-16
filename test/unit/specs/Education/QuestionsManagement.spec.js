import Component from '@/components/pages/erp/Education/QuestionsManagement.vue'
import { mount } from '@vue/test-utils'
import GlobalComponents from '../../globalComponents'

describe('QuestionsManagement.vue', () => {
  it('HRM-12137: renders the component with correct initial urlDownloadFile value', () => {
    const wrapper = mount(Component, {
      ...GlobalComponents
    })
    // Assert that the initial value of urlDownloadFile is as expected
    expect(wrapper.vm.urlDownloadFile).toBe('https://cache.giaohangtietkiem.vn/d/89d6bd47f07dae95fb327f1e2d01c534.xlsx')
  })
})
