// ===========================================
// WAYGROUND FIX - PASTI MUNCUL!
// ===========================================
(function() {
    'use strict';

    // --- 1. HAPUS INSTANCE LAMA ---
    if (document.getElementById('wg-fix-master')) return;

    console.log('%c[WG-FIX] Memuat...', 'color:lime; font-size:14px;');

    // --- 2. ANTI DETECTION SEDERHANA ---
    try { Object.defineProperty(document, 'hidden', { value: false }); } catch(e) {}
    try { Object.defineProperty(document, 'visibilityState', { value: 'visible' }); } catch(e) {}

    // --- 3. BUAT PANEL (HARUS MUNCUL!) ---
    const panel = document.createElement('div');
    panel.id = 'wg-fix-master';
    panel.style.cssText = `
        all: initial;
        position: fixed;
        top: 20px;
        right: 20px;
        width: 450px;
        background: #111;
        border: 3px solid #0f0;
        border-radius: 15px;
        padding: 20px;
        color: #0f0;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        z-index: 9999999;
        box-shadow: 0 0 30px #0f0;
    `;
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
            <span style="color: #ff0; font-size: 20px;">✅ WG FIX v2</span>
            <button id="wg-fix-close" style="background: #f00; color: #fff; border: none; border-radius: 5px; padding: 5px 12px; cursor: pointer;">✖</button>
        </div>
        <div style="margin-bottom: 15px; display: flex; gap: 5px;">
            <input id="wg-fix-pin" type="text" placeholder="PIN Game" style="flex: 3; background: #000; color: #0f0; border: 1px solid #0f0; border-radius: 5px; padding: 10px;">
            <button id="wg-fix-join" style="flex: 1; background: #0f0; color: #000; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">JOIN</button>
        </div>
        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px;">
            <button class="wg-fix-btn" id="wg-fix-answer">📋 Ambil Jawaban</button>
            <button class="wg-fix-btn" id="wg-fix-auto">🤖 Auto Jawab</button>
            <button class="wg-fix-btn" id="wg-fix-stop">⏹ Stop</button>
        </div>
        <div id="wg-fix-content" style="background: #000; padding: 15px; border-radius: 8px; min-height: 150px; max-height: 300px; overflow-y: auto; border: 1px solid #333;">
            <div style="color: #ff0; text-align: center;">⏳ Menunggu perintah...</div>
        </div>
        <div style="margin-top: 10px; font-size: 11px; color: #666; text-align: center;">
            <span>Soal: <span id="wg-fix-count">0</span></span>
        </div>
    `;
    document.body.appendChild(panel);

    // --- 4. TAMBAH STYLE ---
    const style = document.createElement('style');
    style.innerHTML = `
        .wg-fix-btn {
            background: #333;
            color: #0f0;
            border: 1px solid #0f0;
            border-radius: 5px;
            padding: 8px;
            cursor: pointer;
            flex: 1;
            font-family: inherit;
        }
        .wg-fix-btn:hover { background: #0f0; color: #000; }
        .wg-highlight-fix {
            border: 3px solid #0f0 !important;
            background: rgba(0,255,0,0.1) !important;
        }
    `;
    document.head.appendChild(style);

    // --- 5. STATE ---
    let state = { answers: [], autoInterval: null };

    // --- 6. FUNGSI GET SOAL (COBA SEMUA KEMUNGKINAN) ---
    function getSoal() {
        let hasil = [];
        try {
            console.log('[WG] Mencari soal...');

            // COBA 1: Dari window object
            if (window._questions) hasil = window._questions;
            else if (window.quizData?.questions) hasil = window.quizData.questions;
            else if (window.gameData?.questions) hasil = window.gameData.questions;

            // COBA 2: Dari DOM (jika hasil masih kosong)
            if (hasil.length === 0) {
                document.querySelectorAll('[class*="question"], [class*="soal"], .quiz-question, h2, h3').forEach((el, idx) => {
                    let qText = el.innerText?.trim() || `Soal ${idx+1}`;
                    let options = [];
                    let correct = -1;

                    // Cari opsi di sekitar elemen soal
                    let optionEls = el.parentElement?.querySelectorAll('input[type="radio"] + label, [class*="option"], [class*="answer"]') || [];
                    optionEls.forEach((opt, optIdx) => {
                        options.push(opt.innerText?.trim() || `Opsi ${optIdx+1}`);
                        if (opt.classList.contains('correct') || opt.dataset.correct === 'true' || opt.checked) correct = optIdx;
                    });
                    
                    if (options.length > 0) {
                        hasil.push({ question: qText, options: options, correct: correct });
                    }
                });
            }

            // COBA 3: Format ulang hasil
            state.answers = hasil.map(q => ({
                q: q.question || q.text || q.q || 'Soal',
                o: q.options || q.answers || q.ops || [],
                c: q.correct ?? q.correctOption ?? q.c ?? -1
            }));

            document.getElementById('wg-fix-count').innerText = state.answers.length;
            console.log(`[WG] Ditemukan ${state.answers.length} soal`);
        } catch (e) {
            console.log('[WG] Error get soal:', e);
        }
        return state.answers;
    }

    // --- 7. FUNGSI TAMPILKAN KE PANEL ---
    function tampilkanSoal() {
        const konten = document.getElementById('wg-fix-content');
        const soal = getSoal();

        if (soal.length === 0) {
            konten.innerHTML = '<div style="color:orange;">🔍 Tidak menemukan soal. Coba klik <b>Ambil Jawaban</b> lagi nanti.</div>';
            return;
        }

        let html = '<div style="color:#ff0; margin-bottom:10px;">📊 Hasil Analisis:</div>';
        soal.forEach((q, i) => {
            html += `<div style="margin-bottom:12px; border-left:2px solid #0f0; padding-left:8px;">`;
            html += `<div><b>${i+1}. ${q.q.substring(0,80)}</b></div>`;
            if (q.o.length > 0) {
                q.o.forEach((opt, j) => {
                    let isCorrect = (j === q.c);
                    html += `<div style="margin-left:15px; color:${isCorrect?'#0f0':'#999'};">${isCorrect?'✓':'○'} ${String.fromCharCode(65+j)}. ${opt}</div>`;
                });
            } else {
                html += `<div style="margin-left:15px; color:#666;">(Tidak ada opsi)</div>`;
            }
            html += '</div>';
        });
        konten.innerHTML = html;
    }

    // --- 8. FUNGSI AUTO JAWAB ---
    function mulaiAuto() {
        if (state.answers.length === 0) {
            alert('Tidak ada jawaban. Klik Ambil Jawaban dulu.');
            return;
        }
        if (state.autoInterval) clearInterval(state.autoInterval);
        document.getElementById('wg-fix-content').innerHTML = '<div style="color:#0f0;">🤖 Mode Auto Aktif...</div>';
        
        state.autoInterval = setInterval(() => {
            try {
                let pilihan = document.querySelectorAll('input[type="radio"]:not([disabled]), [class*="option"]:not([disabled])');
                if (pilihan.length === 0) return;

                let teksSoal = document.querySelector('[class*="question"], [class*="soal"], h2, h3')?.innerText || '';

                for (let i = 0; i < state.answers.length; i++) {
                    if (teksSoal.includes(state.answers[i].q.substring(0,30))) {
                        let idxBenar = state.answers[i].c;
                        if (idxBenar >= 0 && idxBenar < pilihan.length) {
                            setTimeout(() => {
                                pilihan[idxBenar].click();
                                pilihan[idxBenar].dispatchEvent(new Event('change', { bubbles: true }));
                            }, 2000 + Math.random()*3000);
                        }
                        break;
                    }
                }
            } catch (e) {}
        }, 4000);
    }

    // --- 9. FUNGSI JOIN ---
    function joinGame(pin) {
        let status = document.getElementById('wg-pin-status-fix');
        if (!pin || pin.length < 3) { alert('PIN tidak valid'); return; }
        
        document.querySelectorAll('input[type="text"], input[type="number"]').forEach(i => { i.value = pin; i.dispatchEvent(new Event('input')); });
        setTimeout(() => {
            document.querySelectorAll('button').forEach(b => {
                if (b.innerText.toLowerCase().includes('join') || b.innerText.toLowerCase().includes('masuk')) b.click();
            });
        }, 400);
    }

    // --- 10. PASANG EVENT LISTENER ---
    document.getElementById('wg-fix-close').onclick = () => panel.remove();
    document.getElementById('wg-fix-answer').onclick = tampilkanSoal;
    document.getElementById('wg-fix-auto').onclick = mulaiAuto;
    document.getElementById('wg-fix-stop').onclick = () => {
        if (state.autoInterval) clearInterval(state.autoInterval);
        document.getElementById('wg-fix-content').innerHTML = '<div style="color:#f00;">⏹ Dihentikan</div>';
    };
    document.getElementById('wg-fix-join').onclick = () => joinGame(document.getElementById('wg-fix-pin').value);
    document.getElementById('wg-fix-pin').addEventListener('keypress', (e) => { if (e.key === 'Enter') document.getElementById('wg-fix-join').click(); });

    console.log('%c[WG-FIX] Panel SIAP!', 'color:lime;');
})();
