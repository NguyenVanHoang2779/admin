import {mount, createLocalVue} from '@vue/test-utils'
import Component from '@/components/pages/erp/profile/MasterProfileManager.vue'
import GlobalComponents from '../../globalComponents'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

import SelectContractType from 'components/elements/common/SelectContractType'
import SingleSelectDuty from 'components/elements/common/SingleSelectDuty'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(VueRouter)
const router = new VueRouter()
localVue.directive('b-toggle', {
  bind: function (el) {
    el.textContent = 'CHỌN THÔNG TIN CẦN XUẤT'
  }
})

describe('MasterProfileManager.vue', () => {
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

  it('HRM-13322: should render has not filter contract type', () => {
    const wrapper = mount(Component, {
      ...GlobalComponents,
      propsData: {
        profileStatus: null,
        blankMode: null
      },
      store,
      localVue,
      router
    })

    // Assert the rendered text of the component
    const filterContractType = wrapper.findComponent(SelectContractType)
    expect(filterContractType.exists()).toBe(false)
  })

  it('HRM-13322: should render has not filter duty', () => {
    const wrapper = mount(Component, {
      ...GlobalComponents,
      propsData: {
        profileStatus: null,
        blankMode: null
      },
      store,
      localVue,
      router
    })

    // Assert the rendered text of the component
    const filterDuty = wrapper.findComponent(SingleSelectDuty)
    expect(filterDuty.exists()).toBe(false)
  })
})
