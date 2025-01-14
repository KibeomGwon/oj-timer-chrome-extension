const username = findUsername();

const currentUrl = window.location.href;

let thread;

if (!isNull(username)) {
    if (['status', `user_id=${username}`, 'problem_id', 'from_mine=1'].every((key) => currentUrl.includes(key))) {
        console.log('로그인 되어있습니다.');
        if (isExistResultTable()) {
            console.log('제출 번호를 출력합니다.');
            backgroundFunction();
        }
    }
} else {
    console.log('로그인 되어 있지 않습니다.');
}

function backgroundFunction() {
    thread = setInterval(async () => {
        if (isExistResultTable()) {
            if (isSucceed()) {
                const table = findFromResultTable();    
                console.log('<oj timer> 업로드를 시작합니다.');
                stopBackgroundFunction();
                await uploadToServer(table);
                // logSubmittionId();
            }
        }
    }, 2000);
}

function stopBackgroundFunction() {
    clearInterval(thread);
    thread = null;
}

/**
 * test용 함수
 * 제출 번호를 출력함.
 */
function logSubmittionId() {
    const table = findFromResultTable();

    if (table.length === 0) console.log('제출이 없습니다.');

    table.forEach(x => {
        console.log(x);
    });
}
