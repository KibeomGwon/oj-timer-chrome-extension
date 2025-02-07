window.onload = async function () {
  await init();
  const startButton = document.getElementById("start-button");
  startButton.onclick = clickStart;

  const stopButton = document.getElementById("stop-button");
  stopButton.onclick = clickStop;

  const homePageButton = document.getElementById("home-page-link");
  homePageButton.onclick = clickHomePageDiv;

  chrome.storage.local.get('refreshToken', (result) => console.log('refresh, ', result.refreshToken));
};

async function init() {
  chrome.storage.local.get("accessToken", async (result) => {
    const el = document.getElementById("authentication-status");

    if (result.accessToken !== undefined || result.accessToken !== null) {
      const isLogin = await isAuthenticated(result.accessToken);
      if (isLogin) {
        console.log("로그인 되어 있습니다.");
        el.innerText = "로그인";

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

function clickHomePageDiv() {
  window.open(`https://oj-timer.site`);
}

async function isAuthenticated(accessToken) {
  console.log(accessToken);

  const response = await fetch(`https://oj-timer.site/api/authorization`, {
    method: "get",

    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "Cookie" : ""
    },
  });

  return response.ok;
}


