importClass(java.io.FileOutputStream);
importClass(java.io.File);
importClass(java.io.FileInputStream);
importClass(java.nio.charset.Charset);
importClass(java.awt.Color);
//importClass(com.itextpdf.text.Document);
importClass(com.itextpdf.text.pdf.PdfWriter);
importClass(com.itextpdf.text.Paragraph);
importClass(com.itextpdf.text.pdf.BaseFont);
importClass(com.itextpdf.text.Font);
importClass(com.itextpdf.text.pdf.PdfPCell);
importClass(com.itextpdf.text.pdf.PdfPTable);
importClass(com.itextpdf.text.BaseColor);
//importClass(com.itextpdf.text.Element);
importClass(com.itextpdf.text.Image);
importClass(com.itextpdf.text.PageSize);
importClass(com.itextpdf.text.pdf.PdfContentByte);
importClass(com.itextpdf.text.pdf.PdfReader);
importClass(com.itextpdf.text.pdf.PdfStamper);
importClass(com.itextpdf.text.pdf.draw.LineSeparator);
importClass(javax.servlet.http.HttpServlet);
importClass(javax.servlet.http.HttpServletRequest);
importClass(Packages.aurora.service.ServiceInstance);
importPackage(com.itextpdf.text.pdf.fonts);
importPackage(java.lang);

var dsf = $instance("aurora.database.service.IDatabaseServiceFactory");
// var logger = $logger('server-script');

// 获取 context 中的 parameter 节点，后续写入文档路径，供前台 JS 调用
var parameter = $ctx.parameter;

// 设置字体，中文显示需要引入 itext-asian.jar
var baseFont = BaseFont.createFont('STSong-Light', 'UniGB-UCS2-H',
		BaseFont.NOT_EMBEDDED);

var survey_type_code;

// 设置字号
var fontChinese = new Font(baseFont, 10, Font.NORMAL);
var fontSubTitle = new Font(baseFont, 10, Font.BOLD);
var fontChineseBold = new Font(baseFont, 12, Font.BOLD);
var fontChineseBig = new Font(baseFont, 20, Font.BOLD);

function isEmpty(obj) {
	for ( var name in obj) {
		return false;
	}
	return true;
}

function setPdfTableCell(content, width, datatable, font) {
	var cell = new PdfPCell(new Paragraph(content, font));
	cell.setColspan(width);
	cell.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
	datatable.addCell(cell);
}

function getValue(value, back) {
	if (typeof (value) == 'undefined') {
		if (typeof (back) == 'undefined') {
			return '';
		} else {
			return String(back);
		}
	}

	if (value == 'Y') {
		return '是';
	}

	if (value == 'N') {
		return '否';
	}

	return String(value);
}

function addTitle(surveyDocument, title) {
	var p = new Paragraph(title, fontChineseBold);
	p.setSpacingBefore(10);
	p.setSpacingAfter(10);
	surveyDocument.add(p);

}

function addSubTitle(surveyDocument, title) {
	var p = new Paragraph(title, fontSubTitle);
	p.setSpacingAfter(10);
	p.setSpacingBefore(10);
	p.setFirstLineIndent(30);
	surveyDocument.add(p);

}

function addUnderLine(surveyDocument) {
	var underline = new LineSeparator();
	underline.setOffset(1);
	surveyDocument.add(underline);
}

function addSubUnderLine(surveyDocument) {
	var underline = new LineSeparator();
	underline.setOffset(1);
	underline.setPercentage(90);
	surveyDocument.add(underline);
}

function addTableRow(table, content, column, cell, font) {
	var colSpanCount = 1;

	// 行中有合并单元格的字段
	if (column != cell) {

		// 一行只显示一个字段信息
		if (column == 2) {
			colSpanCount = cell - 1;
		} else {
			colSpanCount = cell / column + 1;
		}
	}

	for (var i = 0; i < column; i++) {
		var cell = new PdfPCell(new Paragraph(content[i], font));
		cell.setBorderWidth(0);
		if (i % 2 == 1) {
			cell.setColspan(colSpanCount);
			cell.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
		} else {
			cell.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_RIGHT);
		}
		table.addCell(cell);
	}
}

function addHeaderRow(surveyDocument, content, columns, cells, widthPercentage) {

	// 设置无边框的表格，并填充元素
	var headerTable = new PdfPTable(cells);
	headerTable.setWidthPercentage(widthPercentage);
	headerTable.getDefaultCell().setBackgroundColor(BaseColor.WHITE);

	for (var i = 0; i < columns; i++) {
		var cell = new PdfPCell(new Paragraph(content[i], fontChinese));
		cell.setBorderWidth(0);
		if (i % 2 == 1) {
			cell.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
		} else {
			cell.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_RIGHT);
		}

		if (columns == 2) {
			if (i == 1) {
				cell.setColspan(cells - 1);
			}
		}

		if (columns == 4) {
			if (i == 3) {
				cell.setColspan(cells - 3);
			}
		}

		headerTable.addCell(cell);
	}
	surveyDocument.add(headerTable);
}

function addBasicInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();

	if (!isEmpty(datas)) {

		survey_type_code = getValue(datas[0].survey_type_code);
		println(survey_type_code);
		// 设置数据
		var header1 = [ '调查表编号:', getValue(datas[0].survey_number), '调查表类型:',
				getValue(datas[0].survey_type_desc), '状态:',
				getValue(datas[0].status_desc) ];
		var header2 = [ '公司代码:', getValue(datas[0].company_code), '公司名称:',
				getValue(datas[0].company_name) ];
		var header3 = [ '创建人:', getValue(datas[0].created_by_desc), '创建日期:',
				getValue(datas[0].creation_date), '提交日期:',
				getValue(datas[0].submit_date) ];
		var header4 = [ '说明:', getValue(datas[0].survey_description) ];
		var header5 = [ '备注:', getValue(datas[0].survey_comment) ];

		// 设置标题和分割线
		addTitle(surveyDocument, '基本信息');
		addUnderLine(surveyDocument);

		// 按行添加数据
		addHeaderRow(surveyDocument, header1, 6, 6, 100);
		addHeaderRow(surveyDocument, header2, 4, 6, 100);
		addHeaderRow(surveyDocument, header3, 6, 6, 100);
	}
}

// 供应商信息
function addVendorInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();
	var basic = $ctx.model.getChild("basic").getChildren();

	if (!isEmpty(datas) && !isEmpty(basic)) {

		// 设置格式
		var vendor1 = [ '供应商编码:', getValue(datas[0].vendor_code), '供应商名称:',
				getValue(datas[0].vendor_name) ];
		var vendor2 = [ '供应商简称:', getValue(datas[0].vendor_short_name),
				'供应商英文名:', getValue(datas[0].c_attribute1), '纳税人类型:',
				getValue(datas[0].c_attribute2) ];

		// 设备工程
		var vendor4 = [ '成立时间:', getValue(basic[0].c_attribute3), '注册资金:',
				getValue(basic[0].c_attribute4), '年营业额（万）:',
				getValue(basic[0].annual_turnover) ];
		var vendor5 = [ '人数:', getValue(basic[0].person_nums) ];

		// 供应商问卷调查
		var vendor6 = [ '业务负责人:', getValue(basic[0].business_leader), '文件编号:',
				getValue(basic[0].document_num), '是否上市:',
				getValue(basic[0].listed_flag) ];
		var vendor7 = [ '股票代码:', getValue(basic[0].stock_code) ];
		if (survey_type_code == '10_MANUFACTURER'
				|| survey_type_code == '50_LOGISTICS') {
			// 设置标题和分割线
			addTitle(surveyDocument, '供应商信息');
			addUnderLine(surveyDocument);

			// 按行添加数据
			addHeaderRow(surveyDocument, vendor1, 4, 6, 100);
			addHeaderRow(surveyDocument, vendor2, 6, 6, 100);
		} else if (survey_type_code == '30_EQUIPMENT') {
			// 设置标题和分割线
			addTitle(surveyDocument, '供应商信息');
			addUnderLine(surveyDocument);

			// 按行添加数据
			addHeaderRow(surveyDocument, vendor1, 4, 6, 100);
			// addHeaderRow(surveyDocument, vendor4, 6, 6, 100);
			addHeaderRow(surveyDocument, vendor5, 2, 6, 100);
		} else if (survey_type_code == '40_BIDIRECTIONAL') {
			// 设置标题和分割线
			addTitle(surveyDocument, '供应商信息');
			addUnderLine(surveyDocument);

			// 按行添加数据
			addHeaderRow(surveyDocument, vendor1, 4, 6, 100);
			addHeaderRow(surveyDocument, vendor6, 6, 6, 100);
			addHeaderRow(surveyDocument, vendor7, 2, 6, 100);
		}

	}

}

