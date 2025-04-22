document.addEventListener('DOMContentLoaded', function() {
    // Station enum data
    const stations = [
        'JAMMU', 'JALANDHAR', 'LUDHIANA', 'DELHI', 'KANPUR',
        'AGRA', 'MATHURA', 'GWALIOR', 'NAGPUR', 'MUMBAI',
        'PUNE', 'CHENNAI', 'TIPURATI', 'KANYAKUMARI', 'PRAYAGRAJ',
        'VARANASI', 'DARJELLING', 'KOLKATA'
    ];

    // Fill all station dropdowns
    populateStationDropdowns();

    // Navigation
    setupNavigation();

    // Setup event listeners for forms
    setupEventListeners();

    // Initialize route builder
    initRouteBuilder();
});

function populateStationDropdowns() {
    const stations = [
        'JAMMU', 'JALANDHAR', 'LUDHIANA', 'DELHI', 'KANPUR',
        'AGRA', 'MATHURA', 'GWALIOR', 'NAGPUR', 'MUMBAI',
        'PUNE', 'CHENNAI', 'TIPURATI', 'KANYAKUMARI', 'PRAYAGRAJ',
        'VARANASI', 'DARJELLING', 'KOLKATA'
    ];

    const stationDropdowns = document.querySelectorAll('select[id*="station"]');

    stationDropdowns.forEach(dropdown => {
        // Keep the first option (placeholder) and add station options
        const firstOption = dropdown.innerHTML;
        dropdown.innerHTML = firstOption;

        stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station;
            option.textContent = station;
            dropdown.appendChild(option);
        });
    });
}

function setupNavigation() {
    // Navigation between sections
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to current link
            this.classList.add('active');

            // Show the corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Book now button
    document.getElementById('book-now-btn').addEventListener('click', function() {
        // Navigate to book tickets section
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        document.querySelector('a[data-section="book-tickets"]').classList.add('active');
        document.getElementById('book-tickets').classList.add('active');
    });
}

function setupEventListeners() {
    // Add Train Form
    document.getElementById('add-train-form').addEventListener('submit', handleAddTrain);

    // Check Seats Form
    document.getElementById('check-seats-form').addEventListener('submit', handleCheckSeats);

    // Boarding Stats Form
    document.getElementById('boarding-stats-form').addEventListener('submit', handleBoardingStats);

    // Oldest Passenger Form
    document.getElementById('oldest-passenger-form').addEventListener('submit', handleOldestPassenger);

    // Trains in Time Range Form
    document.getElementById('trains-time-range-form').addEventListener('submit', handleTrainsInTimeRange);

    // Book Ticket Form
    document.getElementById('book-ticket-form').addEventListener('submit', handleBookTicket);

    // Register Form
    document.getElementById('register-form').addEventListener('submit', handleRegisterPassenger);

    // Close notification
    document.querySelector('.close-notification').addEventListener('click', function() {
        document.getElementById('notification').classList.remove('show');
    });
}

function initRouteBuilder() {
    // Initial station container is already in the HTML
    const addStationBtn = document.querySelector('.add-station-btn');
    addStationBtn.addEventListener('click', addStationToRoute);
}

function addStationToRoute() {
    const routeContainer = document.getElementById('route-stations');
    const stations = [
        'JAMMU', 'JALANDHAR', 'LUDHIANA', 'DELHI', 'KANPUR',
        'AGRA', 'MATHURA', 'GWALIOR', 'NAGPUR', 'MUMBAI',
        'PUNE', 'CHENNAI', 'TIPURATI', 'KANYAKUMARI', 'PRAYAGRAJ',
        'VARANASI', 'DARJELLING', 'KOLKATA'
    ];

    const stationContainer = document.createElement('div');
    stationContainer.className = 'station-container';

    const select = document.createElement('select');
    select.className = 'station-select';
    select.required = true;

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select station';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    stations.forEach(station => {
        const option = document.createElement('option');
        option.value = station;
        option.textContent = station;
        select.appendChild(option);
    });

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn small-btn add-station-btn';
    addBtn.textContent = '+';
    addBtn.addEventListener('click', addStationToRoute);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn small-btn remove-station-btn';
    removeBtn.textContent = '-';
    removeBtn.addEventListener('click', function() {
        routeContainer.removeChild(stationContainer);
    });

    stationContainer.appendChild(select);
    stationContainer.appendChild(addBtn);
    stationContainer.appendChild(removeBtn);

    routeContainer.appendChild(stationContainer);
}

