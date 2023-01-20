(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCature = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCature));
  var endTag = new RegExp("^<\\/".concat(qnameCature, "[^>]*>"));
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var startTagClose = /^\s*(\/?)>/;
  function parseHTML(html) {
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = []; // 用于存放元素的
    var currentParent; // 指向的是栈中的最后一个元素 
    var root;
    // 最终需要转化成一颗抽象语法树
    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }
    function start(tag, attrs) {
      var node = createASTElement(tag, attrs);
      if (!root) {
        root = node;
      }
      if (currentParent) {
        node.parent = currentParent;
        currentParent.children.push(node);
      }
      stack.push(node);
      currentParent = node;
    }
    function chars(text) {
      text = text.replace(/\s/g, '');
      text && currentParent.children.push({
        type: TEXT_TYPE,
        text: text,
        parent: currentParent
      });
    }
    function end(tag) {
      stack.pop();
      currentParent = stack[stack.length - 1];
    }
    function advance(n) {
      html = html.substring(n);
    }
    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          // 标签名
          attrs: []
        };
        advance(start[0].length);

        // 如果不是开始标签 就一直匹配下去
        var attr, _end;
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] || true
          });
        }
        if (_end) {
          advance(_end[0].length);
        }
        return match;
      }
      return false;
    }

    // HTML 最开始是个<div></div>
    while (html) {
      var textEnd = html.indexOf('<');

      // 如果textEnd为0说明是一个开始标签或者结束标签
      // 如果textEnd > 0 说明就是文本的结束位置
      if (textEnd === 0) {
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          // 解析到开始标签
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }
      if (textEnd > 0) {
        var text = html.substring(0, textEnd);
        if (text) {
          chars(text);
          advance(text.length); // 解析到的文本
        }
      }
    }

    return root;
  }

  function genProps(attrs) {
    var str = '';
    var _loop = function _loop() {
      var attr = attrs[i];
      if (attr.name === 'style') {
        var obj = {};
        attr.value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          obj[key] = value;
        });
        attr.value = obj;
      }
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    return "{".concat(str.slice(0, -1), "}");
  }
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function gen(node) {
    if (node.type === 1) {
      return codegen(node);
    } else {
      // 文本
      var text = node.text;
      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        var tokens = [];
        var match;
        defaultTagRE.lastIndex = 0;
        var lastIndex = 0;
        while (match = defaultTagRE.exec(text)) {
          var index = match.index;
          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }
          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }
  function genChildren(children) {
    return children.map(function (child) {
      return gen(child);
    }).join(',');
  }
  function codegen(ast) {
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length > 0 ? genProps(ast.attrs) : 'null').concat(ast.children.length ? ",".concat(children) : '', ")");
    return code;
  }
  function compileToFunciton(template) {
    // 将template转换成AST语法树
    var ast = parseHTML(template);
    // 生成render方法 （render方法执行后的返回结果就是虚拟DOM）
    var code = codegen(ast);
    code = "with(this){return ".concat(code, "}");
    return new Function(code);
  }

  var strats = {};
  var LIFECYCLE = ['beforeCreate', 'created'];
  LIFECYCLE.forEach(function (hook) {
    strats[hook] = function (p, c) {
      if (c) {
        if (p) {
          return p.concat(c);
        }
        return [c];
      }
      return p;
    };
  });
  function mergeOptinons(parent, child) {
    var options = {};
    function mergeField(key) {
      // 策略模式 减少if/else 
      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
      } else {
        options[key] = child[key] || parent[key];
      }
    }
    for (var key in parent) {
      mergeField(key);
    }
    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }
    return options;
  }

  function initGlobalAPI(Vue) {
    // 静态方法
    Vue.options = {};
    Vue.mixin = function (mixin) {
      // 我们希望将用户的选项和全局的Options进行合并
      this.options = mergeOptinons(this.options, mixin);
      return this;
    };
  }

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.id = id$1++;
      // 这里存放着当前属性对应的watcher有哪些
      this.subs = [];
    }
    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // this.subs.push(Dep.target);
        Dep.target.addDep(this);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);
    return Dep;
  }();
  Dep.target = null;
  var stack = [];
  function pushTarget(watcher) {
    stack.push(watcher);
    Dep.target = watcher;
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var id = 0;
  // 不同的组件有不同的watcher
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, options, cb) {
      _classCallCheck(this, Watcher);
      this.id = id++;
      this.renderWatcher = options;
      if (typeof exprOrFn === 'string') {
        this.getter = function () {
          return vm[exprOrFn];
        };
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
    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
        if (!this.depsId.has(id)) {
          this.deps.push(dep);
          this.depsId.add(id);
          dep.addSub(this);
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this);
        var value = this.getter.call(this.vm);
        popTarget();
        return value;
      }
    }, {
      key: "depend",
      value: function depend() {
        this.deps.forEach(function (dep) {
          return dep.depend();
        });
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        var oldValue = this.value;
        var newValue = this.get();
        if (this.user) {
          this.cb.call(this.vm, newValue, oldValue);
        }
      }
    }]);
    return Watcher;
  }();
  var queue = [];
  var has = {};
  var pending = false;
  function flushSchedulerQueue() {
    var flushQueue = queue.slice(0);
    queue = [];
    has = {};
    pending = false;
    flushQueue.forEach(function (q) {
      return q.run();
    });
  }
  function queueWatcher(watcher) {
    var id = watcher.id;
    if (!has[id]) {
      queue.push(watcher);
      has[id] = true;
      if (!pending) {
        nextTick(flushSchedulerQueue);
        pending = true;
      }
    }
  }
  var callbacks = [];
  var waiting = false;
  function flushCallBacks() {
    waiting = false;
    var cbs = callbacks.slice(0);
    callbacks = [];
    cbs.forEach(function (cb) {
      return cb();
    });
  }
  var timerFun;
  if (Promise) {
    timerFun = function timerFun() {
      Promise.resolve().then(flushCallBacks);
    };
  } else if (MutationObserver) {
    var observer = new MutationObserver(flushCallBacks);
    var textNode = document.createTextNode(1);
    observer.observe(textNode, {
      characterData: true
    });
    timerFun = function timerFun() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timerFun = function timerFun() {
      setImmediate(flushCallBacks);
    };
  } else {
    timerFun = function timerFun() {
      setTimeout(flushCallBacks);
    };
  }
  function nextTick(cb) {
    callbacks.push(cb);
    if (!waiting) {
      timerFun();
      waiting = true;
    }
  }

  function createElementVNode(vm, tag, data) {
    if (data == null) {
      data = {};
    }
    var key = data.key;
    if (key) {
      delete data.key;
    }
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    return vnode(vm, tag, key, data, children);
  }
  function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  function vnode(vm, tag, key, data, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text
    };
  }
  function isSameVnode(vnode1, vnode2) {
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
  }

  function createElm(vnode) {
    var tag = vnode.tag,
      data = vnode.data,
      children = vnode.children,
      text = vnode.text;
    if (typeof tag === 'string') {
      // 这里将真实节点和虚拟节点对应起来，后续如果修改属性了
      vnode.el = document.createElement(tag);
      patchProps(vnode.el, {}, data);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }
  function patchProps(el, oldProps, props) {
    // 老的属性中有， 新的没有，要删除老的
    var oldStyles = oldProps.style || {};
    var newStyles = props.style || {};
    for (var key in oldStyles) {
      if (!newStyles[key]) {
        el.style[key] = '';
      }
    }
    for (var _key in oldProps) {
      if (!props[_key]) {
        el.removeAttribute(_key);
      }
    }
    for (var _key2 in props) {
      if (_key2 === 'style') {
        for (var styleName in props.style) {
          el.style[styleName] = props.style[styleName];
        }
      } else {
        el.setAttribute(_key2, props[_key2]);
      }
    }
  }
  function patch(oldVNode, vnode) {
    var isRealElement = oldVNode.nodeType;
    if (isRealElement) {
      // 初渲染流程
      var elm = oldVNode; // 获取真实元素
      var parentElm = elm.parentNode; // 拿到父元素
      var newElm = createElm(vnode);
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
      var _el = createElm(vnode);
      oldVNode.el.parentNode.replaceChild(_el, oldVNode.el);
      return _el;
    }

    // 文本情况 期望比较内容
    var el = vnode.el = oldVNode.el; // 复用老节点
    if (!oldVNode.tag) {
      // 是文本
      if (oldVNode.text !== vnode.text) {
        el.textContent = vnode.text; // 用新文本覆盖旧文本
      }
    }

    // 是标签 标签对比标签属性
    patchProps(el, oldVNode.data, vnode.data);

    // 比较子节点
    var oldChildren = oldVNode.children || [];
    var newChildren = vnode.children || [];
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
    newChildren.forEach(function (child) {
      return el.appendChild(createElm(child));
    });
  }
  function updateChildren(el, oldChildren, newChildren) {
    // 用户操作列表 经常会用一些push shift pop等这些方法
    // vue2中采用双指针的方式比较两个节点
    var oldStartIndex = 0;
    var newStartIndex = 0;
    var oldEndIndex = oldChildren.length - 1;
    var newEndIndex = newChildren.length - 1;
    var oldStartVnode = oldChildren[0];
    var newStartVnode = newChildren[0];
    var oldEndVnode = oldChildren[oldEndIndex];
    var newEndVnode = newChildren[newEndIndex];
    console.log(oldStartVnode);
    console.log(newStartVnode);
    console.log(oldEndVnode);
    console.log(newEndVnode);
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      console.log(oldStartVnode);
      console.log(newStartVnode);
      console.log(oldEndVnode);
      console.log(newEndVnode);
    }
  }

  function initLifeCycle(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var el = vm.$el;
      vm.$el = patch(el, vnode);
    };
    Vue.prototype._c = function () {
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._v = function () {
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._s = function (value) {
      if (_typeof(value) !== 'object') return value;
      return JSON.stringify(value);
    };
    Vue.prototype._render = function () {
      return this.$options.render.call(this);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el;
    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };
    new Watcher(vm, updateComponent, true);
  }

  // vue核心流程
  // 1. 创造响应式数据
  // 2. 将模板转换成AST语法树
  // 3. 将AST语法树转换成render函数
  // 4. 后续每次数据更新可以只执行render函数（无需再次执行AST转化过程）
  // render函数会产生虚拟节点（使用响应式数据）
  // 根据生成的虚拟节点创造真实的DOM

  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      handlers.forEach(function (handler) {
        return handler.call(vm);
      });
    }
  }

  // 对数组中的部分方法进行重写

  var oldArrayPrototype = Array.prototype; // 获取数组的原型

  var newArrayPrototype = Object.create(oldArrayPrototype);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']; // 找到所有的变异方法

  methods.forEach(function (method) {
    newArrayPrototype[method] = function () {
      var _oldArrayPrototype$me;
      // 内部调用原来的方法
      // 函数的劫持 切片编程
      // 增加自己的功能 ...
      var inserted;
      var ob = this.__ob__;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.splice(2);
      }
      if (inserted) {
        ob.observeArray(inserted);
      }
      ob.dep.notify();
      return (_oldArrayPrototype$me = oldArrayPrototype[method]).call.apply(_oldArrayPrototype$me, [this].concat(args));
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      this.dep = new Dep();
      // Object.defineProperty只能劫持已经存在的属性（Vue里面会为此单独写一些API $set $delete等）
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      });
      if (Array.isArray(data)) {
        // 重写数组的七个变异方法
        data.__proto__ = newArrayPrototype;
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 循环对象 对属性依次劫持
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);
    return Observer;
  }();
  function dependArray(value) {
    value.forEach(function (i) {
      var _i$__ob__;
      (_i$__ob__ = i.__ob__) === null || _i$__ob__ === void 0 ? void 0 : _i$__ob__.dep.depend();
      if (Array.isArray(i)) {
        dependArray(i);
      }
    });
  }
  function defineReactive(target, key, value) {
    // 闭包
    var childOb = observe(value);
    var dep = new Dep();
    Object.defineProperty(target, key, {
      get: function get() {
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
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue);
        value = newValue;
        dep.notify();
      }
    });
  }
  function observe(data) {
    if (_typeof(data) !== 'object' || data === null) {
      return; // 只对对象进行劫持
    }

    if (data.__ob__ instanceof Observer) {
      // 说明这个对象被代理过了
      return data.__ob__;
    }

    // 如果一个对象被劫持过了，那就不需要再被劫持了
    // 要判断一个对象是否被劫持过，可以增添一个实例，用实例来判断是否被劫持过
    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; // 获取所有的选项
    if (opts.data) {
      initData(vm);
    }
    if (opts.computed) {
      initComputed(vm);
    }
    if (opts.watch) {
      initWatch(vm);
    }
  }
  function initWatch(vm) {
    var watch = vm.$options.watch;
    var _loop = function _loop(key) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        handler.forEach(function (i) {
          return createWatch(vm, key, i);
        });
      } else {
        createWatch(vm, key, handler);
      }
    };
    for (var key in watch) {
      _loop(key);
    }
  }
  function createWatch(vm, key, handler) {
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(key, handler);
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }
  function initData(vm) {
    var data = vm.$options.data; // data 可能是函数或对象
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data;
    observe(data);

    // 将vm._data 用vm来代理就可以了
    for (var key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        proxy(vm, '_data', key);
      }
    }
  }
  function initComputed(vm) {
    var computed = vm.$options.computed;
    var watchers = vm._computedWatchers = {};
    for (var key in computed) {
      var userDef = computed[key];
      var fn = typeof userDef === 'function' ? userDef : userDef.get;
      watchers[key] = new Watcher(vm, fn, {
        lazy: true
      });
      difineComputed(vm, key, userDef);
    }
  }
  function difineComputed(target, key, userDef) {
    // const getter = typeof userDef === 'function' ? userDef : userDef.get;
    var setter = userDef.set || function () {};
    Object.defineProperty(target, key, {
      get: createComputedGetter(key),
      set: setter
    });
  }
  function createComputedGetter(key) {
    return function () {
      var watcher = this._computedWatchers[key];
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    };
  }
  function initStateMixin(Vue) {
    Vue.prototype.$nextTick = nextTick;
    Vue.prototype.$watch = function (exprOrFn, cb) {
      new Watcher(this, exprOrFn, {
        user: true
      }, cb);
    };
  }

  function initMixin(Vue) {
    // 给Vue增加init方法
    Vue.prototype._init = function (options) {
      // 用于初始化操作
      // vue vm.$options 就是获取用户的配置
      var vm = this;
      vm.$options = mergeOptinons(this.constructor.options, options); // 将用户的选项挂载到实例上

      callHook(vm, 'beforeCreate');
      // 初始化状态 计算属性 watch
      initState(vm);
      callHook(vm, 'created');
      if (options.el) {
        vm.$mount(options.el);
      }
    };
    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var ops = vm.$options;
      if (!ops.render) {
        var template;
        if (!ops.template && el) {
          template = el.outerHTML;
        } else {
          if (el) {
            template = ops.template;
          }
        }
        if (template) {
          var render = compileToFunciton(template);
          ops.render = render;
        }
      }
      mountComponent(vm, el); // 组件的挂载
    };
  }

  // 将所有的方法都耦合在一起
  function Vue(options) {
    // options就是用户的选项
    this._init(options);
  }
  initMixin(Vue); // 拓展了init方法
  initLifeCycle(Vue);
  initGlobalAPI(Vue);
  initStateMixin(Vue);
  var render1 = compileToFunciton("<ul>\n<li key=\"a\">a</li>\n<li key=\"b\">b</li>\n<li key=\"c\">c</li>\n</ul>");
  var vm1 = new Vue({
    data: {
      name: 'zf'
    }
  });
  var prevVnode = render1.call(vm1);
  var el = createElm(prevVnode);
  document.body.appendChild(el);
  var render2 = compileToFunciton("<ul>\n<li key=\"a\">a</li>\n<li key=\"b\">b</li>\n<li key=\"c\">c</li>\n<li key=\"d\">d</li>\n</ul>");
  var vm2 = new Vue({
    data: {
      name: 'zf'
    }
  });
  var nextVnode = render2.call(vm2);
  setTimeout(function () {
    patch(prevVnode, nextVnode);
  }, 1000);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
