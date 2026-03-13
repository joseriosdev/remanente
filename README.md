# 📚 Interactive English Course Player

A lightweight, **zero-dependency** web application designed for English teachers to deliver structured lessons offline. This tool allows students to navigate through modules, lessons, and sentences with built-in pronunciation support, all within a single file.

## 🚀 Key Features

* **100% Offline Capability:** Works without an internet connection. Perfect for students with limited connectivity.
* **Integrated Audio:** Uses the browser's native Web Speech API for instant English pronunciation (no external MP3 files needed).
* **Progressive Unlocking:** Students must complete sentences in order to unlock subsequent lessons and modules.
* **Persistent Progress:** Saves student progress automatically using the browser's local storage.
* **Adaptive UI:** Includes a Dark/Light mode toggle and a responsive design for different screen sizes.
* **Zero Setup:** No installation or local server required. Just open `index.html` in any modern browser.

---

## 🛠 How to Customize Your Content

The entire course structure is managed within a single JavaScript object at the bottom of the HTML file.

To add your own sentences, locate the `COURSE_DATA` constant in the `<script>` section:

```javascript
const COURSE_DATA = [
    {
        id: 1,
        title: "Module 1: Professional Life",
        topics: ["Job Interviews", "Writing Emails"],
        lessons: [
            {
                id: 1,
                title: "Lesson 1: Introductions",
                resources: ["PDF: Interview Tips", "Image: Body Language"],
                sentences: [
                    { 
                        en: "I have four years of experience in this field.", 
                        es: "Tengo cuatro años de experiencia en este campo.", 
                        ph: "ai hav for yirz ov ik-spier-ee-uhns..." 
                    },
                    // Add more sentences here
                ]
            }
        ]
    }
];

```

### Data Fields:

| Field | Description |
| --- | --- |
| `en` | The sentence in English (This is what the audio will read). |
| `es` | The Spanish translation shown below the sentence. |
| `ph` | Phonetic guide or pronunciation notes for the student. |

---

## 🎮 Navigation Controls

| Action | Result |
| --- | --- |
| **Click / Down Arrow** | Reveal next sentence / Highlight next. |
| **Up Arrow** | Go back to the previous sentence. |
| **Enter / Spacebar** | Play audio pronunciation. |
| **Back Arrow** | Return to the previous menu (Modules or Lessons). |
