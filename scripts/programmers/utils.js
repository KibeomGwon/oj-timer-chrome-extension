function parseData() {
  const list = document.querySelectorAll(".kPkVNv .kWkWMs");

  const successList = Array.from(list)
  .map(el => el.getAttribute('data-hackle-value'))
  .map(el => JSON.parse(el))
  .filter(el => el.properties.is_perfect_score === true)
  .map(el => {
    return {
      submissionTime : `${el.properties.created_at}`.split('.')[0],
    }
  });
  
  const dataEtc = getDataEtc();

  const dataList = [];

  successList.forEach(el => {
    const li = {
      elementId : `${dataEtc.problemId}${getNumberStr(dataEtc.username)}${getNumberStr(`${el.submissionTime}`)}`,
      ...dataEtc,
      ...el
    };

    dataList.push(li);
  });

  return dataList;
}


function getNumberStr(str) {
  const numbers = str.match(/\d+/g).join(''); // 숫자만 추출하고 하나의 문자열로 합침
  
  return numbers;
}

function isSucceed() {
  const result = document.querySelector('div.modal-header > h4');

  if (result && result.innerText.includes("정답")) {
    return true;
  }

  return false;
}

function findUsername() {
  const username = document.querySelector('head > script#__hackle-init-info').getAttribute('data-user-id');
  return "programmers" + username;
}


function getDataEtc() {
  const title = document.querySelector('.algorithm-title .challenge-title').textContent.replace(/\\n/g, '').trim();

  const level = document.querySelector('body > div.main > div.lesson-content').getAttribute("data-challenge-level");

  const problemId = document.querySelector('div.main > div.lesson-content').getAttribute('data-lesson-id');

  const language = document.querySelector('div#tour7 > button').textContent.trim();

  const link = document.location.href;

  return {
    title : title,
    username : findUsername(),
    level : level,
    link : link,
    site : "programmers",
    problemId : problemId,
    language : language
  };
}

function getSingleParseData() {
  const dataEtc = getDataEtc();
  
  const submissionTime = getLocalDateTimeWithTimezone();

  const elementId = `${dataEtc.problemId}${getNumberStr(dataEtc.username)}${getNumberStr(`${submissionTime}`)}`;

  return {
    ...dataEtc,
    submissionTime : submissionTime,
    elementId : elementId
  }
}

function getLocalDateTimeWithTimezone(timeZone = 'Asia/Seoul') {
  const now = new Date();
  
  return new Intl.DateTimeFormat('sv-SE', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
  }).format(now).replace(' ', 'T');
}