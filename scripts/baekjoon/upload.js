// 업로드 한 기록이 있는 지 확인하는 함수 필요
// api를 만들어서 제출 아이디와 유저 아이디, 그리고 제출 날짜를 기준으로 판별
async function isUploadedProblemOnServer(problem) {
    // /api/baekjoon/{solution-number} -> Get으로 판별
    const url = `http://localhost/api/baekjoon/${problem.elementId}`;
    const response = await fetch(url);
    // 응답 코드로 상태확인
    return response.ok; 
}

async function uploadToServer(datas) {
    // for (let i = 0; i < datas.length; i++) {
    //     if (await isUploadedProblemOnServer(datas[i])) {
    //         console.log(`${datas[i].elementId}는 이미 저장되었습니다.`);
    //     };
    //     const parsedData = parseDataToServerDataForm(datas[i]);
    //     fetch(url, {
    //         method: "POST",
    //         headers: {
    //             "Content-type": "application/json",
    //         },
    //         body: JSON.stringify(parsedData)
    //     }).then(res => {
            
    //     }).catch(error => console.log(err));
    // }  
    for (let i = 0; i < datas.length; i++) {
        const parsedData = await parseDataToServerDataForm(datas[i]);
        console.log(JSON.stringify(parsedData));
    }  
}

async function parseDataToServerDataForm(data) {
    const {level, titleKo} = await fetchSolvedACById(data.problemId);

    return { 
        elementId : data.elementId, 
        language : languages[data.language],
        problemId : data.problemId,
        submissionTime : data.submissionTime,
        username : data.username,
        level: bj_level[level],
        title: titleKo,
        link : `https://www.acmicpc.net/problem/${data.problemId}`
    }
}