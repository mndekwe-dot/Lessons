"""
Generates a complete 14-day intensive study schedule in .ics format for Google Calendar.
Covers both Python (AmaliTech) and JavaScript (The Gym) tracks.
"""

import datetime

def generate_ics():
    today = datetime.date(2026, 10, 23) # Starting Friday, Oct 23, 2026
    
    # 14 days of structured content
    curriculum = [
        # Day 1 (Oct 23, Fri)
        {
            "day": 1,
            "py_title": "Python: Variables, Conditionals & Modulo",
            "py_desc": "Read 01-python-essentials.md and 01c-conditions-guide.md.\\nRun: python practice/drills_common_mistakes.py (Sections A-B).\\nFocus on %, //, and truthy/falsy logic.",
            "py_gca": "Solve practice/q1_warmups.py (Tasks 1 to 5).",
            "en_title": "Interview English: Self-Introduction & Video Draft",
            "en_desc": "Read the-gym-prep/08-application-video-script.md.\\nDraft your personal 60-90 second introduction script.",
            "js_title": "JavaScript: Variables (let/const) & Equality (===)",
            "js_desc": "Read the-gym-prep/01-javascript-essentials.md.\\nRun: node the-gym-prep/practice/drills_js_basics.js (Sections A & B).",
            "js_kata": "Solve Kata 1 (Multiply) & Kata 2 (Even or Odd) on Codewars."
        },
        # Day 2 (Oct 24, Sat)
        {
            "day": 2,
            "py_title": "Python: Loops (for, while, range)",
            "py_desc": "Read 01b-loops-guide.md.\\nRun: python practice/drills_strings_lists.py (Sections A & B).\\nMaster off-by-one errors and loop accumulators.",
            "py_gca": "Solve practice/q1_warmups.py (Tasks 6 to 10).",
            "en_title": "Interview English: Practice Answers Q1 & Q2",
            "en_desc": "Open the-gym-prep/05-interview-theory-qa.md.\\nPractice explaining 'let vs const vs var' out loud in English.",
            "js_title": "JavaScript: Loops (for, while, for...of)",
            "js_desc": "Read the-gym-prep/02-loops-and-functions.md.\\nRun: node the-gym-prep/practice/drills_js_basics.js (Section C).",
            "js_kata": "Solve Kata 3 (Opposite Number) & Kata 4 (Return Negative) on Codewars."
        },
        # Day 3 (Oct 25, Sun)
        {
            "day": 3,
            "py_title": "Python: Strings & Slicing [start:stop:step]",
            "py_desc": "Read 02-strings-and-lists.md (String section).\\nRun: python practice/drills_strings_lists.py (Section C).\\nMaster string reversal [::-1], .split(), and .join().",
            "py_gca": "Solve practice/q1_warmups.py (Tasks 11 to 15).",
            "en_title": "Interview English: Practice Answers Q3 & Q4",
            "en_desc": "Open the-gym-prep/05-interview-theory-qa.md.\\nPractice explaining '=== vs ==' and 'Truthy vs Falsy' out loud.",
            "js_title": "JavaScript: Strings & Template Literals",
            "js_desc": "Read the-gym-prep/03-strings-and-arrays.md (Strings section).\\nRun: node the-gym-prep/practice/drills_js_basics.js (Section D).",
            "js_kata": "Solve Kata 5 (String Repeat) & Kata 6 (Remove First and Last Char) on Codewars."
        },
        # Day 4 (Oct 26, Mon)
        {
            "day": 4,
            "py_title": "Python: Lists & List Comprehensions",
            "py_desc": "Read 02-strings-and-lists.md (List section).\\nRun: python practice/drills_strings_lists.py (Sections D & E).\\nMaster .append(), .pop(), and list filters.",
            "py_gca": "Solve practice/gca_q1_basic.py.",
            "en_title": "Application Video: Record Take 1",
            "en_desc": "Record your first video draft using your phone/laptop.\\nWatch it back to check sound quality, eye contact, and clear English pacing.",
            "js_title": "JavaScript: Arrays & Array Methods",
            "js_desc": "Read the-gym-prep/03-strings-and-arrays.md (Arrays section).\\nRun: node the-gym-prep/practice/drills_js_basics.js (Section E).\\nMaster push, pop, slice vs splice.",
            "js_kata": "Solve Kata 7 (Sum of Positive) on Codewars."
        },
        # Day 5 (Oct 27, Tue)
        {
            "day": 5,
            "py_title": "Python: Dictionaries & Hash Map Tallies",
            "py_desc": "Read 03-dictionaries-and-sets.md.\\nRun: python practice/drills_dicts_sets.py (Sections A-C).\\nMaster frequency counting: d[x] = d.get(x, 0) + 1.",
            "py_gca": "Solve practice/gca_q2_data_manipulation.py (Tasks 1-3).",
            "en_title": "Interview English: Practice Answers Q5 & Q6",
            "en_desc": "Open the-gym-prep/05-interview-theory-qa.md.\\nPractice explaining 'Arrow functions' and 'Array methods (map/filter/reduce)'.",
            "js_title": "JavaScript: Functions & Arrow Functions",
            "js_desc": "Read the-gym-prep/02-loops-and-functions.md (Functions section).\\nPractice writing helper functions and return values.",
            "js_kata": "Solve Kata 8 (Counting Sheep) & Kata 9 (Keep Hydrated) on Codewars."
        },
        # Day 6 (Oct 28, Wed)
        {
            "day": 6,
            "py_title": "Python: Sets & Unique Item Lookups",
            "py_desc": "Read 03-dictionaries-and-sets.md (Sets section).\\nRun: python practice/drills_dicts_sets.py (Sections D-E).\\nMaster O(1) membership testing with set.",
            "py_gca": "Solve practice/gca_q2_data_manipulation.py (Tasks 4-6).",
            "en_title": "Application Video: Final Recording & Upload",
            "en_desc": "Record final version of the 60-90s video.\\nUpload to YouTube (unlisted) or Google Drive and verify the share link.",
            "js_title": "JavaScript: Objects & Key-Value Lookups",
            "js_desc": "Read the-gym-prep/04-objects-and-data-structures.md.\\nRun: node the-gym-prep/practice/drills_objects_maps.js (Sections A & B).",
            "js_kata": "Solve Kata 10 (Convert Number to Reversed Array of Digits)."
        },
        # Day 7 (Oct 29, Thu)
        {
            "day": 7,
            "py_title": "Python: 2D Grids & Matrix Navigation",
            "py_desc": "Read 04-matrices-and-simulation.md.\\nMaster row/col indexing grid[r][c], 4-directional moves (dr, dc).",
            "py_gca": "Solve practice/gca_q3_implementation.py (Task 1).",
            "en_title": "Interview English: Personal Motivation & Goals",
            "en_desc": "Open the-gym-prep/05-interview-theory-qa.md (Part 2: Personal Questions).\\nPractice: 'Why do you want to join The Gym?' and 'How do you handle difficult bugs?'.",
            "js_title": "JavaScript: Set & Map Data Structures",
            "js_desc": "Read the-gym-prep/04-objects-and-data-structures.md (Set/Map section).\\nRun: node the-gym-prep/practice/drills_objects_maps.js (Sections C & D).",
            "js_kata": "Complete the-gym-prep/practice/codewars_practice.js and submit profile on Codewars."
        },
        # Day 8 (Oct 30, Fri)
        {
            "day": 8,
            "py_title": "Python: 2D Simulation (Game of Life / Spiral)",
            "py_desc": "Review 04-matrices-and-simulation.md.\\nPractice boundary checks: 0 <= r < rows and 0 <= c < cols.",
            "py_gca": "Solve practice/gca_q3_implementation.py (Tasks 2 & 3).",
            "en_title": "Interview English: Full Mock Q&A (Spoken 15 min)",
            "en_desc": "Rehearse all 9 technical theory questions without looking at notes.",
            "js_title": "JavaScript: Array Transformations (map, filter, reduce)",
            "js_desc": "Review the-gym-prep/03-strings-and-arrays.md.\\nWrite pure functional pipelines for array manipulation.",
            "js_kata": "Solve two 7 kyu Codewars katas (e.g., Vowel Count, Disemvowel Trolls)."
        },
        # Day 9 (Oct 31, Sat)
        {
            "day": 9,
            "py_title": "Python: Two Pointers & Sliding Windows",
            "py_desc": "Read 05-algorithm-patterns.md.\\nMaster left/right pointer convergence on sorted arrays.",
            "py_gca": "Solve practice/gca_q4_problem_solving.py (Task 1).",
            "en_title": "Cognitive Assessment Prep: Patterns & Logic",
            "en_desc": "Read 07-cognitive-test.md.\\nPractice number sequences, shape transformations, and rule deduction.",
            "js_title": "JavaScript: Common Traps & Bug Fixing",
            "js_desc": "Read the-gym-prep/10-my-common-js-mistakes.md.\\nRun: node the-gym-prep/practice/drills_common_mistakes.js.",
            "js_kata": "Solve 7 kyu Kata: Highest and Lowest on Codewars."
        },
        # Day 10 (Nov 1, Sun)
        {
            "day": 10,
            "py_title": "Python: Prefix Sums & Running Accumulations",
            "py_desc": "Review 05-algorithm-patterns.md (Prefix sum section).\\nMaster O(1) subarray sum queries.",
            "py_gca": "Solve practice/gca_q4_problem_solving.py (Task 2).",
            "en_title": "Application Check: Submit Application to The Gym",
            "en_desc": "Verify video link, Codewars profile link, and submit your application form.",
            "js_title": "JavaScript: Number Sorting & Array Quirks",
            "js_desc": "Review sorting with (a, b) => a - b.\\nRun: node the-gym-prep/practice/drills_common_mistakes.js (Section B).",
            "js_kata": "Solve 7 kyu Kata: List Filtering on Codewars."
        },
        # Day 11 (Nov 2, Mon)
        {
            "day": 11,
            "py_title": "Python: Timed GCA Mock Exam #1 (70 Minutes)",
            "py_desc": "Open 06-mock-test.md.\\nSet a timer for 70 minutes. Solve Q1, Q2, Q3 without checking notes.",
            "py_gca": "Score your mock test against the rubric in 06-mock-test.md.",
            "en_title": "Interview English: Think-Aloud Coding Practice",
            "en_desc": "Solve a simple coding puzzle out loud in English, explaining every variable and loop.",
            "js_title": "JavaScript: Live Coding Mock Challenge #1",
            "js_desc": "Open the-gym-prep/practice/mock_interview_test.js.\\nRun: node the-gym-prep/practice/mock_interview_test.js (Challenge 1).",
            "js_kata": "Review Udacity summary: the-gym-prep/07-udacity-ud803-summary.md."
        },
        # Day 12 (Nov 3, Tue)
        {
            "day": 12,
            "py_title": "Python: Review Mock #1 Mistakes & Fix Weak Spots",
            "py_desc": "Review 10-my-common-mistakes.md.\\nRe-solve every problem from Mock #1 where a test failed.",
            "py_gca": "Re-run practice/drills_common_mistakes.py to solidify edge cases.",
            "en_title": "Interview English: Behavioral & Scenario Questions",
            "en_desc": "Practice answering: 'Tell me about a time you worked in a group' and 'How do you handle deadlines?'.",
            "js_title": "JavaScript: Live Coding Mock Challenge #2",
            "js_desc": "Open the-gym-prep/practice/mock_interview_test.js.\\nSolve Challenge 2 (Frequency Tally) under a 20-minute timer.",
            "js_kata": "Solve 7 kyu Kata: Jaden Casing Strings on Codewars."
        },
        # Day 13 (Nov 4, Wed)
        {
            "day": 13,
            "py_title": "Python: Timed GCA Mock Exam #2 (70 Minutes)",
            "py_desc": "Run a full 4-problem timed simulation from practice/ folder.\\nLock in Q1 + Q2 + Q3 in under 50 minutes.",
            "py_gca": "Verify all edge cases: empty list, single element, negative numbers.",
            "en_title": "Interview English: The Gym 45-min Interview Simulation",
            "en_desc": "Follow the-gym-prep/12-mock-interview-simulation.md.\\nRun a complete mock interview from greeting to coding challenge.",
            "js_title": "JavaScript: Full Technical Theory Review",
            "js_desc": "Read the-gym-prep/09-javascript-cheat-sheet.md and 11-javascript-glossary.md.",
            "js_kata": "Check Codewars rank and verify at least 15-20 solved katas on profile."
        },
        # Day 14 (Nov 5, Thu)
        {
            "day": 14,
            "py_title": "Python: Final Pre-Assessment Mental Checklist",
            "py_desc": "Review 08-cheat-sheet.md and 10-my-common-mistakes.md.\\nRest your mind and get 8 hours of sleep.",
            "py_gca": "Review test-day strategy in README.md (Lock in Q1 + Q2 + Q3).",
            "en_title": "Final Confidence Check: The Gym & AmaliTech Ready",
            "en_desc": "Review Readiness Checklists in DUAL_TRACK_ROADMAP.md.\\nConfirm all materials and interview links are ready.",
            "js_title": "JavaScript: 30-Minute Light Warmup",
            "js_desc": "Run node the-gym-prep/practice/drills_js_basics.js once smoothly.\\nNo heavy new topics today.",
            "js_kata": "Celebrate completing 14 days of intensive dual-track preparation!"
        }
    ]

    events = []
    
    for item in curriculum:
        d = today + datetime.timedelta(days=item["day"] - 1)
        date_str = d.strftime("%Y%m%d")
        
        # Event 1: Morning Python Foundations (08:30 - 10:30)
        events.append({
            "uid": f"amalitech-py-foundations-day{item['day']}-{date_str}@prep",
            "start": f"{date_str}T083000",
            "end": f"{date_str}T103000",
            "summary": f"[Morning Track] {item['py_title']}",
            "description": f"DAY {item['day']} OF 14 - AMALITECH PYTHON PREP\\n\\n{item['py_desc']}\\n\\nWorkspace file: practice/drills_strings_lists.py"
        })
        
        # Event 2: Morning Python GCA Problems (11:00 - 12:30)
        events.append({
            "uid": f"amalitech-py-gca-day{item['day']}-{date_str}@prep",
            "start": f"{date_str}T110000",
            "end": f"{date_str}T123000",
            "summary": f"[AmaliTech GCA] {item['py_gca'][:40]}...",
            "description": f"DAY {item['day']} OF 14 - CODESIGNAL GCA PRACTICE\\n\\nGoal: {item['py_gca']}\\n\\nStrategy: Solve on paper first, code, and test edge cases."
        })
        
        # Event 3: Afternoon English & Video & Cognitive (14:30 - 16:00)
        events.append({
            "uid": f"thegym-english-day{item['day']}-{date_str}@prep",
            "start": f"{date_str}T143000",
            "end": f"{date_str}T160000",
            "summary": f"[Interview & Video] {item['en_title']}",
            "description": f"DAY {item['day']} OF 14 - ENGLISH & APPLICATION PREP\\n\\n{item['en_desc']}\\n\\nWorkspace guide: the-gym-prep/05-interview-theory-qa.md"
        })
        
        # Event 4: Evening JS Core (16:30 - 18:30)
        events.append({
            "uid": f"thegym-js-core-day{item['day']}-{date_str}@prep",
            "start": f"{date_str}T163000",
            "end": f"{date_str}T183000",
            "summary": f"[Evening Track] {item['js_title']}",
            "description": f"DAY {item['day']} OF 14 - THE GYM JAVASCRIPT FUNDAMENTALS\\n\\n{item['js_desc']}\\n\\nWorkspace file: the-gym-prep/practice/drills_js_basics.js"
        })
        
        # Event 5: Evening Katas & Mock Simulation (19:30 - 21:00)
        events.append({
            "uid": f"thegym-js-katas-day{item['day']}-{date_str}@prep",
            "start": f"{date_str}T193000",
            "end": f"{date_str}T210000",
            "summary": f"[Codewars & Mock] {item['js_kata'][:40]}...",
            "description": f"DAY {item['day']} OF 14 - CODEWARS KATAS & MOCK LIVE CODING\\n\\nTarget: {item['js_kata']}\\n\\nVerify with node: node the-gym-prep/practice/codewars_practice.js"
        })

    # Build the .ics text
    now_stamp = datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//AmaliTech and The Gym Preparation//Dual Track 14-Day Calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:14-Day Intensive Code Prep (Python & JavaScript)",
        "X-WR-TIMEZONE:Africa/Kigali",
        "X-WR-CALDESC:Full-time 14-day intensive coding schedule for AmaliTech and The Gym assessments"
    ]
    
    for ev in events:
        lines.append("BEGIN:VEVENT")
        lines.append(f"UID:{ev['uid']}")
        lines.append(f"DTSTAMP:{now_stamp}")
        lines.append(f"DTSTART:{ev['start']}")
        lines.append(f"DTEND:{ev['end']}")
        lines.append(f"SUMMARY:{ev['summary']}")
        lines.append(f"DESCRIPTION:{ev['description']}")
        lines.append("STATUS:CONFIRMED")
        lines.append("TRANSP:OPAQUE")
        lines.append("END:VEVENT")
        
    lines.append("END:VCALENDAR")
    return "\r\n".join(lines) + "\r\n"

if __name__ == "__main__":
    ics_content = generate_ics()
    with open("study_schedule_2weeks.ics", "w", encoding="utf-8") as f:
        f.write(ics_content)
    print("study_schedule_2weeks.ics successfully generated!")
