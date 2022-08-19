/*
 **sheet页1
 **比价表
*/
var excelContent1 = [{
	row: 0,
	place: [0, 0, 1, 0],
	content: '采购组别',
	style: 1,
	columnWidth: 13
}, {
	row: 0,
	place: [0, 1, 1, 2],
	content: '采购申请上采购员名称（取第一行）',
	style: 2,
	columnWidth: 6,
	name:'purchase_name',
	queryType:'F'
}, {
	row: 0,
	place: [0, 3, 1, 6],
	content: 'SM资材 采购比价表',
	style: 0,
	columnWidth: 22
}, {
	row: 0,
	place: [0, 7, 1, 7],
	content: '201010版',
	style: 2,
	columnWidth: 14
}, {
	row: 0,
	place: [0, 8, 1, 9],
	content: '采购责任人',
	style: 1,
	columnWidth: 12
}, {
	row: 0,
	place: [0, 10, 1, 11],
	content: '供应商及价格管理组',
	style: 1,
	columnWidth: 12
}, {
	row: 0,
	place: [0, 12, 1, 13],
	content: '部门领导审核',
	style: 1,
	columnWidth: 12
}, {
	row: 2,
	place: [2, 0, 2, 0],
	content: '工作令号',
	style: 1
},  {
	row: 2,
	place: [2, 3, 2, 3],
	content: '比价时间',
	style: 1
}, {
	row: 2,
	place: [2, 4, 2, 5],
	content: '提交审核时间',
	style: 2,
	name:'submitted_date',
	queryType:'F'
}, {
	row: 2,
	place: [2, 6, 2, 6],
	content: '有效日期',
	style: 1
}, {
	row: 2,
	place: [2, 7, 2, 7],
	content: '',
	style: 2
}, {
	row: 2,
	place: [2, 8, 2, 9],
	content: '',
	style: 2,
	name:'create_by_desc',
	queryType:'F'
}, {
	row: 2,
	place: [2, 10, 2, 11],
	content: '',
	style: 2
}, {
	row: 2,
	place: [2, 12, 2, 13],
	content: '',
	style: 2
}, {
	row: 3,
	place: [3, 0, 3, 0],
	content: '项目名',
	style: 1
}, {
	row: 3,
	place: [3, 1, 3, 2],
	content: '询价单标题',
	style: 2,
	name:'title',
	queryType:'F'
}, {
	row: 3,
	place: [3, 3, 3, 3],
	content: '比价单号',
	style: 1
}, {
	row: 3,
	place: [3, 4, 3, 5],
	content: '询价单编号',
	style: 2,
	name:'rfx_number',
	queryType:'F'
}, {
	row: 3,
	place: [3, 6, 3, 6],
	content: '货币单位',
	style: 1
}, {
	row: 3,
	place: [3, 7, 3, 7],
	content: '询价单头币种',
	style: 2,
	name:'currency_code',
	queryType:'F'
}, {
	row: 3,
	place: [3, 8, 3, 9],
	content: 'A供应商报价',
	style: 2
}, {
	row: 3,
	place: [3, 10, 3, 11],
	content: 'B供应商报价',
	style: 2
}, {
	row: 3,
	place: [3, 12, 3, 13],
	content: 'C供应商报价',
	style: 2
}];
//动态数据列头部
var sycTableTile = [{
	row: 4,
	place: [4, 0, 5, 0],
	content: '序号',
	style: 2,
	columnWidth:10
}, {
	row: 4,
	place: [4, 1, 5, 1],
	content: '要有试样',
	style: 2
}, {
	row: 4,
	place: [4, 2, 5, 2],
	content: '产品名称',
	style: 2,
	columnWidth:15
}, {
	row: 4,
	place: [4, 3, 5, 3],
	content: '规格',
	style: 2
}, {
	row: 4,
	place: [4, 4, 5, 4],
	content: '单位',
	style: 2
}, {
	row: 4,
	place: [4, 5, 5, 5],
	content: '数量',
	style: 2
}, {
	row: 4,
	place: [4, 6, 4, 7],
	content: '控制成本',
	style: 2
}, {
	row: 5,
	place: [5, 6, 5, 6],
	content: '单价',
	style: 2
}, {
	row: 5,
	place: [5, 7, 5, 7],
	content: '合价',
	style: 2
}, {
	row: 4,
	place: [4, 8, 4, 9],
	content: '无锡市法兰锻造',
	style: 2,
	name:'coop_company_desc',
	queryType:0
}, {
	row: 5,
	place: [5, 8, 5, 8],
	content: '单价',
	style: 2,
	columnWidth:8,
	name:'unit_price',
	queryType:0,
	columnWidth:9
}, {
	row: 5,
	place: [5, 9, 5, 9],
	content: '价格',
	style: 2,
	columnWidth:14,
	name:'total_price',
	queryType:0
}, {
	row: 4,
	place: [4, 10, 4, 11],
	content: '恒业',
	style: 2,
	name:'coop_company_desc',
	queryType:1
}, {
	row: 5,
	place: [5, 10, 5, 10],
	content: '单价',
	style: 2,
	columnWidth:8,
	name:'unit_price',
	queryType:1,
	columnWidth:9
}, {
	row: 5,
	place: [5, 11, 5, 11],
	content: '价格',
	style: 2,
	columnWidth:14,
	name:'total_price',
	queryType:1
}, {
	row: 4,
	place: [4, 12, 4, 13],
	content: '供应商名称',
	style: 2,
	name:'coop_company_desc',
	queryType:2
}, {
	row: 5,
	place: [5, 12, 5, 12],
	content: '单价',
	style: 2,
	columnWidth:8,
	name:'unit_price',
	queryType:2,
	columnWidth:9
}, {
	row: 5,
	place: [5, 13, 5, 13],
	content: '价格',
	style: 2,
	columnWidth:14,
	name:'total_price',
	queryType:2
}];
var excelContent3 = [{
	row: 2,
	place: [2, 1, 2, 2],
	content: '取行工作令号，拼接',
	style: 2,
	name:'work_num',
	queryType:'P3'
}];
//动态数据列内部
var sycTableContent = [];
//动态数据列尾部
var sycTableFoot = [{
	row: 7,
	place: [7, 0, 7, 0],
	content: '',
	style: 2
}, {
	row: 7,
	place: [7, 1, 7, 13],
	content: '具体见附件',
	style: 2
}, {
	row: 8,
	place: [8, 0, 8, 2],
	content: '合计',
	style: 2
}, {
	row: 8,
	place: [8, 4, 8, 5],
	content: '总数量合计',
	style: 2,
	name:'total_count',
	queryType:'F'
}, {
	row: 8,
	place: [8, 6, 8, 7],
	content: '',
	style: 2,
	name:'total_costs',
	queryType:'F'
}, {
	row: 8,
	place: [8, 8, 8, 9],
	content: '',
	style: 2,
	name:'total_vendor0',
	queryType:'F'
}, {
	row: 8,
	place: [8, 10, 8, 11],
	content: '',
	style: 2,
	name:'total_vendor1',
	queryType:'F'
}, {
	row: 8,
	place: [8, 12, 8, 13],
	content: '',
	style: 2,
	name:'total_vendor2',
	queryType:'F'
}];
var excelContent2 = [{
	row: 9,
	place: [9, 0, 14, 2],
	content: '项目延期罚款特别提示,销售同罚款金额',
	style: 2
}, {
	row: 9,
	place: [9, 3, 10, 3],
	content: '销售先行时间',
	style: 2
}, {
	row: 9,
	place: [9, 4, 10, 5],
	content: '',
	style: 2
}, {
	row: 9,
	place: [9, 6, 9, 7],
	content: '右边的采购总计',
	style: 2,
	name:'total_price',
	queryType:1
}, {
	row: 9,
	place: [9, 8, 9, 9],
	content: '采购总计：￥93027.0',
	style: 2,
	name:'real_total_vendor0',
	queryType:1
}, {
	row: 9,
	place: [9, 10, 9, 11],
	content: '采购总计：￥87673.2',
	style: 2,
	name:'real_total_vendor1',
	queryType:1
}, {
	row: 9,
	place: [9, 12, 9, 13],
	content: '各个供应商中标金额合计',
	style: 2,
	name:'real_total_vendor2',
	queryType:1
}, {
	row: 10,
	place: [10, 6, 10, 7],
	content: '最终价格折让（合价/%）',
	style: 2
}, {
	row: 10,
	place: [10, 8, 10, 9],
	content: '',
	style: 2
}, {
	row: 10,
	place: [10, 10, 10, 11],
	content: '',
	style: 2
}, {
	row: 10,
	place: [10, 12, 10, 13],
	content: '',
	style: 2
}, {
	row: 11,
	place: [11, 3, 11, 3],
	content: '调度会要求最晚到货期',
	style: 2
}, {
	row: 11,
	place: [11, 4, 11, 5],
	content: '',
	style: 2
}, {
	row: 11,
	place: [11, 6, 11, 7],
	content: '供应商承诺交货期',
	style: 2
}, {
	row: 11,
	place: [11, 10, 11, 11],
	content: '',
	style: 2
}, {
	row: 11,
	place: [11, 12, 11, 13],
	content: '',
	style: 2
}, {
	row: 12,
	place: [12, 3, 12, 3],
	content: '要求付款条件',
	style: 2
}, {
	row: 12,
	place: [12, 4, 12, 5],
	content: '',
	style: 2
}, {
	row: 12,
	place: [12, 6, 12, 7],
	content: '承诺付款条件',
	style: 2
}, {
	row: 12,
	place: [12, 8, 12, 9],
	content: '',
	style: 2
}, {
	row: 12,
	place: [12, 10, 12, 11],
	content: '',
	style: 2
}, {
	row: 12,
	place: [12, 12, 12, 13],
	content: '',
	style: 2
}, {
	row: 13,
	place: [13, 3, 13, 3],
	content: '要求质保期/装运方式',
	style: 2
}, {
	row: 13,
	place: [13, 4, 13, 5],
	content: '',
	style: 2
}, {
	row: 13,
	place: [13, 6, 13, 7],
	content: '承诺质保期',
	style: 2
}, {
	row: 13,
	place: [13, 8, 13, 9],
	content: '',
	style: 2
}, {
	row: 13,
	place: [13, 10, 13, 11],
	content: '',
	style: 2
}, {
	row: 13,
	place: [13, 12, 13, 13],
	content: '',
	style: 2
}, {
	row: 14,
	place: [14, 3, 14, 3],
	content: '要求采购对应罚款金额',
	style: 2
}, {
	row: 14,
	place: [14, 4, 14, 5],
	content: '',
	style: 2
}, {
	row: 14,
	place: [14, 6, 14, 7],
	content: '承诺罚款方式/金额',
	style: 2
}, {
	row: 14,
	place: [14, 8, 14, 9],
	content: '',
	style: 2
}, {
	row: 14,
	place: [14, 10, 14, 11],
	content: '',
	style: 2
}, {
	row: 14,
	place: [14, 12, 14, 13],
	content: '',
	style: 2
}, {
	row: 15,
	place: [15, 0, 19, 0],
	content: '供应商资信等级',
	style: 2
}, {
	row: 15,
	place: [15, 1, 15, 2],
	content: '供应商规模/等级',
	style: 2
}, {
	row: 15,
	place: [15, 3, 15, 7],
	content: 'A.大型专业生产厂 B.小型生产厂 C.贸易批发商 D.贸易公司 ',
	style: 3
}, {
	row: 15,
	place: [15, 8, 15, 9],
	content: 'A',
	style: 2,
	name:'L10',
	queryType:2
}, {
	row: 15,
	place: [15, 10, 15, 11],
	content: 'A',
	style: 2,
	name:'L11',
	queryType:2
}, {
	row: 15,
	place: [15, 12, 15, 13],
	content: 'A',
	style: 2,
	name:'L12',
	queryType:2
}, {
	row: 16,
	place: [16, 1, 16, 2],
	content: '以往交货期情况',
	style: 2
}, {
	row: 16,
	place: [16, 3, 16, 7],
	content: 'A.货/证/票按时 B.质保书不及时 C.偶尔延误 D.经常延误 ',
	style: 3
}, {
	row: 16,
	place: [16, 8, 16, 9],
	content: 'C',
	style: 2,
	name:'L20',
	queryType:2
}, {
	row: 16,
	place: [16, 10, 16, 11],
	content: 'C',
	style: 2,
	name:'L21',
	queryType:2
}, {
	row: 16,
	place: [16, 12, 16, 13],
	content: 'C',
	style: 2,
	name:'L22',
	queryType:2
}, {
	row: 17,
	place: [17, 1, 17, 2],
	content: '售前/售后服务',
	style: 2
}, {
	row: 17,
	place: [17, 3, 17, 7],
	content: 'A.响应速度有成效 B.一般 C.拖延 D.无售前售后服务 ',
	style: 3
}, {
	row: 17,
	place: [17, 8, 17, 9],
	content: 'A',
	style: 2,
	name:'L30',
	queryType:2
}, {
	row: 17,
	place: [17, 10, 17, 11],
	content: 'A',
	style: 2,
	name:'L31',
	queryType:2
}, {
	row: 17,
	place: [17, 12, 17, 13],
	content: 'A',
	style: 2,
	name:'L32',
	queryType:2
}, {
	row: 18,
	place: [18, 1, 18, 2],
	content: '质量情况',
	style: 2
}, {
	row: 18,
	place: [18, 3, 18, 7],
	content: 'A.无质量事故 B.有一次质量事故 C.多次质量事故 D.试用期',
	style: 3
}, {
	row: 18,
	place: [18, 8, 18, 9],
	content: 'A',
	style: 2,
	name:'L40',
	queryType:2
}, {
	row: 18,
	place: [18, 10, 18, 11],
	content: 'A',
	style: 2,
	name:'L41',
	queryType:2
}, {
	row: 18,
	place: [18, 12, 18, 13],
	content: 'A',
	style: 2,
	name:'L42',
	queryType:2
}, {
	row: 19,
	place: [19, 1, 19, 2],
	content: '合计业绩',
	style: 2
}, {
	row: 19,
	place: [19, 3, 19, 7],
	content: 'A.战略供应商 B.重要供应商 C.一般供应商 D.零星采购',
	style: 3
}, {
	row: 19,
	place: [19, 8, 19, 9],
	content: 'B',
	style: 2,
	name:'L50',
	queryType:2
}, {
	row: 19,
	place: [19, 10, 19, 11],
	content: 'B',
	style: 2,
	name:'L51',
	queryType:2
}, {
	row: 19,
	place: [19, 12, 19, 13],
	content: 'B',
	style: 2,
	name:'L52',
	queryType:2
}, {
	row: 20,
	place: [20, 0, 21, 2],
	content: '决策意见',
	style: 4
}, {
	row: 22,
	place: [22, 0, 22, 5],
	content: ' 注意',
	style: 6
}, {
	row: 22,
	place: [22, 6, 22, 13],
	content: ' 差异/代用的特别提示：',
	style: 6
}, {
	row: 23,
	place: [23, 0, 23, 5],
	content: ' 1.对于单项人民币1万元以上的采购必须进行2家供应商以上的比价采购。',
	style: 5
}, {
	row: 24,
	place: [24, 0, 24, 5],
	content: ' 2.所有的比价必须附供应商的报价依据',
	style: 5
}, {
	row: 25,
	place: [25, 0, 25, 5],
	content: ' 3.有差异的必须附差异表复印件',
	style: 5
}, {
	row: 26,
	place: [26, 0, 26, 5],
	content: ' 4.超成本必须有成本组书面批准报告',
	style: 5
}, {
	row: 23,
	place: [23, 6, 24, 6],
	content: '无代用\n无差异',
	style: 2
}, {
	row: 23,
	place: [23, 7, 23, 9],
	content: '有代用/差异',
	style: 2
}, {
	row: 24,
	place: [24, 7, 24, 7],
	content: '高于要求的代用',
	style: 2
}, {
	row: 24,
	place: [24, 8, 24, 8],
	content: '有差异',
	style: 2
}, {
	row: 24,
	place: [24, 9, 24, 9],
	content: '特别代用',
	style: 2
}, {
	row: 25,
	place: [25, 6, 26, 6],
	content: '',
	style: 2
}, {
	row: 25,
	place: [25, 7, 26, 7],
	content: '',
	style: 2
}, {
	row: 25,
	place: [25, 8, 26, 8],
	content: '',
	style: 2
}, {
	row: 25,
	place: [25, 9, 26, 9],
	content: '',
	style: 2
}, {
	row: 23,
	place: [23, 11, 26, 13],
	content: '以上价格都含17%增值税 ',
	style: 7
}];
var promiseDate = [ {
	row: 11,
	place: [11, 8, 11, 9],
	content: '',
	style: 2,
	name:'promised_date0',
	queryType:'F'
},{
	row: 11,
	place: [11, 10, 11, 11],
	content: '',
	style: 2,
	name:'promised_date1',
	queryType:'F'
},{
	row: 11,
	place: [11, 12, 11, 13],
	content: '',
	style: 2,
	name:'promised_date2',
	queryType:'F'
}];
var vendor=[ {
	row: 20,
	place: [20, 3, 21, 13],
	content: '同意供应商：【XXX（中标供应商名称，如有多个则拼接）】、具体见附件；\n张建新:同意      李道全:同意      杨加峰:同意      刘剑:    ',
	style: 3,
	name:'vendor_name_all',
	queryType:'F'
}];
/*
 **sheet页2
 **比价明细
*/
var sheet2Tile = [{
	row:0,
	place:[0,0,1,0],
	content:'序号',
	style:2,
	columnWidth:14
}, {
	row: 0,
	place: [0, 1, 1, 1],
	content: '要有\n试样 ',
	style: 2,
	columnWidth:10
}, {
	row: 0,
	place: [0, 2, 1, 2],
	content: '产品名称 ',
	style: 2,
	columnWidth:14
}, {
	row: 0,
	place: [0, 3, 1, 3],
	content: '规格 ',
	style: 2,
	columnWidth:14
},{
	row: 0,
	place: [0, 4, 1, 4],
	content: '物品说明',
	style: 2,
	columnWidth:14
}, {
	row: 0,
	place: [0, 5, 1, 5],
	content: '单位 ',
	style: 2,
	columnWidth:14
}, {
	row: 0,
	place: [0, 6, 1, 6],
	content: '数量 ',
	style: 2,
	columnWidth:14
}, {
	row: 0,
	place: [0, 7, 0, 8],
	content: '控制成本 ',
	style: 2
}, {
	row: 1,
	place: [1, 7, 1, 7],
	content: '单价 ',
	style: 2,
	columnWidth:12
}, {
	row: 1,
	place: [1, 8, 1, 8],
	content: '合价 ',
	style: 2,
	columnWidth:12
}];
/*, {
	row: 0,
	place: [0, 8, 0, 9],
	content: '无锡市法兰锻造 ',
	style: 2
}, {
	row: 1,
	place: [1, 8, 1, 8],
	content: '单价 ',
	style: 2,
	columnWidth:12
}, {
	row: 1,
	place: [1, 9, 1, 9],
	content: '价格 ',
	style: 2,
	columnWidth:12
}*/
var sheet2Data = [];
var sheet2Foot = [{
	row: 3,
	place: [3, 0, 3, 2],
	content: '合计',
	style: 2
},{
	row: 3,
	place: [3, 3, 3, 3],
	content: '',
	style: 2
},{
	row: 3,
	place: [3, 4, 3, 4],
	content: '',
	style: 2
},{
	row: 3,
	place: [3, 5, 3, 6],
	content: '总数量合计',
	style: 2,
	name:'total_count',
	queryType:'F'
}, {
	row: 3,
	place: [3, 7, 3, 8],
	content: '',
	style: 2,
	name:'total_price',
	queryType:'F'
}];
var sheet2Foot2 = [{
	row: 4,
	place: [4, 0, 4, 6],
	content: '',
	style: 2
},{
	row: 4,
	place: [4, 7, 4, 8],
	content: '',
	style: 2,
	name:'total_price',
	queryType:1
}];