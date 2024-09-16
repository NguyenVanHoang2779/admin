import { mount } from '@vue/test-utils'
import ModalUserLog from '@/components/pages/erp/profile/ModalUserLog.vue'

import GlobalComponents from '@test/unit/globalComponents'
import InfiniteLoading from 'vue-infinite-loading'

describe('ModalUserLog.vue', () => {
  it('HRM-14373: check formatDate', async () => {
    const wrapper = mount(ModalUserLog, {
      ...GlobalComponents,
      stubs: {
        InfiniteLoading: true,
        'b-btn': true,
        'b-modal': true,
        'b-button': true
      },
      propsData: {
        userId: 1189
      }
    })

    let result = wrapper.vm.formatDate('2023-03-01 09:20:20')

    expect(result).toBe('01-03-2023 09:20:20')
  })

  it('HRM-14373: check resetInfiniteLoading', async () => {
    const wrapper = mount(ModalUserLog, {
      ...GlobalComponents,
      stubs: {
        InfiniteLoading: true,
        'b-btn': true,
        'b-modal': true,
        'b-button': true
      },
      propsData: {
        userId: 1189
      }
    })

    await wrapper.setData({
      loading: true,
      logs: [],
      currentPage: 2,
      infiniteId: +new Date()
    })

    wrapper.vm.resetInfiniteLoading()

    expect(wrapper.vm.currentPage).toBe(1)
  })
})
