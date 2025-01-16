window.onload = async function () {
  await init();
  const startButton = document.getElementById("start-button");
  startButton.onclick = clickStart;

  const stopButton = document.getElementById("stop-button");
  stopButton.onclick = clickStop;

  const testButton = document.getElementById("test-button");
  testButton.addEventListener("click", testFunction);
};

async function init() {
  chrome.storage.local.get("isActive", (result) => {
    const el = document.getElementById("start-stop-text");

    if (result.isActive === undefined) {
      chrome.storage.local.set({ isActive: false }, () => {
        console.log("isActive 생성");
        el.innerText = "정지 중";
      });
    } else if (result.isActive === false) {
      el.innerText = "정지 중";
    } else {
      el.innerText = "실행 중";
    }
  });
}

function clickStart() {
  const el = document.getElementById("start-stop-text");
  chrome.storage.local.set({ isActive: true }).then((result) => {
    el.innerText = "실행 중";
  });
}

function clickStop() {
  const el = document.getElementById("start-stop-text");
  chrome.storage.local.set({ isActive: false }).then((result) => {
    el.innerText = "정지 중";
  });
}

function testFunction() {
  chrome.storage.local.get((result) => console.log(result));
}
