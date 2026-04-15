(function () {
    'use strict';

    var codeSlider = document.getElementById('amdahl-code');
    var reviewSlider = document.getElementById('amdahl-review');
    var codeVal = document.getElementById('amdahl-code-value');
    var reviewVal = document.getElementById('amdahl-review-value');

    var speedupEl = document.getElementById('amdahl-speedup');
    var ceilingEl = document.getElementById('amdahl-ceiling');

    var afterFill = document.getElementById('amdahl-after-fill');
    var segCode = document.getElementById('amdahl-after-code');
    var segReview = document.getElementById('amdahl-after-review');
    var segCi = document.getElementById('amdahl-after-ci');
    var barSpeedup = document.getElementById('amdahl-bar-speedup');

    // Pipeline fractions (from the blog post)
    var P_CODE = 0.40;
    var P_REVIEW = 0.35;
    var P_CI = 0.25;

    // Coding-only ceiling: 1 / (1 - P_CODE) = 1.667
    var CODE_ONLY_MAX = 1 / (1 - P_CODE);

    function formatSpeed(s) {
        return s < 10 ? s.toFixed(1) : Math.round(s);
    }

    function update() {
        var sCode = parseFloat(codeSlider.value) / 10;
        var sReview = parseFloat(reviewSlider.value) / 10;

        codeVal.textContent = formatSpeed(sCode) + '\u00d7';
        reviewVal.textContent = formatSpeed(sReview) + '\u00d7';

        // Amdahl's law with two accelerated stages
        var totalTime = P_CODE / sCode + P_REVIEW / sReview + P_CI;
        var speedup = 1 / totalTime;

        speedupEl.textContent = speedup.toFixed(2) + '\u00d7';
        ceilingEl.textContent = CODE_ONLY_MAX.toFixed(2) + '\u00d7';

        // "After" bar width = totalTime (before = 1.0 = 100%)
        afterFill.style.width = (totalTime * 100) + '%';

        // Segment proportions within the after bar
        var codeTime = P_CODE / sCode;
        var reviewTime = P_REVIEW / sReview;
        var codePct = (codeTime / totalTime) * 100;
        var reviewPct = (reviewTime / totalTime) * 100;
        var ciPct = 100 - codePct - reviewPct;

        segCode.style.flex = '0 0 ' + codePct + '%';
        segReview.style.flex = '0 0 ' + reviewPct + '%';
        segCi.style.flex = '0 0 ' + ciPct + '%';

        // Text labels inside segments (only if wide enough)
        segCode.textContent = codePct > 18 ? Math.round(codePct) + '%' : '';
        segReview.textContent = reviewPct > 18 ? Math.round(reviewPct) + '%' : '';
        segCi.textContent = ciPct > 18 ? Math.round(ciPct) + '%' : '';

        barSpeedup.textContent = speedup.toFixed(2) + '\u00d7';
    }

    codeSlider.addEventListener('input', update);
    reviewSlider.addEventListener('input', update);
    update();
})();
