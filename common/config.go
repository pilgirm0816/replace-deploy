package common

import "net/http"

var (
	// 拉取远端代码所需要的信息
	Branch    = "master"
	RemoteUrl = "https://gitee.com/xiaozhangy/delivery-script-market" // 后期必须要改为公司代码仓库的源
	UserName  = "xiaozhangy"
	PassWord  = "zhangyan816bin"

	// Headers default Headers
	Headers http.Header = nil
	// TraceID default TraceID
	TraceID string = ""

	// EchoPath echo test path
	EchoPath = "/api/v1/do/echo"
	// UploadPackPath upload file path
	UploadPackPath = "/api/v1/resources/do/upload"
	// OperatePackPath operate file path
	OperatePackPath = "/api/v1/resources/do/operate"
	// AddFileServeLink add file serve link path
	AddFileServeLink = "/api/v1/file-services/do/add"
	// AddScriptMarket add script market path
	AddScriptMarket = "/api/v1/script-markets/do/add"
	// DoAddManyLink add many link path
	DoAddManyLink = "/api/v1/auth-links/do/add-many"
	// AuthorizationLinkBody authorization link `body` args
	AuthorizationLinkBody = map[string][]map[string]interface{}{
		// 登录授权链接
		"data": {
			{
				"apiAuthId":  nil,
				"expireTime": nil,
				"funcId":     "SwitchingSystem__api.login",
				"id":         "auln-IG3Tkwa1sy3T",
				"funcCallKwargsJSON": map[string]interface{}{
					"password": "INPUT_BY_CALLER",
					"username": "INPUT_BY_CALLER",
				},
				"showInDoc":      true,
				"tagsJSON":       []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":  10,
				"throttlingJSON": nil,
				"note":           "请求结果转换系统所属接口",
			},
			{
				// 登出授权链接
				"apiAuthId":  nil,
				"expireTime": nil,
				"funcId":     "SwitchingSystem__api.logout",
				"id":         "auln-UQyDEDhmf7yg",
				"funcCallKwargsJSON": map[string]interface{}{
					"username": "INPUT_BY_CALLER",
				},
				"showInDoc":      true,
				"tagsJSON":       []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":  10,
				"throttlingJSON": nil,
				"note":           "请求结果转换系统所属接口",
			},
			{
				// 请求转换授权链接
				"apiAuthId":  nil,
				"expireTime": nil,
				"funcId":     "SwitchingSystem__api.replace",
				"id":         "auln-u3HfcMXsKXdv",
				"funcCallKwargsJSON": map[string]interface{}{
					"url":      "INPUT_BY_CALLER",
					"body":     "INPUT_BY_CALLER",
					"method":   "INPUT_BY_CALLER",
					"displace": "INPUT_BY_CALLER",
				},
				"showInDoc":      true,
				"tagsJSON":       []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":  30,
				"throttlingJSON": nil,
				"note":           "请求结果转换系统所属接口",
			},
			{
				// 转换历史记录列表授权链接
				"apiAuthId":          nil,
				"expireTime":         nil,
				"funcId":             "SwitchingSystem__api.history_list",
				"id":                 "auln-aMG6lKAfHgJU",
				"funcCallKwargsJSON": map[string]interface{}{},
				"showInDoc":          true,
				"tagsJSON":           []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":      10,
				"throttlingJSON":     nil,
				"note":               "请求结果转换系统所属接口",
			},
			{
				// 转换历史记录详情授权链接
				"apiAuthId":  nil,
				"expireTime": nil,
				"funcId":     "SwitchingSystem__api.history_detail",
				"id":         "auln-tFOprXFMZw8R",
				"funcCallKwargsJSON": map[string]interface{}{
					"record_id": "INPUT_BY_CALLER",
				},
				"showInDoc":      true,
				"tagsJSON":       []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":  10,
				"throttlingJSON": nil,
				"note":           "请求结果转换系统所属接口",
			},
			{
				// 删除历史记录授权链接
				"apiAuthId":  nil,
				"expireTime": nil,
				"funcId":     "SwitchingSystem__api.delete_history",
				"id":         "auln-BOEfYoYPGvdk",
				"funcCallKwargsJSON": map[string]interface{}{
					"record_id": "INPUT_BY_CALLER",
				},
				"showInDoc":      true,
				"tagsJSON":       []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":  10,
				"throttlingJSON": nil,
				"note":           "请求结果转换系统所属接口",
			},
			{
				// 发布授权链接
				"apiAuthId":  nil,
				"expireTime": nil,
				"funcId":     "SwitchingSystem__api.issue",
				"id":         "auln-8HgL1uJbt2cl",
				"funcCallKwargsJSON": map[string]interface{}{
					"record_id": "INPUT_BY_CALLER",
					"url":       "INPUT_BY_CALLER",
				},
				"showInDoc":      true,
				"tagsJSON":       []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":  10,
				"throttlingJSON": nil,
				"note":           "请求结果转换系统所属接口",
			},
			{
				// 取消发布授权链接
				"apiAuthId":  nil,
				"expireTime": nil,
				"funcId":     "SwitchingSystem__api.abolish_issue",
				"id":         "auln-eTtXGCHMFZRX",
				"funcCallKwargsJSON": map[string]interface{}{
					"record_id":      "INPUT_BY_CALLER",
					"subscribe_link": "INPUT_BY_CALLER",
				},
				"showInDoc":      true,
				"tagsJSON":       []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":  10,
				"throttlingJSON": nil,
				"note":           "请求结果转换系统所属接口",
			},
			{
				// 请求转换接口(外部)授权链接
				"apiAuthId":  nil,
				"expireTime": nil,
				"funcId":     "SwitchingSystem__api.replace_external",
				"id":         "auln-71N9FAKTopAH",
				"funcCallKwargsJSON": map[string]interface{}{
					"url":      "INPUT_BY_CALLER",
					"body":     "INPUT_BY_CALLER",
					"method":   "INPUT_BY_CALLER",
					"displace": "INPUT_BY_CALLER",
				},
				"showInDoc":      true,
				"tagsJSON":       []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":  10,
				"throttlingJSON": nil,
				"note":           "请求结果转换系统所属接口",
			},
			{
				// 创建用户授权链接
				"apiAuthId":  nil,
				"expireTime": nil,
				"funcId":     "SwitchingSystem__api.create_user",
				"id":         "auln-SwACAjPoKQ08",
				"funcCallKwargsJSON": map[string]interface{}{
					"password": "INPUT_BY_CALLER",
					"username": "INPUT_BY_CALLER",
				},
				"showInDoc":      true,
				"tagsJSON":       []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":  10,
				"throttlingJSON": nil,
				"note":           "请求结果转换系统所属接口",
			},
			{
				// 查看用户授权链接
				"apiAuthId":          nil,
				"expireTime":         nil,
				"funcId":             "SwitchingSystem__api.get_users",
				"id":                 "auln-MqrOGXwqfuXB",
				"funcCallKwargsJSON": map[string]interface{}{},
				"showInDoc":          true,
				"tagsJSON":           []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":      10,
				"throttlingJSON":     nil,
				"note":               "请求结果转换系统所属接口",
			},
			{
				// 更新用户信息授权链接
				"apiAuthId":  nil,
				"expireTime": nil,
				"funcId":     "SwitchingSystem__api.update_user",
				"id":         "auln-6nNoFb5zmmes",
				"funcCallKwargsJSON": map[string]interface{}{
					"new_password": "INPUT_BY_CALLER",
					"user_id":      "INPUT_BY_CALLER",
				},
				"showInDoc":      true,
				"tagsJSON":       []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":  10,
				"throttlingJSON": nil,
				"note":           "请求结果转换系统所属接口",
			},
			{
				// 删除用户授权链接
				"apiAuthId":  nil,
				"expireTime": nil,
				"funcId":     "SwitchingSystem__api.delete_user",
				"id":         "auln-wGA9bENrypL4",
				"funcCallKwargsJSON": map[string]interface{}{
					"user_id": "INPUT_BY_CALLER",
				},
				"showInDoc":      true,
				"tagsJSON":       []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":  10,
				"throttlingJSON": nil,
				"note":           "请求结果转换系统所属接口",
			},
			{
				// 禁用用户授权链接
				"apiAuthId":  nil,
				"expireTime": nil,
				"funcId":     "SwitchingSystem__api.disable_user",
				"id":         "auln-3dm9raRP6bIm",
				"funcCallKwargsJSON": map[string]interface{}{
					"user_id": "INPUT_BY_CALLER",
				},
				"showInDoc":      true,
				"tagsJSON":       []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":  10,
				"throttlingJSON": nil,
				"note":           "请求结果转换系统所属接口",
			},
			{
				// 启用用户授权链接
				"apiAuthId":  nil,
				"expireTime": nil,
				"funcId":     "SwitchingSystem__api.enable_user",
				"id":         "auln-UevEGD3VM4UE",
				"funcCallKwargsJSON": map[string]interface{}{
					"user_id": "INPUT_BY_CALLER",
				},
				"showInDoc":      true,
				"tagsJSON":       []string{"replace-deploy", "一键部署", "ClickOnce"},
				"taskInfoLimit":  10,
				"throttlingJSON": nil,
				"note":           "请求结果转换系统所属接口",
			},
		},
	}
)
