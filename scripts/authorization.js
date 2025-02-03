async function getAccessToken() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("accessToken", (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.accessToken);
      }
    });
  });
}

async function getRefreshToken() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("refreshToken", (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.refreshToken);
      }
    });
  });
}

function getAuthorizationHeaderString(token) {
  return `Bearer ${token}`;
}

async function refreshTokens(alertString) {
  console.log("start refresh tokens");
  const token = await getRefreshToken();

  const response = await fetch("http://localhost:8080/api/refresh-jwt", {
    method : "get",
    headers: {
      Authorization: getAuthorizationHeaderString(token),
    },
  }).catch(error => console.log("refreshTokens(), ", error));


  if (response.status === 401) {

    // refreshToken is expired
    alert(alertString);
    await storeCurrentUrl();
    goMainPage();
    return false;
  } else {

    const { accessToken, refreshToken } = await response.json();

    await chrome.storage.local.set({ accessToken: accessToken }, () => {
      console.log("access token refreshed!");
    });
  
    await chrome.storage.local.set({ refreshToken: refreshToken }, () => {
      console.log("refresh token refreshed!");
    });

    return true;
  }
}