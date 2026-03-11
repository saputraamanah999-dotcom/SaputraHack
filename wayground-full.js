// =====================================================
// WAYGROUND ULTIMATE TOOLS - DUAL LAYER EDITION v6.0
// =====================================================
// Author: Colin
// Fitur: Auto answer, anti detection, hidden triggers, PIN joiner
// =====================================================

(function() {
    'use strict';
    
    // Hapus loading
    let loading = document.getElementById('wg-loading');
    if (loading) loading.remove();
    
    // Notif sukses
    let notif = document.createElement('div');
    notif.style.cssText = 'position:fixed;top:20px;right:20px;background:#0f0;color:#000;padding:15px;border-radius:10px;z-index:999999;font-family:monospace;border:2px solid #ff0;';
    notif.innerHTML = '✅ GITHUB SCRIPT LOADED!<br><span style="font-size:10px;">Tools siap digunakan</span>';
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
    
    // Panel utama
    setTimeout(() => {
        if (document.getElementById('wg-panel-final')) return;
        
        // Style
        const style = document.createElement('style');
        style.innerHTML = `
            .wg-btn-final {
                background: #333;
                color: #0f0;
                border: 1px solid #0f0;
                border-radius: 5px;
                padding: 10px;
                margin: 3px;
                cursor: pointer;
                flex: 1;
                font-family: monospace;
                font-weight: bold;
                transition: 0.2s;
            }
            .wg-btn-final:hover {
                background: #0f0;
                color: #000;
                transform: scale(1.02);
            }
            .wg-highlight-final {
                border: 3px solid #0f0 !important;
                background: rgba(0, 255, 0, 0.2) !important;
                animation: pulse-final 1s infinite;
            }
            @keyframes pulse-final {
                0% { box-shadow: 0 0 5px #0f0; }
                50% { box-shadow: 0 0 20px #0f0; }
                100% { box-shadow: 0 0 5px #0f0; }
            }
        `;
        document.head.appendChild(style);
        
        // Panel
        const panel = document.createElement('div');
        panel.id = 'wg-panel-final';
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
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px;">
                <span style="color: #ffff00; font-size: 24px; font-weight: bold;">🎯 WAYGROUND TOOLS v6.0</span>
                <div>
                    <span style="background:#0f0; color:#000; padding:3px 10px; border-radius:20px; margin-right:10px; font-size:12px;">GITHUB</span>
                    <button id="final-minimize" style="background: #333; color: #0f0; border: 1px solid #0f0; border-radius: 5px; margin-right: 5px; padding: 5px 10px; cursor: pointer;">🗕</button>
                    <button id="final-close" style="background: #f00; color: #fff; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;">✖</button>
                </div>
            </div>
            
            <div style="margin-bottom: 15px; background: #1a1a1a; padding: 10px; border-radius: 8px;">
                <div style="display: flex; gap: 5px;">
                    <input id="final-pin" type="text" placeholder="MASUKKAN PIN GAME" style="flex: 3; background: #000; color: #0f0; border: 2px solid #0f0; border-radius: 5px; padding: 10px; font-family: monospace; font-size: 14px;">
                    <button id="final-join" style="flex: 1; background: #333; color: #0f0; border: 1px solid #0f0; border-radius: 5px; padding: 10px; cursor: pointer; font-weight: bold;">JOIN</button>
                </div>
            </div>
            
            <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;">
                <button class="wg-btn-final" data-action="answers">📋 JAWABAN</button>
                <button class="wg-btn-final" data-action="auto">🤖 AUTO</button>
                <button class="wg-btn-final" data-action="stop">⏹️ STOP</button>
                <button class="wg-btn-final" data-action="highlight">✨ HIGHLIGHT</button>
            </div>
            
            <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;">
                <button class="wg-btn-final" data-action="bypass">🛡️ BYPASS</button>
                <button class="wg-btn-final" data-action="extract">📤 EXTRACT</button>
                <button class="wg-btn-final" data-action="refresh">🔄 REFRESH</button>
                <button class="wg-btn-final" data-action="hide">👻 HIDE</button>
            </div>
            
            <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px;">
                <button class="wg-btn-final" data-action="reset">🔄 RESET ALL</button>
                <button class="wg-btn-final" data-action="test">🧪 TEST</button>
            </div>
            
            <div id="final-content" style="background: #000; padding: 15px; border-radius: 8px; min-height: 200px; max-height: 300px; overflow-y: auto; font-size: 14px; line-height: 1.5;"></div>
            
            <div style="margin-top: 15px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #333; padding-top: 10px;">
                <span>✅ DUAL LAYER SYSTEM | 👆 Klik pojok kiri 3x untuk munculin lagi</span>
                <div style="margin-top: 5px;">Status: <span id="final-status">READY</span> | Soal: <span id="final-count">0</span></div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // ==================== FUNGSI ====================
        let answers = [];
        let autoInterval = null;
        let highlightInterval = null;
        
        function extractAnswers() {
            let result = [];
            try {
                // Method 1-4
                if (window._questions && Array.isArray(window._questions)) {
                    result = window._questions.map(q => ({
                        q: q.text || q.question || '',
                        o: q.options || q.answers || [],
                        c: q.correct || q.correctOption || 0
                    }));
                } else if (window.quizData && window.quizData.questions) {
                    result = window.quizData.questions.map(q => ({
                        q: q.text || q.question || '',
                        o: q.options || q.answers || [],
                        c: q.correct || q.correctOption || 0
                    }));
                } else if (window.gameData && window.gameData.questions) {
                    result = window.gameData.questions.map(q => ({
                        q: q.q || q.text || '',
                        o: q.ops || q.options || [],
                        c: q.c || q.correct || 0
                    }));
                } else {
                    document.querySelectorAll('.question, [data-question], .soal, .quiz-question').forEach((q, i) => {
                        let qText = q.innerText || 'Soal ' + (i + 1);
                        let options = [];
                        let correct = -1;
                        
                        q.querySelectorAll('input[type="radio"] + label, .option, [data-option], .answer-choice').forEach((opt, idx) => {
                            options.push(opt.innerText || 'Opsi ' + (idx + 1));
                            if (opt.classList.contains('correct') || opt.dataset.correct === 'true' || opt.checked) {
                                correct = idx;
                            }
                        });
                        
                        result.push({ q: qText, o: options, c: correct });
                    });
                }
            } catch (e) {}
            
            // Update count
            document.getElementById('final-count').innerText = result.length;
            return result;
        }
        
        function updateContent() {
            const content = document.getElementById('final-content');
            if (!content) return;
            
            answers = extractAnswers();
            document.getElementById('final-status').innerText = 'UPDATED';
            
            if (answers.length === 0) {
                content.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">⏳ MENCARI SOAL...<br><span style="font-size: 12px;">Klik REFRESH atau tunggu</span></div>';
                return;
            }
            
            let html = `<div style="color: #ff0; margin-bottom: 10px; text-align: center; font-size: 16px;">📊 DITEMUKAN ${answers.length} SOAL</div>`;
            
            answers.forEach((q, i) => {
                html += `<div style="margin-bottom: 15px; border-left: 3px solid #0f0; padding-left: 10px;">`;
                html += `<div style="color: #ff0; margin-bottom: 5px;">${i + 1}. ${(q.q || '').substring(0, 70)}</div>`;
                
                if (q.o && q.o.length > 0) {
                    q.o.forEach((opt, j) => {
                        const isCorrect = (j === q.c);
                        html += `<div style="margin-left: 15px; color: ${isCorrect ? '#0f0' : '#999'};">`;
                        html += isCorrect ? '✓ ' : '○ ';
                        html += `${String.fromCharCode(65 + j)}. ${opt}`;
                        if (isCorrect) html += ' ⬅️ JAWABAN';
                        html += `</div>`;
                    });
                } else {
                    html += `<div style="margin-left: 15px; color: #f00;">Tidak ada opsi</div>`;
                }
                html += `</div>`;
            });
            
            content.innerHTML = html;
            setTimeout(() => document.getElementById('final-status').innerText = 'READY', 1000);
        }
        
        function startAutoAnswer() {
            if (answers.length === 0) {
                alert('Belum ada jawaban! Klik JAWABAN dulu.');
                return;
            }
            
            if (autoInterval) clearInterval(autoInterval);
            
            autoInterval = setInterval(() => {
                try {
                    const options = document.querySelectorAll('input[type="radio"]:not([disabled]), .option:not(.disabled)');
                    if (options.length === 0) return;
                    
                    const questionText = document.querySelector('.question, [data-question], .soal, h2, h3')?.innerText || '';
                    
                    for (let i = 0; i < answers.length; i++) {
                        if (questionText.includes((answers[i].q || '').substring(0, 40))) {
                            const correctIdx = answers[i].c;
                            if (correctIdx >= 0 && correctIdx < options.length) {
                                const delay = 2000 + Math.random() * 3000;
                                setTimeout(() => {
                                    options[correctIdx].click();
                                    options[correctIdx].dispatchEvent(new Event('change', { bubbles: true }));
                                    options[correctIdx].dispatchEvent(new Event('click', { bubbles: true }));
                                }, delay);
                            }
                            break;
                        }
                    }
                } catch (e) {}
            }, 4000);
            
            document.getElementById('final-content').innerHTML = '<div style="color: #0f0; text-align: center; padding: 20px;">✅ AUTO ANSWER DIMULAI<br><span style="font-size: 12px;">Delay random 2-5 detik</span></div>';
        }
        
        function startHighlight() {
            if (highlightInterval) clearInterval(highlightInterval);
            
            highlightInterval = setInterval(() => {
                answers.forEach(q => {
                    if (q.c >= 0) {
                        const options = document.querySelectorAll('input[type="radio"], .option, [data-option]');
                        if (options[q.c]) {
                            options[q.c].classList.add('wg-highlight-final');
                        }
                    }
                });
            }, 2000);
            
            document.getElementById('final-content').innerHTML = '<div style="color: #0f0; text-align: center; padding: 20px;">✨ HIGHLIGHT AKTIF<br><span style="font-size: 12px;">Jawaban benar berkedip hijau</span></div>';
        }
        
        // ==================== EVENT LISTENERS ====================
        document.getElementById('final-close').onclick = () => panel.remove();
        document.getElementById('final-minimize').onclick = () => panel.style.display = 'none';
        
        document.querySelectorAll('.wg-btn-final').forEach(btn => {
            btn.onclick = (e) => {
                const action = e.target.dataset.action;
                
                switch(action) {
                    case 'answers':
                        updateContent();
                        break;
                    case 'auto':
                        startAutoAnswer();
                        break;
                    case 'stop':
                        if (autoInterval) clearInterval(autoInterval);
                        document.getElementById('final-content').innerHTML = '<div style="color: #f00; text-align: center;">⏹️ AUTO ANSWER STOP</div>';
                        break;
                    case 'highlight':
                        startHighlight();
                        break;
                    case 'bypass':
                        Object.defineProperty(document, 'hidden', { value: false });
                        Object.defineProperty(document, 'visibilityState', { value: 'visible' });
                        document.getElementById('final-content').innerHTML = '<div style="color: #0f0; text-align: center;">🛡️ BYPASS AKTIF<br><span style="font-size: 12px;">Anti tab detection</span></div>';
                        break;
                    case 'extract':
                        const json = JSON.stringify(answers, null, 2);
                        document.getElementById('final-content').innerHTML = '<pre style="font-size: 10px; color: #0f0;">' + json.substring(0, 800) + (json.length > 800 ? '...' : '') + '</pre>';
                        navigator.clipboard?.writeText(json);
                        break;
                    case 'refresh':
                        updateContent();
                        break;
                    case 'hide':
                        panel.style.display = 'none';
                        break;
                    case 'reset':
                        if (autoInterval) clearInterval(autoInterval);
                        if (highlightInterval) clearInterval(highlightInterval);
                        autoInterval = null;
                        highlightInterval = null;
                        answers = [];
                        document.getElementById('final-content').innerHTML = '<div style="color: #ff0; text-align: center;">🔄 RESET ALL<br><span style="font-size: 12px;">Semua interval dibersihkan</span></div>';
                        document.getElementById('final-count').innerText = '0';
                        break;
                    case 'test':
                        document.getElementById('final-content').innerHTML = '<div style="color: #0f0; text-align: center;">🧪 TEST MODE<br><span style="font-size: 12px;">Tools berfungsi normal</span></div>';
                        break;
                }
            };
        });
        
        document.getElementById('final-join').onclick = () => {
            const pin = document.getElementById('final-pin').value;
            if (pin) {
                document.querySelectorAll('input[type="text"], input[type="number"], .pin-input').forEach(input => {
                    input.value = pin;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                });
                setTimeout(() => {
                    const btn = document.querySelector('button[type="submit"], .join-btn, .submit-btn, .btn-primary');
                    if (btn) btn.click();
                }, 500);
                document.getElementById('final-content').innerHTML = `<div style="color: #0f0;">📌 Mencoba join dengan PIN: ${pin}</div>`;
            }
        };
        
        // Trigger pojok kiri
        let clickCount = 0;
        document.addEventListener('click', (e) => {
            if (e.clientX < 50 && e.clientY < 50) {
                clickCount++;
                if (clickCount >= 3) {
                    panel.style.display = 'block';
                    clickCount = 0;
                }
                setTimeout(() => clickCount = 0, 3000);
            }
        });
        
        // Initial update
        setTimeout(() => {
            updateContent();
            document.getElementById('final-content').innerHTML = '<div style="color: #0f0; text-align: center;">✅ GITHUB SCRIPT LOADED<br><span style="font-size: 12px;">Klik JAWABAN untuk lihat soal</span></div>';
        }, 500);
        
        // Auto refresh
        setInterval(() => {
            if (panel.style.display !== 'none' && document.getElementById('final-content')) {
                extractAnswers();
            }
        }, 5000);
        
    }, 1000);
})();
