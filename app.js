const STRINGS = [
  { name: "E2", midi: 40, size: "5px" },
  { name: "A2", midi: 45, size: "4.4px" },
  { name: "D3", midi: 50, size: "3.8px" },
  { name: "G3", midi: 55, size: "3.2px" },
  { name: "B3", midi: 59, size: "2.6px" },
  { name: "E4", midi: 64, size: "2.2px" },
];

const STRING_KEY_MAP = {
  t: 0,
  y: 1,
  u: 2,
  i: 3,
  o: 4,
  p: 5,
};

const FAST_STRUM_INTERVAL = 0.22;
const POINTER_STRUM_MIN_VELOCITY = 0.22;
const POINTER_STRUM_MAX_VELOCITY = 1;
const POINTER_STRUM_SLOW_SPEED = 0.14;
const POINTER_STRUM_FAST_SPEED = 1.35;
const POINTER_CROSSING_MIN_GAP = 0.016;
const POINTER_INITIAL_STRUM_DISTANCE = 6;
const POINTER_STRING_RETRIGGER_MS = 8;
const AUDIO_RESUME_TIMEOUT = 1400;
const AUDIO_SELECTION_SAMPLE_TIMEOUT = 1500;
const AUDIO_SELECTION_SAMPLE_POLL = 55;
const STRUM_DUCK_LEVEL = 0.004;
const STRUM_DUCK_TIME = 0.024;
const STRUM_RELEASE_AFTER = 0.18;
const FAST_STRUM_DUCK_TIME = 0.014;
const FAST_STRUM_RELEASE_AFTER = 0.1;
const PICK_NOISE_DURATION = 0.026;
const MUTED_NOISE_DURATION = 0.18;
const NOISE_BUFFER_POOL_SIZE = 8;
const AUDIO_WARMUP_DELAY = 80;
const AUDIO_WARMUP_IDLE_TIMEOUT = 800;
const SEQUENCE_STORAGE_KEY = "mini-guitar.sequence.v1";
const SAVED_SONGS_STORAGE_KEY = "mini-guitar.songs.v1";
const SETTINGS_STORAGE_KEY = "mini-guitar.settings.v1";
const SONG_EXPORT_FORMAT = "mini-guitar.song.v1";
const DEFAULT_SECTION_NAME = "Song";
const DEFAULT_SONG_NAME = "Untitled Song";
const MAX_SECTION_NAME_LENGTH = 28;
const MAX_SECTION_LYRICS_LENGTH = 1200;
const MAX_SONG_NAME_LENGTH = 42;
const SERVICE_WORKER_CACHE_NAME = "mini-guitar-v159";
const SERVICE_WORKER_SCRIPT = "service-worker.js?v=159";
const SECTION_SCROLL_TOP_OFFSET = 18;
const SECTION_SCROLL_BOTTOM_OFFSET = 18;
const SECTION_SCROLL_CONTEXT_GAP = 4;
const KEYBOARD_EDITING_SELECTOR = [
  "input",
  "textarea",
  "select",
  "[contenteditable='true']",
  "summary",
  ".sequence-delete",
  ".sequence-managers",
  ".sequence-actions",
  ".control-row",
  ".mode-toggle",
  ".performance-nav",
  ".performance-chip",
].join(", ");
const KEYBOARD_PLAY_SURFACE_SELECTOR = [
  "#strumSurface",
  ".strum-buttons",
  ".sequence-select",
  ".sequence-section-title",
  ".lyric-chord",
].join(", ");
const CHORD_TOKEN_PATTERN = /^[A-G](?:#|b)?(?:maj|min|m|dim|aug|sus|add|M|\+|o)?[0-9A-Za-z#b+\-()]*?(?:\/[A-G](?:#|b)?)?$/;
const STRUM_PROFILES = {
  down: {
    baseVelocity: 0.86,
    baseGap: 0.019,
    fastGap: 0.011,
    sustain: 2.45,
    palmSustain: 0.46,
    volume: 0.64,
    palmVolume: 0.36,
    pickVolume: 0.028,
    pickFrequency: 1850,
  },
  up: {
    baseVelocity: 0.62,
    baseGap: 0.0075,
    fastGap: 0.005,
    sustain: 1.36,
    palmSustain: 0.32,
    volume: 0.5,
    palmVolume: 0.3,
    pickVolume: 0.018,
    pickFrequency: 3100,
  },
  pick: {
    baseVelocity: 0.72,
    baseGap: 0,
    fastGap: 0,
    sustain: 1.9,
    palmSustain: 0.34,
    volume: 0.52,
    palmVolume: 0.3,
    pickVolume: 0.022,
    pickFrequency: 2400,
  },
};

const CHORD_BANKS = {
  open: [
    { name: "C", voicing: [null, 3, 2, 0, 1, 0] },
    { name: "G", voicing: [3, 2, 0, 0, 3, 3] },
    { name: "D", voicing: [null, null, 0, 2, 3, 2] },
    { name: "A", voicing: [null, 0, 2, 2, 2, 0] },
    { name: "E", voicing: [0, 2, 2, 1, 0, 0] },
    { name: "F", voicing: [1, 3, 3, 2, 1, 1] },
    { name: "Asus2", voicing: [null, 0, 2, 2, 0, 0] },
    { name: "Dsus4", voicing: [null, null, 0, 2, 3, 3] },
  ],
  minor: [
    { name: "Am", voicing: [null, 0, 2, 2, 1, 0] },
    { name: "Em", voicing: [0, 2, 2, 0, 0, 0] },
    { name: "Dm", voicing: [null, null, 0, 2, 3, 1] },
    { name: "Bm", voicing: [null, 2, 4, 4, 3, 2] },
    { name: "F#m", voicing: [2, 4, 4, 2, 2, 2] },
    { name: "C#m", voicing: [null, 4, 6, 6, 5, 4] },
    { name: "Gm", voicing: [3, 5, 5, 3, 3, 3] },
    { name: "Cm", voicing: [null, 3, 5, 5, 4, 3] },
  ],
  seventh: [
    { name: "G7", voicing: [3, 2, 0, 0, 0, 1] },
    { name: "C7", voicing: [null, 3, 2, 3, 1, 0] },
    { name: "D7", voicing: [null, null, 0, 2, 1, 2] },
    { name: "A7", voicing: [null, 0, 2, 0, 2, 0] },
    { name: "E7", voicing: [0, 2, 0, 1, 0, 0] },
    { name: "B7", voicing: [null, 2, 1, 2, 0, 2] },
    { name: "Am7", voicing: [null, 0, 2, 0, 1, 0] },
    { name: "Em7", voicing: [0, 2, 2, 0, 3, 0] },
  ],
};

const EXTRA_CHORDS = [
  { name: "Cmaj7", voicing: [null, 3, 2, 0, 0, 0] },
  { name: "C6", voicing: [null, 3, 2, 2, 1, 0] },
  { name: "Cm6", voicing: [null, 3, 1, 2, 1, 3] },
  { name: "Cm7", voicing: [null, 3, 5, 3, 4, 3] },
  { name: "Cadd9", voicing: [null, 3, 2, 0, 3, 3] },
  { name: "Csus4", voicing: [null, 3, 3, 0, 1, 1] },
  { name: "Dmaj7", voicing: [null, null, 0, 2, 2, 2] },
  { name: "D6", voicing: [null, null, 0, 2, 0, 2] },
  { name: "Dm6", voicing: [null, null, 0, 2, 0, 1] },
  { name: "Dm7", voicing: [null, null, 0, 2, 1, 1] },
  { name: "Dsus2", voicing: [null, null, 0, 2, 3, 0] },
  { name: "Emaj7", voicing: [0, 2, 1, 1, 0, 0] },
  { name: "E6", voicing: [0, 2, 2, 1, 2, 0] },
  { name: "Em6", voicing: [0, 2, 2, 0, 2, 0] },
  { name: "Esus4", voicing: [0, 2, 2, 2, 0, 0] },
  { name: "Fmaj7", voicing: [null, 3, 3, 2, 1, 0] },
  { name: "Fm", voicing: [1, 3, 3, 1, 1, 1] },
  { name: "Fm6", voicing: [1, 3, 3, 1, 3, 1] },
  { name: "Fm7", voicing: [1, 3, 1, 1, 1, 1] },
  { name: "Fsus4", voicing: [1, 3, 3, 3, 1, 1] },
  { name: "Gmaj7", voicing: [3, 2, 0, 0, 0, 2] },
  { name: "G6", voicing: [3, 2, 0, 0, 0, 0] },
  { name: "Gm6", voicing: [3, 5, 5, 3, 5, 3] },
  { name: "Gm7", voicing: [3, 5, 3, 3, 3, 3] },
  { name: "Gsus4", voicing: [3, 3, 0, 0, 1, 3] },
  { name: "Amaj7", voicing: [null, 0, 2, 1, 2, 0] },
  { name: "A6", voicing: [null, 0, 2, 2, 2, 2] },
  { name: "Am6", voicing: [null, 0, 2, 2, 1, 2] },
  { name: "Am7", voicing: [null, 0, 2, 0, 1, 0] },
  { name: "Asus4", voicing: [null, 0, 2, 2, 3, 0] },
  { name: "B", voicing: [null, 2, 4, 4, 4, 2] },
  { name: "Bmaj7", voicing: [null, 2, 4, 3, 4, 2] },
  { name: "B6", voicing: [null, 2, 4, 4, 4, 4] },
  { name: "Bm6", voicing: [null, 2, 0, 1, 0, 2] },
  { name: "Bm7", voicing: [null, 2, 4, 2, 3, 2] },
  { name: "Bsus4", voicing: [null, 2, 4, 4, 5, 2] },
];

const ROOTS = [
  { name: "C", semitone: 0 },
  { name: "C#", semitone: 1 },
  { name: "Db", semitone: 1 },
  { name: "D", semitone: 2 },
  { name: "D#", semitone: 3 },
  { name: "Eb", semitone: 3 },
  { name: "E", semitone: 4 },
  { name: "F", semitone: 5 },
  { name: "F#", semitone: 6 },
  { name: "Gb", semitone: 6 },
  { name: "G", semitone: 7 },
  { name: "G#", semitone: 8 },
  { name: "Ab", semitone: 8 },
  { name: "A", semitone: 9 },
  { name: "A#", semitone: 10 },
  { name: "Bb", semitone: 10 },
  { name: "B", semitone: 11 },
];

const MOVABLE_CHORD_TYPES = [
  {
    suffix: "",
    aliases: ["major", "maj"],
    eShape: [0, 2, 2, 1, 0, 0],
    aShape: [null, 0, 2, 2, 2, 0],
  },
  {
    suffix: "m",
    aliases: ["minor", "min"],
    eShape: [0, 2, 2, 0, 0, 0],
    aShape: [null, 0, 2, 2, 1, 0],
  },
  {
    suffix: "7",
    aliases: ["dom7", "dominant7"],
    eShape: [0, 2, 0, 1, 0, 0],
    aShape: [null, 0, 2, 0, 2, 0],
  },
  {
    suffix: "maj7",
    aliases: ["major7", "M7"],
    eShape: [0, 2, 1, 1, 0, 0],
    aShape: [null, 0, 2, 1, 2, 0],
  },
  {
    suffix: "m7",
    aliases: ["minor7", "min7"],
    eShape: [0, 2, 0, 0, 0, 0],
    aShape: [null, 0, 2, 0, 1, 0],
  },
  {
    suffix: "6",
    aliases: ["major6", "maj6"],
    eShape: [0, 2, 2, 1, 2, 0],
    aShape: [null, 0, 2, 2, 2, 2],
  },
  {
    suffix: "m6",
    aliases: ["minor6", "min6"],
    eShape: [0, 2, 2, 0, 2, 0],
    aShape: [null, 0, 2, 2, 1, 2],
  },
  {
    suffix: "sus2",
    aliases: ["suspended2"],
    eShape: [0, 2, 4, 4, 0, 0],
    aShape: [null, 0, 2, 2, 0, 0],
  },
  {
    suffix: "sus4",
    aliases: ["suspended4"],
    eShape: [0, 2, 2, 2, 0, 0],
    aShape: [null, 0, 2, 2, 3, 0],
  },
  {
    suffix: "7sus4",
    aliases: ["sus7", "dominant7sus4"],
    eShape: [0, 2, 0, 2, 0, 0],
    aShape: [null, 0, 2, 0, 3, 0],
  },
  {
    suffix: "add9",
    aliases: ["add2"],
    eShape: [0, 2, 4, 1, 0, 0],
    aShape: [null, 0, 2, 4, 2, 0],
  },
  {
    suffix: "9",
    aliases: ["dominant9"],
    eShape: [0, 2, 0, 1, 0, 2],
    aShape: [null, 0, 2, 4, 2, 3],
  },
  {
    suffix: "m9",
    aliases: ["minor9", "min9"],
    eShape: [0, 2, 0, 0, 0, 2],
    aShape: [null, 0, 2, 4, 1, 3],
  },
  {
    suffix: "dim",
    aliases: ["diminished"],
    eShape: [0, 1, 2, 0, 2, 0],
    aShape: [null, 0, 1, 2, 1, null],
  },
  {
    suffix: "dim7",
    aliases: ["diminished7"],
    eShape: [0, 1, 2, 0, 2, 0],
    aShape: [null, 0, 1, 2, 1, 2],
  },
  {
    suffix: "m7b5",
    aliases: ["half diminished", "halfdim", "half-diminished"],
    eShape: [0, 1, 0, 0, 3, 0],
    aShape: [null, 0, 1, 0, 1, null],
  },
  {
    suffix: "aug",
    aliases: ["augmented", "+"],
    eShape: [0, 3, 2, 1, 1, 0],
    aShape: [null, 0, 3, 2, 2, 1],
  },
  {
    suffix: "13",
    aliases: ["dominant13"],
    eShape: [0, 2, 0, 1, 2, 2],
    aShape: [null, 0, 2, 0, 2, 2],
  },
];

const CHORD_LIBRARY = buildChordLibrary();

const state = {
  bank: "open",
  chord: null,
  searchQuery: "",
  sections: [createSequenceSection(DEFAULT_SECTION_NAME)],
  activeSectionId: null,
  sequence: [],
  sequenceIndex: null,
  savedSongs: [],
  activeSongId: null,
  capo: 0,
  palmMute: false,
  autoAdvance: false,
  performanceMode: false,
  pointerId: null,
  pointerStrumId: null,
  pointerStrumContext: null,
  pointerHasStrummed: false,
  pointerDirection: null,
  pointerStringTimes: [],
  lastString: null,
  lastY: 0,
  lastTime: 0,
};

let audioContext;
let audioResumePromise;
let masterGain;
let compressor;
let chordGrid;
let chordSearch;
let sequenceList;
let addChordButton;
let songSelect;
let songNameInput;
let songBuilderSongName;
let newSongButton;
let saveSongButton;
let deleteSongButton;
let exportSongButton;
let importSongButton;
let songImportInput;
let sectionSelect;
let sectionLyricsInput;
let addSectionButton;
let renameSectionButton;
let duplicateSectionButton;
let moveSectionUpButton;
let moveSectionDownButton;
let deleteSectionButton;
let autoAdvanceToggle;
let unsavedIndicator;
let strumSurface;
let instrumentPanel;
let appShell;
let performanceModeButton;
let performanceChords;
let performancePrevButton;
let performanceNextButton;
let sequencePrevButton;
let sequenceNextButton;
let selectedChord;
let selectedVoicing;
let capoValue;
let acousticPlayer;
let acousticPreset;
let acousticPresetStarted = false;
let acousticPresetReady = false;
let acousticStringPanners = [];
let activeTransientSounds = [];
let stringFeedbackFrames = [];
let stringFeedbackTimers = [];
let lastFullStrumTime = -Infinity;
let lastStrumButtonPointerTime = -Infinity;
let nextStrumId = 0;
let audioSelectionPromise = null;
let noiseBufferPools = {};
let noiseBufferPoolIndexes = {};
let draggedSequenceIndex = null;
let sequenceDropIndex = null;
let sequenceDropSectionId = null;
let lyricDropTarget = null;
let lyricMeasureCanvas;
let sequencePointerDrag = null;
let suppressSequenceClickUntil = 0;

function init() {
  chordGrid = document.querySelector("#chordGrid");
  chordSearch = document.querySelector("#chordSearch");
  sequenceList = document.querySelector("#sequenceList");
  addChordButton = document.querySelector("#addChordButton");
  songSelect = document.querySelector("#songSelect");
  songNameInput = document.querySelector("#songNameInput");
  songBuilderSongName = document.querySelector("#songBuilderSongName");
  newSongButton = document.querySelector("#newSongButton");
  saveSongButton = document.querySelector("#saveSongButton");
  deleteSongButton = document.querySelector("#deleteSongButton");
  exportSongButton = document.querySelector("#exportSongButton");
  importSongButton = document.querySelector("#importSongButton");
  songImportInput = document.querySelector("#songImportInput");
  sectionSelect = document.querySelector("#sectionSelect");
  sectionLyricsInput = document.querySelector("#sectionLyricsInput");
  addSectionButton = document.querySelector("#addSectionButton");
  renameSectionButton = document.querySelector("#renameSectionButton");
  duplicateSectionButton = document.querySelector("#duplicateSectionButton");
  moveSectionUpButton = document.querySelector("#moveSectionUpButton");
  moveSectionDownButton = document.querySelector("#moveSectionDownButton");
  deleteSectionButton = document.querySelector("#deleteSectionButton");
  autoAdvanceToggle = document.querySelector("#autoAdvanceToggle");
  unsavedIndicator = document.querySelector("#unsavedIndicator");
  strumSurface = document.querySelector("#strumSurface");
  instrumentPanel = document.querySelector(".instrument-panel");
  appShell = document.querySelector(".app-shell");
  performanceModeButton = document.querySelector("#performanceModeButton");
  performanceChords = document.querySelector("#performanceChords");
  performancePrevButton = document.querySelector("#performancePrevButton");
  performanceNextButton = document.querySelector("#performanceNextButton");
  sequencePrevButton = document.querySelector("#sequencePrevButton");
  sequenceNextButton = document.querySelector("#sequenceNextButton");
  selectedChord = document.querySelector("#selectedChord");
  selectedVoicing = document.querySelector("#selectedVoicing");
  capoValue = document.querySelector("#capoValue");

  const initialSearch = new URLSearchParams(window.location.search).get("search") ?? "";
  state.searchQuery = initialSearch.trim().toLowerCase();
  chordSearch.value = initialSearch;
  restoreSavedSongs();
  restoreSavedSequence();
  ensureActiveSection();
  restoreSettings();

  renderStrings();
  renderChordGrid();
  renderSequence();
  updateChordDisplay();
  bindControls();
  scheduleAudioWarmup();
  registerServiceWorker();
}

function renderStrings() {
  STRINGS.forEach((string) => {
    const row = document.createElement("div");
    row.className = "string-row";
    row.dataset.name = string.name;
    row.style.setProperty("--string-size", string.size);
    strumSurface.append(row);
  });
}

function renderChordGrid() {
  chordGrid.replaceChildren();
  const chords = visibleChords();

  if (!chords.length) {
    const empty = document.createElement("div");
    empty.className = "no-results";
    empty.textContent = "No matches";
    chordGrid.append(empty);
    return;
  }

  chords.forEach((chord) => {
    const isSelected = chord.name === state.chord?.name;
    const button = document.createElement("button");
    button.className = "chord-button";
    button.type = "button";
    button.dataset.chord = chord.name;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));

    const label = document.createElement("strong");
    label.textContent = chord.name;

    const voicing = document.createElement("span");
    voicing.textContent = formatVoicing(chord.voicing);

    button.append(label, voicing);
    button.addEventListener("click", () => {
      selectChord(chord);
    });

    chordGrid.append(button);
  });
}

