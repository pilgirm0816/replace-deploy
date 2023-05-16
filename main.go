package main

import (
	"path/filepath"
	"replace-deploy/app"
	"runtime"
)

var exPath string

// develop
func init() {
	_, filename, _, ok := runtime.Caller(0)
	if ok {
		exPath = filepath.Dir(filename)
	}
}

func main() {
	// Run App
	app.CreateApp(exPath)
}
