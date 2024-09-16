import { mount } from '@vue/test-utils'
import UpdateUser from '@/components/pages/erp/profile/UpdateUser.vue'

import GlobalComponents from '../../../globalComponents'

describe('UpdateUser.vue', () => {
  it('HRM-13830: check has master profile code', async () => {
    const wrapper = mount(UpdateUser, {
      ...GlobalComponents,
      stubs: {
        'b-alert': true,
        'b-form-row': true,
        'b-modal': true,
        'b-button': true,
        'b-btn': true,
        'b-form-input': true,
        'b-form-select': true,
        'b-form-group': true,
        'b-form-checkbox': true,
        'b-form-checkbox-group': true,
        'b-link': true,
        'router-link': true,
        'b-row': true,
        'b-col': true,
      },
      mocks: {
        $route: {
          params: {
            id: 'id',
            name: 'edit-user',
          }
        }
      },
      propsData: {
        id: 686201197
      }
    })

    expect(wrapper.text()).toContain('Thông tin tài khoản')
  })
})
