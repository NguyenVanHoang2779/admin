<template>
  <div class="detail-log-orders ml-2">
    <ul class="ant-timeline">
<!--      LUỒNG ĐỀ XUẤT HỖ TRỢ GẮN BÓ-->
<!--      Tạo đề xuất-->
      <li class="ant-timeline-item" v-if="dataSupport.order_catalog_alias && dataSupport.order_catalog_alias === 'pre_resign_proposal'">
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head"
          :class="'ant-timeline-item-head-active'">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-md-3 txt-status">
              <b>Tạo đề xuất</b>
            </div>
            <div class="d-flex col-md-4 order-name" >
              <div class="content-right-status align-self-center" v-if="dataSupport.user && dataSupport.user.master_profile && dataSupport.user.master_profile.image_profile &&  dataSupport.user.position">
                <span class="mr-1">
                  <img :src="dataSupport.user.master_profile.image_profile" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="'color: #828282;'">{{ dataSupport.user.username }} - {{ dataSupport.user.position.position_name }}</span>
              </div>
            </div>
            <div class="col-md-4 step-details" v-if="dataSupport.problems && dataSupport.problems.length > 0">Vấn đề: {{dataSupport.problems.map((item) => item.category_name).join(', ') || ''}}</div>
            <div class="show-modal-cus" @click="showModalResignV2('proposal-details', index, 0)"> <i class="ion ion-ios-arrow-forward"></i> </div>
          </div>
        </div>
      </li>
