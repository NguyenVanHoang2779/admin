<template>
    <div class="ticket-comment pl-2">
        <!--        <p class="comment-creator-time">{{data.created_fullname}}, {{data.created_text}}</p>-->
        <div class="row">
            <div class="col-md-2 div-time-tag"><span class="span-time-tag">{{data.created_text}}</span></div>
            <div class="col-md-9" style="display: inline-block">
                <div class="_6qw3">
                    <div class="_72vr">
                        <span style="color: #385898"><b>{{data.created_fullname}}</b></span>
                        <span :class="{'font-italic': data.type !== 'comment'}">{{data.content}}</span>
                    </div>
                    <div v-if="typeof data.status_wait === 'undefined'"></div>
                    <div v-else-if="data.status_wait === 1" class="icon-circle-comment-wait"></div>
                    <div v-else-if="data.status_wait === 2" class="icon-circle-comment-success">
                        <svg height="13px" viewBox="0 0 512 512" width="13px" xmlns="http://www.w3.org/2000/svg">
                            <path d="m256 0c-141.164062 0-256 114.835938-256 256s114.835938 256 256 256 256-114.835938 256-256-114.835938-256-256-256zm0 0"
                                  fill="#2196f3"/>
                            <path d="m385.75 201.75-138.667969 138.664062c-4.160156 4.160157-9.621093 6.253907-15.082031 6.253907s-10.921875-2.09375-15.082031-6.253907l-69.332031-69.332031c-8.34375-8.339843-8.34375-21.824219 0-30.164062 8.339843-8.34375 21.820312-8.34375 30.164062 0l54.25 54.25 123.585938-123.582031c8.339843-8.34375 21.820312-8.34375 30.164062 0 8.339844 8.339843 8.339844 21.820312 0 30.164062zm0 0"
                                  fill="#fafafa"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: ['data'],
  name: 'ticket-comment-v2',

  components: {},
  watch: {},
  data: () => ({}),
  computed: {},
  created () {
  },
  methods: {}
}
</script>

<style scoped lang="scss">
    .ticket-comment {
        margin-right: 5%;
        margin-bottom: 10px;
    }

    .comment-creator-time {
        color: #8a8d91;
        margin-bottom: 1px;
        font-size: 13px;
    }

    ._6qw3 {
        background-color: #f2f6f9;
        border-radius: 18px;
        box-sizing: border-box;
        color: #1c1e21;
        display: inline-block;
        line-height: 16px;
        margin: 0;
        max-width: 100%;
        word-wrap: break-word;
        position: relative;
        white-space: normal;
        word-break: break-word
    }

    ._72vr {
        padding: 8px 10px;
    }

    .icon-circle-comment-wait {
        position: absolute;
        bottom: 3px;
        right: -15px;
        border-radius: 50%;
        width: 13px;
        height: 13px;
        background: transparent;
        border: 2px solid #2196f3;
    }

    .icon-circle-comment-success {
        position: absolute;
        bottom: 3px;
        right: -15px;
    }

    .div-time-tag {
        border-bottom: 2px solid #8c8c8c;
        padding-bottom: 6px;
        max-width: 150px;
        min-width: 150px;
    }

    .span-time-tag {
        font-weight: 500;
        color: #8c8c8c;
        line-height: 2;
    }
</style>
