// =====================================================
// WAYGROUND BUBBLE EDITION - FLOATING CIRCLE TOOL
// =====================================================

(function() {
    'use strict';
    
    // Hapus yang lama kalo ada
    if (document.getElementById('wg-bubble-container')) return;
    
    // ==================== ANTI DETECTION ====================
    Object.defineProperty(document, 'hidden', { value: false });
    Object.defineProperty(document, 'visibilityState', { value: 'visible' });
    
    // ==================== STYLE ====================
    let style = document.createElement('style');
    style.innerHTML = `
        .wg-bubble-container {
            position: fixed;
            z-index: 999999;
            font-family: 'Courier New', monospace;
            user-select: none;
        }
        .wg-bubble-circle {
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
            transition: 0.3s;
            font-size: 24px;
            color: #00ff00;
        }
        .wg-bubble-circle:hover {
            transform: scale(1.1);
            box-shadow: 0 0 30px #00ff00;
        }
        .wg-bubble-panel {
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
        }
        .wg-bubble-btn {
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
        .wg-bubble-btn:hover {
            background: #0f0;
            color: #000;
            transform: scale(1.05);
        }
        .wg-bubble-highlight {
            border: 4px solid #00ff00 !important;
            background: rgba(0, 255, 0, 0.3) !important;
            animation: bubblePulse 1s infinite;
        }
        @keyframes bubblePulse {
            0% { box-shadow: 0 0 5px #0f0; }
            50% { box-shadow: 0 0 20px #0f0; }
            100% { box-shadow: 0 0 5px #0f0; }
        }
        .wg-drag-handle {
            cursor: move;
            padding: 10px;
            background: #1a1a1a;
            border-radius: 10px 10px 0 0;
            border-bottom: 2px solid #0f0;
        }
    `;
    document.head.appendChild(style);
    
    // ==================== CONTAINER UTAMA ====================
    let container = document.createElement('div');
    container.id = 'wg-bubble-container';
    container.className = 'wg-bubble-container';
    container.style.top = '100px';
    container.style.left = '100px';
    
    // ==================== BUBBLE CIRCLE ====================
    let circle = document.createElement('div');
    circle.className = 'wg-bubble-circle';
    circle.innerHTML = '🔧';
    circle.title = 'Wayground Tools';
    
    // ==================== PANEL (AWALNYA HIDDEN) ====================
    let panel = document.createElement('div');
    panel.className = 'wg-bubble-panel';
    panel.id = 'wg-bubble-panel';
    panel.innerHTML = `
        <div class="wg-drag-handle" id="wg-drag-handle">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #ffff00; font-size: 24px; font-weight: bold;">🎯 WAYGROUND BUBBLE</span>
                <button id="wg-close-panel" style="background: #f00; color: #fff; border: none; border-radius: 50%; width: 35px; height: 35px; font-size: 18px; cursor: pointer;">✖</button>
            </div>
        </div>
        
        <!-- PIN SECTION -->
        <div style="margin: 15px 0; background: #1a1a1a; padding: 15px; border-radius: 10px;">
            <div style="display: flex; gap: 10px;">
                <input id="wg-bubble-pin" type="text" placeholder="MASUKKAN PIN" style="flex: 3; background: #000; color: #0f0; border: 2px solid #0f0; border-radius: 5px; padding: 12px;">
                <button id="wg-bubble-join" style="flex: 1; background: #0f0; color: #000; border: none; border-radius: 5px; font-weight: bold;">JOIN</button>
            </div>
            <div id="wg-bubble-pin-status" style="margin-top: 8px; font-size: 12px; color: #ff0;"></div>
        </div>
        
        <!-- BUTTONS -->
        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px;">
            <button class="wg-bubble-btn" id="bubble-answers">📋 JAWABAN</button>
            <button class="wg-bubble-btn" id="bubble-auto">🤖 AUTO</button>
            <button class="wg-bubble-btn" id="bubble-stop">⏹️ STOP</button>
            <button class="wg-bubble-btn" id="bubble-highlight">✨ HIGHLIGHT</button>
            <button class="wg-bubble-btn" id="bubble-bypass">🛡️ BYPASS</button>
            <button class="wg-bubble-btn" id="bubble-extract">📤 EXTRACT</button>
            <button class="wg-bubble-btn" id="bubble-refresh">🔄 REFRESH</button>
        </div>
        
        <!-- CONTENT -->
        <div id="wg-bubble-content" style="background: #000; padding: 15px; border-radius: 8px; min-height: 250px; max-height: 350px; overflow-y: auto;"></div>
        
        <!-- STATUS -->
        <div style="margin-top: 15px; display: flex; justify-content: space-between; color: #666; font-size: 12px;">
            <span>Soal: <span id="wg-bubble-count">0</span></span>
            <span>Status: <span id="wg-bubble-status">READY</span></span>
            <span>🔧 Klik bulat merah</span>
        </div>
    `;
    
    container.appendChild(circle);
    container.appendChild(panel);
    document.body.appendChild(container);
    
    // ==================== DRAG FUNCTION ====================
    let isDragging = false;
    let dragOffsetX, dragOffsetY;
    
    circle.addEventListener('mousedown', startDrag);
    circle.addEventListener('touchstart', startDrag);
    
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
    
    // ==================== DRAG HANDLE UNTUK PANEL ====================
    let dragHandle = document.getElementById('wg-drag-handle');
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
    circle.addEventListener('click', () => {
        panel.style.display = 'block';
        panel.style.left = '50%';
        panel.style.top = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
    });
    
    document.getElementById('wg-close-panel').addEventListener('click', () => {
        panel.style.display = 'none';
    });
    
    // ==================== STATE ====================
    let state = {
        answers: [],
        autoInterval: null,
        highlightInterval: null,
        isActive: true
    };
    
    // ==================== FUNGSI JOIN ====================
    function joinGame(pin) {
        if (!pin || pin.length < 3) {
            document.getElementById('wg-bubble-pin-status').innerText = '❌ PIN tidak valid';
            return;
        }
        
        document.getElementById('wg-bubble-pin-status').innerHTML = `⏳ Mencoba join...`;
        
        let inputs = document.querySelectorAll('input[type="text"], input[type="number"], .pin-input');
        inputs.forEach(input => {
            input.value = pin;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
        
        setTimeout(() => {
            let buttons = document.querySelectorAll('button');
            let joined = false;
            buttons.forEach(btn => {
                let text = btn.innerText.toLowerCase();
                if (text.includes('join') || text.includes('masuk')) {
                    btn.click();
                    document.getElementById('wg-bubble-pin-status').innerHTML = '✅ JOIN BERHASIL!';
                    joined = true;
                }
            });
            if (!joined) {
                document.getElementById('wg-bubble-pin-status').innerHTML = '⚠️ Klik manual';
            } else {
                setTimeout(() => {
                    document.getElementById('wg-bubble-pin-status').innerHTML = '';
                }, 3000);
            }
        }, 500);
    }
    
    // ==================== EKSTRAK JAWABAN ====================
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
            } else {
                document.querySelectorAll('.question, [data-question], .soal').forEach((el, i) => {
                    let qText = el.innerText || `Soal ${i+1}`;
                    let opts = [];
                    let correct = -1;
                    el.querySelectorAll('input[type="radio"]+label, .option').forEach((opt, idx) => {
                        opts.push(opt.innerText || `Opsi ${idx+1}`);
                        if (opt.classList.contains('correct') || opt.checked) correct = idx;
                    });
                    result.push({ q: qText, o: opts, c: correct });
                });
            }
        } catch (e) {}
        document.getElementById('wg-bubble-count').innerText = result.length;
        return result;
    }
    
    // ==================== UPDATE CONTENT ====================
    function updateContent() {
        let content = document.getElementById('wg-bubble-content');
        if (!content) return;
        
        state.answers = extractAnswers();
        
        if (state.answers.length === 0) {
            content.innerHTML = '<div style="color: #ff0; text-align: center;">⏳ Mencari soal...</div>';
            return;
        }
        
        let html = `<div style="color: #ff0; margin-bottom: 10px;">📊 ${state.answers.length} soal:</div>`;
        state.answers.forEach((q, i) => {
            html += `<div style="margin-bottom: 10px; border-left: 3px solid #0f0; padding-left: 8px;">`;
            html += `<div>${i+1}. ${(q.q || '').substring(0, 60)}</div>`;
            if (q.o) {
                q.o.forEach((opt, j) => {
                    let cor = (j === q.c);
                    html += `<div style="margin-left: 15px; color: ${cor ? '#0f0' : '#999'};">`;
                    html += cor ? '✓ ' : '○ ';
                    html += `${String.fromCharCode(65+j)}. ${opt}`;
                    if (cor) html += ' ⬅️';
                    html += '</div>';
                });
            }
            html += '</div>';
        });
        content.innerHTML = html;
        document.getElementById('wg-bubble-status').innerText = 'UPDATED';
        setTimeout(() => document.getElementById('wg-bubble-status').innerText = 'READY', 1000);
    }
    
    // ==================== AUTO ANSWER ====================
    function startAuto() {
        if (state.answers.length === 0) return alert('Tidak ada jawaban!');
        if (state.autoInterval) clearInterval(state.autoInterval);
        
        state.autoInterval = setInterval(() => {
            try {
                let options = document.querySelectorAll('input[type="radio"]:not([disabled]), .option:not(.disabled)');
                if (!options.length) return;
                
                let qText = document.querySelector('.question, [data-question], .soal, h2')?.innerText || '';
                
                for (let i = 0; i < state.answers.length; i++) {
                    if (qText.includes((state.answers[i].q || '').substring(0, 30))) {
                        let c = state.answers[i].c;
                        if (c >= 0 && c < options.length) {
                            setTimeout(() => {
                                options[c].click();
                                options[c].dispatchEvent(new Event('change', { bubbles: true }));
                            }, 2000 + Math.random() * 3000);
                        }
                        break;
                    }
                }
            } catch (e) {}
        }, 4000);
        
        document.getElementById('wg-bubble-content').innerHTML = '<div style="color: #0f0;">✅ AUTO ON</div>';
    }
    
    // ==================== HIGHLIGHT ====================
    function startHighlight() {
        if (state.highlightInterval) clearInterval(state.highlightInterval);
        state.highlightInterval = setInterval(() => {
            state.answers.forEach(q => {
                if (q.c >= 0) {
                    let opts = document.querySelectorAll('input[type="radio"], .option');
                    if (opts[q.c]) opts[q.c].classList.add('wg-bubble-highlight');
                }
            });
        }, 2000);
        document.getElementById('wg-bubble-content').innerHTML = '<div style="color: #0f0;">✨ HIGHLIGHT ON</div>';
    }
    
    // ==================== BYPASS ====================
    function enableBypass() {
        Object.defineProperty(document, 'hidden', { value: false });
        document.getElementById('wg-bubble-content').innerHTML = '<div style="color: #0f0;">🛡️ BYPASS ON</div>';
    }
    
    // ==================== EXTRACT ====================
    function extractData() {
        let json = JSON.stringify(state.answers, null, 2);
        document.getElementById('wg-bubble-content').innerHTML = '<pre>' + json.substring(0, 800) + '...</pre>';
        navigator.clipboard?.writeText(json);
    }
    
    // ==================== EVENT LISTENERS ====================
    document.getElementById('bubble-answers').onclick = updateContent;
    document.getElementById('bubble-refresh').onclick = updateContent;
    document.getElementById('bubble-auto').onclick = startAuto;
    document.getElementById('bubble-stop').onclick = () => {
        if (state.autoInterval) clearInterval(state.autoInterval);
        document.getElementById('wg-bubble-content').innerHTML = '<div style="color: #f00;">⏹️ STOP</div>';
    };
    document.getElementById('bubble-highlight').onclick = startHighlight;
    document.getElementById('bubble-bypass').onclick = enableBypass;
    document.getElementById('bubble-extract').onclick = extractData;
    
    document.getElementById('wg-bubble-join').onclick = () => {
        let pin = document.getElementById('wg-bubble-pin').value.trim();
        joinGame(pin);
    };
    
    document.getElementById('wg-bubble-pin').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            let pin = e.target.value.trim();
            joinGame(pin);
        }
    });
    
    // ==================== INIT ====================
    setTimeout(() => {
        updateContent();
        document.getElementById('wg-bubble-content').innerHTML = '<div style="color: #0f0; text-align: center;">✅ SIAP! Klik JAWABAN</div>';
    }, 1000);
    
    // Auto refresh
    setInterval(() => {
        if (panel.style.display !== 'none') {
            extractAnswers();
        }
    }, 5000);
    
})();
