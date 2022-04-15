src/pages/Finance/Pc/Pages/template/printTemplateVoucher.vue
<template>
	<div id="printTemplateVoucher" style="display: none">
		<div class="header" style="margin: 20px 20px 0 0">
			<div style="text-align: center;position: relative;margin-bottom: 10px">
				<div class="header-title" style="font-size: 25px;font-weight: bold">记账凭证</div>
			</div>
			<div style="text-align:center;">
				<div>日期：{{ printData.bookkeepingTime }}</div>
			</div>
			<div style="display: flex;justify-content: space-between;padding: 0 20px">
				<div>公司名称：{{companyName}}</div>
				<div>凭证编号：{{ voucherWordName }}</div>
			</div>
		</div>
		<div class="content" style="padding: 10px 20px;display:flex;align-items: center;">
			<table border="2" cellspacing="0" cellpadding="0" width="100%">
				<thead>
					<tr style="height: 30px;" v-for="(headerItem, headerIndex) in headerTitleList" :key="headerIndex">
						<th style="height: 30px;" v-for="(item, index) in headerItem" :key="index" :rowspan="item.isRowSpan">
							<span>{{ item.value }}</span>
						</th>
					</tr>
				</thead>
				<tbody style="text-align: center;">
					<tr style="height: 30px;" v-for="(item, index) in voucherInfoItems" :key="index">
						<td
							v-for="column in item.showColumn"
							:key="column.prop"
							:rowspan="column.isRowSpan"
							:style="column.setStyle">
							<span v-if="column.value && column.key === 'numberName'">
								{{column.value ? column.value : handleSetUnitName(column.value)}}
							</span>
							<span v-else-if="column.value">
								{{column.value}}
							</span>
							<span v-else>
								&nbsp;
							</span>
						</td>
					</tr>
					<tr style="height: 30px;font-size: 16px">
						<td style="height: 30px;">合计：（人民币）</td>
						<td style="height: 30px;font-weight: bold;" :colspan="totalColspan">{{ capitalSum(printData) }}</td>
						<td style="height: 30px;text-align:right;">{{ keepTwoDecimalFull(printData.debitAccount / 100) }}</td>
						<td style="height: 30px;text-align:right;">{{ keepTwoDecimalFull(printData.lenderAccount / 100) }}</td>
					</tr>
				</tbody>
			</table>
			<div
				v-if="printData && printData.attacheds && printData.attacheds.length > 0"
				style="width:20px;text-align:center"
				>
				附件{{ printData.attacheds.length }}张
			</div>
			<div v-else style="width:20px;text-align:center">附件 0 张</div>
		</div>
		<div class="footer" style="display: flex;justify-content: space-between;padding: 0 20px">
      <div>制单人：{{ printData.cardUserName }}</div>
			<div>审核：{{ printData.examineName }}</div>
			<div></div>
		</div>
	</div>
</template>

