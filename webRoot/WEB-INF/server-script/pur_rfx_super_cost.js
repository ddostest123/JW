var excelContent1 = [{
	row: 0,
	place: [0, 0, 0, 0],
	content: '记录\n编号',
	style: 1,
	columnWidth: 10,
	rowHeight:650
},{
	row: 0,
	place: [0, 1, 0, 1],
	content: '询报价单据号',
	style: 1,
	columnWidth: 24,
	name:'rfx_number',
	queryType:'F'
},{
	row: 0,
	place: [0, 2, 0, 8],
	content: ' SM   超成本采购申请/审批表',
	style: 0,
	columnWidth: 16
},{
	row: 0,
	place: [0, 9, 0, 9],
	content: '申请时间',
	style: 2,
	columnWidth: 16
},{
	row: 0,
	place: [0, 10, 0, 10],
	content: '申请人',
	style: 2,
	columnWidth: 16
},{
	row: 0,
	place: [0, 11, 0, 11],
	content: '部门负责人',
	style: 2,
	columnWidth: 16
},{
	row: 1,
	place: [1, 0, 1, 0],
	content: '采购\n部门',
	style: 1,
	rowHeight:550
},{
	row: 1,
	place: [1, 1, 1, 1],
	content: '采购中心',
	style: 2
},{
	row: 1,
	place: [1, 2, 1, 2],
	content: 'ERP\n组别',
	style: 1
},{
	row: 1,
	place: [1, 3, 1, 4],
	content: '采购申请行采购组',
	style: 2,
	name:'purchasing_agent_name',
	queryType:'F'
},{
	row: 1,
	place: [1, 5, 1, 5],
	content: '存档\n方式',
	style: 1,
	columnWidth:12
},{
	row: 1,
	place: [1, 6, 1, 7],
	content: '【原件】→经济审计科\n【复印】+【采购合同】→档案室',
	style: 3,
	columnWidth: 16
},{
	row: 1,
	place: [1, 8, 1, 8],
	content: '201502版',
	style: 2,
	columnWidth: 16
},{
	row: 1,
	place: [1, 9, 1, 9],
	content: '核价提交时间',
	style: 2,
	name:'submitted_date',
	queryType:'F'
},{
	row: 1,
	place: [1, 10, 1, 10],
	content: '询价员描述',
	style: 2,
	name:'description',
	queryType:'F'
},{
	row: 1,
	place: [1, 11, 1, 11],
	content: '',
	style: 2
},{
	row: 2,
	place: [2, 0, 2, 0],
	content: '项目\n名称',
	style: 1,
	rowHeight:550
},{
	row: 2,
	place: [2, 1, 2, 4],
	content: '询报价标题',
	style: 8,
	name:'title',
	queryType:'F'
},{
	row: 2,
	place: [2, 5, 2, 5],
	content: '工作\n令号',
	style: 1
},{
	row: 3,
	place: [3, 0, 4, 0],
	content: '申请\n原由',
	style: 1
},{
	row: 3,
	place: [3, 1, 4, 4],
	content: '',
	style: 8,
	name:'cost_comments',
	queryType:'F'
},{
	row: 3,
	place: [3, 5, 4, 5],
	content: '超成本\n因素',
	style: 1
},{
	row: 3,
	place: [3, 6, 3, 6],
	content: '□报价漏项',
	style: 9,
	rowHeight:320
},{
	row: 3,
	place: [3, 7, 3, 7],
	content: '□数量漏报',
	style: 9,
	columnWidth:16
},{
	row: 3,
	place: [3, 8, 3, 8],
	content: '□规格报错',
	style: 9
},{
	row: 3,
	place: [3, 9, 3, 9],
	content: '□增加要求',
	style: 9
},{
	row: 3,
	place: [3, 10, 3, 10],
	content: '□设计变更',
	style: 9
},{
	row: 3,
	place: [3, 11, 3, 11],
	content: '□工艺变更',
	style: 9
},{
	row: 4,
	place: [4, 6, 4, 6],
	content: '□市场涨价',
	style: 9,
	rowHeight:320
},{
	row: 4,
	place: [4, 7, 4, 7],
	content: '□代用',
	style: 9
},{
	row: 4,
	place: [4, 8, 4, 8],
	content: '□加急加价',
	style: 9
},{
	row: 4,
	place: [4, 9, 4, 9],
	content: '□项目追加',
	style: 9
},{
	row: 4,
	place: [4, 10, 4, 10],
	content: '□其他',
	style: 9
},{
	row: 4,
	place: [4, 11, 4, 11],
	content: '',
	style: 9
},{
	row: 5,
	place: [5, 0, 5, 4],
	content: '超成本核算表:   ﹡以下人民币金额均含17%增值税',
	style: 6,
	rowHeight:340
},{
	row: 5,
	place: [5, 5, 5, 5],
	content: '货币单位:',
	style: 2
},{
	row: 5,
	place: [5, 6, 5, 6],
	content: '□RMB/人民币',
	style: 3
},{
	row: 5,
	place: [5, 7, 5, 7],
	content: '□USD/美元',
	style: 3
},{
	row: 5,
	place: [5, 8, 5, 8],
	content: '□JPY/日元',
	style: 3
},{
	row: 5,
	place: [5, 9, 5, 9],
	content: '□EU/欧元',
	style: 3
},{
	row: 5,
	place: [5, 10, 5, 10],
	content: '□其他货币/',
	style: 3
},{
	row: 5,
	place: [5, 11, 5, 11],
	content: '汇率:',
	style: 6
},{
	row: 6,
	place: [6, 0, 7, 0],
	content: '序号',
	style: 2,
	rowHeight:330
},{
	row: 6,
	place: [6, 1, 7, 1],
	content: '产品名称',
	style: 2
},{
	row: 6,
	place: [6, 2, 7, 2],
	content: '规格',
	style: 2
},{
	row: 6,
	place: [6, 3, 7, 3],
	content: '单位',
	style: 2
},{
	row: 6,
	place: [6, 4, 7, 4],
	content: '数量',
	style: 2
},{
	row: 6,
	place: [6, 5, 6, 6],
	content: '控制成本',
	style: 2
},{
	row: 7,
	place: [7, 5, 7, 5],
	content: '单价',
	style: 2,
	rowHeight:430
},{
	row: 7,
	place: [7, 6, 7, 6],
	content: '合价',
	style: 2
},{
	row: 6,
	place: [6, 7, 6, 8],
	content: '超成本申请',
	style: 2
},{
	row: 7,
	place: [7, 7, 7, 7],
	content: '单价',
	style: 2,
	rowHeight:550
},{
	row: 7,
	place: [7, 8, 7, 8],
	content: '合价',
	style: 2
},{
	row: 6,
	place: [6, 9, 6, 10],
	content: '超成本比例',
	style: 2
},{
	row: 7,
	place: [7, 9, 7, 9],
	content: '金额',
	style: 2
},{
	row: 7,
	place: [7, 10, 7, 10],
	content: '%',
	style: 2
},{
	row: 6,
	place: [6, 11, 6, 11],
	content: '经济审计科建议',
	style: 2
},{
	row: 7,
	place: [7, 11, 7, 11],
	content: '不高于如下\n金额采购',
	style: 1
}];
var excelContent2 = [{
	row: 2,
	place: [2, 6, 2, 11],
	content: '行工作令号拼接',
	style: 8,
	name:'work_num',
	queryType:'P3'
},{
	row: 1,
	place: [1, 3, 1, 4],
	content: '采购申请行采购组',
	style: 2,
	name:'purchasing_agent_name',
	queryType:'F'
}
];
var excelData = [{
	row: 8,
	place: [8, 0, 8, 0],
	content: '1',
	style: 2,
	rowHeight:350
}];
var totalData = [               
{
	row: 9,
	place: [9, 3, 9, 4],
	content: '总数量合计',
	style: 7,
	name:'total_count',
	queryType:'F'
},{
	row: 9,
	place: [9, 5, 9, 6],
	content: '￥0.00',
	style: 10,
	name:'total_costs',
	queryType:'F'
},{
	row: 9,
	place: [9, 7, 9, 8],
	content: '￥0.00',
	style: 10,
	name:'account_total_costs',
	queryType:'F'
},{
	row: 9,
	place: [9, 9, 9, 10],
	content: '',
	style: 10,
	name:'exceed_money',
	queryType:'F'
},{
	row: 9,
	place: [9, 11, 9, 11],
	content: '',
	style: 10,
	name:'approved_amount',
	queryType:'F'
}];
var excelFoot = [{
	row: 9,
	place: [9, 0, 9, 2],
	content: '合计   ﹡外贸进口必须注明贸易方式',
	style: 6,
	rowHeight:350
},{
	row: 10,
	place: [10, 0, 10, 1],
	content: '超成本审批意见:',
	style: 7,
	rowHeight:350
},{
	row: 10,
	place: [10, 2, 10, 6],
	content: '',
	style: 7
},{
	row: 10,
	place: [10, 7, 10, 10],
	content: '﹡其他货币折算成相当的人民币',
	style: 2
},{
	row: 10,
	place: [10, 11, 10, 11],
	content: '单位:RMB/元',
	style: 2
},{
	row: 11,
	place: [11, 0, 14, 2],
	content: '处理意见:\n前4个节点工作流审批人及意见',
	style: 3,
	name:'comment_text',
	queryType:'P2'
},{
	row: 11,
	place: [11, 3, 11, 4],
	content: '合价超成本金额',
	style: 2,
	rowHeight:350
},{
	row: 11,
	place: [11, 5, 11, 5],
	content: '≤5000',
	style: 2
},{
	row: 11,
	place: [11, 6, 11, 6],
	content: '≥5,000',
	style: 2
},{
	row: 11,
	place: [11, 7, 11, 7],
	content: '≥10,000',
	style: 2
},{
	row: 11,
	place: [11, 8, 11, 8],
	content: '≥10,000',
	style: 2
},{
	row: 11,
	place: [11, 9, 11, 9],
	content: '',
	style: 2
},{
	row: 11,
	place: [11, 10, 11, 10],
	content: '≥100,000',
	style: 2
},{
	row: 11,
	place: [11, 11, 11, 11],
	content: '≥300,000',
	style: 2
},{
	row: 12,
	place: [12, 3, 12, 4],
	content: '或,超成本比例',
	style: 2,
	rowHeight:350
},{
	row: 12,
	place: [12, 5, 12, 5],
	content: '≤20%',
	style: 2
},{
	row: 12,
	place: [12, 6, 12, 6],
	content: '≥20%',
	style: 2
},{
	row: 12,
	place: [12, 7, 12, 7],
	content: '≥30%',
	style: 2
},{
	row: 12,
	place: [12, 8, 12, 8],
	content: '≥30%',
	style: 2
},{
	row: 12,
	place: [12, 9, 12, 9],
	content: '',
	style: 2
},{
	row: 12,
	place: [12, 10, 12, 10],
	content: '≥100%',
	style: 2
},{
	row: 12,
	place: [12, 11, 12, 11],
	content: '≥200%',
	style: 2
},{
	row: 13,
	place: [13, 3, 13, 4],
	content: '审批权限',
	style: 2,
	rowHeight:520
},{
	row: 13,
	place: [13, 5, 13, 5],
	content: '各部自\n行审批',
	style: 2
},{
	row: 13,
	place: [13, 6, 13, 6],
	content: '采购中心分管副总\n(或相当)',
	style: 2
},{
	row: 13,
	place: [13, 7, 13, 7],
	content: '经济审计科科长',
	style: 2
},{
	row: 13,
	place: [13, 8, 13, 8],
	content: '销售部\n报价主管',
	style: 2
},{
	row: 13,
	place: [13, 9, 13, 9],
	content: '销售部领导\n会签',
	style: 2
},{
	row: 13,
	place: [13, 10, 13, 10],
	content: '经审科分管副总(或相当)',
	style: 2
},{
	row: 13,
	place: [13, 11, 13, 11],
	content: '总经理',
	style: 2
},{
	row: 14,
	place: [14, 3, 14, 4],
	content: '审批权限人签章',
	style: 2,
	rowHeight:350
},{
	row: 14,
	place: [14, 5, 14, 5],
	content: '李道全',
	style: 2
},{
	row: 14,
	place: [14, 6, 14, 6],
	content: '张建新',
	style: 2
},{
	row: 14,
	place: [14, 7, 14, 7],
	content: '许文娟',
	style: 2
},{
	row: 14,
	place: [14, 8, 14, 8],
	content: '徐胡明',
	style: 2
},{
	row: 14,
	place: [14, 9, 14, 9],
	content: '',
	style: 2
},{
	row: 14,
	place: [14, 10, 14, 10],
	content: '',
	style: 2
},{
	row: 14,
	place: [14, 11, 14, 11],
	content: '',
	style: 2
},{
	row: 15,
	place: [15, 0, 15, 11],
	content: '﹡超成本≥100,000RMB/元;需同时向财务科备案',
	style: 6,
	rowHeight:400
}];