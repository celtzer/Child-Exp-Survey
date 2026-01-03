const form = document.getElementById("ACESxBCES");

const canvas = document.getElementById("xyChart");
const ctx = canvas.getContext("2d");
const quadrantLinesAtFive = {
    id: "quadrantLinesAtFive",
    afterDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        const xScale = scales.x;
        const yScale = scales.y;

        const xPix = xScale.getPixelForValue(5);
        const yPix = yScale.getPixelForValue(5);

        ctx.save();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;

        // vertical line x=5
        if (xPix >= chartArea.left && xPix <= chartArea.right) {
            ctx.beginPath();
            ctx.moveTo(xPix, chartArea.top);
            ctx.lineTo(xPix, chartArea.bottom);
            ctx.stroke();
        }

        // horizontal line y=5
        if (yPix >= chartArea.top && yPix <= chartArea.bottom) {
            ctx.beginPath();
            ctx.moveTo(chartArea.left, yPix);
            ctx.lineTo(chartArea.right, yPix);
            ctx.stroke();
        }

        ctx.restore();
    }
};
const quadrantLabelsPlugin = {
    id: "quadrantLabels",
    afterDraw(chart) {
        const { ctx, chartArea, scales } = chart;

        const xMid = scales.x.getPixelForValue(5);
        const yMid = scales.y.getPixelForValue(5);

        ctx.save();
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Top-left
        ctx.fillText(
            "Struggling",
            (chartArea.left + xMid) / 2,
            (chartArea.top + yMid) / 2
        );

        // Top-right
        ctx.fillText(
            "Flourishing",
            (xMid + chartArea.right) / 2,
            (chartArea.top + yMid) / 2
        );

        // Bottom-left
        ctx.fillText(
            "Floundering",
            (chartArea.left + xMid) / 2,
            (yMid + chartArea.bottom) / 2
        );

        // Bottom-right
        ctx.fillText(
            "Languishing",
            (xMid + chartArea.right) / 2,
            (yMid + chartArea.bottom) / 2
        );

        ctx.restore();
    }
};
// Store points here
const points = [];

// Create the chart
const chart = new Chart(ctx, {
    type: "scatter",
    data: {
        datasets: [{
            label: "Responses",
            data: points
        }]
    },
    options: {
        responsive: false,              // <-- static pixel size
        animation: false,               // optional: snappier updates
        scales: {
            x: {
                type: "linear",
                reverse: true,              // keep if you want flipped X
                min: 0,
                max: 10,
                title: { display: true, text: "ACES_score" }
            },
            y: {
                type: "linear",
                min: 0,
                max: 10,
                title: { display: true, text: "BCES_score" }
            }
        }
    },
    plugins: [quadrantLinesAtFive,quadrantLabelsPlugin]
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
    points.push({ x: ACES_sum, y: BCES_sum });
    chart.update();

    form.reset();
}

function createABCESGraph(BCES_sum, ACES_sum){

}