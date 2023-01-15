import { compileToFunciton } from "./compiler";
import { callHook, mountComponent } from "./lifecycle";
import { initState } from "./state";
import { mergeOptinons } from "./utils";

export function initMixin(Vue) { // 给Vue增加init方法
    Vue.prototype._init = function (options) { // 用于初始化操作
        // vue vm.$options 就是获取用户的配置
        const vm = this;
        vm.$options = mergeOptinons(this.constructor.options, options); // 将用户的选项挂载到实例上

        callHook(vm, 'beforeCreate');
        // 初始化状态
        initState(vm);
        callHook(vm, 'created');

        if (options.el) {
            vm.$mount(options.el);
        }
    }

    Vue.prototype.$mount = function (el) {
        const vm = this;
        el = document.querySelector(el);

        const ops = vm.$options;

        if (!ops.render) {
            let template
            if (!ops.template && el) {
                template = el.outerHTML;
            } else {
                if (el) {
                    template = ops.template;
                }
            }

            if (template) {
                const render = compileToFunciton(template);
                ops.render = render;
            }
        }

        mountComponent(vm, el); // 组件的挂载

    }
}


