export function getUrlParam(url, key) {
  return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null
}
export function getUrlParamAll(url, key) {
  if (url && key) {
    var reg = new RegExp('#/', '')
    var param = url.split(`${key}=/`)[1].replace(reg, '')
    return param || null
  }
}
export var cookie = {
  set: function (key, val, time = 365) {
    //设置cookie方法
    var date = new Date() //获取当前时间
    var expiresDays = time //将date设置为n天以后的时间
    date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000) //格式化为cookie识别的时间
    document.cookie = key + '=' + val + ';expires=' + date.toGMTString() //设置cookie
  },
  get: function (key) {
    //获取cookie方法
    /*获取cookie参数*/
    var getCookie = document.cookie.replace(/[ ]/g, '') //获取cookie，并且将获得的cookie格式化，去掉空格字符
    var arrCookie = getCookie.split(';') //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
    var tips //声明变量tips
    for (var i = 0; i < arrCookie.length; i++) {
      //使用for循环查找cookie中的tips变量
      var arr = arrCookie[i].split('=') //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
      if (key == arr[0]) {
        //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
        tips = arr[1] //将cookie的值赋给变量tips
        break //终止for循环遍历
      }
    }
    return tips
  }
}
export function delUrlParam(url, key) {
  // https://sss.com:7084/qywx/goods/index.html?Authorization=ey&jump=/productDetail?spuId=1634#/
  console.log('start', url)
  let str = '';
  if (url.indexOf('?') != -1) {
    str = url.substr(url.indexOf('?') + 1);
  } else {
    console.log('return1', url)
    return url;
  }
  let arr = '';
  let returnurl = '';
  if (str.indexOf('&') != -1) {
    arr = str.split('&');
    console.log(arr)
    for (let i in arr) {
      if (arr[i].split('=')[0] != key) {
        console.log(arr[i].split('='))
        returnurl = returnurl + arr[i].split('=')[0] + '=' + arr[i].split('=')[1] + "&";
      }
    }
    // console.log('return2', url.substr(0, url.indexOf('?')) + '?' + returnurl.substr(0, returnurl.length - 1))
    console.log('return2', returnurl)
    // return url.substr(0, url.indexOf('?')) + '?' + returnurl.substr(0, returnurl.length - 1);
    return returnurl
  } else {
    arr = str.split('=');
    if (arr[0] == key) {
      console.log('return3', url.substr(0, url.indexOf('?')))
      return url.substr(0, url.indexOf('?'));
    } else {
      console.log('return4', url)
      return url;
    }
  }
}

export function uniqueArr(arr, key) {
  // console.log(arr)
  let obj = {}
  let result = []
  result = arr.reduce((cur, next) => {
    obj[next[key]] ? '' : obj[next[key]] = true && cur.push(next);
    return cur;
  }, [])
  return result
}

export function openWxContacts(mode, selectedUserIds, callback) {
  wx.invoke("selectEnterpriseContact",
    {
      fromDepartmentId: -1, // 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
      mode: mode, // 必填，选择模式，single表示单选，multi表示多选
      type: ["department", "user"], // 必填，选择限制类型，指定department、user中的一个或者多个
      // "selectedUserIds": ["id1","id2"],  // 非必填，已选用户ID列表。用于多次选人时可重入，single模式下请勿填入多个id
      selectedUserIds: selectedUserIds
    },
    (res) => {
      // console.log(res)
      if (res.err_msg == "selectEnterpriseContact:ok") {
        if (typeof res.result == "string") {
          res.result = JSON.parse(res.result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
        }
        let userList = res.result.userList
        callback(userList)
      } else {
        callback([])
      }
    }
  );
}

// 深克隆
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function isEmpty(obj) {
  if (Array.isArray(obj) && obj.length == 0) {
    return true
  } else if (typeof obj == 'undefined' || obj == null || obj === '') {
    return true
  } else {
    return false
  }
}

export function delayer(action, delay = 1000) {
  let timer = -1
  return nv => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      action(nv)
    }, delay)
  }
}

