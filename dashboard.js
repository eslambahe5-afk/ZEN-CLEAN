// This file handles the dashboard specific logic (Charts, Filtering, Rendering)

document.addEventListener('DOMContentLoaded', () => {
    initAdminDashboard();
});

function initAdminDashboard() {
    // Load initial data
    loadOrders();
    loadWorkers();
    updateStats();

    // Toggle Sidebar on Mobile
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Mode Switcher
    const modeBtn = document.getElementById('modeBtn');
    modeBtn.addEventListener('click', () => {
        const isWorkerMode = modeBtn.textContent.includes('Worker');
        showTab(isWorkerMode ? 'requests' : 'workers');
        modeBtn.textContent = isWorkerMode ? 'عرض الطلبات' : 'إدارة العمالة';
    });

    // Add Worker Form
    const addWorkerForm = document.getElementById('addWorkerForm');
    if (addWorkerForm) {
        addWorkerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('workerName').value;
            const phone = document.getElementById('workerPhone').value;
            const id = document.getElementById('workerID').value;
            const status = document.getElementById('workerStatus').value;

            addWorker({ name, phone, id, status, image: 'https://placehold.co/100?text=Worker+' + id });
        });
    }
}

function showTab(tabId) {
    const requestsDiv = document.getElementById('requests');
    const workersDiv = document.getElementById('workers');
    const pageTitle = document.getElementById('page-title');

    if (tabId === 'requests') {
        requestsDiv.style.display = 'block';
        workersDiv.style.display = 'none';
        pageTitle.textContent = 'لوحة القيادة - طلبات العملاء';
        loadOrders();
    } else {
        requestsDiv.style.display = 'none';
        workersDiv.style.display = 'block';
        pageTitle.textContent = 'لوحة القيادة - إدارة العمالة';
        loadWorkers();
    }
}

// --- Orders Logic ---

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('zinorders') || '[]');
    const container = document.getElementById('orders-list');
    container.innerHTML = '';

    if (orders.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-center py-4">لا توجد طلبات حتى الآن.</p>';
        return;
    }

    // Reverse to show newest first
    orders.reverse().forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="font-bold text-white">${order.name}</div>
                <div class="text-gray-400 text-sm">${order.date || new Date().toLocaleDateString('ar-EG')}</div>
            </td>
            <td>${order.serviceType}</td>
            <td>${order.phone}</td>
            <td>
                <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-select w-full">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>مراجعة</option>
                    <option value="approved" ${order.status === 'approved' ? 'selected' : ''}>تأكيد</option>
                    <option value="rejected" ${order.status === 'rejected' ? 'selected' : ''}>رفض</option>
                </select>
            </td>
            <td>
                <button onclick="deleteOrder('${order.id}')" class="btn-sm btn-delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        container.appendChild(row);
    });
}

function updateOrderStatus(id, newStatus) {
    let orders = JSON.parse(localStorage.getItem('zinorders') || '[]');
    orders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    localStorage.setItem('zinorders', JSON.stringify(orders));
    loadOrders();
    updateStats();
}

function deleteOrder(id) {
    if(!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    let orders = JSON.parse(localStorage.getItem('zinorders') || '[]');
    orders = orders.filter(o => o.id !== id);
    localStorage.setItem('zinorders', JSON.stringify(orders));
    loadOrders();
    updateStats();
}

// --- Workers Logic ---

function loadWorkers() {
    const workers = JSON.parse(localStorage.getItem('zinworkers') || '[]');
    const tbody = document.querySelector('#workers-table tbody');
    tbody.innerHTML = '';

    if (workers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-400">لا يوجد موظفين مضافين.</td></tr>';
        return;
    }

    workers.forEach(worker => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="flex items-center gap-2">
                    <img src="${worker.image}" class="w-8 h-8 rounded-full" alt="${worker.name}">
                    <span class="font-bold">${worker.name}</span>
                </div>
            </td>
            <td>${worker.phone}</td>
            <td>${worker.id}</td>
            <td>
                <span class="status-badge ${worker.status === 'active' ? 'status-approved' : 'status-rejected'}">
                    ${worker.status === 'active' ? 'نشط' : 'معلق'}
                </span>
            </td>
            <td>
                <button onclick="deleteWorker('${worker.id}')" class="btn-sm btn-delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function addWorker(workerData) {
    let workers = JSON.parse(localStorage.getItem('zinworkers') || '[]');
    const id = generateId();
    const newWorker = { ...workerData, id };
    workers.push(newWorker);
    localStorage.setItem('zinworkers', JSON.stringify(workers));
    
    // Clear form
    document.getElementById('addWorkerForm').reset();
    loadWorkers();
    updateStats();
}

function deleteWorker(id) {
    if(!confirm('هل أنت متأكد من حذف الموظفة؟ سيتم حفظ سجلاتها في التاريخ فقط.')) return;
    let workers = JSON.parse(localStorage.getItem('zinworkers') || '[]');
    workers = workers.filter(w => w.id !== id);
    localStorage.setItem('zinworkers', JSON.stringify(workers));
    loadWorkers();
    updateStats();
}

// --- Stats & Utilities ---

function updateStats() {
    const orders = JSON.parse(localStorage.getItem('zinorders') || '[]');
    const workers = JSON.parse(localStorage.getItem('zinworkers') || '[]');

    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('stat-orders').textContent = orders.length;
    document.getElementById('stat-pending').textContent = orders.filter(o => o.status === 'pending').length;
    document.getElementById('stat-workers').textContent = workers.length;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function clearAllData() {
    if(confirm('تحذير شديد: هذا سيحذف جميع الطلبات والعمال. هل أنت متأكد؟')) {
        localStorage.clear();
        location.reload();
    }
}

