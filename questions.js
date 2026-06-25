// Medical MCQ Question Bank (Batch AUC-60)
// Metadata-only file — actual questions are lazy-loaded from questions/*.json

const allSections = [
  {
    "name": "Dermatology",
    "disabled": true,
    "exams": []
  },
  {
    "name": "ENT",
    "disabled": true,
    "exams": []
  },
  {
    "name": "Ophthalmology",
    "disabled": true,
    "exams": []
  },
  {
    "name": "Diagnostic {Radiology}",
    "dataFile": "questions/radiology.json",
    "exams": [
      { "name": "(L1) basics of x-ray and protection", "questionCount": 8, "questions": [] },
      { "name": "(L2) Radiation hazards", "questionCount": 7, "questions": [] },
      { "name": "(L3) Contrast media", "questionCount": 3, "questions": [] },
      { "name": "(L4) Plain radiography", "questionCount": 10, "questions": [] },
      { "name": "(L5) Mammography", "questionCount": 7, "questions": [] },
      { "name": "(L6) Ultrasonography", "questionCount": 7, "questions": [] },
      { "name": "(L7) CT", "questionCount": 8, "questions": [] },
      { "name": "(L8) MRI", "questionCount": 7, "questions": [] },
      { "name": "(L9) Isotope scanning, PET/CT and PET MRI", "questionCount": 2, "questions": [] },
      { "name": "(L10) Radiological anatomy of lung and mediastinum", "questionCount": 5, "questions": [] },
      { "name": "(L11) Radiological anatomy of the abdomen", "questionCount": 7, "questions": [] },
      { "name": "(T3) Imaging modalities used in chest", "questionCount": 7, "questions": [] },
      { "name": "(T4) Imaging modalities used in abdomen", "questionCount": 5, "questions": [] },
      { "name": "(P1) FAST", "questionCount": 5, "questions": [] },
      { "name": "(P2) Mammography", "questionCount": 3, "questions": [] },
      { "name": "(P3) plain x-ray chest(cxr)", "questionCount": 11, "questions": [] }
    ]
  }
];
