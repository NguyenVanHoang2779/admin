<template>
  <div>
    <b-modal id="modal-create-fast-contract" ref="createContractModalRef" @hidden="resetDefault" static>
      <div slot="modal-title">
        Tạo hợp đồng nhanh
      </div>
      <div>
        <div v-if="!isCod">
          <div class="col-form-label pt-0">Nhập lương thử việc</div>
          <b-form-input
                  type="number"
                  v-model="trialSalary"
                  placeholder="Nhập lương thử việc"
          ></b-form-input>
        </div>
        <div v-else>
          <div class="col-form-label pt-0">Chọn loại hợp đồng</div>
          <b-form-select
                  v-model="typeContract"
                  :options="contractOptions"
          ></b-form-select>
        </div>
      </div>
      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="hideModal">Cancel</button>
        <button type="button" class="btn btn-primary" @click="createFastContract">Tạo hợp đồng</button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import contractService from 'domain/services/contract-service'
import Contract from 'domain/entities/Contract'

export default {
  name: 'modal-create-fast-contract',

  components: {
  },

  props: [
    'user',
    'isCod',
    'isWhStaff'
  ],

  data: () => ({
    trialSalary: 0,
    typeContract: 'parttime',
    contractOptions: Contract.fastContractOption
  }),

  created () {
  },

  watch: {
  },

  methods: {
    hideModal () {
      this.$refs.createContractModalRef.hide()
    },

    createFastContract () {
      this.$startLoading()
      let dataSend = {
        user_id: this.user.id,
        has_kpi: 0,
        trial_salary_input: this.trialSalary,
        type_contract: this.typeContract
      }

      if (this.typeContract === '') {
        delete dataSend.type_contract
      }

      contractService.fastCreateContract(dataSend)
        .then(response => {
          if (response.data.success) {
            this.$notify({
              group: 'default',
              type: 'bg-success text-white',
              title: 'Thông báo',
              text: 'Bạn đã tạo hợp đồng nhanh thành công!'
            })
            setTimeout(() => {
              this.$router.go()
            }, 1000)
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: response.data.message
            })
          }
        }).catch(e => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
          this.$refs.createContractModalRef.hide()
        })
    },

    resetDefault () {
    }
  }
}
</script>
