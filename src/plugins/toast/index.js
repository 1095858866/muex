import ToastComponent from '../../components/toast/index.vue';

let $vm;
let watcher;

const plugin = {
  install (vue, options) {
    const Toast = vue.extend(ToastComponent);

    if (!$vm) {
      $vm = new Toast({
        el: document.createElement('div')
      });
      document.body.appendChild($vm.$el);
    }

    const toast = {
      show (options) {
        // destroy watcher
        watcher && watcher();
        if (typeof options === 'string') {
          $vm.text = options;
        } else if (typeof options === 'object') {
          for (let i in options) {
            $vm[i] = options[i];
          }
        }
        if (typeof options === 'object' && options.onShow || options.onHide) {
          watcher = $vm.$watch('show', (val) => {
            val && options.onShow && options.onShow($vm);
            val === false && options.onHide && options.onHide($vm);
          });
        }
        $vm.show = true;
      },
      hide () {
        $vm.show = false;
      }
    };

    // all mue's plugins are included in this.$m
    if (!vue.$mue) {
      vue.$mue = {
        toast
      };
    } else {
      vue.$mue.toast = toast;
    }

    vue.mixin({
      created: function () {
        this.$mue = vue.$mue;
      }
    });
  }
};

export default plugin;
export const install = plugin.install;

