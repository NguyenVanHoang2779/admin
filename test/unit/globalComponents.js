import Vue from 'vue'
import {
  BButton,
  BCard,
  BCol,
  BCollapse,
  BContainer,
  BFormCheckbox,
  BFormCheckboxGroup,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BFormTextarea,
  BLink,
  BModal,
  BPagination,
  BProgress,
  BRow,
  BButtonGroup
} from 'bootstrap-vue'
import { DatePicker } from 'v-calendar'
import loadingPlugin from 'plugins/loading'

Vue.use(loadingPlugin)

const GlobalComponents = {
  stubs: {
    // used to register custom components
    'b-btn': BButton,
    'b-button': BButton,
    'b-card': BCard,
    'b-col': BCol,
    'b-collapse': BCollapse,
    'b-container': BContainer,
    'b-form-checkbox': BFormCheckbox,
    'b-form-checkbox-group': BFormCheckboxGroup,
    'b-form-group': BFormGroup,
    'b-form-select': BFormSelect,
    'b-input': BFormInput,
    'b-form-input': BFormInput,
    'b-form-textarea': BFormTextarea,
    'b-link': BLink,
    'b-modal': BModal,
    'b-pagination': BPagination,
    'b-progress': BProgress,
    'b-row': BRow,
    'b-select': BFormSelect,
    'router-link': BLink,
    'v-date-picker': DatePicker,
    'b-button-group': BButtonGroup
  }
}

function testFinished () {
  console.log('Finished at: %s', new Date().toLocaleString('vn'))
}
afterAll(() => {
  return testFinished()
})

export default GlobalComponents
