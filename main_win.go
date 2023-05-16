package main

import (
	"path/filepath"
	"replace-deploy/app"
	"runtime"
)

var exPathWin string

// develop for mac
func init() {
	_, filename, _, ok := runtime.Caller(0)
	if ok {
		exPathWin = filepath.Dir(filename)
	}
}

func main() {
	// Run App
	app.CreateApp(exPathWin)
}
