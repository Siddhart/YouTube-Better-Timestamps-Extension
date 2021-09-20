chrome.commands.onCommand.addListener(function (command) {
  if (command == "next_C") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { sendEvent: "nextChapterPLS" });
    });
  } else if (command == "prev_C") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { sendEvent: "previousChapterPLS" });
    });
  }
});
