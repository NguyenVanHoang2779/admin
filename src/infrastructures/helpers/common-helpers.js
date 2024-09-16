import Vue from 'vue'
import moment from 'moment'
import hrOrderService from 'domain/services/hr-order-service'
import CompanyProfileService from 'domain/services/company-profile-service'
import config from '../../config/app.base'

import WebStorage from '@/infrastructures/web-storage'
import GchatAuth from '@/infrastructures/gchat-auth'
import configs from '@/config/app.base'

export default {
  getToken () {
    const webLocalStorage = new WebStorage('local')
    const iamAuth = webLocalStorage.get(configs.oidc.tokenIamStorage)
    let token = ''
    if (iamAuth && iamAuth.accessToken) {
      token = `${configs.bearerKey} ${iamAuth.accessToken.accessToken}`
    }

    const adminDomain = new URL(configs.domain)
    const currentURL = new URL(document.referrer || location.origin)
    const isOnAdminDomain = adminDomain.host === currentURL.host
    if (!isOnAdminDomain) {
      const gchatToken = GchatAuth.getToken()
      if (gchatToken) {
        token = gchatToken
      }
    }

    return token
  },

  /**
   * Check valid json string
   *
   * @param str
   * @returns {boolean}
   */
  isJsonString (str) {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }

    return true
  },

  /**
   * Check is empty
   *
   * @param value
   * @returns {boolean}
   */
  isEmpty (value) {
    if (value instanceof Date || value instanceof File) return false
    if (!value) return true
    if (typeof value === 'string' && !value.trim()) return true
    if (Array.isArray(value) && value.length === 0) return true
    if (typeof value === 'object' && Object.keys(value).length === 0) return true
    return false
  },

  upperCaseEachFirstLetter (sentence) {
    if (sentence) return sentence.split(' ').map(w => w.toLowerCase().charAt(0).toUpperCase() + w.toLowerCase().slice(1)).join(' ')
  },

  checkValidDateFormat (date, dateFormat = 'YYYY-MM-DD') {
    return moment(date, dateFormat).format(dateFormat) === date
  },

  showMessage (message, type, title, duration = 4000) {
    if (!title) title = 'Thông báo'
    if (type === 'success') {
      Vue.notify({
        group: 'default',
        type: 'bg-success text-white',
        title: title,
        text: message,
        duration: duration
      })
    } else if (type === 'error') {
      Vue.notify({
        group: 'default',
        type: 'bg-danger text-white',
        title: title,
        text: message,
        duration: duration
      })
    } else {
      Vue.notify({
        group: 'default',
        type: 'bg-warning text-dark',
        title: title,
        text: message,
        duration: duration
      })
    }
  },

  /**
   * encode query when pass to url
   * @param data (Object data)
   */
  encodeQueryData (data) {
    return Object.keys(data).map(function (key) {
      return [key, data[key]].map(encodeURIComponent).join('=')
    }).join('&')
  },

  formatDate (datetime, format) {
    if (datetime) {
      return moment(datetime).format(format || 'DD-MM-YYYY')
    }
    return null
  },

  showToast (message, type, duration = -1) {
    if (type === 'success') {
      Vue.notify({
        group: 'toast',
        type: 'bg-success text-white toast-style',
        title: '<i class="fas fa-info-circle"></i> Thông báo<i class="fas fa-times float-right"></i>',
        text: message,
        duration: duration
      })
    } else if (type === 'error') {
      Vue.notify({
        group: 'toast',
        type: 'bg-danger text-dark toast-style',
        title: '<i class="fas fa-info-circle"></i> Lỗi<i class="fas fa-times float-right"></i>',
        text: message,
        duration: duration
      })
    } else if (type === 'warning') {
      Vue.notify({
        group: 'toast',
        type: 'bg-warning text-dark toast-style',
        title: '<i class="fas fa-info-circle"></i> Lưu ý<i class="fas fa-times float-right"></i>',
        text: message,
        duration: duration
      })
    } else {
      Vue.notify({
        group: 'toast',
        type: 'bg-info text-dark toast-style',
        title: '<i class="fas fa-info-circle"></i> Thông báo<i class="fas fa-times float-right"></i>',
        text: message,
        duration: duration
      })
    }
  },

  cleanToast (group = 'toast') {
    Vue.notify({
      group: group,
      clean: true
    })
  },

  formatMoney (value, seperate = ',', postfix = '', prefix = '') {
    if (value) {
      value = value + ''
      return postfix + value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, seperate) + prefix
    } else return '0'
  },

  inputMoney (ref, field, seperate = ',') {
    if (!ref || !ref[field]) return null
    let data = ref[field] + ''
    ref[field] = data.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, seperate)
  },

  reformatMoney (value) {
    return value.replace(/\D/g, '')
  },

  /**
   * replace giá trị truyền vào
   *
   * @param ref reference object hoặc giá trị cần replace
   * @param field tên trường cần replace trong object
   * @param regex regex cần tìm kiếm
   * @param replacement giá trị replace
   * @returns {string, number}
   */
  replaceData (ref, field, regex, replacement = '') {
    try {
      if (typeof ref !== 'object' && !field) return ref.replace(regex, replacement)
      if (typeof field === 'string') {
        if (!ref[field] || typeof ref[field] !== 'string') return
      }
      if (Array.isArray(field) && field.length) {
        for (const fie of field) {
          if (!ref[fie] || typeof ref[fie] !== 'string') continue
          ref[fie] = ref[fie].replace(regex, replacement)
        }
      }
    } catch (e) {
      console.log(e)
    }
  },

  openLink (linkFile) {
    if (linkFile) {
      window.open(linkFile, '_blank')
    } else {
      this.showMessage('Chưa có tài liệu', 'warn')
    }
  },

  /**
   * valid giá trị truyền vào
   *
   * @param ref reference object hoặc giá trị cần valid
   * @param field tên trường cần valid trong object
   * @param options valid options { max, min , length }
   * @returns {string, number}
   */
  validValue (ref, field, options = { max: null, min: null, length: null }) {
    if (ref === undefined || ref === null) return null
    else if (typeof ref === 'object') { // truyền theo reference
      if (field === undefined || field === null) return null
      if (ref[field] === '' || ref[field] === null || ref[field] === undefined) return ref[field]
      if (!isNaN(options.max) && ref[field] > +options.max) ref[field] = +options.max
      if (!isNaN(options.min) && ref[field] < +options.min) ref[field] = +options.min
      if (!isNaN(options.length) && (ref[field] + '').length > +options.length) ref[field] = ref[field].substring(0, +options.length)
      return ref[field]
    } else { // truyền theo giá trị
      if (ref === '' || ref === null || ref === undefined) return ref[field]
      if (!isNaN(options.max) && +ref > +options.max) ref = +options.max
      if (!isNaN(options.min) && +ref < +options.min) ref = +options.min
      if (!isNaN(options.length) && (ref + '').length > +options.length) ref = ref.substring(0, +options.length)
      return ref
    }
  },

  /**
   * reset Object
   *
   * @param ref reference object hoặc giá trị cần reset
   * @param exceptField tên trường bỏ qua không reset
   * @returns {string, number}
   */
  resetData (ref, exceptField = null, deep = 1) {
    // nếu là mảng thì reset về mảng rỗng
    if (Array.isArray(ref)) {
      ref.splice(0, ref.length)
      return ref
    }
    // Độ deep nhỏ hơn 1 hoặc là File hay Date thì set về null
    if (deep < 1 || ref instanceof File || ref instanceof Date) {
      ref = null
      return ref
    }
    // reset đệ quy theo độ deep truyền vào
    if (ref instanceof Object) {
      // Lấy except field
      if (exceptField) {
        if (!Array.isArray(exceptField)) exceptField = [exceptField]
      } else exceptField = []
      // reset đệ quy
      for (const field in ref) {
        if (exceptField.includes(field)) continue

        if (Array.isArray(ref[field])) {
          ref[field].splice(0, ref[field].length)
        } else if (deep === 1 || ref[field] instanceof File || ref[field] instanceof Date) {
          ref[field] = null
        } else if (ref[field] instanceof Object) this.resetData(ref[field], exceptField, deep - 1)
        else ref[field] = null
      }
    } else ref = null

    return ref
  },

  genCode (number, prefix = 'BH', postfix = '', codeLength = 6) {
    number += ''
    return prefix + '0'.repeat(codeLength > number.length ? codeLength - number.length : 0) + number + postfix
  },

  /**
   * Check loại file dựa vào link hoặc file
   *
   * @param {File|String} file
   */
  getFileType (file) {
    if (!file) return null

    let ext = ''
    if (file instanceof File || file instanceof Blob) {
      if (file.type.includes('video/')) return 'video'
      if (file.type.includes('audio/')) return 'audio'
      if (file.type.includes('image/')) return 'image'
      if (file.type === 'application/pdf') return 'pdf'

      ext = file.name.split('.').pop().toLowerCase()
    } else {
      ext = file.split('?').shift().split('.').pop().toLowerCase()
    }

    if (['jpeg', 'png', 'gif', 'tiff', 'psd', 'jpg', 'eps', 'ai', 'indd', 'raw', 'bmp', 'svg'].includes(ext)) return 'image'// là ảnh
    if (['pdf'].includes(ext)) return 'pdf' // là pdf
    if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) return 'doc' // là doc
    if (['xls', 'xlsx', 'xlsb'].includes(ext)) return 'excel' // là excel
    if (['txt', 'csv'].includes(ext)) return 'text' // là text
    if (['mpeg', 'mp4', 'avi', 'ts', 'webm', '3gp', '3g2', 'mov', 'mkv'].includes(ext)) return 'video' // là video
    if (['mp3', 'aac', 'ogg', 'opus', 'wav'].includes(ext)) return 'audio' // là audio
    if (['zip', 'rar', '7z', 'tar'].includes(ext)) return 'zip' // là file nén

    return 'other'
  },

  // accept integer and - character (character stand for number < 0) only
  onlyNumber ($event) {
    let keyCode = ($event.keyCode ? $event.keyCode : $event.which)
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 45) {
      $event.preventDefault()
    }
  },

  importLibraryTracingLogs () {
    const elem = document.createElement('script')
    elem.type = 'text/javascript'
    elem.async = true
    elem.src = process.env.GHTK_TRACKING_URL
    elem.id = 'trackings'
    const script = document.getElementsByTagName('script')[0]
    script.parentNode.insertBefore(elem, script)
  },

  removeLibraryTracingLogs () {
    document.getElementById('trackings').remove()
  },

  // Loại bỏ các thuộc tính nguy hiểm có thể dẫn tới bị XSS
  filterHtml (html) {
    // Loại bỏ toàn bộ các attribute của html
    html = html.replaceAll(/<(\/?[^ >]+)([^>]*)>/g, '<$1>')

    // loại bỏ toàn bộ thẻ script
    html = html.replaceAll(/<\/?script>/ig, '')

    return html
  },

  removeVietnameseTone (str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
    str = str.replace(/Đ/g, 'D')
    str = str.toLowerCase()
    str = str.replace(/[\r\n\t ]+/g, ' ')
    return str.trim()
  },

  arrayWrap (value) {
    if (!value) {
      return []
    }
    return Array.isArray(value) ? value : [value]
  },

  // hàm lấy khoảng thời gian giữa 2 ngày
  calDistanceDate (from, to) {
    let dayA = new Date(from)
    let dayB = new Date(to)
    let numberDate = Math.abs((dayB.getTime() - dayA.getTime()) / 86400000)
    return Math.ceil(numberDate)
  },

  // tạo FormData từ Object truyền vào
  createFormData (data, formData = null, groupKey = '') {
    if (!formData) formData = new FormData()
    if (!data) return formData

    let key = ''
    for (const prop in data) {
      if (groupKey) {
        if (data[prop] instanceof File) {
          key = groupKey.replaceAll(']', '').replaceAll('[', '.') + `[${prop}]`
        } else key = `${groupKey}[${prop}]`
      } else key = prop

      if (typeof data[prop] === 'boolean') formData.append(key, data[prop] ? 1 : 0)
      else if (!data[prop] && data[prop] !== 0) formData.append(key, '')
      else if (['string', 'number', 'bigint'].includes(typeof data[prop]) || data[prop] instanceof File) formData.append(key, data[prop])
      else if (data[prop] instanceof Date) formData.append(key, data[prop].toISOString())
      else if (data[prop] instanceof Date) formData.append(key, data[prop].toISOString())
      else this.createFormData(data[prop], formData, key)
    }

    return formData
  },

  cloneDeep (object) {
    return JSON.parse(JSON.stringify(object))
  },

  updateObjectByKeys (obj, keys, value) {
    if (!obj || typeof obj !== 'object' || !Array.isArray(keys) || keys.length === 0) {
      return
    }

    let currentObj = obj
    const lastKeyIndex = keys.length - 1

    for (let i = 0; i < lastKeyIndex; i++) {
      const key = keys[i]
      if (!currentObj.hasOwnProperty(key) || typeof currentObj[key] !== 'object') {
        currentObj[key] = {}
      }
      currentObj = currentObj[key]
    }

    currentObj[keys[lastKeyIndex]] = value
  },

  format_date (dateString, format = 'YYYY-MM-DD') {
    const date = new Date(dateString)
    if (isNaN(date)) {
      return 'Invalid date'
    }

    const map = {
      'M': date.getMonth() + 1,
      'D': date.getDate(),
      'Y': date.getFullYear(),
      'H': date.getHours(),
      'm': date.getMinutes(),
      's': date.getSeconds()
    }

    return format.replace(/(M+|D+|Y+|H+|m+|s+)/g, function (match, p) {
      let value = map[p.charAt(0)]
      if (p.length > 1) {
        value = ('0' + value).slice(-p.length)
      }
      return value
    })
  },

  // form data luôn truyền lên string, dùng hàm này để tránh việc truyền lên string null và undefined
  // truyền object, array vào formData
  addFieldValue (formData, fieldName, fieldValue) {
    if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
      return
    }
    if (Array.isArray(fieldValue)) {
      fieldValue.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          Object.entries(item).forEach(([key, value]) => {
            formData.append(`${fieldName}[${index}][${key}]`, value)
          })
        } else {
          formData.append(`${fieldName}[${index}]`, item)
        }
      })
    } else if (typeof fieldValue === 'object' && fieldValue !== null) {
      Object.entries(fieldValue).forEach(([key, value]) => {
        formData.append(`${fieldName}[${key}]`, value)
      })
    } else {
      formData.append(fieldName, fieldValue)
    }
  },

  // const formData = new FormData();
  // const data = [
  //   { name: 'name', value: 'John' },
  //   { name: 'email', value: 'john@example.com' },
  //   { name: 'age', value: 25 },
  //   // Add more data objects as needed
  // ];
  appendDataToFormData (formData, data) {
    for (const entry of data) {
      const { name, value } = entry
      this.addFieldValue(formData, name, value)
    }
  },

  removeVietnameseAccent (str) {
    var AccentsMap = [
      'aàảãáạăằẳẵắặâầẩẫấậ',
      'dđ',
      'eèẻẽéẹêềểễếệ',
      'iìỉĩíị',
      'oòỏõóọôồổỗốộơờởỡớợ',
      'uùủũúụưừửữứự',
      'yỳỷỹýỵ',
      'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
      'DĐ',
      'EÈẺẼÉẸÊỀỂỄẾỆ',
      'IÌỈĨÍỊ',
      'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
      'UÙỦŨÚỤƯỪỬỮỨỰ',
      'YỲỶỸÝỴ'
    ]
    for (var i = 0; i < AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g')
      var char = AccentsMap[i][0]
      str = str.replace(re, char)
    }
    return str
  },

  validatePositiveNumber (event) {
    var keyCode = event.which || event.keyCode
    var inputValue = String.fromCharCode(keyCode)

    if (/\D/.test(inputValue) || parseFloat(inputValue) < 0) {
      event.preventDefault()
    }
  },

  // Generate unique id for element
  generateUniqueId (prefix) {
    return prefix ? `${prefix}-${this.randomStringWithTimestamp()}` : this.randomStringWithTimestamp()
  },

  randomStringWithTimestamp () {
    return `${Math.random().toString(36).substring(2, 9)}-${moment.now()}`
  },

  // open chat box with manager
  openChatBox (managerId) {
    const params = {
      user_id: managerId
    }

    hrOrderService.createDirectChat(params)
      .then(res => {
        if (res.data.success) {
          const channelId = res.data.data.channel_id
          window.open(config.gchatDomain + '/channel/internal/' + channelId, '_blank')
        } else {
          this.showMessage(res.data.message || 'Tạo direct chat thất bại!', 'error', 'Lỗi')
        }
      })
      .catch(e => {
        this.showMessage('Có lỗi xảy ra, vui lòng thử lại sau!', 'error', 'Lỗi')
        console.log(e)
      })
  },

  // format number to money format
  moneyFormat (value) {
    if (!value) return '0'
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  },
  validateStatusEcomTruckFlow (urlPath = '/adm/truck/manage', params = {}) {
    const domainQltsFe = config.domainQLTSFe
    CompanyProfileService.getEcomTruckFlowActivation(params)
      .then(res => {
        if (res.data.success && !res.data.data.is_active) {
          window.location.href = domainQltsFe + urlPath
        }
      })
      .catch(e => {
        console.log(e)
      })
  }
}
