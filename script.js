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
        const duration = document.getElementById('duration').value;

        // Count exercises
        const exercises = document.querySelectorAll('.exercise-item').length;

        // Store data in sessionStorage for success page
        sessionStorage.setItem('workoutData', JSON.stringify({
            date: workoutDate,
            type: workoutTypeText,
            duration: duration,
            exercises: exercises
        }));

        // Navigate to success page
        window.location.href = 'success.html';
    });
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
