// Application State
let selectedExams = new Set(); // Tracks selected exams in format: "CategoryName|ExamName"
let quizQuestions = [];
let currentQuestionIdx = 0;
let scoreCorrect = 0;
let scoreWrong = 0;
let answersState = []; // Tracks user answers: { selectedIdx, isCorrect }
let timerInterval = null;
let timeElapsed = 0; // in seconds

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  initSegmentedControls();
  updateSavedCounts();
  restoreQuizProgress();
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
    if (section.disabled) {
      card.classList.add('disabled');
    }
    card.dataset.name = section.name;

    // Calculate total questions in this category
    let totalQuestions = 0;
    section.exams.forEach(exam => {
      totalQuestions += exam.questions.length;
    });

    let countText = '';
    if (section.exams.length === 1) {
      countText = `1 قسم (${totalQuestions} سؤال)`;
    } else if (section.exams.length >= 3 && section.exams.length <= 10) {
      countText = `${section.exams.length} أقسام (${totalQuestions} سؤال)`;
    } else {
      countText = `${section.exams.length} قسم (${totalQuestions} سؤال)`;
    }
    if (section.soon) {
      countText = 'قريباً...';
    }

    card.innerHTML = `
      <div class="category-main-row">
        <div class="category-info">
          <span class="category-name">${section.name}</span>
          <span class="category-count">${countText}</span>
        </div>
        <div class="accordion-chevron">${section.disabled ? '' : '▼'}</div>
      </div>
      <div class="category-details">
        <div class="category-actions">
          <span class="action-link select-all-btn">تحديد الكل</span>
          <span class="action-link deselect-all-btn">إلغاء الكل</span>
        </div>
        ${section.groupTitle ? `<div class="group-title">${section.groupTitle}</div>` : ''}
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

    // Event listener for expanding/collapsing (only if not disabled)
    if (!section.disabled) {
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
    }

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
  updateSavedCounts();
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
              num: q.num,
              options: options,
              correct: correctIdx,
              originalQ: q,
              secName: secName,
              examName: examName
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

  // Reset and Start Timer
  timeElapsed = 0;
  updateTimerDisplay();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeElapsed++;
    updateTimerDisplay();
    saveQuizProgress();
  }, 1000);

  // Screen transition
  switchScreen('setup-screen', 'quiz-screen');
  displayQuestion();
  saveQuizProgress();
}

// Update Timer Display
function updateTimerDisplay() {
  const timerEl = document.getElementById('quiz-timer');
  if (!timerEl) return;

  const hrs = Math.floor(timeElapsed / 3600);
  const mins = Math.floor((timeElapsed % 3600) / 60);
  const secs = timeElapsed % 60;

  let timeStr = '';
  if (hrs > 0) {
    timeStr += `${hrs.toString().padStart(2, '0')}:`;
  }
  timeStr += `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  timerEl.innerText = `⏱️ ${timeStr}`;
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

  // Question Flags
  const flagsContainer = document.getElementById('question-flags');
  if (flagsContainer) {
    const flagged = getFlaggedQuestions();
    const qKey = getQuestionKey(currentQ);
    const savedFlag = flagged[qKey];
    const isVeryImportant = savedFlag && savedFlag.flagType === 'very_important';
    const isImportant = savedFlag && savedFlag.flagType === 'important';

    flagsContainer.innerHTML = `
      <button class="flag-btn flag-important ${isImportant ? 'active' : ''}" onclick="toggleFlagCurrentQuestion('important', this)">
        ⭐️ Important
      </button>
      <button class="flag-btn flag-very-important ${isVeryImportant ? 'active' : ''}" onclick="toggleFlagCurrentQuestion('very_important', this)">
        🔥 V. Important
      </button>
    `;
  }

  // Question Text
  const questionOrder = document.querySelector('input[name="questionOrder"]:checked') ? document.querySelector('input[name="questionOrder"]:checked').value : 'default';
  const optionOrder = document.querySelector('input[name="optionOrder"]:checked') ? document.querySelector('input[name="optionOrder"]:checked').value : 'default';

  let displayText = currentQ.qText;
  if (questionOrder === 'default' && optionOrder === 'default' && currentQ.num) {
    displayText = `${currentQ.num}. ${displayText}`;
  }
  document.getElementById('question-text').innerText = displayText;

  // Options
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  const savedAnswer = answersState[currentQuestionIdx];
  const optionLetters = ['A)', 'B)', 'C)', 'D)', 'E)'];

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

  saveQuizProgress();

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
    saveQuizProgress();
  } else {
    finishQuiz();
  }
}

