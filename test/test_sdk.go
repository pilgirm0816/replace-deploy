package test

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"replace-deploy/common"
	"replace-deploy/sdk"
)

// newDataFluxFunc instantiation DataFluxFunc
func newDataFluxFunc(ak, sk, host, port string, useHttps, debug bool, Timeout int64) *sdk.DataFluxFunc {
	return &sdk.DataFluxFunc{
		AkId:     ak,
		AkSecret: sk,
		Host:     host,
		Port:     port,
		UseHttps: useHttps,
		Debug:    debug,
		Timeout:  Timeout,
	}
}

func main() {
	var timeOut int64
	timeOut = 30
	ak := "************"
	sk := "************"
	host := "xxx.xxx.xxx.xxx"
	port := "8088"
	debug := true
	useHttps := false // Whether to use https
	dff := newDataFluxFunc(ak, sk, host, port, useHttps, debug, timeOut)

	// 测试get请求
	testGet(dff)
	// 测试Post请求
	testPost(dff)
	// 测试上传文件
	// testUploadFile(dff)
	// 测试上传压缩包
	// testUploadPackage(dff)
	// 测试解压压缩包
	// testPostUnzip(dff)
	// addFileServe(dff)

}

// testGet Test get Authorization link (not body)
func testGet(dff *sdk.DataFluxFunc) {
	respCode, resp, err := dff.Get("/api/v1/auth-links/do/list", nil, nil, "")
	if err != nil {
		panic(err)
	} else {
		fmt.Println(respCode)
		fmt.Println(sdk.PrettyPrint(resp))
	}
}

// testPost Test add Authorization link
func testPost(dff *sdk.DataFluxFunc) {
	body := make(map[string]interface{})
	body = map[string]interface{}{
		"data": map[string]interface{}{
			"apiAuthId":  nil,
			"expireTime": nil,
			"funcId":     "demo__basic.plus",
			"id":         "auln-wGA9bENrypL4", // is customizable
			"funcCallKwargsJSON": map[string]string{
				"user_id": "INPUT_BY_CALLER",
			},
			"showInDoc":      true,
			"tagsJSON":       nil,
			"taskInfoLimit":  10,
			"throttlingJSON": nil,
			"note":           "test add link",
		},
	}
	postRespCode, postResp, err := dff.Post("/api/v1/auth-links/do/add", nil, body, nil, "")
	if err != nil {
		panic(err)
	} else {
		fmt.Println(postRespCode)
		fmt.Println(sdk.PrettyPrint(postResp))
	}
}

// testUploadFile Upload a single file to the file manager
func testUploadFile(dff *sdk.DataFluxFunc) {
	// Upload path
	path := "/api/v1/resources/do/upload"

	filename := "example.go"
	filepath := filepath.Join("your folder", filename)
	// Read the file into a buffer
	file, err := os.Open(filepath)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	fileContents, err := io.ReadAll(file)
	if err != nil {
		panic(err)
	}

	// Create a multipart form
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add the file to the multipart form
	part, err := writer.CreateFormFile("files", filename)
	if err != nil {
		panic(err)
	}
	part.Write(fileContents)

	fields := map[string]string{
		"folder": "test",
	}
	for key, value := range fields {
		err = writer.WriteField(key, fmt.Sprintf("%v", value))
		if err != nil {
			panic(fmt.Errorf("failed to write field data: %v", err))
		}
	}
	// Close the multipart form
	if err = writer.Close(); err != nil {
		panic(err)
	}
	// set Content-Type is `multipart/form-data`
	contentType := writer.FormDataContentType()

	fileRespCode, fileResp, err := dff.Upload(path, filename, "", fields, nil, nil, body, contentType)
	if err != nil {
		panic(err)
	} else {
		fmt.Println(fileRespCode)
		fmt.Println(fileResp)
	}

}

// testUploadPackage Upload a zip to the file manager
func testUploadPackage(dff *sdk.DataFluxFunc) {
	// Upload path
	path := "/api/v1/resources/do/upload"

	fileName := "example.zip"
	filePath := filepath.Join("your folder", fileName)
	zipFile, err := os.Open(filePath)
	if err != nil {
		panic(err)
	}
	defer zipFile.Close()
	// Create a buffer to write the contents of the file to
	fileContents, err := io.ReadAll(zipFile)
	if err != nil {
		fmt.Println(err)
		return
	}
	// Create a multipart form
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add the file to the request body
	fw, err := writer.CreateFormFile("files", fileName)
	if err != nil {
		panic(err)
	}
	fw.Write(fileContents)
	fields := map[string]string{
		"folder": "test",
	}
	for key, value := range fields {
		err = writer.WriteField(key, fmt.Sprintf("%v", value))
		if err != nil {
			panic(fmt.Errorf("failed to write field data: %v", err))
		}
	}
	if err = writer.Close(); err != nil {
		panic(err)
	}
	// set Content-Type is `multipart/form-data`
	contentType := writer.FormDataContentType()

	packRespCode, packResp, err := dff.Upload(path, fileName, "", fields, nil, nil, body, contentType)
	if err != nil {
		panic(err)
	} else {
		fmt.Println(packRespCode)
		fmt.Println(packResp)
	}
}

// testPostUnzip Unzip the directory
func testPostUnzip(dff *sdk.DataFluxFunc) {
	// unzip path
	path := "/api/v1/resources/do/operate"
	body := make(map[string]interface{})
	body = map[string]interface{}{
		"targetPath":        "/test/example.zip",
		"operation":         "unzip",
		"operationArgument": nil,
	}
	unzipRespCode, unzipResp, err := dff.Post(path, nil, body, nil, "")
	if err != nil {
		panic(err)
	} else {
		fmt.Println(unzipRespCode)
		fmt.Println(sdk.PrettyPrint(unzipResp))
	}
}

func addFileServe(dff *sdk.DataFluxFunc) {
	body := map[string]interface{}{
		"data": map[string]interface{}{
			"id":         "fsvc-repalce",
			"note":       common.ZHCNUiMessage["fileServeNote"],
			"root":       "replace/",
			"isDisabled": false,
		},
	}
	fileServeRespCode, fileServeRespData, err := dff.Post(common.AddFileServeLink, nil, body, common.Headers, common.TraceID)
	if fileServeRespCode != 200 || err != nil {
		panic(err)
	}
	fileServeData := fileServeRespData.(map[string]interface{})
	fileServeId, ok := fileServeData["data"].(map[string]interface{})["id"].(string)
	if ok {
		fmt.Println(fileServeId)
	} else {
		fmt.Println(1)
	}
}
