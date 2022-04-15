src/pages/Report/Pc/Pages/financeReportPC/printTemplate/programDetailedAccountsPrint.vue
<template>
  <div id="programDetailedAccountsPrint" style="display: none">
    <div class="print" style="page-break-after: right;" v-for="(item, index) in printData" :key="index">
      <div style="position: relative;right: 0px;margin: 0px 10px 0 0;display: flex;justify-content: end;">页号：第{{index + 1}}/{{printData.length}}</div>
      <div class="programDetailedAccountsPrint-title" style="text-align: center;margin-top: 10px">
        <div style="font-size: 16px;font-weight: bold;margin-bottom: 5px">核算项目明细账</div>
        <div style="position: relative;font-size: 12px;display:flex;justify-content:space-between;padding: 0 10px;">
          <div>核算项目：{{projectCode || ''}} {{projectName}}</div>
          <div style="width:190px;">期间/日期：{{period}}-{{period}}</div>
        </div>
      </div>
      <div class="programDetailedAccountsPrint-content" style="margin: 0 10px">
        <table border="1" cellspacing="0" cellpadding="0" width="100%" style="margin-top: 15px;font-size: 12px">
          <thead>
            <tr>
              <th style="height: 30px;text-align:center;">日期</th>
              <th style="height: 30px;text-align:center;">凭证字号</th>
              <th style="height: 30px;text-align:center;">摘要</th>
              <th v-show="showSubjectColumn" style="height: 30px;text-align:center;">科目名称</th>
              <th v-show="showSubjectColumn" style="height: 30px;text-align:center;">科目编码</th>
              <th style="height: 30px;text-align:center;">借方</th>
              <th style="height: 30px;text-align:center;">贷方</th>
              <th style="height: 30px;text-align:center;">方向</th>
              <th style="height: 30px;text-align:center;">余额</th>
            </tr>
          </thead>
          <tbody style="text-align: center">
          <tr v-for="(value, key) in item" :key="key">
            <td style="height: 30px;text-align:center;">{{value.bookkeepingTime}}</td>
            <td style="height: 30px;text-align:left;">{{value.voucherWordNum}}</td>
            <td style="height: 30px;text-align:left;max-width:60px;overflow:hidden;"><div style="height:30px;line-height:30px;">{{value.summary}}</div></td>
            <td v-show="showSubjectColumn" style="height: 30px;text-align:left;max-width:60px;overflow:hidden;"><div style="height:30px;line-height:30px;">{{value.subjectName}}</div></td>
            <td v-show="showSubjectColumn" style="height: 30px;text-align:left;max-width:60px;overflow:hidden;"><div style="height:30px;line-height:30px;">{{value.subjectCode}}</div></td>
            <td style="height: 30px;text-align:right;">{{value.debitAccount}}</td>
            <td style="height: 30px;text-align:right;">{{value.creditAccount}}</td>
            <td style="height: 30px;text-align:center;">{{value.balanceDirection}}</td>
            <td style="height: 30px;text-align:right;">{{value.balance}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div style="margin:10px 10px 0 0;display: flex;justify-content: end;">打印日期 {{printDate}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'program-detailed-synthesis-print',
    props:{
      printData:{
        type: Array,
        default() {
          return []
        }
      },
      period:{
        type: String,
        default: ''
      },
      projectCode:{
        type: String,
        default: ''
      },
      subjectTitle:{
        type: String,
        default: ''
      },
      projectName:{
        type: String,
        default: ''
      },
      showSubjectColumn: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        data:[],
        printDate: new Date().getFullYear() + '-' + (+new Date().getMonth() + 1) + '-' + new Date().getDate()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
