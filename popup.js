var getSelectedTab = (tab) => {
  var tabId = tab.id;
  var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);
  document.getElementById('fill').addEventListener('click', () => sendMessage({ action: 'fill', id: tabId  }));
  document.getElementById('set').addEventListener('click', function(){
  	create_setting_page();
  });
};

function create_setting_page(){
	chrome.tabs.create({"url": chrome.runtime.getURL("setting.html")});
}
function create_tutorial_page(){
	chrome.tabs.create({"url": "https://hackmd.io/s/r1SzZOlhN"});
}
chrome.tabs.getSelected(null, getSelectedTab);