function bindControls() {
  armAudioOnNextGesture();
  document.addEventListener("visibilitychange", handleAudioVisibilityChange);
  window.addEventListener("pageshow", handleAudioPageResume);
  window.addEventListener("focus", handleAudioPageResume);

  chordSearch.addEventListener("input", (event) => {
    state.searchQuery = event.target.value.trim().toLowerCase();
    renderChordGrid();
    updateChordDisplay();
  });

  document.querySelectorAll(".bank-tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.bank = button.dataset.bank;

      document.querySelectorAll(".bank-tab").forEach((tab) => {
        const isActive = tab === button;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
      });

      renderChordGrid();
      updateChordDisplay();
    });
  });

  addChordButton.addEventListener("click", addSelectedChordToSequence);
  sectionSelect.addEventListener("change", (event) => {
    state.activeSectionId = event.target.value;
    saveSequence();
    renderSequence();
  });
  sectionLyricsInput.addEventListener("input", updateActiveSectionLyrics);
  addSectionButton.addEventListener("click", addSequenceSection);
  renameSectionButton.addEventListener("click", renameActiveSection);
  duplicateSectionButton.addEventListener("click", duplicateActiveSection);
  moveSectionUpButton.addEventListener("click", () => moveActiveSection(-1));
  moveSectionDownButton.addEventListener("click", () => moveActiveSection(1));
  deleteSectionButton.addEventListener("click", deleteActiveSection);
  songSelect.addEventListener("change", handleSongSelectionChange);
  songNameInput.addEventListener("input", updateSongActionState);
  newSongButton.addEventListener("click", createNewSong);
  saveSongButton.addEventListener("click", saveCurrentSong);
  deleteSongButton.addEventListener("click", deleteSelectedSong);
  exportSongButton.addEventListener("click", exportCurrentSong);
  importSongButton.addEventListener("click", openSongImportPicker);
  songImportInput.addEventListener("change", importSelectedSongFile);
  performanceModeButton.addEventListener("click", togglePerformanceMode);
  performancePrevButton.addEventListener("click", () => moveSequenceSelection(-1));
  performanceNextButton.addEventListener("click", () => moveSequenceSelection(1));
  sequencePrevButton.addEventListener("click", () => moveSequenceSelection(-1));
  sequenceNextButton.addEventListener("click", () => moveSequenceSelection(1));
  document.querySelectorAll(".sequence-drawer-toggle").forEach((button) => {
    button.addEventListener("click", () => toggleSequenceDrawer(button));
  });

  document.querySelector("#muteToggle").addEventListener("change", (event) => {
    state.palmMute = event.target.checked;
  });

  autoAdvanceToggle.addEventListener("change", (event) => {
    state.autoAdvance = event.target.checked;
    saveSettings();
  });

  document.querySelector("#capoDown").addEventListener("click", () => {
    state.capo = Math.max(0, state.capo - 1);
    updateCapo();
  });

  document.querySelector("#capoUp").addEventListener("click", () => {
    state.capo = Math.min(12, state.capo + 1);
    updateCapo();
  });

  bindStrumButton("#downStrum", 1);
  bindStrumButton("#upStrum", -1);
  window.addEventListener("keydown", handleKeyboardStrum);

  const guitarBody = document.querySelector(".guitar-body");
  strumSurface.addEventListener("pointerdown", handlePointerDown);
  strumSurface.addEventListener("pointermove", handlePointerMove);
  strumSurface.addEventListener("pointerup", handlePointerEnd);
  strumSurface.addEventListener("pointercancel", handlePointerEnd);
  strumSurface.addEventListener("touchstart", preventInstrumentTouchDefault, { passive: false });
  strumSurface.addEventListener("touchend", preventInstrumentTouchDefault, { passive: false });
  strumSurface.addEventListener("touchcancel", preventInstrumentTouchDefault, { passive: false });
  strumSurface.addEventListener("touchmove", preventStrumSurfaceScroll, { passive: false });
  guitarBody.addEventListener("touchstart", preventInstrumentTouchDefault, { passive: false });
  guitarBody.addEventListener("touchend", preventInstrumentTouchDefault, { passive: false });
  guitarBody.addEventListener("touchcancel", preventInstrumentTouchDefault, { passive: false });
  guitarBody.addEventListener("touchmove", preventStrumSurfaceScroll, { passive: false });
  instrumentPanel.addEventListener("touchmove", preventStrumSurfaceScroll, { passive: false });
}

function armAudioOnNextGesture() {
  window.addEventListener("pointerdown", armAudio, { capture: true, once: true });
  window.addEventListener("touchstart", armAudio, { capture: true, once: true, passive: true });
  window.addEventListener("keydown", armAudioFromKeyboard, { capture: true });
}

function armAudio() {
  if (isTouchAudioEnvironment()) {
    return;
  }

  ensureAudio();
}

function handleAudioVisibilityChange() {
  if (document.visibilityState === "visible") {
    handleAudioPageResume();
  }
}

function handleAudioPageResume() {
  if (document.visibilityState === "hidden") {
    return;
  }

  if (audioContext?.state === "closed") {
    resetAudioEngine();
  }

  if (audioContext) {
    prepareNoiseBuffers();
    prepareAcousticSamples();
    updateAudioReadyState();
  } else {
    scheduleAudioWarmup();
  }

  armAudioOnNextGesture();
}

function scheduleAudioWarmup() {
  if (isTouchAudioEnvironment()) {
    return;
  }

  const warmAudio = () => {
    ensureAudio({ resume: false });
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(warmAudio, { timeout: AUDIO_WARMUP_IDLE_TIMEOUT });
    return;
  }

  window.setTimeout(warmAudio, AUDIO_WARMUP_DELAY);
}

function isTouchAudioEnvironment() {
  return navigator.maxTouchPoints > 0;
}

function prepareAudioAfterChordSelection() {
  if (audioSelectionPromise) {
    return;
  }

  audioSelectionPromise = preparePlayableAudio()
    .catch(() => false)
    .finally(() => {
      audioSelectionPromise = null;
    });
}

async function preparePlayableAudio() {
  if (!ensureAudio()) {
    return false;
  }

  const didResume = await resumeAudioContext({ timeoutMs: AUDIO_RESUME_TIMEOUT });

  if (!didResume || audioContext?.state !== "running") {
    return false;
  }

  prepareNoiseBuffers();
  prepareAcousticSamples();
  await waitForAcousticSamples();
  updateAudioReadyState();
  return audioContext?.state === "running";
}

function waitForAcousticSamples() {
  const deadline = performance.now() + AUDIO_SELECTION_SAMPLE_TIMEOUT;

  return new Promise((resolve) => {
    const checkSamples = () => {
      if (prepareAcousticSamples()) {
        resolve(true);
        return;
      }

      if (performance.now() >= deadline) {
        resolve(false);
        return;
      }

      window.setTimeout(checkSamples, AUDIO_SELECTION_SAMPLE_POLL);
    };

    checkSamples();
  });
}

function armAudioFromKeyboard(event) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing) {
    return;
  }

  armAudio();
  window.removeEventListener("keydown", armAudioFromKeyboard, { capture: true });
}

function bindStrumButton(selector, direction) {
  const button = document.querySelector(selector);

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    lastStrumButtonPointerTime = performance.now();
    playFullStrum(direction);
  });

  button.addEventListener("click", (event) => {
    if (performance.now() - lastStrumButtonPointerTime < 500) {
      event.preventDefault();
      return;
    }

    playFullStrum(direction);
  });
}

function togglePerformanceMode() {
  state.performanceMode = !state.performanceMode;
  updatePerformanceMode();
  saveSettings();
}

function updatePerformanceMode() {
  appShell.classList.toggle("is-performance-mode", state.performanceMode);
  performanceModeButton.classList.toggle("is-active", state.performanceMode);
  performanceModeButton.setAttribute("aria-pressed", String(state.performanceMode));
  performanceModeButton.textContent = state.performanceMode ? "Edit" : "Play";
  renderPerformanceStrip();
}

function toggleSequenceDrawer(activeButton) {
  const panelId = activeButton.getAttribute("aria-controls");
  const activePanel = panelId ? document.getElementById(panelId) : null;
  const shouldOpen = activeButton.getAttribute("aria-expanded") !== "true";

  document.querySelectorAll(".sequence-drawer-toggle").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });

  document.querySelectorAll(".sequence-drawer-body").forEach((panel) => {
    panel.hidden = true;
  });

  if (shouldOpen && activePanel) {
    activeButton.setAttribute("aria-expanded", "true");
    activePanel.hidden = false;
  }
}

function renderPerformanceStrip() {
  if (!performanceChords) {
    updateSequenceNavigationButtons();
    return;
  }

  performanceChords.replaceChildren();
  const hasSequence = state.sequence.length > 0;
  const chords = hasSequence ? state.sequence : state.chord ? [state.chord] : [];

  chords.forEach((chord, index) => {
    const button = document.createElement("button");
    const isActive = hasSequence ? index === state.sequenceIndex : chord.name === state.chord?.name;
    button.className = "performance-chip";
    button.type = "button";
    button.textContent = chord.name;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.setAttribute("aria-label", `Select ${chord.name}`);
    button.addEventListener("click", () => {
      if (hasSequence) {
        selectChord(chord, index);
        return;
      }

      selectChord(chord);
    });

    performanceChords.append(button);
  });

  updateSequenceNavigationButtons();

  if (state.performanceMode) {
    window.requestAnimationFrame(() => {
      performanceChords.querySelector(".performance-chip.is-active")?.scrollIntoView({
        block: "nearest",
        inline: "center",
      });
    });
  }
}

function updateSequenceNavigationButtons() {
  const isDisabled = state.sequence.length < 2;

  [performancePrevButton, performanceNextButton, sequencePrevButton, sequenceNextButton].forEach((button) => {
    if (button) {
      button.disabled = isDisabled;
    }
  });
}

function handleKeyboardStrum(event) {
  if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing) {
    return;
  }

  const key = event.key.toLowerCase();

  if (isKeyboardEditingTarget(event.target)) {
    return;
  }

  if (key in STRING_KEY_MAP) {
    event.preventDefault();
    playKeyboardString(STRING_KEY_MAP[key]);
    return;
  }

  if (key === "e") {
    if (moveSequenceSelection(1)) {
      event.preventDefault();
    }
    return;
  }

  if (key === "q") {
    if (moveSequenceSelection(-1)) {
      event.preventDefault();
    }
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    playFullStrum(1);
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    playFullStrum(-1);
  }
}

function playKeyboardString(stringIndex, { waitForAudio = true, chord = currentChordSnapshot() } = {}) {
  if (!ensureAudio() || !chord) {
    return;
  }

  if (waitForAudio && audioContext.state !== "running") {
    playAfterAudioResume(() => playKeyboardString(stringIndex, { waitForAudio: false, chord }));
    return;
  }

  withChordSnapshot(chord, () => {
    const strumId = ++nextStrumId;
    playString(
      stringIndex,
      humanizedVelocity(STRUM_PROFILES.pick.baseVelocity, stringIndex, 0),
      audioContext.currentTime,
      0,
      strumId,
    );
  });
}

function isKeyboardEditingTarget(target) {
  return isKeyboardEditingElement(target) || isKeyboardEditingElement(document.activeElement);
}

function isKeyboardEditingElement(element) {
  if (!element?.closest) {
    return false;
  }

  if (element.closest(KEYBOARD_PLAY_SURFACE_SELECTOR)) {
    return false;
  }

  return Boolean(element.closest(KEYBOARD_EDITING_SELECTOR));
}

