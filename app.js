// Application State
let selectedExams = new Set(); // Tracks selected exams in format: "CategoryName|ExamName"
let quizQuestions = [];
let currentQuestionIdx = 0;
let scoreCorrect = 0;
let scoreWrong = 0;
let answersState = []; // Tracks user answers: { selectedIdx, isCorrect }
let timerInterval = null;
let timeElapsed = 0; // in seconds
let loadedSections = new Set(); // Tracks which sections have had their question data loaded

// === Lazy Loading: dynamically load section script on demand (Offline & file:// CORS friendly) ===
async function loadSectionData(sectionName) {
  if (loadedSections.has(sectionName)) return true;

  const section = allSections.find(s => s.name === sectionName);
  if (!section || !section.dataFile) return false;

  const scriptSrc = section.dataFile.replace('.json', '.js');

  try {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    const cleanName = sectionName.replace(/[^a-zA-Z]/g, ' ').trim().split(/\s+/).pop().toLowerCase();
    const varName = `${cleanName}Questions`;
    const examsData = window[varName];
    if (!examsData) throw new Error(`Global variable ${varName} not found`);

    // Merge loaded questions into the section's exam objects
    examsData.forEach(loadedExam => {
      const exam = section.exams.find(e => e.name === loadedExam.name);
      if (exam) {
        exam.questions = loadedExam.questions;
      }
    });

    loadedSections.add(sectionName);
    return true;
  } catch (err) {
    console.error(`Failed to load data for ${sectionName}:`, err);
    return false;
  }
}

// Helper: get question count for an exam (works before and after loading)
function getExamQuestionCount(exam) {
  if (exam.questions && exam.questions.length > 0) return exam.questions.length;
  return exam.questionCount || 0;
}

// Check if a section's data is loaded
function isSectionLoaded(sectionName) {
  return loadedSections.has(sectionName);
}

// Ensure all selected sections are loaded before starting
async function ensureSelectedSectionsLoaded() {
  const sectionsToLoad = new Set();
  selectedExams.forEach(key => {
    const secName = key.split('|')[0];
    if (!loadedSections.has(secName)) sectionsToLoad.add(secName);
  });

  const promises = [...sectionsToLoad].map(name => loadSectionData(name));
  await Promise.all(promises);
}

// Ensure all enabled sections are loaded in memory (e.g. for search or saved quiz review)
async function ensureAllEnabledSectionsLoaded() {
  const sectionsToLoad = allSections.filter(s => !s.disabled && s.dataFile && !loadedSections.has(s.name));
  const promises = sectionsToLoad.map(s => loadSectionData(s.name));
  await Promise.all(promises);
}


// Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  updateSavedCounts();
  restoreQuizProgress();
  bindStaticEvents();
  bindKeyboardNavigation();
  initSearch();
});

// Wire all static button event listeners (replaces inline onclick in HTML)
function bindStaticEvents() {
  // Setup screen
  document.getElementById('start-btn')
    .addEventListener('click', () => startQuiz());
  document.getElementById('start-saved-very-important-btn')
    .addEventListener('click', () => startSavedQuiz('very_important'));
  document.getElementById('start-saved-important-btn')
    .addEventListener('click', () => startSavedQuiz('important'));
  document.getElementById('start-saved-all-important-btn')
    .addEventListener('click', () => startSavedQuiz('all'));
  document.getElementById('clear-all-flags-btn')
    .addEventListener('click', () => clearAllFlags());

  // Quiz screen navigation
  document.getElementById('btn-next')
    .addEventListener('click', () => nextQuestion());
  document.getElementById('btn-prev')
    .addEventListener('click', () => prevQuestion());
  document.getElementById('btn-finish')
    .addEventListener('click', () => finishQuiz());

  // Flag buttons — event delegation on the container (buttons are re-rendered per question)
  document.getElementById('question-flags')
    .addEventListener('click', (e) => {
      const btn = e.target.closest('[data-flag-type]');
      if (btn) toggleFlagCurrentQuestion(btn.dataset.flagType, btn);
    });

  // Results screen
  document.getElementById('review-wrong-btn')
    .addEventListener('click', () => reviewWrongAnswers());
  document.getElementById('review-skipped-btn')
    .addEventListener('click', () => reviewSkippedAnswers());
  document.getElementById('review-wrong-skipped-btn')
    .addEventListener('click', () => reviewWrongAndSkippedAnswers());
  document.getElementById('review-very-important-btn')
    .addEventListener('click', () => reviewCurrentQuizFlagged('very_important'));
  document.getElementById('review-important-btn')
    .addEventListener('click', () => reviewCurrentQuizFlagged('important'));
  document.getElementById('review-all-important-btn')
    .addEventListener('click', () => reviewCurrentQuizFlagged('all'));
  document.getElementById('btn-reset-app')
    .addEventListener('click', () => resetApp());
}

