import Watcher from "./observe/watcher";
import { createElementVNode, createTextVNode } from "./vdom"

function createElm(vnode) {
    let { tag, data, children, text } = vnode;
    if (typeof tag === 'string') {
        // 这里将真实节点和虚拟节点对应起来，后续如果修改属性了
        vnode.el = document.createElement(tag);
        patchProps(vnode.el, data);
        children.forEach(child => {
            vnode.el.appendChild(createElm(child));
        });
    } else {
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

function patchProps(el, props) {
    for (const key in props) {
        if (key === 'style') {
            for (const styleName in props.style) {
                el.style[styleName] = props.style[styleName];
            }
        } else {
            el.setAttribute(key, props[key])
        }
    }
}

function patch(oldVNode, vnode) {
    const isRealElement = oldVNode.nodeType;
    if (isRealElement) {
        // 初渲染流程
        const elm = oldVNode; // 获取真实元素
        const parentElm = elm.parentNode; // 拿到父元素
        const newElm = createElm(vnode);
        parentElm.insertBefore(newElm, elm.nextSibling);
        parentElm.removeChild(elm);
        return newElm;
    } else {
        // diff算法
    }
}

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


    const watcher = new Watcher(vm, updateComponent, true);
    console.log(watcher);
}

// vue核心流程
// 1. 创造响应式数据
// 2. 将模板转换成AST语法树
// 3. 将AST语法树转换成render函数
// 4. 后续每次数据更新可以只执行render函数（无需再次执行AST转化过程）
// render函数会产生虚拟节点（使用响应式数据）
// 根据生成的虚拟节点创造真实的DOM