// 企业信息
function addCompanyInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("basic").getChildren();

	if (!isEmpty(datas)) {
		if (survey_type_code == '30_EQUIPMENT') {
			var company1_1 = [ '成立时间:', getValue(datas[0].c_attribute3),
					'注册资金:', getValue(datas[0].c_attribute4), '董事长:',
					getValue(datas[0].chairman_board) ];
			var company1_2 = [ '总经理:', getValue(datas[0].general_manager),
					'公司网站:', getValue(datas[0].c_attribute5), '年营业额:',
					getValue(datas[0].annual_turnover) ];
			var company1_2_1 = [ '第一大股东姓名:',
					getValue(datas[0].first_stock_name), '第一大股东股份占比(%):',
					getValue(datas[0].first_stock_percent), '第二大股东姓名:',
					getValue(datas[0].sec_stock_name) ];
			var company1_2_2 = [ '第二大股东股份占比(%):',
					getValue(datas[0].sec_stock_percent) ];
			var company1_3 = [ '是否上市:', getValue(datas[0].listed_flag),
					'上市地点:', getValue(datas[0].listed_place), '上市时间:',
					getValue(datas[0].listed_date) ];
			var company2_1 = [ '员工数量:', getValue(datas[0].staff_count),
					'管理人员数:', getValue(datas[0].management_staff_count),
					'技术人员数:', getValue(datas[0].technical_staff_count) ];

			var company2_1_1 = [ '员工数量:', getValue(datas[0].staff_count),
					'管理人员数:', getValue(datas[0].management_staff_count),
					'监督人员数量:', getValue(datas[0].inspector_nums) ];
			var company2_2 = [ '质量人员数:', getValue(datas[0].c_attribute14),
					'是否有研发部:', getValue(datas[0].rd_flag), '研发人员数:',
					getValue(datas[0].rd_staff_count) ];
			var company2_2_1 = [ '操作人员数量:', getValue(datas[0].operator_nums),
					'是否有研发部:', getValue(datas[0].rd_flag), '研发人员数:',
					getValue(datas[0].rd_staff_count) ];
			var company2_3 = [ '生产人员数:',
					getValue(datas[0].production_staff_count), '建筑面积:',
					getValue(datas[0].building_area) ];
			var company2_3_1 = [ '司机人数:', getValue(datas[0].driver_nums),
					'建筑面积:', getValue(datas[0].building_area) ];
			var company2_4 = [ '技能培训:', getValue(datas[0].c_attribute6) ];
			var company3_1 = [ '税率:', getValue(datas[0].tax_type_name), '币种:',
					getValue(datas[0].c_attribute15), '付款方式:',
					getValue(datas[0].payment_method_name) ];
			var company3_1_1 = [ '账期(天):',
					getValue(datas[0].account_period_desc), '交货提前期(天):',
					getValue(datas[0].delivery_time) ];
			var company3_2 = [ '是否签署保密协议:', getValue(datas[0].c_attribute7) ];
			var company3_3 = [ '是否接受商业承兑:', getValue(datas[0].c_attribute8),
					'可接受的付款进度及比例:', getValue(datas[0].c_attribute9) ];
			var company3_4 = [ '质保期:', getValue(datas[0].c_attribute10),
					'质保金比例及结算周期:', getValue(datas[0].c_attribute11) ];
			var company3_5 = [ '物料成本结构:', getValue(datas[0].c_attribute12) ];
			var company3_6 = [ '成本控制措施与优化计划:', getValue(datas[0].c_attribute13) ];
			var company4_1 = [ '行业排名:', getValue(datas[0].industry_ranks_desc),
					'其他:', getValue(datas[0].others) ];
			var company4_2 = [ '国际同行前五:', getValue(datas[0].international_top5) ];
			var company4_3 = [ '国内同行前五:', getValue(datas[0].domestic_top5) ];

			// 设置标题和分割线
			addTitle(surveyDocument, '企业信息');
			addUnderLine(surveyDocument);

			addSubTitle(surveyDocument, '经营状况');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, company1_1, 6, 6, 80);
			addHeaderRow(surveyDocument, company1_2, 6, 6, 80);

			addHeaderRow(surveyDocument, company1_2_1, 6, 6, 80);
			addHeaderRow(surveyDocument, company1_2_2, 2, 6, 80);

			addHeaderRow(surveyDocument, company1_3, 6, 6, 80);

			addSubTitle(surveyDocument, '公司规模');
			addSubUnderLine(surveyDocument);

			addHeaderRow(surveyDocument, company2_1, 6, 6, 80);
			addHeaderRow(surveyDocument, company2_2, 6, 6, 80);
			addHeaderRow(surveyDocument, company2_3, 4, 6, 80);

			addHeaderRow(surveyDocument, company2_4, 2, 6, 80);

			// addSubTitle(surveyDocument, '商务/成本');
			// addSubUnderLine(surveyDocument);
			// addHeaderRow(surveyDocument, company3_1, 6, 6, 80);
			// addHeaderRow(surveyDocument, company3_1_1, 4, 6, 80);
			// // addHeaderRow(surveyDocument, company3_2, 2, 6, 80);
			// addHeaderRow(surveyDocument, company3_3, 4, 6, 80);
			// addHeaderRow(surveyDocument, company3_4, 4, 6, 80);
			// addHeaderRow(surveyDocument, company3_5, 2, 6, 80);
			// addHeaderRow(surveyDocument, company3_6, 2, 6, 80);

			addSubTitle(surveyDocument, '整体实力');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, company4_1, 4, 6, 80);
			addHeaderRow(surveyDocument, company4_2, 2, 6, 80);
			addHeaderRow(surveyDocument, company4_3, 2, 6, 80);
		} else if (survey_type_code == '40_BIDIRECTIONAL') {
			var company5_1 = [ '我司物料编号:', getValue(datas[0].la_material_num),
					'物料名称:', getValue(datas[0].la_material_name), '物料规格:',
					getValue(datas[0].la_material_size) ];
			var company6_1 = [ 'Top1客户:', getValue(datas[0].top_customer1),
					'Top2客户:', getValue(datas[0].top_customer2), 'Top3客户:',
					getValue(datas[0].top_customer3) ];
			var company6_2 = [ 'Top4客户:', getValue(datas[0].top_customer4),
					'Top5客户:', getValue(datas[0].top_customer5) ];
			var company6_3 = [ '异常说明:',
					getValue(datas[0].exception_description) ];
			var company7_1 = [ '贵司年度平均利润率:',
					getValue(datas[0].you_annual_profit), '贵司年度总销售:',
					getValue(datas[0].you_annual_sales), '我司产品平均利润率:',
					getValue(datas[0].our_product_profit) ];
			var company7_2 = [ '我司年度销售额:', getValue(datas[0].our_annual_sales),
					'我司产品利润率区间:', getValue(datas[0].our_profit_range),
					'我司年度销售占比', getValue(datas[0].our_annual_sales_ratio) ];
			var company7_3 = [ '我司销售额在客户中排名:', getValue(datas[0].our_rank) ];
			var company8_1 = [ '员工总数:', getValue(datas[0].c_attribute45),
					'销售人员:', getValue(datas[0].c_attribute46), '管理人员',
					getValue(datas[0].c_attribute47) ];
			var company8_2 = [ '生产人员:', getValue(datas[0].c_attribute48),
					'品管人员:', getValue(datas[0].c_attribute49), '技术人员',
					getValue(datas[0].c_attribute50) ];
			var company9_1 = [ '行情预测:', getValue(datas[0].prediction_comments) ];
			var company9_2 = [ '未来期望:', getValue(datas[0].expect_comments) ];
			var company9_3 = [ '期望协助:', getValue(datas[0].assist_comments) ];

			// 设置标题和分割线
			addTitle(surveyDocument, '企业信息');
			addUnderLine(surveyDocument);

			addSubTitle(surveyDocument, '价格对标（物料）');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, company5_1, 6, 6, 80);

			addSubTitle(surveyDocument, '价格对标（最新售价（含税））');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, company6_1, 6, 6, 80);
			addHeaderRow(surveyDocument, company6_2, 4, 6, 80);
			addHeaderRow(surveyDocument, company6_3, 2, 6, 80);

			addSubTitle(surveyDocument, '公司人员构成');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, company8_1, 6, 6, 80);
			addHeaderRow(surveyDocument, company8_2, 6, 6, 80);

			addSubTitle(surveyDocument, '其他信息');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, company9_1, 2, 6, 80);
			addHeaderRow(surveyDocument, company9_2, 2, 6, 80);
			addHeaderRow(surveyDocument, company9_3, 2, 6, 80);
		} else {
			var company1_1 = [ '成立时间:', getValue(datas[0].c_attribute3),
					'注册资金:', getValue(datas[0].c_attribute4), '董事长:',
					getValue(datas[0].chairman_board) ];
			var company1_2 = [ '总经理:', getValue(datas[0].general_manager),
					'公司网站:', getValue(datas[0].c_attribute5), '年营业额:',
					getValue(datas[0].annual_turnover) ];
			var company1_2_1 = [ '第一大股东姓名:',
					getValue(datas[0].first_stock_name), '第一大股东股份占比(%):',
					getValue(datas[0].first_stock_percent), '第二大股东姓名:',
					getValue(datas[0].sec_stock_name) ];
			var company1_2_2 = [ '第二大股东股份占比(%):',
					getValue(datas[0].sec_stock_percent) ];
			var company1_3 = [ '是否上市:', getValue(datas[0].listed_flag),
					'上市地点:', getValue(datas[0].listed_place), '上市时间:',
					getValue(datas[0].listed_date) ];
			var company2_1 = [ '员工数量:', getValue(datas[0].staff_count),
					'管理人员数:', getValue(datas[0].management_staff_count),
					'技术人员数:', getValue(datas[0].technical_staff_count) ];

			var company2_1_1 = [ '员工数量:', getValue(datas[0].staff_count),
					'管理人员数:', getValue(datas[0].management_staff_count),
					'监督人员数量:', getValue(datas[0].inspector_nums) ];
			var company2_2 = [ '质量人员数:', getValue(datas[0].c_attribute14),
					'是否有研发部:', getValue(datas[0].rd_flag), '研发人员数:',
					getValue(datas[0].rd_staff_count) ];
			var company2_2_1 = [ '操作人员数量:', getValue(datas[0].operator_nums),
					'是否有研发部:', getValue(datas[0].rd_flag), '研发人员数:',
					getValue(datas[0].rd_staff_count) ];
			var company2_3 = [ '生产人员数:',
					getValue(datas[0].production_staff_count), '建筑面积:',
					getValue(datas[0].building_area) ];
			var company2_3_1 = [ '司机人数:', getValue(datas[0].driver_nums),
					'建筑面积:', getValue(datas[0].building_area) ];
			var company2_4 = [ '技能培训:', getValue(datas[0].c_attribute6) ];
			var company3_1 = [ '税率:', getValue(datas[0].tax_type_name), '币种:',
					getValue(datas[0].c_attribute15), '付款方式:',
					getValue(datas[0].payment_method_name) ];
			var company3_1_1 = [ '账期(天):',
					getValue(datas[0].account_period_desc), '交货提前期(天):',
					getValue(datas[0].delivery_time) ];
			var company3_2 = [ '是否签署保密协议:', getValue(datas[0].c_attribute7) ];
			var company3_3 = [ '是否接受商业承兑:', getValue(datas[0].c_attribute8),
					'可接受的付款进度及比例:', getValue(datas[0].c_attribute9) ];
			var company3_4 = [ '质保期:', getValue(datas[0].c_attribute10),
					'质保金比例及结算周期:', getValue(datas[0].c_attribute11) ];
			var company3_5 = [ '物料成本结构:', getValue(datas[0].c_attribute12) ];
			var company3_6 = [ '成本控制措施与优化计划:', getValue(datas[0].c_attribute13) ];
			var company4_1 = [ '行业排名:', getValue(datas[0].industry_ranks_desc),
					'其他:', getValue(datas[0].others) ];
			var company4_2 = [ '国际同行前五:', getValue(datas[0].international_top5) ];
			var company4_3 = [ '国内同行前五:', getValue(datas[0].domestic_top5) ];

			// 设置标题和分割线
			addTitle(surveyDocument, '企业信息');
			addUnderLine(surveyDocument);

			addSubTitle(surveyDocument, '经营状况');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, company1_1, 6, 6, 80);
			addHeaderRow(surveyDocument, company1_2, 6, 6, 80);
			if (survey_type_code == '10_MANUFACTURER') {
				addHeaderRow(surveyDocument, company1_2_1, 6, 6, 80);
				addHeaderRow(surveyDocument, company1_2_2, 2, 6, 80);
			}
			addHeaderRow(surveyDocument, company1_3, 6, 6, 80);

			addSubTitle(surveyDocument, '公司规模');
			addSubUnderLine(surveyDocument);
			if (survey_type_code == '10_MANUFACTURER') {
				addHeaderRow(surveyDocument, company2_1, 6, 6, 80);
				addHeaderRow(surveyDocument, company2_2, 6, 6, 80);
				addHeaderRow(surveyDocument, company2_3, 4, 6, 80);
			} else if (survey_type_code == '50_LOGISTICS') {
				addHeaderRow(surveyDocument, company2_1_1, 6, 6, 80);
				addHeaderRow(surveyDocument, company2_2_1, 6, 6, 80);
				addHeaderRow(surveyDocument, company2_3_1, 4, 6, 80);
			}

			addHeaderRow(surveyDocument, company2_4, 2, 6, 80);

			addSubTitle(surveyDocument, '商务/成本');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, company3_1, 6, 6, 80);
			addHeaderRow(surveyDocument, company3_1_1, 4, 6, 80);
			// addHeaderRow(surveyDocument, company3_2, 2, 6, 80);
			addHeaderRow(surveyDocument, company3_3, 4, 6, 80);
			addHeaderRow(surveyDocument, company3_4, 4, 6, 80);
			addHeaderRow(surveyDocument, company3_5, 2, 6, 80);
			addHeaderRow(surveyDocument, company3_6, 2, 6, 80);

			addSubTitle(surveyDocument, '整体实力');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, company4_1, 4, 6, 80);
			addHeaderRow(surveyDocument, company4_2, 2, 6, 80);
			addHeaderRow(surveyDocument, company4_3, 2, 6, 80);
		}
	}
}

