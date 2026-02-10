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
const wrap = document.querySelector(".chart-wrap");
const tip = document.getElementById("quadTip");
const select = document.getElementById("result_type");
const blocks = document.querySelectorAll("[data-type]");
const blurb = document.getElementById("blurb");

const MID_X = 5;
const MID_Y = 5;
const quadrantText = {
    TL: "Flourishing: This pattern reflects childhood environments where supportive relationships, emotional safety, and stability were more consistently present, alongside relatively lower exposure to significant stressors. In research settings, this grouping is used to describe early contexts that tended to provide multiple protective inputs during development.",
    TR: "Struggling: This pattern reflects childhood environments where meaningful sources of support coexisted with significant stress or disruption. Research uses this category to acknowledge that protective experiences and adversity can occur simultaneously, shaping development in complex and sometimes uneven ways.",
    BL: "Languishing: This pattern reflects childhood environments where neither major adversity nor strong, consistent sources of support were prominent. In population studies, this category is used to describe early contexts marked more by absence—of connection, protection, or enrichment—than by overt hardship.",
    BR: "Floundering: This pattern reflects childhood environments where stressful or adverse experiences were more common and reliable sources of support were limited. In research, this category is used to describe early contexts in which protective buffers were less available during periods of heightened stress.",
};
// Store points here
const points = [];

// Create the chart
const chart = new Chart(ctx, {
    type: "scatter",
    data: {
        datasets: [{
            label: "Responses",
            data: points,
            pointRadius: 8
        }]
    },
    options: {
        responsive: true,              // <-- non-static pixel size
        animation: false,               // optional: snappier updates
        maintainAspectRatio: false,
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

const stored = localStorage.getItem("results");

/*function getQuadrant(x, y) {
    // Define how you want boundaries handled when exactly = 5
    const right = x >= MID_X;
    const top = y >= MID_Y;

    if (top && !right) return "TL";
    if (top && right) return "TR";
    if (!top && !right) return "BL";
    return "BR";
}

function hideTip() {
    tip.style.display = "none";
}

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();

    // Mouse position relative to canvas (CSS pixels)
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    // Only show tooltip when cursor is inside the plot area
    const area = chart.chartArea;
    if (px < area.left || px > area.right || py < area.top || py > area.bottom) {
        hideTip();
        return;
    }

    // Convert pixels -> chart values
    const xVal = chart.scales.x.getValueForPixel(px);
    const yVal = chart.scales.y.getValueForPixel(py);

    const q = getQuadrant(xVal, yVal);

    tip.textContent = quadrantText[q];
    tip.style.display = "block";

    // Position tooltip near cursor (relative to wrapper)
    const wrapRect = wrap.getBoundingClientRect();
    tip.style.left = `${e.clientX - wrapRect.left}px`;
    tip.style.top  = `${e.clientY - wrapRect.top}px`;
});
*/
function update_select_content(){
        blocks.forEach(b => {
            b.hidden = b.dataset.type !== select.value;
        });
}
select.addEventListener("change", () => {
    update_select_content();
});
//canvas.addEventListener("mouseleave", hideTip);
if (!stored) {
    document.getElementById("scores").textContent =
        "No results found. Please take the quiz.";
} else {
    const {ACES_sum, BCES_sum} = JSON.parse(stored);
    localStorage.removeItem("results");
    document.getElementById("scores").textContent =
        `ACES: ${ACES_sum}, BCES: ${BCES_sum}`;
    points.push({x: ACES_sum, y: BCES_sum});
    if(ACES_sum < 5){
        if(BCES_sum < 5){
            select.value = "Languishing";
            blurb.innerHTML = "<b><u>Languishing:</u></b> This pattern reflects childhood environments where neither major adversity nor strong, consistent sources of support were prominent. In population studies, this category is used to describe early contexts marked more by absence—of connection, protection, or enrichment—than by overt hardship.";
        }else{
            select.value = "Flourishing";
        }
    }
    else{
        if(BCES_sum < 5){
            select.value = "Floundering";
            blurb.innerHTML = "<b><u>Floundering:</u></b> This pattern reflects childhood environments where stressful or adverse experiences were more common and reliable sources of support were limited. In research, this category is used to describe early contexts in which protective buffers were less available during periods of heightened stress.";
        }else{
            select.value = "Struggling";
            blurb.innerHTML = "<b><u>Struggling:</u></b> This pattern reflects childhood environments where meaningful sources of support coexisted with significant stress or disruption. Research uses this category to acknowledge that protective experiences and adversity can occur simultaneously, shaping development in complex and sometimes uneven ways.";
        }

    }
    chart.update();
    update_select_content();
}
