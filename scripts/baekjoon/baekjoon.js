// Set to true to enable console log
const debug = false;

/* 
  문제 제출 맞음 여부를 확인하는 함수
  2초마다 문제를 파싱하여 확인
*/
let loader;

const currentUrl = window.location.href;
log(currentUrl);

// 문제 제출 사이트의 경우에는 로더를 실행하고, 유저 페이지의 경우에는 버튼을 생성한다.
// 백준 사이트 로그인 상태이면 username이 있으며, 아니면 없다.
const username = findUsername();

if (!isNull(username)) {
    if (['status', `user_id=${username}`, 'problem_id', 'from_mine=1'].every((key) => currentUrl.includes(key))) startLoader();
    else if (currentUrl.match(/\.net\/problem\/\d+/) !== null) parseProblemDescription();
}

function startLoader() {
    loader = setInterval(async () => {
        // 기능 Off시 작동하지 않도록 함
        const enable = await checkEnable();
        if (!enable) stopLoader();
        else if (isExistResultTable()) {
            const table = findFromResultTable();
            if (isEmpty(table)) return;
            const data = table[0];
            if (data.hasOwnProperty('username') && data.hasOwnProperty('resultCategory')) {
                const { username, resultCategory } = data;
                if (username === findUsername() &&
                    (resultCategory.includes(RESULT_CATEGORY.RESULT_ACCEPTED) ||
                        resultCategory.includes(RESULT_CATEGORY.RESULT_ENG_ACCEPTED))) {
                    stopLoader();
                    console.log('oj timer : 풀이가 맞았습니다. 업로드를 시작합니다.');
                    startUpload();
                    const bojData = await findData();
                    await beginUpload(bojData);
                }
            }
        }
    }, 2000);
}


function stopLoader() {
    clearInterval(loader);
    loader = null;
}

/**
 * 결과 테이블의 존재 여부를 확인합니다.
 * @returns boolean
 */
function isExistResultTable() {
    return document.getElementById('status-table') !== null;
}

function findFromResultTable() {
    if (!isExistResultTable()) {
        console.log('Result table not found!');
    }
    return parsingResultTableList(document);
}

function parsingResultTableList(doc) {
    const table = doc.getElementById('status-table');
    if (table === null || table === undefined || table.length === 0) return [];
    const headers = Array.from(table.rows[0].cells, (x) => convertResultTableHeader(x.innerText.trim()));

    const list = [];
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const cells = Array.from(row.cells, (x, index) => {
            switch (headers[index]) {
                case 'result':
                    return { result: x.innerText.trim(), resultCategory: x.firstChild.getAttribute('data-color').replace('-eng', '').trim() };
                case 'language':
                    return x.innerText.unescapeHtml().replace(/\/.*$/g, '').trim();
                case 'submissionTime':
                    const el = x.querySelector('a.show-date');
                    if (isNull(el)) return null;
                    return el.getAttribute('data-original-title');
                case 'problemId':
                    const a = x.querySelector('a.problem_title');
                    if (isNull(a)) return null;
                    return {
                        // 마지막 숫자 배열 만 추출하는 동작
                        problemId: a.getAttribute('href').replace(/^.*\/([0-9]+)$/, '$1'),
                    };
                default:
                    return x.innerText.trim();
            }
        });
        let obj = {};
        obj.elementId = row.id;
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = cells[j];
        }
        obj = { ...obj, ...obj.result, ...obj.problemId };
        list.push(obj);
    }

    console.log('TableList', list);
    return list;
}


/**
 * user가 problemId 에 제출한 리스트를 가져오는 함수
 * @param problemId: 문제 번호
 * @param username: 백준 아이디
 * @return Promise<Array<String>>
 */
async function findResultTableByProblemIdAndUsername(problemId, username) {
    return fetch(`https://www.acmicpc.net/status?from_mine=1&problem_id=${problemId}&user_id=${username}`, { method: 'GET' })
        .then((html) => html.text())
        .then((text) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            return parsingResultTableList(doc);
        });
}

/**
 * user가 "맞았습니다!!" 결과를 맞은 중복되지 않은 제출 결과 리스트를 가져오는 함수
 * @param username: 백준 아이디
 * @returns Promise<Array<Object>>
 */
async function findUniqueResultTableListByUsername(username) {
    return selectBestSubmissionList(await findResultTableListByUsername(username));
}

/**
 * user가 "맞았습니다!!" 결과를 맞은 모든 제출 결과 리스트를 가져오는 함수
 * @param username: 백준 아이디
 * @return Promise<Array<Object>>
 */
async function findResultTableListByUsername(username) {
    const result = [];
    let doc = await findHtmlDocumentByUrl(`https://www.acmicpc.net/status?user_id=${username}&result_id=4`);
    let next_page = doc.getElementById('next_page');
    do {
        result.push(...parsingResultTableList(doc));
        if (next_page !== null) doc = await findHtmlDocumentByUrl(next_page.getAttribute('href'));
    } while ((next_page = doc.getElementById('next_page')) !== null);
    result.push(...parsingResultTableList(doc));

    return result;
}

/**
 * url에 해당하는 html 문서를 가져오는 함수
 * @param url: url 주소
 * @returns html document
 */
async function findHtmlDocumentByUrl(url) {
    return fetch(url, { method: 'GET' })
        .then((html) => html.text())
        .then((text) => {
            const parser = new DOMParser();
            return parser.parseFromString(text, 'text/html');
        });
}


function convertResultTableHeader(header) {
    switch (header) {
        case '문제번호':
        case '문제':
            return 'problemId';
        case '난이도':
            return 'level';
        case '결과':
            return 'result';
        case '문제내용':
            return 'problemDescription';
        case '언어':
            return 'language';
        case '제출 번호':
            return 'submissionId';
        case '아이디':
            return 'username';
        case '제출시간':
        case '제출한 시간':
            return 'submissionTime';
        case '시간':
            return 'runtime';
        case '메모리':
            return 'memory';
        case '코드 길이':
            return 'codeLength';
        default:
            return 'unknown';
    }
}

