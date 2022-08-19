<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="cn.beecloud.BCEumeration.*"%>
<%@ page import="cn.beecloud.BCPay"%>
<%@ page import="cn.beecloud.BCUtil"%>
<%@ page import="cn.beecloud.bean.BCException"%>
<%@ page import="cn.beecloud.bean.BCOrder"%>
<%@ page import="java.io.IOException"%>
<%@ page import="java.net.HttpURLConnection"%>
<%@ page import="java.net.URL"%>
<%@ page import="java.net.URLEncoder"%>
<%@ page import="java.util.*"%>
<%@ page import="net.sf.json.JSONObject"%>
<%
    /*
        功能：用户支付
        版本：1.0
        日期：2017-01-11
        说明： 支付处理页面， 用于发起比可网络支付系统的请求，包括支付宝、微信、银联
     */
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
<meta http-equiv="Content-Type" content="text/html; UTF-8">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<title>Going-Link平台支付</title>
<style>
#qrcode_img_id img {
	width: 180px !important;
	height: 180px !important;
}
</style>
</head>
<body style="background: #eeeeee; width: 99.4%">
	<%
    //商户的交易编号、标题、金额、附加数据
    //String billNo = BCUtil.generateRandomUUIDPure();
    String order_number = request.getParameter("order_number");
    String billNo = request.getParameter("detail_number");
    //out.println("billNo=" + billNo);
    String package_price = request.getParameter("package_price");
    Integer fee = 0;
    if(package_price != null){
        fee = Integer.parseInt(package_price);
    }
    String title = "SRM云平台服务费";
    Map<String, Object> optional = new HashMap<String, Object>();

    String type = request.getParameter("paytype");
    PAY_CHANNEL channel;
    try {
        channel = PAY_CHANNEL.valueOf(type);
    } catch (Exception e) {
        channel = null;
    }
    boolean success = false;

    BCOrder bcOrder = new BCOrder(channel, fee, billNo, title);
    bcOrder.setTotalFee(fee);
    bcOrder.setBillTimeout(360);
    bcOrder.setOptional(optional);

    //设置return url
    String baseUrl =  request.getScheme()+ "://" + request.getServerName() + ":" + request.getServerPort();
    String returnUrl = baseUrl + "/";
        
    //设置notify_url,相当于是支付成功之后beecloud的回调地址
    String notify_url = request.getParameter("notify_url");
    
    bcOrder.setReturnUrl(returnUrl);
    bcOrder.setNotifyUrl(notify_url);
    
    if(channel != null){
	    switch (channel) {
	    	//BeePay快捷
		    case BC_EXPRESS:
		        try {
		            bcOrder = BCPay.startBCPay(bcOrder);
		            //out.println(bcOrder.getObjectId());
		            //Thread.sleep(3000);
	                out.println(bcOrder.getHtml());
		        } catch (BCException e) {
		            out.println(e.getMessage());
		        }
		        break;
		    //微信扫码
	        case BC_NATIVE:
	            try {
	                bcOrder = BCPay.startBCPay(bcOrder);
	                //out.println(bcOrder.getObjectId());
	                //Thread.sleep(3000);
	            } catch (BCException e) {
	                out.println(e.getMessage());
	            }
	            break;
	            //微信扫码(官方)
	        case WX_NATIVE:
	            try {
	                bcOrder = BCPay.startBCPay(bcOrder);
	                //out.println(bcOrder.getObjectId());
	                //Thread.sleep(3000);
	            } catch (BCException e) {
	                out.println(e.getMessage());
	            }
	            break;
		    //支付宝扫码
		    case BC_ALI_QRCODE:
		        try {
		            bcOrder = BCPay.startBCPay(bcOrder);
		            //out.println(bcOrder.getObjectId());
		            //Thread.sleep(3000);
	                out.println(bcOrder.getHtml());
		        } catch (BCException e) {
		            out.println(e.getMessage());
		        }
		        break;
		      //支付宝扫码（官方）
		    case ALI_QRCODE:
		        try {
		            bcOrder = BCPay.startBCPay(bcOrder);
		            out.println(bcOrder.getObjectId());
		            //Thread.sleep(3000);
	                out.println(bcOrder.getHtml());
		        } catch (BCException e) {
		        	
		            out.println(e.getMessage());
		        }
		        break;
	        default:
	            break;
	    }
	} 