// 文件大小格式化
export function formatFileSize(fileSize) {
  if (fileSize < 1024) {
    return fileSize + 'B';
  } else if (fileSize < (1024 * 1024)) {
    var temp = fileSize / 1024;
    temp = temp.toFixed(2);
    return temp + 'KB';
  } else if (fileSize < (1024 * 1024 * 1024)) {
    var temp = fileSize / (1024 * 1024);
    temp = temp.toFixed(2);
    return temp + 'MB';
  } else {
    var temp = fileSize / (1024 * 1024 * 1024);
    temp = temp.toFixed(2);
    return temp + 'GB';
  }
}

// 时间格式化
export function formatDate(number, format) { // formatDate('Y/M/D h:m:s')
  let formatNumber = (n) => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
  var returnArr = []

  var date = new Date(number)
  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))

  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }
  return format
}

export function million(value) { //数值过万处理
  let num;
  if (value !== '---') {
    if (value > 9999) {//大于9999显示x.xx万
      num = (Math.floor(value / 1000) / 10) + '万';
    } else if (value < 9999 && value >= 0) {
      num = value
    } else if (value < 0) {
      num = 0
    }
  } else {
    num = value
  }
  return num;
}

// 判断是否移动端
export function isMobile() {
  let userAgent = navigator.userAgent
  if ((userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    return true
  } else {
    return false
  }
}
// 判断是否属于图片类型
export function isImageType(url) {
  console.log(/\.(gif|jpg|jpeg|bmp|png|bmp|pic)$/.test(url) ? '图片类型' : '非图片类型')
  return /\.(gif|jpg|jpeg|bmp|png|bmp|pic)$/.test(url)
}

/**
 * 打印最近时间
 * 小于一分钟，显示“***秒前”
 * 小于一小时，显示“***分钟前”
 * 小于一天，显示“***小时前”
 * 否则显示：**月**日
 */
export function showRecentTime(timestamp) {
  let date = new Date(timestamp)
  let nowDate = new Date()
  if (date.getFullYear() === nowDate.getFullYear() && date.getMonth() === nowDate.getMonth() && date.getDate() === date.getDate()) {
    let time = (nowDate.getTime() - date.getTime()) / 1000
    if (time <= 60) {
      return Math.floor(time) + "秒前"
    } else {
      time = time / 60
      if (time < 60) {
        return Math.floor(time) + "分钟前"
      } else {
        time = time / 60
        if (time < 24) {
          return Math.floor(time) + "小时前"
        } else {
          return date.getMonth() + 1 + '月' + date.getDate() + '日'
        }
      }
    }
  } else {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }
}

export function changeDate(date) { //转成正常时间格式
  var d = new Date(date)
  var times = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
  return times
}
export function changeTime(date) { //转成正常时间格式
  var d = new Date(date)
  var h = d.getHours()
  h = h <= 0 ? '0' + h : h
  var m = d.getMinutes()
  m = m <= 0 ? '0' + m : m
  var s = d.getSeconds()
  s = s <= 0 ? '0' + s : s
  var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + h + ':' + m + ':' + s
  return times
}
export function salesFormat(value) {
  // if (!value) return 0
  if (value <= 10000) {
    return value
  } else {
    let n = Math.floor(value / 10000)
    return n + '万+'
  }
}
// 排序
export function sort_(prop) {
  return function (a, b) {
    var value1 = a[prop];
    var value2 = b[prop];
    return value2 - value1
  }
}

export function isMac() {
  return /macintosh|mac os x/i.test(navigator.userAgent);
}

// url转换blob
export const urlToBlob = (url) => {
  return new Promise(resolve => {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      } else {
        console.error(xhr)
      }
    }
    xhr.send()
  })
}

export const downloadFile = ({ url, fileName }) => {
  let a = document.createElement('a')
  a.href = url
  a.download = fileName  // 文件名称，不填默认为当前请求名称
  // 触发a链接点击事件，浏览器开始下载文件
  document.body.appendChild(a)
  a.click()
  a.remove()
}
