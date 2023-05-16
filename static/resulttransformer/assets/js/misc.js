let ChartColor = ["#5D62B4", "#54C3BE", "#EF726F", "#F9C446", "rgb(93.0, 98.0, 180.0)", "#21B7EC", "#04BCCC"];
let primaryColor = getComputedStyle(document.body).getPropertyValue('--primary');
let secondaryColor = getComputedStyle(document.body).getPropertyValue('--secondary');
let successColor = getComputedStyle(document.body).getPropertyValue('--success');
let warningColor = getComputedStyle(document.body).getPropertyValue('--warning');
let dangerColor = getComputedStyle(document.body).getPropertyValue('--danger');
let infoColor = getComputedStyle(document.body).getPropertyValue('--info');
let darkColor = getComputedStyle(document.body).getPropertyValue('--dark');
let lightColor = getComputedStyle(document.body).getPropertyValue('--light');
// let title = '观测云数据结果转换管理平台V1.0';
let title = '数据结果转换管理平台';

let _pathname_arr = location.pathname.split('/')
let _pathname = _pathname_arr.slice(-1)[0].replace(/^\/|\/$/g, '');

//Add active class to nav-link based on url dynamically
//Active class can be hard coded directly in html file also as required

function addActiveClass(element) {
  let realhref = element.attr('href').split('/')[element.attr('href').split('/').length-1]
  if (_pathname === "") {
    //for root url
    // if (element.attr('href').indexOf("index.html") !== -1) {
    if (realhref == ("index.html")) {
      element.parents('.nav-item').last().addClass('active');
      if (element.parents('.sub-menu').length) {
        element.closest('.collapse').addClass('show');
        element.addClass('active');
      }
    }
  } else {
    //for other url
    // if (element.attr('href').indexOf(_pathname) !== -1) {
    if (realhref == (_pathname)) {
      element.parents('.nav-item').last().addClass('active');
      if (element.parents('.sub-menu').length) {
        element.closest('.collapse').addClass('show');
        element.addClass('active');
      }
      if (element.parents('.submenu-item').length) {
        element.addClass('active');
      }
    }
  }
}

// 右侧历史记录列表render
let _renderList = (historylistRs) => {
  let listhtml = ''
  historylistRs.data.forEach((rs)=>{
    let navlink = rs.method == 'GET' ? 'get' : 'post'
    listhtml += `<li class="nav-item"> <a title="${rs.url}" class="nav-link nav-link-${navlink}" href="./pool.html">${rs.url}</a> <i class="mdi mdi-delete-forever history-del-btn" id="${rs.id}"></i> </li>`
  })
  // 左侧显示
  $('.history-list').html(listhtml)
  // 跳转页面记住左侧选中状态
  $('._sidebar .nav li a').each(function() {
    let $this = $(this);
    addActiveClass($this);
  })
}

