/**
 * Portfolio Interactive Scripts
 * Handles:
 * 1. Night Mode & CSS Media Query Theme Detection
 * 2. Left Vertical Sidebar Drawer for Mobile & Tablet (< 1025px)
 * 3. Active Navigation Link Highlighting on Scroll (8 Sections)
 * 4. Interactive Pixel Terminal Chat Simulation
 */

(function () {
    'use strict';

    const rootElement = document.documentElement;
    const themeToggleButtons = document.querySelectorAll('.theme-toggle');
    const sidebarNav = document.getElementById('sidebar-navigation');
    const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const navLinks = document.querySelectorAll('.sidebar-nav-link');
    const sections = document.querySelectorAll('section[id]');

    /* --------------------------------------------------------------------------
       1. Night Mode & CSS Media Query Theme Detection
       -------------------------------------------------------------------------- */
    const STORAGE_KEY = 'portfolio-theme-preference';
    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function isCurrentModeDark() {
        const explicitTheme = rootElement.getAttribute('data-theme');
        if (explicitTheme === 'dark') return true;
        if (explicitTheme === 'light') return false;
        return darkMediaQuery.matches;
    }

    function updateToggleLabels(isDark) {
        const label = isDark ? 'Switch to day mode (light mode)' : 'Switch to night mode (dark mode)';
        themeToggleButtons.forEach(btn => {
            btn.setAttribute('aria-label', label);
            btn.setAttribute('title', label);
        });
    }

    function initializeTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light') {
            rootElement.setAttribute('data-theme', savedTheme);
            updateToggleLabels(savedTheme === 'dark');
        } else {
            rootElement.removeAttribute('data-theme');
            updateToggleLabels(darkMediaQuery.matches);
        }
    }

    // Toggle button click handler for all theme buttons
    themeToggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentlyDark = isCurrentModeDark();
            const nextTheme = currentlyDark ? 'light' : 'dark';
            rootElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem(STORAGE_KEY, nextTheme);
            updateToggleLabels(!currentlyDark);
        });
    });

    // Detect browser/OS theme changes when no override is set
    darkMediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            updateToggleLabels(e.matches);
        }
    });

    initializeTheme();

    /* --------------------------------------------------------------------------
       2. Mobile Sidebar Drawer Controls
       -------------------------------------------------------------------------- */
    function openSidebar() {
        if (!sidebarNav) return;
        sidebarNav.classList.add('is-open');
        if (sidebarBackdrop) sidebarBackdrop.classList.add('is-active');
        if (mobileSidebarToggle) {
            mobileSidebarToggle.setAttribute('aria-expanded', 'true');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (!sidebarNav) return;
        sidebarNav.classList.remove('is-open');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('is-active');
        if (mobileSidebarToggle) {
            mobileSidebarToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    }

    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', () => {
            const isOpen = sidebarNav && sidebarNav.classList.contains('is-open');
            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebarNav && sidebarNav.classList.contains('is-open')) {
            closeSidebar();
        }
    });

    // Close mobile drawer when clicking a navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }
        });
    });

    /* --------------------------------------------------------------------------
       3. Active Navigation Link Highlighting on Scroll
       -------------------------------------------------------------------------- */
    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 140;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    const isMatch = link.getAttribute('href') === `#${sectionId}`;
                    link.classList.toggle('active', isMatch);
                    if (isMatch) {
                        link.setAttribute('aria-current', 'page');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
    highlightNavOnScroll();

    /* --------------------------------------------------------------------------
       4. Interactive Pixel Terminal Chat Simulation
       -------------------------------------------------------------------------- */
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('pixel-chat-form');
    const chatInput = document.getElementById('chat-user-input');
    const quickPromptBtns = document.querySelectorAll('.quick-prompt-btn');

    const botResponses = {
        stack: "Shifa specializes in JavaScript (ES6+), React, Node.js, Express, Python, PostgreSQL, MongoDB, RESTful APIs, and modern CSS architectures.",
        hire: "Yes! Shifa is actively open to Software Engineering opportunities (Full-time & Contract, Remote or On-site). Reach out via the Contact section below!",
        projects: "Shifa's notable projects include a Cloud Task Orchestrator, a Microservices E-Commerce API, and scalable developer tools with accessible UI.",
        contact: "You can email Shifa directly at shifa@example.com, connect on LinkedIn, or submit the contact form below!"
    };

    function appendMessage(sender, text, isUser) {
        if (!chatMessages) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;

        const metaDiv = document.createElement('div');
        metaDiv.className = 'message-meta';
        metaDiv.innerHTML = `<span class="msg-sender">&gt; ${sender}:</span><span class="msg-time">NOW</span>`;

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.textContent = text;

        msgDiv.appendChild(metaDiv);
        msgDiv.appendChild(bubbleDiv);

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Handle Quick Prompt Clicks
    quickPromptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const queryKey = btn.getAttribute('data-query');
            const promptText = btn.textContent.trim().replace(/^\[\d+\]\s*/, '');

            appendMessage('VISITOR', promptText, true);

            setTimeout(() => {
                const answer = botResponses[queryKey] || "I'm ready to answer any questions about Shifa's skills and experience!";
                appendMessage('SHIFA_BOT', answer, false);
            }, 350);
        });
    });

    // Handle Form Submissions
    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            appendMessage('VISITOR', text, true);
            chatInput.value = '';

            setTimeout(() => {
                const lower = text.toLowerCase();
                let reply = "Thanks for your question! Shifa loves building high-performance web systems. Feel free to connect via the contact form below!";

                if (lower.includes('skill') || lower.includes('stack') || lower.includes('react') || lower.includes('tech')) {
                    reply = botResponses.stack;
                } else if (lower.includes('hire') || lower.includes('job') || lower.includes('available') || lower.includes('opportunity')) {
                    reply = botResponses.hire;
                } else if (lower.includes('project') || lower.includes('work') || lower.includes('portfolio')) {
                    reply = botResponses.projects;
                } else if (lower.includes('contact') || lower.includes('email') || lower.includes('reach')) {
                    reply = botResponses.contact;
                }

                appendMessage('SHIFA_BOT', reply, false);
            }, 400);
        });
    }

})();
