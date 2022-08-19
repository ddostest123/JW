var piclist=[];
var df_key=0;
var df_html='';
function df(_this) {
    /*var haspicContainer = document.getElementById("has_pic");
    if (haspicContainer == null) {
        haspicContainer = document.createElement("div");
        haspicContainer.id = "has_pic";
        
        $(".ke-toolbar").after(haspicContainer);*/
	
	var root = UE.htmlparser(UE.getEditor(_this.key).getContent(), true);
	//alert(UE.getEditor('container_1').getContent());
	var imgs = root.getNodesByTagName('img');
	var x=0;
	for (var i=0;i<imgs.length;i++){
		if(imgs[i].getAttr('word_img')!=null)
			{
			piclist[x]=imgs[i].getAttr('word_img').replace(/\\/g,'/');
	        piclist[x]=piclist[x].replace('file:///','');
	        x++;
			}
	}
	if (piclist.length == 0) return false;
    jQuery.ajax({
    	type: 'POST',
        url: '/cloudtrain/ueditor-jsp/upload_json.jsp',
        data: { "piclist": piclist}, 
        //dataType:'json', 
        traditional: true, 
        success: function (msg){
        	if (msg !== "") {
        		var obj = eval('(' + msg + ')');
        		for (i=0;i<imgs.length;i++){
        			var y=0;
                	var src = eval('obj.url'+y)
            		if(imgs[i].getAttr('word_img')!=null)
            			{
            			imgs[i].setAttr('src',src);
            			y++;
            			}
        	}
        		//alert(root.toHtml());
        		UE.getEditor(_this.key).setContent(root.toHtml(),false);
        		df_html=root.toHtml();
        	}
        	}
    });
	
    }