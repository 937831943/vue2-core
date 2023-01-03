(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    function initMixin(Vue) {
      // 给Vue增加init方法
      Vue.prototype._init = function (options) {
        // 用于初始化操作
        // vue vm.$options 就是获取用户的配置
        var vm = this;
        vm.$options = options; // 将用户的选项挂载到实例上

        // 初始化状态
        initState(vm);
      };
    }
    function initState(vm) {
      var opts = vm.$options; // 获取所有的选项
      if (opts.data) {
        initData(vm);
      }
    }
    function initData(vm) {
      var data = vm.$options.data; // data 可能是函数或对象
      data = typeof data === 'function' ? data.call(vm) : data;
      console.log(data);
    }

    // 将所有的方法都耦合在一起
    function Vue(options) {
      // options就是用户的选项
      this._init(options);
    }
    initMixin(Vue); // 拓展了init方法

    return Vue;

}));
//# sourceMappingURL=vue.js.map
