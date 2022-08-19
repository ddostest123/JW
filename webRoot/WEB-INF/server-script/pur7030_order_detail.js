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

	for ( var i = 0; i < column; i++) {
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

	// 设置表格，并填充元素
	var headerTable = new PdfPTable(cells);
	headerTable.setWidthPercentage(widthPercentage);
	headerTable.getDefaultCell().setBackgroundColor(BaseColor.WHITE);

	for ( var i = 0; i < columns; i++) {
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
		headerTable.setSpacingAfter(5);
	}
	surveyDocument.add(headerTable);
}

function addDetailTable(surveyDocument, datas, title, title_code, width, font) {
	// 获取表格宽度的cell总数
	var sum = 0;
    var money=0;
	for ( var i = 0; i < width.length; i++) {
		sum += parseInt(width[i]);
	}

	// 设置核心表格，并循环添加数据
	var datatable = new PdfPTable(sum);
	datatable.setWidthPercentage(100);
	datatable.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
	datatable.getDefaultCell().setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
	// datatable.setSpacingAfter(40);

	// 添加标题
	for ( var i = 0; i < title.length; i++) {
		var cell = new PdfPCell(new Paragraph(title[i], font));
		cell.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
		cell.setColspan(width[i]);
		datatable.addCell(cell);
	}

	// 添加明细
	for ( var i = 0; i < datas.length; i++) {
		for ( var j = 0; j < title_code.length; j++) {
			eval('setPdfTableCell(getValue(datas[i].' + title_code[j]
					+ '), width[j], datatable, font)');
		}
		money+= parseFloat(getValue(datas[i].original_amount));
	}
	surveyDocument.add(datatable);
	money=money.toFixed(2);
	return money;
}
// 基本信息
function addBasicInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();

	if (!isEmpty(datas)) {

		// survey_type_code = getValue(datas[0].survey_type_code);
		// println(survey_type_code);
		// 设置数据
		var header1 = [ '供应商名称(Vendor)：', getValue(datas[0].vendor_name),
				'供应商代码(Vendor Code)：', getValue(datas[0].vendor_code),
				'订购日期(P.O Date)：', getValue(datas[0].creation_date_desc) ];
		var header2 = [ '收货组织(Ship to)：',
				getValue(datas[0].inv_organization_name), '币别(Currency)：',
				getValue(datas[0].currency_code), '税码(Tax Rate)：', null ];
		var header3 = [ '付款方式(Payment Terms)：', null, '联系人(Contact Person)：',
				getValue(datas[0].agent_name), '联系电话(Telephone)：', null ];
		var header4 = [ '供应商地址(Vendor Adress) ：',
				getValue(datas[0].vendor_site_name), '传真号码(Fax No)：', null,
				'邮箱(E-mail)：', null ];

		// // 设置标题和分割线
		// addTitle(surveyDocument, '基本信息');
		// addUnderLine(surveyDocument);

		// 按行添加数据
		addHeaderRow(surveyDocument, header1, 6, 6, 100);
		addHeaderRow(surveyDocument, header2, 6, 6, 100);
		addHeaderRow(surveyDocument, header3, 6, 6, 100);
		addHeaderRow(surveyDocument, header4, 6, 6, 100);
	}
}
// 物料信息
function addCompanyInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();
	var money=0;
	var address = $ctx.model.getChild("address").getChildren();
	
	if (!isEmpty(address)) {
		var addressTableTitle = [ '序号(Item No)', '物料编码(Part No.)',
				'物料名称(Description)', '补充说明(Remark)', '数量(Quantity)',
				'单位(Unit)', '含税单价(Unit Price)', '金额(Amount)',
				'交货日期(Delivery Date)', '备注(Comments)' ];
		var addressTableTitleCode = [ 'line_num', 'item_code',
				'item_description ', 'null', 'quantity',
				'unit_meas_lookup_code', 'original_unit_price',
				'original_amount', 'need_by_date', 'line_desc' ];
		var addressTableWidth = [ 1, 2, 4, 2, 1, 1, 1, 1, 2, 3 ];
		// 输出表格
		money=addDetailTable(surveyDocument, address, addressTableTitle,
				addressTableTitleCode, addressTableWidth, fontChinese);
	}
	var pf = new Paragraph("总金额：" +money, fontChinese);
	pf.setAlignment(com.itextpdf.text.Element.ALIGN_RIGHT);
	surveyDocument.add(pf);
}
// 备注
function addBusinessInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();

	if (!isEmpty(datas)) {

		survey_type_code = getValue(datas[0].survey_type_code);
		println(survey_type_code);
		// 设置数据
		var header1 = [ '1．订单确认：',
				'供方（即供应商，下同）收到本订购单后，需在1个工作日内回复交期并确认，否则需方有权视为供方已接受本订单及其条款。' ];
		var header2 = [ '2．送货地点：',
				getValue(datas[0].ship_to_location_address), '送货时间：' ,'周一~周六：上午  8：00-12：00 下午 13：00-17：00'];
		var header3 = [ '3．一旦供方开',
				'始履行本订单时，双方签署的(GRP-OP-02-11)《采购合同》、(GRP-OP-02-18)《品质保证协议》、《报价单》（报价单编号：）及双方所签的其他协议即成为有约束力的合同。' ];
		var header4 = [ '4．送货要求：',
		                '供方必需随采购物料提供送货单及出货检验报告，送货单上需盖章并标明需方采购订单号、规格型号、数量、单价及总金额，外包装上需注明是否符合欧盟和其他国家环保指令及其延伸指令，并帖上相应标识。'
				 ];
		var header5 = [ '5．结算方式：', '自需方收到供方发票之月起按照双方协商的付款方式付款。'];



		// 按行添加数据
		addHeaderRow(surveyDocument, header1, 2, 6, 100);
		addHeaderRow(surveyDocument, header2, 4, 6, 100);
		addHeaderRow(surveyDocument, header3, 2, 6, 100);
		addHeaderRow(surveyDocument, header4, 2, 6, 100);
		addHeaderRow(surveyDocument, header5, 2, 6, 100);

	}
}
// 结尾
function addContactInfo(surveyDocument) {
	// 获取数据
	var datas = $ctx.model.getChild("header").getChildren();

	if (!isEmpty(datas)) {

		survey_type_code = getValue(datas[0].survey_type_code);
		println(survey_type_code);
		// 设置数据
		var header1 = [ '公司名称：', getValue(datas[0].company_name),'供应商名称：' ,getValue(datas[0].vendor_name),null,null];
		var header2 = [ '采购员：', getValue(datas[0].agent_name) ,'供应商代表：',null,null,null];
		var header3 = [ '审核：', null ,'日期：',null,null,null];
		var header4 = [ '日期：', getValue(datas[0].creation_date_desc) ];

		// 按行添加数据
		addHeaderRow(surveyDocument, header1, 6, 6, 100);
		addHeaderRow(surveyDocument, header2, 6, 6, 100);
		addHeaderRow(surveyDocument, header3, 6, 6, 100);
		addHeaderRow(surveyDocument, header4, 2, 6, 100);
	}
}


