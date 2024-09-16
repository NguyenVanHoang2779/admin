<template >
  <b-modal static modal-class="modal-xxl mx-2 my-2" :id="id" @shown="listProfileSeleted = {}">
    <b-row class="mih-75vh small-scrollar overflow-auto">
      <b-col md="3" class="search border-right">
        <b-row class="mb-1">
          <b-col md="6" class="pl-0 mb-1"><b-input v-model.trim="filter.username_fullname" placeholder="Username/ Họ tên"></b-input></b-col>
          <b-col md="6" class="pr-0 mb-1"><b-input v-model.trim="filter.driverLicence" placeholder="Biển số xe"></b-input></b-col>
          <b-col md="6" class="pl-0 mb-1"><MultiSelectStation @handleStationSelected="handleStationSelected" /></b-col>
          <b-col md="6" class="pr-0 mb-1"><MultiSelectPosition @handlePositionSelected="handlePositionSelected" /></b-col>
          <b-col md="12" class="text-center">
            <b-btn @click="search" variant="outline-info"><i class="ion ion-md-search"></i> Tìm kiếm</b-btn>
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col md="12" class="text-center px-0">
            <span class="text-danger">Chọn nhân viên để in</span>
            <b-btn
              size="sm"
              variant="success"
              @click="selectAllProfile()"
              class="float-right w-4re"
            >
              Chọn tất
            </b-btn>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12" class="position-relative border-top border-bottom overflow-auto h-57vh px-0" v-loading="loading">
            <div v-for="(profile, idx) in listProfile" :key="idx" class="border-bottom mb-1 pb-2">
              <b>{{ profile.fullname + '(' + profile.username + ')' + ' - ' + profile.position + ' - ' + profile.station }}</b>
              <br/>
              <span>Biển số: <i>{{ profile.license_plate }}</i></span>
              <br/>
              <span>Địa bàn HĐ: <i>{{ profile.work_area }}</i></span>
              <b-btn :variant="listProfileSeleted[profile.username] ? 'danger' : 'success'" size="sm" @click="selectProfile(profile)" class="float-right w-4re">{{ listProfileSeleted[profile.username] ? 'Bỏ' : 'Chọn' }}</b-btn>
            </div>
          </b-col>
          <b-col md="12" class="mt-1 px-0">
            <b-pagination
              align="center"
              size="sm"
              v-model="filter.curPage"
              :total-rows="rows"
              :per-page="filter.perPage"
              @input="search"
            ></b-pagination>
          </b-col>
        </b-row>
      </b-col>
      <b-col md="9" class="preview border-left">
        <div class="d-flex mb-1 border-bottom">
          <b-select :options="printTypeOption" v-model="filter.type" class="mr-2"></b-select>
          <b-btn @click="listProfileSeleted = {}" variant="outline-danger">Xóa tất user đã chọn</b-btn>
        </div>
        <div id="contentPrintProfile" class="page h-74vh overflow-auto">
          <template v-for="(profilePrint, idx) in listProfileSeleted">
            <div v-if="profilePrint" class="a-paper" :key="idx" :class="landscape ? 'landscape' : 'not-landscape'">
              <i v-if="preview" class="fas fa-times fa-2x delete-btn text-danger" title="Xóa" @click="deteteProfile(idx)"></i>
              <table class="table table-sm mb-0 content" v-if="filter.type === 'confirm_paper'">
                <tr class="h-2rem">
                  <th colspan="3" class="text-center text-danger py-2 align-middle"><b>GIẤY XÁC NHẬN THÔNG TIN NHÂN VIÊN GIAO HÀNG</b></th>
                </tr>
                <tr class="h-3rem">
                  <th class="text-center align-middle confirm"><b>XÁC NHẬN</b></th>
                  <th class="text-center align-middle info-user">
                    Họ và tên shipper: <br />
                    <b>{{ profilePrint.fullname }}</b>
                  </th>
                  <th class="text-center align-middle company-confirm">
                    <b>XÁC NHẬN CỦA <br/> CÔNG TY</b>
                  </th>
                </tr>
                <tr>
                  <td class="text-center align-middle"><b>SỞ CÔNG <br /> THƯƠNG</b></td>
                  <td>
                    - Ngày sinh: {{ profilePrint.birthday }} <br />
                    - Giới tính: {{ profilePrint.gender }} <br />
                    - CMND/CCCD: {{ profilePrint.personal_number }} <br />
                    - Nơi ở: (phường/xã, huyện) {{ profilePrint.cur_address }} <br />
                    - Điện thoại: {{ profilePrint.phone }} <br />
                    - Phương tiện: (Biển số) {{ profilePrint.license_plate }} <br />
                    - Địa bàn hoạt động (Trong 1 huyện): (Ghi cụ thể huyện, thị, thành phố) {{ profilePrint.work_area }} <br />
                    - Mã thẻ BHYT: {{ profilePrint.health_ins_number }}
                  </td>
                  <td class="align-middle">

                    <img v-if="profilePrint.avatar" :src="profilePrint.avatar" alt="Ảnh 3x4 cm" class="avatar"/>
                    <div class="image text-center align-middle d-inline-block" v-else>Ảnh 3x4 cm</div>
                    <div class="align-middle d-inline-block font-small"><b>Công ty</b> <br/><i>(Ký, đóng dấu)</i></div>
                  </td>
                </tr>
              </table>
              <div class="content card" v-if="filter.type === 'info_paper'">
                <div class="card-header">
                  <b class="font-larger">THÔNG TIN CÁ NHÂN</b>
                </div>
                <div class="card-body">
                  <div class="d-inline-block align-top w-50">
                    <div>
                      <b>1. Ảnh đại diện:</b><br />
                      <img :src="profilePrint.avatar" alt="Avatar" height="130" width="110" class="border mb-1">
                    </div>
                    <div><b>2. Họ tên:</b> {{ profilePrint.fullname }}</div>
                    <div><b>3. Số CMND:</b> {{ profilePrint.personal_number }}</div>
                  </div>
                  <div class="d-inline-flex p-3">
                    <img :src="profilePrint.qr_code" alt="QRcode" class="qr-code">
                  </div>
                  <div>
                    <div>
                      <b>4. Số diện thoại:</b> <br />
                      <input v-model="profilePrint.tel1" type="text" placeholder="" class="input-simple ml-2 bg-white" disabled />
                      <input v-model="profilePrint.tel2" type="text" placeholder="" class="input-simple ml-2 bg-white" disabled />
                    </div>
                    <div></div>
                    <div>
                      <b>5. Quê quán:</b> <br />
                      <span class="ml-2">{{ profilePrint.native_address }}</span>
                    </div>
                    <div>
                      <b>6. Địa chỉ thường chú:</b> <br />
                      <span class="ml-2">{{ profilePrint.resident_address }}</span>
                    </div>
                    <div><b>7. Email cá nhân:</b> {{ profilePrint.personal_email }}</div>
                    <div>
                      <b>8. Giới thiệu bản thân:</b> <br />
                      <input type="text" placeholder="" class="input-simple ml-2 w-100 bg-white" v-model="profilePrint.self_intro" disabled />
                    </div>
                    <div><b>9. Ngày vào:</b> {{ profilePrint.join_date }}</div>
                    <div><b>10. Tài khoản:</b> {{ profilePrint.username }}</div>
                    <div><b>11. Loại hình làm ciệc:</b> {{ profilePrint.work_type }}</div>
                    <div><b>12. Loại hợp đồng:</b> {{ profilePrint.contract }}</div>
                    <div><b>13. Khu vực hoạt động:</b> {{ profilePrint.work_area }}</div>
                    <div><b>14. Biển số xe:</b> {{ profilePrint.license_plate }}</div>
                    <div><b>15. Mã COD:</b> {{ profilePrint.cod_alias }}</div>
                  </div>

                </div>
              </div>
              <div></div>
            </div>
          </template>
        </div>
      </b-col>
    </b-row>

    <div slot="modal-footer" class="w-100 text-center">
      <b-btn @click="printInfoCard" variant="info"><i class="ion ion-md-print"></i> In thẻ xác nhận</b-btn>
      <b-btn @click="$bvModal.hide(id)">Đóng</b-btn>
    </div>
  </b-modal>
