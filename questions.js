// Medical MCQ Question Bank (Batch AUC-60)
// Structured by Specialty -> Exams (e.g. Exam 2025, Exam 2024)

const allSections = [
  {
    "name": "Dermatology",
    "exams": [
      {
        "name": "Fungal Infections",
        "questions": [
          {
            "q": "Favus",
            "o": [
              "Can affect children and adults",
              "Caused by Candida albicans",
              "Main differential diagnosis is Abscess",
              "Never leave scar",
              "Treated by surgical drainage"
            ],
            "c": 0,
            "num": 1
          },
          {
            "q": "False statement about Kerion",
            "o": [
              "Caused by fungi of animal origin",
              "Treated by systemic antifungals",
              "Never Treated by surgical excision",
              "Main differential diagnosis is Psoriasis",
              "It most often occurs on the scalp"
            ],
            "c": 3,
            "num": 2
          },
          {
            "q": "Griseofulvin may be used in the treatment of",
            "o": [
              "Oral candidiasis",
              "Tinea capitis",
              "Impetigo",
              "Pityriasis versicolor",
              "Pediculosis capites"
            ],
            "c": 1,
            "num": 3
          },
          {
            "q": "Endothrix",
            "o": [
              "Deep Fungal infection of internal organs",
              "Fungal infection of hair by Epidermophyton floccosum",
              "Represented with black dot type tinea capitis",
              "May fluoresce with Wood's light examination",
              "Treated by topical antifungals"
            ],
            "c": 2,
            "num": 4
          },
          {
            "q": "Budding spores and short hyphae 'spaghetti and meatballs' are characteristic for",
            "o": [
              "Tinea manum",
              "Tinea (pityriasis) versicolor",
              "Tinea corporis",
              "Tinea cruris",
              "Tinea unguium"
            ],
            "c": 1,
            "num": 5
          },
          {
            "q": "Commonest fungal infection of the female genitalia in diabetes is",
            "o": [
              "Cryptococcal",
              "Madura mycosis",
              "Candidial",
              "Aspergillosis",
              "Tinea cruris"
            ],
            "c": 2,
            "num": 6
          },
          {
            "q": "Spaghetti and meat ball appearance is seen in",
            "o": [
              "Dermatophytes",
              "Aspergillus",
              "Pityriasis versicolor",
              "Candida",
              "Toxoplasmosis"
            ],
            "c": 2,
            "num": 7
          },
          {
            "q": "Favus: (Al-Azhar exam)",
            "o": [
              "An abscess caused by staph epidermidis",
              "Fungal infection occurring only in children",
              "Caused by Trichophyton schoenleinii",
              "Caused by Candida albicans",
              "Treated by surgical drainage"
            ],
            "c": 2,
            "num": 8
          },
          {
            "q": "Wrong statement about Kerion: (Al-Azhar exam)",
            "o": [
              "Caused by fungi of animal origin",
              "Treated by systemic antifungals",
              "Treated by surgical excision",
              "May be mistaken with an abscess",
              "It most often occurs on the scalp"
            ],
            "c": 2,
            "num": 9
          },
          {
            "q": "Griseofulvin is not useful in treatment of one of the following diseases",
            "o": [
              "Tinea capitis",
              "Pityriasis versicolor",
              "Tinea circinata",
              "Tinea cruris",
              "Tinea pedis"
            ],
            "c": 1,
            "num": 10
          },
          {
            "q": "A 10-years-old boy presented with painful boggy swelling of scalp, multiple sinuses with purulent discharge, easily pluckable hairs and lymph nodes enlarged in occipital region. Which one of the following would be most helpful for diagnostic evaluation?",
            "o": [
              "Bacterial culture",
              "Biopsy",
              "KOH mount",
              "Patch test",
              "CBC w differential leucocytic count"
            ],
            "c": 2,
            "num": 11
          }
        ]
      },
      {
        "name": "Bacterial Infections",
        "questions": [
          {
            "q": "One of the following is NOT an indication of systemic antibiotic treatment in impetigo",
            "o": [
              "Fever",
              "Lymph node enlargement",
              "Localized lesions",
              "Glomerulonephritis",
              "Bullous impetigo"
            ],
            "c": 2,
            "num": 12
          },
          {
            "q": "Erythrasma is a superficial infection caused by",
            "o": [
              "Corynebacterium diphtheriae",
              "Corynebacterium minutissimum",
              "Pseudomonas",
              "Streptococcus viridans",
              "Bacillus anthracis"
            ],
            "c": 1,
            "num": 13
          },
          {
            "q": "The deep infection of a group of contiguous follicles with Staph. Aureus is called",
            "o": [
              "Kerion",
              "Carbuncles",
              "Cellulitis",
              "Erysipelas",
              "Favus"
            ],
            "c": 1,
            "num": 14
          },
          {
            "q": "One of the following is exogenous cutaneous tuberculosis",
            "o": [
              "Orificial tuberculosis",
              "Milliary tuberculosis",
              "Scrofuloderma",
              "Tuberculous chancre",
              "Tuberculous gumma"
            ],
            "c": 3,
            "num": 15
          },
          {
            "q": "A 48-year-old woman presents to the Emergency Room with a 2-day history of fever and a well demarcated erythematous plaque on her right cheek. The primary diagnosis was Erysipelas. What is the treatment of choice?",
            "o": [
              "Prednisone",
              "Intravenous penicillin",
              "Cephalexin",
              "Fluconazole",
              "Potent topical corticosteroid"
            ],
            "c": 1,
            "num": 16
          },
          {
            "q": "A child develops honey-colored crusts around the mouth and nose. What is the most likely diagnosis?",
            "o": [
              "Acute urticaria",
              "Impetigo",
              "Atopic dermatitis",
              "Scabies",
              "Psoriasis"
            ],
            "c": 1,
            "num": 17
          }
        ]
      },
      {
        "name": "Viral Skin Infections",
        "questions": [
          {
            "q": "Herpetic whitlow is",
            "o": [
              "It is a nodular eruption found on the hands or digits",
              "Caused by varicella zoster virus",
              "Painless",
              "Treated with systemic steroid",
              "Common to occur in children who suck their thumbs or medical and dental workers"
            ],
            "c": 4,
            "num": 18
          },
          {
            "q": "Wrong statement about Herpes gladiatorum",
            "o": [
              "Herpes simplex virus infection of the face, arms, neck and upper trunk",
              "Typically seen in wrestlers and participants in some contact sports such as rugby",
              "Infection is promoted by trauma to the skin sustained during matches",
              "A primary herpes simplex infection in infants and children with atopic dermatitis due to inoculation of the atopic area with the vaccine virus",
              "In severe cases better treated with systemic antivirus"
            ],
            "c": 3,
            "num": 19
          },
          {
            "q": "Wrong statement about Herpetic sycosis",
            "o": [
              "Is a follicular infection with HSV",
              "Causes vesiculopapular lesions in the beard area",
              "It is often caused by autoinoculation from shaving",
              "Anti-fungal can be used in the treatment",
              "Usually affect adult male"
            ],
            "c": 3,
            "num": 20
          },
          {
            "q": "Suppressive therapy of recurrent Herpes simplex infection",
            "o": [
              "Indicated if the attacks are more than 8 times per year",
              "Indicated for mild uncomplicated eruptions",
              "The drugs are given for at least 12 months",
              "Acyclovir 200mg once daily can be used",
              "Valacyclovir 500mg once daily or Famcyclovir 250mg twice daily can be used"
            ],
            "c": 4,
            "num": 21
          },
          {
            "q": "Causative organism of molluscum contagiosum is",
            "o": [
              "Papova virus",
              "Pox DNA virus",
              "Orthomyxo virus",
              "Parvovirus",
              "RNA virus"
            ],
            "c": 1,
            "num": 22
          },
          {
            "q": "Podophylline is used in treatment of",
            "o": [
              "Plantar warts",
              "Palmar warts",
              "Condylomata accuminata (genital wart)",
              "Condylomata lata",
              "Molluscum contagiosum"
            ],
            "c": 2,
            "num": 23
          },
          {
            "q": "This Human Papilloma Virus (HPV) strain mostly related to cervical intraepithelial neoplasm (CIN)",
            "o": [
              "HPV 6, 11",
              "HPV 1",
              "HPV 2,4",
              "HPV 3,10",
              "HPV 16,18"
            ],
            "c": 4,
            "num": 24
          },
          {
            "q": "Erythema multiforme is most often related to",
            "o": [
              "Herpes zoster infection",
              "Molluscum contagiosum infection",
              "Human papilloma virus infection",
              "Lupus vulgaris",
              "Herpes simplex infection"
            ],
            "c": 4,
            "num": 25
          },
          {
            "q": "The commonest viral infection involved in the etiology of erythema multiforme is",
            "o": [
              "Human papilloma virus",
              "Herpes simplex",
              "Cytomegalovirus",
              "Varicella Zoster virus",
              "Epstein Barr virus"
            ],
            "c": 1,
            "num": 26
          },
          {
            "q": "Sun exposure has been associated with the development of what type of warts?",
            "o": [
              "Flat warts",
              "Myrmecial warts",
              "Common warts",
              "Butcher's warts",
              "Condyloma acuminatum"
            ],
            "c": 0,
            "num": 27
          },
          {
            "q": "Podophyllin is contraindicated in",
            "o": [
              "Plantar warts",
              "Pregnancy",
              "Condylomata accuminata (genital wart)",
              "Condylomata lata",
              "Molluscum contagiosum"
            ],
            "c": 1,
            "num": 28
          },
          {
            "q": "The primary lesion of molluscum contagiosum is",
            "o": [
              "Macule",
              "Papule",
              "Plaque",
              "Vesicle",
              "Pustule"
            ],
            "c": 1,
            "num": 29
          },
          {
            "q": "Treatment of choice for genital warts in pregnancy",
            "o": [
              "Salicylic acid with lactic acid solution",
              "Podophyllin",
              "Systemic antiviral therapy",
              "Imiquimod",
              "Cryotherapy"
            ],
            "c": 4,
            "num": 30
          },
          {
            "q": "Genital warts (condyloma accuminata)",
            "o": [
              "Higher incidence of cervical carcinoma with HPV 16,18 serotype",
              "Higher incidence of cervical carcinoma with HPV 6 serotype",
              "Self-limiting",
              "Treated w phototherapy",
              "Non sexually transmitted disease"
            ],
            "c": 0,
            "num": 31
          },
          {
            "q": "A known immunocompromised child with atopic dermatitis presents with clusters of itchy blisters, fever, and painful skin rashes. Which of the following organisms is most likely causative agent for this superadded infection?",
            "o": [
              "Aerobic diphtheroids",
              "Herpes simplex virus",
              "Staphylococcous epidermidis",
              "Staphylococcous aureus",
              "Pox virus"
            ],
            "c": 1,
            "num": 32
          },
          {
            "q": "A 25-year-old female presents with a 2-day history of painful genital ulcers. On examination, multiple small vesicles on an erythematous base are noted on the labia majora. Which of the following is the most appropriate initial diagnostic test?",
            "o": [
              "Tzanck smear",
              "Viral culture",
              "Serology for HSV-1 and HSV-2",
              "PCR for HSV DNA",
              "Bacterial culture"
            ],
            "c": 0,
            "num": 33
          },
          {
            "q": "Tzanck smear used to aid diagnosis?",
            "o": [
              "Skin lesions of meningococcus",
              "Herpes vesicular lesions",
              "Secondary syphilis",
              "Urticaria",
              "EBV"
            ],
            "c": 1,
            "num": 34
          },
          {
            "q": "This Human Papilloma Virus strain responsible for anogenital warts with very high risk of cervical carcinoma",
            "o": [
              "HPV 6, 11",
              "HPV 16, 18",
              "HPV 2, 4",
              "HPV 3, 10",
              "HPV 7"
            ],
            "c": 1,
            "num": 35
          }
        ]
      },
      {
        "name": "Parasitic Infestations (Scabies & Pediculosis)",
        "questions": [
          {
            "q": "Safe topical scabicide in pregnancy",
            "o": [
              "Sulphur oint 5%",
              "Benzyl benzoate 25%",
              "Gamma benzene hexachloride 1%",
              "Permethrin 2.5 - 5%",
              "Iverzin lotion"
            ],
            "c": 3,
            "num": 36
          },
          {
            "q": "Pediculosis capitis may be treated by",
            "o": [
              "Malathionine",
              "Benzyl peroxide",
              "Famwire",
              "Trimethoprim/sulphamethoxazole",
              "Amphotericin B"
            ],
            "c": 0,
            "num": 37
          },
          {
            "q": "Adult scabies is characterized by",
            "o": [
              "Involve palm and soles",
              "Involve face",
              "Involve anterior abdomen",
              "Non itchy",
              "Involve genitalia and web space"
            ],
            "c": 4,
            "num": 38
          },
          {
            "q": "Treatment of choice for scabies in pregnancy?",
            "o": [
              "Salicylic acid solution",
              "Ivermectin",
              "Ectomethrin",
              "Sulphur oint 5%",
              "Systemic anti scabietic and methotrexate"
            ],
            "c": 2,
            "num": 39
          },
          {
            "q": "Characteristic lesion in scabies",
            "o": [
              "Burrows",
              "Vesicle",
              "Papule",
              "Pustule",
              "Nodule"
            ],
            "c": 0,
            "num": 40
          },
          {
            "q": "What is the least effective topical scabicide treatment?",
            "o": [
              "Sulphur oint 5-10%",
              "Benzyl benzoate 25%",
              "Gamma benzene hexachloride 1%",
              "Permethrin 2.5 - 5%",
              "Crotamiton 10%"
            ],
            "c": 4,
            "num": 41
          },
          {
            "q": "Not a common site for predilection of scabies",
            "o": [
              "Wrist",
              "Finger webs",
              "Genital area",
              "Outer thighs",
              "Buttocks"
            ],
            "c": 3,
            "num": 42
          },
          {
            "q": "Scabies in children differ than adult scabies that it can involves the following body site",
            "o": [
              "Face & scalp",
              "Upper back",
              "Genitalia",
              "Flexures",
              "Buttocks"
            ],
            "c": 0,
            "num": 43
          },
          {
            "q": "Burrow is",
            "o": [
              "Localised collection of fluid",
              "Solid elevation of the skin less than 0.5cm in diameter",
              "Tunnel in the epidermis produced by female sarcopetes scabii",
              "Deroofed furrow",
              "Area of depigmented skin"
            ],
            "c": 2,
            "num": 44
          }
        ]
      },
      {
        "name": "Leprosy & Cutaneous Tuberculosis",
        "questions": [
          {
            "q": "One of the following is NOT a characteristic of Leprosy",
            "o": [
              "Unstable disease",
              "Indeterminate leprosy is an early form of the disease",
              "Keratinocytes are the target cells for the lepra bacilli",
              "Dapsone is the backbone of treatment of all types of leprosy",
              "Not an autoimmune disease"
            ],
            "c": 2,
            "num": 45
          },
          {
            "q": "In leprosy, the minimum number of T-cell lymphocytes is seen in",
            "o": [
              "Tuberculoid leprosy",
              "Border line tuberculoid leprosy",
              "Mid border line leprosy",
              "Border line lepromatous leprosy",
              "Lepromatous leprosy"
            ],
            "c": 4,
            "num": 46
          },
          {
            "q": "Lepromin test is strongly positive in",
            "o": [
              "LT (Lepromatous leprosy)",
              "TB (Tuberculoid type)",
              "BL (Borderline lepromatous)",
              "BB (Borderline tuberculoid)",
              "Lepra reaction"
            ],
            "c": 1,
            "num": 47
          },
          {
            "q": "The characteristics of tuberculoid leprosy is",
            "o": [
              "Lepromin test +ve",
              "IL4, IL-10",
              "Multibacillary",
              "Lepromin test -ve",
              "No loss of sensation or sweating"
            ],
            "c": 0,
            "num": 48
          },
          {
            "q": "In leprosy, the maximum number of T-cell lymphocytes is seen in",
            "o": [
              "Tuberculoid leprosy",
              "Borderline tuberculoid leprosy",
              "Mid border line leprosy",
              "Borderline lepromatous leprosy",
              "Lepromatous leprosy"
            ],
            "c": 0,
            "num": 49
          },
          {
            "q": "As regard leprosy, choose one correct answer",
            "o": [
              "Leprosy is a stable disease",
              "Indeterminate leprosy is a late form of the disease",
              "Keratinocytes are the target cells for the lepra bacilli",
              "Dapsone is the backbone of treatment of all types of leprosy",
              "Leprosy is autoimmune disease"
            ],
            "c": 3,
            "num": 50
          },
          {
            "q": "A patient presents with multiple a sensate patches on the abdomen. A diagnosis of leprosy is made. Which of the following regimens is the WHO recommendation for treatment of paucibacillary leprosy?",
            "o": [
              "Dapsone 100mg daily and rifampin 600mg monthly",
              "Dapsone 100mg daily and clofazimine 300mg monthly",
              "Clofazimine 300mg monthly and rifampin 600mg monthly",
              "Minocycline100mg daily and rifampin600monthly",
              "Minocycline 300mg monthly and clofazimine 300mg monthly"
            ],
            "c": 0,
            "num": 51
          },
          {
            "q": "A 45 yrs old patient presents with multiple diffuse thickening, numerous discrete, and confluent nodules. A diagnosis of lepromatous leprosy is made. Which of the following regimens is the WHO recommendation for treatment of multibacillary leprosy?",
            "o": [
              "Dapsone 100mg daily and rifampin 600mg daily clofazimine 300mg monthly for 12 months",
              "Dapsone 100mg daily rifampin 600mg monthly and clofazimine 300mg monthly for 12 months",
              "Dapsone 100mg daily rifampin 600mg monthly and clofazimine 300mg monthly for 6 months",
              "Clofazimine 300mg monthly and rifampin 600mg monthly",
              "Minocycline100mg daily and rifampin600 monthly"
            ],
            "c": 1,
            "num": 52
          },
          {
            "q": "Worst prognosis in leptrotic cases is in",
            "o": [
              "Borderline leprosy",
              "Borderline lepromatous leprosy",
              "Lepromatous leprosy",
              "Borderline tuberculoid leprosy",
              "Tuberculoid leprosy"
            ],
            "c": 2,
            "num": 53
          },
          {
            "q": "One of the following is exogenous cutaneous tuberculosis",
            "o": [
              "Orificial tuberculosis",
              "Milliary tuberculosis",
              "Scrofuloderma",
              "Tuberculous chancre",
              "Tuberculous gumma"
            ],
            "c": 3,
            "num": 54
          }
        ]
      },
      {
        "name": "Psoriasis & Papulosquamous Diseases",
        "questions": [
          {
            "q": "Contraindicated in severe widespread psoriasis",
            "o": [
              "Methotrexate",
              "Oral retinoids",
              "Cyclosporine",
              "Cyclophosphamide",
              "Oral glucocorticoids"
            ],
            "c": 4,
            "num": 55
          },
          {
            "q": "Not an indication for systemic therapy of psoriasis",
            "o": [
              "Arthropathic psoriasis",
              "Generalized pustular psoriasis",
              "Erythrodermic psoriasis",
              "Moderate to severe psoriasis",
              "Localized pustular psoriasis"
            ],
            "c": 4,
            "num": 56
          },
          {
            "q": "Wrong statement about Herald patch",
            "o": [
              "Usually situated on the trunk",
              "It is a sharply defined, bright-red, round or oval plaque, covered by fine scale",
              "Seen in Pityriasis versicolor",
              "The long axes of the lesions follow Christmas-tree pattern on the upper chest and back",
              "The disease is self-limiting"
            ],
            "c": 2,
            "num": 57
          },
          {
            "q": "Kobner's phenomenon is seen in one of the following disease",
            "o": [
              "Pityriasis Rosea",
              "Herpes simplex",
              "Atopic dermatitis",
              "Lichen planus",
              "Melasma"
            ],
            "c": 3,
            "num": 58
          },
          {
            "q": "Auspitz sign (pin point bleeding upon scratching of a lesion with a glass slide) is seen in",
            "o": [
              "Atopic dermatitis",
              "Lichen simplex chronicus",
              "Psoriasis",
              "Scabies",
              "Tinea capitis"
            ],
            "c": 2,
            "num": 59
          },
          {
            "q": "This type of psoriasis is commonly seen in children and may follow a streptococcal sore throat",
            "o": [
              "Stable plaque",
              "Pustular",
              "Guttate",
              "Arthropathic",
              "Erythrodermic"
            ],
            "c": 2,
            "num": 60
          },
          {
            "q": "Kobner's phenomenon is NOT seen in",
            "o": [
              "Lichen planus",
              "Warts",
              "Psoriasis",
              "Atopic dermatitis",
              "Vitiligo"
            ],
            "c": 3,
            "num": 61
          },
          {
            "q": "A young adult presents with silvery-white scales on erythematous plaques over the elbows and knees. What is the most probable diagnosis?",
            "o": [
              "Eczema",
              "Psoriasis vulgaris",
              "Tinea corporis",
              "Erythema multiform",
              "Lichen planus"
            ],
            "c": 1,
            "num": 62
          },
          {
            "q": "Mucosa is involved in",
            "o": [
              "Psoriasis",
              "Lichen planus",
              "Alopecia",
              "Scabies",
              "Onychomycosis"
            ],
            "c": 1,
            "num": 63
          },
          {
            "q": "Severe generalized psoriasis and hepatic cirrhosis is best treated by",
            "o": [
              "Narrow band UVB",
              "Methotrexate",
              "Systemic steroids",
              "Systemic photochemotherapy (PUVA)",
              "Acitretin"
            ],
            "c": 1,
            "num": 64
          },
          {
            "q": "The treatment of choice for erythrodermic psoriasis is",
            "o": [
              "Topical corticosteroids",
              "Systemic corticosteroids",
              "Methotrexate",
              "Crude Coal tar",
              "Phototherapy"
            ],
            "c": 2,
            "num": 65
          },
          {
            "q": "This type of psoriasis is seen in pregnant women",
            "o": [
              "Pustular",
              "Herpes gestations",
              "Impetigo herpetiform",
              "Arthropathic",
              "Erythrodermic"
            ],
            "c": 4,
            "num": 66
          },
          {
            "q": "One of the following diseases heal without cicatricial alopecia",
            "o": [
              "Discoid Lupus Erythematosus",
              "Seborrheic dermatitis",
              "Folliculitis decalvans",
              "Favus",
              "Kerion"
            ],
            "c": 1,
            "num": 67
          }
        ]
      },
      {
        "name": "Eczema & Dermatitis",
        "questions": [
          {
            "q": "An infant presented with erythematous lesions on cheek, extensor aspect of limbs, mother has history of bronchial asthma, the probable diagnosis is",
            "o": [
              "Air borne contact dermatitis",
              "Atopic dermatitis",
              "Seborrheic dermatitis",
              "Infectious eczematoid dermatitis",
              "Hereditary angioedema"
            ],
            "c": 1,
            "num": 68
          },
          {
            "q": "Worldwide most common cause for contact dermatitis is",
            "o": [
              "Nickel",
              "Gold",
              "Silver",
              "Chromium",
              "Mercury"
            ],
            "c": 0,
            "num": 69
          },
          {
            "q": "Patch test is an important method for diagnosis of",
            "o": [
              "Allergic contact dermatitis",
              "Irritant contact dermatitis",
              "Infective dermatitis",
              "Atopic dermatitis",
              "Urticaria"
            ],
            "c": 0,
            "num": 70
          },
          {
            "q": "A 25-year old presents with recurrent episodes of flexural eczema, contact urticaria, recurrent skin infections and severe abdominal cramps and diarrhea upon taking sea foods. He is suffering from",
            "o": [
              "Seborrheic dermatitis",
              "Atopic dermatitis",
              "Air born Contact eczema",
              "Acute urticaria",
              "Cow's milk protein allergy"
            ],
            "c": 1,
            "num": 71
          },
          {
            "q": "Discoid lupus erythematosus is best treated by",
            "o": [
              "Topical antimalarials only",
              "Topical antimalarials + systemic antimalarials",
              "Topical antimalarials + topical steroids",
              "Topical antimalarials + systemic steroids",
              "Systemic antimalarials + topical steroids"
            ],
            "c": 4,
            "num": 72
          }
        ]
      },
      {
        "name": "Acne Vulgaris",
        "questions": [
          {
            "q": "Wrong statement regarding the Pathogenesis of acne vulgaris",
            "o": [
              "Androgen-induced sebaceous gland hyperactivity",
              "Plugging of the hair follicle with abnormally keratinized cells",
              "Proliferation of bacteria - Propionibacterium acnes",
              "Inflammation arises from the action of enzymes produced by the bacteria",
              "Isotretinoin improve acne via its antiandrogen effect"
            ],
            "c": 4,
            "num": 73
          },
          {
            "q": "Wrong statement about systemic isotretinoin in the treatment of acne vulgaris",
            "o": [
              "Mechanism of action is sebum suppression, P. acnes reduction and anti inflammatory",
              "Teratogenic class A",
              "Side effects include Cheilitis, conjunctivitis, nasal dryness, elevation of lipid profiles, liver function",
              "Should be discontinued in female in child bearing period one month before pregnancy",
              "Dose is 0.5 - 1mg / kg / day"
            ],
            "c": 1,
            "num": 74
          },
          {
            "q": "Wrong statement about Miliaria",
            "o": [
              "Occurs due to Obstruction of eccrine sweat ducts in hot humid environment",
              "Types include miliaria crystalline, miliaria rubra, miliaria profunda",
              "Can be treated with air conditioned together with topical antibiotic and mild topical steroids and calamine lotion",
              "Miliaria crystallina is a type that occurs deeper in the skin",
              "Miliaria pustulosa occurs when the vesicles of miliaria rubra become inflamed and pus-filled (pustular)"
            ],
            "c": 3,
            "num": 75
          },
          {
            "q": "Treatment of severe nodulocystic acne with which of the following vitamin derivatives may arrest the disease process through decreasing sebaceous activity and decreasing P. acnes?",
            "o": [
              "Vitamin E",
              "Vitamin A",
              "Vitamin K",
              "Vitamin D",
              "Vitamin B3"
            ],
            "c": 1,
            "num": 76
          },
          {
            "q": "What is the minimum amount of time that you would advise the woman to avoid childbearing after completing a course of isotretinoin for treatment of acne?",
            "o": [
              "1 week",
              "1 month",
              "6 months",
              "1 year",
              "3 years"
            ],
            "c": 1,
            "num": 77
          },
          {
            "q": "The most common laboratory abnormality in patients treated with isotretinoin is",
            "o": [
              "Decreased white blood cell count",
              "Increased cholesterol",
              "Elevated liver enzymes",
              "Hypertriglyceridemia",
              "Elevated CPK"
            ],
            "c": 3,
            "num": 78
          },
          {
            "q": "Severe nodulocystic acne Patient on vitamin A derivatives (isotretinoin oral), pseudotumor cerebri is most likely to occur with which of the following systemic medication?",
            "o": [
              "Doxycycline",
              "Vitamin A",
              "Vitamin K",
              "Sulphur",
              "Amoxicillin"
            ],
            "c": 0,
            "num": 79
          },
          {
            "q": "The dominant organism present on oily regions of the skin is",
            "o": [
              "Gram positive coagulase negative staphylococcus",
              "Staphylococci aureus",
              "Propionibacterium acnes",
              "Corynebacterium spp.",
              "Propionibacterium avidum"
            ],
            "c": 2,
            "num": 80
          },
          {
            "q": "Sebaceous glands secrete sebum via",
            "o": [
              "Holocrine mechanism",
              "Exocrine mechanism",
              "Endocrine mechanism",
              "Exostosis",
              "Merocrine mechanism"
            ],
            "c": 0,
            "num": 81
          },
          {
            "q": "Regarding sebaceous glands",
            "o": [
              "These glands are present at birth at their adult size",
              "Size of the gland is proportional to the size of the associated hair follicle",
              "Are always associated with a hair follicle",
              "Are found everywhere on the skin except palms and soles",
              "Are unilobular glands"
            ],
            "c": 3,
            "num": 82
          }
        ]
      },
      {
        "name": "Alopecia & Hair Disorders",
        "questions": [
          {
            "q": "Telogen phase of the hair indicates",
            "o": [
              "The phase of activity and growth",
              "The phase of resting",
              "A genetic background of hair falling",
              "The phase of transition",
              "The phase of degeneration"
            ],
            "c": 1,
            "num": 83
          },
          {
            "q": "Telogen effluvium",
            "o": [
              "Involves a diffuse alopecia affecting more than 50% of the scalp",
              "Often results from antimetabolites used during cancer chemotherapy",
              "Is an inflammatory alopecia devoid of scarring",
              "Is a patchy alopecia affecting less than 50% of the scalp",
              "Results from sudden illness or surgery"
            ],
            "c": 4,
            "num": 84
          },
          {
            "q": "Hair follicle development in the human embryo begins during",
            "o": [
              "1st trimester",
              "2nd trimester",
              "3rd trimester",
              "At the blastocoele stage",
              "Within 2 weeks of fertilization"
            ],
            "c": 0,
            "num": 85
          },
          {
            "q": "Contraindicated in androgenic alopecia",
            "o": [
              "Testosterone",
              "Minoxidil",
              "Cyproterone",
              "Finasteride",
              "Spironolactone"
            ],
            "c": 0,
            "num": 86
          }
        ]
      },
      {
        "name": "Lichen Planus, Vitiligo & Skin Morphology",
        "questions": [
          {
            "q": "A 19-year-old boy presented with asymptomatic, multiple small Brown and dark macules in sun exposed area which increase in summer and decrease in winter, the most likely diagnosis is",
            "o": [
              "Pityriasis versicolor",
              "Chloasma",
              "Borderline leprosy",
              "Melasma",
              "Freckles"
            ],
            "c": 4,
            "num": 87
          },
          {
            "q": "A 5 year boy has recurrent multiple asymptomatic oval and circular faintly hypopigmented macules with fine scaling on his face. The most probable clinical diagnosis is",
            "o": [
              "Pityriasis versicolor",
              "Pityriasis alba",
              "Albinism",
              "Indeterminate leprosy",
              "Acrofacial vitiligo"
            ],
            "c": 1,
            "num": 88
          },
          {
            "q": "Wrong statement about Melanin",
            "o": [
              "Distributed in the basal layer of the skin",
              "Formed a shade like to protect the dermis and the important structure of the skin from the harmful UV light",
              "Absence of the skin pigment due to any cause is very harmful to the skin",
              "Every person has the special degree of pigmentation",
              "Increase number of both melanin and melanocytes in freckles"
            ],
            "c": 4,
            "num": 89
          },
          {
            "q": "In a patch of vitiligo",
            "o": [
              "Melanin synthesis is inhibited",
              "Melanosomes are absent",
              "Melanocytes are absent",
              "Melanocytes are reduced",
              "Acanthosis of the epidermis"
            ],
            "c": 2,
            "num": 90
          },
          {
            "q": "A 22-year-old woman developed small itchy wheals after physical exertion, walking in the sun, eating hot spicy food and when she was angry. The most likely diagnosis is",
            "o": [
              "Cholinergic urticaria",
              "Chronic idiopathic urticaria",
              "Heat urticaria",
              "Aquagenic urticaria",
              "Solar urticaria"
            ],
            "c": 0,
            "num": 91
          },
          {
            "q": "A 28-year-old woman developed itchy red wheals after walking in the sun. The most likely diagnosis is",
            "o": [
              "Cholinergic urticaria",
              "Chronic idiopathic urticaria",
              "Heat urticaria",
              "Aquagenic urticaria",
              "Solar urticaria"
            ],
            "c": 4,
            "num": 92
          },
          {
            "q": "A 18-year-old woman developed small, raised 1-4 mm wheals which last for 15-30 minutes after walking in the sun or after vigorous exercise, the most likely diagnosis is",
            "o": [
              "Cholinergic urticaria",
              "Chronic idiopathic urticaria",
              "Heat urticaria",
              "Aquagenic urticaria",
              "Solar urticaria"
            ],
            "c": 0,
            "num": 93
          },
          {
            "q": "The deepest layer of the epidermis",
            "o": [
              "Stratum corneum",
              "Stratum basale",
              "Stratum granulosum",
              "Stratum lucidum",
              "Stratum spinosum"
            ],
            "c": 1,
            "num": 94
          },
          {
            "q": "A skin lesion with fluid-filled blisters larger than 0.5cm in diameter belongs to",
            "o": [
              "Pustule",
              "Abscess",
              "Vesicle",
              "Bulla",
              "Ulcer"
            ],
            "c": 3,
            "num": 95
          },
          {
            "q": "A skin lesion with small fluid-filled blisters less than 0.5cm in diameter belongs to",
            "o": [
              "Pustule",
              "Abscess",
              "Vesicle",
              "Bulla",
              "Ulcer"
            ],
            "c": 2,
            "num": 96
          },
          {
            "q": "A skin lesion with large clear fluid-filled blisters more than 0.5cm in diameter belongs to",
            "o": [
              "Pustule",
              "Abscess",
              "Vesicle",
              "Bulla",
              "Ulcer"
            ],
            "c": 3,
            "num": 97
          },
          {
            "q": "Exogenous injury to all parts of the epidermis is called",
            "o": [
              "Erosion",
              "Ulceration",
              "Excoriation",
              "Fissuring",
              "Lichenification"
            ],
            "c": 0,
            "num": 98
          },
          {
            "q": "A plaque is a",
            "o": [
              "Patch of abnormal change of skin texture",
              "Area of depigmentation",
              "The primary lesion of acne vulgaris",
              "Localised epidermal collection of fluid",
              "Deroofed burrow"
            ],
            "c": 0,
            "num": 99
          },
          {
            "q": "Histamine is the chief mediator of",
            "o": [
              "Contact dermatitis",
              "Urticaria",
              "Atopic dermatitis",
              "Discoid lupus erythematosus",
              "Psoriasis"
            ],
            "c": 1,
            "num": 100
          },
          {
            "q": "Vitiligo as an autoimmune disease may be associated with",
            "o": [
              "Impetigo",
              "Herpes zoster",
              "Alopecia",
              "Pityriasis rosea",
              "Lichen planus"
            ],
            "c": 2,
            "num": 101
          },
          {
            "q": "Which of the following is not true about the effects of ultraviolet radiation on the immune system?",
            "o": [
              "UV radiation causes an increase in number of Langerhans cells in the epidermis",
              "UV radiation causes nuclear DNA damage",
              "Effects can be demonstrated by the example of reactivation of latent herpes simplex infection after sun exposure",
              "UV radiation acts to suppress the immune system both locally and systematically",
              "Effects can be demonstrated by the ability of an antigen to induce an allergic hypersensitivity reaction when applied to skin which has been exposed to low doses of UV radiation"
            ],
            "c": 0,
            "num": 102
          },
          {
            "q": "The active spectrum for cutaneous vitamin D3 synthesis is",
            "o": [
              "< 320 nm",
              "290-390 nm",
              "320-400 nm",
              "400-410 nm",
              "300-460 nm"
            ],
            "c": 1,
            "num": 103
          },
          {
            "q": "A patient with atopic dermatitis presents with frequent flares of dermatitis. They have multiple lichenified plaques, some with serum crust. Which of the following organisms is most likely colonizing these areas?",
            "o": [
              "Aerobic diphtheroids",
              "Gram positive coagulase negative cocci",
              "Staphylococcus epidermidis",
              "Staphylococcus aureus",
              "Propionibacterium avidum"
            ],
            "c": 3,
            "num": 104
          },
          {
            "q": "The most potent topical corticosteroids is",
            "o": [
              "Hydrocortisone butyrate cream 0.1%",
              "Betamethasone valerate cream 0.5%",
              "Clobetasol propionate cream 0.5%",
              "Clobetasone butyrate cream 0.5%",
              "Mometasone furoate 0.1%"
            ],
            "c": 2,
            "num": 105
          },
          {
            "q": "The most potent topical corticosteroids are: (second exam)",
            "o": [
              "Hydrocortisone butyrate cream 0.1%",
              "Betamethasone valerate cream 0.5%",
              "Hydrocortisone cream 0.5%",
              "Clobetasone butyrate cream 0.5%",
              "Mometasone furoate 0.1%"
            ],
            "c": 1,
            "num": 106
          }
        ]
      },
      {
        "name": "Sexually Transmitted Infections & Syphilis",
        "questions": [
          {
            "q": "Trichomonas vaginalis can be treated by",
            "o": [
              "Doxycycline",
              "Ciprofloxacin",
              "Itraconazole",
              "Metronidazole",
              "Ceftriaxone"
            ],
            "c": 3,
            "num": 107
          },
          {
            "q": "Which of the following is the drug of choice for non-gonococcal urethritis",
            "o": [
              "Azithromycin",
              "Amoxicillin-clavulanate",
              "Vancomycin",
              "Sulphamethoxazole-trimethoprim",
              "Ceftriaxone"
            ],
            "c": 0,
            "num": 108
          },
          {
            "q": "Which of the following is used to confirm nontreponemal assays?",
            "o": [
              "Complement fixation test",
              "Fluorescent treponemal antibody-absorption (FTA-ABS) test",
              "Rapid Plasma Reagin (RPR) test",
              "Venereal Disease Research Laboratory (VDRL) test",
              "Wasserman test"
            ],
            "c": 1,
            "num": 109
          },
          {
            "q": "Wrong statement about the primary syphilis",
            "o": [
              "Darkfield microscopic examination is the most sensitive and specific method for the diagnosis of primary syphilis",
              "Incubation period 9-90 days after infection",
              "Chancre Usually on or near the genitals",
              "Regional lymph nodes are normal",
              "Painless"
            ],
            "c": 3,
            "num": 110
          },
          {
            "q": "Early latent syphilis",
            "o": [
              "The patient is completely free of signs & symptoms +ve blood tests for syphilis",
              "Psoriasiform lesions in the palm and sole",
              "Generalized lymphadenopathy",
              "Infection for more than two years",
              "The patient is non contagious through Sexual contact"
            ],
            "c": 0,
            "num": 111
          },
          {
            "q": "A young man presents to the emergency department with a maculopapular rash 2 weeks after healing of a painless genital ulcer. The most likely etiological agent is",
            "o": [
              "Treponema pertenue",
              "Treponema pallidum",
              "Chlamydia trachomatis",
              "Calymmatobacter granulomatis",
              "HPV"
            ],
            "c": 1,
            "num": 112
          },
          {
            "q": "Which stage of syphilis is most contagious?",
            "o": [
              "Primary",
              "Secondary",
              "Early latent",
              "Late latent",
              "Stigmata"
            ],
            "c": 1,
            "num": 113
          },
          {
            "q": "Most specific test for syphilis",
            "o": [
              "VDRL",
              "RPR",
              "FTA-ABS",
              "Kahn's test",
              "Dark ground microscopy"
            ],
            "c": 2,
            "num": 114
          },
          {
            "q": "Which of the following tests is the most sensitive serologic test in late primary syphilis?",
            "o": [
              "FTA-ABS",
              "VDRL",
              "ELISA",
              "RPR",
              "MHA-TP"
            ],
            "c": 0,
            "num": 115
          },
          {
            "q": "A 23-year-old male presents with ulcerated lesion on the penis as well as marked unilateral inguinal lymphadenopathy. The lymph node, however, is not particularly painful to the touch. The patient denies abnormal discharge. What is the probable causative etiology?",
            "o": [
              "Chlamydia trachomatis",
              "Haemophilus ducreyi",
              "Neisseria gonorrhoeae",
              "Treponema pallidum",
              "Trichomonas vaginalis"
            ],
            "c": 0,
            "num": 116
          },
          {
            "q": "An 18-year old man presents to the Dermatology Clinic with a nontender penile erosion that has been present for 2 weeks. An indurated border and nontender bilateral inguinal lymphadenopathy are also noted. What is the most likely diagnosis?",
            "o": [
              "Primary syphilis",
              "Chancroid",
              "Herpes simplex",
              "Lymphogranuloma venereum",
              "HIV"
            ],
            "c": 0,
            "num": 117
          },
          {
            "q": "A 42 year-old woman presents with a large, vegetating ulcer involving her left labia majora and groin for over 1 year. A Giemsa's stained touch preparation reveals bipolar, safety pin-shaped intracytoplasmic inclusions. What is the most likely diagnosis?",
            "o": [
              "Lymphogranuloma venereum",
              "Granuloma inguinale",
              "Chancroid",
              "Primary herpes simplex",
              "Gonorrhea"
            ],
            "c": 1,
            "num": 118
          },
          {
            "q": "Granuloma Inguinale is caused by",
            "o": [
              "Chlamydia trachomatis types I, II & III",
              "Hemophilus ducreyi",
              "Klebsiella granulomatis",
              "Treponema pertenue",
              "Treponema pallidum"
            ],
            "c": 2,
            "num": 119
          },
          {
            "q": "The diagnosis of leishmaniasis can be confirmed by which of the following techniques?",
            "o": [
              "Weil-Felix test",
              "Warthin-Starry stain",
              "Culture in Sabouraud's agar",
              "Culture in Novy-MacNeal-Nicolle (NNN) medium",
              "Culture in Michel's medium"
            ],
            "c": 3,
            "num": 120
          },
          {
            "q": "The primary site of infection of gonorrhea in adult male is",
            "o": [
              "Anterior urethra",
              "Posterior urethra",
              "Whole urethra",
              "Fossa navicularis",
              "Glans penis"
            ],
            "c": 0,
            "num": 121
          },
          {
            "q": "The most common cause of non-gonococcal urethritis is",
            "o": [
              "Neisseria gonorrhoeae",
              "Chlamydia Trachomatis",
              "Viral infection",
              "Treponema pallidum",
              "Intrameatal wart"
            ],
            "c": 1,
            "num": 122
          },
          {
            "q": "What is the preferred medication for treating nongonococcal urethritis caused by chlamydia trachomatis?",
            "o": [
              "Amoxicillin",
              "Azithromycin",
              "Ibuprofen",
              "Paracetamol",
              "Ciprofloxacin"
            ],
            "c": 1,
            "num": 123
          },
          {
            "q": "Patients that have diagnosed with congenital syphilis have dental findings called",
            "o": [
              "Hutchinson teeth",
              "Erythrodontia",
              "Hypodontia",
              "Peg-shaped teeth",
              "Enamel hypoplasia"
            ],
            "c": 0,
            "num": 124
          },
          {
            "q": "This type of syphilis has the clinical characteristic of widespread cutaneous eruptions, erythematous macules on the palms and soles, moth eaten alopecia and condyloma lata.",
            "o": [
              "Primary",
              "Secondary",
              "Tertiary",
              "Latent",
              "Congenital"
            ],
            "c": 1,
            "num": 125
          },
          {
            "q": "A 36 yrs. old man presents to the dermatology clinic with a painful genital and lip erosion 2 weeks after he was admitted for treatment of severe pyogenic infection. The most likely diagnosis is",
            "o": [
              "Drug eruption",
              "Erythema multiforme",
              "Erythema nodosum",
              "Toxic shock syndrome",
              "Herpetic infection"
            ],
            "c": 0,
            "num": 126
          }
        ]
      },
      {
        "name": "Sexology & Andrology",
        "questions": [
          {
            "q": "A condition characterized by the presence of abnormally high sperm count that affects fertility in males is called",
            "o": [
              "Polyzoospermia",
              "Asthenospermia",
              "Aspermia",
              "Oligozoospermia",
              "Hypospermia"
            ],
            "c": 0,
            "num": 127
          },
          {
            "q": "The term aspermia refer to",
            "o": [
              "Absence of sperm head",
              "Total absence of sperm",
              "Absence of sperm motility",
              "Absence of sperm tail",
              "Total absence of semen"
            ],
            "c": 4,
            "num": 128
          },
          {
            "q": "One of the following is a sure causes of azoospermia",
            "o": [
              "Bilateral varicocele",
              "Bilateral congenital absent vas deferens",
              "Mumps orchitis",
              "Spermatocele",
              "Unilateral cryptorchidism"
            ],
            "c": 1,
            "num": 129
          },
          {
            "q": "The commonest semen abnormality seen in infertile patients who have varicocele is",
            "o": [
              "Oligoasthenoteratospermia",
              "Polyzoospermia",
              "Leucocytospermia",
              "Necrospermia",
              "Azoospermia"
            ],
            "c": 0,
            "num": 130
          },
          {
            "q": "Wrong statement regarding erection",
            "o": [
              "Erection is a hemodynamic phenomenon",
              "Erection is evoked by smooth muscle relaxation",
              "Vasodilation of cavernosal arteries is evoked by sympathetic innervation",
              "Nitrous oxide is the main neurotransmitter",
              "Passive veno-occlusion occurs during erection"
            ],
            "c": 2,
            "num": 131
          },
          {
            "q": "Testosterone is mainly secreted by",
            "o": [
              "Leydig cells",
              "Germ cell",
              "Tunica albuginea",
              "Sertoli cell",
              "Peritubular cell"
            ],
            "c": 0,
            "num": 132
          },
          {
            "q": "A 62-year-old man with a history of coronary artery disease presents with erectile dysfunction. He is interested in pharmacotherapy. Which of the following is an absolute contraindication to the use of phosphodiesterase-5 inhibitors in this patient?",
            "o": [
              "Concomitant use of alpha-blockers",
              "History of myocardial infarction six months prior",
              "Use of nitrate medications",
              "Diabetes mellitus",
              "Hypertension"
            ],
            "c": 2,
            "num": 133
          },
          {
            "q": "A 35-year-old man presents with premature ejaculation and erectile dysfunction. He reports significant performance anxiety. Which of the following is the most appropriate initial treatment approach?",
            "o": [
              "Selective serotonin reuptake inhibitors (SSRIs)",
              "Phosphodiesterase-5 inhibitors",
              "Cognitive behavioral therapy (CBT)",
              "Combination therapy with SSRIs and PDE-5 inhibitors",
              "Penile prosthesis"
            ],
            "c": 2,
            "num": 134
          },
          {
            "q": "Which anatomical structure traps blood within the penis to maintain an erection?",
            "o": [
              "Tunica albuginea",
              "Corpus spongiosum",
              "Urethra",
              "Inguinal ligaments",
              "Glans penis"
            ],
            "c": 0,
            "num": 135
          },
          {
            "q": "Which enzyme plays a key role in terminating the erection process?",
            "o": [
              "Phosphodiesterase-5",
              "Aromatase",
              "5-alpha reductase",
              "Lipase",
              "Hydroxysteroid dehydrogenase"
            ],
            "c": 0,
            "num": 136
          },
          {
            "q": "Which hormone is primarily responsible for stimulating testosterone production in males?",
            "o": [
              "FSH",
              "GnRH",
              "Prolactin",
              "Estrogen",
              "LH"
            ],
            "c": 4,
            "num": 137
          },
          {
            "q": "In semen analysis, which parameter is most critical in determining male fertility?",
            "o": [
              "Semen color",
              "Fructose level",
              "Motility of sperm",
              "pH of semen",
              "Volume of ejaculate"
            ],
            "c": 2,
            "num": 138
          },
          {
            "q": "A young male presents with small, firm testes and gynecomastia. Karyotype shows 47, XXY. What is the diagnosis?",
            "o": [
              "Turner syndrome",
              "Androgen insensitivity syndrome",
              "Klinefelter syndrome",
              "Testicular feminization",
              "Down syndrome"
            ],
            "c": 2,
            "num": 139
          },
          {
            "q": "A 32-year-old male presents with infertility. His semen analysis reveals azoospermia. Which of the following is the most likely cause if FSH is elevated?",
            "o": [
              "Obstructive azoospermia",
              "Hypogonadotropic hypogonadism",
              "Primary testicular failure",
              "Retrograde ejaculation",
              "Erectile dysfunction"
            ],
            "c": 2,
            "num": 140
          },
          {
            "q": "A male patient is found to have low testosterone and low LH/FSH. What is the most likely diagnosis?",
            "o": [
              "Klinefelter syndrome",
              "Testicular torsion",
              "Hypogonadotropic hypogonadism",
              "Androgen insensitivity syndrome",
              "Pituitary adenoma"
            ],
            "c": 2,
            "num": 141
          },
          {
            "q": "Which test is most appropriate to confirm retrograde ejaculation?",
            "o": [
              "Transrectal ultrasound",
              "Semen analysis",
              "Urinalysis after ejaculation",
              "Serum prolactin",
              "FSH/LH levels"
            ],
            "c": 2,
            "num": 142
          },
          {
            "q": "One of the following is NOT a clinical type of tinea pedis",
            "o": [
              "Moccasin",
              "Pustular",
              "Vesiculobullous",
              "Interdigital",
              "Ulcerative"
            ],
            "c": 1,
            "num": 143
          }
        ]
      }
    ],
    "groupTitle": "امتحانات ٥٩، ٥٨، ٥٧"
  },
  {
    "name": "ENT",
    "disabled": true,
    "exams": []
  },
  {
    "name": "Ophthalmology",
    "soon": true,
    "disabled": true,
    "exams": []
  }
];