// 主函数
function exportToPdf() {

	var datas = $ctx.model.getChild("header").getChildren();

	// 新建文件对象
	var surveyDocument = new com.itextpdf.text.Document();
	surveyDocument.setPageSize(PageSize.A4.rotate());

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
	pf = new Paragraph("采购订单", fontChineseBold);
	pf.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
	surveyDocument.add(pf);
	pf = new Paragraph("Purchase Order", fontChineseBold);
	pf.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
	pf.setSpacingAfter(20);
	surveyDocument.add(pf);
	pf = new Paragraph("订单号(P.O NO)：" + getValue(datas[0].display_po_number),
			fontSubTitle);
	pf.setAlignment(com.itextpdf.text.Element.ALIGN_RIGHT);
	surveyDocument.add(pf);

	// 基本信息
	addBasicInfo(surveyDocument);
	// 物料信息
	addCompanyInfo(surveyDocument);
	pf = new Paragraph("供方必须给景旺最惠价，同等情况下，一经确认供方提供给景旺的报价高于其他需求方，"
			+ "供方应当承担补偿景旺差价的责任，同时景旺有权利要求供方支付等同于差价（交易数量X交易差价）十倍的惩罚性违约金。",
			fontChinese);
	pf.setAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	pf.setSpacingAfter(10);
	surveyDocument.add(pf);
	addUnderLine(surveyDocument);

	pf = new Paragraph("备注：", fontSubTitle);
	pf.setAlignment(com.itextpdf.text.Element.ALIGN_LEFT);
	surveyDocument.add(pf);

	//备注
	addBusinessInfo(surveyDocument);
	addUnderLine(surveyDocument);

	// 结尾
	addContactInfo(surveyDocument);

	

	surveyDocument.close();
}