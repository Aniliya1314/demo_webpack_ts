## 基础功能配置

### 环境变量配置

1. 可通过自定义环境变量的方式区分项目业务环境，此时可借助**cross-env**和**weback.DefinePlugin**来设置.

   - cross-env: 兼容各系统的设置环境变量的包.
     > process.env.NODE_ENV 环境变量 webpack 会自动根据设置的 mode 字段来给业务代码注入对应的 development 和 production；但是通过 cross-env 进行设置后可以在 webpack 和 babel 的配置文件中进行访问.
   - webpack.DefinePlugin: webpack 内置的插件，可以为业务代码注入环境变量
     > webpack.DefinePlugin 的作用在于将 process.env.BASE_ENV 此类自定义的环境变量注入到业务代码中去

2. 处理 css 文件

   - css-loader:解析 css 文件代码
     > webpack 默认情况下只能识别 js 文件，是无法识别 css 文件的，因此需要安装 loader 来解析 css
   - style-loader:把解析后的 css 代码从 js 中抽离，放在头部的 style 标签中（运行时进行）

3. 支持 less 或 scss 文件

   - less-loader:解析 less 文件代码，将 less 编译为 css
     > 此处以 less 举例，则需要安装 less-loader 来进行 less 文件解析成 css 文件，再进行 css 文件解析流程
   - less:less 核心

4. 处理 css3 前缀兼容

   - postcss-loader：处理 css 时自动加前缀
     > 虽然 css3 现在浏览器支持率已经很高了，但有时候需要兼容一些低版本浏览器，需要给 css3 加前缀，postcss-loader 就是来给 css3 加浏览器前缀的
   - autoprefixer：决定添加那些浏览器前缀到 css 中
     > 需要一份浏览器清单以便 postcss-loader 知道要加哪些浏览器的前缀，可在根目录创建.browserslistrc 文件

5. babel 预设处理 js 兼容

   > js 不断新增很多方便好用的标准语法来方便开发,甚至还有非标准语法比如装饰器,都极大的提升了代码可读性和开发效率。但前者标准语法很多低版本浏览器不支持,后者非标准语法所有的浏览器都不支持。需要把最新的标准语法转换为低版本语法,把非标准语法转换为标准语法才能让浏览器识别解析,而 babel 就是来做这件事的。

   - babel-loader: 使用 babel 加载最新 js 代码并将其转换为 es5
     > 为了避免 webpack 配置文件过于庞大,可以把 babel-loader 的配置抽离出来，在根目录下新建 babel.config.js 文件，使用 js 作为配置文件是因为可以访问到 process.env.NODE_ENV 环境变量来区分开发还是打包环境
   - @babel/core: babel 编译的核心包
   - @babel/preset-env: babel 编译的预设，可以转换目前最新的 js 标准语法
   - core-js: 使用低版本 js 语法模拟高版本的库，也就是垫片

6. babel 处理 js 非标准语法

   > 虽然现在 react 主流开发是使用函数组件，但也有使用类组件的情况，此时可以用装饰器简化代码

   - tsconfig.json:配置装饰器支持
     > 配置 experimentalDecorators:true
   - @babel/plugin-proposal-decorators：装饰器语法解析