</template>

<style lang="css" scoped>
  .h-74vh {
    height: 74vh;
  }
  .h-57vh {
    height: 57vh;
  }
  .h-3rem {
    height: 3rem;
  }
  .h-2rem {
    height: 2rem;
  }

  .table tr, td, th {
    border: 1px solid black;
  }

  .card {
    border-color: black;
  }
  .card-body {
    padding: 1rem;
  }

  .qr-code {
    height: 175px;
    width: 175px;
  }

  .input-simple {
    outline: none;
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: 1px solid #ccc;
  }

  .a-paper {
    position: relative;
    padding: 0.5rem;
    width: 50%;
    border: 1px solid red;
    display: inline-block;
  }

  .landscape {
    height: 105mm;
  }

  .content {
    width: 100%;
    height: 100%;
  }

  .confirm {
    width: 20%;;
  }

  .info-user {
    width: 52%;
  }

  .avatar {
    height: 4cm;
    width: 3cm;
  }

  .delete-btn {
    display: none;
  }

  .a-paper:hover .delete-btn {
    position: absolute;
    top: 10px;
    right: 11px;
    border: 1px solid red;
    border-radius: 100%;
    display: inline-flex;
    z-index: 1000;
    width: 2rem;
    height: 2rem;
    text-align: center;
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }

  .image {
    width: 4rem;
    height: 5rem;
    border: 2px solid black;
  }

  .page {
    /* height: 210mm; */
    margin: 0 auto;
    border: 1px #D3D3D3 solid;
    background: white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }

  @media print {
    html, body {
      width: 210mm;
      height: 297mm;
    }
    .confirm {
      width: 20%;
    }

    .info-user {
      width: 52%;
    }

    .content {
      width: 100%;
      height: 100%;
    }

    .a-paper {
      position: relative;
      padding: 0.5rem 0.5rem 0 0.5rem;
      width: 50%;
      display: inline-block;
      border: none;
    }

    .not-landscape {
      height: 182mm;
    }

    .landscape {
      height: 102mm;
    }
  }
