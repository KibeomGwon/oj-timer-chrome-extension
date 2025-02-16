const username = findUsername();

const currentUrl = window.location.href;

let thread;

if (!isNull(username)) {
  if (
    ["status", `user_id=${username}`, "problem_id", "from_mine=1"].every(
      (key) => currentUrl.includes(key)
    )
  ) {
    console.log("로그인 되어있습니다.");
    if (isExistResultTable()) {
      backgroundFunction();
    }
  }
} else {
  console.log("로그인 되어 있지 않습니다.");
}

function backgroundFunction() {
  thread = setInterval(async () => {
    const act = await isActive();

    if (act === false) {
      stopBackgroundFunction();
      console.log("비 활성화 상태입니다.");
    } else if (isExistResultTable()) {
      if (isSucceed()) {
        const table = findFromResultTable();
        console.log("<oj timer> 업로드를 시작합니다.");
        stopBackgroundFunction();
        const successList = await uploadToServer(table);
        if (successList.every(li => li)) {
          alert("<oj timer> : 업로드 완료!");
        } else {
          alert("<oj timer> : 업로드 실패ㅠㅠ");
        }
      }
    }
  }, 2000);
}

function stopBackgroundFunction() {
  clearInterval(thread);
  thread = null;
}