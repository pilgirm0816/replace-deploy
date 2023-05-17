## *replace-deploy*
****
`replace-deploy`是<font color=red>一键部署</font>**请求结果转换系统**的重要工具，**请求结果转换系统**完全依托于[DataFlux Func](https://func.guance.com/)平台运行。
其存在主要是为了解决：*在请求第三方数据接口，所返回的数据字段名称与前端所需字段名称不一致的问题以及其他方面的数据处理问题*。

### [文档（待书写）]()

### 源码编译与下载
#### 下载
你可以点击这里[**直接下载**](https://github.com/pilgirm0816/replace-deploy/releases)并选择对应的操作系统， 也可以通过以下方式自行编译 

_**下载操作系统及要求**_

|              操作系统               |   架构    |
| :---------------------------------: | :-------: |
|        macOS 13.3 或更高版本        |   amd64   |
| Windows 7, Server 2008R2 或更高版本 | amd64/386 |
#### 源码编译
`replace-deploy`在开发过程中依赖了一些外部工具，我们必须先将这些工具准备好才能比较顺利的编译`replace-deploy`

##### 设置Golang环境

如果没有安装可以从[Go官方网站](https://golang.org)下载并按照指南进行安装

>Go-1.20及以上版本

##### 安装其他工具

* fyne:`go get fyne.io/fyne/v2`

##### 编译

本部署系统的编译文件主要为`build.sh`和`build-win.bat`两个文件

* Mac
```shell
<you folder path>: /bin/bash ./build.sh
```
* Windows
```shell
<you folder path>: build-win.bat
```