package business

import (
	"bytes"
	"errors"
	"fmt"
	"fyne.io/fyne/v2/widget"
	"io"
	"mime/multipart"
	"os"
	"replace-deploy/common"
	"replace-deploy/sdk"
	"strings"
)

// DeployWorker Sets the deployment work structure field
type DeployWorker struct {
	Ak           string
	Sk           string
	Domain       string
	ResultOutput *widget.Entry
}

// newDataFluxFunc Create DataFluxFunc
func newDataFluxFunc(ak, sk, host, port string, useHttps bool) *sdk.DataFluxFunc {
	dff := &sdk.DataFluxFunc{
		AkId:     ak,
		AkSecret: sk,
		Host:     host,
		Port:     port,
		Timeout:  3,
		UseHttps: useHttps,
		Debug:    true,
	}
	return dff
}

// echo echo test
func (dw *DeployWorker) echo(dff *sdk.DataFluxFunc) (isError bool) {
	// setting args
	query := map[string][]string{
		"string":  {"echo_test"},
		"integer": {"1"},
		"boolean": {"true"},
	}
	body := map[string]interface{}{
		"echo": "echo_test",
	}
	// send request
	echoRespCode, _, err := dff.Post(common.EchoPath, query, body, common.Headers, common.TraceID)
	if echoRespCode != 200 || err != nil {
		return false
	}
	return true
}

// _setup Install required code
func (dw *DeployWorker) _setup(dff *sdk.DataFluxFunc) {
	// Pull the remote code and get the script ID
	dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["pullUpScriptMarket"] + "\n")
	scriptId, scriptFlag, err := dw.pullCode(dff)
	if !scriptFlag || err != nil {
		dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["pullScriptMarketCodeFailed"] + "\n")
		return
	}
	dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["pullScriptMarketCodeSuccess"] + "\n")

	installFlag := dw.installCode(dff, scriptId)
	if !installFlag {
		dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["installScriptSetFailed"] + "\n")
		return
	}
	dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["installScriptSetSuccess"] + "\n")

	addLinkFlag := dw.addLink(dff)
	if !addLinkFlag {
		dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["addAuthorizationLinkFailed"] + "\n")
		return
	}
	dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["addAuthorizationLinkSuccess"] + "\n")
}

// _deploy Execute the deployment process
func (dw *DeployWorker) _deploy(exPath, domain string, dff *sdk.DataFluxFunc) {
	// 更新接口文档&&上传压缩包并解压
	docFlag, err := common.WriteDocument(exPath, domain)
	if !docFlag || err != nil {
		dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["uploadDocFailed"] + "\n")
		return
	}
	dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["uploadDocSuccess"] + "\n")

	gzipFlag, zipFileName, err := common.Gzip(exPath)
	if !gzipFlag || err != nil {
		dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["gzipFileFailed"] + "\n")
		return
	}

	uploadPackFlag, err := dw.uploadPack(dff, zipFileName)
	if !uploadPackFlag || err != nil {
		dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["uploadPackFailed"] + "\n")
		return
	}
	// delete old zip
	err = os.RemoveAll(zipFileName)
	if err != nil {
		fmt.Println("File delete failed!")
	} else {
		fmt.Println("File delete success!")
	}

	fileServeId, fileServeFlag, err := dw.addFileServe(dff)
	if !fileServeFlag || err != nil {
		dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["addFileServeFailed"] + "\n")
		return
	}
	dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["deploySuccess"] + "\n")
	fileServeLink := strings.Join([]string{domain, "/api/v1/fs/", fileServeId, "/index.html"}, "")
	msg := fmt.Sprintf("请访问链接: %v ", fileServeLink)
	dw.ResultOutput.SetText(dw.ResultOutput.Text + msg + "\n")
	dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["desc"] + "\n")
}

// Run start worker
func (dw *DeployWorker) Run(exPath string) {
	flag := common.VerifyDomain(dw.Domain)
	if !flag {
		// Set Empty
		dw.ResultOutput.Text = ""
		dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["domainError"] + "\n")
		return
	}
	useHttps, host, port := common.SplitDomain(dw.Domain)
	dff := newDataFluxFunc(dw.Ak, dw.Sk, host, port, useHttps)
	var domain string
	if useHttps {
		domain = strings.Join([]string{"https://", host, ":", port}, "")
	} else {
		domain = strings.Join([]string{"http://", host, ":", port}, "")
	}

	// Perform an echo test
	isError := dw.echo(dff)
	if !isError {
		// Set Empty
		dw.ResultOutput.Text = ""
		dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["echoTestFailed"] + "\n")
		return
	}
	// Set Empty
	dw.ResultOutput.Text = ""
	dw.ResultOutput.SetText(dw.ResultOutput.Text + common.ZHCNUiMessage["echoTestSuccess"] + "\n")

	// 拉取代码开放授权链接
	dw._setup(dff)
	// 上传前端网站所需文件，并解压开启文件服务
	dw._deploy(exPath, domain, dff)
}

