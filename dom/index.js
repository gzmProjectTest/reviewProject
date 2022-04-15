/*
 * @Author: your name
 * @Date: 2021-07-26 11:53:27
 * @LastEditTime: 2021-07-26 12:00:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /review/dom/index.js
 */
{
    count: 1 // 申请数量
    acpdCount: null
    acpdCountTax: "615.00"
    // this.productDetail.accountTax = this.priceFill(Number(this.productDetail.ratifyCount) * Number(this.productDetail.priceTax))
    acpdCountUnitPrice: "0.00"
    acpdCountUnitPriceTotle: null
    acpdCountingPrice: null
    actualTax: ""
    allCategoryName: null
    annexes: ""
    averageAcpdCountingPrice: "0.00"
    averagePrice: "123.00"
    beforePartNumber: null
    borrowCount: null
    cardUrl: null
    categoryId: "184504024001140102"
    categoryName: "成品"
    codeSuffixLength: null
    companyId: "company184503904000000101"
    costPrice: ""
    costPriceTotle: null
    createDate: "2021-06-24 20:16:43"
    currentStockNum: "110.00"
    distributionPrice: null
    existBom: null
    genTime: "2021-06-24 20:16:43"
    goodsTotalNum: "110.00"
    goodsTotalPrice: null
    inOrOutNum: null
    inStorageingNum: null
    initStockNum: null
    inventoryPkNum: null
    inventoryPyNum: null
    isStartUse: "true"
    locationCode: "CK3884258971049000960"
    locationId: null
    locationName: "7/23测试新建库位"
    lockNumber: null
    lotnumberManage: "false"
    mainSourceType: "0"
    mainStorehouseId: "184504898000000102"
    mainStorehouseName: "北京仓库"
    manualBarCode: "6923644266066"
    manualBarCodeImg: " "
    maxNumber: ""
    minNumber: ""
    moneyDwonWarn: "-5"
    moneyUpWarn: "5"
    numDwonWarn: "-5"
    numUpWarn: "5"
    oldPartNumber: ""
    onlineStoreSaleNum: null
    onlineStoreStockNum: null
    orderIsUsed: null
    outStorageingNum: null
    partName: ""
    partNumber: "6281638162"
    partNumberPrefix: null
    partNumberSuffix: null
    pdCount: 1
    predictDeliveryDate: "2021-07-26"
    price: "123.00" //参考单价
    priceFiveLevel: null
    priceFourLevel: null
    priceOneLevel: null
    priceTax: "123.00" // 参考含税单价
    priceThreeLevel: null
    priceTwoLevel: null
    product: Object
    productBrand: null
    productId: "186351403000000102"
    productImg: "/checkFile/company/company184503904000000101/2021/6/24/186351341000000101"
    productMainCode: "6281638162"
    productName: "6/24测试"
    productSpecsImgs: "/checkFile/company/company184503904000000101/2021/6/24/186351341000000101"
    productSpecsImgsId: null
    productStatus: "false"
    productStockNum: "110.00"
    productionAddress: null
    projectId: null
    projectName: null
    purchaseNum: null
    purchasePrice: ""
    purchasePriceLately: null
    purchasePriceMax: null
    purchasePriceTaxLately: null
    pushMoney: ""
    pushMoneyType: "0"
    putawayStockNum: null
    qualitySafeNum: null
    qualitySafeType: null
    qualitySafeWarnNum: null
    ratifyCount: 5 // 批准数量
    remark: ""
    remarkInfo: ""
    reportDamageInfoItemCount: null
    retailPrice: null
    rowId: "186351403000010102"
    rowIdOfSource: null
    safeNumber: ""
    sale: "false"
    saleNum: null
    salePriceLately: null
    salePriceMin: null
    salePriceTaxLately: null
    salespPrice: ""
    salespProjectId: null
    salespProjectName: null
    shelfLife: "false"
    snCode: null
    snCodeList: null
    snStatus: "false"
    source: "WPK"
    specificationCategories: Array(0)
    specifications: null
    specificationsList: null
    stockNum: "110.00"
    storehouseId: "188836241000000102"
    storehouseName: "7/23郭志明测试002"
    storehouseNum: null
    subscript: (...)
    supplierId: ""
    supplierName: ""
    takeDownOrderItemCount: null
    takeDownOrderNum: null
    taskCardId: null 
    taxRate: "0.00" //增值税税率
    totalAcpdCountingPrice: "0.0"
    totalPrice: "13530.0"
    unitId: "184504024001000102"
    unitName: "盒"
    waitInOrOutNum: null
    waitInStorageNum: null
    waitOutStorageNum: null
    warehousingBatchNumber: null
    weight: null
    wholesalePrice: null
}
/* 
    参考单价：默认带出这个物品的平均价格，如果物品的平均价格为空时，显示0.00
    增值税税率：如果为空时，输入框内容显示为：例：”13%，请输入13“
    税额：批准数量*参考单价*增值税税率
    参考含税单价：参考单价*（1+增值税税率）
    含税金额：批准数量*参考含税单价
*/