async function handleAddTrain(e) {
    e.preventDefault();

    try {
        // Collect all station selections
        const stationSelects = document.querySelectorAll('.station-select');
        const stationRoute = Array.from(stationSelects).map(select => select.value);

        // Validate that at least 2 stations are selected
        if (stationRoute.length < 2) {
            showNotification('Please add at least 2 stations to the route.', 'error');
            return;
        }

        // Check for duplicate stations
        const uniqueStations = new Set(stationRoute);
        if (uniqueStations.size !== stationRoute.length) {
            showNotification('Each station can only appear once in the route.', 'error');
            return;
        }

        const departureTime = document.getElementById('departure-time').value;
        const noOfSeats = document.getElementById('seats').value;

        // Validate inputs
        if (!departureTime || !noOfSeats || noOfSeats < 1) {
            showNotification('Please fill in all fields correctly.', 'error');
            return;
        }

        // Format departure time
        const [hours, minutes] = departureTime.split(':');
        const formattedDepartureTime = `${hours}:${minutes}:00`;

        const trainData = {
            stationRoute: stationRoute,
            departureTime: formattedDepartureTime,
            noOfSeats: parseInt(noOfSeats)
        };

        // API call to add train
        const response = await fetch('/train/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trainData)
        });

        if (!response.ok) {
            throw new Error('Failed to add train');
        }

        const trainId = await response.json();

        // Reset form
        document.getElementById('add-train-form').reset();

        // Clear route builder except first station
        const routeContainer = document.getElementById('route-stations');
        const stationContainers = routeContainer.querySelectorAll('.station-container');
        for (let i = 1; i < stationContainers.length; i++) {
            routeContainer.removeChild(stationContainers[i]);
        }
        routeContainer.querySelector('.station-select').selectedIndex = 0;

        showNotification(`Train added successfully! Train ID: ${trainId}`, 'success');
    } catch (error) {
        console.error('Error adding train:', error);
        showNotification('Failed to add train. Please try again.', 'error');
    }
}

