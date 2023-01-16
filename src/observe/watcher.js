import { Dep, popTarget, pushTarget } from "./dep";

let id = 0;
// 不同的组件有不同的watcher
export default class Watcher {
    constructor(vm, exprOrFn, options, cb) {
        this.id = id++;
        this.renderWatcher = options;
        if (typeof exprOrFn === 'string') {
            this.getter = function () {
                return vm[exprOrFn];
            }
        } else {
            // getter意味着调用这个函数可以发生取值操作
            this.getter = exprOrFn;
        }
        this.deps = [];
        this.depsId = new Set();
        this.lazy = options.lazy;
        this.cb = cb;
        this.dirty = this.lazy;
        this.vm = vm;
        this.user = options.user;
        this.value = this.lazy ? undefined : this.get();
    }
    addDep(dep) {
        let id = dep.id;
        if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
        }
    }
    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }
    get() {
        pushTarget(this);
        const value = this.getter.call(this.vm);
        popTarget();
        return value;
    }
    depend() {
        this.deps.forEach(dep => dep.depend());
    }
    update() {
        if (this.lazy) {
            this.dirty = true;
        } else {
            queueWatcher(this);
        }
    }
    run() {
        const oldValue = this.value;
        const newValue = this.get();
        if (this.user) {
            this.cb.call(this.vm, newValue, oldValue);
        }
    }
}

let queue = [];
let has = {};
let pending = false;

function flushSchedulerQueue() {
    const flushQueue = queue.slice(0);
    queue = [];
    has = {};
    pending = false;
    flushQueue.forEach(q => q.run());
}

function queueWatcher(watcher) {
    const id = watcher.id;
    if (!has[id]) {
        queue.push(watcher);
        has[id] = true;
        if (!pending) {
            nextTick(flushSchedulerQueue);
            pending = true;
        }
    }
}

let callbacks = [];
let waiting = false;

function flushCallBacks() {
    waiting = false;
    let cbs = callbacks.slice(0);
    callbacks = [];
    cbs.forEach(cb => cb());
}

let timerFun;
if (Promise) {
    timerFun = () => {
        Promise.resolve().then(flushCallBacks);
    }
} else if (MutationObserver) {
    const observer = new MutationObserver(flushCallBacks);
    const textNode = document.createTextNode(1);
    observer.observe(textNode, {
        characterData: true
    });
    timerFun = () => {
        textNode.textContent = 2;
    }
} else if (setImmediate) {
    timerFun = () => {
        setImmediate(flushCallBacks);
    }
} else {
    timerFun = () => {
        setTimeout(flushCallBacks);
    }
}

export function nextTick(cb) {
    callbacks.push(cb);
    if (!waiting) {
        timerFun();
        waiting = true;
    }
}