// 业务信息
function addBusinessInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("business").getChildren();

	if (!isEmpty(datas)) {
		var business0_1 = [ '与我司首次联系人:', getValue(datas[0].first_contact),
				'联系方式:', getValue(datas[0].contact_way), '联系时间:',
				getValue(datas[0].contact_date) ];
		var business1_1 = [ '是否入场检验:',
				getValue(datas[0].incoming_inspection_flag), '是否出厂检验:',
				getValue(datas[0].ex_factory_inspection_flag), '生产过程检验:',
				getValue(datas[0].production_inspection_flag) ];
		var business1_2 = [ '检验机构:', getValue(datas[0].inspection_agency),
				'检验人数:', getValue(datas[0].inspection_staffcount) ];
		var business1_3 = [ '质量重点控制工序介绍:',
				getValue(datas[0].qulity_keypoint_control_desc) ];
		var business2_1 = [ '每周工作天数:',
				getValue(datas[0].working_days_per_week), '每天工作班次:',
				getValue(datas[0].working_shifts_per_day), '每天工作时数:',
				getValue(datas[0].working_hours_per_day) ];
		var business2_2 = [ '生产负荷:',
				getValue(datas[0].current_production_load), '总产能:',
				getValue(datas[0].c_attribute11), '产能利用率:',
				getValue(datas[0].c_attribute12) ];
		var business2_3 = [ '旺季月份:', getValue(datas[0].busy_season), '淡季月份:',
				getValue(datas[0].off_season) ];
		var business2_4 = [ '加工工艺:', getValue(datas[0].c_attribute13), ];
		var business2_5 = [ '样品制作能力:', getValue(datas[0].c_attribute14), ];

		var business6_1 = [ '打样周期(天):', getValue(datas[0].pull_cycle),
				'首份订单交货周期(天):', getValue(datas[0].first_order_del_cycle),
				'正常业务交货周期(天):', getValue(datas[0].normal_business_del_cycle) ];
		var business6_2 = [ '是否有最小生产批量:', getValue(datas[0].min_lot_size_flag),
				'最小生产批量:', getValue(datas[0].min_lot_size), '确认订单的时间(小时):',
				getValue(datas[0].confrim_order_time) ];
		var business6_3 = [ '采用了哪些软件系统:', ' SAP:', getValue(datas[0].sap),
				'ORACLE:', getValue(datas[0].oracle), '金蝶:',
				getValue(datas[0].jindie) ];
		var business6_4 = [ '用友:', getValue(datas[0].yongyou), '其他:',
				getValue(datas[0].others) ];
		var business6_5 = [ '外发工序是哪些部分？:',
				getValue(datas[0].going_process_part) ];
		var business6_6 = [ '主要工序能力:',
				getValue(datas[0].major_process_capacity) ];
		var business6_7 = [ '主要设备及检测仪器:', getValue(datas[0].major_equipment) ];

		var business3_1 = [ '空运:', getValue(datas[0].air_transport_flag),
				'海运:', getValue(datas[0].sea_transport_flag), '陆运:',
				getValue(datas[0].land_transport_flag) ];
		var business3_2 = [ '海关港口:', getValue(datas[0].c_attribute1), '供货周期:',
				getValue(datas[0].c_attribute2), '交货及时率:',
				getValue(datas[0].c_attribute3) ];
		var business3_3 = [ '包装方式/标识:', getValue(datas[0].c_attribute4), ];
		var business4_1 = [ '保修期:', getValue(datas[0].warranty_date),
				'可否现场维修:', getValue(datas[0].field_maintenance_flag), '响应时间:',
				getValue(datas[0].c_attribute5) ];
		var business4_2 = [ '售后服务网点数:',
				getValue(datas[0].service_network_count), '服务网点地址:',
				getValue(datas[0].service_network_address) ];
		var business4_3 = [ '是否提供备货或库存预留:', getValue(datas[0].c_attribute6),
				'是否支持寄售:', getValue(datas[0].c_attribute7), '是否提供技术支持:',
				getValue(datas[0].c_attribute8) ];
		var business4_4 = [ '保险类型/公司/单号:', getValue(datas[0].c_attribute7) ];
		var business4_5 = [ '其他服务支持:', getValue(datas[0].c_attribute8) ];

		// 贸易类
		var business5_1 = [ '是否有授权:', getValue(datas[0].authorized_flag) ];
		var business5_2 = [ '主要分销渠道:',
				getValue(datas[0].main_distribution_channel) ];
		// 设备工程类
		var business7_1 = [ '是否收费:', getValue(datas[0].charge_flag), '售后收费标准:',
				getValue(datas[0].charge_standard), '备注:',
				getValue(datas[0].comments) ];

		var business7_2 = [ '行业排名:', getValue(datas[0].industry_ranks_desc) ];
		var business7_3 = [ '主要竞争对手:', getValue(datas[0].main_competitor) ];
		// 物流
		var business8_1 = [ '是否有长期合同商车辆:',
				getValue(datas[0].contractor_vehicle_flag), '是否有临时租用车辆:',
				getValue(datas[0].temporary_vehicle_flag) ];
		var business8_2 = [ '操作员年流失率（%）:',
				getValue(datas[0].operator_wastage_rate), '管理人员年流失率（%）:',
				getValue(datas[0].manager_wastage_rate), '司机年流失率（%）:',
				getValue(datas[0].dirver_wastage_rate) ];
		// 设置标题和分割线
		addTitle(surveyDocument, '业务信息');
		addUnderLine(surveyDocument);

		// 内容
		if (survey_type_code == '10_MANUFACTURER') {
			addSubTitle(surveyDocument, '联系人');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business0_1, 6, 6, 80);
			addSubTitle(surveyDocument, '质量保障');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business1_1, 6, 6, 80);
			addHeaderRow(surveyDocument, business1_2, 4, 6, 80);
			addHeaderRow(surveyDocument, business1_3, 2, 6, 80);
			addSubTitle(surveyDocument, '生产能力');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business2_1, 6, 6, 80);
			addHeaderRow(surveyDocument, business2_2, 6, 6, 80);
			addHeaderRow(surveyDocument, business2_3, 4, 6, 80);
			addHeaderRow(surveyDocument, business2_4, 2, 6, 80);
			addHeaderRow(surveyDocument, business2_5, 2, 6, 80);
			addSubTitle(surveyDocument, '生产信息');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business6_1, 6, 6, 80);
			addHeaderRow(surveyDocument, business6_2, 6, 6, 80);
			addHeaderRow(surveyDocument, business6_3, 6, 6, 80);
			addHeaderRow(surveyDocument, business6_4, 4, 6, 80);
			addSubTitle(surveyDocument, '生产技术/工艺水平/工程能力');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business6_5, 2, 6, 80);
			addHeaderRow(surveyDocument, business6_6, 2, 6, 80);
			addHeaderRow(surveyDocument, business6_7, 2, 6, 80);

			addSubTitle(surveyDocument, '货运方式');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business3_1, 6, 6, 80);
			addHeaderRow(surveyDocument, business3_2, 6, 6, 80);
			addHeaderRow(surveyDocument, business3_3, 2, 6, 80);
			addSubTitle(surveyDocument, '售后服务');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business4_1, 6, 6, 80);
			addHeaderRow(surveyDocument, business4_2, 4, 6, 80);
			addHeaderRow(surveyDocument, business4_3, 6, 6, 80);
			addHeaderRow(surveyDocument, business4_4, 2, 6, 80);
			addHeaderRow(surveyDocument, business4_5, 2, 6, 80);
		} else if (survey_type_code == '30_EQUIPMENT') {
			addSubTitle(surveyDocument, '联系人');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business0_1, 6, 6, 80);
			// addSubTitle(surveyDocument, '售后服务');
			// addSubUnderLine(surveyDocument);
			// addHeaderRow(surveyDocument, business7_1, 6, 6, 80);
			addSubTitle(surveyDocument, '整体实力');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business7_2, 2, 6, 80);
			addHeaderRow(surveyDocument, business7_3, 2, 6, 80);
		} else if (survey_type_code == '50_LOGISTICS') {
			addSubTitle(surveyDocument, '联系人');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business0_1, 6, 6, 80);
			addSubTitle(surveyDocument, '质量保障');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business1_1, 6, 6, 80);
			addHeaderRow(surveyDocument, business1_2, 4, 6, 80);
			addHeaderRow(surveyDocument, business1_3, 2, 6, 80);
			addSubTitle(surveyDocument, '供应商供货能力');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business8_1, 4, 6, 80);
			addHeaderRow(surveyDocument, business8_2, 6, 6, 80);
			addSubTitle(surveyDocument, '生产信息');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business6_1, 6, 6, 80);
			addHeaderRow(surveyDocument, business6_2, 6, 6, 80);
			addHeaderRow(surveyDocument, business6_3, 6, 6, 80);
			addHeaderRow(surveyDocument, business6_4, 4, 6, 80);
			addSubTitle(surveyDocument, '货运方式');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business3_1, 6, 6, 80);
			addHeaderRow(surveyDocument, business3_2, 6, 6, 80);
			addHeaderRow(surveyDocument, business3_3, 2, 6, 80);
		} else {
			addSubTitle(surveyDocument, '代理/经销情况');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business5_1, 2, 6, 80);
			addHeaderRow(surveyDocument, business5_2, 2, 6, 80);

			addSubTitle(surveyDocument, '货运方式');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business3_1, 6, 6, 80);
			addHeaderRow(surveyDocument, business3_2, 6, 6, 80);
			addHeaderRow(surveyDocument, business3_3, 2, 6, 80);
			addSubTitle(surveyDocument, '售后服务');
			addSubUnderLine(surveyDocument);
			addHeaderRow(surveyDocument, business4_1, 6, 6, 80);
			addHeaderRow(surveyDocument, business4_2, 4, 6, 80);
			addHeaderRow(surveyDocument, business4_3, 6, 6, 80);
			addHeaderRow(surveyDocument, business4_4, 2, 6, 80);
			addHeaderRow(surveyDocument, business4_5, 2, 6, 80);
		}

	}
}

