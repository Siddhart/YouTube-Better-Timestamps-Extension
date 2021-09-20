var timeCheck = 0;
var chapterArray = [];
var currentChapter = 0;
var addedTimeStamp = false;

function buildRemainderDiv() {
  let timerDiv = document.getElementsByClassName("ytp-time-display")[0];
  if (
    document.getElementsByClassName("ytp-time-display")[0] &&
    !document.getElementsByClassName("ytp-time-remainder")[0]
  ) {
    //build the remainder Element
    let remainderDiv = document.createElement("span");
    remainderDiv.className = "ytp-time-remainder";
    remainderDiv.style.display = "none";
    timerDiv.insertBefore(remainderDiv, timerDiv.firstChild);

    //replace the cursor with a pointer when the user is hovering over the timer
    timerDiv.style.cursor = "pointer";

    addedTimeStamp = true;
    //toggle the timestamp on or off
    timerDiv.onclick = function () {
      let currentTime = document.getElementsByClassName("ytp-time-current")[0];
      if (currentTime.style.display == "none") {
        remainderDiv.style.display = "none";
        currentTime.style.display = "initial";
      } else {
        remainderDiv.style.display = "initial";
        currentTime.style.display = "none";
      }
    };
  }
}

function updateTimer() {
  let currentTimer = document.getElementsByClassName("ytp-time-current")[0];
  var curTime = getSeconds(currentTimer.textContent);

  let totalTimer = document.getElementsByClassName("ytp-time-duration")[0];
  var totalTime = getSeconds(totalTimer.textContent);

  var difference = totalTime - curTime;
  var formattedDifference = new Date(difference * 1000)
    .toISOString()
    .substr(11, 8);

  if (formattedDifference.split(":")[0] == "00") {
    let devidedFormat = formattedDifference.split(":");
    devidedFormat.shift();
    formattedDifference = devidedFormat.join(":");
  }

  if (document.getElementsByClassName("ytp-time-remainder").length > 0) {
    let remainderTimer =
      document.getElementsByClassName("ytp-time-remainder")[0];
    remainderTimer.innerHTML = "-" + formattedDifference;
  }
}

function InWhichChapterAreWeBoi() {
  if (
    document.getElementsByClassName("ytp-time-current")[0] &&
    document.getElementsByClassName("ytp-time-duration")[0]
  ) {
    let currentTimer = document.getElementsByClassName("ytp-time-current")[0];
    var curTime = getSeconds(currentTimer.textContent);

    let totalTimer = document.getElementsByClassName("ytp-time-duration")[0];
    var totalTime = getSeconds(totalTimer.textContent);

    var found = false;
    for (let x = 0; x < chapterArray.length; x++) {
      if (!chapterArray[x + 1] && !found) {
        found = true;
        currentChapter = x;
      }

      if (curTime >= chapterArray[x] && curTime < chapterArray[1 + x]) {
        currentChapter = x;
        found = true;
      }

      if (curTime == totalTime) {
        found = true;
        currentChapter = (x + 1);
      }
    }
  }
}

function getSeconds(timeString) {
  let totalTimeValue = timeString.split(":");
  let seconds =
    totalTimeValue.length == 3
      ? Number(+totalTimeValue[0]) * 60 * 60 +
        Number(+totalTimeValue[1]) * 60 +
        Number(+totalTimeValue[2])
      : Number(+totalTimeValue[0]) * 60 + Number(+totalTimeValue[1]);
  return seconds;
}

setInterval(function () {
  if (!addedTimeStamp) {
    buildRemainderDiv();
  }
}, 750);

setInterval(function () {
  //Scrape the Chapters
  let ChapterHTML_List = document.querySelectorAll("[id=time]");
  if (ChapterHTML_List) {
    if (ChapterHTML_List.length > 0) {
      let totalTimer = document.getElementsByClassName("ytp-time-duration")[0];

      if (totalTimer.textContent) {
        let tempArr = [];
        for (let x = 0; x < ChapterHTML_List.length; x++) {
          if (
            ChapterHTML_List[x].innerHTML.includes(":") &&
            ChapterHTML_List[x].innerHTML.length >= 4
          ) {
            let curTime = getSeconds(ChapterHTML_List[x].innerHTML);
            tempArr.push(Number(curTime));
          }
        }
        tempArr.push(getSeconds(totalTimer.textContent));
        chapterArray = [];
        chapterArray = tempArr;
      }
    }
  }
}, 500);

setInterval(function () {
  InWhichChapterAreWeBoi();
}, 250);

setInterval(function () {
  var currTime = document.getElementsByClassName(
    "video-stream html5-main-video"
  )[0];

  if (document.getElementsByClassName("video-stream html5-main-video")[0]) {
    if (currTime) {
      currTime = currTime.currentTime;
    }
    if (currTime != timeCheck) {
      timeCheck = currTime;
      updateTimer();
    }
  }
}, 500);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.sendEvent === "nextChapterPLS") {
    if (chapterArray[1 + currentChapter]) {
      document.getElementsByClassName("video-stream")[0].currentTime =
        chapterArray[1 + currentChapter];
    }
  }

  if (request.sendEvent === "previousChapterPLS") {
    if (chapterArray[currentChapter - 1] && currentChapter != (chapterArray.length)) {
      document.getElementsByClassName("video-stream")[0].currentTime = chapterArray[currentChapter - 1];
    }else if(currentChapter == (chapterArray.length)){
      document.getElementsByClassName("video-stream")[0].currentTime = chapterArray[chapterArray.length - 2];
    }else if(currentChapter <= 1){
      document.getElementsByClassName("video-stream")[0].currentTime = 0;
    }
  }
});
