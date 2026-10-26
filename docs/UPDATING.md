# Adding a new chapter, module or quiz

1. Transcribe the course-notes pages page by page into notes (formulas with page numbers, worked examples, tables, figures, any errors in the notes).
2. Make sure the chapter is in `data/course.js`: in `schedule` (id, class date, title, pages, sections), in its module's `chapters`, and in the `assessments` entry for the PC or test that first covers it. For a new module, add it to `modules` (and remove `upcoming:true`).
3. Create `data/M5C1.js` following [DATA.md](DATA.md) and `data/M2C6.js`. Set `added` to today's date so it shows as new this week. Every 3D figure needs a `predict` question. Add parallels of its numbered course-notes examples to `data/examples/m5.js`.
4. Add a line to `data/changelog.js`.
5. Run:
   ```
   node build/build.js --check --only M5C1
   node tests/fuzz.js 300 --lec M5C1
   REAL_DIR=<private notes folder> node tests/dupes.js 500
   node build/build.js
   python3 -m http.server 8123 &
   python3 tests/walk.py M5C1
   python3 tests/models.py
   python3 tests/site.py
   ```
6. Commit and push. GitHub Pages redeploys automatically.

For a new quiz or test you have written, use it only to decide what the generators and exam questions emphasise. Never copy it onto the site.

Stable IDs never change. Saved progress depends on them.
