// Sample announcements data (replace with your actual content or API calls)
const announcements = [
    {
        date: "2025. augusztus 25.",
        title: "Újkenyér ünnepe",
        content: "Szeretettel meghívjuk Önöket az újkenyér ünnepére. Az istentiszteletet követően közös ebéd.",
        image: "Újkenyér 2025"
    },
    {
        date: "2025. május",
        title: "Pünkösdi ünnepkör",
        content: "Pünkösd alkalmából különleges programokkal várjuk a híveket.",
        image: "Pünkösdi program 2025"
    },
    {
        date: "2025. április",
        title: "Húsvéti ünnepkör",
        content: "A húsvéti időszak programjai és istentiszteletek rendje.",
        image: "Húsvéti ünnepkör 2025"
    },
    {
        date: "2025. március",
        title: "Konfirmációk",
        content: "2025-ben konfirmálandók névsora. Gratulálunk a konfirmandusoknak!",
        image: "Konfirmálók 2025"
    },
    {
        date: "2025. január",
        title: "Ifjúsági alkalom",
        content: "Meghívó az ifjúsági alkalomra. Minden fiatal szeretettel várva!",
        image: "Ifjúsági meghívó"
    },
    {
        date: "2024. december",
        title: "Karácsonyi üdvözlet",
        content: "Áldott, békés karácsonyi ünnepeket és boldog új esztendőt kívánunk!",
        image: "Karácsonyi üdvözlet 2024"
    }
];

/**
 * Creates an HTML string for an announcement card
 * @param {Object} announcement - The announcement object
 * @param {number} index - The index for animation delay
 * @returns {string} HTML string for the announcement card
 */
function createAnnouncementCard(announcement, index) {
    return `
        <div class="announcement-card loading" style="animation-delay: ${index * 0.2}s">
            <div class="announcement-image">
                ${announcement.image}
            </div>
            <div class="announcement-date">${announcement.date}</div>
            <h3 class="announcement-title">${announcement.title}</h3>
            <p class="announcement-content">${announcement.content}</p>
            <a href="#" class="read-more">Részletek →</a>
        </div>
    `;
}

/**
 * Loads and displays announcements in the announcements container
 */
function loadAnnouncements() {
    const container = document.getElementById('announcements');
    if (!container) {
        console.error('Announcements container not found');
        return;
    }

    const announcementsHTML = announcements
        .map((announcement, index) => createAnnouncementCard(announcement, index))
        .join('');
    
    container.innerHTML = announcementsHTML;
}

/**
 * Initializes smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('nav a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Sets up intersection observer for loading animations
 */
function initLoadingAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all loading elements
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => observer.observe(el));
}

/**
 * Handles read more functionality for announcements
 */
function initReadMoreHandlers() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('read-more')) {
            e.preventDefault();
            // Here you can add logic to show more details
            // For example, open a modal, navigate to detail page, etc.
            console.log('Read more clicked for:', e.target.closest('.announcement-card'));
        }
    });
}

/**
 * Initialize the website functionality
 */
function init() {
    loadAnnouncements();
    initSmoothScrolling();
    initReadMoreHandlers();
    
    // Delay the loading animations setup to ensure DOM is ready
    setTimeout(initLoadingAnimations, 100);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', init);

// Optional: Add window load event for additional initialization
window.addEventListener('load', () => {
    console.log('Website fully loaded');
});

// Utility functions that you might find useful:

/**
 * Format date to Hungarian format
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatHungarianDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('hu-HU', options);
}

/**
 * Add a new announcement (useful for dynamic content)
 * @param {Object} announcement - New announcement object
 */
function addAnnouncement(announcement) {
    announcements.unshift(announcement);
    loadAnnouncements();
    initLoadingAnimations();
}

/**
 * Filter announcements by keyword
 * @param {string} keyword - Search keyword
 * @returns {Array} Filtered announcements
 */
function searchAnnouncements(keyword) {
    return announcements.filter(announcement => 
        announcement.title.toLowerCase().includes(keyword.toLowerCase()) ||
        announcement.content.toLowerCase().includes(keyword.toLowerCase())
    );
}