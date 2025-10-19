class SearchPage {
    constructor() {
        this.searchForm = document.getElementById('searchForm');
        this.searchResults = document.getElementById('searchResults');
        this.errorMessage = document.getElementById('errorMessage');
        this.categorySelect = document.getElementById('category');
        this.clearBtn = document.getElementById('clearBtn');

        this.init();
    }

    async init() {
        await this.loadCategories();
        this.setupEventListeners();
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/categories');
            const categories = await response.json();

            this.categorySelect.innerHTML = '<option value="all">All Categories</option>' +
                categories.map(cat =>
                    `<option value="${cat.name}">${cat.name}</option>`
                ).join('');
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    setupEventListeners() {
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.performSearch();
        });

        this.clearBtn.addEventListener('click', () => {
            this.clearFilters();
        });
    }

    async performSearch() {
        const formData = new FormData(this.searchForm);
        const searchParams = new URLSearchParams();

        for (const [key, value] of formData.entries()) {
            if (value.trim() !== '') {
                searchParams.append(key, value.trim());
            }
        }

        try {
            const response = await fetch(`/api/events/search?${searchParams}`);
            const events = await response.json();

            this.displayResults(events);
            this.hideError();
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Error performing search. Please try again.');
        }
    }

    displayResults(events) {
        if (events.length === 0) {
            this.searchResults.innerHTML = '<p>No events found matching your criteria.</p>';
            return;
        }

        this.searchResults.innerHTML = events.map(event => `
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

    clearFilters() {
        this.searchForm.reset();
        this.searchResults.innerHTML = '';
        this.hideError();
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }
}

function viewEventDetails(eventId) {
    window.location.href = `event-details?id=${eventId}`;
}

// 初始化搜索页面
document.addEventListener('DOMContentLoaded', () => {
    new SearchPage();
});
