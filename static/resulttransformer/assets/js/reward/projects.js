$(()=>{
  $('#testbtn').on('click', ()=>{
    let params = {
      info : `{"a":"1","b":2}`
    }
    let test = getPromise('http://47.97.159.26:8081/api/v1/al/auln-K1WIsEqzpi5Y/simplified', 'POST', {params: JSON.stringify(params)})
    test.then((e)=>{
      console.log('e',e)
    })
  })
  $('.addstyle').hide()
  // 项目列表
  getprojects = () => {
    let getprojectspromise = getPromise(api['项目列表'])
    getprojectspromise.then((rs)=>{
      let rsDate = rs.data
      let keys = ['index','name','isdirect','po_num','contract_num',['totalmoneybeforetax','totalmoney'],'cost','paymoney','recievemoney',['award','totalaward'],'create_time']
      let totalkeys = ['','','','','',['totalmoneybeforetax','totalmoney'],'cost','paymoney','recievemoney',['award','totalaward'],'']
      rsDate.length > 0 ? $('.project_null').hide() : $('.project_null').show()
      rsDate.forEach((item, idx)=>{
        let trcontainer = `<tr class="list" pid="${item['pid']}" ppid="${item['ppid']}">`
        keys.forEach((key)=> {
          if (Array.isArray(key)) {
            let val_arr = []
            key.forEach((_key)=>{
              val_arr.push(toFixed((item[_key] || 0),3))
            })
            trcontainer += `<td class="${key.join('_')}">${val_arr.join('/')}</td>`
          } else {
            if (key == 'create_time') {
              trcontainer += `<td class="${key}">${new Date(item[key]).toLocaleDateString()}</td>`
            } else if (key == 'index') {
              trcontainer += `<td>${idx+1}</td>`
            } else if (key == 'recievemoney') {
              trcontainer += `<td class="${key}">${item[key] >= 0 ? toFixed(item[key],3) : item[key]} (${((item[key] / item['totalmoneybeforetax']) * 100).toFixed(2)}%)</td>`
            } else if (key == 'isdirect') {
              trcontainer += `<td class="${key}">${getDirectTitle(item[key])}</td>`
            } else {
              trcontainer += `<td style="white-space: break-spaces;" class="${key}">${item[key] >= 0 ? toFixed(item[key],3) : item[key]}</td>`
            }
          }
        })
        trcontainer += '</tr>'
        $('#projects tbody').append(trcontainer)
      })
      // 汇总数据
      let totaltrcontainer = '<tr>'
      let total = {}
      totalkeys.forEach((key, index)=>{
        if (key) {
          let val_arr = []
          if (Array.isArray(key)) {
            key.forEach((_key)=>{
              total[_key] = 0
              rsDate.map(i=>total[_key] += i[_key])
              val_arr.push(toFixed((total[_key] || 0),3))
            })
            totaltrcontainer += `<td class="total_${key.join('_')}">${val_arr.join('/')}</td>`
          } else {
            total[key] = 0
            rsDate.map(i=>total[key] += i[key])
            if (key == 'recievemoney') {
              totaltrcontainer += `<td class="total_${key}">${toFixed(total[key],3)}(${(total[key] / total['totalmoneybeforetax'] * 100).toFixed(2)}%)</td>`
            }
            // else if (key == 'award') {
            //   totaltrcontainer += `<td class="total_${key}">${toFixed((total['award'] || 0),3)} / ${toFixed((total['totalaward'] || 0),3)}</td>`
            // } 
            else {
              totaltrcontainer += `<td class="total_${key}">${toFixed(total[key],3)}</td>`
            }
          }
        } else {
          if (index == 0) {totaltrcontainer += `<td class="total_name" style="text-align:center">总和</td>`} else {totaltrcontainer += `<td class="total_name">-</td>`}
        }
      })
      totaltrcontainer += '</tr>'
      $('#projects tbody').append(totaltrcontainer)
    })
  }
  getprojects()

  // 重新渲染列表
  render = () => {
    let trs = $('#score tbody tr.list');
  }

  // 修改了总金额，需要重新计算各成员奖金
  const awardinput = $('#award')
  awardinput.on('change', ()=>{
    calcamount(0)
  })

  // 删除项目条目
  removeProjectLine = (lineidx) => {
    $(`#addprojectscontainer tr[idx=${lineidx}]`).remove()
    let project_line = $('#addprojectscontainer tbody tr.list').length
    if (project_line < 1) {
      $('.addproject_null').show()
    }
  }

  // 总奖金计算
  const projectsinput = $('#projects input')
  $(document).on('blur', '#projects input', (d)=>{
    let award = 0
    for (let i = 0; i < $('#projects tbody tr.list').length; i++) {
      // let _idx = $('#projects tbody tr.list').eq(i).attr('idx')
      // award += +$(`.award_${_idx}`).val()
      award += +$('#projects tbody tr.list').eq(i).children('.award').text()
    }
    $('#award').val(award)
  })

  // 重置
  doreset = () => {
    $('.list').remove()
    $('.list_null').show()
    $('#award').val(0)
  }
  const reset = $('#reset')
  reset.on('click', ()=>{
    if (confirm('确定重置?') == true){
      doreset()
    }
  })

  // 加一行项目
  const addprojectbtn = $('#addprojectbtn')
  let project_idx = 0
  // 项目列名
  let project_key_array = ['name','isdirect','po_num','contract_num','totalmoneybeforetax','totalmoney','cost','awardpercent','paymoney','totalaward']
  addprojectbtn.on('click', ()=>{
    let ths = $('#addprojectscontainer th')
    let trcontainer = `<tr class="list" idx="${project_idx}">`
    for(let i = 0;i < ths.length-1;i++) {
      let _default = ''
      let attr = ''
      if (project_key_array[i] == 'awardpercent') {
        _default = 45
      } else if (project_key_array[i] == 'totalmoneybeforetax') {
        attr = `oninput=setTotalMoney(${project_idx})`
      } else if (project_key_array[i] == 'totalmoney' || project_key_array[i] == 'totalaward') {
        attr = 'readonly=readonly'
      }
      if (project_key_array[i] == 'isdirect') {
        trcontainer += `<td><select class="${project_key_array[i]}_${project_idx}"><option value="2">非直签</option><option value="5">直签</option></select></td>`  
      } else {
        trcontainer += `<td><input value="${ _default }" class="${project_key_array[i]}_${project_idx} form-control form-control-sm" ${attr}></td>`
      }
    }
    // trcontainer += `<td><button onclick="removeProjectLine(${project_idx})" class="btn_${project_idx}">-</button></td>`
    trcontainer += `<td style="width:44px;"><button onclick="removeProjectLine(${project_idx})" class="btn_${project_idx} btn btn-inverse-danger btn-icon"><i class="mdi mdi-delete-forever"></i></button></td>`
    trcontainer += '</tr>'
    $('#addprojectscontainer tbody').append(trcontainer)
    project_idx++
    $('.addproject_null').hide()
  })

  // 税后的金额从合同金额输入后自动生成
  setTotalMoney = (idx) => {
    let money = $(`.totalmoneybeforetax_${idx}`).val()
    let percent = $(`.awardpercent_${idx}`).val()
    $(`.totalmoney_${idx}`).val(toFixed(((money * 0.94) || 0),3))
    $(`.totalaward_${idx}`).val(toFixed(((money * 0.94 * (+percent * 0.001)) || 0),3))
  }

  // 确定添加按钮
  const confirmAddProject = $('#confirmAddProject')
  confirmAddProject.on('click', ()=>{
    // 要添加的项目对象列表
    let projectArr = []
    for (let i = 0; i < $('#addprojectscontainer tbody tr.list').length; i++) {
      let _idx = $('#addprojectscontainer tbody tr.list').eq(i).attr('idx')
      let _item = {
        name: $(`.name_${_idx}`).val(),
        po_num: $(`.po_num_${_idx}`).val(),
        contract_num: $(`.contract_num_${_idx}`).val(),
        totalmoneybeforetax: +$(`.totalmoneybeforetax_${_idx}`).val(),
        totalmoney: +$(`.totalmoney_${_idx}`).val(),
        totalaward: +$(`.totalaward_${_idx}`).val(),
        cost: +$(`.cost_${_idx}`).val(),
        paymoney: +$(`.paymoney_${_idx}`).val(),
        poolmoney: 0,
        award: 0,
        create_time: (new Date()).toLocaleString(),
        isdirect: $(`.isdirect_${_idx}`).val()
      }
      projectArr.push(_item)
    }
    let findprojectspromise = getPromise(api['项目列表简化']);
    findprojectspromise.then((rs)=>{
      // 列出所有已有可用项目，和需要录入的项目对比，有不存在其中的项目则添加，删除已经录入过的项目 GET
      let addProjectArr = []
      let repeatProjectArr = []
      projectArr.forEach((item)=>{
        let _i = rs.data.findIndex((i)=>{
          return i.name == item.name && i.po_num == item.po_num && i.contract_num == item.contract_num
        })
        if (_i == -1) {
          addProjectArr.push(item)
        } else {
          repeatProjectArr.push(item)
        }
      })
      let addprojectpromise = ''
      if (repeatProjectArr.length > 0) {
        $('.addproject-tips').addClass('bg-danger').text(`${repeatProjectArr.map(item=>item.name).join(',')}已存在。`)
      }
      // 添加没有添加过的项目
      else if (addProjectArr.length > 0){
        addprojectpromise = getPromise(api['批量加入新项目'], 'POST', {params: JSON.stringify(addProjectArr)})
      }
      addprojectpromise && addprojectpromise.then((r)=>{
        // 重置
        location.href='./projects.html'
      })
    })
  })

  $('#addProjectModal').on('show.bs.modal', (e)=>{
    $('.addproject_null').show()
    $('#addprojectscontainer .list').remove()
    let addProjectModalLabel = ''
    addProjectModalLabel = '添加'
    $('#addProjectModalLabel').text(addProjectModalLabel)
    $('.addproject-tips').removeClass('bg-success bg-danger').text('')
  })
  // 弹框消失的时候，重置
  $('#addProjectModal').on('hidden.bs.modal', (e)=>{
    $('.addproject_null').show()
    $('#addprojectscontainer .list').remove()
    $('.addproject-tips').removeClass('bg-success bg-danger').text('')
  })

})
