import { mount, createLocalVue } from '@vue/test-utils'
import Component from '@/components/pages/erp/kpi/penalties/IndexPenaltyRentTruck.vue'
import Vuex from 'vuex'

import GlobalComponents from '../../globalComponents'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('IndexPenaltyRentTruck.vue', () => {
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

  it('HRM-13016: should render success component', () => {
    const wrapper = mount(Component, {
      ...GlobalComponents,
      store,
      localVue
    })

    // Assert the rendered text of the component
    expect(wrapper.text()).toContain('Quản lý phạt tài xế xe thuê')
  })
})
