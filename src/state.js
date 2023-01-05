import { observe } from "./observe";

export function initState(vm) {
    const opts = vm.$options; // 获取所有的选项
    if (opts.data) {
        initData(vm);
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

