document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-target');
            views.forEach(view => {
                if (view.id === targetId) {
                    view.classList.remove('hidden');
                } else {
                    view.classList.add('hidden');
                }
            });
        });
    });

    let tripData = {
        budget: 0,
        spent: 0
    };
    let expenses = [];

    const tripForm = document.getElementById('trip-form');
    tripForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const destination = document.getElementById('destination').value;
        const budget = parseFloat(document.getElementById('budget').value);
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        tripData.budget = budget;
        updateExpenseDashboard();

        const submitBtn = tripForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating via AI...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            document.getElementById('trip-title').innerText = `Trip to ${destination}`;
            document.getElementById('trip-dates').innerText = `Dates: ${startDate} to ${endDate} | Budget: $${budget}`;

            const mockItineraryHTML = `
                <div class="day-card">
                    <h2>Day 1: Arrival & Exploration</h2>
                    <div class="activity">
                        <div class="time">10:00 AM</div>
                        <div>
                            <strong>Flight Landing & Hotel Check-in</strong>
                            <p class="text-muted"><small>Suggested: Flight to City Center.</small></p>
                        </div>
                    </div>
                    <div class="activity">
                        <div class="time">01:00 PM</div>
                        <div>
                            <strong>Lunch at Local Market</strong>
                            <p class="text-muted"><small>Highly rated street food vendors.</small></p>
                        </div>
                    </div>
                    <div class="activity">
                        <div class="time">03:30 PM</div>
                        <div>
                            <strong>Historical Downtown Walking Tour</strong>
                            <p class="text-muted"><small>Visit main square and historic monuments.</small></p>
                        </div>
                    </div>
                </div>
                <div class="day-card">
                    <h2>Day 2: Adventure & Culture</h2>
                    <div class="activity">
                        <div class="time">09:00 AM</div>
                        <div>
                            <strong>Museum of Art & History</strong>
                            <p class="text-muted"><small>Skip-the-line tickets recommended.</small></p>
                        </div>
                    </div>
                    <div class="activity">
                        <div class="time">02:00 PM</div>
                        <div>
                            <strong>Scenic Boat Tour</strong>
                            <p class="text-muted"><small>2-hour guided tour along the river.</small></p>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('itinerary-timeline').innerHTML = mockItineraryHTML;

            document.querySelector('[data-target="itinerary-view"]').click();
        }, 1500);
    });

    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const desc = document.getElementById('exp-desc').value;
        const amount = parseFloat(document.getElementById('exp-amount').value);

        if(desc && amount) {
            expenses.push({ desc, amount });
            tripData.spent += amount;
            
            document.getElementById('exp-desc').value = '';
            document.getElementById('exp-amount').value = '';

            renderExpenses();
            updateExpenseDashboard();
        }
    });

    function renderExpenses() {
        if (expenses.length === 0) {
            expenseList.innerHTML = '<li class="empty-state">No expenses logged yet.</li>';
            return;
        }

        expenseList.innerHTML = expenses.map(exp => `
            <li>
                <span>${exp.desc}</span>
                <strong>$${exp.amount.toFixed(2)}</strong>
            </li>
        `).join('');
    }

    function updateExpenseDashboard() {
        const remaining = tripData.budget - tripData.spent;
        
        document.getElementById('tracker-budget').innerText = `$${tripData.budget.toFixed(2)}`;
        document.getElementById('tracker-spent').innerText = `$${tripData.spent.toFixed(2)}`;
        
        const remElement = document.getElementById('tracker-remaining');
        remElement.innerText = `$${remaining.toFixed(2)}`;

        if (remaining < 0) {
            remElement.className = 'danger';
        } else {
            remElement.className = 'success';
        }
    }
});
