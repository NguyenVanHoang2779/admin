import Component from '@/components/pages/erp/ClosingShift/NewCandidateBoard.vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import GlobalComponents from '../../globalComponents'
import WebStorage from "infrastructures/web-storage";
import config from 'config/app.base'
import store from '@/store'
const localVue = createLocalVue()

localVue.use(Vuex)

describe('NewCandidateBoard.vue', () => {
  it('HRM-13873: should render correct contents', () => {
    const wrapper = mount(Component, {
      ...GlobalComponents,
      propsData: {
        teamId: 8854
      },
      store,
      localVue
    })

    // Assert the rendered text of the component
    expect(wrapper.html()).toContain('div')
  })

  it('HRM-13873: api call has data', async () => {
    const perPage = 3
    const wrapper = mount(Component, {
      ...GlobalComponents,
      propsData: {
        teamId: 8854
      },
      store,
      localVue,
      data() {
        return {
          paginate: {
            per_page: perPage
          }
        }
      }
    })

    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })

    await wrapper.vm.getCandidates()
    expect(wrapper.vm.$data.candidates.length).toBe(perPage)
  })

  it('HRM-13873: test scroll get data', async () => {
    const perPage = 3
    const wrapper = mount(Component, {
      ...GlobalComponents,
      propsData: {
        teamId: 8854
      },
      store,
      localVue,
      data() {
        return {
          paginate: {
            per_page: perPage
          }
        }
      }
    })

    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })

    await wrapper.vm.getCandidates()
    expect(wrapper.vm.$data.candidates.length).toBe(perPage)

    // sau khi scoll thì tăng page lên và data tăng lên
    await wrapper.vm.endScroll({
      target: {
        offsetHeight: 1,
        scrollTop: 1,
        scrollHeight: 1
      }
    })
    expect(wrapper.vm.$data.candidates.length).toBe(perPage + perPage)
    expect(wrapper.vm.$data.paginate.current_page).toBe(perPage)
  })

  it('HRM-13881: lấy candidadte không bị lặp', async () => {
    const perPage = 3
    const wrapper = mount(Component, {
      ...GlobalComponents,
      propsData: {
        teamId: 8854
      },
      store,
      localVue,
      data() {
        return {
          paginate: {
            per_page: perPage
          }
        }
      }
    })

    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })

    await wrapper.vm.getCandidates()
    expect(wrapper.vm.$data.candidates.length).toBe(perPage)

    // sau khi scoll thì tăng page lên và data tăng lên
    await wrapper.vm.endScroll({
      target: {
        offsetHeight: 1,
        scrollTop: 1,
        scrollHeight: 1
      }
    })
    expect(wrapper.vm.$data.isScrollGetCandidate).toBe(false)
    expect(wrapper.vm.$data.candidates.length).toBe(perPage + perPage)
    expect(wrapper.vm.$data.paginate.current_page).toBe(perPage)
  })
})


