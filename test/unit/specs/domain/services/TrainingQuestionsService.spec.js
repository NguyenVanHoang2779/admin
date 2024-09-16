import config from 'config/app.base'
import httpHrmUni from 'infrastructures/api-hrm-uni'
import TrainingQuestionsService from '@/domain/services/training-questions-service'
import WebStorage from "infrastructures/web-storage";

jest.mock('infrastructures/api-hrm-uni', () => ({
  get: jest.fn()
}))

describe('TrainingQuestionsService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('HRM-13563: api show period test', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })

    const data = {
      question_ids: [1, 2, 3]
    }
    const response = {
      data: {
        success: true
      },
      status: 200
    }
    httpHrmUni.get.mockResolvedValue(response)

    const result = await TrainingQuestionsService.generateTestPdfNew({data})

    expect(httpHrmUni.get).toHaveBeenCalledWith('/erp/period-test/generate-test-pdf', {data})
    expect(result).toEqual(response)
  })
})
