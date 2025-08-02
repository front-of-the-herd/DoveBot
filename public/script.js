class DoveBot {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.messagesContainer = document.getElementById('messages');
        
        // Check if all elements are found
        if (!this.messageInput) {
            console.error('Message input element not found');
            return;
        }
        if (!this.sendButton) {
            console.error('Send button element not found');
            return;
        }
        if (!this.messagesContainer) {
            console.error('Messages container element not found');
            return;
        }
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Add visibility check
        setInterval(() => {
            const inputVisible = this.messageInput.offsetParent !== null;
            const buttonVisible = this.sendButton.offsetParent !== null;
            
            if (!inputVisible || !buttonVisible) {
                console.warn('Input elements not visible:', { inputVisible, buttonVisible });
                // Force visibility
                this.messageInput.style.display = 'block';
                this.sendButton.style.display = 'block';
            }
        }, 5000); // Check every 5 seconds
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.appendMessage(message, true);
        this.messageInput.value = '';
        this.setLoading(true);
        
        try {
            // Send to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.appendMessage(data.response);
            } else {
                this.appendMessage('Sorry, something went wrong. Please try again!');
            }
        } catch (error) {
            console.error('Error:', error);
            this.appendMessage('Sorry, I cannot connect right now. Please try again later!');
        } finally {
            this.setLoading(false);
            // Ensure input is re-enabled and focused
            this.messageInput.disabled = false;
            this.messageInput.focus();
        }
    }
    
    appendMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = message;
        this.messagesContainer.appendChild(messageDiv);
        
        // Auto-scroll to the latest message
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        // Ensure input is visible after adding message
        setTimeout(() => {
            if (this.messageInput.style.display === 'none') {
                this.messageInput.style.display = 'block';
            }
            if (this.sendButton.style.display === 'none') {
                this.sendButton.style.display = 'block';
            }
        }, 100);
    }
    
    setLoading(isLoading) {
        this.sendButton.disabled = isLoading;
        this.messageInput.disabled = isLoading;
        
        if (isLoading) {
            // Add typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot-message typing-indicator';
            typingDiv.innerHTML = `
                <div class="message-content">
                    DoveBot is thinking
                    <div class="typing-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            `;
            this.messagesContainer.appendChild(typingDiv);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        } else {
            // Remove typing indicator
            const typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            // Ensure input is re-enabled
            this.messageInput.disabled = false;
            this.sendButton.disabled = false;
        }
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    try {
        const doveBot = new DoveBot();
        console.log('DoveBot initialized successfully');
    } catch (error) {
        console.error('Failed to initialize DoveBot:', error);
    }
});