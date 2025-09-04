let attempts = 0;
let index = 0;
let timer;

function appStart(){
    //게임종료공통
    const gameEnd = () =>{
        window.removeEventListener("keydown", handleKeydown);
        clearInterval(timer);
    }

    //게임성공동작
    const gameClear = () =>{
        gameEnd(); 
        const div = document.createElement('div');
        
        div.innerText = '게임성공';
        div.classList.add('game_state', 'clear');
        document.body.appendChild(div);
    }

    //게임실패동작
    const gameFail = () =>{
        gameEnd(); 
        const div = document.createElement('div');

        div.innerText = '게임실패';
        div.classList.add('game_state', 'fail');
        document.body.appendChild(div);
    }

    //다음줄로 넘어가기
    const nextLine = () =>{
        attempts += 1;
        index = 0;

        if (attempts === 6) {
            gameFail(); 
            return;
        }
    }

    //엔터키 입력시
    const handleEnterKey = async () =>{
        let 맞은_갯수 = 0;
        const 응답 = await fetch('/answer');
        const 정답 = await 응답.json();

        for(let i =0; i<5; i++){
            const block = document.querySelector(`.board-block[data-index='${attempts}${i}']`);
            const 입력한_글자 = block.innerText;
            const 정답_글자 = 정답[i];
            const keyboard = document.querySelector(`.keyboard-btn[data-key='${입력한_글자}']`);
            

            if(입력한_글자 === 정답_글자) {
                맞은_갯수 += 1;
                block.style.background = '#6aaa64';
                keyboard.style.background = '#6aaa64';
            }
            else if(정답.includes(입력한_글자)) {
                block.style.background = '#c9b458';
                keyboard.style.background = '#c9b458';
            }
            else {
                block.style.background = '#787c7e';
                keyboard.style.background = '#787c7e';
            }

            block.style.color = 'white';
            keyboard.style.color = 'white';
        }

        if (맞은_갯수 === 5) gameClear();
        else nextLine();
    }

    //백스페이스 입력시
    const handleBackspace = () =>{
        if (index > 0){
            const preBlock = document.querySelector(`.board-block[data-index='${attempts}${index - 1}']`);

            preBlock.innerText = '';
            if(index !== 0) index -= 1;
        }
    }

    //글자입력
    const handleKeydown = (event) => {
        const key = event.key.toUpperCase();
        const keyCode = event.keyCode;
        const thisBlock = document.querySelector(`.board-block[data-index='${attempts}${index}']`);

        if(event.key === 'Backspace') handleBackspace();
        else if(index === 5){
            if(event.key === "Enter") handleEnterKey();
            else return;
        }
        else if(65 <= keyCode && keyCode <= 90){
            thisBlock.innerText = key;
            index += 1;
        }
    }

    //키보드 클릭시
    const keyboardBtn = document.querySelectorAll('.keyboard-btn');

    keyboardBtn.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const dataKey = (e.currentTarget.getAttribute('data-key') || '');

            if(dataKey.length === 1 && dataKey >= 'A' && dataKey <= 'Z'){
                handleKeydown({ key: dataKey, keyCode: dataKey.charCodeAt(0) });
            }
            else if(dataKey === 'Backspace') handleBackspace();
            else if(index === 5){
                if(dataKey === 'Enter') handleEnterKey();
                else return;
            }
        });
    });

    //타이머
    startTimer = () => {
        const 시작_시간 = new Date();

        function setTime(){
            const 현재_시간 = new Date();
            const 흐른_시간 = new Date(현재_시간 - 시작_시간);
            const 분 = 흐른_시간.getMinutes().toString().padStart(2, '0');
            const 초 = 흐른_시간.getSeconds().toString().padStart(2, '0');
            const timeText = document.querySelector(".timer");

            timeText.innerText = `time: ${분}:${초}`;
        }

        timer = setInterval(setTime, 1000);
    }
    startTimer();

    window.addEventListener("keydown", handleKeydown);
}

appStart();