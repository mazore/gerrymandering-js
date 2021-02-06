function arc(ctx, x, y, r, start, end, clockwise, color) {
    const [startX, startY] = [x + r*Math.cos(start), y + r*Math.sin(start)]
    const [endX, endY] = [x + r*Math.cos(end), y + r*Math.sin(end)]
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, start, end, !clockwise);
    ctx.lineTo(x, y);
    ctx.lineTo(startX, startY);
    ctx.fill();
    line(ctx, x, y, startX, startY, '#ffffff');
    line(ctx, x, y, endX, endY, '#ffffff');
}

function circle(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, r, 0, Math.PI*2);
    ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width=1) {
    ctx.lineCap = 'square';
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

function text(ctx, text, x, y, color='#ffffff', size=25) {
    ctx.fillStyle = color;
    ctx.font = size + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
}