// Keyboard Navigation — only active when quiz screen is visible
function bindKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Ignore if an input/textarea is focused
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const quizScreen = document.getElementById('quiz-screen');
    if (!quizScreen || !quizScreen.classList.contains('active')) return;

    switch (e.key) {
      // Next question: → or L
      case 'ArrowRight':
      case 'l':
      case 'L':
        e.preventDefault();
        nextQuestion();
        break;

      // Previous question: ← or H
      case 'ArrowLeft':
      case 'h':
      case 'H':
        e.preventDefault();
        prevQuestion();
        break;

      // Select answer: 1–5 maps to option A–E
      case '1': case '2': case '3': case '4': case '5': {
        if (answersState[currentQuestionIdx] !== null) break; // already answered
        const idx = parseInt(e.key, 10) - 1;
        const currentQ = quizQuestions[currentQuestionIdx];
        if (currentQ && idx < currentQ.options.length) {
          selectOption(idx);
        }
        break;
      }

      // Enter: go next if question already answered
      case 'Enter':
        if (answersState[currentQuestionIdx] !== null) {
          e.preventDefault();
          nextQuestion();
        }
        break;
    }
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

    // Calculate total questions in this category (using questionCount for unloaded sections)
    let totalQuestions = 0;
    section.exams.forEach(exam => {
      totalQuestions += getExamQuestionCount(exam);
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
          <span class="action-link select-all-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 6px;"><path d="M20 6 9 17l-5-5"/></svg>
            تحديد الكل
          </span>
          <span class="action-link deselect-all-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 6px;"><path d="M18 6 6 18M6 6l12 12"/></svg>
            إلغاء الكل
          </span>
        </div>
        ${section.groupTitle ? `<div class="group-title">${section.groupTitle}</div>` : ''}
        <div class="exams-list">
          ${section.exams.map(exam => {
      const examKey = `${section.name}|${exam.name}`;
      const isChecked = selectedExams.has(examKey);
      const qCount = getExamQuestionCount(exam);
      return `
              <div class="exam-item ${isChecked ? 'selected' : ''}" data-key="${examKey}">
                <div class="exam-info">
                  <span class="exam-name">${exam.name}</span>
                  <span class="exam-count">${qCount} سؤال</span>
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
      mainRow.addEventListener('click', async () => {
        card.classList.toggle('expanded');

        // Lazy load section data on first expand
        if (card.classList.contains('expanded') && !isSectionLoaded(section.name) && section.dataFile) {
          const chevron = card.querySelector('.accordion-chevron');
          if (chevron) chevron.innerHTML = '<span class="loading-spinner-small"></span>';
          await loadSectionData(section.name);
          if (chevron) chevron.innerHTML = '▼';
        }
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
      if (exam) total += getExamQuestionCount(exam);
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
async function startQuiz(customQuestions = null) {
  if (!customQuestions && selectedExams.size === 0) {
    alert('من فضلك اختر امتحاناً واحداً على الأقل للبدء.');
    return;
  }

  const startBtn = document.getElementById('start-btn');
  const originalBtnText = startBtn ? startBtn.innerHTML : '';

  if (!customQuestions) {
    try {
      if (startBtn) {
        startBtn.disabled = true;
        startBtn.innerHTML = '<span class="loading-spinner-small"></span> جاري التحميل...';
      }
      await ensureSelectedSectionsLoaded();
    } catch (err) {
      alert('حدث خطأ أثناء تحميل الأسئلة. يرجى التحقق من اتصالك بالإنترنت.');
      return;
    } finally {
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.innerHTML = originalBtnText;
      }
    }
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
              section: getSectionDisplayName(secName, examName),
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
    // Save every 30s to avoid hammering localStorage every second
    // (already saved on every user action: selectOption, next, prev)
    if (timeElapsed % 30 === 0) {
      saveQuizProgress();
    }
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
      <button class="flag-btn flag-important ${isImportant ? 'active' : ''}" data-flag-type="important">
        ⭐️ Important
      </button>
      <button class="flag-btn flag-very-important ${isVeryImportant ? 'active' : ''}" data-flag-type="very_important">
        🔥 V. Important
      </button>
    `;
  }

  // Question Text
  const questionOrder = document.querySelector('input[name="questionOrder"]:checked') ? document.querySelector('input[name="questionOrder"]:checked').value : 'default';
  const optionOrder = document.querySelector('input[name="optionOrder"]:checked') ? document.querySelector('input[name="optionOrder"]:checked').value : 'default';

  const questionTextEl = document.getElementById('question-text');
  if (questionOrder === 'default' && optionOrder === 'default' && currentQ.num) {
    questionTextEl.innerHTML = `<span class="q-num-prefix">${currentQ.num}.</span> ${currentQ.qText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}`;
  } else {
    questionTextEl.textContent = currentQ.qText;
  }

  // Options
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  const savedAnswer = answersState[currentQuestionIdx];
  const optionLetters = ['A)', 'B)', 'C)', 'D)', 'E)'];

  currentQ.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    const letterSpan = document.createElement('span');
    letterSpan.className = 'option-letter';
    letterSpan.textContent = optionLetters[idx];
    const valSpan = document.createElement('span');
    valSpan.className = 'option-val';
    valSpan.textContent = opt;
    btn.appendChild(letterSpan);
    btn.appendChild(valSpan);

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
  const questionContainer = document.querySelector('.question-container');

  Array.from(buttons).forEach((btn, idx) => {
    btn.classList.add('disabled');
    if (idx === currentQ.correct) {
      btn.classList.add('correct');
      if (isCorrect) {
        btn.classList.add('bounce');
      }
    } else if (idx === selectedIdx) {
      btn.classList.add('wrong');
      if (!isCorrect) {
        btn.classList.add('shake');
        if (questionContainer) {
          questionContainer.classList.add('shake');
          setTimeout(() => {
            questionContainer.classList.remove('shake');
          }, 400);
        }
      }
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
    }, 250);
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

  // Counts for action buttons — always from the current session
  const displayWrongCount = scoreWrong;
  const displaySkippedCount = scoreSkipped;

  // Toggle review wrong button visibility
  const reviewWrongBtn = document.getElementById('review-wrong-btn');
  if (displayWrongCount > 0) {
    reviewWrongBtn.style.display = 'block';
    reviewWrongBtn.innerText = `🔄 مراجعة الأسئلة الخاطئة فقط (${displayWrongCount})`;
  } else {
    reviewWrongBtn.style.display = 'none';
  }

  // Toggle review skipped button visibility
  const reviewSkippedBtn = document.getElementById('review-skipped-btn');
  if (displaySkippedCount > 0) {
    reviewSkippedBtn.style.display = 'block';
    reviewSkippedBtn.innerText = `📝 مراجعة الأسئلة المتروكة فقط (${displaySkippedCount})`;
  } else {
    reviewSkippedBtn.style.display = 'none';
  }

  // Toggle review wrong + skipped button visibility
  const reviewWrongSkippedBtn = document.getElementById('review-wrong-skipped-btn');
  const wrongAndSkippedCount = displayWrongCount + displaySkippedCount;
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

  const targetQuestions = quizQuestions;
  targetQuestions.forEach(q => {
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

  const reviewAllImportantBtn = document.getElementById('review-all-important-btn');
  const quizAllImportantCount = quizVeryImportantCount + quizImportantCount;
  if (reviewAllImportantBtn) {
    if (quizAllImportantCount > 0) {
      reviewAllImportantBtn.style.display = 'block';
      reviewAllImportantBtn.innerText = `🔥⭐️ مراجعة الهام + الهام جداً معاً (${quizAllImportantCount})`;
    } else {
      reviewAllImportantBtn.style.display = 'none';
    }
  }
}

// Review Wrong Answers Only
function reviewWrongAnswers() {
  const wrongQs = quizQuestions.filter((q, idx) => {
    const ans = answersState[idx];
    return ans !== null && ans !== undefined && !ans.isCorrect;
  });
  if (wrongQs.length > 0) startQuiz([...wrongQs]);
}

// Review Skipped Answers Only
function reviewSkippedAnswers() {
  const skippedQs = quizQuestions.filter((q, idx) => {
    const ans = answersState[idx];
    return ans === null || ans === undefined;
  });
  if (skippedQs.length > 0) startQuiz([...skippedQs]);
}

// Review Wrong & Skipped Answers together
function reviewWrongAndSkippedAnswers() {
  const combinedQs = quizQuestions.filter((q, idx) => {
    const ans = answersState[idx];
    return ans === null || ans === undefined || !ans.isCorrect;
  });
  if (combinedQs.length > 0) startQuiz([...combinedQs]);
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

// Normalize question text for comparison: trim + collapse whitespace
function normalizeQText(text) {
  return (text || '').trim().replace(/\s+/g, ' ');
}

// FNV-1a 32-bit hash → compact base-36 key (e.g. "qt_2k4f9m")
// Same text always produces the same key — works across exams with different num values
function hashQText(text) {
  let h = 0x811c9dc5;
  const s = normalizeQText(text);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return 'qt_' + h.toString(36);
}

// Get flagged questions from localStorage (with full auto-migration chain)
function getFlaggedQuestions() {
  try {
    const raw = JSON.parse(localStorage.getItem('auc_mcq_flagged_questions') || '{}');
    let didMigrate = false;
    const result = {};

    Object.entries(raw).forEach(([key, value]) => {
      // Format 1 (oldest): "secName|examName|||qText"
      if (key.includes('|||')) {
        const qText = key.split('|||')[1];
        if (qText) {
          const newKey = hashQText(qText);
          result[newKey] = { ...value, key: newKey, qText: normalizeQText(qText) };
          didMigrate = true;
        }
      }
      // Format 2 (old): "q_NUM"
      else if (/^q_\d+$/.test(key)) {
        // Try to get qText from stored value or look up by num (historically only in Dermatology)
        let qText = value.qText || null;
        if (!qText) {
          const dermatology = allSections.find(s => s.name === 'Dermatology');
          if (dermatology) {
            dermatology.exams.forEach(exam => {
              const q = exam.questions.find(q => q.num === value.num);
              if (q) qText = q.q;
            });
          }
        }
        if (qText) {
          const newKey = hashQText(qText);
          result[newKey] = { ...value, key: newKey, qText: normalizeQText(qText) };
          didMigrate = true;
        }
        // If we can't find the text, keep old key (can't migrate)
        else { result[key] = value; }
      }
      // Format 3 (current): "qt_HASH" — keep as-is
      else {
        result[key] = value;
      }
    });

    if (didMigrate) {
      localStorage.setItem('auc_mcq_flagged_questions', JSON.stringify(result));
    }
    return result;
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

// Get section display name (omits prefix if only one section is active/unlocked)
function getSectionDisplayName(secName, examName) {
  const activeSections = allSections.filter(sec => !sec.disabled && sec.exams && sec.exams.length > 0);
  if (activeSections.length === 1) {
    return examName;
  }
  return `${secName} - ${examName}`;
}

// Generate unique key from question TEXT (not num)
// Same question in any exam / with any num → same key → same flag
function getQuestionKey(q) {
  return hashQText(q.qText);
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
    // Store qText (normalized) — critical for cross-exam text-based lookup
    flagged[qKey] = {
      key: qKey,
      qText: normalizeQText(currentQ.qText),
      num: currentQ.num,
      section: currentQ.section,
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

// Clear all flagged questions from localStorage
function clearAllFlags() {
  if (confirm('هل أنت متأكد من مسح جميع الأسئلة المحفوظة للمراجعة؟')) {
    localStorage.removeItem('auc_mcq_flagged_questions');
    updateSavedCounts();
    showToast('تم مسح جميع الأسئلة المحفوظة بنجاح 🧹');
  }
}

// Update flagged counts on the setup screen
function updateSavedCounts() {
  const flagged = getFlaggedQuestions();
  const flaggedList = Object.values(flagged);

  let veryImportantCount = 0;
  let importantCount = 0;

  if (selectedExams.size === 0) {
    // Show active global counts (questions existing in active sections)
    flaggedList.forEach(flaggedQ => {
      if (!flaggedQ.qText) return;
      
      // Use metadata if secName is available to avoid loading files just for counts
      if (flaggedQ.secName) {
        const sec = allSections.find(s => s.name === flaggedQ.secName);
        if (sec && !sec.disabled) {
          if (flaggedQ.flagType === 'very_important') veryImportantCount++;
          if (flaggedQ.flagType === 'important') importantCount++;
        }
      } else {
        // Fallback for legacy format
        const normalText = normalizeQText(flaggedQ.qText);
        const existsInActive = allSections.some(sec => {
          if (sec.disabled) return false;
          return sec.exams.some(exam => exam.questions && exam.questions.some(q => normalizeQText(q.q) === normalText));
        });
        if (existsInActive) {
          if (flaggedQ.flagType === 'very_important') veryImportantCount++;
          if (flaggedQ.flagType === 'important') importantCount++;
        }
      }
    });
  } else {
    // Count flags whose question exists in any currently-selected exam
    flaggedList.forEach(flaggedQ => {
      if (!flaggedQ.qText) return;
      
      if (flaggedQ.secName && flaggedQ.examName) {
        const examKey = `${flaggedQ.secName}|${flaggedQ.examName}`;
        if (selectedExams.has(examKey)) {
          if (flaggedQ.flagType === 'very_important') veryImportantCount++;
          if (flaggedQ.flagType === 'important') importantCount++;
        }
      } else {
        // Fallback for legacy format
        const normalText = normalizeQText(flaggedQ.qText);
        let found = false;
        for (const section of allSections) {
          if (found) break;
          for (const exam of section.exams) {
            if (found) break;
            const examKey = `${section.name}|${exam.name}`;
            if (!selectedExams.has(examKey)) continue;
            if (exam.questions && exam.questions.some(q => normalizeQText(q.q) === normalText)) found = true;
          }
        }
        if (found) {
          if (flaggedQ.flagType === 'very_important') veryImportantCount++;
          if (flaggedQ.flagType === 'important') importantCount++;
        }
      }
    });
  }

  const viBtn = document.getElementById('start-saved-very-important-btn');
  const iBtn = document.getElementById('start-saved-important-btn');
  const allBtn = document.getElementById('start-saved-all-important-btn');

  const viCountSpan = document.getElementById('saved-very-important-count');
  const iCountSpan = document.getElementById('saved-important-count');
  const allCountSpan = document.getElementById('saved-all-important-count');

  const allCount = veryImportantCount + importantCount;

  if (viCountSpan) viCountSpan.innerText = veryImportantCount;
  if (iCountSpan) iCountSpan.innerText = importantCount;
  if (allCountSpan) allCountSpan.innerText = allCount;

  const clearBtn = document.getElementById('clear-all-flags-btn');

  if (viBtn) viBtn.disabled = veryImportantCount === 0;
  if (iBtn) iBtn.disabled = importantCount === 0;
  if (allBtn) allBtn.disabled = allCount === 0;
  if (clearBtn) clearBtn.disabled = allCount === 0;
}

// Start a quiz composed of saved questions of a specific type
async function startSavedQuiz(type) {
  let btnId = '';
  if (type === 'very_important') btnId = 'start-saved-very-important-btn';
  else if (type === 'important') btnId = 'start-saved-important-btn';
  else btnId = 'start-saved-all-important-btn';

  const btn = document.getElementById(btnId);
  const originalText = btn ? btn.innerHTML : '';

  try {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="loading-spinner-small"></span> جاري التحميل...';
    }
    await ensureAllEnabledSectionsLoaded();
  } catch (err) {
    alert('حدث خطأ أثناء تحميل الأسئلة. يرجى التحقق من اتصالك بالإنترنت.');
    return;
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }

  const flagged = getFlaggedQuestions();
  const flaggedList = Object.values(flagged);

  let questionsToQuiz = [];

  if (selectedExams.size === 0) {
    // Review active global flags (only those belonging to active sections)
    const addedTexts = new Set();
    allSections.forEach(section => {
      if (section.disabled) return;
      section.exams.forEach(exam => {
        flaggedList.forEach(flaggedQ => {
          if (!flaggedQ.qText) return;
          const isMatch = (type === 'all')
            ? (flaggedQ.flagType === 'important' || flaggedQ.flagType === 'very_important')
            : (flaggedQ.flagType === type);
          if (!isMatch) return;

          const normalText = normalizeQText(flaggedQ.qText);
          if (addedTexts.has(normalText)) return; // already added from another exam
          if (exam.questions.some(q => normalizeQText(q.q) === normalText)) {
            addedTexts.add(normalText);
            questionsToQuiz.push({
              ...flaggedQ,
              secName: section.name,
              examName: exam.name,
              section: getSectionDisplayName(section.name, exam.name)
            });
          }
        });
      });
    });
  } else {
    // Find flagged questions by TEXT match in selected exams
    // This handles the same question appearing with different nums in different exams
    const addedTexts = new Set();
    allSections.forEach(section => {
      section.exams.forEach(exam => {
        const examKey = `${section.name}|${exam.name}`;
        if (!selectedExams.has(examKey)) return;
        flaggedList.forEach(flaggedQ => {
          if (!flaggedQ.qText) return;
          const isMatch = (type === 'all')
            ? (flaggedQ.flagType === 'important' || flaggedQ.flagType === 'very_important')
            : (flaggedQ.flagType === type);
          if (!isMatch) return;

          const normalText = normalizeQText(flaggedQ.qText);
          if (addedTexts.has(normalText)) return; // already added from another exam
          if (exam.questions.some(q => normalizeQText(q.q) === normalText)) {
            addedTexts.add(normalText);
            questionsToQuiz.push({
              ...flaggedQ,
              secName: section.name,
              examName: exam.name,
              section: getSectionDisplayName(section.name, exam.name)
            });
          }
        });
      });
    });
  }

  if (questionsToQuiz.length === 0) return;

  const optionOrder = document.querySelector('input[name="optionOrder"]:checked').value;
  const formattedQs = questionsToQuiz.map(q => {
    // Look up question by TEXT match — finds correct instance even if num differs across exams
    const sec = allSections.find(s => s.name === q.secName);
    const exam = sec && sec.exams.find(e => e.name === q.examName);
    const normalText = normalizeQText(q.qText || '');
    const origQ = exam && exam.questions.find(question => normalizeQText(question.q) === normalText);
    if (!origQ) return null;

    let options = [...origQ.o];
    let correctIdx = origQ.c;
    if (optionOrder === 'random') {
      const indices = options.map((_, i) => i);
      shuffleArray(indices);
      options = indices.map(i => origQ.o[i]);
      correctIdx = indices.indexOf(origQ.c);
    }
    return {
      section: q.section,
      qText: origQ.q,
      num: origQ.num,
      options: options,
      correct: correctIdx,
      originalQ: origQ,
      secName: q.secName,
      examName: q.examName
    };
  }).filter(Boolean);

  const questionOrder = document.querySelector('input[name="questionOrder"]:checked').value;
  if (questionOrder === 'random') {
    shuffleArray(formattedQs);
  }

  startQuiz(formattedQs);
}

// Review flagged questions in the current quiz run
function reviewCurrentQuizFlagged(type) {
  const flagged = getFlaggedQuestions();
  const flaggedQs = quizQuestions.filter(q => {
    const qKey = getQuestionKey(q);
    return (type === 'all')
      ? (flagged[qKey] && (flagged[qKey].flagType === 'important' || flagged[qKey].flagType === 'very_important'))
      : (flagged[qKey] && flagged[qKey].flagType === type);
  }).map(q => ({ ...q }));

  if (flaggedQs.length > 0) startQuiz(flaggedQs);
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
      }
    }
    if (state.optionOrder) {
      const oInput = document.querySelector(`input[name="optionOrder"][value="${state.optionOrder}"]`);
      if (oInput) {
        oInput.checked = true;
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



// === Quick Search Feature ===
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchClearBtn = document.getElementById('search-clear-btn');
  if (!searchInput || !searchResults) return;

  let debounceTimer = null;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();

    // Show/hide clear button
    if (searchClearBtn) {
      searchClearBtn.style.display = query.length > 0 ? 'flex' : 'none';
    }

    clearTimeout(debounceTimer);
    if (query.length < 2) {
      searchResults.innerHTML = '';
      searchResults.classList.remove('visible');
      return;
    }

    debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);
  });

  // Clear button
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchResults.innerHTML = '';
      searchResults.classList.remove('visible');
      searchClearBtn.style.display = 'none';
      searchInput.focus();
    });
  }

  // Close results when clicking outside
  document.addEventListener('click', (e) => {
    const container = document.getElementById('search-container');
    if (container && !container.contains(e.target)) {
      searchResults.classList.remove('visible');
    }
  });

  // Reopen results on focus if there's content
  searchInput.addEventListener('focus', () => {
    // Lazy-load all enabled sections in the background when the user focuses on the search input
    ensureAllEnabledSectionsLoaded();

    if (searchResults.children.length > 0) {
      searchResults.classList.add('visible');
    }
  });
}

function performSearch(query) {
  const searchResults = document.getElementById('search-results');
  if (!searchResults) return;

  const lowerQuery = query.toLowerCase();
  const results = [];
  const MAX_RESULTS = 20;

  for (const section of allSections) {
    if (section.disabled) continue;
    for (const exam of section.exams) {
      for (const q of exam.questions) {
        if (results.length >= MAX_RESULTS) break;

        // Search in question text AND options
        const matchesQuestion = q.q.toLowerCase().includes(lowerQuery);
        const matchesOption = q.o.some(opt => opt.toLowerCase().includes(lowerQuery));

        if (matchesQuestion || matchesOption) {
          results.push({
            question: q,
            sectionName: section.name,
            examName: exam.name,
            matchType: matchesQuestion ? 'question' : 'option'
          });
        }
      }
      if (results.length >= MAX_RESULTS) break;
    }
    if (results.length >= MAX_RESULTS) break;
  }

  if (results.length === 0) {
    searchResults.innerHTML = `<div class="search-no-results">لا توجد نتائج لـ "${query}"</div>`;
    searchResults.classList.add('visible');
    return;
  }

  searchResults.innerHTML = results.map((r, idx) => {
    const truncatedQ = r.question.q.length > 80
      ? r.question.q.substring(0, 80) + '...'
      : r.question.q;
    const highlighted = highlightMatch(truncatedQ, query);
    const badge = r.matchType === 'option' ? '<span class="search-match-badge">في الخيارات</span>' : '';

    return `
      <div class="search-result-item" data-idx="${idx}" data-section="${r.sectionName}" data-exam="${r.examName}" data-qtext="${escapeAttr(r.question.q)}">
        <div class="search-result-text">${highlighted} ${badge}</div>
        <div class="search-result-meta">${r.sectionName} › ${r.examName}</div>
      </div>
    `;
  }).join('');

  // Add count footer
  if (results.length >= MAX_RESULTS) {
    searchResults.innerHTML += `<div class="search-footer">يتم عرض أول ${MAX_RESULTS} نتيجة فقط — حاول تضييق البحث</div>`;
  }

  searchResults.classList.add('visible');

  // Click handlers for results
  searchResults.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const secName = item.dataset.section;
      const examName = item.dataset.exam;
      const qText = item.dataset.qtext;
      startQuizFromSearch(secName, examName, qText);
    });
  });
}

