$(()=>{
  // 获取 url 上的参数
  let search = location.href
  // 获取 url 上的参数
  let paramsMatches = queryURLParams(search)
  let awardid = paramsMatches ? paramsMatches['params'] : '';
  let typestr = paramsMatches ? paramsMatches['type'] : '';
  // 获取成员信息，有入参的说明是编辑状态。
  getPerson = (personlist) => {
    // 项目列名
    let person_key_array = ['pname','trouble','duration','response','rate','percent','amount','saleamount','poolamount']
    let names = []
    let namesArr = []
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
      return names
    }).then((names)=>{
      // let html = '' || getPersonLine(names)
      // $('#score tbody').html(html)

      // 添加人员
      const addscore = $('#addscore')
      let person_idx = 0
      doAddscore = (personObj, idx) => {
        let namehtml = '<option value="">选择成员</option>'
        let ths = $('#score th');
        let trcontainer = `<tr class="list" idx="${person_idx}">`
        if (personObj) {
          trcontainer += `<td style="width:60px" class="idx_text">${idx + 1}</td>`
          let contract_person_key_array = {'pname':'name','trouble':'troublerate','duration':'durationrate','response':'responserate','rate':'ratio','percent':'percent','amount':'amount','saleamount':'saleamount','poolamount':'poolamount'}
          namesArr.forEach((_nameObj)=>{
            namehtml += _nameObj.isShow ? `<option value="${_nameObj.label}" ${_nameObj.label == personObj.name ? 'selected=selected' : ''}>${_nameObj.label}</option>` : ''
          })
          trcontainer += `<td><select class="${person_key_array[0]}_${person_idx} form-control form-control-sm" item="${person_idx}">${namehtml}</select></td>`
          for(let i=1;i<ths.length-2;i++) {
            trcontainer += `<td><input class="${person_key_array[i]}_${person_idx} form-control form-control-sm" value="${personObj[contract_person_key_array[person_key_array[i]]]}"></td>`
          }
        } else {
          let _person_idx = $('#score tbody .list').length
          trcontainer += `<td style="width:60px" class="idx_text">${_person_idx + 1}</td>`
          namesArr.forEach((_nameObj)=>{
            namehtml += _nameObj.isShow ? `<option value="${_nameObj.label}">${_nameObj.label}</option>` : ''
          })
          trcontainer += `<td><select class="${person_key_array[0]}_${person_idx} form-control form-control-sm" item="${person_idx}">${namehtml}</select></td>`
          for(let i=1;i<ths.length-2;i++) {
            trcontainer += `<td><input class="${person_key_array[i]}_${person_idx} form-control form-control-sm"></td>`
          }
        }

        trcontainer += `<td style="width:44px;"><button type="button" onclick="removePersonLine(${person_idx})" class="btn_${person_idx} btn btn-inverse-danger btn-icon"><i class="mdi mdi-delete-forever"></i></button></td>`
        trcontainer += '</tr>'
        $('#score tbody').append(trcontainer)
        person_idx++
        $('.person_null').hide()
      }
      // 如果是编辑状态，需要将值赋给输入框
      if (personlist) {
        personlist.forEach((p_obj, idx)=>{
          doAddscore(p_obj, idx)
        })
      }
      addscore.on('click', ()=>{
        doAddscore()
      })
    })
  }

  // 获取项目信息，有入参的说明是编辑状态。
  getProject = (projectlist) => {
    let project_key_array = ['name', 'isdirect', 'po_num', 'contract_num', 'totalmoney','cost','paymoney','recievemoney','totalaward','saleaward','award','poolmoney','restaward']
    let projectspromise = getPromise(api['项目列表'])
    let projectArr = []
    projectspromise.then((rs)=>{
      projectArr = rs.data
      // 添加项目按钮
      let projectIndex = 0
      // 添加项目
      const addProject = $('#addproject')
      doAddproject = (projectObj, idx) => {
        let ths = $('#projects th');
        let trcontainer = `<tr class="list" idx="${projectIndex}">`
        let optionitems = `<option></option>`
        if (projectObj) {
          // 选择 start
          projectArr.forEach((item)=>{
            optionitems += `<option value="${item.name}" ${item.name == projectObj.name ? 'selected=selected' : ''}>${item.name}</option>`
          })
          trcontainer += `<td style="width:auto">
            <div class="btn-group" style="width:100%">
              <select class="${project_key_array[0]}_${projectIndex}"
                onchange=changeProjectName("${projectIndex}",this.value)
              > ${optionitems} </select>
            <!--
            <input name="box" style="width:calc(100% - 28px);position:absolute;left:0px;" class="${project_key_array[0]}_${projectIndex} form-control form-control-sm">
            -->
          </div></td>`
          // 选择 end

          for(let i = 1;i < ths.length-1;i++) {
            let attr = ''
            let tdattr = ''
            let project_val = projectObj[project_key_array[i]]
            // 设置属性
            if (['totalaward','restaward','totalmoney','isdirect'].includes(project_key_array[i])) {
              attr = 'readonly=readonly'
            } else if (['po_num','contract_num','cost'].includes(project_key_array[i])) {
              tdattr = 'style="display:none;"'
            }
            // 设置值
            if (project_key_array[i] == 'restaward') {
              project_val = toFixed((Math.abs(projectObj['totalaward'] - projectObj['sumaward'])),3)
            } else if (project_key_array[i] == 'totalmoney') {
              project_val = `${toFixed((projectObj['totalmoney']),3)}/${toFixed((projectObj['totalmoneybeforetax']),3)}`
            } else if (project_key_array[i] == 'isdirect') {
              project_val = `${getDirectTitle(projectObj['isdirect'])}`
            }
            // 通用 dom
            trcontainer += `<td ${tdattr}><input type="text" class="${project_key_array[i]}_${projectIndex} form-control form-control-sm" ${attr} value="${project_val}"></td>`
          }
        } else {
          // 选择和输入共存的控件 start
          // trcontainer += `<td><div style="position:relative;top:1px;">
          //   <span style="margin-left:113px;width:18px;overflow:hidden;">
          //     <select style="position:absolute;width:calc(100% - 15px);left:11px;height:21px" class="form-control form-control-sm" onchange=changeProjectName("${projectIndex}",this.value)>
          //       ${optionitems}
          //     </select>
          //   </span>
          //   <input name="box" style="width:calc(100% - 28px);position:absolute;left:0px;" class="${project_key_array[0]}_${projectIndex} form-control form-control-sm">
          // </div></td>`
          // 选择和输入共存的控件 end
          // 选择 start
          projectArr.forEach((item)=>{
            optionitems += `<option>${item.name}</option>`
          })
          trcontainer += `<td style="width:auto">
            <div class="btn-group" style="width:100%">
              <select class="${project_key_array[0]}_${projectIndex}"
                onchange=changeProjectName("${projectIndex}",this.value)
              > ${optionitems} </select>
            <!--
            <input name="box" style="width:calc(100% - 28px);position:absolute;left:0px;" class="${project_key_array[0]}_${projectIndex} form-control form-control-sm">
            -->
          </div></td>`
          // 选择 end

          for(let i = 1;i < ths.length-1;i++) {
            let attr = ''
            let tdattr = ''
            // 设置属性
            if (['totalaward','restaward','totalmoney','isdirect'].includes(project_key_array[i])) {
              attr = 'readonly=readonly'
            } else if (['po_num','contract_num','cost'].includes(project_key_array[i])) {
              tdattr = 'style="display:none;"'
            }
            trcontainer += `<td ${tdattr}><input type="text" class="${project_key_array[i]}_${projectIndex} form-control form-control-sm" ${attr}></td>`
          }
          // 时间控件 (没有创建时间，所以没有时间控件，暂时注释掉)
          // trcontainer += `<td><input type="date" class="${project_key_array[ths.length-2]}_${projectIndex} form-control form-control-sm"></td>`
          
        }
        // 操作按钮
        trcontainer += `<td style="width:44px;"><button onclick="removeProjectLine(${projectIndex})" class="btn_${projectIndex} btn btn-inverse-danger btn-icon"><i class="mdi mdi-delete-forever"></i></button></td>`
        trcontainer += '</tr>'
        $('#projects tbody').append(trcontainer)
        projectIndex++
        $('.project_null').hide()
      }

      if (projectlist) {
        projectlist.forEach((projectObj, idx)=>{
          doAddproject(projectObj, idx)
        })
      } 
      addProject.on('click', ()=>{
        doAddproject()
      })
      
      // 选择项目后操作。 idx：序号，val：项目名称
      changeProjectName = (idx, val) => {
        // 自动计算，销售、项目、进池子
        $(`.recievemoney_${idx}`).on('blur', (e)=>{
          let _recieve = $(e.target).val()
          // 非直签 2%，直签 5%
          let dirVal = 0.02
          if ($(`.isdirect_${idx}`).val() == '直签') {
            dirVal = 0.05
          }
          let _saleaward = _recieve * dirVal
          // 项目奖金去掉45%
          // let _award = _recieve * 0.045
          let _award = _recieve * 0.1
          // 池子奖金 0.1 - 0.45
          let _pool = _recieve * 0.1 * 0.55
          _award = $(`.totalaward_${idx}`).val() - _award < 0 ? $(`.totalaward_${idx}`).val() : _award
          $(`.saleaward_${idx}`).val(toFixed(_saleaward,3))
          $(`.award_${idx}`).val(toFixed(_award,3))
          // 暂时不进池子了。
          $(`.poolmoney_${idx}`).val(0)
          // $(`.poolmoney_${idx}`).val(toFixed(_pool,3))
          // 触发 项目奖金计算
          $(`.saleaward_${idx}`).trigger('blur')
        })
        // rs.data 返回的值
        let obj = rs.data.find(i => i.name == val)
        project_key_array.forEach((key)=>{
          // if (key == 'create_time') {
          //   const dataobj = new Date(obj[key])
          //   let datelocal = `${dataobj.getFullYear()}-${dataobj.getMonth()+1<10 ? '0'+(dataobj.getMonth()+1) : dataobj.getMonth()+1}-${dataobj.getDate()<10 ? '0'+dataobj.getDate() : dataobj.getDate()}`
          //   $(`.${key}_${idx}`).val(datelocal)
          // } else 
          
          if (['cost','paymoney','recievemoney','saleaward','award'].includes(key)) {
            $(`.${key}_${idx}`).val(0)
          } else if (key == 'restaward') {
            // 剩余奖金归零了，就不能在分配了。
            let _rest = toFixed((obj['totalaward'] - obj['award']),3)
            if (_rest <= 0) {
              // $(`.award_${idx}`).attr('readonly','readonly')
              $(`.${key}_${idx}`).val(0)
            } else {
              // $(`.award_${idx}`).removeAttr('readonly')
              $(`.${key}_${idx}`).val(toFixed(_rest,3))
            }
          } else if (key == 'totalmoney') {
            $(`.${key}_${idx}`).val(`${toFixed((obj['totalmoney']),3)}/${toFixed((obj['totalmoneybeforetax']),3)}`)
          } else if (key == 'isdirect') {
            $(`.${key}_${idx}`).val(`${getDirectTitle(obj['isdirect'])}`)
          } else {
            $(`.${key}_${idx}`).val(obj[key])
          }
        })
      }
    })
  }

  // 记录详细
  if (awardid) {
    // 按钮状态
    $('#award_list').hide()
    $('#award_content').show()
    $('#toawardlist').show()
    $('#addaward').hide()
    $('#btn').show()
    $('#reset').hide()
    $('#submit').hide()
    $('#editaward').show()

    // 总项目奖金、总销售奖金、总奖金池金额
    let totalaward = 0,totalsaleaward = 0,totalpoolmoney = 0;
    // 成员字段
    let person_detail_key_array = ['index','name','troublerate','durationrate','responserate','ratio','percent','amount','saleamount','poolamount']
    // 项目字段
    let project_detail_key_array = ['name', 'isdirect' ,'po_num','contract_num',['totalmoney','totalmoneybeforetax'],'cost','paymoney','recievemoney','totalaward','saleaward','award','poolmoney','restaward']
    let awardpersonlistpromise = getPromise(`${api['录入人员详情']}?params=${awardid}`)
    let awardprojectlistpromise = getPromise(`${api['录入项目详情']}?params=${awardid}`)
    let awardpoolpromise = getPromise(`${api['池子金额总数']}?params=${awardid}`)
    let awardlistpromise = Promise.all([awardpersonlistpromise, awardprojectlistpromise, awardpoolpromise])
    // 修改时按钮状态
    if (typestr == 'edit') {
      $('#btn').hide()
      $('#editaward').hide()
      $('#reset').show()
      $('#submit').show()
      $('#addproject').show()
      $('#addscore').show()
      awardlistpromise.then((item)=>{
        // 池子明细数据
        let pooldata = item[2].data
        let poolaward = 0
        let totalpool = 0
        if (pooldata.length) {
          totalpool = pooldata[pooldata.length-1].totalmoney
          pooldata.map((d)=>{
            if (d.type == 1) poolaward += +d.amount
            totalpool = totalpool + (d.type == 1 ? +d.amount : (0 - +d.amount))
          })
        }
        $('#poolaward').val(toFixed(poolaward,3))
        $('#totalpool').val(toFixed(totalpool,3))
        // 人员关系数据
        let personlist = item[0].data
        if (personlist.length) {
          $('.person_null').hide()
        }

        // let person_detail_key_array = ['name','troublerate','durationrate','responserate','ratio','percent','amount','saleamount','poolamount']
        // let person_key_array = ['pname','trouble','duration','response','rate','percent','amount','saleamount','poolamount']

        // 添加成员 暂时注掉
        // personlist.forEach((person, person_idx)=>{
        //   let namehtml = '<option value="">选择成员</option>'
        //   namesArr.forEach((_nameObj)=>{
        //     let _attr = ''
        //     if (_nameObj.label == person['name']) {
        //       _attr = 'selected'
        //     }
        //     namehtml += _nameObj.isShow ? `<option value="${_nameObj.label}" ${_attr}>${_nameObj.label}</option>` : ''
        //   })

        //   let ths = $('#score th')
        //   let trcontainer = `<tr class="list" idx="${person_idx}">`
        //   trcontainer += `<td>${person_idx}</td>`
        //   trcontainer += `<td><select class="${person_key_array[0]}_${person_idx} form-control form-control-sm" item="${person_idx}">${namehtml}</select></td>`

        //   for(let i=2;i<ths.length-1;i++) {
        //     trcontainer += `<td>${person[person_detail_key_array[i]]}</td>`
        //   }
        //   trcontainer += `<td class="addstyle"><button onclick="removePersonLine(${person_idx})" class="btn_${person_idx}">-</button></td>`
        //   trcontainer += '</tr>'
        //   $('#score tbody').append(trcontainer)
        // })

        // 项目关系数据
        let projectlist = item[1].data
        if (projectlist.length) {
          $('.project_null').hide()
        }

        projectlist.forEach((project, project_idx)=>{
          // 销售总奖金
          totalsaleaward += +project['saleaward']
          // 进池子的奖金
          totalpoolmoney += +project['poolmoney']
          // 项目总奖金
          totalaward += +project['award']
        })
        let _award = item[1].data[0].award_award
        let _saleaward = item[1].data[0].award_saleaward
        // 人员列表
        getPerson(personlist)
        // 项目列表
        getProject(projectlist)
        // 累计销售奖金
        $('#saleaward').val(_saleaward ? _saleaward : toFixed(totalsaleaward / (1 + 0.083),3))
        // 累计进池子总奖金
        $('#poolmoney').val(totalpoolmoney)
        // 累计 totalaward
        $('#award').val(_award ? _award : toFixed((totalaward / (1 + 0.083)),3))
        // 奖金的税
        $('#saleawardtax').val((totalsaleaward - toFixed(totalsaleaward / (1 + 0.083),3)).toFixed(3))
        // 销售的税
        $('#awardtax').val((totalaward - toFixed((totalaward / (1 + 0.083)),3)).toFixed(3))
        // 等数据渲染结束才开始隐藏只有添加时才需要显示的元素
        $('.addstyle').show()
      })

    } else {
      // 详情页
      // 修改时按钮状态
      $('#saleaward').val(0).attr('readonly','readonly')
      $('#poolaward').val(0).attr('readonly','readonly')
      $('#totalpool').val(0).attr('readonly','readonly')
      $('#poolmoney').val(0).attr('readonly','readonly')
      // let totalaward = 0
      // let totalsaleaward = 0
      // let totalpoolmoney = 0
      // let person_detail_key_array = ['name','troublerate','durationrate','responserate','ratio','percent','amount','saleamount','poolamount']
      // let project_detail_key_array = ['name','po_num','contract_num',['totalmoney','totalmoneybeforetax'],'cost','paymoney','recievemoney','totalaward','saleaward','award','poolmoney','restaward']
      // let awardpersonlistpromise = getPromise(`${api['录入人员详情']}?params=${awardid}`)
      // let awardprojectlistpromise = getPromise(`${api['录入项目详情']}?params=${awardid}`)
      // let awardpoolpromise = getPromise(`${api['池子金额总数']}?params=${awardid}`)
      // let awardlistpromise = Promise.all([awardpersonlistpromise, awardprojectlistpromise, awardpoolpromise])
      awardlistpromise.then((item)=>{
        // 池子明细数据
        let pooldata = item[2].data
        let poolaward = 0
        let totalpool = 0
        if (pooldata.length) {
          totalpool = pooldata[pooldata.length-1].totalmoney
          pooldata.map((d)=>{
            if (d.type == 1) poolaward += +d.amount
            totalpool = totalpool + (d.type == 1 ? +d.amount : (0 - +d.amount))
          })
        }
        $('#poolaward').val(toFixed(poolaward,3))
        $('#totalpool').val(toFixed(totalpool,3))
        // 人员关系数据
        let personlist = item[0].data
        if (personlist.length) {
          $('.person_null').hide()
        }
        personlist.forEach((person, person_idx)=>{
          let ths = $('#score th')
          let trcontainer = `<tr class="list" idx="${person_idx}">`
          // trcontainer += `<td>${person[person_detail_key_array[0]]}</td>`
          for(let i=0;i<ths.length-1;i++) {
            if (person_detail_key_array[i] == 'index') {
              trcontainer += `<td>${person_idx + 1}</td>`
            } else {
              trcontainer += `<td>${person[person_detail_key_array[i]]}</td>`
            }
            
          }
          trcontainer += `<td class="addstyle"><button onclick="removePersonLine(${person_idx})" class="btn_${person_idx}">-</button></td>`
          trcontainer += '</tr>'
          $('#score tbody').append(trcontainer)
        })
        // 项目关系数据
        let projectlist = item[1].data
        if (projectlist.length) {
          $('.project_null').hide()
        }
        projectlist.forEach((project, project_idx)=>{
          // 销售总奖金
          totalsaleaward += +project['saleaward']
          // 进池子的奖金
          totalpoolmoney += +project['poolmoney']
          // 项目总奖金
          totalaward += +project['award']
          let ths = $('#projects th');
          let trcontainer = `<tr class="list" idx="${project_idx}">`
          for(let i = 0;i < ths.length-1;i++) {
            if (Array.isArray(project_detail_key_array[i])) {
              let val_arr = []
              project_detail_key_array[i].forEach((key)=>{
                val_arr.push(project[key])
              })
              trcontainer += `<td>${val_arr.join('/')}</td>`
            } else {
              let tdattr = ''
              let project_val = project[project_detail_key_array[i]]
              // let attr = ''
              // if (project_detail_key_array[i] == 'totalaward' || project_detail_key_array[i] == 'restaward' || project_detail_key_array[i] == 'totalmoney') {
              //   attr = 'readonly=readonly'
              // }
              // if (project_detail_key_array[i] == 'po_num' || project_detail_key_array[i] == 'contract_num') {
              //   tdattr = 'style="display:none;"'
              // }
              // trcontainer += `<td ${tdattr}><input type="text" class="${project_detail_key_array[i]}_${projectIndex} form-control form-control-sm" ${attr}></td>`
              
              // let project_detail_key_array = ['name','po_num','contract_num','totalmoney','cost','paymoney','recievemoney','award','totalaward','saleaward','restaward']
              if (['po_num','contract_num','cost'].includes(project_detail_key_array[i])) {
                tdattr = 'style="display:none;"'
              } else if (project_detail_key_array[i] == 'restaward') {
                project_val = toFixed(Math.abs(project['totalaward'] - project['sumaward']),3)
              } else if (project_detail_key_array[i] == 'isdirect') {
                project_val = getDirectTitle(project['isdirect'])
              }
              trcontainer += `<td ${tdattr}>${project_val}</td>`
            }
          }
          trcontainer += `<td class="addstyle"><button onclick="removeProjectLine(${project_idx})" class="btn_${project_idx}">-</button></td>`
          trcontainer += '</tr>'
          $('#projects tbody').append(trcontainer)
        })
        let _award = item[1].data[0].award_award
        let _saleaward = item[1].data[0].award_saleaward
        // 累计销售奖金
        $('#saleaward').val(_saleaward ? _saleaward : toFixed(totalsaleaward / (1 + 0.083),3))
        // 累计进池子总奖金
        $('#poolmoney').val(totalpoolmoney)
        // 累计 totalaward
        $('#award').val(_award ? _award : toFixed((totalaward / (1 + 0.083)),3)).attr('readonly','readonly')
        // 奖金的税
        $('#saleawardtax').val((totalsaleaward - toFixed(totalsaleaward / (1 + 0.083),3)).toFixed(3))
        // 销售的税
        $('#awardtax').val((totalaward - toFixed((totalaward / (1 + 0.083)),3)).toFixed(3))
        // 等数据渲染结束才开始隐藏只有添加时才需要隐藏的元素
        $('.addstyle').hide()
      })
    }
  } else {
    // 人员列表
    getPerson()
    // 项目列表
    getProject()
    // 列表/添加页
    $('.addstyle').show()
    $('#award_list').show()
    $('#award_content').hide()
    $('#toawardlist').hide()
    $('#editaward').hide()
    $('#reset').show()
    $('#submit').show()
    let pooltotalpromise = getPromise(api['池子金额总数'])
    pooltotalpromise.then((res)=>{
      let totalmoney = res.data.length ? res.data[0].totalmoney : 0
      $('#totalpool').val(totalmoney)
    })
    let awardlistpromise = getPromise(`${api['添加录入记录']}?params=1`)
    awardlistpromise.then((rs)=>{
      let map = new Map()
      rs.data.map(d=>{
        map.has(d.id) ? map.get(d.id).push(d) : map.set(d.id, [d])
      })
      map.forEach((d, id)=>{
        let names = d.map(v=>v.name)
        let trcontainer = `<tr class="list" awardid="${id}">`
        trcontainer += `<td>${new Date(d[0].update_time).toLocaleString()}</td>`
        trcontainer += `<td><p>${names.join('</p><p>')}</p></td>`
        trcontainer += `<td>${getAwardTypeTitle(d[0].award_type)}</td>`
        trcontainer += '</tr>'
        $('#awardlist tbody').append(trcontainer)
        $('.award_null').hide()
      })
      const awardlist = $('#award_list tr.list')
      awardlist.on('click', (e)=>{
        location.href=`./reward.html?params=${$(e.currentTarget).attr('awardid')}`
      })
    })
  }

  // 获取奖金池总数

  // 添加人员时，去掉一行人员
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

  // 添加录入记录
  $('#addaward').on('click', (e)=>{
    $('#awardlist').hide()
    $('#award_content').show()
    $('#addaward').hide()
    $('#toawardlist').show()
  })

  // 返回按钮
  $('#toawardlist').on('click', ()=>{
    location.href=`./reward.html`
    // history.go(-1)
  })

  // 编辑按钮
  $('#editaward').on('click', ()=>{
    location.href=`./reward.html?params=${awardid}&type=edit`
  })

  // 计算每个人的结算结果
  calcamount = (index) => {
    let rate = 0
    let percent = 0
    let amount = 0
    let troublerate = $('#troublerate').text()
    let durationrate = $('#durationrate').text()
    let responserate = $('#responserate').text()
    let trouble = $(`.trouble_${index}`).val() || 0
    let duration = $(`.duration_${index}`).val() || 0
    let response = $(`.response_${index}`).val() || 0
    rate = (trouble * troublerate + duration * durationrate + response * responserate) / 100
    $(`.rate_${index}`).val(toFixed(rate,2))
    
    $(`.amount_${index}`).val()
    // 
    let ratesum = 0
    const award = $('#award').val()
    for (let i = 0; i < $('#score tbody tr.list').length; i++) {
      let _idx = $('#score tbody tr.list').eq(i).attr('idx')
      ratesum += +$(`.rate_${_idx}`).val() || 0
    }
    for (let i = 0; i < $('#score tbody tr.list').length; i++) {
      let _idx = $('#score tbody tr.list').eq(i).attr('idx')
      let _rate = +$(`.rate_${_idx}`).val()
      let _percent = +_rate/+ratesum
      let _amount = +award * 10000 * +_percent
      $(`.percent_${_idx}`).val(toFixed(+_percent * 100,2))
      $(`.amount_${_idx}`).val(toFixed(_amount,3))
    }
  }

  // 修改了总金额，需要重新计算各成员奖金
  $('#award').on('change', ()=>{
    calcamount(0)
  })
  
  // 个人奖金计算
  $(document).on('input', '#score input', (d)=>{
    // const index = $(d.target).attr('itemindex')
    const index = $(d.target).parents('tr').attr('idx')
    calcamount(index)
  })

  // 项目奖金计算
  $(document).on('blur', '#projects input', (d)=>{
    // 项目奖金, 销售奖金, 池子金额
    let award = 0, saleaward = 0, poolmoney = 0
    for (let i = 0; i < $('#projects tbody tr.list').length; i++) {
      let _idx = $('#projects tbody tr.list').eq(i).attr('idx')
      award += +$(`.award_${_idx}`).val()
      saleaward += +$(`.saleaward_${_idx}`).val()
      poolmoney += +$(`.poolmoney_${_idx}`).val()
    }
    // 销售
    $('#saleaward').val(toFixed(saleaward / (1 + 0.083),3)).trigger('change')
    // 池子
    $('#poolmoney').val(poolmoney)
    // 奖金
    $('#award').val(toFixed(award / (1 + 0.083),3)).trigger('change')
    // 奖金的税
    $('#saleawardtax').val((saleaward - toFixed(saleaward / (1 + 0.083),3)).toFixed(3))
    // 销售的税
    $('#awardtax').val((award - toFixed((award / (1 + 0.083)),3)).toFixed(3))
  })

  // 生成报告
  $('#btn').on('click', ()=>{
    // 传一个 id 生成这个区域数据的报告
    // downloadTable('score', 'score.csv');
    // downloadTable('projects', 'projects.csv');
    // 传id数组生成这些 id区域数据的报告
    downloadTable(['projects','score'], '报告.csv')
  })

  // 删除项目条目
  removeProjectLine = (lineidx) => {
    $(`.recievemoney_${lineidx}`).off('blur')
    let tr_dom = $(`#projects tr[idx=${lineidx}]`)
    let _award = $(`.award_${lineidx}`).val() || 0
    let newaward = $('#award').val() - _award
    $(`#projects tr[idx=${lineidx}]`).remove()
    let project_line = $('#projects tbody tr.list').length
    $('#award').val(newaward)
    if (project_line < 1) {
      $('.project_null').show()
      $('#award').val(0).trigger('change')
      $('#saleaward').val(0).trigger('change')
      $('#poolmoney').val(0).trigger('change')
    }
    
  }

  // 重置
  doreset = () => {
    $('.list').remove()
    $('.list_null').show()
    $('#award').val(0)
    $('.submit-tips').removeClass('bg-success bg-danger').text('')
  }
  $('#reset').on('click', ()=>{
    if (confirm('确定重置?') == true){doreset()}
  })

  // 奖金计算税
  $('#award').on('change', (e)=>{
    // console.log('award',$('#award').val())
    let _award = $('#award').val()
    let _tax = (_award * 0.083).toFixed(3)
    $('#awardtax').val(_tax)
  })

  // 销售奖金算税
  $('#saleaward').on('change', (e)=>{
    // console.log('saleaward',$('#saleaward').val())
    let _award = $('#saleaward').val()
    let _tax = (_award * 0.083).toFixed(3)
    $('#saleawardtax').val(_tax)
  })

  // 验证销售、池子奖金

  // 提交内容
  $('#submit').on('click', (e)=>{
    // 按照 award_id 添加成员和项目
    doAddaward = (award_id, isEdit) => {
      // 项目监测是否已经添加过，添加过了不用重复添加。
      let projectArr = []
      for (let i = 0; i < $('#projects tbody tr.list').length; i++) {
        let _idx = $('#projects tbody tr.list').eq(i).attr('idx')
        let _item = {
          name: $(`.name_${_idx}`).val(),
          po_num: $(`.po_num_${_idx}`).val(),
          contract_num: $(`.contract_num_${_idx}`).val(),
          totalmoneybeforetax: +$(`.totalmoney_${_idx}`).val().split('/')[1],
          totalmoney: +$(`.totalmoney_${_idx}`).val().split('/')[0],
          cost: +$(`.cost_${_idx}`).val(),
          paymoney: +$(`.paymoney_${_idx}`).val(),
          poolmoney: +$(`.poolmoney_${_idx}`).val(),
          saleaward: +$(`.saleaward_${_idx}`).val(),
          recievemoney: +$(`.recievemoney_${_idx}`).val(),
          award: +$(`.award_${_idx}`).val(),
          award_id: award_id
          // create_time: $(`.create_time_${_idx}`).val()
        }
        projectArr.push(_item)
      }
      // 添加进项目关系表,人员关系,池子明细关系
      let addprocessprojectpromise, addprocesspersonpromise, addprocesspoolpromise
      let promiseArr = []
      let addprocessprojectArr = []
      addprocessprojectArr = projectArr
      if (addprocessprojectArr.length > 0) {
        addprocessprojectpromise = getPromise(api['批量加入项目'], 'POST', {params: JSON.stringify(addprocessprojectArr)})
        promiseArr.push(addprocessprojectpromise)
      }
      // 现在项目是 select 选出来的，所以不用验证是否重复 start
      // let findprojectspromise = getPromise(api['项目列表简化']);
      // findprojectspromise.then((rs)=>{
      //   // 列出所有已有可用项目，和需要录入的项目对比，有不存在其中的项目则添加，删除已经录入过的项目 GET
      //   let addProjectArr = []
      //   projectArr.forEach((item)=>{
      //     let _i = rs.data.findIndex((i)=>{
      //       return i.name == item.name && i.po_num == item.po_num && i.contract_num == item.contract_num
      //     })
      //     if (_i == -1) {addProjectArr.push(item)}
      //   })
      //   let addprojectpromise, addprocessprojectpromise, addprocesspersonpromise
      //   let promiseArr = []
      //   // 添加没有添加过的项目
      //   if (addProjectArr.length > 0){
      //     addprojectpromise = getPromise(api['批量加入新项目'], 'POST', {params: JSON.stringify(addProjectArr)})
      //     promiseArr.push(addprojectpromise)
      //   }
      //   // 添加进项目关系表
      //   let addprocessprojectArr = []
      //   addprocessprojectArr = projectArr
      //   if (addprocessprojectArr.length > 0) {
      //     addprocessprojectpromise = getPromise(api['批量加入项目'], 'POST', {params: JSON.stringify(addprocessprojectArr)})
      //     promiseArr.push(addprocessprojectpromise)
      //   }
      //   // 添加进成员关系表
      //   let addprocesspersonArr = []
      //   for (let i = 0; i < $('#score tbody tr.list').length; i++) {
      //     let _idx = $('#score tbody tr.list').eq(i).attr('idx')
      //     let _item = {
      //       name: $(`.pname_${_idx}`).val(),
      //       troublerate: $(`.trouble_${_idx}`).val(),
      //       durationrate: $(`.duration_${_idx}`).val(),
      //       responserate: +$(`.response_${_idx}`).val(),
      //       ratio: +$(`.rate_${_idx}`).val(),
      //       percent: +$(`.percent_${_idx}`).val(),
      //       amount: +$(`.amount_${_idx}`).val(),
      //       saleamount: +$(`.saleamount_${_idx}`).val(),
      //       poolamount: +$(`.poolamount_${_idx}`).val(),
      //       award_id: award_id
      //     }
      //     addprocesspersonArr.push(_item)
      //   }
      //   if (addprocesspersonArr.length > 0) {
      //     addprocesspersonpromise = getPromise(api['批量加入成员'], 'POST', {params: JSON.stringify(addprocesspersonArr)})
      //     promiseArr.push(addprocesspersonpromise)
      //   }
      //   let allpromise = Promise.all(promiseArr)
      //   allpromise.then((r)=>{
      //     // 重置
      //     location.href='./reward.html'
      //   })
      // })
      // 现在项目是 select 选出来的，所以不用验证是否重复 end
      
      // 添加进成员关系表
      let addprocesspersonArr = []
      for (let i = 0; i < $('#score tbody tr.list').length; i++) {
        let _idx = $('#score tbody tr.list').eq(i).attr('idx')
        let _item = {
          name: $(`.pname_${_idx}`).val(),
          troublerate: $(`.trouble_${_idx}`).val(),
          durationrate: $(`.duration_${_idx}`).val(),
          responserate: +$(`.response_${_idx}`).val(),
          ratio: +$(`.rate_${_idx}`).val(),
          percent: +$(`.percent_${_idx}`).val(),
          amount: +$(`.amount_${_idx}`).val(),
          saleamount: +$(`.saleamount_${_idx}`).val() || 0,
          poolamount: +$(`.poolamount_${_idx}`).val() || 0,
          award_id: award_id
        }
        addprocesspersonArr.push(_item)
      }
      if (addprocesspersonArr.length > 0) {
        addprocesspersonpromise = getPromise(api['批量加入成员'], 'POST', {params: JSON.stringify(addprocesspersonArr)})
        promiseArr.push(addprocesspersonpromise)
      }
      let addprocesspoolArr = []
      // 加入池子的金额
      let params_in = {
        name: '',
        amount: +$('#poolmoney').val(),
        totalmoney: +$('#totalpool').val() + +$('#poolmoney').val(),
        type: 2,
        award_id: award_id,
      }
      addprocesspoolArr.push(params_in)
      // 拿出使用池子金额
      let params_out = {
        name: '',
        amount: +$('#poolaward').val(),
        totalmoney: +$('#totalpool').val() + +$('#poolmoney').val() - +$('#poolaward').val(),
        type: 1,
        award_id: award_id,
      }
      addprocesspoolArr.push(params_out)
      if (addprocesspoolArr.length > 0) {
        addprocesspoolpromise = getPromise(api['录入池子金额'], 'POST', {params: JSON.stringify(addprocesspoolArr)})
        promiseArr.push(addprocesspoolpromise)
      }
      
      // 项目关系、人员关系、池子明细 一起提交
      let allpromise = Promise.all(promiseArr)
      allpromise.then((r)=>{
        if (isEdit) {
          location.href=`./reward.html?params=${award_id}`
        } else {
          // 重置
          location.href='./reward.html'
        }
      })
    }
    // 奖金总数
    let award = $('#award').val()
    // 销售奖金
    let saleaward = $('#saleaward').val()
    if(awardid) {
      // 编辑操作，获取 award_id，需要先删除之前的，然后重新添加。
      // 删除外键是 award_id 的记录
      let deleterecordbyawardpromise = getPromise(api['删除记录'], 'POST', {params: awardid});
      deleterecordbyawardpromise.then((rs)=>{
        // 更新录入项
        let params = {
          award: award,
          saleaward: saleaward,
          id: awardid
        }
        let updateawardpromise = getPromise(api['更新录入项'], 'POST', {params: JSON.stringify(params)})
        updateawardpromise.then((rs)=>{
          // 重新添加
          doAddaward(awardid, true)
        })
      })
    } else {
      // 添加操作，添加时间表，生成 award_id
      let awardparams = {
        award_type: 1
      }
      let addawardpromise = getPromise(api['添加录入时间'], 'POST', {params: JSON.stringify(awardparams)});
      addawardpromise.then((rs)=>{
        let award_id = rs.data[0].id
        // 更新总金额
        let params = {
          award: award,
          saleaward: saleaward,
          id: award_id
        }
        let updateawardpromise = getPromise(api['更新录入项'], 'POST', {params: JSON.stringify(params)})
        updateawardpromise.then((rs)=>{})
        return award_id
      }).then((award_id)=>{
        doAddaward(award_id, false)
      })
    }
  })
  
  // csv 下载前拼成列表形式
  getTableHtml = (tableId) => {  
    let scoreTable = document.getElementById(tableId);
    let head = scoreTable.tHead;
    let ths = head.getElementsByTagName('th');
    // let trs = scoreTable.tBodies[0].getElementsByTagName('tr');
    let trs = $(`#${tableId} tbody tr.list`)
  
    let result = '';
    for(let i = 0,l = ths.length; i < l; i++){
      result += $(ths[i]).text() + columnDelimiter;
    }
    result += lineDelimiter;
  
    for(let i = 0, l = trs.length; i < l; i++){
      let tds = $(trs[i]).children('td');
      for(let j = 0, l2 = tds.length; j < l2; j++){
        // let _dom = $(tds[j]).children('input').length >= 1 ? $(tds[j]).children('input') : $(tds[j]).children('select')
        // result += (_dom.val() || 0) + columnDelimiter;
        let _dom = $(tds[j])
        result += (_dom.text() || 0) + columnDelimiter;
      }
      result += lineDelimiter;
    }
    return result
  }

  // // 渲染人员列表
  // getPersonLine = (names) => {
  //   let html = '<tr>'
  //   names.forEach((item,i)=>{
  //     html += `
  //       <td>
  //         <select id="pname${i}" onclick="clickSelect()" itemindex="${i}">${getSelectHtml(item)}</select>
  //         <input type="hidden" value="${item}">
  //       </td>
  //       <td><input id="trouble${i}" itemindex="${i}" /></td>
  //       <td><input id="duration${i}" itemindex="${i}" /></td>
  //       <td><input id="response${i}" itemindex="${i}" /></td>
  //       <td><input id="rate${i}" value="0" readonly /></td>
  //       <td><input id="percent${i}" value="0" readonly /></td>
  //       <td><input id="amount${i}" value="0" readonly /></td>
  //       <td><button id="operate${i}" >-</button></td>
  //       `
  //       if (i != names.length - 1) {
  //         html += `</tr>
  //         <tr>`
  //       }
  //   })
  //   html += '</tr>'
  //   return html
  // }
  
  // getSelectHtml = (sel) => {
  //   let html  = ''
  //   names.forEach((item)=>{
  //     if (sel == item) {
  //       html += `<option selected>${sel}</option>`
  //     } else {
  //       html += `<option>${item}</option>`
  //     }
  //   })
  //   return html
  // }
  
  // clickSelect = () => {
  //   for (let index = 0; index < $('#score tbody tr.list').length; index++) {
  //     const _name = $(`#pname${index}`).val()
  //     console.log('_pname', _name)
  //   }
  // }

})
