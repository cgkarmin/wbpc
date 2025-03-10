segments = new Array('Pembukaan', 'Sub-Konflik', 'Konflik', 'Sub-Kemuncak', 'Kemuncak', 'Penyelesaian');

function makeSegmentButtons() {
	x = "<table cellspacing=0 cellpadding=0 id='bahagianBar'><tr>";
	for (i=1; i<segments.length+1; i++) {
		x += '<td><A href="javascript:goToPage(' + i + ');" class="bahagian" id="link' + i + '">' + segments[i-1] + '</A></td>';
	}
	x += "</tr></table>";
	document.open();
	document.write(x);
	document.close();
}

function makeDB () {
	x = '<FORM name="db" method="" action="">';
	for (i=1;i<=segments.length+1;i++) {
		x += '<INPUT type="hidden" name="p' + i + '" value="">';
	}
	x += '<INPUT type="hidden" name="curPage" value=1>';
	x += '</FORM>';
	document.open();
	document.write(x);
	document.close();
}

function initRichEdit() {
	el = document.frames["edit"];
	d = el.document;
	d.designMode = "On";
	void(0);
	
	el.getRange = function () {
		return this.document.selection.createRange();
	}
		
	el.document.onkeydown = function () {
			if (el.event.keyCode == 13) {	// ENTER
			var sel = el.document.selection;
			if (sel.type == "Control")
				return;
			
			var r = sel.createRange();	
			r.pasteHTML("<BR>");
			el.event.cancelBubble = true; 
			el.event.returnValue = false; 

			r.select();
			r.moveEnd("character", 1);
			r.moveStart("character", 1);
			r.collapse(false);
			
			return false;
		}
	};
	el.document.onkeypress = 
	el.document.onkeyup = function () { 
		if (el.event.keyCode == 13) {	// ENTER
			el.event.cancelBubble = true;
			el.event.returnValue = false;
			return false;
		}
	};
	document.onkeydown =
	document.onkeypress =
	document.onkeyup =
	el.document.onkeydown =
	el.document.onkeypress = 
	el.document.onkeyup = function () { 
		updatePreviewBox();
		updateCounter();
	};
}

function goToPage(n){
	//deMarkPage();
	
	// retrieve text
	el = document.frames["edit"];
	c = el.document.body.innerHTML;
	
	x = db.elements[db.length-1].value;	
	db.elements[x-1].value = escape(c);
	
	db.elements[db.length-1].value = n;
	newC = db.elements[n-1].value;
	el.document.body.innerHTML = unescape(newC);
	
	//markPage();
	el.focus();
}

function tanda(elemen) {
	var colours = new Array("#006699", "#FF9900", "#CC0000", "#996633", "#CC00CC", "#009933");
	var elements = new Array("plot", "watak", "perasaan", "gambaran", "frasabb", "dialog");
	
	el = document.frames["edit"];
	r = el.getRange(); 
	
	if (r.text.replace(/\s/g, "") != "") {
	
	if (r.text.charAt(0) == " ")
		r.moveStart("character", 1);
	
	if (r.text.charAt(r.text.length-1) == " ")
		r.moveEnd("character", -1);
	
	t = r.text; // alert("selection is: |" + t + "|");
	tl = t.toLowerCase(); // alert(tl);
	
	r.execCommand('foreColor', 'false', colours[arrayIndexOf(elemen, elements)]);
	updatePreviewBox();
	r.select();
	void(0);
	}
}

function arrayIndexOf(k, l) {
	for(i=0;i<l.length;i++) {
		if (l[i] == k) return i;
	}
}

function doPreview () {
		
	karangan = getWholeKarangan();
	
	pHTML = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">' +
		'<HTML><HEAD><TITLE></TITLE>' +
		'<META http-equiv="Content-Type" content="text/html; charset=iso-8859-1">' +
		'<link rel="stylesheet" href="box.css" type="text/css">' +
		'</HEAD><BODY>' + karangan + '</BODY></HTML>';
		
	w = window.open('about:blank','','menubar=yes,scrollbars=yes,width=400,height=300');
	d = w.document;
	d.open();
	d.clear();
	d.write(pHTML);
	d.close();
}

