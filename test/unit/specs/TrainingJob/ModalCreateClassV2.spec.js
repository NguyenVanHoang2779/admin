import Component from '@/components/pages/erp/TrainingJob/ModalCreateClassV2.vue'
import { mount } from '@vue/test-utils'
import globalComponents from "../../globalComponents";

describe('ModalCreateClassV2.vue', async () => {
  it('HRM-13904: should render correct contents', async() => {
    const wrapper = mount(Component, {
      ...globalComponents,
      propsData: { syllabusFilter: {
          classIds: []
        }}
    })

    wrapper.vm.$data.createClass.stationId = 2
    wrapper.vm.$data.currentPage = 1
    wrapper.vm.$data.totalPage = 10

    await wrapper.vm.checkScroll({
      target: {
        offsetWidth: 100,
        scrollLeft: 100,
        scrollWidth: 100
      }
    })

    // Assert the rendered text of the component
    expect(wrapper.text()).toContain('Tạo lớp học')
  })
})
