## *replace-deploy*
****
### *Read this in other languages.*
****
[🇨🇳🇨🇳](https://github.com/pilgirm0816/replace-deploy/blob/main/README.zh_CN.md)

`replace-deploy`is <font color=red>one-click deployment</font> **Request a result transformation system** important tools，**Request a result transformation system** completely rely on [**DataFlux Func**](https://func.guance.com/) platform operation。\
It exists mainly to solve：*When requesting a third-party data interface, the returned data field name is inconsistent with the field name required by the front-end and other data processing problems*。

### [Document (to be written)]()

### Source code compilation and download
#### Download
You can click here[**Download directly**](https://github.com/pilgirm0816/replace-deploy/releases) and select the corresponding operating system, or you can compile it yourself in the following ways

_**Download & Request**_

|              system               |   Architecture    |
| :---------------------------------: | :-------: |
|        macOS 13.3 or later        |   amd64   |
| Windows 7, Server 2008R2 or later | amd64/386 |
#### Source code compilation
`replace-deploy`In the development process, we rely on some external tools, and we must first prepare these tools before compiling smoothly`replace-deploy`

##### Set up the Golang environment

If `GO` is not installed, you can download it from [Go official website](https://golang.org) and follow the guide to install it

>Go-1.20 and above

##### Install additional tools

* fyne:`go get fyne.io/fyne/v2`

##### Make

The compilation files of this deployment system are mainly `build.sh` and `build-win.bat` files

* Mac
```shell
<you folder path>: /bin/bash ./build.sh
```
* Windows
```shell
<you folder path>: build-win.bat
```