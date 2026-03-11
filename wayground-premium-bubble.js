// ===========================================
// BOYHACK QUIZIZZ - WAYGROUND PREMIUM v5.0
// ===========================================
// GitHub: saputraamanah999-dotcom/SaputraHack
// ===========================================

(function() {
    'use strict';

    // --- HAPUS INSTANCE LAMA ---
    if (document.getElementById('boyhack-quiz-panel')) {
        document.getElementById('boyhack-quiz-panel').remove();
    }

    console.log('%c🔥 BOYHACK QUIZIZZ v5.0', 'color: #00ffff; font-size: 20px; font-weight: bold;');
    console.log('%c📱 Android Mode Ready', 'color: #ffaa00; font-size: 16px;');

    // ===========================================
    // 1. BYPASS DETECTION
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

    // Blokir event visibility
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
    // 2. DETEKSI ANDROID
    // ===========================================
    const isAndroid = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // ===========================================
    // 3. BUAT PANEL UTAMA
    // ===========================================
    const panel = document.createElement('div');
    panel.id = 'boyhack-quiz-panel';
    panel.style.cssText = `
        position: fixed;
        top: ${isAndroid ? '10px' : '20px'};
        right: ${isAndroid ? '10px' : '20px'};
        width: ${isAndroid ? '96%' : '380px'};
        max-width: 400px;
        max-height: 90vh;
        overflow-y: auto;
        background: #0a0f1f;
        border: 3px solid #00ff00;
        border-radius: 15px;
        padding: 15px;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        z-index: 9999999;
        box-shadow: 0 0 30px #00ff00, 0 0 60px rgba(0,255,0,0.3);
        backdrop-filter: blur(10px);
    `;

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 8px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="color: #ffaa00; font-size: 20px; font-weight: bold;">🔥 BOYHACK</span>
                <span style="background: #00ff00; color: #000; padding: 2px 8px; border-radius: 10px; font-size: 10px;">v5.0</span>
            </div>
            <div style="display: flex; gap: 5px;">
                <span id="bh-minimize" style="background: #ffaa00; color: #000; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; border-radius: 5px; cursor: pointer; font-weight: bold;">−</span>
                <span id="bh-close" style="background: #f00; color: #fff; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; border-radius: 5px; cursor: pointer; font-weight: bold;">✖</span>
            </div>
        </div>
        
        <div id="bh-main-content">
            <!-- PIN INPUT -->
            <div style="margin-bottom: 12px;">
                <div style="display: flex; gap: 5px;">
                    <input id="bh-pin-input" type="text" placeholder="Masukkan PIN Game" style="flex: 3; background: #000; color: #0f0; border: 2px solid #0f0; border-radius: 8px; padding: 10px; font-size: 14px;">
                    <button id="bh-join-btn" style="flex: 1; background: #0f0; color: #000; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; padding: 10px;">JOIN</button>
                </div>
            </div>
            
            <!-- BUTTONS -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; margin-bottom: 12px;">
                <button id="bh-scan-btn" style="background: #00aaff; color: #fff; border: none; border-radius: 8px; padding: 10px; font-weight: bold; cursor: pointer;">🔍 SCAN SOAL</button>
                <button id="bh-answer-btn" style="background: #00ff00; color: #000; border: none; border-radius: 8px; padding: 10px; font-weight: bold; cursor: pointer;">✅ TAMPILKAN JAWABAN</button>
                <button id="bh-auto-btn" style="background: #ffaa00; color: #000; border: none; border-radius: 8px; padding: 10px; font-weight: bold; cursor: pointer;">⚡ AUTO JAWAB</button>
                <button id="bh-stop-btn" style="background: #ff4444; color: #fff; border: none; border-radius: 8px; padding: 10px; font-weight: bold; cursor: pointer;">⏹ STOP</button>
            </div>
            
            <!-- DELAY SLIDER -->
            <div style="background: #000; padding: 10px; border-radius: 8px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>⏱️ Delay Jawaban:</span>
                    <span id="bh-delay-value">2.0 detik</span>
                </div>
                <input type="range" id="bh-delay-slider" min="0" max="5" step="0.5" value="2" style="width: 100%;">
            </div>
            
            <!-- HASIL SCAN SOAL -->
            <div style="background: #000; border: 1px solid #333; border-radius: 8px; padding: 10px; max-height: 300px; overflow-y: auto; margin-bottom: 10px;">
                <div id="bh-soal-container" style="color: #0f0;">
                    <div style="color: #888; text-align: center; padding: 20px;">
                        🔍 Klik <b>SCAN SOAL</b> untuk melihat soal dan jawaban
                    </div>
                </div>
            </div>
            
            <!-- STATUS -->
            <div style="display: flex; justify-content: space-between; border-top: 1px solid #333; padding-top: 8px; color: #888; font-size: 12px;">
                <span>📊 Soal: <span id="bh-total-soal">0</span></span>
                <span>📌 PIN: <span id="bh-pin-display">-</span></span>
                <span>⚡ Status: <span id="bh-status">SIAP</span></span>
            </div>
        </div>
    `;

    document.body.appendChild(panel);

    // ===========================================
    // 4. STATE
    // ===========================================
    let state = {
        soal: [],
        autoInterval: null,
        delay: 2000,
        minimized: false
    };

    // ===========================================
    // 5. FUNGSI UPDATE STATUS
    // ===========================================
    function updateStatus(text, warna) {
        const el = document.getElementById('bh-status');
        if(el) {
            el.innerText = text;
            el.style.color = warna || '#0f0';
        }
    }

    // ===========================================
    // 6. FUNGSI UPDATE PIN
    // ===========================================
    function updatePinDisplay(pin) {
        const el = document.getElementById('bh-pin-display');
        if(el) el.innerText = pin || '-';
    }

    // ===========================================
    // 7. TOMBOL CLOSE (X)
    // ===========================================
    document.getElementById('bh-close').onclick = function() {
        if(state.autoInterval) clearInterval(state.autoInterval);
        panel.remove();
    };

    // ===========================================
    // 8. TOMBOL MINIMIZE (−)
    // ===========================================
    document.getElementById('bh-minimize').onclick = function() {
        const content = document.getElementById('bh-main-content');
        if(state.minimized) {
            content.style.display = 'block';
            this.innerHTML = '−';
            this.style.background = '#ffaa00';
        } else {
            content.style.display = 'none';
            this.innerHTML = '+';
            this.style.background = '#00ff00';
        }
        state.minimized = !state.minimized;
    };

    // ===========================================
    // 9. FUNGSI JOIN GAME
    // ===========================================
    document.getElementById('bh-join-btn').onclick = function() {
        const pin = document.getElementById('bh-pin-input').value.trim();
        if(!pin || pin.length < 3) {
            alert('❌ Masukkan PIN yang valid!');
            return;
        }

        updatePinDisplay(pin);
        updateStatus('JOINING...', '#ffaa00');

        // Isi semua input PIN
        document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
            input.value = pin;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // Klik tombol join
        setTimeout(() => {
            document.querySelectorAll('button, .btn, .button').forEach(btn => {
                const text = btn.innerText.toLowerCase();
                if(text.includes('join') || text.includes('masuk') || text.includes('play')) {
                    btn.click();
                }
            });
            updateStatus('JOINED');
        }, 500);
    };

    // ===========================================
    // 10. FUNGSI SCAN SOAL (8 METODE)
    // ===========================================
    document.getElementById('bh-scan-btn').onclick = function() {
        updateStatus('SCANNING...', '#ffaa00');
        const container = document.getElementById('bh-soal-container');
        let hasil = [];

        // METHOD 1: window._questions (Quizizz)
        if(window._questions && window._questions.length > 0) {
            hasil = window._questions.map((q, idx) => ({
                no: idx + 1,
                soal: q.structure?.query?.text || q.text || 'Soal ' + (idx+1),
                opsi: q.structure?.options?.map(o => o.text) || q.options || [],
                jawaban: q.structure?.answer || q.answer || 0
            }));
        }

        // METHOD 2: window.quizData
        else if(window.quizData && window.quizData.questions) {
            hasil = window.quizData.questions.map((q, idx) => ({
                no: idx + 1,
                soal: q.text || q.question || 'Soal ' + (idx+1),
                opsi: q.options || q.answers || [],
                jawaban: q.correct || 0
            }));
        }

        // METHOD 3: window.gameData
        else if(window.gameData && window.gameData.questions) {
            hasil = window.gameData.questions.map((q, idx) => ({
                no: idx + 1,
                soal: q.q || q.text || q.question || 'Soal ' + (idx+1),
                opsi: q.ops || q.options || q.answers || [],
                jawaban: q.c || q.correct || 0
            }));
        }

        // METHOD 4: localStorage
        else if(localStorage.getItem('quizData')) {
            try {
                const data = JSON.parse(localStorage.getItem('quizData'));
                if(data.questions) {
                    hasil = data.questions.map((q, idx) => ({
                        no: idx + 1,
                        soal: q.text || q.question || 'Soal ' + (idx+1),
                        opsi: q.options || q.answers || [],
                        jawaban: q.correct || 0
                    }));
                }
            } catch(e) {}
        }

        // METHOD 5: sessionStorage
        else if(sessionStorage.getItem('gameState')) {
            try {
                const data = JSON.parse(sessionStorage.getItem('gameState'));
                if(data.questions) {
                    hasil = data.questions.map((q, idx) => ({
                        no: idx + 1,
                        soal: q.text || q.question || 'Soal ' + (idx+1),
                        opsi: q.options || q.answers || [],
                        jawaban: q.correct || 0
                    }));
                }
            } catch(e) {}
        }

        // METHOD 6: DOM - Cari elemen soal
        if(hasil.length === 0) {
            const soalElements = document.querySelectorAll('[data-testid="question-text"], .question-text, .question, [class*="question"]');
            
            soalElements.forEach((el, idx) => {
                const teksSoal = el.innerText || el.textContent || 'Soal ' + (idx+1);
                if(teksSoal.length < 3) return;

                const parent = el.closest('div') || document;
                const opsiElements = parent.querySelectorAll('[data-testid="option"], .option, [class*="option"], button');

                let opsi = [];
                let jawabanBenar = -1;

                opsiElements.forEach((opt, optIdx) => {
                    const teksOpt = opt.innerText || opt.textContent || 'Opsi ' + (optIdx+1);
                    if(teksOpt && teksOpt.length > 0 && teksOpt.length < 100) {
                        opsi.push(teksOpt);

                        if(opt.classList.contains('correct') || 
                           opt.dataset.correct === 'true' ||
                           opt.style.borderColor === 'rgb(0, 255, 0)' ||
                           opt.style.backgroundColor === 'rgba(0, 255, 0, 0.1)') {
                            jawabanBenar = optIdx;
                        }
                    }
                });

                if(opsi.length > 0) {
                    hasil.push({
                        no: hasil.length + 1,
                        soal: teksSoal,
                        opsi: opsi,
                        jawaban: jawabanBenar
                    });
                }
            });
        }

        // METHOD 7: Radio buttons
        if(hasil.length === 0) {
            const radios = document.querySelectorAll('input[type="radio"]');
            if(radios.length > 0) {
                const groups = {};
                radios.forEach(r => {
                    const name = r.name || 'group';
                    if(!groups[name]) groups[name] = [];
                    groups[name].push(r);
                });

                for(let g in groups) {
                    const soalText = groups[g][0].closest('div, section')?.previousElementSibling?.innerText || 'Soal';
                    const opsi = groups[g].map(r => {
                        const label = document.querySelector('label[for="' + r.id + '"]');
                        return label ? label.innerText : r.value || 'Opsi';
                    });
                    const jawabanBenar = groups[g].findIndex(r => r.checked);

                    hasil.push({
                        no: hasil.length + 1,
                        soal: soalText,
                        opsi: opsi,
                        jawaban: jawabanBenar
                    });
                }
            }
        }

        // METHOD 8: Script tags
        if(hasil.length === 0) {
            document.querySelectorAll('script:not([src])').forEach(script => {
                const content = script.innerText;
                if(content.includes('questions') || content.includes('quizData')) {
                    try {
                        const matches = content.match(/questions\s*:\s*(\[.*?\])/s);
                        if(matches) {
                            const data = JSON.parse(matches[1].replace(/'/g, '"'));
                            hasil = data.map((q, idx) => ({
                                no: idx + 1,
                                soal: q.text || q.question || 'Soal ' + (idx+1),
                                opsi: q.options || q.answers || [],
                                jawaban: q.correct || 0
                            }));
                        }
                    } catch(e) {}
                }
            });
        }

        // Simpan hasil
        state.soal = hasil;
        document.getElementById('bh-total-soal').innerText = hasil.length;

        // Tampilkan hasil
        if(hasil.length === 0) {
            container.innerHTML = '<div style="color:#ffaa00; text-align:center;">❌ Tidak menemukan soal.<br>Mungkin belum masuk game atau soal belum muncul</div>';
        } else {
            let html = '';
            hasil.forEach(q => {
                html += '<div style="margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 8px;">';
                html += '<div style="color:#ffaa00; font-weight:bold; margin-bottom:5px;">' + q.no + '. ' + q.soal.substring(0, 60) + (q.soal.length > 60 ? '...' : '') + '</div>';
                
                q.opsi.forEach((opt, idx) => {
                    const isJawaban = (idx === q.jawaban);
                    html += '<div style="margin-left:10px; margin-bottom:3px; color:' + (isJawaban ? '#00ff00' : '#aaa') + ';">';
                    html += (isJawaban ? '✅ ' : '○ ') + String.fromCharCode(65 + idx) + '. ' + opt.substring(0, 40) + (opt.length > 40 ? '...' : '');
                    if(isJawaban) html += ' <span style="color:#0f0; font-weight:bold;">⬅️ JAWABAN</span>';
                    html += '</div>';
                });
                
                html += '</div>';
            });
            container.innerHTML = html;
        }

        updateStatus('READY');
    };

    // ===========================================
    // 11. FUNGSI TAMPILKAN JAWABAN (HIGHLIGHT)
    // ===========================================
    document.getElementById('bh-answer-btn').onclick = function() {
        if(state.soal.length === 0) {
            alert('❌ Scan soal dulu!');
            return;
        }

        let highlighted = 0;

        state.soal.forEach(q => {
            if(q.jawaban >= 0 && q.opsi[q.jawaban]) {
                const jawabanText = q.opsi[q.jawaban];
                document.querySelectorAll('[data-testid="option"], .option, [class*="option"], button').forEach(el => {
                    if(el.innerText.includes(jawabanText.substring(0, 20))) {
                        el.style.border = '4px solid #00ff00';
                        el.style.boxShadow = '0 0 20px #00ff00';
                        el.style.backgroundColor = 'rgba(0,255,0,0.2)';
                        el.style.transform = 'scale(1.02)';
                        el.style.transition = 'all 0.3s';
                        highlighted++;
                    }
                });
            }
        });

        alert('✅ ' + highlighted + ' jawaban di-highlight hijau!');
    };

    // ===========================================
    // 12. FUNGSI AUTO JAWAB
    // ===========================================
    document.getElementById('bh-auto-btn').onclick = function() {
        if(state.soal.length === 0) {
            alert('❌ Scan soal dulu!');
            return;
        }

        if(state.autoInterval) {
            clearInterval(state.autoInterval);
        }

        updateStatus('AUTO', '#00ff00');

        state.autoInterval = setInterval(() => {
            try {
                const soalAktif = document.querySelector('[data-testid="question-text"], .question-text, .question');
                if(!soalAktif) return;

                const teksSoalAktif = soalAktif.innerText;

                for(let i = 0; i < state.soal.length; i++) {
                    const q = state.soal[i];
                    if(teksSoalAktif.includes(q.soal.substring(0, 30)) || q.soal.includes(teksSoalAktif.substring(0, 30))) {
                        if(q.jawaban >= 0 && q.opsi[q.jawaban]) {
                            const jawabanText = q.opsi[q.jawaban];
    
