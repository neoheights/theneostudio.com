import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins immediately
gsap.registerPlugin(ScrollTrigger);

// Typewriter effect removed - replaced with React FlipWords component in main.tsx
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Protect Images from right-click and save as
    document.addEventListener('contextmenu', function(e) {
        if (e.target.nodeName === 'IMG') {
            e.preventDefault();
        }
    }, false);
});

document.querySelector('.close-icon')?.addEventListener('click', () => {
    document.querySelector('.other-verticals').style.display = 'none';
});

// Scroll Reveal Observer
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target); // reveal once, never hide again
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('scroll-hidden');
    observer.observe(section);
});

// GSAP plugins registered at top of file

// Legacy blur text animation removed - replaced with WhisperText component in main.tsx

// Premium Text Reveal Animation
const initPremiumReveal = () => {
    const premiumElements = document.querySelectorAll('.premium-reveal');

    premiumElements.forEach(premiumText => {
        if (premiumText.dataset.initialized) return;
        premiumText.dataset.initialized = 'true';

        const lines = premiumText.querySelectorAll('.reveal-line');

        lines.forEach(line => {
            // Check if this line has a typewriter target
            const typeTarget = line.querySelector('.type-target');

            if (typeTarget) {
                // Separate the text before and after the typewriter word
                const fullHTML = line.innerHTML;
                const parts = fullHTML.split(/<span class="type-target">.*?<\/span>/);

                line.innerHTML = '';

                // Add split characters before
                if (parts[0]) {
                    parts[0].split('').forEach(char => {
                        const span = document.createElement('span');
                        applyRevealStyles(span);
                        span.textContent = char === ' ' ? '\u00A0' : char;
                        line.appendChild(span);
                    });
                }

                // Add the typewriter span back as a single block for its own animation later
                const typeWrap = document.createElement('span');
                typeWrap.className = 'type-wrap';
                applyRevealStyles(typeWrap);

                // Create the actual typing element inside
                const typeWord = document.createElement('span');
                typeWord.className = 'type-word';
                typeWord.textContent = typeTarget.textContent;

                const cursor = document.createElement('span');
                cursor.className = 'type-cursor';
                cursor.textContent = '|';

                typeWrap.appendChild(typeWord);
                typeWrap.appendChild(cursor);
                line.appendChild(typeWrap);

                // Add split characters after
                if (parts[1]) {
                    parts[1].split('').forEach(char => {
                        const span = document.createElement('span');
                        applyRevealStyles(span);
                        span.textContent = char === ' ' ? '\u00A0' : char;
                        line.appendChild(span);
                    });
                }

                // Start typewriter logic for this element
                initTypewriter(typeWord, premiumText.dataset.words ? JSON.parse(premiumText.dataset.words) : [typeWord.textContent]);

            } else {
                const originalHTML = line.innerHTML;
                line.innerHTML = '';

                // Helper to process text nodes or elements
                const processNode = (node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.textContent;
                        [...text].forEach(char => {
                            const span = document.createElement('span');
                            applyRevealStyles(span);
                            span.textContent = char === ' ' ? '\u00A0' : char;
                            line.appendChild(span);
                        });
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const tagName = node.tagName.toLowerCase();
                        const className = node.className;
                        const text = node.textContent;

                        [...text].forEach(char => {
                            const outerSpan = document.createElement(tagName);
                            if (className) outerSpan.className = className;

                            const innerSpan = document.createElement('span');
                            applyRevealStyles(innerSpan);
                            innerSpan.textContent = char === ' ' ? '\u00A0' : char;

                            outerSpan.appendChild(innerSpan);
                            line.appendChild(outerSpan);
                        });
                    }
                };

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = originalHTML;
                tempDiv.childNodes.forEach(processNode);
            }
        });

        const allSpans = premiumText.querySelectorAll('span:not(.type-word):not(.type-cursor)');

        gsap.to(allSpans, {
            scrollTrigger: {
                trigger: premiumText,
                start: 'top 92%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            rotate: 0,
            filter: 'blur(0px)',
            stagger: 0.02,
            duration: 1.2,
            ease: 'power3.out'
        });
    });
};

function applyRevealStyles(el) {
    el.style.opacity = '0';
    el.style.display = 'inline-block';
    el.style.transform = 'translateY(15px) rotate(3deg)';
    el.style.filter = 'blur(8px)';
}

