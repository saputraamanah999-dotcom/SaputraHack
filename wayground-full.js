// WAYGROUND TOOLS v5.0 - BY SAPUTRA
(function() {
    'use strict';
    
    // Notifikasi loading
    const notif = document.createElement('div');
    notif.style.cssText = 'position:fixed;top:10px;right:10px;background:#0f0;color:#000;padding:10px;border-radius:5px;z-index:999999;';
    notif.innerText = '✅ WAYGROUND TOOLS LOADING...';
    document.body.appendChild(notif);
    
    // Panel utama
    setTimeout(() => {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:450px;background:#0a0a0a;border:4px solid #0f0;border-radius:15px;padding:20px;color:#0f0;font-family:monospace;z-index:999999;box-shadow:0 0 30px #0f0;">
                <div style="display:flex;justify-content:space-between;">
                    <span style="color:#ff0;font-size:22px;">🎯 WAYGROUND TOOLS</span>
                    <button onclick="this.parentElement.parentElement.remove()" style="background:red;color:white;border:none;border-radius:5px;padding:5px 10px;">✖</button>
                </div>
                <div style="margin:15px 0;">
                    <input id="pin-input" type="text" placeholder="MASUKKAN PIN" style="width:100%;background:#000;color:#0f0;border:1px solid #0f0;border-radius:5px;padding:10px;">
                    <button id="join-btn" style="width:100%;margin-top:5px;background:#333;color:#0f0;border:1px solid #0f0;border-radius:5px;padding:10px;">JOIN</button>
                </div>
                <div style="display:flex;gap:5px;flex-wrap:wrap;">
                    <button class="tool-btn" data-action="answers">📋 JAWABAN</button>
                    <button class="tool-btn" data-action="auto">🤖 AUTO</button>
                    <button class="tool-btn" data-action="highlight">✨ HIGHLIGHT</button>
                    <button class="tool-btn" data-action="bypass">🛡️ BYPASS</button>
                    <button class="tool-btn" data-action="hide">👻 HIDE</button>
                </div>
                <div id="content" style="background:#000;padding:10px;margin-top:10px;min-height:200px;max-height:300px;overflow-y:auto;"></div>
                <div style="margin-top:10px;font-size:10px;color:#666;">Klik pojok kiri 5x untuk munculin lagi</div>
            </div>
        `;
        document.body.appendChild(panel);
        
        // Style
        const style = document.createElement('style');
        style.innerHTML = `
            .tool-btn{background:#333;color:#0f0;border:1px solid #0f0;border-radius:5px;padding:8px;margin:2px;cursor:pointer;flex:1;}
            .tool-btn:hover{background:#0f0;color:#000;}
        `;
        document.head.appendChild(style);
        
        // Fitur
        document.getElementById('join-btn').onclick = () => {
            const pin = document.getElementById('pin-input').value;
            alert('Join dengan PIN: ' + pin);
        };
        
        // Hapus notif
        notif.remove();
    }, 1000);
})();
