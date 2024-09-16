<template>
    <div class="pl-5 pr-5">
        <div class="ml-3 mt-2" v-for="(comment, index) in this.dataCandidateLogs.logs" :key="index" >
          <p>
            {{moment(comment.created_at)}}
            <router-link class="mt-2" :to="{name: 'edit-user', params: { id: comment.created_by }}">{{comment.fullname}}</router-link>
            {{comment.desc}}
          </p>
        </div>
        <br/>
        <span class="show-more ml-5" style="cursor: pointer" v-if="this.showMore" @click="getCandidateLogs">Xem thêm</span>
        <b-input-group>
            <div v-if="isLoading" class="ml-3">
                <div class="sk-wave sk-primary">
                  <div class="sk-rect sk-rect1"></div>
                  <div class="sk-rect sk-rect2"></div>
                  <div class="sk-rect sk-rect3"></div>
                  <div class="sk-rect sk-rect4"></div>
                  <div class="sk-rect sk-rect5"></div>
                </div>
            </div>
            <div v-if="ownUni" class="position-relative w-full mw-600">
                <b-form-input class="only-bottom-border" style="max-width: 600px; padding-right: 35px; " v-model="currComment" placeholder="Viết ghi chú" @keyup.enter.native="comment"></b-form-input>
                <b-btn style="position: absolute; top: 2px; right: 10px; border: none; background: rgba(0,0,0,0); padding: 0" @click="comment()">
                    <i style="font-size: 20px" class="icon ion-ios-send text-primary" ></i>
                </b-btn>
            </div>

        </b-input-group>
      </div>
</template>
<style scoped>
  .show-more{
    color: #1e70cd
  }
  .show-more:hover{
    color: deepskyblue
  }
  .only-bottom-border{
    border-top: none;
    border-left: none;
    border-right: none;
  }
  .sk-wave.sk-primary{
    margin: 4px 0px;
  }
</style>
<script>
import moment from 'moment'
import helper from 'infrastructures/helpers/common-helpers'
import candidateService from 'domain/services/candidate-service'
export default {
  name: 'log-comment',

  props: [
    'candidateId',
    'masterProfileId',
    'currUser',
    'ownUni'
  ],

  data: () => ({
    isLoading: false,
    currComment: '',
    dataCandidateLogs: {
      'logs': [],
      'page': 1,
      'limit': 10
    },
    showMore: true
  }),

  created () {
    this.getCandidateLogs()
  },
  methods: {
    getCandidateLogs () {
      var param = {}
      param['master_profile_id'] = this.masterProfileId
      param['page'] = this.dataCandidateLogs.page
      param['limit'] = this.dataCandidateLogs.limit
      this.isLoading = true
      candidateService.getLogs(param)
        .then(res => {
          if (res.data.success) {
            if (res.data.data.length > 0) {
              this.dataCandidateLogs.logs = [...this.dataCandidateLogs.logs, ...res.data.data]
              this.dataCandidateLogs.page++
              if (res.data.data.length < this.dataCandidateLogs.limit) {
                this.showMore = false
              }
            } else {
              this.showMore = false
            }
          }
          this.isLoading = false
        })
        .catch(e => {
          console.log(e)
        })
    },

    moment: function (data) {
      return moment(data).format('DD-MM-YYYY HH:mm:ss')
    },

    comment () {
      var newComment = {}
      newComment['candidate_id'] = this.candidateId
      newComment['note'] = this.currComment
      this.isLoading = true
      candidateService.addNote(newComment)
        .then(res => {
          if (res.data.success) {
            this.dataCandidateLogs.logs.push(res.data.data)
            helper.showMessage('Thêm ghi chú thành công', 'success')
          } else {
            helper.showMessage(res.data.message, 'warring')
          }
          this.currComment = ''
          this.isLoading = false
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>
