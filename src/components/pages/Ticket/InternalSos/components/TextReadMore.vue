<template>
    <div>
        <div><template v-for="line in showText.split('\n')">{{line}}<br></template> <span>{{ellipsesText}}</span> <span><a @click="changeText" href="javascript:void(0)">{{aTag}}</a></span> </div>
    </div>
</template>
<script>
let ellipsestext = '...'
let more = 'Xem thêm'
let less = '<<Thu gọn'
export default {
  props: ['text', 'words'],
  name: 'text-read-more',

  components: {
  },
  watch: {
    text: function (newVal, oldVal) { // watch it
      this.handleText()
    }
  },
  data: () => ({
    originalText: '',
    lessText: '',
    showText: '',
    ellipsesText: '',
    aTag: ''
  }),
  computed: {
  },
  created () {
    this.handleText()
  },
  methods: {
    changeText () {
      if (this.aTag === more) {
        this.showText = this.originalText
        this.aTag = less
        this.ellipsesText = ''
      } else {
        this.showText = this.lessText
        this.aTag = more
        this.ellipsesText = ellipsestext
      }
    },

    handleText () {
      if (typeof this.text !== 'undefined') {
        this.originalText = this.text
        this.showText = this.originalText
        let arrText = this.text.split(' ')
        this.lessText = arrText.slice(0, parseInt(this.words)).join(' ')
        if (arrText.length > parseInt(this.words)) {
          this.showText = this.lessText
          this.aTag = more
          this.ellipsesText = ellipsestext
        }
      }
    }
  }
}
</script>
