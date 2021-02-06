function arc(ctx, x, y, r, start, end, clockwise, color, stroke=true) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, start, end, !clockwise);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + r*Math.sin(start));
    ctx.fill();
    if (stroke) {
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function circle(ctx, x, y, r, color, stroke=true) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, r, 0, Math.PI*2);
    ctx.fill();
    if (stroke) {
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function line(ctx, x1, y1, x2, y2, color, width=1) {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function text(ctx, text, x, y, color='white', size=25) {
    ctx.fillStyle = color;
    ctx.font = size + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
}
