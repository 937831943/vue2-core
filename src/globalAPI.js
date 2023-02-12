import { mergeOptinons } from "./utils";

export function initGlobalAPI(Vue) {
    // 静态方法
    Vue.options = {
        _base: Vue
    };
    Vue.mixin = function (mixin) {
        // 我们希望将用户的选项和全局的Options进行合并
        this.options = mergeOptinons(this.options, mixin)
        return this;
    }
    Vue.extend = function (options) {
        function Sub(options = {}) {
            this._init(options);
        }
        Sub.prototype = Object.create(Vue.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptinons(Vue.options, options);
        return Sub;
    }

    Vue.options.components = {}; // 全局的指令 Vue.options.directives
    Vue.component = function (id, definition) {
        // 如果definition已经是一个函数了 说明用户自己调用了Vue.extend

        definition = typeof definition === 'function' ? definition : Vue.extend(definition);
        Vue.options.components[id] = definition;

    }
}

