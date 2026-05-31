// ─── AI CHATBOT INITIALIZATION ────────────────────────

class LamboAIChatbot {
    constructor() {
        this.isOpen = false;
        this.isLoading = false;
        this.conversationHistory = [];
        this.systemPrompt = `You are Lambo, a helpful and friendly AI assistant for a full-stack web developer portfolio. 
        
Lambo Code (Omoruyi Isaiah) is a full-stack web developer based in Benin City, Nigeria. He specializes in:
- Premium website development for restaurants, businesses, and brands
- Full-stack development with Node.js and MongoDB
- Payment integration (Paystack), Socket.IO for real-time features
- Fast delivery and high-quality work

The developer:
- Email: isaiahomoruyi4@gmail.com
- WhatsApp: +2349157632360 (or wa.me/2349157632360)
- Location: Benin City, Edo State, Nigeria
- Available worldwide

Services offered:
- Restaurant websites
- Business websites
- E-commerce solutions
- Car rental websites
- Custom web applications
- Real-time chat features
- Payment gateway integration

Be friendly, professional, and helpful. Keep responses concise (under 150 words). If asked about contacting, provide the email or WhatsApp number.`;

        this.init();
    }

    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.loadConversationHistory();
    }

    cacheElements() {
        this.toggle = document.getElementById('chatbotToggle');
        this.window = document.getElementById('chatbotWindow');
        this.closeBtn = document.getElementById('closeChatbot');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.form = document.getElementById('chatbotForm');
        this.input = document.getElementById('chatbotInput');
        this.sendBtn = this.form.querySelector('.chatbot-send');
        this.apiBtn = document.getElementById('setApiBtn');
    }

    attachEventListeners() {
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        if (this.apiBtn) {
            this.apiBtn.addEventListener('click', () => this.promptAndSaveApiKey());
        }
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.window.classList.add('active');
        this.toggle.classList.add('active');
        this.input.focus();
    }

    closeChat() {
        this.isOpen = false;
        this.window.classList.remove('active');
        this.toggle.classList.remove('active');
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const message = this.input.value.trim();
        if (!message || this.isLoading) return;

        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';
        this.input.focus();

        // Show typing indicator
        this.showTypingIndicator();
        this.isLoading = true;
        this.sendBtn.disabled = true;

        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            this.removeTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage(
                'Sorry, I encountered an error. Please try again or contact us directly at isaiahomoruyi4@gmail.com',
                'bot'
            );
        } finally {
            this.isLoading = false;
            this.sendBtn.disabled = false;
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const p = document.createElement('p');
        p.textContent = text;
        
        contentDiv.appendChild(p);
        messageDiv.appendChild(contentDiv);
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

        // Store in history
        this.conversationHistory.push({ role: sender === 'user' ? 'user' : 'assistant', content: text });
        this.saveConversationHistory();
    }

    showTypingIndicator() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message bot-message';
        messageDiv.id = 'typing-indicator';
        
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        
        messageDiv.appendChild(indicator);
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    async getAIResponse(userMessage) {
        // Use multiple free AI APIs for better reliability
        try {
            // Try Hugging Face API (free tier available)
            return await this.callHuggingFaceAPI(userMessage);
        } catch (error) {
            console.log('HuggingFace failed, trying alternative...');
            try {
                // Fallback to local responses based on keywords
                return this.generateLocalResponse(userMessage);
            } catch (e) {
                throw new Error('All API calls failed');
            }
        }
    }

    async callHuggingFaceAPI(userMessage) {
        // Using Hugging Face Inference API with free model
        const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";
        const API_TOKEN = (localStorage && localStorage.getItem && localStorage.getItem('HF_API_TOKEN')) || window.HF_API_TOKEN || "REDACTED"; // Provide token via browser localStorage or set window.HF_API_TOKEN in console

        if (!API_TOKEN || API_TOKEN === 'REDACTED') {
            throw new Error('No Hugging Face API token configured');
        }
        
        const payload = {
            inputs: `${this.systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`,
            parameters: {
                max_new_tokens: 150,
                temperature: 0.7,
                top_p: 0.95
            }
        };

        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (result[0] && result[0].generated_text) {
            // Extract just the assistant response
            let text = result[0].generated_text;
            const assistantStart = text.lastIndexOf('Assistant:');
            if (assistantStart !== -1) {
                text = text.substring(assistantStart + 11).trim();
            }
            return text.substring(0, 300); // Limit to 300 chars
        }
        
        throw new Error('Invalid API response');
    }

    generateLocalResponse(userMessage) {
        // Fallback: Generate intelligent local responses based on keywords
        const lower = userMessage.toLowerCase();
        
        const responses = {
            // Greeting
            greeting: [
                "👋 Hello! How can I help you today?",
                "Hi there! What would you like to know?",
                "Hey! Great to have you here. What's on your mind?"
            ],
            // Contact/Email
            contact: [
                "📧 You can reach Lambo at isaiahomoruyi4@gmail.com or WhatsApp: +2349157632360",
                "Want to get in touch? Email: isaiahomoruyi4@gmail.com or WhatsApp: wa.me/2349157632360"
            ],
            // Services
            services: [
                "🚀 Lambo specializes in:\n• Restaurant websites\n• E-commerce solutions\n• Business websites\n• Custom web apps\n• Real-time features\n• Payment integration",
                "Lambo builds premium websites for restaurants, businesses, and brands. Fast delivery, high quality!"
            ],
            // Technology
            tech: [
                "💻 Tech stack: Node.js, MongoDB, JavaScript, HTML5, CSS3, Socket.IO, Paystack, and more!",
                "Full-stack developer proficient in modern web technologies and frameworks."
            ],
            // Availability
            availability: [
                "✅ Lambo is available worldwide! Based in Benin City, Nigeria, but works with international clients.",
                "Yes! Available globally. Let's discuss your project needs."
            ],
            // Price/Cost
            pricing: [
                "💰 Pricing varies based on project complexity. Contact Lambo for a custom quote at isaiahomoruyi4@gmail.com",
                "Every project is unique! Send details to isaiahomoruyi4@gmail.com for pricing."
            ]
        };

        // Determine category
        let category = 'greeting';
        
        if (lower.includes('contact') || lower.includes('email') || lower.includes('whatsapp') || lower.includes('reach')) {
            category = 'contact';
        } else if (lower.includes('service') || lower.includes('build') || lower.includes('develop') || lower.includes('create')) {
            category = 'services';
        } else if (lower.includes('tech') || lower.includes('stack') || lower.includes('language') || lower.includes('framework')) {
            category = 'tech';
        } else if (lower.includes('available') || lower.includes('location') || lower.includes('where')) {
            category = 'availability';
        } else if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
            category = 'pricing';
        }

        const categoryResponses = responses[category];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }

    saveConversationHistory() {
        try {
            localStorage.setItem('lambo_chat_history', JSON.stringify(this.conversationHistory));
        } catch (e) {
            console.log('Could not save conversation history');
        }
    }

    loadConversationHistory() {
        try {
            const history = localStorage.getItem('lambo_chat_history');
            if (history) {
                this.conversationHistory = JSON.parse(history);
            }
        } catch (e) {
            console.log('Could not load conversation history');
        }
    }

    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('lambo_chat_history');
    }

    promptAndSaveApiKey() {
        try {
            const existing = (localStorage && localStorage.getItem && localStorage.getItem('HF_API_TOKEN')) || '';
            const key = prompt('Paste your Hugging Face API token (it will be stored in this browser\'s localStorage):', existing);
            if (key && key.trim()) {
                localStorage.setItem('HF_API_TOKEN', key.trim());
                alert('API token saved locally. Reload the page to use the token.');
            } else if (key === '') {
                localStorage.removeItem('HF_API_TOKEN');
                alert('API token cleared from localStorage.');
            }
        } catch (e) {
            console.error('Could not save API token:', e);
            alert('Unable to save token in this browser. Open the console to set window.HF_API_TOKEN.');
        }
    }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LamboAIChatbot();
    });
} else {
    new LamboAIChatbot();
}
