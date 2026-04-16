// Shared JS for all blog post pages

document.addEventListener('DOMContentLoaded', () => {
    // Fade in
    document.body.classList.add('loaded');

    // Header scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        // Reading progress
        const doc = document.documentElement;
        const scrollTop = window.scrollY;
        const scrollHeight = doc.scrollHeight - doc.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        const bar = document.getElementById('reading-progress');
        if (bar) bar.style.width = progress + '%';
    });

    // Mobile nav
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('toggle');
            navLinks.classList.toggle('nav-active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuIcon.classList.remove('toggle');
                navLinks.classList.remove('nav-active');
            });
        });
    }

    // Copy link button
    const copyBtn = document.querySelector('.share-btn.copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => copyBtn.textContent = 'Copy Link', 2000);
            });
        });
    }
});