async function handleCheckSeats(e) {
    e.preventDefault();

    try {
        const trainId = document.getElementById('train-id-seats').value;
        const fromStation = document.getElementById('from-station-seats').value;
        const toStation = document.getElementById('to-station-seats').value;

        if (!trainId || !fromStation || !toStation) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        const requestData = {
            trainId: parseInt(trainId),
            fromStation: fromStation,
            toStation: toStation
        };

        // API call to check seat availability
        const response = await fetch(`/train/calculate-avaiable-seats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error('Failed to check seat availability');
        }

        const availableSeats = await response.json();

        const resultBox = document.getElementById('availability-result');
        resultBox.innerHTML = `<p><strong>Available Seats:</strong> ${availableSeats}</p>`;
        resultBox.classList.add('show');
    } catch (error) {
        console.error('Error checking seat availability:', error);
        showNotification('Failed to check seat availability. Please try again.', 'error');
    }
}

async function handleBoardingStats(e) {
    e.preventDefault();

    try {
        const trainId = document.getElementById('train-id-boarding').value;
        const station = document.getElementById('station-boarding').value;

        if (!trainId || !station) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        // API call to get boarding statistics
        const response = await fetch(`/train/calculate-people-onboarding?trainId=${trainId}&station=${station}`);

        if (!response.ok) {
            throw new Error('Failed to get boarding statistics');
        }

        const boardingCount = await response.json();

        const resultBox = document.getElementById('boarding-result');
        resultBox.innerHTML = `<p><strong>Number of people boarding at ${station}:</strong> ${boardingCount}</p>`;
        resultBox.classList.add('show');
    } catch (error) {
        console.error('Error getting boarding statistics:', error);
        showNotification('Failed to get boarding statistics. Please try again.', 'error');
    }
}

async function handleOldestPassenger(e) {
    e.preventDefault();

    try {
        const trainId = document.getElementById('train-id-oldest').value;

        if (!trainId) {
            showNotification('Please enter a train ID.', 'error');
            return;
        }

        // API call to get oldest passenger age
        const response = await fetch(`/train/calculate-oldest-person-travelling/${trainId}`);

        if (!response.ok) {
            throw new Error('Failed to get oldest passenger age');
        }

        const oldestAge = await response.json();

        const resultBox = document.getElementById('oldest-result');
        if (oldestAge === 0) {
            resultBox.innerHTML = `<p>No passengers found on this train.</p>`;
        } else {
            resultBox.innerHTML = `<p><strong>Age of oldest passenger:</strong> ${oldestAge}</p>`;
        }
        resultBox.classList.add('show');
    } catch (error) {
        console.error('Error getting oldest passenger age:', error);
        showNotification('Failed to get oldest passenger age. Please try again.', 'error');
    }
}

async function handleTrainsInTimeRange(e) {
    e.preventDefault();

    try {
        const station = document.getElementById('station-time-range').value;
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;

        if (!station || !startTime || !endTime) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        // Format times
        const [startHours, startMinutes] = startTime.split(':');
        const formattedStartTime = `${startHours}:${startMinutes}:00`;

        const [endHours, endMinutes] = endTime.split(':');
        const formattedEndTime = `${endHours}:${endMinutes}:00`;

        // API call to get trains in time range
        const response = await fetch(`/train/get-list-of-trains-arriving-in-a-range-of-time?station=${station}&startTime=${formattedStartTime}&endTime=${formattedEndTime}`);

        if (!response.ok) {
            throw new Error('Failed to get trains in time range');
        }

        const trainIds = await response.json();

        const resultBox = document.getElementById('time-range-result');
        if (trainIds.length === 0) {
            resultBox.innerHTML = `<p>No trains found at ${station} between ${startTime} and ${endTime}.</p>`;
        } else {
            resultBox.innerHTML = `
                <p><strong>Trains at ${station} between ${startTime} and ${endTime}:</strong></p>
                <ul>
                    ${trainIds.map(id => `<li>Train ID: ${id}</li>`).join('')}
                </ul>
            `;
        }
        resultBox.classList.add('show');
    } catch (error) {
        console.error('Error getting trains in time range:', error);
        showNotification('Failed to get trains in time range. Please try again.', 'error');
    }
}

async function handleBookTicket(e) {
    e.preventDefault();

    try {
        const trainId = document.getElementById('train-id-booking').value;
        const fromStation = document.getElementById('from-station-booking').value;
        const toStation = document.getElementById('to-station-booking').value;
        const bookingPersonId = document.getElementById('booking-person-id').value;
        const noOfSeats = document.getElementById('passengers').value;
        const passengerIdsInput = document.getElementById('passenger-ids').value;

        if (!trainId || !fromStation || !toStation || !bookingPersonId || !noOfSeats || !passengerIdsInput) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        // Parse passenger IDs
        const passengerIds = passengerIdsInput.split(',').map(id => parseInt(id.trim()));

        // Validate passenger count
        if (passengerIds.length != parseInt(noOfSeats)) {
            showNotification(`Number of passengers (${passengerIds.length}) doesn't match the number of seats (${noOfSeats}).`, 'error');
            return;
        }

        const ticketData = {
            trainId: parseInt(trainId),
            fromStation: fromStation,
            toStation: toStation,
            bookingPersonId: parseInt(bookingPersonId),
            noOfSeats: parseInt(noOfSeats),
            passengerIds: passengerIds
        };

        // API call to book ticket
        const response = await fetch('/ticket/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticketData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to book ticket');
        }

        const ticketId = await response.json();

        // Reset form
        document.getElementById('book-ticket-form').reset();

        const resultBox = document.getElementById('booking-result');
        if (ticketId === null) {
            resultBox.innerHTML = `<p>Failed to book ticket. Please check your inputs and try again.</p>`;
        } else {
            resultBox.innerHTML = `<p><strong>Ticket booked successfully!</strong></p>
                                  <p>Ticket ID: ${ticketId}</p>`;
            showNotification(`Ticket booked successfully! Ticket ID: ${ticketId}`, 'success');
        }
        resultBox.classList.add('show');
    } catch (error) {
        console.error('Error booking ticket:', error);
        showNotification(`Failed to book ticket: ${error.message}`, 'error');
    }
}

async function handleRegisterPassenger(e) {
    e.preventDefault();

    try {
        const name = document.getElementById('passenger-name').value;
        const age = document.getElementById('passenger-age').value;

        if (!name || !age || age < 1) {
            showNotification('Please fill in all fields correctly.', 'error');
            return;
        }

        const passengerData = {
            name: name,
            age: parseInt(age)
        };

        // API call to register passenger
        const response = await fetch('/passenger/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passengerData)
        });

        if (!response.ok) {
            throw new Error('Failed to register passenger');
        }

        const passengerId = await response.json();

        // Reset form
        document.getElementById('register-form').reset();

        const resultBox = document.getElementById('register-result');
        resultBox.innerHTML = `
            <p><strong>Passenger registered successfully!</strong></p>
            <p>Passenger ID: ${passengerId}</p>
            <p>Name: ${name}</p>
            <p>Age: ${age}</p>
            <p class="note">Please save your Passenger ID for booking tickets.</p>
        `;
        resultBox.classList.add('show');

        showNotification(`Passenger registered successfully! Passenger ID: ${passengerId}`, 'success');
    } catch (error) {
        console.error('Error registering passenger:', error);
        showNotification('Failed to register passenger. Please try again.', 'error');
    }
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    notification.className = 'notification';
    notification.classList.add(type);
    notification.classList.add('show');

    notificationMessage.textContent = message;

    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}