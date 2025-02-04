function isProblemPage(document) {
    const url = document.location.href;
    
    const result = ['learn', 'courses', 'lessons'].every(str =>url.includes(str));

    return result;
}

let backgroundThread;

let modalThread;

window.onload = async () => {
    if (isProblemPage(document)) {
        await initializer();      // 서버에 올라가지 않은 기록이 있는지 확인 후 서버에 전송
        backgroundFunction();
    }
}

async function initializer() {
    setTimeout(async () => {
        const active = await isActive();
        if (active === false) {
            console.log("비활성화 상태입니다.");
        } else {
            const table = parseData();
                if (table.length > 0) {
                    const results = await uploadToServer(table);
                    if (results.every(result => result)) 
                        alert("<oj timer> : 업로드 완료!");
                }
        }
    }, 1000);
}

function backgroundFunction() {
    backgroundThread = setInterval(async () => {
        const active = await isActive();
        if (active === false) {
            stopBackgroundFunction();
            console.log("비활성화 상태입니다.");
        } else {
            if (isSucceed()) {
                stopBackgroundFunction();

                if (isHavingSubmissionHistory()) {
                    modalThread = setInterval(async () => {
                        // 정답 modal이 꺼지면 page refresh를 통해서 initializer()이 동작하게 함.
                        if (isClosedModal()) {
                            stopModalThread();
                            refreshPage();
                        }
                    }, 100);
                } else {
                    const data = getSingleParseData();
                    const success = await uploadSingleDataToServer(data);
                    if (success === true) 
                        alert("<oj timer> : 업로드 완료!");
                    else 
                        alert("<oj timer> : 업로드 실패ㅠㅠ");
                }
            }
        }
    }, 2000);
}

function stopBackgroundFunction() {
    clearInterval(backgroundThread);
    backgroundThread = null;
}

function stopModalThread() {
    clearInterval(modalThread);
    modalThread = null;
}

function isClosedModal() {
    const modal = document.querySelector("#modal-dialog").getAttribute("style");
    return modal.includes("none");
}


// 제출 기록 테이블이 있는 지 확인하는 함수
function isHavingSubmissionHistory() {
    const history = document.querySelector('.submission-history-title');

    if (history === undefined || history === null) return false;

    return true;
}