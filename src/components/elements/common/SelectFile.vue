<template>
    <div class="">
        <div v-if="!image" class="wrapper-btn-add" @click="onChooseFile">
            <i class="ion ion-md-add btn-add">Thêm ảnh mới</i>
            <input ref="fileInput" type="file" class="d-none" name="file" @change="onFileChange">
        </div>
        <div class="preview" v-else>
            <img :src="image" alt="" class="preview-image-profile mb-2">
            <i class="ion ion-md-close-circle btn-close" @click="removeImage"></i>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .wrapper-btn-add {
        padding: 10px;
        -webkit-box-shadow: 0 1px 4px rgba(24,28,33,0.009);
        box-shadow: 0 1px 4px rgba(24,28,33,0.009);
        border: 1px solid rgba(24, 28, 33, 0.1);
        border-radius: 3px;
        justify-content: center !important;
        display: flex;
        flex-direction: column;
        text-align: center;
        width: 100%;
        height: 80px;

        .btn-add {
            cursor: pointer;
            font-size: 30px;
        }
    }

    .preview {
        position: relative;
        -webkit-box-shadow: 0 1px 4px rgba(24,28,33,0.009);
        box-shadow: 0 1px 4px rgba(24,28,33,0.009);
        border-radius: 3px;
        padding: 2px;
        max-width: 150px;

        .btn-close {
            position: absolute;
            cursor: pointer;
            font-size: 18px;
            top: -5px;
            right: -5px;
        }

        .preview-image-profile {
            object-fit: cover;
            width: 150px;
            height: 150px;
        }
    }
</style>

<script>
export default {
  name: 'select-file',

  props: {
    fileName: {
      type: String
    }
  },

  data: () => ({
    image: '',
    file: null
  }),

  watch: {
    file: function (newFile, oldFile) {
      this.$emit('handlerChooseFile', newFile)
    },

    fileName: function (newFileName, oldFileName) {
      if (newFileName) {
        this.image = newFileName
      } else {
        this.image = null
      }
    }
  },

  methods: {
    onChooseFile () {
      this.$refs.fileInput.click()
    },

    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files

      if (!files.length) {
        return
      }

      this.file = files[0]
      this.createImage(files[0])
    },

    createImage (file) {
      let reader = new FileReader()
      let vm = this

      reader.onload = (e) => {
        vm.image = e.target.result
      }

      reader.readAsDataURL(file)
    },

    removeImage: function (e) {
      this.file = null
      this.image = null

      this.$emit('handlerRemoveFile')
    }
  }
}
</script>
