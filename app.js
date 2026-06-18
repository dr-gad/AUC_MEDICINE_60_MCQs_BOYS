// Application State
let selectedCategories = new Set();
let quizQuestions = [];
let currentQuestionIdx = 0;
let scoreCorrect = 0;
let scoreWrong = 0;
let answersState = []; // Tracks user answers: { selectedIdx, isCorrect }

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  initSegmentedControls();
});

// Initialize Segmented Controls
function initSegmentedControls() {
  const controls = document.querySelectorAll('.segmented-control');
  controls.forEach(control => {
    const inputs = control.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        if (input.checked) {
          // Clear active class from siblings
          control.querySelectorAll('.segmented-tab').forEach(tab => {
            tab.classList.remove('active');
          });
          // Add active class to selected tab
          input.closest('.segmented-tab').classList.add('active');
          
          // Toggle shift class based on value
          if (input.value === 'random') {
            control.classList.add('shift');
          } else {
            control.classList.remove('shift');
          }
        }
      });
    });
  });
}

// Render Category Cards
function renderCategories() {
  const sectionsList = document.getElementById('sections-list');
  sectionsList.innerHTML = '';

  allSections.forEach(section => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.dataset.name = section.name;

    card.innerHTML = `
      <div class="category-info">
        <span class="category-name">${section.name}</span>
        <span class="category-count">${section.questions.length} سؤال</span>
      </div>
      <div class="checkbox-custom"></div>
    `;

    card.addEventListener('click', () => toggleCategory(card, section.name));
    sectionsList.appendChild(card);
  });

  updateTotalCounter();
}

// Toggle Category Selection
function toggleCategory(card, name) {
  if (selectedCategories.has(name)) {
    selectedCategories.delete(name);
    card.classList.remove('selected');
  } else {
    selectedCategories.add(name);
    card.classList.add('selected');
  }
  updateTotalCounter();
}

// Update Selected Questions Count
function updateTotalCounter() {
  let total = 0;
  selectedCategories.forEach(name => {
    const section = allSections.find(s => s.name === name);
    if (section) total += section.questions.length;
  });
  document.getElementById('selected-total').innerText = total;
}

// Shuffle Utility
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Start Quiz
function startQuiz(customQuestions = null) {
  if (!customQuestions && selectedCategories.size === 0) {
    alert('من فضلك اختر تخصصاً واحداً على الأقل لبدء المراجعة.');
    return;
  }

  const questionOrder = document.querySelector('input[name="questionOrder"]:checked').value;
  const optionOrder = document.querySelector('input[name="optionOrder"]:checked').value;

  if (customQuestions) {
    quizQuestions = customQuestions;
  } else {
    quizQuestions = [];
    selectedCategories.forEach(catName => {
      const section = allSections.find(s => s.name === catName);
      if (section) {
        section.questions.forEach(q => {
          let options = [...q.o];
          let correctIdx = q.c;

          if (optionOrder === 'random') {
            const indices = options.map((_, i) => i);
            shuffleArray(indices);
            options = indices.map(i => q.o[i]);
            correctIdx = indices.indexOf(q.c);
          }

          quizQuestions.push({
            section: catName,
            qText: q.q,
            options: options,
            correct: correctIdx
          });
        });
      }
    });

    if (questionOrder === 'random') {
      shuffleArray(quizQuestions);
    }
  }

  // Reset Quiz State
  currentQuestionIdx = 0;
  scoreCorrect = 0;
  scoreWrong = 0;
  answersState = new Array(quizQuestions.length).fill(null);

  // Update UI Elements
  document.getElementById('score-correct').innerText = '0';
  document.getElementById('score-wrong').innerText = '0';

  // Screen transition
  switchScreen('setup-screen', 'quiz-screen');
  displayQuestion();
}