// 创建明细表格通用方法
function addDetailTable(surveyDocument, datas, title, title_code, width, font) {
	// 获取表格宽度的cell总数
	var sum = 0;
	for (var i = 0; i < width.length; i++) {
		sum += parseInt(width[i]);
	}

	// 设置核心表格，并循环添加数据
	var datatable = new PdfPTable(sum);
	datatable.setWidthPercentage(100);
	datatable.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	datatable.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
	// datatable.setSpacingAfter(40);

	// 添加标题
	for (var i = 0; i < title.length; i++) {
		var cell = new PdfPCell(new Paragraph(title[i], font));
		cell.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
		cell.setColspan(width[i]);
		datatable.addCell(cell);
	}

	// 添加明细
	for (var i = 0; i < datas.length; i++) {
		for (var j = 0; j < title_code.length; j++) {
			eval('setPdfTableCell(getValue(datas[i].' + title_code[j]
					+ '), width[j], datatable, font)');
		}
	}
	surveyDocument.add(datatable);
}

// 产能信息
function addCapacity(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("capacity").getChildren();

	if (!isEmpty(datas)) {
		var contactTableTitle = [ '生产基地（国/省/市）', '供应产品', '主要产品系列', '单位',
				'年平均月产能', '常备库存量', '景旺占用产能', '公司接单比例（%）' ];
		var contactTableTitleCode = [ 'production_base', 'supply_products',
				'main_product', 'unit_code', 'monthly_capacity',
				'stock_quantity', 'occupancy_capacity', 'orders_proportion' ];
		var contactTableWidth = [ 1, 1, 1, 1, 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '产能信息');

		// 输出表格
		addDetailTable(surveyDocument, datas, contactTableTitle,
				contactTableTitleCode, contactTableWidth, fontChinese);

		var capacity1_1 = [ '是否扩产:', getValue(datas[0].extended_flag) ];
		var capacity1_2 = [ '扩产地点:', getValue(datas[0].extended_site), '扩产时间:',
				getValue(datas[0].extended_time), '月产能:',
				getValue(datas[0].monthly_capacity) ];

		addSubTitle(surveyDocument, '未来三年的扩产计划');
		addSubUnderLine(surveyDocument);
		addHeaderRow(surveyDocument, business1_1, 2, 6, 80);
		addHeaderRow(surveyDocument, business1_2, 6, 6, 80);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '40_BIDIRECTIONAL') {
			// 标题
			addTitle(surveyDocument, '产能信息');
		}
	}
}
// 成本拆解
function addDismantlInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("dismantl").getChildren();

	if (!isEmpty(datas)) {
		var contactTableTitle = [ '供应产品', '工序流程', '所需主要物料', '单位', '单位耗量',
				'物料厂商', '物料单价', '单位成本', '成本占比（占售价）', '工序物料成本', '物料成本合计',
				'人工费用', '管理费用', '利润', '税率', '合计价格' ];
		var contactTableTitleCode = [ 'supply_products', 'operation_flow',
				'main_material', 'unit_code', 'unit_consumption',
				'material_manufacture', 'material_price', 'unit_cost',
				'cost_past', 'item_cost', 'item_cost_totals', 'labor_costs',
				'manage_costs', 'profit', 'tax_rate', 'total_price' ];
		var contactTableWidth = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				1 ];

		// 标题
		addTitle(surveyDocument, '成本拆解');

		// 输出表格
		addDetailTable(surveyDocument, datas, contactTableTitle,
				contactTableTitleCode, contactTableWidth, fontChinese);

	} else if (isEmpty(datas)) {
		if (survey_type_code == '40_BIDIRECTIONAL') {
			// 标题
			addTitle(surveyDocument, '成本拆解');
		}
	}
}
// Top5大供应商信息
function addVendorsInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("vendors").getChildren();

	if (!isEmpty(datas)) {
		var contactTableTitle = [ '原材料名称', '供应商简称', '月供给量', '是否长协', '长协有效日期' ];
		var contactTableTitleCode = [ 'material_name', 'vendor_short_name',
				'monthly_supply', 'long_association_flag',
				'long_association_date' ];
		var contactTableWidth = [ 1, 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, 'Top5大供应商信息');

		// 输出表格
		addDetailTable(surveyDocument, datas, contactTableTitle,
				contactTableTitleCode, contactTableWidth, fontChinese);

	} else if (isEmpty(datas)) {
		if (survey_type_code == '40_BIDIRECTIONAL') {
			// 标题
			addTitle(surveyDocument, 'Top5大供应商信息');
		}
	}
}
// Top5大客户信息
function addSuppliersInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("suppliers").getChildren();

	if (!isEmpty(datas)) {
		var contactTableTitle = [ '排名', '客户名称', '月交易金额', '单位', '月供应量', '备注' ];
		var contactTableTitleCode = [ 'su_rank', 'customer_name',
				'monthly_amount', 'unit_code', 'monthly_supply', 'comments' ];
		var contactTableWidth = [ 1, 1, 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, 'Top5大客户信息');

		// 输出表格
		addDetailTable(surveyDocument, datas, contactTableTitle,
				contactTableTitleCode, contactTableWidth, fontChinese);

	} else if (isEmpty(datas)) {
		if (survey_type_code == '40_BIDIRECTIONAL') {
			// 标题
			addTitle(surveyDocument, 'Top5大客户信息');
		}
	}
}
// 主营业务及产品结构
function addMainBusinessInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("main_business").getChildren();

	if (!isEmpty(datas)) {
		var contactTableTitle = [ '主要产品', '月产量', '金额占比', '交货周期', '产品应用类别',
				'是否适用于我司' ];
		var contactTableTitleCode = [ 'main_product', 'monthly_production',
				'amount_percent', 'delivery_cycle', 'product_category',
				'applicable_flag' ];
		var contactTableWidth = [ 1, 1, 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '主营业务及产品结构');

		// 输出表格
		addDetailTable(surveyDocument, datas, contactTableTitle,
				contactTableTitleCode, contactTableWidth, fontChinese);

	} else if (isEmpty(datas)) {
		if (survey_type_code == '40_BIDIRECTIONAL') {
			// 标题
			addTitle(surveyDocument, '主营业务及产品结构');
		}
	}
}
// 近三年营业收入及毛利润率(单位：万元)
function addOperatingInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("operating_income").getChildren();

	if (!isEmpty(datas)) {
		var contactTableTitle = [ '项目', '营业收入', '毛利润', '毛利润率' ];
		var contactTableTitleCode = [ 'op_project', 'operating_income',
				'gross_profit', 'gross_profit_margin' ];
		var contactTableWidth = [ 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '近三年营业收入及毛利润率(单位：万元)');

		// 输出表格
		addDetailTable(surveyDocument, datas, contactTableTitle,
				contactTableTitleCode, contactTableWidth, fontChinese);

	} else if (isEmpty(datas)) {
		if (survey_type_code == '40_BIDIRECTIONAL') {
			// 标题
			addTitle(surveyDocument, '近三年营业收入及毛利润率(单位：万元)');
		}
	}
}
// 主要生产设备及检测仪器清单
function addMainProductionInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("main_production").getChildren();

	if (!isEmpty(datas)) {
		var contactTableTitle = [ '分类', '名称及规格', '供应商', '数量', '入场时间' ];
		var contactTableTitleCode = [ 'classification_code',
				'mp_specification', 'suppliers', 'nums', 'admission_time' ];
		var contactTableWidth = [ 1, 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '主要生产设备及检测仪器清单');

		// 输出表格
		addDetailTable(surveyDocument, datas, contactTableTitle,
				contactTableTitleCode, contactTableWidth, fontChinese);

	} else if (isEmpty(datas)) {
		if (survey_type_code == '40_BIDIRECTIONAL') {
			// 标题
			addTitle(surveyDocument, '主要生产设备及检测仪器清单');
		}
	}
}
// 联系人信息
function addContactInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("contact").getChildren();

	if (!isEmpty(datas)) {
		var contactTableTitle = [ '联系人姓名', '性别', '证件类型', '证件号码', '部门', '职位',
				'移动电话', '固定电话', '邮箱', '默认联系人', '备注', '启用' ];
		var contactTableTitleCode = [ 'contact_name', 'contact_sex',
				'id_type_name', 'id_number', 'department', 'position',
				'mobile_phone', 'telephone', 'email', 'default_contact_flag',
				'contact_comments', 'enabled_flag' ];
		var contactTableWidth = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '联系人信息');

		// 输出表格
		addDetailTable(surveyDocument, datas, contactTableTitle,
				contactTableTitleCode, contactTableWidth, fontChinese);

	}
}

