import { compileToFunciton } from "./compiler";
import { initGlobalAPI } from "./globalAPI";
import { initMixin } from "./init";
import { initLifeCycle } from "./lifecycle";
import { initStateMixin } from "./state";
import { createElm, patch } from "./vdom/patch";

// 将所有的方法都耦合在一起
function Vue(options) { // options就是用户的选项
    this._init(options);
}


initMixin(Vue); // 拓展了init方法
initLifeCycle(Vue);
initGlobalAPI(Vue);
initStateMixin(Vue);

const render1 = compileToFunciton(`<ul>
<li key="a">a</li>
<li key="b">b</li>
<li key="c">c</li>
</ul>`)
const vm1 = new Vue({ data: { name: 'zf' } })
const prevVnode = render1.call(vm1);
const el = createElm(prevVnode);
document.body.appendChild(el);
const render2 = compileToFunciton(`<ul>
<li key="a">a</li>
<li key="b">b</li>
<li key="c">c</li>
<li key="d">d</li>
</ul>`)
const vm2 = new Vue({ data: { name: 'zf' } })
const nextVnode = render2.call(vm2);

setTimeout(() => {
    patch(prevVnode, nextVnode);
}, 1000)

export default Vue;