function updateChordDisplay() {
  const hasChord = Boolean(state.chord);

  selectedChord.textContent = state.chord?.name ?? "Choose";
  selectedVoicing.textContent = state.chord ? formatVoicing(state.chord.voicing) : "Select chord";
  addChordButton.textContent = state.chord ? `+ ${state.chord.name}` : "+ Chord";
  addChordButton.setAttribute("aria-label", state.chord ? `Add ${state.chord.name}` : "Choose a chord to add");
  addChordButton.disabled = !hasChord;

  document.querySelector("#downStrum").disabled = !hasChord;
  document.querySelector("#upStrum").disabled = !hasChord;

  document.querySelectorAll(".chord-button").forEach((button) => {
    const isActive = button.dataset.chord === state.chord?.name;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderPerformanceStrip();
}

function selectChord(chord, sequenceIndex = null, { scrollSelectedChord = sequenceIndex !== null, scrollSectionToTop = false } = {}) {
  state.chord = chord;
  state.sequenceIndex = sequenceIndex;

  if (sequenceIndex !== null && chord.sectionId) {
    state.activeSectionId = chord.sectionId;
  }

  updateChordDisplay();
  renderChordGrid();
  renderSequence({ scrollSectionToTop, scrollSelectedChord });
  prepareAudioAfterChordSelection();

  if (sequenceIndex !== null) {
    saveSequence();
  }
}

function moveSequenceSelection(delta, { scrollSectionToTopOnSectionChange = false } = {}) {
  if (!state.sequence.length) {
    return false;
  }

  const fallbackIndex = delta > 0 ? -1 : 0;
  const currentIndex = state.sequenceIndex ?? fallbackIndex;
  const currentSectionId = state.sequence[state.sequenceIndex]?.sectionId ?? null;
  const nextIndex = (currentIndex + delta + state.sequence.length) % state.sequence.length;
  const chord = state.sequence[nextIndex];

  if (!chord) {
    return false;
  }

  selectChord(chord, nextIndex, {
    scrollSectionToTop: scrollSectionToTopOnSectionChange && currentSectionId !== null && chord.sectionId !== currentSectionId,
  });
  return true;
}

function autoAdvanceSequenceAfterStrum() {
  if (!state.autoAdvance || state.sequenceIndex === null || state.sequence.length < 2) {
    return;
  }

  moveSequenceSelection(1, { scrollSectionToTopOnSectionChange: true });
}

function addSelectedChordToSequence() {
  if (!state.chord) {
    return;
  }

  const chord = sequenceChordFromChord(state.chord, state.activeSectionId);
  const insertIndex = sequenceInsertIndexForSection(state.activeSectionId);
  state.sequence.splice(insertIndex, 0, chord);
  state.sequenceIndex = insertIndex;
  state.chord = chord;
  saveSequence();
  updateChordDisplay();
  renderChordGrid();
  renderSequence({ scrollSelectedChord: true });
}

function addSequenceSection() {
  const name = window.prompt("Section name", nextSectionName());
  const cleanedName = sanitizeSectionName(name);

  if (!cleanedName) {
    return;
  }

  const section = createSequenceSection(uniqueSectionName(cleanedName));
  state.sections.push(section);
  state.activeSectionId = section.id;
  saveSequence();
  renderSequence();
}

function renameActiveSection() {
  const section = activeSection();

  if (!section) {
    return;
  }

  const name = window.prompt("Section name", section.name);
  const cleanedName = sanitizeSectionName(name);

  if (!cleanedName) {
    return;
  }

  section.name = uniqueSectionName(cleanedName, section.id);
  saveSequence();
  renderSequence();
}

function duplicateActiveSection() {
  const section = activeSection();

  if (!section) {
    return;
  }

  const sectionIndex = state.sections.findIndex((savedSection) => savedSection.id === section.id);
  const duplicate = createSequenceSection(uniqueSectionName(`${section.name} Copy`), null, section.lyrics);
  const copiedChords = state.sequence
    .filter((chord) => chord.sectionId === section.id)
    .map((chord) => sequenceChordFromChord(chord, duplicate.id));

  state.sections.splice(sectionIndex + 1, 0, duplicate);
  const insertIndex = sequenceInsertIndexForSection(duplicate.id);
  state.sequence.splice(insertIndex, 0, ...copiedChords);
  state.activeSectionId = duplicate.id;

  if (copiedChords.length) {
    state.sequenceIndex = insertIndex;
    state.chord = state.sequence[state.sequenceIndex];
    updateChordDisplay();
    renderChordGrid();
  }

  saveSequence();
  renderSequence({ scrollSelectedChord: copiedChords.length > 0 });
}

function moveActiveSection(delta) {
  const sectionIndex = state.sections.findIndex((section) => section.id === state.activeSectionId);
  const nextIndex = sectionIndex + delta;

  if (sectionIndex === -1 || nextIndex < 0 || nextIndex >= state.sections.length) {
    return;
  }

  const selectedChord = state.sequenceIndex === null ? null : state.sequence[state.sequenceIndex];
  const [section] = state.sections.splice(sectionIndex, 1);
  state.sections.splice(nextIndex, 0, section);
  state.activeSectionId = section.id;
  reorderSequenceBySectionOrder();

  if (selectedChord) {
    const selectedIndex = state.sequence.indexOf(selectedChord);
    state.sequenceIndex = selectedIndex === -1 ? null : selectedIndex;
  }

  saveSequence();
  renderSequence();
}

function updateActiveSectionLyrics(event) {
  const section = activeSection();

  if (!section) {
    return;
  }

  section.lyrics = normalizeSectionLyrics(event.target.value);
  saveSequence();
  renderSequence();
}

function deleteActiveSection() {
  const section = activeSection();

  if (!section || state.sections.length <= 1) {
    return;
  }

  const chordCount = state.sequence.filter((chord) => chord.sectionId === section.id).length;
  const chordText = chordCount === 1 ? "1 chord" : `${chordCount} chords`;
  const message = chordCount
    ? `Delete "${section.name}" and remove its ${chordText}?`
    : `Delete "${section.name}"?`;

  if (!window.confirm(message)) {
    return;
  }

  const sectionIndex = state.sections.findIndex((savedSection) => savedSection.id === section.id);
  const nextSection = state.sections[sectionIndex + 1] ?? state.sections[sectionIndex - 1];
  const previousSelectedChord = state.sequenceIndex === null ? null : state.sequence[state.sequenceIndex];

  state.sections.splice(sectionIndex, 1);
  state.activeSectionId = nextSection.id;
  state.sequence = state.sequence.filter((chord) => chord.sectionId !== section.id);

  if (!state.sequence.length) {
    state.sequenceIndex = null;
    state.chord = null;
  } else if (previousSelectedChord && previousSelectedChord.sectionId !== section.id) {
    state.sequenceIndex = state.sequence.indexOf(previousSelectedChord);
  } else {
    const activeSectionChordIndex = state.sequence.findIndex((chord) => chord.sectionId === state.activeSectionId);
    state.sequenceIndex = activeSectionChordIndex === -1 ? 0 : activeSectionChordIndex;
  }

  if (state.sequenceIndex !== null && state.sequenceIndex >= 0) {
    state.chord = state.sequence[state.sequenceIndex];
    state.activeSectionId = state.chord.sectionId ?? state.activeSectionId;
  } else {
    state.sequenceIndex = null;
    state.chord = null;
  }

  saveSequence();
  updateChordDisplay();
  renderChordGrid();
  renderSequence({ scrollSelectedChord: state.sequenceIndex !== null });
}

function removeSequenceChord(index) {
  if (index < 0 || index >= state.sequence.length) {
    return;
  }

  removeSequenceChordMarker(index);
  state.sequence.splice(index, 1);

  if (!state.sequence.length) {
    state.sequenceIndex = null;
    state.chord = null;
  } else if (state.sequenceIndex === index) {
    state.sequenceIndex = Math.min(index, state.sequence.length - 1);
    state.chord = state.sequence[state.sequenceIndex];
    state.activeSectionId = state.chord.sectionId ?? state.activeSectionId;
    updateChordDisplay();
    renderChordGrid();
  } else if (state.sequenceIndex !== null && state.sequenceIndex > index) {
    state.sequenceIndex -= 1;
  }

  saveSequence();
  renderSequence({ scrollSelectedChord: state.sequenceIndex !== null });
}

function moveSequenceChord(fromIndex, targetIndex, targetSectionId) {
  if (fromIndex < 0 || fromIndex >= state.sequence.length || !Number.isInteger(targetIndex)) {
    return false;
  }

  const [movedChord] = state.sequence.splice(fromIndex, 1);
  let insertIndex = clamp(targetIndex, 0, state.sequence.length + 1);

  if (fromIndex < insertIndex) {
    insertIndex -= 1;
  }

  movedChord.sectionId = targetSectionId ?? movedChord.sectionId;
  insertIndex = clamp(insertIndex, 0, state.sequence.length);
  state.sequence.splice(insertIndex, 0, movedChord);
  state.sequenceIndex = insertIndex;
  state.chord = movedChord;
  state.activeSectionId = movedChord.sectionId ?? state.activeSectionId;

  saveSequence();
  updateChordDisplay();
  renderChordGrid();
  renderSequence({ scrollSelectedChord: true });
  focusSelectedSequenceChord();
  return true;
}

function sequenceChordFromChord(chord, sectionId) {
  return {
    name: chord.name,
    voicing: [...chord.voicing],
    aliases: chord.aliases ?? [],
    sectionId,
  };
}

function sequenceInsertIndexForSection(sectionId) {
  const matchingIndex = findLastSequenceIndex((chord) => chord.sectionId === sectionId);

  if (matchingIndex !== -1) {
    return matchingIndex + 1;
  }

  const activeOrder = sectionOrder(sectionId);
  const laterSectionIndex = state.sequence.findIndex((chord) => sectionOrder(chord.sectionId) > activeOrder);
  return laterSectionIndex === -1 ? state.sequence.length : laterSectionIndex;
}

function findLastSequenceIndex(predicate) {
  for (let index = state.sequence.length - 1; index >= 0; index -= 1) {
    if (predicate(state.sequence[index])) {
      return index;
    }
  }

  return -1;
}

function sectionOrder(sectionId) {
  const sectionIndex = state.sections.findIndex((section) => section.id === sectionId);
  return sectionIndex === -1 ? Number.MAX_SAFE_INTEGER : sectionIndex;
}

function reorderSequenceBySectionOrder() {
  state.sequence = state.sequence
    .map((chord, index) => ({ chord, index }))
    .sort((a, b) => sectionOrder(a.chord.sectionId) - sectionOrder(b.chord.sectionId) || a.index - b.index)
    .map(({ chord }) => chord);
}

function activeSection() {
  ensureActiveSection();
  return state.sections.find((section) => section.id === state.activeSectionId) ?? state.sections[0];
}

function ensureActiveSection() {
  if (!state.sections.length) {
    state.sections = [createSequenceSection(DEFAULT_SECTION_NAME)];
  }

  if (!state.activeSectionId || !state.sections.some((section) => section.id === state.activeSectionId)) {
    state.activeSectionId = state.sections[0].id;
  }

  state.sequence.forEach((chord) => {
    if (!chord.sectionId || !state.sections.some((section) => section.id === chord.sectionId)) {
      chord.sectionId = state.activeSectionId;
    }
  });
}

function createSequenceSection(name, id = null, lyrics = "") {
  return {
    id: id ?? `section-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: sanitizeSectionName(name) || DEFAULT_SECTION_NAME,
    lyrics: normalizeSectionLyrics(lyrics),
  };
}

function nextSectionName() {
  return `Section ${state.sections.length + 1}`;
}

function sanitizeSectionName(name) {
  return String(name ?? "").trim().replace(/\s+/g, " ").slice(0, MAX_SECTION_NAME_LENGTH);
}

function normalizeSectionLyrics(lyrics) {
  return String(lyrics ?? "").replace(/\r\n?/g, "\n").slice(0, MAX_SECTION_LYRICS_LENGTH);
}

function uniqueSectionName(name, currentSectionId = null) {
  const baseName = sanitizeSectionName(name);
  let nextName = baseName;
  let copyNumber = 2;

  while (
    state.sections.some((section) =>
      section.id !== currentSectionId && section.name.toLowerCase() === nextName.toLowerCase()
    )
  ) {
    const suffix = ` ${copyNumber}`;
    nextName = `${baseName.slice(0, MAX_SECTION_NAME_LENGTH - suffix.length)}${suffix}`;
    copyNumber += 1;
  }

  return nextName;
}

function createNewSong() {
  if (songHasUnsavedChanges() && !window.confirm("Discard unsaved changes and start a new song?")) {
    return;
  }

  const section = createSequenceSection(DEFAULT_SECTION_NAME);
  state.activeSongId = null;
  state.sections = [section];
  state.activeSectionId = section.id;
  state.sequence = [];
  state.sequenceIndex = null;
  state.chord = null;
  songNameInput.value = "";
  saveSequence();
  updateChordDisplay();
  renderChordGrid();
  renderSequence();
}

function saveCurrentSong() {
  ensureActiveSection();

  const selectedSong = selectedSavedSong();
  const fallbackName = selectedSong?.name ?? uniqueSongName(suggestedSongName());
  const cleanedName = sanitizeSongName(songNameInput.value || fallbackName);

  if (!cleanedName) {
    return;
  }

  const matchingSong = state.savedSongs.find((song) => song.name.toLowerCase() === cleanedName.toLowerCase());
  const shouldUpdateSelected = selectedSong && selectedSong.name.toLowerCase() === cleanedName.toLowerCase();

  const songId = matchingSong?.id ?? (shouldUpdateSelected ? selectedSong.id : createSongId());
  const nextSong = createSavedSongSnapshot(cleanedName, songId);
  const existingIndex = state.savedSongs.findIndex((song) => song.id === songId);

  if (existingIndex === -1) {
    state.savedSongs.push(nextSong);
  } else {
    state.savedSongs.splice(existingIndex, 1, nextSong);
  }

  state.activeSongId = songId;
  songNameInput.value = cleanedName;
  saveSongs();
  saveSequence();
  renderSongSelect();
}

function deleteSelectedSong() {
  const song = selectedSavedSong();

  if (!song) {
    return;
  }

  state.savedSongs = state.savedSongs.filter((savedSong) => savedSong.id !== song.id);

  if (state.activeSongId === song.id) {
    state.activeSongId = null;
    saveSequence();
  }

  saveSongs();
  renderSongSelect();
}

function exportCurrentSong() {
  const song = currentSongSnapshotForTransfer();
  const payload = {
    format: SONG_EXPORT_FORMAT,
    exportedAt: new Date().toISOString(),
    song: serializeSavedSong(song),
  };
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${songFileName(song.name)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function currentSongSnapshotForTransfer() {
  ensureActiveSection();

  const selectedSong = selectedSavedSong();
  const fallbackName = selectedSong?.name ?? suggestedSongName();
  const name = sanitizeSongName(songNameInput.value || fallbackName) || DEFAULT_SONG_NAME;
  return createSavedSongSnapshot(name, selectedSong?.id ?? state.activeSongId ?? createSongId());
}

function openSongImportPicker() {
  songImportInput.value = "";
  songImportInput.click();
}

async function importSelectedSongFile(event) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  try {
    const importedSong = parseImportedSong(await file.text());
    saveImportedSong(importedSong);
  } catch (_) {
    window.alert("Could not import that song file.");
  } finally {
    songImportInput.value = "";
  }
}

function parseImportedSong(fileText) {
  const parsedValue = JSON.parse(fileText);
  const songValue = parsedValue?.format === SONG_EXPORT_FORMAT ? parsedValue.song : parsedValue;
  const name = sanitizeSongName(songValue?.name);

  if (!name) {
    throw new Error("Missing song name");
  }

  const savedSequence = normalizeSavedSequence(songValue);
  return {
    version: 1,
    id: typeof songValue?.id === "string" && songValue.id.trim() ? songValue.id.trim() : createSongId(),
    name,
    savedAt: typeof songValue?.savedAt === "string" ? songValue.savedAt : new Date().toISOString(),
    activeSectionId: savedSequence.activeSectionId,
    sections: savedSequence.sections.map(serializeSavedSection),
    sequenceIndex: savedSequence.sequenceIndex,
    sequence: savedSequence.sequence.map(serializeSavedChord),
  };
}

function saveImportedSong(song) {
  const importedSong = {
    ...song,
    id: uniqueSongId(song.id),
    name: uniqueSongName(song.name),
    savedAt: new Date().toISOString(),
  };

  state.savedSongs.push(importedSong);
  applySavedSequence(normalizeSavedSequence(importedSong));
  state.activeSongId = importedSong.id;
  songNameInput.value = importedSong.name;
  saveSongs();
  saveSequence();
  updateChordDisplay();
  renderChordGrid();
  renderSequence({ scrollSelectedChord: state.sequenceIndex !== null });
}

function uniqueSongId(songId) {
  const safeId = typeof songId === "string" && songId.trim() ? songId.trim() : createSongId();

  if (!state.savedSongs.some((song) => song.id === safeId)) {
    return safeId;
  }

  let nextId = createSongId();
  while (state.savedSongs.some((song) => song.id === nextId)) {
    nextId = createSongId();
  }

  return nextId;
}

function songFileName(songName) {
  const safeName = sanitizeSongName(songName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return safeName ? `mini-guitar-${safeName}` : "mini-guitar-song";
}

function selectedSavedSong() {
  const selectedSongId = songSelect?.value || state.activeSongId;
  return state.savedSongs.find((song) => song.id === selectedSongId) ?? null;
}

function handleSongSelectionChange() {
  const requestedSongId = songSelect.value;
  const previousSongId = state.activeSongId ?? "";

  if (!requestedSongId) {
    songSelect.value = previousSongId;
    updateSongActionState();
    return;
  }

  const song = state.savedSongs.find((savedSong) => savedSong.id === requestedSongId) ?? null;

  if (!song) {
    songSelect.value = previousSongId;
    updateSongActionState();
    return;
  }

  if (song.id === state.activeSongId) {
    songNameInput.value = song.name;
    updateSongActionState();
    return;
  }

  if (songHasUnsavedChanges() && !window.confirm("Discard unsaved changes and load this song?")) {
    songSelect.value = previousSongId;
    updateSongActionState();
    return;
  }

  loadSong(song);
}

function loadSong(song) {
  applySavedSequence(normalizeSavedSequence(song));
  state.activeSongId = song.id;
  songNameInput.value = song.name;
  saveSequence();
  updateChordDisplay();
  renderChordGrid();
  renderSequence({ scrollSelectedChord: state.sequenceIndex !== null });
  renderSongSelect();
}

function createSavedSongSnapshot(name, id = createSongId()) {
  return {
    version: 1,
    id,
    name: sanitizeSongName(name) || DEFAULT_SONG_NAME,
    savedAt: new Date().toISOString(),
    activeSectionId: state.activeSectionId,
    sections: state.sections.map(serializeSavedSection),
    sequenceIndex: state.sequenceIndex,
    sequence: state.sequence.map(serializeSavedChord),
  };
}

function createSongId() {
  return `song-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function suggestedSongName() {
  const namedSection = state.sections
    .map((section) => sanitizeSectionName(section.name))
    .find((name) => name && name !== DEFAULT_SECTION_NAME);

  return namedSection ?? DEFAULT_SONG_NAME;
}

function sanitizeSongName(name) {
  return String(name ?? "").trim().replace(/\s+/g, " ").slice(0, MAX_SONG_NAME_LENGTH);
}

function uniqueSongName(name, currentSongId = null) {
  const baseName = sanitizeSongName(name) || DEFAULT_SONG_NAME;
  let nextName = baseName;
  let copyNumber = 2;

  while (
    state.savedSongs.some((song) =>
      song.id !== currentSongId && song.name.toLowerCase() === nextName.toLowerCase()
    )
  ) {
    const suffix = ` ${copyNumber}`;
    nextName = `${baseName.slice(0, MAX_SONG_NAME_LENGTH - suffix.length)}${suffix}`;
    copyNumber += 1;
  }

  return nextName;
}

function saveSequence() {
  try {
    ensureActiveSection();
    const payload = {
      version: 4,
      activeSongId: state.activeSongId,
      activeSectionId: state.activeSectionId,
      sections: state.sections.map(serializeSavedSection),
      sequenceIndex: state.sequenceIndex,
      sequence: state.sequence.map(serializeSavedChord),
    };
    window.localStorage.setItem(SEQUENCE_STORAGE_KEY, JSON.stringify(payload));
  } catch (_) {
    // Sequence persistence is optional; private browsing or storage limits can block it.
  }
}

function restoreSavedSequence() {
  try {
    const savedValue = window.localStorage.getItem(SEQUENCE_STORAGE_KEY);
    const savedSequence = parseSavedSequence(savedValue);
    applySavedSequence(savedSequence);
    state.activeSongId = state.savedSongs.some((song) => song.id === savedSequence.activeSongId)
      ? savedSequence.activeSongId
      : null;
  } catch (_) {
    state.sections = [createSequenceSection(DEFAULT_SECTION_NAME)];
    state.activeSectionId = state.sections[0].id;
    state.sequence = [];
    state.sequenceIndex = null;
    state.chord = null;
    state.activeSongId = null;
  }
}

function applySavedSequence(savedSequence) {
  state.sections = savedSequence.sections;
  state.activeSectionId = savedSequence.activeSectionId;
  state.sequence = savedSequence.sequence;
  state.sequenceIndex = null;
  state.chord = null;
  ensureActiveSection();
}

function saveSongs() {
  try {
    window.localStorage.setItem(
      SAVED_SONGS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        songs: state.savedSongs.map(serializeSavedSong),
      }),
    );
  } catch (_) {
    // Song persistence is optional; private browsing or storage limits can block it.
  }
}

function restoreSavedSongs() {
  try {
    const savedValue = window.localStorage.getItem(SAVED_SONGS_STORAGE_KEY);
    state.savedSongs = parseSavedSongs(savedValue);
  } catch (_) {
    state.savedSongs = [];
  }
}

function saveSettings() {
  try {
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        autoAdvance: state.autoAdvance,
        performanceMode: state.performanceMode,
      }),
    );
  } catch (_) {
    // Settings persistence is optional; private browsing or storage limits can block it.
  }
}

