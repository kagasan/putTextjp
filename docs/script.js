function func(){
	//ここから入力パラメータ
	var form = document.forms.fm;
	var font = form.font.value
	var fontsz = parseInt(form.fontsz.value);
	var cr = parseInt(form.cr.value);
	var cg = parseInt(form.cg.value);
	var cb = parseInt(form.cb.value);
	var bg = form.bg.checked;
	var bgr = parseInt(form.bgr.value);
	var bgg = parseInt(form.bgg.value);
	var bgb = parseInt(form.bgb.value);
	var imgw = parseInt(form.imgw.value);
	var imgh = parseInt(form.imgh.value);
	var jp = form.jp.value;
	//ここまで入力パラメータ
	
	//改行を消し，1文字ずつにする
	jp = jp.split('\r\n');
	jp = jp.join('');
	jp = jp.split('\n');
	jp = jp.join('');
	jp = jp.split('');
	
	//ここからcanvas設定
	var canvas = document.getElementById('canvas');
	canvas.width = imgw;
	canvas.height = imgh;
	var ctx = canvas.getContext('2d');
	if(!bg){
		ctx.fillStyle = "rgb("+bgr+","+bgg+","+bgb+")";
		ctx.fillRect(0,0,imgw,imgh);
	}
	ctx.font = ""+fontsz+"px"+" '"+font+"'";
	ctx.fillStyle = "rgb("+cr+","+cg+","+cb+")";
	function drawtext(s, x, y){
		ctx.fillText(s,x,y+fontsz);
	}
	//ここまで出力用canvas設定
	
	form.log.value="なんも表示することないワ．";
	form.puttext.value="";
	function add(s){
		form.puttext.value+=s;
		form.puttext.value+="\n";
	}
	function add2(s, x1, y1, x2, y2){
		add("\t\tm1[\""+s+"\"] = cv::Point("+x1+","+y1+");");
		add("\t\tm2[\""+s+"\"] = cv::Point("+x2+","+y2+");");
	}
	
	
	add("/*\npTj.init();\nで初期化してから，\npTj.putText(cv::Mat m, std::string s, cv::Point p);\nを呼ぶ．\n*/\n#pragma once\n#include \"opencv2/opencv.hpp\"\n#include <map>\n\n#include <iostream>\n\nclass putTextjp{\nprivate:\n\tcv::Mat img;\n\tstd::map<std::string, cv::Point>m1, m2;\n\tint step;\n\tint elem;\n\tint putstr(cv::Mat m, std::string s, cv::Point p){\n\t\tif (!m1.count(s))return 0;\n\t\tcv::Point p1 = m1[s];\n\t\tcv::Point p2 = m2[s];\n\t\tint st = m.step;\n\t\tint el = m.elemSize();\n\t\tint w = m.cols;\n\t\tint h = m.rows;\n\t\tfor (int y = p1.y; y < p2.y; y++){\n\t\t\tfor (int x = p1.x; x < p2.x; x++){\n\t\t\t\tif (img.data[y*step + x*elem + 3]==0)continue;\n\t\t\t\tif (p.x + x - p1.x < 0 || w <= p.x + x - p1.x || p.y + y - p1.y < 0 || h <= p.y + y - p1.y)continue;\n\t\t\t\tfor (int c = 0; c < 3; c++){\n\t\t\t\t\tm.data[(p.y + y - p1.y)*st + (p.x + x - p1.x)*el + c]\n\t\t\t\t\t\t= (255 * m.data[(p.y + y - p1.y)*st + (p.x + x - p1.x)*el + c]\n\t\t\t\t\t\t+ img.data[y*step + x*elem + 3] * (img.data[y*step + x*elem + c] - m.data[(p.y + y - p1.y)*st + (p.x + x - p1.x)*el + c]))\n\t\t\t\t\t\t/ 255;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn p2.x-p1.x;\n\t}\n\t\npublic:\n\tvoid init(std::string path=\"puttextjp.png\"){\n\t\timg = cv::imread(path,-1);\n\t\tstep = img.step;\n\t\telem = img.elemSize();");
	
	//var text = ctx.measureText("foo"); // TextMetrics オブジェクト
	//text.width; // 16;
	
	for(var i=0;i<jp.length;i++){
		drawtext(jp[i],i*fontsz,0);
	}
	add2("あ",0,0,16,20);
	add2("い",16,0,32,20);
	add2("う",32,0,48,20);
	
	
	add("\t}\n\t\n\tvoid putText(cv::Mat m, std::string s, cv::Point p){\n\t\tfor (int i = 0; i < s.size();i++){\n\t\t\tstd::string tmp = \"\";\n\t\t\tfor (int j = 0; i + j < s.size();j++){\n\t\t\t\ttmp += s[i + j];\n\t\t\t\tint t = putstr(m, tmp, p);\n\t\t\t\tif (t == 0)continue;\n\t\t\t\ti += j;\n\t\t\t\tp.x += t;\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t}\n\t\n};\n\nputTextjp pTj;");
	
	
	
	//ここから画像変換
	var png = canvas.toDataURL();
	document.getElementById("Img").src=png;
	canvas.width = 0;
	canvas.height = 0;
	//ここまで画像変換
}

function DL(){
	var form = document.forms.fm;
	var content = form.puttext.value;
	var blob = new Blob([ content ], { "type" : "text/plain" });
	if(window.navigator.msSaveBlob){
		window.navigator.msSaveBlob(blob, "test.txt"); 
		window.navigator.msSaveOrOpenBlob(blob, "test.txt"); 
	}
	else{
		document.getElementById("download").href = window.URL.createObjectURL(blob);
	}
}
