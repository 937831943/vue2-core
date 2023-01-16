import { initGlobalAPI } from "./globalAPI";
import { initMixin } from "./init";
import { initLifeCycle } from "./lifecycle";
import Watcher, { nextTick } from "./observe/watcher";

// 将所有的方法都耦合在一起
function Vue(options) { // options就是用户的选项
    this._init(options);
}

Vue.prototype.$nextTick = nextTick;

initMixin(Vue); // 拓展了init方法
initLifeCycle(Vue);
initGlobalAPI(Vue);

Vue.prototype.$watch = function (exprOrFn, cb) {
    new Watcher(this, exprOrFn, { user: true }, cb);
}

export default Vue;