function restoreSettings() {
  try {
    const savedValue = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    const savedSettings = JSON.parse(savedValue ?? "{}");
    state.autoAdvance = savedSettings.autoAdvance === true;
    state.performanceMode = savedSettings.performanceMode === true;
    autoAdvanceToggle.checked = state.autoAdvance;
  } catch (_) {
    state.autoAdvance = false;
    state.performanceMode = false;
    autoAdvanceToggle.checked = false;
  }

  updatePerformanceMode();
}

function serializeSavedChord(chord) {
  return {
    name: chord.name,
    voicing: chord.voicing,
    sectionId: chord.sectionId,
  };
}

function serializeSavedSection(section) {
  return {
    id: section.id,
    name: section.name,
    lyrics: normalizeSectionLyrics(section.lyrics),
  };
}

function serializeSavedSong(song) {
  return {
    version: 1,
    id: song.id,
    name: song.name,
    savedAt: song.savedAt,
    activeSectionId: song.activeSectionId,
    sections: song.sections.map(serializeSavedSection),
    sequenceIndex: song.sequenceIndex,
    sequence: song.sequence.map(serializeSavedChord),
  };
}

function parseSavedSequence(savedValue) {
  if (!savedValue) {
    const section = createSequenceSection(DEFAULT_SECTION_NAME);
    return { sections: [section], activeSectionId: section.id, activeSongId: null, sequence: [], sequenceIndex: null };
  }

  return normalizeSavedSequence(JSON.parse(savedValue));
}

function parseSavedSongs(savedValue) {
  if (!savedValue) {
    return [];
  }

  const parsedValue = JSON.parse(savedValue);
  const savedSongValues = Array.isArray(parsedValue) ? parsedValue : parsedValue.songs;

  if (!Array.isArray(savedSongValues)) {
    return [];
  }

  const songIds = new Set();
  const songs = [];

  savedSongValues.forEach((song) => {
    const id = typeof song?.id === "string" ? song.id.trim() : "";
    const name = sanitizeSongName(song?.name);

    if (!id || !name || songIds.has(id)) {
      return;
    }

    const savedSequence = normalizeSavedSequence(song);
    songIds.add(id);
    songs.push({
      version: 1,
      id,
      name,
      savedAt: typeof song.savedAt === "string" ? song.savedAt : "",
      activeSectionId: savedSequence.activeSectionId,
      sections: savedSequence.sections.map(serializeSavedSection),
      sequenceIndex: savedSequence.sequenceIndex,
      sequence: savedSequence.sequence.map(serializeSavedChord),
    });
  });

  return songs;
}

function normalizeSavedSequence(parsedValue) {
  const savedChords = Array.isArray(parsedValue) ? parsedValue : parsedValue?.sequence;
  const savedSections = parseSavedSections(parsedValue);
  const defaultSectionId = savedSections[0].id;

  if (!Array.isArray(savedChords)) {
    return {
      sections: savedSections,
      activeSectionId: defaultSectionId,
      activeSongId: null,
      sequence: [],
      sequenceIndex: null,
    };
  }

  const sequence = savedChords
    .map((savedChord) => resolveSavedChord(savedChord, savedSections, defaultSectionId))
    .filter(Boolean)
    .map((chord) => ({ ...chord }));
  const fallbackIndex = sequence.length ? sequence.length - 1 : null;
  const requestedIndex = Array.isArray(parsedValue) ? fallbackIndex : parsedValue.sequenceIndex;
  const sequenceIndex = sequence.length && Number.isInteger(requestedIndex)
    ? clamp(requestedIndex, 0, sequence.length - 1)
    : fallbackIndex;
  const requestedSectionId = Array.isArray(parsedValue) ? defaultSectionId : parsedValue.activeSectionId;
  const activeSectionId = savedSections.some((section) => section.id === requestedSectionId)
    ? requestedSectionId
    : defaultSectionId;
  const activeSongId = !Array.isArray(parsedValue) && typeof parsedValue.activeSongId === "string"
    ? parsedValue.activeSongId
    : null;

  return { sections: savedSections, activeSectionId, activeSongId, sequence, sequenceIndex };
}

function parseSavedSections(parsedValue) {
  if (!parsedValue || typeof parsedValue !== "object" || Array.isArray(parsedValue) || !Array.isArray(parsedValue.sections)) {
    return [createSequenceSection(DEFAULT_SECTION_NAME)];
  }

  const sections = [];

  parsedValue.sections.forEach((section) => {
    if (!section || typeof section.id !== "string") {
      return;
    }

    const name = sanitizeSectionName(section.name);
    const id = section.id.trim();
    const lyrics = normalizeSectionLyrics(section.lyrics);

    if (!name || !id || sections.some((savedSection) => savedSection.id === id)) {
      return;
    }

    sections.push(createSequenceSection(name, id, lyrics));
  });

  return sections.length ? sections : [createSequenceSection(DEFAULT_SECTION_NAME)];
}

function resolveSavedChord(savedChord, sections = state.sections, defaultSectionId = state.activeSectionId) {
  if (typeof savedChord === "string") {
    return withSection(findChordByName(savedChord), defaultSectionId);
  }

  if (!savedChord || typeof savedChord.name !== "string") {
    return null;
  }

  const sectionId = sections.some((section) => section.id === savedChord.sectionId)
    ? savedChord.sectionId
    : defaultSectionId;
  return withSection(findChordByName(savedChord.name) ?? customSavedChord(savedChord), sectionId);
}

function withSection(chord, sectionId) {
  if (!chord) {
    return null;
  }

  return { ...chord, voicing: [...chord.voicing], sectionId };
}

function customSavedChord(savedChord) {
  const name = savedChord.name.trim();

  if (!name || name.length > 24 || !Array.isArray(savedChord.voicing) || savedChord.voicing.length !== STRINGS.length) {
    return null;
  }

  const voicing = savedChord.voicing.map((fret) => {
    if (fret === null) {
      return null;
    }

    return Number.isInteger(fret) && fret >= 0 && fret <= 24 ? fret : null;
  });

  if (voicing.every((fret) => fret === null)) {
    return null;
  }

  return { name, voicing, aliases: [] };
}

function renderSequence({ scrollSelectedChord = false, scrollSectionToTop = false } = {}) {
  ensureActiveSection();
  renderSongSelect();
  renderSectionSelect();
  const chordRowScrollPositions = scrollSelectedChord || scrollSectionToTop
    ? null
    : sequenceChordRowScrollPositions();
  sequenceList.replaceChildren();

  const hasSectionLyrics = state.sections.some((section) => normalizeSectionLyrics(section.lyrics).trim());

  if (!state.sequence.length && !hasSectionLyrics) {
    const empty = document.createElement("span");
    empty.className = "sequence-empty";
    empty.textContent = "Empty";
    sequenceList.append(empty);
    renderPerformanceStrip();
    return;
  }

  sequenceGroupsForRender().forEach(({ section, chords }) => {
    const placementSummary = sectionPlacementSummary(chords);
    const group = document.createElement("div");
    group.className = "sequence-section";
    group.classList.toggle("is-active-section", section.id === state.activeSectionId);
    group.dataset.sectionId = section.id;

    const sectionButton = document.createElement("button");
    sectionButton.className = "sequence-section-title";
    sectionButton.classList.toggle("is-complete", placementSummary.total > 0 && placementSummary.placed === placementSummary.total);
    sectionButton.type = "button";
    sectionButton.setAttribute(
      "aria-label",
      `${section.name}, ${placementSummary.placed} of ${placementSummary.total} chords placed in lyrics`,
    );
    sectionButton.setAttribute("aria-pressed", String(section.id === state.activeSectionId));

    const sectionName = document.createElement("span");
    sectionName.className = "sequence-section-name";
    sectionName.textContent = section.name;

    const sectionPlacement = document.createElement("span");
    sectionPlacement.className = "section-placement-count";
    sectionPlacement.hidden = placementSummary.total === 0;
    sectionPlacement.textContent = `${placementSummary.placed}/${placementSummary.total}`;

    sectionButton.append(sectionName, sectionPlacement);
    sectionButton.addEventListener("click", () => {
      state.activeSectionId = section.id;
      saveSequence();
      renderSequence();
    });

    const lyricsText = normalizeSectionLyrics(section.lyrics);
    const lyrics = renderSectionLyrics(lyricsText, section.id);

    const chordList = document.createElement("div");
    chordList.className = "sequence-section-chords";
    chordList.dataset.sectionId = section.id;
    chordList.addEventListener("dragover", (event) => {
      if (event.target.closest(".sequence-chip")) {
        return;
      }

      handleSequenceSectionDragOver(event, section.id);
    });
    chordList.addEventListener("drop", handleSequenceDrop);

    if (!chords.length) {
      const empty = document.createElement("span");
      empty.className = "section-empty";
      empty.textContent = "Empty";
      chordList.append(empty);
    }

    chords.forEach(({ chord, index }) => {
      chordList.append(renderSequenceChip(chord, index));
    });

    group.append(sectionButton);

    if (lyricsText.trim()) {
      group.append(lyrics);
    }

    group.append(chordList);
    sequenceList.append(group);
  });

  if (scrollSectionToTop) {
    scrollActiveSequenceSectionToTop();
  } else if (!scrollSelectedChord) {
    restoreSequenceChordRowScrollPositions(chordRowScrollPositions);
  }

  if (scrollSelectedChord) {
    scrollSelectedSequenceChordIntoView();
  }

  renderPerformanceStrip();
}

function sequenceChordRowScrollPositions() {
  const scrollPositions = new Map();

  sequenceList.querySelectorAll(".sequence-section-chords").forEach((row) => {
    scrollPositions.set(row.dataset.sectionId, row.scrollLeft);
  });

  return scrollPositions;
}

function restoreSequenceChordRowScrollPositions(scrollPositions) {
  if (!scrollPositions?.size) {
    return;
  }

  sequenceList.querySelectorAll(".sequence-section-chords").forEach((row) => {
    const scrollLeft = scrollPositions.get(row.dataset.sectionId);

    if (Number.isFinite(scrollLeft)) {
      row.scrollLeft = scrollLeft;
    }
  });
}

function scrollActiveSequenceSectionToTop() {
  const activeSection = sequenceList.querySelector(".sequence-section.is-active-section");

  if (!activeSection) {
    return;
  }

  const listRect = sequenceList.getBoundingClientRect();
  const sectionRect = activeSection.getBoundingClientRect();
  const visibleTop = listRect.top + sectionScrollTopOffset(activeSection, listRect, sectionRect);
  const visibleBottom = listRect.bottom - SECTION_SCROLL_BOTTOM_OFFSET;

  if (sectionRect.top < visibleTop || sectionRect.top > visibleBottom) {
    sequenceList.scrollTop += sectionRect.top - visibleTop;
  }

  activeSection.querySelector(".sequence-section-chords")?.scrollTo({ left: 0 });
}

function sectionScrollTopOffset(activeSection, listRect, sectionRect) {
  const previousLine = previousSectionLastLyricLine(activeSection);

  if (!previousLine) {
    return SECTION_SCROLL_TOP_OFFSET;
  }

  const previousLineRect = previousLine.getBoundingClientRect();
  const requiredOffset = sectionRect.top - previousLineRect.top + SECTION_SCROLL_CONTEXT_GAP;
  const maxOffset = Math.max(
    SECTION_SCROLL_TOP_OFFSET,
    listRect.height - SECTION_SCROLL_BOTTOM_OFFSET - activeSectionTitleHeight(activeSection),
  );

  return clamp(requiredOffset, SECTION_SCROLL_TOP_OFFSET, maxOffset);
}

function previousSectionLastLyricLine(activeSection) {
  const previousSection = activeSection.previousElementSibling;

  if (!previousSection?.classList?.contains("sequence-section")) {
    return null;
  }

  const lyricLines = Array.from(previousSection.querySelectorAll(".lyrics-line.is-lyric-line"))
    .filter((line) => line.textContent.trim());

  return lyricLines.length ? lyricLines[lyricLines.length - 1] : null;
}

function activeSectionTitleHeight(activeSection) {
  return activeSection.querySelector(".sequence-section-title")?.getBoundingClientRect().height ?? 24;
}

function scrollSelectedSequenceChordIntoView() {
  if (scrollSelectedLyricMarkerIntoView()) {
    return;
  }

  sequenceList.querySelector(".sequence-chip.is-active")?.scrollIntoView({
    block: "nearest",
    inline: "center",
  });
}

function scrollSelectedLyricMarkerIntoView() {
  const marker = sequenceList.querySelector(".lyric-chord.is-active");

  if (!marker) {
    return false;
  }

  const listPadding = 10;
  const listRect = sequenceList.getBoundingClientRect();
  const markerLine = marker.closest(".lyrics-line");
  const lyricLine = associatedLyricLineForMarker(marker);
  const visibleTop = listRect.top + listPadding;
  const visibleBottom = listRect.bottom - listPadding;
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  const blockRects = [markerLine, lyricLine]
    .filter(Boolean)
    .map((element) => element.getBoundingClientRect());
  const markerRect = marker.getBoundingClientRect();
  const blockTop = blockRects.length ? Math.min(...blockRects.map((rect) => rect.top)) : markerRect.top;
  const blockBottom = blockRects.length ? Math.max(...blockRects.map((rect) => rect.bottom)) : markerRect.bottom;
  const blockHeight = Math.max(0, blockBottom - blockTop);

  if (blockTop < visibleTop || blockBottom > visibleBottom) {
    if (blockHeight <= visibleHeight) {
      sequenceList.scrollTop += blockTop < visibleTop
        ? blockTop - visibleTop
        : blockBottom - visibleBottom;
    } else {
      sequenceList.scrollTop += markerRect.top - visibleTop;
    }
  }

  scrollLyricMarkerPairIntoViewport(marker, markerLine, lyricLine);

  const lyrics = marker.closest(".sequence-lyrics");

  if (lyrics) {
    const lyricPadding = 12;
    const lyricRect = lyrics.getBoundingClientRect();
    const nextMarkerRect = marker.getBoundingClientRect();

    if (nextMarkerRect.left < lyricRect.left + lyricPadding) {
      lyrics.scrollLeft += nextMarkerRect.left - lyricRect.left - lyricPadding;
    } else if (nextMarkerRect.right > lyricRect.right - lyricPadding) {
      lyrics.scrollLeft += nextMarkerRect.right - lyricRect.right + lyricPadding;
    }
  }

  return true;
}

function scrollLyricMarkerPairIntoViewport(marker, markerLine, lyricLine) {
  const viewportPadding = 10;
  const viewportTop = viewportPadding;
  const viewportBottom = window.innerHeight - viewportPadding;
  const viewportHeight = Math.max(0, viewportBottom - viewportTop);
  const blockRects = [markerLine, lyricLine]
    .filter(Boolean)
    .map((element) => element.getBoundingClientRect());
  const markerRect = marker.getBoundingClientRect();
  const blockTop = blockRects.length ? Math.min(...blockRects.map((rect) => rect.top)) : markerRect.top;
  const blockBottom = blockRects.length ? Math.max(...blockRects.map((rect) => rect.bottom)) : markerRect.bottom;
  const blockHeight = Math.max(0, blockBottom - blockTop);

  if (blockTop >= viewportTop && blockBottom <= viewportBottom) {
    return;
  }

  window.scrollBy({
    top: blockHeight <= viewportHeight
      ? (blockTop < viewportTop ? blockTop - viewportTop : blockBottom - viewportBottom)
      : markerRect.top - viewportTop,
    left: 0,
    behavior: "auto",
  });
}

