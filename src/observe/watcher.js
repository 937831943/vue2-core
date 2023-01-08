import Dep from "./dep";

let id = 0;
// 不同的组件有不同的watcher
export default class Watcher {
    constructor(vm, fn, options) {
        this.id = id++;
        this.renderWatcher = options;

        // getter意味着调用这个函数可以发生取值操作
        this.getter = fn;
        this.deps = [];
        this.depsId = new Set();
        this.get();
    }
    addDep(dep) {
        let id = dep.id;
        if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
        }
    }
    get() {
        Dep.target = this;
        this.getter();
        Dep.target = null;
    }
    update() {
        this.get();
    }
}