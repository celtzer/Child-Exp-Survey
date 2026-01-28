const form = document.getElementById("ACESxBCES");
const steps = Array.from(document.querySelectorAll(".step"));
const progress = document.getElementById("progress");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");



let current = 0;

function showStep(i) {
    steps.forEach((s, idx) => s.classList.toggle("active", idx === i));

    // Progress text
    progress.textContent = `Question ${i + 1} of ${steps.length}`;

    // Button visibility
    backBtn.style.display = i === 0 ? "none" : "inline-block";
    nextBtn.style.display = i === steps.length - 1 ? "none" : "inline-block";
    submitBtn.style.display = i === steps.length - 1 ? "inline-block" : "none";
}
function stepIsValid(i) {
    // Validate only inputs inside this step
    const inputs = steps[i].querySelectorAll("input, select, textarea");
    for (const el of inputs) {
        if (!el.checkValidity()) return false;
    }
    return true;
}

nextBtn.addEventListener("click", () => {
    if (!stepIsValid(current)) {
        // Triggers the browser's built-in validation message
        const firstInvalid = steps[current].querySelector("input:invalid, select:invalid, textarea:invalid");
        firstInvalid?.reportValidity();
        return;
    }
    current++;
    showStep(current);
});

backBtn.addEventListener("click", () => {
    current--;
    showStep(current);
});
form.addEventListener("submit", (e) => handleSurveySubmit(e));
function handleSurveySubmit(e) {
    e.preventDefault();
    const formData = new FormData(form);
    let ACES_sum = 0;
    let BCES_sum = 0;
    for (const [name, value] of formData.entries()) {
        if(name[0] === "B"){
            if(value === '1')BCES_sum++;
        }else{
            if(value === '1')ACES_sum++;
        }
    }
    localStorage.setItem("results", JSON.stringify({
        ACES_sum,
        BCES_sum
    }));

    // Go to results page
    window.location.href = "results.html";

}
showStep(0);