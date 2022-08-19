var logger = $logger('server-script');
var config = $config();
function log(msg) {
	logger.info(msg);
}

function addAllProperty(node, nameMap) {
	for (var name in nameMap) {
		node[name] = nameMap[name];
	}
	return node;
}
