// Samsung Wallet Clone - Interactive Card Management
class SamsungWalletManager {
    constructor() {
        this.cards = document.querySelectorAll('.card');
        this.categoryTabs = document.querySelectorAll('.category-tab');
        this.detailsPanel = document.querySelector('.card-details-panel');
        this.panelBody = document.getElementById('panelBody');
        this.panelClose = document.querySelector('.panel-close');
        this.navItems = document.querySelectorAll('.nav-item');

        this.currentCategory = 'all';
        this.touchStartY = 0;
        this.touchStartX = 0;
        this.isPanelDragging = false;

        this.cardDetails = [
            {
                title: 'American Express',
                items: [
                    { label: 'Card Number', value: '•••• •••• •••• 7392' },
                    { label: 'Cardholder', value: 'Harshit Yadav' },
                    { label: 'Valid Thru', value: '12/28' },
                    { label: 'Card Type', value: 'Platinum Card' },
                    { label: 'CVV', value: '•••' }
                ]
            },
            {
                title: 'Samsung Debit Card',
                items: [
                    { label: 'Card Number', value: '•••• •••• •••• 8432' },
                    { label: 'Cardholder', value: 'Harshit Yadav' },
                    { label: 'Valid Thru', value: '06/27' },
                    { label: 'Card Type', value: 'Samsung Pay Debit' },
                    { label: 'Bank', value: 'Samsung Bank' }
                ]
            },
            {
                title: 'Starbucks Rewards',
                items: [
                    { label: 'Current Balance', value: '$45.62' },
                    { label: 'Rewards Points', value: '2,458 ★' },
                    { label: 'Membership Status', value: 'Gold Member' },
                    { label: 'Member Since', value: '2020' },
                    { label: 'Card Number', value: '••••••••••••••••' }
                ]
            },
            {
                title: 'Costco Membership',
                items: [
                    { label: 'Member Number', value: '••••••••1234' },
                    { label: 'Membership Type', value: 'Gold Star' },
                    { label: 'Member Name', value: 'Harshit Yadav' },
                    { label: 'Valid Thru', value: '09/26' },
                    { label: 'Status', value: 'Active' }
                ]
            },
            {
                title: 'Metro Transit Pass',
                items: [
                    { label: 'Pass Type', value: 'Monthly Pass' },
                    { label: 'Current Balance', value: '$87.50' },
                    { label: 'Valid Until', value: '11/30/2025' },
                    { label: 'Passenger Type', value: 'Adult' },
                    { label: 'Zone', value: 'All Zones' }
                ]
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.filterCards(this.currentCategory);
    }

    setupEventListeners() {
        // Category tab clicks
        this.categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.getAttribute('data-category');
                this.setActiveCategory(category);
                this.filterCards(category);
            });
        });

        // Card clicks
        this.cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showCardDetails(index);
            });
        });

        // Panel close
        if (this.panelClose) {
            this.panelClose.addEventListener('click', () => {
                this.hideCardDetails();
            });
        }

        // Panel drag to close
        this.detailsPanel.addEventListener('touchstart', (e) => {
            this.handlePanelTouchStart(e);
        });

        this.detailsPanel.addEventListener('touchmove', (e) => {
            this.handlePanelTouchMove(e);
        });

        this.detailsPanel.addEventListener('touchend', (e) => {
            this.handlePanelTouchEnd(e);
        });

        // Navigation items
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.setActiveNav(item);
            });
        });

        // Quick access buttons
        const quickAccessButtons = document.querySelectorAll('.quick-access-btn');
        quickAccessButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Add haptic feedback
                this.hapticFeedback();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideCardDetails();
            }
        });
    }

    setActiveCategory(category) {
        this.currentCategory = category;
        this.categoryTabs.forEach(tab => {
            if (tab.getAttribute('data-category') === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        this.hapticFeedback();
    }

    filterCards(category) {
        this.cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                // Stagger animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    setActiveNav(activeItem) {
        this.navItems.forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
        this.hapticFeedback();
    }

    showCardDetails(index) {
        const details = this.cardDetails[index];
        if (!details) return;

        let html = '';
        details.items.forEach(item => {
            html += `
                <div class="detail-item">
                    <div class="detail-item-label">${item.label}</div>
                    <div class="detail-item-value">${item.value}</div>
                </div>
            `;
        });

        this.panelBody.innerHTML = html;
        
        // Update panel title
        const panelTitle = document.querySelector('.panel-title');
        if (panelTitle) {
            panelTitle.textContent = details.title;
        }

        this.detailsPanel.classList.add('open');
        this.hapticFeedback();
    }

    hideCardDetails() {
        this.detailsPanel.classList.remove('open');
        this.hapticFeedback();
    }

    handlePanelTouchStart(e) {
        if (!this.detailsPanel.classList.contains('open')) return;
        
        const touch = e.touches[0];
        this.touchStartY = touch.clientY;
        this.isPanelDragging = false;
    }

    handlePanelTouchMove(e) {
        if (!this.detailsPanel.classList.contains('open')) return;
        
        const touch = e.touches[0];
        const deltaY = touch.clientY - this.touchStartY;

        // Only allow dragging down from the top area
        if (deltaY > 0 && this.touchStartY < 100) {
            this.isPanelDragging = true;
            // Optional: add visual feedback during drag
            this.detailsPanel.style.transform = `translateY(${Math.min(deltaY, 200)}px)`;
        }
    }

    handlePanelTouchEnd(e) {
        if (!this.detailsPanel.classList.contains('open')) return;
        
        const touch = e.changedTouches[0];
        const deltaY = touch.clientY - this.touchStartY;

        // Reset transform
        this.detailsPanel.style.transform = '';

        // Close panel if dragged down sufficiently
        if (deltaY > 100) {
            this.hideCardDetails();
        }

        this.isPanelDragging = false;
    }

    hapticFeedback() {
        // Provide haptic feedback on supported devices
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SamsungWalletManager();

    // Add initial animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 80));
    });
});

