src/pages/Finance/Pc/Pages/voucher/addVoucher.vue
<template>
  <div style="height:100%;" id="addVoucher" @click="handleAddVoucher">
    <CardLayout :aside="false" :headerHeight="'100px'" :isComeBack="isComeBack">
      <template slot="header">
        <span v-if="isEditVoucher">编辑凭证录入</span>
        <span v-else>凭证录入</span>
      </template>
      <div class="addVoucher" slot="body">
        <div class="addVoucher-header" v-if="!isEditVoucher">
          <div class="addVoucher-header-right">
            <el-button size="small" @click="print">打印</el-button>
            <el-button v-if="isClick" size="small" @click="visibleManage = true">调用凭证模板</el-button>
            <el-button v-if="isClick" size="small" @click="dialogVisible = true">保存为凭证模板</el-button>
            <!-- <el-button v-if="(voucherInfo && voucherInfo.relationCard && voucherInfo.relationCard.length > 0) || !showAddTask" size="small" @click="showAddTask = true">添加任务核算项</el-button> -->
            <el-button
              v-if="isCommonTask && (voucherInfo && voucherInfo.relationCard && voucherInfo.relationCard.length === 0) || voucherInfo.relationCard === undefined"
              size="small"
              @click="handleShowTask">
              添加任务核算项
            </el-button>
            <i class="iconfont icon-prev-arrow" style="font-size: 22px;margin: 0 10px" :class="{ isdisabledPre: isdisabledPre }" @click="pre"></i>
            <i class="iconfont icon-xiayiye1" style="font-size: 22px;margin-right: 10px" :class="{ isdisabledNext: isdisabledNext }" @click="next"></i>
          </div>
        </div>
        <div v-else-if="isCommonTask && (voucherInfo && voucherInfo.relationCard && voucherInfo.relationCard.length === 0) || voucherInfo.relationCard === undefined" class="addVoucher-header" >
          <div class="addVoucher-header-right">
            <el-button v-if="isClick" size="small" @click="handleShowTask">添加任务核算项</el-button>
          </div>
        </div>
        <div class="addVoucher-content">
          <div class="addVoucher-content-top" style="margin-bottom: 10px">
            <div v-if="isEditVoucher">
              <div class="addVoucher-bookkeeping-voucher">{{title}}</div>
              <div v-if="!isClick" style="color: red;margin-left: 10px">亲，该凭证是系统生成的，不能修改</div>
            </div>
            <div v-else class="addVoucher-bookkeeping-voucher">记账凭证</div>
            <div class="addVoucher-bookkeeping-voucher-title-content">
              <div style="width:450px;display:flex;">
								<span>
									<span><span style="color:red;"> * </span>凭证字：</span>
									<el-select class="readonlySelect_special" placeholder="请选择" size="small" style="width: 100px" v-model="voucherInfo.voucherWord" :disabled="!isClick">
										<el-option v-for="item in voucherNumberList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
									</el-select>
									<input v-model="voucherInfo.number" type="text" style="width: 50px;text-align: center;height:32px;margin-left:10px;" onkeyup="value=value.replace(/[^\d]/g,'')" :readOnly="!isClick" /> 号
								</span>
                <span>
									<label><span style="color:red;margin-left:20px;">*</span>日期：</label>
									<el-date-picker
                    :readonly="!isClick"
                    class="readonlySelect_special"
                    style="width: 133px;"
                    v-model="voucherInfo.bookkeepingTime"
                    :picker-options="pickeroptions"
                    value-format="yyyy-MM-dd"
                    size="small"
                    type="date"
                    placeholder="选择日期"
                  >
									</el-date-picker>
								</span>
              </div>
              <span>{{bookkeepingTimePeriod}}</span>
              <div style="width:450px;display: flex;justify-content: flex-end;position:relative;">
								<span style="height: 32px;line-height: 32px">
									<label>凭证编号：</label>
									<input
                    v-model="voucherInfo.code"
                    type="text"
                    style="width: 150px;text-align: center"
                    onkeyup="value=value.replace(/[^\d]/g,'')"
                    disabled
                    placeholder="提交后自动生成" />
								</span>
                <span v-if="voucherInfo.approveStatus === 'YSH'">
									<i class="iconfont icon-yishenhe yishenhe"></i>
								</span>
                <span class="addVoucher-content-top-enclosure" style="display:flex;">
									<span>附件数：
										<span v-if="voucherInfo && voucherInfo.attacheds && voucherInfo.attacheds.length > 0" class="addVoucher-content-top-enclosure-Number">{{ voucherInfo.attacheds.length}}</span>
										<span v-else class="addVoucher-content-top-enclosure-Number">0</span>
									</span>
									<i class="iconfont icon-fujian" style="cursor:pointer;" @click="handleUpload"></i>
								</span>
              </div>
            </div>
          </div>
          <div style="display:flex;position: relative">
            <div style="display:flex;">
							<table style="width:61px;position:absolute;z-index:10;">
								<thead>
									<tr>
										<th style="width:61px;background-color:#F6FAFE;">
											<span style="height:25px;line-height:25px;">&nbsp;</span>
										</th>
								</tr>
								</thead>
								<tbody>
									<tr
										v-for="(item, index) in contentList"
										:key="index"
										@click="mouseenter(item)"
										@mouseenter="showOperate(index, item)"
										@mouseleave="hideOperate(index)">
										<td :style="handleTdStyle(index)" class="icon" style="width:61px;display:table-cell;vertical-align:middle;text-align: center;position:relative;">
												<span>
													<span v-show="indexFlag === index" class="addVoucher-content-table-icon addVoucher-content-table-icon-add" @click="addVoucherItem(index)">+</span>
													<span v-show="indexFlag === index" class="addVoucher-content-table-icon addVoucher-content-table-icon-reduce" @click="deleteVoucherItem(index)">-</span>
												</span>
											<span v-show="indexFlag !== index">{{ index + 1 }}</span>
										</td>
									</tr>
									<tr style="font-size: 16px;">
										<td style="background:#FFF7D9;text-align:center;">合计</td>
									</tr>
								</tbody>
							</table>
              <table style="width: 100%;table-layout:fixed;margin-left: 64px;">
                <thead>
                <tr>
                  <th
                    v-for="(item, index) in titleList"
                    :key="index"
                    style="background-color:#F6FAFE;"
                    :class="{
												quantity: item.key === 'amount',
												currency: item.key === 'currency',
												abstract: item.key === 'abstract',
												subject: item.key === 'subject'
											}"
                  >
                    <span v-if="!item.label" style="height:25px;line-height:25px;">{{ item.value }}</span>
                    <strong v-if="item.label" class="voucher-direction">{{ item.value }}</strong>
                    <div v-if="item.label" class="voucher-money" style="background-color:#F6FAFE;">
                      <span v-for="(value, index01) in item.label" :key="index01" :class="{ last: value === '分' }">{{ value }}</span>
                    </div>
                    <div v-if="item.shareLabel" class="voucher-currency" style="display:flex;height:25px;border-top: 1px solid #BBBBBE;line-height: 22px;">
                      <div
                        v-for="(currencValue, currencIndex) in item.shareLabel"
                        style="height:25px;border:none;width:1px;flex-grow: 1;"
                        :key="currencIndex">
                        {{ currencValue }}
                      </div>
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in contentList" :key="index" @click="mouseenter(item)" @mouseenter="showOperate(index, item)" @mouseleave="hideOperate(index)">
                  <!-- 摘要 -->
                  <td class="abstract" :style="handleTdStyle(index)" tabindex="0" @focus="handleAbstractClick(item, index)">
                    <div class="content-value" @mouseenter="handleAbstractName(true)" @mouseleave="handleAbstractName(false)">
											<input
												v-show="item.showAbstractInput"
												v-model="item.summary"
												class="resetBorder abstract-input-keyup"
												ref="abstractInput"
												@input="handleAbstractInput(item.summary, item)"
												@blur="handleAbstractBlur(item)"
												@keyup.enter.right.left.up.down="handleAbstractKeyupEnter(item, index, $event, 'abstract-input-keyup')"
											/>
											<div
												v-show="!item.showAbstractInput"
												@click="handleAbstractClick(item, index)"
												class="abstract-static-style"
												tabindex="0"
												:class="handleAbstractStyle(index)">
												{{item.summary}}
											</div>
											<el-popover
												placement="bottom"
												trigger="manual"
												popper-class="voucher-common-option"
												v-model="item.isAbstractOptions">
												<ul class="voucher-common-option-content" v-if="abstractList && abstractList.length > 0">
													<li
														v-for="(abstractItem, abstractIndex) in abstractList"
														:key="abstractItem.id"
														@mousedown="handleChangeAbstract(abstractItem.summaryContent, true)"
														@mouseenter="abstracttMouseEnterIndex = abstractIndex"
														:class="abstractIndex === abstracttMouseEnterIndex ? 'select-selected' : ''"
														class="voucher-common-option-content-li">
														<div class="">{{abstractItem.summaryContent}}</div>
													</li>
												</ul>
												<div class="voucher-common-option-footer" v-if="abstractList && abstractList.length > 0">
													<div @click.stop="handleAbstractCom(index)"><i class="iconfont icon-prev-arrow isdisabledPre" id="subject-more"></i>显示更多</div>
												</div>
											</el-popover>
                      <span v-show="indexFlag === index && showAbstractName" @click.stop="handleAbstractCom(index)" class="abstract-text">摘要</span>
                    </div>
                  </td>
                  <!-- 科目 -->
                  <td class="subject" :style="handleTdStyle(index)" tabindex="0" @focus="handleSubjectClick(item, index)">
                    <div class="content-value" @mouseenter="handleSubject(true)" @mouseleave="handleSubject(false)">
											<input
												v-show="item.showSubject"
												v-model="item.subjectCode"
												class="resetBorder subject-input-keyup"
												ref="subjectInput"
												@input="handleSubjectInput(item.subjectCode, item)"
												@blur="handleSubjectBlur(item)"
												@keyup.enter.right.left.up.down="handleSubjectKeyupEnter(item, index, $event, 'subject-input-keyup')"
												/>
											<div
												v-show="!item.showSubject"
												@click="handleSubjectClick(item, index)"
												:class="handleSubjectStyle(index)"
												tabindex="0"
												class="subject-static-style">
													<el-tooltip class="item" effect="dark" :content="item.describe" placement="bottom">
														<div ref="subjectContent" :class="item.lineClamp2 ? 'subject-item-lineClamp2' : ''">{{item.describe}}</div>
													</el-tooltip>
													<div
														v-show="isClick && item.subjectCode"
														class="subject-static-style-balance">
														余额：{{ keepTwoDecimalFull(item.currencyBalance) || '0.00' }}
													</div>
												<!-- <el-popover
													placement="top-start"
													width="400"
													:content="item.describe"
													trigger="hover">
													<div slot="reference">
														这种调用方法存在问题，会让这个方法执行多次，待优化 {{ handleSubjectTopTip(item, this) }}
														<div ref="subjectContent" :class="item.lineClamp2 ? 'subject-item-lineClamp2' : ''">{{item.describe}}</div>
														<div
														审核中，已审核不显示
															v-show="isClick && item.subjectCode"
															class="subject-static-style-balance">
															余额：{{ keepTwoDecimalFull(item.currencyBalance) || '0.00' }}
														</div>
													</div>
												</el-popover> -->
											</div>
											<el-popover
												placement="bottom"
												trigger="manual"
												popper-class="voucher-common-option"
												v-model="item.isSubjectOptions">
												<div class="voucher-common-option-header">
													<div>编码</div>
													<div>名称</div>
												</div>
												<ul class="voucher-common-option-content" v-if="subjectList && subjectList.length > 0">
													<!-- 1 :key="subjectItem.subjectIndex"如果key中的标识换成id，那么三级id点击无效 -->
													<!-- 2 :li中 @click handleChangeSubject < input handleSubjectBlur 所以替换click为 mousedown-->
													<li
														v-for="(subjectItem, subjectIndex) in subjectList"
														:key="subjectItem.subjectIndex"
														@mousedown="handleChangeSubject(subjectItem.subjectCode, true)"
														@mouseenter="handleMouseenterSubject(subjectIndex, item)"
														:class="subjectIndex === subjectMouseEnterIndex ? 'select-selected' : ''"
														class="voucher-common-option-content-li">
														<div>{{subjectItem.subjectCode}}</div>
														<div>{{subjectItem.subjectNameFull ? subjectItem.subjectNameFull : subjectItem.subjectName}}</div>
													</li>
												</ul>
												<div class="voucher-common-option-content voucher-common-option-content-empty" v-else>
													暂无数据
												</div>
												<div class="voucher-common-option-footer">
													<div><i class="iconfont icon-jiahao3 isdisabledPre" id="subject-add" @click.stop=""></i>新增</div>
													<div @click.stop="handleSubjectCom(index)"><i class="iconfont icon-prev-arrow isdisabledPre" id="subject-more"></i>显示更多</div>
												</div>
											</el-popover>
                      <el-popover
                        placement="bottom"
                        trigger="manual"
                        v-model="item.showAccountDetail">
                        <div v-if="item.showAccountDetail" id="add-voucher-popover-content">
                          <div  v-show="ruleForm.showCustomer" class="add-voucher-popover-content-show">
                            <div class="add-voucher-popover-content-show-label">
                              <span>*</span>客户
                            </div>
                            <el-input
                              class="add-voucher-popover-content-show-input"
                              v-model="ruleForm.customer"
															@click.stop.native="handleInputStop"
                              size="small">
                              <i class="iconfont icon-gengduo" slot="suffix" @click.stop="customerVisible = true"></i>
                            </el-input>
                          </div>
                          <div v-show="ruleForm.showSupplier" class="add-voucher-popover-content-show">
                            <div class="add-voucher-popover-content-show-label">
                              <span>*</span>供应商
                            </div>
                            <el-input
                              class="add-voucher-popover-content-show-input"
                              v-model="ruleForm.supplier"
															@click.stop.native="handleInputStop"
                              size="small">
                              <i class="iconfont icon-gengduo" slot="suffix" @click.stop="supplierVisible = true"></i>
                            </el-input>
                          </div>
                          <div v-show="ruleForm.showWarehouse" class="add-voucher-popover-content-show">
                            <div class="add-voucher-popover-content-show-label">
                              <span>*</span>仓库
                            </div>
                            <el-input
                              class="add-voucher-popover-content-show-input"
                              v-model="ruleForm.warehouse"
															@click.stop.native="handleInputStop"
                              size="small">
                              <i class="iconfont icon-gengduo" slot="suffix" @click.stop="$refs.warehouseRef.show()"></i>
                            </el-input>
                          </div>
                          <div v-show="ruleForm.showMateriel" class="add-voucher-popover-content-show">
                            <div class="add-voucher-popover-content-show-label">
                              <span>*</span>物料
                            </div>
                            <el-input
                              class="add-voucher-popover-content-show-input"
                              v-model="ruleForm.materiel"
															@click.stop.native="handleInputStop"
                              size="small">
                              <i class="iconfont icon-gengduo" slot="suffix" @click.stop="addVoucherGoodList"></i>
                            </el-input>
                          </div>
                          <div v-show="ruleForm.showDepartment" class="add-voucher-popover-content-show">
                            <div class="add-voucher-popover-content-show-label">
                              <span>*</span>部门
                            </div>
                            <el-input
                              class="add-voucher-popover-content-show-input"
                              v-model="ruleForm.department"
															@click.stop.native="handleInputStop"
                              size="small">
                              <i class="iconfont icon-gengduo" slot="suffix" @click.stop="showPersonPicker = true"></i>
                            </el-input>
                          </div>
                          <div v-show="ruleForm.showStaffMember" class="add-voucher-popover-content-show">
                            <div class="add-voucher-popover-content-show-label">
                              <span>*</span>职员
                            </div>
                            <el-input
                              class="add-voucher-popover-content-show-input"
                              v-model="ruleForm.staffMember"
															@click.stop.native="handleInputStop"
                              size="small">
                              <i class="iconfont icon-gengduo" slot="suffix" @click.stop="showDeptMemberVisible = true"></i>
                            </el-input>
                          </div>
                          <div style="text-align: right;">
                            <el-button size="small" @click.stop="handlerBusinessCancal(item)">取 消</el-button>
                            <el-button size="small" type="primary" @click.stop="handlerBusinessDetermine(item)">确 定</el-button>
                          </div>
                        </div>
                      </el-popover>
                      <span v-show="indexFlag === index && showSubjectName" @click.stop="handleSubjectCom(index)" style="color:#989E9D;position:absolute;right:15px;top:21px;cursor:pointer;">科目</span>
                    </div>
                  </td>
                  <!-- 数量 -->
                  <td class="quantity" v-if="showCount" :style="handleTdStyle(index)">
                    <div v-if="item.showCount" class="quantity-content">
                      <div class="currency-content-currency-type">
                        <input
                          type="text"
                          maxlength="11"
                          @blur="countBlur"
                          v-model="item.count"
                          ref="quantityNumber"
                          @focus="showNumberIndex = true"
													@keyup.enter.right.left.up.down="handleCommonEnter($event, index, 'count-input-keyup', item)"
                          class="quantity-number-input count-input-keyup"
                          :style="handleQuantityStyle(index)"
                          style="border:none;width:100%;text-align:center;"
                          :disabled="!isClick" />
                      </div>
                      <div v-if="measureList && measureList.length > 0" class="currency-content-exchange-rate quantity-content-company">
                        {{item.numberName ? item.numberName : handleSetUnitName(item)}}
                      </div>
                      <div class="currency-content-original-currency">
                        <input
                          type="text"
                          v-model="item.price"
                          @focus="showUnitPriceIndex = true"
                          @blur="priceBlur"
													@keyup.enter.right.left.up.down="handleCommonEnter($event, index, 'price-input-keyup', item)"
                          :style="handleUnitPriceStyle(index)"
                          class="quantity-price-input price-input-keyup"
                          style="border:none;width:100%;text-align:center;"
                          :disabled="!isClick" />
                      </div>
                    </div>
                    <div v-else class="quantity-content">
                      <div class="currency-content-currency-type">&nbsp;</div>
                      <div class="currency-content-exchange-rate">&nbsp;</div>
                      <div class="currency-content-original-currency">&nbsp;</div>
                    </div>
                  </td>
                  <!-- 币别 -->
                  <td class="currency" v-if="showCurrency" :style="handleTdStyle(index)">
                    <div v-if="item.showCurrency" class="currency-content">
                      <div class="currency-content-currency-type"  @mouseenter="showCurrencytIndex = true" @mouseleave="showCurrencytIndex = false">
                        <el-select
                          v-model="item.currencyCode"
                          filterable
                          class="set-select currency-code-input-keyup"
													size="mini"
                          :class="handleCurrencytClass(index)"
                          @change="changeCurrency($event)"
													@keyup.native="handleCommonEnter($event, index, 'currency-code-input-keyup', item)"
                          :disabled="!isClick">
                          <el-option
                            v-for="(val) in currencyList"
                            :key="val.code"
                            :label="val.name"
                            :value="val.code">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="currency-content-exchange-rate">
                        <input
                          v-model="item.rate"
                          type="text"
													class="rate-input-keyup"
                          style="width:100%;border:none;text-align:center;"
													@keyup.enter.right.left.up.down="handleCommonEnter($event, index, 'rate-input-keyup', item)"
                          :disabled="rateDidabled(item)"
                          @blur="rateBlur" />
                      </div>
                      <div class="currency-content-original-currency">
                        <input
                          type="text"
                          @focus="showOriginalCurrencyIndex = true"
                          :style="handleOriginCurrency(index)"
                          style="width:100%;border:none;text-align:center;"
                          v-model="item.originalAccount"
                          @blur="originalAccountBlur"
													@keyup.enter.right.left.up.down="handleCommonEnter($event, index, 'original-account-input-keyup', item)"
                          class="quantity-price-input original-account-input-keyup" />
                      </div>
                    </div>
                    <div v-else class="currency-content">
                      <div class="currency-content-currency-type">&nbsp;</div>
                      <div class="currency-content-exchange-rate">&nbsp;</div>
                      <div class="currency-content-original-currency">&nbsp;</div>
                    </div>
                  </td>
                  <!-- 借方 -->
									<td :style="handleTdStyle(index)" tabindex="0" @focus="showInput('debit', item, index)">
										<div
											v-if="!item.showDebit"
											class="borrow-money"
											:class="{ plusOrMinus: item.isMinus }"
											style="text-align: right;"
											tabindex="1"
											:style="handleTdStyle(index)"
											@click="showInput('debit', item, index)">
											<div class="content-value" v-if="item.debitAmountMoenyData && item.debitAmountMoenyData.length > 0">
												<span
													:class="index === 2 || index === 5 ? 'content-value-blue' : index === 8 ? 'content-value-red' : ''"
													v-for="(debitAmountNum, index) in item.debitAmountMoenyData" :key="index">
													{{item.debitAmountMoenyData[index] || ''}}
												</span>
											</div>
											<div class="content-value" v-else>
												<span
													:class="numIndex === 2 || numIndex === 5 ? 'content-value-blue' : numIndex === 8 ? 'content-value-red' : ''"
													v-for="(numItem, numIndex) in 11" :key="numIndex">
												</span>
											</div>
										</div>
										<input
											v-else
											class="inputMoney borrower-input-keyup"
											ref="inputBorrowMoney"
											type="text"
											@blur="handleBlurMoney('debit', item)"
											@input="handleInputMoney($event, 'debit', item)"
											:style="handleBorrowStyle(index)"
											@keyup.enter.right.left.up.down="handleCommonEnter($event, index, 'borrower-input-keyup', item)"
											@focus="handleFocusMoney(item, 'debitAmount', 'inputBorrowMoney')"
											v-model="item.debitAmount"
											autofocus
										/>
									</td>
									<!-- 贷方 -->
									<td :style="handleTdStyle(index)" tabindex="0" @focus="showInput('credit', item, index)">
										<div
											v-if="!item.showCredit"
											class="credit-money"
											:class="{ plusOrMinus: item.isMinus }"
											style="text-align: right;"
											tabindex="1"
											:style="handleTdStyle(index)"
											@click="showInput('credit', item, index)">
											<div class="content-value" v-if="item.creditAmountMoenyData && item.creditAmountMoenyData.length > 0">
												<span
													:class="index === 2 || index === 5 ? 'content-value-blue' : index === 8 ? 'content-value-red' : ''"
													v-for="(creditAmountNum, index) in item.creditAmountMoenyData" :key="index">
													{{item.creditAmountMoenyData[index] || ''}}
												</span>
											</div>
											<div class="content-value" v-else>
												<span
													:class="numIndex === 2 || numIndex === 5 ? 'content-value-blue' : numIndex === 8 ? 'content-value-red' : ''"
													v-for="(numItem, numIndex) in 11" :key="numIndex">
												</span>
											</div>
										</div>
										<input
											v-else
											class="inputMoney lender-input-keyup"
											ref="inputCreditMoney"
											type="text"
											:style="handleLoanStyle(index)"
											@blur="handleBlurMoney('credit', item)"
											@input="handleInputMoney($event, 'credit', item)"
											@focus="handleFocusMoney(item, 'creditAmount', 'inputCreditMoney')"
											@keyup="handleCommonEnter($event, index, 'lender-input-keyup', item)"
											v-model="item.creditAmount"
											autofocus
										/>
									</td>
								</tr>
                <tr style="font-size: 16px;">
                  <td :colspan="colspan" style="background:#FFF7D9;padding-left:10px;">{{ capitalSum }}</td>
                  <td class="quantity" v-if="showCount" style="background:#FFF7D9;"></td>
                  <td class="currency" v-if="showCurrency" style="background:#FFF7D9;"></td>
                  <td class="borrow-money" style="text-align: right;background-color:#FFF7D9;" :class="{ isDebitMinus: voucherInfo.isDebitMinus }">
										<div class="content-value" v-if="lenderAccountMoenyData && lenderAccountMoenyData.length > 0">
											<span
												:class="lendeIndex === 2 || lendeIndex === 5 ? 'content-value-blue' : lendeIndex === 8 ? 'content-value-red' : ''"
												v-for="(lendeItem, lendeIndex) in lenderAccountMoenyData" :key="lendeIndex">
												{{lenderAccountMoenyData[lendeIndex] || ''}}
											</span>
										</div>
										<div class="content-value" v-else>
											<span
												:class="numIndex === 2 || numIndex === 5 ? 'content-value-blue' : numIndex === 8 ? 'content-value-red' : ''"
												v-for="(numItem, numIndex) in 11" :key="numIndex">
											</span>
										</div>
                  </td>
                  <td class="borrow-money" style="text-align: right;background-color:#FFF7D9;" :class="{ isLenderMinus: voucherInfo.isLenderMinus }">
										<div class="content-value" v-if="debitAccountMoenyData && debitAccountMoenyData.length > 0">
											<span
												:class="debitIndex === 2 || debitIndex === 5 ? 'content-value-blue' : debitIndex === 8 ? 'content-value-red' : ''"
												v-for="(debitItem, debitIndex) in debitAccountMoenyData" :key="debitIndex">
												{{debitAccountMoenyData[debitIndex] || ''}}
											</span>
										</div>
										<div class="content-value" v-else>
											<span
												:class="numIndex === 2 || numIndex === 5 ? 'content-value-blue' : numIndex === 8 ? 'content-value-red' : ''"
												v-for="(numItem, numIndex) in 11" :key="numIndex">
											</span>
										</div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- 任务核算项 -->
          <!-- <table class="relation-card-table">
						<tbody>
							<tr
								v-for="(item, index) in voucherInfo.relationCard"
								:key="index"
								@mouseenter="showTaskOperate(index)"
								@mouseleave="hideTaskOperate(index)">
									<td class="relation-card" :style="index === taskIndex ? 'background:#F5F7FA;' : ''">
										<div class="relation-card-icon">
											<div class="icon-add" v-show="taskIndex === index" @click="addTask(index)">+</div>
											<div class="icon-minus icon-add" v-show="taskIndex === index" @click="minusTask(index)">-</div>
										</div>
										<span v-show="taskIndex !== index">{{ index + 1 }}</span>
									</td>
									<td style="width: calc(100% - 80px)" :style="index === taskIndex ? 'background:#F5F7FA;' : ''">
										<span class="dot" style="display:inline-block;width: 30%"  @click="showTask(item)" :style="{color: item.title ? '#000' :'#C0C4CC'}">
										<span style="color: #000">任务核算项：</span>
										{{ item.title ? item.title : '请选择任务核算项' }}
										</span>
										<span>
										<span> 金额：</span>
										<el-input style="width: 297px" class="resetBorder" v-model="item.account" :readonly="!isClick" placeholder="请输入金额"></el-input>
										</span>
									</td>
								</tr>
						</tbody>
					</table> -->
          <!-- 审核模版 -->
          <div class="addVoucher-content-bottom" style="margin-top: 14px">
            <el-row>
              <el-col :span="6">制单人：{{ voucherInfo.cardUserName }}</el-col>
              <!--<el-col :span="4">出纳人：</el-col>-->
              <el-col :span="6">审核人：{{ voucherInfo.examineName }}</el-col>
              <!-- <el-col :span="4">
								<el-select class="readonlySelect_special" :disabled="!isClick" v-model="temp" placeholder="模板" size="mini" style="width: 100px" @visible-change="tempVisibleChange">
									<el-option label="存为模板" :value="0"> </el-option>
									<el-option label="使用模板" :value="1"> </el-option>
								</el-select>
							</el-col> -->
              <el-col :span="12" v-if="isEditVoucher" style="display: flex;justify-content: flex-end;">
                <el-button size="small" type="primary" v-if="isClick" @click="pickData">保存</el-button>
              </el-col>
              <el-col :span="12" style="display: flex;justify-content: flex-end;" v-else>
                <!-- <el-button v-if="voucherInfo.approveStatus === 'DSH' && execute" size="small" @click="operationApprove('WT')">转交</el-button>
								<el-button v-if="voucherInfo.approveStatus === 'DSH' && execute" type="primary" size="small" @click="operationApprove('YSH')">审核</el-button>
								<el-button v-if="voucherInfo.approveStatus === 'DSH' && execute" type="primary" size="small" @click="operationApprove('FQ')">驳回</el-button>
								<el-button size="small" type="primary" v-if="isClick" @click="save('SH')">提交审核</el-button> -->
                <el-button size="small" type="primary" v-if="isClick" @click="save('ZC')">保存</el-button>
                <el-button size="small" type="primary" v-if="isClick" @click="save('BC')">保存并新增</el-button>
                <el-button v-if="voucherInfo.approveStatus === 'YSH'" size="small" type="primary" @click="hasDeApprove = true">反审核</el-button>
                <Workflow
                  v-if="isWorkflow"
                  ref="workflow"
                  :eventAuto="false"
                  :workflowId="workflowId"
                  :autoLaunch="true"
                  :autoExecute="true"
                  :launchParams="initParams"
                  :executeParams="executeParams"
                  @haveToDoFn="haveToDoFn"
                  @wtSuccess="wtSuccess"
                  @launchFn="tiJiaoShenHe"
                  @executeFn="jieDianShenHe"
                  @launchSuccess="successWorkflow"
                  @executeSuccess="successExecute">
                </Workflow>
              </el-col>
            </el-row>
          </div>
        </div>
        <div style="height:10px; background:#eff2f5;"></div>
        <!-- 任务核算项 -->
        <div style="background:#fff;" v-if="showAddTask || (voucherInfo && voucherInfo.relationCard && voucherInfo.relationCard.length > 0)">
          <common-task
            v-model="voucherInfo.relationCard"
            :valueItem="relationCardItem"
            :read-only="!isClick"
            :showSelect="false"
            :showOperation="false"
            :showTotalMoney="false"
            :showAddData="false"
            :store-module="'financepc'"/>
        </div>
        <!-- 任务 -->
        <Select-task
          :visible="financialRenwuShow"
          @close="financialRenwuShow=false"
          @confirm="getDialogData"
        >
        </Select-task>
        <!--是否保存金额（存为模板）-->
        <el-dialog title="新增模板" :visible.sync="dialogVisible" width="20%" :before-close="handleClose">
          <el-form>
            <el-form-item label="模板名称">
              <el-input v-model="voucherInfo.name" style="width: 150px" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="保存金额">
              <el-checkbox v-model="form.save"></el-checkbox>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
						<el-button @click="dialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="saveTmep">确 定</el-button>
					</span>
        </el-dialog>
        <!--模板管理-->
        <template-manage
          :subjectList="subjectList"
          :systemSettingData="systemSettingData"
          :currencyList="currencyList"
          :measureList="measureList"
          :visibleManage="visibleManage"
          :abstractList="abstractList"
          @cancel="visibleManage = false"
          @confirm="confirm"
        >
        </template-manage>
        <!--打印模板-->
        <print-template-voucher
					:measureList="measureList"
          :abstractList="abstractList"
          :printData="voucherInfo"
          :list="contentList"
					:titleList="titleList"
          :voucherNumberList="voucherNumberList"
        >
        </print-template-voucher>
        <!-- 科目组件 -->
        <subject-picker
          :showPicker="showSubjectCom"
          @picked="onPicked"
          @abort="showSubjectCom=false">
        </subject-picker>
        <creat-subject
          ref="creatSubjectRef"
          @successInit="seletByCode(radio1)">
        </creat-subject>
        <!-- 反审核组件 -->
        <de-approve
          :reverseFlag.sync="hasDeApprove"
          @cancel="hasDeApprove = false"
          @pick="reverseAudit">
        </de-approve>
        <!-- 摘要组件 -->
        <abstract-com
          :showAbstract="showAbstractCom"
          :selectAbstract="selectAbstract"
          @pick="handleAbstract"
          @handleDeleteAbstractCom="handleDeleteAbstractCom"
          @canlal="showAbstractCom = false">
        </abstract-com>
        <!-- 只选部门不选人 -->
        <select-department
          id="add-voucher-select-department"
          :multiple="true"
          :visible.sync="showPersonPicker"
          :dept="initialSelectedDept"
          @cancel="showPersonPicker = false"
          @onConfirm="handlerDepartment">
        </select-department>
        <el-dialog title="附件资料" :visible.sync="dialoguploadVisible" width="960px">
          <common-upload :annexList="voucherInfo.attacheds" :readOnly="!isClick" @AddannexList="AddannexList" @deleteAnnex="deleteAnnex"> </common-upload>
        </el-dialog>
        <!--供应商组件-->
        <supplier
          :supplierVisible="supplierVisible"
          :supplierName='searchData.supplierName'
          @cancel="supplierVisible=false"
          @confirm="confirmSupplier">
        </supplier>
        <!--客户组件-->
        <customer
          :customerVisible="customerVisible"
          @cancel="customerVisible=false"
          @confirm="confirmCustomer">
        </customer>
        <!--选择物品-->
        <common-goodsList
          ref="goodsListRef"
          @confirm="handlerMateriel"
          :Single="true"
          :filterIds="filterIds">
        </common-goodsList>
        <!-- ---选人组件 -->
        <deptMember
          :multiple="multiple"
          :visible.sync="showDeptMemberVisible"
          :showDept="showDept"
          :members="formData"
          @cancel="showDeptMemberVisible = false"
          @onConfirm="handleDeptMemberonConfirm">
        </deptMember>
        <!-- 选择仓库 -->
        <warehouse-manage
          ref="warehouseRef"
          @close="validateWarehouse"
          @confirm="handlerWarehouse">
        </warehouse-manage>
      </div>
    </CardLayout>
  </div>
