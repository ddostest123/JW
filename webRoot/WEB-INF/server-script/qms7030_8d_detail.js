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
	var p = new Paragraph(title, fontChinese);
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
	datatable.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
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
// 基本信息
function addBasicInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();

	if (!isEmpty(datas)) {
		// 设置数据
		// var header1 = [ '报告主题 Complaint title:',
		// getValue(datas[0].qms_8d_title)];

		var header1 = [ '报告主题 Complaint title:',
				getValue(datas[0].qms_8d_title), '版本:',
				getValue(datas[0].version) ];

		var header2 = [ '8D编号:', getValue(datas[0].qms_8d_code), '发出日期:',
				getValue(datas[0].send_date), '供应商名称:',
				getValue(datas[0].coop_company_desc) ];
		var header3 = [ '异常来源:', getValue(datas[0].abnormal_source), '公司:',
				getValue(datas[0].company_desc), '库存组织代码:',
				getValue(datas[0].inv_organization_code) ];
		var header4 = [ '库存组织描述:', getValue(datas[0].inv_organization_desc),
				'数据来源:', getValue(datas[0].data_source_display), '3D要求时间:',
				getValue(datas[0].ica_require_date) ];
		var header5 = [ '8D要求日期:', getValue(datas[0].pca_require_date), '发现人:',
				getValue(datas[0].discovery), '发现日期:',
				getValue(datas[0].discovery_date) ];

		// 设置标题和分割线
		addTitle(surveyDocument, '基本信息');
		addUnderLine(surveyDocument);

		// 按行添加数据
		addHeaderRow(surveyDocument, header1, 4, 6, 100);
		addHeaderRow(surveyDocument, header2, 6, 6, 100);
		addHeaderRow(surveyDocument, header3, 6, 6, 100);
		addHeaderRow(surveyDocument, header4, 6, 6, 100);
		addHeaderRow(surveyDocument, header5, 6, 6, 100);
	}
}
// D2 问题描述 Problem description
function addVendorInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();

	if (!isEmpty(datas)) {

		// 设置数据
		var header1 = [ '物料编码:', getValue(datas[0].item_code), '物料描述:',
				getValue(datas[0].item_name), '抽样数量:',
				getValue(datas[0].sampling_quantity), '不良数量:',
				getValue(datas[0].bad_quantity) ];
		var header2 = [ '不良数量:', getValue(datas[0].bad_quantity), '不良率:',
				getValue(datas[0].adverse_rate), '问题类型:',
				getValue(datas[0].issue_type_display) ];
		var header3 = [ '重视度:', getValue(datas[0].importance_degree_display),
				'紧急度:', getValue(datas[0].urgency_degree_display) ];
		var header4 = [ '是否重复发生:', getValue(datas[0].repeat_happen_flag) ]
		var header5 = [ '问题详述:', getValue(datas[0].issue_desc) ];

		// 设置标题和分割线
		addTitle(surveyDocument, 'D2 问题描述 Problem description');
		addUnderLine(surveyDocument);

		// 按行添加数据
		addHeaderRow(surveyDocument, header1, 6, 6, 100);
		addHeaderRow(surveyDocument, header2, 6, 6, 100);
		addHeaderRow(surveyDocument, header3, 4, 6, 100);
		addHeaderRow(surveyDocument, header4, 2, 6, 100);
		addHeaderRow(surveyDocument, header5, 2, 6, 100);
	}
}
// D1 团队成立 Team formation
function addCompanyInfo(surveyDocument) {
	// 获取数据
	var address = $ctx.model.getChild("address").getChildren();

	if (!isEmpty(address)) {
		var addressTableTitle = [ '阶段负责人', '姓名', '职责', '角色', '电话', 'E-mail',
				'说明' ];
		var addressTableTitleCode = [ 'stage_leader', 'name', 'role',
				'responsibility_scope', 'phone_number', 'email', 'comments' ];
		var addressTableWidth = [ 1, 1, 1, 1, 3, 1, 1 ];

		// 标题
		addTitle(surveyDocument, 'D1 团队成立 Team formation');

		// 输出表格
		addDetailTable(surveyDocument, address, addressTableTitle,
				addressTableTitleCode, addressTableWidth, fontChinese);
	} else if (isEmpty(address)) {
		addTitle(surveyDocument, 'D1 团队成立 Team formation');
		addUnderLine(surveyDocument);
	}
}
// D3 围堵行动 Containment Actions
function addBusinessInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();

	if (!isEmpty(datas)) {

		survey_type_code = getValue(datas[0].survey_type_code);
		println(survey_type_code);
		// 设置数据
		var header1 = [ '库存零件是否受影响？:',
				getValue(datas[0].inv_affect_flag_display), '措施内容:',
				getValue(datas[0].inv_affect_measure_display), '说明:',
				getValue(datas[0].inventory_affect_desc) ];
		var header2 = [ '在制零件是否受影响？:',
				getValue(datas[0].pro_affect_flag_display), '措施内容:',
				getValue(datas[0].pro_affect_measure_display), '说明:',
				getValue(datas[0].process_affect_desc), ];
		var header3 = [ '在途零件是否受影响？:',
				getValue(datas[0].tra_affect_flag_display), '措施内容:',
				getValue(datas[0].tra_affect_measure_display), '说明:',
				getValue(datas[0].transporting_affect_desc) ];
		var header4 = [ '客户库存是否受影响？:',
				getValue(datas[0].cus_affect_flag_display), '措施内容:',
				getValue(datas[0].cus_affect_measure_display), '说明:',
				getValue(datas[0].custom_stock_affect_desc) ];
		var header5 = [ '共复查多少零件？:', getValue(datas[0].item_reivew_count),
				'检查发现多少问题零件？:', getValue(datas[0].item_trouble_count) ];
		var header6 = [ '措施详述:', getValue(datas[0].measure_desc) ];
		var header7 = [ '措施验证', getValue(datas[0].measure_check) ];

		// 设置标题和分割线
		addTitle(surveyDocument, 'D3 围堵行动 Containment Actions');
		addUnderLine(surveyDocument);

		// 按行添加数据
		addHeaderRow(surveyDocument, header1, 6, 6, 100);
		addHeaderRow(surveyDocument, header2, 6, 6, 100);
		addHeaderRow(surveyDocument, header3, 6, 6, 100);
		addHeaderRow(surveyDocument, header4, 6, 6, 100);
		addHeaderRow(surveyDocument, header5, 4, 6, 100);
		addHeaderRow(surveyDocument, header6, 2, 6, 100);
		addHeaderRow(surveyDocument, header7, 2, 6, 100);
	}
}
// D4 根本原因分析 Root cause analysis
function addContactInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();

	if (!isEmpty(datas)) {

		survey_type_code = getValue(datas[0].survey_type_code);
		println(survey_type_code);
		// 设置数据
		var header1 = [ '原因类型:', getValue(datas[0].reason_type_display) ];
		var header2 = [ '该问题为什么会发生？:', getValue(datas[0].reason_desc) ];
		var header3 = [ '该问题为什么会流出？？:', getValue(datas[0].unhappen_desc) ];

		// 设置标题和分割线
		addTitle(surveyDocument, 'D4 根本原因分析 Root cause analysis ');
		addUnderLine(surveyDocument);

		// 按行添加数据
		addHeaderRow(surveyDocument, header1, 2, 6, 100);
		addHeaderRow(surveyDocument, header2, 2, 6, 100);
		addHeaderRow(surveyDocument, header3, 2, 6, 100);
	}
}
// D5纠正措施及执行 Corrective Actions and implementation
function addAddressInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();

	if (!isEmpty(datas)) {

		survey_type_code = getValue(datas[0].survey_type_code);
		println(survey_type_code);
		// 设置数据
		var header1 = [ '如何预防该问题再次流出？:',
				getValue(datas[0].prevent_check_measure) ];

		var header2 = [ '是否适用于以下项目:', '其他零件：',
				getValue(datas[0].other_item_flag_display), '其他工序:',
				getValue(datas[0].other_process_flag_display), '其他场所:',
				getValue(datas[0].other_place_flag_display), ];
		var header3 = [ '是否横向展开至其他：',
				getValue(datas[0].custom_stock_affect_flag_display) ];

		// 设置标题和分割线
		addTitle(surveyDocument,
				'D5纠正措施及执行 Corrective Actions and implementation');
		addUnderLine(surveyDocument);

		// 按行添加数据
		addHeaderRow(surveyDocument, header1, 2, 6, 100);
		addHeaderRow(surveyDocument, header2, 7, 1, 100);
		addHeaderRow(surveyDocument, header3, 2, 6, 100);

	}
}
// D6 验证纠正措施 Verification of Corrective Actions

function addAccountInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();

	if (!isEmpty(datas)) {

		survey_type_code = getValue(datas[0].survey_type_code);
		println(survey_type_code);
		// 设置数据
		var header1 = [ '永久纠正措施效果如何？有何成果？:',
				getValue(datas[0].permanent_measure_effect) ];

		// 设置标题和分割线
		addTitle(surveyDocument, 'D6 验证纠正措施 Verification of Corrective Actions');
		addUnderLine(surveyDocument);

		// 按行添加数据
		addHeaderRow(surveyDocument, header1, 2, 6, 100);

	}
}
// D7 预防再发生 Preventive actions to avoid reoccurrence

function addAuthenticateInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();

	if (!isEmpty(datas)) {

		survey_type_code = getValue(datas[0].survey_type_code);
		println(survey_type_code);
		// 设置数据
		var header1 = [ '措施详述:', getValue(datas[0].prevent_desc) ];
		var header2 = [ '相关文件是否进行了评审修订？', 'FMEA',
				getValue(datas[0].fmea_flag_display), '控制计划:',
				getValue(datas[0].control_flag_display), '流程图:',
				getValue(datas[0].flowchart_flag_display), ];

		// 设置标题和分割线
		addTitle(surveyDocument,
				'D7 预防再发生 Preventive actions to avoid reoccurrence');
		addUnderLine(surveyDocument);

		// 按行添加数据
		addHeaderRow(surveyDocument, header1, 2, 6, 100);
		addHeaderRow(surveyDocument, header2, 7, 1, 100);

	}
}
// D8 小组祝贺 Congratulate your team

function addDeviceInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();

	if (!isEmpty(datas)) {

		survey_type_code = getValue(datas[0].survey_type_code);
		println(survey_type_code);
		// 设置数据
		var header1 = [ '团队合作成果认可:', getValue(datas[0].cooperation_effect) ];

		// 设置标题和分割线
		addTitle(surveyDocument, 'D8 小组祝贺 Congratulate your team');
		addUnderLine(surveyDocument);

		// 按行添加数据
		addHeaderRow(surveyDocument, header1, 2, 6, 100);

	}
}
// 9D-验证改善措施
function addProductInfo(surveyDocument) {
	// 获取数据
	var manager = $ctx.model.getChild("manager").getChildren();

	if (!isEmpty(manager)) {
		var addressTableTitle = [ '日期', '跟进情况描述', '跟进结果', '跟进人' ];
		var addressTableTitleCode = [ 'question_date', 'question_desc',
				'check_result', 'check_person' ];
		var addressTableWidth = [ 1, 4, 1, 1 ];

		// 标题
		addTitle(surveyDocument, ' 9D-验证改善措施');

		// 输出表格
		addDetailTable(surveyDocument, manager, addressTableTitle,
				addressTableTitleCode, addressTableWidth, fontChinese);
	} else if (isEmpty(manager)) {
		addTitle(surveyDocument, '9D-验证改善措施');
		addUnderLine(surveyDocument);
	}
}

