参考链接：https://www.jianshu.com/p/d222322a3b64
参考链接：https://www.cnblogs.com/xyb0226/p/7234507.html
参考文档：https://segmentfault.com/a/1190000010211622

mac: 相关的安装
1. newFile project
执行命令，D:/project > npm init； 命令执行完成后，会在项目根目录，可以看到package.json文件；在package.json中可添加配置项


2. 安装json-server
打开终端，输入: sudo npm install -g json-server
安装完成后可以用 json-server -h 命令检查是否安装成功，成功后会出现

3. 安装mock.js
npm install mockjs –save

4. 新建 test.json 文件
    {
        "data": {
            "items": [{
                "area": "",
                "province": "110000",
                "par_index": "0",
                "city": "",
                "p_name": "北京市"
            }, {
                "area": "",
                "province": "120000",
                "par_index": "0",
                "city": "",
                "p_name": "天津市"
            }, {
                "area": "",
                "province": "130000",
                "par_index": "0",
                "city": "",
                "p_name": "河北省"
            }]
        },
        "code": 0,
        "msg": "",
        "hint": "5SrDOFbM8ENw"
    }

5. 在project文件下 新建 mock/db.js 文件
var Mock = require('mockjs');
var test = require('../common/test.json');

module.exports = {
    test: Mock.mock(test),
}

6. 页面使用
let data = require('../../mock/db.js');
console.log('mockData', data)
