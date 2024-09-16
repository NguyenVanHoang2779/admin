<template>
  <b-modal modal-class="modal-custom" size="md" title="Mã cá nhân" header-class="justify-content-center" centered static id="modal-referral-candidate" hide-footer>
    <div class="modal-content">
      <div class="p-4">
        <p class="modal-referral-title">Bước 1: Hướng dẫn ứng viên tải app GHTK,Co</p>
        <p class="modal-referral-step">Cách 1: Gửi mã QR</p>
        <div class="center">
          <div class="bg-qr">
            <img class="p-3" :src="referralInfo.referralQr" alt="">
            <button @click=downloadURI(referralInfo.referralQr) class="btn btn-download-qr mb-3 pl-5 pr-lg-5">
              <i class="fa fa-download" aria-hidden="true"></i>
              Tải xuống
            </button>
          </div>
        </div>
        <div class="mt-3 mb-2">
          <span class="modal-referral-step">Cách 2: Gửi link tải app</span>
          <div class="d-flex justify-content-between align-items-center block-app mt-2">
            <span class="pt-2 pb-2 pl-2 link-app"><u>https://app.ghtk.vn/</u></span>
            <div class="clone-button mr-1">
              <div class="btn-copy" @click="copyText('https://app.ghtk.vn/')">
                <i class="fa fa-clone" aria-hidden="true"></i>
                <span>Sao chép</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-2">
          <p class="modal-referral-title mt-3 mb-2">Bước 2: Gửi mã cá nhân</p>
          <div class="d-flex justify-content-between align-items-center block-app">
            <span class="pt-2 pb-2 pl-2 link-app ref-code">
              {{referralInfo.referralCode}}
            </span>
            <div class="clone-button mr-1">
              <div class="btn-copy" @click="copyText(referralInfo.referralCode)">
                <i class="fa fa-clone" aria-hidden="true"></i>
                <span>Sao chép</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<style lang="scss" scoped>
.modal-title {
  text-align: center;
  padding-top: 12px;
  padding-bottom: 12px;
  line-height: 20px;
  font-size: 16px;
  color: white;
  font-weight: 600;
  background: #069255;
}
/deep/ #modal-referral-candidate {
  div {
    div {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      header {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        .modal-title {
          line-height: 10px;
        }
      }
    }
  }
}
.modal-referral-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
}
.modal-referral-step {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.block-app {
  background-color: #F3F3F3;
  border-radius: 10px !important;
  padding: 3px;
}
.clone-button {
  background-color: #CCE6DA;
  color: #00904A;
  border-radius: 10px !important;
  padding: 5px;
}
.link-app {
  color: rgba(95, 95, 95, 0.8);
}
.clone-button div {
  padding-left: 5px;
  padding-right: 5px;
}
.clone-button div span {
  font-weight: 600;
}
.bg-qr {
  background: linear-gradient(90deg, #1EE383 0%, #00904A 100%);
  width: 75%;
  gap: 15px;
  border-radius: 15px !important;
  margin: 0 auto;
  text-align: center;
}
.bg-qr img {
  width: 90%;
  margin: 0 auto;
}
.btn-download-qr {
  background-color: #F2F2F2;
  border-radius: 8px;
  padding: 5px;
  gap: 12px;
  font-weight: 400;
  color: #000000;
  font-size: 14px;
  line-height: 20px;
  align-items: center;
}
.btn-download-qr:focus, .btn-download-qr:active  {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}
.ref-code {
  font-weight: 500;
}
.btn-copy {
  cursor: pointer;
}
</style>

<script>
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ModalReferralCandidate',
  props: {
    referralInfo: {
      default () {
        return {
          referralCode: '',
          referralQr: ''
        }
      }
    }
  },
  methods: {
    downloadURI (url) {
      const parts = url.split('.png')
      const urlDownload = parts[0] + '.png'
      fetch(urlDownload)
        .then(response => response.blob())
        .then(blob => {
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = 'qr.png'
          link.click()
          helper.showMessage('Tải xuống mã QR thành công', 'success')
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Tải xuống mã QR thất bại', 'warning')
        })
    },
    copyText (text) {
      try {
        navigator.clipboard.writeText(text)
        helper.showMessage('Sao chép thành công', 'success')
      } catch (e) {
        console.log(e)
        helper.showMessage('Sao chép thất bại', 'warning')
      }
    }
  }
}
</script>