function associatedLyricLineForMarker(marker) {
  const markerLine = marker.closest(".lyrics-line");

  if (!markerLine?.classList?.contains("is-chord-line")) {
    return markerLine;
  }

  let line = markerLine.nextElementSibling;

  while (line?.classList?.contains("lyrics-line")) {
    if (line.classList.contains("is-lyric-line")) {
      return line;
    }

    line = line.nextElementSibling;
  }

  return markerLine;
}

function sectionPlacementSummary(chords) {
  return chords.reduce(
    (summary, { index }) => ({
      placed: summary.placed + (sequenceChordIsPlacedInLyrics(index) ? 1 : 0),
      total: summary.total + 1,
    }),
    { placed: 0, total: 0 },
  );
}

function sequenceChordIsPlacedInLyrics(sequenceIndex) {
  const chord = state.sequence[sequenceIndex];

  if (!chord) {
    return false;
  }

  const section = state.sections.find((savedSection) => savedSection.id === chord.sectionId);

  if (!section) {
    return false;
  }

  const placements = chordPlacementsForName(normalizeSectionLyrics(section.lyrics).split("\n"), chord.name);

  if (!placements.length) {
    return false;
  }

  const occurrence = sequenceChordOccurrenceInSection(sequenceIndex);
  return occurrence.count > 1 ? placements.length > occurrence.index : true;
}

function renderSequenceChip(chord, index) {
  const isPlacedInLyrics = sequenceChordIsPlacedInLyrics(index);
  const chip = document.createElement("div");
  chip.className = "sequence-chip";
  chip.classList.toggle("is-active", index === state.sequenceIndex);
  chip.classList.toggle("is-lyric-placed", isPlacedInLyrics);
  chip.classList.toggle("is-lyric-unplaced", !isPlacedInLyrics);
  chip.dataset.index = String(index);
  chip.draggable = false;
  chip.addEventListener("dragstart", (event) => handleSequenceDragStart(event, index));
  chip.addEventListener("dragover", (event) => handleSequenceChipDragOver(event, index, chord.sectionId));
  chip.addEventListener("drop", handleSequenceDrop);
  chip.addEventListener("dragend", clearSequenceDragState);

  const selectButton = document.createElement("button");
  selectButton.className = "sequence-select";
  selectButton.type = "button";
  selectButton.setAttribute("aria-label", `Select ${chord.name}, ${isPlacedInLyrics ? "placed in lyrics" : "not placed in lyrics"}`);

  const label = document.createElement("strong");
  label.textContent = chord.name;

  const placementDot = document.createElement("span");
  placementDot.className = "sequence-placement-dot";
  placementDot.setAttribute("aria-hidden", "true");

  selectButton.append(placementDot, label);
  selectButton.addEventListener("click", (event) => {
    if (shouldSuppressSequenceClick(event)) {
      return;
    }

    selectChord(chord, index, { scrollSelectedChord: false });
  });

  const dragButton = document.createElement("button");
  dragButton.className = "sequence-drag";
  dragButton.type = "button";
  dragButton.setAttribute("aria-label", `Move ${chord.name}`);
  dragButton.addEventListener("pointerdown", (event) => handleSequencePointerDown(event, index));
  dragButton.addEventListener("pointermove", handleSequencePointerMove);
  dragButton.addEventListener("pointerup", handleSequencePointerEnd);
  dragButton.addEventListener("pointercancel", handleSequencePointerCancel);
  dragButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "sequence-delete";
  deleteButton.type = "button";
  deleteButton.textContent = "x";
  deleteButton.setAttribute("aria-label", `Remove ${chord.name} from sequence`);
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    removeSequenceChord(index);
  });

  chip.append(dragButton, selectButton, deleteButton);
  return chip;
}

function renderSectionLyrics(lyricsText, sectionId) {
  const lyrics = document.createElement("div");
  lyrics.className = "sequence-lyrics";
  const chordOccurrences = new Map();

  normalizeSectionLyrics(lyricsText).split("\n").forEach((line, lineIndex) => {
    const lineElement = document.createElement("div");
    const isChordLine = sectionLyricLineIsChordLine(line);
    lineElement.className = `lyrics-line ${isChordLine ? "is-chord-line" : "is-lyric-line"}`;
    lineElement.dataset.lineIndex = String(lineIndex);
    lineElement.dataset.sectionId = sectionId;
    lineElement.addEventListener("dragover", handleLyricLineDragOver);
    lineElement.addEventListener("drop", handleLyricLineDrop);

    if (isChordLine) {
      appendChordLineContent(lineElement, line, sectionId, chordOccurrences);
    } else {
      lineElement.textContent = line || "\u00a0";
    }

    lyrics.append(lineElement);
  });

  return lyrics;
}

function sectionLyricLineIsChordLine(line) {
  const tokens = line.trim().split(/\s+/).filter(Boolean);
  return Boolean(tokens.length) && tokens.every((token) => resolveLyricChordToken(token));
}

function appendChordLineContent(lineElement, line, sectionId, chordOccurrences) {
  let cursor = 0;

  line.replace(/\S+/g, (token, index) => {
    if (index > cursor) {
      lineElement.append(document.createTextNode(line.slice(cursor, index)));
    }

    const chord = resolveLyricChordToken(token);

    if (chord) {
      const occurrenceKey = normalizeSearch(chord.name);
      const occurrenceIndex = chordOccurrences.get(occurrenceKey) ?? 0;
      chordOccurrences.set(occurrenceKey, occurrenceIndex + 1);
      lineElement.append(renderLyricChordButton(token, chord, sectionId, occurrenceIndex));
    } else {
      lineElement.append(document.createTextNode(token));
    }

    cursor = index + token.length;
    return token;
  });

  if (cursor < line.length) {
    lineElement.append(document.createTextNode(line.slice(cursor)));
  }
}

function renderLyricChordButton(label, chord, sectionId, occurrenceIndex) {
  const isActive = lyricChordMatchesSelectedSequence(chord, sectionId, occurrenceIndex);
  const button = document.createElement("button");
  button.className = "lyric-chord";
  button.classList.toggle("is-active", isActive);
  button.type = "button";
  button.textContent = label;
  button.setAttribute("aria-label", `Select ${label}`);
  button.setAttribute("aria-pressed", String(isActive));
  button.addEventListener("click", () => selectLyricChord(chord, sectionId, occurrenceIndex));
  return button;
}

function lyricChordMatchesSelectedSequence(chord, sectionId, occurrenceIndex) {
  if (state.sequenceIndex === null) {
    return false;
  }

  const selectedChord = state.sequence[state.sequenceIndex];

  if (!selectedChord || selectedChord.sectionId !== sectionId || normalizeSearch(selectedChord.name) !== normalizeSearch(chord.name)) {
    return false;
  }

  return sequenceChordOccurrenceInSection(state.sequenceIndex).index === occurrenceIndex;
}

function selectLyricChord(chord, sectionId, occurrenceIndex = 0) {
  const sectionSequenceIndexes = state.sequence
    .map((sequenceChord, index) => ({ index, sequenceChord }))
    .filter(({ sequenceChord }) =>
      sequenceChord.sectionId === sectionId && normalizeSearch(sequenceChord.name) === normalizeSearch(chord.name)
    );
  const sectionSequenceIndex = sectionSequenceIndexes[occurrenceIndex]?.index ?? sectionSequenceIndexes[0]?.index ?? -1;
  const sequenceIndex = sectionSequenceIndex === -1
    ? state.sequence.findIndex((sequenceChord) => normalizeSearch(sequenceChord.name) === normalizeSearch(chord.name))
    : sectionSequenceIndex;

  if (sequenceIndex === -1) {
    selectChord(chord);
    return;
  }

  selectChord(state.sequence[sequenceIndex], sequenceIndex);
}

function resolveLyricChordToken(token) {
  const cleanedToken = sanitizeLyricChordToken(token);

  if (!cleanedToken || !CHORD_TOKEN_PATTERN.test(cleanedToken)) {
    return null;
  }

  return findChordByDisplayName(cleanedToken) ?? findChordByDisplayName(cleanedToken.split("/")[0]) ?? null;
}

function sanitizeLyricChordToken(token) {
  return String(token ?? "").trim().replace(/^[([]|[\]),.;:!?]$/g, "");
}

function findChordByDisplayName(name) {
  return findChordByName(name) ?? CHORD_LIBRARY.find((chord) => normalizeSearch(chord.name) === normalizeSearch(name)) ?? null;
}

function focusSelectedSequenceChord() {
  sequenceList.querySelector(".sequence-chip.is-active .sequence-select")?.focus({ preventScroll: true });
}

function handleSequenceDragStart(event, index) {
  if (event.target.closest(".sequence-delete")) {
    event.preventDefault();
    return;
  }

  draggedSequenceIndex = index;
  sequenceDropIndex = null;
  sequenceDropSectionId = null;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", String(index));
  event.currentTarget.classList.add("is-dragging");
}

function handleSequenceChipDragOver(event, index, sectionId) {
  if (draggedSequenceIndex === null) {
    return;
  }

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  const chip = event.currentTarget;
  const rect = chip.getBoundingClientRect();
  const isAfter = event.clientX > rect.left + rect.width / 2;
  setSequenceDropTarget(index + (isAfter ? 1 : 0), sectionId, chip, isAfter ? "after" : "before");
}

function handleSequenceSectionDragOver(event, sectionId) {
  if (draggedSequenceIndex === null) {
    return;
  }

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  const chordRow = event.currentTarget;
  setSequenceDropTarget(sequenceInsertIndexForSection(sectionId), sectionId, chordRow, "section");
}

function handleSequenceDrop(event) {
  if (draggedSequenceIndex === null) {
    return;
  }

  event.preventDefault();

  if (lyricDropTarget) {
    placeSequenceChordOnLyrics(draggedSequenceIndex, lyricDropTarget);
  } else if (sequenceDropIndex !== null) {
    moveSequenceChord(draggedSequenceIndex, sequenceDropIndex, sequenceDropSectionId);
  }

  clearSequenceDragState();
}

function handleSequencePointerDown(event, index) {
  if ((event.button !== undefined && event.button !== 0) || event.target.closest(".sequence-delete")) {
    return;
  }

  const fromHandle = event.currentTarget.closest(".sequence-drag") !== null;
  const captureTarget = event.currentTarget;
  sequencePointerDrag = {
    chip: event.currentTarget.closest(".sequence-chip"),
    captureTarget,
    fromIndex: index,
    fromHandle,
    hasCapture: false,
    isDragging: false,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
  };

  if (fromHandle && typeof captureTarget.setPointerCapture === "function") {
    event.preventDefault();
    captureTarget.setPointerCapture(event.pointerId);
    sequencePointerDrag.hasCapture = true;
  }
}

function handleSequencePointerMove(event) {
  if (!sequencePointerDrag || sequencePointerDrag.pointerId !== event.pointerId) {
    return;
  }

  const deltaX = event.clientX - sequencePointerDrag.startX;
  const deltaY = event.clientY - sequencePointerDrag.startY;

  if (!sequencePointerDrag.isDragging && Math.hypot(deltaX, deltaY) < 8) {
    return;
  }

  if (sequencePointerIsHorizontalScroll(event, deltaX, deltaY)) {
    clearSequencePointerDragState();
    return;
  }

  event.preventDefault();

  if (!sequencePointerDrag.isDragging) {
    sequencePointerDrag.isDragging = true;
    draggedSequenceIndex = sequencePointerDrag.fromIndex;
    sequencePointerDrag.chip.classList.add("is-dragging");

    if (!sequencePointerDrag.hasCapture) {
      sequencePointerDrag.captureTarget.setPointerCapture(event.pointerId);
      sequencePointerDrag.hasCapture = true;
    }
  }

  updateSequencePointerDropTarget(event.clientX, event.clientY);
}

function sequencePointerIsHorizontalScroll(event, deltaX, deltaY) {
  if (sequencePointerDrag?.isDragging || sequencePointerDrag?.fromHandle || event.pointerType !== "touch") {
    return false;
  }

  const chordRow = sequencePointerDrag.chip.closest(".sequence-section-chords");
  const canScrollHorizontally = chordRow && chordRow.scrollWidth > chordRow.clientWidth + 1;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  return Boolean(canScrollHorizontally && absX > 10 && absX > absY * 1.25);
}

function handleSequencePointerEnd(event) {
  if (!sequencePointerDrag || sequencePointerDrag.pointerId !== event.pointerId) {
    return;
  }

  if (sequencePointerDrag.hasCapture && sequencePointerDrag.captureTarget.hasPointerCapture(event.pointerId)) {
    sequencePointerDrag.captureTarget.releasePointerCapture(event.pointerId);
  }

  if (sequencePointerDrag.isDragging) {
    event.preventDefault();
    suppressSequenceClickUntil = performance.now() + 120;

    if (lyricDropTarget) {
      placeSequenceChordOnLyrics(sequencePointerDrag.fromIndex, lyricDropTarget);
    } else if (sequenceDropIndex !== null) {
      moveSequenceChord(sequencePointerDrag.fromIndex, sequenceDropIndex, sequenceDropSectionId);
    }
  }

  clearSequencePointerDragState();
}

function handleSequencePointerCancel(event) {
  if (sequencePointerDrag?.pointerId === event.pointerId) {
    clearSequencePointerDragState();
  }
}

function updateSequencePointerDropTarget(clientX, clientY) {
  const target = document.elementFromPoint(clientX, clientY);
  const targetChip = target?.closest?.(".sequence-chip");

  if (targetChip && sequenceList.contains(targetChip)) {
    const index = Number(targetChip.dataset.index);
    const chord = state.sequence[index];

    if (!Number.isInteger(index) || !chord) {
      return;
    }

    const rect = targetChip.getBoundingClientRect();
    const isAfter = clientX > rect.left + rect.width / 2;
    setSequenceDropTarget(index + (isAfter ? 1 : 0), chord.sectionId, targetChip, isAfter ? "after" : "before");
    return;
  }

  const lyricLine = target?.closest?.(".lyrics-line");

  if (lyricLine && sequenceList.contains(lyricLine)) {
    const dropTarget = lyricDropTargetFromLine(lyricLine, clientX);

    if (dropTarget) {
      setLyricDropTarget(dropTarget, lyricLine, clientX);
      return;
    }
  }

  const chordRow = target?.closest?.(".sequence-section-chords");

  if (chordRow && sequenceList.contains(chordRow)) {
    const sectionId = chordRow.dataset.sectionId;
    setSequenceDropTarget(sequenceInsertIndexForSection(sectionId), sectionId, chordRow, "section");
  }
}

function setSequenceDropTarget(index, sectionId, element, placement) {
  clearSequenceDropMarkers();
  sequenceDropIndex = index;
  sequenceDropSectionId = sectionId;
  lyricDropTarget = null;

  if (placement === "before") {
    element.classList.add("is-drop-before");
  } else if (placement === "after") {
    element.classList.add("is-drop-after");
  } else {
    element.classList.add("is-drop-target");
  }
}

function setLyricDropTarget(dropTarget, lineElement, clientX) {
  clearSequenceDropMarkers();
  sequenceDropIndex = null;
  sequenceDropSectionId = null;
  lyricDropTarget = dropTarget;

  const markerX = lyricDropMarkerX(lineElement, dropTarget, clientX);
  lineElement.style.setProperty("--lyric-drop-x", `${markerX}px`);
  lineElement.classList.add("is-lyric-drop-target");
}

function lyricDropMarkerX(lineElement, dropTarget, fallbackClientX) {
  const rect = lineElement.getBoundingClientRect();
  const section = state.sections.find((savedSection) => savedSection.id === dropTarget.sectionId);
  const lines = normalizeSectionLyrics(section?.lyrics ?? "").split("\n");
  const snapLineIndex = lyricDropSnapLineIndex(lines, dropTarget.lineIndex);
  const line = lines[snapLineIndex] ?? "";

  if (!line) {
    return clamp(fallbackClientX - rect.left, 0, Math.max(rect.width, lineElement.scrollWidth));
  }

  return clamp(
    measureLyricText(line.slice(0, dropTarget.column), getComputedStyle(lyricSnapLineElement(lineElement, snapLineIndex)).font),
    0,
    Math.max(rect.width, lineElement.scrollWidth),
  );
}

function handleLyricLineDragOver(event) {
  if (draggedSequenceIndex === null) {
    return;
  }

  const dropTarget = lyricDropTargetFromLine(event.currentTarget, event.clientX);

  if (!dropTarget) {
    return;
  }

  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
  setLyricDropTarget(dropTarget, event.currentTarget, event.clientX);
}

function handleLyricLineDrop(event) {
  if (draggedSequenceIndex === null || !lyricDropTarget) {
    return;
  }

  event.preventDefault();
  placeSequenceChordOnLyrics(draggedSequenceIndex, lyricDropTarget);
  clearSequenceDragState();
}

