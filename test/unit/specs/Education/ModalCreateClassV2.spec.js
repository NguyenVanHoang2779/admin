import Component from '@/components/pages/erp/TrainingJob/ModalCreateClassV2.vue'
import { mount } from '@vue/test-utils'
import trainingService from '@domain/services/training-service'

import globalComponents from "../../globalComponents";

jest.mock('domain/services/training-service', () => ({
  getClassByUserId: jest.fn()
}))

describe('ModalCreateClassV2.vue', () => {

  it('HRM-13533: render list class with student', async () => {
    const studentId = 1189

    const response = {
      data: {
        data: []
      }
    }
    trainingService.getClassByUserId.mockResolvedValue(response)

    const wrapper = mount(Component, {
      ...globalComponents,
      propsData: { syllabusFilter: {
          classIds: []
        }}
    })

    await wrapper.vm.getClassByUserId(studentId)

    expect(trainingService.getClassByUserId).toHaveBeenCalledWith({
      student_id : studentId
    })
    expect(wrapper.vm.syllabusFilter.classIds).toEqual(response.data.data)
  })
})
