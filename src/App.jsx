import { useEffect, useRef, useState } from "react";

const NOTE_ORDER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_TO_SHARP = {
  Bb: "A#",
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#"
};
const SONG_STORAGE_KEY = "raag-studio-song-breakdowns";

const pianoNotes = [
  { id: "C4", label: "C", fullLabel: "C4", freq: 261.63, key: "A", kind: "white", slot: 0 },
  { id: "C#4", label: "C#", fullLabel: "C#4", freq: 277.18, key: "W", kind: "black", offset: 0.72 },
  { id: "D4", label: "D", fullLabel: "D4", freq: 293.66, key: "S", kind: "white", slot: 1 },
  { id: "D#4", label: "D#", fullLabel: "D#4", freq: 311.13, key: "E", kind: "black", offset: 1.72 },
  { id: "E4", label: "E", fullLabel: "E4", freq: 329.63, key: "D", kind: "white", slot: 2 },
  { id: "F4", label: "F", fullLabel: "F4", freq: 349.23, key: "F", kind: "white", slot: 3 },
  { id: "F#4", label: "F#", fullLabel: "F#4", freq: 369.99, key: "T", kind: "black", offset: 3.72 },
  { id: "G4", label: "G", fullLabel: "G4", freq: 392.0, key: "G", kind: "white", slot: 4 },
  { id: "G#4", label: "G#", fullLabel: "G#4", freq: 415.3, key: "Y", kind: "black", offset: 4.72 },
  { id: "A4", label: "A", fullLabel: "A4", freq: 440.0, key: "H", kind: "white", slot: 5 },
  { id: "A#4", label: "A#", fullLabel: "A#4", freq: 466.16, key: "U", kind: "black", offset: 5.72 },
  { id: "B4", label: "B", fullLabel: "B4", freq: 493.88, key: "J", kind: "white", slot: 6 }
];

const guitarNotes = [
  { id: "E2", label: "Low E", fullLabel: "E2", freq: 82.41, key: "1", stringName: "6th" },
  { id: "A2", label: "A", fullLabel: "A2", freq: 110.0, key: "2", stringName: "5th" },
  { id: "D3", label: "D", fullLabel: "D3", freq: 146.83, key: "3", stringName: "4th" },
  { id: "G3", label: "G", fullLabel: "G3", freq: 196.0, key: "4", stringName: "3rd" },
  { id: "B3", label: "B", fullLabel: "B3", freq: 246.94, key: "5", stringName: "2nd" },
  { id: "E4", label: "High E", fullLabel: "E4", freq: 329.63, key: "6", stringName: "1st" }
];

const drumNotes = [
  { id: "crash", label: "Crash", key: "Q", padClass: "crash" },
  { id: "ride", label: "Ride", key: "W", padClass: "ride" },
  { id: "hat", label: "Hi-Hat", key: "E", padClass: "hat" },
  { id: "snare", label: "Snare", key: "A", padClass: "snare" },
  { id: "kick", label: "Kick", key: "S", padClass: "kick" },
  { id: "tom", label: "Rack Tom", key: "D", padClass: "tom" },
  { id: "floor", label: "Floor Tom", key: "F", padClass: "floor" }
];

const fluteNotes = [
  { id: "C5", label: "C5", fullLabel: "C5", freq: 523.25, key: "A", fingering: [true, true, true, true, true, true] },
  { id: "D5", label: "D5", fullLabel: "D5", freq: 587.33, key: "S", fingering: [true, true, true, true, true, false] },
  { id: "E5", label: "E5", fullLabel: "E5", freq: 659.25, key: "D", fingering: [true, true, true, true, false, false] },
  { id: "F5", label: "F5", fullLabel: "F5", freq: 698.46, key: "F", fingering: [true, true, true, false, false, false] },
  { id: "G5", label: "G5", fullLabel: "G5", freq: 783.99, key: "G", fingering: [true, true, false, false, false, false] },
  { id: "A5", label: "A5", fullLabel: "A5", freq: 880.0, key: "H", fingering: [true, false, false, false, false, false] },
  { id: "B5", label: "B5", fullLabel: "B5", freq: 987.77, key: "J", fingering: [false, false, false, false, false, false] }
];

const instruments = [
  {
    id: "piano",
    name: "Piano",
    tagline: "A full octave with chords and black keys",
    description:
      "Play a proper keyboard layout with white and black keys, then trigger full major and minor chords.",
    color: "#f97316",
    notes: pianoNotes,
    lessons: ["Triads", "Octave shapes", "Chord changes"],
    chords: [
      { id: "c-major", label: "C Major", notes: ["C4", "E4", "G4"] },
      { id: "f-major", label: "F Major", notes: ["F4", "A4", "C4"] },
      { id: "g-major", label: "G Major", notes: ["G4", "B4", "D4"] },
      { id: "a-minor", label: "A Minor", notes: ["A4", "C4", "E4"] }
    ]
  },
  {
    id: "guitar",
    name: "Guitar",
    tagline: "Six strings and strummable chord shapes",
    description:
      "Use a fretboard-style view, pluck individual strings, or fire strummed open-chord voicings.",
    color: "#22c55e",
    notes: guitarNotes,
    lessons: ["Open strings", "Strum timing", "Chord voicings"],
    chords: [
      { id: "em", label: "E Minor", notes: ["E2", "A2", "D3", "G3", "B3", "E4"] },
      { id: "g", label: "G Major", notes: ["E2", "A2", "D3", "G3", "B3", "E4"] },
      { id: "c", label: "C Major", notes: ["A2", "D3", "G3", "B3", "E4"] },
      { id: "d", label: "D Major", notes: ["D3", "G3", "B3", "E4"] }
    ]
  },
  {
    id: "drums",
    name: "Drums",
    tagline: "A fuller kit with cymbals, toms, and kick",
    description:
      "Lay into a visual kit with cymbals up top, snare and toms in the middle, and a centered kick below.",
    color: "#38bdf8",
    notes: drumNotes,
    lessons: ["Kick-snare pocket", "Hi-hat timing", "Fill placement"]
  },
  {
    id: "flute",
    name: "Flute",
    tagline: "Playable notes with visible fingering changes",
    description:
      "See the finger holes change as you move through the scale and practice breathy lead lines.",
    color: "#a855f7",
    notes: fluteNotes,
    lessons: ["Fingering memory", "Scale runs", "Smooth phrasing"]
  }
];

const learningPath = [
  {
    title: "Start With Rhythm",
    text: "Use drums to set the pulse first, then add melody on top. Strong timing makes every other instrument feel better."
  },
  {
    title: "Practice Real Shapes",
    text: "Use piano chords and guitar chord buttons to hear harmony changes instead of only single notes."
  },
  {
    title: "Build A Full Phrase",
    text: "Finish with flute to create a lead line that rides over the rhythm and harmony you already built."
  }
];