// 主函数
function exportToPdf() {
	var bm = new ModelService('qms.QMS5060.qms_8d_record_query');
	var datas = $ctx.model.getChild("header").getChildren();
	var users = $ctx.model.getChild("user").getChildren();
	$ctx.parameter.qms_8d_id = datas[0].qms_8d_id;
	$ctx.parameter.status = 'MEASURE_APPROVING';

	var d3_record = bm.queryAsMap();
	var d3_arr = d3_record.getChildren();
	var d3_user_name;
	var d3_operation_date;
	if (d3_arr.length >= 1) {
		d3_user_name = d3_arr[0].USER_NAME;
		d3_operation_date = d3_arr[0].OPERATION_DATE;
	} else {
		d3_user_name = '';
		d3_operation_date = '';
	}

	$ctx.parameter.status = 'PER_MEASURE_APPROVING';
	var d4_record = bm.queryAsMap();
	var d4_arr = d4_record.getChildren();
	var d4_user_name;
	var d4_operation_date;
	if (d4_arr.length > 1) {
		d4_user_name = d4_arr[0].USER_NAME;
		d4_operation_date = d4_arr[0].OPERATION_DATE;
	} else {
		d4_user_name = '';
		d4_operation_date = '';
	}
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
	var fileRoute = file + '/attached/' + getValue(datas[0].qms_8d_code)
			+ ".pdf";
	parameter.fileName = '/attached/' + getValue(datas[0].qms_8d_code) + ".pdf";

	var writer = PdfWriter.getInstance(surveyDocument, new FileOutputStream(
			fileRoute));

	// 打开文件，开始写入
	surveyDocument.open();

	// 设置 logo
	// var img = Image.getInstance(file + 'images/suguang.png');
	// img.scalePercent(70);
	// img.setAlignment(Element.ALIGN_LEFT);
	// //img.setAbsolutePosition(20, 770);
	// surveyDocument.add(img);

	// 设置pdf标题
	// var pf = new Paragraph(getValue(datas[0].company_name), fontChineseBig);
	// pf.setAlignment(Element.ALIGN_CENTER);
	// pf.setSpacingAfter(10);
	// surveyDocument.add(pf);
	// pf = new Paragraph("8D报告 8D Report", fontChineseBold);
	// pf.setAlignment(Element.ALIGN_CENTER);
	// pf.setSpacingAfter(20);
	// surveyDocument.add(pf);

	// 基本信息
	// addBasicInfo(surveyDocument);
	//
	// // D2 问题描述 Problem description
	// addVendorInfo(surveyDocument);
	//
	// // D1 团队成立 Team formation
	// addCompanyInfo(surveyDocument);
	//
	// // D3 围堵行动 Containment Actions
	// addBusinessInfo(surveyDocument);
	//
	// // D4 根本原因分析 Root cause analysis (至少用5why工具 at least using the 5why tool)
	// addContactInfo(surveyDocument);
	//
	// // D5 纠正措施及执行 Corrective Actions and implementation
	// addAddressInfo(surveyDocument);
	//
	// // D6 验证纠正措施 Verification of Corrective Actions
	// addAccountInfo(surveyDocument);
	//
	// // D7 预防再发生 Preventive actions to avoid reoccurrence
	// addAuthenticateInfo(surveyDocument);
	//
	// // D8 小组祝贺 Congratulate your team
	// addDeviceInfo(surveyDocument);
	//
	// // 9D-验证改善措施
	// addProductInfo(surveyDocument);

	var datas = $ctx.model.getChild("header").getChildren();

	var table0 = new PdfPTable(3);
	table0.setWidthPercentage(100);
	table0.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	table0.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_CENTER);

	var img = Image.getInstance(file
			+ '/images/po_print/kinwong/kinwong_logo.jpg');
	img.scalePercent(8);
	img.setAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	// img.setAbsolutePosition(20, 770);
	// surveyDocument.add(img);
	table0.addCell(img);
	table0
			.addCell(new Paragraph(
					"8D报告                                                                     8D Report",
					fontChineseBig));
	table0.addCell(new Paragraph("  ", fontChinese));

	surveyDocument.add(table0);

	var table01 = new PdfPTable(6);
	table01.setWidthPercentage(100);
	table01.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	table01.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);

	table01.addCell(new Paragraph("8D编号 8D-No.", fontChinese));
	table01.addCell(new Paragraph(getValue(datas[0].qms_8d_code), fontChinese));
	table01.addCell(new Paragraph("版本:  Edition", fontChinese));
	table01.addCell(new Paragraph(getValue(datas[0].version), fontChinese));
	table01.addCell(new Paragraph("发出日期:  Date:", fontChinese));
	table01.addCell(new Paragraph(getValue(datas[0].send_date), fontChinese));

	surveyDocument.add(table01);

	var table1 = new PdfPTable(8);
	table1.setWidthPercentage(100);
	table1.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	table1.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);

	table1.addCell(new Paragraph("报告主题 Complaint title: ", fontChinese));

	var cell1 = new PdfPCell(new Paragraph(getValue(datas[0].qms_8d_title),
			fontChinese));
	cell1.setColspan(7);
	cell1.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell1.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table1.addCell(cell1);

	table1.addCell(new Paragraph("问题发现人 Issued by:", fontChinese));

	var cell2 = new PdfPCell(new Paragraph(getValue(datas[0].discovery),
			fontChinese));
	cell2.setColspan(3);
	cell2.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell2.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table1.addCell(cell2);

	table1.addCell(new Paragraph("供应商名称 Supplier:", fontChinese));

	var cell3 = new PdfPCell(new Paragraph(
			getValue(datas[0].coop_company_desc), fontChinese));
	cell3.setColspan(3);
	cell3.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell3.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table1.addCell(cell3);

	table1.addCell(new Paragraph("发现日期     Date", fontChinese));

	var cell3 = new PdfPCell(new Paragraph(getValue(datas[0].discovery_date),
			fontChinese));
	cell3.setColspan(3);
	cell3.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell3.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table1.addCell(cell3);

	table1.addCell(new Paragraph("信息来源 Information from", fontChinese));

	var cell4 = new PdfPCell(new Paragraph(getValue(datas[0].abnormal_source),
			fontChinese));
	cell4.setColspan(3);
	cell4.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell4.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table1.addCell(cell4);

	// table1.addCell(new Paragraph("发现人电话 Telephone", fontChinese));
	//
	// var cell5 = new PdfPCell(new Paragraph('', fontChinese));
	// cell5.setColspan(3);
	// cell5.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	// cell5.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	// table1.addCell(cell5);

	// table1.addCell(new Paragraph("不良数量 Abnormal quantity", fontChinese));
	//
	// var cell6 = new PdfPCell(new Paragraph(getValue(datas[0].bad_quantity),
	// fontChinese));
	// cell6.setColspan(3);
	// cell6.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	// cell6.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	// table1.addCell(cell6);
	surveyDocument.add(table1);

	addCompanyInfo(surveyDocument);

	addTitle(surveyDocument, 'D2 问题描述 Problem description');
	var table2 = new PdfPTable(6);
	table2.setWidthPercentage(100);
	table2.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	table2.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);

	table2.addCell(new Paragraph("客户名称         Customer", fontChinese));
	table2.addCell(new Paragraph(getValue(datas[0].company_id), fontChinese));
	table2.addCell(new Paragraph("投诉时间               Date of complaint",
			fontChinese));
	table2.addCell(new Paragraph(getValue(datas[0].send_date), fontChinese));
	table2
			.addCell(new Paragraph("投诉位置         Compl. Location(s)",
					fontChinese));
	table2.addCell(new Paragraph(getValue(datas[0].abnormal_source),
			fontChinese));

	table2
			.addCell(new Paragraph("物料名称               Part Number",
					fontChinese));
	table2.addCell(new Paragraph(getValue(datas[0].item_name), fontChinese));
	table2
			.addCell(new Paragraph("订单号                 No.of Order",
					fontChinese));
	table2.addCell(new Paragraph("", fontChinese));
	table2
			.addCell(new Paragraph("出货时间              Shipping date",
					fontChinese));
	table2.addCell(new Paragraph("", fontChinese));

	table2.addCell(new Paragraph("出货数量              No.Of delivered",
			fontChinese));
	table2.addCell(new Paragraph(getValue(datas[0].sampling_quantity),
			fontChinese));
	table2.addCell(new Paragraph("不良数量              No.Of complaints",
			fontChinese));
	table2.addCell(new Paragraph(getValue(datas[0].bad_quantity), fontChinese));
	table2
			.addCell(new Paragraph("不良率                Defect rate",
					fontChinese));
	table2.addCell(new Paragraph(getValue(datas[0].adverse_rate), fontChinese));
	table2.addCell(new Paragraph("问题是否确认 Defect confirmed?", fontChinese));
	table2.addCell(new Paragraph("", fontChinese));
	table2.addCell(new Paragraph("确认人          Confirmed by", fontChinese));
	table2.addCell(new Paragraph(getValue(datas[0].discovery), fontChinese));
	table2.addCell(new Paragraph("是否重复异常 Repeat issue?", fontChinese));
	table2.addCell(new Paragraph(getValue(datas[0].repeat_happen_flag),
			fontChinese));

	var cell7 = new PdfPCell(
			new Paragraph(
					"问题描述及缺陷图片：                   Problem description and  Defect picture：",
					fontChinese));
	cell7.setColspan(2);
	cell7.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell7.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table2.addCell(cell7);

	var cell8 = new PdfPCell(new Paragraph(getValue(datas[0].issue_desc),
			fontChinese));
	cell8.setColspan(4);
	cell8.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell8.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table2.addCell(cell8);

	surveyDocument.add(table2);

	addTitle(
			surveyDocument,
			'D3围堵行动 (至少涵盖在库品、景旺物料、景旺客户端产品）                                                                            D3 Containment Actions ( At least covered inventory, in-transit, KW inventory and KWs customer inventory products)');
	var table3 = new PdfPTable(9);
	table3.setWidthPercentage(100);
	table3.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	table3.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	var table9 = new PdfPTable(6);
	table9.setWidthPercentage(100);
	table9.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	table9.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);

	table9.addCell(new Paragraph("库存零件是否受影响？", fontChinese));
	table9.addCell(new Paragraph(getValue(datas[0].inv_affect_flag_display),
			fontChinese));
	table9.addCell(new Paragraph("措施内容", fontChinese));
	table9.addCell(new Paragraph(getValue(datas[0].inv_affect_measure_display),
			fontChinese));
	table9.addCell(new Paragraph("说明", fontChinese));
	table9.addCell(new Paragraph(getValue(datas[0].inventory_affect_desc),
			fontChinese));

	table9.addCell(new Paragraph("在质零件是否受影响？", fontChinese));
	table9.addCell(new Paragraph(getValue(datas[0].pro_affect_flag_display),
			fontChinese));
	table9.addCell(new Paragraph("措施内容", fontChinese));
	table9.addCell(new Paragraph(getValue(datas[0].pro_affect_measure_display),
			fontChinese));
	table9.addCell(new Paragraph("说明", fontChinese));
	table9.addCell(new Paragraph(getValue(datas[0].process_affect_desc),
			fontChinese));

	table9.addCell(new Paragraph("在途零件是否受影响", fontChinese));
	table9.addCell(new Paragraph(getValue(datas[0].tra_affect_flag_display),
			fontChinese));
	table9.addCell(new Paragraph("措施内容", fontChinese));
	table9.addCell(new Paragraph(getValue(datas[0].tra_affect_measure_display),
			fontChinese));
	table9.addCell(new Paragraph("说明", fontChinese));
	table9.addCell(new Paragraph(getValue(datas[0].transporting_affect_desc),
			fontChinese));

	table9.addCell(new Paragraph("客户库存是否受影响？", fontChinese));
	table9.addCell(new Paragraph(getValue(datas[0].cus_affect_flag_display),
			fontChinese));
	table9.addCell(new Paragraph("措施内容", fontChinese));
	table9.addCell(new Paragraph(getValue(datas[0].cus_affect_measure_display),
			fontChinese));
	table9.addCell(new Paragraph("说明", fontChinese));
	table9.addCell(new Paragraph(getValue(datas[0].custom_stock_affect_desc),
			fontChinese));

	table9.addCell(new Paragraph("共复查多少零件？", fontChinese));
	table9.addCell(new Paragraph(getValue(datas[0].item_reivew_count),
			fontChinese));

	var cell_d0 = new PdfPCell(new Paragraph("检查发现多少问题零件？", fontChinese));
	cell_d0.setColspan(1);
	cell_d0.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell_d0.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table9.addCell(cell_d0);

	var cell_d01 = new PdfPCell(new Paragraph(
			getValue(datas[0].item_trouble_count), fontChinese));
	cell_d01.setColspan(3);
	cell_d01.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell_d01.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table9.addCell(cell_d01);
