class EventDetailsPage {
    constructor() {
        this.eventDetails = document.getElementById('eventDetails');
        this.loadingMessage = document.getElementById('loadingMessage');
        this.errorMessage = document.getElementById('errorMessage');
        this.registerBtn = document.getElementById('registerBtn');
        this.modal = document.getElementById('registerModal');
        
        this.eventId = this.getEventIdFromURL();
        this.init();
    }

    getEventIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async init() {
        if (!this.eventId) {
            this.showError('No event ID provided.');
            return;
        }

        await this.loadEventDetails();
        this.setupEventListeners();
    }

    async loadEventDetails() {
        try {
            const response = await fetch(`/api/events/${this.eventId}`);
            
            if (!response.ok) {
                throw new Error('Event not found');
            }
            
            const event = await response.json();
            this.displayEventDetails(event);
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading event details:', error);
            this.showError('Error loading event details. Please try again.');
            this.hideLoading();
        }
    }

    displayEventDetails(event) {
        // 设置基本事件信息
        document.getElementById('eventName').textContent = event.name;
        document.getElementById('eventShortDescription').textContent = event.short_description;
        document.getElementById('eventFullDescription').textContent = event.full_description;
        document.getElementById('eventCategory').textContent = event.category_name;
        document.getElementById('eventOrganization').textContent = `by ${event.org_name}`;
        
        // 设置事件图片
        const eventImage = document.getElementById('eventImage');
        eventImage.src = event.image_url || `https://picsum.photos/800/400?random=${event.id}`;
        eventImage.alt = event.name;

        // 设置日期时间
        const startDate = new Date(event.start_at);
        const endDate = new Date(event.end_at);
        document.getElementById('eventDateTime').textContent = 
            `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

        // 设置地点信息
        document.getElementById('eventVenue').textContent = event.venue_name;
        document.getElementById('eventLocation').textContent = 
            `${event.venue_address ? event.venue_address + ', ' : ''}${event.city}, ${event.state_region} ${event.postcode}`;

        // 设置票价
        document.getElementById('eventTicketPrice').textContent = 
            event.ticket_price_cents > 0 ? 
            `$${(event.ticket_price_cents / 100).toFixed(2)}` : 'Free';

        // 设置票务信息
        const ticketInfo = event.tickets_total ? 
            `${event.tickets_sold} of ${event.tickets_total} tickets sold` : 
            `${event.tickets_sold} tickets sold`;
        document.getElementById('ticketAvailability').textContent = ticketInfo;

        // 设置筹款进度
        if (event.goal_amount_cents) {
            const progress = (event.amount_raised_cents / event.goal_amount_cents) * 100;
            document.getElementById('progressFill').style.width = `${Math.min(progress, 100)}%`;
            document.getElementById('progressAmount').textContent = `$${(event.amount_raised_cents / 100).toFixed(2)}`;
            document.getElementById('goalAmount').textContent = `$${(event.goal_amount_cents / 100).toFixed(2)}`;
        }

        // 设置组织联系信息
        document.getElementById('orgContact').textContent = 
            `Email: ${event.contact_email} | Phone: ${event.contact_phone}`;

        this.eventDetails.style.display = 'block';
    }

    setupEventListeners() {
        this.registerBtn.addEventListener('click', () => {
            this.showModal();
        });

        // 模态框关闭事件
        document.querySelector('.close-btn').addEventListener('click', () => {
            this.closeModal();
        });

        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    showModal() {
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    hideLoading() {
        this.loadingMessage.style.display = 'none';
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }
}

// 全局函数供 HTML 调用
function closeModal() {
    document.getElementById('registerModal').style.display = 'none';
}

// 初始化详情页面
document.addEventListener('DOMContentLoaded', () => {
    new EventDetailsPage();
});