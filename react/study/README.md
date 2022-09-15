# 说明
这是个人的`React`学习笔记，以便后续查阅

# 目录
src----下面每个目录是一个知识点<br>
dist----`babel`打包后的`js`文件

# 使用
使用最原始的方法直接在`html`中引入`js`的方法来引入`react`文件，`jsx`文件需要使用`babel`来进行编译成`js`文件才能被使用<br>
```html
<!-- 可自行修改版本号，如：react@18改成react@17、react-dom@18改成react-dom@17 -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

1. 安装babel包
```sh
# 安装babel和babel-react预设
npm install -D babel-cli@6 babel-preset-react-app@3
```

2. 安装live-server热更新
```sh
npm install -D live-server
```

3. 因为要同时开启`babel`命令来监听`jsx`文件，还要同时启动`live-server`来热更新打开的页面，所以需要安装一个npm包来并行执行多条命令<br>
```sh
npm install -D concurrently
```

4. 编写命令
* 在`package.json`文件中的`scripts`加入命令`babel --watch src --out-dir dist --presets react-app/prod`<br><br>
参数：<br>
`--watch` 监听，只要有文件修改就自动编译jsx文件<br>
`src` 包含`jsx`文件的目录<br>
`--out-dir dist` 输出到`dist`目录下<br>
`--presets react-app/prod` 配置`babel`的`presets`选项<br><br>
总的：使用`babel`命令，并配置`presets`选项的值为`react-app/prod`  自动监听`src`目录下的`jsx`文件并转化成`js`输出到`dist`目录下<br>

* 加入命令`live-server --open=src`来开启热更新页面<br>
参数：<br>
`--open=src`默认打开`src`目录

* 多个命令同时运行加入命令`concurrently 'npm:babel' 'npm:live-server'`<br>
解释：同时运行 `npm run babel 和 npm run live-server`<br><br>

最终的`package.json`的`scripts`：
```json
"scripts": {
  "dev": "concurrently 'npm:babel' 'npm:live-server'",
  "babel": "babel --watch src --out-dir dist --presets react-app/prod",
  "live-server": "live-server --open=src"
},
```

5. 运行命令`npm run dev`
6. 在浏览器中打开相应目录下的`html`文件即可

# [掘金账号](https://juejin.cn/user/427045310706040 "拿稳了")
