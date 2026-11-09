document.addEventListener('DOMContentLoaded', function () {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // Accordion setup
    accordionHeaders.forEach(header => {
        header.setAttribute('tabindex', 0);
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expaned', 'false');

        header.addEventListener('click', function () {
            const accordionItem = this.parentElement;

            // aria controls to get target id
            const panelId =  this.getAttribute('aria-controls');
            const targetPanel = document.getElementById(panelId);
            accordionItem.classList.toggle('active');

            const isExpanded = accordionItem.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);

            if (targetPanel) {
                targetPanel.setAttribute('aria-hidden', !isExpanded);
            }
        });
        //Keyboard navigstian controls 
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === '') {
                e.preventDefault();
                this.click();
            }
        });
    });
});