//20190330 huangyingfei begin
//	var cell_d1 = new PdfPCell(new Paragraph("措施详述", fontChinese));
//	cell_d1.setColspan(2);
//	cell_d1.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
//	cell_d1.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
//	table9.addCell(cell_d1);
//
//	var cell_d3 = new PdfPCell(new Paragraph(getValue(datas[0].measure_desc),
//			fontChinese));
//	cell_d3.setColspan(4);
//	cell_d3.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
//	cell_d3.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
//	table9.addCell(cell_d3);
//
//	var cell_d2 = new PdfPCell(new Paragraph("措施验证", fontChinese));
//	cell_d2.setColspan(2);
//	cell_d2.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
//	cell_d2.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
//	table9.addCell(cell_d2);
//
//	var cell_d4 = new PdfPCell(new Paragraph(getValue(datas[0].measure_check),
//			fontChinese));
//	cell_d4.setColspan(4);
//	cell_d4.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
//	cell_d4.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
//	table9.addCell(cell_d4);
//20190330 huangyingfei end
	
	surveyDocument.add(table9);
	var cell9 = new PdfPCell(new Paragraph(
			"立即围堵行动 Immediate containment action(s) (ICA)", fontChinese));
	cell9.setColspan(7);
	cell9.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell9.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table3.addCell(cell9);

	// table3.addCell(new Paragraph("效果% Eff.%", fontChinese));
	table3.addCell(new Paragraph("负责人 Respons", fontChinese));
	table3.addCell(new Paragraph("完成日期 Deadline", fontChinese));

	var cell10 = new PdfPCell(new Paragraph(getValue(datas[0].MEASURE_DESC),
			fontChinese));
	cell10.setColspan(7);
	cell10.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell10.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table3.addCell(cell10);

	// table3.addCell(new Paragraph(" ", fontChinese));
	table3.addCell(new Paragraph(getValue(users[0].d3_user_name), fontChinese));
	table3.addCell(new Paragraph(getValue(d3_operation_date), fontChinese));

	table3.addCell(new Paragraph("结论: Comments: ", fontChinese));
