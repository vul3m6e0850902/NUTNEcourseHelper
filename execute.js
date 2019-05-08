const rotateEvent = () => {
  // document.body.style.transform = 'rotate(180deg)';
  chrome.storage.local.get(function(items){
    console.log(items.indata);
    var indata = items.indata;
    var score_attr = items.score_attr;
    var comment_attr = items.comment_attr;
    for (var i = 0; i < indata.length; i++) {
      var id = "";
      if(i < 10){
        id = "0".concat(i.toString());
      }
      else{
        id = i.toString();
      }

      var comment_id_string = "#ctl00_ContentPlaceHolder1_Repeater2_ctl" + id + "_TextBox2";
      var score_id_string = "#ctl00_ContentPlaceHolder1_Repeater2_ctl" + id + "_TextBox1";
      $(comment_id_string).val(indata[i][comment_attr]);
      $(score_id_string).val(indata[i][score_attr]);
    }
  });
};

const onMessage = (message, sender) => {
  switch (message.action) {
    case 'fill':
      rotateEvent();
      break;
    default:
      break;
  }
};

chrome.runtime.onMessage.addListener(onMessage);