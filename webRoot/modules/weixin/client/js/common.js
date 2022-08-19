function encodeParameters(parameters){
    var jsonParameters = JSON.stringify({  parameter  : parameters});
    return '_request_data=' + jsonParameters;

}

