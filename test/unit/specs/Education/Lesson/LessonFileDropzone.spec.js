import Component from '@/components/pages/erp/Education/Lesson/LessonFileDropzone.vue'
import { mount } from '@vue/test-utils'
import globalComponents from '../../../globalComponents'

describe('LessonFileDropzone.vue', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('HRM-13632: initializes Dropzone when mounted', () => {
    const wrapper = mount(Component, {
      ...globalComponents
    })
    expect(wrapper.vm.dropzone).not.toBeNull()
  })

  it('HRM-13632: calculates chunk size correctly', () => {
    const wrapper = mount(Component, {
      ...globalComponents
    })
    const fileSize = 1024 * 1024 * 50 // 50 MB
    const expectedChunkSize = 1024 * 1024 * 5 // 5 MB
    expect(wrapper.vm.calculateChunkSize(fileSize)).toBe(expectedChunkSize)
  })

  it('HRM-13632: check header is added with domain admin', () => {
    const wrapper = mount(Component, {
      ...globalComponents
    })

    expect(wrapper.vm.getHeaderRequest()).toBe('Authorization')
  })
  it('HRM-13632: returns "GchatToken" when isOnAdminDomain is false', async () => {
    const mockConfig = { host: 'http://example.com' }
    const mockLocation = { host: 'example.com' }
    global.URL = jest.fn(() => mockLocation)
      .mockImplementationOnce(() => mockConfig)

    const wrapper = mount(Component, {
      ...globalComponents
    })
    // Assertion
    expect(wrapper.vm.getHeaderRequest()).toBe('GchatToken')
  })
})