// pullCode Remote pull code
func (dw *DeployWorker) pullCode(dff *sdk.DataFluxFunc) (string, bool, error) {
	body := map[string]interface{}{
		"data": map[string]interface{}{
			"type":        "git",
			"name":        common.ZHCNUiMessage["replaceScriptMarket"],
			"description": common.ZHCNUiMessage["replaceScriptMarket"],
			"configJSON": map[string]interface{}{
				"url":      common.RemoteUrl,
				"branch":   common.Branch,
				"user":     common.UserName,
				"password": common.PassWord,
			},
		},
		"setAdmin": false,
	}
	scriptMarketRespCode, scriptMarketRespData, err := dff.Post(common.AddScriptMarket, nil, body, common.Headers, common.TraceID)
	if scriptMarketRespCode != 200 || err != nil {
		return "", false, err
	}
	scriptMarketData := scriptMarketRespData.(map[string]interface{})
	scriptId, ok := scriptMarketData["data"].(map[string]interface{})["id"].(string)
	if ok {
		return scriptId, true, err
	} else {
		return "", false, err
	}
}

// installCode install code to `Func` platform
func (dw *DeployWorker) installCode(dff *sdk.DataFluxFunc, scriptId string) bool {
	installScriptPath := strings.Join([]string{"/api/v1/script-markets/", scriptId, "/do/install"}, "")
	body := map[string]interface{}{
		"scriptSetIds": []string{"SwitchingSystem"},
	}
	code, _, err := dff.Post(installScriptPath, nil, body, common.Headers, common.TraceID)
	if code != 200 || err != nil {
		return false
	}
	return true
}

// addLink do add many authorization link for `SwitchingSystem`
func (dw *DeployWorker) addLink(dff *sdk.DataFluxFunc) bool {
	code, _, err := dff.Post(common.DoAddManyLink, nil, common.AuthorizationLinkBody, common.Headers, common.TraceID)
	if code != 200 || err != nil {
		return false
	}
	return true
}

// uploadPack upload pack to `Func`
func (dw *DeployWorker) uploadPack(dff *sdk.DataFluxFunc, zipFileName string) (bool, error) {
	fileName := "replace.zip"
	zipFile, err := os.Open(zipFileName)
	if err != nil {
		return false, err
	}
	defer zipFile.Close()
	fileContents, err := io.ReadAll(zipFile)
	if err != nil {
		return false, err
	}
	// Create a multipart form
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	// Add the file to the request body
	fw, err := writer.CreateFormFile("files", fileName)
	if err != nil {
		return false, err
	}
	fw.Write(fileContents)
	fields := map[string]string{
		"folder": "", // data/resources
	}
	for key, value := range fields {
		err = writer.WriteField(key, fmt.Sprintf("%v", value))
		if err != nil {
			return false, err
		}
	}
	if err = writer.Close(); err != nil {
		return false, err
	}

	// set Content-Type is `multipart/form-data`
	contentType := writer.FormDataContentType()
	packRespCode, _, err := dff.Upload(common.UploadPackPath, fileName, common.TraceID, fields, common.Headers, nil, body, contentType)
	if packRespCode != 200 || err != nil {
		return false, err
	}
	// unzip
	unzipFlag := dw.operatePack(dff)
	if !unzipFlag {
		return false, errors.New("Unzip File Failed!")
	}
	return true, nil
}

// operatePack Unzip the uploaded file
func (dw *DeployWorker) operatePack(dff *sdk.DataFluxFunc) bool {
	body := map[string]interface{}{
		"targetPath":        "/replace.zip",
		"operation":         "unzip",
		"operationArgument": nil,
	}
	unzipRespCode, _, err := dff.Post(common.OperatePackPath, nil, body, common.Headers, common.TraceID)
	if unzipRespCode != 200 || err != nil {
		return false
	}
	return true
}

// addFileServe Add file service
func (dw *DeployWorker) addFileServe(dff *sdk.DataFluxFunc) (string, bool, error) {
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
		return "", false, err
	}
	fileServeData := fileServeRespData.(map[string]interface{})
	fileServeId, ok := fileServeData["data"].(map[string]interface{})["id"].(string)
	if ok {
		return fileServeId, true, err
	} else {
		return "", false, err
	}
}
