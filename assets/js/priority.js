(function () {
    'use strict';

    var canvas = document.getElementById('priority-chart');
    var ctx = canvas.getContext('2d');
    var pctSlider = document.getElementById('priority-pct');
    var pctVal = document.getElementById('priority-pct-value');

    var urgentEl = document.getElementById('priority-urgent');
    var normalEl = document.getElementById('priority-normal');
    var fcfsEl = document.getElementById('priority-fcfs');

    var RHO = 0.75;
    var FCFS = 1 / (1 - RHO); // 4.0

    var FONT = '-apple-system, system-ui, sans-serif';

    // Non-preemptive priority M/M/1: two classes
    // W_k / R = 1 / prod((1 - sigma_{j})) for j = k-1..k
    // where sigma_k = cumulative utilization through class k
    function compute(fraction) {
        var rho1 = fraction * RHO;
        var w1 = 1 / (1 - rho1);
        var w2 = 1 / ((1 - rho1) * (1 - RHO));
        return { w1: w1, w2: w2 };
    }

    function niceMax(val) {
        if (val <= 0) return 1;
        var mag = Math.pow(10, Math.floor(Math.log10(val)));
        var norm = val / mag;
        if (norm <= 1) return mag;
        if (norm <= 2) return 2 * mag;
        if (norm <= 5) return 5 * mag;
        return 10 * mag;
    }

    function update() {
        var fraction = parseFloat(pctSlider.value) / 100;
        pctVal.textContent = Math.round(fraction * 100) + '%';

        var r = compute(fraction);

        urgentEl.textContent = r.w1.toFixed(1) + '\u00d7 W\u2080';
        normalEl.textContent = r.w2.toFixed(1) + '\u00d7 W\u2080';
        fcfsEl.textContent = FCFS.toFixed(1) + '\u00d7 W\u2080';

        drawChart(r);
    }

    function drawChart(r) {
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.parentElement.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        var pad = { top: 16, right: 16, bottom: 36, left: 48 };
        var plotW = w - pad.left - pad.right;
        var plotH = h - pad.top - pad.bottom;

        // Y scale
        var yMax = niceMax(Math.max(r.w2 * 1.15, FCFS * 1.3));

        function toY(val) {
            return pad.top + plotH - (Math.min(val, yMax) / yMax) * plotH;
        }

        // Y grid
        ctx.strokeStyle = '#e8e8e8';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#999';
        ctx.font = '11px ' + FONT;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        var yTicks = 5;
        for (var i = 0; i <= yTicks; i++) {
            var yVal = (yMax / yTicks) * i;
            var y = toY(yVal);
            ctx.beginPath();
            ctx.moveTo(pad.left, y);
            ctx.lineTo(pad.left + plotW, y);
            ctx.stroke();
            var label = yVal < 1 ? yVal.toFixed(1) : Math.round(yVal);
            ctx.fillText(label + '\u00d7', pad.left - 6, y);
        }

        // FCFS reference line
        var fcfsY = toY(FCFS);
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pad.left, fcfsY);
        ctx.lineTo(pad.left + plotW, fcfsY);
        ctx.stroke();
        ctx.setLineDash([]);

        // FCFS label
        ctx.fillStyle = '#888';
        ctx.font = '11px ' + FONT;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('Without priority: ' + FCFS.toFixed(1) + '\u00d7', pad.left + plotW, fcfsY - 4);

        // Bar geometry
        var barGap = plotW * 0.12;
        var barW = (plotW - barGap * 3) / 2;
        var barX1 = pad.left + barGap;
        var barX2 = barX1 + barW + barGap;
        var baseline = pad.top + plotH;

        // Urgent bar
        var urgH = Math.max((r.w1 / yMax) * plotH, 2);
        ctx.fillStyle = '#1abc9c';
        roundedRect(ctx, barX1, baseline - urgH, barW, urgH, 4);
        ctx.fill();

        // Normal bar
        var normH = Math.min((r.w2 / yMax) * plotH, plotH);
        ctx.fillStyle = '#e74c3c';
        roundedRect(ctx, barX2, baseline - normH, barW, normH, 4);
        ctx.fill();

        // Value labels
        ctx.font = 'bold 13px ' + FONT;
        ctx.textAlign = 'center';

        if (urgH > 28) {
            ctx.fillStyle = '#fff';
            ctx.textBaseline = 'top';
            ctx.fillText(r.w1.toFixed(1) + '\u00d7', barX1 + barW / 2, baseline - urgH + 8);
        } else {
            ctx.fillStyle = '#0c0c0c';
            ctx.textBaseline = 'bottom';
            ctx.fillText(r.w1.toFixed(1) + '\u00d7', barX1 + barW / 2, baseline - urgH - 4);
        }

        if (normH > 28) {
            ctx.fillStyle = '#fff';
            ctx.textBaseline = 'top';
            ctx.fillText(r.w2.toFixed(1) + '\u00d7', barX2 + barW / 2, baseline - normH + 8);
        } else {
            ctx.fillStyle = '#0c0c0c';
            ctx.textBaseline = 'bottom';
            ctx.fillText(r.w2.toFixed(1) + '\u00d7', barX2 + barW / 2, baseline - normH - 4);
        }

        // X labels
        ctx.fillStyle = '#666';
        ctx.font = '12px ' + FONT;
        ctx.textBaseline = 'top';
        ctx.fillText('Urgent PRs', barX1 + barW / 2, baseline + 8);
        ctx.fillText('Normal PRs', barX2 + barW / 2, baseline + 8);

        // Y axis label
        ctx.save();
        ctx.translate(12, pad.top + plotH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = '#777';
        ctx.font = '12px ' + FONT;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Wait time', 0, 0);
        ctx.restore();

        // Axes border
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.left, pad.top);
        ctx.lineTo(pad.left, baseline);
        ctx.lineTo(pad.left + plotW, baseline);
        ctx.stroke();
    }

    function roundedRect(ctx, x, y, w, h, r) {
        r = Math.min(r, h / 2, w / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
    }

    var _timer;
    pctSlider.addEventListener('input', update);
    window.addEventListener('resize', function () {
        clearTimeout(_timer);
        _timer = setTimeout(update, 60);
    });

    update();
})();
