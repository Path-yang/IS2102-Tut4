// Login Form Handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Simple login - just navigate to dashboard
        window.location.href = 'dashboard.html';
    });
}

// Workout Form Handler
if (document.getElementById('workoutForm')) {
    let exerciseCount = 0;

    // Set today's date as default
    const dateInput = document.getElementById('workoutDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Add Exercise Button
    const addExerciseBtn = document.getElementById('addExerciseBtn');
    if (addExerciseBtn) {
        addExerciseBtn.addEventListener('click', function() {
            exerciseCount++;
            addExercise(exerciseCount);
        });
    }

    // Add Exercise Function
    function addExercise(number) {
        const exercisesList = document.getElementById('exercisesList');

        // Remove placeholder if it exists
        const placeholder = exercisesList.querySelector('.exercises-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise-item';
        exerciseDiv.id = `exercise-${number}`;

        exerciseDiv.innerHTML = `
            <div class="exercise-header">
                <span class="exercise-number">💪 Exercise ${number}</span>
                <button type="button" class="remove-exercise" onclick="removeExercise(${number})">×</button>
            </div>
            <div class="exercise-fields">
                <div class="form-group">
                    <label for="exerciseName-${number}">Exercise Name</label>
                    <input type="text" id="exerciseName-${number}" name="exerciseName-${number}" placeholder="e.g., Bench Press" required>
                </div>
                <div class="form-group">
                    <label for="sets-${number}">Sets</label>
                    <input type="number" id="sets-${number}" name="sets-${number}" min="1" placeholder="3" required>
                </div>
                <div class="form-group">
                    <label for="reps-${number}">Reps</label>
                    <input type="number" id="reps-${number}" name="reps-${number}" min="1" placeholder="10" required>
                </div>
                <div class="form-group">
                    <label for="weight-${number}">Weight (kg, optional)</label>
                    <input type="number" id="weight-${number}" name="weight-${number}" min="0" step="0.5" placeholder="50">
                </div>
            </div>
        `;

        exercisesList.appendChild(exerciseDiv);
    }

    // Remove Exercise Function (global scope)
    window.removeExercise = function(number) {
        const exerciseDiv = document.getElementById(`exercise-${number}`);
        if (exerciseDiv) {
            exerciseDiv.remove();
        }

        // If no exercises left, show placeholder again
        const exercisesList = document.getElementById('exercisesList');
        const remainingExercises = exercisesList.querySelectorAll('.exercise-item');
        if (remainingExercises.length === 0) {
            exercisesList.innerHTML = `
                <div class="exercises-placeholder">
                    <div class="placeholder-icon">🎯</div>
                    <p>Click "Add Exercise" to start building your workout</p>
                </div>
            `;
        }
    }

    // Handle Form Submission
    document.getElementById('workoutForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const workoutDate = document.getElementById('workoutDate').value;
        const workoutType = document.getElementById('workoutType');
        const workoutTypeText = workoutType.options[workoutType.selectedIndex].text;
        const workoutTypeValue = workoutType.value;
        const duration = document.getElementById('duration').value;
        const notes = document.getElementById('notes').value;

        // Collect exercise details
        const exerciseItems = document.querySelectorAll('.exercise-item');
        const exerciseDetails = [];

        exerciseItems.forEach((item, index) => {
            const id = item.id.split('-')[1];
            const name = document.getElementById(`exerciseName-${id}`).value;
            const sets = document.getElementById(`sets-${id}`).value;
            const reps = document.getElementById(`reps-${id}`).value;
            const weight = document.getElementById(`weight-${id}`).value;

            exerciseDetails.push({
                name: name,
                sets: sets,
                reps: reps,
                weight: weight || '-'
            });
        });

        // Create workout object
        const workout = {
            id: Date.now(),
            date: workoutDate,
            type: workoutTypeText,
            typeValue: workoutTypeValue,
            duration: duration,
            exercises: exerciseDetails,
            exerciseCount: exerciseDetails.length,
            notes: notes,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        let workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        workouts.unshift(workout); // Add to beginning of array
        localStorage.setItem('workouts', JSON.stringify(workouts));

        // Store data in sessionStorage for success page
        sessionStorage.setItem('workoutData', JSON.stringify({
            date: workoutDate,
            type: workoutTypeText,
            duration: duration,
            exercises: exerciseDetails.length
        }));

        // Navigate to success page
        window.location.href = 'success.html';
    });
}

// Dashboard Handler
if (window.location.pathname.includes('dashboard.html') || window.location.pathname.endsWith('/')) {
    // Load workouts from localStorage
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');

    // Update stats
    const totalWorkouts = workouts.length;

    // Calculate this week's workouts
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = workouts.filter(w => new Date(w.date) >= weekAgo).length;

    // Calculate this month's workouts
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thisMonth = workouts.filter(w => new Date(w.date) >= monthAgo).length;

    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 3) {
        statCards[0].querySelector('.stat-number').textContent = totalWorkouts;
        statCards[1].querySelector('.stat-number').textContent = thisWeek;
        statCards[2].querySelector('.stat-number').textContent = thisMonth;
    }

    // Display recent workouts
    const recentWorkoutsDiv = document.querySelector('.recent-workouts');
    if (recentWorkoutsDiv && workouts.length > 0) {
        // Remove empty state
        const emptyState = recentWorkoutsDiv.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        // Create workout list
        const workoutList = document.createElement('div');
        workoutList.className = 'workout-list';

        // Show last 5 workouts
        workouts.slice(0, 5).forEach(workout => {
            const workoutCard = document.createElement('div');
            workoutCard.className = 'workout-card';

            const typeIcon = {
                'strength': '💪',
                'cardio': '🏃',
                'flexibility': '🧘',
                'sports': '⚽'
            }[workout.typeValue] || '💪';

            workoutCard.innerHTML = `
                <div class="workout-card-header">
                    <div class="workout-type">
                        <span class="workout-icon">${typeIcon}</span>
                        <span class="workout-type-text">${workout.type}</span>
                    </div>
                    <span class="workout-date">${formatDate(workout.date)}</span>
                </div>
                <div class="workout-card-body">
                    <div class="workout-detail">
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value">${workout.duration} min</span>
                    </div>
                    <div class="workout-detail">
                        <span class="detail-label">Exercises:</span>
                        <span class="detail-value">${workout.exerciseCount}</span>
                    </div>
                </div>
            `;

            workoutList.appendChild(workoutCard);
        });

        recentWorkoutsDiv.appendChild(workoutList);
    }

    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    }
}

// Success Page Handler
if (window.location.pathname.includes('success.html')) {
    const workoutData = JSON.parse(sessionStorage.getItem('workoutData') || '{}');

    if (workoutData.date) {
        document.getElementById('summaryDate').textContent = workoutData.date;
        document.getElementById('summaryType').textContent = workoutData.type;
        document.getElementById('summaryDuration').textContent = workoutData.duration + ' minutes';
        document.getElementById('summaryExercises').textContent = workoutData.exercises;
    }
}
