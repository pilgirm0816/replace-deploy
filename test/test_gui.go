package test

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/layout"
	"fyne.io/fyne/v2/widget"
	"golang.org/x/text/language"
	"golang.org/x/text/message"
)

func main() {
	myApp := app.New()
	myWindow := myApp.NewWindow("Language Switcher")

	// 定义支持的语言列表
	languages := []string{"English", "中文", "Español", "Français", "Deutsch"}

	// 创建一个下拉列表用于选择语言
	languageSelect := widget.NewSelect(languages, func(selected string) {
		// 根据所选的语言设置当前的语言环境
		switch selected {
		case "English":
			message.SetString(language.English, "hello", "Hello")
		case "中文":
			message.SetString(language.Chinese, "hello", "你好")
		case "Español":
			message.SetString(language.Spanish, "hello", "Hola")
		case "Français":
			message.SetString(language.French, "hello", "Bonjour")
		case "Deutsch":
			message.SetString(language.German, "hello", "Hallo")
		}
		// 重新加载UI元素以显示本地化的文本
		myWindow.Content().Refresh()
	})

	// 创建一个包含一个简单的标签和一个按钮的框
	helloLabel := widget.NewLabel("")
	helloButton := widget.NewButton("Say Hello", func() {
		// 显示本地化的问候语
		hello := message.NewPrinter(language.Und)
		helloLabel.SetText(hello.Sprintf("hello"))
	})
	content := fyne.NewContainerWithLayout(layout.NewVBoxLayout(), helloLabel, helloButton)

	// 创建一个垂直包容器来显示UI元素
	container := fyne.NewContainerWithLayout(layout.NewVBoxLayout(), languageSelect, content)

	// 将容器添加到主窗口
	myWindow.SetContent(container)

	// 显示窗口并运行应用程序
	myWindow.ShowAndRun()
}
