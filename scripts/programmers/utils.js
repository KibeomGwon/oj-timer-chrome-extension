function parseData() {
  const list = document.querySelectorAll(".kPkVNv .kWkWMs");

  const successList = Array.from(list)
  .map(el => el.getAttribute('data-hackle-value'))
  .map(el => JSON.parse(el))
  .filter(el => el.properties.is_perfect_score === true)
  .map(el => {
    return {
      submissionTime : `${el.properties.created_at}`.split('.')[0],
      language : el.properties.language,
      problemId : el.properties.lesson_id
    }
  });
  
  const title = document.querySelector('.algorithm-title .challenge-title').textContent.replace(/\\n/g, '').trim();

  const username = document.querySelector('head > script#__hackle-init-info').getAttribute('data-user-id');

  const level = document.querySelector('body > div.main > div.lesson-content').getAttribute("data-challenge-level")

  const link = document.location.href;

  const dataList = [];

  successList.forEach(el => {
    const li = {
      elementId : `${el.problemId}${username}${getNumberStr(`${el.submissionTime}`)}`,
      title : title,
      username : findUsername(),
      level : level,
      link : link,
      site : "programmers",
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