<!--      HR xác nhận-->
      <li class="ant-timeline-item" v-if="dataSupport.order_catalog_alias && dataSupport.order_catalog_alias === 'pre_resign_proposal'">
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head"
          :class="(dataSupport.steps[0].status === 'completed') ? 'ant-timeline-item-head-active' : ((dataSupport.steps[0].status === 'processing') ? 'ant-timeline-item-head-blue' : '')">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-md-3 txt-status">
              <b>HR xác nhận</b>
            </div>
            <div class="d-flex col-md-4 order-name">
              <div class="content-right-status align-self-center" v-if="dataSupport.steps[0].solved_by && dataSupport.steps[0].solved_by.username">
                <span class="mr-1" v-if="dataSupport.steps[0].solved_by.master_profile">
                  <img :src="dataSupport.steps[0].solved_by.master_profile.image_profile" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.steps[0].status === 'completed' ? 'color: #828282;' : ''">{{ dataSupport.steps[0].solved_by.username }} - {{ dataSupport.steps[0].solved_by.position.position_name }}</span>
              </div>
              <div class="content-right-status align-self-center" v-else-if="!dataSupport.steps[0].solved_by && dataSupport.steps[0].handlers && dataSupport.steps[0].handlers.length > 0">
                <span class="mr-1" v-if="dataSupport.steps[0].handlers[0].master_profile.image_profile">
                  <img :src="dataSupport.steps[0].handlers[0].master_profile.image_profile" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.steps[0].status === 'completed' ? 'color: #828282;' : ''" >{{ dataSupport.steps[0].handlers[0].username || '' }} - {{ dataSupport.steps[0].handlers[0].position && dataSupport.steps[0].handlers[0].position.position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3" v-if="dataSupport.steps[0].status !== 'completed'">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor('order_resign', dataSupport.steps[0].handlers, dataSupport.order_catalog_id, dataSupport.user.master_profile.id, dataSupport.steps[0].id)">
                  <i class="fas fa-edit text-success" style="font-weight: 100!important;"></i>
                </b-btn>
              </div>
            </div>
            <div class="col-md-4 step-details">{{convertDataDetails('HR-confirm', dataSupport.steps[0])}}</div>
            <div class="show-modal-cus" @click="showModalResignV2('HR-confirm', index, 0)"> <i class="ion ion-ios-arrow-forward"></i> </div>
          </div>
        </div>
      </li>

      <!--      Quản lý xác nhận-->
      <li class="ant-timeline-item" v-if="dataSupport.order_catalog_alias && dataSupport.order_catalog_alias === 'pre_resign_proposal'">
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head"
          :class="(dataSupport.steps[1].status === 'completed') ? 'ant-timeline-item-head-active' : ((dataSupport.steps[1].status === 'processing') ? 'ant-timeline-item-head-blue' : '')">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-md-3 txt-status">
              <b>Quản lý xác nhận</b>
            </div>
            <div class="d-flex col-md-4 order-name">
              <div class="content-right-status align-self-center" v-if="dataSupport.steps[1].solved_by && dataSupport.steps[1].solved_by.username">
                <span class="mr-1" v-if="dataSupport.steps[1].solved_by.master_profile">
                  <img :src="dataSupport.steps[1].solved_by.master_profile.image_profile" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.steps[1].status === 'completed' ? 'color: #828282;' : ''">{{ dataSupport.steps[1].solved_by.username }} - {{ dataSupport.steps[1].solved_by.position.position_name }}</span>
              </div>
              <div class="content-right-status align-self-center" v-else-if="!dataSupport.steps[1].solved_by && dataSupport.steps[1].handlers && dataSupport.steps[1].handlers.length > 0">
                <span class="mr-1" v-if="dataSupport.steps[1].handlers[0].master_profile.image_profile">
                  <img :src="dataSupport.steps[1].handlers[0].master_profile.image_profile" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.steps[1].status === 'completed' ? 'color: #828282;' : ''">{{ dataSupport.steps[1].handlers[0].username || '' }} - {{ dataSupport.steps[1].handlers[0].position && dataSupport.steps[1].handlers[0].position.position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3" v-if="dataSupport.steps[1].status !== 'completed'">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor('order_resign', dataSupport.steps[1].handlers, dataSupport.order_catalog_id, dataSupport.user.master_profile.id, dataSupport.steps[1].id)">
                  <i class="fas fa-edit text-success" style="font-weight: 100!important;"></i>
                </b-btn>
              </div>
            </div>
            <div class="col-md-4 step-details">{{convertDataDetails('manager-confirm', dataSupport.steps[1])}}</div>
            <div class="show-modal-cus" @click="showModalResignV2('manager-confirm', index, 1)"> <i class="ion ion-ios-arrow-forward"></i> </div>
          </div>
        </div>
      </li>

      <!--      Đề xuất phương án-->
      <li class="ant-timeline-item" v-if="dataSupport.order_catalog_alias && dataSupport.order_catalog_alias === 'pre_resign_proposal'">
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head"
          :class="(dataSupport.steps[2].status === 'completed') ? 'ant-timeline-item-head-active' : ((dataSupport.steps[2].status === 'processing') ? 'ant-timeline-item-head-blue' : '')">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-md-3 txt-status">
              <b>Đề xuất phương án</b>
            </div>
            <div class="d-flex col-md-4 order-name">
              <div class="content-right-status align-self-center" v-if="dataSupport.steps[2].solved_by && dataSupport.steps[2].solved_by.username">
                <span class="mr-1" v-if="dataSupport.steps[2].solved_by.master_profile.image_profile">
                  <img :src="dataSupport.steps[2].solved_by.master_profile.image_profile" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.steps[2].status === 'completed' ? 'color: #828282;' : ''">{{ dataSupport.steps[2].solved_by.username }} - {{ dataSupport.steps[2].solved_by.position.position_name }}</span>
              </div>
              <div class="content-right-status align-self-center" v-else-if="!dataSupport.steps[2].solved_by && dataSupport.steps[2].handlers && dataSupport.steps[2].handlers.length > 0">
                <span class="mr-1" v-if="dataSupport.steps[2].handlers[0].master_profile.image_profile">
                  <img :src="dataSupport.steps[2].handlers[0].master_profile.image_profile" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.steps[2].status === 'completed' ? 'color: #828282;' : ''">{{ dataSupport.steps[2].handlers[0].username || '' }} - {{ dataSupport.steps[2].handlers[0].position && dataSupport.steps[2].handlers[0].position.position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3" v-if="dataSupport.steps[2].status !== 'completed'">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor('order_resign', dataSupport.steps[2].handlers, dataSupport.order_catalog_id, dataSupport.user.master_profile.id, dataSupport.steps[2].id)">
                  <i class="fas fa-edit text-success" style="font-weight: 100!important;"></i>
                </b-btn>
              </div>
            </div>
            <div class="col-md-4 step-details">{{convertDataDetails('proposed-plan', dataSupport.steps[2])}}</div>
            <div class="show-modal-cus" @click="showModalResignV2('proposed-plan', index, 2)"> <i class="ion ion-ios-arrow-forward"></i> </div>
          </div>
        </div>
      </li>

      <!--      Review phương án-->
      <li class="ant-timeline-item" v-if="dataSupport.order_catalog_alias && dataSupport.order_catalog_alias === 'pre_resign_proposal'">
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head"
          :class="(dataSupport.steps[3].status === 'completed') ? 'ant-timeline-item-head-active' : ((dataSupport.steps[3].status === 'processing') ? 'ant-timeline-item-head-blue' : '')">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-md-3 txt-status">
              <b>Review phương án</b>
            </div>
            <div class="d-flex col-md-4 order-name">
              <div class="content-right-status align-self-center" v-if="dataSupport.steps[3].solved_by && dataSupport.steps[3].solved_by.username">
                <span class="mr-1" v-if="dataSupport.steps[3].solved_by.master_profile.image_profile">
                  <img :src="dataSupport.steps[3].solved_by.master_profile.image_profile" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.steps[3].status === 'completed' ? 'color: #828282;' : ''">{{ dataSupport.steps[3].solved_by.username }}- {{ dataSupport.steps[3].solved_by.position.position_name }}</span>
              </div>
              <div class="content-right-status align-self-center" v-else-if="!dataSupport.steps[3].solved_by && dataSupport.steps[3].handlers && dataSupport.steps[3].handlers.length > 0">
                <span class="mr-1" v-if="dataSupport.steps[3].handlers[0].master_profile.image_profile">
                  <img :src="dataSupport.steps[3].handlers[0].master_profile.image_profile" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.steps[3].status === 'completed' ? 'color: #828282;' : ''">{{ dataSupport.steps[3].handlers[0].username || '' }} - {{ dataSupport.steps[3].handlers[0].position && dataSupport.steps[3].handlers[0].position.position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3" v-if="dataSupport.steps[3].status !== 'completed'">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor('order_resign', dataSupport.steps[3].handlers, dataSupport.order_catalog_id, dataSupport.user.master_profile.id, dataSupport.steps[3].id)">
                  <i class="fas fa-edit text-success" style="font-weight: 100!important;"></i>
                </b-btn>
              </div>
            </div>
            <div class="col-md-4 step-details">{{convertDataDetails('review-plan', dataSupport.steps[3])}}</div>
            <div class="show-modal-cus" @click="showModalResignV2('review-plan', index, 3)"> <i class="ion ion-ios-arrow-forward"></i> </div>
          </div>
        </div>
      </li>

      <!--      Kết quả-->
      <li class="ant-timeline-item" v-if="dataSupport.order_catalog_alias && dataSupport.order_catalog_alias === 'pre_resign_proposal'">
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head"
          :class="(dataSupport.steps[4].status === 'completed') ? 'ant-timeline-item-head-active' : ((dataSupport.steps[4].status === 'processing') ? 'ant-timeline-item-head-blue' : '')">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-md-3 txt-status">
              <b>Kết quả</b>
            </div>
            <div class="d-flex col-md-4 order-name">
              <div class="content-right-status align-self-center" v-if="dataSupport.steps[4].solved_by && dataSupport.steps[4].solved_by.username">
                <span class="mr-1" v-if="dataSupport.steps[4].solved_by.master_profile.image_profile">
                  <img :src="dataSupport.steps[4].solved_by.master_profile.image_profile" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.steps[4].status === 'completed' ? 'color: #828282;' : ''">{{ dataSupport.steps[4].solved_by.username }} - {{ dataSupport.steps[4].solved_by.position.position_name }}</span>
              </div>
              <div class="content-right-status align-self-center" v-else-if="!dataSupport.steps[4].solved_by && dataSupport.steps[4].handlers && dataSupport.steps[4].handlers.length > 0">
                <span class="mr-1" v-if="dataSupport.steps[4].handlers[0].master_profile.image_profile">
                  <img :src="dataSupport.steps[4].handlers[0].master_profile.image_profile" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.steps[4].status === 'completed' ? 'color: #828282;' : ''">{{ dataSupport.steps[4].handlers[0].username || '' }} - {{ dataSupport.steps[4].handlers[0].position && dataSupport.steps[4].handlers[0].position.position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3" v-if="dataSupport.steps[4].status !== 'completed'">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor('order_resign', dataSupport.steps[4].handlers, dataSupport.order_catalog_id, dataSupport.user.master_profile.id, dataSupport.steps[4].id)">
                  <i class="fas fa-edit text-success" style="font-weight: 100!important;"></i>
                </b-btn>
              </div>
            </div>
            <div class="col-md-4 step-details">{{convertDataDetails('proposal-result', dataSupport.steps[4])}}</div>
            <div class="show-modal-cus" @click="showModalResignV2('proposal-result', index,  4)"> <i class="ion ion-ios-arrow-forward"></i> </div>
          </div>
        </div>
      </li>

      <!--      LUỒNG NGHỈ VIỆC-->
      <!--      Duyệt đề xuất nghỉ việc-->
      <!--      Tạo đề xuất-->
      <li class="ant-timeline-item" v-if="dataSupport.order_catalog_alias && dataSupport.order_catalog_alias === 'resign'">
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head"
          :class="'ant-timeline-item-head-active'">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-md-3 txt-status">
              <b>Tạo đề xuất</b>
            </div>
            <div class="d-flex col-md-4 order-name" >
            </div>
          </div>
        </div>
      </li>
      <li v-if="dataSupport.resign_order" class="ant-timeline-item">
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head"
          :class="dataSupport.resign_order.checkTick.tickOrder ? 'ant-timeline-item-head-active' : 'ant-timeline-item-head-blue'">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-md-3 txt-status">
              <b>Duyệt đề xuất</b>
            </div>
            <div class="d-flex col-md-4 order-name" v-if="!dataSupport.resign_order.checkTick.tickOrder">
              <div class="content-right-status align-self-center" v-if="dataSupport.resign_order.userHandlerOrder.length > 0">
                <span class="mr-1" v-if="dataSupport.resign_order.userHandlerOrder[0].avatar">
                  <img :src="dataSupport.resign_order.userHandlerOrder[0].avatar" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.resign_order.checkTick.tickOrder ? 'color: #828282;' : ''">{{ dataSupport.resign_order.userHandlerOrder[0].username || '' }}</span> - <span>{{ dataSupport.resign_order.userHandlerOrder[0].position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor('browse-proposals', dataSupport.resign_order.userHandlerOrder, dataSupport.resign_order.id, dataSupport.resign_order.profile_id)">
                  <i class="fas fa-edit text-success" style="font-weight: 100!important;"></i>
                </b-btn>
              </div>
            </div>
            <div class="col-md-4 step-details"></div>
            <div class="show-modal-cus" @click="showModalResignV2('browse-proposals', index, null)"> <i class="ion ion-ios-arrow-forward"></i> </div>
          </div>
        </div>
      </li>
      <!--Thu hồi công cụ, dụng cụ-->
      <li v-if="dataSupport.resign_order" class="ant-timeline-item">
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head"
          :class="dataSupport.resign_order.checkTick.tickAsset ? 'ant-timeline-item-head-active' : (dataSupport.resign_order.checkTick.tickOrder ? 'ant-timeline-item-head-blue' : '')">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
           <div class="col-md-3 txt-status">
              <b>Thu hồi công cụ, dụng cụ</b>
            </div>
            <div class="  d-flex col-md-4 order-name" v-if="!dataSupport.resign_order.checkTick.tickAsset">
              <div class="content-right-status align-self-center" v-if="dataSupport.resign_order.userHandlerCCDC.length > 0">
                <span class="mr-1" v-if="dataSupport.resign_order.userHandlerCCDC[0].avatar">
                  <img :src="dataSupport.resign_order.userHandlerCCDC[0].avatar" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.resign_order.checkTick.tickAsset ? 'color: #828282;' : ''">{{ dataSupport.resign_order.userHandlerCCDC[0].username || '' }}</span> - <span>{{ dataSupport.resign_order.userHandlerCCDC[0].position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor('thu_hoi_ccdc', dataSupport.resign_order.userHandlerCCDC, dataSupport.resign_order.id, dataSupport.resign_order.profile_id)">
                  <i class="fas fa-edit text-success"></i>
                </b-btn>
              </div>
            </div>
            <div class="col-md-4 step-details"></div>
            <div class="show-modal-cus"> <i></i> </div>
          </div>
        </div>
      </li>
