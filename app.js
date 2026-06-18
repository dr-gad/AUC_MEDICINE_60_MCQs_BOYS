// Application State
let selectedExams = new Set(); // Tracks selected exams in format: "CategoryName|ExamName"
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
          if (input.value === 'random' || input.value === 'off') {
            control.classList.add('shift');
          } else {
            control.classList.remove('shift');
          }
        }
      });
    });
  });
}

// Render Category Cards (Accordion Bento Layout)
function renderCategories() {
  const sectionsList = document.getElementById('sections-list');
  sectionsList.innerHTML = '';

  allSections.forEach(section => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.dataset.name = section.name;

    // Calculate total questions in this category
    let totalQuestions = 0;
    section.exams.forEach(exam => {
      totalQuestions += exam.questions.length;
    });

    card.innerHTML = `
      <div class="category-main-row">
        <div class="category-info">
          <span class="category-name">${section.name}</span>
          <span class="category-count">${section.exams.length} امتحانات (${totalQuestions} سؤال)</span>
        </div>
        <div class="accordion-chevron">▼</div>
      </div>
      <div class="category-details">
        <div class="category-actions">
          <span class="action-link select-all-btn">تحديد الكل</span>
          <span class="action-link deselect-all-btn">إلغاء الكل</span>
        </div>
        <div class="exams-list">
          ${section.exams.map(exam => {
            const examKey = `${section.name}|${exam.name}`;
            const isChecked = selectedExams.has(examKey);
            return `
              <div class="exam-item ${isChecked ? 'selected' : ''}" data-key="${examKey}">
                <div class="exam-info">
                  <span class="exam-name">${exam.name}</span>
                  <span class="exam-count">${exam.questions.length} سؤال</span>
                </div>
                <div class="checkbox-custom"></div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Event listener for expanding/collapsing
    const mainRow = card.querySelector('.category-main-row');
    mainRow.addEventListener('click', () => {
      card.classList.toggle('expanded');
    });

    // Select All action
    const selectAllBtn = card.querySelector('.select-all-btn');
    selectAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectAllExams(section.name, card);
    });

    // Deselect All action
    const deselectAllBtn = card.querySelector('.deselect-all-btn');
    deselectAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deselectAllExams(section.name, card);
    });

    // Individual exam click listeners
    card.querySelectorAll('.exam-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = item.dataset.key;
        if (selectedExams.has(key)) {
          selectedExams.delete(key);
          item.classList.remove('selected');
        } else {
          selectedExams.add(key);
          item.classList.add('selected');
        }
        updateTotalCounter();
      });
    });

    sectionsList.appendChild(card);
  });

  updateTotalCounter();
}

// Select All exams in a category
function selectAllExams(secName, card) {
  const section = allSections.find(s => s.name === secName);
  if (!section) return;
  section.exams.forEach(exam => {
    const key = `${secName}|${exam.name}`;
    selectedExams.add(key);
  });
  card.querySelectorAll('.exam-item').forEach(item => {
    item.classList.add('selected');
  });
  updateTotalCounter();
}

// Deselect All exams in a category
function deselectAllExams(secName, card) {
  const section = allSections.find(s => s.name === secName);
  if (!section) return;
  section.exams.forEach(exam => {
    const key = `${secName}|${exam.name}`;
    selectedExams.delete(key);
  });
  card.querySelectorAll('.exam-item').forEach(item => {
    item.classList.remove('selected');
  });
  updateTotalCounter();
}

// Update Selected Questions Count
function updateTotalCounter() {
  let total = 0;
  selectedExams.forEach(key => {
    const [secName, examName] = key.split('|');
    const section = allSections.find(s => s.name === secName);
    if (section) {
      const exam = section.exams.find(e => e.name === examName);
      if (exam) total += exam.questions.length;
    }
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
  if (!customQuestions && selectedExams.size === 0) {
    alert('من فضلك اختر امتحاناً واحداً على الأقل للبدء.');
    return;
  }

  const questionOrder = document.querySelector('input[name="questionOrder"]:checked').value;
  const optionOrder = document.querySelector('input[name="optionOrder"]:checked').value;

  if (customQuestions) {
    quizQuestions = customQuestions;
  } else {
    quizQuestions = [];
    selectedExams.forEach(key => {
      const [secName, examName] = key.split('|');
      const section = allSections.find(s => s.name === secName);
      if (section) {
        const exam = section.exams.find(e => e.name === examName);
        if (exam) {
          exam.questions.forEach(q => {
            let options = [...q.o];
            let correctIdx = q.c;

            if (optionOrder === 'random') {
              const indices = options.map((_, i) => i);
              shuffleArray(indices);
              options = indices.map(i => q.o[i]);
              correctIdx = indices.indexOf(q.c);
            }

            quizQuestions.push({
              section: `${secName} - ${examName}`,
              qText: q.q,
              options: options,
              correct: correctIdx
            });
          });
        }
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

  // Delay transition for better user experience (only if correct and auto-transition is enabled)
  const autoTransition = document.querySelector('input[name="autoTransition"]:checked').value;
  if (isCorrect && autoTransition === 'on') {
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

  // Calculate skipped questions
  let scoreSkipped = 0;
  answersState.forEach(ans => {
    if (ans === null) scoreSkipped++;
  });
  document.getElementById('total-skipped').innerText = scoreSkipped;

  // Toggle review wrong button visibility
  const reviewWrongBtn = document.getElementById('review-wrong-btn');
  if (scoreWrong > 0) {
    reviewWrongBtn.style.display = 'block';
    reviewWrongBtn.innerText = `🔄 مراجعة الأسئلة الخاطئة فقط (${scoreWrong})`;
  } else {
    reviewWrongBtn.style.display = 'none';
  }

  // Toggle review skipped button visibility
  const reviewSkippedBtn = document.getElementById('review-skipped-btn');
  if (scoreSkipped > 0) {
    reviewSkippedBtn.style.display = 'block';
    reviewSkippedBtn.innerText = `📝 مراجعة الأسئلة المتروكة فقط (${scoreSkipped})`;
  } else {
    reviewSkippedBtn.style.display = 'none';
  }
}

// Review Wrong Answers Only
function reviewWrongAnswers() {
  const wrongQs = [];
  quizQuestions.forEach((q, idx) => {
    const answer = answersState[idx];
    if (answer !== null && !answer.isCorrect) {
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

// Review Skipped Answers Only
function reviewSkippedAnswers() {
  const skippedQs = [];
  quizQuestions.forEach((q, idx) => {
    const answer = answersState[idx];
    if (answer === null) {
      skippedQs.push({
        section: q.section,
        qText: q.qText,
        options: q.options,
        correct: q.correct
      });
    }
  });

  if (skippedQs.length > 0) {
    startQuiz(skippedQs);
  }
}

// Reset App State
function resetApp() {
  switchScreen('results-screen', 'setup-screen');
  updateTotalCounter();
}

// Navigation Helper
function switchScreen(fromId, toId) {
  // Toggle quiz-active class on body and html based on active screen
  if (toId === 'quiz-screen') {
    document.body.classList.add('quiz-active');
    document.documentElement.classList.add('quiz-active');
  } else {
    document.body.classList.remove('quiz-active');
    document.documentElement.classList.remove('quiz-active');
    // Reset scroll position when going back to home/results screen
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  // Hide all screens to prevent any overlap
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
    screen.style.display = 'none';
  });

  // Show the target screen and transition it in
  const toEl = document.getElementById(toId);
  if (toEl) {
    toEl.style.display = 'block';
    toEl.offsetHeight; // Trigger reflow
    toEl.classList.add('active');
  }
}
