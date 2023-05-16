$(()=>{
  // 树形结构
  let treeData = []
  // let treeData = [
  //   {
  //       "id": "1",
  //       "parent": "#",
  //       "text": "部门2"
  //   }, {
  //       "id": "2",
  //       "parent": "#",
  //       "text": "部门6"
  //   }, {
  //       "id": "3",
  //       "parent": "1",
  //       "text": "部门2-1"
  //   },
  //   {
  //       "id": "6",
  //       "parent": "1",
  //       "text": "部门2-2"
  //   }, {
  //       "id": "7",
  //       "parent": "6",
  //       "text": "部门2-2-1"
  //   },
  //   {
  //       "id": "4",
  //       "parent": "2",
  //       "text": "部门2-2"
  //   }, {
  //       "id": "5",
  //       "parent": "3",
  //       "text": "部门2-1-1"
  //   }, {
  //       "id": "8",
  //       "parent": "3",
  //       "text": "部门2-1-2"
  //   }
  // ]

  // 请求方式选择
  let treeCompare = {}
  const apimethod = $('#apimethod')
  apimethod.on('change', (d)=>{
    let _apimethod = $(d.target).val()
    // $('#paramsList').find('textarea').val('')
    _apimethod == 'GET' ? $('#paramsList').hide().find('textarea').val('') : $('#paramsList').show().find('textarea').val('')
  })

  // 获取转换对象
  let index = 0
  transformObject = (d, parent) => {
    // $('#exchangesList .apiparamname')
    // console.log('d',Object.keys(d), d)
    if (parent == '#') index = 0
    let keysLists = []
    if(typeof d == 'object') {
      if (Array.isArray(d)) {
        keysLists = Object.keys(d[0])
      } else {
        keysLists = Object.keys(d)
      }
      keysLists.forEach((keysText)=>{
        index = index + 1
        let obj = {
          id: index,
          parent: parent,
          text: keysText,
        }
        treeData.push(obj)
        transformObject(d[keysText], index)
      })
    }
  }

  // 点击发送原始请求
  requestapiAction = (apilink, method, params) => {
    let _promise = requestApi(apilink, {
      method: method,
      param: params
    }, '')
    _promise.then((d)=>{
      treeData = []
      transformObject(d, '#')
    })
    return _promise
  }

  // 点击发送请求
  const requestapiBtn = $('#requestapi')
  requestapiBtn.on('click', (d)=>{
    let apilink = $('#apilink').val()
    let method = $('#apimethod').val()
    let params = $('#paramsData').val()
    // console.log('apilink,method,params',apilink,method,params)
    let requestPromise = {}
    if (method == 'GET') {
      requestPromise = requestapiAction(apilink, method, '')
    } else if (method == 'POST') {
      requestPromise = requestapiAction(apilink, method, JSON.parse(params))
    }
    $('#output').html(`<div class="text-center"><div class="spinner-border" role="status"><span class="sr-only"></span></div></div>`)
    requestPromise.then((d)=>{
      $("#output").JSONView(d, { collapsed: false })
      // 默认展开
      $('.collapse-content').eq(0).collapse('show')
    })
  })

  // 加一行
  addTransformRow = () => {
    let exchangesList = $('#exchangesList')
    let idx = exchangesList.children(':last-child').attr('idx') || 0
    exchangesList.append(`<div class="input-group mb-3" idx=${+idx + 1}>
    <div class="form-control form-control-sm apiparamname">点击选择参数</div>
      <div class="dropdown-menu" style="top: 41px;">
        <content class="dropdowntree"></content>
      </div>
      <input type="text" class="form-control form-control-sm apiparamvalue" placeholder="参数名改">
      <button class="btn btn-inverse-danger btn-icon removeExchange"><i class="mdi mdi-delete-forever"></i></button>
    </div>`)
  }
  $('#addexchange').on('click', addTransformRow)

  // 减一行
  removeTransformRow = (obj) => {
    let idx = $(obj.target).parents('.input-group').attr('idx')
    delete treeCompare[idx]
    $(obj.target).parents('.input-group').remove()
  }
  $('#exchangesList').on('click', '.removeExchange',removeTransformRow)

  // 展开返回结果
  $('.collapse-title').on('click',(d)=>{
    $(d.target).parents('.card').children('.collapse-content').collapse('toggle')
  })

  // 触发选择字段弹框
  $('#exchangesList').on('click', '.apiparamname', (d)=>{
    // 树形结构 从id获取text
    let getTextInTree = (data, ids) => {
      let text = ''
      if (Array.isArray(ids)) {
        ids.forEach((ds)=>{
          let obj = data.find((d) => {
            return d.id == ds
          })
          let arr = []
          arr.push(obj.text)
        })
        text = arr.join(',')
      } else {
        let obj = data.find((d) => {
          return d.id == ids
        })
        text = obj.text
      }
      return text
    }
    // 获取节点的父级
    let getParentsInTree = (data, node) => {
      let parentsArr = []
      node.parents.reverse().shift()
      node.parents.forEach((id)=>{
        let o = data.find((d)=>{return d.id == id})
        parentsArr.push(o.text)
      })
      return parentsArr
    }
    // 由数据构成一个树形的数据结构
    let loadTree = (data) => {
      if ($(d.target).parent().find('.dropdown-menu').hasClass('show')) {
        $('.dropdown-menu').removeClass('show')
      } else {
        $('.dropdown-menu').removeClass('show')
        $(d.target).parent().find('.dropdown-menu').addClass('show')
        let tree = $(d.target).parent().find('.dropdowntree').jstree({"core":{"themes":{"icons":false},"data":data}})
        try{
          // $('#output').jstree({"plugins": ["checkbox","contextmenu","dnd","massload","search","sort","state","types","unique","changed","wholerow","condtionalseect", "themes"]})

          // $('#treeoutput').jstree({"plugins": ["checkbox","contextmenu","dnd","massload","search","sort","state","types","unique","changed","wholerow","condtionalseect", "themes"]})
          tree.on('select_node.jstree', (el,selected_node) => {
            // console.log("select_node.jstree: ", selected_node)
            $('.dropdown-menu').removeClass('show')
            let parentsArr = getParentsInTree(data, selected_node.node)
            // console.log('parentsArr', parentsArr)
            $(d.target).attr('parents', JSON.stringify(parentsArr)).text(getTextInTree(data, selected_node.node.id))
          })
          // .on("changed.jstree", function(el,data) {
          //     console.log("changed.jstree",el,data);
          // })
        }
        catch(err){
          console.log(err)
        }
      }
    }
    // 加载树形数据结构
    
    let apilink = $('#apilink').val()
    let method = $('#apimethod').val()
    let params = $('#paramsData').val()
    let loadtreePromise = {}
    if (method == 'GET') {
      loadtreePromise = requestapiAction(apilink, method, '')
    } else if (method == 'POST') {
      loadtreePromise = requestapiAction(apilink, method, JSON.parse(params))
    }
    loadtreePromise.then((d)=>{
      // $("#output").JSONView(d, { collapsed: false });
      // let data = {}
      loadTree(treeData)
    })

  })

  // 点击转换
  const confirmtransform = $('#confirmtransform')
  confirmtransform.on('click', (d)=>{
    // 拼接转换参数
    let groupArr = $('#exchangesList .input-group')
    let displace = {}
    Array.from(groupArr).forEach((item)=>{
      // console.log('text', $(item).find('.apiparamname').text())
      // console.log('parents', JSON.parse($(item).find('.apiparamname').attr('parents')).join('/'))
      let _text = $(item).find('.apiparamname').text()
      let parent = JSON.parse($(item).find('.apiparamname').attr('parents')).join('/')
      let _parents = '/' + ((parent ? parent + '/' : parent) || $(item).find('.apiparamname').text())
      if (!displace[_parents]) {
        displace[_parents] = {}
      }
      displace[_parents][$(item).find('.apiparamname').text()] = $(item).find('.apiparamvalue').val()
    })
    // console.log('displace', displace)
    let apilink = $('#apilink').val()
    let apimethod = $('#apimethod').val()
    let body = $('#paramsData').val()
    let param = {}
    if (apimethod == 'POST') {
      param = {
        "kwargs": {
          "url": apilink,
          "method": apimethod,
          "body": JSON.parse(body),
          "displace": displace
        }
      }
    } else if (apimethod == 'GET') {
      param = {
        "kwargs": {
          "url": apilink,
          "method": apimethod,
          "displace": displace
        }
      }
    }
    let transformPromise = getPromise(api['转换'], 'POST', JSON.stringify(param))
    // console.log(api['转换'], 'POST', JSON.stringify(param))
    transformPromise.then((rs)=>{
      $('#output').html('')
      $('#outputexchange').html('')
      $('.view-api').hide()
      if (!rs.is_error) {
        $('#output').JSONView(rs.row)
        $('#outputexchange').JSONView(rs.result)
        $('.view-api').show()
        $('#apiUrl').val(api['转换'])
        $('#apiParams').val(JSON.stringify(param))
        // 提示
        alert_tips('success', '转换成功')
        // 按钮显示
        btnPublish.show()
        btnUnPublish.hide()
        // 发布按钮的赋值
        btnPublish.attr('record_id',rs.record_id)
        btnUnPublish.attr('record_id',rs.record_id)
        // 更新左侧历史记录
        let historylistPromise = getPromise(api['历史记录'], 'GET', null)
        historylistPromise.then((historylistRs)=>{
          _renderList(historylistRs)
        })

      } else {
        alert_tips(rs.msg.split('|')[0], rs.msg.split('|')[1])
      }
      
    })
  })

  // 发布
  const btnPublish = $('.btn-publish')
  // 取消发布
  const btnUnPublish = $('.btn-unpublish')
  btnPublish.on('click', (d)=>{
    let param = {
      "kwargs": {
        "url": $('#apilink').val(),
        "record_id": btnPublish.attr('record_id')
      }
    }
    let publishPromise = getPromise(api['发布接口'],'POST', JSON.stringify(param))
    publishPromise.then((rs)=>{
      btnPublish.hide()
      btnUnPublish.show()
      // 取消发布按钮的赋值
      btnUnPublish.attr('subscribe_link',rs.data.subscribe_link)
    })
  })

  btnUnPublish.on('click', (d)=>{
    let param = {
      "kwargs": {
        "record_id": btnUnPublish.attr('record_id'),
        "subscribe_link": btnUnPublish.attr('subscribe_link')
      }
    }
    let publishPromise = getPromise(api['取消发布接口'],'POST', JSON.stringify(param))
    publishPromise.then((rs)=>{
      btnPublish.show()
      btnUnPublish.hide()
    })
  })

  // 弹出提示，3秒消失
  showTips = (status, msg) => {
    $('.transform-tips').show()
  }

  // modal 查看请求
  $('.view-api').on('click', ()=>{
    $('#viewApiModal').modal('show')
  })
  
  // 
  requestApi = (api, params, exchanges) => {
    let method = params.method || 'GET'
    // http://47.97.159.26:8081/api/v1/al/auln-4h88yoTNCd42/simplified
    // {
    //   "name":"施翔","pwd":"123123sx"
    // }

    let param = params.param
    let promise = getPromise(api, method, param)
    return promise
  }
})
