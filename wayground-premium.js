// =====================================================
// WAYGROUND PREMIUM EDITION – FULL AUTO + FLOATING PANEL
// =====================================================
// Author: SaputraHack / Colin
// Fitur:
// - Floating panel (bisa digeser, di-hide, di-show)
// - Auto jawab + highlight + bypass
// - Analisis soal otomatis
// - Hidden mode (klik pojok kiri 3x)
// - Sync ke GitHub (auto update)
// =====================================================

(function() {
    'use strict';

    // Cek apakah sudah jalan
    if (window.__waygroundPremiumLoaded) return;
    window.__waygroundPremiumLoaded = true;

    console.log('%c[Wayground Premium] Loaded from GitHub', 'color: lime; font-size: 14px;');

    // ==================== KONFIGURASI ====================
    const CONFIG = {
        version: '1.0',
        debug: false,
        autoAnswer: true,
        antiDetect: true,
        highlight: true,
        answerDelay: { min: 2000, max: 5000 },
        floating: {
            defaultPosition: { top: 100, left: 100 },
            hideOnClose: true,
            showOnCornerClick: true,
            cornerClickCount: 3
        }
    };

    // ==================== STATE ====================
    const state = {
        answers: [],
        autoInterval: null,
        highlightInterval: null,
        panelVisible: true,
        isActive: true,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        cornerClick: 0
    };

    // ==================== ANTI DETECTION ====================
    if (CONFIG.antiDetect) {
        Object.defineProperty(document, 'hidden', { value: false });
        Object.defineProperty(document, 'visibilityState', { value: 'visible' });
        window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
    }

    // ==================== FLOATING PANEL ====================
    function createFloatingPanel() {
        if (document.getElementById('wg-premium-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'wg-premium-panel';
        panel.innerHTML = `
            <div style="background: #0a0a0a; border: 3px solid #00ff00; border-radius: 12px; color: #00ff00; font-family: monospace; width: 400px; max-width: 90vw; box-shadow: 0 0 20px #00ff00; user-select: none;">
                <!-- HEADER (bisa digeser) -->
                <div id="wg-drag-handle" style="background: #1a1a1a; padding: 8px 12px; border-radius: 10px 10px 0 0; cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #00ff00;">
                    <span style="color: #ffff00; font-weight: bold;">🎯 WAYGROUND PREMIUM</span>
                    <div>
                        <button id="wg-minimize" style="background: #333; color: #0f0; border: 1px solid #0f0; border-radius: 4px; margin-right: 4px; padding: 2px 8px;">🗕</button>
                        <button id="wg-close" style="background: #f00; color: #fff; border: none; border-radius: 4px; padding: 2px 8px;">✖</button>
                    </div>
                </div>

                <!-- BODY -->
                <div style="padding: 12px;">
                    <!-- PIN JOIN -->
                    <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                        <input id="wg-pin" type="text" placeholder="PIN Game" style="flex: 3; background: #000; color: #0f0; border: 1px solid #0f0; border-radius: 4px; padding: 6px;">
                        <button id="wg-join" style="flex: 1; background: #333; color: #0f0; border: 1px solid #0f0; border-radius: 4px;">JOIN</button>
                    </div>

                    <!-- TOMBOL FUNGSI -->
                    <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;">
                        <button class="wg-btn" data-action="answers">📋 JAWAB</button>
                        <button class="wg-btn" data-action="auto">🤖 AUTO</button>
                        <button class="wg-btn" data-action="stop">⏹️ STOP</button>
                        <button class="wg-btn" data-action="highlight">✨ HIGH</button>
                        <button class="wg-btn" data-action="bypass">🛡️ BYP</button>
                        <button class="wg-btn" data-action="extract">📤 EXT</button>
                        <button class="wg-btn" data-action="refresh">🔄 REF</button>
                        <button class="wg-btn" data-action="hide">👻 HIDE</button>
                    </div>

                    <!-- CONTENT -->
                    <div id="wg-content" style="background: #000; padding: 10px; border-radius: 6px; min-height: 150px; max-height: 300px; overflow-y: auto; font-size: 13px;"></div>

                    <!-- FOOTER -->
                    <div style="margin-top: 8px; font-size: 10px; color: #666; display: flex; justify-content: space-between;">
                        <span>Soal: <span id="wg-count">0</span></span>
                        <span>👆 Klik pojok kiri 3x</span>
                        <span>v${CONFIG.version}</span>
                    </div>
                </div>
            </div>
        `;

        // Styling tambahan
        const style = document.createElement('style');
        style.innerHTML = `
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
