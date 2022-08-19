	/*
	 * 使用方法 <div id="cldTest" /> 给一个容器的id 
	 * initHandCalendar(div_id, event);
	 * div_id:容器的id event:事件的数组对象
	 */
	var handCalendar = {
		cldParent:undefined, 
		cldContainer:undefined,
		cldDateTable:undefined,
		cldEvent:[],
		cldClickFunction:undefined,
		rowsNum:0,
		cldDateRowsArray:new Array(),
		cldDateCellsArray:new Array(),
		titleName:'日历', 
		time:new Date(),
		selectTime:undefined,
		dateObj:undefined,
		monthNames:undefined, 
		dayNames:undefined,
		monthdays:undefined,
		timer:0,
		onMouseOutCell:undefined,
		onMouseOverCell:undefined,
		onClickCell:undefined,
		eventsdiv:undefined,
		showTitleObj:undefined
	};
	
	handCalendar.initHandCalendar = function(div_id, event, func){
		var lang = _lang;
		handCalendar.cldClickFunction = func;
		handCalendar.cldEvent = event;
		var cldParent = handCalendar.cldParent = window.document.getElementById(div_id);
		var div = handCalendar.cldContainer = window.document.createElement('div');
		div.className = 'cld-container';
		var div1 = window.document.createElement('div');
		var sDate = "<div class='select-time-bar'><span class='select-con-last'><a href='javascript:handCalendar.changeSelectTime(0, -1);' class='item-dateField-preYear'></a><a href='javascript:handCalendar.changeSelectTime(-1, 0);' class='item-dateField-pre'></a></span>";
		div1.className = 'year-month-select';
		
		div.appendChild(div1);
		var tab = window.document.createElement('table');
		tab.className = 'day-title';
		var div2 = window.document.createElement('div');
		div2.className = 'content-container';
		var table = handCalendar.cldDateTable = window.document.createElement('table');
		table.appendChild(document.createElement("tbody"));
		var div3 = window.document.createElement('div');
		div3.className ='current-time';
		div3.innerHTML = "<span id='time_now_span'/>";
		table.className = 'handCalendarTable';
		div.appendChild(div3);
		div2.appendChild(tab);
		div2.appendChild(table);
		div.appendChild(div2);
		
		if (lang['window.button.ok'].toLowerCase() == 'ok'){
			sDate += "<span id='month_calendar'></span><span id='year_calendar'>2015</span>";
			handCalendar.monthNames = new Array("Jan.","Feb.","Mar.","Apr.","May.","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec.");
			handCalendar.dayNames = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu','Fri', 'Sat');
		}else{
			sDate += "<span id='year_calendar'>2015</span>年<span id='month_calendar'></span>";
			handCalendar.monthNames = new Array("01月","02月","03月","04月","05月","06月","07月","08月","09月","10月","11月","12月");
			handCalendar.dayNames = new Array('日', '一', '二', '三', '四','五', '六');
		}
		sDate += "<span class='select-con-next'><a href='javascript:handCalendar.changeSelectTime(1, 0);' class='item-dateField-next'></a><a href='javascript:handCalendar.changeSelectTime(0, 1);' class='item-dateField-nextYear'></a></span></div>";
		div1.innerHTML = sDate;
		
		var monthdays = handCalendar.monthdays = new Array(12);
		monthdays[0]=31; 
		monthdays[2]=31; 
		monthdays[3]=30; 
		monthdays[4]=31; 
		monthdays[5]=30; 
		monthdays[6]=31; 
		monthdays[7]=31; 
		monthdays[8]=30; 
		monthdays[9]=31; 
		monthdays[10]=30; 
		monthdays[11]=31;
		
		handCalendar.selectTime = new Date();
		handCalendar.selectTime.setDate(1);
		handCalendar.resetCalendarInfor(handCalendar.selectTime);
		
		var tr, td, j;
		tr = tab.insertRow();
		tr.className = 'dayTitle';
		for(j = 0; j < 7; j++){
			td = tr.insertCell();
			td.innerHTML = handCalendar.dayNames[j];
		}
		handCalendar.insertRow(7,7);
		cldParent.appendChild(div);
		handCalendar.renderDateCells(handCalendar.selectTime.getMonth());
		handCalendar.setTimeOut();
		handCalendar.timer = setInterval(handCalendar.setTimeOut, 1000);
		
		//显示事件列表
		var divc = window.document.createElement('DIV');
		handCalendar.eventsdiv = divc;
		cldParent.appendChild(divc);
		divc.className = 'person-events-con';
		divc.style.display = 'none'
		
		var divm = window.document.createElement('DIV');
		handCalendar.showTitleObj = divm;
		divm.className = 'cell-data-div';
		divm.innerHTML = '<div class="cell-data-title" ></div><div class="cell-data-message" ></div>';
	}
	
	handCalendar.updateHandCalendarData = function(event){
		if(handCalendar.selectTime == undefined){
			return;
		}
		handCalendar.cldEvent = event;
		handCalendar.renderDateCells(handCalendar.selectTime.getMonth());
	}
	
	handCalendar.setTimeOut = function(){
		var time = handCalendar.time;
		var se = time.getSeconds();
		var mi = time.getMinutes();
		var hh = time.getHours();
		se ++;
		if (se > 59){
			se = 0;
			mi ++;
			if (mi > 59){
				mi = 0;
				hh ++;
				if (hh > 23){
					handCalendar.time = new Date();
					document.getElementById('time_now_span').innerHTML = time.getFullYear() + '-' + (time.getMonth() > 8 ? (time.getMonth() + 1) : ('0' + (1 + time.getMonth()))) + '-' + 
					(time.getDate() > 9 ? (time.getDate()) : ('0' + (time.getDate()))) + ' ' + '00:00:00';
					return;
				}
			}
		}
		time.setMinutes(mi);
		time.setSeconds(se);
		time.setHours(hh);
		document.getElementById('time_now_span').innerHTML = time.getFullYear() + '-' + (time.getMonth() > 8 ? (time.getMonth() + 1) : ('0' + (1 + time.getMonth()))) + '-' + 
		(time.getDate() > 9 ? (time.getDate()) : ('0' + (time.getDate()))) + ' ' +
		(hh > 9 ? hh:('0' + hh)) + ':' + (mi > 9 ? mi:('0' + mi)) + ':' + (se > 9 ? se:('0' + se));
	}
	
	handCalendar.insertRow = function(rowNum, colsNum){
		var tableRows = handCalendar.cldDateRowsArray;
		var tr, td, div, span, i, j;
		for(i= 0; i < rowNum; i++){
			tr = document.createElement("TR");
			tableRows.push(tr);
			for(j = 0; j < 7; j++){
				td = document.createElement("TD");
				tr.appendChild(td);
				span = document.createElement("SPAN");
				span.className = 'date-number';
				td.appendChild(span);
				handCalendar.cldDateCellsArray.push(td);
			}
		}
	}
	handCalendar.onClickCell = function(e){
		e = e || event;
		var tgr = e.currentTarget || e.srcElement,  span;
		while (tgr.nodeName != 'TD'){
			tgr = tgr.parentNode;
		}
		var data = tgr.data;
		if (data == null){
			return;
		}
		var div = handCalendar.eventsdiv;
		div.innerHTML = '';
		//渲染event
		for (var i = 0; i < data.length ; i++){
			span = window.document.createElement('SPAN');
			span.data = data[i];
			span.onclick = handCalendar.onClickEvent;
			span.onmouseover = handCalendar.onMouseOverSpan;
			span.onmouseout = handCalendar.onMouseOutSpan;
			span.className = 'current-user-event-label';
			span.style.backgroundColor = data[i].backgroundColor;
			span.style.borderColor = data[i].borderColor;
			span.innerHTML =data[i].start_year + '-' + (data[i].start_month + 1) + '-' + data[i].start_day + ' ' + data[i].start_hour	+ ':' + data[i].start_minute;
			div.appendChild(span);
		}
		div.style.display = 'block'
	}
	
	handCalendar.onClickEvent = function (e){
		e = e || event;
		var tgr = e.currentTarget || e.srcElement
		handCalendar.cldClickFunction(tgr.data);
	}
	
	handCalendar.onMouseOverSpan = function(e){
		e = e || event;
		var tgr = e.currentTarget || e.srcElement;
		
		if(tgr.data == null){
			return;
		}
		while (tgr.nodeName != 'SPAN'){
			parent = parent.parentNode;
		}
		var parent = tgr.parentNode;
		handCalendar.showTitleObj.children[0].innerHTML = '标题:' + tgr.data.message_title;
		handCalendar.showTitleObj.style.top = tgr.offsetTop + 'px';
		handCalendar.showTitleObj.style.backgroundColor = tgr.data.backgroundColor;
		if(tgr.data.message_content != undefined){
			handCalendar.showTitleObj.children[1].innerHTML = '' + tgr.data.message_content;
		}else{
			handCalendar.showTitleObj.children[1].innerHTML = '';
		}
		parent.appendChild(handCalendar.showTitleObj);
	}
	
	handCalendar.onMouseOutSpan = function(e){
		e = e || event;
		var tgr = e.currentTarget || e.srcElement;
		if(tgr.data == null){
			return;
		}
		var parent = tgr.parentNode;
		while (parent.nodeName != 'DIV'){
			parent = parent.parentNode;
		}
		
		try{ 
			parent.removeChild(handCalendar.showTitleObj);
		}catch(e){ 
			return;
		}
	}
	
	handCalendar.onClickShowMore = function (e){
		e = e || event;
		var tgr = e.currentTarget || e.srcElement;
		var children = tgr.parentNode.children;
		
		for(var i = 1; i < children.length; i++){
			children[i].style.display = 'block';
		}
	}
	
	handCalendar.resetCalendarInfor = function(time){
		handCalendar.dateObj = {year:time.getFullYear(), month:time.getMonth(), date:time.getDate(), day:time.getDay(), startDay:undefined, endDay:undefined};
		var thisyear = handCalendar.dateObj.year;
		if (((thisyear % 4 == 0) && !(thisyear % 100 == 0))||(thisyear % 400 == 0)) 
			handCalendar.monthdays[1] = 29;
		else
			handCalendar.monthdays[1] = 28;
		var date = handCalendar.dateObj.date;
		var day = handCalendar.dateObj.day;
		var startDay = ((day - (date - 1) % 7) + 7) % 7;
		handCalendar.dateObj.startDay = startDay;
		handCalendar.dateObj.endDay = (day + (handCalendar.monthdays[handCalendar.dateObj.month] - date)) % 7;
	}
	
	handCalendar.renderDateCells = function(month){
		document.getElementById('month_calendar').innerHTML = handCalendar.monthNames[month];
		document.getElementById('year_calendar').innerHTML = handCalendar.dateObj.year;
		var dateNow = handCalendar.time;
		var tableCells = handCalendar.cldDateCellsArray;
		var tableRows = handCalendar.cldDateRowsArray;
		var table = handCalendar.cldDateTable;
		var monthdays = handCalendar.monthdays;
		var day = startDay = handCalendar.dateObj.startDay, i;
		var endDay = handCalendar.dateObj.endDay;
		var length = monthdays[month] + startDay;
		var currentRowsNum = (monthdays[month] + startDay + (7 - endDay - 1)) / 7;
		var lastRowsNum = handCalendar.rowsNum;
		if (lastRowsNum > currentRowsNum){
			for(i = 0; i < lastRowsNum - currentRowsNum; i ++){
				table.deleteRow(lastRowsNum - 1 - i);
			}
		}else if (lastRowsNum < currentRowsNum){
			for(i = 0; i < currentRowsNum - lastRowsNum; i ++){
				table.tBodies[0].appendChild(tableRows[lastRowsNum + i]);
			}
		}
		handCalendar.rowsNum = currentRowsNum;
		
		//渲染上个月的日期
		var mon, year, dat, lastDate;
		mon = month - 1;
		year = handCalendar.dateObj.year;
		if (mon < 0){
			mon = 11;
			year--;
		}
		lastDate = monthdays[mon];
		dat = lastDate - startDay;
		dateCompare = {year: year, month: mon, date: dat};
		for(i = 0; i < startDay; i++ ){
			dat++;;
			tableCells[i].innerHTML = '<span>' + dat + '</span>';
			if (year == dateNow.getFullYear() && mon == dateNow.getMonth() && dat == dateNow.getDate()){
				tableCells[i].className = 'lastDateAsTime';
			}else{
				tableCells[i].className = 'lastDate';
			}
			dateCompare.date = dat;
			handCalendar.renderEventCell(tableCells[i], -1, dateCompare);
		}
		
		//渲染当月的日期
		mon = month;
		year = handCalendar.dateObj.year;
		dat = 1;
		dateCompare.year = year;
		dateCompare.month = mon;
		for(i = startDay; i < length; i++){
			dat = 1 + i - startDay;
			tableCells[i].innerHTML = '<span>' + dat + '</span>';
			if (year == dateNow.getFullYear() && mon == dateNow.getMonth() && dat == dateNow.getDate()){
				tableCells[i].className = 'currentDateAsTime';
			}else{
				tableCells[i].className = 'currentDate';
			}
			
			day = day % 7;
			if (day == 0 || day == 6){
				tableCells[i].className += ' weekend';
			}
			day ++;
			dateCompare.date = dat;
			tableCells[i].data = null;
			handCalendar.renderEventCell(tableCells[i], 0, dateCompare);
		}
		
		//渲染下个月的日期
		var length3 = 6 - endDay;
		mon = month + 1;
		if (mon > 11){
			mon = 1;
			year++;
		}
		dat = 1;
		dateCompare.year = year;
		dateCompare.month = mon;
		for(i = 0; i < length3; i++){
			dat = 1 + i;
			tableCells[i + length].innerHTML = '<span>' + dat + '</span>';
			if (year == dateNow.getFullYear() && mon == dateNow.getMonth() && dat == dateNow.getDate()){
				tableCells[i + length].className = 'nextDateAsTime';
			}else{
				tableCells[i + length].className = 'nextDate';
			}
			
			dateCompare.date = dat;
			handCalendar.renderEventCell(tableCells[i + length], 1, dateCompare);
		}
		
	}
	
	handCalendar.renderEventCell = function(cell, type, dateObj){
		cell.data = null;
		var userEvent = handCalendar.cldEvent;
		var length = userEvent.length;
		var num = 0;
		var eventStartDate;
		for (var i = 0; i < length; i++){
			eventStartDate = userEvent[i];
			if (eventStartDate.start_year == dateObj.year && eventStartDate.start_month == dateObj.month && eventStartDate.start_day == dateObj.date){
				if (cell.data == null){
					cell.data = [];
					cell.onclick = handCalendar.onClickCell;
					cell.data = new Array();
					if (type == -1){
						cell.className += ' ' + 'lastuserevent';
					}else if(type == 0){
						cell.className += ' ' + 'currentuserevent'; 
					}else if (type == 1){
						cell.className += ' ' + 'nextuserevent';
					}
				}
				cell.data.push(eventStartDate);
			}
		}
	}
	
	handCalendar.changeSelectTime = function(dMonth, dYear){
		var time = handCalendar.selectTime;
		var month = time.getMonth() + dMonth;
		var year = time.getFullYear() + dYear;
		if (month > 11){
			month = 0;
			year = year + 1;
		}else if (month < 0){
			month = 11;
			year = year - 1;
		}
		time.setMonth(month);
		time.setFullYear(year);
		
		handCalendar.selectTime.setMonth(month);
		handCalendar.resetCalendarInfor(handCalendar.selectTime);
		handCalendar.renderDateCells(month);
	}