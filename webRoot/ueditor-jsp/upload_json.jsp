<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*,java.io.*" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="org.apache.commons.fileupload.*" %>
<%@ page import="org.apache.commons.fileupload.disk.*" %>
<%@ page import="org.apache.commons.fileupload.servlet.*" %>
<%@ page import="org.json.simple.*" %>
<%

/**
 * KindEditor JSP
 * 
 * 本JSP程序是演示程序，建议不要直接在实际项目中使用。 
 * 如果您确定直接使用本程序，使用之前请仔细确认相关安全设置。
 * 
 */

 
 
 String piclist[]=request.getParameterValues("piclist");
//文件保存目录路径
String savePath = pageContext.getServletContext().getRealPath("/") + "/ueditor-jsp/jsp/upload/image/";
//文件保存目录URL
String saveUrl  = request.getContextPath() + "/ueditor-jsp/jsp/upload/image/";
//定义允许上传的文件扩展名
String[] fileTypes = new String[]{"gif", "jpg", "jpeg", "png", "bmp"};
//最大文件大小
long maxSize = 1000000;

response.setContentType("text/html; charset=UTF-8");
//检查目录
File uploadDir = new File(savePath);
if(!uploadDir.isDirectory()){
	out.println(getError("上传目录不存在。"));
	return;
}
//检查目录写权限
if(!uploadDir.canWrite()){
	out.println(getError("上传目录没有写权限。"));
	return;
}
//创建文件夹
SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
String ymd = sdf.format(new Date());
savePath += ymd + "/";
saveUrl += ymd + "/";
File dirFile = new File(savePath);
if (!dirFile.exists()) {
	dirFile.mkdirs();
}
String file_name;

//文件复制
JSONObject obj = new JSONObject();
		obj.put("error", 0);
for(int j=0;j<piclist.length;j++)
{
File file2=new File(piclist[j]);
FileInputStream in2=new FileInputStream(file2);

File file=new File(savePath+file2.getName());
FileOutputStream out2=new FileOutputStream(file);
file_name=file2.getName();
if(!file.exists()){
    file.createNewFile();}
file_name=file2.getName();
obj.put("url"+j, saveUrl+file_name);
byte buffer[]=new byte[1024];
int c;
while((c=in2.read(buffer))!=-1)
{
    for(int i=0;i<c;i++)
        {out2.write(buffer[i]);}        
}
in2.close();
out2.close();
}	


		
		
		obj.put("piclist", saveUrl);
		out.println(obj.toJSONString());//返回字段
	
%>
<%!
private String getError(String message) {
	JSONObject obj = new JSONObject();
	obj.put("error", 1);
	obj.put("message", message);
	return obj.toJSONString();
}
%>