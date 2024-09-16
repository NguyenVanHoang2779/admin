import http from 'infrastructures/api-http'

export default {
  /**
   * API search shop incorrect bank info
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  searchShopIncorrectBankInfo (data) {
    return http.get('AdShopBank/listShopInvalidBankInfo', {'params': data})
  },
  /**
   * Select option band brands
   */
  getBankBrand (data) {
    return http.get('AdShopBank/getBankBrand', {'params': data})
  },
  /**
   * Select option Bank
   */
  fillDataBank (data) {
    return http.get('AdShopBank/fillDataBank', {'params': data})
  },
  /**
   * Lưu thông tin sửa ngân hàng
   */
  saveBankInfo (data) {
    return http.get('AdShopBank/editBankInfo', {'params': data})
  },

  searchShop (data) {
    return http.get('AdPkOnsite/getListShopByCode', {'params': data})
  },
  searchPkOnsiteName (data) {
    return http.get('AdPkOnsite/getListPkOnsiteName', {'params': data})
  },
  searchPkOnsite (data) {
    return http.get('AdPkOnsite/getListPkOnsite', {'params': data})
  },
  assignPkOnsiteForShop (userId, shopCode, group) {
    return http.post('AdPkOnsite/assignPkOnsiteForShop', {user_id: userId, shop_code: shopCode, group: group})
  },
  removePkOnsiteOfShop (userId, shopCode, group) {
    return http.post('AdPkOnsite/removePkOnsiteOfShop', {user_id: userId, shop_code: shopCode, group: group})
  },
  checkAssign (userId, shopCode, group) {
    return http.get('AdPkOnsite/checkAssign', {'params': {user_id: userId, shop_code: shopCode, group: group}})
  },
  searchSaleStaff (data) {
    return http.get('AdSaleLeaderB2C/getListSaleStaffs', {'params': data})
  },
  searchB2CSaleLeader (data) {
    return http.get('AdSaleLeaderB2C/getListSaleLeader', {'params': data})
  },
  checkStaffOfLeader (leaderId, staffId) {
    return http.get('AdSaleLeaderB2C/checkStaffOfLeader', {'params': {leader_id: leaderId, staff_id: staffId}})
  },
  assignStaffForLeader (leaderId, staffId) {
    return http.get('AdSaleLeaderB2C/assignStaffToLeader', {'params': {leader_id: leaderId, staff_id: staffId}})
  },
  removeStaffOfLeader (leaderId, staffId) {
    return http.get('AdSaleLeaderB2C/removeStaffFromLeader', {'params': {leader_id: leaderId, staff_id: staffId}})
  },
  searchReturnCouponShop (data) {
    return http.get('shops/getReturnCouponShop', {'params': data})
  },
  fillDataRcShop (data) {
    return http.get('shops/fillDataRcShop', {'params': data})
  },
  saveRcShop (data) {
    return http.get('shops/editRcShop', {'params': data})
  },
  searchReturnCouponResult (data) {
    return http.get('shops/getReturnCouponResult', {'params': data})
  },
  exportReturnCouponResult (data) {
    return http.get('shops/exportReturnCouponResult', {'params': data})
  },
  downloadRcFileZip (data) {
    return http.get('shops/downloadRcFileZip', {'params': data})
  },
  exportBankTransfer (data) {
    return http.get('shops/exportBankTransfer', {'params': data})
  },
  getSummaryReturnCoupon (data) {
    return http.get('shops/getSummaryReturnCoupon', {'params': data})
  },
  searchNewDeductionDetail (data) {
    return http.get('AdNewDeduction/getNewDeductionDetail', {'params': data})
  },
  updateDeductionConfig (data) {
    return http.post('AdNewDeduction/updateDeductionConfig', data)
  },
  searchFileExport (data) {
    return http.get('AdDownloadManager/indexDownloadB2cShop', {'params': data})
  },
  searchInfoShopDebt (data) {
    return http.get('AdShopInfo/getInfoShopDebt', {'params': data})
  },
  updateShopAward (data) {
    return http.post('AdShops/updateShopAward', data)
  },
  getListShopAward (data) {
    return http.post('AdShops/getListShopAward', data)
  },
  getAwardHistory (data) {
    return http.post('AdShops/getAwardHistory', data)
  },
  getAwardOptions () {
    return http.get('AdShops/getAwardOptions')
  },
  exportNewDeductionType () {
    return http.get('AdNewDeduction/exportNewDeductionType')
  },
  /**
   * Gán người giới thiệu cho shop
   */
  searchPresenter (data) {
    return http.get('shops/autoSuggestPresenter', {'params': data})
  },
  getListShopForPresenter (data) {
    return http.get('shops/getListShopForPresenter', {'params': data})
  },
  assignPresenterForShop (userId, shopCode) {
    return http.post('shops/assignPresenterForShop', {user_id: userId, shop_code: shopCode})
  },
  removePresenterForShop (userId, shopCode) {
    return http.post('shops/removePresenterForShop', {user_id: userId, shop_code: shopCode})
  },
  /**
   * Điều chỉnh Cam kết hoàn
   */
  uploadFileRCUpdate (data) {
    return http.post('shops/uploadFileRCUpdate', data)
  },
  searchRCUpdate (data) {
    return http.get('shops/getReturnCouponUpdate', {'params': data})
  },
  runReturnCouponUpdate (data) {
    return http.get('shops/runReturnCouponUpdate', {'params': data})
  },
  exportFileRCUpdate (data) {
    return http.get('shops/exportFileRCUpdate', {'params': data})
  },
  exportFileZipRCUpdate (data) {
    return http.get('shops/downloadFileZipRCUpdate', {'params': data})
  },
  deleteCouponResult (data) {
    return http.post('shops/deleteCouponResult', data)
  },
  /**
   * Quản lý Lý do đánh giá
   */
  getListCause (data) {
    return http.get('causes/getListCause', {'params': data})
  },
  addCause (data) {
    return http.post('causes/addCause', data)
  },
  updateCause (data) {
    return http.post('causes/updateCause', data)
  },
  removeCause (data) {
    return http.post('causes/removeCause', {'causeId': data})
  },

  /***
   * Quản lý đại lý
   */

  getMasterShops (page) {
    return http.get('shops/getMasterShops', {'params': {'page': page}})
  },
  getBranchByMasterShop (masterShopCode, page) {
    return http.get('shops/getListBranchShop', {'params': {'page': page, 'master_shop_code': masterShopCode}})
  },
  updateConfigBranch (data) {
    return http.post('shops/updateConfigBranch', {'BranchShop': data})
  },
  getMainShops (page, limit) {
    return http.get('shops/getListMainSecondaryShop', {'params': {'page': page, 'limit': limit}})
  },
  searchShopAutoComplete (term) {
    return http.get('shops/autocomplete', {'params': {'term': term}})
  },
  updateBranchAccount (data) {
    return http.post('shops/main-account/save', data)
  },
  /***
   * Download zip file chiết khấu
   */

  downloadZipFileDeduction (data) {
    return http.get('shops/downloadZipFileDeduction', {'params': data})
  }
}
