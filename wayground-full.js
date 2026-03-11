// WAYGROUND ULTIMATE TOOLS - GITHUB EDITION
// Author: Colin
// Version: 6.0

(function() {
    'use strict';
    
    // Notifikasi loading
    const notif = document.createElement('div');
    notif.style.cssText = 'position:fixed;top:10px;right:10px;background:#0f0;color:#000;padding:10px;border-radius:5px;z-index:999999;font-family:monospace;';
    notif.innerText = '📦 WAYGROUND TOOLS LOADING...';
    document.body.appendChild(notif);
    
    // Panel utama
    setTimeout(() => {
        // Hapus notif
        notif.remove();
        
        // Cek panel udah ada belom
        if (document.getElementById('wg-panel-github')) return;
        
        // Style
        const style = document.createElement('style');
        style.innerHTML = `
            .wg-btn-github {
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
            }
            .wg-btn-github:hover {
                background: #0f0;
                color: #000;
            }
            .wg-highlight-github {
                border: 3px solid #0f0 !important;
                background: rgba(0, 255, 0, 0.2) !important;
                animation: pulse 1s infinite;
            }
            @keyframes pulse {
                0% { box-shadow: 0 0 5px #0f0; }
                50% { box-shadow: 0 0 20px #0f0; }
                100% { box-shadow: 0 0 5px #0f0; }
            }
        `;
        document.head.appendChild(style);
        
        // Panel
        const panel = document.createElement('div');
        panel.id = 'wg-panel-github';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
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
                <span style="color: #ffff00; font-size: 24px; font-weight: bold;">🎯 WAYGROUND GITHUB EDITION</span>
                <div>
                    <button id="github-minimize" style="background: #333; color: #0f0; border: 1px solid #0f0; border-radius: 5px; margin-right: 5px; padding: 5px 10px; cursor: pointer;">🗕</button>
                    <button id="github-close" style="background: #f00; color: #fff; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;">✖</button>
                </div>
            </div>
            
            <div style="margin-bottom: 15px; background: #1a1a1a; padding: 10px; border-radius: 8px;">
                <div style="display: flex; gap: 5px;">
                    <input id="github-pin" type="text" placeholder="MASUKKAN PIN GAME" style="flex: 3; background: #000; color: #0f0; border: 2px solid #0f0; border-radius: 5px; padding: 10px; font-family: monospace;">
                    <button id="github-join" style="flex: 1; background: #333; color: #0f0; border: 1px solid #0f0; border-radius: 5px; padding: 10px; cursor: pointer; font-weight: bold;">JOIN</button>
                </div>
            </div>
            
            <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;">
                <button class="wg-btn-github" data-action="answers">📋 JAWABAN</button>
                <button class="wg-btn-github" data-action="auto">🤖 AUTO</button>
                <button class="wg-btn-github" data-action="stop">⏹️ STOP</button>
                <button class="wg-btn-github" data-action="highlight">✨ HIGHLIGHT</button>
            </div>
            
            <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px;">
                <button class="wg-btn-github" data-action="bypass">🛡️ BYPASS</button>
                <button class="wg-btn-github" data-action="extract">📤 EXTRACT</button>
                <button class="wg-btn-github" data-action="refresh">🔄 REFRESH</button>
                <button class="wg-btn-github" data-action="hide">👻 HIDE</button>
            </div>
            
            <div id="github-content" style="background: #000; padding: 15px; border-radius: 8px; min-height: 250px; max-height: 350px; overflow-y: auto; font-size: 14px;"></div>
            
            <div style="margin-top: 15px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #333; padding-top: 10px;">
                <span>✅ GITHUB VERSION | 👆 Klik pojok kiri 3x untuk munculin lagi</span>
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
                // Method 3: window.gameData
                else if (window.gameData && window.gameData.questions) {
                    result = window.gameData.questions.map(q => ({
                        q: q.q || q.text || '',
                        o: q.ops || q.options || [],
                        c: q.c || q.correct || 0
                    }));
                }
                // Method 4: DOM
                else {
                    document.querySelectorAll('.question, [data-question], .soal').forEach((q, i) => {
                        let qText = q.innerText || 'Soal ' + (i + 1);
                        let options = [];
                        let correct = -1;
                        
                        q.querySelectorAll('input[type="radio"] + label, .option, [data-option]').forEach((opt, idx) => {
                            options.push(opt.innerText || 'Opsi ' + (idx + 1));
                            if (opt.classList.contains('correct') || opt.dataset.correct === 'true' || opt.checked) {
                                correct = idx;
                            }
                        });
                        
                        result.push({ q: qText, o: options, c: correct });
                    });
                }
            } catch (e) {
                console.log('Extract error:', e);
            }
            return result;
        }
        
        function updateContent() {
            const content = document.getElementById('github-content');
            if (!content) return;
            
            answers = extractAnswers();
            
            if (answers.length === 0) {
                content.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">⏳ MENCARI SOAL...<br><span style="font-size: 12px;">Tunggu atau klik REFRESH</span></div>';
                return;
            }
            
            let html = `<div style="color: #ff0; margin-bottom: 10px; text-align: center;">📊 DITEMUKAN ${answers.length} SOAL</div>`;
            
            answers.forEach((q, i) => {
                html += `<div style="margin-bottom: 15px; border-left: 3px solid #0f0; padding-left: 8px;">`;
                html += `<div style="color: #ff0;">${i + 1}. ${(q.q || '').substring(0, 60)}</div>`;
                
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
                    
                    const questionText = document.querySelector('.question, [data-question], .soal, h2')?.innerText || '';
                    
                    for (let i = 0; i < answers.length; i++) {
                        if (questionText.includes((answers[i].q || '').substring(0, 30))) {
                            const correctIdx = answers[i].c;
                            if (correctIdx >= 0 && correctIdx < options.length) {
                                setTimeout(() => {
                                    options[correctIdx].click();
                                    options[correctIdx].dispatchEvent(new Event('change', { bubbles: true }));
                                    options[correctIdx].dispatchEvent(new Event('click', { bubbles: true }));
                                }, Math.random() * 3000 + 2000);
                            }
                            break;
                        }
                    }
                } catch (e) {}
            }, 4000);
            
            document.getElementById('github-content').innerHTML = '<div style="color: #0f0; text-align: center;">✅ AUTO ANSWER DIMULAI</div>';
        }
        
        function startHighlight() {
            if (highlightInterval) clearInterval(highlightInterval);
            
            highlightInterval = setInterval(() => {
                answers.forEach(q => {
                    if (q.c >= 0) {
                        const options = document.querySelectorAll('input[type="radio"], .option');
                        if (options[q.c]) {
                            options[q.c].classList.add('wg-highlight-github');
                        }
                    }
                });
            }, 2000);
            
            document.getElementById('github-content').innerHTML = '<div style="color: #0f0; text-align: center;">✨ HIGHLIGHT AKTIF</div>';
        }
        
        // ==================== EVENT LISTENERS ====================
        document.getElementById('github-close').onclick = () => panel.remove();
        document.getElementById('github-minimize').onclick = () => panel.style.display = 'none';
        
        document.querySelectorAll('.wg-btn-github').forEach(btn => {
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
                        document.getElementById('github-content').innerHTML = '<div style="color: #f00;">⏹️ AUTO STOP</div>';
                        break;
                    case 'highlight':
                        startHighlight();
                        break;
                    case 'bypass':
                        Object.defineProperty(document, 'hidden', { value: false });
                        Object.defineProperty(document, 'visibilityState', { value: 'visible' });
                        document.getElementById('github-content').innerHTML = '<div style="color: #0f0;">🛡️ BYPASS AKTIF</div>';
                        break;
                    case 'extract':
                        const json = JSON.stringify(answers, null, 2);
                        document.getElementById('github-content').innerHTML = '<pre style="font-size: 10px;">' + json.substring(0, 500) + '...</pre>';
                        navigator.clipboard?.writeText(json);
                        break;
                    case 'refresh':
                        updateContent();
                        break;
                    case 'hide':
                        panel.style.display = 'none';
                        break;
                }
            };
        });
        
        document.getElementById('github-join').onclick = () => {
            const pin = document.getElementById('github-pin').value;
            if (pin) {
                document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
                    input.value = pin;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                });
                setTimeout(() => {
                    document.querySelector('button[type="submit"], .join-btn, .submit-btn')?.click();
                }, 500);
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
        updateContent();
        
        // Auto refresh
        setInterval(() => {
            if (panel.style.display !== 'none') {
                updateContent();
            }
        }, 5000);
        
    }, 1500);
})();
