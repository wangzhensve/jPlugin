/**************************************************************************************************
 * plugin name   jquery.selectTool.js  基于jquery 1.9.1 理论通杀
 * date          2014-05-11
 * author        wangz  resafety.com
 * version       1.0 beta   支持静态，动态，替换原生select，支持部分自定义样式
 * @param $
 *************************************************************************************************/
/**************************************************************************************************
 * 使用方法：
 * 1.动态：数据格式为json，目前接收2个参数，attr为该option附带的其他属性，text为该option显示的值,
 * 获取属性的方式:$('.inputStyle',id).attr('attr'),获取值的方式：$('.inputStyle',id).val();
 * 加载方式：
 *var options={data:json},里面也可以配其他参数
 *调用方式:$('#你的id')。initTool(options);
 * 2.静态:
 * 请以<div id="你的id">
 * 		<div class="option" attr="">value</div>
 * 	</div>方式，取值和1一样,加载方式:var options={},里面也可以配其他参数，调用方式:$('#你的id')。initTool(options);
 * 也可以$('#你的id')。initTool();方式调用，则全部按照默认配置解析
 * 3.解析原生select
 * 调用方式：$.fn.replaceTool();也可以传入一个数组配置项,还是var options={},$.fn.replaceTool(options)
 * 取值和1一样
 * 4.使用必须导入的文件:
 * jquery.js
 * jquery.selectTool.js
 * jquery.selectTool.css
 *************************************************************************************************/
