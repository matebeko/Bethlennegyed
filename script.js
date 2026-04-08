document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-navigation');

    menuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('show');
        
        // Change icon from hamburger (☰) to close (✕) when opened
        if (mainNav.classList.contains('show')) {
            menuBtn.innerHTML = '✕';
        } else {
            menuBtn.innerHTML = '☰';
        }
    });
});