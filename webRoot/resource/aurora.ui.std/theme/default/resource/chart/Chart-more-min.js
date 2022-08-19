(function(b,D){var h=b.each,w=b.extend,j=b.merge,B=b.map,i=b.pick,c=b.pInt,C=b.getOptions().plotOptions,A=b.seriesTypes,r=b.extendClass,z=b.splat,o=b.wrap,n=b.Axis,a=b.Tick,m=b.Series,y=A.column.prototype,g=function(){};function x(E,F,G){this.init.call(this,E,F,G)}w(x.prototype,{init:function(F,G,I){var J=this,H,E=J.defaultOptions;J.chart=G;if(G.angular){E.background={}}J.options=F=j(E,F);H=F.background;if(H){h([].concat(z(H)).reverse(),function(L){var K=L.backgroundColor;L=j(J.defaultBackgroundOptions,L);if(K){L.backgroundColor=K}L.color=L.backgroundColor;I.options.plotBands.unshift(L)})}},defaultOptions:{center:["50%","50%"],size:"85%",startAngle:0},defaultBackgroundOptions:{shape:"circle",borderWidth:1,borderColor:"silver",backgroundColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,"#FFF"],[1,"#DDD"]]},from:Number.MIN_VALUE,innerRadius:0,to:Number.MAX_VALUE,outerRadius:"105%"}});var v=n.prototype,l=a.prototype;var f={getOffset:g,redraw:function(){this.isDirty=false},render:function(){this.isDirty=false},setScale:g,setCategories:g,setTitle:g};var p={isRadial:true,defaultRadialGaugeOptions:{labels:{align:"center",x:0,y:null},minorGridLineWidth:0,minorTickInterval:"auto",minorTickLength:10,minorTickPosition:"inside",minorTickWidth:1,plotBands:[],tickLength:10,tickPosition:"inside",tickWidth:2,title:{rotation:0},zIndex:2},defaultRadialXOptions:{gridLineWidth:1,labels:{align:null,distance:15,x:0,y:null},maxPadding:0,minPadding:0,plotBands:[],showLastLabel:false,tickLength:0},defaultRadialYOptions:{gridLineInterpolation:"circle",labels:{align:"right",x:-3,y:-2},plotBands:[],showLastLabel:false,title:{x:4,text:null,rotation:90}},setOptions:function(E){this.options=j(this.defaultOptions,this.defaultRadialOptions,E)},getOffset:function(){v.getOffset.call(this);this.chart.axisOffset[this.side]=0;this.center=this.pane.center=A.pie.prototype.getCenter.call(this.pane)},getLinePath:function(G,F){var E=this.center;F=i(F,E[2]/2-this.offset);return this.chart.renderer.symbols.arc(this.left+E[0],this.top+E[1],F,F,{start:this.startAngleRad,end:this.endAngleRad,open:true,innerR:0})},setAxisTranslation:function(){v.setAxisTranslation.call(this);if(this.center){if(this.isCircular){this.transA=(this.endAngleRad-this.startAngleRad)/((this.max-this.min)||1)}else{this.transA=(this.center[2]/2)/((this.max-this.min)||1)}if(this.isXAxis){this.minPixelPadding=this.transA*this.minPointOffset+(this.reversed?(this.endAngleRad-this.startAngleRad)/4:0)}}},beforeSetTickPositions:function(){if(this.autoConnect){this.max+=(this.categories&&1)||this.pointRange||this.closestPointRange}},setAxisSize:function(){v.setAxisSize.call(this);if(this.center){this.len=this.width=this.height=this.isCircular?this.center[2]*(this.endAngleRad-this.startAngleRad)/2:this.center[2]/2}},getPosition:function(F,E){if(!this.isCircular){E=this.translate(F);F=this.min}return this.postTranslate(this.translate(F),i(E,this.center[2]/2)-this.offset)},postTranslate:function(H,F){var G=this.chart,E=this.center;H=this.startAngleRad+H;return{x:G.plotLeft+E[0]+Math.cos(H)*F,y:G.plotTop+E[1]+Math.sin(H)*F}},getPlotBandPath:function(O,P,Q){var E=this.center,N=this.startAngleRad,K=E[2]/2,J=[i(Q.outerRadius,"100%"),Q.innerRadius,i(Q.thickness,10)],F=/%$/,G,I,L,H=this.isCircular,M;if(this.options.gridLineInterpolation==="polygon"){M=this.getPlotLinePath(O).concat(this.getPlotLinePath(P,true))}else{if(!H){J[0]=this.translate(O);J[1]=this.translate(P)}J=B(J,function(R){if(F.test(R)){R=(c(R,10)*K)/100}return R});if(Q.shape==="circle"||!H){G=-Math.PI/2;I=Math.PI*1.5;L=true}else{G=N+this.translate(O);I=N+this.translate(P)}M=this.chart.renderer.symbols.arc(this.left+E[0],this.top+E[1],J[0],J[0],{start:G,end:I,innerR:i(J[1],J[0]-J[2]),open:L})}return M},getPlotLinePath:function(L,J){var G=this,E=G.center,K=G.chart,H=G.getPosition(L),F,N,M,I;if(G.isCircular){I=["M",E[0]+K.plotLeft,E[1]+K.plotTop,"L",H.x,H.y]}else{if(G.options.gridLineInterpolation==="circle"){L=G.translate(L);if(L){I=G.getLinePath(0,L)}}else{F=K.xAxis[0];I=[];L=G.translate(L);M=F.tickPositions;if(F.autoConnect){M=M.concat([M[0]])}if(J){M=[].concat(M).reverse()}h(M,function(P,O){N=F.getPosition(P,L);I.push(O?"L":"M",N.x,N.y)})}}return I},getTitlePosition:function(){var E=this.center,F=this.chart,G=this.options.title;return{x:F.plotLeft+E[0]+(G.x||0),y:F.plotTop+E[1]-({high:0.5,middle:0.25,low:0}[G.align]*E[2])+(G.y||0)}}};o(v,"init",function(O,P,N){var I=this,Q=P.angular,F=P.polar,T=N.isX,G=Q&&T,J,R,M,S,K=P.options,E=N.pane||0,H,L;if(Q){w(this,G?f:p);J=!T;if(J){this.defaultRadialOptions=this.defaultRadialGaugeOptions}}else{if(F){w(this,p);J=T;this.defaultRadialOptions=T?this.defaultRadialXOptions:j(this.defaultYAxisOptions,this.defaultRadialYOptions)}}O.call(this,P,N);if(!G&&(Q||F)){S=this.options;if(!P.panes){P.panes=[]}this.pane=P.panes[E]=H=new x(z(K.pane)[E],P,I);L=H.options;P.inverted=false;K.chart.zoomType=null;this.startAngleRad=R=(L.startAngle-90)*Math.PI/180;this.endAngleRad=M=(i(L.endAngle,L.startAngle+360)-90)*Math.PI/180;this.offset=S.offset||0;this.isCircular=J;if(J&&N.max===D&&M-R===2*Math.PI){this.autoConnect=true}}});o(l,"getPosition",function(G,J,I,H,E){var F=this.axis;return F.getPosition?F.getPosition(I):G.call(this,J,I,H,E)});o(l,"getLabelPosition",function(N,Q,O,P,R,I,J,K,E){var G=this.axis,F=I.y,M,L=I.align,H=(G.translate(this.pos)+G.startAngleRad+Math.PI/2)/Math.PI*180;if(G.isRadial){M=G.getPosition(this.pos,(G.center[2]/2)+i(I.distance,-25));if(I.rotation==="auto"){P.attr({rotation:H})}else{if(F===null){F=c(P.styles.lineHeight)*0.9-P.getBBox().height/2}}if(L===null){if(G.isCircular){if(H>20&&H<160){L="left"}else{if(H>200&&H<340){L="right"}else{L="center"}}}else{L="center"}P.attr({align:L})}M.x+=I.x;M.y+=F}else{M=N.call(this,Q,O,P,R,I,J,K,E)}return M});o(l,"getMarkPath",function(H,M,L,I,J,N,G){var E=this.axis,K,F;if(E.isRadial){K=E.getPosition(this.pos,E.center[2]/2+I);F=["M",M,L,"L",K.x,K.y]}else{F=H.call(this,M,L,I,J,N,G)}return F});C.arearange=j(C.area,{lineWidth:1,marker:null,threshold:null,tooltip:{pointFormat:'<span style="color:{series.color}">{series.name}</span>: <b>{point.low}</b> - <b>{point.high}</b><br/>'},trackByArea:true,dataLabels:{verticalAlign:null,xLow:0,xHigh:0,yLow:0,yHigh:0},shadow:false});var t=b.extendClass(b.Point,{applyOptions:function(J,G){var F=this,L=F.series,E=L.pointArrayMap,K=0,I=0,H=E.length;if(typeof J==="object"&&typeof J.length!=="number"){w(F,J);F.options=J}else{if(J.length){if(J.length>H){if(typeof J[0]==="string"){F.name=J[0]}else{if(typeof J[0]==="number"){F.x=J[0]}}K++}while(I<H){F[E[I++]]=J[K++]}}}F.y=F[L.pointValKey];if(F.x===D&&L){F.x=G===D?L.autoIncrement():G}return F},toYData:function(){return[this.low,this.high]}});A.arearange=b.extendClass(A.area,{type:"arearange",pointArrayMap:["low","high"],pointClass:t,pointValKey:"low",translate:function(){var F=this,E=F.yAxis;A.area.prototype.translate.apply(F);h(F.points,function(G){if(G.y!==null){G.plotLow=G.plotY;G.plotHigh=E.translate(G.high,0,1,0,1)}})},getSegmentPath:function(H){var M=[],G=H.length,E=m.prototype.getSegmentPath,K,L,J,N=this.options,F=N.step,I;while(G--){K=H[G];M.push({plotX:K.plotX,plotY:K.plotHigh})}J=E.call(this,H);if(F){if(F===true){F="left"}N.step={left:"right",center:"center",right:"left"}[F]}I=E.call(this,M);N.step=F;L=[].concat(J,I);I[0]="L";this.areaPath=this.areaPath.concat(J,I);return L},drawDataLabels:function(){var L=this.data,K=L.length,G,J=[],I=m.prototype,H=this.options.dataLabels,E,F=this.chart.inverted;if(H.enabled||this._hasPointLabels){G=K;while(G--){E=L[G];E.y=E.high;E.plotY=E.plotHigh;J[G]=E.dataLabel;E.dataLabel=E.dataLabelUpper;E.below=false;if(F){H.align="left";H.x=H.xHigh}else{H.y=H.yHigh}}I.drawDataLabels.apply(this,arguments);G=K;while(G--){E=L[G];E.dataLabelUpper=E.dataLabel;E.dataLabel=J[G];E.y=E.low;E.plotY=E.plotLow;E.below=true;if(F){H.align="right";H.x=H.xLow}else{H.y=H.yLow}}I.drawDataLabels.apply(this,arguments)}},alignDataLabel:A.column.prototype.alignDataLabel,getSymbol:A.column.prototype.getSymbol,drawPoints:g});C.areasplinerange=j(C.arearange);A.areasplinerange=r(A.arearange,{type:"areasplinerange",getPointSpline:A.spline.prototype.getPointSpline});C.columnrange=j(C.column,C.arearange,{lineWidth:1,pointRange:null});A.columnrange=r(A.arearange,{type:"columnrange",translate:function(){var F=this,E=F.yAxis,G;y.translate.apply(F);h(F.points,function(H){var I=H.shapeArgs;H.plotHigh=G=E.translate(H.high,0,1,0,1);H.plotLow=H.plotY;I.y=G;I.height=H.plotY-G;H.trackerArgs=I})},drawGraph:g,pointAttrToOptions:y.pointAttrToOptions,drawPoints:y.drawPoints,drawTracker:y.drawTracker,animate:y.animate});C.gauge=j(C.line,{dataLabels:{enabled:true,y:15,borderWidth:1,borderColor:"silver",borderRadius:3,style:{fontWeight:"bold"},verticalAlign:"top",zIndex:2},dial:{},pivot:{},tooltip:{headerFormat:""},showInLegend:false});var k=b.extendClass(b.Point,{setState:function(E){this.state=E}});var s={type:"gauge",pointClass:k,angular:true,translate:function(){var G=this,F=G.yAxis,E=F.center;G.generatePoints();h(G.points,function(I){var K=j(G.options.dial,I.dial),H=(c(i(K.radius,80))*E[2])/200,N=(c(i(K.baseLength,70))*H)/100,M=(c(i(K.rearLength,10))*H)/100,J=K.baseWidth||3,L=K.topWidth||1;I.shapeType="path";I.shapeArgs={d:K.path||["M",-M,-J/2,"L",N,-J/2,H,-L/2,H,L/2,N,J/2,-M,J/2,"z"],translateX:E[0],translateY:E[1],rotation:(F.startAngleRad+F.translate(I.y,null,null,null,true))*180/Math.PI};I.plotX=E[0];I.plotY=E[1]})},drawPoints:function(){var H=this,E=H.yAxis.center,F=H.pivot,G=H.options,I=G.pivot,J=H.chart.renderer;h(H.points,function(K){var O=K.graphic,M=K.shapeArgs,N=M.d,L=j(G.dial,K.dial);if(O){O.animate(M);M.d=N}else{K.graphic=J[K.shapeType](M).attr({stroke:L.borderColor||"none","stroke-width":L.borderWidth||0,fill:L.backgroundColor||"black",rotation:M.rotation}).add(H.group)}});if(F){F.animate({translateX:E[0],translateY:E[1]})}else{H.pivot=J.circle(0,0,i(I.radius,5)).attr({"stroke-width":I.borderWidth||0,stroke:I.borderColor||"silver",fill:I.backgroundColor||"black"}).translate(E[0],E[1]).add(H.group)}},animate:function(){var E=this;h(E.points,function(F){var G=F.graphic;if(G){G.attr({rotation:E.yAxis.startAngleRad*180/Math.PI});G.animate({rotation:F.shapeArgs.rotation},E.options.animation)}});E.animate=null},render:function(){this.group=this.plotGroup("group","series",this.visible?"visible":"hidden",this.options.zIndex,this.chart.seriesGroup);A.pie.prototype.render.call(this);this.group.clip(this.chart.clipRect)},setData:A.pie.prototype.setData,drawTracker:A.column.prototype.drawTracker};A.gauge=b.extendClass(A.line,s);var e=m.prototype,q=b.MouseTracker.prototype;e.toXY=function(E){var I,H=this.chart,G=E.plotX,F=E.plotY;E.rectPlotX=G;E.rectPlotY=F;E.deg=G/Math.PI*180;I=this.xAxis.postTranslate(E.plotX,this.yAxis.len-F);E.plotX=E.polarPlotX=I.x-H.plotLeft;E.plotY=E.polarPlotY=I.y-H.plotTop};function u(G,F,E){G.call(this,F,E);if(this.chart.polar){this.closeSegment=function(I){var H=this.xAxis.center;I.push("L",H[0],H[1])};this.closedStacks=true}}o(A.area.prototype,"init",u);o(A.areaspline.prototype,"init",u);o(A.spline.prototype,"getPointSpline",function(G,F,U,V){var ab,T=1.5,E=T+1,J,H,I,W,L,K,Z,Y,P,N,R,Q,aa,M,S,X,O;if(this.chart.polar){J=U.plotX;H=U.plotY;I=F[V-1];W=F[V+1];if(this.connectEnds){if(!I){I=F[F.length-2]}if(!W){W=F[1]}}if(I&&W){L=I.plotX;K=I.plotY;Z=W.plotX;Y=W.plotY;P=(T*J+L)/E;N=(T*H+K)/E;R=(T*J+Z)/E;Q=(T*H+Y)/E;aa=Math.sqrt(Math.pow(P-J,2)+Math.pow(N-H,2));M=Math.sqrt(Math.pow(R-J,2)+Math.pow(Q-H,2));S=Math.atan2(N-H,P-J);X=Math.atan2(Q-H,R-J);O=(Math.PI/2)+((S+X)/2);if(Math.abs(S-O)>Math.PI/2){O-=Math.PI}P=J+Math.cos(O)*aa;N=H+Math.sin(O)*aa;R=J+Math.cos(Math.PI+O)*M;Q=H+Math.sin(Math.PI+O)*M;U.rightContX=R;U.rightContY=Q}if(!V){ab=["M",J,H]}else{ab=["C",I.rightContX||I.plotX,I.rightContY||I.plotY,P||J,N||H,J,H];I.rightContX=I.rightContY=null}}else{ab=G.call(this,F,U,V)}return ab});o(e,"translate",function(G){G.call(this);if(this.chart.polar&&!this.preventPostTranslate){var F=this.points,E=F.length;while(E--){this.toXY(F[E])}}});o(e,"getSegmentPath",function(G,F){var E=this.points;if(this.chart.polar&&this.options.connectEnds!==false&&F[F.length-1]===E[E.length-1]&&E[0].y!==null){this.connectEnds=true;F=[].concat(F,[E[0]])}return G.call(this,F)});function d(I,M){var J=this.chart,H=this.options.animation,L=this.group,N=this.markerGroup,E=this.xAxis.center,G=J.plotLeft,K=J.plotTop,F;if(J.polar){if(J.renderer.isSVG){if(H===true){H={}}if(M){L.attrSetters.scaleX=L.attrSetters.scaleY=function(P,O){this[O]=P;if(this.scaleX!==D&&this.scaleY!==D){this.element.setAttribute("transform","translate("+this.translateX+","+this.translateY+") scale("+this.scaleX+","+this.scaleY+")")}return false};F={translateX:E[0]+G,translateY:E[1]+K,scaleX:0,scaleY:0};L.attr(F);if(N){N.attrSetters=L.attrSetters;N.attr(F)}}else{F={translateX:G,translateY:K,scaleX:1,scaleY:1};L.animate(F,H);if(N){N.animate(F,H)}this.animate=null}}}else{I.call(this,M)}}o(e,"animate",d);o(y,"animate",d);o(e,"setTooltipPoints",function(F,E){if(this.chart.polar){w(this.xAxis,{tooltipLen:360,tooltipPosName:"deg"})}return F.call(this,E)});o(y,"translate",function(K){var G=this.xAxis,I=this.yAxis.len,E=G.center,L=G.startAngleRad,J=this.chart.renderer,F,N,M,H;this.preventPostTranslate=true;K.call(this);if(G.isRadial){N=this.points;H=N.length;while(H--){M=N[H];F=M.barX+L;M.shapeType="path";M.shapeArgs={d:J.symbols.arc(E[0],E[1],I-M.plotY,null,{start:F,end:F+M.pointWidth,innerR:I-i(M.yBottom,I)})};this.toXY(M)}}});o(y,"alignDataLabel",function(J,K,L,M,I,G){if(this.chart.polar){var F=K.rectPlotX/Math.PI*180,H,E;if(M.align===null){if(F>20&&F<160){H="left"}else{if(F>200&&F<340){H="right"}else{H="center"}}M.align=H}if(M.verticalAlign===null){if(F<45||F>315){E="bottom"}else{if(F>135&&F<225){E="top"}else{E="middle"}}M.verticalAlign=E}e.alignDataLabel.call(this,K,L,M,I,G)}else{J.call(this,K,L,M,I,G)}});o(q,"getIndex",function(I,J){var G,H=this.chart,F,E,K;if(H.polar){F=H.xAxis[0].center;E=J.chartX-F[0]-H.plotLeft;K=J.chartY-F[1]-H.plotTop;G=180-Math.round(Math.atan2(E,K)/Math.PI*180)}else{G=I.call(this,J)}return G});o(q,"getMouseCoordinates",function(G,H){var F=this.chart,E={xAxis:[],yAxis:[]};if(F.polar){h(F.axes,function(K){var L=K.isXAxis,J=K.center,I=H.chartX-J[0]-F.plotLeft,M=H.chartY-J[1]-F.plotTop;E[L?"xAxis":"yAxis"].push({axis:K,value:K.translate(L?Math.PI-Math.atan2(I,M):Math.sqrt(Math.pow(I,2)+Math.pow(M,2)),true)})})}else{E=G.call(this,H)}return E})}($A.Charts));