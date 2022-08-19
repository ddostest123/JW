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
// 基本信息
function addBasicInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();

	if (!isEmpty(datas)) {

		// 设置数据
		var header1 = [ '8D标题:', getValue(datas[0].qms_8d_title), '版本:',
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
		var addressTableTitle = [ '姓名', '职责', '角色', '电话', 'E-mail', '说明' ];
		var addressTableTitleCode = [ 'name', 'role', 'responsibility_scope',
				'phone_number', 'email', 'comments' ];
		var addressTableWidth = [ 1, 1, 1, 3, 1, 1 ];

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

		// 设置数据
		var header1 = [ '库存零件是否受影响？:',
				getValue(datas[0].inventory_affect_flag), '措施内容:',
				getValue(datas[0].inventory_affect_measure_display), '说明:',
				getValue(datas[0].inventory_affect_desc) ];
		var header2 = [ '在制零件是否受影响？:', getValue(datas[0].process_affect_flag),
				'措施内容:', getValue(datas[0].process_affect_measure_display),
				'说明:', getValue(datas[0].process_affect_desc), ];
		var header3 = [ '在途零件是否受影响？:',
				getValue(datas[0].transporting_affect_flag), '措施内容:',
				getValue(datas[0].transporting_affect_measure_display), '说明:',
				getValue(datas[0].transporting_affect_desc) ];
		var header4 = [ '客户库存是否受影响？:',
				getValue(datas[0].custom_stock_affect_flag), '措施内容:',
				getValue(datas[0].custom_stock_affect_measure_display), '说明:',
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
	// img.setAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	// //img.setAbsolutePosition(20, 770);
	// surveyDocument.add(img);

	// 设置pdf标题
	var pf = new Paragraph(getValue(datas[0].company_name), fontChineseBig);
	pf.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
	pf.setSpacingAfter(10);
	surveyDocument.add(pf);
	pf = new Paragraph("8D明细", fontChineseBold);
	pf.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
	pf.setSpacingAfter(20);
	surveyDocument.add(pf);

	// 基本信息
	addBasicInfo(surveyDocument);

	// D2 问题描述 Problem description
	addVendorInfo(surveyDocument);

	// D1 团队成立 Team formation
	addCompanyInfo(surveyDocument);

	// D3 围堵行动 Containment Actions
	addBusinessInfo(surveyDocument);

	// D4 根本原因分析 Root cause analysis (至少用5why工具 at least using the 5why tool)
	addContactInfo(surveyDocument);

	// D5 纠正措施及执行 Corrective Actions and implementation
	addAddressInfo(surveyDocument);

	// D6 验证纠正措施 Verification of Corrective Actions
	addAccountInfo(surveyDocument);

	// D7 预防再发生 Preventive actions to avoid reoccurrence
	addAuthenticateInfo(surveyDocument);

	// D8 小组祝贺 Congratulate your team
	addDeviceInfo(surveyDocument);

	// 9D-验证改善措施
	addProductInfo(surveyDocument);

	surveyDocument.close();
	if(writer != null){
		writer.close();
	}
}