function lyricDropTargetFromLine(lineElement, clientX) {
  const sectionId = lineElement.dataset.sectionId;
  const lineIndex = Number(lineElement.dataset.lineIndex);
  const section = state.sections.find((savedSection) => savedSection.id === sectionId);

  if (!section || !Number.isInteger(lineIndex)) {
    return null;
  }

  const line = normalizeSectionLyrics(section.lyrics).split("\n")[lineIndex] ?? "";
  const lines = normalizeSectionLyrics(section.lyrics).split("\n");
  const snapLineIndex = lyricDropSnapLineIndex(lines, lineIndex);
  const snapLine = lines[snapLineIndex] ?? line;
  const snapLineElement = lyricSnapLineElement(lineElement, snapLineIndex);
  const wordIndex = lyricDropWordIndex(snapLineElement, snapLine, clientX);
  return {
    column: lyricWordStartColumns(snapLine)[wordIndex] ?? 0,
    lineIndex,
    sectionId,
    wordIndex,
  };
}

function lyricDropSnapLineIndex(lines, lineIndex) {
  const line = lines[lineIndex] ?? "";

  if (!sectionLyricLineIsChordLine(line)) {
    return lineIndex;
  }

  const block = chordLineBlockAround(lines, lineIndex);
  return firstLyricLineAfter(lines, block.end) ?? lineIndex;
}

function lyricSnapLineElement(lineElement, lineIndex) {
  const lyricLines = lineElement.parentElement?.querySelectorAll(".lyrics-line") ?? [];

  for (const lyricLine of lyricLines) {
    if (Number(lyricLine.dataset.lineIndex) === lineIndex) {
      return lyricLine;
    }
  }

  return lineElement;
}

function lyricDropWordIndex(lineElement, line, clientX) {
  const rect = lineElement.getBoundingClientRect();
  const targetX = Math.max(0, clientX - rect.left);
  const font = getComputedStyle(lineElement).font;
  const columns = lyricWordStartColumns(line);
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  columns.forEach((column, index) => {
    const width = measureLyricText(line.slice(0, column), font);
    const distance = Math.abs(width - targetX);

    if (distance < bestDistance) {
      bestIndex = index;
      bestDistance = distance;
    }
  });

  return bestIndex;
}

function lyricWordStartColumns(line) {
  const columns = [];
  line.replace(/\S+/g, (_word, index) => {
    columns.push(index);
    return _word;
  });

  return columns.length ? columns : [0];
}

function measureLyricText(text, font) {
  lyricMeasureCanvas ??= document.createElement("canvas");
  const context = lyricMeasureCanvas.getContext("2d");
  context.font = font;
  return context.measureText(text).width;
}

function placeSequenceChordOnLyrics(sequenceIndex, dropTarget) {
  const chord = state.sequence[sequenceIndex];
  const section = state.sections.find((savedSection) => savedSection.id === dropTarget.sectionId);

  if (!chord || !section) {
    return false;
  }

  const lines = normalizeSectionLyrics(section.lyrics).split("\n");
  while (lines.length <= dropTarget.lineIndex) {
    lines.push("");
  }

  const adjustedDropTarget = removeExistingChordPlacement(lines, chord.name, dropTarget, sequenceIndex);
  prepareChordLyricPlacement(lines, chord.name, adjustedDropTarget);
  section.lyrics = normalizeSectionLyrics(lines.join("\n"));
  state.activeSectionId = section.id;

  saveSequence();
  renderSequence();
  scrollSectionChordRowToStart(chord.sectionId);
  return true;
}

function scrollSectionChordRowToStart(sectionId) {
  const chordRow = Array.from(sequenceList.querySelectorAll(".sequence-section-chords"))
    .find((row) => row.dataset.sectionId === sectionId);

  if (!chordRow) {
    return;
  }

  chordRow.scrollLeft = 0;
  requestAnimationFrame(() => {
    chordRow.scrollLeft = 0;
  });
}

function prepareChordLyricPlacement(lines, chordName, dropTarget) {
  const targetLine = lines[dropTarget.lineIndex] ?? "";
  let block;
  let lyricLineIndex = dropTarget.lineIndex;

  if (sectionLyricLineIsChordLine(targetLine)) {
    block = chordLineBlockAround(lines, dropTarget.lineIndex);
    lyricLineIndex = firstLyricLineAfter(lines, block.end) ?? dropTarget.lineIndex;
  } else {
    block = chordLineBlockBefore(lines, dropTarget.lineIndex);

    if (block.end >= block.start) {
      block = { end: block.end, start: block.start };
    } else {
      lines.splice(dropTarget.lineIndex, 0, "");
      block = { end: dropTarget.lineIndex, start: dropTarget.lineIndex };
      lyricLineIndex = dropTarget.lineIndex + 1;
    }
  }

  return rebuildChordLyricBlock(lines, block, lyricLineIndex, chordName, dropTarget);
}

function chordLineBlockAround(lines, lineIndex) {
  let start = lineIndex;
  let end = lineIndex;

  while (start > 0 && sectionLyricLineIsChordLine(lines[start - 1] ?? "")) {
    start -= 1;
  }

  while (end + 1 < lines.length && sectionLyricLineIsChordLine(lines[end + 1] ?? "")) {
    end += 1;
  }

  return { end, start };
}

function chordLineBlockBefore(lines, lineIndex) {
  let start = lineIndex;
  let end = lineIndex - 1;

  while (start > 0 && sectionLyricLineIsChordLine(lines[start - 1] ?? "")) {
    start -= 1;
  }

  return { end, start };
}

function firstLyricLineAfter(lines, lineIndex) {
  for (let index = lineIndex + 1; index < lines.length; index += 1) {
    if (!sectionLyricLineIsChordLine(lines[index] ?? "")) {
      return index;
    }
  }

  return null;
}

function rebuildChordLyricBlock(lines, block, lyricLineIndex, chordName, dropTarget) {
  const words = lyricLineWords(lines[lyricLineIndex] ?? "");

  if (!words.length) {
    const chordLineIndex = block.start;
    const chordLine = mergeChordBlockPlacements(lines, block);
    lines[chordLineIndex] = placeChordOnLyricLine(chordLine, chordName, 0);
    removeExtraChordLines(lines, block);
    return { chordLineIndex, column: 0 };
  }

  const targetWordIndex = Number.isInteger(dropTarget.wordIndex)
    ? clamp(dropTarget.wordIndex, 0, words.length - 1)
    : wordIndexForColumn(words, dropTarget.column);
  const placements = chordBlockPlacementsForWords(lines, block, words)
    .filter((placement) => placement.wordIndex !== targetWordIndex);

  placements.push({
    token: chordName,
    wordIndex: targetWordIndex,
  });

  const layout = layoutChordLyrics(words, placements);
  const removedLineCount = removeExtraChordLines(lines, block);
  const adjustedLyricLineIndex = lyricLineIndex > block.start
    ? lyricLineIndex - removedLineCount
    : lyricLineIndex;

  lines[block.start] = layout.chordLine;
  lines[adjustedLyricLineIndex] = layout.lyricLine;

  return {
    chordLineIndex: block.start,
    column: layout.placements.get(targetWordIndex) ?? 0,
  };
}

function relayoutChordLyricBlock(lines, block, lyricLineIndex) {
  const words = lyricLineWords(lines[lyricLineIndex] ?? "");
  const placements = words.length ? chordBlockPlacementsForWords(lines, block, words) : [];
  const layout = words.length
    ? layoutChordLyrics(words, placements)
    : { chordLine: mergeChordBlockPlacements(lines, block), lyricLine: lines[lyricLineIndex] ?? "" };
  const removals = [];
  let adjustedLyricLineIndex = lyricLineIndex;

  const extraChordLineCount = removeExtraChordLines(lines, block);

  if (extraChordLineCount) {
    removals.push({ count: extraChordLineCount, start: block.start + 1 });
  }

  if (adjustedLyricLineIndex > block.start) {
    adjustedLyricLineIndex -= extraChordLineCount;
  }

  if (words.length && adjustedLyricLineIndex >= 0 && adjustedLyricLineIndex < lines.length) {
    lines[adjustedLyricLineIndex] = layout.lyricLine;
  }

  if (layout.chordLine.trim()) {
    lines[block.start] = layout.chordLine;
    return { lyricLineIndex: adjustedLyricLineIndex, removals };
  }

  lines.splice(block.start, 1);
  removals.push({ count: 1, start: block.start });

  if (adjustedLyricLineIndex > block.start) {
    adjustedLyricLineIndex -= 1;
  }

  return { lyricLineIndex: Math.max(0, adjustedLyricLineIndex), removals };
}

function mergeChordBlockPlacements(lines, block) {
  const placements = [];

  for (let lineIndex = block.start; lineIndex <= block.end; lineIndex += 1) {
    chordLinePlacements(lines[lineIndex] ?? "").forEach((placement) => placements.push(placement));
  }

  return formatChordLinePlacements(placements);
}

function removeExtraChordLines(lines, block) {
  const count = Math.max(0, block.end - block.start);

  if (count) {
    lines.splice(block.start + 1, count);
  }

  return count;
}

function lyricLineWords(line) {
  const words = [];

  line.replace(/\S+/g, (token, start) => {
    words.push({ start, token });
    return token;
  });

  return words;
}

function chordBlockPlacementsForWords(lines, block, words) {
  const placements = [];

  for (let lineIndex = block.start; lineIndex <= block.end; lineIndex += 1) {
    chordLinePlacements(lines[lineIndex] ?? "").forEach((placement) => {
      placements.push({
        token: placement.token,
        wordIndex: wordIndexForColumn(words, placement.start),
      });
    });
  }

  return placements;
}