<script>
import { deepCopy, Z_IsEmpty20 as zIsempty20 } from '@/utils/fn'
import { digitUppercase, priceConversion, keepTwoDecimalFull } from '@/pages/Finance/Pc/Services/utils/commonJs'
export default {
	name: 'print-template-voucher',
	props: {
		printData: {
			type: Object,
			default() {
				return {}
			}
		},
		list: {
			type: Array,
			default() {
				return []
			}
		},
		voucherNumberList: {
			type: Array,
			default() {
				return []
			}
		},
		// 摘要
		abstractList: {
			type: Array,
			default() {
				return []
			}
		},
		// 单位
		measureList: {
			type: Array,
			default() {
				return []
			}
		},
		titleList: {
			type: Array,
			default() {
				return []
			}
		}
	},
	data() {
		return {
			voucherWordName: '',
			voucherInfoItems: [],
			totalColspan: 1,
			isRowSpan: false,
			headerTitleList: [],
			companyName: ''
		}
	},
	filters: {},
	computed: {
		showCurrencyAndCount() {
			const arr = []
			if (this.titleList && this.titleList.length > 0) {
				for (const item of this.titleList) {
					if (item.key === 'currency') {
						arr.push(item.key)
					}
					if (item.key === 'amount') {
						arr.push(item.key)
					}
				}
			}
			return arr
		}
	},
	watch: {
		// 打印数据
		voucherNumberList: {
			handler(val) {
				if (val.length !== 0) {
					let arr = val.filter(item => {
						return item.id === this.printData.voucherWord
					})
					if (this.printData.number && arr.length !== 0) {
						this.voucherWordName = arr[0].name + '-' + this.printData.number
					} else if (arr.length !== 0) {
						this.voucherWordName = arr[0].name
					}
				}
			},
			deep: true
		},
		//  监听列表数据
		list: {
			handler(val) {
				let deepData = deepCopy(val)
				deepData = deepData.filter(item => {
					return item.summary !== '' || item.subjectCode !== '' || item.debitAmount !== '' || item.creditAmount !== ''
				})
				this.handlePrintColumn(deepData)
			},
			deep: true
		}
	},
	created() {
		this.getLoadUserCurrentCompanyInfo()
	},
	methods: {
		keepTwoDecimalFull,
		getLoadUserCurrentCompanyInfo() {
			let url = '/zingbiz/auth/user/loadUserCurrentCompanyInfo'
			const params = {
				companyId: this.$route.query.companyId
			}
			this.$http.post(url, params).then(res => {
				if (res.data.success) {
					this.companyName = res.data.data.companyName || ''
				}
			})
		},
		// 处理摘要
		abstractFilter(val) {
			if (this.abstractList.length !== 0) {
				let arr = this.abstractList.filter(item => {
					return item.rowId === val
				})

				if (arr.length !== 0) {
					return arr[0].summaryContent
				} else if (arr.length === 0 && val) {
					return val
				}
				return ''
			}
			return val
		},
		// 处理钱
		handlerNumber(val, flag = false) {
			if (val !== '') {
				if (typeof deepCopy(val) === 'string') {
					let arr = deepCopy(val).split('')

					arr.splice(-2, 0, '.')
					if (flag) {
						if (flag) {
							arr.unshift('-')
						}
					} else if (flag) {
						arr.unshift('-')
					}
					return arr.join('')
				}
			}
			return ''
		},
		// 大小写
		capitalSum(val) {
			if (val.lenderAccount === val.debitAccount && val.lenderAccount !== '' && val.lenderAccount !== 0) {
				let cap = priceConversion(val.lenderAccount)

				if (val.isLenderMinus) {
					return '负' + digitUppercase(cap)
				}
				return digitUppercase(cap)
			}
			return ''
		},
		handlePrintColumn(deepData) {
			this.voucherInfoItems = []
			this.headerTitleList = []
			if (deepData && deepData.length === 0) {
				return
			}
			deepData.forEach(ele => {
				if (ele.debitAmount) {
					ele.debitAmount = this.handlerNumber(ele.debitAmount, ele.isMinus)
				}
				if (ele.creditAmount) {
					ele.creditAmount = this.handlerNumber(ele.creditAmount, ele.isMinus)
				}
			})
			if (this.showCurrencyAndCount && this.showCurrencyAndCount.length > 0) {
				this.totalColspan = 4
				if (this.showCurrencyAndCount.length === 2) {
					const titleCurrencyAndCountData = {
						summary: '摘要',
						subjectCode: '科目',
						currencyName: '币别',
						rate: '汇率',
						originalAccount: '原币金额',
						debitAmount: '借方',
						creditAmount: '贷方'
					}
					const titleCurrencyAndCountData1 = {
						numberName: '单位',
						price: '单价',
						count: '数量'
					}
					this.headerTitleList.push(this.handleComTitleColumn(titleCurrencyAndCountData, this.showCurrencyAndCount))
					this.headerTitleList.push(this.handleComTitleColumn(titleCurrencyAndCountData1, this.showCurrencyAndCount))
					deepData.forEach(ele => {
						for (let i = 0; i < 2; i ++) {
							const copyEle = deepCopy(ele)
							if (i === 0) {
								const data = ['summary', 'subjectCode', 'currencyName', 'rate', 'originalAccount', 'debitAmount', 'creditAmount']
								const showColumn = this.handleComColumn(data, copyEle, this.showCurrencyAndCount, i)
								this.$set(copyEle, 'showColumn', showColumn)
							} else {
								const data = ['numberName', 'price', 'count']
								const showColumn = this.handleComColumn(data, copyEle, this.showCurrencyAndCount, i)
								this.$set(copyEle, 'showColumn', showColumn)
							}
							this.voucherInfoItems.push(copyEle)
						}
					})
					return
				}
				// 只有数量
				if (this.showCurrencyAndCount.includes('currency')) {
					const titleCurrencyData = {
						summary: '摘要',
						subjectCode: '科目',
						currencyName: '币别',
						rate: '汇率',
						originalAccount: '原币金额',
						debitAmount: '借方',
						creditAmount: '贷方'
					}
					this.headerTitleList.push(this.handleComTitleColumn(titleCurrencyData, this.showCurrencyAndCount))
					deepData.forEach(ele => {
						const data = ['summary', 'subjectCode', 'currencyName', 'rate', 'originalAccount', 'debitAmount', 'creditAmount']
						const showColumn = this.handleComColumn(data, ele, this.showCurrencyAndCount, 0)
						this.$set(ele, 'showColumn', showColumn)
						this.voucherInfoItems.push(ele)
					})
					return
				}
				if (this.showCurrencyAndCount.includes('amount')) {
					const titleCountData = {
						summary: '摘要',
						subjectCode: '科目',
						numberName: '单位',
						price: '单价',
						count: '数量',
						debitAmount: '借方',
						creditAmount: '贷方'
					}
					this.headerTitleList.push(this.handleComTitleColumn(titleCountData, this.showCurrencyAndCount))
					deepData.forEach(ele => {
						const data = ['summary', 'subjectCode', 'numberName', 'price', 'count', 'debitAmount', 'creditAmount']
						const showColumn = this.handleComColumn(data, ele, this.showCurrencyAndCount, 1)
						this.$set(ele, 'showColumn', showColumn)
						this.voucherInfoItems.push(ele)
					})
				}
				return
			}
			// 没有数量跟币别
			const titleData = {
				summary: '摘要',
				subjectCode: '科目',
				debitAmount: '借方',
				creditAmount: '贷方'
			}
			this.headerTitleList.push(this.handleComTitleColumn(titleData, this.showCurrencyAndCount))
			deepData.forEach(ele => {
				const data = ['summary', 'subjectCode', 'debitAmount', 'creditAmount']
				const showColumn = this.handleComColumn(data, ele, this.showCurrencyAndCount)
				this.$set(ele, 'showColumn', showColumn)
				this.voucherInfoItems.push(ele)
			})
		},
		/**
		* @description: 生成所展示的列
		* @param {Array} data 生成需要展示列的参数
		* @param {Array} showCurrencyAndCount 是否需要展示币别跟数量
		* @return {Array} 返回组合后的列
		*/
		handleComColumn(data, item, showCurrencyAndCount, index = -1) {
			const showColumn = []
			if (data && data.length > 0) {
				for (let key of data) {
					let newObj = {}
					const filterKey = ['currencyName', 'rate', 'originalAccount', 'numberName', 'price', 'count']
					let value
					if (index === 0 && filterKey.includes(key) && !item.showCurrency) {
						value = ''
					} else if (index === 1 && filterKey.includes(key) && !item.showCount) {
						value = ''
					} else if (key === 'subjectCode') {
						value = item.describe
					} else if (key === 'numberName') {
						value = this.handleSetUnitName(item, this.measureList) || ''
					} else {
						value = item[key]
					}
					if (key === 'debitAmount' || key === 'creditAmount') {
						newObj.setStyle = 'text-align:right;height: 30px;'
					} else {
						newObj.setStyle = 'text-align:left;height: 30px;'
					}
					// 满足币别跟数量
					if (showCurrencyAndCount && showCurrencyAndCount.length === 2) {
						newObj.isRowSpan = filterKey.includes(key) ? 1 : 2
						newObj.key = key
						newObj.value = value
					} else {
						newObj.isRowSpan = 1
						newObj.key = key
						newObj.value = value
					}
					showColumn.push(newObj)
				}
			}
			return showColumn
		},
		/**
		* @description: 生成表头所展示的列
		* @param {Array} data 生成需要展示列的参数
		* @param {Array} showCurrencyAndCount 是否需要展示币别跟数量
		* @return {Array} 返回组合后的列
		*/
		handleComTitleColumn(data, showCurrencyAndCount) {
			const showColumn = []
			if (data && Object.keys(data).length > 0) {
				for (let key in data) {
					let newObj = {}
					const filterKey = ['currencyName', 'rate', 'originalAccount', 'numberName', 'price', 'count']
					// 满足币别跟数量
					if (showCurrencyAndCount && showCurrencyAndCount.length === 2) {
						newObj = {
							isRowSpan: filterKey.includes(key) ? 1 : 2,
							key,
							value: data[key]
						}
					} else {
						newObj = {
							isRowSpan: 1,
							key,
							value: data[key]
						}
					}
					showColumn.push(newObj)
				}
			}
			return showColumn
		},
		handleSetUnitName(params, data) {
			if (zIsempty20(params.numberName)) {
				let name = ''
				if (zIsempty20(params.unit)) {
					return name
				}
				if (data && data.length > 0) {
					const findItem = data.find( item => item.rowId === params.unit)
					if (findItem) {
						name = findItem.val
					}
				}
				return name
			}
			return params.numberName
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>
