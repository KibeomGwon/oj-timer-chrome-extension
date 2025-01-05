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
    return isNull(value) || (value.hasOwnProperty('length') && value.length === 0);
}

/**
 * 문자열을 escape 하여 반환합니다.
 * @param {string} text - escape 할 문자열
 * @returns {string} - escape된 문자열
 */
function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
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
      '&amp;': '&',
      '&#38;': '&',
      '&lt;': '<',
      '&#60;': '<',
      '&gt;': '>',
      '&#62;': '>',
      '&apos;': "'",
      '&#39;': "'",
      '&quot;': '"',
      '&#34;': '"',
      '&nbsp;': ' ',
      '&#160;': ' ',
    };
    return text.replace(/&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160);/g, function (m) {
      return unescaped[m];
    });
  }
  
  /** 문자열을 unescape 하여 반환합니다. */
  String.prototype.unescapeHtml = function () {
    return unescapeHtml(this);
  };