export function initLifeCycle(Vue) {
    Vue.prototype._update = function () {

    }
    Vue.prototype._render = function () {

    }
}
export function mountComponent(vm, el) {
    vm._update(vm._render())
}

// vue核心流程
// 1. 创造响应式数据
// 2. 将模板转换成AST语法树
// 3. 将AST语法树转换成render函数
// 4. 后续每次数据更新可以只执行render函数（无需再次执行AST转化过程）
// render函数会产生虚拟节点（使用响应式数据）
// 根据生成的虚拟节点创造真实的DOM