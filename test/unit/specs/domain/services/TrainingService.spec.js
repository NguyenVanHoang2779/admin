import config from 'config/app.base'
import httpHrmUni from 'infrastructures/api-hrm-uni'
import TrainingService from '@/domain/services/training-service'
import WebStorage from 'infrastructures/web-storage'

jest.mock('infrastructures/api-hrm-uni', () => ({
  get: jest.fn()
}))

describe('TrainingService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('HRM-13563: api show period test', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken: {
        accessToken: process.env.ACCESS_TOKEN
      }
    })

    const data = { tp_period_id: 1421 }
    const response = {
      data: {
        success: true
      },
      status: 200
    }
    httpHrmUni.get.mockResolvedValue(response)

    const result = await TrainingService.getPeriodTest(data)

    expect(httpHrmUni.get).toHaveBeenCalledWith('/erp/period-test/show-test', { params: data })
    expect(result).toEqual(response)
  })

  it('HRM-13351: api get list class', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken: {
        accessToken: process.env.ACCESS_TOKEN
      }
    })

    const data = { term: 'test' }
    const response = {
      data: {
        success: true
      },
      status: 200
    }
    httpHrmUni.get.mockResolvedValue(response)

    const result = await TrainingService.apiGetListClass(data)

    expect(httpHrmUni.get).toHaveBeenCalledWith('/erp/ErpTpClass/apiGetListClass', { params: data })
    expect(result).toEqual(response)
  })

  it('HRM-13355: api list explanation reason', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken: {
        accessToken: process.env.ACCESS_TOKEN
      }
    })

    const response = {
      data: {
        success: true
      },
      status: 200
    }
    httpHrmUni.get.mockResolvedValue(response)

    const result = await TrainingService.getListExplanationReason()

    expect(httpHrmUni.get).toHaveBeenCalledWith('/erp/ErpTrainingSyllabus/getListExplanationReason', {})
    expect(result).toEqual(response)
  })
})
