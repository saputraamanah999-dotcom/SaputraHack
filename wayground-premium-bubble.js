(function(){
    // Hapus panel lama
    if(document.getElementById('bh-mini')) 
        document.getElementById('bh-mini').remove();

    // Buat panel super simple
    var panel = document.createElement('div');
    panel.id = 'bh-mini';
    panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 280px;
        background: #111;
        border: 3px solid #0f0;
        border-radius: 12px;
        padding: 12px;
        color: #0f0;
        font-family: Arial;
        z-index: 999999;
        box-shadow: 0 0 30px #0f0;
    `;

    panel.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span style="color:#ff0; font-size:18px; font-weight:bold;">🔥 BOYHACK</span>
            <span id="bh-close" style="background:#f00; color:#fff; padding:2px 10px; border-radius:5px; cursor:pointer;">X</span>
        </div>
        
        <!-- PIN -->
        <div style="display:flex; gap:5px; margin-bottom:10px;">
            <input id="bh-pin" type="text" placeholder="PIN" style="flex:2; background:#000; color:#0f0; border:2px solid #0f0; border-radius:5px; padding:8px;">
            <button id="bh-join" style="flex:1; background:#0f0; color:#000; border:none; border-radius:5px; font-weight:bold;">JOIN</button>
        </div>
        
        <!-- BUTTONS -->
        <div style="display:flex; gap:5px; margin-bottom:10px;">
            <button id="bh-scan" style="flex:1; background:#00f; color:#fff; border:none; border-radius:5px; padding:8px;">🔍 SCAN</button>
            <button id="bh-highlight" style="flex:1; background:#0f0; color:#000; border:none; border-radius:5px; padding:8px;">✅ HIGHLIGHT</button>
        </div>
        
        <!-- AUTO -->
        <div style="display:flex; gap:5px; margin-bottom:10px;">
            <button id="bh-auto" style="flex:1; background:#ffaa00; color:#000; border:none; border-radius:5px; padding:8px;">⚡ AUTO</button>
            <button id="bh-stop" style="flex:1; background:#f44; color:#fff; border:none; border-radius:5px; padding:8px;">⏹ STOP</button>
        </div>
        
        <!-- DELAY -->
        <div style="background:#000; padding:8px; border-radius:5px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between;">
                <span>Delay: <span id="bh-delay-val">2s</span></span>
            </div>
            <input type="range" id="bh-delay" min="0" max="5" step="0.5" value="2" style="width:100%;">
        </div>
        
        <!-- HASIL -->
        <div id="bh-result" style="background:#000; border:1px solid #333; border-radius:5px; padding:8px; max-height:200px; overflow-y:auto; font-size:12px;">
            Klik SCAN untuk lihat soal
        </div>
        
        <!-- STATUS -->
        <div style="margin-top:8px; font-size:11px; color:#888; text-align:center;">
            Soal: <span id="bh-count">0</span> | Status: <span id="bh-status">SIAP</span>
        </div>
    `;

    document.body.appendChild(panel);

    // ===== STATE =====
    var state = {
        soal: [],
        autoInterval: null,
        delay: 2000
    };

    // ===== TUTUP PANEL =====
    document.getElementById('bh-close').onclick = function() {
        if(state.autoInterval) clearInterval(state.autoInterval);
        panel.remove();
    };

    // ===== JOIN GAME =====
    document.getElementById('bh-join').onclick = function() {
        var pin = document.getElementById('bh-pin').value;
        if(!pin) return alert('Masukkan PIN!');
        
        document.querySelectorAll('input[type="text"]').forEach(i => i.value = pin);
        setTimeout(() => {
            document.querySelectorAll('button').forEach(b => {
                if(b.innerText.toLowerCase().includes('join')) b.click();
            });
        }, 500);
    };

    // ===== SCAN SOAL =====
    document.getElementById('bh-scan').onclick = function() {
        document.getElementById('bh-status').innerText = 'SCANNING...';
        var hasil = [];
        
        // Coba ambil dari window._questions
        if(window._questions && window._questions.length) {
            hasil = window._questions.map((q,i) => ({
                no: i+1,
                soal: q.text || 'Soal '+(i+1),
                opsi: q.options || [],
                jawaban: q.answer || 0
            }));
        }
        // Coba dari DOM
        else {
            var qEl = document.querySelector('[data-testid="question-text"], .question');
            if(qEl) {
                var optEls = document.querySelectorAll('[data-testid="option"], .option');
                var opsi = [];
                optEls.forEach(o => opsi.push(o.innerText));
                
                if(opsi.length) {
                    hasil.push({
                        no: 1,
                        soal: qEl.innerText,
                        opsi: opsi,
                        jawaban: -1
                    });
                }
            }
        }
        
        state.soal = hasil;
        document.getElementById('bh-count').innerText = hasil.length;
        
        // Tampilkan
        var html = '';
        hasil.forEach(q => {
            html += '<div style="margin-bottom:10px; border-bottom:1px solid #333;">';
            html += '<div style="color:#ff0;">'+q.no+'. '+q.soal.substring(0,50)+'</div>';
            q.opsi.forEach((opt, i) => {
                var isTrue = (i === q.jawaban);
                html += '<div style="margin-left:10px; color:'+(isTrue?'#0f0':'#aaa')+';">';
                html += (isTrue?'✅ ':'○ ')+String.fromCharCode(65+i)+'. '+opt;
                if(isTrue) html += ' ⬅️';
                html += '</div>';
            });
            html += '</div>';
        });
        
        document.getElementById('bh-result').innerHTML = html || '❌ Tidak ada soal';
        document.getElementById('bh-status').innerText = 'READY';
    };

    // ===== HIGHLIGHT JAWABAN =====
    document.getElementById('bh-highlight').onclick = function() {
        state.soal.forEach(q => {
            if(q.jawaban >= 0 && q.opsi[q.jawaban]) {
                document.querySelectorAll('[data-testid="option"], .option').forEach(el => {
                    if(el.innerText.includes(q.opsi[q.jawaban].substring(0,20))) {
                        el.style.border = '3px solid #0f0';
                        el.style.boxShadow = '0 0 15px #0f0';
                    }
                });
            }
        });
        alert('✅ Jawaban di-highlight!');
    };

    // ===== AUTO JAWAB =====
    document.getElementById('bh-auto').onclick = function() {
        if(!state.soal.length) return alert('Scan dulu!');
        if(state.autoInterval) clearInterval(state.autoInterval);
        
        document.getElementById('bh-status').innerText = 'AUTO';
        
        state.autoInterval = setInterval(() => {
            var qActive = document.querySelector('[data-testid="question-text"], .question');
            if(!qActive) return;
            
            var text = qActive.innerText;
            for(var i=0; i<state.soal.length; i++) {
                var q = state.soal[i];
                if(text.includes(q.soal.substring(0,20))) {
                    if(q.jawaban >= 0) {
                        var jawab = q.opsi[q.jawaban];
                        document.querySelectorAll('[data-testid="option"], .option').forEach(el => {
                            if(el.innerText.includes(jawab.substring(0,20))) {
                                setTimeout(() => el.click(), state.delay);
                            }
                        });
                    }
                    break;
                }
            }
        }, 3000);
    };

    // ===== STOP =====
    document.getElementById('bh-stop').onclick = function() {
        if(state.autoInterval) {
            clearInterval(state.autoInterval);
            state.autoInterval = null;
        }
        document.getElementById('bh-status').innerText = 'STOP';
    };

    // ===== DELAY SLIDER =====
    document.getElementById('bh-delay').oninput = function(e) {
        var val = parseFloat(e.target.value).toFixed(1);
        document.getElementById('bh-delay-val').innerText = val + 's';
        state.delay = val * 1000;
    };

    console.log('✅ BOYHACK MINI READY!');
})();
