import { newArrayPrototype } from "./array";
import { Dep } from "./dep";

class Observer {
    constructor(data) {

        this.dep = new Dep();
        // Object.defineProperty只能劫持已经存在的属性（Vue里面会为此单独写一些API $set $delete等）
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })
        if (Array.isArray(data)) {
            // 重写数组的七个变异方法
            data.__proto__ = newArrayPrototype;
            this.observeArray(data);
        } else {
            this.walk(data);
        }
    }

    walk(data) { // 循环对象 对属性依次劫持
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
    }

    observeArray(data) {
        data.forEach(item => observe(item))
    }
}

function dependArray(value) {
    value.forEach(i => {
        i.__ob__?.dep.depend();
        if (Array.isArray(i)) {
            dependArray(i);
        }
    })
}

export function defineReactive(target, key, value) { // 闭包
    const childOb = observe(value);
    const dep = new Dep();
    Object.defineProperty(target, key, {
        get() {
            if (Dep.target) {
                dep.depend();
                if (childOb) {
                    childOb.dep.depend();
                    if (Array.isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return value;
        },
        set(newValue) {
            if (newValue === value) return;
            observe(newValue);
            value = newValue;
            dep.notify();
        }
    })
}

export function observe(data) {
    if (typeof data !== 'object' || data === null) {
        return; // 只对对象进行劫持
    }

    if (data.__ob__ instanceof Observer) { // 说明这个对象被代理过了
        return data.__ob__;
    }

    // 如果一个对象被劫持过了，那就不需要再被劫持了
    // 要判断一个对象是否被劫持过，可以增添一个实例，用实例来判断是否被劫持过
    return new Observer(data);
}