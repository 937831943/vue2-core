const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCature = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCature}`);
const endTag = new RegExp(`^<\\/${qnameCature}[^>]*>`);
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const startTagClose = /^\s*(\/?)>/;

export function parseHTML(html) {

    const ELEMENT_TYPE = 1;
    const TEXT_TYPE = 3;
    const stack = []; // 用于存放元素的
    let currentParent; // 指向的是栈中的最后一个元素 
    let root;
    // 最终需要转化成一颗抽象语法树
    function createASTElement(tag, attrs) {
        return { tag, type: ELEMENT_TYPE, children: [], attrs, parent: null }
    }


    function start(tag, attrs) {
        const node = createASTElement(tag, attrs);
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
        text && currentParent.children.push({ type: TEXT_TYPE, text, parent: currentParent })

    }

    function end(tag) {
        stack.pop();
        currentParent = stack[stack.length - 1];
    }

    function advance(n) {
        html = html.substring(n);
    }

    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1], // 标签名
                attrs: []
            }
            advance(start[0].length);

            // 如果不是开始标签 就一直匹配下去
            let attr, end;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length);
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] || true
                })
            }
            if (end) {
                advance(end[0].length)
            }
            return match;
        }
        return false;
    }

    // HTML 最开始是个<div></div>
    while (html) {
        const textEnd = html.indexOf('<');

        // 如果textEnd为0说明是一个开始标签或者结束标签
        // 如果textEnd > 0 说明就是文本的结束位置
        if (textEnd === 0) {
            const startTagMatch = parseStartTag();
            if (startTagMatch) { // 解析到开始标签
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            let endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1]);
                continue;
            }
        }
        if (textEnd > 0) {
            let text = html.substring(0, textEnd);
            if (text) {
                chars(text);
                advance(text.length); // 解析到的文本
            }
        }
    }

    return root;
}
