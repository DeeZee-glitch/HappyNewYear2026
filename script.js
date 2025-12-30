const cakeCursor = document.getElementById("cake-cursor");
const submitButton = document.getElementById("submit-wish");
const wishTextarea = document.getElementById("wish");
const wisherNameInput = document.getElementById("wisher-name");
const wishesBoard = document.getElementById("wishes-board");
const loadingMessage = document.getElementById("loading-message");
const balloonsContainer = document.getElementById("balloons");
const cards = document.querySelectorAll('.card');

// Get user's IP address
async function getUserIP() {
    try {
        // Try using ipify service (free, no API key required)
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.log('Could not fetch IP address:', error);
        return null;
    }
}

// Get device information
function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    
    // Detect device type
    let deviceType = 'desktop';
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
        deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
    }
    
    // Detect browser
    let browser = 'unknown';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Edg')) browser = 'Edge';
    else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';
    
    // Detect OS
    let os = 'unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
    
    return {
        device_type: deviceType,
        browser: browser,
        os: os,
        platform: platform,
        language: language,
        user_agent: userAgent.substring(0, 200) // Limit length
    };
}

// Follow the cursor with the New Year emoji
document.addEventListener("mousemove", (e) => {
    cakeCursor.style.left = `${e.pageX - 40}px`;
    cakeCursor.style.top = `${e.pageY - 40}px`;
});

// Confetti effect when clicking on the page
document.addEventListener("click", (e) => {
    // Create confetti at click position
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: x, y: y },
        colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe']
    });
    
    // Play a subtle sound effect (optional - browser may require user interaction first)
    playSound();
});

// LocalStorage functions for wishes
function saveWishToLocalStorage(wishData) {
    try {
        const wishes = getWishesFromLocalStorage();
        // Add unique ID if not present
        if (!wishData.id) {
            wishData.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        }
        wishes.unshift(wishData); // Add to beginning
        // Keep only last 100 wishes in localStorage
        const limitedWishes = wishes.slice(0, 100);
        localStorage.setItem('newyear_wishes', JSON.stringify(limitedWishes));
        return wishData;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return null;
    }
}

function getWishesFromLocalStorage() {
    try {
        const wishesJson = localStorage.getItem('newyear_wishes');
        return wishesJson ? JSON.parse(wishesJson) : [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
}

// Submit a New Year wish
submitButton.addEventListener("click", async () => {
    const wishMessage = wishTextarea.value.trim();
    const wisherName = wisherNameInput.value.trim() || "Anonymous";
    
    if (wishMessage) {
        // Disable button during submission
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
        
        try {
            // Get IP address and device info
            const ipAddress = await getUserIP();
            const deviceInfo = getDeviceInfo();
            
            // Create wish data
            const wishData = {
                message: wishMessage,
                wisher_name: wisherName,
                ip_address: ipAddress,
                device_info: deviceInfo,
                created_at: new Date().toISOString(),
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
            };
            
            // Save to localStorage first (for immediate display)
            const savedWish = saveWishToLocalStorage(wishData);
            
            if (savedWish) {
                // Display the wish on the board immediately
                addWishToBoard({ ...savedWish, isNew: true });
                
                // Clear the inputs
                wishTextarea.value = '';
                wisherNameInput.value = '';
                
                // Create confetti celebration
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe']
                });
                
                // Play sound
                playSound();
                
                // Show success message
                showNotification("Your wish has been submitted! 🎉");
            }
            
            // Save to Supabase database in the background (for analytics)
            // This happens silently - user doesn't need to wait for it
            if (supabaseClient) {
                supabaseClient
                    .from('birthday_wishes')  // Using original table name - change to 'newyear_wishes' if you created a new table
                    .insert([
                        {
                            message: wishMessage,
                            wisher_name: wisherName,
                            ip_address: ipAddress,
                            device_info: deviceInfo,
                            created_at: new Date().toISOString()
                        }
                    ])
                    .then(({ data, error }) => {
                        if (error) {
                            console.error('Error saving wish to database:', error);
                            console.error('Error details:', JSON.stringify(error, null, 2));
                            // Show a subtle notification if database save fails
                            if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
                                console.warn('Table does not exist. Please create the table in Supabase.');
                            }
                        } else {
                            console.log('✅ Wish saved to database for analytics:', data);
                        }
                    })
                    .catch(error => {
                        console.error('Error saving wish to database (non-critical):', error);
                    });
            } else {
                console.warn('Supabase client not initialized. Wishes saved to localStorage only.');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showNotification("Error submitting wish. Please try again.", "error");
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = "Submit Wish";
        }
    } else {
        showNotification("Please write a wish! 💭", "error");
    }
});