// Display Question
function displayQuestion() {
  if (quizQuestions.length === 0) return;

  const currentQ = quizQuestions[currentQuestionIdx];
  
  // Meta Info
  document.getElementById('q-section').innerText = currentQ.section;
  document.getElementById('q-number').innerText = currentQuestionIdx + 1;
  
  // Progress Bar
  const progressPct = ((currentQuestionIdx + 1) / quizQuestions.length) * 100;
  document.getElementById('progress-fill').style.width = `${progressPct}%`;

  // Remaining counts
  const remainingTotal = quizQuestions.length - (currentQuestionIdx + 1);
  document.getElementById('remaining-total').innerText = remainingTotal;

  // Calculate remaining in this section
  let remainingInSec = 0;
  for (let i = currentQuestionIdx + 1; i < quizQuestions.length; i++) {
    if (quizQuestions[i].section === currentQ.section) remainingInSec++;
  }
  document.getElementById('remaining-section').innerText = remainingInSec;

  // Question Text
  document.getElementById('question-text').innerText = currentQ.qText;

  // Options
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  const savedAnswer = answersState[currentQuestionIdx];
  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  currentQ.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `
      <span class="option-letter">${optionLetters[idx]}</span>
      <span class="option-val">${opt}</span>
    `;

    // Apply states if previously answered
    if (savedAnswer !== null) {
      btn.classList.add('disabled');
      if (idx === currentQ.correct) {
        btn.classList.add('correct');
      } else if (idx === savedAnswer.selectedIdx) {
        btn.classList.add('wrong');
      }
    } else {
      btn.addEventListener('click', () => selectOption(idx));
    }

    optionsContainer.appendChild(btn);
  });
}

// Select Option
function selectOption(selectedIdx) {
  const currentQ = quizQuestions[currentQuestionIdx];
  const isCorrect = selectedIdx === currentQ.correct;

  // Save State
  answersState[currentQuestionIdx] = { selectedIdx, isCorrect };

  // Update Counters
  if (isCorrect) {
    scoreCorrect++;
    document.getElementById('score-correct').innerText = scoreCorrect;
  } else {
    scoreWrong++;
    document.getElementById('score-wrong').innerText = scoreWrong;
  }

  // Visual Feedback
  const optionsContainer = document.getElementById('options-container');
  const buttons = optionsContainer.getElementsByClassName('option-btn');

  Array.from(buttons).forEach((btn, idx) => {
    btn.classList.add('disabled');
    if (idx === currentQ.correct) {
      btn.classList.add('correct');
    } else if (idx === selectedIdx) {
      btn.classList.add('wrong');
    }
  });

  // Delay transition for better user experience (only if correct)
  if (isCorrect) {
    setTimeout(() => {
      if (currentQuestionIdx < quizQuestions.length - 1) {
        nextQuestion();
      } else {
        finishQuiz();
      }
    }, 1000);
  }
}

// Navigation Functions
function nextQuestion() {
  if (currentQuestionIdx < quizQuestions.length - 1) {
    currentQuestionIdx++;
    displayQuestion();
  } else {
    finishQuiz();
  }
}

function prevQuestion() {
  if (currentQuestionIdx > 0) {
    currentQuestionIdx--;
    displayQuestion();
  }
}

// Finish Quiz & Show Results
function finishQuiz() {
  // Switch screen
  switchScreen('quiz-screen', 'results-screen');

  // Set values
  document.getElementById('final-score').innerText = `${scoreCorrect}/${quizQuestions.length}`;
  document.getElementById('total-correct').innerText = scoreCorrect;
  document.getElementById('total-wrong').innerText = scoreWrong;

  const pct = quizQuestions.length > 0 ? Math.round((scoreCorrect / quizQuestions.length) * 100) : 0;
  document.getElementById('score-percentage').innerText = `${pct}%`;

  // Animate circular ring
  const circle = document.getElementById('score-ring-fill');
  const circumference = 2 * Math.PI * 52; // 326.7
  const offset = circumference - (circumference * pct) / 100;
  circle.style.strokeDashoffset = offset;

  // Toggle review wrong button visibility
  const reviewBtn = document.getElementById('review-wrong-btn');
  if (scoreWrong > 0) {
    reviewBtn.style.display = 'block';
  } else {
    reviewBtn.style.display = 'none';
  }
}

// Review Wrong Answers Only
function reviewWrongAnswers() {
  const wrongQs = [];
  quizQuestions.forEach((q, idx) => {
    const answer = answersState[idx];
    if (answer && !answer.isCorrect) {
      wrongQs.push({
        section: q.section,
        qText: q.qText,
        options: q.options,
        correct: q.correct
      });
    }
  });

  if (wrongQs.length > 0) {
    startQuiz(wrongQs);
  }
}

// Reset App State
function resetApp() {
  switchScreen('results-screen', 'setup-screen');
  updateTotalCounter();
}

// Navigation Helper
function switchScreen(fromId, toId) {
  const fromEl = document.getElementById(fromId);
  const toEl = document.getElementById(toId);

  fromEl.classList.remove('active');
  setTimeout(() => {
    fromEl.style.display = 'none';
    toEl.style.display = 'block';
    setTimeout(() => {
      toEl.classList.add('active');
    }, 50);
  }, 400);
}
