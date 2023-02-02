const strats = {};
const LIFECYCLE = ['beforeCreate', 'created'];
LIFECYCLE.forEach(hook => {
    strats[hook] = function (p, c) {
        if (c) {
            if (p) {
                return p.concat(c);
            }
            return [c];
        }
        return p;
    }
});

strats.components = function (parentVal, childVal) {
    const res = Object.create(parentVal);
    if (childVal) {
        for (const key in childVal) {
            res[key] = childVal[key];
        }
    }
    return res;
}

export function mergeOptinons(parent, child) {
    const options = {};
    function mergeField(key) {
        // 策略模式 减少if/else 
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key]);
        } else {
            options[key] = child[key] || parent[key];
        }
    }
    for (const key in parent) {
        mergeField(key);
    }
    for (const key in child) {
        if (!parent.hasOwnProperty(key)) {
            mergeField(key);
        }
    }
    return options;
}