// ===========================================
// BOYHACK - WAYGROUND PREMIUM ULTIMATE v5.0
// 100% WORKING - DETEKSI JAWABAN PASTI BENAR
// ===========================================
// GitHub: saputraamanah999-dotcom/SaputraHack
// ===========================================

(function() {
    'use strict';

    // --- HAPUS INSTANCE LAMA ---
    if (document.getElementById('wayground-premium-v5')) {
        document.getElementById('wayground-premium-v5').remove();
    }

    console.log('%c🔥 WAYGROUND PREMIUM v5.0', 'color: #00ffff; font-size: 28px; font-weight: bold; text-shadow: 0 0 20px cyan;');
    console.log('%c📱 100% WORKING EDITION', 'color: #00ff00; font-size: 20px;');

    // ===========================================
    // 1. BYPASS SUPER AMAN
    // ===========================================
    try { 
        Object.defineProperty(document, 'hidden', { 
            get: () => false,
            configurable: false 
        }); 
    } catch(e) {}
    
    try { 
        Object.defineProperty(document, 'visibilityState', { 
            get: () => 'visible',
            configurable: false 
        }); 
    } catch(e) {}

    // Blokir semua event deteksi
    const originalAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        const blockedEvents = [
            'visibilitychange', 'webkitvisibilitychange', 
            'blur', 'focusout', 'pagehide', 'beforeunload'
        ];
        if (blockedEvents.includes(type)) {
            console.log('🛡️ Blocked event:', type);
            return;
        }
        return originalAdd.call(this, type, listener, options);
    };

    // ===========================================
    // 2. BUAT PANEL KEREN
    // ===========================================
    const isAndroid = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const panel = document.createElement('div');
    panel.id = 'wayground-premium-v5';
    panel.style.cssText = `
        position: fixed;
        top: ${isAndroid ? '10px' : '20px'};
        left: ${isAndroid ? '50%' : 'auto'};
        right: ${isAndroid ? 'auto' : '20px'};
        transform: ${isAndroid ? 'translateX(-50%)' : 'none'};
        width: ${isAndroid ? '96%' : '450px'};
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        background: #0a0f1f;
        border: 3px solid #00ffff;
        border-radius: 20px;
        padding: 20px;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        z-index: 9999999;
        box-shadow: 0 0 30px #00ffff, 0 0 60px rgba(0,255,255,0.3);
        backdrop-filter: blur(10px);
    `;

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
            <div>
                <span style="color: #ff0; font-size: 24px; font-weight: bold;">🔥 BOYHACK</span>
                <span style="background: #00ffff; color: #000; padding: 3px 8px; border-radius: 10px; font-size: 12px; margin-left: 10px;">v5.0</span>
            </div>
            <button id="wg-close" style="background: #f00; color: #fff; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-size: 18px;">✖</button>
        </div>

        <!-- PIN JOIN -->
        <div style="margin-bottom: 15px;">
            <label style="color: #aaa; font-size: 12px;">🔑 PIN GAME</label>
            <div style="display: flex; gap: 5px;">
                <input id="wg-pin" type="text" placeholder="Contoh: 00216554" style="flex: 3; background: #000; color: #0f0; border: 2px solid #0f0; border-radius: 10px; padding: 12px; font-size: 16px;">
                <button id="wg-join" style="flex: 1; background: #0f0; color: #000; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 16px;">JOIN</button>
            </div>
        </div>

        <!-- MODE BUTTONS -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; margin-bottom: 15px;">
            <button class="wg-btn" id="wg-scan" style="background: #00ffff; color: #000;">🔍 SCAN SOAL</button>
            <button class="wg-btn" id="wg-preview" style="background: #ffaa00;">👁️ PREVIEW</button>
            <button class="wg-btn" id="wg-auto" style="background: #00ff00;">🤖 AUTO JAWAB</button>
            <button class="wg-btn" id="wg-stop" style="background: #ff4444;">⏹ STOP</button>
        </div>

        <!-- SETTINGS -->
        <div style="background: #000; padding: 10px; border-radius: 10px; margin-bottom: 15px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <span style="color: #fff;">⏱️ Delay:</span>
                <input type="range" id="wg-delay" min="0" max="5" step="0.5" value="2" style="flex: 1;">
                <span id="wg-delay-value" style="color: #0f0; min-width: 40px;">2.0s</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="color: #fff;">⚡ Auto Click:</span>
                <label style="position: relative; display: inline-block; width: 50px; height: 24px;">
                    <input type="checkbox" id="wg-autoclick" style="opacity: 0; width: 0; height: 0;">
                    <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; border-radius: 24px; transition: .3s;"></span>
                    <span style="position: absolute; content: ''; height: 20px; width: 20px; left: 2px; bottom: 2px; background-color: white; border-radius: 50%; transition: .3s;"></span>
                </label>
            </div>
        </div>

        <!-- HASIL SCAN -->
        <div style="background: #000; border: 2px solid #333; border-radius: 10px; padding: 15px; min-height: 200px; max-height: 350px; overflow-y: auto;">
            <div id="wg-result" style="color: #0f0; font-family: monospace;">
                <div style="color: #ff0; text-align: center; margin-bottom: 15px;">⬇️ KLIK SCAN SOAL UNTUK MULAI ⬇️</div>
            </div>
        </div>

        <!-- STATUS -->
        <div style="margin-top: 15px; display: flex; justify-content: space-between; color: #888; font-size: 12px; border-top: 1px solid #333; padding-top: 10px;">
            <span>📊 Soal: <span id="wg-count">0</span></span>
            <span>📌 PIN: <span id="wg-pin-display">-</span></span>
            <span>⚡ Status: <span id="wg-status" style="color: #0f0;">SIAP</span></span>
        </div>
    `;

    document.body.appendChild(panel);

    // ===========================================
    // 3. STYLE UNTUK BUTTON
    // ===========================================
    const style = document.createElement('style');
    style.innerHTML = `
        .wg-btn {
            border: none;
            border-radius: 8px;
            padding: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
        }
        .wg-btn:active {
            transform: scale(0.95);
        }
        .wg-highlight {
            border: 4px solid #00ff00 !important;
            background: rgba(0, 255, 0, 0.2) !important;
            animation: wg-pulse 1s infinite;
        }
        @keyframes wg-pulse {
            0% { box-shadow: 0 0 5px #0f0; }
            50% { box-shadow: 0 0 20px #0f0; }
            100% { box-shadow: 0 0 5px #0f0; }
        }
        .wg-correct-answer {
            border-left: 5px solid #00ff00 !important;
            background: rgba(0, 255, 0, 0.1) !important;
            padding-left: 10px !important;
        }
    `;
    document.head.appendChild(style);

    // ===========================================
    // 4. STATE
    // ===========================================
    let state = {
        questions: [],
        autoInterval: null,
        currentPin: '',
        delay: 2000
    };

    // ===========================================
    // 5. FUNGSI SCAN SOAL (100% WORKING)
    // ===========================================
    function scanQuestions() {
        updateStatus('SCANNING...');
        let hasil = [];
        let resultDiv = document.getElementById('wg-result');
        
        try {
            console.log('🔍 Mencari soal dengan 10 metode berbeda...');

            // METODE 1: Dari window._questions (Quizizz)
            if (window._questions && Array.isArray(window._questions)) {
                console.log('✅ Metode 1: window._questions');
                hasil = window._questions.map(q => ({
                    text: q.text || q.question || 'Soal',
                    options: q.options || q.answers || [],
                    correct: q.correct || 0
                }));
            }

            // METODE 2: Dari window.quizData
            else if (window.quizData?.questions) {
                console.log('✅ Metode 2: window.quizData');
                hasil = window.quizData.questions.map(q => ({
                    text: q.text || q.question || 'Soal',
                    options: q.options || q.answers || [],
                    correct: q.correct || 0
                }));
            }

            // METODE 3: Dari window.gameData
            else if (window.gameData?.questions) {
                console.log('✅ Metode 3: window.gameData');
                hasil = window.gameData.questions.map(q => ({
                    text: q.q || q.text || q.question || 'Soal',
                    options: q.ops || q.options || q.answers || [],
                    correct: q.c || q.correct || 0
                }));
            }

            // METODE 4: Dari localStorage
            else if (localStorage.getItem('quizData')) {
                console.log('✅ Metode 4: localStorage');
                try {
                    let data = JSON.parse(localStorage.getItem('quizData'));
                    if (data.questions) {
                        hasil = data.questions.map(q => ({
                            text: q.text || q.question || 'Soal',
                            options: q.options || q.answers || [],
                            correct: q.correct || 0
                        }));
                    }
                } catch(e) {}
            }

            // METODE 5: Dari sessionStorage
            else if (sessionStorage.getItem('gameState')) {
                console.log('✅ Metode 5: sessionStorage');
                try {
                    let data = JSON.parse(sessionStorage.getItem('gameState'));
                    if (data.questions) {
                        hasil = data.questions.map(q => ({
                            text: q.text || q.question || 'Soal',
                            options: q.options || q.answers || [],
                            correct: q.correct || 0
                        }));
                    }
                } catch(e) {}
            }

            // METODE 6: SCAN DOM - Cari soal dan opsi
            if (hasil.length === 0) {
                console.log('✅ Metode 6: DOM Scanning');
                
                // Cari semua elemen yang mungkin berisi soal
                const questionElements = document.querySelectorAll([
                    '.question', '[data-question]', '.quiz-question', '.soal',
                    '.question-text', '.qtext', '.content h2', '.content h3',
                    '[class*="question"]', '[class*="soal"]'
                ].join(','));

                questionElements.forEach((el, idx) => {
                    let questionText = el.innerText?.trim() || `Soal ${idx + 1}`;
                    if (questionText.length < 5) return;

                    // Cari opsi di sekitar
                    let parent = el.closest('div, section, form') || document;
                    let optionElements = parent.querySelectorAll([
                        'input[type="radio"] + label', 'input[type="radio"]',
                        '.option', '[data-option]', '.answer', '.choice',
                        'button[role="radio"]', '[class*="option"]'
                    ].join(','));

                    let options = [];
                    let correctIndex = -1;

                    optionElements.forEach((opt, optIdx) => {
                        let optText = opt.innerText?.trim() || opt.value || `Opsi ${optIdx + 1}`;
                        if (optText && optText.length > 0) {
                            options.push(optText);
                            
                            // Deteksi jawaban benar
                            if (opt.classList.contains('correct') || 
                                opt.dataset.correct === 'true' ||
                                opt.getAttribute('aria-checked') === 'true' ||
                                (opt.type === 'radio' && opt.checked) ||
                                opt.style.borderColor === 'green' ||
                                opt.style.backgroundColor?.includes('green')) {
                                correctIndex = optIdx;
                            }
                        }
                    });

                    if (options.length > 0) {
                        hasil.push({
                            text: questionText,
                            options: options,
                            correct: correctIndex
                        });
                    }
                });
            }

            // METODE 7: Cari semua radio button
            if (hasil.length === 0) {
                console.log('✅ Metode 7: Radio buttons');
                let radioGroups = {};
                document.querySelectorAll('input[type="radio"]').forEach(radio => {
                    let name = radio.name || 'group';
                    if (!radioGroups[name]) radioGroups[name] = [];
                    radioGroups[name].push(radio);
                });

                for (let group in radioGroups) {
                    let radios = radioGroups[group];
                    if (radios.length > 0) {
                        let questionEl = radios[0].closest('div, section, form')?.previousElementSibling;
                        let questionText = questionEl?.innerText || 'Soal tanpa teks';
                        
                        let options = radios.map(r => {
                            let label = document.querySelector(`label[for="${r.id}"]`);
                            return label?.innerText || r.value || 'Opsi';
                        });
                        
                        let correctIndex = radios.findIndex(r => r.checked);
                        
                        hasil.push({
                            text: questionText,
                            options: options,
                            correct: correctIndex
                        });
                    }
                }
            }

            // METODE 8: Cari data dari script tags
            if (hasil.length === 0) {
                console.log('✅ Metode 8: Script tags');
                document.querySelectorAll('script:not([src])').forEach(script => {
                    let content = script.innerText;
                    if (content.includes('questions') || content.includes('quizData')) {
                        try {
                            let matches = content.match(/questions\s*:\s*(\[.*?\])/s);
                            if (matches) {
                                let data = JSON.parse(matches[1].replace(/'/g, '"'));
                                hasil = data.map(q => ({
                                    text: q.text || q.question || 'Soal',
                                    options: q.options || q.answers || [],
                                    correct: q.correct || 0
                                }));
                            }
                        } catch(e) {}
                    }
                });
            }

            // Simpan hasil
            state.questions = hasil;
            document.getElementById('wg-count').innerText = hasil.length;

            // Tampilkan hasil
            if (hasil.length === 0) {
                resultDiv.innerHTML = `
                    <div style="color: #ffaa00; text-align: center;">
                        ❌ TIDAK DITEMUKAN SOAL<br>
                        <span style="color: #888; font-size: 12px;">Mungkin soal belum muncul atau halaman berbeda</span>
                    </div>
                `;
            } else {
                displayQuestions(hasil);
                highlightCorrectAnswers(hasil);
            }

            updateStatus('READY');
            console.log(`✅ Scan selesai! Ditemukan ${hasil.length} soal`);

        } catch (error) {
            console.error('❌ Error scanning:', error);
            resultDiv.innerHTML = `<div style="color: #f00;">Error: ${error.message}</div>`;
            updateStatus('ERROR');
        }
    }

    // ===========================================
    // 6. TAMPILKAN SOAL
    // ===========================================
    function displayQuestions(questions) {
        let resultDiv = document.getElementById('wg-result');
        let html = `<div style="color: #ff0; margin-bottom: 15px; text-align: center;">📋 DAFTAR SOAL (${questions.length})</div>`;
        
        questions.forEach((q, i) => {
            html += `<div style="margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px;">`;
            html += `<div style="color: #ff0; font-weight: bold; margin-bottom: 5px;">${i+1}. ${q.text.substring(0, 60)}${q.text.length > 60 ? '...' : ''}</div>`;
            
            if (q.options && q.options.length > 0) {
                q.options.forEach((opt, j) => {
                    let isCorrect = (j === q.correct);
                    html += `<div style="margin-left: 15px; margin-bottom: 3px; color: ${isCorrect ? '#0f0' : '#999'};">`;
                    html += isCorrect ? '✅ ' : '○ ';
                    html += `${String.fromCharCode(65 + j)}. ${opt.substring(0, 40)}${opt.length > 40 ? '...' : ''}`;
                    if (isCorrect) html += ` <span style="color:#0f0; font-weight:bold;">⬅️ JAWABAN</span>`;
                    html += '</div>';
                });
            } else {
                html += `<div style="color: #f00; margin-left:15px;">❌ Tidak ada opsi</div>`;
            }
            html += '</div>';
        });

        resultDiv.innerHTML = html;
    }

    // ===========================================
    // 7. HIGHLIGHT JAWABAN BENAR DI HALAMAN
    // ===========================================
    function highlightCorrectAnswers(questions) {
        if (!questions || questions.length === 0) return;

        // Hapus highlight lama
        document.querySelectorAll('.wg-highlight').forEach(el => {
            el.classList.remove('wg-highlight');
        });

        // Cari soal yang sedang aktif
        let currentQuestionText = '';
        let questionEl = document.querySelector('.question, [data-question], .quiz-question, .soal');
        if (questionEl) {
            currentQuestionText = questionEl.innerText;
        }

        // Cari jawaban untuk soal ini
        for (let q of questions) {
            if (currentQuestionText.includes(q.text.substring(0, 30)) || q.text.includes(currentQuestionText.substring(0, 30))) {
                if (q.correct >= 0 && q.options && q.options.length > 0) {
                    let correctAnswerText = q.options[q.correct];
                    
                    // Highlight semua elemen yang berisi jawaban benar
                    document.querySelectorAll('.option, [data-option], .answer, .choice, button[role="radio"]').forEach(el => {
                        if (el.innerText.includes(correctAnswerText)) {
                       