// 地址信息
function addAddressInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("address").getChildren();

	if (!isEmpty(datas)) {
		var addressTableTitle = [ '国家', '地区', '城市', '详细地址', '邮政编码', '地址备注',
				'启用' ];
		var addressTableTitleCode = [ 'country_name', 'province_name',
				'city_name', 'address_detail_desc', 'post_code',
				'address_comments', 'enabled_flag' ];
		var addressTableWidth = [ 1, 1, 1, 3, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '地址信息');

		// 输出表格
		addDetailTable(surveyDocument, datas, addressTableTitle,
				addressTableTitleCode, addressTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '10_MANUFACTURER'
				|| survey_type_code == '50_LOGISTICS') {
			// 标题
			addTitle(surveyDocument, '地址信息');
		}
	}
}
// 账户信息
function addAccountInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("account").getChildren();

	if (!isEmpty(datas)) {
		if (survey_type_code == '10_MANUFACTURER') {
			var accountTableTitle = [ '银行代码', '银行名称', '开户行名称', '联行行号', '账户名称',
					'银行账号', '付款方式', '币种', '主账户', '启用' ];
			var accountTableTitleCode = [ 'bank_code', 'bank_name',
					'bank_branch_name', 'c_attribute1', 'bank_account_name',
					'bank_account_number', 'payment_method_name',
					'currency_code', 'primary_account_flag', 'enabled_flag' ];
			var accountTableWidth = [ 1, 1, 2, 2, 2, 1, 1, 1, 1, 1 ];

			// 标题
			addTitle(surveyDocument, '账户信息');

			// 输出表格
			addDetailTable(surveyDocument, datas, accountTableTitle,
					accountTableTitleCode, accountTableWidth, fontChinese);
		} else if (survey_type_code == '30_EQUIPMENT') {
			var accountTableTitle = [ '银行代码', '银行名称', '开户行名称', '联行行号', '账户名称',
					'银行账号', '付款方式', '税率', '币种', '主账户', '启用' ];
			var accountTableTitleCode = [ 'bank_code', 'bank_name',
					'bank_branch_name', 'c_attribute1', 'bank_account_name',
					'bank_account_number', 'payment_method_name',
					'tax_type_name', 'currency_code', 'primary_account_flag',
					'enabled_flag' ];
			var accountTableWidth = [ 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1 ];

			// 标题
			addTitle(surveyDocument, '账户信息');

			// 输出表格
			addDetailTable(surveyDocument, datas, accountTableTitle,
					accountTableTitleCode, accountTableWidth, fontChinese);
		}
	} else if (isEmpty(datas)) {
		if (survey_type_code == '10_MANUFACTURER'
				|| survey_type_code == '50_LOGISTICS') {
			// 标题
			addTitle(surveyDocument, '账户信息');
		}
	}
}

