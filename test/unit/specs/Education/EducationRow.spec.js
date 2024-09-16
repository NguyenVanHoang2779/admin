import Component from '@/components/pages/erp/Education/EducationRow.vue'
import { mount } from '@vue/test-utils'
import trainingUniService from '@/domain/services/Erp/HrmUni/training-service'
import globalComponents from "../../globalComponents";

jest.mock('domain/services/Erp/HrmUni/training-service', () => ({
  getLogSyllabus: jest.fn()
}))
describe('EducationRow.vue', () => {

  it('HRM-13300: render and display logs successfully', async () => {
    const syllabus = { id: 1 }
    const wrapper = mount(Component, {
      ...globalComponents,
      propsData: { syllabus }
    })
    expect(wrapper.text()).toContain('Logs')
  })

  it('HRM-13300: calls getLogSyllabus and updates logs correctly', async () => {
    const syllabus = { id: 1 }

    const logsResponse = {
      data: {
        current_page: 1,
        total_page: 2,
        data: [{}, {}] // Mock log data
      }
    }
    trainingUniService.getLogSyllabus.mockResolvedValue(logsResponse)

    const wrapper = mount(Component, {
      propsData: { syllabus }
    })

    await wrapper.vm.getLogSyllabus(syllabus)

    expect(trainingUniService.getLogSyllabus).toHaveBeenCalledWith({
      tp_id: syllabus.id,
      page: 1,
      limit: 10
    })

    // expect(wrapper.vm.logSyllabus.logs).toEqual(logsResponse.data.data)
    expect(wrapper.vm.logSyllabus.currentPage).toBe(logsResponse.data.current_page)
    expect(wrapper.vm.logSyllabus.totalPage).toBe(logsResponse.data.total_page)
    })
})
