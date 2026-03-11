// =====================================================
// WAYGROUND PREMIUM BUBBLE - FIXED & PERFECTED
// =====================================================

(function() {
    'use strict';
    
    // Hapus instance lama
    if (document.getElementById('wg-premium-bubble')) return;
    
    // ==================== ANTI DETECTION ====================
    (function antiDetect() {
        try {
            Object.defineProperty(document, 'hidden', { value: false, configurable: false });
            Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: false });
        } catch (e) {}
        window.addEventListener('visibilitychange', (e) => e.stopImmediatePropagation(), true);
    })();
    
    // ==================== STYLE ====================
    let style = document.createElement('style');
    style.innerHTML = `
        .wgb-container {
            position: fixed;
            z-index: 999999;
            font-family: 'Courier New', monospace;
            user-select: none;
        }
        .wgb-bubble {
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
            font-size: 24px;
            color: #00ff00;
            transition: 0.2s;
        }
        .wgb-bubble:hover {
            transform: scale(1.1);
        }
        .wgb-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 550px;
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
            opacity: 1 !important;
        }
        .wgb-btn {
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
            transition: 0.2s;
        }
        .wgb-btn:hover {
            background: #0f0;
            color: #000;
            transform: scale(1.02);
        }
        .wgb-highlight {
            border: 4px solid #00ff00 !important;
            background: rgba(0, 255, 0, 0.3) !important;
            animation: wgbPulse 1s infinite;
        }
        @keyframes wgbPulse {
            0% { box-shadow: 0 0 5px #0f0; }
            50% { box-shadow: 0 0 20px #0f0; }
            100% { box-shadow: 0 0 5px #0f0; }
        }
        .wgb-opacity-slider {
            width: 100%;
            margin: 10px 0;
            accent-color: #0f0;
        }
        .wgb-drag-handle {
            cursor: move;
            padding: 12px;
            background: #1a1a1a;
            border-radius: 15px 15px 0 0;
            border-bottom: 2px solid #0f0;
        }
    `;
    document.head.appendChild(style);
    
    // ==================== CONTAINER ====================
    let container = document.createElement('div');
    container.className = 'wgb-container';
    container.id = 'wg-premium-bubble';
    container.style.top = '50px';
    container.style.left = '50px';
    
    // ==================== BUBBLE ====================
    let bubble = document.createElement('div');
    bubble.className = 'wgb-bubble';
    bubble.innerHTML = '⚡';
    bubble.title = 'Wayground Tools';
    
    // ==================== PANEL (LANGSUNG KELIATAN) ====================
    let panel = document.createElement('div');
    panel.className = 'wgb-panel';
    panel.id = 'wgb-panel';
    panel.innerHTML = `
        <!-- DRAG HANDLE -->
        <div class="wgb-drag-handle" id="wgb-drag">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #ffff00; font-size: 24px; font-weight: bold;">⚡ WAYGROUND TOOLS</span>
                    <span style="background: #0f0; color: #000; padding: 3px 10px; border-radius: 20px; font-size: 12px;">ON</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <select id="wgb-opacity-select" style="background: #333; color: #0f0; border: 2px solid #0f0; border-radius: 5px; padding: 5px;">
                        <option value="1" selected>100%</option>
                        <option value="0.8">80%</option>
                        <option value="0.6">60%</option>
                        <option value="0.4">40%</option>
                        <option value="0.2">20%</option>
                    </select>
                    <button id="wgb-close" style="background: #f00; color: #fff; border: none; border-radius: 50%; width: 35px; height: 35px; font-size: 18px; cursor: pointer;">✖</button>
                </div>
            </div>
        </div>
        
        <!-- PIN JOIN SECTION (FULL FUNCTIONAL) -->
        <div style="margin: 15px 0; background: #1a1a1a; padding: 15px; border-radius: 10px;">
            <div style="display: flex; gap: 10px;">
                <input id="wgb-pin" type="text" placeholder="MASUKKAN PIN GAME" style="flex: 3; background: #000; color: #0f0; border: 2px solid #0f0; border-radius: 5px; padding: 12px; font-size: 16px;">
                <button id="wgb-join" style="flex: 1; background: #0f0; color: #000; border: none; border-radius: 5px; font-weight: bold; font-size: 16px; cursor: pointer;">JOIN</button>
            </div>
            <div id="wgb-pin-status" style="margin-top: 8px; font-size: 12px; color: #ff0; text-align: center;"></div>
        </div>
        
        <!-- BUTTONS ROW 1 -->
        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;">
            <button class="wgb-btn" id="wgb-answers">📋 JAWABAN</button>
            <button class="wgb-btn" id="wgb-auto">🤖 AUTO</button>
            <button class="wgb-btn" id="wgb-stop">⏹️ STOP</button>
            <button class="wgb-btn" id="wgb-highlight">✨ HIGHLIGHT</button>
            <button class="wgb-btn" id="wgb-bypass">🛡️ BYPASS</button>
        </div>
        
        <!-- BUTTONS ROW 2 -->
        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px;">
            <button class="wgb-btn" id="wgb-extract">📤 EXTRACT</button>
            <button class="wgb-btn" id="wgb-refresh">🔄 REFRESH</button>
            <button class="wgb-btn" id="wgb-reset">🔄 RESET</button>
        </div>
        
        <!-- CONTENT AREA -->
        <div id="wgb-content" style="background: #000; padding: 15px; border-radius: 8px; min-height: 250px; max-height: 350px; overflow-y: auto; font-size: 14px;"></div>
        
        <!-- OPACITY SLIDER -->
        <div style="margin-top: 15px;">
            <div style="display: flex; justify-content: space-between; color: #0f0; margin-bottom: 5px;">
                <span>Opacity:</span>
                <span id="wgb-opacity-value">100%</span>
            </div>
            <input type="range" id="wgb-opacity-slider" class="wgb-opacity-slider" min="0.1" max="1" step="0.1" value="1">
        </div>
        
        <!-- STATUS -->
        <div style="margin-top: 10px; font-size: 11px; color: #666; text-align: center;">
            <span>Soal: <span id="wgb-count">0</span> | Teridentifikasi: <span id="wgb-identified">0</span></span>
        </div>
    `;
    
    container.appendChild(bubble);
    container.appendChild(panel);
    document.body.appendChild(container);
    
    // ==================== BUBBLE CLICK ====================
    bubble.addEventListener('click', () => {
        panel.style.display = 'block';
        panel.style.opacity = document.getElementById('wgb-opacity-slider').value;
    });
    
    // ==================== CLOSE ====================
    document.getElementById('wgb-close').addEventListener('click', () => {
        panel.style.display = 'none';
    });
    
    // ==================== DRAG BUBBLE ====================
    let isDragging = false;
    let offsetX, offsetY;
    
    bubble.addEventListener('mousedown', (e) => {
        isDragging = true;
        let rect = container.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        container.style.transition = 'none';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        container.style.left = (e.clientX - offsetX) + 'px';
        container.style.top = (e.clientY - offsetY) + 'px';
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.transition = '';
    });
    
    // ==================== DRAG PANEL ====================
    let dragHandle = document.getElementById('wgb-drag');
    let isDraggingPanel = false;
    let panelOffsetX, panelOffsetY;
    
    dragHandle.addEventListener('mousedown', (e) => {
        isDraggingPanel = true;
        let rect = panel.getBoundingClientRect();
        panelOffsetX = e.clientX - rect.left;
        panelOffsetY = e.clientY - rect.top;
        panel.style.transition = 'none';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDraggingPanel) return;
        panel.style.left = (e.clientX - panelOffsetX) + 'px';
        panel.style.top = (e.clientY - panelOffsetY) + 'px';
        panel.style.transform = 'none';
    });
    
    document.addEventListener('mouseup', () => {
        isDraggingPanel = false;
        panel.style.transition = '';
    });
    
    // ==================== OPACITY CONTROL ====================
    const opacitySelect = document.getElementById('wgb-opacity-select');
    const opacitySlider = document.getElementById('wgb-opacity-slider');
    const opacityValue = document.getElementById('wgb-opacity-value');
    
    function setOpacity(value) {
        panel.style.opacity = value;
        opacityValue.innerText = Math.round(value * 100) + '%';
        opacitySelect.value = value;
        opacitySlider.value = value;
    }
    
    setOpacity(1); // Default 100%
    
    opacitySelect.addEventListener('change', (e) => setOpacity(parseFloat(e.target.value)));
    opacitySlider.addEventListener('input', (e) => setOpacity(parseFloat(e.target.value)));
    
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
            } else {
                document.querySelectorAll('.question, [data-question], .soal').forEach((el, i) => {
                    let qText = el.innerText || `Soal ${i+1}`;
                    let opts = [];
                    let correct = -1;
                    el.querySelectorAll('input[type="radio"] + label, .option, [data-option]').forEach((opt, idx) => {
                        opts.push(opt.innerText || `Opsi ${idx+1}`);
                        if (opt.classList.contains('correct') || opt.dataset.correct === 'true' || opt.checked) {
                            correct = idx;
                        }
                    });
                    result.push({ q: qText, o: opts, c: correct });
                });
            }
        } catch (e) {}
        
        document.getElementById('wgb-count').innerText = result.length;
        document.getElementById('wgb-identified').innerText = result.length;
        state.answers = result;
        return result;
    }
    
    // ==================== UPDATE CONTENT ====================
    function updateContent() {
        let content = document.getElementById('wgb-content');
        if (!content) return;
        
        let answers = extractAnswers();
        
        if (answers.length === 0) {
            content.innerHTML = '<div style="color: #ff0; text-align: center;">🔍 Mencari soal...</div>';
            return;
        }
        
        let html = `<div style="color: #ff0; margin-bottom: 10px;">📊 ${answers.length} soal:</div>`;
        answers.forEach((q, i) => {
            html += `<div style="margin-bottom: 10px; border-left: 3px solid #0f0; padding-left: 8px;">`;
            html += `<div>${i+1}. ${(q.q || '').substring(0, 60)}</div>`;
            if (q.o && q.o.length > 0) {
                q.o.forEach((opt, j) => {
                    let isCorrect = (j === q.c);
                    html += `<div style="margin-left: 15px; color: ${isCorrect ? '#0f0' : '#999'};">`;
                    html += isCorrect ? '✓ ' : '○ ';
                    html += `${String.fromCharCode(65+j)}. ${opt}`;
                    if (isCorrect) html += ' ⬅️';
                    html += '</div>';
                });
            }
            html += '</div>';
        });
        content.innerHTML = html;
    }
    
    // ==================== JOIN GAME ====================
    document.getElementById('wgb-join').addEventListener('click', () => {
        let pin = document.getElementById('wgb-pin').value.trim();
        if (!pin || pin.length < 3) {
            document.getElementById('wgb-pin-status').innerText = '❌ PIN tidak valid';
            return;
        }
        
        document.getElementById('wgb-pin-status').innerHTML = `⏳ Mencoba join dengan PIN: ${pin}...`;
        
        // Input PIN ke semua field
        document.querySelectorAll('input[type="text"], input[type="number"], .pin-input').forEach(input => {
            input.value = pin;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        
        // Klik tombol join
        setTimeout(() => {
            let joined = false;
            document.querySelectorAll('button, .btn, .button').forEach(btn => {
                let text = btn.innerText.toLowerCase();
                if (text.includes('join') || text.includes('masuk') || text.includes('play')) {
                    btn.click();
                    document.getElementById('wgb-pin-status').innerHTML = '✅ JOIN BERHASIL!';
                    joined = true;
                }
            });
            
            if (!joined) {
                document.getElementById('wgb-pin-status').innerHTML = '⚠️ Klik manual';
            } else {
                setTimeout(() => {
                    document.getElementById('wgb-pin-status').innerHTML = '';
                }, 3000);
            }
        }, 500);
    });
    
    // ==================== AUTO ANSWER ====================
    document.getElementById('wgb-auto').addEventListener('click', () => {
        if (state.answers.length === 0) {
            alert('Tidak ada jawaban! Klik JAWABAN dulu.');
            return;
        }
        
        if (state.autoInterval) clearInterval(state.autoInterval);
        
        state.autoInterval = setInterval(() => {
            try {
                let options = document.querySelectorAll('input[type="radio"]:not([disabled]), .option:not(.disabled)');
                if (options.length === 0) return;
                
                let questionText = document.querySelector('.question, [data-question], .soal, h2')?.innerText || '';
                
                for (let i = 0; i < state.answers.length; i++) {
                    let q = state.answers[i];
                    if (questionText.includes((q.q || '').substring(0, 30))) {
                        let correct = q.c;
                        if (correct >= 0 && correct < options.length) {
                            let delay = 2000 + Math.random() * 3000;
                            setTimeout(() => {
                                options[correct].click();
                                options[correct].dispatchEvent(new Event('change', { bubbles: true }));
                            }, delay);
                        }
                        break;
                    }
                }
            } catch (e) {}
        }, 4000);
        
        document.getElementById('wgb-content').innerHTML = '<div style="color: #0f0;">✅ AUTO ANSWER DIMULAI</div>';
    });
    
    // ==================== STOP ====================
    document.getElementById('wgb-stop').addEventListener('click', () => {
        if (state.autoInterval) {
            clearInterval(state.autoInterval);
            state.autoInterval = null;
        }
        document.getElementById('wgb-content').innerHTML = '<div style="color: #f00;">⏹️ AUTO STOP</div>';
    });
    
    // ==================== HIGHLIGHT ====================
    document.getElementById('wgb-highlight').addEventListener('click', () => {
        if (state.highlightInterval) clearInterval(state.highlightInterval);
        
        state.highlightInterval = setInterval(() => {
            state.answers.forEach(q => {
                if (q.c >= 0) {
                    let options = document.querySelectorAll('input[type="radio"], .option');
                    if (options[q.c]) {
                        options[q.c].classList.add('wgb-highlight');
                    }
                }
            });
        }, 2000);
        
        document.getElementById('wgb-content').innerHTML = '<div style="color: #0f0;">✨ HIGHLIGHT AKTIF</div>';
    });
    
    // ==================== BYPASS ====================
    document.getElementById('wgb-bypass').addEventListener('click', () => {
        Object.defineProperty(document, 'hidden', { value: false });
        document.getElementById('wgb-content').innerHTML = '<div style="color: #0f0;">🛡️ BYPASS AKTIF</div>';
    });
    
    // ==================== EXTRACT ====================
    document.getElementById('wgb-extract').addEventListener('click', () => {
        let json = JSON.stringify(state.answers, null, 2);
        document.getElementById('wgb-content').innerHTML = `<pre style="font-size: 10px;">${json.substring(0, 800)}...</pre>`;
        navigator.clipboard?.writeText(json).then(() => alert('Data copied!'));
    });
    
    // ==================== REFRESH ====================
    document.getElementById('wgb-refresh').addEventListener('click', updateContent);
    
    // ==================== RESET ====================
    document.getElementById('wgb-reset').addEventListener('click', () => {
        if (state.autoInterval) clearInterval(state.autoInterval);
        if (state.highlightInterval) clearInterval(state.highlightInterval);
        state.autoInterval = null;
        state.highlightInterval = null;
        state.answers = [];
        document.getElementById('wgb-content').innerHTML = '<div style="color: #ff0;">🔄 RESET ALL</div>';
        document.getElementById('wgb-count').innerText = '0';
        document.getElementById('wgb-identified').innerText = '0';
    });
    
    // ==================== PIN ENTER =============            padding: 3px 10px;
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
    
    // ==================== PANEL ====================
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
                    <!-- OPACITY CONTROL - DEFAULT 1 (100%) -->
                    <select id="wg-premium-opacity" style="background: #333; color: #0f0; border: 2px solid #0f0; border-radius: 5px; padding: 5px;">
                        <option value="1" selected>100%</option>
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
        
        <!-- OPACITY SLIDER - DEFAULT 1 (100%) -->
        <div style="margin-top: 10px;">
            <div style="display: flex; justify-content: space-between; color: #0f0; margin-bottom: 5px;">
                <span>Opacity:</span>
                <span id="wg-premium-opacity-value">100%</span>
            </div>
            <input type="range" id="wg-premium-opacity-slider" class="wg-opacity-slider" min="0.1" max="1" step="0.1" value="1">
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
        panel.style.opacity = document.getElementById('wg-premium-opacity-slider').value; // Pakai nilai slider
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
    
    // Set default opacity ke 1 (100%)
    setOpacity(1);
    
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
            if (result.length === 0) {
                document.querySelectorAll('.question, [data-question], .soal, .quiz-question').forEach((el, idx) => {
                    let qText = el.innerText || el.textContent || `Soal ${idx + 1}`;
                    let options = [];
                    let correct = -1;
                    
                    el.querySelectorAll('input[type="radio"] + label, .option, [data-option], .answer-choice').forEach((opt, optIdx) => {
                        options.push(opt.innerText || opt.textContent || `Opsi ${optIdx + 1}`);
                        
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
            }
            
        } catch (e) {}
        
        state.answers = result;
        state.detectedCount = result.length;
        
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
        
        let inputs = document.querySelectorAll('input[type="text"], input[type="number"], .pin-input, .game-pin, [placeholder*="PIN"]');
        inputs.forEach(input => {
            input.value = pin;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        
        setTimeout(() => {
            let buttons = document.querySelectorAll('button, .btn, .button');
            let joined = false;
            
            buttons.forEach(btn => {
                let text = btn.innerText.toLowerCase();
                if (text.includes('join') || text.includes('masuk') || text.includes('play')) {
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
            content.innerHTML = '<div style="color: #ff0; text-align: center; padding: 30px;">🔍 MENGANALISA SOAL...</div>';
            return;
        }
        
        let html = `<div style="color: #ff0; margin-bottom: 15px; text-align: center;">📊 TERIDENTIFIKASI ${state.answers.length} SOAL</div>`;
        
        state.answers.forEach((q, i) => {
            html += `<div style="margin-bottom: 15px; border-left: 4px solid #0f0; padding-left: 12px;">`;
            html += `<div style="color: #ff0; font-weight: bold;">${i+1}. ${(q.question || '').substring(0, 70)}</div>`;
            
            if (q.options && q.options.length > 0) {
                q.options.forEach((opt, j) => {
                    let isCorrect = (j === q.correct);
                    html += `<div style="margin-left: 15px; color: ${isCorrect ? '#0f0' : '#999'};">`;
                    html += isCorrect ? '✓ ' : '○ ';
                    html += `${String.fromCharCode(65+j)}. ${opt || 'Kosong'}`;
                    if (isCorrect) html += ` ⬅️ JAWABAN`;
                    html += '</div>';
                });
            }
            html += '</div>';
        });
        
        content.innerHTML = html;
    }
    
    // ==================== AUTO ANSWER ====================
    function startAutoAnswer() {
        if (state.answers.length === 0) {
            alert('Belum ada jawaban! Klik JAWABAN dulu.');
            return;
        }
        
        if (state.autoInterval) clearInterval(state.autoInterval);
        
        state.autoInterval = setInterval(() => {
            try {
                if (!state.isActive) return;
                
                let options = document.querySelectorAll('input[type="radio"]:not([disabled]), .option:not(.disabled)');
                if (options.length === 0) return;
                
                let questionText = document.querySelector('.question, [data-question], .soal, h2')?.innerText || '';
                
                for (let i = 0; i < state.answers.length; i++) {
                    let q = state.answers[i];
                    let qText = q.question || '';
                    
                    if (questionText.includes(qText.substring(0, 40)) || qText.includes(questionText.substring(0, 40))) {
                        let correctIdx = q.correct;
                        
                        if (correctIdx >= 0 && correctIdx < options.length) {
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