function highlightMatch(text, query) {
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function startQuizFromSearch(secName, examName, qText) {
  // Close search
  const searchResults = document.getElementById('search-results');
  const searchInput = document.getElementById('search-input');
  if (searchResults) searchResults.classList.remove('visible');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('search-clear-btn');
  if (clearBtn) clearBtn.style.display = 'none';

  // Find the section and exam
  const section = allSections.find(s => s.name === secName);
  if (!section) return;
  const exam = section.exams.find(e => e.name === examName);
  if (!exam) return;

  // Build quiz with the full exam, starting at the matched question
  const optionOrder = document.querySelector('input[name="optionOrder"]:checked') ? document.querySelector('input[name="optionOrder"]:checked').value : 'default';

  const formattedQs = exam.questions.map(q => {
    let options = [...q.o];
    let correctIdx = q.c;

    if (optionOrder === 'random') {
      const indices = options.map((_, i) => i);
      shuffleArray(indices);
      options = indices.map(i => q.o[i]);
      correctIdx = indices.indexOf(q.c);
    }

    return {
      section: getSectionDisplayName(secName, examName),
      qText: q.q,
      num: q.num,
      options: options,
      correct: correctIdx,
      originalQ: q,
      secName: secName,
      examName: examName
    };
  });

  // Find the index of the searched question
  const normalSearch = normalizeQText(qText);
  let startIdx = formattedQs.findIndex(q => normalizeQText(q.qText) === normalSearch);
  if (startIdx < 0) startIdx = 0;

  // Start quiz at that question index
  startQuiz(formattedQs);

  // Jump to the target question
  if (startIdx > 0) {
    currentQuestionIdx = startIdx;
    displayQuestion();
    saveQuizProgress();
  }
}
