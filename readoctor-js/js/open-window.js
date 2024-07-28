document.addEventListener("DOMContentLoaded", function () {
    const openToolsButton = document.getElementById('open-tools');
    openToolsButton.addEventListener('click', function () {
        const toolsContainer = document.getElementsByClassName('tools')[0];
        const toolsMenu = document.getElementsByClassName('tools-menu')[0]; // Get the first element

        if (toolsContainer && toolsMenu) { 
            const opacityValue = window.getComputedStyle(toolsMenu).opacity;
            // Check if the element exists
            toolsContainer.classList.toggle('open-tools');
            if (opacityValue === '0') {
                toolsMenu.style.opacity = '1';
            } else {
                toolsMenu.style.opacity = '0';
            }
            // Toggle the class for the header
        }
    });
});