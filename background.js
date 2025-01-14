async function getProblemInfoFromSolvedAc (problemId) {
    return fetch(`https://solved.ac/api/v3/problem/show?problemId=${problemId}`, { method : 'GET'})
    .then((query) => query.json());
}

function handleMessage(request, sender, sendResponse) {

    if (request && request.sender == "baekjoon" && request.task == "SolvedApiCall") {
        getProblemInfoFromSolvedAc(request.problemId).then((res) => sendResponse(res));
      }

    return true;
}

chrome.runtime.onMessage.addListener(handleMessage);