// Add wish to the board
function addWishToBoard(wishData) {
    // Check if wish already exists (for real-time updates)
    if (wishData.id) {
        const existingWish = document.querySelector(`[data-wish-id="${wishData.id}"]`);
        if (existingWish) {
            return; // Wish already displayed
        }
    }
    
    const wishCard = document.createElement("div");
    wishCard.className = "wish-card";
    if (wishData.id) {
        wishCard.setAttribute('data-wish-id', wishData.id);
    }
    
    const emojis = ["🎊", "🎉", "🎈", "🎁", "🌟", "✨", "🎆", "💝"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const wishDate = new Date(wishData.created_at);
    const formattedDate = wishDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    wishCard.innerHTML = `
        <div class="wish-card-header">
            <div class="wish-card-emoji">${randomEmoji}</div>
            <div class="wish-card-name">${escapeHtml(wishData.wisher_name || 'Anonymous')}</div>
        </div>
        <div class="wish-card-message">${escapeHtml(wishData.message)}</div>
        <div class="wish-card-time">${formattedDate}</div>
    `;
    
    // Remove loading message if it exists
    if (loadingMessage && loadingMessage.parentNode) {
        loadingMessage.remove();
    }
    
    // Add to the beginning of the board
    wishesBoard.insertBefore(wishCard, wishesBoard.firstChild);
    
    // Scroll to the new wish (only if it's a new submission, not on page load)
    if (wishData.isNew) {
        wishCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

// Load wishes from localStorage
// Each user only sees their own wishes stored in their browser
function loadWishesFromLocalStorage() {
    try {
        console.log('Loading wishes from localStorage...');
        const wishes = getWishesFromLocalStorage();
        
        // Remove loading message
        if (loadingMessage && loadingMessage.parentNode) {
            loadingMessage.remove();
        }
        
        // Display wishes - only the user's own wishes
        if (wishes && wishes.length > 0) {
            // Sort by created_at (newest first)
            wishes.sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return dateB - dateA;
            });
            
            wishes.forEach(wish => {
                addWishToBoard(wish);
            });
            
            console.log(`Loaded ${wishes.length} wishes from localStorage`);
        } else {
            // Show message if no wishes
            const noWishesMsg = document.createElement("div");
            noWishesMsg.className = "loading-message";
            noWishesMsg.textContent = "No wishes yet. Be the first to leave a wish! 💝";
            noWishesMsg.style.gridColumn = "1 / -1";
            wishesBoard.appendChild(noWishesMsg);
        }
    } catch (error) {
        console.error('Error loading wishes from localStorage:', error);
        if (loadingMessage) {
            loadingMessage.textContent = "Error loading wishes. Please refresh the page.";
            loadingMessage.style.color = "rgba(255, 200, 200, 0.9)";
        }
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === "error" ? "#ff4444" : "#4CAF50"};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = "slideOutRight 0.3s ease";
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Create floating balloons
function createBalloon() {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    
    const balloonEmojis = ["🎈", "🎉", "🎊", "🎁", "🎆", "✨"];
    const randomEmoji = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
    balloon.textContent = randomEmoji;
    
    const startX = Math.random() * window.innerWidth;
    balloon.style.left = `${startX}px`;
    balloon.style.animationDelay = `${Math.random() * 5}s`;
    balloon.style.animationDuration = `${10 + Math.random() * 10}s`;
    
    balloonsContainer.appendChild(balloon);
    
    // Remove balloon after animation
    setTimeout(() => {
        if (balloon.parentNode) {
            balloon.parentNode.removeChild(balloon);
        }
    }, 20000);
}

// Create balloons periodically
setInterval(createBalloon, 3000);
createBalloon(); // Create initial balloon

// Play sound effect (using Web Audio API for a simple beep)
function playSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = "sine";
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        // Silently fail if audio context is not available
        console.log("Audio not available");
    }
}

// Add keyboard support for submitting wishes
wishTextarea.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
        submitButton.click();
    }
});

// Card flip functionality
cards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        
        // Add confetti when card is flipped
        if (card.classList.contains('flipped')) {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { 
                    x: (card.getBoundingClientRect().left + card.offsetWidth / 2) / window.innerWidth,
                    y: (card.getBoundingClientRect().top + card.offsetHeight / 2) / window.innerHeight
                },
                colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe']
            });
            playSound();
        }
    });
    
});

// Load wishes when page loads
window.addEventListener("load", () => {
    // Load wishes from localStorage - each user only sees their own wishes
    loadWishesFromLocalStorage();
    
    // Welcome confetti
    setTimeout(() => {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe']
        });
    }, 500);
    
    // Note: Real-time subscription removed since we're displaying from localStorage
    // Wishes are still saved to database for analytics, but displayed from localStorage
});

