/*
 * @Author: your name
 * @Date: 2021-08-20 15:15:16
 * @LastEditTime: 2021-08-20 15:15:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /review/dom/remove.js
 */
<html>
<head>
<script type="text/javascript">
    function removeOption()
    {
    var x=document.getElementById("mySelect")
    x.remove()
    }
</script>
</head>
<body>
<form>
<select id="mySelect">
  <option>苹果</option>
  <option>桃子</option>
  <option>香蕉</option>
  <option>桔子</option>
</select>
<input type="button" "removeOption()" value="删除被选的选项">
</form>

</body>
</html>
