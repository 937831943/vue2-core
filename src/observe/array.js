// 对数组中的部分方法进行重写

const oldArrayPrototype = Array.prototype; // 获取数组的原型

export const newArrayPrototype = Object.create(oldArrayPrototype);

const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']; // 找到所有的变异方法

methods.forEach(method => {
    newArrayPrototype[method] = function (...args) {
        // 内部调用原来的方法
        // 函数的劫持 切片编程
        // 增加自己的功能 ...
        let inserted
        let ob = this.__ob__;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.splice(2);
            default:
                break;
        }
        if (inserted) {
            ob.observeArray(inserted);
        }
        return oldArrayPrototype[method].call(this, ...args)
    }
})