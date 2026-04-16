
(function() {
    // Create the modal HTML
    const modalHTML = `
        <div class="neo-modal-overlay" id="talkToDesignerModal">
            <div class="neo-modal-container">
                <button class="neo-modal-close" id="closeNeoModal">×</button>
                <div class="neo-modal-content">
                    <h2 class="modal-form-title">Talk to Designer</h2>
                    <p class="modal-form-sub">Enter your details below to schedule a free consultation with our design experts.</p>
                    <form id="neoModalForm">
                        <div class="modal-form-group">
                            <label>Name *</label>
                            <input type="text" placeholder="Your Name" required>
                        </div>
                        <div class="modal-form-group">
                            <label>Phone Number *</label>
                            <input type="tel" placeholder="Enter Phone number" required>
                        </div>
                        <div class="modal-form-row">
                            <div class="modal-form-group" style="flex: 1;">
                                <label>Property Size *</label>
                                <select required>
                                    <option value="" disabled selected>Select</option>
                                    <option>1 BHK</option>
                                    <option>2 BHK</option>
                                    <option>3 BHK</option>
                                    <option>4 BHK</option>
                                    <option>5 BHK</option>
                                    <option>Villa</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div class="modal-form-group" style="flex: 1;">
                                <label>Property Location *</label>
                                <select required>
                                    <option value="" disabled selected>Select</option>
                                    <option>Bangalore North</option>
                                    <option>Bangalore South</option>
                                    <option>Bangalore East</option>
                                    <option>Anekal / Chandapura</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-form-group">
                            <label>Scope of work</label>
                            <textarea placeholder="Tell us more about your dream home..." style="min-height: 80px;"></textarea>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; margin: 15px 0;">
                            <input type="checkbox" id="modalWhatsapp" style="width: 18px; height: 18px; cursor: pointer;">
                            <label for="modalWhatsapp" style="font-size: 14px; cursor: pointer; color: #000; font-weight: 500;">Send me updates on whatsapp</label>
                        </div>
                        <button type="submit" class="modal-submit-btn">Let's Talk</button>
                    </form>
                    <p class="modal-disclosure">By submitting, you agree to our privacy policy and terms of use, allowing us to use your information as outlined.</p>
                </div>
            </div>
        </div>
    `;

    // Inject the modal as soon as the DOM is ready
    function injectModal() {
        if (!document.getElementById('talkToDesignerModal')) {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = modalHTML;
            document.body.appendChild(wrapper.firstElementChild);
            setupModalListeners();
        }
    }

    function setupModalListeners() {
        const modal = document.getElementById('talkToDesignerModal');
        const closeBtn = document.getElementById('closeNeoModal');
        const form = document.getElementById('neoModalForm');

        // Close logic
        closeBtn.onclick = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        };

        // Form submission (placeholder)
        form.onsubmit = (e) => {
            e.preventDefault();
            alert('Your request has been submitted successfully! Our designer will contact you soon.');
            modal.classList.remove('active');
            document.body.style.overflow = '';
            form.reset();
        };

        // Attach to all buttons and anchor links that look like buttons
        function attachToButtons() {
            // Updated list of targets:
            // 1. Any element with a class containing 'btn'
            // 2. Any <button> element (except submits, slider controls, and specific exclusions)
            // 3. Any <a> element that is styled as a button
            const buttons = document.querySelectorAll('.btn-primary, .btn-primary-modern, .cta-btn, .talk-btn, .discover-more, .get-quote-btn, button:not(.tab-btn):not(.filter-btn):not(.neo-modal-close):not([type="submit"]):not(.carousel-btn):not(#prev-test):not(#next-test)');
            
            buttons.forEach(btn => {
                btn.onclick = (e) => {
                    // Pre-check: if it's a real anchor link that isn't just a # hashed one
                    const href = btn.getAttribute('href');
                    if (href && !href.startsWith('#')) {
                        // For CTAs, we'll prevent default and show the modal
                        e.preventDefault();
                    }
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                };
            });
        }

        // Run once DOM is fully interactive
        attachToButtons();
        
        // Sometimes buttons are added dynamically, so we can re-check occasionally
        // but for now, we'll stick with the initial sweep.
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectModal);
    } else {
        injectModal();
    }
})();
