(function () {
    'use strict';

    var rSlider = document.getElementById('jackson-r');
    var rVal = document.getElementById('jackson-r-value');

    var ampEl = document.getElementById('jackson-amp');
    var extraEl = document.getElementById('jackson-extra');
    var loadEl = document.getElementById('jackson-load');

    var barIncoming = document.getElementById('jackson-bar-incoming');
    var barEffective = document.getElementById('jackson-bar-effective');
    var segNew = document.getElementById('jackson-seg-new');
    var segRework = document.getElementById('jackson-seg-rework');
    var numEffective = document.getElementById('jackson-num-effective');

    // r' = r/2 (second-round rejection half of first, matching the post)
    function amplification(r) {
        var rPrime = r / 2;
        return 1 / (1 - r / (1 - rPrime));
    }

    // Max amplification at slider max (50%) for scaling bars
    var MAX_AMP = amplification(0.50);

    function update() {
        var r = parseFloat(rSlider.value) / 100;
        rVal.textContent = Math.round(r * 100) + '%';

        var amp = amplification(r);
        var effective = Math.round(amp * 100);
        var rework = effective - 100;

        ampEl.textContent = amp.toFixed(2) + '\u00d7';
        extraEl.textContent = '+' + rework + ' rework';
        loadEl.textContent = Math.round((amp - 1) * 100) + '% hidden';

        // Scale both bars relative to max amplification
        var incomingPct = (1 / MAX_AMP) * 100;
        var effectivePct = (amp / MAX_AMP) * 100;

        barIncoming.style.width = incomingPct + '%';
        barEffective.style.width = effectivePct + '%';

        // Segment split within effective bar
        var newPct = (100 / effective) * 100;
        segNew.style.flex = '0 0 ' + newPct + '%';
        segRework.style.flex = '0 0 ' + (100 - newPct) + '%';

        segNew.textContent = newPct > 25 ? 'new' : '';
        segRework.textContent = (100 - newPct) > 20 ? 'rework' : '';

        numEffective.textContent = effective;
    }

    rSlider.addEventListener('input', update);
    update();
})();
