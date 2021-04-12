
export class IndexDB {
  /**
   * 构造函数
   * @param {string} name 数据库名称
   * @param {number} version 版本
   */
  constructor(name, version = 1,) {
    this.name = name;
    this.version = version;
    /**
     * @type {IDBDatabase}
     */
    this.db = null;
  }

  /**
   * 打开某个表，若是没有该表则通过createStoreObject参数创建
   * @param {string} tableName 表名
   * @param {object} createStoreObject 创建参数， 示例：{keyPath: 'id'}
   * @param {string} dbName  数据库名称
   * @param {number} version 版本
   * @returns {Promise<IDBDatabase>}
   */
  open(tableName, createStoreObject = this.createStoreObject, dbName = this.name, version = this.version) {
    return new Promise((resolve, reject) => {
      const indexedDB = window.indexedDB; // || window.webkitindexedDB
      const request = indexedDB.open(dbName, version)
      request.onsuccess = (event) => {
        this.db = request.result
        resolve(request.result)
      }
      request.onupgradeneeded = (event) => {
        /**
         * @type {IDBDatabase}
         */
        const db = event.target.result
        if (!db.objectStoreNames.contains(tableName)) {
          db.createObjectStore(tableName, createStoreObject)
        }
        reject(db)
      }
      request.onerror = (event) => {
        reject(event)
      }
    })
  }

  getObjectStore(tableName, db = this.db, mode = null) {
    return db.transaction([tableName], mode).objectStore(tableName)
  }

  getByKey(key, tableName, db = this.db) {
    return new Promise((resolve, reject) => {
      const readReq = db.transaction([tableName]).objectStore(tableName).get(key)
      readReq.onerror = function (event) {
        reject(event)
      }
      readReq.onsuccess = function (event) {
        resolve(readReq.result)
      }
    })
  }

  add(record, tableName, db = this.db) {
    return new Promise((res, rej) => {
      /**
       * @type {IDBObjectStore}
       */
      let addReq = db
        .transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .add(record)
      // let addReq
      addReq.onsuccess = function (event) {
        res(true)
      }
      addReq.onerror = function (event) {
        rej('error')
      }
    })
  }


}