<!--      Thanh lý hợp đồng-->
      <li v-if="dataSupport.resign_order" class="ant-timeline-item">
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head"
          :class="dataSupport.resign_order.checkTick.tickContract ? 'ant-timeline-item-head-active' : (dataSupport.resign_order.checkTick.tickOrder ? 'ant-timeline-item-head-blue' : '')">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
           <div class="col-md-3 txt-status">
              <b>Thanh lý hợp đồng</b>
            </div>
            <div class="  d-flex col-md-4 order-name" v-if="!dataSupport.resign_order.checkTick.tickContract">
              <div class="content-right-status align-self-center" v-if="dataSupport.resign_order.userHandlerHD.length > 0">
                <span class="mr-1" v-if="dataSupport.resign_order.userHandlerHD[0].avatar">
                  <img :src="dataSupport.resign_order.userHandlerHD[0].avatar" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.resign_order.checkTick.tickContract ? 'color: #828282;' : ''">{{ dataSupport.resign_order.userHandlerHD[0].username || '' }}</span> - <span>{{ dataSupport.resign_order.userHandlerHD[0].position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor( 'thanh_ly_hd', dataSupport.resign_order.userHandlerHD, dataSupport.resign_order.id, dataSupport.resign_order.profile_id)">
                  <i class="fas fa-edit text-success"></i>
                </b-btn>
              </div>
            </div>
            <div class="col-md-4 step-details"></div>
            <div v-if="!dataSupport.resign_order.checkTick.tickContract" class="show-modal-cus" @click="showModalResignV2('liquidation', index, null)"> <i class="ion ion-ios-arrow-forward"></i> </div>
          </div>
        </div>
      </li>
