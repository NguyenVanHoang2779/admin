<template>
    <div class="tags-row content-row">
      <div class="subject-name">
        <div>{{infoTags.subject_name}}</div>
      </div>
<!--      Bộ phận-->
      <div class="subject-content">
        <div class="department-cus" v-for="(d, idD) in infoTags.departments" :id="idD">
          <div class="department-name">
            <div>{{d.department_name}}</div>
          </div>
          <div class="department-content">
            <div class="positions-cus" v-for="(p, idp) in d.positions" :id="idp">
              <div class="positions-name">
                <div>{{p.position_name}}</div>
              </div>
              <div class="positions-content">
                <div class="type-cus" v-for="(t, idt) in p.category_types" :id="idt">
                  <div class="type-name">
                    <div>{{t.name === 'individual' ? 'Cá nhân' : (t.name === 'family' ? 'Gia đình' : 'Công việc')}}</div>
                  </div>
                  <div class="type-content">
                    <div class="category-cus" v-for="(c, idc) in t.categories" :id="idc">
                      <div class="category-name">
                        <div><span># {{c.category_name}}</span></div>
                      </div>
                      <div class="tag-content">
                        <span class="tag-cus" v-for="(tag, idTag) in c.tags" :id="idTag" :style="tag.tags.type === 'good' ? 'background-color: #00904A;' : 'background-color: #FD0000;'">
                          # {{tag.tags.name}}
                        </span>
                      </div>
                      <div class="action-cus">
                        <div class="action-cus-content">
                          <button
                            class="btn btn-sm btn-outline-ghtk btn-pill mb-2 font-unset btn-cus-action"
                            @click="onOpenModal('TagModal', 'AddTag', {subjectId: infoTags.subject_id, departmentIndex: idD, positionIndex: idp, typeIndex: idt, categoryIndex: idc, category: c, from: 'fromRow'})">+ Tag</button>
                          <button
                            style="margin-bottom: 0.4rem !important;"
                            class="btn btn-sm btn-outline-ghtk btn-pill mb-2 font-unset btn-cus-action"
                            @click="onOpenModal('TopicModal', 'Edit', {subjectName: infoTags.subject_name, departmentId: d.department_id, positionId: p.position_id, type: t.name, category: c, from: 'fromRow', subjectId: infoTags.subject_id})">Sửa</button>
                        </div>
                      </div>
                    </div>
                  </div>
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
  name: 'tags-detail-row',
  components: {
  },
  props: {
    infoTags: {
      type: Object,
      default: () => ({})
    },
    dataUpdate: {
      default: null
    },
    subjectIndex: null
  },
  watch: {
    dataUpdate (newVal, oldVal) {
      let departmentIndex = this.dataUpdate.dataModalOld.departmentIndex
      let positionIndex = this.dataUpdate.dataModalOld.positionIndex
      let typeIndex = this.dataUpdate.dataModalOld.typeIndex
      let categoryIndex = this.dataUpdate.dataModalOld.categoryIndex
      let idCategoryCheck = 0
      if (this.dataUpdate.tags.length > 0) {
        idCategoryCheck = this.dataUpdate.tags[0].category_id
      } else {
        idCategoryCheck = this.dataUpdate.dataModalOld.category.category_id
      }
      if (this.infoTags.departments[departmentIndex].positions[positionIndex]) {
        if (this.infoTags.departments[departmentIndex].positions[positionIndex].category_types[typeIndex]) {
          if (this.infoTags.departments[departmentIndex].positions[positionIndex].category_types[typeIndex].categories[categoryIndex]) {
            let categoryIdCurrent = this.infoTags.departments[departmentIndex].positions[positionIndex].category_types[typeIndex].categories[categoryIndex].category_id
            if (+categoryIdCurrent === +idCategoryCheck) {
              this.infoTags.departments[departmentIndex].positions[positionIndex].category_types[typeIndex].categories[categoryIndex].tags = this.dataUpdate.tags
            }
          }
        }
      }
    }
  },
  created () {
  },
  computed: {},
  mounted () {},
  data: _ => ({

  }),
  methods: {
    onOpenModal (nameModal, type, options) {
      this.$emit('onOpenModal', {nameModal, type, options})
    }
  }
}

</script>
<style lang="scss" scoped>
.tags-row {
  .stt-cus {
    text-align: center;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
}
.content-row, .department-cus, .positions-cus, .type-cus, .category-cus{
  display: flex !important;
}
.subject-name, .department-name, .positions-name, .type-name, .category-name, .tag-content, .action-cus {
  background-color: #FFFFFF;
  border: 1px solid #E0E0E0 !important;
  border-right: 0px !important;
  border-top: 0px !important;
  font-weight: 400;
  display: flex;
  div{
    margin: auto;
    word-break: break-word;
    margin-left: 0.5rem !important;
  }
}
.subject-content, .department-content, .positions-content, .type-content, .action-cus{
  flex: 1;
}
.subject-name{
  width: 7%;
}
.department-name{
  width: 7.5%;
}
.positions-name{
  width: 8.2%;
}
.type-name{
  width: 8.82%;
}
.category-name{
  width: 16.7%;
  div{
    margin-top: 0 !important;
    padding-top: 0.7rem;
    span {
      background-color: #00904A;
      color: #FFFFFF;
      padding: 6px;
    }
  }
}
.tag-content{
  width: 73.56%;
  flex-wrap: wrap;
  padding: 0.15rem 0.4rem 0.4rem 0.5rem;
  span{
    height: 33px;
    color: #FFFFFF;
    padding: 6px;
    margin-right: 0.35rem;
    margin-top: 0.25rem;
  }
}

.action-cus {
  border-right:1px solid #E0E0E0 !important;
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 0.75rem;
  flex-direction: column;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  div{
    margin-left: auto !important;
  }
  .action-cus-content {
    display: flex;
    flex-direction: column;
  }
  button {
    width: 3.8rem;
    margin: auto;
    margin-bottom: 0px !important;
    margin-top: 0.4rem;
  }
}

@media screen and (max-width: 1385px) {
  .action-cus-content {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }
}

@media screen and (max-width: 1430px) {
  .action-cus button {
    width: 3.5rem;
  }
}

@media screen and (max-width: 1250px) {
  .action-cus button {
    width: 3rem;
  }
}

@media screen and (max-width: 1250px) {
  .action-cus button {
    width: 2.8rem;
  }
}

@media screen and (max-width: 1100px) {
  .action-cus button {
    width: 2.5rem;
    font-size: 0.6rem;
  }
}

@media screen and (max-width: 1309px) {
  .action-cus-content {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
}

@media screen and (max-width: 1800px) {
  .tags-row {
    font-size: 95%;
  }
}
@media screen and (max-width: 1030px) {
  .tags-row {
    font-size: 86%;
  }
}
</style>

<style scoped>

</style>
