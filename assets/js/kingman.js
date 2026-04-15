(function () {
    'use strict';

    var canvas = document.getElementById('kingman-chart');
    var ctx = canvas.getContext('2d');

    var rhoSlider = document.getElementById('kingman-rho');
    var varSlider = document.getElementById('kingman-var');

    var rhoVal = document.getElementById('kingman-rho-value');
    var varVal = document.getElementById('kingman-var-value');

    var waitEl = document.getElementById('kingman-wait');
    var multEl = document.getElementById('kingman-multiplier');
    var costEl = document.getElementById('kingman-cost');

    var teamABtn = document.getElementById('kingman-team-a');
    var teamBBtn = document.getElementById('kingman-team-b');

    // Constants matching the blog post
    var T_MINUTES = 30;
    var PRS_PER_DAY = 8;
    var COST_PER_HOUR = 150;
    var WORK_DAYS = 250;

    // Chart layout
    var MIN_RHO = 0.05;
    var MAX_RHO = 0.98;
    var STEPS = 300;

    var ACCENT = '#1abc9c';
    var DANGER = '#e74c3c';

    // ── Math ──────────────────────────────────────────────

    function kingmanWait(rho, V) {
        if (rho >= 1) return Infinity;
        return V * (rho / (1 - rho)) * (T_MINUTES / 60);
    }

    function niceMax(val) {
        if (val <= 0) return 1;
        var mag = Math.pow(10, Math.floor(Math.log10(val)));
        var norm = val / mag;
        var nice;
        if (norm <= 1) nice = 1;
        else if (norm <= 2) nice = 2;
        else if (norm <= 5) nice = 5;
        else nice = 10;
        return nice * mag;
    }

    function formatCost(dollars) {
        if (dollars >= 1e6) return '$' + (dollars / 1e6).toFixed(1) + 'M';
        if (dollars >= 1e3) return '$' + Math.round(dollars / 1e3) + 'k';
        return '$' + Math.round(dollars);
    }

    // ── Readouts ─────────────────────────────────────────

    function getRho() {
        return parseFloat(rhoSlider.value) / 100;
    }

    function getV() {
        return parseFloat(varSlider.value) / 10;
    }

    function updateReadouts(rho, V) {
        rhoVal.textContent = Math.round(rho * 100) + '%';
        varVal.textContent = V.toFixed(1);

        var wait = kingmanWait(rho, V);
        var mult = V * (rho / (1 - rho));
        var annual = wait * PRS_PER_DAY * COST_PER_HOUR * WORK_DAYS;

        if (wait > 999) {
            waitEl.textContent = '999+ hrs';
            multEl.textContent = '999+\u00d7';
            costEl.textContent = '$\u221e';
        } else {
            waitEl.textContent = wait < 10
                ? wait.toFixed(1) + ' hrs'
                : Math.round(wait) + ' hrs';
            multEl.textContent = mult < 10
                ? mult.toFixed(1) + '\u00d7'
                : Math.round(mult) + '\u00d7';
            costEl.textContent = formatCost(annual) + '/yr';
        }
    }

    // ── Chart ────────────────────────────────────────────

    function drawChart(rho, V) {
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.parentElement.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        var pad = { top: 16, right: 24, bottom: 44, left: 56 };
        var plotW = w - pad.left - pad.right;
        var plotH = h - pad.top - pad.bottom;

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Compute Y range: use wait at 95% utilization for current V
        var refWait = kingmanWait(0.95, V);
        var yMax = niceMax(Math.max(refWait, 1));

        function toX(r) {
            return pad.left + ((r - MIN_RHO) / (MAX_RHO - MIN_RHO)) * plotW;
        }
        function toY(val) {
            return pad.top + plotH - (Math.min(val, yMax) / yMax) * plotH;
        }

        // ── Danger zone (rho > 80%) ──
        var dangerX = toX(0.80);
        ctx.fillStyle = 'rgba(231, 76, 60, 0.05)';
        ctx.fillRect(dangerX, pad.top, pad.left + plotW - dangerX, plotH);

        // ── Grid ──
        ctx.strokeStyle = '#e8e8e8';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#999';
        ctx.font = '11px -apple-system, system-ui, sans-serif';

        // Y grid
        var yTicks = 5;
        for (var i = 0; i <= yTicks; i++) {
            var yVal = (yMax / yTicks) * i;
            var y = toY(yVal);
            ctx.beginPath();
            ctx.moveTo(pad.left, y);
            ctx.lineTo(pad.left + plotW, y);
            ctx.stroke();

            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            var label = yVal < 1 ? yVal.toFixed(1) : Math.round(yVal);
            ctx.fillText(label + 'h', pad.left - 8, y);
        }

        // X grid — fewer ticks on narrow screens
        var xTicks = plotW > 400
            ? [10, 20, 30, 40, 50, 60, 70, 80, 90, 95]
            : [20, 40, 60, 80, 95];
        for (var xi = 0; xi < xTicks.length; xi++) {
            var xr = xTicks[xi] / 100;
            var x = toX(xr);
            ctx.strokeStyle = xTicks[xi] === 80 ? 'rgba(231, 76, 60, 0.2)' : '#e8e8e8';
            ctx.beginPath();
            ctx.moveTo(x, pad.top);
            ctx.lineTo(x, pad.top + plotH);
            ctx.stroke();

            ctx.fillStyle = xTicks[xi] >= 80 ? DANGER : '#999';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(xTicks[xi] + '%', x, pad.top + plotH + 6);
        }

        // "danger zone" label
        ctx.fillStyle = 'rgba(231, 76, 60, 0.35)';
        ctx.font = '10px -apple-system, system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText('danger zone \u2192', pad.left + plotW - 4, pad.top + 4);

        // Reset font
        ctx.fillStyle = '#999';
        ctx.font = '11px -apple-system, system-ui, sans-serif';

        // Axis labels
        ctx.fillStyle = '#777';
        ctx.font = '12px -apple-system, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Utilization (\u03c1)', pad.left + plotW / 2, h - 10);

        ctx.save();
        ctx.translate(14, pad.top + plotH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Wait time', 0, 0);
        ctx.restore();

        // ── Curve ──
        // Fill under curve
        ctx.beginPath();
        ctx.moveTo(toX(MIN_RHO), toY(0));
        for (var s = 0; s <= STEPS; s++) {
            var cr = MIN_RHO + (MAX_RHO - MIN_RHO) * (s / STEPS);
            var cw = Math.min(kingmanWait(cr, V), yMax);
            ctx.lineTo(toX(cr), toY(cw));
        }
        ctx.lineTo(toX(MAX_RHO), toY(0));
        ctx.closePath();
        ctx.fillStyle = 'rgba(26, 188, 156, 0.08)';
        ctx.fill();

        // Stroke curve
        ctx.beginPath();
        for (var s2 = 0; s2 <= STEPS; s2++) {
            var cr2 = MIN_RHO + (MAX_RHO - MIN_RHO) * (s2 / STEPS);
            var cw2 = Math.min(kingmanWait(cr2, V), yMax);
            if (s2 === 0) ctx.moveTo(toX(cr2), toY(cw2));
            else ctx.lineTo(toX(cr2), toY(cw2));
        }
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // ── Current position dot ──
        var curWait = kingmanWait(rho, V);
        var clampedWait = Math.min(curWait, yMax);
        var cx = toX(rho);
        var cy = toY(clampedWait);

        // Crosshair dashed lines
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(cx, pad.top + plotH);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(pad.left, cy);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Dot
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Value annotation near dot
        var annotText = curWait > 999
            ? '999+ hrs'
            : (curWait < 10 ? curWait.toFixed(1) : Math.round(curWait)) + 'h';
        ctx.font = 'bold 12px -apple-system, system-ui, sans-serif';
        ctx.fillStyle = '#0c0c0c';
        ctx.textBaseline = 'bottom';

        // Position annotation to avoid chart edges
        var annotX = cx + 12;
        var annotY = cy - 10;
        var textW = ctx.measureText(annotText).width;

        if (annotX + textW > pad.left + plotW) {
            annotX = cx - textW - 12;
        }
        if (annotY < pad.top + 14) {
            annotY = cy + 22;
            ctx.textBaseline = 'top';
        }

        // Background for readability
        ctx.fillStyle = 'rgba(248, 249, 250, 0.85)';
        ctx.fillRect(annotX - 3, annotY - 14, textW + 6, 18);
        ctx.fillStyle = '#0c0c0c';
        ctx.fillText(annotText, annotX, annotY);

        // ── Axes border ──
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.left, pad.top);
        ctx.lineTo(pad.left, pad.top + plotH);
        ctx.lineTo(pad.left + plotW, pad.top + plotH);
        ctx.stroke();
    }

    // ── Events ───────────────────────────────────────────

    function update() {
        var rho = getRho();
        var V = getV();
        updateReadouts(rho, V);
        drawChart(rho, V);
        teamABtn.classList.remove('active');
        teamBBtn.classList.remove('active');
    }

    rhoSlider.addEventListener('input', update);
    varSlider.addEventListener('input', update);

    teamABtn.addEventListener('click', function () {
        rhoSlider.value = 70;
        varSlider.value = 30; // 3.0
        teamABtn.classList.add('active');
        teamBBtn.classList.remove('active');
        update();
    });

    teamBBtn.addEventListener('click', function () {
        rhoSlider.value = 80;
        varSlider.value = 5; // 0.5
        teamBBtn.classList.add('active');
        teamABtn.classList.remove('active');
        update();
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(update, 60);
    });

    // Initial render
    update();
})();