const starterPattern = {
  piano: {
    C4: [0, 4],
    E4: [2, 6],
    G4: [1, 5],
    B4: [7]
  },
  guitar: {
    E2: [0, 4],
    A2: [2],
    D3: [1, 5],
    G3: [3, 7],
    B3: [6],
    E4: [7]
  },
  drums: {
    kick: [0, 4],
    snare: [2, 6],
    hat: [1, 3, 5, 7],
    crash: [0],
    tom: [7]
  },
  flute: {
    C5: [0],
    D5: [2],
    E5: [4],
    G5: [6],
    B5: [7]
  }
};

const groovePatterns = [
  ["Kick", "Hi-Hat", "Snare", "Hi-Hat"],
  ["Kick", "Ride", "Snare", "Kick"],
  ["Kick", "Hi-Hat", "Tom", "Snare"],
  ["Kick", "Crash", "Snare", "Hi-Hat"]
];
const DRUM_LABEL_TO_ID = {
  Crash: "crash",
  Ride: "ride",
  "Hi-Hat": "hat",
  Snare: "snare",
  Kick: "kick",
  "Rack Tom": "tom",
  Tom: "tom",
  "Floor Tom": "floor"
};

const stepCount = 8;
const MIN_ANALYSIS_MIDI = 48;
const MAX_ANALYSIS_MIDI = 83;

function createEmptyPattern() {
  const pattern = {};

  instruments.forEach((instrument) => {
    pattern[instrument.id] = {};
    instrument.notes.forEach((note) => {
      pattern[instrument.id][note.id] = Array(stepCount).fill(false);
    });
  });

  return pattern;
}

function loadStarterPattern() {
  const pattern = createEmptyPattern();

  Object.entries(starterPattern).forEach(([instrumentId, notes]) => {
    Object.entries(notes).forEach(([noteId, steps]) => {
      steps.forEach((stepIndex) => {
        if (pattern[instrumentId]?.[noteId]) {
          pattern[instrumentId][noteId][stepIndex] = true;
        }
      });
    });
  });

  return pattern;
}

