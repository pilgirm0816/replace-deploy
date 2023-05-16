package main

import (
	"os"
	"path/filepath"
	"replace-deploy/app"
)

var buildExPathWin string

// compile
func init() {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	buildExPathWin = filepath.Dir(filepath.Dir(ex))
}

func main() {
	// Run App
	app.CreateApp(buildExPathWin)
}
