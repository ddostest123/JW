importPackage(Packages.aurora.plugin.security);

importPackage(java.io);
importPackage(java.util);
importPackage(javax.xml.parsers);
importPackage(org.w3c.dom);
importPackage(org.xml.sax);
importPackage(Packages.aurora.plugin.util)

var logger = $logger('server-script');

function log(msg) {
	logger.info(msg);
}
function getXML(str,TagName){
	var factory = DocumentBuilderFactory.newInstance();
	var builder = factory.newDocumentBuilder();
	var reader=new StringReader(str);
	var document=builder.parse(new InputSource(reader));
	var bookList = document.getElementsByTagName(TagName);
	if(bookList != null && bookList.getLength()>0) {
	 return	bookList.item(0).getTextContent();
	}else{
		return null;
	}
}
function dataProcessing(tempdata){
    var realdata = '';
    if(typeof(tempdata) == 'undefined'){
    	return realdata;
    }else{
    	return tempdata;
    }
    return tempdata;
}
function createNode(nodeName) {
	var node = new CompositeMap(nodeName);
	return node;
}
function createNode(nodeName, parentNode) {
	log(parentNode.toXML());
	var node = new CompositeMap(nodeName);
	parentNode.addChild(node);
	return node;
}

function createNode(nodeName, parentNode, value) {
	var node = new CompositeMap(nodeName);
	node.setText(value);
	parentNode.addChild(node);
	return node;
}
function createRecordNode(nodeName, value) {
	var node = new CompositeMap(nodeName);
	node.put('@url', value);
	return node;
}
function createRecordNode(nodeName, parentNode, value, value1) {
	var node = new CompositeMap(nodeName);
	node.put('@url', value);
	node.put('@eitf_instance_id', value1);
	parentNode.addChild(node);
	return node;
}
function createRequestNode(nodename,parentNode,value) {
	var node = new CompositeMap(nodename);
	node.setText(value);
	parentNode.addChild(node);
}
function createRequestContext(nodeName,dataMap) {
	var requestContext = new CompositeMap(nodeName);
    createRequestNode('ap:P_ORG_ID',requestContext,dataProcessing(dataMap.es_business_unit_id));
    createRequestNode('ap:P_CHECK_NUMBER',requestContext,dataProcessing(dataMap.bill_number));
    createRequestNode('ap:P_CHECK_STATUS',requestContext,dataProcessing(dataMap.ebs_status));
   return requestContext;
}
function getRequestData(header_id) {
	var soapRequest = new CompositeMap('soapenv:Envelope');

	soapRequest.put("@xmlns:ap", "http://xmlns.oracle.com/apps/cux/soaprovider/plsql/cux_srm_pvt/ap_account_status/");
	soapRequest.put("@xmlns:cux", "http://xmlns.oracle.com/apps/cux/soaprovider/plsql/cux_srm_pvt/");
	soapRequest.put("@xmlns:soapenv", "http://schemas.xmlsoap.org/soap/envelope/");
	
	var header = new CompositeMap('soapenv:Header');
	soapRequest.addChild(header);
	
	
	var soaHeader = new CompositeMap('cux:SOAHeader');
	header.addChild(soaHeader);
	var nlslangua = new CompositeMap('cux:NLSLanguage');
	soaHeader.addChild(nlslangua);
	nlslangua.setText('SIMPLIFIED CHINESE');
	var wsse = new CompositeMap('wsse:Security');
	wsse.put("@mustUnderstand","1");
	wsse.put("@xmlns:wsse","http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd");
	header.addChild(wsse);
	
	var userToken = new CompositeMap('wsse:UsernameToken');
	wsse.addChild(userToken);
	createRequestNode('wsse:Username',userToken,'OA');
	var password = new CompositeMap('wsse:Password');
	password.put("@Type", "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText");
	password.setText('12345678');
	userToken.addChild(password);
	
	var body = new CompositeMap('soapenv:Body');
	log(soapRequest)
	if (header_id) {
		$ctx.parameter.header_id = header_id;
		var bm = 'eitf.ws.ACP.acp_bill_header_query';
		var dataMap = new ModelService(bm).queryAsMap().getChildren()[0];
		var requestContext = createRequestContext("ap:InputParameters",dataMap);
		body.addChild(requestContext);
		soapRequest.addChild(body);
	}

	return soapRequest.toXML();
}