7. 复制 public 文件夹

   > 通常情况下 pulic 文件夹会放置一些静态资源如图片等，可以直接通过绝对路径引入而不需要经过 webpack 解析，此次可通过 [copy-webpack-plugin](https://www.npmjs.com/package/copy-webpack-plugin) 插件直接将 public 文件夹下内容复制到构建出口文件夹中

8. 处理图片文件

   > 在 webpack4 中可通过配置 file-loader 和 url-loader 处理图片文件，而在 webpack5 中使用内置的 asset-module 处理;另外在 ts 中应当声明图片模块

9. 处理字体和媒体文件
   > 字体文件与媒体文件的处理方式与图片相同，只需要将匹配的路径和打包后放置的路径对应修改即可

### 配置 react 模块热更新

一般只有在开发环境下时才需要热更新功能，热更新功能是在文件内容修改过后能够不触发浏览器刷新的情况下热替换模块文件，同时保留 react 组件的状态。在 webpack4 中需要添加 HotModuleReplacementPlugin 插件进行配置；而在 webpack5 中，只要 devServer:hot 为 true 就可生效.此时修改 css 文件以及 less 文件将会有热更新效果，但是若修改 tsx 文件仍然会进行浏览器刷新。可借助[@pmmmwh/react-refresh-webpack-plugin](https://www.npmjs.com/package/@pmmmwh/react-refresh-webpack-plugin) 插件与 [react-refresh](https://www.npmjs.com/package/react-refresh) 实现

### 优化构建速度

1. 构建耗时分析

   - speed-measure-webpack-plugin
     > 分析构建耗时，为了不影响正常的开发或者打包模式，可通过新建配置文件 webpack.analy.js 进行配置

2. 开启持久化存储缓存

   > webpack4 可通过 babel-loader 缓存 js，cache-loader 缓存 css 等资源的解析结果以及模块缓存插件 hard-source-webpack-plugin 的方式节省启动时间；webpack5 则新增了持久化缓存、改进缓存算法等优化，通过配置 **cache** 来缓存生成的 webpack 模块和 chunk，改善下一次打包的构建速度。

3. 开启多线程 loader

   > webpack 的 loader 默认在单线程执行，现在电脑一般都有多核 cpu，可以借助多核 cpu 开启多线程 loader 解析，可以极大地提升 loader 解析的速度。

   - [thread-loader](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Floaders%2Fthread-loader%2F%23root): 多线程解析 loader
     > 由于 thread-loader 不支持抽离 css 插件**MiniCssExtractPlugin.loader**,所以一般只配置多线程解析 js，开启多线程也是需要大约 600ms 左右的启动时间，因此比较适合规模较大的项目

4. 配置 alias 别名

   > webpack 可通过设置别名让后续引入的地方减少路径的复杂度

5. 缩小 loader 作用范围

   > 通常第三方库都是处理好的，不需要再使用 loader 进行解析，因此可以根据实际情况合理配置 include 与 exclude 字段控制 loader 的作用范围，来减少不必要的 loader 解析.

6. 精确使用 loader

   > 避免使用无用的 loader 解析

7. 缩小模块搜索范围

   > 使用 require 和 import 引入模块时如果有准确的相对或者绝对路径,就会去按路径查询,如果引入的模块没有路径,会优先查询 node 核心模块,如果没有找到会去当前目录下 node_modules 中寻找,如果没有找到会查从父级文件夹查找 node_modules,一直查到系统 node 全局模块；可通过配置 resolve:modules 来缩小模块收缩范围

8. devtool 配置

   开发过程中或者打包后的代码都是 webpack 处理后的代码，如果进行调试，肯定希望看到源代码而不是编译后的代码，**source map**就是用来做源码映射的，不同的映射模式会明显影响到构建和重新构建的速度，**devtool**选项就是 webpack 提供的选择源码映射方式的配置.

   devtool 的命名规则为`^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$`

   | 关键字    | 描述                                                       |
   | --------- | ---------------------------------------------------------- |
   | inline    | 代码内通过 dataUrl 形式引入 source map                     |
   | hidden    | 生成 source map 文件，但不使用                             |
   | eval      | `eval(...)` 形式执行代码，通过 dataUrl 形式引入 source map |
   | nosources | 不生成 source map                                          |
   | cheap     | 只需要定位到行信息，不需要列信息                           |
   | module    | 展示源代码中的错误位置                                     |

   开发环境推荐：**eval-cheap-module-source-map**

   - 本次开发首次打包慢点没关系，因为 eval 缓存的原因，热更新会很快
   - 开发中代码一般只需要定位到行就足够了，因此加上 cheap
   - 我们希望能够找到源代码的错误，而不是打包后的，所以需要加上 module

   打包环境推荐：**none**（不配置 devtool 选项）

   - 打包速度快，且不会泄漏源代码

9 其他优化配置

- [externals](https://www.webpackjs.com/configuration/externals/)
  > 外包拓展，打包时会忽略配置的依赖，会从上下文中寻找对应变量
- [module.noParse](https://www.webpackjs.com/configuration/module/#module-noparse)
  > 匹配到设置的模块将不进行依赖解析，适合 jquery，bootstrap 不依赖外部模块的包
- [ignorePlugin](https://webpack.js.org/plugins/ignore-plugin/#root)
  > 可以使用正则忽略一部分文件，常在使用多语言的包时可以把非中文语言包过滤掉

### 优化构建结果文件

1.  webpack 包分析工具

    - webpack-bundle-analyzer
      > 分析 webpack 打包后文件的插件，通过交互式可缩放树形图可视化 webpack 输出文件的大小。通过该插件可以对打包后的文件进行观察和分析，方便对不完美的地方进行针对性的优化

2.  抽取 css 样式文件

    - [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)
      > 在开发环境中我们希望 css 嵌入 style 标签以方便样式热替换,但打包时我们希望把 css 单独抽离出来，方便配置缓存策略。

3.  压缩 css 文件

    - [css-minimizer-webpack-plugin](https://www.npmjs.com/package/css-minimizer-webpack-plugin)
      > 上面配置了打包时把 css 抽离为单独 css 文件的配置，但并没有进行 css 压缩，需要使用此插件进行 css 压缩

4.  压缩 js 文件

    - [terser-webpack-plugin](https://www.npmjs.com/package/terser-webpack-plugin)
      > 设置 mode 为 production 时，webpack 会使用内置插件 terser-webpack-plugin 压缩 js 文件，该插件默认支持多线程压缩，但是上面配置 optimization.minimizer 压缩 css 后，js 压缩就失效了，需要手动进行添加，webpack 内部安装了该插件，但若是使用 pnpm，则需要手动再次安装依赖（pnpm 解决了幽灵依赖的问题）

5.  合理配置打包文件 hash

    项目维护时一般只会修改一部分代码，可以合理配置文件缓存，来提升前端加载页面速度和减少服务器压力，而**hash**就是浏览器缓存策略很重要的一部分。webpack 打包的 hash 分三种：

    - hash

      > 跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的 hash 值都会更改，并且全部文件都共用相同的 hash 值

    - chunkhash

      > 不同的入口文件进行依赖文件解析、构建对应的 chunk，生成对应的哈希值，文件本身修改或者依赖文件修改，chunkhash 值会变化

    - contenthash
      > 每个文件自己单独的 hash 值，文件的改动只会影响自身的 hash 值

    hash 是在输入文件时配置的，格式是`filename:"[name].[chunkhash:8][ext]"`,`[xx]`格式是 webpack 提供的占位符，`[:8]`是生成 hash 的长度

    | 占位符      | 解释                       |
    | ----------- | -------------------------- |
    | ext         | 文件后缀名                 |
    | name        | 文件名                     |
    | path        | 文件相对路径               |
    | folder      | 文件所在文件夹             |
    | hash        | 每次构建生成的唯一 hash 值 |
    | chunkhash   | 根据 chunk 生成 hash 值    |
    | contenthash | 根据文件内容生成 hash 值   |

    对于**js**可采用**chunkhash**的方式生成 hash 值，生产环境中会把一些公共库和程序入库文件区分开，单独打包构建。只要不改动公共库的代码，就可以保证其 hash 值不会受影响，可以继续使用浏览器缓存。

    对于**css**和**图片媒体资源**一般都是单独存在，可以采用**contenthash**，只有文件本省变化时才会生成新的 hash 值。

6.  代码分割第三方包和公共模块

    一般情况下第三方包的代码变化频率比较小，可以单独把**node_modules**中的代码单独打包，当第三方包代码没有变化时，则对应的 chunkhash 值也不会变化，可以有效利用浏览器缓存，还有公共的模块可以提取出来，避免重复打包加大代码整体体积，webpack 提供了代码分割功能，需要我们手动在优化项**optimization**中手动配置下代码分割[splitChunks](https://webpack.js.org/configuration/optimization/#optimizationsplitchunks)规则。

7.  tree-shaking 清理未引用的 js

    [tree-shaking](https://webpack.docschina.org/guides/tree-shaking/)的意思是摇树，在代码中指代摇掉未引用的代码，webpack2 版本之后开始支持，模式**mode**为**production**时就会默认开启 tree-shaking 功能以此来标记未引入代码然后移除掉。

8.  tree-shaking 清理未使用的 css

    - [purgecss-webpack-plugin](https://www.npmjs.com/package/purgecss-webpack-plugin)

      > 可以使用该插件在打包时移除未使用到的 css 样式，这个插件需要与**mini-css-extract-plugin**插件配合使用，还需要[glob-all](https://www.npmjs.com/package/glob-all)来选择要检测哪些文件里面的类名、id 以及标签名称

9.  资源懒加载

    像 react,vue 等单页应用会默认打包到一个 js 文件中，虽然使用代码分割可以把 node_modules 模块和公共模块分离，但是页面初始加载时还是回把整个项目的代码下载下来，其实只需要公共资源以及当前页面的资源就可以了，其他页面资源可以等使用到的时候在加载，可以有效提升首屏加载速度

    webpack 默认支持资源懒加载，只需要使用**import**语法来引入资源，webpack 打包时会自动打包为单独的资源文件，等使用到的时候动态加载

10. 资源预加载

    上面配置了资源懒加载后，虽然提升了首屏渲染速度，但是加载到资源的时候会有一个去请求资源的延时，如果资源比较大会出现延迟卡顿现象，可以借助**link**标签的**rel**属性**prefetch**与**preload**，link 标签除了加载 css 之外也可以加载 js 资源，设置 rel 属性可以规定 link 提前加载资源，但是加载资源后不执行，等用到了再执行

    - preload

      > 告诉浏览器页面必定需要的资源，浏览器一定会加载这些资源

    - prefetch

      > 告诉浏览器页面可能需要的资源，浏览器不一定去加载这些资源，会在空闲时加载

    对于当前页面很有必要的资源使用 preload，对于可能在将来的页面中使用的资源使用 prefetch.

    webpack v4.6.0+ 增加了对预获取和预加载的支持，通过在 import 引入动态资源时使用 webpack 的魔法注释方式

    ```js
    // 单个目标
    import(
    	/* webpackChunkName: "my-chunk-name" */ // 资源打包后的文件chunkname
    	/* webpackPrefetch: true */ // 开启prefetch预获取
    	/* webpackPreload: true */ // 开启preload预获取
    	"./module"
    )
    ```

11. 打包时生成 gzip 文件

    前端代码在浏览器运行，需要从服务器把 html、css、js 资源下载执行，下载的资源体积越小，页面加载速度就会越快，一般会采用**gzip**压缩，现在大部分浏览器和服务器都支持 gzip，可以有效较少静态资源文件大小，压缩率在 70%左右

    nginx 可以配置`gzip:on`来开启压缩，到那时只在 nginx 层面会开启，会在每次请求资源时都对资源进行压缩，压缩文件会需要时间和占用服务器 cpu 资源，更好的方式是前端在打包的时候直接生成 gzip 资源，服务器接收到请求，可以直接把对应压缩好的 gzip 文件返回给浏览器，节省事件和 cpu。

    webpack 可使用[compression-webpack-plugin](https://www.npmjs.com/package/compression-webpack-plugin)在打包时生成 gzip 文件

## 代码规范配置

### editorconfig 统一编辑器配置

1. 安装 vscode 插件 EditorConfig

2. 添加 **.editorconfig** 配置文件

### prettier 自动格式化代码

1. 安装 vscode 插件 Prettier

2. 添加 **.prettierrc.js** 配置文件

3. 添加 **.vscode/settings.json**

4. 添加 **.prettierignore** 配置文件忽略不需要格式化的文件或文件夹

### eslint + lint-staged 检测代码

1.  安装 vscode 插件 ESLint

2.  安装 eslint 依赖

    > 如果使用频繁可使用`npm i eslint -g`进行全局安装

3.  配置 **.eslintrc.js** 文件

    > 可通过运行`npm init @eslint/config`选择自己需要的配置，配置完成后会在根目录下生成 .eslintrc.js 文件。

4.  配置后产生的常见错误

    - 'React' must be in scope when using JSX

      > 由于 react18 版本中使用 jsx 不需要在引入 React 了，所以如果使用了 react17 以上版本，可进行以下配置

      ```js
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        //添加以下配置
        'plugin:react/jsx-runtime'
      ],
      ```

    - react is not defined

      > 通常由于第一点的配置后所引发的错误，这是由于@babel/preset-react 运行时 runtime 默认使用的是 classic 经典模式，不会自动导入任何东西，可将 runtime 参数配置为 automatic 自动导入 jsx 转换的函数

      ```js
      presets: [
      	...,
      	[
      		"@babel/preset-react",
      		{
      			runtime: "automatic"
      		}
      	],
      ]
      ```

    - 'module' is not defined.

      > 这是因为在执行第 3 点命令中选择了浏览器环境，但实际情况是需要 node 环境支持的，因从需要在 eslint 的 env 环境配置中添加 node 环境

      ```js
      env:{
      	browser:true,
      	es2021:true,
      	//添加以下配置
      	node:true
      }
      ```

    - React version not specified in eslint-plugin-react settings

      > 需要告诉 eslint 使用的 react 版本，在.eslintrc.js 中添加 settings 配置，让 eslint 自己检测 react 版本。

      ```js
      settings:{
      	"react":{
      	  "version":"detect"
      	}
      }
      ```

5.  使用 lint-staged 优化 eslint 检测

    - 在 package.json 添加 eslint 脚本
      ```js
      "eslint src/**/*.{tx,tsx}"
      ```
    - 安装 lint-staged

      > 上述 eslint 会检测 src 文件下所有的 ts,tsx 文件，虽然功能可以实现，但是当项目文件多的时候，检测的文件会很多，所花费的事件也就越长。正常情况下其实只需要检测提交到暂存区的文件，不在暂存区的文件就可以不用检测，而 lint-staged 就是来帮我们做这件事情的。

      > 修改 package.json 脚本的 eslint 的配置，--max-warning=0 表明警告也会中断命令

      ```json
      "eslint":"eslint --max-warning=0"
      "lint-staged":{
      	"src/**/*.{tx,tsx}":[
      		"npm run eslint"
      	]
      }
      ```

6.  使用 tsc 检测类型和报错

    有一些类型问题单通过配置的 eslint 无法检测出来，需使用 ts 提供的 tsc 工具进行检测。

    ```json
    "pre-check":"tsc && npx lint-staged"
    ```

### 项目 git 提交时检测语法规范

为了避免把不规范的代码提交到远程仓库，一般会在 git 提交代码阶段对代码进行语法检测，只有检测通过才能允许提交，git 为此提供了一系列的 githooks，而我们需要其中的 **pre-commit** 钩子，它会在 git 将代码提交到本地仓库之前执行。

1. 代码提交前 husky 检测语法

   - husky

     > 监听 githooks 的工具,安装依赖后可通过运行`npx husky install`命令生成.husky 配置文件夹（如果项目中没有初始化 git，则需要先执行 git init）.

     > 通过运行`npx husky add .husky/pre-commit 'npm run pre-check'`命令让 husky 支持监听 pre-commit 钩子，监听后执行上面定义的 npm run pre-check 语法检测

### 代码提交时检测 commit 备注规范

1. 安装和配置 commitlint

   - 首先安装@commitlint/config-conventional 与 @commitlint/cli 依赖，并在根目录创建 commitlint.config.js 文件添加相关配置。

   - 执行`npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'`命令,使 husky 支持监听 commit-msg 钩子，在钩子函数中使用 commitlint 验证。

## 参考

[webpack5 从零搭建完整的 react18+ts 开发和打包环境](https://juejin.cn/post/7111922283681153038)

[配置 React+ts 项目完整的代码及样式格式和 git 提交规范](https://juejin.cn/post/7101596844181962788)
