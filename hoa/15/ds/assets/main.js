const questions = [
    "Xét các phát biểu về alkane?",
    "Xét các phát biểu về tính chất vật lí của alkane ở điều kiện thường?",
    "Xét các biện pháp làm giảm ô nhiễm môi trường gây ra do sử dụng nhiên liệu từ dầu mỏ?",
    "Xét các phát biểu về phản ứng reforming alkane?",
    "Xét các phát biểu về ứng dụng của alkane?"
];

const answers = [
    ["Trong phân tử alkane chỉ chứa các liên kết σ bền vững", "Các phân tử alkane hầu như không phân cực", "Ở điều kiện thường các alkane hoạt động hóa học mạnh", "Trong phân tử methane, bốn liên kết C–H hướng về bốn đỉnh hình vuông"],
    ["Các alkane từ C1 đến C4 và neopentane ở trạng thái khí", "Các alkane từ C5 đến C17 (trừ neopentane) ở trạng thái lỏng", "Các alkane không tan hoặc tan rất ít trong nước và nhẹ hơn nước", "Các alkane không tan hoặc tan rất ít trong các dung môi hữu cơ"],
    ["Đưa thêm hợp chất có chứa chì vào xăng để làm tăng chỉ số octane của xăng", "Đưa thêm chất xúc tác vào ống xả động cơ để chuyển hoá các khí thải độc hại", "Tăng cường sử dụng biogas", "Tổ chức thu gom và xử lí dầu cặn"],
    ["Chuyển alkane mạch không phân nhánh thành các alkane mạch phân nhánh", "Chuyển alkane mạch không phân nhánh thành các hydrocarbon mạch vòng", "Số nguyên tử carbon của chất tham gia và của sản phẩm khác nhau", "Nhiệt độ sôi của sản phẩm lớn hơn nhiều so với alkane tham gia phản ứng"],
    ["Propane C3H8 và butane C4H10 được sử dụng làm khí đốt", "Các alkane C6, C7, C8 là nguyên liệu để sản xuất một số hydrocarbon thơm", "Các alkane lỏng được sử dụng làm nhiên liệu như xăng hay dầu diesel", "Các alkane từ C11 đến C20 được dùng làm nến và sáp"]
];

const correctAnswers = [
    [0, 1], 
    [0, 1, 2], 
    [1, 2, 3], 
    [0, 1], 
    [0, 1, 2], 
];

function shuffleOptions() {
    // Xáo trộn câu hỏi
    const indices = Array.from({ length: questions.length }, (_, idx) => idx);

    for (let j = indices.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [indices[j], indices[k]] = [indices[k], indices[j]];
    }

    // Áp dụng thứ tự xáo trộn cho câu hỏi, đáp án và đáp án đúng
    const shuffledQuestions = indices.map(index => questions[index]);
    const shuffledAnswers = indices.map(index => answers[index]);
    const shuffledCorrectAnswers = indices.map(index => correctAnswers[index]);

    questions.splice(0, questions.length, ...shuffledQuestions);
    answers.splice(0, answers.length, ...shuffledAnswers);
    correctAnswers.splice(0, correctAnswers.length, ...shuffledCorrectAnswers);

    // Xáo trộn các đáp án trong mỗi câu hỏi
    for (let i = 0; i < answers.length; i++) {
        const answerSet = answers[i];
        const correctIndices = correctAnswers[i];

        // Tạo mảng chỉ số cho các đáp án
        const answerIndices = Array.from({ length: answerSet.length }, (_, idx) => idx);

        // Xáo trộn các chỉ số
        for (let j = answerIndices.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [answerIndices[j], answerIndices[k]] = [answerIndices[k], answerIndices[j]];
        }

        // Áp dụng thứ tự xáo trộn cho các đáp án và cập nhật chỉ số đáp án đúng
        const shuffledAnswers = answerIndices.map(index => answerSet[index]);
        answers[i] = shuffledAnswers;
        correctAnswers[i] = correctIndices.map(index => answerIndices.indexOf(index));
    }
}

shuffleOptions();

// Tạo câu hỏi
const questionTable = document.querySelector(`.question__table`);
questions.forEach((_, index) => {
    const questionItem = document.createElement('div');
    questionItem.classList.add('question__item');
    questionItem.textContent = index + 1;
    questionTable.appendChild(questionItem);
});

const userAnswer = new Array(questions.length).fill(null).map(() => []);
const startTime = Date.now();
let time;

const nav = document.querySelector(`.nav`);
const menu = document.querySelector(`.fa-bars`);
const closeMenu = document.querySelector(`.fa-xmark`);

const questionItem = document.querySelectorAll(`.question__item`);
const questionContent = document.querySelector(`.question__content`);
const answerDesc = document.querySelectorAll(`.answer__desc`);
const radio = document.querySelectorAll(`.choose`);

