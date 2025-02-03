/**
 * 해당 값이 null 또는 undefined인지 체크합니다.
 * @param {any} value - 체크할 값
 * @returns {boolean} - null이면 true, null이 아니면 false
 */
function isNull(value) {
  return value === null || value === undefined;
}

/**
 * 해당 값이 비어있거나 빈 문자열인지 체크합니다.
 * @param {any} value - 체크할 값
 * @returns {boolean} - 비어있으면 true, 비어있지 않으면 false
 */
function isEmpty(value) {
  return (
    isNull(value) || (value.hasOwnProperty("length") && value.length === 0)
  );
}

/**
 * 문자열을 escape 하여 반환합니다.
 * @param {string} text - escape 할 문자열
 * @returns {string} - escape된 문자열
 */
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

/** 문자열을 escape 하여 반환합니다. */
String.prototype.escapeHtml = function () {
  return escapeHtml(this);
};

/**
 * escape된 문자열을 unescape하여 반환합니다.
 * @param {string} text - unescape할 문자열
 * @returns {string} - unescape된 문자열
 */
function unescapeHtml(text) {
  const unescaped = {
    "&amp;": "&",
    "&#38;": "&",
    "&lt;": "<",
    "&#60;": "<",
    "&gt;": ">",
    "&#62;": ">",
    "&apos;": "'",
    "&#39;": "'",
    "&quot;": '"',
    "&#34;": '"',
    "&nbsp;": " ",
    "&#160;": " ",
  };
  return text.replace(
    /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160);/g,
    function (m) {
      return unescaped[m];
    }
  );
}

/** 문자열을 unescape 하여 반환합니다. */
String.prototype.unescapeHtml = function () {
  return unescapeHtml(this);
};

/**
 * storage.local에 isActive가 true인지 false 인지
 * 실행을 체크했는지 안 했는지 확인해주는 함수
 * @return boolean
 */
async function isActive() {
  return new Promise( async (resolve, reject) => {
    await chrome.storage.local.get("isActive", (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.isActive);
      }
    });
  });
}

function goMainPage() { 
  location.href = 'http://localhost:8080';
}

function refreshPage() {
  location.reload(true);
}

async function storeCurrentUrl() {
  chrome.storage.local.set({ prePage : `${window.location.href}` }, () => {
    console.log(`stored prePage ${window.location.href}`);
  });
}