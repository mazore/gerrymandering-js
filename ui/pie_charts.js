function updatePieCharts() {
    const score = simulation.getScore();

    const canvas = document.getElementById('piechart');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    ctx.lineWidth = 1;
    ctx.fillStyle = TIE.color2;
    ctx.beginPath();
    ctx.arc(100, 100, 75, 75, 0, Math.PI*2, false);
    ctx.fill();
    ctx.stroke();

    drawPieSlice(ctx, score, BLUE, -1);
    drawPieSlice(ctx, score, RED, 1);
}

function drawPieSlice(ctx, score, party, num) {
    ctx.fillStyle = party.color1;
    ctx.beginPath();
    const start = -Math.PI/2
    const span = Math.PI*2*(score.get(party)/NUM_DISTRICTS);
    const end = start + span*num;
    ctx.arc(100, 100, 75, start, end, num < 0);
    ctx.lineTo(100, 100);
    ctx.lineTo(100, 25);
    ctx.fill();
    ctx.stroke();

    const mid = (start + end) / 2;
    const x = 100 + Math.cos(mid) * (75 * 0.5);
    const y = 100 + Math.sin(mid) * (75 * 0.5);
    ctx.fillStyle = 'white';
    ctx.font = '25px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(score.get(party), x, y);
}
