// const $ = require('jquery');
const interact = require('interactjs');

export default {
  bind(el, binding, ...rest) {
    console.log(el);
    console.log(binding);
    console.log(rest);

    interact(el)
      .draggable({
        context: document.querySelector('body'),
        restrict: {
          restriction: 'parent',
          endOnly: false,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },

        onmove(event) {
          console.log('MOVING');
          const x = (parseFloat(el.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(el.getAttribute('data-y')) || 0) + event.dy;

          el.style.transform = `translate(${x}px, ${y}px)`;

          el.setAttribute('data-x', x);
          el.setAttribute('data-y', y);
        },

        onend() {
          console.log('DONE MOVING');
        }
      });

    /*
     $el.droppable({
     accept: '.dragme',
     zIndex: 600,
     activeClass: 'highlight',
     drop(event, ui) {
     vm.$emit('drop', event, ui, $el);
     }
     });
     */
  },

  unbind() {},

  update() {}
};
