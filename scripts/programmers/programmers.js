function isProblemPage(document) {
    const url = document.location.href;
    
    const result = ['learn', 'courses', 'lessons'].every(str =>url.includes(str));

    return result;
}

let thread;

window.onload = async () => {
    if (isProblemPage(document)) {
        await initializer();      // 서버에 올라가지 않은 기록이 있는지 확인 후 서버에 전송
        backgroundFunction();
    }
}

async function initializer() {
    setTimeout(async () => {
        const active = isActive();
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
    }, 2000);
}

function backgroundFunction() {
    thread = setInterval(async () => {
        const active = isActive();
        if (active === false) {
            stopBackgroundFunction();
            console.log("비활성화 상태입니다.");
        } else {
            if (isSucceed()) {
                console.log("<oj timer> 업로드를 시작합니다.");
                stopBackgroundFunction();
                const table = parseData();
                const results = await uploadToServer(table);
                if (results.every(result => result)) {
                    alert("<oj timer> : 업로드 완료!");
                } 
            }
        }
    }, 2000);
}

function stopBackgroundFunction() {
    clearInterval(thread);
    thread = null;
}