// 管理体系信息
function addAuthenticateInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("authenticate").getChildren();

	if (!isEmpty(datas)) {
		var authenticateTableTitle = [ '认证类型', '认证描述', '认证编号', '认证时间', '认证机构' ];
		var authenticateTableTitleCode = [ 'authenticate_type_desc',
				'authenticate_description', 'authenticate_number',
				'authenticate_date', 'certification_org' ];
		var authenticateTableWidth = [ 1, 1, 1, 1, 2 ];

		// 标题
		addTitle(surveyDocument, '管理体系信息');

		// 输出表格
		addDetailTable(surveyDocument, datas, authenticateTableTitle,
				authenticateTableTitleCode, authenticateTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '10_MANUFACTURER'
				|| survey_type_code == '50_LOGISTICS') {
			// 标题
			addTitle(surveyDocument, '管理体系信息');
		}
	}
}

// 设备信息信息
function addDeviceInfo(surveyDocument) {

	// 获取数据
	var datas = $ctx.model.getChild("device").getChildren();

	if (!isEmpty(datas)) {
		var deviceTableTitle = [ '设备类型', '设备名称', '规格型号', '数量', '生产厂家', '已服役年限' ];
		var deviceTableTitleCode = [ 'device_type_desc', 'device_name',
				'specifications_model', 'quantity', 'manufacturer',
				'servered_yesrs' ];
		var deviceTableWidth = [ 1, 1, 2, 2, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '设备信息');

		// 输出表格
		addDetailTable(surveyDocument, datas, deviceTableTitle,
				deviceTableTitleCode, deviceTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '10_MANUFACTURER'
				|| survey_type_code == '50_LOGISTICS') {
			// 标题
			addTitle(surveyDocument, '设备信息');
		}
	}
}

// 产品能力信息
function addProductInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("product").getChildren();

	if (!isEmpty(datas)) {
		var productTableTitleManu = [ '产品品类', '产品名称/型号', '产品品牌', '主要工艺', '年产量',
				'产品合格率(%)', '年营业额(万元)', '月产量', '金额占比（%）', '交货周期（天）', '产品应用类别',
				'典型客户', '客户满意度', '备注' ];
		var productTableTitleCodeManu = [ 'c_attribute1', 'product_name',
				'product_brand', 'specifications_model', 'annual_yield',
				'product_conformity_rate', 'annual_turnover',
				'monthly_production', 'sum_ratio', 'delivery_cycle',
				'product_application_category', 'typical_customers',
				'customer_satisfaction_per_desc', 'description' ];
		var productTableWidthManu = [ 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];
		var productTableTitleMerchant = [ '产品品类', '产品名称/型号', '产品品牌', '生产厂家',
				'经营性质', '代理层级', '代理区域', '备注' ];
		var productTableTitleCodeMerchant = [ 'c_attribute1', 'product_name',
				'product_brand', 'manufacturer', 'business_nature',
				'agency_level', 'agency_region', 'description' ];
		var productTableWidthMerchant = [ 1, 1, 1, 2, 2, 1, 1, 1 ];
		// 标题
		addTitle(surveyDocument, '产品能力信息');

		if (survey_type_code == '10_MANUFACTURER') {
			// 输出表格
			addDetailTable(surveyDocument, datas, productTableTitleManu,
					productTableTitleCodeManu, productTableWidthManu,
					fontChinese);
		} else {
			addDetailTable(surveyDocument, datas, productTableTitleMerchant,
					productTableTitleCodeMerchant, productTableWidthMerchant,
					fontChinese);
		}
	} else if (isEmpty(datas)) {
		if (survey_type_code == '10_MANUFACTURER') {
			// 标题
			addTitle(surveyDocument, '产品能力信息');
		}
	}
}

// 分供方情况
function addSubcontractInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("subcontract").getChildren();

	if (!isEmpty(datas)) {
		var subcontractTableTitle = [ '分供方名称', '零件', '工序', '供应占比', '厂商状况' ];
		var subcontractTableTitleCode = [ 'subcontractor_name', 'parts',
				'working_processes', 'c_attribute1', 'firm_statement' ];
		var subcontractTableWidth = [ 1, 1, 2, 1, 2 ];

		// 标题
		addTitle(surveyDocument, '分供方情况');

		// 输出表格
		addDetailTable(surveyDocument, datas, subcontractTableTitle,
				subcontractTableTitleCode, subcontractTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '10_MANUFACTURER'
				|| survey_type_code == '50_LOGISTICS') {
			// 标题
			addTitle(surveyDocument, '分供方情况');
		}
	}
}

