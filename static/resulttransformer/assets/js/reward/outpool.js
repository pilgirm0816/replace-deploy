$(()=>{
  let search = location.href
  // 获取 url 上的参数
  let nameMatches = queryURLParams(search)
  let nameparam = nameMatches ? nameMatches['params'] : ''
  // $('.addstyle').hide()
  // 有 nameparam 时是明细数据，没有 nameparam 时是列表
  $('#topoollist').hide()
  if (nameparam) {
    $('#topoollist').show()
  }
  // 总金额，添加池子奖金时使用。
  let pooltotalpromise = getPromise(api['池子金额总数']);
  // 池子出入金额列表
  let params = nameparam ? `?params=${nameparam}` : ''
  let poollistpromise = getPromise(`${api['池子拿出到成员金额列表']}${params}`)
  let poolkey = ['name','type','amount','totalmoney','update_time']
  // 池子列表展示
  let doPoollist = (rs) =>{
    let totalData = rs.data
    let poolListMap = new Map()
    totalData.map(d=>{
      poolListMap.has(d.name) ? poolListMap.get(d.name).push(d) : poolListMap.set(d.name, [d])
    })
    let output = totalData.filter(d=>d.type==1)
    var obj = {};
    newarr = output.reduce((item, next) => {
      obj[next.id] ? '' : obj[next.id] = true && item.push(next);
      return item;
    }, []);
    let outputpool = newarr.map(i=>i.amount)
    $('#outputpool').val(toFixed(eval(outputpool.join('+')),4))
    let personPoolListMap = poolListMap
    if (nameparam) {
      personPoolListMap = poolListMap.get(nameparam)
      if (personPoolListMap.length) $('.pool_null').hide()
    } else {
      // 元组要用 size，使用方式类似 Array，长度是属性(size)
      if (personPoolListMap.size) $('.pool_null').hide()
    }
    personPoolListMap.forEach((item, id)=>{
      let itemobj = ''
      let flag = ''
      if (nameparam) {
        itemobj = item
        flag = '0'
      } else {
        itemobj = item[0]
        flag = '1'
      }
      let ths = $('#pool_list th');
      let trcontainer = `<tr class="list" name="${itemobj.name}" idx="${id}" flag="${flag}">`
      for(let i = 0;i < ths.length;i++) {
        let _val = ''
        if (poolkey[i] == 'update_time') {
          _val = new Date(itemobj[poolkey[i]]).toLocaleDateString()
        }
        else if (poolkey[i] == 'type') {
          _val = getTypeText(+itemobj[poolkey[i]])
        } else if ($.inArray(poolkey[i], ['totalmoney']) != -1) {
          _val = toFixed((+itemobj[poolkey[i]]),4)
        } else if ($.inArray(poolkey[i], ['amount']) != -1) {
          _val = toFixed((+itemobj[poolkey[i]]) * 10000,2)
        } else {
          _val = itemobj[poolkey[i]] === '' ? '-' : itemobj[poolkey[i]]
        }
        trcontainer += `<td class="addstyle">${_val}</td>`
      }
      trcontainer += '</tr>'
      $('#pool_list tbody').append(trcontainer)
    })
    const poollist = $('#pool_list tr.list[flag=1]')
    poollist.on('click', (e)=>{
      // if ($(e.currentTarget).attr('awardid') != "0") 
      // location.href=`./reward.html?params=${$(e.currentTarget).attr('awardid')}`
      let name = $(e.currentTarget).attr('name')
      location.href=`./outpol.html?params=${name}`
    })
  }
  // 操作格点击不会跳转，其他 td 跳转详情页
  // $('#score tbody tr td:not(.operation)').on('click', (e)=>{
  //   location.href=`./persons.html?params=${$(e.currentTarget).parent('tr').attr('nameparam')}`
  // })

  // 返回按钮
  $('#topoollist').on('click', ()=>{
    location.href='./outpol.html'
  })

  // 确定修改，+或者-
  $('#confirmEdit').on('click', (e)=>{
    // let editsign = $(e.target).attr('sign')
    let params = {
      name: '',
      amount: +$('#amount').val(),
      totalmoney: +$('#amount').val() + +$('#edittotalpool').val(),
      type: 2,
      award_id: 0,
    }
    let editPoolPromise = getPromise(api['录入池子金额'], 'POST', {params: JSON.stringify([params])})
    doOperate(editPoolPromise, 'editpoolModal')
  })

  // 添加修改的实际操作方法
  doOperate = (promiseObj, id) => {
    promiseObj.then((res)=>{
      let editres = $(`#${id} .modal-title`).text() + "失败"
      let editcss = 'bg-danger'
      if (res.code == 200) {
        editres = $(`#${id} .modal-title`).text() + "成功"
        editcss = 'bg-success'
        setTimeout(()=>{
          $(`#${id}`).modal('hide')
          location.reload()
        },2000)
      }
      $(`#${id} .editpool-tips`).addClass(editcss).text(editres)
    })
  }

  // 弹框出现的时候，初始化
  $('#editpoolModal').on('show.bs.modal', (e)=>{
    let editpoolModalLabel = '添加'
    // pooltotalpromise.then((res)=>{
    //   let totalmoney = res.data.length ? res.data[0].totalmoney : 0
    //   $('#editpoolModal .totalpool').val(totalmoney)
    //   $('#amount').val(0)
    // })
    $('#editpoolModal .totalpool').val($('#restpool').val())
    $('#amount').val(0)
    $('#editpoolModalLabel').text(editpoolModalLabel)
    $('.editpool-tips').removeClass('bg-success bg-danger').text('')
  })
  // 弹框消失的时候，重置
  $('#editpoolModal').on('hidden.bs.modal', (e)=>{
    $('#editpoolModal .totalpool').val(0)
    $('#amount').val(0)
    $('#editpoolModalLabel').val('')
    $('.editpool-tips').removeClass('bg-success bg-danger').text('')
  })

  // 确定拿出
  $('#outconfirmEdit').on('click', (e)=>{
    // let editsign = $(e.target).attr('sign')
    let params = []
    let outamountlist = $('#score tr.list')
    let outtotalpool = $('#outtotalpool').val()
    outamountlist.each((idx, item)=>{
      let param = {
        name: $(`#score .outname_${idx}`).val(),
        amount: toFixed(+$(`#score .amount_${idx}`).val() / 10000, 4),
        totalmoney: +outtotalpool - toFixed(+$(`#score .amount_${idx}`).val() / 10000, 4),
        type: 1,
        award_id: 0,
      }
      params.push(param)
      outtotalpool = +outtotalpool - toFixed(+$(`#score .amount_${idx}`).val() / 10000, 4)
    })
    let isnull = params.findIndex(d => d.name == '')
    if (isnull == -1) {
      let editPoolPromise = getPromise(api['录入池子金额'], 'POST', {params: JSON.stringify(params)})
      doOperate(editPoolPromise, 'outpoolModal')
    } else {
      $(`#outpoolModal .editpool-tips`).addClass('bg-danger').text('先选择成员')
    }
  })

  // 弹框出现的时候，初始化
  const addscore = $('#addscore')
  let person_idx = 0
  $('#outpoolModal').on('show.bs.modal', (e)=>{
    let outpoolModalLabel = '拿出'
    // pooltotalpromise.then((res)=>{
    //   let totalmoney = res.data.length ? res.data[0].totalmoney : 0
    //   $('#outpoolModal .totalpool').val(totalmoney)
    //   $('#amount').val(0)
    // })

    let names = []
    let namesArr = []
    let namehtml = '<option value="">选择成员</option>'
    let personpromise = getPromise(api['成员列表简单']);
    personpromise.then((res)=>{
      names = res.data.map((r) => r.name)
      names.forEach((name)=>{
        let obj = {
          label: name,
          isShow: true
        }
        namesArr.push(obj)
      })
      // let person_idx = 0
      // let trcontainer = ''
      
      namesArr.forEach((_nameObj)=>{
        namehtml += _nameObj.isShow ? `<option value="${_nameObj.label}">${_nameObj.label}</option>` : ''
      })
      // trcontainer += `<select class="outname outname_${person_idx} form-control form-control-sm" item="${person_idx}">${namehtml}</select>`
      // $('#outpoolModal .outnamearr').html(trcontainer)
    })
    $('#outpoolModal .totalpool').val($('#restpool').val())
    $('#outamount').val(0)
    $('#outpoolModalLabel').text(outpoolModalLabel)
    $('.editpool-tips').removeClass('bg-success bg-danger').text('')

    // 绑定加一行
    addscore.on('click', (e)=>{
      let namehtml = '<option value="">选择成员</option>'
      // let ths = $('#score th');
      let trcontainer = `<tr class="list" idx="${person_idx}">`

      let _person_idx = $('#score tbody .list').length
      trcontainer += `<td style="width:60px" class="idx_text">${_person_idx + 1}</td>`
      namesArr.forEach((_nameObj)=>{
        namehtml += _nameObj.isShow ? `<option value="${_nameObj.label}">${_nameObj.label}</option>` : ''
      })
      trcontainer += `<td style="width: 100px;"><select class="outname outname_${person_idx} form-control form-control-sm" item="${person_idx}">${namehtml}</select></td>`
      trcontainer += `<td><input class="amount_${person_idx} form-control form-control-sm"></td>`
      // for(let i=1;i<ths.length-2;i++) {
      //   trcontainer += `<td><input class="${person_key_array[i]}_${person_idx} form-control form-control-sm"></td>`
      // }

      trcontainer += `<td style="width:44px;"><button type="button" onclick="removePersonLine(${person_idx})" class="btn_${person_idx} btn btn-inverse-danger btn-icon"><i class="mdi mdi-delete-forever"></i></button></td>`
      trcontainer += '</tr>'
      $('#score tbody').append(trcontainer)
      person_idx++
      $('.person_null').hide()
    })
    // 绑定删除一行
    removePersonLine = (lineidx) => {
      $(`#score tr[idx=${lineidx}]`).remove()
      let person_line = $('#score tbody tr.list').length
      if (person_line < 1) {
        $('.person_null').show()
      } else {
        // 编号永远是1~N
        for (let i=0;i<$('#score tbody td.idx_text').length;i++) {
          let idx = i
          $('#score tbody td.idx_text').eq(i).text(idx+1)
        }
      }
    }
  })
  // 弹框消失的时候，重置
  $('#outpoolModal').on('hidden.bs.modal', (e)=>{
    $('#outpoolModal .totalpool').val(0)
    $('#outamount').val(0)
    $('#outpoolModalLabel').val('')
    $('.editpool-tips').removeClass('bg-success bg-danger').text('')
    // 解绑加一行
    addscore.off('click')
    // 初始化
    person_idx = 0
    $('#score tr.list').remove()
    $('.person_null').show()
  })

  // 统计虚拟池子金额
  let projectlistpromise = getPromise(api['项目列表'])
  let doprojectlist = (rs) => {
    let moneybeforetax = rs.data.map(i => i.totalmoneybeforetax)
    let poolmoneybeforetax = eval(moneybeforetax.join('+')) * 0.055
    $('#totalmoneypool').val(poolmoneybeforetax.toFixed(4))
  }
  
  // 统计实际池子金额
  let processprojectpromise = getPromise(api['录入项目详情'])
  let doprocessproject = (rs) => {
    let ppdata = rs.data.filter(i=>i.id)
    let recievemoney = ppdata.map(i => i.recievemoney)
    let poolrecievemoney = eval(recievemoney.join('+')) * 0.055
    $('#inputpool').val(poolrecievemoney.toFixed(4))
  }

  let promiseArr = [poollistpromise,projectlistpromise,processprojectpromise]
  let allpromise = Promise.all(promiseArr)
  allpromise.then((allrs)=>{
    poollistrs = allrs[0]
    projectlistrs = allrs[1]
    processprojectrs = allrs[2]
    doPoollist(poollistrs)
    doprojectlist(projectlistrs)
    doprocessproject(processprojectrs)
    let restVal = +$('#inputpool').val() - +$('#outputpool').val()
    $('#restpool').val(toFixed(restVal,4))
  })
})