//	var cell11 = new PdfPCell(new Paragraph(getValue(datas[0].MEASURE_CHECK),
//			fontChinese));huangyingfei 20190330
	var cell11 = new PdfPCell(new Paragraph(getValue(datas[0].measure_desc),
			fontChinese));	
	
	cell11.setColspan(9);
	cell11.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell11.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table3.addCell(cell11);

	surveyDocument.add(table3);

	addTitle(surveyDocument, 'D4根本原因分析　D4 Root cause analysis');

	var table4 = new PdfPTable(9);
	table4.setWidthPercentage(100);
	table4.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	table4.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);

	var cell12 = new PdfPCell(new Paragraph(
			"根本原因(至少用5why工具) Root cause（At least using the 5why tool)",
			fontChinese));
	cell12.setColspan(7);
	cell12.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell12.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table4.addCell(cell12);

	// table4.addCell(new Paragraph("贡献度% Contr.%", fontChinese));
	table4.addCell(new Paragraph("责任人 Respons", fontChinese));
	table4.addCell(new Paragraph("完成日期 Deadline", fontChinese));

	var cell13 = new PdfPCell(new Paragraph(
			"缺陷产生的根本原因 Root cause of occurrence", fontChinese));
	cell13.setColspan(2);
	cell13.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell13.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table4.addCell(cell13);

	var cell14 = new PdfPCell(new Paragraph(getValue(datas[0].reason_desc),
			fontChinese));
	cell14.setColspan(5);
	cell14.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell14.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table4.addCell(cell14);

	// var cell15 = new PdfPCell(new Paragraph(" ", fontChinese));
	// cell15.setRowspan(3);
	// cell15.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	// cell15.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	// table4.addCell(cell15);

	var cell16 = new PdfPCell(new Paragraph(getValue(users[0].d4_user_name),
			fontChinese));
	cell16.setRowspan(3);
	cell16.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell16.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table4.addCell(cell16);

	//var cell17 = new PdfPCell(new Paragraph(d4_operation_date, fontChinese)); huangyingfei 20190330 d4完成日期
	var cell17 = new PdfPCell(new Paragraph(getValue(datas[0].attribute_1), fontChinese));	
	cell17.setRowspan(3);
	cell17.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell17.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table4.addCell(cell17);

	var cell18 = new PdfPCell(new Paragraph("缺陷产生的系统原因 Root cause of system",
			fontChinese));
	cell18.setColspan(2);
	cell18.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell18.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table4.addCell(cell18);

	var cell19 = new PdfPCell(new Paragraph(getValue(datas[0].system_reason),
			fontChinese));
	cell19.setColspan(5);
	cell19.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell19.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table4.addCell(cell19);

	var cell20 = new PdfPCell(new Paragraph(
			"缺陷流出的根本原因  Root  cause of  Non-detection", fontChinese));
	cell20.setColspan(2);
	cell20.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell20.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table4.addCell(cell20);

	var cell21 = new PdfPCell(new Paragraph(getValue(datas[0].unhappen_desc),
			fontChinese));
	cell21.setColspan(5);
	cell21.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell21.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table4.addCell(cell21);
