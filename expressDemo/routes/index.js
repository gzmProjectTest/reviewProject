var express = require('express');
var router = express.Router();

/* GET home page. */
// 这里永远不会改变
router.get('/', function(req, res, next) {
  res.json({
      data: {
          items: [{
              area: "",
              province: "110000",
              par_index: "0",
              city: "",
              p_name: "北京市"
          }]
      },
      code: 0,
      msg: "请求到的数据",
      hint: "5SrDOFbM8ENw"
  })
});

module.exports = router;
