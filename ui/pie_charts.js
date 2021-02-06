function updatePieCharts() {
    const score = simulation.getScore();

    const canvas = document.getElementById('piechart');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;
    canvas.style.width = "200px";
    canvas.style.height = "200px";
    ctx.scale(2, 2);

    circle(ctx, 100, 100, 75, TIE.color2)

    drawPieSlice(ctx, score, BLUE, -1);
    drawPieSlice(ctx, score, RED, 1);
}

function drawPieSlice(ctx, score, party, num) {
    const start = -Math.PI/2
    const span = Math.PI*2 * (score.get(party)/NUM_DISTRICTS);
    const end = start + span*num;
    arc(ctx, 100, 100, 75, start, end, num > 0, party.color1);

    const mid = (start + end) / 2;
    const x = 100 + Math.cos(mid) * (75 * 0.5);
    const y = 100 + Math.sin(mid) * (75 * 0.5);
    text(ctx, score.get(party), x, y)
}
