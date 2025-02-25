// Multi-language stories
const stories = {
    en: "A lone explorer trekked across a golden desert under a blazing sun. Sand swirled fiercely around her weathered cloak. She gripped a faded journal promising clues to a lost city. A distant hawk cried out, piercing the stillness. The air shimmered with heat and untold mysteries. Dunes stretched endlessly toward a faint mirage. Her heart pounded with anticipation and resolve. The journey was grueling yet whispered of glory. Twilight descended, painting the sky in fiery hues. Destiny awaited beyond the next rise.",
    es: "Una exploradora solitaria caminó por un desierto dorado bajo un sol ardiente. La arena giraba ferozmente alrededor de su capa desgastada. Aferraba un diario desvaído que prometía pistas de una ciudad perdida. Un halcón lejano gritó, rompiendo el silencio. El aire brillaba con calor y misterios sin contar. Las dunas se extendían infinitamente hacia un leve espejismo. Su corazón latía con ansiedad y determinación. El viaje era agotador pero susurraba gloria. El crepúsculo cayó, tiñendo el cielo de tonos ardientes. El destino aguardaba más allá del próximo ascenso."
};

let currentStory = stories.en;
let selectedWords = [];
let knownWords = JSON.parse(localStorage.getItem('knownWords')) || [];
let savedStories = JSON.parse(localStorage.getItem('savedStories')) || [];
let currentLang = 'en';

// Sentence templates
const sentenceTemplates = {
    en: [
        "A {word1} traveler roamed through a {word2} wilderness.",
        "The {word1} noise echoed across the {word2} plains.",
        "Holding a {word1} object, they sought a {word2} goal.",
        "The {word1} light painted the {word2} landscape.",
        "A {word1} figure stood against the {word2} backdrop.",
        "The {word1} trail wound through {word2} terrain.",
        "A {word1} feeling grew in the {word2} silence.",
        "The {word1} challenge loomed over the {word2} path.",
        "Stars shone with {word1} brilliance in the {word2} sky.",
        "A {word1} hope guided them toward a {word2} future."
    ],
    es: [
        "Un viajero {word1} recorrió un desierto {word2}.",
        "El ruido {word1} resonó en las llanuras {word2}.",
        "Sosteniendo un objeto {word1}, buscaron una meta {word2}.",
        "La luz {word1} pintó el paisaje {word2}.",
        "Una figura {word1} se alzó contra el fondo {word2}.",
        "El sendero {word1} serpenteó por el terreno {word2}.",
        "Un sentimiento {word1} creció en el silencio {word2}.",
        "El desafío {word1} se cernió sobre el camino {word2}.",
        "Las estrellas brillaron con esplendor {word1} en el cielo {word2}.",
        "Una esperanza {word1} los guió hacia un futuro {word2}."
    ]
};

// Display current story with persistent highlighting
function displayCurrentStory() {
    const storyText = document.getElementById('story-text');
    const words = currentStory.split(' ');
    storyText.innerHTML = words.map(word => {
        const cleanWord = word.replace(/[.,!?]/g, '').toLowerCase();
        const isKnown = knownWords.includes(cleanWord);
        const isSelected = selectedWords.includes(cleanWord);
        return `<span class="word ${isKnown ? '' : 'unknown'} ${isSelected ? 'selected' : ''}" onclick="toggleWord('${word}')">${word}</span>`;
    }).join(' ');
    document.getElementById('custom-story').value = currentStory;
}

// Toggle word selection
function toggleWord(word) {
    const cleanWord = word.replace(/[.,!?]/g, '').toLowerCase();
    const index = selectedWords.indexOf(cleanWord);
    if (index === -1) {
        selectedWords.push(cleanWord);
        if (!knownWords.includes(cleanWord)) knownWords.push(cleanWord);
    } else {
        selectedWords.splice(index, 1);
    }
    localStorage.setItem('knownWords', JSON.stringify(knownWords));
    displayCurrentStory();
}

