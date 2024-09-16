<template>
  <div class="error-page">
    <div class="container d-flex align-items-center ui-mh-100vh text-white">
      <div class="row align-content-center align-items-start align-items-md-center w-100 py-5">

        <div class="col-md-6 order-2 order-md-1 text-md-left text-center">
          <h1 class="display-2 font-weight-bolder mb-4">Whoops...</h1>
          <div class="text-xlarge font-weight-light mb-5">We couldn't find the page<br> you are looking for :(</div>
          <button type="button" class="btn btn-outline-white" @click="$router.push('/')">←&nbsp; Go Home</button>
        </div>

        <div class="col-md-6 order-1 order-md-2 text-center mb-5 mb-md-0">
          <div class="ui-device macbook w-100 rounded" style="max-width: 500px">
            <img class="device-img" :src="baseUrl + '/static/images/macbook-gold.png'" alt>
            <div class="device-content">
              <div class="error-device-content bg-primary">
                <div class="error-device-code text-white font-weight-bolder">404</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error-404'
}
</script>
<style>
  .error-device-code {
    font-size: 80px;
  }
  @media (min-width: 992px) {
    .error-device-code {
      font-size: 120px;
    }
  }

  .error-device-content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -ms-flex-align: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    text-align: center;
    line-height: 1;
  }
</style>
