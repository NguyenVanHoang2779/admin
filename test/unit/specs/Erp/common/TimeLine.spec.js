import { mount } from '@vue/test-utils'
import TimeLine from '@/components/pages/erp/common/TimeLine.vue'

import GlobalComponents from '@test/unit/globalComponents'

describe('TimeLine.vue', () => {
  it('HRM-13344: get log format', async () => {
    const wrapper = mount(TimeLine, {
      ...GlobalComponents,
      propsData: {
        logs: []
      }
    })

    const logMessage1 = wrapper.vm.getLogMessage({
      action: 'test',
      datetime: '2023-01-01 11:00:01',
      message: 'test message'
    })

    expect(logMessage1).toBe('test message')

    const logMessage2 = wrapper.vm.getLogMessage('test message 2')

    expect(logMessage2).toBe('test message 2')
  })
})
