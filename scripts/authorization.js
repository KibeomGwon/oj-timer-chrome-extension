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

async function refreshTokens() {
  const token = await getRefreshToken();

  const response = await fetch("http://localhost:8080/api/refresh-jwt", {
    headers: {
      Authorization: getAuthorizationHeaderString(token),
    },
  }).catch(error => console.log("refreshTokens(), ", error));

  if (response.status === 401) {
    // refreshToken is expired
    alert("로그인을 다시해야 합니다.");
    await storeCurrentUrl();
    goMainPage();
    return false;
  }

  const { accessToken, refreshToken } = await response.json();

  chrome.storage.local.set({ accessToken: accessToken }, () => {});

  chrome.storage.local.set({ refreshToken: refreshToken }, () => {});

  return true;
}