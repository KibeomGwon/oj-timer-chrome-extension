const baseUrl = "http://localhost:8080/api";

// 업로드 한 기록이 있는 지 확인하는 함수 필요
// api를 만들어서 제출 아이디와 유저 아이디, 그리고 제출 날짜를 기준으로 판별
async function isUploadedProblemOnServer(problem) {
    // /api/baekjoon/{solution-number} -> Get으로 판별
    const url = `${baseUrl}/${problem.elementId}?username=${findUsername()}&site=baekjoon`;
    const response = await fetch(url, {method : 'GET'});

    // 응답 코드로 상태확인
    return response.ok; 
}

/**
 *  TODO : 에러 처리를 어떻게 할 것인지, modal로 업로드 됐는 지 확인창 띄우기.
 */
async function uploadToServer(datas) {
    for (let i = 0; i < datas.length; i++) {

        if (await isUploadedProblemOnServer(datas[i])) {
            console.log(`${datas[i].elementId}는 이미 저장되었습니다.`);
            
        } else {
            const parsedData = await parseDataToServerDataForm(datas[i]);

            const response = await fetch(`${baseUrl}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(parsedData)
            }).catch(error => console.log(err));
        }
        
    }  
}

async function parseDataToServerDataForm(data) {
    const { level, titleKo } = await fetchSolvedACById(data.problemId);

    return { 
        elementId : data.elementId, 
        language : languages[data.language],
        problemId : data.problemId,
        submissionTime : formatDateString(data.submissionTime),
        username : data.username,
        level: bj_level[level],
        title: titleKo,
        link : `https://www.acmicpc.net/problem/${data.problemId}`,
        site : "baekjoon"
    }
}