</style>
<script>
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'

// service
import profileService from 'domain/services/profile-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-preview-print-info',

  components: {
    MultiSelectStation,
    MultiSelectPosition
  },

  props: {
    id: {
      default: 'modal-preview-print-info'
    }
  },

  data: _ => ({
    loading: false,
    preview: true,
    filter: {
      username_fullname: null,
      stations: null,
      driverLicence: null,
      positions: null,
      type: 'confirm_paper',
      curPage: 1,
      perPage: 100
    },
    rows: 0,
    printTypeOption: [
      { value: null, text: '-- Chọn loại thẻ cần in --' },
      { value: 'confirm_paper', text: 'Giấy xác nhận thông tin nhân viên giao hàng' },
      { value: 'info_paper', text: 'Thẻ thông tin nhân viên' }
    ],
    listProfile: [],
    listProfileSeleted: {}
  }),

  computed: {
    landscape () {
      return this.filter.type === 'confirm_paper'
    }
  },

  watch: {
    'filter.type' (neVal, oldval) {
      this.filter.perPage = 100
      if (neVal === 'info_paper') {
        this.filter.perPage = 20
        this.search()
        this.listProfileSeleted = {}
      }
    }
  },

  methods: {
    deteteProfile (staffCode) {
      if (!this.listProfileSeleted[staffCode]) return
      this.listProfileSeleted[staffCode] = null
    },

    printInfoCard () {
      // Kiểm tra có Profile nào được chọn
      if (!this.listProfileSeleted) {
        alert('Vui lòng chọn ít nhất 1 tài khoản cần in')
        return
      } else {
        let hadProfileNeedPrint = false
        for (let username in this.listProfileSeleted) {
          if (this.listProfileSeleted[username]) hadProfileNeedPrint = true
        }
        if (!hadProfileNeedPrint) {
          alert('Vui lòng chọn ít nhất 1 tài khoản cần in')
          return
        }
      }

      this.preview = false

      this.$nextTick(_ => {
        // Get HTML to print from element
        const prtHtml = document.getElementById('contentPrintProfile').innerHTML

        // Get all stylesheets HTML
        let stylesHtml = ''
        for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
          stylesHtml += node.outerHTML
        }

        let pageStyle = document.createElement('style')
        pageStyle.type = 'text/css'
        let styles = ''
        if (this.filter.type === 'confirm_paper') styles = '@page {size: A4 landscape; margin: 0}'
        else styles = '@page {size: A4; margin: 0}'

        if (pageStyle.styleSheet) pageStyle.styleSheet.cssText = styles
        else pageStyle.appendChild(document.createTextNode(styles))

        stylesHtml += pageStyle.outerHTML

        // Open the print window
        const WinPrint = window.open('', '', 'width=1000,height=900,left=0,top=0')

        WinPrint.document.write(`<!DOCTYPE html>
          <html>
            <head>
              ${stylesHtml}
            </head>
            <body>
              <div id="app">
                ${prtHtml}
              </div>
            </body>
          </html>`)

        WinPrint.document.close()
        WinPrint.focus()
        setTimeout(() => {
          WinPrint.print()
          this.preview = true
          // WinPrint.close()
        }, 1500)
      })
    },

    selectAllProfile () {
      if (!this.listProfile) return
      for (let profile of this.listProfile) {
        if (this.listProfileSeleted[profile.username] === undefined) this.$set(this.listProfileSeleted, profile.username, profile)
        else this.listProfileSeleted[profile.username] = profile
      }
    },

    selectProfile (profile) {
      if (!profile) return
      if (this.listProfileSeleted[profile.username]) this.listProfileSeleted[profile.username] = null
      else this.$set(this.listProfileSeleted, profile.username, profile)

      this.$nextTick(_ => {
        let objDiv = document.getElementById('contentPrintProfile')
        objDiv.scrollTo({ top: objDiv.scrollHeight, behavior: 'smooth' })
      })
    },

    search () {
      this.loading = true
      profileService.getProfileForPrint(this.filter)
        .then(res => {
          if (res.data.success) {
            this.listProfile = res.data.data || []
            this.rows = res.data.total || 0
          } else helper.showMessage(res.data.message || 'Có lỗi xảy ra không lấy được danh sách Profile !', 'warning')
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra không lấy được danh sách Profile !', 'warning')
        })
        .finally(_ => {
          this.loading = false
        })
    },

    handleStationSelected (op) {
      this.filter.stations = op ? op.map(item => item.id).toString() : null
    },

    handlePositionSelected (op) {
      this.filter.positions = op ? op.map(item => item.id).toString() : ''
    }
  }
}
</script>
