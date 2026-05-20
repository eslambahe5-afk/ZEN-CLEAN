// Main JS file for User Interface
document.addEventListener('DOMContentLoaded', () => {
    // Handle Request Form
    const form = document.getElementById('serviceForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Mobile Menu
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            // Toggle flex or block based on previous state
            const isHidden = navLinks.classList.contains('hidden-mobile');
            if (!isHidden) {
                navLinks.classList.add('hidden-mobile');
                navLinks.style.display = 'none';
            } else {
                navLinks.classList.remove('hidden-mobile');
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = '#0f172a';
                navLinks.style.padding = '20px';
                navLinks.style.borderBottom = '1px solid #334155';
            }
        });
    }
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const serviceType = document.getElementById('serviceType').value;
    const serviceTypeText = document.getElementById('serviceType').options[document.getElementById('serviceType').selectedIndex].text;
    const address = document.getElementById('address').value;
    const notes = document.getElementById('notes').value;
    const date = new Date().toLocaleDateString('ar-EG');

    // Create object
    const order = {
        id: Date.now().toString(),
        name,
        phone,
        serviceType,
        serviceTypeText,
        address,
        notes,
        date,
        status: 'pending' // default status
    };

    // Save to LocalStorage
    let orders = JSON.parse(localStorage.getItem('zinorders') || '[]');
    orders.push(order);
    localStorage.setItem('zinorders', JSON.stringify(orders));

    // Success Feedback
    alert('✅ تم استلام طلبك بنجاح! \nسيتم التواصل معك عبر ' + phone + ' في أقرب وقت.');
    form.reset();
}