//20190330
//	var cell22 = new PdfPCell(
//			new Paragraph(
//					"风险评估：（评估范围至少涵盖景旺及景旺客户端在库品品质的风险评估）                                                                                              Risk assessment:(At least covered  KW and KW's customer products)",
//					fontChinese));
//	cell22.setColspan(10);
//	cell22.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
//	cell22.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
//	table4.addCell(cell22);

	var cell23 = new PdfPCell(
			new Paragraph(
					"结论：                                                                                                                                                                                                                                  Result:  ",
					fontChinese));
	cell23.setColspan(2);
	cell23.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell23.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table4.addCell(cell23);
	
	
	var cell24 = new PdfPCell(new Paragraph(getValue(datas[0].reason_desc),
			fontChinese));
	cell24.setColspan(8);
	cell24.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell24.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table4.addCell(cell24);	
	

	surveyDocument.add(table4);

	addTitle(surveyDocument,
			'D5纠正措施及执行 D5 Corrective Actions and implementation');
	var table5 = new PdfPTable(9);
	table5.setWidthPercentage(100);
	table5.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	table5.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);

	var cell24 = new PdfPCell(new Paragraph("改善行动 corrective action(s)",
			fontChinese));
	cell24.setColspan(7);
	cell24.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell24.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table5.addCell(cell24);

	// table5.addCell(new Paragraph("改善% Imprv. %", fontChinese));
	table5.addCell(new Paragraph("责任人 Respons", fontChinese));
	table5.addCell(new Paragraph("完成日期 Deadline", fontChinese));

	var cell25 = new PdfPCell(new Paragraph(
			"缺陷产生的改善行动 Corrective action(s) for occurrence", fontChinese));
	cell25.setColspan(2);
	cell25.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell25.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table5.addCell(cell25);

	var cell26 = new PdfPCell(new Paragraph(
			getValue(datas[0].prevent_occur_measure), fontChinese));
	cell26.setColspan(5);
	cell26.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell26.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table5.addCell(cell26);

	// var cell27 = new PdfPCell(new Paragraph(" ", fontChinese));
	// cell27.setRowspan(3);
	// cell27.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	// cell27.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	// table5.addCell(cell27);

	var cell28 = new PdfPCell(new Paragraph(getValue(users[0].d5_user_name),
			fontChinese));
	cell28.setRowspan(3);
	cell28.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell28.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table5.addCell(cell28);

	//var cell29 = new PdfPCell(new Paragraph(getValue(d4_operation_date),
	//		fontChinese)); 20190330 huangyingfei
	var cell29 = new PdfPCell(new Paragraph(getValue(datas[0].attribute_2),
			fontChinese));	
	
	cell29.setRowspan(3);
	cell29.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell29.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table5.addCell(cell29);

	var cell30 = new PdfPCell(new Paragraph(
			"系统方面的改善行动 Corrective action(s) for system", fontChinese));
	cell30.setColspan(2);
	cell30.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell30.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table5.addCell(cell30);

	var cell31 = new PdfPCell(new Paragraph(
			getValue(datas[0].system_reason_measure), fontChinese));
	cell31.setColspan(5);
	cell31.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell31.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table5.addCell(cell31);

	var cell32 = new PdfPCell(new Paragraph(
			"缺陷流出的改善行动 Corrective action(s) for non-detection", fontChinese));
	cell32.setColspan(2);
	cell32.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell32.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table5.addCell(cell32);

	var cell33 = new PdfPCell(new Paragraph(
			getValue(datas[0].prevent_check_measure), fontChinese));
	cell33.setColspan(5);
	cell33.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell33.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table5.addCell(cell33);

	surveyDocument.add(table5);

	addTitle(surveyDocument, 'D6验证纠正措施 D6 Verification of Corrective Actions');
	var table6 = new PdfPTable(9);
	table6.setWidthPercentage(100);
	table6.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	table6.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);

	var cell34 = new PdfPCell(new Paragraph("改善行动 Corrective action(s)",
			fontChinese));
	cell34.setColspan(7);
	cell34.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell34.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table6.addCell(cell34);

	// table6.addCell(new Paragraph("效果% Eff.%", fontChinese));
	table6.addCell(new Paragraph("负责人 Respons", fontChinese));
	table6.addCell(new Paragraph("完成日期 Deadline", fontChinese));

	var cell35 = new PdfPCell(new Paragraph(
			getValue(datas[0].permanent_measure_effect), fontChinese));
	cell35.setColspan(7);
	cell35.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell35.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table6.addCell(cell35);

	// table6.addCell(new Paragraph(" ", fontChinese));
	table6.addCell(new Paragraph(getValue(users[0].d6_user_name), fontChinese));
	//table6.addCell(new Paragraph(getValue(d4_operation_date), fontChinese)); 20190330 huangyingfei
	table6.addCell(new Paragraph(getValue(datas[0].attribute_3), fontChinese));	

	surveyDocument.add(table6);

	addTitle(surveyDocument,
			'D7预防再发生 D7 Preventive actions to avoid reoccurrence');
	var table7 = new PdfPTable(12);
	table7.setWidthPercentage(100);
	table7.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	table7.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);

	var cell36 = new PdfPCell(new Paragraph(
			"品质系统的完善：   Quality system improvement：", fontChinese));
	cell36.setColspan(12);
	cell36.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell36.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table7.addCell(cell36);

	var cell37 = new PdfPCell(new Paragraph("控制计划          Control Plan",
			fontChinese));
	cell37.setColspan(2);
	cell37.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell37.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table7.addCell(cell37);

	var cell38 = new PdfPCell(new Paragraph("FMEA", fontChinese));
	cell38.setColspan(2);
	cell38.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell38.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table7.addCell(cell38);

	var cell39 = new PdfPCell(new Paragraph("SOP/WI", fontChinese));
	cell39.setColspan(2);
	cell39.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell39.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table7.addCell(cell39);

	var cell39_1 = new PdfPCell(new Paragraph("稽查表                Checklist",
			fontChinese)); 
	cell39_1.setColspan(2);
	cell39_1.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell39_1.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table7.addCell(cell39_1);

	var cell39_2 = new PdfPCell(new Paragraph("其他                     Others",
			fontChinese));
	cell39_2.setColspan(2);
	cell39_2.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell39_2.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table7.addCell(cell39_2);

	table7.addCell(new Paragraph("责任人 Respons.", fontChinese));
	table7.addCell(new Paragraph("完成日期 Deadline", fontChinese));

	var cell40 = new PdfPCell(new Paragraph(getValue(datas[0].control_flag),
			fontChinese));
	cell40.setColspan(2);
	cell40.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell40.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table7.addCell(cell40);

	var cell41 = new PdfPCell(new Paragraph(getValue(datas[0].fmea_flag),
			fontChinese));
	cell41.setColspan(2);
	cell41.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell41.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table7.addCell(cell41);

	var cell42 = new PdfPCell(new Paragraph(getValue(datas[0].sop_flag),
			fontChinese));
	cell42.setColspan(2);
	cell42.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell42.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table7.addCell(cell42);

	var cell42_1 = new PdfPCell(new Paragraph(
			getValue(datas[0].audit_form_flag), fontChinese));
	cell42_1.setColspan(2);
	cell42_1.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell42_1.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table7.addCell(cell42_1);

	var cell42_2 = new PdfPCell(new Paragraph(getValue(datas[0].others_flag),
			fontChinese));
	cell42_2.setColspan(2);
	cell42_2.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell42_2.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table7.addCell(cell42_2);

	table7.addCell(new Paragraph(getValue(users[0].d7_user_name), fontChinese));
	//table7.addCell(new Paragraph(getValue(d4_operation_date), fontChinese)); 20190330 huangyingfei
	table7.addCell(new Paragraph(getValue(datas[0].attribute_4), fontChinese));
	var cell43 = new PdfPCell(
			new Paragraph(
					"分享此问题的解决方案到其他工序，产品，产地等：                                                                                                                                    Transfer of the problem solution to other processes, products and manufacturing sites:",
					fontChinese));
	cell43.setColspan(10);
	cell43.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell43.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table7.addCell(cell43);

	surveyDocument.add(table7);

	addTitle(surveyDocument, 'D8 小组祝贺 D8 Congratulate your team');

	var table8 = new PdfPTable(8);
	table8.setWidthPercentage(100);
	table8.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	table8.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);

	var cell44 = new PdfPCell(new Paragraph("结论 Result", fontChinese));
	cell44.setColspan(7);
	cell44.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell44.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table8.addCell(cell44);

	var cell45 = new PdfPCell(new Paragraph("结案日期                 Close date",
			fontChinese));
	cell45.setColspan(1);
	cell45.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell45.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table8.addCell(cell45);

	var cell46 = new PdfPCell(new Paragraph(
			getValue(datas[0].cooperation_effect), fontChinese));
	cell46.setColspan(7);
	cell46.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell46.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table8.addCell(cell46);

	var cell47 = new PdfPCell(new Paragraph(" ", fontChinese));
	cell47.setColspan(1);
	cell47.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell47.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table8.addCell(cell47);

	table8.addCell(new Paragraph("制作                    Prepared by",
			fontChinese));
	table8.addCell(new Paragraph(getValue(datas[0].attribute_5), fontChinese));
	table8.addCell(new Paragraph("审核                   Check by", fontChinese));
	table8.addCell(new Paragraph(getValue(datas[0].attribute_6), fontChinese));

	var cell48 = new PdfPCell(new Paragraph(
			"总经理核准                                    Approved by ",
			fontChinese));
//	table8.addCell(new Paragraph(getValue(datas[0].attribute_7), fontChinese));	

	cell48.setColspan(2);
	cell48.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell48.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table8.addCell(cell48);
//	table8.addCell(new Paragraph("hello", fontChinese));		
	var cell49 = new PdfPCell(new Paragraph(getValue(datas[0].attribute_7), fontChinese));
	cell49.setColspan(2);
	//cell49.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	//cell49.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table8.addCell(cell49);

	var cell50 = new PdfPCell(
			new Paragraph(
					"内部表单编号：GRP-QA-GEN-01-01-B                                                                                                                                                                  Form NO.: GRP-QA-GEN-01-01-B",
					fontChinese));
	cell50.setColspan(8);
	cell50.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	cell50.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
	table8.addCell(cell50);

	surveyDocument.add(table8);

	surveyDocument.close();
	if(writer != null){
		writer.close();
	}
}