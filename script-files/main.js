
const startBtn = document.getElementById("startBtn");
const agree1 = document.getElementById("agree1")
const agree2 = document.getElementById("agree2")

function update() {
    startBtn.disabled = !(agree1.checked && agree2.checked);
}

agree1.addEventListener("change", update);
agree2.addEventListener("change", update);

startBtn.addEventListener("click", () => {
    window.location.href = "quiz.html";
});
update();