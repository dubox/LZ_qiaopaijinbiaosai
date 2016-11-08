	function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1)
        endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}
	function GetCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}
	function DecodeCookie(str) {
	    var strArr;
	    var strRtn = "";
	
	    strArr = str.split("a");
	
	    for (var i = strArr.length - 1; i >= 0; i--)
	        strRtn += String.fromCharCode(eval(strArr[i]));
	
	    return strRtn;
	}
	//截取字符串
function SetSub(str, n) {
    var strReg = /[^\x00-\xff]/g;
    var _str = str.replace(strReg, "**");
    var _len = _str.length;
    if (_len > n) {
        var _newLen = Math.floor(n / 2);
        var _strLen = str.length;
        for (var i = _newLen; i < _strLen; i++) {
            var _newStr = str.substr(0, i).replace(strReg, "**");
            if (_newStr.length >= n) {
                return str.substr(0, i) + "...";
                break;
            }
        }
    } else {
        return str;
    }
}


/****
 * dubox 2015/09/05
 * @param {Object} initData   {data,pOne}
 * 
 * 将所有数据传入  new 出分页对象  （适用于数据较少的情况，如专题站等）
 * 
 */

var Page = function(initData){
		
		this.pCurr =	1;
		this.pOne=	initData.pOne;
		this.pData=	initData.pData;
		this.pTotal=	Math.ceil(this.pData.length / this.pOne);
		
		this.pClass = initData.pClass;//'current';
		
		this.pSetList();
		
	}


Page.prototype.pNext = function(){
	
	this.pCurr++;
	if(this.pCurr > this.pTotal)this.pCurr = this.pTotal;
	this.pSetList();
	
}
Page.prototype.pPrev = function(){
	
	this.pCurr--;
	if(this.pCurr < 1)this.pCurr = 1;
	this.pSetList();
}
Page.prototype.pSetCurr = function(Curr){
	
	this.pCurr = Curr;
	if(this.pCurr < 1)this.pCurr = 1;
	if(this.pCurr > this.pTotal)this.pCurr = this.pTotal;
	this.pSetList();
}


//页码
Page.prototype.pSetNums = function(){
	
	
	var Nums = [];
	for(var i=-2;i<this.pCurr + 3;i++){
		
		if(i > 0 && i <= this.pTotal){
			
			if(i == this.pCurr)
				Nums.push({p:i,_class:this.pClass});
			else
				Nums.push({p:i,_class:''});
		}
		
	}
	this.pNums = Nums;
}
//当前页数据列表
Page.prototype.pSetList = function(){
	
	this.pList =  this.pData.slice((this.pCurr-1)*this.pOne , (this.pCurr-1)*this.pOne + this.pOne);
	
	this.pSetNums();
}

//////////////////////////page end

//html 转义 反转义
var encodeHtml = function(s){
        s = (s != undefined) ? s : this.toString();
        return (typeof s != "string") ? s :
            s.replace(this.REGX_HTML_ENCODE, 
                      function($0){
                          var c = $0.charCodeAt(0), r = ["&#"];
                          c = (c == 0x20) ? 0xA0 : c;
                          r.push(c); r.push(";");
                          return r.join("");
                      });
    };

var decodeHtml = function(s){
        var HTML_DECODE = this.HTML_DECODE;

        s = (s != undefined) ? s : this.toString();
        return (typeof s != "string") ? s :
            s.replace(this.REGX_HTML_DECODE,
                      function($0, $1){
                          var c = HTML_DECODE[$0];
                          if(c == undefined){
                              // Maybe is Entity Number
                              if(!isNaN($1)){
                                  c = String.fromCharCode(($1 == 160) ? 32:$1);
                              }else{
                                  c = $0;
                              }
                          }
                          return c;
                      });
    };



