// =====================================================
// WAYGROUND ULTIMATE TOOLS - FULL EDITION v5.0
// =====================================================
// Author: Colin (Plane Crash Survivor)
// Fitur: Auto answer, anti detection, hidden triggers, PIN joiner
// =====================================================

(function() {
    'use strict';
    
    // ==================== KONFIGURASI ====================
    const CONFIG = {
        debug: false,
        autoAnswer: true,
        antiDetect: true,
        highlightCorrect: true,
        answerDelay: { min: 2000, max: 5000 },
        theme: 'dark',
        version: '5.0'
    };
    
    // ==================== STATE ====================
    const state = {
        answers: [],
        panelVisible: false,
        autoInterval: null,
        highlightInterval: null,
        isActive: true,
        clickCount: 0,
        keyBuffer: '',
        gamePin: '',
        extractedCount: 0
    };
    
    // ==================== UTILITY ====================
    function log(msg, type = 'info') {
        if (!CONFIG.debug && type !== 'user') return;
        const styles = {
            info: 'color: cyan',
            success: 'color: lime; font-weight: bold',
            error: 'color: red',
            user: 'color: yellow; font-size: 12px'
        };
        console.log(`%c[Wayground] ${msg}`, styles[type] || styles.info);
    }
    
    function randomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // ==================== ANTI DETECTION ====================
    function antiDetection() {
        if (!CONFIG.antiDetect || !state.isActive) return;
        
        log('Mengaktifkan anti-detection...', 'info');
        
        // Bypass tab switch detection
        try {
            Object.defineProperty(document, 'hidden', { value: false, configurable: false });
            Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: false });
        } catch (e) {}
        
        // Block visibility change events
        window.addEventListener('visibilitychange', function(e) {
            e.stopImmediatePropagation();
            return false;
        }, true);
        
        window.addEventListener('blur', function(e) {
            e.stopImmediatePropagation();
            return false;
        }, true);
        
        // Fake mouse movement
        setInterval(() => {
            if (Math.random() > 0.7 && state.isActive) {
                const moveEvent = new MouseEvent('mousemove', {
                    clientX: Math.random() * window.innerWidth,
                    clientY: Math.random() * window.innerHeight
                });
                document.dispatchEvent(moveEvent);
            }
        }, 10000);
        
        // Override console if not debug
        if (!CONFIG.debug) {
            const noop = () => {};
            ['log', 'warn', 'error', 'info', 'debug'].forEach(m => console[m] = noop);
        }
        
        log('Anti-detection aktif!', 'success');
    }
    
    // ==================== EKSTRAK JAWABAN (5 METODE) ====================
    function extractAnswers() {
        let answers = [];
        
        try {
            // METHOD 1: Dari window._questions
            if (window._questions && Array.isArray(window._questions)) {
                answers = window._questions.map(q => ({
                    question: q.text || q.question || q.title || '',
                    options: q.options || q.answers || [],
                    correct: q.correct || q.correctOption || q.correctAnswer || 0
                }));
                log(`Method 1: ${answers.length} soal dari _questions`, 'success');
            }
            
            // METHOD 2: Dari window.quizData
            else if (window.quizData && window.quizData.questions) {
                answers = window.quizData.questions.map(q => ({
                    question: q.text || q.question || '',
                    options: q.options || q.answers || [],
                    correct: q.correct || q.correctOption || 0
                }));
                log(`Method 2: ${answers.length} soal dari quizData`, 'success');
            }
            
            // METHOD 3: Dari window.gameData
            else if (window.gameData && window.gameData.questions) {
                answers = window.gameData.questions.map(q => ({
                    question: q.q || q.text || q.question || '',
                    options: q.ops || q.options || q.answers || [],
                    correct: q.c || q.correct || q.correctOption || 0
                }));
                log(`Method 3: ${answers.length} soal dari gameData`, 'success');
            }
            
            // METHOD 4: Dari DOM (jika di atas tidak ada)
            if (answers.length === 0) {
                const questionElements = document.querySelectorAll(
                    '.question, [data-question], .soal, .quiz-question, .question-text, h2, h3'
                );
                
                questionElements.forEach((q, index) => {
                    const questionText = q.innerText || q.textContent || `Soal ${index + 1}`;
                    const options = [];
                    let correctIndex = -1;
                    
                    // Cari opsi dalam elemen yang sama atau setelahnya
                    const optionElements = q.parentElement?.querySelectorAll(
                        'input[type="radio"] + label, .option, [data-option], .answer-choice, .quiz-option'
                    ) || [];
                    
                    optionElements.forEach((opt, optIndex) => {
                        options.push(opt.innerText || opt.textContent || `Opsi ${optIndex + 1}`);
                        
                        // Deteksi jawaban benar
                        const radio = opt.querySelector('input[type="radio"]') || opt.previousElementSibling;
                        if (radio && radio.checked) correctIndex = optIndex;
                        if (opt.classList.contains('correct')) correctIndex = optIndex;
                        if (opt.dataset.correct === 'true') correctIndex = optIndex;
                    });
                    
                    answers.push({
                        question: questionText,
                        options: options,
                        correct: correctIndex
                    });
                });
                
                if (answers.length > 0) {
                    log(`Method 4: ${answers.length} soal dari DOM`, 'success');
                }
            }
            
            // METHOD 5: Network intercept untuk jawaban realtime
            if (answers.length === 0) {
                const originalFetch = window.fetch;
                window.fetch = function(...args) {
                    return originalFetch.apply(this, args).then(response => {
                        if (typeof args[0] === 'string' && args[0].includes('wayground')) {
                            response.clone().json().then(data => {
                                if (data && (data.questions || data.data || data.answers)) {
                                    const qs = data.questions || data.data || data.answers;
                                    if (Array.isArray(qs) && qs.length > 0) {
                                        const newAnswers = qs.map(q => ({
                                            question: q.text || q.question || q.title || '',
                                            options: q.options || q.answers || q.choices || [],
                                            correct: q.correct || q.correctOption || q.answer || 0
                                        }));
                                        
                                        if (newAnswers.length > answers.length) {
                                            answers = newAnswers;
                                            state.answers = answers;
                                            log(`Method 5: ${answers.length} soal dari network`, 'success');
                                            if (state.panelVisible) updatePanel();
                                        }
                                    }
                                }
                            }).catch(() => {});
                        }
                        return response;
                    });
                };
            }
            
        } catch (e) {
            log('Extract error: ' + e.message, 'error');
        }
        
        state.answers = answers;
        state.extractedCount = answers.length;
        return answers;
    }
    
    // ==================== JOIN GAME DENGAN PIN ====================
    function joinGame(pin) {
        if (!pin) return;
        
        log(`Mencoba join dengan PIN: ${pin}`, 'info');
        state.gamePin = pin;
        
        // Cari input PIN
        const pinInputs = document.querySelectorAll(
            'input[type="text"], input[type="number"], .pin-input, .game-pin, [placeholder*="PIN"], [placeholder*="code"]'
        );
        
        pinInputs.forEach(input => {
            input.value = pin;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        
        // Cari tombol join
        setTimeout(() => {
            const joinButtons = document.querySelectorAll(
                'button[type="submit"], .join-btn, .submit-btn, button:contains("Join"), button:contains("Masuk"), button:contains("Play")'
            );
            
            joinButtons.forEach(btn => {
                if (btn.innerText.toLowerCase().includes('join') || 
                    btn.innerText.toLowerCase().includes('masuk') ||
                    btn.innerText.toLowerCase().includes('play')) {
                    btn.click();
                    log('Tombol join diklik!', 'success');
                }
            });
        }, 500);
    }
    
    // ==================== AUTO ANSWER ====================
    function startAutoAnswer(answers) {
        if (!answers || answers.length === 0) {
            alert('Belum ada jawaban! Tunggu soal muncul.');
            return;
        }
        
        if (state.autoInterval) clearInterval(state.autoInterval);
        
        log('Memulai auto answer...', 'success');
        
        state.autoInterval = setInterval(() => {
            try {
                if (!state.isActive) return;
                
                // Cari semua opsi yang tersedia
                const options = document.querySelectorAll(
                    'input[type="radio"]:not([disabled]), .option:not(.disabled), button.answer:not([disabled]), [data-option]:not([disabled])'
                );
                
                if (options.length === 0) return;
                
                // Cari teks soal yang aktif
                const questionText = document.querySelector(
                    '.question, [data-question], .soal, h2, h3, .quiz-question, .question-text'
                )?.innerText || '';
                
                if (!questionText) return;
                
                // Cocokkan dengan database jawaban
                for (let i = 0; i < answers.length; i++) {
                    const q = answers[i];
                    const qText = q.question || '';
                    
                    // Partial matching
                    if (questionText.includes(qText.substring(0, 40)) || 
                        qText.includes(questionText.substring(0, 40))) {
                        
                        const correctIdx = q.correct;
                        
                        if (correctIdx >= 0 && correctIdx < options.length) {
                            const delay = randomDelay(CONFIG.answerDelay.min, CONFIG.answerDelay.max);
                            
                            setTimeout(() => {
                                if (!state.isActive) return;
                                
                                // Klik opsi yang benar
                                options[correctIdx].click();
                                
                                // Trigger events
                                options[correctIdx].dispatchEvent(new Event('change', { bubbles: true }));
                                options[correctIdx].dispatchEvent(new Event('click', { bubbles: true }));
                                
                                log(`✅ Auto menjawab soal ${i+1} dengan opsi ${String.fromCharCode(65 + correctIdx)}`, 'user');
                            }, delay);
                            
                            break;
                        }
                    }
                }
            } catch (e) {
                log('Auto answer error: ' + e.message, 'error');
            }
        }, 4000);
    }
    
    // ==================== HIGHLIGHT JAWABAN ====================
    function startHighlight(answers) {
        if (state.highlightInterval) clearInterval(state.highlightInterval);
        
        state.highlightInterval = setInterval(() => {
            try {
                if (!state.isActive) return;
                
                answers.forEach(q => {
                    if (q.correct >= 0) {
                        const options = document.querySelectorAll(
                            'input[type="radio"], .option, [data-option], .answer-choice'
                        );
                        
                        if (options[q.correct]) {
                            options[q.correct].classList.add('wg-highlight');
                            
                            // Highlight parent juga
                            const parent = options[q.correct].closest('label, div, li');
                            if (parent) parent.classList.add('wg-highlight');
                        }
                    }
                });
            } catch (e) {}
        }, 2000);
    }
    
    // ==================== CREATE PANEL UI ====================
    function createPanel() {
        if (document.getElementById('wg-panel')) {
            document.getElementById('wg-panel').style.display = 'block';
            state.panelVisible = true;
            updatePanel();
            return;
        }
        
        const panel = document.createElement('div');
        panel.id = 'wg-panel';
        panel.innerHTML = `
            <div style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:500px; max-width:95%; max-height:85vh; overflow-y:auto; background:#0a0a0a; border:4px solid #00ff00; border-radius:20px; padding:20px; color:#00ff00; font-family:'Courier New', monospace; z-index:999999; box-shadow:0 0 40px rgba(0,255,0,0.8);">
                
                <!-- HEADER -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:10px;">
                    <span style="color:#ffff00; font-weight:bold; font-size:24px;">🎯 WAYGROUND ULTIMATE v${CONFIG.version}</span>
                    <div>
                        <span id="wg-status" style="background:#0f0; color:#000; padding:3px 10px; border-radius:20px; margin-right:10px; font-size:12px;">ON</span>
                        <button id="wg-minimize" style="background:#333; color:#0f0; border:1px solid #0f0; border-radius:5px; margin-right:5px; cursor:pointer; padding:5px 10px;">🗕</button>
                        <button id="wg-close" style="background:#f00; color:#fff; border:none; border-radius:5px; cursor:pointer; padding:5px 10px;">✖</button>
                    </div>
                </div>
                
                <!-- PIN INPUT -->
                <div style="margin-bottom:15px; background:#1a1a1a; padding:10px; border-radius:8px;">
                    <div style="display:flex; gap:5px;">
                        <input id="wg-pin-input" type="text" placeholder="Masukkan PIN Game" style="flex:3; background:#000; color:#0f0; border:1px solid #0f0; border-radius:5px; padding:10px; font-family:monospace; font-size:14px;">
                        <button id="wg-join-btn" style="flex:1; background:#333; color:#0f0; border:1px solid #0f0; border-radius:5px; padding:10px; cursor:pointer; font-weight:bold;">JOIN</button>
                    </div>
                </div>
                
                <!-- BUTTONS ROW 1 -->
                <div style="display:flex; gap:5px; margin-bottom:10px; flex-wrap:wrap;">
                    <button class="wg-btn" data-action="toggle" style="background:#f00; color:#fff;">🔴 OFF</button>
                    <button class="wg-btn" data-action="answers">📋 JAWABAN</button>
                    <button class="wg-btn" data-action="auto">🤖 AUTO</button>
                    <button class="wg-btn" data-action="stop">⏹️ STOP</button>
                </div>
                
                <!-- BUTTONS ROW 2 -->
                <div style="display:flex; gap:5px; margin-bottom:15px; flex-wrap:wrap;">
                    <button class="wg-btn" data-action="highlight">✨ HIGHLIGHT</button>
                    <button class="wg-btn" data-action="bypass">🛡️ BYPASS</button>
                    <button class="wg-btn" data-action="extract">📤 EXTRACT</button>
                    <button class="wg-btn" data-action="refresh">🔄 REFRESH</button>
                    <button class="wg-btn" data-action="hide">👻 HIDE</button>
                </div>
                
                <!-- CONTENT AREA -->
                <div id="wg-content" style="background:#000; padding:15px; border-radius:8px; min-height:250px; max-height:350px; overflow-y:auto; font-size:14px; line-height:1.5;"></div>
                
                <!-- FOOTER -->
                <div style="margin-top:15px; font-size:11px; color:#666; text-align:center; border-top:1px solid #333; padding-top:10px;">
                    <span>👆 Klik pojok kiri atas 5x | ⌨️ Ketik "show" | 🔴 OFF matikan semua</span>
                    <div style="margin-top:5px;">Status: <span id="wg-status-text">Aktif</span> | Soal: <span id="wg-count">0</span></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add styles
        const style = document.createElement('style');
        style.innerHTML = `
            .wg-btn {
                background: #333;
                color: #0f0;
                border: 1px solid #0f0;
                border-radius: 5px;
                padding: 8px 12px;
                margin: 2px;
                cursor: pointer;
                flex: 1 0 auto;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                font-weight: bold;
                transition: all 0.2s;
            }
            .wg-btn:hover {
                background: #0f0;
                color: #000;
                transform: scale(1.02);
            }
            .wg-highlight {
                border: 3px solid #00ff00 !important;
                background-color: rgba(0, 255, 0, 0.2) !important;
                animation: wg-pulse 1.5s infinite !important;
            }
            @keyframes wg-pulse {
                0% { box-shadow: 0 0 5px #0f0; }
                50% { box-shadow: 0 0 25px #0f0; }
                100% { box-shadow: 0 0 5px #0f0; }
            }
            #wg-content::-webkit-scrollbar {
                width: 8px;
            }
            #wg-content::-webkit-scrollbar-track {
                background: #1a1a1a;
            }
            #wg-content::-webkit-scrollbar-thumb {
                background: #0f0;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
        
       
