import { mount } from '@vue/test-utils'
import globalComponents from "../../globalComponents";
import ListAcademyComponent from '@/components/pages/erp/TrainingJob/ListAcademy.vue'
import Vue from 'vue'
describe('ListAcademy.vue', () => {
  it('HRM-13549: has a created hook', () => {
    expect(typeof ListAcademyComponent.created).toBe('function')
  })

  it('HRM-13549: has a setValueGetListStudent hook', () => {
    expect(typeof ListAcademyComponent.methods.setValueGetListStudent).toBe('function')
  })

  it('HRM-13549: has a setValueGetListStudent hook', () => {
    const classDetail = {
      class : {
        id : 1
      },
      period : {
        id : 1
      }
    }

    const vm = new Vue(ListAcademyComponent).$mount()

    vm.setValueGetListStudent(classDetail)
    expect(vm.dataGetListStudent.class_id).toEqual(classDetail.class.id)
    expect(vm.dataGetListStudent.class_period_id).toEqual(classDetail.period.id)
    expect(vm.dataGetListStudent.page).toEqual(1)
  })

  it('HRM-13549: sets the correct default data', () => {
    expect(typeof ListAcademyComponent.data).toBe('function')
    const dataGetListStudent = ListAcademyComponent.data().dataGetListStudent
    expect(dataGetListStudent.class_id).toBeNull()
    expect(dataGetListStudent.class_period_id).toBeNull()
    expect(dataGetListStudent.page).toEqual(0)
    expect(dataGetListStudent.limit).toEqual(20)
  })
})
