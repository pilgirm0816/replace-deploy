$(()=>{
  $('#topoollist').hide()
  // 总金额，添加池子奖金时使用。
  let pooltotalpromise = getPromise(api['池子金额总数']);
  // 池子出入金额列表
  let poollistpromise = getPromise(api['池子出入金额列表'])
  let poolkey = ['name','type','amount','totalmoney','update_time']
  // 池子列表展示
  let doPoollist = (rs) =>{
    let totalData = rs.data
    let poolListMap = new Map()
    // 筛选支出给个人的金额
    totalData.map(d=>{
      if(!d.name) poolListMap.has(d.id) ? poolListMap.get(d.id).push(d) : poolListMap.set(d.id, [d])
    })
    let output = totalData.filter(d=>d.type==1)
    var obj = {};
     newarr = output.reduce(function(item, next) {
       obj[next.id] ? '' : obj[next.id] = true && item.push(next);
       return item;
    }, []);
    let outputpool = newarr.map(i=>i.amount)
    $('#outputpool').val(toFixed(eval(outputpool.join('+'),4)))
    // 元组要用 size，使用方式类似 Array，长度是属性(size)
    if (poolListMap.size) $('.pool_null').hide()
    poolListMap.forEach((item, id)=>{
      let ths = $('#pool_list th');
      let trcontainer = `<tr class="list" awardid="${item[0].award_id}" idx="${id}">`
      for(let i = 0;i < ths.length;i++) {
        let _val = ''
        if (poolkey[i] == 'update_time') {
          _val = new Date(item[0][poolkey[i]]).toLocaleDateString()
        } else if (poolkey[i] == 'name') {
          let names = item.map(v=>v.projectname)
          _val = item[0].projectname ? `<p>${names.join('</p><p>')}</p>` : '-'
        } else if (poolkey[i] == 'type') {
          _val = getTypeText(+item[0][poolkey[i]])
        } else if ($.inArray(poolkey[i], ['amount','totalmoney']) != -1) {
          _val = toFixed((+item[0][poolkey[i]]),4)
          // _val = +item[0][poolkey[i]]
        } else {
          _val = item[0][poolkey[i]] === '' ? '-' : item[0][poolkey[i]]
        }
        trcontainer += `<td class="addstyle">${_val}</td>`
      }
      trcontainer += '</tr>'
      $('#pool_list tbody').append(trcontainer)
    })
    const poollist = $('#pool_list tr.list[awardid!=0]')
    poollist.on('click', (e)=>{
      // if ($(e.currentTarget).attr('awardid') != "0") 
      let _awardid = $(e.currentTarget).attr('awardid')
      location.href=`./reward.html?params=${_awardid}`
    })
  }
  // 操作格点击不会跳转，其他 td 跳转详情页
  // $('#score tbody tr td:not(.operation)').on('click', (e)=>{
  //   location.href=`./persons.html?params=${$(e.currentTarget).parent('tr').attr('nameparam')}`
  // })

  // 返回按钮
  $('#topoollist').on('click', ()=>{
    location.href='./pool.html'
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
    let params = {
      name: $('#outpoolModal .outname').val(),
      amount: +$('#outamount').val(),
      totalmoney: +$('#outtotalpool').val() - +$('#outamount').val(),
      type: 1,
      award_id: 0,
    }
    if (params.name) {
      let editPoolPromise = getPromise(api['录入池子金额'], 'POST', {params: JSON.stringify([params])})
      doOperate(editPoolPromise, 'outpoolModal')  
    } else {
      $(`#outpoolModal .editpool-tips`).addClass('bg-danger').text('先选择成员')
    }
  })

  // 弹框出现的时候，初始化
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
      let person_idx = 0
      let trcontainer = ''
      
      namesArr.forEach((_nameObj)=>{
        namehtml += _nameObj.isShow ? `<option value="${_nameObj.label}">${_nameObj.label}</option>` : ''
      })
      trcontainer += `<select class="outname outname_${person_idx} form-control form-control-sm" item="${person_idx}">${namehtml}</select>`
      $('#outpoolModal .outnamearr').html(trcontainer)
    })

    $('#outpoolModal .totalpool').val($('#restpool').val())
    $('#outamount').val(0)
    $('#outpoolModalLabel').text(outpoolModalLabel)
    $('.editpool-tips').removeClass('bg-success bg-danger').text('')
  })
  // 弹框消失的时候，重置
  $('#outpoolModal').on('hidden.bs.modal', (e)=>{
    $('#outpoolModal .totalpool').val(0)
    $('#outamount').val(0)
    $('#outpoolModalLabel').val('')
    $('.editpool-tips').removeClass('bg-success bg-danger').text('')
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
