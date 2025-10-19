class HomePage {
    constructor() {
        this.eventsGrid = document.getElementById('eventsGrid');
        this.orgCards = document.getElementById('orgCards');
        this.init();
    }

    async init() {
        await this.loadHomeEvents();
        this.loadOrganizationInfo();
    }

    async loadHomeEvents() {
        try {
            const response = await fetch('/api/events/home');
            const events = await response.json();

            this.displayEvents(events);
        } catch (error) {
            console.error('Error loading events:', error);
            this.eventsGrid.innerHTML = '<p class="error">Error loading events. Please try again later.</p>';
        }
    }

    displayEvents(events) {
        if (events.length === 0) {
            this.eventsGrid.innerHTML = '<p>No upcoming events found.</p>';
            return;
        }

        this.eventsGrid.innerHTML = events.map(event => `
            <div class="event-card" data-event-id="${event.id}">
                <img src="${event.image_url || 'https://picsum.photos/400/300?random=' + event.id}" 
                     alt="${event.name}" class="event-image">
                <div class="event-content">
                    <h4 class="event-title">${event.name}</h4>
                    <p class="event-description">${event.short_description}</p>
                    <div class="event-meta">
                        <span class="event-category">${event.category_name}</span>
                        <span class="event-location">${event.city}, ${event.state_region}</span>
                    </div>
                    <div class="event-date">
                        ${new Date(event.start_at).toLocaleDateString()} 
                        at ${new Date(event.start_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div class="event-price">
                        ${event.ticket_price_cents > 0 ? 
                          `$${(event.ticket_price_cents / 100).toFixed(2)}` : 'Free'}
                    </div>
                    <button class="view-details-btn" onclick="viewEventDetails(${event.id})">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadOrganizationInfo() {
        // 硬编码的组织信息 - 根据您的数据库中的组织
        const organizations = [
            {
                name: "HopeWorks Foundation",
                description: "Empowering communities through education and healthcare.",
                contact: "info@hopeworks.org"
            },
            {
                name: "Green City Trust",
                description: "Creating sustainable urban futures.",
                contact: "hello@greencity.org"
            }
        ];

        this.orgCards.innerHTML = organizations.map(org => `
            <div class="org-card">
                <h4>${org.name}</h4>
                <p>${org.description}</p>
                <div class="contact-info">Contact: ${org.contact}</div>
            </div>
        `).join('');
    }
}

function viewEventDetails(eventId) {
    window.location.href = `../pages/event-details.html`;
}

// 初始化主页
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});

function viewEventDetails(eventId) {
    // 使用服务器路由而不是直接文件路径
    window.location.href = `/event-details?id=${eventId}`;
}
