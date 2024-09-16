import ViewDocument from '@/components/pages/erp/Uni/Recruitment/ViewDocument.vue'
import { mount } from '@vue/test-utils'
import GlobalComponents from '@test/unit/globalComponents'

describe('ViewDocument.vue', () => {
  const localStubs = {
    'b-carousel': true,
    'b-carousel-slide': true
  }
  it('HRM-13622: should open new tab when click file pdf', () => {
    window.open = jest.fn()
    const wrapper = mount(ViewDocument, {
      ...GlobalComponents,
      stubs: {
        ...GlobalComponents.stubs,
        ...localStubs
      },
      propsData: {
        document: []
      }
    })

    wrapper.vm.openNotImageFile('https://admin.giaohangtietkiem.vn/adm/static/img/pdf.png')

    expect(window.open).toHaveBeenCalledTimes(1)
  })
})