function prevQuestion() {
  if (currentQuestionIdx > 0) {
    currentQuestionIdx--;
    displayQuestion();
    saveQuizProgress();
  }
}

// Finish Quiz & Show Results
function finishQuiz() {
  // Stop Timer
  clearInterval(timerInterval);
  clearQuizProgress();

  // Set total time on results screen
  const hrs = Math.floor(timeElapsed / 3600);
  const mins = Math.floor((timeElapsed % 3600) / 60);
  const secs = timeElapsed % 60;
  let timeStr = '';
  if (hrs > 0) {
    timeStr += `${hrs.toString().padStart(2, '0')}:`;
  }
  timeStr += `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  document.getElementById('results-time').innerText = timeStr;

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

  // Toggle review wrong + skipped button visibility
  const reviewWrongSkippedBtn = document.getElementById('review-wrong-skipped-btn');
  const wrongAndSkippedCount = scoreWrong + scoreSkipped;
  if (reviewWrongSkippedBtn) {
    if (wrongAndSkippedCount > 0) {
      reviewWrongSkippedBtn.style.display = 'block';
      reviewWrongSkippedBtn.innerText = `🔄 مراجعة الأخطاء + المتروك (${wrongAndSkippedCount})`;
    } else {
      reviewWrongSkippedBtn.style.display = 'none';
    }
  }

  // Toggle review flagged very important button visibility
  const flagged = getFlaggedQuestions();
  let quizVeryImportantCount = 0;
  let quizImportantCount = 0;

  quizQuestions.forEach(q => {
    const qKey = getQuestionKey(q);
    if (flagged[qKey]) {
      if (flagged[qKey].flagType === 'very_important') quizVeryImportantCount++;
      if (flagged[qKey].flagType === 'important') quizImportantCount++;
    }
  });

  const reviewVIBtn = document.getElementById('review-very-important-btn');
  if (reviewVIBtn) {
    if (quizVeryImportantCount > 0) {
      reviewVIBtn.style.display = 'block';
      reviewVIBtn.innerText = `🔥 مراجعة الأسئلة الهامة جداً في هذا الاختبار (${quizVeryImportantCount})`;
    } else {
      reviewVIBtn.style.display = 'none';
    }
  }

  const reviewIBtn = document.getElementById('review-important-btn');
  if (reviewIBtn) {
    if (quizImportantCount > 0) {
      reviewIBtn.style.display = 'block';
      reviewIBtn.innerText = `⭐️ مراجعة الأسئلة الهامة في هذا الاختبار (${quizImportantCount})`;
    } else {
      reviewIBtn.style.display = 'none';
    }
  }
}

// Review Wrong Answers Only
function reviewWrongAnswers() {
  const wrongQs = [];
  quizQuestions.forEach((q, idx) => {
    const answer = answersState[idx];
    if (answer !== null && !answer.isCorrect) {
      wrongQs.push({
        ...q
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
        ...q
      });
    }
  });

  if (skippedQs.length > 0) {
    startQuiz(skippedQs);
  }
}

// Review Wrong & Skipped Answers together
function reviewWrongAndSkippedAnswers() {
  const combinedQs = [];
  quizQuestions.forEach((q, idx) => {
    const answer = answersState[idx];
    if (answer === null || !answer.isCorrect) {
      combinedQs.push({
        ...q
      });
    }
  });

  if (combinedQs.length > 0) {
    startQuiz(combinedQs);
  }
}

// Reset App State
function resetApp() {
  switchScreen('results-screen', 'setup-screen');
  updateTotalCounter();
  clearQuizProgress();
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

  // Toggle footer visibility: only show on setup screen
  const footer = document.getElementById('site-footer');
  if (footer) {
    if (toId === 'setup-screen') {
      footer.style.display = 'block';
    } else {
      footer.style.display = 'none';
    }
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

// === Flagging Storage & Management Helpers ===

// Get flagged questions from localStorage
function getFlaggedQuestions() {
  try {
    return JSON.parse(localStorage.getItem('auc_mcq_flagged_questions') || '{}');
  } catch (e) {
    console.error("Error reading flagged questions from localStorage", e);
    return {};
  }
}

// Save flagged questions to localStorage
function saveFlaggedQuestions(flagged) {
  try {
    localStorage.setItem('auc_mcq_flagged_questions', JSON.stringify(flagged));
  } catch (e) {
    console.error("Error saving flagged questions to localStorage", e);
  }
}

// Generate unique key for a question
function getQuestionKey(q) {
  return `${q.secName || ''}|${q.examName || ''}|||${q.qText}`;
}

// Toggle a flag of a specific type for the current question
function toggleFlagCurrentQuestion(type, btn) {
  if (btn) btn.blur();
  const currentQ = quizQuestions[currentQuestionIdx];
  if (!currentQ) return;

  const flagged = getFlaggedQuestions();
  const qKey = getQuestionKey(currentQ);

  if (flagged[qKey] && flagged[qKey].flagType === type) {
    // Remove flag if already same type
    delete flagged[qKey];
  } else {
    // Save/update flag (use canonical question representation)
    const origQ = currentQ.originalQ || { q: currentQ.qText, o: currentQ.options, c: currentQ.correct };
    flagged[qKey] = {
      key: qKey,
      section: currentQ.section,
      qText: origQ.q,
      num: currentQ.num,
      options: [...origQ.o],
      correct: origQ.c,
      secName: currentQ.secName || '',
      examName: currentQ.examName || '',
      flagType: type,
      flaggedAt: Date.now()
    };
  }

  saveFlaggedQuestions(flagged);

  // Instantly update UI toggles state
  const updatedFlagged = getFlaggedQuestions();
  const savedFlag = updatedFlagged[qKey];
  const isVeryImportant = savedFlag && savedFlag.flagType === 'very_important';
  const isImportant = savedFlag && savedFlag.flagType === 'important';

  const flagsContainer = document.getElementById('question-flags');
  if (flagsContainer) {
    const impBtn = flagsContainer.querySelector('.flag-important');
    const vimpBtn = flagsContainer.querySelector('.flag-very-important');

    if (impBtn) {
      if (isImportant) impBtn.classList.add('active');
      else impBtn.classList.remove('active');
    }
    if (vimpBtn) {
      if (isVeryImportant) vimpBtn.classList.add('active');
      else vimpBtn.classList.remove('active');
    }
  }
}

// Update flagged counts on the setup screen
function updateSavedCounts() {
  const flagged = getFlaggedQuestions();
  const flaggedList = Object.values(flagged);

  let veryImportantCount = 0;
  let importantCount = 0;

  if (selectedExams.size === 0) {
    // Show global counts if no exams are selected
    veryImportantCount = flaggedList.filter(q => q.flagType === 'very_important').length;
    importantCount = flaggedList.filter(q => q.flagType === 'important').length;
  } else {
    // Show filtered counts for selected exams
    flaggedList.forEach(q => {
      const key = `${q.secName}|${q.examName}`;
      if (selectedExams.has(key)) {
        if (q.flagType === 'very_important') veryImportantCount++;
        if (q.flagType === 'important') importantCount++;
      }
    });
  }

  const viBtn = document.getElementById('start-saved-very-important-btn');
  const iBtn = document.getElementById('start-saved-important-btn');
  const viCountSpan = document.getElementById('saved-very-important-count');
  const iCountSpan = document.getElementById('saved-important-count');

  if (viCountSpan) viCountSpan.innerText = veryImportantCount;
  if (iCountSpan) iCountSpan.innerText = importantCount;

  if (viBtn) viBtn.disabled = veryImportantCount === 0;
  if (iBtn) iBtn.disabled = importantCount === 0;
}

// Start a quiz composed of saved questions of a specific type
function startSavedQuiz(type) {
  const flagged = getFlaggedQuestions();
  const flaggedList = Object.values(flagged);

  let questionsToQuiz = [];

  if (selectedExams.size === 0) {
    // Review all globally
    questionsToQuiz = flaggedList.filter(q => q.flagType === type);
  } else {
    // Filter by selected exams
    flaggedList.forEach(q => {
      const key = `${q.secName}|${q.examName}`;
      if (selectedExams.has(key) && q.flagType === type) {
        questionsToQuiz.push(q);
      }
    });
  }

  if (questionsToQuiz.length === 0) return;

  const optionOrder = document.querySelector('input[name="optionOrder"]:checked').value;
  const formattedQs = questionsToQuiz.map(q => {
    let options = [...q.options];
    let correctIdx = q.correct;
    if (optionOrder === 'random') {
      const indices = options.map((_, i) => i);
      shuffleArray(indices);
      options = indices.map(i => q.options[i]);
      correctIdx = indices.indexOf(q.correct);
    }
    return {
      section: q.section,
      qText: q.qText,
      num: q.num,
      options: options,
      correct: correctIdx,
      originalQ: { q: q.qText, o: q.options, c: q.correct },
      secName: q.secName,
      examName: q.examName
    };
  });

  const questionOrder = document.querySelector('input[name="questionOrder"]:checked').value;
  if (questionOrder === 'random') {
    shuffleArray(formattedQs);
  }

  startQuiz(formattedQs);
}

// Review flagged questions in the current quiz run
function reviewCurrentQuizFlagged(type) {
  const flagged = getFlaggedQuestions();
  const flaggedQs = [];

  quizQuestions.forEach(q => {
    const qKey = getQuestionKey(q);
    if (flagged[qKey] && flagged[qKey].flagType === type) {
      flaggedQs.push({
        ...q
      });
    }
  });

  if (flaggedQs.length > 0) {
    startQuiz(flaggedQs);
  }
}

// === Quiz Progress Persistence Helpers ===
function saveQuizProgress() {
  const questionOrder = document.querySelector('input[name="questionOrder"]:checked') ? document.querySelector('input[name="questionOrder"]:checked').value : 'default';
  const optionOrder = document.querySelector('input[name="optionOrder"]:checked') ? document.querySelector('input[name="optionOrder"]:checked').value : 'default';

  const state = {
    quizQuestions,
    currentQuestionIdx,
    scoreCorrect,
    scoreWrong,
    answersState,
    timeElapsed,
    questionOrder,
    optionOrder
  };
  try {
    localStorage.setItem('auc_mcq_active_quiz_state', JSON.stringify(state));
  } catch (e) {
    console.error("Error saving quiz progress", e);
  }
}

function clearQuizProgress() {
  try {
    localStorage.removeItem('auc_mcq_active_quiz_state');
  } catch (e) {
    console.error("Error clearing quiz progress", e);
  }
}

function restoreQuizProgress() {
  try {
    const saved = localStorage.getItem('auc_mcq_active_quiz_state');
    if (!saved) return;

    const state = JSON.parse(saved);
    if (!state || !state.quizQuestions || state.quizQuestions.length === 0) return;

    quizQuestions = state.quizQuestions;
    currentQuestionIdx = state.currentQuestionIdx || 0;
    scoreCorrect = state.scoreCorrect || 0;
    scoreWrong = state.scoreWrong || 0;
    answersState = state.answersState || [];
    timeElapsed = state.timeElapsed || 0;

    // Restore radio selections
    if (state.questionOrder) {
      const qInput = document.querySelector(`input[name="questionOrder"][value="${state.questionOrder}"]`);
      if (qInput) {
        qInput.checked = true;
        const tab = qInput.closest('.segmented-tab');
        if (tab) {
          tab.parentNode.querySelectorAll('.segmented-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
        }
      }
    }
    if (state.optionOrder) {
      const oInput = document.querySelector(`input[name="optionOrder"][value="${state.optionOrder}"]`);
      if (oInput) {
        oInput.checked = true;
        const tab = oInput.closest('.segmented-tab');
        if (tab) {
          tab.parentNode.querySelectorAll('.segmented-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
        }
      }
    }

    // Update UI Counters
    document.getElementById('score-correct').innerText = scoreCorrect;
    document.getElementById('score-wrong').innerText = scoreWrong;

    // Restore Timer
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeElapsed++;
      updateTimerDisplay();
      saveQuizProgress();
    }, 1000);

    // Switch screen to quiz-screen
    switchScreen('setup-screen', 'quiz-screen');

    // Display current question
    displayQuestion();

    // Show a visual notification/toast
    showToast("تم استعادة تقدمك في الاختبار تلقائياً ⏱️");
  } catch (e) {
    console.error("Error restoring quiz progress", e);
  }
}

// Toast Notification helper
function showToast(message) {
  let toast = document.getElementById('quiz-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'quiz-toast';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.className = 'quiz-toast show';
  setTimeout(() => {
    toast.className = 'quiz-toast';
  }, 3000);
}