function initTypewriter(element, words) {
    let wordIndex = 0;
    let charIndex = words[0].length;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex] || "";

        if (isDeleting) {
            charIndex--;
            typeSpeed = 50;
        } else {
            charIndex++;
            typeSpeed = 100;
        }

        element.textContent = currentWord.substring(0, charIndex);

        if (!isDeleting && charIndex >= currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex <= 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    // Initial start after a small delay
    setTimeout(type, 2000);
}


// Start as soon as possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPremiumReveal);
} else {
    initPremiumReveal();
}
window.addEventListener('load', initPremiumReveal);


// Initialize Components on Load
document.addEventListener('DOMContentLoaded', () => {
    initPortfolioTabs();
    // Initialize milestones animations
    setTimeout(() => {
        initMilestoneAnimations();
    }, 100);
});

// Portfolio Tab Logic
function initPortfolioTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            // Update active button
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active pane
            panes.forEach(pane => {
                if (pane.id === target) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
}

// Image Lightbox Modal
function openModal(imgSrc) {
    let modal = document.getElementById('project-lightbox');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'project-lightbox';
        modal.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999; opacity: 0; transition: opacity 0.3s ease;
            cursor: zoom-out;
        `;
        modal.innerHTML = `
            <img id="lightbox-img" src="" style="max-width: 90%; max-height: 90%; border-radius: 10px; box-shadow: 0 0 50px rgba(0,0,0,0.5); transform: scale(0.9); transition: transform 0.3s ease;">
            <span style="position: absolute; top: 30px; right: 40px; color: #fff; font-size: 40px; cursor: pointer;">&times;</span>
        `;
        document.body.appendChild(modal);
        modal.onclick = () => {
            modal.style.opacity = '0';
            setTimeout(() => modal.style.display = 'none', 300);
        };
    }
    
    const img = document.getElementById('lightbox-img');
    img.src = imgSrc;
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        img.style.transform = 'scale(1)';
    }, 10);
}
window.openModal = openModal;


// Card Stack Animation - Matching React behavior
function initializeCardStack(stackId) {
    const stack = document.getElementById(stackId);
    if (!stack) return;

    const cards = stack.querySelectorAll('.card-stack-item');

    cards.forEach(card => {
        const cardRotate = card.querySelector('.card-rotate');

        // Mouse move 3D effect - subtle like the React version
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Map to -60 to 60 range like React version
            const rotateX = ((y - centerY) / centerY) * 30;
            const rotateY = ((centerX - x) / centerX) * 30;

            gsap.to(cardRotate, {
                duration: 0.2,
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 600,
                ease: 'power1.out'
            });
        });

        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            gsap.to(cardRotate, {
                duration: 0.4,
                rotateX: 0,
                rotateY: 0,
                ease: 'power2.out'
            });
        });

        // Click to send card to back - like React's sendToBack
        card.addEventListener('click', () => {
            const allCards = Array.from(stack.querySelectorAll('.card-stack-item'));
            const clickedIndex = parseInt(card.getAttribute('data-index'));

            // Only animate if it's the top card
            if (clickedIndex === 0) {
                // Send to back with smooth spring animation
                allCards.forEach((c) => {
                    let currentIndex = parseInt(c.getAttribute('data-index'));
                    let newIndex;

                    if (c === card) {
                        // Clicked card goes to back
                        newIndex = 2;
                    } else {
                        // Other cards move forward
                        newIndex = currentIndex - 1;
                    }

                    c.setAttribute('data-index', newIndex);

                    // Calculate transform values based on index
                    const rotation = newIndex * 4;
                    const scale = 1 - (newIndex * 0.06);

                    // Smooth spring-like animation matching React
                    gsap.to(c, {
                        duration: 0.5,
                        rotation: rotation,
                        scale: scale,
                        zIndex: 3 - newIndex,
                        transformOrigin: '90% 90%',
                        ease: 'back.out(1.56)' // Spring effect like React's stiffness: 260, damping: 20
                    });
                });
            }
        });
    });
}

// Shiny Text Shimmer Animation
gsap.to('.shiny-text', {
    backgroundPosition: '-50% center',
    duration: 3,
    repeat: -1,
    ease: 'none',
    repeatDelay: 1
});

// Stats Counter Animation
const initStatsCounter = () => {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        const isMillion = stat.textContent.includes('M') || stat.parentElement.textContent.includes('Million') || stat.dataset.target === "2";
        const isPlus = target === 2000 || target === 25; // Simple check for + decoration

        gsap.to(stat, {
            scrollTrigger: {
                trigger: stat,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power1.out',
            onUpdate: function () {
                let val = Math.floor(this.targets()[0].innerHTML);
                if (target === 2000) {
                    stat.innerHTML = (val / 1000).toFixed(0) + 'K+';
                } else if (target === 25) {
                    stat.innerHTML = val + '+';
                } else if (target === 2) {
                    stat.innerHTML = val + 'M';
                } else {
                    stat.innerHTML = val;
                }
            }
        });
    });
};

// Feature Brand Reveals
const initFeatureReveals = () => {
    const section = document.querySelector('.feature-brand');
    if (!section) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    tl.to('.reveal-left', {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: 'power3.out'
    })
        .to('.reveal-right', {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: 'power3.out'
        }, '-=1')
        .to('.reveal-up', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.7)'
        }, '-=0.6');
};

const initTestimonialSlider = () => {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.getElementById('prev-test');
    const nextBtn = document.getElementById('next-test');

    if (!track || !prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', () => {
        const itemWidth = track.querySelector('.testimonial-card').offsetWidth + 40; // width + gap
        track.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        const itemWidth = track.querySelector('.testimonial-card').offsetWidth + 40; // width + gap
        track.scrollBy({ left: itemWidth, behavior: 'smooth' });
    });
};

const initMilestoneAnimations = () => {
    // Reveal for elements marked with .gsap-reveal
    gsap.utils.toArray('.gsap-reveal').forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Split Reveal for the Title (Characters)
    gsap.utils.toArray('.split-reveal').forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';

        // Wrap each character in a span
        [...text].forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.willChange = 'transform, opacity';
            el.appendChild(span);
        });

        const chars = el.querySelectorAll('span');

        gsap.fromTo(chars,
            {
                opacity: 0,
                y: 40
            },
            {
                opacity: 1,
                y: 0,
                duration: 1.25,
                ease: 'power3.out',
                stagger: 0.05,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true
                }
            }
        );
    });
};

const initFAQAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close other items (optional, but cleaner)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initPremiumReveal();
    initFeatureReveals();
    initStatsCounter();
    initTestimonialSlider();
    initFAQAccordion();


    // Sticky Header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            menuIcon.classList.toggle('toggle');
        });

        // Close menu ONLY when clicking a real destination link
        // (not parent toggles like "Services ▼" or "Residential ▶")
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const isDropdownParent = link.closest('.dropdown > a') === link ||
                                        link.closest('.has-submenu > a') === link ||
                                        link.parentElement.classList.contains('dropdown') && link.nextElementSibling?.classList.contains('dropdown-menu') ||
                                        link.parentElement.classList.contains('has-submenu');
                if (!isDropdownParent) {
                    navLinks.classList.remove('nav-active');
                    menuIcon.classList.remove('toggle');
                }
            });
        });

        // Mobile Dropdown Toggles — Services ▼
        document.querySelectorAll('.dropdown > a').forEach(dropdownLink => {
            dropdownLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    const menu = dropdownLink.nextElementSibling;
                    const arrow = dropdownLink.querySelector('.arrow-down');
                    if (menu) menu.classList.toggle('active');
                    if (arrow) arrow.classList.toggle('active');
                }
            });
        });

        // Mobile Submenu Toggles — Residential ▶ / Commercial ▶
        document.querySelectorAll('.has-submenu > a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    const submenu = link.nextElementSibling;
                    const arrow = link.querySelector('.arrow-right');
                    if (submenu) submenu.classList.toggle('active');
                    if (arrow) arrow.classList.toggle('active');
                }
            });
        });
    }

    // --- Animated Underline "Designing Interiors with Purpose" ---
    const underlineContainer = document.querySelector('.animated-text-container');
    const path = document.querySelector('.underline-path');
    if (underlineContainer && path) {
        // Draw underline when visible
        gsap.to(path, {
            scrollTrigger: {
                trigger: underlineContainer,
                start: 'top 85%',
                once: true
            },
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.inOut"
        });

        const normalPath = "M 0,10 Q 75,0 150,10 Q 225,20 300,10";
        const hoverPath = "M 0,10 Q 75,20 150,10 Q 225,0 300,10";

        // Morph effect on hover
        underlineContainer.addEventListener('mouseenter', () => {
            gsap.to(path, {
                attr: { d: hoverPath },
                duration: 0.8,
                ease: "power2.inOut"
            });
        });

        underlineContainer.addEventListener('mouseleave', () => {
            gsap.to(path, {
                attr: { d: normalPath },
                duration: 0.8,
                ease: "power2.inOut"
            });
        });
    }
});




