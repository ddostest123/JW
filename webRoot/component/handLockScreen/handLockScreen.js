/*
 * author:libin
 * purpose:锁频解频
 * 
 * 使用方法:handmask.mask();handmask.unmask();
 */  
var handmask = {	
	interval:null,
	speed : 1,
	maskFlag : false,
	img_width:0,
	mask:function () {
	    var length = window.document.body.children.length;
	    var body = window.document.body;
	    var img_dis;
   	    if (handmask.maskFlag) {
	         return;
        }
	    var div = document.createElement("div");
        var html = '';
        div.className = 'ext-mask';
        div.id = 'ext_handLock_mask_id';
        html += '<div class="middle">';
        /*html += '<div class="text">Loading...</div>';*/
        html += '<div class="img1"></div>';
        html += '<div class="img2"></div>';
        html += '<div class="line">';
        html += '<div class="progress">';
        html += '10%';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        div.innerHTML = html;
        body.appendChild(div);
        //设置绝对定位图片的位置left;
        imgset();
        handmask.maskFlag = true;
        handmask.speed = 1;
        handmask.interval = setInterval(function() {
             interval();
        }, 100);
        
        function imgset(){
        	var num = body.children.length;
        	var img = body.children[num - 1].children[0].children[0];
        	var line = body.children[num - 1].children[0].children[2];
        	handmask.img_width = img.nextSibling.offsetWidth;
        	img_dis = (line.offsetWidth - handmask.img_width)/2;
        	img.style.left = img_dis + 'px';
        }

        function interval() {
        	 //var body = window.document.body;
        	 //var num = body.children.length;
        	 var body = document.getElementById('ext_handLock_mask_id');
             var child = document.getElementById('ext_handLock_mask_id').children[0].children[2].children[0];
             var length = child.offsetWidth;
             var body_length = body.children[0].offsetWidth;
             var step = body_length * (handmask.speed / 100);
             var percent = Math.round((length + step) / body_length * 100);
             setInterSpeed();
             child.style.width = length + step + 'px';
             child.innerHTML = percent + '%';
             //图片覆盖效果
             var img = body.children[0].children[0];
             var img1_width = (length + step) - img_dis;
             if(img1_width < 0){
            	 img1_width = 0;
             }else if(img1_width > handmask.img_width){
            	 img1_width = handmask.img_width;
             }
             img.style.width = img1_width + 'px';
             
        }
        //根据length算speed
        function setInterSpeed() {
             handmask.speed = handmask.speed * 0.988;
        }
   },
            
   unmask:function () {
        var length = window.document.body.children.length;
        var body = window.document.body;
        clearInterval(handmask.interval);
        var child_p = body.lastChild.children[0].children[2].children[0];
        var img = body.lastChild.children[0].children[0];
        child_p.style.width = 100 + '%';
        child_p.innerHTML = 100 + '%';
        img.style.width = handmask.img_width + 'px';
        var timeOut = setTimeout(function() {
                var child = body.lastChild;
                body.removeChild(child);
                handmask.maskFlag = false;
            }, 500);
   }
}