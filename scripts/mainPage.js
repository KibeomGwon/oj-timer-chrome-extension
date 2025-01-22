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


async function checkPrePage() {
    chrome.storage.local.get('prePage')
    .then((result) => {
        if (result.prePage !== null && result.prePage !== undefined) {
            if (document.cookie !== undefined && document.cookie !== null) {
                location.href = result.prePage;
                chrome.storage.local.set({ 'prePage' : null })
                .then(() => { console.log("prePage set to null") });
            }
        }
    });
}

async function isLogined() {
    const url = window.location.href;
    if (!url.includes("/login")) {
        await checkPrePage();
    }
}

setTokens();
isLogined();