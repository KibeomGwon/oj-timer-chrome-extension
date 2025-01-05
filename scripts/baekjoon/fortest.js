/**
 * test용 함수
 * 제출 번호를 출력함.
 */
function logSubmittionId() {
    const table = findFromResultTable();

    if (table.length === 0) console.log('제출이 없습니다.');

    table.forEach(x => console.log(parsingSubmittionId(x.rowId)));
}

/**
 * 제출할 때 'status-table'의 제출 번호를 찾아 
 * 리스트로 만들어 반환하는 함수
 * @param doc 
 * @returns array
 */
function parsingResultTableListTest(doc) {
    const table = doc.getElementById('status-table');

    if (table === null || table === undefined || table.length === 0) {
        console.log('Do not exists status-table');
        return [];
    }

    const list = [];

    for(let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        list.push({rowId : row.id});
    }

    return list;
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
    
    return parsingResultTableListTest(document);
}