const baseUrl = "http://localhost:8080/api";

// 업로드 한 기록이 있는 지 확인하는 함수 필요
// api를 만들어서 제출 아이디와 유저 아이디, 그리고 제출 날짜를 기준으로 판별
async function isUploadedProblemOnServer(problem) {
    console.log("Call isUploadedProblemOnServer")
    const accessToken = await getAccessToken();

    // /api/baekjoon/{solution-number} -> Get으로 판별
    const url = `${baseUrl}/${problem.elementId}?username=${findUsername()}&site=programmers`;
    const response = await fetch(url, {
        method : 'GET',
        headers : {
            "Authorization" : getAuthorizationHeaderString(accessToken),
        }
    })
    .catch(error => console.error(error));
    // 응답 코드로 상태확인
    return response; 
}


async function uploadToServer(table) {
    const isContinue = await refreshTokens();
    
    if(isContinue === false) return;

    const successList = [];

    for (let i = 0; i < table.length; i++) {
        const response = await isUploadedProblemOnServer(table[i]);

        console.log(response.status);

        if (response.ok) {
            console.log(`문제 ${table[i].elementId}는 이미 저장되었습니다.`);
            successList.push(false);
        } else {
            successList.push(await postData(table[i]));
        }
    }

    return successList;
}

async function postData(data) {
    const accessToken = await getAccessToken();

    const response = await fetch(`${baseUrl}`, {
        method : "post",
        headers : {
            "Authorization" : getAuthorizationHeaderString(accessToken),
            "Content-type" : "application/json"
        },
        body : JSON.stringify(data)
    }).catch(error => console.error(error));

    if (response.ok) {
        console.log(await response.json());
        return true;
    }
    return false;
}