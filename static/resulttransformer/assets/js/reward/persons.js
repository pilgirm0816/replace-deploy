$(()=>{
  let search = location.href
  // 获取 url 上的参数
  let nameMatches = queryURLParams(search)
  let nameparam = nameMatches ? nameMatches['params'] : '';
  // $('.addstyle').hide()
  // 有 nameparam 时是明细数据，没有 nameparam 时是列表
  if (nameparam) {
    $('#topersonlist').show()
    $('#editperson').show()
    $('#projects').show()
    $('#addperson').hide()
    // let project_detail_key_array = ['name','troublerate','durationrate','responserate','ratio','percent','amount','poolamount','update_time']
    let project_detail_key_array = ['name','troublerate','durationrate','responserate','ratio','percent','amount','update_time']
    let personpromise = getPromise(`${api['成员详细列表']}?${search.split('?')[1]}`);
    let projectpromise = getPromise(`${api['成员项目详细列表']}?${search.split('?')[1]}`)
    let personprojectpromise = Promise.all([personpromise, projectpromise])
    personprojectpromise.then((res)=>{
      // 人员信息
      if(res[0].data.length) {
        $('.person_null').hide()
      }
      // 渲染成员列表
      renderPersonList(res[0].data, (person)=>{
        // 记录成员的信息（id、姓名、职位），编辑时用到。
        $('#editModal').data('id',person['id'])
        $('#editModal').data('name',person['name'])
        $('#editModal').data('position',person['position'])
        $('#editModal').data('deleted',person['deleted'])
      })
      // 成员在项目中的数据统计
      if(res[1].data.length) {
        $('.project_null').hide()
      }
      let map = new Map()
      res[1].data.map(d=>{
        if(map.has(d.award_id)){
          map.get(d.award_id).push(d)
        } else {
          map.set(d.award_id, [d])
        }
      })
      // console.log(res[1].data, map)
      map.forEach((project, awwrd_id)=>{
        let pname = project.map(d=> d.name)
        let ths = $('#projects th')
        let trcontainer = `<tr class="list">`
        trcontainer += `<td><p>${pname.join('</p><p>')}</p></td>`
        for(let i=1;i<ths.length-1;i++) {
          if (project_detail_key_array[i] == 'update_time') {
            trcontainer += `<td>${new Date(project[0][project_detail_key_array[i]]).toLocaleString()}</td>`
          } else {
            trcontainer += `<td>${toFixed(+project[0][project_detail_key_array[i]],3)}</td>`
          }
        }
        trcontainer += `<td class="addstyle"><button>-</button></td>`
        trcontainer += '</tr>'
        $('#projects tbody').append(trcontainer)
      })
      $('#projects .addstyle').hide()
    })
  } else {
    $('#topersonlist').hide()
    $('#editperson').hide()
    $('#projects').hide()
    $('#addperson').show()
    // 获取成员信息
    let names = []
    let namesArr = []
    let personpromise = getPromise(api['成员详细列表']);
    personpromise.then((res)=>{
      if(res.data.length) {
        $('.person_null').hide()
      }
      // 渲染成员列表
      renderPersonList(res.data)
      // 操作格点击不会跳转，其他 td 跳转详情页
      $('#score tbody tr td:not(.operation)').on('click', (e)=>{
        location.href=`./persons.html?params=${$(e.currentTarget).parent('tr').attr('nameparam')}`
      })
      $('#projects .addstyle').hide()
    })
  }

  doPersonPrivilege = (id, name, position, deleted) => {
    let params = {
      id, 
      name, 
      position, 
      deleted
    }
    let doPersonPrivilegePromise = getPromise(api['修改成员信息'], 'POST', {params: JSON.stringify(params)})
    doPersonPrivilegePromise.then((e)=>{
      if (e.code == 200) {location.reload()} else {}
    })
  }

  renderPersonList = (dataList, callback) => {
    const person_detail_key_array = ['index','name','position','troublerate','durationrate','responserate','ratio','percent','amount','poolamount']
    dataList.forEach((person, person_idx)=>{
      let ths = $('#score th')
      let trcontainer = `<tr class="list" nameparam="${person.name}">`
      for(let i=0;i<ths.length-1;i++) {
        if($.inArray(person_detail_key_array[i], ['name','position']) != -1) {
          trcontainer += `<td>${person[person_detail_key_array[i]]}</td>`
        } else if (person_detail_key_array[i] == 'index') {
          trcontainer += `<td>${person_idx+1}</td>`
        } else if (person_detail_key_array[i] == 'poolamount') {
          trcontainer += `<td>${toFixed(+person[person_detail_key_array[i]] * 10000,2)}</td>`
        } else {
          trcontainer += `<td>${toFixed(+person[person_detail_key_array[i]],2)}</td>`
        }
      }
      trcontainer += `<td class="operation addstyle">
        <div class="d-flex flex-nowrap">
          <button onclick="doPersonPrivilege('${person['id']}','${person['name']}','${person['position']}',0)" style="margin-right:1rem;" class="btn btn-inverse-success btn-icon ${person['deleted']!=1?'disabled':''}">启用</button>
          <button onclick="doPersonPrivilege('${person['id']}','${person['name']}','${person['position']}',1)" class="btn btn-inverse-danger btn-icon ${person['deleted']==1?'disabled':''}">禁用</button>
        </div>
      </td>`
      trcontainer += '</tr>'
      $('#score tbody').append(trcontainer)
      callback && typeof callback == 'function' ? callback(person) : ''
      
    })
  }

  // 返回按钮
  $('#topersonlist').on('click', ()=>{
    location.href='./persons.html'
  })

  // 确定修改，仅对职位的修改
  $('#confirmEdit').on('click', (e)=>{
    let editsign = $(e.target).attr('sign')
    let params = {
      name: $('#editName').val(),
      id: +$('#editModal').data('id'),
      position: $('#editPosition').val(),
      deleted: +$('#editModal').data('deleted')
    }
    let editapi = ''
    if (editsign == 'edit') {
      // 修改不检查可用性，因为修改不能改名字
      editapi = api['修改成员信息']
      let editPersonPromise = getPromise(editapi, 'POST', {params: JSON.stringify(params)})
      doOperate(editPersonPromise)
    } else {
      // 检查重复， 不管是不是可用，都在检查范围内
      editapi = api['添加成员信息']
      let checkPersonPromise = getPromise(`${api['成员列表验证用']}?params=${$('#editName').val()}`)
      checkPersonPromise.then((res)=>{
        if (res.data.length) {
          $('.edit-tips').addClass('bg-danger').text('名字重复了')
          return
        } else {
          editapi = api['添加成员信息']
          let editPersonPromise = getPromise(editapi, 'POST', {params: JSON.stringify(params)})
          doOperate(editPersonPromise)
        }
      })
    }
  })

  // 添加修改的实际操作方法
  doOperate = (promiseObj) => {
    promiseObj.then((res)=>{
      let editres = `${$('#editModalLabel').text()}失败`
      let editcss = 'bg-danger'
      if (res.code == 200) {
        editres = `${$('#editModalLabel').text()}成功`
        editcss = 'bg-success'
        setTimeout(()=>{
          $('#editModal').modal('hide')
          location.reload()
        },2000)
      }
      $('.edit-tips').addClass(editcss).text(editres)
    })
  }

  // 弹框出现的时候，初始化
  $('#editModal').on('show.bs.modal', (e)=>{
    let editModalLabel = ''
    let editsign = ''
    if($('#editModal').data('name')) {
      editModalLabel = '编辑'
      $('#editName').val($('#editModal').data('name'))
      $('#editPosition').val($('#editModal').data('position'))
      $('#editName').attr('readonly','readonly')
      editsign = 'edit'
    } else {
      editModalLabel = '添加'
      $('#editName').val('')
      $('#editPosition').val('')
      $('#editName').removeAttr('readonly')
      editsign = 'add'
    }
    $('#confirmEdit').attr('sign', editsign)
    $('#editModalLabel').text(editModalLabel)
    $('.edit-tips').removeClass('bg-success bg-danger').text('')
  })
  // 弹框消失的时候，重置
  $('#editModal').on('hidden.bs.modal', (e)=>{
    $('#editName').val('')
    $('#editPosition').val('')
    $('.edit-tips').removeClass('bg-success bg-danger').text('')
  })
  
})
