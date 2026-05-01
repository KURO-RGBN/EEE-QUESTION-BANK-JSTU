document.addEventListener("DOMContentLoaded", function() {
    const splash = document.getElementById('custom-splash');
    
    // Check if we are on the home page to avoid showing splash on every sub-page
    // If you want it on every launch, keep the code as is.
    window.addEventListener("load", function() {
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.remove(); // Removes from the DOM so it doesn't block clicks
            }, 600);
        }, 2200); // Shows for 2.2 seconds
    });
});
