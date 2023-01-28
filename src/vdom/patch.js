import { isSameVnode } from ".";

export function createElm(vnode) {
    let { tag, data, children, text } = vnode;
    if (typeof tag === 'string') {
        // 这里将真实节点和虚拟节点对应起来，后续如果修改属性了
        vnode.el = document.createElement(tag);
        patchProps(vnode.el, {}, data);
        children.forEach(child => {
            vnode.el.appendChild(createElm(child));
        });
    } else {
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

export function patchProps(el, oldProps = {}, props = {}) {

    // 老的属性中有， 新的没有，要删除老的
    const oldStyles = oldProps.style || {};
    const newStyles = props.style || {};
    for (const key in oldStyles) {
        if (!newStyles[key]) {
            el.style[key] = '';
        }
    }
    for (const key in oldProps) {
        if (!props[key]) {
            el.removeAttribute(key);
        }
    }
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

export function patch(oldVNode, vnode) {
    const isRealElement = oldVNode.nodeType;
    if (isRealElement) {
        // 初渲染流程
        const elm = oldVNode; // 获取真实元素
        const parentElm = elm.parentNode; // 拿到父元素
        const newElm = createElm(vnode);
        parentElm.insertBefore(newElm, elm.nextSibling);
        parentElm.removeChild(elm);
        return newElm;
    }
    // diff算法
    // 1. 两个节点不是同一个节点 直接删除老的节点换新的节点（没有比对了）
    // 2. 两个节点是同一个节点（判断节点的tag和key）比较连个节点的属性是否有差异 （复用老的节点，将差异的属性更新）
    // 3. 节点比较完成后就需要比较两个节点的儿子
    return patchVnode(oldVNode, vnode);
}

function patchVnode(oldVNode, vnode) {
    if (!isSameVnode(oldVNode, vnode)) {
        const el = createElm(vnode);
        oldVNode.el.parentNode.replaceChild(el, oldVNode.el);
        return el;
    }

    // 文本情况 期望比较内容
    const el = vnode.el = oldVNode.el; // 复用老节点
    if (!oldVNode.tag) { // 是文本
        if (oldVNode.text !== vnode.text) {
            el.textContent = vnode.text; // 用新文本覆盖旧文本
        }
    }

    // 是标签 标签对比标签属性
    patchProps(el, oldVNode.data, vnode.data);

    // 比较子节点
    const oldChildren = oldVNode.children || [];
    const newChildren = vnode.children || [];
    if (oldChildren.length && newChildren.length) {
        // 完整的diff算法 需要比较连个子节点
        updateChildren(el, oldChildren, newChildren);
    } else if (newChildren.length) {
        // 没有旧节点 只有新节点
        mountChildren(el, newChildren);
    } else if (oldChildren.length) {
        el.innerHTML = '';
    }

    return el;
}

function mountChildren(el, newChildren) {
    newChildren.forEach(child => el.appendChild(createElm(child)));
}

function updateChildren(el, oldChildren, newChildren) {
    // 用户操作列表 经常会用一些push shift pop等这些方法
    // vue2中采用双指针的方式比较两个节点
    let oldStartIndex = 0;
    let newStartIndex = 0;
    let oldEndIndex = oldChildren.length - 1;
    let newEndIndex = newChildren.length - 1;

    let oldStartVnode = oldChildren[0];
    let newStartVnode = newChildren[0];
    let oldEndVnode = oldChildren[oldEndIndex];
    let newEndVnode = newChildren[newEndIndex];

    function makeIndexByKey(children) {
        let map = {};
        children.forEach((child, index) => {
            map[child.key] = index;
        });
        return map;
    }

    let map = makeIndexByKey(oldChildren);

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldStartIndex];
        } else if (!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex];
        } else if (isSameVnode(oldStartVnode, newStartVnode)) { // 头头比对
            patchVnode(oldStartVnode, newStartVnode);
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else if (isSameVnode(oldEndVnode, newEndVnode)) { // 尾尾比对
            patchVnode(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else if (isSameVnode(oldEndVnode, newStartVnode)) { // 交叉比对
            patchVnode(oldEndVnode, newStartVnode);
            el.insertBefore(oldEndVnode.el, oldStartVnode.el);
            oldEndVnode = oldChildren[--oldEndIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else if (isSameVnode(oldStartVnode, newEndVnode)) { // 交叉比对
            patchVnode(oldStartVnode, newEndVnode);
            el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
            oldStartVnode = oldChildren[++oldStartIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else {
            let moveIndex = map[newStartVnode.key];
            if (moveIndex !== undefined) {
                let moveVnode = oldChildren[moveIndex];
                el.insertBefore(moveVnode.el, oldStartVnode.el);
                oldChildren[moveIndex] = undefined;
                patchVnode(moveVnode, newStartVnode);
            } else {
                el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
            }
            newStartVnode = newChildren[++newStartIndex];
        }
    }
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            let chiledEl = createElm(newChildren[i]);
            let anchor = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null;
            el.insertBefore(chiledEl, anchor);
        }
    }
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            if (oldChildren[i]) {
                let chiledEl = oldChildren[i].el;
                el.removeChild(chiledEl);
            }
        }
    }
}