function karanganBaru (n) {
	if (confirm("Buangkan segala data dan mulakan yang baru?")) {
		deMarkPage();
		
		for (i=0;i<db.length;i++) {
			db.elements[i].value = "";
		}
	
		db.elements[db.length-1].value = 1;
		
		document.frames["edit"].document.body.innerHTML = "";
		
		markPage();
		
		updatePreviewBox();
		updateCounter();
	}
}

function markPage () {
n = db.curPage.value;
eval("link" + n + ".className = 'bahagianIni'");
eval("link" + n + ".onclick = function () { return false }");
}

function deMarkPage() {
n = db.curPage.value;
eval("link" + n + ".className = 'bahagian'");
eval("link" + n + ".onclick = function () { return true }");
}

function makeDefault() {
r = document.frames["edit"].getRange();
if (r.text.replace(/\s/g, "") == "")
	return false;

if (r.text.charAt(0) == " ")
	r.moveStart("character", 1);

if (r.text.charAt(r.text.length-1) == " ")
	r.moveEnd("character", -1);

r.execCommand("removeFormat");
updatePreviewBox();
r.select();
void(0);
}

function getWholeKarangan () {
	var karangan = "";
	
	el = document.frames["edit"];
	c = el.document.body.innerHTML;
	
	x = db.elements[db.length-1].value;	
	db.elements[x-1].value = escape(c);
		
	for (i=1;i<=db.length-1;i++) {
		z = unescape(db.elements[i-1].value);
		zTemp = z.toLowerCase();
		if (zTemp.replace(/\s/g, "") != "") {
			karangan += zTemp.indexOf("<p>") != -1 ? "" : "<p>";
			karangan += z;
		}
	}
	
	return karangan;
}

function updatePreviewBox () {
	k = getWholeKarangan();
	document.frames["previewBox"].document.body.innerHTML = k;
}

function saveKarangan(){
	updatePreviewBox();
	karangan = getWholeKarangan();
	someVar = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">' +
	'<HTML><HEAD><TITLE></TITLE>' +
	'<META http-equiv="Content-Type" content="text/html; charset=iso-8859-1">' +
	'</HEAD><BODY>' + karangan + '</BODY></HTML>';

	//SaveFrame = document.frames["previewBox"];
	SaveFrame.document.open("text/html","replace");
  SaveFrame.document.write(someVar);
  SaveFrame.document.close();
  SaveFrame.document.execCommand('SaveAs');
}

function copyKarangan(){
	updatePreviewBox();
	el = document.frames["previewBox"];
	x = el.document.body.createTextRange();
	x.execCommand('Copy');
	alert("Karangan anda telah disalinkan ke clipboard dan boleh ditampalkan ke dalam editor kesukaan anda.");
	void(0);
}

function getNoOfWords() {
	karangan = getWholeKarangan(); //alert(karangan);
	
	htmlTags = /<[/]?\w+[^>]*>/gi;
	extraSpaces = /\s{2,}/gi;
	nobrs = /&nbsp;/gi;
	
	karangan = karangan.replace(htmlTags, " "); //alert("after replacing html tags: |" + karangan + "|");
	karangan = karangan.replace(nobrs, " "); //alert("after replacing nobrs: |" + karangan + "|");
	karangan = karangan.replace(extraSpaces, " "); //alert("after replacing spaces: |" + karangan + "|");
	karangan = karangan.charAt(0) == " " ? karangan.substring(1) : karangan;//alert("after replacing spaces at the beginning: |" + karangan + "|");
	karangan = karangan.charAt(karangan.length-1) == " " ? karangan.substring(0, karangan.length-1) : karangan; //alert("after replacing spaces at the end: |" + karangan + "|");
		
	if (karangan.replace(/\s/g, "") == "") 
	x = 0;
	else {
	k = karangan.split(" ");
	x = k.length;
	}
	
	return x;
}

function updateCounter() {
	count = getNoOfWords();
	counter.innerText = count;
}
