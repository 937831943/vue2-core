import { initGlobalAPI } from "./globalAPI";
import { initMixin } from "./init";
import { initLifeCycle } from "./lifecycle";
import { initStateMixin } from "./state";

// 将所有的方法都耦合在一起
function Vue(options) { // options就是用户的选项
    this._init(options);
}

initMixin(Vue); // 拓展了init方法
initLifeCycle(Vue);
initGlobalAPI(Vue);
initStateMixin(Vue);

export default Vue;