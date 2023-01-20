import Watcher from "./observe/watcher";
import { createElementVNode, createTextVNode } from "./vdom"
import { patch } from "./vdom/patch";

export function initLifeCycle(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this;
        const el = vm.$el;
        vm.$el = patch(el, vnode);
    }
    Vue.prototype._c = function () {
        return createElementVNode(this, ...arguments);
    }
    Vue.prototype._v = function () {
        return createTextVNode(this, ...arguments);
    }
    Vue.prototype._s = function (value) {
        if (typeof value !== 'object') return value;
        return JSON.stringify(value);
    }
    Vue.prototype._render = function () {
        return this.$options.render.call(this);
    }
}

export function mountComponent(vm, el) {
    vm.$el = el;
    const updateComponent = () => {
        vm._update(vm._render())
    }
    new Watcher(vm, updateComponent, true);
}

// vue核心流程
// 1. 创造响应式数据
// 2. 将模板转换成AST语法树
// 3. 将AST语法树转换成render函数
// 4. 后续每次数据更新可以只执行render函数（无需再次执行AST转化过程）
// render函数会产生虚拟节点（使用响应式数据）
// 根据生成的虚拟节点创造真实的DOM


export function callHook(vm, hook) {
    const handlers = vm.$options[hook];
    if (handlers) {
        handlers.forEach(handler => handler.call(vm));
    }
}