%>
	<div
		style="position: relative; z-index: 10; margin-left: 250px; margin-top: -20px;">
		<div style="float: left">
			<li
				style="line-height: 30px; font-size: 14px; list-style: none; margin-left: 30px;">
				<div style="float: left; margin-top: 20px; margin-left: 30px;">订单编号：</div>
				<div id="order_number_id" style="float: left; margin-top: 20px;" />
			</li>
		</div>
		<div style="font-size: 14px;">
			<li
				style="float: left; list-style: none; margin-left: -55px; margin-top: -1px;">
				<div
					style="float: left; line-height: 30px; margin-left: 100px; margin-top: 20px;">请于</div>
				<div
					style="float: left; line-height: 30px; color: #ff5451; font-size: 14px; margin-top: 20px;">15分钟内</div>
				<div style="float: left; line-height: 30px; margin-top: 20px;">完成支付,逾期交易自动关闭。</div>
			</li>
			<li style="float: right; list-style: none; margin-right: 350px">
				<div style="float: left; line-height: 30px; margin-top: 18.5px;">应付金额:</div>
				<div id="package_price_id"
					style="float: left; line-height: 30px; font-size: 16px; color: #ff5451; margin-top: 18.5px;"/>
			</li>
		</div>
	</div>
	<div
		style="background: #fff; width: 956px; height: 490px; margin: 0 auto; -webkit-box-shadow: 0 0 20px #D1D1D1; -moz-box-shadow: 0 0 20px #D1D1D1; box-shadow: 0 0 20px #D1D1D1;">
		<div id="qrcode_title_id"
			style="margin-top: 60px; text-algin: center; margin-left: 252px; padding-top: 150px;"></div>
		<div id="qrcode_img_id"></div>
		<div style="margin-left: 450px; margin-top: -250px;">
			<img id="phone_img_id" />
		</div>
		<div id="success_pay_div_id" style="margin-top:30px; margin-left:410px; font-size:12px;"></div>
	</div>
	</div>
	<div align="center" id="loading_div_id"
		style=" position: absolute; z-index: 99; margin-top: -420px; background: #fff; height: 420px; width: 900px;">
		<img alt="LOADING" src="./img/loading.gif"
			style="margin-top: 100px; background: #fff" />
	</div>
</body>
<script src="./js/qrcode.js"></script>
<script type="text/javascript">

    function makeqrcode() {
    	var qr = qrcode(10, 'L');
        qr.addData(codeUrl);
        qr.make();
        var code= document.getElementById('qrcode_img_id');

        document.getElementById("loading_div_id").style.display="none";
        
        if(type == 'BC_NATIVE'|| type =='WX_NATIVE'){
            document.getElementById('qrcode_title_id').innerHTML = '微信扫码支付';
            document.getElementById('qrcode_img_id').style.marginLeft = '209px';
            document.getElementById('phone_img_id').src = 'img/wechatpay.png';
        }else if(type == 'BC_ALI_QRCODE'|| type =='ALI_QRCODE') {
            document.getElementById('qrcode_title_id').innerHTML = '支付宝扫码支付';
            document.getElementById('qrcode_img_id').style.marginLeft = '218px';
            document.getElementById('phone_img_id').src = 'img/alipay.jpg';
        }
        
        if(type == 'BC_NATIVE' || type == 'BC_ALI_QRCODE'||type == 'WX_NATIVE'||type == 'ALI_QRCODE') {
            
            code.innerHTML = qr.createImgTag();
            
            var div = document.getElementById('success_pay_div_id');
            var child = '<span></span>';
            var span1 = window.document.createElement('span');
            span1.innerHTML = '您已支付完成？';
            div.appendChild(span1);

            var span2 = window.document.createElement('span');
            span2.setAttribute('onclick', 'parent.pay_success()');
            span2.style.color='#ff5451';
            span2.style.cursor='pointer';
            span2.innerHTML = '点击这里';
            div.appendChild(span2);
        }
    }

    var type = '<%=type%>';
    var codeUrl;
    var success = '<%=success%>';
    
    if (type == 'WX_NATIVE' || type == 'BC_NATIVE' || type == 'BC_ALI_QRCODE'||type =='ALI_QRCODE') {
        //填写订单号和金额
        document.getElementById('order_number_id').innerHTML= '<%=order_number%>';
        document.getElementById('package_price_id').innerHTML= '<%=package_price%>' / 100 + '元';
        codeUrl = '<%=bcOrder.getCodeUrl()%>';
    }
    if (type == 'WX_NATIVE' || 'true' == success || type == 'BC_NATIVE'
            || type == 'BC_ALI_QRCODE'||type =='ALI_QRCODE') {
        makeqrcode();
    }
</script>
</html>