// 客户情况
function addCustomerInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("customer").getChildren();
	if (!isEmpty(datas)) {

		if (survey_type_code == '30_EQUIPMENT') {
		} else {
			var customerTableTitle = [ '客户名称', '联系人', '职位', '联系方式', '客户排名',
					'交易内容', '合作频率', '所属区域', '年销售数量', '年销售额(万元)', '备注' ];
			var customerTableTitleCode = [ 'customer_name', 'contact_person',
					'position', 'contact_way', 'customer_rank',
					'transaction_content', 'cooperation_frequency_desc',
					'belong_regions', 'sales', 'sales_volume', 'description' ];
			var customerTableWidth = [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];

			// 标题
			addTitle(surveyDocument, '客户情况');

			// 输出表格
			addDetailTable(surveyDocument, datas, customerTableTitle,
					customerTableTitleCode, customerTableWidth, fontChinese);
		}
	} else if (isEmpty(datas)) {
		if (survey_type_code == '10_MANUFACTURER'
				|| survey_type_code == '50_LOGISTICS') {
			// 标题
			addTitle(surveyDocument, '客户情况');
		}
	}
}
// 主要配件和材料品牌
function addAccessoriesInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("accessories").getChildren();
	println(survey_type_code);
	if (!isEmpty(datas)) {
		var financeTableTitle = [ '材料/配件名称', '品牌及型号', '单价', '更换频次', '每月费用',
				'每年费用', '备注' ];
		var financeTableTitleCode = [ 'material_name', 'brand_model',
				'unit_price', 'replace_frequency', 'monthly_expenses',
				'yearly_expenses', 'comments' ];
		var financeTableWidth = [ 1, 1, 1, 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '主要配件和材料品牌');

		// 输出表格
		addDetailTable(surveyDocument, datas, financeTableTitle,
				financeTableTitleCode, financeTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '30_EQUIPMENT') {
			// 标题
			addTitle(surveyDocument, '主要配件和材料品牌');
		}
	}
}
// 软件产品和应用客户信息
function addApplicationInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("application").getChildren();

	if (!isEmpty(datas)) {
		var financeTableTitle = [ '软件产品名称/品牌', '应用范围', '客户名称', '项目日期', '项目金额' ];
		var financeTableTitleCode = [ 'product_name', 'application_scope',
				'customer_name', 'project_date', 'project_price' ];
		var financeTableWidth = [ 1, 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '软件产品和应用客户信息');

		// 输出表格
		addDetailTable(surveyDocument, datas, financeTableTitle,
				financeTableTitleCode, financeTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '30_EQUIPMENT') {
			// 标题
			addTitle(surveyDocument, '软件产品和应用客户信息');
		}
	}
}
// 设备性能
function addEquipmentInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("equipment").getChildren();

	if (!isEmpty(datas)) {
		var financeTableTitle = [ '生产效率（pnl/h）', '制程能力（最小、最大尺寸）', '耗电量（kw/h）',
				'温度均匀性', '交货时间（天）', '保修期', '制程能力（最薄、最厚尺寸）', '平整度', '机器型号' ];
		var financeTableTitleCode = [ 'production_efficiency',
				'process_ability_size', 'power_consumption',
				'temperature_uniformity', 'delivery_time',
				'maintenance_period', 'process_ability_thickness', 'planeness',
				'machine_model' ];
		var financeTableWidth = [ 1, 1, 1, 1, 1, 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '设备性能');

		// 输出表格
		addDetailTable(surveyDocument, datas, financeTableTitle,
				financeTableTitleCode, financeTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '30_EQUIPMENT') {
			// 标题
			addTitle(surveyDocument, '设备性能');
		}
	}
}
// 财务信息
function addFinanceInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("finance").getChildren();

	if (!isEmpty(datas)) {
		var financeTableTitle = [ '年份', '营业额（万元）', '企业总资产(万元)', '总负债(万元)',
				'流动资产(万元)', '流动负债(万元)', '营业收入(万元)', '净利润(万元)', '资产负债率', '流动比率',
				'总资产收益率' ];
		var financeTableTitleCode = [ 'year_period', 'turnover',
				'total_assets', 'total_liabilities', 'current_assets',
				'current_liabilities', 'revenue', 'net_profit',
				'asset_liability_ratio', 'current_ratio', 'total_asset_earning' ];
		var financeTableWidth = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '财务信息');

		// 输出表格
		addDetailTable(surveyDocument, datas, financeTableTitle,
				financeTableTitleCode, financeTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '10_MANUFACTURER'
				|| survey_type_code == '50_LOGISTICS') {
			// 标题
			addTitle(surveyDocument, '财务信息');
		}
	}
}

