import { mergeOptinons } from "./utils";

export function initGlobalAPI(Vue) {
    // 静态方法
    Vue.options = {};
    Vue.mixin = function (mixin) {
        // 我们希望将用户的选项和全局的Options进行合并
        this.options = mergeOptinons(this.options, mixin)
        return this;
    }
}

