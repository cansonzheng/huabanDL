# huabanDL
花瓣网图片下载工具

## 使用说明
本工具使用nodejs编写，运行需先安装nodejs环境
下载地址 https://nodejs.org，建议下载LTS版

安装成功之后

### 第一步
(如果是windows用户可直接执行 “初始化” 将自动运行以下命令)
打开 终端/命令行，定位到本目录，输入 npm install 回车，将自动下载依赖

### 第二步
修改配置文件 config.js 填写账号密码。
account 账号名
pwd 密码
board 要采集的画板，不填写默认为全部

### 第三步
(如果是windows用户可直接执行 “运行” 将自动运行以下命令)
打开 终端/命令行，定位到本目录，输入 npm start 回车，开始下载。

图片将会下载到download目录