<!--      Thanh toán cọc-->
      <li class="ant-timeline-item" v-if="dataSupport.resign_order && !dataSupport.resign_order.hideStatus.deposit">
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head"
          :class="dataSupport.resign_order.checkTick.tickDeposit ? 'ant-timeline-item-head-active' : (dataSupport.resign_order.checkTick.tickOrder ? 'ant-timeline-item-head-blue' : '')">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
           <div class="col-md-3 txt-status">
              <b>Thanh toán cọc</b>
            </div>
            <div class="  d-flex col-md-4 order-name" v-if="!dataSupport.resign_order.checkTick.tickDeposit">
              <div class="content-right-status align-self-center" v-if="dataSupport.resign_order.userHandlerDeposits.length > 0">
                <span class="mr-1" v-if="dataSupport.resign_order.userHandlerDeposits[0].avatar">
                  <img :src="dataSupport.resign_order.userHandlerDeposits[0].avatar" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.resign_order.checkTick.tickDeposit ? 'color: #828282;' : ''">{{ dataSupport.resign_order.userHandlerDeposits[0].username || '' }}</span> - <span>{{ dataSupport.resign_order.userHandlerDeposits[0].position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor('thanh_toan_coc', dataSupport.resign_order.userHandlerDeposits, dataSupport.resign_order.id, dataSupport.resign_order.profile_id)">
                  <i class="fas fa-edit text-success"></i>
                </b-btn>
              </div>
            </div>
            <div class="col-md-4 step-details"></div>
            <div class="show-modal-cus"> <i></i> </div>
          </div>
        </div>
      </li>
