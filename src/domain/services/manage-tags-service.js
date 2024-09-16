import httpErpNew from 'infrastructures/api-erp-new'
// import httpErp from 'infrastructures/api-erp-http'

export default {
  // Lấy list chủ đề filter
  getListTopics: data => httpErpNew.get('/tag-subjects/index', {params: data}),

  // Lấy list tag filter
  getListTags: data => httpErpNew.get('/tags/index', {params: data}),

  // Lấy list tags màn list
  getDataTopics: data => httpErpNew.get('/tag-subjects/list-tag', {params: data}),

  // Api update tag
  changeTagCategories: data => httpErpNew.post('/tag-categories/update-tagging', data),

  // Api tạo chủ đề và tag
  ApiAddTopicAndTag: data => httpErpNew.post('/tag-subjects/create', data),

  // Api update chủ đề và tag
  ApiUpdateTopicAndTag: data => httpErpNew.post('/tag-categories/update', data),

  // Api xoá danh mục
  ApiDeleteCategory: data => httpErpNew.post('/tag-categories/delete', data),
  // Post data httErpNew
  // Lấy danh sách vị trí theo bộ phận
  getAllPositionByDepartmentIds: data => httpErpNew.get('/tag-subjects/list-position', {params: data}),

  // Lấy danh sách danh mục theo user
  getListCategoryByUser: data => httpErpNew.get('/tag-categories/list-category-by-user', {params: data}),

  // Lấy danh sách tag theo danh mục
  getListTagByCategory: data => httpErpNew.get('tags/list-tag-by-category', {params: data}),

  // Api update gắn tag cho user
  apiChangeTagStaffs: data => httpErpNew.post('/tag-staffs/update-tag-staff', data)

}
