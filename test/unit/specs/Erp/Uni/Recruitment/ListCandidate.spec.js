import {createLocalVue, mount} from '@vue/test-utils'
import ListCandidate from '@/components/pages/erp/Uni/Recruitment/ListCandidate.vue'

import GlobalComponents from '@test/unit/globalComponents'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(VueRouter)
const router = new VueRouter()

jest.mock('vue-pdf', () => () => '<div/>')

describe('ListCandidate.vue', () => {
  let getters
  let store

  beforeEach(() => {
    getters = {
      userInfo: () => 'userInfo'
    }

    store = new Vuex.Store({
      getters
    })
  })

  it('HRM-13344: remove first config', async () => {
    const listCandidates = [
      {
        explained: true,
        id: 1
      },
      {
        explained: false,
        id: 2
      }
    ]
    const wrapper = mount(ListCandidate, {
      ...GlobalComponents,
      stubs: {
        ...GlobalComponents.stubs,
        'SingleSelectPosition': true,
        'single-select-position': true,
        'SingleSelectStation': true,
        'SingleSelectDuty': true,
        'SingleSelectDepartment': true,
      },
      propsData: {
        listCandidates: listCandidates,
        isCloseShift: true
      },
      store,
      localVue
    })

    wrapper.vm.sortListCandidates()

    expect(wrapper.vm.dataListCandidates[0].id).toBe(2)
  })

  it('HRM-13971: Test list candidate if is not closing shift board', async () => {
    const listCandidates = [
      {
        explained: true,
        id: 1
      },
      {
        explained: false,
        id: 2
      }
    ]
    const wrapper = mount(ListCandidate, {
      ...GlobalComponents,
      stubs: {
        ...GlobalComponents.stubs,
        'SingleSelectPosition': true,
        'single-select-position': true,
        'SingleSelectStation': true,
        'SingleSelectDuty': true,
        'SingleSelectDepartment': true,
      },
      propsData: {
        listCandidates: listCandidates,
        isCloseShift: false
      },
      store,
      localVue
    })

    const list = wrapper.vm.getListCandidates()

    expect(list[0].id).toBe(1)
  })
})