(function($) {
  'use strict';
  $(function() {
    let body = $('body');
    let contentWrapper = $('.content-wrapper');
    let scroller = $('.container-scroller');
    let footer = $('.footer');
    let sidebar = $('.sidebar');

    // 加载某个页面，参数是页面位置
    let loadPage = (page, container, cb) => {
      $.ajax({
        url: page,
        type: 'GET', 
        dataType:'html', 
        async:false, 
        success:(content)=>{
          container.html(content)
          cb ? typeof cb == 'function' ? cb() : '' : ''
          $('.titleval').text(title)
        }
      })
    }

    let prefix_path = _pathname == 'index.html' ? './' : '../../'
    if ($.cookie('loginStatus')) {
      loadPage(`${prefix_path}partials/_navbar.html`, $("._navbar"), null)
      loadPage(`${prefix_path}partials/_footer.html`, $("._footer"),null)
      loadPage(`${prefix_path}partials/_sidebar.html`, $("._sidebar"), ()=>{
        // 请求历史记录
        let historylistPromise = getPromise(api['历史记录'], 'GET', null)
        historylistPromise.then((historylistRs)=>{
          // 判断是否成功
          _renderList(historylistRs)
        })
      })
    } else if (!(prefix_path == '../../' && _pathname == '/' || prefix_path == './' && _pathname == 'index.html')) {
      // debugger
      location.href = './index.html'
    }

    // 绑定删除事件
    $('.history-list').on('click', '.history-del-btn', (d)=>{
      let record_id = $(d.target).attr('id')
      let recordparam = {
        "kwargs": {
          "record_id": record_id
        }
      }
      let delhistoryPromise = getPromise(api['删除历史记录'], 'POST', JSON.stringify(recordparam))
      delhistoryPromise.then((rs)=>{
        $(d.target).parent('li').hide()
        alert_tips('success', '删除成功')
      })
    })

    $('.loginname').text($.cookie('loginName'))

    // $('.nav li a', sidebar).each(function() {
    //   let $this = $(this);
    //   addActiveClass($this);
    // })

    $('.horizontal-menu .nav li a').each(function() {
      let $this = $(this);
      addActiveClass($this);
    })

    //Close other submenu in sidebar on opening any

    sidebar.on('show.bs.collapse', '.collapse', function() {
      sidebar.find('.collapse.show').collapse('hide');
    });


    //Change sidebar and content-wrapper height
    applyStyles();

    function applyStyles() {
      //Applying perfect scrollbar
      if (!body.hasClass("rtl")) {
        if (body.hasClass("sidebar-fixed")) {
          let fixedSidebarScroll = new PerfectScrollbar('#sidebar .nav');
        }
      }
    }
    // 左侧栏状态
    $.cookie('sidebarStatus') == "0" ? body.addClass('sidebar-icon-only') : body.removeClass('sidebar-icon-only')
    $('[data-toggle="minimize"]').on("click", function() {
      if ((body.hasClass('sidebar-toggle-display')) || (body.hasClass('sidebar-absolute'))) {
        body.toggleClass('sidebar-hidden');
      } else {
        body.toggleClass('sidebar-icon-only');
        body.hasClass('sidebar-icon-only') ? $.cookie('sidebarStatus',0, {path:'/'}) : $.cookie('sidebarStatus',1, {path:'/'})
      }
    });

    //checkbox and radios
    $(".form-check label,.form-radio label").append('<i class="input-helper"></i>');

    //fullscreen
    $("#fullscreen-button").on("click", function toggleFullScreen() {
      if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    })

    $('.user-logout').on('click', ()=>{
      let param = {
        "kwargs":{
          "username": $.cookie('loginName')
        }
      }
      let promise = getPromise(api['简单登出'], 'POST',JSON.stringify(param))
      promise.then((rs)=>{
        $.removeCookie('loginStatus',{path:'/'})
        $.removeCookie('loginName',{path:'/'})
        location.href="/"
      })
    })

    // 登录
    // 检查 cookie，有责免登，无则跳转到登录
    // if($.cookie('loginStatus')) { } else {
    //   if(location.pathname.indexOf('index.html') == -1) {
    //     location.href='../../index.html'
    //   }
    // }

    // 验证 + 登录
    let check_login = (forms, event) => {
      if (!forms[0].checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        // 提交登录，并跳转
        let params = {
          kwargs:{
            "username": $('#textUsername').val(),
            "password": $('#textPassword').val()
          }
        }
        // let loginPromise = getPromise(api['简单登录'], 'POST', {params:JSON.stringify(params)})
        let loginPromise = getPromise(api['简单登录'], 'POST', (params))
        loginPromise.then((res)=>{
          console.log('res',res)
          if (res.data && res.data.token) {
            // 成功
            $.cookie('loginStatus',res.data.token, {path:'/',expires:1})
            $.cookie('loginName',$('#textUsername').val(), {path:'/',expires:1})
            location.href="./pages/responsehandle/responsehandle.html"
          } else {
            // 失败
            $('.edit-tips').show().text('登录失败，用户名、密码错误')
          }
        })
      }
      forms.addClass('was-validated')
    }

    const forms = $('.needs-validation')
    forms.on('keydown', (event)=>{
      if (event.key == 'Enter'){
        check_login(forms, event)
        event.preventDefault()
      }
    })

    forms.on('click', (event)=>{
      check_login(forms, event)
    })
    
  });
})($);