// 附件信息
function addAttachmentInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("attachment").getChildren();

	if (!isEmpty(datas)) {
		var attachmentTableTitle = [ '附件类型', '附件描述', '是否必传', '文件到期日', '最后上传时间' ];
		var attachmentTableTitleCode = [ 'attachment_type_desc',
				'attachment_name', 'required_flag', 'invalid_date',
				'last_upload_date' ];
		var attachmentTableWidth = [ 2, 1, 1, 1, 1 ];

		if (survey_type_code == '10_MANUFACTURER'
				|| survey_type_code == '50_LOGISTICS'
				|| survey_type_code == '30_EQUIPMENT') {
			// 标题
			addTitle(surveyDocument, '附件信息');

			// 输出表格
			addDetailTable(surveyDocument, datas, attachmentTableTitle,
					attachmentTableTitleCode, attachmentTableWidth, fontChinese);
		}

	} else if (isEmpty(datas)) {
		if (survey_type_code == '10_MANUFACTURER'
				|| survey_type_code == '50_LOGISTICS'
				|| survey_type_code == '30_EQUIPMENT') {
			// 标题
			addTitle(surveyDocument, '附件信息');
		}
	}
}
// 同业竞争调查信息
function addCompetitionInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("competition").getChildren();

	if (!isEmpty(datas)) {
		var attachmentTableTitle = [ '姓名', '同行公司名称', '职位', '身份证号码',
				'是否与我司存在同业竞争' ];
		var attachmentTableTitleCode = [ 'ind_name', 'ind_company_name',
				'ind_position', 'ind_id_card', 'ind_competition_flag' ];
		var attachmentTableWidth = [ 1, 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '同业竞争调查信息');

		// 输出表格
		addDetailTable(surveyDocument, datas, attachmentTableTitle,
				attachmentTableTitleCode, attachmentTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '10_MANUFACTURER'
				|| survey_type_code == '50_LOGISTICS') {
			// 标题
			addTitle(surveyDocument, '同业竞争调查信息');
		}
	}
}
// 售后服务信息
function addAfterService(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("after_service").getChildren();

	if (!isEmpty(datas)) {
		var attachmentTableTitle = [ '分公司或售后服务点', '地点', '人数', '成立时间', '是否收费',
				'售后服务标准', '备注' ];
		var attachmentTableTitleCode = [ 'sale_point', 'service_site',
				'person_nums', 'founding_time', 'charge_flag',
				'charge_standard', 'comments' ];
		var attachmentTableWidth = [ 1, 1, 1, 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '售后服务');

		// 输出表格
		addDetailTable(surveyDocument, datas, attachmentTableTitle,
				attachmentTableTitleCode, attachmentTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '30_EQUIPMENT') {
			// 标题
			addTitle(surveyDocument, '售后服务');
		}
	}
}
// 产品能力信息（工程或服务）
function addEqCapaticy(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("eq_capaticy").getChildren();

	if (!isEmpty(datas)) {
		var attachmentTableTitle = [ '主营产品（工程或者服务）', '年销售额（万元）', '第一大案例（名称）',
				'第一大案例（年交易额（万元））', '第二大案例（名称）', '第二大案例（年交易额（万元））', '第三大案例（名称）',
				'第三大案例（年交易额（万元））', '第四大案例（名称）', '第四大案例（年交易额（万元））', '第五大案例（名称）',
				'第五大案例（年交易额（万元））' ];
		var attachmentTableTitleCode = [ 'main_product', 'annual_sales',
				'fir_case_name', 'fir_case_sales', 'sec_case_name',
				'sec_case_sales', 'thir_case_name', 'thir_case_sales',
				'for_case_name', 'for_case_sales', 'fiv_case_name',
				'fiv_case_sales' ];
		var attachmentTableWidth = [ 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ];

		// 标题
		addTitle(surveyDocument, '产品能力信息（工程或服务）');

		// 输出表格
		addDetailTable(surveyDocument, datas, attachmentTableTitle,
				attachmentTableTitleCode, attachmentTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '30_EQUIPMENT') {
			// 标题
			addTitle(surveyDocument, '产品能力信息（工程或服务）');
		}
	}
}
// 产品能力信息（设备）
function addCapaticyEq(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("eq_capaticy").getChildren();

	if (!isEmpty(datas)) {
		var attachmentTableTitle = [ '主营产品（设备）', '年销售量（台）', '第一大客户（名称）',
				'第一大客户（年销售量（台））', '第二大客户（名称）', '第二大客户（年销售量（台））', '第三大客户（名称）',
				'第三大客户（年销售量（台））', '第四大客户（名称）', '第四大客户（年销售量（台））', '第五大客户（名称）',
				'第五大客户（年销售量（台））' ];
		var attachmentTableTitleCode = [ 'main_product', 'annual_sales',
				'fir_case_name', 'fir_case_sales', 'sec_case_name',
				'sec_case_sales', 'thir_case_name', 'thir_case_sales',
				'for_case_name', 'for_case_sales', 'fiv_case_name',
				'fiv_case_sales' ];
		var attachmentTableWidth = [ 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ];

		// 标题
		addTitle(surveyDocument, '产品能力信息（设备）');

		// 输出表格
		addDetailTable(surveyDocument, datas, attachmentTableTitle,
				attachmentTableTitleCode, attachmentTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '30_EQUIPMENT') {
			// 标题
			addTitle(surveyDocument, '产品能力信息（设备）');
		}
	}
}
// 关联交易调查信息
function addTransactionInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("transaction").getChildren();

	if (!isEmpty(datas)) {
		var attachmentTableTitle = [ '姓名', '曾任职部门', '岗位', '任职年限' ];
		var attachmentTableTitleCode = [ 'con_name', 'con_former_department',
				'con_station', 'con_serving_years' ];
		var attachmentTableWidth = [ 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '关联交易调查信息');

		// 输出表格
		addDetailTable(surveyDocument, datas, attachmentTableTitle,
				attachmentTableTitleCode, attachmentTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '10_MANUFACTURER'
				|| survey_type_code == '50_LOGISTICS') {
			// 标题
			addTitle(surveyDocument, '关联交易调查信息');
		}
	}
}
// 生产计划与物流管理信息
function addMtMangerInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("manager").getChildren();

	if (!isEmpty(datas)) {
		var attachmentTableTitle = [ '关键原料名称', '采购方式', '年采购金额（万元）', '金额占比（%）',
				'采购周期（天）' ];
		var attachmentTableTitleCode = [ 'key_material_name',
				'purchase_method', 'annual_purchase_amount', 'sum_ratio',
				'purchase_cycle' ];
		var attachmentTableWidth = [ 1, 1, 1, 1, 1 ];

		// 标题
		addTitle(surveyDocument, '生产计划与物流管理信息');

		// 输出表格
		addDetailTable(surveyDocument, datas, attachmentTableTitle,
				attachmentTableTitleCode, attachmentTableWidth, fontChinese);
	} else if (isEmpty(datas)) {
		if (survey_type_code == '10_MANUFACTURER'
				|| survey_type_code == '50_LOGISTICS') {
			// 标题
			addTitle(surveyDocument, '生产计划与物流管理信息');
		}
	}
}
function addFooterInfo(surveyDocument) {

	// var datas = $ctx.model.getChild("vendor_survey_data").getChildren();

	var description = [];
	var seal = [ '卖方确认签字（章）', '', '买方确认（章）', '' ];
	// var paperdate = ['日期：', '', '日期：', datas[0].pur_date];
	var blank = [ ' ', ' ', ' ', ' ' ];
	// pdf尾部表格
	for (var i = 0; i < description.length; i++) {
		pf = new Paragraph(description[i], fontChinese);
		pf.setAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
		pf.setSpacingAfter(10);
		surveyDocument.add(pf);
	}

	// 盖章
	datatable = new PdfPTable(4);
	datatable.setWidthPercentage(100);
	datatable.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	datatable.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	datatable.getDefaultCell().setBorderWidth(0);
	datatable.setSpacingAfter(20);

	// 添加子元素
	for (var i = 0; i < 4; i++) {
		datatable.addCell(new Paragraph(seal[i], fontChinese));
	}
	for (var i = 0; i < 4; i++) {
		datatable.addCell(new Paragraph(blank[i], fontChinese));
	}
	// 添加子元素
	// for (var i = 0; i < 4; i++) {
	// datatable.addCell(new Paragraph(paperdate[i], fontChinese));
	// }
	surveyDocument.add(datatable);
}

// 主函数
function exportToPdf() {

	var datas = $ctx.model.getChild("header").getChildren();

	// 新建文件对象
	var surveyDocument = new com.itextpdf.text.Document();

	// 获取 context 的数据
	var context = $ctx.getData();

	// 初始化实例
	var serviceInstance = ServiceInstance.getInstance(context);
	var request = serviceInstance.getRequest();

	// 获取当前工程路径
	var file = request.getSession().getServletContext().getRealPath(
			File.separator);

	// pdf文档保存路径
	var fileRoute = file + '/attached/' + getValue(datas[0].survey_number)
			+ ".pdf";
	parameter.fileName = '/attached/' + getValue(datas[0].survey_number)
			+ ".pdf";

	var writer = PdfWriter.getInstance(surveyDocument, new FileOutputStream(
			fileRoute));

	// 打开文件，开始写入
	surveyDocument.open();

	// 设置 logo
	// var img = Image.getInstance(file + 'images/suguang.png');
	// img.scalePercent(70);
	// img.setAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	// //img.setAbsolutePosition(20, 770);
	// surveyDocument.add(img);

	// 设置pdf标题
	var pf = new Paragraph(getValue(datas[0].company_name), fontChineseBig);
	pf.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
	pf.setSpacingAfter(10);
	surveyDocument.add(pf);
	pf = new Paragraph("供应商调查表", fontChineseBold);
	pf.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
	pf.setSpacingAfter(20);
	surveyDocument.add(pf);

	// 基本信息
	addBasicInfo(surveyDocument);

	// 供应商信息
	addVendorInfo(surveyDocument);

	// 公司信息
	addCompanyInfo(surveyDocument);

	// 业务信息
	addBusinessInfo(surveyDocument);
	// 售后服务信息
	addAfterService(surveyDocument);
	// 联系人信息
	addContactInfo(surveyDocument);

	// 地址信息
	addAddressInfo(surveyDocument);

	// 账户信息
	addAccountInfo(surveyDocument);

	// 产品能力信息（工程或服务）
	addEqCapaticy(surveyDocument);
	// 产品能力信息（设备）
	addCapaticyEq(surveyDocument);
	// 管理体系信息
	addAuthenticateInfo(surveyDocument);

	// 设备信息
	addDeviceInfo(surveyDocument);

	// 产品能力信息
	addProductInfo(surveyDocument);
	// 分供方信息
	addSubcontractInfo(surveyDocument);
	// 客户情况
	addCustomerInfo(surveyDocument);
	// 主要配件和材料品牌
	// addAccessoriesInfo(surveyDocument);
	// 软件产品和应用客户信息
	// addApplicationInfo(surveyDocument);
	// 设备性能
	// addEquipmentInfo(surveyDocument);

	// 财务信息
	addFinanceInfo(surveyDocument);
	// 同业竞争调查信息
	addCompetitionInfo(surveyDocument);
	// 关联交易调查
	addTransactionInfo(surveyDocument);
	// 产能信息
	addCapacity(surveyDocument);
	// 成本拆解
	addDismantlInfo(surveyDocument);

	// Top5大供应商信息
	addVendorsInfo(surveyDocument);
	// Top5大客户信息
	addSuppliersInfo(surveyDocument);
	// 主营业务及产品结构
	addMainBusinessInfo(surveyDocument);
	// 近三年营业收入及毛利润率(单位：万元)
	addOperatingInfo(surveyDocument);
	// 主要生产设备及检测仪器清单
	addMainProductionInfo(surveyDocument);
	// 生产计划与物流管理信息
	addMtMangerInfo(surveyDocument)
	// 附件信息
	addAttachmentInfo(surveyDocument);

	// 底部
	// addFooterInfo(surveyDocument);

	surveyDocument.close();
	
	if(writer != null) {
		writer.close();
		}
}