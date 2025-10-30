document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const cardStack = document.querySelector('.card-stack');
    let activeCardIndex = cards.length - 1;

    const updateCards = () => {
        cards.forEach((card, i) => {
            const offset = activeCardIndex - i;
            const transform =
                `translateY(${offset * -60}px) translateZ(${offset * -50}px) rotateX(${offset * 10}deg)`;
            card.style.transform = transform;
            card.style.opacity = offset === 0 ? 1 : 0.8;
            card.style.zIndex = cards.length - Math.abs(offset);
        });
    };

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index === activeCardIndex) {
                card.classList.toggle('flipped');
            } else {
                cards[activeCardIndex].classList.remove('flipped');
                activeCardIndex = index;
                updateCards();
            }
        });
    });

    updateCards();

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    cardStack.addEventListener('touchstart', (e) => {
        isDragging = true;
        startY = e.touches[0].clientY;
    });

    cardStack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const diff = startY - currentY;
        cardStack.style.transform = `rotateX(${-diff / 20}deg)`;
    });

    cardStack.addEventListener('touchend', () => {
        isDragging = false;
        cardStack.style.transform = 'rotateX(0deg)';
    });
});
