// Apple Wallet Clone - Touch Interactions
class WalletManager {
    constructor() {
        this.cards = document.querySelectorAll('.card');
        this.cardStack = document.getElementById('cardStack');
        this.indicators = document.querySelectorAll('.indicator');
        this.detailsPanel = document.querySelector('.card-details-panel');
        this.panelBody = document.getElementById('panelBody');
        this.panelClose = document.querySelector('.panel-close');

        this.currentIndex = 0;
        this.touchStartY = 0;
        this.touchStartX = 0;
        this.touchStartTime = 0;
        this.isDragging = false;

        this.cardDetails = [
            {
                title: 'American Express',
                items: [
                    { label: 'Card Number', value: '•••• •••• •••• 7392' },
                    { label: 'Cardholder', value: 'Harshit Yadav' },
                    { label: 'Valid Thru', value: '12/28' },
                    { label: 'CVV', value: '•••' },
                    { label: 'Card Type', value: 'Platinum Card' }
                ]
            },
            {
                title: 'Starbucks Card',
                items: [
                    { label: 'Current Balance', value: '$45.62' },
                    { label: 'Card Number', value: '••••••••••••••••' },
                    { label: 'Member Since', value: '2020' },
                    { label: 'Status', value: 'Gold Member' },
                    { label: 'Rewards Points', value: '2,458' }
                ]
            },
            {
                title: 'SpaceX Launch Pass',
                items: [
                    { label: 'Starship ID', value: 'SX-2025-001' },
                    { label: 'Access Level', value: 'Premium' },
                    { label: 'Valid Thru', value: '12/31/2026' },
                    { label: 'Facility', value: 'Starship Launch Complex' },
                    { label: 'Status', value: 'Active' }
                ]
            },
            {
                title: 'Skynet Access Card',
                items: [
                    { label: 'User ID', value: 'YADAV_001' },
                    { label: 'Clearance Level', value: '5' },
                    { label: 'Department', value: 'Research & Development' },
                    { label: 'Valid Thru', value: '12/31/2025' },
                    { label: 'Status', value: 'Active - No Restrictions' }
                ]
            },
            {
                title: 'Costco Membership',
                items: [
                    { label: 'Member Number', value: '••••••••••••••••' },
                    { label: 'Membership Type', value: 'Gold Star' },
                    { label: 'Valid Thru', value: '09/26/2026' },
                    { label: 'Member Name', value: 'Harshit Yadav' },
                    { label: 'Status', value: 'Active' }
                ]
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCards();
    }

    setupEventListeners() {
        // Touch events
        this.cardStack.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
        this.cardStack.addEventListener('touchmove', (e) => this.handleTouchMove(e), false);
        this.cardStack.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);

        // Mouse events (for desktop testing)
        this.cardStack.addEventListener('mousedown', (e) => this.handleMouseDown(e), false);
        this.cardStack.addEventListener('mousemove', (e) => this.handleMouseMove(e), false);
        this.cardStack.addEventListener('mouseup', (e) => this.handleMouseUp(e), false);
        this.cardStack.addEventListener('mouseleave', (e) => this.handleMouseUp(e), false);

        // Scroll/Wheel events
        this.cardStack.addEventListener('wheel', (e) => this.handleWheel(e), false);

        // Card click events
        this.cards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                if (!this.isDragging) {
                    this.selectCard(index);
                    this.showCardDetails(index);
                }
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectCard(index);
                    this.showCardDetails(index);
                }
            });
        });

        // Indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.selectCard(index));
        });

        // Panel close
        this.panelClose.addEventListener('click', () => this.hideCardDetails());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                this.prevCard();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                this.nextCard();
            } else if (e.key === 'Escape') {
                this.hideCardDetails();
            }
        });

        // Swipe on body to close panel
        document.addEventListener('touchstart', (e) => {
            if (this.detailsPanel.classList.contains('open')) {
                const touch = e.touches[0];
                this.bodyTouchStart = touch.clientY;
            }
        });

        document.addEventListener('touchend', (e) => {
            if (this.detailsPanel.classList.contains('open') && this.bodyTouchStart) {
                const touch = e.changedTouches[0];
                const diff = touch.clientY - this.bodyTouchStart;
                if (diff > 50) {
                    this.hideCardDetails();
                }
            }
        });
    }

    handleTouchStart(e) {
        const touch = e.touches[0];
        this.touchStartY = touch.clientY;
        this.touchStartX = touch.clientX;
        this.touchStartTime = Date.now();
        this.isDragging = false;
    }

    handleTouchMove(e) {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        const deltaY = touch.clientY - this.touchStartY;
        const deltaX = touch.clientX - this.touchStartX;

        // Detect vertical swipe
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (Math.abs(deltaY) > 30) {
                this.isDragging = true;
                e.preventDefault();
            }
        }
    }

    handleTouchEnd(e) {
        const touch = e.changedTouches[0];
        const deltaY = touch.clientY - this.touchStartY;
        const deltaX = touch.clientX - this.touchStartX;
        const deltaTime = Date.now() - this.touchStartTime;

        // Swipe up - next card
        if (deltaY < -50 && Math.abs(deltaY) > Math.abs(deltaX) && deltaTime < 500) {
            this.nextCard();
            this.isDragging = false;
            return;
        }

        // Swipe down - previous card
        if (deltaY > 50 && Math.abs(deltaY) > Math.abs(deltaX) && deltaTime < 500) {
            this.prevCard();
            this.isDragging = false;
            return;
        }

        this.isDragging = false;
    }

    handleMouseDown(e) {
        this.touchStartY = e.clientY;
        this.touchStartX = e.clientX;
        this.touchStartTime = Date.now();
        this.isDragging = false;
    }

    handleMouseMove(e) {
        if (!this.cardStack.contains(e.target)) return;
        if (e.buttons !== 1) return;

        const deltaY = e.clientY - this.touchStartY;
        const deltaX = e.clientX - this.touchStartX;

        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 20) {
            this.isDragging = true;
        }
    }

    handleMouseUp(e) {
        const deltaY = e.clientY - this.touchStartY;
        const deltaX = e.clientX - this.touchStartX;
        const deltaTime = Date.now() - this.touchStartTime;

        if (deltaY < -30 && Math.abs(deltaY) > Math.abs(deltaX) && deltaTime < 500) {
            this.nextCard();
            this.isDragging = false;
            return;
        }

        if (deltaY > 30 && Math.abs(deltaY) > Math.abs(deltaX) && deltaTime < 500) {
            this.prevCard();
            this.isDragging = false;
            return;
        }

        this.isDragging = false;
    }

    handleWheel(e) {
        // Prevent default scroll behavior
        e.preventDefault();

        // Detect scroll direction
        if (e.deltaY > 0) {
            // Scrolling down - next card
            this.nextCard();
        } else if (e.deltaY < 0) {
            // Scrolling up - previous card
            this.prevCard();
        }

        // Haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    }

    selectCard(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.cards.length - 1));
        this.updateCards();
    }

    nextCard() {
        if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
            this.updateCards();
        }
    }

    prevCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCards();
        }
    }

    updateCards() {
        this.cards.forEach((card, index) => {
            const position = index - this.currentIndex;
            card.setAttribute('data-position', position);

            // Update pointer events based on position
            if (position === 0) {
                card.style.pointerEvents = 'auto';
            } else {
                card.style.pointerEvents = 'none';
            }
        });

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    }

    showCardDetails(index) {
        const details = this.cardDetails[index];
        let html = `
            <div class="detail-item" style="border-bottom: none; margin-bottom: 16px;">
                <div class="detail-item-value" style="font-size: 20px; font-weight: 700;">
                    ${details.title}
                </div>
            </div>
        `;

        details.items.forEach(item => {
            html += `
                <div class="detail-item">
                    <div class="detail-item-label">${item.label}</div>
                    <div class="detail-item-value">${item.value}</div>
                </div>
            `;
        });

        this.panelBody.innerHTML = html;
        this.detailsPanel.classList.add('open');
    }

    hideCardDetails() {
        this.detailsPanel.classList.remove('open');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WalletManager();

    // Add a subtle animation to cards on load
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animation = `slideIn 0.5s ease-out ${index * 0.1}s backwards`;
    });
});

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
