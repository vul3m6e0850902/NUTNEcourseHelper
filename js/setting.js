console.log("setting");

function btn_click(a){
    var submit_check = true;

    submit_check &= $("#score-attribute").val() != -1;
    submit_check &= $("#comment-attribute").val() != -1;
    submit_check &= !isEmpty(indata);

    if(submit_check){
        chrome.storage.local.clear(function(){
            console.log("Success to clear local storage.");
        });
        chrome.storage.local.set({
            "indata": indata, 
            "score_attr": $("#score-attribute").val(), 
            "comment_attr": $("#comment-attribute").val()
        }, function(){
            console.log("Success to set local storage.");
            alert("成功送出成績資料!");
            window.close();
        });
    }
    else{
        alert("請選擇成績欄位名稱以及評語欄位名稱!!!");
    }
}
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
document.getElementById("submit").addEventListener("click", btn_click);
      
var indata;
var retjson;
var score_attr;
var comment_attr;
//綁定change事件，讀xlsx檔
document.getElementById("input-xlsx").addEventListener('change', function (e) {
    $("#data").html("");
    $("#sheet").html('<option value="-1">請選擇工作表名稱</option>');
    $("#score-attribute").html('<option value="-1">請選擇欄位</option>');
    $("#comment-attribute").html('<option value="-1">請選擇欄位</option>');
    //取得上傳第一個檔案
    var files = e.target.files;
    var f = files[0]; 

    //使用FileReader讀檔
    var reader = new FileReader();

    //檔案名稱
    var name = f.name;

    //onload觸發事件
    reader.onload = function (e) {

        //對象內資料
        var data = e.target.result;

        //讀取xlsx資料
        retjson = readxlsx(data, 'json');

        var keys = Object.keys(retjson);
        console.log(keys.length);
        for(var i = 0; i < keys.length; i++){
            $("#sheet").append(new Option(keys[i], keys[i]));
        }
        if(keys.length > 0){
            $("#sheet").val(keys[0]);
            $("#sheet").change();
        }

        // var sheet1 = retjson.sheet1;
        // indata = sheet1;
        // console.log(sheet1.length);
        // for (var i = 0; i < sheet1.length; i++) {
        // 	$("#data").append("<tr><td>" + (i + 1) + "</td><td>" + sheet1[i].score + "</td><td>" + sheet1[i].comment + "</td></tr>");
        // }
        //顯示內容
        // $('#xlsx-content').html(JSON.stringify(retjson, null, '\t'));

    };

    //以BinaryString讀入
    reader.readAsBinaryString(f);

});
$("#sheet").change(function(){
    if($(this).val() != -1){
        console.log(retjson[$(this).val()]);
        indata = retjson[$(this).val()];
        if(indata.length > 0){
            var row = indata[0];
            var keys = Object.keys(row);
            var row_str = "<tr><td>#</td>";
            for(var i = 0; i < keys.length; i++){
                row_str = row_str + "<td class='" + keys[i] + "'>" + keys[i] + "</td>";
                $("#score-attribute").append(new Option(keys[i], keys[i]));
                $("#comment-attribute").append(new Option(keys[i], keys[i]));
                if(keys[i] == "score" || keys[i] == "成績"){
                    $("#score-attribute").val(keys[i]);
                }
                if(keys[i] == "comment" || keys[i] == "評語"){
                    $("#comment-attribute").val(keys[i]);
                }
            }
            row_str = row_str + "</td>";
            $("#data").append(row_str);
        }
        for(var i = 0; i < indata.length; i++){
            var keys = Object.keys(indata[i]);
            var row_str = "<tr><td>" + (i + 1) + "</td>";
            for(var j = 0; j < keys.length; j++){
                row_str = row_str + "<td class='" + keys[j] + "''>" + indata[i][keys[j]] + "</td>";
            }
            row_str = row_str + "</td>";
            $("#data").append(row_str);
        }

        $("#score-attribute").change();
        $("#comment-attribute").change();

    }
});
$("#score-attribute").change(function(){
    if(score_attr != -1){
        $("." + score_attr).removeClass("scoreATTR");
    }
    $("." + $(this).val()).addClass("scoreATTR");
    score_attr = $(this).val();
});
$("#comment-attribute").change(function(){
    if(comment_attr != -1){
        $("." + comment_attr).removeClass("commentATTR");
    }
    $("." + $(this).val()).addClass("commentATTR");
    comment_attr = $(this).val();
});

function readxlsx(inpdata, fmt) {
    //讀取xlsx檔

    //參數
    //inpdata為由input file讀入之data
    //fmt為讀取格式，可有"json"或"csv"，csv格式之分欄符號為逗號，分行符號為[\n]

    //說明
    //所使用函式可參考js-xlsx的GitHub文件[https://github.com/SheetJS/js-xlsx]


    //to_json
    function to_json(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function (sheetName) {
            var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
                result[sheetName] = roa;
            }
        });
        return result;
    }


    //to_csv
    function to_csv(workbook) {
        var result = [];
        workbook.SheetNames.forEach(function(sheetName) {
            var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
            if(csv.length > 0){
                result.push('SHEET: ' + sheetName);
                result.push('\n');
                result.push(csv);
            }
        });
        return result;
    }


    //讀檔
    var workbook = XLSX.read(inpdata, { type: 'binary' });


    //轉為json物件回傳
    if (fmt === 'json') {
        return to_json(workbook);
    }
    else {
        return to_csv(workbook);
    }


}


function downloadxlsx(filename, sheetname, data) {
    //儲存xlsx檔

    //參數
    //filename為要下載儲存之xlsx檔名，，sheetname為資料表名，data為要下載之資料，需為二維陣列。以下為使用範例：
    //var filename = 'download.xlsx';
    //var sheetname = 'test';
    //var data = [
    //    ['name', 'number', 'date'],
    //    ['abc', 1, new Date().toLocaleString()],
    //    ['def', 123.456, new Date('2015-03-25T13:30:12Z')],
    //];
    //downloadxlsx(filename, sheetname, data);

    //說明
    //所使用函式可參考js-xlsx的GitHub文件[https://github.com/SheetJS/js-xlsx]


    //datenum
    function datenum(v, date1904) {
        if (date1904) v += 1462;
        var epoch = Date.parse(v);
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    }


    //sheet_from_array_of_arrays
    function sheet_from_array_of_arrays(data, opts) {
        var ws = {};
        var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
        for (var R = 0; R != data.length; ++R) {
            for (var C = 0; C != data[R].length; ++C) {
                if (range.s.r > R) range.s.r = R;
                if (range.s.c > C) range.s.c = C;
                if (range.e.r < R) range.e.r = R;
                if (range.e.c < C) range.e.c = C;
                var cell = { v: data[R][C] };
                if (cell.v == null) continue;
                var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

                if (typeof cell.v === 'number') cell.t = 'n';
                else if (typeof cell.v === 'boolean') cell.t = 'b';
                else if (cell.v instanceof Date) {
                    cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                    cell.v = datenum(cell.v);
                }
                else cell.t = 's';

                ws[cell_ref] = cell;
            }
        }
        if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
        return ws;
    }


    //s2ab
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }


    //Workbook
    function Workbook() {
        if (!(this instanceof Workbook)) return new Workbook();
        this.SheetNames = [];
        this.Sheets = {};
    }


    //write
    var wb = new Workbook();
    var ws = sheet_from_array_of_arrays(data);
    wb.SheetNames.push(sheetname);
    wb.Sheets[sheetname] = ws;
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });


    //saveAs
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), filename)


}