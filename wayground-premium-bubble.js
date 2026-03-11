// =====================================================
// WAYGROUND PREMIUM BUBBLE - FULL FUNCTIONAL + OPACITY
// =====================================================

(function() {
    'use strict';
    
    // Cek sudah terload
    if (document.getElementById('wg-premium-bubble')) return;
    
    // ==================== ANTI DETECTION ====================
    (function antiDetect() {
        Object.defineProperty(document, 'hidden', { value: false, configurable: false });
        Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: false });
        window.addEventListener('visibilitychange', (e) => e.stopImmediatePropagation(), true);
        window.addEventListener('blur', (e) => e.stopImmediatePropagation(), true);
        
        // Override addEventListener untuk mencegah detection
        const originalAdd = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type === 'visibilitychange' || type === 'blur' || type === 'pagehide') {
                return;
            }
            return originalAdd.call(this, type, listener, options);
        };
    })();
    
    // ==================== STYLE ====================
    let style = document.createElement('style');
    style.innerHTML = `
        .wg-premium-container {
            position: fixed;
            z-index: 999999;
            font-family: 'Courier New', monospace;
            user-select: none;
        }
        .wg-premium-bubble {
            width: 60px;
            height: 60px;
            background: #0a0a0a;
            border: 3px solid #00ff00;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 0 20px #00ff00;
            transition: all 0.3s;
            font-size: 24px;
            color: #00ff00;
        }
        .wg-premium-bubble:hover {
            transform: scale(1.1);
            box-shadow: 0 0 30px #00ff00;
        }
        .wg-premium-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            max-width: 95%;
            max-height: 85vh;
            overflow-y: auto;
            background: #0a0a0a;
            border: 4px solid #00ff00;
            border-radius: 20px;
            padding: 20px;
            color: #00ff00;
            box-shadow: 0 0 40px #00ff00;
            display: none;
            transition: opacity 0.3s;
        }
        .wg-premium-btn {
            background: #333;
            color: #0f0;
            border: 2px solid #0f0;
            border-radius: 8px;
            padding: 10px;
            margin: 4px;
            cursor: pointer;
            flex: 1 0 auto;
            font-family: monospace;
            font-weight: bold;
            font-size: 13px;
            transition: 0.2s;
        }
        .wg-premium-btn:hover {
            background: #0f0;
            color: #000;
            transform: scale(1.05);
        }
        .wg-premium-highlight {
            border: 4px solid #00ff00 !important;
            background: rgba(0, 255, 0, 0.4) !important;
            animation: premiumPulse 1s infinite !important;
        }
        @keyframes premiumPulse {
            0% { box-shadow: 0 0 5px #0f0; }
            50% { box-shadow: 0 0 20px #0f0; }
            100% { box-shadow: 0 0 5px #0f0; }
        }
        .wg-drag-handle {
            cursor: move;
            padding: 12px;
            background: #1a1a1a;
            border-radius: 15px 15px 0 0;
            border-bottom: 2px solid #0f0;
        }
        .wg-opacity-slider {
            width: 100%;
            margin: 10px 0;
            accent-color: #0f0;
        }
        .wg-status-badge {
            background: #0f0;
            color: #000;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
    
    // ==================== CONTAINER ====================
    let container = document.createElement('div');
    container.id = 'wg-premium-bubble';
    container.className = 'wg-premium-container';
    container.style.top = '100px';
    container.style.left = '100px';
    
    // ==================== BUBBLE ====================
    let bubble = document.createElement('div');
    bubble.className = 'wg-premium-bubble';
    bubble.innerHTML = '⚡';
    bubble.title = 'Wayground Premium';
    
    // ==================== PANEL (LENGKAP) ====================
    let panel = document.createElement('div');
    panel.className = 'wg-premium-panel';
    panel.id = 'wg-premium-panel';
    panel.innerHTML = `
        <!-- DRAG HANDLE -->
        <div class="wg-drag-handle" id="wg-premium-drag">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #ffff00; font-size: 24px; font-weight: bold;">⚡ WAYGROUND PREMIUM</span>
                    <span class="wg-status-badge" id="wg-premium-status">ON</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <!-- OPACITY CONTROL -->
                    <select id="wg-premium-opacity" style="background: #333; color: #0f0; border: 2px solid #0f0; border-radius: 5px; padding: 5px;">
                        <option value="1">100%</option>
                        <option value="0.8">80%</option>
                        <option value="0.6">60%</option>
                        <option value="0.4">40%</option>
                        <option value="0.2">20%</option>
                    </select>
                    <button id="wg-premium-close" style="background: #f00; color: #fff; border: none; border-radius: 50%; width: 35px; height: 35px; font-size: 18px; cursor: pointer;">✖</button>
                </div>
            </div>
        </div>
        
        <!-- PIN SECTION -->
        <div style="margin: 15px 0; background: #1a1a1a; padding: 15px; border-radius: 10px;">
            <div style="display: flex; gap: 10px;">
                <input id="wg-premium-pin" type="text" placeholder="MASUKKAN PIN GAME" style="flex: 3; background: #000; color: #0f0; border: 2px solid #0f0; border-radius: 5px; padding: 12px; font-size: 16px;">
                <button id="wg-premium-join" style="flex: 1; background: #0f0; color: #000; border: none; border-radius: 5px; font-weight: bold; font-size: 16px;">JOIN</button>
            </div>
            <div id="wg-premium-pin-status" style="margin-top: 8px; font-size: 12px; color: #ff0; text-align: center;"></div>
        </div>
        
        <!-- BUTTONS ROW 1 -->
        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;">
            <button class="wg-premium-btn" id="premium-answers">📋 JAWABAN</button>
            <button class="wg-premium-btn" id="premium-auto">🤖 AUTO</button>
            <button class="wg-premium-btn" id="premium-stop">⏹️ STOP</button>
            <button class="wg-premium-btn" id="premium-highlight">✨ HIGHLIGHT</button>
            <button class="wg-premium-btn" id="premium-bypass">🛡️ BYPASS</button>
        </div>
        
        <!-- BUTTONS ROW 2 -->
        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px;">
            <button class="wg-premium-btn" id="premium-extract">📤 EXTRACT</button>
            <button class="wg-premium-btn" id="premium-refresh">🔄 REFRESH</button>
            <button class="wg-premium-btn" id="premium-reset">🔄 RESET</button>
            <button class="wg-premium-btn" id="premium-test">🧪 TEST</button>
        </div>
        
        <!-- CONTENT AREA -->
        <div id="wg-premium-content" style="background: #000; padding: 15px; border-radius: 8px; min-height: 250px; max-height: 350px; overflow-y: auto; font-size: 14px;"></div>
        
        <!-- STATISTICS -->
        <div style="margin-top: 15px; display: flex; justify-content: space-between; color: #666; font-size: 12px; border-top: 1px solid #333; padding-top: 10px;">
            <span>Soal: <span id="wg-premium-count">0</span></span>
            <span>Teridentifikasi: <span id="wg-premium-identified">0</span></span>
            <span>Akurasi: <span id="wg-premium-accuracy">100%</span></span>
            <span>⚡ Bubble: klik pojok</span>
        </div>
        
        <!-- OPACITY SLIDER (ALTERNATIF) -->
        <div style="margin-top: 10px;">
            <input type="range" id="wg-premium-opacity-slider" class="wg-opacity-slider" min="0.1" max="1" step="0.1" value="1">
            <div style="display: flex; justify-content: space-between; color: #666; font-size: 10px;">
                <span>Transparan</span>
                <span>Opacity: <span id="wg-premium-opacity-value">100%</span></span>
                <span>Tebal</span>
            </div>
        </div>
    `;
    
    container.appendChild(bubble);
    container.appendChild(panel);
    document.body.appendChild(container);
    
    // ==================== DRAG BUBBLE ====================
    let isDragging = false;
    let dragOffsetX, dragOffsetY;
    
    bubble.addEventListener('mousedown', startDrag);
    bubble.addEventListener('touchstart', startDrag);
    
    function startDrag(e) {
        isDragging = true;
        let clientX = e.clientX || e.touches[0].clientX;
        let clientY = e.clientY || e.touches[0].clientY;
        
        let rect = container.getBoundingClientRect();
        dragOffsetX = clientX - rect.left;
        dragOffsetY = clientY - rect.top;
        
        container.style.transition = 'none';
        e.preventDefault();
    }
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    
    function drag(e) {
        if (!isDragging) return;
        
        let clientX = e.clientX || e.touches[0].clientX;
        let clientY = e.clientY || e.touches[0].clientY;
        
        container.style.left = (clientX - dragOffsetX) + 'px';
        container.style.top = (clientY - dragOffsetY) + 'px';
    }
    
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
    
    function stopDrag() {
        isDragging = false;
        container.style.transition = '';
    }
    
    // ==================== DRAG PANEL ====================
    let dragHandle = document.getElementById('wg-premium-drag');
    let isDraggingPanel = false;
    let panelDragOffsetX, panelDragOffsetY;
    
    dragHandle.addEventListener('mousedown', (e) => {
        isDraggingPanel = true;
        let rect = panel.getBoundingClientRect();
        panelDragOffsetX = e.clientX - rect.left;
        panelDragOffsetY = e.clientY - rect.top;
        panel.style.transition = 'none';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDraggingPanel) return;
        panel.style.left = (e.clientX - panelDragOffsetX) + 'px';
        panel.style.top = (e.clientY - panelDragOffsetY) + 'px';
        panel.style.transform = 'none';
    });
    
    document.addEventListener('mouseup', () => {
        isDraggingPanel = false;
        panel.style.transition = '';
    });
    
    // ==================== TOGGLE PANEL ====================
    bubble.addEventListener('click', () => {
        panel.style.display = 'block';
        panel.style.left = '50%';
        panel.style.top = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
    });
    
    document.getElementById('wg-premium-close').addEventListener('click', () => {
        panel.style.display = 'none';
    });
    
    // ==================== OPACITY CONTROL ====================
    const opacitySelect = document.getElementById('wg-premium-opacity');
    const opacitySlider = document.getElementById('wg-premium-opacity-slider');
    const opacityValue = document.getElementById('wg-premium-opacity-value');
    
    function setOpacity(value) {
        panel.style.opacity = value;
        opacityValue.innerText = Math.round(value * 100) + '%';
        opacitySelect.value = value;
        opacitySlider.value = value;
    }
    
    opacitySelect.addEventListener('change', (e) => {
        setOpacity(parseFloat(e.target.value));
    });
    
    opacitySlider.addEventListener('input', (e) => {
        setOpacity(parseFloat(e.target.value));
    });
    
    // ==================== STATE ====================
    let state = {
        answers: [],
        autoInterval: null,
        highlightInterval: null,
        isActive: true,
        detectedCount: 0
    };
    
    // ==================== EKSTRAK JAWABAN (5 METODE) ====================
    function extractAnswers() {
        let result = [];
        let methods = 0;
        
        try {
            // METHOD 1: window._questions
            if (window._questions && Array.isArray(window._questions)) {
                result = window._questions.map(q => ({
                    question: q.text || q.question || q.title || '',
                    options: q.options || q.answers || [],
                    correct: q.correct || q.correctOption || q.correctAnswer || 0
                }));
                methods++;
            }
            
            // METHOD 2: window.quizData
            else if (window.quizData && window.quizData.questions) {
                result = window.quizData.questions.map(q => ({
                    question: q.text || q.question || '',
                    options: q.options || q.answers || [],
                    correct: q.correct || q.correctOption || 0
                }));
                methods++;
            }
            
            // METHOD 3: window.gameData
            else if (window.gameData && window.gameData.questions) {
                result = window.gameData.questions.map(q => ({
                    question: q.q || q.text || q.question || '',
                    options: q.ops || q.options || q.answers || [],
                    correct: q.c || q.correct || q.correctOption || 0
                }));
                methods++;
            }
            
            // METHOD 4: DOM Analysis
            if (result.length === 0) {
                document.querySelectorAll('.question, [data-question], .soal, .quiz-question').forEach((el, idx) => {
                    let qText = el.innerText || el.textContent || `Soal ${idx + 1}`;
                    let options = [];
                    let correct = -1;
                    
                    el.querySelectorAll('input[type="radio"] + label, .option, [data-option], .answer-choice').forEach((opt, optIdx) => {
                        options.push(opt.innerText || opt.textContent || `Opsi ${optIdx + 1}`);
                        
                        // Deteksi jawaban benar
                        if (opt.classList.contains('correct')) correct = optIdx;
                        if (opt.dataset.correct === 'true') correct = optIdx;
                        
                        let radio = opt.querySelector('input[type="radio"]') || opt.previousElementSibling;
                        if (radio && radio.checked) correct = optIdx;
                    });
                    
                    result.push({
                        question: qText,
                        options: options,
                        correct: correct
                    });
                });
                if (result.length > 0) methods++;
            }
            
            // METHOD 5: Network Intercept (pasif)
            if (result.length === 0) {
                const originalFetch = window.fetch;
                window.fetch = function(...args) {
                    return originalFetch.apply(this, args).then(response => {
                        if (typeof args[0] === 'string' && args[0].includes('wayground')) {
                            response.clone().json().then(data => {
                                if (data && (data.questions || data.data)) {
                                    let newAnswers = (data.questions || data.data).map(q => ({
                                        question: q.text || q.question || '',
                                        options: q.options || q.answers || [],
                                        correct: q.correct || q.correctOption || 0
                                    }));
                                    if (newAnswers.length > 0) {
                                        result = newAnswers;
                                        state.answers = result;
                                        updateContent();
                                    }
                                }
                            }).catch(() => {});
                        }
                        return response;
                    });
                };
            }
            
        } catch (e) {
            console.log('Extract error:', e);
        }
        
        state.answers = result;
        state.detectedCount = result.length;
        
        // Update UI
        document.getElementById('wg-premium-count').innerText = result.length;
        document.getElementById('wg-premium-identified').innerText = result.length;
        
        return result;
    }
    
    // ==================== JOIN GAME ====================
    function joinGame(pin) {
        if (!pin || pin.length < 3) {
            document.getElementById('wg-premium-pin-status').innerText = '❌ PIN tidak valid';
            return;
        }
        
        document.getElementById('wg-premium-pin-status').innerHTML = `⏳ Mencoba join dengan PIN: ${pin}...`;
        
        // Method 1: Input fields
        let inputs = document.querySelectorAll('input[type="text"], input[type="number"], .pin-input, .game-pin, [placeholder*="PIN"]');
        inputs.forEach(input => {
            input.value = pin;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('keyup', { bubbles: true }));
        });
        
        // Method 2: Click join button
        setTimeout(() => {
            let buttons = document.querySelectorAll('button, .btn, .button');
            let joined = false;
            
            buttons.forEach(btn => {
                let text = btn.innerText.toLowerCase();
                if (text.includes('join') || text.includes('masuk') || text.includes('play') || text.includes('mulai')) {
                    btn.click();
                    document.getElementById('wg-premium-pin-status').innerHTML = '✅ JOIN BERHASIL!';
                    joined = true;
                }
            });
            
            if (!joined) {
                document.getElementById('wg-premium-pin-status').innerHTML = '⚠️ Klik tombol join manual';
            } else {
                setTimeout(() => {
                    document.getElementById('wg-premium-pin-status').innerHTML = '';
                }, 3000);
            }
        }, 500);
    }
    
    // ==================== UPDATE CONTENT ====================
    function updateContent() {
        let content = document.getElementById('wg-premium-content');
        if (!content) return;
        
        extractAnswers();
        
        if (state.answers.length === 0) {
            content.innerHTML = '<div style="color: #ff0; text-align: center; padding: 30px;">🔍 MENGANALISA SOAL...<br><span style="font-size: 12px;">Menggunakan 5 metode deteksi</span></div>';
            return;
        }
        
        let html = `<div style="color: #ff0; margin-bottom: 15px; text-align: center; font-size: 16px;">📊 TERIDENTIFIKASI ${state