const prevBtn = document.querySelector(`.prevBtn`);
const nextBtn = document.querySelector(`.nextBtn`);
const submit = document.querySelector(`.submit`);
const ask = document.querySelector(`.ask`);
const noBtn = document.querySelector(`.no`);
const yesBtn = document.querySelector(`.yes`);

const scoreDesc = document.querySelector(`.score__desc`);
let score = 0;
let show = false;

let viTri = 0;

window.onload = () => {
    function updateQuestion(e) {
        radio.forEach((val, idx) => {
            if (val.checked) {
                if (!userAnswer[viTri].includes(idx)) {
                    userAnswer[viTri].push(idx);
                }
            } else {
                const index = userAnswer[viTri].indexOf(idx);
                if (index > -1) {
                    userAnswer[viTri].splice(index, 1);
                }
            }
            val.checked = false;
        });
        viTri = e;
        userAnswer[viTri].forEach(idx => {
            radio[idx].checked = true;
        });
        questionContent.innerHTML = `Câu hỏi ${viTri + 1}: ${questions[viTri]}`
        const sttAnswers = ["A", "B", "C", "D"];
        answerDesc.forEach((val, idx) => {
            val.innerHTML = `${sttAnswers[idx]}. ${answers[viTri][idx]}`;
        });
        questionItem.forEach((val, idx) => {
            val.classList.remove("active");
        });
        questionItem[viTri].classList.add("active");
    }
    updateQuestion(0);

    function updateTimeDisplay() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        const seconds = Math.floor((elapsedTime / 1000) % 60);

        const formattedTime = [
            String(hours).padStart(2, '0'),
            String(minutes).padStart(2, '0'),
            String(seconds).padStart(2, '0')
        ].join(':');

        document.querySelector('.time__cnt').innerText = formattedTime;

        return formattedTime;
    }
    const timerInterval = setInterval(updateTimeDisplay, 1000);

    function updateResults() {
        correctAnswers.forEach((correctAnswerIndices, idx) => {
            const userSelected = userAnswer[idx];
            if (correctAnswerIndices.every(val => userSelected.includes(val)) && userSelected.length === correctAnswerIndices.length) {
                score++;
                questionItem[idx].classList.add("green");
            } else {
                questionItem[idx].classList.add("red");
            }
        });
        scoreDesc.textContent = `Số câu đúng: ${score}/${questions.length}`;
    }

    function showAnswer() {
        if (show) {
            answerDesc.forEach(val => {
                val.style.color = "#000";
            });
            correctAnswers[viTri].forEach(correctIndex => {
                answerDesc[correctIndex].style.color = "red";
            });
        }
    }

    questionItem.forEach((val, idx) => {
        val.addEventListener("click", () => {
            updateQuestion(idx);
            showAnswer();
        });
    });

    prevBtn.addEventListener("click", () => {
        if (viTri > 0) {
            updateQuestion(viTri - 1);
            showAnswer();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (viTri < questions.length - 1) {
            updateQuestion(viTri + 1);
            showAnswer();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft' && viTri > 0) {
            updateQuestion(viTri - 1);
            showAnswer();
        } else if (event.key === 'ArrowRight' && viTri < questions.length - 1) {
            updateQuestion(viTri + 1);
            showAnswer();
        }
    });

    radio.forEach((val, idx) => {
        val.addEventListener('click', () => {
            if (val.checked) {
                if (!userAnswer[viTri].includes(idx)) {
                    userAnswer[viTri].push(idx);
                }
            } else {
                const index = userAnswer[viTri].indexOf(idx);
                if (index > -1) {
                    userAnswer[viTri].splice(index, 1);
                }
            }
            questionItem[viTri].classList.add("blue");
        });
    })

    submit.addEventListener('click', () => {
        updateQuestion(viTri);
        ask.style.display = "block";
    });

    noBtn.addEventListener('click', () => {
        ask.style.display = "none";
    });

    yesBtn.addEventListener('click', () => {
        ask.style.display = "none";
        time = updateTimeDisplay();
        clearInterval(timerInterval);
        scoreDesc.style.display = "block";
        updateResults();
        show = true;
        showAnswer();
    });

    if (window.innerWidth < 767.98) {
        yesBtn.addEventListener('click', () => {
            nav.style.display = "block";
            closeMenu.style.display = "block";
            menu.style.display = "none";
        });
        menu.addEventListener('click', () => {
            nav.style.display = "block";
            closeMenu.style.display = "block";
            menu.style.display = "none";
        });

        nav.addEventListener('click', () => {
            nav.style.display = "none";
            closeMenu.style.display = "none";
            menu.style.display = "block";
        });

        closeMenu.addEventListener('click', () => {
            nav.style.display = "none";
            closeMenu.style.display = "none";
            menu.style.display = "block";
        });
    }
};
