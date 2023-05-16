package main

import (
	"os"
	"path/filepath"
	"replace-deploy/app"
)

var buildExPath string

// compile
func init() {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	buildExPath = filepath.Dir(filepath.Dir(ex))
}

func main() {
	// Run App
	app.CreateApp(buildExPath)
}