function wordIndexForColumn(words, column) {
  if (!words.length) {
    return 0;
  }

  const safeColumn = Math.max(0, column);
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  words.forEach((word, index) => {
    const distance = Math.abs(word.start - safeColumn);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function layoutChordLyrics(words, placements) {
  const placementByWord = new Map();

  placements.forEach((placement) => {
    placementByWord.set(
      clamp(placement.wordIndex, 0, Math.max(0, words.length - 1)),
      placement.token,
    );
  });

  let chordLine = "";
  let lyricLine = "";
  let nextWordColumn = 0;
  let markerEnd = -1;
  const wordColumns = new Map();

  words.forEach((word, index) => {
    const token = placementByWord.get(index);
    const column = token && markerEnd >= nextWordColumn
      ? markerEnd + 1
      : nextWordColumn;

    lyricLine = lyricLine.padEnd(column, " ") + word.token;
    wordColumns.set(index, column);

    if (token) {
      chordLine = chordLine.padEnd(column, " ") + token;
      markerEnd = Math.max(markerEnd, column + token.length);
    }

    nextWordColumn = column + word.token.length + 1;
  });

  return {
    chordLine: chordLine.trimEnd(),
    lyricLine: lyricLine.trimEnd(),
    placements: wordColumns,
  };
}

function removeExistingChordPlacement(lines, chordName, dropTarget, sequenceIndex) {
  const occurrence = sequenceChordOccurrenceInSection(sequenceIndex);
  const match = occurrence.count > 1
    ? chordPlacementForOccurrence(lines, chordName, occurrence.index)
    : closestChordPlacement(lines, chordName, dropTarget);

  if (!match) {
    return dropTarget;
  }

  const relayoutResult = removeChordPlacementMatch(lines, match);

  return adjustDropTargetAfterLineRemovals(dropTarget, relayoutResult, lines.length);
}

function removeSequenceChordMarker(sequenceIndex) {
  const chord = state.sequence[sequenceIndex];
  const section = state.sections.find((savedSection) => savedSection.id === chord?.sectionId);

  if (!chord || !section) {
    return false;
  }

  const occurrence = sequenceChordOccurrenceInSection(sequenceIndex);
  const lines = normalizeSectionLyrics(section.lyrics).split("\n");
  const match = chordPlacementForOccurrence(lines, chord.name, occurrence.index);

  if (!match) {
    return false;
  }

  removeChordPlacementMatch(lines, match);
  section.lyrics = normalizeSectionLyrics(lines.join("\n"));
  return true;
}

function removeChordPlacementMatch(lines, match) {
  const block = chordLineBlockAround(lines, match.lineIndex);
  const lyricLineIndex = firstLyricLineAfter(lines, block.end) ?? match.lineIndex;
  const line = lines[match.lineIndex] ?? "";
  lines[match.lineIndex] = `${line.slice(0, match.start)}${" ".repeat(match.end - match.start)}${line.slice(match.end)}`.trimEnd();
  return relayoutChordLyricBlock(lines, block, lyricLineIndex);
}

function adjustDropTargetAfterLineRemovals(dropTarget, relayoutResult, lineCount) {
  let lineIndex = dropTarget.lineIndex;

  relayoutResult.removals.forEach(({ count, start }) => {
    const end = start + count - 1;

    if (lineIndex > end) {
      lineIndex -= count;
    } else if (lineIndex >= start) {
      lineIndex = relayoutResult.lyricLineIndex;
    }
  });

  return {
    ...dropTarget,
    lineIndex: clamp(lineIndex, 0, Math.max(0, lineCount - 1)),
  };
}

function sequenceChordOccurrenceInSection(sequenceIndex) {
  const chord = state.sequence[sequenceIndex];

  if (!chord) {
    return { count: 0, index: 0 };
  }

  const chordName = normalizeSearch(chord.name);
  let count = 0;
  let index = 0;

  state.sequence.forEach((sequenceChord, currentIndex) => {
    if (sequenceChord.sectionId !== chord.sectionId || normalizeSearch(sequenceChord.name) !== chordName) {
      return;
    }

    if (currentIndex < sequenceIndex) {
      index += 1;
    }

    count += 1;
  });

  return { count, index };
}

function chordPlacementForOccurrence(lines, chordName, occurrenceIndex) {
  return chordPlacementsForName(lines, chordName)[occurrenceIndex] ?? null;
}

function closestChordPlacement(lines, chordName, dropTarget) {
  let bestMatch = null;
  let bestScore = Number.POSITIVE_INFINITY;

  chordPlacementsForName(lines, chordName).forEach((match) => {
    const lineDistance = Math.abs(match.lineIndex - dropTarget.lineIndex);
    const columnDistance = Math.abs(match.start - dropTarget.column);
    const score = lineDistance * 1000 + columnDistance;

    if (score < bestScore) {
      bestScore = score;
      bestMatch = match;
    }
  });

  return bestMatch;
}

function chordPlacementsForName(lines, chordName) {
  const matches = [];

  lines.forEach((line, lineIndex) => {
    if (!sectionLyricLineIsChordLine(line)) {
      return;
    }

    line.replace(/\S+/g, (token, start) => {
      if (lyricChordTokenMatchesName(token, chordName)) {
        matches.push({
          end: start + token.length,
          lineIndex,
          start,
        });
      }

      return token;
    });
  });

  return matches;
}

function lyricChordTokenMatchesName(token, chordName) {
  return normalizeSearch(sanitizeLyricChordToken(token)) === normalizeSearch(chordName);
}

function placeChordOnLyricLine(line, chordName, column) {
  const safeColumn = Math.max(0, column);
  const placements = chordLinePlacements(line)
    .filter((placement) => placement.start !== safeColumn);

  placements.push({ start: safeColumn, token: chordName });
  return formatChordLinePlacements(placements);
}

function chordLinePlacements(line) {
  const placements = [];

  line.replace(/\S+/g, (token, start) => {
    placements.push({ end: start + token.length, start, token });
    return token;
  });

  return placements;
}

function formatChordLinePlacements(placements) {
  let cursor = 0;
  let output = "";

  placements
    .sort((a, b) => a.start - b.start)
    .forEach(({ start, token }) => {
      const resolvedStart = output ? Math.max(start, cursor + 1) : start;
      output = output.padEnd(resolvedStart, " ") + token;
      cursor = resolvedStart + token.length;
    });

  return output.trimEnd();
}

function clearSequenceDragState() {
  draggedSequenceIndex = null;
  sequenceDropIndex = null;
  sequenceDropSectionId = null;
  lyricDropTarget = null;
  document.querySelectorAll(".sequence-chip.is-dragging").forEach((chip) => {
    chip.classList.remove("is-dragging");
  });
  clearSequenceDropMarkers();
}

function clearSequencePointerDragState() {
  sequencePointerDrag = null;
  clearSequenceDragState();
}

function clearSequenceDropMarkers() {
  document.querySelectorAll(".is-drop-before, .is-drop-after, .is-drop-target, .is-lyric-drop-target").forEach((element) => {
    element.classList.remove("is-drop-before", "is-drop-after", "is-drop-target", "is-lyric-drop-target");
    element.style.removeProperty("--lyric-drop-x");
  });
}

function shouldSuppressSequenceClick(event) {
  if (performance.now() > suppressSequenceClickUntil) {
    return false;
  }

  event.preventDefault();
  event.stopPropagation();
  return true;
}

function renderSectionSelect() {
  sectionSelect.replaceChildren();

  state.sections.forEach((section) => {
    const option = document.createElement("option");
    option.value = section.id;
    option.textContent = section.name;
    sectionSelect.append(option);
  });

  sectionSelect.value = state.activeSectionId;
  const activeSectionIndex = state.sections.findIndex((section) => section.id === state.activeSectionId);
  const section = activeSection();

  if (document.activeElement !== sectionLyricsInput) {
    sectionLyricsInput.value = section?.lyrics ?? "";
  }

  sectionLyricsInput.disabled = state.sections.length === 0;
  renameSectionButton.disabled = state.sections.length === 0;
  duplicateSectionButton.disabled = state.sections.length === 0;
  moveSectionUpButton.disabled = activeSectionIndex <= 0;
  moveSectionDownButton.disabled = activeSectionIndex === -1 || activeSectionIndex >= state.sections.length - 1;
  deleteSectionButton.disabled = state.sections.length <= 1;
}

function renderSongSelect() {
  songSelect.replaceChildren();

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = state.savedSongs.length ? "Choose song" : "No saved songs";
  songSelect.append(placeholder);

  state.savedSongs.forEach((song) => {
    const option = document.createElement("option");
    option.value = song.id;
    option.textContent = song.name;
    songSelect.append(option);
  });

  const hasActiveSong = state.savedSongs.some((song) => song.id === state.activeSongId);
  songSelect.disabled = !state.savedSongs.length;
  songSelect.value = hasActiveSong ? state.activeSongId : "";
  songNameInput.placeholder = uniqueSongName(suggestedSongName(), state.activeSongId);

  if (document.activeElement !== songNameInput) {
    const activeSong = hasActiveSong
      ? state.savedSongs.find((song) => song.id === state.activeSongId)
      : null;
    songNameInput.value = activeSong?.name ?? "";
  }

  updateSongActionState();
}

function updateSongActionState() {
  const hasSelectedSong = Boolean(songSelect.value);
  const hasUnsavedChanges = songHasUnsavedChanges();
  saveSongButton.disabled = false;
  saveSongButton.classList.toggle("has-unsaved-changes", hasUnsavedChanges);
  deleteSongButton.disabled = !hasSelectedSong;

  const activeSong = state.savedSongs.find((song) => song.id === state.activeSongId) ?? null;
  const songName = sanitizeSongName(songNameInput.value || activeSong?.name || "") || DEFAULT_SONG_NAME;
  songBuilderSongName.textContent = songName;
  songBuilderSongName.title = songName;
  unsavedIndicator.hidden = !hasUnsavedChanges;
  unsavedIndicator.setAttribute("aria-label", state.activeSongId ? "Unsaved changes" : "Not saved");
  unsavedIndicator.title = state.activeSongId ? "Unsaved changes" : "Not saved";
}

function songHasUnsavedChanges() {
  const activeSong = state.savedSongs.find((song) => song.id === state.activeSongId) ?? null;
  const currentName = sanitizeSongName(songNameInput.value || activeSong?.name || "");

  if (!activeSong) {
    return Boolean(currentName) || workingSongHasContent();
  }

  return JSON.stringify(currentSongSnapshotForComparison(currentName)) !== JSON.stringify(savedSongSnapshotForComparison(activeSong));
}

function workingSongHasContent() {
  return Boolean(
    state.sequence.length ||
    state.sections.length > 1 ||
    state.sections.some((section) =>
      sanitizeSectionName(section.name) !== DEFAULT_SECTION_NAME ||
      normalizeSectionLyrics(section.lyrics).trim()
    )
  );
}

function currentSongSnapshotForComparison(name) {
  return {
    name: sanitizeSongName(name),
    sections: state.sections.map(serializeSavedSection),
    sequence: state.sequence.map(serializeSavedChord),
  };
}

function savedSongSnapshotForComparison(song) {
  return {
    name: sanitizeSongName(song.name),
    sections: song.sections.map(serializeSavedSection),
    sequence: song.sequence.map(serializeSavedChord),
  };
}

function sequenceGroupsForRender() {
  const groups = state.sections.map((section) => ({ section, chords: [] }));
  const groupsBySection = new Map(groups.map((group) => [group.section.id, group]));

  state.sequence.forEach((chord, index) => {
    const group = groupsBySection.get(chord.sectionId) ?? groups[0];
    group.chords.push({ chord, index });
  });

  return groups.filter((group) =>
    group.chords.length ||
    group.section.id === state.activeSectionId ||
    normalizeSectionLyrics(group.section.lyrics).trim()
  );
}

function visibleChords() {
  if (!state.searchQuery) {
    return CHORD_BANKS[state.bank];
  }

  const query = normalizeSearch(state.searchQuery);
  return CHORD_LIBRARY
    .map((chord) => ({ chord, rank: chordSearchRank(chord, query) }))
    .filter(({ rank }) => rank !== null)
    .sort((a, b) => a.rank - b.rank || compareChordNames(a.chord.name, b.chord.name))
    .map(({ chord }) => chord);
}

function findChordByName(name) {
  if (typeof name !== "string") {
    return null;
  }

  return CHORD_LIBRARY.find((chord) => chord.name === name) ?? null;
}

function chordSearchRank(chord, query) {
  const name = normalizeSearch(chord.name);
  const aliases = (chord.aliases ?? []).map(normalizeSearch);
  const voicing = normalizeSearch(formatVoicing(chord.voicing));

  if (name === query) {
    return 0;
  }

  if (isChordPrefixMatch(name, query)) {
    return 1;
  }

  if (aliases.some((alias) => alias === query)) {
    return 2;
  }

  if (aliases.some((alias) => isChordPrefixMatch(alias, query))) {
    return 3;
  }

  if (name.includes(query)) {
    return 4;
  }

  if (aliases.some((alias) => alias.includes(query))) {
    return 5;
  }

  if (voicing.includes(query)) {
    return 6;
  }

  return null;
}

function isChordPrefixMatch(value, query) {
  if (!value.startsWith(query)) {
    return false;
  }

  return !(query.endsWith("m") && value.startsWith(`${query}a`));
}

function normalizeSearch(value) {
  return value.toLowerCase().replace(/\s+/g, "");
}

function compareChordNames(firstName, secondName) {
  return firstName.localeCompare(secondName, undefined, { numeric: true });
}

function buildChordLibrary() {
  const library = [];
  const byName = new Map();

  [...Object.values(CHORD_BANKS).flat(), ...EXTRA_CHORDS, ...generateMovableChordLibrary()].forEach((chord) => {
    const existingChord = byName.get(chord.name);
    if (existingChord) {
      existingChord.aliases = mergeAliases(existingChord.aliases, chord.aliases);
      return;
    }

    const nextChord = { ...chord, aliases: chord.aliases ?? [] };
    byName.set(nextChord.name, nextChord);
    library.push(nextChord);
  });

  return library.sort((a, b) => compareChordNames(a.name, b.name));
}

function generateMovableChordLibrary() {
  const chords = [];

  ROOTS.forEach((root) => {
    MOVABLE_CHORD_TYPES.forEach((chordType) => {
      const name = `${root.name}${chordType.suffix}`;
      const voicing = chooseMovableVoicing(root.semitone, chordType);
      chords.push({
        name,
        voicing,
        aliases: chordType.aliases.map((alias) => `${root.name}${alias}`),
      });
    });
  });

  return chords;
}

function chooseMovableVoicing(rootSemitone, chordType) {
  const eShape = transposeShape(chordType.eShape, fretForRoot(rootSemitone, 4));
  const aShape = transposeShape(chordType.aShape, fretForRoot(rootSemitone, 9));
  return voicingScore(eShape) <= voicingScore(aShape) ? eShape : aShape;
}

function transposeShape(shape, rootFret) {
  return shape.map((fret) => (fret === null ? null : fret + rootFret));
}

function fretForRoot(rootSemitone, stringSemitone) {
  return (rootSemitone - stringSemitone + 12) % 12;
}

function voicingScore(voicing) {
  const frets = voicing.filter((fret) => fret !== null);
  const minFret = Math.min(...frets);
  const maxFret = Math.max(...frets);
  const span = maxFret - minFret;
  const mutedStrings = voicing.filter((fret) => fret === null).length;
  return maxFret * 10 + span * 2 + mutedStrings - (minFret === 0 ? 3 : 0);
}

function mergeAliases(existingAliases = [], nextAliases = []) {
  return [...new Set([...existingAliases, ...nextAliases])];
}

function updateCapo() {
  capoValue.textContent = String(state.capo);
}

function formatVoicing(voicing) {
  return voicing.map((fret) => (fret === null ? "x" : String(fret))).join("");
}

function ensureAudio({ resume = true } = {}) {
  if (audioContext?.state === "closed" || shouldRecreateTouchAudioContext(resume)) {
    resetAudioEngine();
  }

  if (!audioContext) {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) {
      document.documentElement.dataset.audioReady = "missing";
      return false;
    }

    try {
      audioContext = new AudioEngine();
    } catch (_) {
      document.documentElement.dataset.audioReady = "missing";
      return false;
    }

    audioContext.addEventListener?.("statechange", handleAudioStateChange);

    masterGain = audioContext.createGain();
    compressor = audioContext.createDynamicsCompressor();

    masterGain.gain.value = 0.78;
    compressor.threshold.value = -20;
    compressor.knee.value = 18;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.18;

    masterGain.connect(compressor);
    compressor.connect(audioContext.destination);
  }

  if (resume) {
    resumeAudioContext();
  }

  prepareNoiseBuffers();
  prepareAcousticSamples();
  updateAudioReadyState();
  return true;
}

function handleAudioStateChange(event) {
  if (event?.target && event.target !== audioContext) {
    return;
  }

  if (!audioContext) {
    return;
  }

  if (audioContext.state === "closed") {
    resetAudioEngine();
    armAudioOnNextGesture();
    return;
  }

  updateAudioReadyState();

  if (audioContext.state !== "running") {
    armAudioOnNextGesture();
  }
}

function updateAudioReadyState() {
  if (!audioContext) {
    document.documentElement.dataset.audioReady = "missing";
    return;
  }

  if (audioContext.state !== "running") {
    document.documentElement.dataset.audioReady = "locked";
    return;
  }

  document.documentElement.dataset.audioReady = acousticPresetReady ? "ready" : "warming";
}

function shouldRecreateTouchAudioContext(resume) {
  return resume
    && isTouchAudioEnvironment()
    && audioContext
    && audioContext.state !== "running";
}

function resumeAudioContext({ timeoutMs = 0 } = {}) {
  if (!audioContext || audioContext.state === "closed" || typeof audioContext.resume !== "function") {
    return Promise.resolve(audioContext?.state === "running");
  }

  if (audioContext.state === "running") {
    return Promise.resolve(true);
  }

  if (!audioResumePromise) {
    const resumePromise = audioContext.resume();
    const guardedResume = timeoutMs > 0
      ? Promise.race([
          resumePromise,
          wait(timeoutMs).then(() => false),
        ])
      : resumePromise;

    audioResumePromise = guardedResume
      .catch(() => {})
      .then((result) => result === false ? false : audioContext?.state === "running")
      .finally(() => {
        audioResumePromise = null;
        updateAudioReadyState();
      });
  }

  return audioResumePromise;
}

function wait(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

function playAfterAudioResume(playback) {
  resumeAudioContext().then((isRunning) => {
    if (isRunning && audioContext?.state === "running") {
      playback();
      return;
    }

    if (document.visibilityState === "hidden") {
      return;
    }

    resetAudioEngine();
    if (!ensureAudio()) {
      return;
    }

    if (audioContext?.state === "running") {
      playback();
      return;
    }

    resumeAudioContext().then((didResume) => {
      if (didResume && audioContext?.state === "running") {
        playback();
      }
    });
  });
}

function currentChordSnapshot() {
  if (!state.chord || !Array.isArray(state.chord.voicing)) {
    return null;
  }

  return { ...state.chord, voicing: [...state.chord.voicing] };
}

function withChordSnapshot(chord, playback) {
  const previousChord = state.chord;
  state.chord = chord;

  try {
    playback();
  } finally {
    state.chord = previousChord;
  }
}

function resetAudioEngine() {
  audioContext?.removeEventListener?.("statechange", handleAudioStateChange);
  audioContext = null;
  audioResumePromise = null;
  masterGain = null;
  compressor = null;
  acousticPlayer = null;
  acousticPresetStarted = false;
  acousticPresetReady = false;
  acousticStringPanners = [];
  activeTransientSounds = [];
  noiseBufferPools = {};
  noiseBufferPoolIndexes = {};
  document.documentElement.dataset.acousticLibrary = "loading";
  updateAudioReadyState();
}

function preventDefaultIfCancelable(event) {
  if (event.cancelable) {
    event.preventDefault();
  }
}

function preventStrumSurfaceScroll(event) {
  preventDefaultIfCancelable(event);
}

function preventInstrumentTouchDefault(event) {
  preventDefaultIfCancelable(event);
}

function handlePointerDown(event) {
  preventDefaultIfCancelable(event);
  const strum = beginStrum();
  strumSurface.setPointerCapture(event.pointerId);
  state.pointerId = event.pointerId;
  state.pointerStrumId = strum.id;
  state.pointerStrumContext = strum;
  state.pointerHasStrummed = false;
  state.pointerDirection = null;
  state.pointerStringTimes = Array(STRINGS.length).fill(-Infinity);
  state.lastString = stringIndexFromPointer(event);
  state.lastY = pointerStrumAxisPosition(event);
  state.lastTime = performance.now();
}

function handlePointerMove(event) {
  if (state.pointerId !== event.pointerId) {
    return;
  }

  preventDefaultIfCancelable(event);
  const now = performance.now();
  const axisPosition = pointerStrumAxisPosition(event);
  const distance = Math.abs(axisPosition - state.lastY);

  if (!distance) {
    return;
  }

  const elapsed = Math.max(16, now - state.lastTime);
  const crossedStrings = crossedPointerStringHits(state.lastY, axisPosition, state.lastTime, now);
  const isFirstStrum = !state.pointerHasStrummed;
  const direction = axisPosition > state.lastY ? 1 : -1;
  const shouldStartWithTouchedString = isFirstStrum
    && distance >= POINTER_INITIAL_STRUM_DISTANCE
    && state.lastString !== null
    && !crossedStrings.some((hit) => hit.stringIndex === state.lastString);

  if (isFirstStrum && !crossedStrings.length && !shouldStartWithTouchedString) {
    return;
  }

  const pointerHits = shouldStartWithTouchedString
    ? [{
        stringIndex: state.lastString,
        direction,
        crossingTime: state.lastTime,
        velocity: pointerStrumVelocity(distance, elapsed),
      }, ...crossedStrings]
    : crossedStrings;

  if (shouldStartWithTouchedString) {
    state.pointerStringTimes[state.lastString] = state.lastTime;
  }

  if (pointerHits.length && isFirstStrum && state.pointerStrumContext) {
    duckActiveStrum(false, state.pointerStrumContext.sampledNotes, state.pointerStrumContext.transientSounds);
  }

  if (pointerHits.length) {
    playPointerStringHits(pointerHits, state.pointerStrumId ?? nextStrumId);
    state.pointerHasStrummed = true;
  }

  state.pointerDirection = direction;
  state.lastString = stringIndexFromPointer(event);
  state.lastY = axisPosition;
  state.lastTime = now;
}

function handlePointerEnd(event) {
  if (state.pointerId !== event.pointerId) {
    return;
  }

  state.pointerId = null;
  state.pointerStrumId = null;
  const shouldAutoAdvance = state.pointerHasStrummed;

  if (!state.pointerHasStrummed && state.lastString !== null) {
    if (state.pointerStrumContext) {
      duckActiveStrum(false, state.pointerStrumContext.sampledNotes, state.pointerStrumContext.transientSounds);
    }
    playPointerStringHits(
      [{
        stringIndex: state.lastString,
        direction: 0,
        crossingTime: performance.now(),
        velocity: 0.58,
      }],
      state.pointerStrumContext?.id ?? nextStrumId,
    );
  }

  state.pointerStrumContext = null;
  state.pointerHasStrummed = false;
  state.pointerDirection = null;
  state.pointerStringTimes = [];
  state.lastString = null;
  if (strumSurface.hasPointerCapture(event.pointerId)) {
    strumSurface.releasePointerCapture(event.pointerId);
  }

  if (shouldAutoAdvance) {
    autoAdvanceSequenceAfterStrum();
  }
}

function stringIndexFromPointer(event) {
  const { length, offset } = pointerStrumAxisMetrics(event);
  const stringSize = length / STRINGS.length;
  const pointerOffset = clamp(offset, 0, length);
  const rawIndex = Math.floor(pointerOffset / stringSize);
  return clamp(rawIndex, 0, STRINGS.length - 1);
}

function pointerStrumAxisPosition(event) {
  return pointerStrumAxisMetrics(event).offset;
}

function pointerStrumAxisMetrics(event) {
  const rect = strumSurface.getBoundingClientRect();
  const isHorizontalStringLayout = state.performanceMode;
  const length = isHorizontalStringLayout ? rect.height : rect.width;
  const offset = isHorizontalStringLayout ? event.clientY - rect.top : event.clientX - rect.left;
  return { length, offset };
}

function pointerStrumVelocity(distance, elapsed) {
  const speed = distance / elapsed;
  const normalized = clamp(
    (speed - POINTER_STRUM_SLOW_SPEED) / (POINTER_STRUM_FAST_SPEED - POINTER_STRUM_SLOW_SPEED),
    0,
    1,
  );

  return clamp(
    POINTER_STRUM_MIN_VELOCITY + normalized * (POINTER_STRUM_MAX_VELOCITY - POINTER_STRUM_MIN_VELOCITY),
    POINTER_STRUM_MIN_VELOCITY,
    POINTER_STRUM_MAX_VELOCITY,
  );
}

function crossedPointerStringHits(fromOffset, toOffset, fromTime, toTime) {
  const movement = toOffset - fromOffset;

  if (!movement) {
    return [];
  }

  const direction = movement > 0 ? 1 : -1;
  const length = state.performanceMode
    ? strumSurface.getBoundingClientRect().height
    : strumSurface.getBoundingClientRect().width;
  const stringSize = length / STRINGS.length;
  const elapsed = Math.max(16, toTime - fromTime);
  const velocity = pointerStrumVelocity(Math.abs(movement), elapsed);
  const crossedStrings = [];

  STRINGS.forEach((_, stringIndex) => {
    const center = stringSize * (stringIndex + 0.5);
    const wasCrossed = direction > 0
      ? fromOffset < center && toOffset >= center
      : fromOffset > center && toOffset <= center;

    if (!wasCrossed) {
      return;
    }

    const crossingProgress = (center - fromOffset) / movement;
    const crossingTime = fromTime + crossingProgress * (toTime - fromTime);
    const lastStringTime = state.pointerStringTimes[stringIndex] ?? -Infinity;

    if (crossingTime - lastStringTime < POINTER_STRING_RETRIGGER_MS) {
      return;
    }

    state.pointerStringTimes[stringIndex] = crossingTime;
    crossedStrings.push({
      stringIndex,
      direction,
      crossingTime,
      velocity,
    });
  });

  return crossedStrings.sort((first, second) =>
    direction > 0
      ? first.stringIndex - second.stringIndex
      : second.stringIndex - first.stringIndex
  );
}

function playPointerStringHits(hits, strumId = nextStrumId, { waitForAudio = true, chord = currentChordSnapshot() } = {}) {
  if (!hits.length || !ensureAudio() || !chord) {
    return;
  }

  if (waitForAudio && audioContext.state !== "running") {
    playAfterAudioResume(() => playPointerStringHits(hits, strumId, { waitForAudio: false, chord }));
    return;
  }

  withChordSnapshot(chord, () => {
    const now = audioContext.currentTime;
    let delay = 0;
    let previousCrossingTime = hits[0].crossingTime;

    hits.forEach((hit, orderIndex) => {
      if (orderIndex > 0) {
        const naturalGap = Math.max(0, (hit.crossingTime - previousCrossingTime) / 1000);
        delay += Math.max(naturalGap, POINTER_CROSSING_MIN_GAP);
      }

      playString(
        hit.stringIndex,
        humanizedVelocity(hit.velocity, hit.stringIndex, hit.direction),
        now + delay,
        hit.direction,
        strumId,
      );
      previousCrossingTime = hit.crossingTime;
    });
  });
}

function playFullStrum(direction, { waitForAudio = true, chord = currentChordSnapshot() } = {}) {
  if (!ensureAudio() || !chord) {
    return;
  }

  if (waitForAudio && audioContext.state !== "running") {
    playAfterAudioResume(() => playFullStrum(direction, { waitForAudio: false, chord }));
    return;
  }

  withChordSnapshot(chord, () => {
    const now = audioContext.currentTime;
    const isFastStrum = now - lastFullStrumTime < FAST_STRUM_INTERVAL;
    const strumId = ++nextStrumId;
    const previousSampledNotes = getActiveSampledNotes();
    const previousTransientSounds = [...activeTransientSounds];
    lastFullStrumTime = now;

    const hits = buildStrumHits(direction, isFastStrum, now);
    hits.forEach(({ stringIndex, velocity, when }) => {
      playString(stringIndex, velocity, when, direction, strumId);
    });
    duckActiveStrum(isFastStrum, previousSampledNotes, previousTransientSounds);
    autoAdvanceSequenceAfterStrum();
  });
}

function buildStrumHits(direction, isFastStrum, startTime) {
  const order = strumOrder(direction);
  const profile = strumProfile(direction);
  const hits = [];
  let when = startTime;

  order.forEach((stringIndex, orderIndex) => {
    hits.push({
      stringIndex,
      when,
      velocity: humanizedVelocity(profile.baseVelocity, stringIndex, direction),
    });
    when += humanizedStrumGap(orderIndex, order.length, direction, isFastStrum, stringIndex);
  });

  return hits;
}

function strumOrder(direction) {
  const order = direction > 0 ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0];

  if (direction > 0) {
    return order;
  }

  const lowestString = Math.random() < 0.86 ? 2 : 3;
  const lightUpstroke = order.filter((stringIndex) => stringIndex >= lowestString);
  return lightUpstroke.some((stringIndex) => state.chord.voicing[stringIndex] !== null) ? lightUpstroke : order;
}

function humanizedStrumGap(orderIndex, totalStrings, direction, isFastStrum = false, stringIndex = null, velocity = null) {
  if (totalStrings <= 1) {
    return 0;
  }

  const progress = orderIndex / Math.max(1, totalStrings - 1);
  const profile = strumProfile(direction);
  const baseGap = isFastStrum ? profile.fastGap : profile.baseGap;
  const curve = direction > 0 ? 1.18 - progress * 0.28 : 0.7 + progress * 0.2;
  const mutedGapMultiplier = stringIndex !== null && state.chord.voicing[stringIndex] === null ? 0.42 : 1;
  const velocityGapMultiplier = velocity === null ? 1 : 1.22 - clamp(velocity, 0, 1) * 0.5;
  const jitter = isFastStrum ? randomBetween(-0.001, 0.0016) : randomBetween(-0.0024, 0.0028);
  return Math.max(isFastStrum ? 0.0028 : 0.005, (baseGap * curve + jitter) * mutedGapMultiplier * velocityGapMultiplier);
}

function humanizedVelocity(baseVelocity, stringIndex, direction) {
  if (!direction) {
    return clamp(baseVelocity * randomBetween(0.9, 1.08), 0.2, 0.96);
  }

  const stringPosition = stringIndex / (STRINGS.length - 1);
  const directionalAccent = direction > 0 ? 1.22 - stringPosition * 0.34 : 0.7 + stringPosition * 0.28;
  const strokeWeight = direction > 0 ? 1 : 0.82;
  return clamp(baseVelocity * directionalAccent * strokeWeight * randomBetween(0.88, 1.12), 0.16, 0.98);
}

function strumProfile(direction) {
  if (direction < 0) {
    return STRUM_PROFILES.up;
  }

  if (direction > 0) {
    return STRUM_PROFILES.down;
  }

  return STRUM_PROFILES.pick;
}

function beginStrum() {
  const audioReady = ensureAudio();
  return {
    id: ++nextStrumId,
    sampledNotes: audioReady ? getActiveSampledNotes() : [],
    transientSounds: audioReady ? [...activeTransientSounds] : [],
  };
}

function duckActiveStrum(isFastStrum = false, sampledNotes = getActiveSampledNotes(), transientSounds = [...activeTransientSounds]) {
  if (!audioContext) {
    return;
  }

  duckActiveSampledNotes(isFastStrum, sampledNotes);

  const now = audioContext.currentTime;
  const transientSet = new Set(transientSounds);
  transientSounds.forEach(({ source, gain }) => {
    try {
      gain.gain.cancelScheduledValues(0);
      gain.gain.setTargetAtTime(0.0001, now, 0.018);
      source.stop(now + 0.055);
    } catch (_) {
      // The sound may have already ended.
    }
  });
  activeTransientSounds = activeTransientSounds.filter((sound) => !transientSet.has(sound));

}

function getActiveSampledNotes() {
  if (!acousticPlayer?.envelopes?.length) {
    return [];
  }

  const now = audioContext.currentTime;
  return acousticPlayer.envelopes.filter((envelope) => envelope?.gain && envelope.when + envelope.duration > now);
}

function duckActiveSampledNotes(isFastStrum, sampledNotes) {
  if (!sampledNotes.length) {
    return;
  }

  const now = audioContext.currentTime;
  const duckTime = isFastStrum ? FAST_STRUM_DUCK_TIME : STRUM_DUCK_TIME;
  const releaseAfter = isFastStrum ? FAST_STRUM_RELEASE_AFTER : STRUM_RELEASE_AFTER;
  sampledNotes.forEach((envelope) => {
    if (!envelope?.gain || envelope.when + envelope.duration <= now) {
      return;
    }

    try {
      if (envelope.gain.cancelAndHoldAtTime) {
        envelope.gain.cancelAndHoldAtTime(now);
      } else {
        envelope.gain.cancelScheduledValues(now);
      }
      envelope.gain.setTargetAtTime(STRUM_DUCK_LEVEL, now, duckTime);

      if (envelope.audioBufferSourceNode) {
        envelope.audioBufferSourceNode.stop(now + releaseAfter);
      }
      envelope.duration = Math.min(envelope.duration, Math.max(0, now - envelope.when) + releaseAfter);
    } catch (_) {
      // Already-finished audio nodes can reject a second stop request.
    }
  });
}

function playString(stringIndex, velocity, when, direction = 0, strumId = nextStrumId) {
  const fret = state.chord.voicing[stringIndex];
  const isMuted = fret === null;

  if (isMuted) {
    playMutedString(stringIndex, velocity, when, direction, strumId);
    showStringFeedback(stringIndex, "is-muted");
    return;
  }

  playPickNoise(stringIndex, velocity, when, direction, strumId);

  if (playSampledAcousticString(stringIndex, fret, velocity, when, direction, strumId)) {
    showStringFeedback(stringIndex, "is-ringing");
    return;
  }

  playFallbackAcousticString(stringIndex, fret, velocity, when, direction, strumId);
  showStringFeedback(stringIndex, "is-ringing");
}

function prepareAcousticSamples() {
  if (!audioContext || !window.WebAudioFontPlayer || !window._tone_0250_LK_AcousticSteel_SF2_file) {
    document.documentElement.dataset.acousticLibrary = "missing";
    return false;
  }

  if (acousticPresetReady && acousticPlayer && acousticStringPanners.length) {
    return true;
  }

  if (!acousticPlayer) {
    acousticPlayer = new WebAudioFontPlayer();
    acousticPreset = window._tone_0250_LK_AcousticSteel_SF2_file;
  }

  if (!acousticStringPanners.length) {
    acousticStringPanners = STRINGS.map((_, index) => {
      const pan = audioContext.createStereoPanner();
      pan.pan.value = (index - 2.5) / 7;
      pan.connect(masterGain);
      return pan;
    });
  }

  if (!acousticPresetStarted) {
    acousticPlayer.adjustPreset(audioContext, acousticPreset);
    acousticPresetStarted = true;
  }

  acousticPresetReady = acousticPreset.zones.every((zone) => zone.buffer);
  document.documentElement.dataset.acousticLibrary = acousticPresetReady ? "ready" : "loading";
  updateAudioReadyState();
  return acousticPresetReady;
}

function playSampledAcousticString(stringIndex, fret, velocity, when, direction, strumId) {
  if (!prepareAcousticSamples()) {
    document.documentElement.dataset.acousticEngine = "fallback";
    return false;
  }

  const profile = strumProfile(direction);
  const midiPitch = STRINGS[stringIndex].midi + fret + state.capo;
  const duration = state.palmMute ? profile.palmSustain : profile.sustain;
  const volume = (state.palmMute ? profile.palmVolume : profile.volume) * velocity;
  const envelope = acousticPlayer.queueWaveTable(
    audioContext,
    acousticStringPanners[stringIndex],
    acousticPreset,
    when,
    midiPitch,
    duration,
    volume,
  );

  if (!envelope) {
    document.documentElement.dataset.acousticEngine = "fallback";
    return false;
  }

  envelope.strumId = strumId;
  document.documentElement.dataset.acousticEngine = "sampled";
  return true;
}

function playFallbackAcousticString(stringIndex, fret, velocity, when, direction, strumId) {
  if (!audioContext || !masterGain) {
    return;
  }

  const profile = strumProfile(direction);
  const midiPitch = STRINGS[stringIndex].midi + fret + state.capo;
  const frequency = midiToFrequency(midiPitch);
  const duration = state.palmMute
    ? Math.max(0.12, profile.palmSustain * 0.78)
    : Math.min(0.84, profile.sustain * 0.34);
  const peak = Math.max(
    0.0001,
    velocity * (state.palmMute ? profile.palmVolume * 0.46 : profile.volume * 0.42),
  );
  const oscillator = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  const pan = audioContext.createStereoPanner();
  const releaseAt = when + duration;

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency * randomBetween(0.997, 1.003), when);

  filter.type = "lowpass";
  filter.Q.value = 0.85;
  filter.frequency.setValueAtTime(Math.min(7200, 1300 + frequency * 4.2), when);
  filter.frequency.exponentialRampToValueAtTime(Math.max(360, frequency * 1.55), releaseAt);

  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(peak, when + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, releaseAt);

  pan.pan.value = (stringIndex - 2.5) / 8;

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(pan);
  pan.connect(masterGain);

  oscillator.start(when);
  oscillator.stop(releaseAt + 0.02);
  trackTransientSound(oscillator, gain, strumId);
  document.documentElement.dataset.acousticEngine = "fallback";
}

function playMutedString(stringIndex, velocity, when, direction, strumId) {
  const profile = strumProfile(direction);
  const noise = createNoiseSource("muted");
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const pan = audioContext.createStereoPanner();

  filter.type = "bandpass";
  filter.frequency.value = direction > 0 ? 330 + stringIndex * 105 : 620 + stringIndex * 150;
  filter.Q.value = direction > 0 ? 3.2 : 2.1;
  pan.pan.value = (stringIndex - 2.5) / 8;

  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(profile.palmVolume * (direction > 0 ? 0.5 : 0.32) * velocity, when + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + MUTED_NOISE_DURATION);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(pan);
  pan.connect(masterGain);

  noise.start(when);
  noise.stop(when + MUTED_NOISE_DURATION + 0.02);
  trackTransientSound(noise, gain, strumId);
}

function playPickNoise(stringIndex, velocity, when, direction, strumId) {
  const profile = strumProfile(direction);
  const noise = createNoiseSource("pick");
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const pan = audioContext.createStereoPanner();
  const peak = Math.max(0.0001, profile.pickVolume * velocity);

  filter.type = "bandpass";
  filter.frequency.value = profile.pickFrequency + stringIndex * (direction < 0 ? 250 : 150);
  filter.Q.value = direction < 0 ? 1.25 : 0.8;
  pan.pan.value = (stringIndex - 2.5) / 8;

  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(peak, when + 0.0025);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + PICK_NOISE_DURATION);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(pan);
  pan.connect(masterGain);

  noise.start(when);
  noise.stop(when + PICK_NOISE_DURATION + 0.01);
  trackTransientSound(noise, gain, strumId);
}

