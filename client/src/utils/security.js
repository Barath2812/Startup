// Security utilities for preventing screen inspection and other security threats

// Disable right-click context menu
export const disableRightClick = () => {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
};

// Disable keyboard shortcuts for developer tools
export const disableDevTools = () => {
    // Disable F12 key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            return false;
        }
    });
};

// Disable text selection
export const disableTextSelection = () => {
    document.addEventListener('selectstart', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Apply CSS to prevent text selection
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
        }
        
        input, textarea {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
    `;
    document.head.appendChild(style);
};

// Disable drag and drop
export const disableDragDrop = () => {
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('drop', (e) => {
        e.preventDefault();
        return false;
    });
};

// Detect if developer tools are open
export const detectDevTools = () => {
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(() => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            if (!devtools.open) {
                devtools.open = true;
                devtools.orientation = widthThreshold ? 'vertical' : 'horizontal';
                handleDevToolsOpen();
            }
        } else {
            devtools.open = false;
            devtools.orientation = null;
        }
    }, 500);
    
    return devtools;
};

// Handle when developer tools are detected
const handleDevToolsOpen = () => {
    // Clear the page content
    document.body.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #000;
            color: #fff;
            font-family: Arial, sans-serif;
            text-align: center;
        ">
            <div>
                <h1>⚠️ Security Alert</h1>
                <p>Developer tools are not allowed on this application.</p>
                <p>Please close the developer tools to continue.</p>
            </div>
        </div>
    `;
    
    // Disable all interactions
    document.addEventListener('click', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => e.preventDefault());
};

// Disable console logging in production
export const disableConsole = () => {
    if (process.env.NODE_ENV === 'production') {
        // Override console methods
        console.log = () => {};
        console.warn = () => {};
        console.error = () => {};
        console.info = () => {};
        console.debug = () => {};
    }
};

// Disable screen capture and recording
export const disableScreenCapture = () => {
    // Request screen capture permission and immediately deny it
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia = () => {
            return Promise.reject(new Error('Screen capture is not allowed'));
        };
    }
    
    // Disable print functionality
    window.addEventListener('beforeprint', (e) => {
        e.preventDefault();
        return false;
    });
};

// Disable browser back button
export const disableBackButton = () => {
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', () => {
        window.history.pushState(null, null, window.location.href);
    });
};

// Disable browser refresh
export const disableRefresh = () => {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            return false;
        }
        
        if (e.key === 'F5') {
            e.preventDefault();
            return false;
        }
    });
};

// Initialize all security measures
export const initializeSecurity = () => {
    disableRightClick();
    disableDevTools();
    disableTextSelection();
    disableDragDrop();
    detectDevTools();
    disableConsole();
    disableScreenCapture();
    disableBackButton();
    disableRefresh();
    
    console.log('Security measures initialized');
};



// Disable image saving
export const disableImageSaving = () => {
    // Add CSS to prevent image dragging
    const style = document.createElement('style');
    style.textContent = `
        img {
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    // Prevent image context menu
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });
};

// Disable copy functionality
export const disableCopy = () => {
    document.addEventListener('copy', (e) => {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('cut', (e) => {
        e.preventDefault();
        return false;
    });
};

// Disable paste functionality
export const disablePaste = () => {
    document.addEventListener('paste', (e) => {
        e.preventDefault();
        return false;
    });
};

// Full security initialization
export const initializeFullSecurity = () => {
    initializeSecurity();
    disableImageSaving();
    disableCopy();
    disablePaste();
    
    console.log('Security measures initialized');
};
