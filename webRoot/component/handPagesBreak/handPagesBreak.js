function initHandPageBreak(container, totalPages, showPagesNum, changePageBack, index) {
	totalPages = parseInt(totalPages);
	showPagesNum = parseInt(showPagesNum) + 1;
	var dom = window.document;
	container = typeof(container) == 'string' ? dom.getElementById(container) : container;
	var currentPage = parseInt(index) || 1;
	currentPage = (currentPage <= totalPages) ? currentPage : 1;
	var parent = container.children[0];
	if (!parent) {
		parent = dom.createElement('DIV');
		parent.className = 'page-container';
		parent.style.textAlign = 'center';
		container.appendChild(parent);
	}
	var div = parent.children[0];
	var inputCon = parent.children[1];
	var pagesArray, controlObj;
	var pageClassName = 'pg-item';
	var changePageClassName = "pg-btn";
	var desabled = 'disabled';
	if (div) {
		pagesArray = parent.pagesArray;
		controlObj = parent.controlObj;
		initPageSign();
	} else {
		//页码标签和按钮容器
		var type_color = parent.getAttribute('con-type');
		div = dom.createElement('DIV');
		div.className = 'page-break-con ' + type_color;
		parent.appendChild(div);
		//输入页容器
		inputCon = dom.createElement('DIV');
		inputCon.className = 'page-input-con ' + type_color;
		parent.appendChild(inputCon);
		parent.pagesArray = pagesArray = new Array();
		controlObj = parent.controlObj = {
			preBtn: undefined,
			nextBtn: undefined
		};
		initPageDom();
		initInputCon();
	}
	selectPageSign(currentPage);
	inputCon.input.value = currentPage;
	inputCon.totalPage.innerHTML = '共' + totalPages + '页，到第';
	
	function initPageDom() {
		var span, i, le;
		span = dom.createElement('SPAN');
		span.innerHTML = '<i class="icon-angle-left"></i>';
		span.setAttribute('index', -1);
		span.className = changePageClassName + ' pre ' + desabled;
		controlObj.preBtn = span;
		div.appendChild(span);
		span = dom.createElement('SPAN');
		span.innerHTML = '<i class="icon-angle-right"></i>';
		span.className = changePageClassName + ' next';
		if (totalPages == 1) {
			span.className = changePageClassName + ' next ' + desabled;
		}
		span.setAttribute('index', 1);
		controlObj.nextBtn = span;
		if (totalPages <= showPagesNum + 3) {
			for (i = 0; i < totalPages; i++) {
				span = dom.createElement('SPAN');
				pagesArray.push(span);
				span.setAttribute('arraySign', i);
				span.setAttribute('index', i + 1);
				span.className = pageClassName;
				span.innerHTML = i + 1;
				div.appendChild(span);
			}
		} else {
			le = showPagesNum - 1;
			for (i = 0; i < le; i++) {
				span = dom.createElement('SPAN');
				pagesArray.push(span);
				span.setAttribute('arraySign', i);
				span.setAttribute('index', i + 1);
				span.className = pageClassName;
				span.innerHTML = i + 1;
				div.appendChild(span);
			}
			span = dom.createElement('SPAN');
			pagesArray.push(span);
			span.setAttribute('arraySign', le);
			span.innerHTML = '...';
			div.appendChild(span);
			span = dom.createElement('SPAN');
			pagesArray.push(span);
			span.setAttribute('arraySign', le + 1);
			span.setAttribute('index', totalPages);
			span.innerHTML = totalPages;
			div.appendChild(span);
			span.className = pageClassName;
			span = dom.createElement('SPAN');
			pagesArray.push(span);
			span.setAttribute('arraySign', le + 2);
			span.innerHTML = '...';
			span.style.display = 'none';
			div.appendChild(span);
			span = dom.createElement('SPAN');
			pagesArray.push(span);
			span.setAttribute('arraySign', le + 3);
			span.innerHTML = '...';
			span.style.display = 'none';
			div.appendChild(span);
		}
		div.appendChild(controlObj.nextBtn);
		if (totalPages > 0) {
			pagesArray[0].className = pageClassName + ' active';
		}
	}
	//初始化输入页码
	function initInputCon() {
		var span = document.createElement('span');
		inputCon.appendChild(span);
		span.innerHTML = '共19页，到第';
		inputCon.totalPage = span;
		var input = document.createElement('INPUT');
		inputCon.appendChild(input);
		inputCon.input = input;
		input.setAttribute('type', 'text');
		input.page = 1;
		input.value = 1;
		span = document.createElement('span');
		inputCon.appendChild(span);
		span.innerHTML = '页';
		var btn = document.createElement('BUTTON');
		btn.innerHTML = '确定';
		btn.className = 'item-rbtn-blue';
		inputCon.button = btn;
		inputCon.appendChild(btn);
		btn.onclick = function() {
			var page = parseInt(input.value);
			if (page && page != currentPage && page <= totalPages) {
				selectPageSign(page);
				changePageBack(page);
			}
		}
	}
	
	function initPageSign() {
		var l, i, le;
		//判定是否存在分页
		l = pagesArray.length;
		i = 0;
		while (i < l) {
			pagesArray[i].className = pageClassName;
			i++;
		}
		if (totalPages <= showPagesNum + 3) {
			if (l < totalPages) {
				for (i = l; i < totalPages; i++) {
					span = dom.createElement('SPAN');
					pagesArray.push(span);
					span.setAttribute('arraySign', i);
					span.setAttribute('index', i + 1);
					span.className = pageClassName;
					span.innerHTML = i + 1;
					div.insertBefore(span, controlObj.nextBtn);
				}
			} else {
				while (l > totalPages) {
					div.removeChild(pagesArray.pop());
					l--;
				}
			}
		} else {
			le = showPagesNum - 1;
			for (i = 0; i < le; i++) {
				span = pagesArray[i];
				if (!span) {
					span = dom.createElement('SPAN');
					pagesArray.push(span);
					span.setAttribute('arraySign', i);
					span.setAttribute('index', i + 1);
					span.className = pageClassName;
					div.insertBefore(span, controlObj.nextBtn);
				}
				span.innerHTML = i + 1;
			}
			span = pagesArray[le];
			if (!span) {
				span = dom.createElement('SPAN');
				pagesArray.push(span);
				span.setAttribute('arraySign', le);
				div.insertBefore(span, controlObj.nextBtn);
			}
			span.innerHTML = '...';
			span = pagesArray[le + 1];
			if (!span) {
				span = dom.createElement('SPAN');
				pagesArray.push(span);
				span.setAttribute('arraySign', le + 1);
				div.insertBefore(span, controlObj.nextBtn);
			}
			span.setAttribute('index', totalPages);
			span.innerHTML = totalPages;
			span.className = pageClassName;
			span = pagesArray[le + 2];
			if (!span) {
				span = dom.createElement('SPAN');
				pagesArray.push(span);
				span.setAttribute('arraySign', le + 2);
				div.insertBefore(span, controlObj.nextBtn);
			}
			span.innerHTML = '...';
			span.style.display = 'none';
			span = pagesArray[le + 3];
			if (!span) {
				span = dom.createElement('SPAN');
				pagesArray.push(span);
				span.setAttribute('arraySign', le + 3);
				div.insertBefore(span, controlObj.nextBtn);
			}
			span.innerHTML = '...';
			span.style.display = 'none';
		}
		pagesArray[0].className = pageClassName + ' active';
		controlObj.preBtn.setAttribute('class', changePageClassName + ' pre ' + desabled);
	}
	//根据当前页面和总页面挑选显示的页面
	function selectPageSign(page) {
		currentPage = page || currentPage;
		inputCon.input.value = currentPage;
		if (currentPage != totalPages) {
			controlObj.nextBtn.setAttribute('class', changePageClassName + ' next');
		} else {
			controlObj.nextBtn.setAttribute('class', changePageClassName + ' next ' + desabled);
		}
		if (currentPage != 1) {
			controlObj.preBtn.setAttribute('class', changePageClassName + ' pre');
		} else {
			controlObj.preBtn.setAttribute('class', changePageClassName + ' pre ' + desabled);
		}
		if (totalPages <= showPagesNum + 3) {
			var inx = 0,
				l = pagesArray.length;
			for (i = 0; i < l; i++) {
				inx = 1 + i;
				if (inx != currentPage) {
					className = pageClassName;
				} else {
					className = pageClassName + ' active';
				}
				span = pagesArray[i];
				span.style.display = 'inline-block';
				span.innerHTML = inx;
				span.setAttribute('index', inx);
				span.setAttribute('class', className);
			}
			return;
		} else {
			var l = pagesArray.length - 3,
				span, className, i, inx;
			if (currentPage < showPagesNum) {
				//左边显示 右边缺省  1234...8
				for (i = 0; i < l; i++) {
					inx = 1 + i;
					if (inx != currentPage) {
						className = pageClassName;
					} else {
						className = pageClassName + ' active';
					}
					span = pagesArray[i];
					span.style.display = 'inline-block';
					span.innerHTML = inx;
					span.setAttribute('index', inx);
					span.setAttribute('class', className);
				}
				span = pagesArray[i];
				span.style.display = 'inline-block';
				span.innerHTML = '...';
				span.setAttribute('index', '');
				span.setAttribute('class', '');
				i++;
				span = pagesArray[i];
				span.style.display = 'inline-block';
				span.innerHTML = totalPages;
				span.setAttribute('index', totalPages);
				span.setAttribute('class', pageClassName);
				i++;
				pagesArray[i].style.display = 'none';
			} else if (totalPages - currentPage >= showPagesNum) {
				//左边缺省  右边缺省 1...345...8
				span = pagesArray[0];
				span.style.display = 'inline-block';
				span.innerHTML = '1';
				span.setAttribute('index', 1);
				span.setAttribute('class', pageClassName);
				span = pagesArray[1];
				span.style.display = 'inline-block';
				span.innerHTML = '...';
				span.setAttribute('index', '');
				span.setAttribute('class', '');
				l = pagesArray.length - 2;
				var in0 = currentPage - Math.floor(l / 2) - 1;
				for (i = 2; i < l; i++) {
					inx = in0 + i;
					if (inx != currentPage) {
						className = pageClassName;
					} else {
						className = pageClassName + ' active';
					}
					span = pagesArray[i];
					span.style.display = 'inline-block';
					span.innerHTML = inx;
					span.setAttribute('index', inx);
					span.className = className;
				}
				span = pagesArray[i];
				span.style.display = 'inline-block';
				span.innerHTML = '...';
				span.setAttribute('index', '');
				span.setAttribute('class', '');
				i++;
				span = pagesArray[i];
				span.style.display = 'inline-block';
				span.innerHTML = totalPages;
				span.setAttribute('index', totalPages);
				span.className = pageClassName;
			} else if (totalPages - currentPage < showPagesNum) {
				//右边缺省 1..5678
				span = pagesArray[0];
				span.style.display = 'inline-block';
				span.innerHTML = '1';
				span.setAttribute('index', 1);
				span.className = pageClassName;
				span = pagesArray[1];
				span.style.display = 'inline-block';
				span.innerHTML = '...';
				span.setAttribute('index', '');
				span.className = '';
				l = pagesArray.length;
				var in0 = totalPages - l + 1;
				for (i = 2; i < l; i++) {
					inx = in0 + i;
					if (inx != currentPage) {
						className = pageClassName;
					} else {
						className = pageClassName + ' active';
					}
					span = pagesArray[i];
					span.style.display = 'inline-block';
					span.innerHTML = inx;
					span.setAttribute('index', inx);
					span.className = className;
				}
			}
		}
	}
	div.onclick = function(e) {
		var e = e || event;
		var target = e.target || e.srcElement;
		var index = parseInt(target.getAttribute('index'));
		if (!index) {
			return;
		}
		var className = target.getAttribute('class');
		if (className.indexOf(changePageClassName) > -1) {
			index = currentPage + index;
			if (index < 1 || index > totalPages) {
				return;
			}
		}
		if (currentPage == index) {
			return;
		}
		selectPageSign(index);
		changePageBack(index);
	}
}