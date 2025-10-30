document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    let activeCardIndex = cards.length - 1;
    let targetY = 0;
    let currentY = 0;
    let velocityY = 0;
    const friction = 0.9;
    const spring = 0.1;

    const updateCards = () => {
        currentY += (targetY - currentY) * spring;
        currentY *= friction;

        cards.forEach((card, i) => {
            const offset = activeCardIndex - i;
            const y = currentY + offset * -60;
            const z = offset * -50;
            const rot = offset * 10;

            const transform =
                `translateY(${y}px) translateZ(${z}px) rotateX(${rot}deg)`;
            card.style.transform = transform;
            card.style.opacity = offset === 0 ? 1 : 0.8;
            card.style.zIndex = cards.length - Math.abs(offset);
            if (offset !== 0) {
                card.classList.remove('flipped');
            }
        });

        requestAnimationFrame(updateCards);
    };

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index === activeCardIndex) {
                card.classList.toggle('flipped');
            }
        });
    });

    const handleWheel = (e) => {
        const delta = Math.sign(e.deltaY);
        if (delta > 0) {
            activeCardIndex = Math.min(cards.length - 1, activeCardIndex + 1);
        } else {
            activeCardIndex = Math.max(0, activeCardIndex - 1);
        }
    };

    window.addEventListener('wheel', handleWheel);

    let startY = 0;
    let lastY = 0;
    let isDragging = false;

    window.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        lastY = startY;
        isDragging = true;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const y = e.touches[0].clientY;
        velocityY = y - lastY;
        lastY = y;
        targetY += velocityY;
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
        const cardHeight = 60;
        const cardIndex = Math.round(targetY / cardHeight);
        activeCardIndex = Math.max(0, Math.min(cards.length - 1, activeCardIndex - cardIndex));
        targetY = 0;
    });

    updateCards();
});