function normalizePitchClass(token) {
  if (!token) {
    return null;
  }

  const match = token.trim().match(/^([A-Ga-g])([#b]?)$/);
  if (!match) {
    return null;
  }

  const note = `${match[1].toUpperCase()}${match[2] || ""}`;
  return FLAT_TO_SHARP[note] ?? note;
}

function buildVoicedNotes(rootIndex, intervals, baseOctave) {
  return intervals.map((interval) => {
    const absoluteSemitone = rootIndex + interval;
    const noteName = NOTE_ORDER[absoluteSemitone % 12];
    const octave = baseOctave + Math.floor(absoluteSemitone / 12);
    return `${noteName}${octave}`;
  });
}

function parseChordToken(token) {
  const cleanToken = token.trim();
  if (!cleanToken) {
    return null;
  }

  const [baseToken, bassToken] = cleanToken.split("/");
  const match = baseToken.match(/^([A-Ga-g])([#b]?)(.*)$/);

  if (!match) {
    return null;
  }

  const root = normalizePitchClass(`${match[1]}${match[2] || ""}`);
  const descriptor = (match[3] || "").toLowerCase();
  const rootIndex = NOTE_ORDER.indexOf(root);

  if (!root || rootIndex === -1) {
    return null;
  }

  let intervals = [0, 4, 7];
  let qualityLabel = "Major";
  let qualityKey = "major";

  if (descriptor.startsWith("maj7")) {
    intervals = [0, 4, 7, 11];
    qualityLabel = "Major 7";
    qualityKey = "maj7";
  } else if (descriptor.startsWith("m7")) {
    intervals = [0, 3, 7, 10];
    qualityLabel = "Minor 7";
    qualityKey = "m7";
  } else if (descriptor === "m" || descriptor.startsWith("min")) {
    intervals = [0, 3, 7];
    qualityLabel = "Minor";
    qualityKey = "minor";
  } else if (descriptor.startsWith("7")) {
    intervals = [0, 4, 7, 10];
    qualityLabel = "Dominant 7";
    qualityKey = "7";
  } else if (descriptor.startsWith("sus2")) {
    intervals = [0, 2, 7];
    qualityLabel = "Sus 2";
    qualityKey = "sus2";
  } else if (descriptor.startsWith("sus4") || descriptor === "sus") {
    intervals = [0, 5, 7];
    qualityLabel = "Sus 4";
    qualityKey = "sus4";
  } else if (descriptor.startsWith("dim")) {
    intervals = [0, 3, 6];
    qualityLabel = "Diminished";
    qualityKey = "dim";
  } else if (descriptor.startsWith("aug")) {
    intervals = [0, 4, 8];
    qualityLabel = "Augmented";
    qualityKey = "aug";
  }

  const pitchClasses = intervals.map((interval) => NOTE_ORDER[(rootIndex + interval) % 12]);

  return {
    symbol: cleanToken,
    root,
    bass: normalizePitchClass(bassToken),
    intervals,
    pitchClasses,
    qualityLabel,
    qualityKey,
    pianoNotes: buildVoicedNotes(rootIndex, intervals, 4),
    guitarNotes: buildVoicedNotes(rootIndex, intervals, 3),
    fluteNotes: buildVoicedNotes(rootIndex, intervals, 5)
  };
}

function tokenizeProgression(input) {
  return input
    .split(/[\s,|]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function buildDrumPattern(index, qualityKey) {
  const basePattern = [...groovePatterns[index % groovePatterns.length]];

  if (qualityKey === "minor" || qualityKey === "m7") {
    return [...basePattern, "Floor Tom"];
  }

  if (qualityKey === "7" || qualityKey === "maj7") {
    return ["Crash", ...basePattern];
  }

  return basePattern;
}

function buildSongBreakdown(title, progressionText) {
  const tokens = tokenizeProgression(progressionText);
  const parsedChords = [];
  const invalidTokens = [];

  tokens.forEach((token, index) => {
    const chord = parseChordToken(token);

    if (!chord) {
      invalidTokens.push(token);
      return;
    }

    parsedChords.push({
      ...chord,
      id: `${chord.symbol}-${index}`,
      order: index + 1,
      drumPattern: buildDrumPattern(index, chord.qualityKey)
    });
  });

  if (parsedChords.length === 0) {
    return null;
  }

  const uniqueNotes = [...new Set(parsedChords.flatMap((chord) => chord.pitchClasses))];
  const now = new Date();

  return {
    id: `song-${now.getTime()}`,
    title: title.trim() || `Untitled Song ${now.toLocaleTimeString()}`,
    createdAt: now.toISOString(),
    progressionText: progressionText.trim(),
    sourceType: "text",
    sourceName: "Typed progression",
    chordCount: parsedChords.length,
    uniqueNotes,
    invalidTokens,
    chords: parsedChords
  };
}

function getMonoChannelData(audioBuffer) {
  if (audioBuffer.numberOfChannels === 1) {
    return audioBuffer.getChannelData(0);
  }

  const left = audioBuffer.getChannelData(0);
  const right = audioBuffer.getChannelData(1);
  const mono = new Float32Array(audioBuffer.length);

  for (let index = 0; index < audioBuffer.length; index += 1) {
    mono[index] = (left[index] + right[index]) / 2;
  }

  return mono;
}

function estimatePitchClassEnergy(samples, sampleRate) {
  const energyMap = Object.fromEntries(NOTE_ORDER.map((note) => [note, 0]));
  let peakAmplitude = 0;

  for (let index = 0; index < samples.length; index += 1) {
    peakAmplitude = Math.max(peakAmplitude, Math.abs(samples[index]));
  }

  if (peakAmplitude < 0.01) {
    return energyMap;
  }

  const stride = Math.max(1, Math.floor(samples.length / 8192));

  for (let midi = MIN_ANALYSIS_MIDI; midi <= MAX_ANALYSIS_MIDI; midi += 1) {
    const frequency = 440 * 2 ** ((midi - 69) / 12);
    let real = 0;
    let imaginary = 0;

    for (let index = 0; index < samples.length; index += stride) {
      const angle = (2 * Math.PI * frequency * index) / sampleRate;
      const sample = samples[index];
      real += sample * Math.cos(angle);
      imaginary -= sample * Math.sin(angle);
    }

    const magnitude = Math.sqrt(real * real + imaginary * imaginary);
    const pitchClass = NOTE_ORDER[midi % 12];
    energyMap[pitchClass] += magnitude;
  }

  return energyMap;
}

function inferChordTokenFromEnergy(energyMap) {
  const ranked = Object.entries(energyMap)
    .sort((first, second) => second[1] - first[1])
    .slice(0, 6);

  if (ranked.length === 0 || ranked[0][1] <= 0) {
    return null;
  }

  const root = ranked[0][0];
  const rootIndex = NOTE_ORDER.indexOf(root);
  const dominantEnergy = ranked[0][1];
  const activePitchClasses = ranked
    .filter(([, energy]) => energy >= dominantEnergy * 0.58)
    .map(([pitchClass]) => pitchClass);

  const intervals = new Set(
    activePitchClasses.map((pitchClass) => {
      const index = NOTE_ORDER.indexOf(pitchClass);
      return (index - rootIndex + 12) % 12;
    })
  );

  if (intervals.has(3) && intervals.has(6)) {
    return `${root}dim`;
  }

  if (intervals.has(4) && intervals.has(8)) {
    return `${root}aug`;
  }

  if (intervals.has(3) && intervals.has(7) && intervals.has(10)) {
    return `${root}m7`;
  }

  if (intervals.has(4) && intervals.has(7) && intervals.has(11)) {
    return `${root}maj7`;
  }

  if (intervals.has(4) && intervals.has(7) && intervals.has(10)) {
    return `${root}7`;
  }

  if (intervals.has(3) && intervals.has(7)) {
    return `${root}m`;
  }

  if (intervals.has(5) && intervals.has(7)) {
    return `${root}sus4`;
  }

  if (intervals.has(2) && intervals.has(7)) {
    return `${root}sus2`;
  }

  return root;
}

function compactChordSequence(chords) {
  return chords.reduce((accumulator, chord) => {
    const previous = accumulator[accumulator.length - 1];

    if (previous?.symbol === chord.symbol) {
      previous.occurrences += 1;
      previous.segmentLabels.push(chord.segmentLabel);
      return accumulator;
    }

    accumulator.push({
      ...chord,
      occurrences: 1,
      segmentLabels: [chord.segmentLabel]
    });
    return accumulator;
  }, []);
}

async function buildSongBreakdownFromAudio(file, title, audioContext) {
  const arrayBuffer = await file.arrayBuffer();
  const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
  const monoChannel = getMonoChannelData(decodedBuffer);
  const duration = decodedBuffer.duration;
  const segmentCount = Math.min(8, Math.max(4, Math.round(duration / 2.5)));
  const segmentSize = Math.floor(monoChannel.length / segmentCount);
  const extractedChords = [];

  for (let index = 0; index < segmentCount; index += 1) {
    const segmentStart = index * segmentSize;
    const segmentEnd = index === segmentCount - 1 ? monoChannel.length : (index + 1) * segmentSize;
    const segment = monoChannel.subarray(segmentStart, segmentEnd);
    const energyMap = estimatePitchClassEnergy(segment, decodedBuffer.sampleRate);
    const chordToken = inferChordTokenFromEnergy(energyMap);
    const chord = chordToken ? parseChordToken(chordToken) : null;

    if (!chord) {
      continue;
    }

    const segmentStartSeconds = ((segmentStart / decodedBuffer.sampleRate) || 0).toFixed(1);
    const segmentEndSeconds = ((segmentEnd / decodedBuffer.sampleRate) || 0).toFixed(1);

    extractedChords.push({
      ...chord,
      id: `${chord.symbol}-${index}`,
      order: index + 1,
      drumPattern: buildDrumPattern(index, chord.qualityKey),
      segmentLabel: `${segmentStartSeconds}s-${segmentEndSeconds}s`
    });
  }

  const compacted = compactChordSequence(extractedChords);

  if (compacted.length === 0) {
    return null;
  }

  const chords = compacted.map((chord, index) => ({
    ...chord,
    id: `${chord.symbol}-${index}`,
    order: index + 1
  }));
  const uniqueNotes = [...new Set(chords.flatMap((chord) => chord.pitchClasses))];
  const now = new Date();

  return {
    id: `song-${now.getTime()}`,
    title: title.trim() || file.name.replace(/\.[^/.]+$/, ""),
    createdAt: now.toISOString(),
    progressionText: chords.map((chord) => chord.symbol).join(" "),
    sourceType: "audio",
    sourceName: file.name,
    durationSeconds: Number(duration.toFixed(1)),
    analysisMode: "Browser audio estimate",
    chordCount: chords.length,
    uniqueNotes,
    invalidTokens: [],
    chords
  };
}

function getInitialSavedBreakdowns() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SONG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getPlayableCaption(instrumentId) {
  if (instrumentId === "piano") {
    return "Play a full octave using A W S E D F T G Y H U J, or tap the chord buttons to hear proper harmony.";
  }

  if (instrumentId === "guitar") {
    return "Use keys 1 through 6 to pluck the strings, or hit a chord card for a quick strum.";
  }

  if (instrumentId === "drums") {
    return "The drum layout behaves more like a real kit, with cymbals on top and the kick centered below.";
  }

  return "Use A through J for a flute scale and watch the fingering pattern change on the body of the instrument.";
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function noteIdToFrequency(noteId) {
  const match = noteId.match(/^([A-G])(#?)(\d)$/);

  if (!match) {
    return null;
  }

  const pitchClass = `${match[1]}${match[2] || ""}`;
  const octave = Number(match[3]);
  const pitchIndex = NOTE_ORDER.indexOf(pitchClass);

  if (pitchIndex === -1) {
    return null;
  }

  const midi = (octave + 1) * 12 + pitchIndex;
  return 440 * 2 ** ((midi - 69) / 12);
}

function createVirtualNote(noteId) {
  const frequency = noteIdToFrequency(noteId);

  if (!frequency) {
    return null;
  }

  return {
    id: noteId,
    label: noteId,
    fullLabel: noteId,
    freq: frequency
  };
}

function getPlaybackModeLabel(mode) {
  if (mode === "all") {
    return "All Instruments";
  }

  const instrument = instruments.find((item) => item.id === mode);
  return instrument?.name ?? "Playback";
}

function App() {
  const initialSavedBreakdowns = getInitialSavedBreakdowns();

  const [activeView, setActiveView] = useState("studio");
  const [activeInstrument, setActiveInstrument] = useState("piano");
  const [tempo, setTempo] = useState(108);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [pattern, setPattern] = useState(loadStarterPattern);
  const [status, setStatus] = useState("Starter groove loaded. Tap Play to hear it.");
  const [highlightState, setHighlightState] = useState({
    instrumentId: "piano",
    noteIds: []
  });
  const [selectedStudioNoteId, setSelectedStudioNoteId] = useState("C4");
  const [songTitle, setSongTitle] = useState("");
  const [songInput, setSongInput] = useState("");
  const [songFile, setSongFile] = useState(null);
  const [isAnalyzingSong, setIsAnalyzingSong] = useState(false);
  const [songMessage, setSongMessage] = useState(
    "Add a title and either type chords like C G Am F or upload an audio file."
  );
  const [activeBreakdownPlayback, setActiveBreakdownPlayback] = useState(null);
  const [savedBreakdowns, setSavedBreakdowns] = useState(initialSavedBreakdowns);
  const [selectedBreakdownId, setSelectedBreakdownId] = useState(
    initialSavedBreakdowns[0]?.id ?? null
  );

  const audioContextRef = useRef(null);
  const audioFileInputRef = useRef(null);
  const stepRef = useRef(0);
  const patternRef = useRef(pattern);
  const pressedKeysRef = useRef(new Set());
  const highlightTimeoutRef = useRef(null);
  const breakdownTimeoutsRef = useRef([]);

  const focusedInstrument = instruments.find((instrument) => instrument.id === activeInstrument);
  const selectedStudioNote =
    focusedInstrument.notes.find((note) => note.id === selectedStudioNoteId) ??
    focusedInstrument.notes[0];
  const selectedBreakdown =
    savedBreakdowns.find((breakdown) => breakdown.id === selectedBreakdownId) ??
    savedBreakdowns[0] ??
    null;

  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  useEffect(() => {
    setSelectedStudioNoteId(focusedInstrument.notes[0].id);
  }, [focusedInstrument]);

  useEffect(() => {
    if (!selectedBreakdownId && savedBreakdowns.length > 0) {
      setSelectedBreakdownId(savedBreakdowns[0].id);
    }
  }, [savedBreakdowns, selectedBreakdownId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(SONG_STORAGE_KEY, JSON.stringify(savedBreakdowns));
  }, [savedBreakdowns]);

  useEffect(() => {
    if (!isPlaying) {
      setCurrentStep(0);
      stepRef.current = 0;
      return undefined;
    }

    const intervalMs = (60 / tempo) * 1000;

    const intervalId = window.setInterval(() => {
      const stepToPlay = stepRef.current;
      playStep(stepToPlay, patternRef.current, ensureAudioContext());
      setCurrentStep(stepToPlay);
      stepRef.current = (stepToPlay + 1) % stepCount;
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPlaying, tempo]);

  useEffect(() => {
    const keyToNote = new Map(
      focusedInstrument.notes.map((note) => [note.key.toLowerCase(), note])
    );

    function handleKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) {
        return;
      }

      const targetTag = event.target?.tagName;
      if (
        targetTag === "INPUT" ||
        targetTag === "TEXTAREA" ||
        targetTag === "SELECT" ||
        event.target?.isContentEditable
      ) {
        return;
      }

      const pressedKey = event.key.toLowerCase();
      const note = keyToNote.get(pressedKey);

      if (!note || pressedKeysRef.current.has(pressedKey)) {
        return;
      }

      event.preventDefault();
      pressedKeysRef.current.add(pressedKey);
      previewNote(activeInstrument, note);
    }

    function handleKeyUp(event) {
      pressedKeysRef.current.delete(event.key.toLowerCase());
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      pressedKeysRef.current.clear();
    };
  }, [activeInstrument, focusedInstrument]);

  useEffect(() => {
    return () => {
      window.clearTimeout(highlightTimeoutRef.current);
      breakdownTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  function ensureAudioContext() {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }

  function playEnvelope(ctx, frequency, options, startOffset = 0) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();
    const now = ctx.currentTime + startOffset;

    oscillator.type = options.wave;
    oscillator.frequency.setValueAtTime(frequency, now);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(options.attackGain, now + options.attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + options.duration);
    filterNode.type = "lowpass";
    filterNode.frequency.setValueAtTime(options.filter, now);

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + options.duration);
  }

  function playNoiseHit(ctx, length, tone, volume, startOffset = 0) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    const source = ctx.createBufferSource();
    const filterNode = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();
    const now = ctx.currentTime + startOffset;

    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
    }

    source.buffer = buffer;
    filterNode.type = "bandpass";
    filterNode.frequency.setValueAtTime(tone, now);
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + length);

    source.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(now);
    source.stop(now + length);
  }

  function playInstrumentSound(ctx, instrumentId, note, startOffset = 0) {
    if (instrumentId === "drums") {
      if (note.id === "kick") {
        playEnvelope(
          ctx,
          82,
          { wave: "sine", attack: 0.001, attackGain: 0.48, duration: 0.24, filter: 220 },
          startOffset
        );
      }

      if (note.id === "snare") {
        playNoiseHit(ctx, 0.18, 1900, 0.24, startOffset);
      }

      if (note.id === "hat") {
        playNoiseHit(ctx, 0.08, 5200, 0.1, startOffset);
      }

      if (note.id === "crash") {
        playNoiseHit(ctx, 0.45, 3800, 0.16, startOffset);
      }

      if (note.id === "ride") {
        playNoiseHit(ctx, 0.28, 4600, 0.11, startOffset);
      }

      if (note.id === "tom") {
        playEnvelope(
          ctx,
          175,
          { wave: "triangle", attack: 0.001, attackGain: 0.18, duration: 0.28, filter: 460 },
          startOffset
        );
      }

      if (note.id === "floor") {
        playEnvelope(
          ctx,
          120,
          { wave: "triangle", attack: 0.001, attackGain: 0.22, duration: 0.34, filter: 320 },
          startOffset
        );
      }

      return;
    }

    if (instrumentId === "piano") {
      playEnvelope(
        ctx,
        note.freq,
        { wave: "triangle", attack: 0.01, attackGain: 0.18, duration: 1.05, filter: 2100 },
        startOffset
      );
      playEnvelope(
        ctx,
        note.freq * 2,
        { wave: "sine", attack: 0.01, attackGain: 0.03, duration: 0.8, filter: 2600 },
        startOffset
      );
      return;
    }

    if (instrumentId === "guitar") {
      playEnvelope(
        ctx,
        note.freq,
        { wave: "sawtooth", attack: 0.004, attackGain: 0.12, duration: 0.55, filter: 1300 },
        startOffset
      );
      return;
    }

    playEnvelope(
      ctx,
      note.freq,
      { wave: "sine", attack: 0.08, attackGain: 0.14, duration: 1.25, filter: 2400 },
      startOffset
    );
  }

  function flashNotes(instrumentId, noteIds) {
    setHighlightState({ instrumentId, noteIds });
    window.clearTimeout(highlightTimeoutRef.current);
    highlightTimeoutRef.current = window.setTimeout(() => {
      setHighlightState((current) =>
        current.instrumentId === instrumentId ? { instrumentId, noteIds: [] } : current
      );
    }, 260);
  }

  function playNoteList(instrumentId, noteIds, label, options = {}) {
    const ctx = ensureAudioContext();
    const instrument = instruments.find((item) => item.id === instrumentId);
    const notes = noteIds
      .map((noteId) => {
        const existingNote = instrument.notes.find((note) => note.id === noteId);

        if (existingNote) {
          return existingNote;
        }

        if (instrumentId === "drums") {
          return null;
        }

        return createVirtualNote(noteId);
      })
      .filter(Boolean);

    notes.forEach((note, index) => {
      const startOffset = (options.spread ?? 0) * index;
      playInstrumentSound(ctx, instrumentId, note, startOffset);
    });

    if (!options.skipFlash) {
      flashNotes(instrumentId, noteIds);
    }

    if (!options.skipStatus) {
      setStatus(`${label} on ${instrument.name}.`);
    }

    if (!options.skipSelection && instrumentId === activeInstrument && notes[0]) {
      setSelectedStudioNoteId(notes[0].id);
    }
  }

  function previewNote(instrumentId, note) {
    playNoteList(instrumentId, [note.id], `Playing ${note.fullLabel ?? note.label}`);
  }

  function previewChord(instrumentId, chord) {
    const spread = instrumentId === "guitar" ? 0.035 : 0;
    playNoteList(instrumentId, chord.notes, `Chord ${chord.label}`, { spread });
  }

  function playStep(stepIndex, activePattern, ctx) {
    instruments.forEach((instrument) => {
      instrument.notes.forEach((note) => {
        if (activePattern[instrument.id][note.id][stepIndex]) {
          playInstrumentSound(ctx, instrument.id, note);
        }
      });
    });
  }

  function toggleCell(instrumentId, noteId, stepIndex) {
    setPattern((currentPattern) => ({
      ...currentPattern,
      [instrumentId]: {
        ...currentPattern[instrumentId],
        [noteId]: currentPattern[instrumentId][noteId].map((isOn, index) =>
          index === stepIndex ? !isOn : isOn
        )
      }
    }));

    setStatus(`Updated ${instrumentId} pattern at step ${stepIndex + 1}.`);
  }

  function resetPattern() {
    setPattern(createEmptyPattern());
    setIsPlaying(false);
    setStatus("Cleared the grid. Build your own loop from scratch.");
  }

  function loadDemo() {
    setPattern(loadStarterPattern());
    setStatus("Starter groove loaded. Press Play and shape it into your own track.");
  }

  function openInstrument(instrumentId) {
    const instrument = instruments.find((item) => item.id === instrumentId);
    setActiveView("studio");
    setActiveInstrument(instrumentId);
    setSelectedStudioNoteId(instrument.notes[0].id);
    setStatus(`Opened ${instrument.name} studio.`);
  }

  function isHighlighted(noteId) {
    return (
      highlightState.instrumentId === activeInstrument &&
      highlightState.noteIds.includes(noteId)
    );
  }

  async function handleSongSubmit(event) {
    event.preventDefault();
    setIsAnalyzingSong(true);

    try {
      let breakdown = null;

      if (songFile) {
        breakdown = await buildSongBreakdownFromAudio(songFile, songTitle, ensureAudioContext());
      } else {
        breakdown = buildSongBreakdown(songTitle, songInput);
      }

      if (!breakdown) {
        setSongMessage(
          songFile
            ? "I could not estimate notes from that audio file yet. Try a clearer clip or a shorter melodic section."
            : "I could not read that progression yet. Try something like C G Am F or Dm7 G7 Cmaj7."
        );
        return;
      }

      setSavedBreakdowns((current) => [breakdown, ...current]);
      setSelectedBreakdownId(breakdown.id);
      setSongMessage(
        breakdown.sourceType === "audio"
          ? `Saved "${breakdown.title}" from ${breakdown.sourceName} using browser audio estimation.`
          : breakdown.invalidTokens.length > 0
            ? `Saved "${breakdown.title}". Ignored: ${breakdown.invalidTokens.join(", ")}.`
            : `Saved "${breakdown.title}" and broke it into notes for each instrument.`
      );
      setSongTitle("");
      setSongInput("");
      setSongFile(null);

      if (audioFileInputRef.current) {
        audioFileInputRef.current.value = "";
      }
    } catch {
      setSongMessage(
        "I couldn't process that audio file. Try MP3, WAV, or a shorter clip with a clearer lead or chord section."
      );
    } finally {
      setIsAnalyzingSong(false);
    }
  }

  function removeBreakdown(event, breakdownId) {
    event.stopPropagation();

    setSavedBreakdowns((current) => {
      const next = current.filter((breakdown) => breakdown.id !== breakdownId);
      if (selectedBreakdownId === breakdownId) {
        setSelectedBreakdownId(next[0]?.id ?? null);
      }
      return next;
    });
  }

  function stopBreakdownPlayback(message = "Stopped breakdown playback.") {
    breakdownTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    breakdownTimeoutsRef.current = [];
    setActiveBreakdownPlayback(null);
    setSongMessage(message);
  }

  function playBreakdownSequence(mode) {
    if (!selectedBreakdown) {
      return;
    }

    stopBreakdownPlayback(`Preparing ${getPlaybackModeLabel(mode)} playback...`);
    const chordDurationMs = ((60 / tempo) * 2) * 1000;
    const nextTimeouts = [];

    const schedule = (callback, delay) => {
      const timeoutId = window.setTimeout(callback, delay);
      nextTimeouts.push(timeoutId);
    };

    selectedBreakdown.chords.forEach((chord, chordIndex) => {
      const baseDelay = chordIndex * chordDurationMs;

      if (mode === "piano" || mode === "all") {
        schedule(() => {
          playNoteList("piano", chord.pianoNotes, chord.symbol, {
            skipStatus: true,
            skipSelection: true
          });
        }, baseDelay);
      }

      if (mode === "guitar" || mode === "all") {
        schedule(() => {
          playNoteList("guitar", chord.guitarNotes, chord.symbol, {
            spread: 0.035,
            skipStatus: true,
            skipSelection: true
          });
        }, baseDelay + 110);
      }

      if (mode === "flute" || mode === "all") {
        const fluteLead = chord.fluteNotes[chord.fluteNotes.length - 1];
        schedule(() => {
          playNoteList("flute", [fluteLead], chord.symbol, {
            skipStatus: true,
            skipSelection: true
          });
        }, baseDelay + chordDurationMs * 0.45);
      }

      if (mode === "drums" || mode === "all") {
        const drumSteps = chord.drumPattern
          .map((label) => DRUM_LABEL_TO_ID[label])
          .filter(Boolean);

        drumSteps.forEach((drumId, stepIndex) => {
          const hitDelay = baseDelay + (stepIndex * chordDurationMs) / Math.max(drumSteps.length, 1);
          schedule(() => {
            playNoteList("drums", [drumId], chord.symbol, {
              skipStatus: true,
              skipSelection: true
            });
          }, hitDelay);
        });
      }
    });

    schedule(() => {
      setActiveBreakdownPlayback(null);
      setSongMessage(`Finished ${getPlaybackModeLabel(mode)} playback for "${selectedBreakdown.title}".`);
      breakdownTimeoutsRef.current = [];
    }, selectedBreakdown.chords.length * chordDurationMs + 250);

    breakdownTimeoutsRef.current = nextTimeouts;
    setActiveBreakdownPlayback(mode);
    setSongMessage(`Playing ${getPlaybackModeLabel(mode)} for "${selectedBreakdown.title}".`);
  }

  function renderPianoSurface() {
    const whiteKeys = focusedInstrument.notes.filter((note) => note.kind === "white");
    const blackKeys = focusedInstrument.notes.filter((note) => note.kind === "black");

    return (
      <div className="play-surface piano-surface">
        <div className="surface-controls">
          {focusedInstrument.chords.map((chord) => (
            <button
              className="chord-button"
              key={chord.id}
              onClick={() => previewChord("piano", chord)}
              type="button"
            >
              {chord.label}
            </button>
          ))}
        </div>

        <div className="piano-board">
          <div className="white-keys">
            {whiteKeys.map((note) => (
              <button
                className={`piano-key white ${isHighlighted(note.id) ? "playing" : ""}`}
                key={note.id}
                onClick={() => previewNote(activeInstrument, note)}
                type="button"
              >
                <span>{note.fullLabel}</span>
                <strong>{note.key}</strong>
              </button>
            ))}
          </div>

          <div className="black-keys">
            {blackKeys.map((note) => (
              <button
                className={`piano-key black ${isHighlighted(note.id) ? "playing" : ""}`}
                key={note.id}
                onClick={() => previewNote(activeInstrument, note)}
                style={{ "--offset": note.offset }}
                type="button"
              >
                <span>{note.label}</span>
                <strong>{note.key}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderGuitarSurface() {
    return (
      <div className="play-surface guitar-surface">
        <div className="surface-controls">
          {focusedInstrument.chords.map((chord) => (
            <button
              className="chord-button"
              key={chord.id}
              onClick={() => previewChord("guitar", chord)}
              type="button"
            >
              {chord.label}
            </button>
          ))}
        </div>

        <div className="guitar-board">
          <div className="guitar-frets">
            {Array.from({ length: 5 }, (_, index) => (
              <span className="fret-line" key={index} />
            ))}
          </div>

          <div className="guitar-strings">
            {focusedInstrument.notes.map((note) => (
              <button
                className={`guitar-string ${isHighlighted(note.id) ? "playing" : ""}`}
                key={note.id}
                onClick={() => previewNote(activeInstrument, note)}
                type="button"
              >
                <span className="string-name">{note.stringName}</span>
                <span className="string-rail" />
                <strong>{note.fullLabel}</strong>
                <span className="string-key">{note.key}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderDrumSurface() {
    return (
      <div className="play-surface drum-surface">
        {focusedInstrument.notes.map((note) => (
          <button
            className={`drum-pad ${note.padClass} ${isHighlighted(note.id) ? "playing" : ""}`}
            key={note.id}
            onClick={() => previewNote(activeInstrument, note)}
            type="button"
          >
            <strong>{note.label}</strong>
            <span>{note.key}</span>
          </button>
        ))}
      </div>
    );
  }

  function renderFluteSurface() {
    return (
      <div className="play-surface flute-surface">
        <div className="flute-board">
          <div className="flute-body">
            {selectedStudioNote.fingering.map((isClosed, index) => (
              <div
                className={`flute-hole ${isClosed ? "closed" : "open"} ${
                  isHighlighted(selectedStudioNote.id) ? "playing" : ""
                }`}
                key={index}
              />
            ))}
          </div>

          <div className="flute-note-list">
            {focusedInstrument.notes.map((note) => (
              <button
                className={`flute-note-card ${
                  selectedStudioNote.id === note.id ? "selected" : ""
                } ${isHighlighted(note.id) ? "playing" : ""}`}
                key={note.id}
                onClick={() => previewNote(activeInstrument, note)}
                type="button"
              >
                <strong>{note.label}</strong>
                <span>{note.key}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderPlayableSurface() {
    if (activeInstrument === "piano") {
      return renderPianoSurface();
    }

    if (activeInstrument === "guitar") {
      return renderGuitarSurface();
    }

    if (activeInstrument === "drums") {
      return renderDrumSurface();
    }

    return renderFluteSurface();
  }

  function renderStudioView() {
    return (
      <>
        <header className="hero">
          <div className="hero-copy">
            <p className="eyebrow">React SPA Music Playground</p>
            <h1>Raag Studio</h1>
            <p className="hero-text">
              Explore instruments, learn real shapes, and build music with a studio
              that feels much closer to the instruments themselves.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#play-studio">
                Start Playing
              </a>
              <a className="secondary-action" href="#learn">
                Open Learning Path
              </a>
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-glow" />
            <div className="panel-card">
              <span>What you can do</span>
              <strong>Play. Learn. Compose.</strong>
              <p>
                A fuller piano, a fretboard-style guitar, a drum kit, flute fingering,
                and the sequencer you already had.
              </p>
            </div>
          </div>
        </header>

        <main className="content">
          <section className="section">
            <div className="section-heading">
              <p className="eyebrow">Instrument Lab</p>
              <h2>Choose an instrument and open its full studio view</h2>
            </div>

            <div className="instrument-grid">
              {instruments.map((instrument) => (
                <article
                  className={`instrument-card ${
                    activeInstrument === instrument.id ? "active" : ""
                  }`}
                  key={instrument.id}
                  style={{ "--accent": instrument.color }}
                >
                  <div>
                    <h3>{instrument.name}</h3>
                    <p className="tagline">{instrument.tagline}</p>
                    <p>{instrument.description}</p>
                  </div>

                  <div className="chip-row">
                    {instrument.lessons.map((lesson) => (
                      <span className="chip" key={lesson}>
                        {lesson}
                      </span>
                    ))}
                  </div>

                  <div className="card-actions">
                    <button onClick={() => openInstrument(instrument.id)} type="button">
                      Open Tab
                    </button>
                    <button
                      className="ghost-button"
                      onClick={() => previewNote(instrument.id, instrument.notes[0])}
                      type="button"
                    >
                      Preview Sound
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="section" id="play-studio">
            <div className="section-heading">
              <p className="eyebrow">Instrument Tabs</p>
              <h2>Select one instrument and play a more realistic view</h2>
            </div>

            <div className="tab-panel">
              <div className="tab-row" role="tablist" aria-label="Instrument studio tabs">
                {instruments.map((instrument) => (
                  <button
                    aria-selected={activeInstrument === instrument.id}
                    className={`tab-button ${
                      activeInstrument === instrument.id ? "active" : ""
                    }`}
                    key={instrument.id}
                    onClick={() => openInstrument(instrument.id)}
                    role="tab"
                    style={{ "--accent": instrument.color }}
                    type="button"
                  >
                    {instrument.name}
                  </button>
                ))}
              </div>

              <div className="playable-studio" style={{ "--accent": focusedInstrument.color }}>
                <div className="studio-copy">
                  <p className="eyebrow">Now Open</p>
                  <h3>{focusedInstrument.name}</h3>
                  <p>{getPlayableCaption(activeInstrument)}</p>
                  <div className="keyboard-hints">
                    {focusedInstrument.notes.map((note) => (
                      <span className="hint-pill" key={note.id}>
                        <strong>{note.key}</strong>
                        {note.fullLabel ?? note.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="studio-surface-wrap">{renderPlayableSurface()}</div>
              </div>
            </div>
          </section>

          <section className="section" id="learn">
            <div className="section-heading">
              <p className="eyebrow">Learning Section</p>
              <h2>Practice with real shapes before composing</h2>
            </div>

            <div className="learning-layout">
              <div className="lesson-stack">
                {learningPath.map((item) => (
                  <article className="lesson-card" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>

              <div className="focus-card">
                <p className="eyebrow">Current Focus</p>
                <h3>{focusedInstrument.name}</h3>
                <p>
                  Learn the shape here first, then jump into the sequencer to place
                  the notes into a full loop.
                </p>
                <div className="preview-keys">
                  {focusedInstrument.notes.slice(0, 8).map((note) => (
                    <button
                      className="note-pill"
                      key={note.id}
                      onClick={() => previewNote(activeInstrument, note)}
                      type="button"
                    >
                      {note.fullLabel ?? note.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="composer">
            <div className="section-heading">
              <p className="eyebrow">Create Music</p>
              <h2>Sequence all instruments into one loop</h2>
            </div>

            <div className="composer-panel">
              <div className="composer-toolbar">
                <div>
                  <h3>Sequencer</h3>
                  <p>{status}</p>
                </div>

                <div className="toolbar-controls">
                  <label className="tempo-control">
                    Tempo
                    <input
                      max="160"
                      min="72"
                      onChange={(event) => setTempo(Number(event.target.value))}
                      type="range"
                      value={tempo}
                    />
                    <span>{tempo} BPM</span>
                  </label>

                  <button onClick={() => setIsPlaying((playing) => !playing)} type="button">
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                  <button className="ghost-button" onClick={loadDemo} type="button">
                    Demo Pattern
                  </button>
                  <button className="ghost-button" onClick={resetPattern} type="button">
                    Clear
                  </button>
                </div>
              </div>

              <div className="timeline">
                <span>Step</span>
                {Array.from({ length: stepCount }, (_, index) => (
                  <span
                    className={`timeline-step ${currentStep === index && isPlaying ? "live" : ""}`}
                    key={index}
                  >
                    {index + 1}
                  </span>
                ))}
              </div>

              <div className="sequencer-grid">
                {instruments.map((instrument) => (
                  <div className="track" key={instrument.id}>
                    <div className="track-label" style={{ borderColor: instrument.color }}>
                      <strong>{instrument.name}</strong>
                      <span>{instrument.tagline}</span>
                    </div>

                    <div className="track-notes">
                      {instrument.notes.map((note) => (
                        <div className="note-row" key={note.id}>
                          <button
                            className="note-name"
                            onClick={() => previewNote(instrument.id, note)}
                            type="button"
                          >
                            {note.fullLabel ?? note.label}
                          </button>

                          <div className="step-row">
                            {pattern[instrument.id][note.id].map((isOn, stepIndex) => (
                              <button
                                aria-label={`${instrument.name} ${note.label} step ${stepIndex + 1}`}
                                className={`step-cell ${
                                  isOn ? "active" : ""
                                } ${currentStep === stepIndex && isPlaying ? "current" : ""}`}
                                key={`${note.id}-${stepIndex}`}
                                onClick={() => toggleCell(instrument.id, note.id, stepIndex)}
                                style={{ "--accent": instrument.color }}
                                type="button"
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  function renderSongBreakdownView() {
    return (
      <main className="content content-compact">
        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Song Breakdown</p>
            <h2>Turn a song progression into notes, voicings, and instrument ideas</h2>
          </div>

          <div className="song-lab-layout">
            <aside className="song-sidebar">
              <div className="song-sidebar-header">
                <h3>Saved Songs</h3>
                <p>{savedBreakdowns.length} saved breakdowns</p>
              </div>

              <div className="song-sidebar-list">
                {savedBreakdowns.length === 0 ? (
                  <div className="empty-sidebar">
                    Your saved song breakdowns will appear here.
                  </div>
                ) : (
                  savedBreakdowns.map((breakdown) => (
                    <article
                      className={`saved-song-card ${
                        selectedBreakdown?.id === breakdown.id ? "active" : ""
                      }`}
                      key={breakdown.id}
                    >
                      <button
                        className="saved-song-select"
                        onClick={() => setSelectedBreakdownId(breakdown.id)}
                        type="button"
                      >
                        <div className="saved-song-meta">
                          <strong>{breakdown.title}</strong>
                          <span>{formatDate(breakdown.createdAt)}</span>
                        </div>
                        <p>{breakdown.progressionText}</p>
                      </button>
                      <div className="saved-song-footer">
                        <span>{breakdown.chordCount} chords</span>
                        <button
                          aria-label={`Delete ${breakdown.title}`}
                          className="delete-pill"
                          onClick={(event) => removeBreakdown(event, breakdown.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </aside>

            <div className="song-main">
              <div className="song-form-panel">
                <div>
                  <p className="eyebrow">New Breakdown</p>
                  <h3>Paste a song progression</h3>
                  <p className="song-message">{songMessage}</p>
                </div>

                <form className="song-form" onSubmit={handleSongSubmit}>
                  <label className="form-field">
                    Song Title
                    <input
                      onChange={(event) => setSongTitle(event.target.value)}
                      placeholder="Example: Sunset Loop"
                      type="text"
                      value={songTitle}
                    />
                  </label>

                  <label className="form-field">
                    Chords or Progression
                    <textarea
                      onChange={(event) => setSongInput(event.target.value)}
                      placeholder="Example: C G Am F or Dm7 G7 Cmaj7"
                      rows="4"
                      value={songInput}
                    />
                  </label>

                  <label className="form-field">
                    Audio File
                    <input
                      accept="audio/*"
                      onChange={(event) => setSongFile(event.target.files?.[0] ?? null)}
                      ref={audioFileInputRef}
                      type="file"
                    />
                    <span className="field-help">
                      Upload a short MP3, WAV, or M4A clip to estimate a chord sequence from audio.
                    </span>
                  </label>

                  <button className="primary-action" disabled={isAnalyzingSong} type="submit">
                    {isAnalyzingSong ? "Analyzing..." : "Break Song Into Notes"}
                  </button>
                </form>
              </div>

              {selectedBreakdown ? (
                <div className="breakdown-panel">
                  <div className="breakdown-summary">
                    <div>
                      <p className="eyebrow">Selected Song</p>
                      <h3>{selectedBreakdown.title}</h3>
                      <p>{selectedBreakdown.progressionText}</p>
                    </div>

                    <div className="summary-pills">
                      <span className="summary-pill">
                        {selectedBreakdown.sourceType === "audio"
                          ? `Audio: ${selectedBreakdown.sourceName}`
                          : "Typed progression"}
                      </span>
                      {selectedBreakdown.analysisMode ? (
                        <span className="summary-pill">{selectedBreakdown.analysisMode}</span>
                      ) : null}
                      {selectedBreakdown.durationSeconds ? (
                        <span className="summary-pill">
                          {selectedBreakdown.durationSeconds}s analyzed
                        </span>
                      ) : null}
                      <span className="summary-pill">
                        {selectedBreakdown.chordCount} chords
                      </span>
                      <span className="summary-pill">
                        Notes: {selectedBreakdown.uniqueNotes.join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="playback-controls">
                    <button
                      className="chord-button"
                      onClick={() => playBreakdownSequence("piano")}
                      type="button"
                    >
                      Play Piano
                    </button>
                    <button
                      className="chord-button"
                      onClick={() => playBreakdownSequence("guitar")}
                      type="button"
                    >
                      Play Guitar
                    </button>
                    <button
                      className="chord-button"
                      onClick={() => playBreakdownSequence("flute")}
                      type="button"
                    >
                      Play Flute
                    </button>
                    <button
                      className="chord-button"
                      onClick={() => playBreakdownSequence("drums")}
                      type="button"
                    >
                      Play Drums
                    </button>
                    <button
                      className="chord-button"
                      onClick={() => playBreakdownSequence("all")}
                      type="button"
                    >
                      Play All Together
                    </button>
                    <button
                      className="ghost-button"
                      onClick={() => stopBreakdownPlayback()}
                      type="button"
                    >
                      Stop
                    </button>
                    {activeBreakdownPlayback ? (
                      <span className="playback-indicator">
                        Now playing: {getPlaybackModeLabel(activeBreakdownPlayback)}
                      </span>
                    ) : null}
                  </div>

                  <div className="breakdown-grid">
                    {selectedBreakdown.chords.map((chord) => (
                      <article className="breakdown-card" key={chord.id}>
                        <div className="breakdown-card-header">
                          <div>
                            <span className="breakdown-order">Chord {chord.order}</span>
                            <h4>{chord.symbol}</h4>
                          </div>
                          <span className="quality-badge">{chord.qualityLabel}</span>
                        </div>

                        <div className="instrument-break-row">
                          <strong>Piano</strong>
                          <span>{chord.pianoNotes.join(" - ")}</span>
                        </div>
                        <div className="instrument-break-row">
                          <strong>Guitar</strong>
                          <span>{chord.guitarNotes.join(" - ")}</span>
                        </div>
                        <div className="instrument-break-row">
                          <strong>Flute</strong>
                          <span>{chord.fluteNotes.join(" - ")}</span>
                        </div>
                        <div className="instrument-break-row">
                          <strong>Drums</strong>
                          <span>{chord.drumPattern.join(" / ")}</span>
                        </div>
                        {chord.segmentLabels?.length ? (
                          <div className="instrument-break-row">
                            <strong>Audio</strong>
                            <span>{chord.segmentLabels.join(", ")}</span>
                          </div>
                        ) : null}

                        <div className="pitch-class-row">
                          {chord.pitchClasses.map((pitchClass) => (
                            <span className="pitch-pill" key={pitchClass}>
                              {pitchClass}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-breakdown">
                  Save a progression to see the note breakdown in this panel.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <div className="top-app-bar">
        <div className="brand-mark">
          <strong>Raag Studio</strong>
          <span>Playground + Song Lab</span>
        </div>

        <div className="view-switcher">
          <button
            className={`view-switch ${activeView === "studio" ? "active" : ""}`}
            onClick={() => setActiveView("studio")}
            type="button"
          >
            Studio
          </button>
          <button
            className={`view-switch ${activeView === "song-breakdown" ? "active" : ""}`}
            onClick={() => setActiveView("song-breakdown")}
            type="button"
          >
            Song Breakdown
          </button>
        </div>
      </div>

      {activeView === "studio" ? renderStudioView() : renderSongBreakdownView()}
    </div>
  );
}

export default App;
