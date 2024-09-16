<template>
  <b-modal title="" v-model="showModal" size="xl" scrollable id="OpenUrlInDialog" @hidden="resetModal">
    <b-alert v-if="errorMessage" variant="warning">{{ errorMessage }}</b-alert>
    <div v-if="isLoading" class="text-center">
      <i class="fa fa-spinner fa-spin"/> Đang tải...
    </div>
    <div v-else v-html="html"></div>
    <template #modal-footer>
      <b-button variant="secondary" class="float-right" size="sm" @click="showModal=false">Đóng</b-button>
    </template>
  </b-modal>
</template>

<script>
import manageListBagBoxService from './../../../domain/services/manage-list-bag-box-service'
export default {
  name: 'OpenUrlInDialog',
  props: ['value'],
  computed: {
    url: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  watch: {
    url (newValue) {
      this.showModal = !!newValue
      this.load()
    }
  },
  data () {
    return {
      showModal: false,
      isLoading: false,
      errorMessage: '',
      html: ''
    }
  },
  methods: {
    resetModal () {
      this.errorMessage = ''
      this.url = ''
      this.html = ''
    },
    async load () {
      if (!this.url) {
        return
      }

      try {
        this.isLoading = true
        this.errorMessage = ''
        this.html = (await manageListBagBoxService.get(this.url)).data
      } catch (e) {
        this.errorMessage = e.toString()
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss">
#OpenUrlInDialog {
  .modal-footer {
    padding: 10px 15px;
  }

  .modal-content {
    min-height: calc(100vh - 3rem);
  }

  .modal-dialog {
    max-width: 960px;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
}
</style>