<!--      Chốt sổ BHXH-->
      <li class="ant-timeline-item" v-if="dataSupport.resign_order && !dataSupport.resign_order.hideStatus.insurance">
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head"
          :class="dataSupport.resign_order.checkTick.tickInsurance ? 'ant-timeline-item-head-active' : (dataSupport.resign_order.checkTick.tickOrder ? 'ant-timeline-item-head-blue' : '')"
        >
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
           <div class="col-md-3 txt-status">
              <b>Chốt sổ BHXH</b>
            </div>
            <div class="  d-flex col-md-4 order-name" v-if="!dataSupport.resign_order.checkTick.tickInsurance">
              <div class="content-right-status align-self-center" v-if="dataSupport.resign_order.userHandlerBHXH.length > 0">
                <span class="mr-1" v-if="dataSupport.resign_order.userHandlerBHXH[0].avatar">
                  <img :src="dataSupport.resign_order.userHandlerBHXH[0].avatar" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name" :style="dataSupport.resign_order.checkTick.tickInsurance ? 'color: #828282;' : ''">{{ dataSupport.resign_order.userHandlerBHXH[0].username || '' }}</span> - <span>{{ dataSupport.resign_order.userHandlerBHXH[0].position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center mb-1">
                <span>Chưa có đề xuất chốt sổ bảo hiểm xã hội!</span>
              </div>
              <div class="item-button ml-3">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor('chot_so_bhxh', dataSupport.resign_order.userHandlerBHXH, dataSupport.resign_order.orderInsurance, dataSupport.resign_order.profile_id)">
                  <i class="fas fa-edit text-success"></i>
                </b-btn>
              </div>
            </div>
            <div class="col-md-4 step-details"></div>
            <div v-if="!dataSupport.resign_order.checkTick.tickInsurance" class="show-modal-cus" @click="showModalResignV2('insurance', index, null)"> <i class="ion ion-ios-arrow-forward"></i> </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'DetailStatusOrderSupportWork',
  props: {
    dataSupport: {
      default: null
    },
    dataResign: {
      default: null
    },
    showStatus: {
      type: Boolean,
      default: true
    },
    listSolutions: [],
    permission: {},
    index: null
  },
  data: _ => ({
  }),
  created () {
  },

  methods: {
    showModalCensor (action, censors, orderId, masterId, stepId = null) {
      if (!this.permission.edit_action) {
        helper.showMessage('Bạn không có quyền thực hiện thao tác này!', 'warning')
        return
      }
      if (helper.isEmpty(orderId)) {
        helper.showMessage('Bạn chưa tạo đề xuất!', 'warning')
        return
      }
      if (action === 'chot_so_bhxh' && !helper.isEmpty(orderId)) {
        orderId = orderId.hrOrder.id
      }
      this.$emit('showCensors', {action, censors, orderId, masterId, stepId})
    },

    showModalResignV2 (type, index, stepIndex = null) {
      if (type !== 'proposal-details' && stepIndex) {
        if (this.dataSupport.steps && this.dataSupport.steps[stepIndex]) {
          if (this.dataSupport.steps[stepIndex].status === 'pending') {
            return helper.showMessage('Chưa thể thao tác bước ' + this.dataSupport.steps[stepIndex].name + ' ở thời điểm hiện tại', 'warning')
          }
          if (!this.dataSupport.steps[stepIndex].handlers && !this.dataSupport.steps[stepIndex].solved_by) {
            return helper.showMessage('Vui lòng gán người xử lý trước khi thao tác', 'warning')
          }
        }
      }
      this.$emit('showModalResignV2', {type: type, data: index})
    },

    convertDataDetails (type, step) {
      let details = ''
      switch (type) {
        case 'HR-confirm':
          if (step.result && step.result.employee_problems && step.result.employee_problems.length > 0) {
            details = 'Xác nhận vấn đề: ' + step.result.employee_problems.join(', ') || ''
          }
          break
        case 'manager-confirm':
          if (step.result && step.result.propose_solution && step.result.propose_solution.length > 0) {
            details = 'PA đề xuất: ' + step.result.propose_solution.join(', ') || ''
          }
          break
        case 'proposed-plan':
          if (step.result && step.result.solutions && step.result.solutions.length > 0 && this.listSolutions && this.listSolutions.length > 0) {
            details = 'PA áp dụng: ' + this.listSolutions.filter(item => step.result.solutions.includes(String(item.id))).map((i) => i.name).join(', ') || ''
          }
          break
        case 'review-plan':
          if (step.result && step.result.result) {
            switch (step.result.result) {
              case 'keep_working':
                details = 'NLĐ hài lòng với kết quả và tiếp tục gắn bó'
                break
              case 'continue_review_solution':
                details = 'Tiếp tục thực hiện phương án đã đề xuất'
                break
              case 'resign_properly':
                details = 'Mong muốn nghỉ việc của NLĐ là chính đáng, đề xuất cho NLĐ nghỉ việc'
                break
            }
          } else {
            if (step.result && step.result.propose_solution && step.result.propose_solution.length > 0) {
              details = 'PA áp dụng: ' + step.result.propose_solution.join(', ') || ''
            }
          }
          break
        case 'proposal-result':
          if (step.result && step.result.result) {
            if (step.result.result === 'keep_working') {
              details = 'NLĐ tiếp tục gắn bó'
            }
            if (step.result.result === 'resign_properly') {
              details = 'Đề xuất nghỉ việc'
            }
          }
          break
      }
      return details
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-log-orders {
  .ant-timeline{
    box-sizing: border-box;
    color: #000;
    font-variant: tabular-nums;
    line-height: 1.8;
    -webkit-font-feature-settings: "tnum","tnum";
    font-feature-settings: "tnum","tnum";
    margin: 0;
    padding: 0;
    list-style: none;
    li:last-child{
      height: 32px;
    }
  }
  .ant-timeline-item {
    position: relative;
    margin: 0;
    padding: 0 0 4px;
    list-style: none;
    height: 3.5rem;
  }
  .ant-timeline-item-tail {
    position: absolute;
    top: 10px;
    left: 6px;
    height: calc(100% - 10px);
    border-left: 3px solid #e8e8e8;
  }
  .ant-timeline-item-head-blue {
    background-color: #14a05b !important;
    border-color: #14a05b !important;
  }
  .ant-timeline-item-head {
    position: absolute;
    width: 16px;
    height: 16px;
    background-color: #C4C4C4;
    border: 2px solid transparent;
    border-radius: 100px;
  }

  .ant-timeline-item-head-active{
    background-color: black;
    border-color: black;
    border-radius: 100px;
    position: absolute;
    width: 16px;
    height: 16px;
    .checkmark {
      transform: rotate(45deg);
      height: 8px;
      width: 5px;
      margin-top: 0.1em;
      margin-left: 36%;
      border-bottom: 2px solid #FFFFFF;
      border-right: 2px solid #FFFFFF;
    }
  }

  .ant-timeline-item-content {
    position: relative;
    top: -4px;
    margin: 0 0 0 24px;
    word-break: break-word;
    height: 2.5rem;
    border-bottom: 1px solid #e5e5e5;
    .txt-status, .content-right-status {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    span.btn {
      border-radius: 20px;
      border: 1px solid #00904A;
    }

    .content-right-status {
      img {
        border-radius: 50%;
        object-fit: cover;
      }
    }
    .order-name {
      position: relative;
      top: -0.25rem;
    }
  }
  .time-log{
    color: #828282;
    font-size: 14px;
  }
  .show-modal-cus {
    position: absolute;
    right: 24px;
    i {
      cursor: pointer;
      color: #828282;
      font-size: 1rem;
    }
  }
  .step-details {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: #828282;
    width: 20px;
  }
}
</style>