</template>

<script>
	import templateManage from '../template/templateManage'
	import printTemplateVoucher from '../template/printTemplateVoucher'
	import { deepCopy, isEmtVal } from '@/utils/fn'
	import { parseDateStr } from '@/utils/date'
	import merge from '@/utils/mergeHttp'
	import SelectTask from '@/components/business/task/pc/SelectTask.vue'
	import { mapGetters } from 'vuex'
	import {
		contentItem,
		addData,
		handlerData,
		dealData,
		dealTempData,
		initVoucher,
		voucherNumCheck,
		digitUppercase,
		priceConversion,
		priceFill,
		handlerTmepData,
		printTemplateByDomId,
		handleSubjectTopTip,
		handleStringToArray
	} from '@/pages/Finance/Pc/Services/utils/commonJs'
	import { getMyDateStage } from '@/pages/Finance/Pc/Services/utils/commonJs.js'
	import SubjectPicker from '@/components/business/subjectpicker/SubjectPickerPc.vue'
	import creatSubject from '@/pages/Finance/App/Pages/children/creatSubject.vue'
	import Workflow from '@/components/business/approval/pc/launch-execute'
	import deApprove from '@/pages/Finance/Pc/Pages/loanReimbursement/components/reverseAudit.vue'
	import abstractCom from '../template/abstract-com'
	import {Z_IsEmpty20 as zIsempty20} from '@/utils/fn'
	import selectDepartment from '@/components/business/member-select-pc/selectDepartment'
	import commonUpload from '@/pages/GoodsLibrary/Pc/Pages/goodsLibrary/inventoryControl/otherInOrOutOrderList/commonComponent/uploadFile.vue'
	import supplier from '@/components/business/supplierPopup/supplier'
	import customer from '@/components/business/customerPopup/customer'
	import commonGoodsList from '@/components/business/commonGoodsListPC/common-goodsList.vue'
	import deptMember from '@/components/business/member-select-pc/deptMember'
	import warehouseManage from '@/components/business/warehouseManagePC/warehouse-manage.vue'
	import CardLayout from '@/components/business/card-layout/index'
	import CommonTask from '@/components/business/task/pc/taskAccounting/index.vue'


	export default {
		name: 'add-voucher',
		components: {
			templateManage,
			printTemplateVoucher,
			SelectTask,
			SubjectPicker,
			creatSubject,
			Workflow,
			deApprove,
			abstractCom,
			selectDepartment,
			commonUpload,
			supplier,
			customer,
			commonGoodsList,
			deptMember,
			warehouseManage,
			CardLayout,
			CommonTask
		},
		inject:['reload'],
		data() {
			return {
				lenderAccountMoenyData: [], // 贷方展示的数组
				debitAccountMoenyData: [], //借方展示的数组
				isLiClickSubject: false, // 因为li的mousedown事件执行完后,还会执行focus事件,不会关闭options,添加一个标识
				isLiClickAbstract: false,
				divWidth: 0,
				bookkeepingTimePeriod: '',
				initialSelectedDept: [],
				filterIds: [],
				loading:false,
				SHID:'',
				isWorkflow: true,
				workflowId: '',
				colspan: 2,
				colspan4: 4,
				voucherNumberList: [], // 凭证字
				voucherNumberItem: [],
				subjectList: [], // 科目设置
				copySubjectList: [], // 科目设置
				subjectAllList: [], //所有科目设置
				subject: [],
				abstractList: [], // 摘要设置
				copyAbstractList: [], // 科目设置
				abstractAllList: [], //所有科目设置
				abstract: [],
				currencyList: [], // 币别数据
				measureList: [], // 计量组单位数据
				subjectSingle: {}, // 科目数据
				systemSettingData: {}, // 系统参数配置
				titleList: [
					// {
					// 	key: 'operate',
					// 	value: ''
					// },
					// {
					// 	key: 'number',
					// 	value: ''
					// },
					{
						key: 'abstract',
						value: '摘要'
					},
					{
						key: 'subject',
						value: '会计科目'
					},
					{
						key: 'borrower',
						value: '借方',
						label: ['亿', '千', '百', '十', '万', '千', '百', '十', '元', '角', '分']
					},
					{
						key: 'lender',
						value: '贷方',
						label: ['亿', '千', '百', '十', '万', '千', '百', '十', '元', '角', '分']
					}
				], // table  头部
				pickeroptions:{},
				voucherInfo: {
					attacheds: [],
					name: '', // 模板名称
					companyId: '',
					debitCount: 0,
					lenderCount: 0,
					isDebitMinus: false,
					isLenderMinus: false,
					code: '',
					cardUrl:'',
					cardUserName: '',
					approveStatus: 'WTJ',
					voucherType: 'PZ',
					voucherWord: '', // 凭证字
					bookkeepingTime: '', // 时间
					debitAccount: '0.00', // 借方金额
					lenderAccount: '0.00', // 贷方金额
					relationCard: [],
					number: '' // 字号
				},
				relationCardItem: { //任务核算项
					title: '',
					account: '',
					status: '',
					responsibleCardUrl: '',
					participantsCardUrl: ''
				},
				contentList: [], // table  内容
				item: null,
				type: '',
				indexFlag: -1,
				taskIndex:'',
				taskItem:{},
				showCount: false, // 判断是否先数量 币别
				showCurrency: false,
				visible: false,
				financialRenwuShow: false, // 任务数据
				isdisabledPre: true,
				isdisabledNext: false,
				temp: '', // 模板
				dialogVisible: false,
				form: {
					save: ''
				},
				visibleManage: false, //使用模板
				showLaunchWorkflow:false, // 审批流标识
				initParams:{
					wfType: 'MODULE_TYPE_ZYK',
					mType:'PZ',
					url:'/zingbiz/financial/voucher/startWorkflow',
					useDefaultJump:false,
					bookkeepingTimePeriod: ''
				}, // 跳转审批流
				execute:false, // 是否为可执行节点
				showSubjectCom: false,
				subjectIndexFlag: '',
				executeParams: {},
				hasDeApprove: false,
				showAbstractCom: false,
				selectAbstract: {},
				showSubjectName: false,
				showAbstractName: false,
				accountingProjectArray: [],
				rules: {
					customer: [
						{ required: true, message: '请选择客户名称', trigger: 'change' }
					],
					supplier: [
						{ required: true, message: '请选择供应商名称', trigger: 'change' }
					],
					warehouse: [
						{ required: true, message: '请选择仓库', trigger: 'change' }
					],
					materiel: [
						{ required: true, message: '请选择物料', trigger: 'change' }
					],
					department: [
						{ required: true, message: '请选择部门', trigger: 'change' }
					],
					staffMember: [
						{ required: true, message: '请选择职员', trigger: 'change' }
					]
				},
				showPersonPicker: false, //部门
				supplierVisible: false, // 供应商
				customerVisible: false, // 客户
				searchData: {
					supplierMainName: ''
				},
				dialoguploadVisible: false,
				showDeptMemberVisible: false, //职员 = 选人
				multiple: true, // 选人组件需要参数
				showDept: true, // 选人组件需要参数
				formData: [], // 选人组件需要参数
				nextFn: '', //判断当前页面是否有路由跳转
				supplierListobj: {},
				isComeBack: false,
				isEditVoucher: false,
				otherVoucher: false,
				showNumberIndex: false, //数量聚焦
				showUnitPriceIndex: false, //单价聚焦
				showCurrencytIndex: false, //币别
				showOriginalCurrencyIndex: false, //原币金额
				showLoanIndex: false, //贷方聚焦
				showBorrowIndex: false, //借方聚焦
				showAddTask: false, //显示任务核算项
				subjectMouseEnterIndex: 0, // 鼠标移入科目每行的下标
				abstracttMouseEnterIndex: 0 // 鼠标移入摘要每行的下标
			}
		},
		beforeRouteLeave (to, from, next) {
			if (from.name === 'addVoucher' && this.voucherInfo.approveStatus !== 'DSH' && this.voucherInfo.approveStatus !== 'YSH') {
				next(false)
				this.nextFn = ''
				this.nextFn = next
				this.handleLeaveTip()
				return
			}
			next()
		},
		computed: {
			// 借方金额
			debitAccount() {
				let sum = 0
				if (
					this.contentList.filter(val => {
						return val.showDebit
					}).length === 0
				) {
					let debit = this.contentList.filter(val => {
						return val.debitAmount
					})

					if (debit.length !== 0) {
						debit.forEach(item => {
							if (!zIsempty20(item.isMinus)) {
								sum -= parseFloat(this.priceConversion(item.debitAmount, item))
							} else {
								sum += parseFloat(this.priceConversion(item.debitAmount, item))
							}
							// sum += parseFloat(this.priceConversion(item.debitAmount, item))
						})
					}
				}
				if (sum < 0) {
					sum = Number(sum.toString().substring(1))
				}

				if (
					this.contentList.filter(val => {
						return val.debitAmount !== ''
					}).length !== 0
					&& sum === 0
				) {
					return '000'
				}
				if (sum === 0) {
					return ''
				}
				return priceFill(sum)
			},
			// 贷方金额
			lenderAccount() {
				let sum = 0

				if (
					this.contentList.filter(val => {
						return val.showCredit
					}).length === 0
				) {
					let credit = this.contentList.filter(val => {
						return val.creditAmount
					})

					if (credit.length !== 0) {
						credit.forEach(item => {
							if (!zIsempty20(item.isMinus)) {
								sum -= parseFloat(this.priceConversion(item.creditAmount, item))
							} else {
								sum += parseFloat(this.priceConversion(item.creditAmount, item))
							}
							// sum += parseFloat(this.priceConversion(item.creditAmount, item))
						})
					}
				}
				if (sum < 0) {
					sum = Number(sum.toString().substring(1))
				}
				if (
					this.contentList.filter(val => {
						return val.creditAmount !== ''
					}).length !== 0
					&& sum === 0
				) {
					return '000'
				}
				if (sum === 0) {
					return ''
				}
				return priceFill(sum)
			},
			// 判断是否为已审核或者未审核数据
			isClick() {
				if (this.readOnly) {
					return false
				}
				if ((this.voucherInfo.approveStatus === 'DSH' || this.voucherInfo.approveStatus === 'YSH')
					|| ((this.voucherInfo && this.defaultServer && this.voucherInfo.cardUrl && this.defaultServer.cardUrl && (this.voucherInfo.cardUrl !== this.defaultServer.cardUrl)) && !this.zingPerm('financialManageAdminPower'))
				) {
					return false
				}
				return true
			},
			...mapGetters(['defaultServer']),
			// 大小写
			capitalSum() {
				if (this.lenderAccount === this.debitAccount && this.lenderAccount !== '' && this.lenderAccount !== 0) {
					let cap = priceConversion(this.lenderAccount)

					if (this.voucherInfo.isLenderMinus) {
						return '负' + digitUppercase(cap)
					}
					return digitUppercase(cap)
				}
				return ''
			},
			isCommonTask() {
				if (this.systemSettingData.isVoucherNeedRelationCard === 'false') {
					return false
				}
				return true
			},
			// 回车按下所需要的类名
			enterClassNameArr() {
				if (this.titleList && this.titleList.length > 0) {
					const data = this.titleList.map(item => item.key)
					return this.handleEnterClassName(data)
				}
				return []
			}
		},
		watch: {
			lenderAccount: {
				handler(val) {
					let sum = 0

					if (
						this.contentList.filter(ele => {
							return ele.showCredit
						}).length === 0
					) {
						let credit = this.contentList.filter(ele => {
							return ele.creditAmount
						})

						if (credit.length !== 0) {
							credit.forEach(item => {
								sum += parseFloat(this.priceConversion(item.creditAmount, item))
							})
						}
					}
					this.voucherInfo.isLenderMinus = false
					if (sum < 0) {
						this.voucherInfo.isLenderMinus = true
					}
					this.debitAccountMoenyData = handleStringToArray(val)
					this.voucherInfo.lenderAccount = val
				},
				deep: true
			},
			debitAccount: {
				handler(val) {
					let sum = 0

					if (
						this.contentList.filter(ele => {
							return ele.showDebit
						}).length === 0
					) {
						let debit = this.contentList.filter(ele => {
							return ele.debitAmount
						})

						if (debit.length !== 0) {
							debit.forEach(item => {
								sum += parseFloat(this.priceConversion(item.debitAmount, item))
							})
						}
					}
					this.voucherInfo.isDebitMinus = false
					if (sum < 0) {
						this.voucherInfo.isDebitMinus = true
					}
					this.lenderAccountMoenyData = handleStringToArray(val)
					this.voucherInfo.debitAccount = val
				},
				deep: true
			},
			'voucherInfo.bookkeepingTime': {
				handler(val) {
					this.bookkeepingTimePeriod = getMyDateStage(val)
				}
			}
		},
		async created() {
			await this.searchMeasureUnit().then(res4 => {
				this.measureList = res4
				if (!this.$route.query.rowId) {
					this.loadVoucherInit()
				}
			})
			this.subjectSelect()
			this.selectAccountingProject()
			const { voucherFullData, readOnly, isEditVoucher } = this.$route.params
			if (isEditVoucher) {
				this.voucherFullData = voucherFullData
				this.isEditVoucher = isEditVoucher
				// 智能凭证页面点击编辑
				// if (status === 'YSC') {
				// 	readOnly === true
				// }
				this.readOnly = readOnly
				await this.init()
				this.isComeBack = true
				return
			}
			this.voucherInfo.companyId = this.$route.query.companyId
			this.initParams.companyId = this.$route.query.companyId;
			if (!this.$route.query.rowId) {
				this.isComeBack = true
				initVoucher(this)
			}else {
				await this.voucherInfoById(this.$route.query.rowId)
				this.isComeBack = true
				this.isdisabledNext = true
				this.isdisabledPre = true
			}
			this.systemSetting().then(res => {
				this.systemSettingData = res
				if (res === null || JSON.stringify(res) === '{}' || res == 'null') {
					this.$router.push({
						path:'/finance/initParams',
						query:{
							companyId:this.$route.query.companyId
						}
					})
					// this.$confirm('未设置会计期间，是否前往设置?', '提示', {
					//   confirmButtonText: '确定',
					//   cancelButtonText: '取消',
					//   type: 'warning'
					// }).then(() => {
					//   this.$router.push({
					//     path:'/finance/initParams',
					//     query:{
					//       companyId:this.$route.query.companyId
					//     }
					//   })
					// })
				} else {
					// 判断当前月是否在当前会计期间
					let time = parseDateStr(new Date()).split('-')[0] + '-' + parseDateStr(new Date()).split('-')[1]
					this.pickeroptions.disabledDate = (T) => {
						return T.getTime() < new Date(new Date(this.systemSettingData.currentAccountingPeriod).setHours(0, 0, 0, 0)).getTime()
					}
					if (res.currentAccountingPeriod && time !== res.currentAccountingPeriod) {
						this.voucherInfo.bookkeepingTime = res.currentAccountingPeriod.split('-')[0] + '-' + res.currentAccountingPeriod.split('-')[1] + '-' + new Date(res.currentAccountingPeriod.split('-')[0],res.currentAccountingPeriod.split('-')[1],0).getDate()
					} else {
						this.voucherInfo.bookkeepingTime = parseDateStr(new Date())
					}
				}
				this.voucherSetting().then(res1 => {
					this.voucherNumberList = res1
					if (this.voucherNumberList.length !== 0) {
						if (this.voucherNumberList.filter(val => {
							return val.isDefault === 'true'
						}).length !== 0 ) {
							this.voucherInfo.voucherWord = this.voucherNumberList.filter(val => {
								return val.isDefault === 'true'
							})[0].id
						}
						// else {
						//   this.voucherInfo.voucherWord = this.voucherNumberList[0].id
						// }
					}
					this.currency().then(res2 => {
						this.currencyList = res2
						this.abstractSelect().then(res3 => {
							this.abstractList = res3.filter((item,index) => item.state === 'true' && +index <= 19)
							this.copyAbstractList = this.abstractList
							this.abstractAllList = res3.filter( item =>item.state === 'true')
						})
					})
				})
			})
		},
		methods: {
			handleUpload() {
				if (!this.isClick) {
					return
				}
				// if (!this.voucherInfo.attacheds) {
				// 	this.voucherInfo.attacheds = []
				// }
				this.dialoguploadVisible = true
			},
			init() {
				if (this.otherVoucher) {
					this.title = '其他凭证'
				} else {
					this.title = '记账凭证'
				}
				this.showCount = false
				this.showCurrency = false
				this.titleList = [
					{
						key: 'abstract',
						value: '摘要'
					},
					{
						key: 'subject',
						value: '会计科目'
					},
					{
						key: 'borrower',
						value: '借方',
						label: ['亿', '千', '百', '十', '万', '千', '百', '十', '元', '角', '分']
					},
					{
						key: 'lender',
						value: '贷方',
						label: ['亿', '千', '百', '十', '万', '千', '百', '十', '元', '角', '分']
					}
				]
				this.voucherFullDataCopy = deepCopy(this.voucherFullData)
				dealData(this.voucherFullDataCopy, this,true)
				if (!this.voucherInfo.attacheds) {
					this.$set(this.voucherInfo, 'attacheds', [])
				}
				if ((this.voucherInfo && this.voucherInfo.relationCard.length === 0) || this.voucherInfo.relationCard === undefined) {
					this.$set(this.voucherInfo, 'relationCard', [])
				}
				this.systemSetting().then(res => {
					this.systemSettingData = res
					this.currency().then(res2 => {
						this.currencyList = res2
						this.searchMeasureUnit().then(res3 => {
							// this.measureList = res3
							this.abstractSelect().then(res4 => {
								// 摘要的数据
								this.abstractList = res4.filter(val => {
									return val.state === 'true'
								})
								this.voucherSetting().then(res5 => {
									// console.log('凭证字号res5----->', res5)
									this.voucherNumberList = res5
									if (this.voucherNumberList.length !== 0) {
										if (this.voucherNumberList.filter(ele => { return ele.isDefault === 'true' }).length !== 0 ) {
											this.voucherInfo.voucherWord = this.voucherNumberList.filter(value => {
												return value.isDefault === 'true'
											})[0].id
										}
									}
								})
							})
						})
					})
				})
			},
			getMyDateStage,
			zIsempty20,
			// 控制审批审核按钮的显示
			disabledBtn(obj){
				if(obj.SH){
					this.execute = true
				} else {
					this.execute = false
				}
				if (this.SHID) {
					if (this.execute) {
						this.$router.replace({
							path: 'addVoucher',
							query: {
								companyId: this.$route.query.companyId,
								rowId: this.SHID
							}
						})
					} else {
						this.$router.push({
							path: 'voucherManage',
							query: {
								companyId: this.$route.query.companyId
							}
						})
					}
				}
			},
			/**
			* @description: 摘要option详情，回车触发，鼠标移动在哪个科目，就回显哪个
			* @param {Object} elm 每行详情
			*/
			handleAbstractKeyupEnter(elm, index, $event, key) {
				if (elm.isAbstractOptions && this.abstractList && this.abstractList.length > 0) {
					this.handleChangeAbstract(this.abstractList[this.abstracttMouseEnterIndex].summaryContent)
				} else {
					elm.showAbstractInput = false
					elm.isAbstractOptions = false
				}
				this.handleCommonEnter($event, index, key, elm)
			},
			/**
			* @description: 摘要失焦
			* @param {Object} elm
			*/
			handleAbstractBlur(elm) {
				this.item = elm
				elm.showAbstractInput = false
				elm.isAbstractOptions = false
			},
			/**
			* @description: 监听摘要的input框，option中的数据实时改变
			* @param {string} query 输入框中的内容
			* @param {Object} elm 每行的数据
			*/
			handleAbstractInput(query, elm) {
				this.abstractList = this.abstractAllList.filter(item => {
					if (item.summaryContent.indexOf(query) !== -1) {
						return item
					}
				}).splice(0, 19)
				if (this.abstractList && this.abstractList.length > 0) {
					this.$set(elm, 'isAbstractOptions', true)
				} else {
					this.$set(elm, 'isAbstractOptions', false)
				}
			},
			/**
			* @description:  点击摘要
			* @param {Object} item 每行详情
			* @param {number} index 每行科目的下标
			*/
			handleAbstractClick(item, index) {
				this.handleHidePopover()
				if (!this.isClick || this.isLiClickAbstract) {
					this.isLiClickAbstract = false
					return
				}
				this.item = item
				this.abstracttMouseEnterIndex = 0
				this.$set(item, 'showAbstractInput', true)
				if (this.abstractList && this.abstractList.length > 0) {
					this.$set(item, 'isAbstractOptions', true)
				} else {
					this.$set(item, 'isAbstractOptions', false)
				}
				this.handleAbstractChange(item, index)
				this.$nextTick(() => {
					if (item.summary) {
						this.handleAbstractInput(item.summary, item)
					} else {
						this.abstractList = this.copyAbstractList
					}
					// 数据改变之后聚焦，数据改变放在操作虚拟dom之前，否则聚焦失败
					this.$refs.abstractInput[index].focus()
					this.$refs.abstractInput[index].select()
				})
			},
			/**
			* @description: 选择摘要
			* @param {string} 选择摘要的名称
			*/
			handleChangeAbstract(summary, flag) {
				if (flag) {
					this.isLiClickAbstract = true
				}
				let arr = this.abstractList.filter(val => {
					return val.summaryContent === summary
				})
				this.item.showCount = false
				this.item.showCurrency = false
				// this.item.price = ''
				// this.item.count = ''
				// this.item.currencyCode = ''
				// this.item.currencyName = ''
				// this.item.rate = ''
				// this.item.convertWay = ''
				// this.item.originalAccount = ''
				this.item.fullData = ''
				this.item.accountingProject = ''
				this.item.showAbstractInput = false
				this.item.isAbstractOptions = false
				// this.item.unitGroup = ''
				// this.item.unit = ''
				if (arr.length !== 0) {
					this.item.subjectCode = ''
					this.item.subjectName = ''
					this.item.summary = arr[0].summaryContent
					this.item.summaryId = arr[0].rowId
					if (!zIsempty20(arr[0].subjectCode)) {
						this.item.subjectCode = arr[0].subjectCode
						this.handleChangeSubject(arr[0].subjectCode)
					}
				}
			},
			/**
			* @description: 摘要中当上一行选择数据后，点击下一行自动获取上一行的数据
			* @param {Object} item 每行的详情
			* @param {number} index 点击某个摘要的行数
    	*/
			handleAbstractChange(item,index) {
				if (item.summary === '') {
					let zIndex = 0
					if (index !== 0) {
						zIndex = index - 1
					}
					const ele = this.contentList[zIndex]
					if (ele.summary !== '' && ele.summary !== undefined) {
						const summary = this.contentList[zIndex].summary || ''
						const summaryId = this.contentList[zIndex].summaryId || ''
						this.$set(item, 'summary', summary)
						this.$set(item, 'summaryId', summaryId)
					}
				}
			},
			// 计量单位
			searchMeasureUnit() {
				return new Promise((resolve, reject) => {
					let url = '/zingbiz/goodsStorehouse/dictionaryStoreRest/getDictionaryList'

					this.$http
						.post(url, { type: 'unit' })
						.then(res => {
							if (res.data.success) {
								if (res.data.data && res.data.data.length > 0) {
									const resData = res.data.data.filter( item => item.baseUnitStatus === 'true')
									resolve(resData)
								}
								// this.measureList = res.data.data
							} else {
								this.$message({ type: 'error', message: res.data.msg })
							}
						})
						.catch(error => {
							reject(error)
						})
				})
			},
			// 系统参数
			systemSetting() {
				return new Promise((resolve, reject) => {
					let url = '/zingbiz/financial/systemSetting/select'

					this.$http.get(url, {}).then(res => {
						if (res.data.success) {
							resolve(res.data.data)
						}
					})
				})
			},
			// 凭证字
			voucherSetting() {
				return new Promise((resolve, reject) => {
					let url = '/zingbiz/financial/voucherSetting/select'
					this.$http
						.get(url, {
							params:{
								status: 'false',
								pageNumber:1,
								pageSize:300
							}
						})
						.then(res => {
							if (res.data.success) {
								resolve(res.data.data)
								// this.voucherNumberList = res.data.data
								// this.voucherInfo.voucherWord = this.voucherNumberList[0].id
							} else {
								this.$message({ type: 'error', message: res.data.msg })
							}
						})
						.catch(error => {
							reject(error)
						})
				})
			},
			//币别
			currency() {
				return new Promise((resolve, reject) => {
					let url = '/zingbiz/financial/currency/select'

					this.$http
						.get(url, {
							isDisable: 'false'
						})
						.then(res => {
							if (res.data.success) {
								resolve(res.data.data)
								// this.currencyList = res.data.data
							} else {
								this.$message({ type: 'error', message: res.data.msg })
							}
						})
						.catch(error => {
							reject(error)
						})
				})
			},
			// 查询信息
			voucherInfoById(rowId) {
				let url = '/zingbiz/financial/voucher/selectVoucherInfoById'
				this.$http
					.get(url, {
						params: {
							rowId: rowId
						}
					})
					.then(res => {
						if (res.data.success) {
							const resData = res.data.data
							dealData(resData, this)
							if (resData.voucherType !== 'PZ') {
								this.isWorkflow = false
							} else if (resData.approveStatus === 'WTJ' || zIsempty20(resData.approveStatus) || zIsempty20(resData.workId)) {
								this.workflowId = ''
							} else {
								this.workflowId = resData.workId
							}
						} else {
							this.$vux.toast.text('加载失败，请重试')
						}
					})
					.catch(error => {
						console.log(error)
					})
			},
			// 凭证初始化
			loadVoucherInit() {
				let url = '/zingbiz/financial/voucher/getVoucherInit'

				this.$http.get(url, {}).then(res => {
					if (res.data.success) {
						this.voucherInfo.code = res.data.data.code
						this.voucherInfo.cardUrl = res.data.data.cardUrl
						this.voucherInfo.cardUserName = res.data.data.cardUserName
					} else {
						this.$vux.toast.text('加载失败，请重试')
					}
				})
			},
			// 请求摘要配置
			abstractSelect() {
				return new Promise((resolve, reject) => {
					let url = '/zingbiz/financial/commonAbstracts/list'

					this.$http
						.get(url, {
							params: {
								pageSize: 999,
								pageNumber: 1
							}
						})
						.then(res => {
							if (res.data.success) {
								resolve(res.data.data)
								// this.abstractList = res.data.data
							} else {
								this.$vux.toast.text(res.data.msg)
							}
						})
						.catch(error => {
							reject(error)
						})
				})
			},
			// 请求科目数据
			subjectSelect() {
				let url = '/zingbiz/financial/subject/selectByParams'
				this.$http
					.get(url, {
						params: {
							dataType: 'all',
							isDisable:false
						}
					})
					.then(res => {
						if (res.data.success) {
							const resData = res.data.data.filter(item => item.isDetail !== 'true' && item.isChild === 'false')
							this.subjectList = resData.filter((item,index) => +index <= 19)
							this.copySubjectList = this.subjectList
							this.subjectAllList = resData
						} else {
							this.$message({ type: 'error', message: res.data.msg })
						}
					})
					.catch(error => {
						console.log(error)
					})
			},
			print() {
				this.$nextTick(() => {
					printTemplateByDomId('printTemplateVoucher', true)
				})
			},
			// 上一页
			pre() {
				// if (this.isdisabledPre === false) {
				//   return
				// }
				let url = '/zingbiz/financial/voucher/perVoucher'

				this.$http
					.get(url, {
						params: {
							bookkeepingTime: this.voucherInfo.bookkeepingTime,
							number: +this.voucherInfo.number - 1
						}
					})
					.then(res => {
						if (res.data.success) {
							if (res.data.data) {
								this.isdisabledNext = true
								if (res.data.data) {
									const resData = res.data.data
									this.$router.replace({
										path: 'addVoucher',
										query: {
											companyId: this.$route.query.companyId,
											rowId: resData.rowId
										}
									})
									dealData(resData, this)
									if (resData.voucherType !== 'PZ') {
										this.isWorkflow = false
									} else if (resData.approveStatus === 'WTJ' || zIsempty20(resData.approveStatus)) {
										this.workflowId = ''
									} else {
										this.workflowId = resData.workId
									}
								}
							} else {
								this.isdisabledPre = false
								this.$message({ type: 'error', message: '无上一张凭证' })
							}
						} else {
							this.$message({ type: 'error', message: res.data.msg })
						}
					})
			},
			// 下一页
			next() {
				if (!this.$route.query.rowId) {
					this.$message({ type: 'error', message: '无下一张凭证' })
					return
				}
				let url = '/zingbiz/financial/voucher/nextVoucher'

				this.$http
					.get(url, {
						params: {
							bookkeepingTime: this.voucherInfo.bookkeepingTime,
							number: +this.voucherInfo.number + 1
						}
					})
					.then(res => {
						if (res.data.success) {
							if (res.data.data) {
								const resData = res.data.data
								this.isdisabledPre = true
								this.$router.replace({
									path: 'addVoucher',
									query: {
										companyId: this.$route.query.companyId,
										rowId: resData.rowId
									}
								})
								dealData(resData, this)
								if (resData.voucherType !== 'PZ') {
									this.isWorkflow = false
								} else if (resData.approveStatus === 'WTJ' || zIsempty20(resData.approveStatus)) {
									this.workflowId = ''
								} else {
									this.workflowId = resData.workId
								}
							} else {
								this.isdisabledNext = false
								this.$message({ type: 'error', message: '无下一张凭证' })
							}
						} else {
							this.$message({ type: 'error', message: res.data.msg })
						}
					})
			},
			handleMouseenterSubject(subjectIndex, item) {
				this.subjectMouseEnterIndex = subjectIndex
				this.$set(item, 'isImplementSubjectBlur', true)
			},
			/**
			 * 选择科目
			 * @param {String} code 科目编码
			 * @param {Array} subjectList 科目的集合
			 * @param {Array} contentList 录入数据表格的集合
			 */
			handleChangeSubject(code, flag = false) {
				if (flag) {
					this.isLiClickSubject = true
				}
				const subjectFilterList = this.subjectAllList.filter(val => val.subjectCode === code)
				if (subjectFilterList && subjectFilterList.length === 0) {
					this.item.subjectCode = ''
					this.item.subjectName = ''
					return
				}
				this.handleHidePopover()
				this.item.accountingProject = ''
				this.item.fullData = ''
				this.ruleForm = {
					customer: '',
					customerCode: '',
					showCustomer: false,
					supplier: '',
					supplierCode: '',
					supplierId: '',
					showSupplier: false,
					warehouse: '',
					warehouseCode: '',
					showWarehouse: false,
					materiel: '',
					materielCode: '',
					showMateriel: false,
					department: '',
					showDepartment: false,
					staffMember: '',
					showStaffMember: false
				}
				// 判断科目数据是否有币别和项目核算项
				if (
					this.subjectAllList.filter(val => {
						return val.subjectCode === code
					})[0].isChild === 'true'
				) {
					this.contentList.forEach(val => {
						val.showSubject = false
					})
					this.item.subjectCode = ''
					this.item.subjectName = ''
					this.$message({ type: 'error', message: '存在子集科目，无法选择父集' })
					return
				}
				let subjectArr = this.subjectAllList.filter(val => {
					return val.subjectCode === code
				})
				if (subjectArr[0].currencyBalance) {
					this.item.currencyBalance = subjectArr[0].currencyBalance
				} else {
					this.item.currencyBalance = '0.00'
				}
				if (subjectArr[0].subjectNameFull) {
					this.item.subjectName = subjectArr[0].subjectNameFull
				} else {
					this.item.subjectName = subjectArr[0].subjectName
				}
				this.item.subjectCode = code
				// this.item.fullData = ''
				// this.item.accountingProject = ''
				// this.item.unitGroup = ''
				// this.item.unit = ''
				this.contentList.forEach(val => {
					val.showSubject = false
				})
				// 弹出科目的 el-popover 组件
				if (subjectArr[0].amountAuxiliaryAccounting === 'true' || subjectArr[0].businessAccounting === 'true') {
					// this.visible = true
					// this.subjectSingle = subjectArr[0]
					if (subjectArr[0] && !zIsempty20(subjectArr[0].accountingProject)) {
						let arr = []
						const that = this
						subjectArr[0].accountingProject.split(' ').forEach( (item,index) => {
							arr.push(new Promise(function (resolve, reject) {
									that.handleAccountingProject(item, resolve)
								}
							))
						})
						Promise.all(arr).then((result)=>{
							this.$set(this.item, 'showAccountDetail', true)
						})
					}
				}
				this.handleAmountColumn(subjectArr)
				this.handleCurrenColumn(subjectArr)
			},
			// 处理币别，如果相应的条件满足，则展示币别列
			handleCurrenColumn(subjectArr) {
				// if (this.isEditVoucher && this.item && this.item.currencyCode) {
				// 	return
				// }
				// 科目外币核算 为不核算或者本位币不显示 否则显示 (控制币别一栏)
				if (subjectArr[0].isForeignCurrencyAccounting === 'true' && subjectArr[0].foreignCurrencyAccounting.length !== undefined && subjectArr[0].foreignCurrencyAccounting.length === 0
					|| subjectArr[0].foreignCurrencyAccounting !== null && subjectArr[0].foreignCurrencyAccounting.length > 0 && subjectArr[0].foreignCurrencyAccounting !== '不核算') {
					// 暂时不做currencyId 币别栏的限制
					// && subjectArr[0].foreignCurrencyAccounting !== this.systemSettingData.currencyId
					this.showCurrency = true
					this.item.showCurrency = true
					if (this.titleList[this.titleList.length - 3].key !== 'currency') {
						this.titleList.splice(-2, 0, {
							key: 'currency',
							value: '币别',
							shareLabel: ['币别', '汇率', '原币']
						})
					}
					// 给币别赋值
					if (
						this.currencyList.filter(val => {
							return val.id === subjectArr[0].foreignCurrencyAccounting
						}).length !== 0
					) {
						this.item.currencyCode = this.currencyList.filter(val => {
							return val.id === subjectArr[0].foreignCurrencyAccounting
						})[0].code
						this.changeCurrency()
					}
					return
				}
				if (this.contentList && this.contentList.length > 0) {
					// 清空币别所有数据
					this.item.showCurrency = false
					if (!this.contentList.some(val => val.showCurrency) && this.titleList[this.titleList.length - 3].key === 'currency') {
						this.showCurrency = false
						this.item.currencyCode = ''
						this.item.currencyName = ''
						this.item.rate = ''
						this.item.convertWay = ''
						this.item.originalAccount = ''
						this.titleList.splice(this.titleList.length - 3, 1)
					}
				}
			},
			// 处理数量，如果相应的条件满足，则展示数量列
			handleAmountColumn(subjectArr) {
				// 其他凭证中，某条单据已经生成，并且传了单位，编辑凭证录入，选择的某个科目（并开启了计量单位），那么不替换。
				// if (this.isEditVoucher && this.item && this.item.unit) {
				// 	return
				// }
				if (subjectArr[0].amountAuxiliaryAccounting === 'true') {
					// 科目数量辅助金额判断（控制数量一栏）
					if (this.measureList && this.measureList.length > 0) {
						const nameIndex = this.measureList.findIndex( item => item.rowId === subjectArr[0].measureUnitId)
						if (nameIndex !== -1) {
							this.item.numberName = this.measureList[nameIndex].val
							this.item.unit = subjectArr[0].measureUnitId
						}
						this.showCount = true
						this.item.showCount = true
						if (this.titleList[2].key !== 'amount') {
							this.titleList.splice(2, 0, {
								key: 'amount',
								value: '数量',
								shareLabel: ['数量', '单位', '单价']
							})
						}
					}
					return
				}
				if (this.contentList && this.contentList.length > 0) {
					this.item.showCount = false
					// 1.将数量价格清空 借贷方金额保存
					// 2.如果先选择有计量单位的科目，之后在选取没有计量单位的科目，需要将数量列给隐藏，并删除这列的数据。
					if (!this.contentList.some(val => val.showCount) && this.titleList[2].key === 'amount') {
						this.showCount = false
						this.item.price = ''
						this.item.count = ''
						this.item.unit = ''
						this.titleList.splice(2, 1)
					}
				}
			},
			// 模板下拉框
			tempVisibleChange(flag) {
				if (!flag) {
					if (this.temp === 0) {
						this.dialogVisible = true
					} else if (this.temp === 1) {
						// 使用模板
						this.visibleManage = true
					}
				}
			},
			// 关闭存为模板弹窗
			handleClose() {
				this.dialogVisible = false
			},
			// 存为模板
			saveTmep() {
				if (!this.voucherInfo.name) {
					this.$message({ type: 'error', message: '请输入模板名称' })
					return
				}
				this.voucherInfo.voucherInfoItems = this.contentList
				let param = deepCopy(this.voucherInfo)

				let params = handlerTmepData(param, this.form.save, this,'add')

				if (params) {
					let url = '/zingbiz/financial/voucherInfoTmpRest/save'

					this.$http
						.post(url, params)
						.then(res => {
							if (res.data.success) {
								this.$message({ type: 'success', message: '保存成功' })
							} else {
								this.$message({ type: 'success', message: '保存失败' })
							}
							this.dialogVisible = false
						})
						.catch(error => {
							console.log(error)
						})
				}
			},
			// 使用模板
			confirm(data) {
				let params = deepCopy(data)

				dealTempData(params, this)
			},
			/**
				* @description: 科目详情，回车触发，鼠标移动在哪个科目，就回显哪个
				* @param {Object} elm 每行详情
				*/
			handleSubjectKeyupEnter(elm, index, $event, key) {
				if (elm.isSubjectOptions && this.subjectList && this.subjectList.length > 0) {
					this.handleChangeSubject(this.subjectList[this.subjectMouseEnterIndex].subjectCode)
				} else {
					elm.subjectCode = ''
					elm.subjectName = ''
					elm.showSubject = false
					elm.isSubjectOptions = false
				}
				this.handleCommonEnter($event, index, key, elm)
			},
			/**
			* @description: 科目失焦如果此时选中的科目存在，且为回车跟点击事件触发，那么科目中的数据不清空
			* @param {Object} elm
			* 注意bug：当点击科目option中的每一项的时候，会先走handleSubjectBlur方法，在执行handleChangeSubject，新值会重新赋值为空
			解决：添加一个标识（isImplementSubjectBlur）  blur 优先级高于 click
			1、点击 li || keyup 都为true，此时不会清空
			2、鼠标在option中随意移动，不点击、不keyup，input失焦，此时需要将输入的为空
			3、输入值，input失焦，此时需要将输入的为空
			* 解决方案:click事件换成 mousedown
			*/
			handleSubjectBlur(elm) {
				this.item = elm
				elm.showSubject = false
				elm.isSubjectOptions = false
				handleSubjectTopTip(elm, this)
				if (!this.subjectAllList.some(subjectItem => subjectItem.subjectCode === elm.subjectCode)) {
					elm.subjectCode = ''
					elm.subjectName = ''
					return
				}
			},
			/**
				* @description: 监听科目的input框，option中的数据实时改变
				* @param {*} query
				*/
			handleSubjectInput(query) {
				this.subjectList = this.subjectAllList.filter(item => {
					if (item.subjectCode.indexOf(query) !== -1 || item.subjectNameFull.indexOf(query) !== -1 || item.subjectName.indexOf(query) !== -1) {
						return item
					}
				}).splice(0, 19)
				// if (this.subjectList && this.subjectList.length > 0) {
				// 	this.$set(elm, 'isSubjectOptions', true)
				// } else {
				// 	this.$set(elm, 'isSubjectOptions', false)
				// }
			},
			/**
				* @description:  科目点击
				* @param {Object} item 每行详情
				* @param {number} index 每行科目的下标
				*/
			handleSubjectClick(item, index) {
				// this.handleHidePopover()
				if (!this.isClick || this.isLiClickSubject) {
					this.isLiClickSubject = false
					return
				}
				this.item = item
				if (item.subjectCode) {
					this.handleSubjectInput(item.subjectCode)
				} else {
					this.subjectList = this.copySubjectList
				}
				this.subjectMouseEnterIndex = 0
				this.$set(item, 'showSubject', true)
				this.$set(item, 'isSubjectOptions', true)
				this.$nextTick(() => {
					this.$refs.subjectInput[index].focus()
					this.$refs.subjectInput[index].select()
				})
			},
			// 点击
			mouseenter(item) {
				this.item = item
			},
			// 鼠标进入
			showOperate(index, item) {
				if (!this.isClick) {
					return
				}
				this.indexFlag = index
			},
			// 鼠标离开
			hideOperate(index) {
				if (!this.isClick) {
					return
				}
				this.indexFlag = -1
			},
			// 科目鼠标进入
			handleSubject(param) {
				if (!this.isClick) {
					return
				}
				this.showSubjectName = param
			},
			handleAbstractName(param) {
				if (!this.isClick) {
					return
				}
				this.showAbstractName = param
			},
			showTaskOperate(index) {
				if (!this.isClick) {
					return
				}
				this.taskIndex = index
			},
			hideTaskOperate(index) {
				if (!this.isClick) {
					return
				}
				this.taskIndex = ''
			},
			// 添加任务核算项明细
			addTask(index) {
				if (!this.isClick) {
					return
				}
				this.handleHidePopover()
				if (index) {
					this.voucherInfo.relationCard.splice(index,0,{
						listId:'',
						boardId:'',
						account:'',
						cardId: '',
						title: ''
					})
				} else {
					this.voucherInfo.relationCard.push(
						{
							listId:'',
							boardId:'',
							account:'',
							cardId: '',
							title: ''
						}
					)
				}

			},
			minusTask(index) {
				if (!this.isClick) {
					return
				}
				this.handleHidePopover()
				this.voucherInfo.relationCard.splice(index,1)
			},
			// 点击表格中任意事件，先隐藏科目中的 el-popover
			handleHidePopover() {
				if (this.item && this.item.showAccountDetail) {
					this.$set(this.item, 'showAccountDetail', false)
					return
				}
				this.contentList.forEach(item => {
					if (item.showAccountDetail) {
						this.$set(item, 'showAccountDetail', false)
					}
				})
			},
			// 添加明细
			addVoucherItem(index) {
				addData(index, this)
			},
			// 删除明细
			deleteVoucherItem(index) {
				if (this.contentList.length === 2) {
					this.$message({ type:'error', message:'科目数据不能少于2条'})
					return
				}
				this.contentList.splice(index, 1)
			},
			// 价格转化
			priceConversion(price, item) {
				let arr = deepCopy(price).split('')

				arr.splice(-2, 0, '.')
				if (item) {
					if (item.isMinus) {
						arr.unshift('-')
					}
				} else if (this.item.isMinus) {
					arr.unshift('-')
				}
				return arr.join('')
			},
			// 价格保留小数点后两位
			priceFill(price) {
				let priceCopy = price
				let reg = /^-/g
				if (reg.test(priceCopy)) {
						// 负数
						priceCopy = priceCopy.toString().substring(1)
				}
				if (/\./g.test(priceCopy)) {
						// 是否有小数点
						if (Number(priceCopy) > 1) {
								return Number(priceCopy).toFixed(2).toString().replace(/\./g, '')
						}
						return (Number(priceCopy) * 100).toString()
				}
				return priceCopy + '00'
			},
			// 数量失去焦点
			countBlur() {
				this.showNumberIndex = false
				// 数量 * 价格 = 原币金额
				if (this.item.showCurrency === false) {
					// 币别为不核算或者本位币 不用考虑原币金额
					if (this.item.count) {
						if (this.item.price) {
							this.computeCurrency()
						} else {
							if (this.item.debitAmount) {
								this.item.price = this.priceConversion(this.item.debitAmount) / this.item.count
							}
							if (this.item.creditAmount) {
								this.item.price = this.priceConversion(this.item.creditAmount) / this.item.count
							}
						}
					} else {
						if (this.item.price && this.item.creditAmount) {
							this.item.count = this.priceConversion(this.item.creditAmount) / this.item.price
						}
						if (this.item.price && this.item.debitAmount) {
							this.item.count = this.priceConversion(this.item.debitAmount) / this.item.price
						}
					}
				} else if (this.item.showCurrency) {
					// 需要考虑原币金额
					if (this.item.count) {
						if (this.item.price) {
							this.item.originalAccount = this.item.count * this.item.price
							this.computeCurrency()
						} else if (this.item.originalAccount) {
							this.item.price = this.item.originalAccount / this.item.count
						}
					} else if (this.item.price && this.item.originalAccount) {
						this.item.count = this.item.originalAccount / this.item.price
					}
				}
			},
			// 价格失去焦点
			priceBlur() {
				this.showUnitPriceIndex = false
				if (this.item.showCurrency === false) {
					if (this.item.price) {
						if (this.item.count) {
							this.computeCurrency()
						} else {
							if (this.item.debitAmount) {
								this.item.count = this.priceConversion(this.item.debitAmount) / this.item.price
							}
							if (this.item.creditAmount) {
								this.item.count = this.priceConversion(this.item.creditAmount) / this.item.price
							}
						}
					} else {
						if (this.item.count && this.item.creditAmount) {
							this.item.price = this.priceConversion(this.item.creditAmount) / this.item.count
						}
						if (this.item.count && this.item.debitAmount) {
							this.item.price = this.priceConversion(this.item.debitAmount) / this.item.count
						}
					}
				} else if (this.item.price) {
					if (this.item.count) {
						this.item.originalAccount = this.item.count * this.item.price
						this.computeCurrency()
					} else if (this.item.originalAccount) {
						this.item.count = this.item.originalAccount / this.item.price
					}
				} else if (this.item.count && this.item.originalAccount) {
					this.item.price = this.item.originalAccount / this.item.count
				}
			},
			// 原币金额变化
			originalAccountBlur(item) {
				this.showOriginalCurrencyIndex = false
				if (this.item.showCurrency && !this.item.showCount) {
					// 有汇率 无数量
					if (this.item.originalAccount) {
						this.computeCurrency()
					} else {
						if (this.item.debitAmount) {
							if (this.item.convertWay === 'multiplication') {
								this.item.originalAccount = this.priceConversion(this.item.debitAmount) / this.item.rate
							} else if (this.item.convertWay === 'division') {
								// 原币金额 / 汇率 = 本币金额
								this.item.originalAccount = this.priceConversion(this.item.debitAmount) * this.item.rate
							}
						}
						if (this.item.creditAmount) {
							if (this.item.convertWay === 'multiplication') {
								this.item.originalAccount = this.priceConversion(this.item.creditAmount) / this.item.rate
							} else if (this.item.convertWay === 'division') {
								// 原币金额 / 汇率 = 本币金额
								this.item.originalAccount = this.priceConversion(this.item.creditAmount) * this.item.rate
							}
						}
					}
				} else if (!this.item.showCurrency) {
					// 有数量 有汇率
					if (this.item.originalAccount) {
						this.computeCurrency() // 修改借贷方金额
						if (this.item.count) {
							this.item.price = this.item.originalAccount / this.item.count
						} else if (this.item.price) {
							this.item.count = this.item.originalAccount / this.item.price
						}
					} else if (this.item.count && this.item.price) {
						this.item.originalAccount = this.item.price * this.item.count
						this.computeCurrency()
					}
				}
			},
			// 币别变化
			changeCurrency($event) {
				let selectArr = this.currencyList.filter(val => {
					return val.code === this.item.currencyCode
				})
				this.item.currencyName = selectArr[0].name
				// this.item.rate = selectArr[0].rate // 汇率
				this.$set(this.item, 'rate', selectArr[0].rate)
				this.item.convertWay = selectArr[0].convertWay // 汇率计算方式
				if (this.item.originalAccount) {
					this.computeCurrency()
				} else {
					// 没有原币金额 判断是否需要根据本币金额倒推原币金额
					if (this.item.debitAmount) {
						if (this.item.convertWay === 'multiplication') {
							this.item.originalAccount = this.priceConversion(this.item.debitAmount) / this.item.rate
						} else if (this.item.convertWay === 'division') {
							// 原币金额 / 汇率 = 本币金额
							// this.item.originalAccount = this.priceFill(this.item.debitAmount * this.item.rate)
							this.item.originalAccount = this.priceConversion(this.item.debitAmount) * this.item.rate
						}
						this.originalAccountBlur()
					}
					if (this.item.creditAmount) {
						if (this.item.convertWay === 'multiplication') {
							this.item.originalAccount = this.priceConversion(this.item.creditAmount) / this.item.rate
						} else if (this.item.convertWay === 'division') {
							// 原币金额 / 汇率 = 本币金额
							// this.item.originalAccount = this.priceFill(this.item.creditAmount * this.item.rate)
							this.item.originalAccount = this.priceConversion(this.item.creditAmount) * this.item.rate
						}
						this.originalAccountBlur()
					}
				}
			},
			// 币别是可以修改
			rateDidabled(item) {
				let selectArr = this.currencyList.filter(val => {
					return val.code === item.currencyCode
				})
				if (selectArr[0] && selectArr[0].fixedRate === '1') {
					return false
				}
				return true
			},
			// 汇率失去焦点
			rateBlur() {
				if (!this.item.rate) {
					// 将汇率重置 (汇率不可为空)
					let selectArr = this.currencyList.filter(val => {
						return val.code === this.item.currencyCode
					})

					this.item.rate = selectArr[0].rate
				} else if (this.item.rate) {
					if (this.item.originalAccount) {
						this.computeCurrency()
					} else {
						if (this.item.debitAmount) {
							if (this.item.convertWay === 'multiplication') {
								this.item.originalAccount = this.priceConversion(this.item.debitAmount) / this.item.rate
							} else if (this.item.convertWay === 'division') {
								// 原币金额 / 汇率 = 本币金额
								// this.item.originalAccount = this.priceFill(this.item.debitAmount * this.item.rate)
								this.item.originalAccount = this.priceConversion(this.item.debitAmount) * this.item.rate
							}
							this.originalAccountBlur()
						}
						if (this.item.creditAmount) {
							if (this.item.convertWay === 'multiplication') {
								this.item.originalAccount = this.priceConversion(this.item.creditAmount) / this.item.rate
							} else if (this.item.convertWay === 'division') {
								// 原币金额 / 汇率 = 本币金额
								// this.item.originalAccount = this.priceFill(this.item.creditAmount * this.item.rate)
								this.item.originalAccount = this.priceConversion(this.item.creditAmount) * this.item.rate
							}
							this.originalAccountBlur()
						}
					}
				}
			},
			// 计算本位金额
			computeCurrency() {
				if (this.item.showCurrency === false && this.item.showCount) {
					// 根据数量单价计算借贷方金额
					if (this.item.count && this.item.price) {
						if (this.creditOrDebit(this.item.subjectCode)) {
							this.item.debitAmount = this.priceFill(this.item.count * this.item.price)
							this.item.creditAmount = ''
						} else {
							this.item.creditAmount = this.priceFill(this.item.count * this.item.price)
							this.item.debitAmount = ''
						}
					}
				} else if (this.item.showCurrency && !this.item.showCount) {
					// 根据汇率计算借贷方金额
					if (this.item.originalAccount && this.item.rate) {
						// 存在原币金额
						if (this.creditOrDebit(this.item.subjectCode)) {
							if (this.item.convertWay === 'multiplication') {
								// 原币金额 * 汇率 = 本币金额
								this.item.debitAmount = this.priceFill(this.item.originalAccount * this.item.rate)
							} else if (this.item.convertWay === 'division') {
								// 原币金额 / 汇率 = 本币金额
								this.item.debitAmount = this.priceFill(this.item.originalAccount / this.item.rate)
							}
							this.item.creditAmount = ''
						} else {
							if (this.item.convertWay === 'multiplication') {
								// 原币金额 * 汇率 = 本币金额
								this.item.creditAmount = this.priceFill(this.item.originalAccount * this.item.rate)
							} else if (this.item.convertWay === 'division') {
								// 原币金额 / 汇率 = 本币金额
								this.item.creditAmount = this.priceFill(this.item.originalAccount / this.item.rate)
							}
							this.item.debitAmount = ''
						}
					}
				} else if (this.item.originalAccount) {
					// 判断借方金额 还是 贷方金额
					if (this.creditOrDebit(this.item.subjectCode)) {
						// 判断本币金额 计算方式
						if (this.item.convertWay === 'multiplication') {
							// 原币金额 * 汇率 = 本币金额
							this.item.debitAmount = this.priceFill(this.item.originalAccount * this.item.rate)
						} else if (this.item.convertWay === 'division') {
							// 原币金额 / 汇率 = 本币金额
							this.item.debitAmount = this.priceFill(this.item.originalAccount / this.item.rate)
						}
						this.item.creditAmount = ''
					} else {
						if (this.item.convertWay === 'multiplication') {
							// 原币金额 * 汇率 = 本币金额
							this.item.creditAmount = this.priceFill(this.item.originalAccount * this.item.rate)
						} else if (this.item.convertWay === 'division') {
							// 原币金额 / 汇率 = 本币金额
							this.item.creditAmount = this.priceFill(this.item.originalAccount / this.item.rate)
						}
						this.item.debitAmount = ''
					}
				}
			},
			// 借方贷方输入金额
			showInput(type, item, index) {
				if (!this.isClick) {
					return
				}
				this.handleSubjectPopover()
				this.item = item
				this.indexFlag = index
				this.contentList.forEach(val => {
					val.showDebit = false
					val.showCredit = false
				})
				if (type === 'debit') {
					item.showDebit = true
					this.showBorrowIndex = true
					this.$nextTick( () => {
						if (this.$refs.inputBorrowMoney && this.$refs.inputBorrowMoney[0]) {
							this.$refs.inputBorrowMoney[0].focus()
						}
					})
				} else if (type === 'credit') {
					item.showCredit = true
					this.showLoanIndex = true
					this.$nextTick( () => {
						if (this.$refs.inputCreditMoney && this.$refs.inputCreditMoney[0]) {
							this.$refs.inputCreditMoney[0].focus()
						}
					})
				}
			},
			handleInputMoney(val, type, item) {
				if (type === 'debit') {
					item['creditAmount'] = ''
					item['creditAmountMoenyData'] = handleStringToArray(item['creditAmount'])
					return
				}
				item['debitAmount'] = ''
				item['debitAmountMoenyData'] = handleStringToArray(item['debitAmount'])
			},
			// 获取焦点
			handleFocusMoney(item, key, refName) {
				this.item = item
				if (item[key]) {
					let arr = deepCopy(item[key]).split('')
					if ((item[key] / 100) < 1) {
						arr = (item[key] / 100).toString().split('')
					} else if (arr && arr.length > 2) {
						arr.splice(arr.length - 2, 0, '.')
					}
					if (item.isMinus) {
						arr.unshift('-')
					}
					item[key] = arr.join('')
				}
				// 数据改变之后聚焦，否则聚焦失败
				this.$nextTick( () => {
					if (this.$refs[refName] && this.$refs[refName][0]) {
						this.$refs[refName][0].select()
					}
				})
			},
			/**
			* @description: 按回车键需要添加的类名
			* @param {Array} data 表头所需要展示的title
			* @param {Array} newArr 需要拼接上一级的 类名
			* @return {Array} 需要组合成新的keyName集合
			*/
			handleEnterClassName(data, newArr = []) {
				if (data && data.length > 0) {
					for (let keyName of data) {
						// 数量
						if (keyName === 'amount') {
							this.handleEnterClassName(['count', 'price'], newArr)
						// 币别
						} else if (keyName === 'currency') {
							this.handleEnterClassName(['currency-code', 'rate', 'original-account'], newArr)
						} else {
							newArr.push(keyName + '-input-keyup')
						}
					}
				}
				return newArr
			},
			handleCommonEnter (event, index, key, item) {
				// console.log('event---->', event)
				// console.log('index---->', index)
				// console.log('key---->', key)
				// console.log('item---->', item)
				item.showSubject = false
				item.isSubjectOptions = false
				let keyNameArr = this.enterClassNameArr
				if (this.rateDidabled(item)) {
					keyNameArr = this.enterClassNameArr.filter(classNameItem => classNameItem !== 'rate-input-keyup')
				}
				// 左键
				if (event.keyCode === 37) {
					if (index === 0 && key === 'abstract-input-keyup') {
						return
					}
					let num = 0
					if (key === 'abstract-input-keyup') {
						index -= 1
						this.handleTableColumnJump(this.contentList[index], index, 'lender-input-keyup')
						this.indexFlag = index
						return
					}
					keyNameArr.forEach((v, i) => {
						if (v === key) {
							num = i - 1
						}
					})
					this.handleTableColumnJump(item, index, keyNameArr[num])
					return
				}
				// 向上键
				if (event.keyCode === 38) {
						if (!index) {
							index = this.contentList.length
						}
						index -= 1
						this.handleTableColumnJump(item, index, key)
						return
				}
				// 向下键
				if (event.keyCode === 40) {
						if (+index === this.contentList.length - 1) {
							index -= 1
						}
						index += 1
						this.handleTableColumnJump(item, index, key)
						return
				}
				// 小键盘回车键 回车到最后一位鼠标聚焦在第一行第一列
				if (event.keyCode === 13 || event.keyCode === 39) {
					if (index === this.contentList.length - 1 && key === 'lender-input-keyup') {
						this.contentList.push(deepCopy(contentItem))
					}
					let num = 0
					if (key === keyNameArr[keyNameArr.length - 1]) {
						if (index === this.contentList.length - 1) {
							index = 0
						} else {
								++index
						}
					} else {
						keyNameArr.forEach((v, i) => {
							if (v === key) {
								num = i + 1
							}
						})
					}
					// 这里需要封装一个方法， 这样写太鸡肋
					this.handleTableColumnJump(item, index, keyNameArr[num])
				}
			},
			handleTableColumnJump(item, index, className) {
				this.showSubjectName = false
				this.showAbstractName = false
				const classNameMapKey = {
					'count-input-keyup': 'showNumberIndex',
					'price-input-keyup': 'showUnitPriceIndex',
					'currency-code-input-keyup': 'showCurrencytIndex'
				}
				if (className === 'abstract-input-keyup') {
					return this.handleAbstractClick(this.contentList[index], index)
				}
				if (className === 'subject-input-keyup') {
					return this.handleSubjectClick(item, index)
				}
				if (className === 'borrower-input-keyup') {
					return this.showInput('debit', item, index)
				}
				if (className === 'lender-input-keyup') {
					return this.showInput('credit', item, index)
				}
				this.$nextTick(() => {
					let doms = document.getElementsByClassName(className)[0]
					doms.focus()
					doms.click()
				})
				classNameMapKey[className] = true
			},
			// 借方贷方失去焦点
			handleBlurMoney(type, item) {
				if (type === 'credit') {
					item.showCredit = false
					this.showLoanIndex = false
					if (item.creditAmount) {
						if (Number(item.creditAmount) < 0) {
							item.isMinus = true
						} else {
								item.isMinus = false
						}
						item.debitAmount = ''
						item.creditAmount = this.priceFill(item.creditAmount)
					}
					item.creditAmountMoenyData = handleStringToArray(item.creditAmount)
				} else if (type === 'debit') {
					this.showBorrowIndex = false
					item.showDebit = false
					if (item.debitAmount) {
						if (Number(item.debitAmount) < 0) {
							item.isMinus = true
						} else {
							item.isMinus = false
						}
						item.creditAmount = ''
						item.debitAmount = this.priceFill(item.debitAmount)
					
					}
					item.debitAmountMoenyData = handleStringToArray(item.debitAmount)
				}
				if (!item.showCount && !item.showCurrency) {
					// 无数量 无汇率
					return
				}
				if (type === 'credit') {
					// 贷方金额输入 (根据数量计算)
					// 有数量 无汇率
					if (item.showCurrency === false && item.creditAmount && item.showCount) {
						if (item.count && item.price) {
							// 反推价格
							item.price = this.priceConversion(item.creditAmount) / item.count
						} else if (item.count) {
							item.price = this.priceConversion(item.creditAmount) / item.count
						} else if (item.price) {
							item.count = this.priceConversion(item.creditAmount) / item.price
						}
					} else if (item.showCurrency && item.creditAmount && !item.showCount) {
						if (item.convertWay === 'multiplication') {
							item.originalAccount = this.priceConversion(item.creditAmount) / item.rate
						} else if (item.convertWay === 'division') {
							// 原币金额 / 汇率 = 本币金额
							item.originalAccount = this.priceConversion(item.creditAmount) * item.rate
						}
					} else if (item.showCurrency && item.creditAmount && item.showCount) {
						// 有数量 有汇率
						if (item.convertWay === 'multiplication') {
							item.originalAccount = this.priceConversion(item.creditAmount) / item.rate
						} else if (item.convertWay === 'division') {
							// 原币金额 / 汇率 = 本币金额
							item.originalAccount = this.priceConversion(item.creditAmount) * item.rate
						}
						if (item.originalAccount) {
							if (item.count) {
								item.price = item.originalAccount / item.count
							} else if (item.price) {
								item.count = item.originalAccount / item.price
							}
						} else if (item.count && item.price) {
							item.count = item.originalAccount / item.price
						}
					}
				} else if (item.showCurrency === false && item.debitAmount && item.showCount) {
					if (item.count && item.price) {
						item.price = this.priceConversion(item.debitAmount) / item.count
					} else if (item.count) {
						item.price = this.priceConversion(item.debitAmount) / item.count
					} else if (item.price) {
						item.count = this.priceConversion(item.debitAmount) / item.price
					}
				} else if (item.showCurrency && item.debitAmount && !item.showCount) {
					if (item.convertWay === 'multiplication') {
						item.originalAccount = this.priceConversion(item.debitAmount) / item.rate
					} else if (item.convertWay === 'division') {
						// 原币金额 / 汇率 = 本币金额
						item.originalAccount = this.priceConversion(item.debitAmount) * item.rate
					}
				} else if (item.showCurrency && item.debitAmount && item.showCount) {
					// 根据原币金额 汇率
					if (item.convertWay === 'multiplication') {
						item.originalAccount = this.priceConversion(item.debitAmount) / item.rate
					} else if (item.convertWay === 'division') {
						// 原币金额 / 汇率 = 本币金额
						item.originalAccount = this.priceConversion(item.debitAmount) * item.rate
					}
					if (item.originalAccount) {
						if (item.count) {
							item.price = item.originalAccount / item.count
						} else if (item.price) {
							item.count = item.originalAccount / item.price
						}
					} else if (item.count && item.price) {
						item.count = item.originalAccount / item.price
					}
				}
			},
			// 判断本币金额还是原币金额
			creditOrDebit(code) {
				let subjectArr = this.subjectAllList.filter(val => {
					return val.subjectCode === code
				})

				if (subjectArr[0].category === '资产' || subjectArr[0].category === '成本' || subjectArr[0].category === '损益' || subjectArr[0].category === '共同' || subjectArr[0].category === '表外') {
					// 借方金额
					return true
				}
				return false
			},
			// 显示任务核算项
			showTask(item) {
				if (!this.isClick) {
					return
				}
				this.taskItem = item
				this.financialRenwuShow = true
			},
			// 关闭任务弹窗
			goBackShow() {
				this.financialRenwuShow = false
			},
			// 任务返回数据
			getDialogData(data) {
				// 获得任务页面返回数据
				if (typeof this.voucherInfo.relationCard === 'object' && this.voucherInfo.relationCard.length > 0) {
					for (let i = 0; i < this.voucherInfo.relationCard.length; i++) {
						if (this.voucherInfo.relationCard[i].cardId === data.cardId) {
							this.$vux.toast.text('任务已存在，请重新选择')
							return
						}
					}
				}

				this.taskItem.title =  data.tasks[0].title
				this.taskItem.listId = data.tasks[0].listId
				this.taskItem.boardId = data.tasks[0].boardId
				this.taskItem.cardId = data.tasks[0].cardId
				this.taskItem.account = ''
				// 	this.voucherInfo.relationCard.push({
				//   listId:data.listId,
				//   boardId:data.boardId,
				//   account:'',
				//   cardId: data.cardId,
				//   title: data.title
				// })
				this.financialRenwuShow = false
			},
			isNull(val) {
				return typeof val === 'undefined' || val === null || val === ''
			},
			// 委托 审核 驳回
			operationApprove(type) {
				if (type === 'WT') {
					this.$refs.executeWorkflow.execute({},'WT')
					return
				}
				let url = '/zingbiz/financial/voucher/approvalExecution'
				let voucherType = 'plain'
				if (this.$route.query.rowId) {
					if (this.voucherInfo.voucherType === 'DBD') {
						voucherType = 'allocation'
					}
				}
				let initParams = {
					postParams:{
						voucherInfoId : this.$route.query.rowId,
						voucherStatus:type,
						voucherType:voucherType
					},
					url: url
				}
				if (type === 'YSH') {
					this.$refs.executeWorkflow.execute(initParams,'SH')
				} else if (type === 'FQ') {
					this.$refs.executeWorkflow.execute(initParams,'BH')
				}
			},
			// 审批提交成功
			successWorkflow(res) {
				this.SHID = res.rowId
				this.$router.replace({
					path: 'addVoucher',
					query: {
						companyId: this.$route.query.companyId,
						rowId: res.rowId
					}
				})
				this.showLaunchWorkflow = false
				this.voucherInfoById(res.rowId)
				// this.showLaunchWorkflow = false
			},
			// 审核成功
			successExecute() {
				this.voucherInfoById(this.$route.query.rowId)
			},
			// 是否未可执行节点
			disabledExecute(flag) {
				this.execute = flag
				if (this.SHID) {
					if (this.execute) {
						this.$router.replace({
							path: 'addVoucher',
							query: {
								companyId: this.$route.query.companyId,
								rowId: this.SHID
							}
						})
					} else {
						this.$router.push({
							path: 'voucherManage',
							query: {
								companyId: this.$route.query.companyId
							}
						})
					}
				}
			},
			//disabledBtn(disabled) {
			// if (this.showLaunchWorkflow) {
			//   this.showLaunchWorkflow = false
			//   if (disabled.SH) {
			//     this.$router.replace({
			//       path: 'addVoucher',
			//       query: {
			//         companyId: this.$route.query.companyId,
			//         rowId: this.SHID
			//       }
			//     })
			//   } else {
			//     this.$router.push({
			//       path: 'voucherManage',
			//       query: {
			//         companyId: this.$route.query.companyId
			//       }
			//     })
			//   }
			// }
			//},
			handleCommonTask(param) {
				let relation = false
				if(this.systemSettingData.isVoucherNeedRelationCard === 'true') {
					if (param.relationCard.length === 0) {
						this.$message({type :'error', message:'请添加任务核算项'})
						return true
					}
					if (param.relationCard && param.relationCard.length > 0) {
						for (let i = 0; i < param.relationCard.length; i ++) {
							const val = param.relationCard[i]
							if (isEmtVal(val.title)) {
								relation = true
								this.$message({type :'error', message:'请选择任务核算项名称'})
								break
							}
							if (isEmtVal(val.account)){
								relation = true
								this.$message({type :'error', message:'请输入任务核算项金额'})
								break
							}
						}
					}
				}
				return relation
			},
			// 保存 验证
			tiJiaoShenHe(fn) {
				this.voucherInfo.voucherInfoItems = this.contentList
				let param = deepCopy(this.voucherInfo)
				let code = []
				let disabeldSubject = {}
				// 判断是否在结账期内 在这个结账期内 是不可以暂存 审核 保存 反审核 删除
				// this.systemSettingData.currentAccountingPeriod "yyyy-MM"
				// this.voucherInfo.bookkeepingTime 'yyyy-MMM-dd'
				if (Date.parse(this.voucherInfo.bookkeepingTime) < Date.parse(this.systemSettingData.currentAccountingPeriod + '-01')) {
					this.$message({type :'error', message:'该期间已结账'})
					return
				}
				if (this.handleCommonTask(param)) {
					return
				}
				//判断引用科目是否被禁用
				this.subjectAllList.forEach(val => {
						code.push(val.subjectCode) // 已启用状态
				})
				if (this.voucherInfo.voucherInfoItems && this.voucherInfo.voucherInfoItems.length > 0) {
						for (const subject of this.voucherInfo.voucherInfoItems) {
								if (subject.subjectCode && code.indexOf(subject.subjectCode) === -1) { // 找不到的就是已禁用的
										disabeldSubject = subject
										break
								}
						}
				}
				if (JSON.stringify(disabeldSubject) !== '{}') {
						this.$message({ type:'error',message: disabeldSubject.subjectName + '已被禁用！'})
						return
				}
				if (!this.isNull(this.voucherInfo.number)) {
					this.loading = false
					voucherNumCheck(this).then(res => {
						if (res.success) {
							if (res.data) {
								let params = handlerData(param, this)
								if (params) {
									if (this.systemSettingData.voucherActive === 'true') {
										this.initParams.postParams = params
										this.$refs.workflow[fn]()
										this.loading = false
									}
								} else {
									this.loading = false
								}
							} else {
								this.loading = false
								this.$message({ type: 'error', message: '此凭证号已存在' })
							}
						} else {
							this.loading = false
						}
					})
					return
				}
				let params = handlerData(param, this)
				// if (params && this.systemSettingData.voucherActive === 'true') {
				if (params) {
					this.initParams.postParams = params
					this.$refs.workflow[fn]()
				}
			},
			save(type) {
				this.voucherInfo.voucherInfoItems = this.contentList
				let param = deepCopy(this.voucherInfo)
				let code = []
				let disabeldSubject = {}
				// 判断是否在结账期内 在这个结账期内 是不可以暂存 审核 保存 反审核 删除
				// this.systemSettingData.currentAccountingPeriod "yyyy-MM"
				// this.voucherInfo.bookkeepingTime 'yyyy-MMM-dd'
				if (Date.parse(this.voucherInfo.bookkeepingTime) < Date.parse(this.systemSettingData.currentAccountingPeriod + '-01')) {
					this.$message({type :'error', message:'该期间已结账'})
					return
				}
				if (this.handleCommonTask(param)) {
					return
				}
				//判断引用科目是否被禁用
				this.subjectAllList.forEach(val => {
						code.push(val.subjectCode) // 已启用状态
				})
				if (this.voucherInfo.voucherInfoItems && this.voucherInfo.voucherInfoItems.length > 0) {
						for (const subject of this.voucherInfo.voucherInfoItems) {
								if (subject.subjectCode && code.indexOf(subject.subjectCode) === -1) { // 找不到的就是已禁用的
										disabeldSubject = subject
										break
								}
						}
				}
				if (JSON.stringify(disabeldSubject) !== '{}') {
						this.$message({ type:'error',message: disabeldSubject.subjectName + '已被禁用！'})
						return
				}
				if (!this.isNull(this.voucherInfo.number)) {
					this.loading = false
					voucherNumCheck(this).then(res => {
						if (res.success) {
							if (res.data) {
								let params = handlerData(param, this)
								if (params) {
									// if (this.systemSettingData.voucherActive === 'true' && type === 'SH') {
									// 	this.initParams.postParams = params
									// 	this.showLaunchWorkflow = true
									// 	this.loading = false
									// 	return
									// }
									let url = ''
									if (this.$route.query.rowId) {
										url = '/zingbiz/financial/voucher/updateVoucher'
									} else {
										url = '/zingbiz/financial/voucher/insertVoucherFinance'
									}
									this.$http
										.post(url, params)
										.then(reslut => {
											if (reslut.data.success) {
												this.$message({ type: 'success', message: '保存成功' })
												if (type === 'ZC') {
													this.$router.push({
														path: 'addVoucher',
														query: {
															companyId: this.$route.query.companyId,
															rowId: reslut.data.data.rowId
														}
													})
													this.voucherInfoById(this.$route.query.rowId)
												} else if (type === 'BC') {
													this.$router.push({
														path: 'addVoucher',
														query: {
															companyId: this.$route.query.companyId
														}
													})
													if (!this.$route.query.rowId) {
														this.voucherInfo = {
															attacheds: [],
															name: '', // 模板名称
															companyId: '',
															debitCount: 0,
															lenderCount: 0,
															isDebitMinus: false,
															isLenderMinus: false,
															code: '',
															cardUserName: '',
															approveStatus: 'WTJ',
															voucherType: 'PZ',
															voucherWord: '', // 凭证字
															bookkeepingTime: '', // 时间
															debitAccount: '0.00', // 借方金额
															lenderAccount: '0.00', // 贷方金额
															relationCard: [],
															number: '' // 字号
														}
														if (this.voucherNumberList.length !== 0) {
															if (this.voucherNumberList.filter(val => {
																return val.isDefault === 'true'
															}).length !== 0 ) {
																this.voucherInfo.voucherWord = this.voucherNumberList.filter(val => {
																	return val.isDefault === 'true'
																})[0].id
															} else {
																this.voucherInfo.voucherWord = this.voucherNumberList[0].id
															}
														}
														this.loadVoucherInit()
														initVoucher(this)
														let time = parseDateStr(new Date()).split('-')[0] + '-' + parseDateStr(new Date()).split('-')[1]
														this.pickeroptions.disabledDate = (T) => {
															return T.getTime() < new Date(new Date(this.systemSettingData.currentAccountingPeriod).setHours(0, 0, 0, 0)).getTime()
														}
														if (time !== res.currentAccountingPeriod) {
															this.voucherInfo.bookkeepingTime = this.systemSettingData.currentAccountingPeriod.split('-')[0] + '-' + this.systemSettingData.currentAccountingPeriod.split('-')[1] + '-' + new Date(this.systemSettingData.currentAccountingPeriod.split('-')[0],this.systemSettingData.currentAccountingPeriod.split('-')[1],0).getDate()
														} else {
															this.voucherInfo.bookkeepingTime = parseDateStr(new Date())
														}
														// this.voucherInfo.bookkeepingTime = parseDateStr(new Date())
													} else {
														this.voucherInfoById(this.$route.query.rowId)
													}
												}
												// else if (type === 'SH') {
												// 	this.$router.push({
												// 		path: '/workflow/workflowMain',
												// 		query: {
												// 			pzRowId: reslut.data.data.rowId,
												// 			voucherType: 'PZ',
												// 			companyId: this.voucherInfo.companyId,
												// 			wfType: 'MODULE_TYPE_ZYK'
												// 		}
												// 	})
												// }
											} else {
												this.$message({ type: 'success', message: '保存失败' })
											}
											this.loading = false
										})
										.catch(error => {
											console.log(error)
											this.loading = false
										})
								} else {
									this.loading = false
								}
							} else {
								this.loading = false
								this.$message({ type: 'error', message: '此凭证号已存在' })
							}
						} else {
							this.loading = false
						}
					})
				} else {
					this.loading = false
					let params = handlerData(param, this)

					if (params) {
						this.loading = false
						if (this.systemSettingData.voucherActive === 'true' && type === 'SH') {
							this.initParams.postParams = params
							this.showLaunchWorkflow = true
							this.loading = false
							return
						}
						let url = ''
						if (this.$route.query.rowId) {
							url = '/zingbiz/financial/voucher/updateVoucher'
						} else {
							url = '/zingbiz/financial/voucher/insertVoucherFinance'
						}
						this.$http
							.post(url, params)
							.then(res => {
								this.loading = false
								if (res.data.success) {
									this.$message({ type: 'success', message: '保存成功' })
									if (type === 'ZC') {
										this.$router.push({
											path: 'addVoucher',
											query: {
												companyId: this.$route.query.companyId,
												rowId: res.data.data.rowId
											}
										})
										this.voucherInfoById(this.$route.query.rowId)
									} else if (type === 'BC') {
										this.$router.push({
											path: 'addVoucher',
											query: {
												companyId: this.$route.query.companyId
											}
										})
										if (!this.$route.query.rowId) {
											this.voucherInfo = {
												attacheds: [],
												name: '', // 模板名称
												companyId: '',
												debitCount: 0,
												lenderCount: 0,
												isDebitMinus: false,
												isLenderMinus: false,
												code: '',
												cardUserName: '',
												approveStatus: 'WTJ',
												voucherType: 'PZ',
												voucherWord: '', // 凭证字
												bookkeepingTime: '', // 时间
												debitAccount: '0.00', // 借方金额
												lenderAccount: '0.00', // 贷方金额
												relationCard: [],
												number: '' // 字号
											}
											if (this.voucherNumberList.length !== 0) {
												if (this.voucherNumberList.filter(val => {
													return val.isDefault === 'true'
												}).length !== 0 ) {
													this.voucherInfo.voucherWord = this.voucherNumberList.filter(val => {
														return val.isDefault === 'true'
													})[0].id
												} else {
													this.voucherInfo.voucherWord = this.voucherNumberList[0].id
												}
											}
											this.loadVoucherInit()
											initVoucher(this)
											let time = parseDateStr(new Date()).split('-')[0] + '-' + parseDateStr(new Date()).split('-')[1]
											this.pickeroptions.disabledDate = (T) => {
												return T.getTime() < new Date(new Date(this.systemSettingData.currentAccountingPeriod).setHours(0, 0, 0, 0)).getTime()
											}
											if (time !== res.currentAccountingPeriod) {
												this.voucherInfo.bookkeepingTime = this.systemSettingData.currentAccountingPeriod.split('-')[0] + '-' + this.systemSettingData.currentAccountingPeriod.split('-')[1] + '-' + new Date(this.systemSettingData.currentAccountingPeriod.split('-')[0],this.systemSettingData.currentAccountingPeriod.split('-')[1],0).getDate()
											} else {
												this.voucherInfo.bookkeepingTime = parseDateStr(new Date())
											}
										} else {
											this.voucherInfoById(this.$route.query.rowId)
										}
									}
									// else if (type === 'SH') {
									// 	this.$router.push({
									// 		path: '/workflow/workflowMain',
									// 		query: {
									// 			pzRowId: res.data.data.rowId,
									// 			voucherType: 'PZ',
									// 			companyId: this.voucherInfo.companyId,
									// 			wfType: 'MODULE_TYPE_ZYK'
									// 		}
									// 	})
									// }
								} else {
									this.$message({ type: 'success', message: '保存失败' })
								}
							})
							.catch(error => {
								this.loading = false
								console.log(error)
							})
					} else {
						this.loading = false
					}
				}
			},
			// 更多凭证
			moreVoucher() {
				this.$router.push({
					path: 'voucherManage',
					query: {
						companyId: this.$route.query.companyId
					}
				})
			},
			// 附件上传返回数据
			addFile(fileList) {
				this.voucherInfo.attacheds = fileList
			},
			/**
			 * 科目组件的回调
			 * @param {Object} data 科目的详情数据
			 */
			onPicked(data) {
				const contentListItem = this.contentList[this.subjectIndexFlag]
				const { subjectCode, subjectName} = data
				this.$set(contentListItem, 'subjectCode', subjectCode)
				this.$set(contentListItem, 'subjectName', subjectName)
				this.$set(contentListItem, 'showSubject', false)
				this.showSubjectCom = false
			},
			handleSubjectCom(index) {
				this.handleSubjectPopover()
				this.showSubjectCom = true
				this.subjectIndexFlag = index
			},
			handleAbstractCom(index) {
				this.handleSubjectPopover()
				this.selectAbstract = {}
				this.showAbstractCom = true
				const {summary, summaryId} = this.contentList[index]
				this.selectAbstract = {
					summaryContent: summary,
					rowId: summaryId
				}
				this.subjectIndexFlag = index
			},
			// handleCurrency(currencIndex) {
			// 	let surrencStyle = ''
			// 	if (+currencIndex === 0) {
			// 		surrencStyle = 'width:40%'
			// 	} else if (+currencIndex === 1){
			// 		surrencStyle = 'width:30%;border-left:1px solid #BBBBBE;border-right:1px solid #BBBBBE;'
			// 	} else {
			// 		surrencStyle = 'width:30%'
			// 	}
			// 	return surrencStyle
			// },
			wtSuccess(){
				this.$router.back(-1)
			},
			haveToDoFn(todo){
				if(!todo){
					this.$router.back(-1)
				}
			},
			jieDianShenHe(fn,btnType){
				let url = '/zingbiz/financial/voucher/approvalExecution'
				let voucherType = 'plain'
				if (this.$route.query.rowId) {
					if (this.voucherInfo.voucherType === 'DBD') {
						voucherType = 'allocation'
					}
				}
				this.executeParams = {
					postParams:{
						voucherInfoId : this.$route.query.rowId,
						voucherStatus: btnType === 'BH' ? 'FQ' : 'YSH',
						voucherType:voucherType
					},
					url: url
				}
				if (btnType === 'SH') {
					this.$refs.workflow[fn](this.executeParams,true)
				} else if (btnType === 'BH') {
					this.$refs.workflow[fn](this.executeParams, true)
				} else {
					this.$refs.workflow[fn](this.executeParams)
				}
			},
			// 反审核
			reverseAudit(paramsData) {
				if (Date.parse(this.voucherInfo.bookkeepingTime) < Date.parse(this.systemSettingData.currentAccountingPeriod + '-01')) {
					return	this.$message({type :'error', message:'该期间已结账，不能反审核'})
				}
				this.hasDeApprove = false
				if (paramsData && paramsData !== '') {
					let url = '/zingbiz/financial/voucher/reverseAudit'

					this.$http
						.get(url, {
							params: {
								rowId: this.$route.query.rowId,
								operationNote: paramsData // 反审核原因
							}
						})
						.then(res => {
							if (res.data.success) {
								this.$message({ type: 'success', message: '反审核成功' })
								this.voucherInfoById(this.$route.query.rowId)
								this.isdisabledNext = true
								this.isdisabledPre = true
							} else {
								this.$message({ type: 'error', message: res.data.msg })
							}
						})
						.catch(error => {
							console.log(error)
						})
				}
			},
			handleDeleteAbstractCom() {
				this.abstractSelect().then(res3 => {
					this.abstractList = res3.filter(val => {
						return val.state === 'true'
					})
				})
			},
			handleAbstract(params) {
				const { rowId, summaryContent } = params
				this.showAbstractCom = false
				const item = this.contentList[this.subjectIndexFlag]
				this.$set(item, 'summary', summaryContent)
				this.$set(item, 'summaryId', rowId)
			},
			// 上传之前
			beforeUpload(file) {
				this.loading = true
			},
			// 图片上传
			uploadSuccess(response, file) {
				if (file.status) {
					this.voucherInfo.attacheds.push({
						fileType: response.data.fileSuffix,
						fileName: response.data.fileName,
						path: response.data.relativePath,
						id: response.data.id,
						fileSize:response.data.fileSize
					})
					this.handlerAttacheds(this.voucherInfo)
					this.loading = false
				}
			},
			//查询核算项目
			selectAccountingProject() {
				let url = '/zingbiz/financial/accountingProject/selectAll'
				let params = {
					dataType: 'tree'
				}
				this.$http.get(url, { params: params }).then(acct => {
					this.accountingProjectArray = acct.data.data.tree
				})
			},
			handlerBusinessCancal(item) {
				this.$set(item, 'showAccountDetail', false)
			},
			handlerBusinessDetermine(item) {
				this.arr = []
				this.item.fullData = ''
				const {
					customer: customerRule, customerCode, customerId, customerParentId,
					department, departmentCode, departmentId, departmentParentId,
					materiel, materielCode, materielId, materielParentId,
					staffMember, staffMemberCode, staffMemberId, staffMemberParentId,
					supplier: supplierRule, supplierCode, supplierId, supplierParentId,
					warehouse, warehouseCode, warehouseId, warehouseParentId,
					showCustomer, showSupplier, showWarehouse, showMateriel, showDepartment, showStaffMember
				} = this.ruleForm
				if (!zIsempty20(customerRule) && showCustomer) {
					this.handleSubjectBusinessAccountingDetail(customerCode, customerRule, customerParentId, customerId)
				}
				if (!zIsempty20(supplierRule) && showSupplier) {
					this.handleSubjectBusinessAccountingDetail(supplierCode, supplierRule, supplierParentId, supplierId)
				}
				if (!zIsempty20(warehouse) && showWarehouse) {
					this.handleSubjectBusinessAccountingDetail(warehouseCode, warehouse, warehouseParentId, warehouseId)
				}
				if (!zIsempty20(materiel) && showMateriel) {
					this.handleSubjectBusinessAccountingDetail(materielCode, materiel, materielParentId, materielId)
				}
				if (!zIsempty20(department) && showDepartment) {
					this.handleSubjectBusinessAccountingDetail(departmentCode, department, departmentParentId, departmentId)
				}
				if (!zIsempty20(staffMember) && showStaffMember) {
					this.handleSubjectBusinessAccountingDetail(staffMemberCode, staffMember, staffMemberParentId, staffMemberId)
				}
				handleSubjectTopTip(item, this)
				console.log(this.arr.join(' '), '7890---->')
				this.item.accountingProject = this.arr.join(' ')
				this.$nextTick(() => {
					this.$set(item, 'showAccountDetail', false)
				})
			},
			handleSubjectBusinessAccountingDetail(code, name, parentId, id) {
				if (code) {
					this.item.fullData += '.' + code + '_' + name
				} else {
					this.item.fullData += '.' + name
				}
				let str = parentId + '#' + id
				this.arr.push(str)
			},
			// 点击凭证录入的表格，让 科目中的 el-popover 隐藏
			handleSubjectPopover() {
				this.handleLeaveTip()
				this.handleHidePopover()
			},
			// 科目中的 el-popover 显示，点击表格以外的区域提示
			handleLeaveTip() {
				if (this.ruleForm && !zIsempty20(this.item.showAccountDetail)) {
					const {customer: customerRule, department, materiel, staffMember, supplier: supplierRule, warehouse,
						showCustomer, showSupplier, showWarehouse, showMateriel, showDepartment, showStaffMember} = this.ruleForm
					if (zIsempty20(customerRule) && showCustomer) {
						return this.$message({ type:'error', message: '客户为必录项，不允许为空'})
					}
					if (zIsempty20(supplierRule) && showSupplier) {
						return this.$message({ type:'error', message: '供应商为必录项，不允许为空'})
					}
					if (zIsempty20(warehouse) && showWarehouse) {
						return this.$message({ type:'error', message: '仓库为必录项，不允许为空'})
					}
					if (zIsempty20(materiel) && showMateriel) {
						return this.$message({ type:'error', message: '物料为必录项，不允许为空'})
					}
					if (zIsempty20(department) && showDepartment) {
						return this.$message({ type:'error', message: '部门为必录项，不允许为空'})
					}
					if (zIsempty20(staffMember) && showStaffMember) {
						return this.$message({ type:'error', message: '职员为必录项，不允许为空'})
					}
					return this.$set(this.item, 'showAccountDetail', false)
				}
				if (!zIsempty20(this.nextFn)) {
					this.nextFn()
				}
			},
			handleInputStop() {
				return
			},
			// 凭证录入页面点击事件，配合选科目时弹出 el-popover 组件
			handleAddVoucher() {
				this.handleLeaveTip()
			},
			// 客户
			confirmCustomer(val) {
				const {contactsName, code, supplierMainName} = val
				this.$set(this.ruleForm, 'customer', contactsName ? contactsName : supplierMainName)
				this.$set(this.ruleForm, 'customerCode', code)
				this.handleSupplierList('客户', contactsName ? contactsName : supplierMainName, code)
				this.customerVisible = false
			},
			// 处理科目下的辅助核算相对应的 id 以及 parentId
			handleSupplierList(businessAccountingName, name, code, id) {
				if (this.supplierListobj && Object.keys(this.supplierListobj).length > 0) {
					Object.keys(this.supplierListobj).forEach( item => {
						if (item === businessAccountingName) {
							for(let i = 0; i < this.supplierListobj[businessAccountingName].length; i ++) {
								const ele = this.supplierListobj[businessAccountingName][i]
								if (ele.name === name && ele.code === code && businessAccountingName === '客户') {
									this.$set(this.ruleForm, 'customerId', ele.id)
									this.$set(this.ruleForm, 'customerParentId', ele.parentId)
									// console.log('客户-获取id/parentId', this.ruleForm)
									break
								}
								if (ele.name === name && ele.code === code && businessAccountingName === '供应商') {
									this.$set(this.ruleForm, 'supplierId', ele.id)
									this.$set(this.ruleForm, 'supplierParentId', ele.parentId)
									// console.log('供应商-获取id/parentId', this.ruleForm)
									break
								}
								if (ele.name === name && ele.code === code && businessAccountingName === '仓库') {
									this.$set(this.ruleForm, 'warehouseId', ele.id)
									this.$set(this.ruleForm, 'warehouseParentId', ele.parentId)
									// console.log('仓库-获取id/parentId', this.ruleForm)
									break
								}
								if (ele.name === name && ele.code === code && businessAccountingName === '物料') {
									this.$set(this.ruleForm, 'materielId', ele.id)
									this.$set(this.ruleForm, 'materielParentId', ele.parentId)
									// console.log('物料-获取id/parentId', this.ruleForm)
									break
								}
								if (ele.name === name && ele.originalId === id && businessAccountingName === '部门') {
									this.$set(this.ruleForm, 'departmentId', ele.id)
									this.$set(this.ruleForm, 'departmentCode', ele.code)
									this.$set(this.ruleForm, 'departmentParentId', ele.parentId)
									// console.log('部门-获取id/parentId', this.ruleForm)
									break
								}
								if (ele.name === name && businessAccountingName === '职员') {
									this.$set(this.ruleForm, 'staffMemberId', ele.id)
									this.$set(this.ruleForm, 'staffMemberCode', ele.code)
									this.$set(this.ruleForm, 'staffMemberParentId', ele.parentId)
									// console.log('职员-获取id/parentId', this.ruleForm)
									break
								}
							}
						}
					})
				}
			},
			// 供应商
			confirmSupplier(val) {
				this.ruleForm.supplier = val.supplierMainName
				this.ruleForm.supplierCode = val.code
				this.searchData.supplierMainName = val.supplierMainName
				this.handleSupplierList('供应商', val.supplierMainName, val.code)
				this.supplierVisible = false
			},
			// 仓库
			handlerWarehouse(val) {
				const { goodsStorehouseCode: code, goodsStorehouseName: name} = val
				this.ruleForm.warehouse = name
				this.ruleForm.warehouseCode = code
				this.handleSupplierList('仓库', name, code)
			},
			// 选择 入库仓库
			getWarehouseList(val) {
				this.orderInfo.storehouseName = val.goodsStorehouseName
				this.orderInfo.storehouseId = val.rowId
				this.$refs.storehouseNameRef.blur()
				this.getCardUrlList(val.rowId)
			},
			validateWarehouse() {
				// this.$refs.ruleFormIn.validateField('storehouseName')
			},
			addVoucherGoodList() {
				let url = '/zingbiz/goodsStorehouse/productRest/searchSpecifications'
				let params = {
					disable: 'false'
				}
				let requestMethod = 'post'
				//物品去重和勾选回显
				// this.filterIds = []
				// this.batchInfoItems.map(item =>{
				//     this.filterIds.push(item.partNumber)
				// })
				this.$refs.goodsListRef.show(params,url,requestMethod)
			},
			// 物料--物品信息
			handlerMateriel(val) {
				if (val && val.length > 0) {
					const { productName, partNumber} = val[0]
					this.ruleForm.materiel = productName
					this.ruleForm.materielCode = partNumber
					this.handleSupplierList('物料', productName, partNumber)
				}
			},
			// 职员 = 选人
			handleDeptMemberonConfirm(checkDeptList) {
				this.formData = checkDeptList
				const name = checkDeptList[0].userName
				this.ruleForm.staffMember = name
				this.handleSupplierList('职员', name)
				this.showDeptMemberVisible = false
			},
			// 部门
			handlerDepartment(val) {
				this.ruleForm.department = val[0].text
				this.initialSelectedDept = val
				this.handleSupplierList('部门', val[0].text, '', val[0].id)
				this.showPersonPicker = false
			},
			// 职员
			handlerStaffMember() {

			},
			/**
			 * 请求 科目 中的辅助核算
			 * @param {String} id 客户/供应商/仓库/物料/部门/职员
			 */
			handleAccountingProject(id, resolve) {
				let url = '/zingbiz/financial/accountingProject/selectAll'
				this.$http.get(url,{
					params:{
						id:id,
						pageNumber:1,
						pageSize:9999
					}
				}).then(res => {
					if (res.data.success) {
						let name = res.data.data.tree[0].name
						let obj = {
							[name]: res.data.data.table
						}
						this.supplierListobj = Object.assign(this.supplierListobj, obj);
						if (name === '客户') {
							this.ruleForm.showCustomer = true
						} else if (name === '供应商') {
							this.ruleForm.showSupplier = true
						} else if (name === '仓库' ) {
							this.ruleForm.showWarehouse = true
						} else if (name === '物料' ) {
							this.ruleForm.showMateriel = true
						} else if (name === '部门' ) {
							this.ruleForm.showDepartment = true
						} else if (name === '职员' ) {
							this.ruleForm.showStaffMember = true
						}
						resolve()
					} else {
						this.$message({ type: 'error', message: res.data.msg })
					}
				}).catch(error => {
					console.log(error)
				})
			},
			// 附件 添加
			AddannexList(data) {
				this.voucherInfo.attacheds.push(this.handleImgParameter(data))
			},
			// 附件 删除
			deleteAnnex(item) {
				this.voucherInfo.attacheds = this.voucherInfo.attacheds.filter(el => el.id !== item.id)
			},
			handleImgParameter(resData) {
				return {
					fileType: resData.fileType,
					fileName: resData.fileName,
					path: resData.relativePath,
					id: resData.id,
					fileSize:resData.fileSize,
					creater: resData.creater,
					relativePath: resData.relativePath,
					fileSizeStr: resData.fileSizeStr,
					fileSuffix: resData.fileSuffix,
					genTime: resData.genTime,
					iconClass: this.selectFileType(resData)
				}
			},
			selectFileType(val) {
				let type = ''

				if (val.fileType === 'jpg' || val.fileType === 'jpeg' || val.fileType === 'png' || val.fileType === 'gif' || val.fileType === 'image') {
					type = 'image'
					// item.path = getThumbUrl(item.relativePath,26,26,'./static/images/ysImg.png',false)
				} else if (val.fileType === 'xls' || val.fileType === 'xlsx') {
					type = '#icon-ECEL'
				} else if (val.fileType === 'doc' || val.fileType === 'docx') {
					type = '#icon-WORD'
				} else if (val.fileType === 'ppt' || val.fileType === 'pptx') {
					type = '#icon-PPT'
				} else if (val.fileType === 'pdf') {
					type = '#icon-PDF'
				} else if (val.fileType === 'properties' || val.fileType === 'log' || val === 'txt') {
					type = '#icon-TET'
				} else if (val.fileType === 'zip' || val.fileType === 'rar') {
					type = '#icon-ZIP'
				} else {
					type = '#icon-GIF1'
				}
				return type
			},
			// 智能凭证编辑后 保存修改后数据
			pickData() {
				this.voucherInfo.voucherInfoItems = this.contentList
				let param = deepCopy(this.voucherInfo)
				param.debitCount = 0
				param.lenderCount = 0
				let params = handlerTmepData(param,true, this)
				if (params) {
					this.$http.post('/zingbiz/financial/todoVoucherInfoRest/update', params).then(res => {
						if (res.data.success) {
							this.$message({ type:'success', message:'保存成功'})
							this.$router.back(-1)
						} else {
							this.$message({ type:'error', message:res.data.msg})
						}
					})
				}
			},
			// 处理摘要样式
			handleAbstractStyle(index) {
				if (this.indexFlag === index && this.showAbstractName) {
					return 'abstract-input-none'
				}
				if (+index === +this.indexFlag) {
					return 'abstract-input'
				}
				return ''
			},
			// 处理科目样式
			handleSubjectStyle(index) {
				if (+this.indexFlag === +index && this.showSubjectName) {
					return 'subject-input-none'
				}
				if (+index === +this.indexFlag) {
					return 'subject-input'
				}
				return ''
			},
			handleTdStyle(index) {
				if (index === this.indexFlag) {
					return 'background-color:#F5F7FA;'
				}
				return ''
			},
			handleQuantityStyle(index) {
				if (this.showNumberIndex && (index === this.indexFlag)) {
					return 'background-color:#fff;'
				}
				return ''
			},
			handleUnitPriceStyle(index) {
				if (this.showUnitPriceIndex && (index === this.indexFlag)) {
					return 'background-color:#fff;'
				}
				return ''
			},
			handleOriginCurrency(index) {
				if (this.showOriginalCurrencyIndex && (index === this.indexFlag)) {
					return 'background-color:#fff;'
				}
				if (index === this.indexFlag) {
					return 'background-color:#F5F7FA;'
				}
				return ''
			},
			handleCurrencytClass(index) {
				if (+this.indexFlag === +index && this.showCurrencytIndex) {
					return 'set-select-input-none'
				}
				if (+index === +this.indexFlag) {
					return 'set-select-input'
				}
				return ''
			},
			handleLoanStyle(index) {
				if (+this.indexFlag === +index && this.showLoanIndex) {
					return 'background-color:#fff;'
				}
				if (+index === +this.indexFlag) {
					return 'background-color:#F5F7FA;'
				}
				return ''
			},
			handleBorrowStyle(index) {
				if (+this.indexFlag === +index && this.showBorrowIndex) {
					return 'background-color:#fff;'
				}
				if (+index === +this.indexFlag) {
					return 'background-color:#F5F7FA;'
				}
				return ''
			},
			handleShowTask() {
				this.showAddTask = true
				if (this.voucherInfo.relationCard && this.voucherInfo.relationCard.length === 0) {
					this.voucherInfo.relationCard.push(deepCopy(this.relationCardItem))
				} else if (this.voucherInfo.relationCard === undefined || this.voucherInfo.relationCard === null){
					this.voucherInfo.relationCard = [deepCopy(this.relationCardItem)]
				}
			},
			handleSetUnitName(params) {
				let name = ''
				if (zIsempty20(params.unit)) {
					return name
				}
				if (this.measureList && this.measureList.length > 0) {
					const zIndex = this.measureList.findIndex( item => item.rowId === params.unit)
					if (zIndex !== -1) {
						name = this.measureList[zIndex].val
					}
				}
				return name
			},
			// 处理金额
			keepTwoDecimalFull(num) {
				if (zIsempty20(num)) {
					return '0.00'
				}
				var result = num;
				result = Math.round(num * 100) / 100;
				var str = result.toString(); //将数字转换为字符串
				var posDecimal = str.indexOf('.'); //小数点的索引值
				// 当整数时，posDecimal=-1 自动补0
				if (posDecimal < 0) {
					posDecimal = str.length;
					str += '.';
				}
				// 当数字的长度< 小数点索引+2时，补0
				while (str.length <= posDecimal + 2) {
					str += '0';
				}
				return str;
			}
			// handleSummanryName(id) {
			// 	let arr = this.abstractList.filter(val => {
			// 		return val.rowId === id
			// 	})
			// 	if (arr.length !== 0) {
			// 		return arr[0].summaryContent
			// 	}
			// }
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #addVoucher{
    .readonlySelect_special{
      .el-input__inner {
        background-color: white
        color: #000
        border: none
        border-bottom: 1px solid #BBBBBB
        border-radius: 0
      }
    }
    .set-select{
      // background:red;
      border none
      direction none
    }
    .set-select > .el-input{
      border none
      direction none

      input{
        border none
        height: 53px;
        line-height: 53px;
        border-radius: 0;
      }
    }
    .set-select-input-none > .el-input{
      input{
        background-color: #fff;
      }
    }
    .set-select-input > .el-input{
      input {
        background-color: #F5F7FA;
      }
    }
    .set-select:focus{
      outline none
    }
    tr, td{
      height:53px;
    }
    .el-main{
      overflow auto
      padding 0
      // background #f0f2f5
    }

		.voucher-common-option{
			width: 100%;
			padding: 0;

			&-header{
				width: 100%;
				display: flex;
				height: 40px;
				line-height: 40px;
				background-color: #f2f2f2;
				color: #666;
				border-bottom: 1px solid #e6e6e6;

				div{
					flex-grow: 1;
					width: 1px;
					text-align: center;
				}

				div:first-child{
					border-right: 1px solid #e6e6e6;
				}
			}

			&-footer{
				width: 100%;
				display: flex;
				height: 40px;
				line-height: 40px;
				color: #000;
				border-top: 1px solid #e6e6e6;

				div{
					flex-grow: 1;
					width: 1px;
					text-align: center;
					cursor: pointer;
				}

				div:first-child{
					border-right: 1px solid #e6e6e6;
				}
			}

			&-content{
				width: 100%;
				height: 200px;
				overflow-y: auto;

				&-li{
					width: 100%;
					display: flex;
					height: 40px;
					padding: 0 12px;
					line-height: 40px;
					color: #000;
					cursor: pointer;

					div{
						flex-grow: 1;
						width: 1px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space:nowrap;
					}
				}
				.select-selected {
					background: #e9f2fd;
					color: #2386ee;
				}
			}

			&-content-empty{
				line-height: 200px;
				text-align: center;
			}
		}
  }
  .add-voucher-title{
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
    background: #fff;
    font-size: 18px;
    font-weight: 400;
  }
  // #add-voucher-popover{
  #add-voucher-popover-content{
    width: 300px;
    min-height: 100px;

    .add-voucher-popover-content-show{
      display: flex;
      align-items: center;
      margin-bottom: 15px;

      &-label{
        display: inline-block;
        width: 75px;
        text-align: right;
        padding-right: 8px;

        span{
          color: red;
        }
      }
      &-input{
        border-bottom: 1px solid #BBBBBB;

        input{
          border: none;
        }

        i{
          display: inline-block;
          height: 32px;
          line-height: 32px;
          cursor: pointer;
        }
      }
    }
  }
  // }

