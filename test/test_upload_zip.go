package test

import (
	"archive/zip"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"replace-deploy/common"
	"strings"
)

func updateDoc() {
	flag, err := common.WriteDocument("/Users/binzhang/Code/replace-deploy/src", "http://127.0.0.1:8088")
	if flag == true && err == nil {
		fmt.Println("success")
	}
}

func uploadZip() {
	dirToZip := "src/static/resulttransformer"
	zipFileName := "src/static/replace.zip"
	// 预防：旧文件无法覆盖
	os.RemoveAll(zipFileName)

	// 创建zip文件
	zipFile, err := os.Create(zipFileName)
	if err != nil {
		panic(err)
	}
	defer zipFile.Close()

	// 创建zip.Writer
	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()

	// 递归压缩指定目录
	err = filepath.Walk(dirToZip, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		// 跳过顶层目录及其它子目录
		if path == dirToZip || !strings.HasPrefix(path, dirToZip+"/") {
			return nil
		}

		// 创建文件头信息
		header, err := zip.FileInfoHeader(info)
		if err != nil {
			return err
		}

		// 设置文件头信息中的名称，只保留相对路径
		header.Name = strings.TrimPrefix(path, dirToZip+"/")

		if info.IsDir() {
			// 如果是目录，则直接添加目录信息到zip.Writer中
			header.Name += "/"
			_, err = zipWriter.CreateHeader(header)
			if err != nil {
				return err
			}
		} else {
			// 如果是文件，则创建文件并将文件内容写入到zip.Writer中
			writer, err := zipWriter.CreateHeader(header)
			if err != nil {
				return err
			}
			file, err := os.Open(path)
			if err != nil {
				return err
			}
			defer file.Close()
			_, err = io.Copy(writer, file)
			if err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		panic(err)
	}

	fmt.Println("压缩完成！")
}

func test() {

	type Person struct {
		Name    string `json:"name"`
		Age     int    `json:"age"`
		Married bool   `json:"isMarried"`
	}

	person := Person{"Alice", 30, true}
	jsonBytes, _ := json.Marshal(person)
	var compactJsonBytes bytes.Buffer
	e := json.Compact(&compactJsonBytes, jsonBytes)
	if e != nil {
		panic(e)
	}
	fmt.Println(compactJsonBytes.String())
}

// CompactJsonMarshal appends to dst the JSON-encoded src with
// insignificant space characters elided.
func CompactJsonMarshal(data interface{}, enum int64) (string, bytes.Buffer) {
	jsonBytes, err := json.Marshal(data)
	if err != nil {
		panic(err)
	}
	var compactJsonBytes bytes.Buffer
	err = json.Compact(&compactJsonBytes, jsonBytes)
	if err != nil {
		panic(err)
	}
	if enum == 0 {
		return compactJsonBytes.String(), bytes.Buffer{}
	} else {
		return "", compactJsonBytes
	}
}

func main() {
	test()
	// updateDoc()
	// uploadZip()

}
