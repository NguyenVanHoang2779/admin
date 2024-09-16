import Component from '@/components/pages/erp/ClosingShift/ClosingShiftBoard.vue'
import NewCandidateBoard from '@/components/pages/erp/ClosingShift/NewCandidateBoard.vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import GlobalComponents from '@test/unit/globalComponents'
import WebStorage from "infrastructures/web-storage";
import config from 'config/app.base'
import store from '@/store'
const localVue = createLocalVue()

localVue.use(Vuex)

describe('ClosingShiftBoard.vue', () => {
  it('HRM-14316: test has style css', async () => {
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
          filter: {
            team_id: 5198
          },
          permission: {
            view_tab: [
              'recruitment'
            ]
          },
          to_do: {
            recruitment: {
              total: 0,
              alias: 'recruitment',
              statisticFunc: '',
              dataFunc: '',
              desc: 'Tuyển dụng',
              getTrigger: false,
              isShow: true,
              open: false
            }
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

    const div = wrapper.find('#recruitment')

    expect(div.classes()).toContain('recruitment_wrapper')
  })
})

describe('NewCandidateBoard.vue', () => {
  it('HRM-14316: test scroll get data', async () => {
    const perPage = 3
    const page = 2
    const wrapper = mount(NewCandidateBoard, {
      ...GlobalComponents,
      propsData: {
        teamId: 8854
      },
      store,
      localVue,
      data() {
        return {
          paginate: {
            per_page: perPage,
            page: page,
          }
        }
      }
    })

    await wrapper.setProps({ triggerCandidate: 1 })

    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })

    await wrapper.vm.getCandidates()
    expect(wrapper.vm.$data.candidates.length).toBe(perPage * page)
  })
})