// Generate next story
function generateNextStory() {
    if (selectedWords.length < 2) {
        alert("Please select at least two words from the current story!");
        return;
    }
    const templates = sentenceTemplates[currentLang];
    const newStoryLines = [];
    for (let i = 0; i < 10; i++) {
        const template = templates[i];
        const word1 = selectedWords[i % selectedWords.length] || "brave";
        const word2 = selectedWords[(i + 1) % selectedWords.length] || "wild";
        newStoryLines.push(template.replace("{word1}", word1).replace("{word2}", word2));
    }
    const newStory = newStoryLines.join(" ");
    savedStories.unshift(currentStory);
    currentStory = newStory;
    selectedWords = [];
    localStorage.setItem('savedStories', JSON.stringify(savedStories));
    displayCurrentStory();
    displaySavedStories();
    updateProgress();
}

// Save customized story
function saveCustomStory() {
    const customStory = document.getElementById('custom-story').value.trim();
    if (customStory && customStory !== currentStory) {
        currentStory = customStory;
        if (savedStories.length > 0) savedStories[0] = customStory;
        else savedStories.unshift(customStory);
        localStorage.setItem('savedStories', JSON.stringify(savedStories));
        displayCurrentStory();
        displaySavedStories();
    }
}

// Display saved stories
function displaySavedStories() {
    const savedText = document.getElementById('saved-text');
    savedText.innerHTML = savedStories.length ?
        savedStories.map((story, i) => `<p><strong>Story ${savedStories.length - i}:</strong> ${story}</p>`).join('') :
        "<p>No stories saved yet.</p>";
}

// Clear selections
function clearSelections() {
    selectedWords = [];
    displayCurrentStory();
}

// Reset progress
function resetProgress() {
    selectedWords = [];
    savedStories = [];
    knownWords = [];
    currentStory = stories[currentLang];
    localStorage.clear();
    displayCurrentStory();
    displaySavedStories();
    updateProgress();
}

// Language switch
function switchLanguage() {
    currentLang = document.getElementById('language-select').value;
    currentStory = stories[currentLang];
    selectedWords = [];
    displayCurrentStory();
    displaySavedStories();
}

// Grammar insights
function showGrammarInsights() {
    const insights = document.getElementById('grammar-insights');
    const words = selectedWords.length ? selectedWords : currentStory.split(' ').slice(0, 3);
    insights.innerHTML = `Example Insights:<br>` +
        words.map(w => `- "${w}": ${currentLang === 'en' ? 'Noun/Adjective (e.g., "The ' + w + ' sea")' : 'Sustantivo/Adjetivo (e.g., "El mar ' + w + '")'}`).join('<br>');
}

// Export stories
function exportStories() {
    const blob = new Blob([savedStories.join('\n\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stories.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Audio narration
function playAudio() {
    const utterance = new SpeechSynthesisUtterance(currentStory);
    utterance.lang = currentLang;
    speechSynthesis.speak(utterance);
}

// Update progress
function updateProgress() {
    const progress = document.getElementById('progress');
    const progressFill = document.querySelector('.progress-fill');
    const totalMilestone = 10;
    const progressPercentage = Math.min((savedStories.length / totalMilestone) * 100, 100);
    progress.textContent = `Stories Completed: ${savedStories.length} | Words Learned: ${knownWords.length}`;
    progressFill.style.width = `${progressPercentage}%`;
    if (savedStories.length === 5) alert("Milestone: 5 stories completed!");
}

// Event listeners
document.getElementById('generate-btn').addEventListener('click', generateNextStory);
document.getElementById('clear-btn').addEventListener('click', clearSelections);
document.getElementById('reset-btn').addEventListener('click', resetProgress);
document.getElementById('save-btn').addEventListener('click', saveCustomStory);
document.getElementById('export-btn').addEventListener('click', exportStories);
document.getElementById('grammar-btn').addEventListener('click', showGrammarInsights);
document.getElementById('dark-mode-btn').addEventListener('click', toggleDarkMode);
document.getElementById('audio-btn').addEventListener('click', playAudio);
document.getElementById('language-select').addEventListener('change', switchLanguage);

// Initialize
if (localStorage.getItem('darkMode') === 'true') toggleDarkMode();
displayCurrentStory();
displaySavedStories();
updateProgress();