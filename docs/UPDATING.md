# Adding a new lecture or quiz

1. Transcribe the lecture PDF page by page into notes (formulas with page numbers, worked examples, exercises, any errors in the notes).
2. Create `data/Lxx.js` following [DATA.md](DATA.md) and an existing lecture file. Set `added` to today's date so it shows as new this week.
3. Make sure the lecture is listed in `data/course.js` under its unit and its quiz block. For a lecture after the midterm, add a unit there first if needed.
4. Add a line to `data/changelog.js`.
5. Run:
   ```
   node build/build.js --check --only Lxx
   node tests/fuzz.js 150 --lec Lxx
   node build/build.js
   python3 tests/walk.py Lxx
   python3 tests/site.py
   ```
6. Commit and push. GitHub Pages redeploys automatically.

For a new practice quiz or practice midterm, add its questions to `data/review/` with a new `set` id. Use real quizzes only to decide what the generators and exam questions emphasise. Never copy them onto the site.

Stable IDs never change. Saved progress depends on them.
