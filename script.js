// Multi-language stories
const stories = {
    en: "The old sailor gazed at the vast ocean under a crimson sky. Waves crashed loudly against his sturdy wooden boat. He clutched a tattered map hoping to find hidden treasure. A curious seagull soared above watching the scene unfold. The wind whispered secrets of ancient voyages long forgotten. Clouds gathered slowly on the distant horizon. The sailor felt a spark of excitement deep within. His journey was perilous but full of promise. Night fell and stars lit up the endless sea. Tomorrow held the key to his wildest dreams.",
    es: "El viejo marinero miró el vasto océano bajo un cielo carmesí. Las olas chocaron ruidosamente contra su robusto barco de madera. Sostuvo un mapa desgarrado esperando encontrar un tesoro escondido. Una gaviota curiosa voló arriba observando la escena. El viento susurró secretos de antiguos viajes olvidados. Las nubes se reunieron lentamente en el horizonte lejano. El marinero sintió una chispa de emoción en su interior. Su viaje era peligroso pero lleno de promesas. La noche cayó y las estrellas iluminaron el mar sin fin. Mañana tenía la clave de sus sueños más salvajes."
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
    document.getElementById('custom-story').value = currentStory; // Sync textarea
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
    savedStories.unshift(currentStory); // Save the current story before updating
    currentStory = newStory;
    selectedWords = [];
    localStorage.setItem('savedStories', JSON.stringify(savedStories));
    displayCurrentStory();
    displaySavedStories();
    updateProgress();
}

// Save customized story (optional override)
function saveCustomStory() {
    const customStory = document.getElementById('custom-story').value.trim();
    if (customStory && customStory !== currentStory) {
        currentStory = customStory;
        if (savedStories.length > 0) savedStories[0] = customStory; // Update most recent
        else savedStories.unshift(customStory); // Add if no stories yet
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

// Gamification: Update progress
function updateProgress() {
    const progress = document.getElementById('progress');
    progress.textContent = `Stories Completed: ${savedStories.length} | Words Learned: ${knownWords.length}`;
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