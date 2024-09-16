<template>
  <nav class="layout-footer footer" :class="getLayoutFooterBg()">
    <div class="container-fluid d-flex flex-wrap justify-content-between text-center container-p-x pb-3">
      <div class="pt-3">
        <span class="footer-text font-weight-bolder">Giao hang tiet kiem JSC</span> ©
      </div>
      <div>
        <a href="https://giaohangtietkiem.vn/" class="footer-link pt-3">Trang chủ</a>
        | <a href="https://admin.giaohangtietkiem.vn/admin" class="footer-link pt-3">Admin</a>
        <a href="https://giaohangtietkiem.vn/gioi-thieu/" class="footer-link pt-3 ml-4">Giới thiệu</a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'app-layout-footer',

  methods: {
    getLayoutFooterBg () {
      return `bg-${this.layoutFooterBg}`
    }
  }
}
</script>
