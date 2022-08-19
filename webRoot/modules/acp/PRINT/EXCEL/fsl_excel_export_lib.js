importClass(java.io.File);
importClass(java.io.FileOutputStream);
importClass(java.io.FileInputStream);
importPackage(java.lang);
importClass(java.io.InputStream);
importClass(java.io.OutputStream);
importClass(javax.servlet.http.HttpServlet);
importClass(javax.servlet.http.HttpServletRequest);
importClass(javax.servlet.http.HttpServletResponse);
importClass(Packages.aurora.service.ServiceInstance);

importClass(org.apache.poi.hssf.usermodel.HSSFCell);
importClass(org.apache.poi.hssf.usermodel.HSSFCellStyle);
importClass(org.apache.poi.hssf.usermodel.HSSFDataFormat);
importClass(org.apache.poi.hssf.usermodel.HSSFRow);
importClass(org.apache.poi.hssf.usermodel.HSSFSheet);
importClass(org.apache.poi.hssf.usermodel.HSSFWorkbook);

importClass(org.apache.poi.hssf.util.Region);
importClass(org.apache.poi.hssf.usermodel.HSSFFont);
importClass(org.apache.poi.ss.util.RegionUtil);
importClass(org.apache.poi.hssf.util.HSSFColor);
importClass(java.nio.channels.Channels);
importClass(java.nio.ByteBuffer);
importClass(Packages.aurora.service.http.HttpServiceInstance);
importClass(java.nio.channels.ReadableByteChannel);
importClass(java.nio.channels.WritableByteChannel);
var parameter = $ctx.parameter;
var context = $ctx.getData();
var serviceInstance = ServiceInstance.getInstance(context);
// 获取request对象
var request = serviceInstance.getRequest();
// 获取response对象
var response = (HttpServletResponse)(((HttpServiceInstance)(serviceInstance)).getResponse());
println((OutputStream)(serviceInstance.getResponse().getOutputStream()));
function createFilePath() {
    var file = request.getSession().getServletContext().getRealPath(File.separator);
    // 文档保存路径
    parameter.filePath = 'ueditor-jsp/jsp/upload/file/PUR7110/out.xls';
    parameter.fileRoute = file + parameter.filePath;
    parameter.fileLoad = file + 'ueditor-jsp/jsp/upload/file/PUR7110';
    var dirFile = new File(parameter.fileLoad);
    if (!dirFile.exists()) {
        dirFile.mkdir();
    }
}

function setResponseHeader() {
    response.setContentType("application/vnd.ms-excel");
    try {
        response.setHeader("Content-Disposition", "attachment; filename=\"out.xls\" ");
        response.setHeader("cache-control", "must-revalidate");
        response.setHeader("pragma", "public");
    } catch (e) {
        throw e;
    }
}
function transferOutputStream(os,  is) 
  {
    var rbc = (ReadableByteChannel)((InputStream)(Channels.newChannel(is)));
    var wbc = (WritableByteChannel)((OutputStream)(Channels.newChannel(os)));
    var buffer = ByteBuffer.allocate(1024);
    try {
      while (rbc.read(buffer) != -1) {
        buffer.flip();
        wbc.write(buffer);
        buffer.compact();
      }
    } catch ( e) {
      throw e;
    } finally {
      wbc.close();
      rbc.close();
      is.close();
    }
  }

//一次创建一行
//cur_list:{第几列:[值，合并行数，合并列数,单元格样式],......}合并行列数可为空
//row_num:第几行
function create_from_list(sheet, row_num, cur_list, row_height) {
    var row = sheet.createRow(row_num);
    row.setHeight(row_height ? row_height : 500);
    row.setWidth(1000);
    for (i in cur_list) {
        //设置单元值
        var cell = row.createCell(parseInt(i));
        var value = '-'
        if (cur_list[i][0]) {
            value = cur_list[i][0];
        }
        cell.setCellValue(String(value));
        if (cur_list[i].length > 1) {
            //合并单元格
            if (cur_list[i][1] != '0') {
                sheet.addMergedRegion(new Region(row_num, parseInt(i), row_num + parseInt(cur_list[i][1]), parseInt(i)));
            }
            if (cur_list[i][2] != '0') {
                sheet.addMergedRegion(new Region(row_num, parseInt(i), row_num, parseInt(i) + parseInt(cur_list[i][2])));
            }
            if (cur_list[i].length > 3) {
                cell.setCellStyle(style_map[cur_list[i][3]]);
            }
        }
    }
}
//fontName:字体名称
//fontSize:字体大小
//bold:加粗
//textAlign:字体位置
//border:边线
//fontColor:字体颜色
//underLine:下划线
var style_map = {};
function ceateStyle(wb, fontName, fontSize, bold, textAlign, border, fontColor, underLine) {
    //创建样式
    var style = wb.createCellStyle(); // 样式对象
    style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER); // 垂直
    style.setAlignment(textAlign);
    style.setWrapText(true);
    if (border) {
        style.setBorderTop(1);
        style.setBorderBottom(1);
        style.setBorderRight(1);
        style.setBorderLeft(1);
    }
    //设置字体
    var font = wb.createFont();
    //设置字体样式
    font.setFontHeightInPoints(fontSize);
    font.setFontName(fontName);
    if (bold) {
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
    }
    font.setColor(fontColor);
    font.setItalic(false);
    if (underLine) {
        font.setUnderline(HSSFFont.U_SINGLE);
    }
    style.setFont(font);
    return style;
}
            