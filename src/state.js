import { observe } from "./observe";
import { Dep } from "./observe/dep";
import Watcher from "./observe/watcher";

export function initState(vm) {
    const opts = vm.$options; // 获取所有的选项
    if (opts.data) {
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
}

function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key];
        },
        set(newValue) {
            vm[target][key] = newValue;
        }
    })
}

function initData(vm) {
    let data = vm.$options.data; // data 可能是函数或对象
    data = typeof data === 'function' ? data.call(vm) : data
    vm._data = data;
    observe(data);

    // 将vm._data 用vm来代理就可以了
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            proxy(vm, '_data', key);
        }
    }

}

function initComputed(vm) {
    const computed = vm.$options.computed;
    const watchers = vm._computedWatchers = {};
    for (const key in computed) {
        const userDef = computed[key];
        let fn = typeof userDef === 'function' ? userDef : userDef.get;
        watchers[key] = new Watcher(vm, fn, { lazy: true });
        difineComputed(vm, key, userDef);
    }

}

function difineComputed(target, key, userDef) {
    // const getter = typeof userDef === 'function' ? userDef : userDef.get;
    const setter = userDef.set || (() => { });
    Object.defineProperty(target, key, {
        get: createComputedGetter(key),
        set: setter
    })
}

function createComputedGetter(key) {
    return function () {
        const watcher = this._computedWatchers[key];
        if (watcher.dirty) {
            watcher.evaluate();
        }
        if (Dep.target) {
            watcher.depend();
        }
        return watcher.value;
    }
}