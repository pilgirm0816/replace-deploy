package app

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/layout"
	"fyne.io/fyne/v2/theme"
	"fyne.io/fyne/v2/widget"
	"path/filepath"
	"replace-deploy/business"
	"replace-deploy/common"
)

type entry struct {
	accessKeyEntry       *widget.Entry
	secretAccessKeyEntry *widget.Entry
	domainEntry          *widget.Entry
	resultEntry          *widget.Entry
}

type box struct {
	accessKeyBox       *fyne.Container
	secretAccessKeyBox *fyne.Container
	domainBox          *fyne.Container
	resultBox          *fyne.Container
}

func newEntry(ake, ske, de, re *widget.Entry) *entry {
	return &entry{
		ake,
		ske,
		de,
		re,
	}
}

func newBox(akb, skb, db, rb *fyne.Container) *box {
	return &box{
		akb,
		skb,
		db,
		rb,
	}
}

func newExecuteWorker(ak, sk, domain string, resultEntry *widget.Entry) *business.DeployWorker {
	worker := &business.DeployWorker{
		Ak:           ak,
		Sk:           sk,
		Domain:       domain,
		ResultOutput: resultEntry,
	}
	return worker
}

func makeWin(baseDir string) fyne.Window {
	// Create an application object
	app := app.NewWithID("replace-deploy.com")
	at := &appTheme{}
	regularFontPath := filepath.Join(baseDir, "static", "font", "Consolas-with-Yahei Bold Italic Nerd Font.ttf")
	at.SetFonts(regularFontPath, "")
	app.Settings().SetTheme(at)

	// Create a window
	win := app.NewWindow("replace-deploy")
	return win
}

func makeUi() (*entry, *box) {
	// Create Ak、Sk and host input
	accessKeyLabel := widget.NewLabel("AK:")
	accessKeyEntry := widget.NewEntry()
	accessKeyEntry.SetPlaceHolder(common.ZHCNUiMessage["enterAK"])
	accessKeyBox := container.NewVBox(
		accessKeyLabel,
		accessKeyEntry,
	)

	secretAccessKeyLabel := widget.NewLabel("SK:")
	secretAccessKeyEntry := widget.NewPasswordEntry()
	secretAccessKeyEntry.SetPlaceHolder(common.ZHCNUiMessage["enterSK"])
	secretAccessKeyBox := container.NewVBox(
		secretAccessKeyLabel,
		secretAccessKeyEntry,
	)

	domainLabel := widget.NewLabel("Host:")
	domainEntry := widget.NewEntry()
	domainEntry.SetPlaceHolder(common.ZHCNUiMessage["enterHost"])
	domainBox := container.NewVBox(
		domainLabel,
		domainEntry,
	)

	// Create a container to display the results
	resultLabel := widget.NewLabel("Result:")
	resultEntry := widget.NewMultiLineEntry()
	// lock
	resultEntry.TextStyle = fyne.TextStyle{Bold: true, Italic: true}
	resultEntry.SetPlaceHolder(common.ZHCNUiMessage["printResult"])
	resultGridWrap := container.NewGridWrap(fyne.NewSize(600, 350), resultEntry)
	resultBox := container.NewVBox(
		resultLabel,
		resultGridWrap,
	)

	// new object
	ptrEntry := newEntry(accessKeyEntry, secretAccessKeyEntry, domainEntry, resultEntry)
	ptrBox := newBox(accessKeyBox, secretAccessKeyBox, domainBox, resultBox)
	return ptrEntry, ptrBox
}

func CreateApp(baseDir string) {
	win := makeWin(baseDir)
	// Set window size
	win.Resize(struct {
		Width  float32
		Height float32
	}{Width: 600, Height: 700})

	ptrEntry, ptrBox := makeUi()

	// Create an execute button
	executeButton := widget.NewButtonWithIcon(common.ZHCNUiMessage["execute"], theme.ConfirmIcon(), func() {
		ak := ptrEntry.accessKeyEntry.Text
		sk := ptrEntry.secretAccessKeyEntry.Text
		domain := ptrEntry.domainEntry.Text
		worker := newExecuteWorker(ak, sk, domain, ptrEntry.resultEntry)
		// start worker
		worker.Run(baseDir)
		// w.Close()
	})

	// Create a cancel button
	cancelButton := widget.NewButtonWithIcon(common.ZHCNUiMessage["cancel"], theme.CancelIcon(), func() {
		// close window
		win.Close()
	})

	// Create a layout
	content := container.NewVBox(
		widget.NewLabel(common.ZHCNUiMessage["intro"]),
		ptrBox.accessKeyBox,
		ptrBox.secretAccessKeyBox,
		ptrBox.domainBox,
		ptrBox.resultBox,
		layout.NewSpacer(),
		container.NewHBox(
			layout.NewSpacer(),
			executeButton,
			cancelButton,
		),
	)
	content.Refresh()

	// Add a layout to the window
	win.SetContent(content)

	// Show window
	win.ShowAndRun()
}
