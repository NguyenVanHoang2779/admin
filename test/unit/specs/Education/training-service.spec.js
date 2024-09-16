import MultiSelectSyllabus from '@/components/elements/common/MultiSelectSyllabus.vue'
import trainingService from '@/domain/services/training-service'
import WebStorage from "@/infrastructures/web-storage";
import config from 'config/app.base'


describe('ModalCreateClassV2.vue', () => {
  it('HRM-13523: call api', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })
    const response = await trainingService.getAllSyllabus()
    expect(response.data.success).toBe(true)
    expect(response.status).toEqual(200)
  })
})

describe('ModalCreateClassV2.vue', () => {
  it('HRM-13505: call api', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })
    const response = await trainingService.getTrainingProgram({syllabus: 1072})
    expect(response.data.success).toBe(true)
    expect(response.status).toEqual(200)
  })
})


describe('ModalCreateClassV2.vue', () => {
  it('HRM-13513: call api', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })
    const response = await trainingService.getSyllabusesCreateClass()
    expect(response.data.success).toBe(true)
    expect(response.status).toEqual(200)
  })
})

describe('getListSubSyllabus', () => {
  it('HRM-13524: call api', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })

    const response = await trainingService.getListSubSyllabus({syllabus: [47]})
    expect(response.data.success).toBe(true)
    expect(response.status).toEqual(200)
  })
})

describe('getListStudents', () => {
  it('HRM-13529: call api', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })

    const param = {
      class_id : 265165,
      class_period_id : 339001,
      page : 1,
      limit : 20
    };
    const response = await trainingService.getListStudents(param)
    expect(response.data.success).toBe(true)
    expect(response.status).toEqual(200)
  })
})

describe('getClassListWaitingConfirm', () => {
  it('HRM-13352: call api', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })

    const response = await trainingService.getClassListWaitingConfirm({stationId: 4558})
    expect(response.data.success).toBe(true)
    expect(response.status).toEqual(200)
  })
})

describe('getStatisticClass', () => {
  it('HRM-13527: call api', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })

    const response = await trainingService.getStatisticClass()
    expect(response.data.success).toBe(true)
    expect(response.status).toEqual(200)
  })
})

