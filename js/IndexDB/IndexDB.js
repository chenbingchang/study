const opendbRequest = indexedDB.open('MyDatabase', 1) // 注意：并不是直接打开数据库，而是发起了一个打开数据库的请求！
let db = null
let isOpenSucess = false

opendbRequest.onsuccess = function (e) {
  // 请求的 success 回调里面就可以获取打开的数据库了：
  console.log('数据库打开成功!')
  isOpenSucess = true
  db = e.target.result //或 opendbRequest.result
}

opendbRequest.onerror = function (e) {
  console.log('数据库打开失败!')
}

opendbRequest.onupgradeneeded = function (e) {
  console.log('version change 事务!')
  db = e.target.result //或 opendbRequest.result

  let objectStore
  
  // // 判断是否存在这个对象仓库
  // if(!db.objectStoreNames.contains('news')) {
  // }
  // 创建对象仓库
  objectStore = db.createObjectStore('news', {
    keyPath: 'id'
  })
  // 创建索引
  objectStore.createIndex('createTime', 'createTime', {unique: false})
  // 短文、图片数组、长文标题、长文  
}


setTimeout(function() {
  // addData({
  //   id: 'unpublish_0_425',
  //   createTime: Date.now(),
  //   content: '短文内容xxxxx2222222222222222',
  //   imgList: ['aa', 'bb', 'cc'],
  //   title: 'xxxx标题2222222222222222',
  //   edite: '长文内容xxxxx2222222222222222'
  // })
  // getCount()
  getData()
},300)

function addData(data) {
  if(!isOpenSucess) {
    return
  }

  let transaction = db.transaction(['news'], 'readwrite')
  let objectStore = transaction.objectStore('news')
  let request = objectStore.put(data)

  request.onsuccess = function (event) {
    console.log('数据写入成功', request.result);
  };

  request.onerror = function (event) {
    console.log('数据写入失败');
  }

  transaction.onerror = function(e) {
    console.log('数据库事务失败')
  }
  
  transaction.oncomplete  = function(e) {
    console.log('数据库事务成功', request.result)
  }
}

function getCount() {
  let transaction = db.transaction(['news'], 'readonly')
  let objectStore = transaction.objectStore('news')
  let request = objectStore.count('unpublish_0_424')

  request.onsuccess = function (e) {
    console.log('数据写入成功', request.result, e.target.result);
  };

  request.onerror = function (e) {
    console.log('数据写入失败');
  }

  transaction.onerror = function(e) {
    console.log('数据库事务失败')
  }
  
  transaction.oncomplete  = function(e) {
    console.log('数据库事务成功', request.result)
  }
}

function getData() {
  let transaction = db.transaction(['news'], 'readwrite')
  let objectStore = transaction.objectStore('news')
  let index = objectStore.index('createTime')
  let keyRange = IDBKeyRange.upperBound(1605155031696, true);
  let request = index.openCursor(keyRange)

  request.onsuccess = function (e) {
    console.log('数据写入成功', request.result);
    let cursor = request.result

    if(cursor) {
      console.log('游标数据', cursor.value)
      let key = cursor.primaryKey
      objectStore.delete(key)// 删除
      cursor.continue()// 下一个
    } else {
      // 游标遍历结束
    }
  };

  request.onerror = function (e) {
    console.log('数据写入失败');
  }

  transaction.onerror = function(e) {
    console.log('数据库事务失败')
  }
  
  transaction.oncomplete  = function(e) {
    console.log('数据库事务成功', request.result)
  }
}