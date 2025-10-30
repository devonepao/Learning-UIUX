document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    let activeCardIndex = cards.length - 1;

    const updateCards = () => {
        cards.forEach((card, i) => {
            const offset = activeCardIndex - i;
            const transform =
                `translateY(${offset * -60}px) translateZ(${offset * -50}px) rotateX(${offset * 10}deg)`;
            card.style.transform = transform;
            card.style.opacity = offset === 0 ? 1 : 0.8;
            card.style.zIndex = cards.length - Math.abs(offset);
            if (offset !== 0) {
                card.classList.remove('flipped');
            }
        });
    };

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index === activeCardIndex) {
                card.classList.toggle('flipped');
            }
        });
    });

    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    const handleScroll = (e) => {
        const delta = Math.sign(e.deltaY || e.touches[0].clientY - startY);
        if (delta > 0) {
            activeCardIndex = Math.max(0, activeCardIndex - 1);
        } else {
            activeCardIndex = Math.min(cards.length - 1, activeCardIndex + 1);
        }
        updateCards();
    };

    window.addEventListener('wheel', throttle(handleScroll, 500));

    let startY = 0;
    window.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });

    window.addEventListener('touchmove', throttle(handleScroll, 500));

    updateCards();
});
