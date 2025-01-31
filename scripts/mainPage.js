async function setTokens() {
    const response =  await fetch("http://localhost:8080/api/authorization/jwts", {
        method : "get",
        headers : {
          "Content-type" : "application/json",
          "Cookie" : document.cookie
        }
    });

    const { accessToken, refreshToken } = await response.json();

    console.log(accessToken, ", ", refreshToken);

    chrome.storage.local.set({ accessToken : accessToken }, () => {
        console.log("AcessToken is stored in local");
    });

    chrome.storage.local.set({ refreshToken : refreshToken }, () => {
        console.log("RefreshToken is stored in local");
    });
}

async function getPrePage() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("prePage", (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result.prePage);
          }
        });
    });
}

async function checkPrePage() {
    const prePage = await getPrePage();
    // 이전 페이지가 있을 때
    if (prePage !== undefined && prePage !== null) {

        if (prePage.includes("programmers")) await setReload();    // 이전 페이지가 프로그래머스이면 리로드 설정정

        chrome.storage.local.set({ prePage : null })
        .then(() => {
            console.log("prePage is set to null");
            location.href = prePage;
        });
    }
}

async function setReload() {
    chrome.storage.local.set({ reload : true })
    .then(() => console.log("reload is set to true"));
}

async function isLogined() {
    const url = window.location.href;
    if (!url.includes("/login")) {
        await checkPrePage();
    }
}


setTokens();
isLogined();
