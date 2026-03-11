// WAYGROUND FINAL FIX - VERSI PALING AMPUH
(function() {
    'use strict';
    
    // Cek udah ada
    if (document.getElementById('wg-final-fix')) return;
    
    // ==================== ANTI DETECTION ====================
    try {
        Object.defineProperty(document, 'hidden', { value: false });
        Object.defineProperty(document, 'visibilityState', { value: 'visible' });
    } catch (e) {}
    
    // ==================== CREATE PANEL ====================
    let panel = document.createElement('div');
    panel.id = 'wg-final-fix';
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 520px;
        max-width: 95%;
        max-height: 85vh;
        overflow-y: auto;
        background: #0a0a0a;
        border: 4px solid #00ff00;
        border-radius: 20px;
        padding: 20px;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        z-index: 999999;
        box-shadow: 0 0 40px #00ff00;
        display: block;
    `;
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px;">
            <span style="color: #ffff00; font-size: 24px; font-weight: bold;">⚡ WAYGROUND FINAL</span>
            <button id="wg-close-final" style="background: #f00; color: #fff; border: none; border-radius: 5px; padding: 5px 15px; cursor: pointer;">✖</button>
        </div>
        
        <!-- PIN SECTION -->
        <div style="margin-bottom: 20px; background: #1a1a1a; padding: 15px; border-radius: 10px;">
            <div style="display: flex; gap: 10px;">
                <input id="wg-pin-final" type="text" placeholder="MASUKKAN PIN GAME" style="flex: 3; background: #000; color: #0f0; border: 2px solid #0f0; border-radius: 5px; padding: 12px; font-size: 16px;">
                <button id="wg-join-final" style="flex: 1; background: #0f0; color: #000; border: none; border-radius: 5px; font-weight: bold; font-size: 16px; cursor: pointer;">JOIN</button>
            </div>
            <div id="wg-pin-status-final" style="margin-top: 8px; font-size: 12px; color: #ff0; text-align: center;"></div>
        </div>
        
        <!-- BUTTONS -->
        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 20px;">
            <button class="wg-btn-final" id="wg-answers-final">📋 JAWABAN</button>
            <button class="wg-btn-final" id="wg-auto-final">🤖 AUTO</button>
            <button class="wg-btn-final" id="wg-stop-final">⏹️ STOP</button>
            <button class="wg-btn-final" id="wg-highlight-final">✨ HIGHLIGHT</button>
            <button class="wg-btn-final" id="wg-bypass-final">🛡️ BYPASS</button>
            <button class="wg-btn-final" id="wg-extract-final">📤 EXTRACT</button>
        </div>
        
        <!-- CONTENT -->
        <div id="wg-content-final" style="background: #000; padding: 15px; border-radius: 8px; min-height: 250px; max-height: 350px; overflow-y: auto; font-size: 14px;"></div>
        
        <!-- STATUS -->
        <div style="margin-top: 15px; display: flex; justify-content: space-between; color: #666; font-size: 12px;">
            <span>Soal: <span id="wg-count-final">0</span></span>
            <span>Status: <span id="wg-status-final">READY</span></span>
            <span>v1.0</span>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // ==================== STYLE ====================
    let style = document.createElement('style');
    style.innerHTML = `
        .wg-btn-final {
            background: #333;
            color: #0f0;
            border: 2px solid #0f0;
            border-radius: 5px;
            padding: 10px;
            margin: 3px;
            cursor: pointer;
            flex: 1 0 auto;
            font-family: monospace;
            font-weight: bold;
            transition: 0.2s;
        }
        .wg-btn-final:hover {
            background: #0f0;
            color: #000;
        }
        .wg-highlight-final {
            border: 4px solid #0f0 !important;
            background: rgba(0, 255, 0, 0.3) !important;
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 5px #0f0; }
            50% { box-shadow: 0 0 20px #0f0; }
            100% { box-shadow: 0 0 5px #0f0; }
        }
    `;
    document.head.appendChild(style);
    
    // ==================== CLOSE ====================
    document.getElementById('wg-close-final').onclick = () => panel.remove();
    
    // ==================== STATE ====================
    let state = {
        answers: [],
        autoInterval: null,
        highlightInterval: null
    };
    
    // ==================== EKSTRAK JAWABAN ====================
    function extractAnswers() {
        let result = [];
        try {
            // Method 1: window._questions
            if (window._questions && Array.isArray(window._questions)) {
                result = window._questions.map(q => ({
                    q: q.text || q.question || '',
                    o: q.options || q.answers || [],
                    c: q.correct || q.correctOption || 0
                }));
            }
            // Method 2: window.quizData
            else if (window.quizData && window.quizData.questions) {
                result = window.quizData.questions.map(q => ({
                    q: q.text || q.question || '',
                    o: q.options || q.answers || [],
                    c: q.correct || q.correctOption || 0
                }));
            }
            // Method 3: DOM
            else {
                document.querySelectorAll('.question, [data-question], .soal, .quiz-question').forEach((el, idx) => {
                    let qText = el.innerText || el.textContent || `Soal ${idx + 1}`;
                    let options = [];
                    let correct = -1;
                    
                    el.querySelectorAll('input[type="radio"] + label, .option, [data-option]').forEach((opt, optIdx) => {
                        options.push(opt.innerText || opt.textContent || `Opsi ${optIdx + 1}`);
                        if (opt.classList.contains('correct') || opt.dataset.correct === 'true' || opt.checked) {
                            correct = optIdx;
                        }
                    });
                    
                    result.push({
                        q: qText,
                        o: options,
                        c: correct
                    });
                });
            }
        } catch (e) {
            console.log('Extract error:', e);
        }
        
        document.getElementById('wg-count-final').innerText = result.length;
        state.answers = result;
        return result;
    }
    
    // ==================== UPDATE CONTENT ====================
    function updateContent() {
        let content = document.getElementById('wg-content-final');
        if (!content) return;
        
        let answers = extractAnswers();
        
        if (answers.length === 0) {
            content.innerHTML = '<div style="color: #ff0; text-align: center; padding: 30px;">🔍 MENGANALISA SOAL...</div>';
            return;
        }
        
        let html = `<div style="color: #ff0; margin-bottom: 15px; text-align: center;">📊 DITEMUKAN ${answers.length} SOAL</div>`;
        
        answers.forEach((q, i) => {
            html += `<div style="margin-bottom: 15px; border-left: 4px solid #0f0; padding-left: 12px;">`;
            html += `<div style="color: #ff0; font-weight: bold;">${i+1}. ${(q.q || '').substring(0, 70)}</div>`;
            
            if (q.o && q.o.length > 0) {
                q.o.forEach((opt, j) => {
                    let isCorrect = (j === q.c);
                    html += `<div style="margin-left: 15px; color: ${isCorrect ? '#0f0' : '#999'};">`;
                    html += isCorrect ? '✓ ' : '○ ';
                    html += `${String.fromCharCode(65 + j)}. ${opt || 'Kosong'}`;
                    if (isCorrect) html += ' ⬅️ JAWABAN';
                    html += '</div>';
                });
            }
            html += '</div>';
        });
        
        content.innerHTML = html;
        document.getElementById('wg-status-final').innerText = 'UPDATED';
        setTimeout(() => document.getElementById('wg-status-final').innerText = 'READY', 1000);
    }
    
    // ==================== AUTO ANSWER ====================
    function startAutoAnswer() {
        if (state.answers.length === 0) {
            alert('Tidak ada jawaban! Klik JAWABAN dulu.');
            return;
        }
        
        if (state.autoInterval) clearInterval(state.autoInterval);
        
        document.getElementById('wg-content-final').innerHTML = '<div style="color: #0f0; text-align: center;">✅ AUTO ANSWER DIMULAI</div>';
        
        state.autoInterval = setInterval(() => {
            try {
                let options = document.querySelectorAll('input[type="radio"]:not([disabled]), .option:not(.disabled)');
                if (options.length === 0) return;
                
                let questionText = document.querySelector('.question, [data-question], .soal, h2')?.innerText || '';
                
                for (let i = 0; i < state.answers.length; i++) {
                    let q = state.answers[i];
                    if (questionText.includes((q.q || '').substring(0, 30))) {
                        let correctIdx = q.c;
                        if (correctIdx >= 0 && correctIdx < options.length) {
                            let delay = 2000 + Math.random() * 3000;
                            setTimeout(() => {
                                options[correctIdx].click();
                                options[correctIdx].dispatchEvent(new Event('change', { bubbles: true }));
                                document.getElementById('wg-status-final').innerText = `JAWAB ${String.fromCharCode(65 + correctIdx)}`;
                            }, delay);
                        }
                        break;
                    }
                }
            } catch (e) {}
        }, 4000);
    }
    
    // ==================== STOP AUTO ====================
    function stopAutoAnswer() {
        if (state.autoInterval) {
            clearInterval(state.autoInterval);
            state.autoInterval = null;
        }
        document.getElementById('wg-content-final').innerHTML = '<div style="color: #f00; text-align: center;">⏹️ AUTO STOP</div>';
    }
    
    // ==================== HIGHLIGHT ====================
    function startHighlight() {
        if (state.highlightInterval) clearInterval(state.highlightInterval);
        
        document.getElementById('wg-content-final').innerHTML = '<div style="color: #0f0; text-align: center;">✨ HIGHLIGHT AKTIF</div>';
        
        state.highlightInterval = setInterval(() => {
            try {
                state.answers.forEach(q => {
                    if (q.c >= 0) {
                        let options = document.querySelectorAll('input[type="radio"], .option');
                        if (options[q.c]) {
                            options[q.c].classList.add('wg-highlight-final');
                        }
                    }
                });
            } catch (e) {}
        }, 2000);
    }
    
    // ==================== BYPASS ====================
    function enableBypass() {
        Object.defineProperty(document, 'hidden', { value: false });
        Object.defineProperty(document, 'visibilityState', { value: 'visible' });
        document.getElementById('wg-content-final').innerHTML = '<div style="color: #0f0; text-align: center;">🛡️ BYPASS AKTIF</div>';
    }
    
    // ==================== EXTRACT ====================
    function extractData() {
        let json = JSON.stringify(state.answers, null, 2);
        document.getElementById('wg-content-final').innerHTML = `<pre style="font-size: 10px;">${json.substring(0, 800)}${json.length > 800 ? '...' : ''}</pre>`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(json).then(() => alert('Data copied!'));
        }
    }
    
    // ==================== JOIN GAME ====================
    function joinGame(pin) {
        if (!pin || pin.length < 3) {
            document.getElementById('wg-pin-status-final').innerText = '❌ PIN tidak valid';
            return;
        }
        
        document.getElementById('wg-pin-status-final').innerHTML = `⏳ Mencoba join dengan PIN: ${pin}...`;
        
        // Input PIN
        document.querySelectorAll('input[type="text"], input[type="number"], .pin-input').forEach(input => {
            input.value = pin;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
        
        // Klik join
        setTimeout(() => {
            let joined = false;
            document.querySelectorAll('button').forEach(btn => {
                let text = btn.innerText.toLowerCase();
                if (text.includes('join') || text.includes('masuk') || text.includes('play')) {
                    btn.click();
                    document.getElementById('wg-pin-status-final').innerHTML = '✅ JOIN BERHASIL!';
                    joined = true;
                }
            });
            
            if (!joined) {
                document.getElementById('wg-pin-status-final').innerHTML = '⚠️ Klik tombol join manual';
            } else {
                setTimeout(() => {
                    document.getElementById('wg-pin-status-final').innerHTML = '';
                }, 3000);
            }
        }, 500);
    }
    
    // ==================== EVENT LISTENERS ====================
    document.getElementById('wg-answers-final').onclick = updateContent;
    document.getElementById('wg-auto-final').onclick = startAutoAnswer;
    document.getElementById('wg-stop-final').onclick = stopAutoAnswer;
    document.getElementById('wg-highlight-final').onclick = startHighlight;
    document.getElementById('wg-bypass-final').onclick = enableBypass;
    document.getElementById('wg-extract-final').onclick = extractData;
    
    document.getElementById('wg-join-final').onclick = () => {
        let pin = document.getElementById('wg-pin-final').value.trim();
        joinGame(pin);
    };
    
    document.getElementById('wg-pin-final').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('wg-join-final').click();
        }
    });
    
    // ==================== INIT ====================
    setTimeout(() => {
        updateContent();
        document.getElementById('wg-content-final').innerHTML = '<div style="color: #0f0; text-align: center;">✅ READY! Klik JAWABAN</div>';
    }, 1000);
    
    // Auto refresh
    setInterval(() => {
        if (document.getElementById('wg-final-fix')) {
            extractAnswers();
        }
    }, 5000);
    
})();
