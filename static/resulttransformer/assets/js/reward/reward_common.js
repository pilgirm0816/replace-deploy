const columnDelimiter = "\t"; //列分割符
const lineDelimiter = "\n";  //行分割符

_toUtf16LE = (str) => {
  let charCode, byteArray = [],
      len = str.length;
  byteArray.push(255, 254); // LE BOM
  for (let i = 0; i < len; ++i) {
    charCode = str.charCodeAt(i);
    // LE Bytes
    byteArray.push(charCode & 0xff);
    byteArray.push(charCode / 256 >>> 0);
  }
  return byteArray;
}

// 下载 csv
downloadTable = (tableId, fileName) => {
  let result = ''
  const isArr = Array.isArray(tableId)
  if (isArr) {
    tableId.forEach((tid)=>{
      result += getTableHtml(tid)
      result += lineDelimiter + lineDelimiter
    })
  } else {
    result = getTableHtml(tableId)
  }

  let blob = new Blob([new Uint8Array(_toUtf16LE(result))], {type: "text/csv;charset=UTF-16;"});
  let downloadLink = document.createElement("a");
  if ('download' in downloadLink) {
    let url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.hidden = true;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } else {
    if(navigator.msSaveBlob){ //IE10+
      navigator.msSaveBlob(blob, fileName);
    }
  }
}

function toFixed(value, number) {
  let t = 1
  let val = value
  for(let i = 0;i < number;i++) {
    val = val * 10
    t = t * 10
  }
  let rs = (Math.floor(val) / t).toFixed(number)
  return +rs
}

// 金额进出池子状态
getTypeText = (type) => {
  const typearr = ['','从池子拿出','进池子']
  return typearr[type]
}

// 签约状态
const isdirectObj = [{'name':'非直签','value':2},{'name':'直签','value':5}]
function getDirectTitle(isdirect) {
  let obj = isdirectObj.find(rs => rs.value == isdirect)
  return obj.name
}

// 录入类型
const awardtypeObj = [{'name':'正常录入','value':1},{'name':'支出录入','value':2}]
function getAwardTypeTitle(type) {
  let obj = awardtypeObj.find(rs => rs.value == type)
  return obj.name
}

// 获取 url 上的参数，发送 url，返回参数对象
function queryURLParams(URL) {
  let url = location.href.split("?")[1];
  const urlSearchParams = new URLSearchParams(url);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params
}

//考虑到可能有多个请求需要发送，需要创建多个承诺对象，所以采用工厂函数进行封装
getPromise = (url,method='get',data=null) => {
  let headers = {}
  if (url.indexOf('IG3Tkwa1sy3T') == -1) {
    if (!!!$.cookie('loginStatus')) {
      location.href="/"
    }
    headers = {
      "Content-Type":"application/json",
      "x-auth-token": $.cookie('loginStatus')
    }
  }
  return new Promise((resolve,reject)=>{
    $.ajax({
      headers: headers,
      url:url,
      method:method,
      data:data,
      success: (res) => resolve(res),
      error: (err) => reject(err),
      complete: (rs) => {console.log(rs)},
    })
  })
}

// 提示
function alert_tips(type, msg) {
  let alertType = type == 'error' ? 'alert-danger' : 'alert-success'
  $('.alert').addClass(alertType).text(msg).removeClass('fade')
  setTimeout(()=>{$('.alert').addClass('fade').text('')}, 5000)
}

// let p1 = getPromise('url');
// let p2 = getPromise('url');
// p1.then((res)=>{
//     console.log(res,'1111111', res)
// })
// p2.then((res)=>{
//     console.log(res,'222222')
// })
// all 只有两个异步操作请求都成功才会返回成功的结果，否则返回失败对象
// race 谁的响应先拿到用谁的结果 无论成功与否
// any 有成功用成功的，都失败就失败
// let p = Promise.all([p1,p2]);
// p.then((res)=>{
//     console.log(res)
// }).catch((err)=>{
//     console.log(err)
// })