function trackTransientSound(source, gain, strumId) {
  activeTransientSounds.push({ source, gain, strumId });
  source.onended = () => {
    activeTransientSounds = activeTransientSounds.filter((sound) => sound.source !== source);
  };
}

function prepareNoiseBuffers() {
  if (!audioContext || noiseBufferPools.pick?.length) {
    return;
  }

  noiseBufferPools = {
    muted: createNoiseBufferPool(MUTED_NOISE_DURATION),
    pick: createNoiseBufferPool(PICK_NOISE_DURATION),
  };
  noiseBufferPoolIndexes = {
    muted: 0,
    pick: 0,
  };
}

function createNoiseBufferPool(duration) {
  return Array.from({ length: NOISE_BUFFER_POOL_SIZE }, () => createNoiseBuffer(duration));
}

function createNoiseSource(type) {
  const pool = noiseBufferPools[type];
  if (!pool?.length) {
    prepareNoiseBuffers();
  }

  const buffers = noiseBufferPools[type] ?? [createNoiseBuffer(type === "muted" ? MUTED_NOISE_DURATION : PICK_NOISE_DURATION)];
  const index = noiseBufferPoolIndexes[type] ?? 0;
  const source = audioContext.createBufferSource();
  source.buffer = buffers[index % buffers.length];
  noiseBufferPoolIndexes[type] = index + 1;
  return source;
}

function createNoiseBuffer(duration) {
  const sampleRate = audioContext.sampleRate;
  const frameCount = Math.ceil(sampleRate * duration);
  const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / frameCount);
  }

  return buffer;
}

function midiToFrequency(midi) {
  return 440 * (2 ** ((midi - 69) / 12));
}

function showStringFeedback(stringIndex, className) {
  const row = strumSurface.children[stringIndex];
  window.cancelAnimationFrame(stringFeedbackFrames[stringIndex]);
  window.clearTimeout(stringFeedbackTimers[stringIndex]);
  row.classList.remove("is-ringing", "is-muted");
  stringFeedbackFrames[stringIndex] = window.requestAnimationFrame(() => {
    row.classList.add(className);
    stringFeedbackFrames[stringIndex] = null;
    stringFeedbackTimers[stringIndex] = window.setTimeout(() => {
      row.classList.remove(className);
      stringFeedbackTimers[stringIndex] = null;
    }, 230);
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    clearOldAppCaches()
      .catch(() => {})
      .finally(() => {
        navigator.serviceWorker.register(SERVICE_WORKER_SCRIPT).catch(() => {
          // Local file previews cannot register service workers.
        });
      });
  });
}

function clearOldAppCaches() {
  if (!("caches" in window)) {
    return Promise.resolve();
  }

  return window.caches.keys().then((keys) =>
    Promise.all(
      keys
        .filter((key) => key.startsWith("mini-guitar-") && key !== SERVICE_WORKER_CACHE_NAME)
        .map((key) => window.caches.delete(key)),
    ),
  );
}

init();
