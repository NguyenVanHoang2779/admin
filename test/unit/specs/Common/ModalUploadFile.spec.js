import Component from '@/components/elements/common/ModalUploadFile.vue'
import { mount } from '@vue/test-utils'
import GlobalComponents from '../../globalComponents'

describe('ModalUploadFile.vue', () => {
  it('HRM-12137: multiple-choice correct', () => {
    const wrapper = mount(Component, {
      ...GlobalComponents,
      propsData: {
        title: 'Thêm câu hỏi trắc nghiệm',
        urlDefault: 'https://cache.giaohangtietkiem.vn/d/89d6bd47f07dae95fb327f1e2d01c534.xlsx'
      }
    })
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
    const button = wrapper.find('.btn__file-default'); // Change '.my-button-class' to your button's class name
    button.trigger('click');

    expect(openSpy).toHaveBeenCalledWith('https://cache.giaohangtietkiem.vn/d/89d6bd47f07dae95fb327f1e2d01c534.xlsx', '_blank');

    openSpy.mockRestore();
    // Assert the rendered text of the component
    expect(wrapper.text()).toContain('Thêm câu hỏi trắc nghiệm')
  })
})

describe('ModalUploadFile.vue', () => {
  it('HRM-12137: essay correct', () => {
    const wrapper = mount(Component, {
      ...GlobalComponents,
      propsData: {
        title: 'Thêm câu hỏi tự luận',
        urlDefault: 'https://cache.giaohangtietkiem.vn/d/0385d6fd2feef4aaf17c254a58583ac2.xlsx'
      }
    })

    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
    const button = wrapper.find('.btn__file-default'); // Change '.my-button-class' to your button's class name
    button.trigger('click');

    expect(openSpy).toHaveBeenCalledWith('https://cache.giaohangtietkiem.vn/d/0385d6fd2feef4aaf17c254a58583ac2.xlsx', '_blank');

    openSpy.mockRestore();
    // Assert the rendered text of the component
    expect(wrapper.text()).toContain('Thêm câu hỏi tự luận')
  })
})
