// =====================================================
// WAYGROUND FINAL EDITION - ALL FEATURES WORKING
// =====================================================

(function() {
    'use strict';
    
    // ==================== KONFIGURASI ====================
    const CONFIG = {
        version: 'FINAL-1.0',
        answerDelay: { min: 2000, max: 5000 }
    };
    
    // ==================== STATE ====================
    let state = {
        answers: [],
        autoInterval: null,
        highlightInterval: null,
        panelVisible: true,
        isActive: true
    };
    
    // ==================== ANTI DETECTION ====================
    (function antiDetection() {
        Object.defineProperty(document, 'hidden', { value: false, configurable: false });
        Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: false });
        window.addEventListener('visibilitychange', (e) => e.stopImmediatePropagation(), true);
        window.addEventListener('blur', (e) => e.stopImmediatePropagation(), true);
    })();
    
    // ==================== STYLE ====================
    let style = document.createElement('style');
    style.innerHTML = `
        .wg-final-panel {
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
        }
        .wg-final-btn {
            background: #333;
            color: #0f0;
            border: 1px solid #0f0;
            border-radius: 5px;
            padding: 10px;
            margin: 3px;
            cursor: pointer;
            flex: 1 0 auto;
            font-family: monospace;
            font-weight: bold;
            transition: 0.2s;
        }
        .wg-final-btn:hover {
            background: #0f0;
            color: #000;
            transform: scale(1.02);
        }
        .wg-final-highlight {
            border: 3px solid #00ff00 !important;
            background: rgba(0, 255, 0, 0.3) !important;
            animation: wg-pulse 1s infinite !important;
        }
        @keyframes wg-pulse {
            0% { box-shadow: 0 0 5px #0f0; }
            50% { box-shadow: 0 0 20px #0f0; }
            100% { box-shadow: 0 0 5px #0f0; }
        }
        .wg-pin-input {
            background: #000;
            color: #0f0;
            border: 2px solid #0f0;
            border-radius: 5px;
            padding: 12px;
            width: 100%;
            font-family: monospace;
            font-size: 16px;
        }
        .wg-join-btn {
            background: #333;
            color: #0f0;
            border: 1px solid #0f0;
            border-radius: 5px;
            padding: 12px;
            cursor: pointer;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
    
    // ==================== PANEL ====================
    let panel = document.createElement('div');
    panel.className = 'wg-final-panel';
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px;">
            <span style="color: #ffff00; font-size: 24px; font-weight: bold;">🎯 WAYGROUND FINAL</span>
            <div>
                <button id="wg-minimize" class="wg-final-btn" style="padding: 5px 10px; margin-right: 5px;">🗕</button>
                <button id="wg-close" class="wg-final-btn" style="background: #f00; color: #fff; padding: 5px 10px;">✖</button>
            </div>
        </div>
        
        <!-- PIN JOIN SECTION - SUDAH DIPERBAIKI -->
        <div style="margin-bottom: 20px; background: #1a1a1a; padding: 15px; border-radius: 10px;">
            <div style="display: flex; gap: 10px;">
                <input id="wg-pin" type="text" class="wg-pin-input" placeholder="MASUKKAN PIN GAME">
                <button id="wg-join" class="wg-join-btn">JOIN</button>
            </div>
            <div id="wg-pin-status" style="margin-top: 8px; font-size: 12px; color: #ff0; text-align: center;"></div>
        </div>
        
        <!-- BUTTONS ROW 1 -->
        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;">
            <button class="wg-final-btn" id="btn-answers">📋 JAWABAN</button>
            <button class="wg-final-btn" id="btn-auto">🤖 AUTO</button>
            <button class="wg-final-btn" id="btn-stop">⏹️ STOP</button>
            <button class="wg-final-btn" id="btn-highlight">✨ HIGHLIGHT</button>
        </div>
        
        <!-- BUTTONS ROW 2 -->
        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px;">
            <button class="wg-final-btn" id="btn-bypass">🛡️ BYPASS</button>
            <button class="wg-final-btn" id="btn-extract">📤 EXTRACT</button>
            <button class="wg-final-btn" id="btn-refresh">🔄 REFRESH</button>
            <button class="wg-final-btn" id="btn-hide">👻 HIDE</button>
        </div>
        
        <!-- CONTENT -->
        <div id="wg-content" style="background: #000; padding: 15px; border-radius: 8px; min-height: 250px; max-height: 350px; overflow-y: auto; font-size: 14px;"></div>
        
        <!-- FOOTER -->
        <div style="margin-top: 15px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #333; padding-top: 10px;">
            <span>✅ SEMUA FITUR BERFUNGSI | 👆 Klik pojok kiri 3x</span>
            <div style="margin-top: 5px;">Status: <span id="wg-status">READY</span> | Soal: <span id="wg-count">0</span></div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // ==================== FUNGSI JOIN GAME (DIPERBAIKI) ====================
    function joinGame(pin) {
        if (!pin || pin.length < 4) {
            document.getElementById('wg-pin-status').innerText = '❌ PIN tidak valid';
            return;
        }
        
        document.getElementById('wg-pin-status').innerHTML = `⏳ Mencoba join dengan PIN: ${pin}...`;
        
        // Method 1: Cari input PIN
        let pinInputs = document.querySelectorAll(
            'input[type="text"], input[type="number"], .pin-input, .game-pin, [placeholder*="PIN"], [placeholder*="Code"], [placeholder*="Kode"]'
        );
        
        let joined = false;
        
        pinInputs.forEach(input => {
            input.value = pin;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('keyup', { bubbles: true }));
            joined = true;
        });
        
        // Method 2: Cari form
        setTimeout(() => {
            let joinButtons = document.querySelectorAll(
                'button[type="submit"], .join-btn, .submit-btn, .btn-primary, button:contains("Join"), button:contains("Masuk"), button:contains("Play")'
            );
            
            joinButtons.forEach(btn => {
                if (btn.innerText.toLowerCase().includes('join') || 
                    btn.innerText.toLowerCase().includes('masuk') ||
                    btn.innerText.toLowerCase().includes('play') ||
                    btn.innerText.toLowerCase().includes('mulai')) {
                    btn.click();
                    document.getElementById('wg-pin-status').innerHTML = '✅ JOIN BERHASIL!';
                    joined = true;
                }
            });
            
            if (!joined) {
                document.getElementById('wg-pin-status').innerHTML = '⚠️ Tombol join tidak ditemukan, coba manual';
            } else {
                setTimeout(() => {
                    document.getElementById('wg-pin-status').innerHTML = '';
                }, 3000);
            }
        }, 500);
    }
    
    // ==================== EKSTRAK JAWABAN ====================
    function extractAnswers() {
        let result = [];
        try {
            // Method 1: window._questions
            if (window._questions && Array.isArray(window._questions)) {
                result = window._questions.map(q => ({
                    question: q.text || q.question || q.title || '',
                    options: q.options || q.answers || [],
                    correct: q.correct || q.correctOption || q.correctAnswer || 0
                }));
            }
            // Method 2: window.quizData
            else if (window.quizData && window.quizData.questions) {
                result = window.quizData.questions.map(q => ({
                    question: q.text || q.question || '',
                    options: q.options || q.answers || [],
                    correct: q.correct || q.correctOption || 0
                }));
            }
            // Method 3: window.gameData
            else if (window.gameData && window.gameData.questions) {
                result = window.gameData.questions.map(q => ({
                    question: q.q || q.text || q.question || '',
                    options: q.ops || q.options || q.answers || [],
                    correct: q.c || q.correct || q.correctOption || 0
                }));
            }
            // Method 4: DOM
            else {
                document.querySelectorAll('.question, [data-question], .soal, .quiz-question').forEach((el, idx) => {
                    let qText = el.innerText || el.textContent || `Soal ${idx + 1}`;
                    let options = [];
                    let correct = -1;
                    
                    el.querySelectorAll('input[type="radio"] + label, .option, [data-option], .answer-choice').forEach((opt, optIdx) => {
                        options.push(opt.innerText || opt.textContent || `Opsi ${optIdx + 1}`);
                        
                        let radio = opt.querySelector('input[type="radio"]') || opt.previousElementSibling;
                        if (radio && radio.checked) correct = optIdx;
                        if (opt.classList.contains('correct')) correct = optIdx;
                        if (opt.dataset.correct === 'true') correct = optIdx;
                    });
                    
                    result.push({
                        question: qText,
                        options: options,
                        correct: correct
                    });
                });
            }
        } catch (e) {}
        
        document.getElementById('wg-count').innerText = result.length;
        return result;
    }
    
    // ==================== UPDATE CONTENT ====================
    function updateContent() {
        let content = document.getElementById('wg-content');
        if (!content) return;
        
        state.answers = extractAnswers();
        
        if (state.answers.length === 0) {
            content.innerHTML = '<div style="color: red; text-align: center; padding: 30px;">⏳ MENCARI SOAL...<br><span style="font-size: 12px;">Klik REFRESH atau tunggu</span></div>';
            return;
        }
        
        let html = `<div style="color: #ff0; margin-bottom: 15px; text-align: center; font-size: 16px;">📊 DITEMUKAN ${state.answers.length} SOAL</div>`;
        
        state.answers.forEach((q, i) => {
            html += `<div style="margin-bottom: 15px; border-left: 3px solid #0f0; padding-left: 10px;">`;
            html += `<div style="color: #ff0; margin-bottom: 5px;">${i + 1}. ${(q.question || '').substring(0, 70)}</div>`;
            
            if (q.options && q.options.length > 0) {
                q.options.forEach((opt, j) => {
                    let isCorrect = (j === q.correct);
                    html += `<div style="margin-left: 15px; color: ${isCorrect ? '#0f0' : '#999'};">`;
                    html += isCorrect ? '✓ ' : '○ ';
                    html += `${String.fromCharCode(65 + j)}. ${opt || 'Kosong'}`;
                    if (isCorrect) html += ' ⬅️ JAWABAN';
                    html += '</div>';
                });
            } else {
                html += `<div style="margin-left: 15px; color: #f00;">Tidak ada opsi</div>`;
            }
            html += '</div>';
        });
        
        content.innerHTML = html;
        document.getElementById('wg-status').innerText = 'UPDATED';
        setTimeout(() => document.getElementById('wg-status').innerText = 'READY', 1000);
    }
    
    // ==================== AUTO ANSWER (FIX) ====================
    function startAutoAnswer() {
        if (state.answers.length === 0) {
            alert('Belum ada jawaban! Klik JAWABAN dulu.');
            return;
        }
        
        if (state.autoInterval) clearInterval(state.autoInterval);
        
        state.autoInterval = setInterval(() => {
            try {
                let options = document.querySelectorAll(
                    'input[type="radio"]:not([disabled]), .option:not(.disabled), button.answer:not([disabled])'
                );
                
                if (options.length === 0) return;
                
                let questionText = document.querySelector(
                    '.question, [data-question], .soal, h2, h3, .quiz-question'
                )?.innerText || '';
                
                if (!questionText) return;
                
                for (let i = 0; i < state.answers.length; i++) {
                    let q = state.answers[i];
                    let qText = q.question || '';
                    
                    if (questionText.includes(qText.substring(0, 40)) || 
                        qText.includes(questionText.substring(0, 40))) {
                        
                        let correctIdx = q.correct;
                        
                        if (correctIdx >= 0 && correctIdx < options.length) {
                            let delay = Math.floor(Math.random() * 3000) + 2000; // 2-5 detik
                            
                            setTimeout(() => {
                                if (!state.isActive) return;
                                
                                // Klik opsi yang benar
                                options[correctIdx].click();
                                options[correctIdx].dispatchEvent(new Event('change', { bubbles: true }));
                                options[correctIdx].dispatchEvent(new Event('click', { bubbles: true }));
                                
                                // Untuk radio button
                                if (options[correctIdx].type === 'radio') {
                                    options[correctIdx].checked = true;
                                }
                                
                                document.getElementById('wg-status').innerText = `JAWAB ${String.fromCharCode(65 + correctIdx)}`;
                            }, delay);
                        }
                        break;
                    }
                }
            } catch (e) {}
        }, 4000);
        
        document.getElementById('wg-content').innerHTML = '<div style="color: #0f0; text-align: center;">✅ AUTO ANSWER DIMULAI (2-5 DETIK)</div>';
    }
    
    // ==================== HIGHLIGHT (FIX) ====================
    function startHighlight() {
        if (state.highlightInterval) clearInterval(state.highlightInterval);
        
        state.highlightInterval = setInterval(() => {
            try {
                state.answers.forEach(q => {
                    if (q.correct >= 0) {
                        let options = document.querySelectorAll(
                            'input[type="radio"], .option, [data-option], .answer-choice'
                        );
                        
                        if (options[q.correct]) {
                            options[q.correct].classList.add('wg-final-highlight');
                            
                            let parent = options[q.correct].closest('label, div, li');
                            if (parent) parent.classList.add('wg-final-highlight');
                        }
                    }
                });
            } catch (e) {}
        }, 2000);
        
        document.getElementById('wg-content').innerHTML = '<div style="color: #0f0; text-align: center;">✨ HIGHLIGHT AKTIF</div>';
    }
    
    // ==================== BYPASS (FIX) ====================
    function enableBypass() {
        Object.defineProperty(document, 'hidden', { value: false });
        Object.defineProperty(document, 'visibilityState', { value: 'visible' });
        
        // Override event listeners
        let originalAdd = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type === 'visibilitychange' || type === 'blur' || type === 'pagehide') {
                return;
            }
            return originalAdd.call(this, type, listener, options);
        };
        
        document.getElementById('wg-content').innerHTML = '<div style="color: #0f0; text-align: center;">🛡️ ANTI DETEKSI AKTIF</div>';
    }
    
    // ==================== EXTRACT (FIX) ====================
    function extractJSON() {
        let json = JSON.stringify(state.answers, null, 2);
        document.getElementById('wg-content').innerHTML = `<pre style="font-size: 10px; color: #0f0;">${json.substring(0, 800)}${json.length > 800 ? '...' : ''}</pre>`;
        
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(json).then(() => {
                alert('JSON copied to clipboard!');
            }).catch(() => {});
        }
    }
    
    // ==================== EVENT LISTENERS ====================
    document.getElementById('wg-close').onclick = () => {
        panel.remove();
        state.panelVisible = false;
    };
    
    document.getElementById('wg-minimize').onclick = () => {
        panel.style.display = 'none';
        state.panelVisible = false;
    };
    
    document.getElementById('btn-hide').onclick = () => {
        panel.style.display = 'none';
        state.panelVisible = false;
    };
    
    document.getElementById('btn-answers').onclick = updateContent;
    document.getElementById('btn-refresh').onclick = updateContent;
    
    document.getElementById('btn-auto').onclick = startAutoAnswer;
    
    document.getElementById('btn-stop').onclick = () => {
        if (state.autoInterval) {
            clearInterval(state.autoInterval);
            state.autoInterval = null;
        }
        document.getElementById('wg-content').innerHTML = '<div style="color: #f00; text-align: center;">⏹️ AUTO ANSWER STOP</div>';
    };
    
    document.getElementById('btn-highlight').onclick = startHighlight;
    
    document.getElementById('btn-bypass').onclick = enableBypass;
    
    document.getElementById('btn-extract').onclick = extractJSON;
    
    // PIN JOIN - SUDAH DIPERBAIKI
    document.getElementById('wg-join').onclick = () => {
        let pin = document.getElementById('wg-pin').value.trim();
        joinGame(pin);
    };
    
    document.getElementById('wg-pin').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            let pin = e.target.value.trim();
            joinGame(pin);
        }
    });
    
    // ==================== HIDDEN TRIGGER ====================
    let clickCount = 0;
    document.addEventListener('click', (e) => {
        if (e.clientX < 50 && e.clientY < 50) {
            clickCount++;
            if (clickCount >= 3) {
                panel.style.display = 'block';
                state.panelVisible = true;
               .wg-btn {
                background: #333;
                color: #0f0;
                border: 1px solid #0f0;
                border-radius: 4px;
                padding: 6px 8px;
                font-size: 12px;
                cursor: pointer;
                flex: 1 0 auto;
                font-family: monospace;
            }
            .wg-btn:hover {
                background: #0f0;
                color: #000;
            }
            .wg-highlight {
                border: 3px solid #0f0 !important;
                background: rgba(0,255,0,0.2) !important;
                animation: pulse 1s infinite;
            }
            @keyframes pulse {
                0% { box-shadow: 0 0 5px #0f0; }
                50% { box-shadow: 0 0 15px #0f0; }
                100% { box-shadow: 0 0 5px #0f0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(panel);

        // Posisi awal
        panel.style.position = 'fixed';
        panel.style.top = CONFIG.floating.defaultPosition.top + 'px';
        panel.style.left = CONFIG.floating.defaultPosition.left + 'px';
        panel.style.zIndex = 999999;
        panel.style.cursor = 'default';

        // ==================== DRAG DROP ====================
        const handle = document.getElementById('wg-drag-handle');
        handle.addEventListener('mousedown', (e) => {
            state.isDragging = true;
            const rect = panel.getBoundingClientRect();
            state.dragOffset.x = e.clientX - rect.left;
            state.dragOffset.y = e.clientY - rect.top;
            panel.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!state.isDragging) return;
            panel.style.left = (e.clientX - state.dragOffset.x) + 'px';
            panel.style.top = (e.clientY - state.dragOffset.y) + 'px';
        });

        document.addEventListener('mouseup', () => {
            state.isDragging = false;
            panel.style.transition = '';
        });

        // Touch support
        handle.addEventListener('touchstart', (e) => {
            state.isDragging = true;
            const touch = e.touches[0];
            const rect = panel.getBoundingClientRect();
            state.dragOffset.x = touch.clientX - rect.left;
            state.dragOffset.y = touch.clientY - rect.top;
        });

        document.addEventListener('touchmove', (e) => {
            if (!state.isDragging) return;
            const touch = e.touches[0];
            panel.style.left = (touch.clientX - state.dragOffset.x) + 'px';
            panel.style.top = (touch.clientY - state.dragOffset.y) + 'px';
        });

        document.addEventListener('touchend', () => {
            state.isDragging = false;
        });

        // ==================== TOMBOL ====================
        document.getElementById('wg-close').onclick = () => {
            panel.remove();
            state.panelVisible = false;
        };

        document.getElementById('wg-minimize').onclick = () => {
            panel.style.display = 'none';
            state.panelVisible = false;
        };

        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.onclick = (e) => handleAction(e.target.dataset.action);
        });

        document.getElementById('wg-join').onclick = () => {
            const pin = document.getElementById('wg-pin').value;
            if (!pin) return;
            document.querySelectorAll('input[type="text"], input[type="number"]').forEach(i => {
                i.value = pin;
                i.dispatchEvent(new Event('input', { bubbles: true }));
            });
            setTimeout(() => {
                document.querySelector('button[type="submit"], .join-btn')?.click();
            }, 500);
        };

        state.panelVisible = true;
        updateContent();
    }

    // ==================== FUNGSI UTAMA ====================
    function extractAnswers() {
        let result = [];
        try {
            if (window._questions) {
                result = window._questions.map(q => ({
                    q: q.text || q.question || '',
                    o: q.options || q.answers || [],
                    c: q.correct || q.correctOption || 0
                }));
            } else if (window.quizData?.questions) {
                result = window.quizData.questions.map(q => ({
                    q: q.text || q.question || '',
                    o: q.options || q.answers || [],
                    c: q.correct || q.correctOption || 0
                }));
            } else if (window.gameData?.questions) {
                result = window.gameData.questions.map(q => ({
                    q: q.q || q.text || '',
                    o: q.ops || q.options || [],
                    c: q.c || q.correct || 0
                }));
            } else {
                document.querySelectorAll('.question, [data-question], .soal').forEach((el, i) => {
                    let qText = el.innerText || 'Soal ' + (i + 1);
                    let opts = [];
                    let correct = -1;
                    el.querySelectorAll('input[type="radio"] + label, .option, [data-option]').forEach((opt, idx) => {
                        opts.push(opt.innerText || 'Opsi ' + (idx + 1));
                        if (opt.classList.contains('correct') || opt.dataset.correct === 'true' || opt.checked) correct = idx;
                    });
                    result.push({ q: qText, o: opts, c: correct });
                });
            }
        } catch (e) {}
        return result;
    }

    function updateContent() {
        const content = document.getElementById('wg-content');
        const countSpan = document.getElementById('wg-count');
        if (!content) return;

        const ans = extractAnswers();
        state.answers = ans;
        if (countSpan) countSpan.innerText = ans.length;

        if (ans.length === 0) {
            content.innerHTML = '<div style="color: red; text-align: center;">⏳ Mencari soal...</div>';
            return;
        }

        let html = '';
        ans.forEach((q, i) => {
            html += `<div style="margin-bottom: 10px; border-left: 2px solid #0f0; padding-left: 8px;">`;
            html += `<div style="color: #ff0;">${i + 1}. ${(q.q || '').substring(0, 50)}</div>`;
            if (q.o) {
                q.o.forEach((opt, j) => {
                    const correct = (j === q.c);
                    html += `<div style="margin-left: 10px; color: ${correct ? '#0f0' : '#999'};">`;
                    html += correct ? '✓ ' : '○ ';
                    html += `${String.fromCharCode(65 + j)}. ${opt}`;
                    if (correct) html += ' ⬅️';
                    html += '</div>';
                });
            }
            html += '</div>';
        });
        content.innerHTML = html;
    }

    function startAutoAnswer() {
        if (!state.answers.length) return alert('Tidak ada jawaban.');
        if (state.autoInterval) clearInterval(state.autoInterval);
        state.autoInterval = setInterval(() => {
            try {
                const opts = document.querySelectorAll('input[type="radio"]:not([disabled]), .option:not(.disabled)');
                if (!opts.length) return;
                const qText = document.querySelector('.question, [data-question], .soal, h2')?.innerText || '';
                for (let i = 0; i < state.answers.length; i++) {
                    if (qText.includes((state.answers[i].q || '').substring(0, 30))) {
                        const c = state.answers[i].c;
                        if (c >= 0 && c < opts.length) {
                            setTimeout(() => {
                                opts[c].click();
                                opts[c].dispatchEvent(new Event('change', { bubbles: true }));
                            }, 2000 + Math.random() * 3000);
                        }
                        break;
                    }
                }
            } catch (e) {}
        }, 4000);
        document.getElementById('wg-content').innerHTML = '<div style="color: #0f0;">✅ AUTO ANSWER ON</div>';
    }

    function startHighlight() {
        if (state.highlightInterval) clearInterval(state.highlightInterval);
        state.highlightInterval = setInterval(() => {
            state.answers.forEach(q => {
                if (q.c >= 0) {
                    const opts = document.querySelectorAll('input[type="radio"], .option');
                    if (opts[q.c]) opts[q.c].classList.add('wg-highlight');
                }
            });
        }, 2000);
        document.getElementById('wg-content').innerHTML = '<div style="color: #0f0;">✨ HIGHLIGHT ON</div>';
    }

    function handleAction(action) {
        switch (action) {
            case 'answers': updateContent(); break;
            case 'auto': startAutoAnswer(); break;
            case 'stop':
                if (state.autoInterval) clearInterval(state.autoInterval);
                document.getElementById('wg-content').innerHTML = '<div style="color: #f00;">⏹️ AUTO STOP</div>';
                break;
            case 'highlight': startHighlight(); break;
            case 'bypass':
                Object.defineProperty(document, 'hidden', { value: false });
                document.getElementById('wg-content').innerHTML = '<div style="color: #0f0;">🛡️ BYPASS ON</div>';
                break;
            case 'extract':
                const json = JSON.stringify(state.answers, null, 2);
                document.getElementById('wg-content').innerHTML = '<pre>' + json.substring(0, 500) + '...</pre>';
                navigator.clipboard?.writeText(json);
                break;
            case 'refresh': updateContent(); break;
            case 'hide':
                document.getElementById('wg-premium-panel').style.display = 'none';
                state.panelVisible = false;
                break;
        }
    }

    // ==================== HIDDEN TRIGGER ====================
    document.addEventListener('click', (e) => {
        if (e.clientX < 50 && e.clientY < 50) {
            state.cornerClick++;
            if (state.cornerClick >= 3) {
                const panel = document.getElementById('wg-premium-panel');
                if (panel) {
                    panel.style.display = 'block';
                    state.panelVisible = true;
                } else {
                    createFloatingPanel();
                }
                state.cornerClick = 0;
            }
            setTimeout(() => state.cornerClick = 0, 3000);
        }
    });

    // ==================== INIT ====================
    setTimeout(() => {
        createFloatingPanel();
        setInterval(() => {
            if (state.panelVisible) {
                const ans = extractAnswers();
                if (ans.length > state.answers.length) updateContent();
            }
        }, 3000);
    }, 1500);

})();