</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  body .addVoucher .addVoucher-content .readonlySelect_special >>> .el-input__inner {
    background-color: white !important
    color: #000  !important
    padding-right: 0;
  }

  body .addVoucher .addVoucher-content .resetBorder >>> .el-input__inner{
    border:0 !important
    outline: none !important
    padding-right: 0;
    //   background-color: #F5F7FA;
    height: 53px;
  }
  .isdisabledPre,.isdisabledNext{
    color: #40AAFA
  }
  .yishenhe{
    position: absolute;
    font-size: 80px;
    color: red;
		right: 0;
    z-index: 10;
  }
  .addVoucher .addVoucher-content .resetBorder{
    width:100%
    height: 53px;
    line-height: 53px;
		padding-left: 10px;
  }
  .addVoucher{
    height: 100%;
    min-width: 1350px;
    background-color: #f0f2f5;
    //   min-width 1070px
    //   overflow auto
    &-header{
      height: 42px;
      line-height: 31px;
      width 100%
      text-align center
      &-title{
        color: rgba(16, 16, 16, 1);
        font-size: 20px;
        font-family: SourceHanSansSC-regular;
      }
      &-right{
        float right
        font-size: 14px;
        text-align: center;
        font-family: Microsoft Yahei;
      }
    }
    &-content{
      width 100%
      background-color white
      padding 10px 30px 30px
      &-top,&-bottom{
        margin-left 21px
      }
      .plusOrMinus,.isLenderMinus,.isDebitMinus{
        color red
      }
      table{
        table-layout:fixed
        border-collapse: collapse
      }
      table .number{
        width: 80px;
        text-align: center;
      }
      table .operate{
        width: 20px;
        text-align: center;
        border:0px
      }
      table td{
        background-color: #FFFFFF
      }
      table th,table td{
        box-sizing: content-box;
        border: 1px solid #BBBBBE;
        width: 250px;
        height: 50px;
      }
			table{
				.quantity,.currency{
					width: 200px!important;
					flex-shrink: 0;
					&-content{
						display:flex;

						&-currency-type{
							height: 53px;
							width: 1px;
							flex-grow: 1;
							display: flex;
						}

						&-exchange-rate{
							border-left: 1px solid #BBBBBE;
							border-right: 1px solid #BBBBBE;
							width: 1px;
							flex-grow: 1;
							line-height: 52px;
						}

						&-original-currency{
							width: 1px;
							flex-grow: 1;
							display: flex;
							line-height: 52px;
						}

						&-company{
							text-align: center;
						}
					}
				}
			}
      tbody tr,thead tr{
        .subject {
          width: calc(100% - 620px);
          &-input-none >>> .el-input__inner{
            background-color: #fff;
          }
          &-input >>> .el-input__inner{
            background-color: #F5F7FA;
          }
          &-input-none{
            background-color: #fff;
          }
          &-input{
            background-color: #F5F7FA;
          }
          .content-value{
            position relative
            height 100%
            width 100%
            background: #fff;

            .describe{
              height 100%
              width 100%
              padding-left 10px
              // div{
              //   position relative
              //   top: 50%
              //   transform: translateY(-50%);
              // }
            }
          }
        }

				.abstract{
					width: 250px;

					&-input-none >>> .el-input__inner{
						background-color: #fff;
					}
					&-input >>> .el-input__inner{
						background-color: #F5F7FA;
					}

					&-input-none{
						background-color: #fff;
					}
					&-input{
						background-color: #F5F7FA;

					}

					.content-value{
						position relative
						height 100%
						width 100%
						background: #fff;

						.abstract-text{
							color: #989E9D;
							position: absolute;
							right: 15px;
							top: 21px;
							cursor: pointer;
						}
					}

				}
      }
      table th{
        text-align: center
      }
      .voucher-direction{
        display: block;
        height: 25px;
        line-height: 25px
      }
      .voucher-money{
				display: flex;
				justify-content: space-around;
        height: 25px;
        font-size: 12px;
        font-weight: normal;
        border-top: 1px solid #dadada;
        text-align: center;
        line-height: 25px;
        background-color: white;
        background-size: 100% 25px;

				span{
					display: inline-block;
					border-right: 1px solid #dfdfdf;
					width: 1px;
					flex-grow: 1;
					text-align: center;
				}

				span:last-child{
					border: none;
				}

				span:nth-child(3), span:nth-child(6){
					border-color: #92c5fe!important;
				}

				span:nth-child(9){
					border-color: #fdadad!important;
				}
      }
      .borrow-money,.credit-money{
        background-color: white;
        background-size: 100% 50px;
        line-height: 50px
        height: 50px
      }

			.borrow-money .content-value,.credit-money .content-value{
				font-family: 'tahoma';
				font-size: 13px;
				float: right;
				width: 100%;
				display: flex;
				justify-content: space-around;

				span{
					display: inline-block;
					border-right: 1px solid #dfdfdf;
					width: 1px;
					flex-grow: 1;
					height: 50px;
					text-align: center;
				}

				span:last-child{
					border: none;
				}

				&-blue{
					border-color: #92c5fe!important;
				}

				&-red{
					border-color: #fdadad!important;
				}
			}
      .quantity,.currency,.addVoucher-content-top{
        input{
          width 60%
          -webkit-appearance: none;
          -moz-appearance: none;
          -o-appearance: none;
          appearance: none;
          background:none;
          outline:none;
          border:none;
          border-bottom:1px solid #ccc
        }
        .exchangeRate{
          width calc(60% - 26px)
        }
        input:focus{
          /*border:none;*/
        }
        .addVoucher-bookkeeping-voucher{
          text-align: center;
          line-height: 30px;
          font-size: 20px;
          color: #101010;
          letter-spacing: 10px;
        }
        .addVoucher-bookkeeping-voucher-title-content{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        &-enclosure{
          height: 32px;
          line-height: 32px;
          text-align: right
        }

        &-enclosure-Number{
          border-bottom:1px solid #101010;
          height: 32px;
          display: inline-block;
          text-align: center;
          width:30px;
        }
      }
      .inputMoney{
        -webkit-appearance: none;
        -moz-appearance: none;
        -o-appearance: none;
        appearance: none;
        background:none;
        outline:none;
        border:none;
        width 100%
        height 100%
        line-height 50px
        padding-right 0
      }
      .inputMoney:focus{
        width 100%
        height 50px
        line-height 50px
        border:none;
      }
      &-table-icon{
        width 18px
        height 18px
        border-radius 9px
        background-color #ff8000
        color white
        cursor:pointer
        line-height:16px;
        display:inline-block;

        &-add{
          text-align:center;
        }
        &-reduce{
          margin-left:10px;
        }
      }
      &-table-icon:first-child{
        margin-bottom 2px
        line-height: 18px;
      }
    }
    .relation-card-table{
      width:100%;

      tbody{
        tr:first-child{
          td{
            border-top:0;
          }
        }
      }
    }
    .relation-card{
      width:80px;
      display:table-cell;
      vertical-align:middle;
      text-align: center;
      position:relative;
      border-right: 2px solid #BBBBBE;

      &-icon{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .icon-add{
      width 18px
      height 18px
      border-radius 9px
      background-color #ff8000
      color white
      cursor:pointer
      line-height: 15px
    }
    .icon-minus{
      margin-left:5px;
    }
  }


  .initInput{
    background:none;
    border none
    outline none
    height: 50px
    width 100%
    white-space:normal;
    word-wrap:break-word;
    word-break:break-all
  }
  .initInput:focus{
    border none
  }
  .summaryStyle{
    background-color #fff
    width 90%
    position: absolute
    bottom: 0
    left: 5%
    z-index: 9
    transform translateY(110%)
    max-height 102px
    overflow-y auto
    border: 1px solid #e4e7ed
    li{
      color: #606266;
      font-size 14px
      cursor: pointer
      width 100%
      padding 0 5px
      height 34px
      line-height 34px
      padding 0 20px
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis
      &:hover{
        background-color #f5f7fa
      }
    }
    &:before{
      content: "";
      display block
      height 0
      width 0
      position:absolute;
      z-index 10
      left:5px;
      top:-10px;
      border-bottom: solid 10px #f5f5f5;
      border-left: solid 10px transparent;
      border-right: solid 10px transparent;
    }
  }
  .dot{
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  }
  .subject-static-style, .abstract-static-style{
    height: 53px;
    cursor:pointer;
    // overflow: auto;
    overflow: hidden;
    padding:0 50px 0 10px;
    line-height: 53px;
    position:relative;

		.subject-item-lineClamp2{
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			line-height: 30px;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
		}

    &-balance{
      position: absolute;
      bottom: -18px;
      right: 60px;
    }
  }
</style>
