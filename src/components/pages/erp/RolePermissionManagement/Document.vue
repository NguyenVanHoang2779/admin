<template>
  <div class="wrapper">
    <div class="list-data-container">
      <b-row class="top topRowCustom align-items-center">
        <b-col md="8">
          <h4 class="m-0">TÀI LIỆU PHÂN QUYỀN HRM</h4>
        </b-col>
      </b-row>

      <div class="mb-3">
          <b-card style="margin-bottom: 1rem">
            <div class="title-card">Project dùng thư viện <a href="https://github.com/spatie/laravel-permission">https://github.com/spatie/laravel-permission</a></div>
            <div class="list-cus">
              <p>1. Các permissions (quyền) được gán vào role(s).</p>
              <p>2. Các roles được gán vào các users. Không gán trực tiếp permission.</p>
              <p>3. Để check có quyền hay không nên code ngay đầu controller function.</p>
              <div class="syntax-cus">
                <span class="span-cus">Auth::user()->canPer('foo')</span>
              </div>
            </div>
          </b-card>
        <b-card style="margin-bottom: 1rem">
          <div class="title-card">Các quy tắc đặt tên</div>
          <div class="list-cus">
            <p>1. Đặt tên role theo nguyên tắc:</p>
            <div class="syntax-cus">
              <span class="span-cus">`ten-group-team.cap-bac`.</span>
              <span class="ex-cus">Ví dụ: `hrm-team.leader`, `hrm-team.staff`</span>
            </div>
            <p style="margin-top: 1rem;">2. Đặt tên permission theo nguyên tắc:</p>
            <div class="syntax-cus">
              <span class="span-cus">`nhom-quyen.hanh-dong`.</span>
              <span class="ex-cus">Ví dụ: `dependant.listing`, `dependant.update-status`</span>
            </div>
          </div>
        </b-card>
        <b-card style="margin-bottom: 1rem">
          <div class="title-card">Cách loại bỏ quyền của 1 đối tượng</div>
          <div class="list-cus">
            <p>Cách 1. Loại bỏ đối tượng đó ra khỏi role có quyền.</p>
            <p>Cách 2. Thu hồi quyền của role mà đối tượng đang thuộc (Lưu ý: trường hợp này tất cả các đối tượng khác thuộc role cũng sẽ mất quyền).</p>
          </div>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Document'
}
</script>

<style scoped lang="scss">
.wrapper {
  margin-top: 1rem;
  .p {
    margin-bottom: 0.7rem;
  }
}
.topRowCustom {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}
.title-card {
  font-size: 18px;
  font-weight: 600;
}
.list-cus {
  margin-top: 0.5rem;
  margin-left: 1rem;
  .syntax-cus {
    margin-left: 1rem;
    .span-cus {
      padding: 0.6rem;
      border: 1px solid #bdbdbd;
      color: #080302;
      background-color: #bdbdbd;
      width: 16%;
    }
  }
}
.ex-cus {
  font-size: 14px;
  font-style: italic;
  color: #29930f;
  display: block;
  margin-left: 0.5rem;
  margin-top: 1rem;
}

</style>
