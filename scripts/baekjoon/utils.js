function findUsername() {
    const el = document.querySelector('a.username');
    if (isNull(el)) return null;
    const username = el?.innerText?.trim();
    if (isEmpty(username)) return null;
    return username;
}

/**
 * 결과 테이블이 존재하는 지 확인하는 함수
 * @returns boolean
 */
function isExistResultTable() {
    return document.getElementById('status-table') !== null;
}

/**
 * 제출한 테이블을 받아오는 함수
 * @returns array
 */
function findFromResultTable() {
    if (!isExistResultTable()) {
        console.log('Result table not found!');
        return [];
    }

    return parsingSuccessResultTableList(document);
}

/**
 * 제출할 때 'status-table'의 제출 번호를 찾아 
 * span class = result-text인 속성에 data-color="ac"(성공)인 결과를 리스트들로 만들어 반환.
 * 리스트로 만들어 반환하는 함수
 * @param doc 
 * @returns array
 */
function parsingSuccessResultTableList(doc) {
    const table = doc.getElementById('status-table');
    const list = [];

    if (table === null || table === undefined || table.length === 0) {
        console.log('Do not exists status-table');
        return list;
    }

    const headers = Array.from(table.rows[0].cells, (x) => convertResultTableHeader(x.innerText.trim()));

    // '맞았습니다'를 찾아서
    // 테이블 문제, 제출번호, 제출 시간, 언어, 문제 링크를 담은 객체 리스트 생성
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];

        let isSuccess = false;

        const cells = Array.from(row.cells, (x, index) => {
            switch (headers[index]) {
                case 'result':
                    const resultCategory = x.firstChild.getAttribute('data-color').replace('-eng', '').trim();
                    if (resultCategory.includes(RESULT_CATEGORY.RESULT_ACCEPTED)) isSuccess = true;
                    return { result: x.innerText.trim(), resultCategory: resultCategory };
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

        if (isSuccess === true) {
            let obj = {};
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = cells[j];
            }
            obj.elementId = row.id;
            obj = { ...obj, ...obj.result, ...obj.problemId };  // obj.result = { result, resultCategory }, obj.problemId = { problemId }
           
            list.push(obj);
        }
    }

    return list;
}

function isSucceed() {
    const firstRow = parsingResultTableList(document)[0];

    if (firstRow.hasOwnProperty('username') && firstRow.hasOwnProperty('resultCategory')) {
        if (firstRow.username === findUsername() && firstRow.resultCategory === RESULT_CATEGORY.RESULT_ACCEPTED) {
            return true;
        }
    }

    return false;
}


/**
 * 결과 테이블의 모든 행을 받아오는 함수
 * 첫 번째 행이 성공했는 지 여부를 확인하기 위해 테이블 데이터를 파싱
 * @param {document} doc 
 * @returns 
 */
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

    return list;
}

async function fetchSolvedACById(problemId) {
    return chrome.runtime.sendMessage({sender: "baekjoon", task : "SolvedApiCall", problemId : problemId});
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

function formatDateString(inputDate) {
    // Step 1: 한글 날짜 문자열을 파싱하여 개별 요소 추출
    const regex = /(\d{4})년 (\d{1,2})월 (\d{1,2})일 (\d{1,2}):(\d{1,2}):(\d{1,2})/;
    const match = inputDate.match(regex);

    if (!match) {
        throw new Error("Invalid date format");
    }

    // Step 2: 추출된 문자열을 숫자로 변환
    const [_, year, month, day, hours, minutes, seconds] = match;

    // Step 3: ISO 8601 형식으로 포맷팅
    const formattedDate = new Date(year, month - 1, day, hours, minutes, seconds).toISOString();

    // Step 4: ISO 형식에서 날짜와 시간 부분만 반환
    return formattedDate.slice(0, 19);
}

/**
 * storage.local에 isActive가 true인지 false 인지
 * 실행을 체크했는지 안 했는지 확인해주는 함수
 * @return boolean
 */
async function isActive() {
    return await chrome.storage.local.get('isActive').then((result) => result.isActive);
}