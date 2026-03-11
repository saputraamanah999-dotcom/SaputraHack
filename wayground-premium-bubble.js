// ===========================================
// WAYGROUND FINAL - VERSI PASTI BERFUNGSI
// ===========================================
(function() {
    'use strict';

    // --- 1. HAPUS INSTANCE LAMA ---
    if (document.getElementById('wg-final-panel-ok')) {
        document.getElementById('wg-final-panel-ok').remove();
    }

    console.log('%c[WG-FINAL] Memulai...', 'color: lime; font-size: 16px; font-weight: bold;');

    // --- 2. ANTI DETECTION SUPER SEDERHANA ---
    try { Object.defineProperty(document, 'hidden', { value: false }); } catch(e) {}
    try { Object.defineProperty(document, 'visibilityState', { value: 'visible' }); } catch(e) {}

    // ===========================================
    // 3. BUAT PANEL (HARUS MUNCUL!)
    // ===========================================
    const panel = document.createElement('div');
    panel.id = 'wg-final-panel-ok';
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 550px;
        max-width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        background: #111;
        border: 4px solid #00ff00;
        border-radius: 20px;
        padding: 20px;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        z-index: 9999999;
        box-shadow: 0 0 40px #00ff00;
    `;

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
            <span style="color: #ff0; font-size: 22px; font-weight: bold;">✅ WG FINAL</span>
            <button id="wg-final-close" style="background: #f00; color: #fff; border: none; border-radius: 5px; padding: 5px 15px; cursor: pointer; font-size: 16px;">✖</button>
        </div>

        <!-- PIN JOIN -->
        <div style="margin-bottom: 15px; display: flex; gap: 10px;">
            <input id="wg-final-pin" type="text" placeholder="Masukkan PIN Game" style="flex: 3; background: #000; color: #0f0; border: 2px solid #0f0; border-radius: 8px; padding: 12px; font-family: inherit;">
            <button id="wg-final-join" style="flex: 1; background: #0f0; color: #000; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; padding: 12px;">JOIN</button>
        </div>

        <!-- BUTTONS -->
        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px;">
            <button class="wg-final-btn" id="wg-final-scan">🔍 SCAN SOAL</button>
            <button class="wg-final-btn" id="wg-final-auto">🤖 AUTO JAWAB</button>
            <button class="wg-final-btn" id="wg-final-stop">⏹ STOP</button>
            <button class="wg-final-btn" id="wg-final-clear">🧹 CLEAR</button>
        </div>

        <!-- KONTEN -->
        <div id="wg-final-content" style="background: #000; padding: 15px; border-radius: 8px; min-height: 200px; max-height: 350px; overflow-y: auto; border: 1px solid #333;">
            <div style="color: #ff0; text-align: center;">⬆️ Klik <b>SCAN SOAL</b> untuk memulai</div>
        </div>

        <!-- STATUS -->
        <div style="margin-top: 15px; display: flex; justify-content: space-between; border-top: 1px solid #333; padding-top: 10px; color: #888; font-size: 12px;">
            <span>Soal: <span id="wg-final-count">0</span></span>
            <span>Status: <span id="wg-final-status">SIAP</span></span>
        </div>
    `;

    document.body.appendChild(panel);

    // --- 4. TAMBAHKAN STYLE UNTUK BUTTON ---
    const style = document.createElement('style');
    style.innerHTML = `
        .wg-final-btn {
            background: #333;
            color: #0f0;
            border: 1px solid #0f0;
            border-radius: 5px;
            padding: 10px 12px;
            cursor: pointer;
            flex: 1 0 auto;
            font-family: inherit;
            font-weight: bold;
            transition: 0.2s;
        }
        .wg-final-btn:hover {
            background: #0f0;
            color: #000;
            transform: scale(1.02);
        }
        .wg-highlight-final {
            border: 4px solid #0f0 !important;
            background: rgba(0, 255, 0, 0.15) !important;
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 5px #0f0; }
            50% { box-shadow: 0 0 15px #0f0; }
            100% { box-shadow: 0 0 5px #0f0; }
        }
    `;
    document.head.appendChild(style);

    // ===========================================
    // 5. STATE & VARIABEL GLOBAL
    // ===========================================
    let state = {
        soal: [],
        autoInterval: null
    };

    // ===========================================
    // 6. FUNGSI SUPER SCAN (COBA SEMUA CARA)
    // ===========================================
    function scanSemuaSoal() {
        updateStatus('SCANNING...');
        let hasilScan = [];
        let kontenPanel = document.getElementById('wg-final-content');
        
        try {
            console.log('[SCAN] Mencari soal...');

            // ---- CARA 1: LANGSUNG DARI WINDOW OBJECT ----
            if (window._questions && Array.isArray(window._questions) && window._questions.length > 0) {
                console.log('[SCAN] Method 1: window._questions');
                hasilScan = window._questions.map(q => ({
                    soal: q.text || q.question || q.title || 'Soal',
                    opsi: q.options || q.answers || [],
                    benar: q.correct ?? q.correctOption ?? 0
                }));
            }
            else if (window.quizData?.questions && window.quizData.questions.length > 0) {
                console.log('[SCAN] Method 2: window.quizData');
                hasilScan = window.quizData.questions.map(q => ({
                    soal: q.text || q.question || 'Soal',
                    opsi: q.options || q.answers || [],
                    benar: q.correct ?? q.correctOption ?? 0
                }));
            }
            else if (window.gameData?.questions && window.gameData.questions.length > 0) {
                console.log('[SCAN] Method 3: window.gameData');
                hasilScan = window.gameData.questions.map(q => ({
                    soal: q.q || q.text || q.question || 'Soal',
                    opsi: q.ops || q.options || q.answers || [],
                    benar: q.c ?? q.correct ?? 0
                }));
            }

            // ---- CARA 4: SCAN DOM DENGAN BERBAGAI SELECTOR ----
            if (hasilScan.length === 0) {
                console.log('[SCAN] Method 4: Scanning DOM...');
                // Daftar selector untuk soal
                const selectorSoal = [
                    '.question', '[data-question]', '.soal', '.quiz-question',
                    '.question-text', '.qtext', 'h2', 'h3', '.content'
                ];
                
                // Gabungkan semua selector
                let semuaSoal = document.querySelectorAll(selectorSoal.join(','));
                
                semuaSoal.forEach((elSoal, index) => {
                    let teksSoal = elSoal.innerText?.trim() || `Soal ${index+1}`;
                    if (teksSoal.length < 5) return; // Abaikan yang terlalu pendek
                    
                    let daftarOpsi = [];
                    let jawabanBenar = -1;

                    // Cari opsi di sekitar elemen soal
                    let elemenOpsi = elSoal.parentElement?.querySelectorAll(
                        'input[type="radio"] + label, .option, [data-option], .answer, .choice, li'
                    ) || [];

                    elemenOpsi.forEach((elOpt, idx) => {
                        let teksOpt = elOpt.innerText?.trim();
                        if (teksOpt && teksOpt.length > 0) {
                            daftarOpsi.push(teksOpt);
                            // Deteksi jawaban benar
                            if (elOpt.classList.contains('correct') || elOpt.dataset.correct === 'true' || elOpt.querySelector('input[checked]')) {
                                jawabanBenar = idx;
                            }
                        }
                    });

                    if (daftarOpsi.length > 0) {
                        hasilScan.push({
                            soal: teksSoal,
                            opsi: daftarOpsi,
                            benar: jawabanBenar
                        });
                    }
                });
            }

            // ---- CARA 5: CARI SEMUA RADIO BUTTON ----
            if (hasilScan.length === 0) {
                console.log('[SCAN] Method 5: Scanning radio buttons...');
                let radioGroups = {};
                document.querySelectorAll('input[type="radio"]').forEach(radio => {
                    let name = radio.name;
                    if (!radioGroups[name]) radioGroups[name] = [];
                    radioGroups[name].push(radio);
                });

                for (let group in radioGroups) {
                    let radios = radioGroups[group];
                    if (radios.length > 0) {
                        let soalText = radios[0].closest('div, section')?.previousElementSibling?.innerText || 'Soal';
                        let opsi = radios.map(r => r.nextElementSibling?.innerText || r.value || 'Opsi');
                        let benar = radios.findIndex(r => r.checked);
                        
                        hasilScan.push({
                            soal: soalText,
                            opsi: opsi,
                            benar: benar
                        });
                    }
                }
            }

            // Simpan hasil
            state.soal = hasilScan;
            document.getElementById('wg-final-count').innerText = hasilScan.length;

            // Tampilkan hasil
            if (hasilScan.length === 0) {
                kontenPanel.innerHTML = '<div style="color:orange; text-align:center;">❌ Tidak menemukan soal.<br>Mungkin soal belum muncul atau halaman berbeda.</div>';
            } else {
                tampilkanSoalKePanel(hasilScan);
            }

            updateStatus('READY');
            console.log(`[SCAN] Selesai. Ditemukan ${hasilScan.length} soal.`);

        } catch (error) {
            console.error('[SCAN] Error:', error);
            kontenPanel.innerHTML = `<div style="color:red;">Error saat scan: ${error.message}</div>`;
            updateStatus('ERROR');
        }
    }

    // ===========================================
    // 7. FUNGSI TAMPILKAN SOAL KE PANEL
    // ===========================================
    function tampilkanSoalKePanel(soal) {
        let konten = document.getElementById('wg-final-content');
        if (!konten) return;

        let html = `<div style="color:#ff0; margin-bottom:15px; text-align:center;">📊 DITEMUKAN ${soal.length} SOAL</div>`;
        
        soal.forEach((q, i) => {
            html += `<div style="margin-bottom:20px; border-left:4px solid #0f0; padding-left:12px;">`;
            html += `<div style="color:#ff0; font-weight:bold; margin-bottom:5px;">${i+1}. ${q.soal.substring(0, 80)}</div>`;
            
            if (q.opsi && q.opsi.length > 0) {
                q.opsi.forEach((opt, j) => {
                    let isBenar = (j === q.benar);
                    html += `<div style="margin-left:15px; margin-bottom:3px; color:${isBenar ? '#0f0' : '#999'};">`;
                    html += isBenar ? '✓ ' : '○ ';
                    html += `${String.fromCharCode(65+j)}. ${opt}`;
                    if (isBenar) html += ` ⬅️ JAWABAN`;
                    html += '</div>';
                });
            } else {
                html += `<div style="margin-left:15px; color:#f00;">Tidak ada opsi</div>`;
            }
            html += '</div>';
        });

        konten.innerHTML = html;
    }

    // ===========================================
    // 8. FUNGSI AUTO JAWAB
    // ===========================================
    function mulaiAutoJawab() {
        if (state.soal.length === 0) {
            alert('Tidak ada data soal. Klik SCAN SOAL dulu.');
            return;
        }

        if (state.autoInterval) clearInterval(state.autoInterval);
        
        tampilkanKeKonten('🤖 Mode AUTO dimulai...', '#0f0');
        updateStatus('AUTO');

        state.autoInterval = setInterval(() => {
            try {
                // Cari semua opsi yang tersedia
                let opsi = document.querySelectorAll('input[type="radio"]:not([disabled]), .option:not(.disabled), [data-option]:not(.disabled)');
                if (opsi.length === 0) return;

                // Cari teks soal yang aktif
                let teksSoalAktif = document.querySelector('.question, [data-question], .soal, h2, h3')?.innerText || '';

                for (let i = 0; i < state.soal.length; i++) {
                    let q = state.soal[i];
                    if (teksSoalAktif.includes(q.soal.substring(0, 30)) || q.soal.includes(teksSoalAktif.substring(0, 30))) {
                        let idxBenar = q.benar;
                        if (idxBenar >= 0 && idxBenar < opsi.length) {
                            let delay = 2000 + Math.random() * 3000;
                            setTimeout(() => {
                                opsi[idxBenar].click();
                                opsi[idxBenar].dispatchEvent(new Event('change', { bubbles: true }));
                                console.log(`[AUTO] Menjawab soal ${i+1}`);
                            }, delay);
                        }
                        break;
                    }
                }
            } catch (e) {
                console.log('[AUTO] Error:', e);
            }
        }, 4000);
    }

    // ===========================================
    // 9. FUNGSI JOIN GAME
    // ===========================================
    function joinGame(pin) {
        if (!pin || pin.length < 3) {
            alert('PIN tidak valid');
            return;
        }

        // Isi semua input
        document.querySelectorAll('input[type="text"], input[type="number"], .pin-input').forEach(input => {
            input.value = pin;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // Klik tombol join
        setTimeout(() => {
            document.querySelectorAll('button, .btn, .button').forEach(btn => {
                let teks = btn.innerText.toLowerCase();
                if (teks.includes('join') || teks.includes('masuk') || teks.includes('play')) {
                    btn.click();
                }
            });
        }, 400);
    }

    // ===========================================
    // 10. FUNGSI-FUNGSI PEMBANTU
    // ===========================================
    function updateStatus(status) {
        document.getElementById('wg-final-status').innerText = status;
    }

    function tampilkanKeKonten(teks, warna = '#fff') {
        document.getElementById('wg-final-content').innerHTML = `<div style="color:${warna}; text-align:center;">${teks}</div>`;
    }

    // ===========================================
    // 11. PASANG EVENT LISTENER
    // ===========================================
    document.getElementById('wg-final-close').onclick = () => {
        if (state.autoInterval) clearInterval(state.autoInterval);
        panel.remove();
    };

    document.getElementById('wg-final-scan').onclick = scanSemuaSoal;
    
    document.getElementById('wg-final-auto').onclick = mulaiAutoJawab;
    
    document.getElementById('wg-final-stop').onclick = () => {
        if (state.autoInterval) {
            clearInterval(state.autoInterval);
            state.autoInterval = null;
        }
        tampilkanKeKonten('⏹ Auto dihentikan', '#f00');
        updateStatus('STOP');
    };

    document.getElementById('wg-final-clear').onclick = () => {
        state.soal = [];
        document.getElementById('wg-final-count').innerText = '0';
        tampilkanKeKonten('🧹 Panel dibersihkan. Klik <b>SCAN SOAL</b> lagi.', '#ff0');
        updateStatus('CLEAR');
    };

    document.getElementById('wg-final-join').onclick = () => {
        joinGame(document.getElementById('wg-final-pin').value);
    };

    document.getElementById('wg-final-pin').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('wg-final-join').click();
        }
    });

    // ===========================================
    // 12. FINAL TOUCH
    // ===========================================
    console.log('%c[WG-FINAL] Panel siap digunakan!', 'color:lime;');
    updateStatus('SIAP');

})();
