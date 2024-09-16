import Component from '@/components/pages/erp/Education/InputLesson.vue'
import { mount } from '@vue/test-utils'
import globalComponents from "../../globalComponents";
import { VBPopover } from 'bootstrap-vue'


describe('InputLesson.vue', () => {

  it('HRM-13881: render and display progress when replacing file', async () => {
    const lessons = [
      {
        order_number: 1,
        title: '',
        fileUrl: '',
        fileId: null,
        fileThumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSnfBD8oiQixFsc59ccAI4fSbIBvvTjUEZuw&usqp=CAU',
        isEdit: false,
        uploading: true,
        progress: 0,
        quiz: {
          isEdit: false,
          delete_questions: [],
          add_questions: [],
          questions: []
        }
      }
    ]
    const wrapper = mount(Component, {
      ...globalComponents,
      directives: {
        'b-popover': VBPopover
      },
      propsData: { lessons }
    })

    expect(wrapper.html()).toContain('progress-extend')
  })
})
