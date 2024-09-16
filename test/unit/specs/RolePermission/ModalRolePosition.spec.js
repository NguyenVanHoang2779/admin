import ModalRolePositionComponent from '@/components/pages/erp/RolePermissionManagement/PositionManagement/ModalRolePosition.vue'
import globalComponents from '../../globalComponents'
import { mount } from '@vue/test-utils'
import WebStorage from '../../../../src/infrastructures/web-storage'
import config from 'config/app.base'
jest.mock('domain/services/permission-management-service', () => ({
  getListRolePosition: jest.fn()
}))

describe('ModalRolePosition.vue', () => {
  // Kiểm tra các tùy chọn của component
  it('has a created hook', () => {
    expect(typeof ModalRolePositionComponent.created).toBe('function')
  })
  // Kiểm tra đối tượng component khi `mount`
  it('correctly sets the dataQuickSearch when created', () => {
    const wrapper = mount(ModalRolePositionComponent, {
      ...globalComponents,
      propsData: {}
    })
    expect(wrapper.vm.dataQuickSearch).toBe('')
  })
  // Call api lấy list role position khi khởi tạo
  it('call api: render list role position', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })

    const wrapper = mount(ModalRolePositionComponent, {
      ...globalComponents,
      propsData: {}
    })

    const response = await wrapper.vm.getData()
    expect(wrapper.vm.dataRolePosition).toEqual(wrapper.vm.dataRolePositionBefore)
  })
})
