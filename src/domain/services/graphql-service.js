import axios from 'axios'
import config from 'config/app.base'

const hrmDomain = config.domainApiHrm
const graphqlEndpoint = `${hrmDomain}/graphql`

export default {
  graphqlQuery (query) {
    return axios.post(graphqlEndpoint, { query: query })
  }
}