var opts='';//全局参数
(function($){
	/*指定默认样式，如果用户没有配置样式，就调用默认样式*/
	var defualts={
		"data":null,//数据参数
		"inputBorderColor":"cyan",//输入框的边框颜色
		"inputBorder":"1",//输入框的边框宽度
		"inputWidth":100,//输入框的宽度，现在暂未启用，现在的宽度是select的宽度减10
		"inputBgColor":"white",//输入框的背景颜色
		"inputHeight":"25",//输入框的高度，兼容性待测
		"selectDivHeight":"100",//下拉框的高度
		"selectDivBgColor":"white",//下拉框的背景颜色
		"selectDivBorder":"1",//下拉框的边框宽度
		"selectDivBColor":"cyan",//下拉框的边框颜色
		"optionDivHeight":"15",//下拉框option的高度
		"inputReadonly":true,//输入框是否设置为只读模式
		"switchingMode":"click",//出现下拉表的鼠标模式
		"inOptionMode":"mouseover",//option的鼠标移入
		"outOptionMode":"mouseout",//option的鼠标移出
		"clickOptionMode":"click",//点击option的模式
		"baseDivHeight":150,
		"baseDivWidth":150,
	};
	
	/*初始化函数,该函数主要实现静态参数和动态参数*/
	$.fn.initTool=function(options){
		//假设用户不传配置项，则默认为空数组，全部调用默认配置项
		if(!options){
			options={};
		}
		var html="";//当前对象的整个div的html
		var dataHtml='';//当前对象的selectDiv的html
		/*三元运算，有配置就调配置，没配置就调默认*/
		var inputBorder=(options.inputBorder==null)?defualts.inputBorder:options.inputBorder;
		var inputBorderColor=(options.inputBorderColor==null)?defualts.inputBorderColor:options.inputBorderColor;
		var inputBgColor=(options.inputBgColor==null)?defualts.inputBgColor:options.inputBgColor;
		var inputReadonly=(options.inputReadonly==null)?defualts.inputReadonly:options.inputReadonly;
		//var inputWidth=(options.inputWidth==null)?defualts.inputWidth:options.inputWidth;
		
		var selectDivBorder=(options.selectDivBorder==null)?defualts.selectDivBorder:options.selectDivBorder;
		var selectDivBColor=(options.selectDivBColor==null)?defualts.selectDivBColor:options.selectDivBColor;
		var baseDivHeight=(options.baseDivHeight==null)?defualts.baseDivHeight:options.baseDivHeight;
		var baseDivWidth=(options.baseDivWidth==null)?defualts.baseDivWidth:options.baseDivWidth;
		//var inputWidth=$('#select').width();
		var inputWidth=parseInt(baseDivWidth)-10;//输入框=selectWidth-10
		 opts= $.extend({}, defualts, options); //各参数传入
		 var _THIS=$(this);//把当前对象赋值给一个临时变量，因为this是关键字，循环中可能识别不出来this到底指的谁
		var data=(options.data==null)?defualts.data:options.data;//接收option数据
		/*生成输入框代码*/
		html+='<div class="inputSelect" style="cursor:pointer;">'
			+'<input type="text" class="inputStyle" value="" style="font-size:15px;cursor:pointer;width:'+inputWidth+'px;border:'+inputBorder+'px solid '+inputBorderColor+';background:'+inputBgColor+';" readonly='+inputReadonly+'/>'
			+'<span id="arrow" class="arrowStyle_noneDivShow" attr="0"></span></div>';
		//外面再包一层样式
		dataHtml+='<div class="selectDiv" style="width:'+inputWidth+'px;display:none;border:'+selectDivBorder+'px solid '+selectDivBColor+';border-top:0px solid red;">';
		/*生成option代码,如果data为空，则调用静态参数模式，否则就调用动态模式*/
		if(data!=null){
			for(var j=0;j<data.length;j++){
				/*遍历单项数据*/
				var attr=(data[j].attr==undefined)?"":data[j].attr;
				dataHtml+='<div class="option" attr="'+attr+'">'+data[j].text+'</div>';//单个option
			};
			dataHtml+='</div>';//下拉项生成完成
			html+=dataHtml;//填充到整个对象
		}else{//假设参数data不为空
			var obj=_THIS.find('div[class=option]');//根据当前对象查所以为option的class
			/*循环遍历*/
			$(obj).each(function(i){
				var option=obj[i];
				var attr=$(option).attr('attr')==undefined?"":$(option).attr('attr');//假设attr属性不设置就是为undefined然后转换为空
				var val=$(option).html()==""?"":$(option).html();//假设option为空就为空否则就是this。html
				dataHtml+='<div class="option" attr="'+attr+'">'+val+'</div>';//拼接html
			});
			html+=dataHtml;//填充到整个对象
		}
		_THIS.html(html);
		_THIS.css({'width':baseDivWidth,'height':baseDivHeight});//当前对象的宽高
		var val=$('.selectDiv',_THIS).find('div').eq(0).html();//查找子项的第一个text
		var attr=$('.selectDiv',_THIS).find('div').eq(0).attr('attr');//查找子项的第一个alue
		$('.inputStyle',_THIS).val(val);//填充alue
		$('.inputStyle',_THIS).attr('attr',attr);//填充text
		/*判断当前点击的是否是select区域，如果是，不执行任何操作，如果是其他的区域，就隐藏select区域*/
		$(document).bind('click',function(e){
			e=window.event||e;
			obj=$(e.srcElement||e.target);
				if(!($(obj).is(".selectDiv,.inputSelect *"))){
					$('.selectDiv').hide('1000');
				}
		});
		
		//initEvent();
		/*点击输入框的效果*/
		$('.inputSelect',_THIS).bind(opts.switchingMode,function(){
			$('.selectDiv',_THIS).toggle('slow');//控制显隐
			var arrow=$('#arrow',_THIS).attr('attr');
			/*控制箭头上下*/
			if(arrow==0){
				$('#arrow',_THIS).attr('attr',1);
				$('#arrow',_THIS).removeClass('arrowStyle_noneDivShow');
				$('#arrow',_THIS).addClass('arrowStyle_selectDivShow');
			}else{
				$('#arrow',_THIS).attr('attr',0);
				$('#arrow',_THIS).removeClass('arrowStyle_selectDivShow');
				$('#arrow',_THIS).addClass('arrowStyle_noneDivShow');
			}
		});
		/*option触发的事件*/
		$('.option',_THIS).bind(opts.inOptionMode,function(){
			$(this).addClass('inOptionMode');
		}).bind(opts.outOptionMode,function(){
			$(this).removeClass('inOptionMode');
		}).bind(opts.clickOptionMode,function(){
			var val=$(this).html();
			var attr=$(this).attr('attr');
			$('.inputStyle',_THIS).val(val);
			$('.inputStyle',_THIS).attr('attr',attr);
			$('.selectDiv',_THIS).toggle('slow');
			$('#arrow',_THIS).attr('attr',0);
			$('#arrow',_THIS).removeClass('arrowStyle_selectDivShow');
			$('#arrow',_THIS).addClass('arrowStyle_noneDivShow');
		});
	};
	/*次函数用于解析原生select标签*/
	$.fn.replaceTool=function(options){
		if(!options){
			options={};
		}
		var inputBorder=(options.inputBorder==null)?defualts.inputBorder:options.inputBorder;
		var inputBorderColor=(options.inputBorderColor==null)?defualts.inputBorderColor:options.inputBorderColor;
		var inputBgColor=(options.inputBgColor==null)?defualts.inputBgColor:options.inputBgColor;
		var inputReadonly=(options.inputReadonly==null)?defualts.inputReadonly:options.inputReadonly;
		//var inputWidth=(options.inputWidth==null)?defualts.inputWidth:options.inputWidth;
		
		
		var selectDivBorder=(options.selectDivBorder==null)?defualts.selectDivBorder:options.selectDivBorder;
		var selectDivBColor=(options.selectDivBColor==null)?defualts.selectDivBColor:options.selectDivBColor;
		var baseDivHeight=(options.baseDivHeight==null)?defualts.baseDivHeight:options.baseDivHeight;
		var baseDivWidth=(options.baseDivWidth==null)?defualts.baseDivWidth:options.baseDivWidth;
		var inputWidth=0;
		inputWidth=parseInt(baseDivWidth)-10;//输入框=selectWidth-10
		 opts= $.extend({}, defualts, options); //各参数传入
		
		
		var obj=$(document).find('select');//整个document查找存在的select原生标签
		if(obj.length<0){
			return;//假设不存在select原生标签，直接return
		}
		$(obj).each(function(i){
			var html='';//当前对象整个html
			var select=obj[i];//假设不为空，获取页面某个select
			var _THIS='select_'+i;//这里的this跟initTool的不一样，因为遍历出来所有的select都一个样,所以这里的为当前对象的id，唯一标识，规则+1，0开始
			$(select).replaceWith('<div id="select_'+i+'" style="width:'+baseDivWidth+'px;height:'+baseDivHeight+'"></div>');//把当前原生select解析
			/*生成当前对象的输入框*/
			html+='<div class="inputSelect" style="cursor:pointer;">'
				+'<input type="text" class="inputStyle" value="" style="font-size:15px;cursor:pointer;width:'+inputWidth+'px;border:'+inputBorder+'px solid '+inputBorderColor+';background:'+inputBgColor+';" readonly='+inputReadonly+'/>'
				+'<span id="arrow" class="arrowStyle_noneDivShow" attr="0"></span></div>';
			html+='<div class="selectDiv" style="width:'+inputWidth+'px;display:none;border:'+selectDivBorder+'px solid '+selectDivBColor+';border-top:0px solid red;"></div>';
			$('#select_'+i+'').append(html);//填充到当前对象
			/*当前对象的输入框绑定事件*/
			$('.inputSelect','#'+_THIS).bind(opts.switchingMode,function(){
				$('.selectDiv','#'+_THIS).toggle('slow');
				var arrow=$('#arrow','#'+_THIS).attr('attr');
				/*控制箭头上下*/
				if(arrow==0){
					$('#arrow','#'+_THIS).attr('attr',1);
					$('#arrow','#'+_THIS).removeClass('arrowStyle_noneDivShow');
					$('#arrow','#'+_THIS).addClass('arrowStyle_selectDivShow');
				}else{
					$('#arrow','#'+_THIS).attr('attr',0);
					$('#arrow','#'+_THIS).removeClass('arrowStyle_selectDivShow');
					$('#arrow','#'+_THIS).addClass('arrowStyle_noneDivShow');
				}
			});
			var selectChild=$(select).find('option');//得到当前对象中所有原生option
			$(selectChild).each(function(j){
				var option=selectChild[j];//获取某个option
				var val=$(option).val();//原alue
				var text=$(option).text();//原text
				$(option).replaceWith('');//并把原option解析成空
				$('.selectDiv','#'+_THIS).append('<div class="option" attr="'+val+'">'+text+'</div>');//填充到当前下拉框
			});
			var val=$('.selectDiv','#'+_THIS).find('div').eq(0).html();//查找子项的第一个text
			var attr=$('.selectDiv','#'+_THIS).find('div').eq(0).attr('attr');//查找子项的第一个alue
			$('.inputStyle','#'+_THIS).val(val);//填充alue
			$('.inputStyle','#'+_THIS).attr('attr',attr);//填充text
			/*子项绑定事件*/
			$('.option','#'+_THIS).bind(opts.inOptionMode,function(){
				$(this).addClass('inOptionMode');
			}).bind(opts.outOptionMode,function(){
				$(this).removeClass('inOptionMode');
			}).bind(opts.clickOptionMode,function(){
				var val=$(this).html();
				var attr=$(this).attr('attr');
				$('.inputStyle','#'+_THIS).val(val);
				$('.inputStyle','#'+_THIS).attr('attr',attr);
				$('.selectDiv','#'+_THIS).toggle('slow');
				$('#arrow','#'+_THIS).attr('attr',0);
				$('#arrow','#'+_THIS).removeClass('arrowStyle_selectDivShow');
				$('#arrow','#'+_THIS).addClass('arrowStyle_noneDivShow');
			});
		});
	};
	
})(jQuery);