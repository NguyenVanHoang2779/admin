import moment from 'moment'
import helper from 'infrastructures/helpers/common-helpers'
export default {
  daysInThisMonth (start, end, isView) {
    var now = new Date()
    var dd = now.getDate()
    var year = now.getFullYear()
    var month = now.getMonth()
    if (dd > 20) {
      if (isView && dd < 25) {
        month = now.getMonth()
      } else {
        month = now.getMonth() + 1
      }
    }
    if (month === 0) {
      var from = String(year - 1) + '-' + String(month + 12).padStart(2, '0') + '-' + String(start)
    } else {
      from = String(year) + '-' + String(month).padStart(2, '0') + '-' + String(start)
    }
    if (month <= 11) {
      var to = String(year) + '-' + String(month + 1).padStart(2, '0') + '-' + String(end)
    } else {
      to = String(year + 1) + '-' + String(month - 11).padStart(2, '0') + '-' + String(end)
    }
    return ({
      from: from,
      to: to
    })
  },

  daysInCycleEvaluation () {
    var now = new Date()
    var dd = now.getDate()
    var year = now.getFullYear()
    var month = now.getMonth()
    // Ngày kết thúc đánh giá của 2 chu kì trong tháng
    const endDateOne = 8
    const endDateTwo = 24
    var start
    var end
    if (dd > endDateOne && dd <= endDateTwo) {
      month = now.getMonth() + 1
      start = '05'
      end = '20'
      var from = String(year) + '-' + String(month).padStart(2, '0') + '-' + start
      var to = String(year) + '-' + String(month).padStart(2, '0') + '-' + end
    }
    if (dd > endDateTwo || dd <= endDateOne) {
      start = '21'
      end = '04'
      if (dd > endDateTwo) {
        month = now.getMonth() + 1
        from = String(year) + '-' + String(month).padStart(2, '0') + '-' + start
        if (month <= 11) {
          to = String(year) + '-' + String(month + 1).padStart(2, '0') + '-' + end
        } else {
          to = String(year + 1) + '-' + String(month - 11).padStart(2, '0') + '-' + end
        }
      }
      if (dd <= endDateOne) {
        if (month === 0) {
          from = String(year - 1) + '-' + String(month + 12).padStart(2, '0') + '-' + start
        } else {
          from = String(year) + '-' + String(month).padStart(2, '0') + '-' + start
        }
        to = String(year) + '-' + String(month + 1).padStart(2, '0') + '-' + end
      }
    }
    return ({
      from: from,
      to: to
    })
  },

  cycleEvaluationForTech () {
    let curr = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // get current date
    let first = 0
    let last = 0
    if (curr.getDay() === 0) {
      last = curr.getDate()// First day is the day of the month - the day of the week
      first = last - 6 // last day is the first day + 6
    } else {
      first = curr.getDate() - curr.getDay() + 1// First day is the day of the month - the day of the week
      last = first + 6 // last day is the first day + 6
    }

    let firstDay = new Date(curr.setDate(first)).toISOString().substring(0, 10)
    let nextMonth = moment(firstDay).add(6, 'days').format('MM')
    let lastDay = new Date(curr.setDate(last))
    lastDay = new Date(curr.setMonth(parseInt(nextMonth) - 1)).toISOString().substring(0, 10)
    return ({
      from: firstDay,
      to: lastDay
    })
  },
  getMonthSalaryByDate (date, typeStaff = 'cod') {
    let flagDate = (date >= '2018-12-20') ? 20 : 25
    if (typeStaff === 'cod') {
      flagDate = 20
    }

    let salaryMonth = moment(date).format('YYYY-MM-01')

    if (moment(date).format('DD') > flagDate) {
      salaryMonth = moment(date).add(1, 'months').format('YYYY-MM-20')
    }

    let momentSalaryMonth = moment(salaryMonth)
    let year = momentSalaryMonth.format('YYYY')
    let month = momentSalaryMonth.format('MM')
    let to = momentSalaryMonth.format('YYYY-MM-20')
    let from = momentSalaryMonth.add(-1, 'months').format('YYYY-MM-21')

    return {
      month: month,
      year: year,
      from: from,
      to: to
    }
  },

  // Chu kì hoàn cọc sẽ mặc định vào ngày 10 và 25 hàng tháng
  getDateExpectRefund () {
    let now = new Date()
    now.setDate(now.getDate() + 30)
    let dd = now.getDate()

    let year = now.getFullYear()
    let month = now.getMonth() + 1
    if (month < 10) month = '0' + String(month)

    if (dd <= 10) return String(year) + '-' + String(month) + '-10'
    if (dd > 10 && dd <= 25) return String(year) + '-' + String(month) + '-25'
    if (parseInt(month) === 12) return String(year + 1) + '-' + String(month - 11) + '-10'
    if (parseInt(month) < 9) return String(year) + '-0' + String(parseInt(month) + 1) + '-10'
    return String(year) + '-' + String(parseInt(month) + 1) + '-10'
  },

  getToday (separator = '-') {
    let d = new Date()
    return ('0' + d.getDate()).slice(-2) + separator + ('0' + (d.getMonth() + 1)).slice(-2) + separator + d.getFullYear()
  },

  getCalculatedDate (num, cal = 'ADD', el = 'DAY', separator = '-') {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth()
    let year = date.getFullYear()
    if (cal === 'ADD') {
      switch (el) {
        case 'DAY':
          day = day + num
          break
        case 'MONTH':
          month = month + num
          break
        case 'YEAR':
          year = year + num
          break
      }
    } else if (cal === 'MINUS') {
      switch (el) {
        case 'DAY':
          day = day - num
          break
        case 'MONTH':
          month = month - num
          break
        case 'YEAR':
          year = year - num
          break
      }
    }
    let d = new Date(year, month, day)
    return ('0' + d.getDate()).slice(-2) + separator + ('0' + (d.getMonth() + 1)).slice(-2) + separator + d.getFullYear()
  },

  /**
   * Kiểm tra 2 khoảng thời gian có bị chồng chéo nhau hay không
   */
  checkIsOverlapRangeTime ([from1, to1], [from2, to2]) {
    return helper.isEmpty(from1) || helper.isEmpty(from2) ||
      (helper.isEmpty(to1) && helper.isEmpty(to2)) ||
      (helper.isEmpty(to1) && (from1 <= from2 || from1 <= to2)) ||
      (helper.isEmpty(to2) && (from2 <= from1 || from2 <= to1)) ||
      (from1 >= from2 && from1 <= to2) ||
      (to1 >= from2 && to1 <= to2)
  },

  reverseDateFormat (dateStr) {
    let separator = dateStr.includes('-') ? '-' : '/'
    return dateStr.split(separator).reverse().join(separator)
  },

  getListHourOptions () {
    let options = []
    for (let i = 0; i <= 23; i++) {
      let text = i < 10 ? `0${i}` : i
      options.push({
        value: text,
        text: text
      })
    }
    return options
  },

  getListMinuteOptions () {
    let options = []
    for (let i = 0; i <= 59; i++) {
      let text = i < 10 ? `0${i}` : i
      options.push({
        value: text,
        text: text
      })
    }
    return options
  }
}
