import ClassManagerComponent from "@/components/pages/erp/TrainingJob/ClassManager.vue";

describe('ClassManager.vue', () => {
  it('HRM-13916: has a created hook', () => {
    expect(typeof ClassManagerComponent.created).toBe('function')
  })

  it('HRM-13916: not exits function getTotalNotPlacedStudent', () => {
    expect(typeof ClassManagerComponent.methods.setValueGetListStudent).toEqual('undefined')
  })

  it('HRM-13916: not exits modal-student-no-class ', () => {
    expect(typeof ClassManagerComponent.components.ModalStudentNoClass).toEqual('undefined')
  })
})
