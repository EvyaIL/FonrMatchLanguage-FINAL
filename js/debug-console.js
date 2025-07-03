// Debug console overlay for troubleshooting
(function() {
    if (window.location.search.includes('debug=true')) {
        // Create debug overlay
        const debugOverlay = document.createElement('div');
        debugOverlay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 400px;
            height: 300px;
            background: rgba(0,0,0,0.9);
            color: #00ff00;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            padding: 10px;
            border-radius: 5px;
            overflow-y: auto;
            border: 2px solid #333;
        `;
        
        const debugHeader = document.createElement('div');
        debugHeader.style.cssText = 'color: #fff; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;';
        debugHeader.textContent = 'Debug Console';
        
        const debugContent = document.createElement('div');
        debugContent.id = 'debug-content';
        
        debugOverlay.appendChild(debugHeader);
        debugOverlay.appendChild(debugContent);
        document.body.appendChild(debugOverlay);
        
        // Capture console messages
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        function addDebugMessage(message, type = 'log') {
            const div = document.createElement('div');
            const color = type === 'error' ? '#ff6666' : type === 'warn' ? '#ffff66' : '#00ff00';
            div.style.color = color;
            div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            debugContent.appendChild(div);
            debugContent.scrollTop = debugContent.scrollHeight;
        }
        
        console.log = function(...args) {
            addDebugMessage(args.join(' '), 'log');
            originalLog.apply(console, args);
        };
        
        console.error = function(...args) {
            addDebugMessage(args.join(' '), 'error');
            originalError.apply(console, args);
        };
        
        console.warn = function(...args) {
            addDebugMessage(args.join(' '), 'warn');
            originalWarn.apply(console, args);
        };
        
        addDebugMessage('Debug console initialized');
    }
})();
