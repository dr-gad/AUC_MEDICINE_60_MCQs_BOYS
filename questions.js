// Medical MCQ Question Bank (Batch AUC-60)
// Metadata-only file — actual questions are lazy-loaded from questions/*.json

const allSections = [
  {
    "name": "1. سنوات سابقة",
    "dataFile": "questions/past_years_by_exam.json",
    "groupTitle": "أسئلة السنوات السابقة مقسمة طبقاً لسنة الامتحان",
    "group": "Internal Medicine",
    "exams": [
      { "name": "EM 2021", "questionCount": 30, "questions": [] },
      { "name": "ES 2021", "questionCount": 45, "questions": [] },
      { "name": "EM 2022", "questionCount": 30, "questions": [] },
      { "name": "ES 2022", "questionCount": 45, "questions": [] },
      { "name": "EM 2023", "questionCount": 30, "questions": [] },
      { "name": "ES 2023", "questionCount": 36, "questions": [] },
      { "name": "EM 2024", "questionCount": 28, "questions": [] },
      { "name": "ES 2024", "questionCount": 36, "questions": [] },
      { "name": "EM 2025", "questionCount": 30, "questions": [] },
      { "name": "ES 2025", "questionCount": 36, "questions": [] }
    ]
  },
  {
    "name": "2. سنوات سابقة مقسمة",
    "dataFile": "questions/past_years_by_section.json",
    "groupTitle": "أسئلة السنوات السابقة مقسمة طبقاً للموضوع الطبي",
    "group": "Internal Medicine",
    "exams": [
      { "name": "Cardiology", "questionCount": 86, "questions": [] },
      { "name": "Chest", "questionCount": 75, "questions": [] },
      { "name": "GIT", "questionCount": 43, "questions": [] },
      { "name": "Hepatology", "questionCount": 20, "questions": [] },
      { "name": "Blood", "questionCount": 40, "questions": [] },
      { "name": "Neuro", "questionCount": 28, "questions": [] }
    ]
  },
  {
    "name": "3. ملف القسم",
    "dataFile": "questions/department_file.json",
    "groupTitle": "أسئلة ملف القسم القديم مقسمة طبقاً للموضوع الطبي",
    "group": "Internal Medicine",
    "exams": [
      { "name": "Cardiology", "questionCount": 54, "questions": [] },
      { "name": "Chest", "questionCount": 65, "questions": [] },
      { "name": "GIT", "questionCount": 23, "questions": [] },
      { "name": "Hepatology", "questionCount": 17, "questions": [] },
      { "name": "Blood", "questionCount": 8, "questions": [] },
      { "name": "Neuro", "questionCount": 37, "questions": [] }
    ]
  },
  {
    "name": "4. أسئلة علام",
    "dataFile": "questions/allam_questions.json",
    "groupTitle": "أسئلة دكتور علام مقسمة طبقاً للموضوع الطبي",
    "group": "Internal Medicine",
    "exams": [
      { "name": "Cardiology", "questionCount": 18, "questions": [] },
      { "name": "Chest", "questionCount": 11, "questions": [] },
      { "name": "Blood", "questionCount": 172, "questions": [] },
      { "name": "Neuro", "questionCount": 1, "questions": [] }
    ]
  },
  {
    "name": "5. أسئلة المحاضرات",
    "dataFile": "questions/lectures_questions.json",
    "groupTitle": "أسئلة الدكاترة في المحاضرات مقسمة طبقاً للموضوع الطبي",
    "group": "Internal Medicine",
    "exams": [
      { "name": "Cardiology", "questionCount": 10, "questions": [] },
      { "name": "Chest", "questionCount": 17, "questions": [] },
      { "name": "Hepatology", "questionCount": 8, "questions": [] }
    ]
  },
  {
    "name": "6. كتاب القسم",
    "dataFile": "questions/textbook_questions.json",
    "groupTitle": "أسئلة كتاب القسم القديم مقسمة طبقاً للموضوع الطبي",
    "group": "Internal Medicine",
    "exams": [
      { "name": "Cardiology", "questionCount": 88, "questions": [] },
      { "name": "Chest", "questionCount": 62, "questions": [] },
      { "name": "GIT", "questionCount": 35, "questions": [] },
      { "name": "Hepatology", "questionCount": 53, "questions": [] },
      { "name": "Blood", "questionCount": 196, "questions": [] }
    ]
  }
];
