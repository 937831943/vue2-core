import babel from 'rollup-plugin-babel';

// rollup 默认导出一个对象作为打包的配置文件
export default {
    input: './src/index.js', // 入口
    output: {
        file: './dist/vue.js', // 出口
        name: 'Vue', // global 增加Vue构造函数
        format: 'umd', // 打包格式
        sourcemap: true, // 希望可以调试源代码
    },
    plugins: [
        babel({
            exclude: 'node_modules/**' // 排除node_modules所有文件
        })
    ]
}