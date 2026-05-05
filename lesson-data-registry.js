/* ═══════════════════════════════════════════════════════════════
   TUBE LESSON — COMPLETE RICH DATA
   This is the flagship template. Every future lesson follows 
   exactly this structure. Copy, fill in, done.
   
   HOW TO ADD A NEW LESSON:
   1. Copy this entire block
   2. Change the key (e.g. 'sandwich-beginner')
   3. Fill in all sections with content from your lesson
   4. Add the key to LESSON_VOCAB_REGISTRY in lesson-completion-rewards.js
   5. Done — review game works automatically
═══════════════════════════════════════════════════════════════ */

const LESSON_DATA_REGISTRY = {

  'london-underground-beginner': {

    // ── IDENTITY ─────────────────────────────────────────────
    id:    'london-underground-beginner',
    title: 'The London Underground',
    level: 'Beginner',
    track: 'beginner',
    emoji: '🚇',
    badge: 'Tube Expert',

    // ── VOCAB ────────────────────────────────────────────────
    // word: the target word
    // definition: clear simple definition
    // example: a sentence using the word, with ___ where the word goes
    // distractors: 2-3 wrong answers for gap fill (should be plausible)
    vocab: [
      {
        word:        'platform',
        definition:  'The area at a station where you wait for the train and get on or off',
        example:     'Stand back from the edge of the ___ — the train is arriving!',
        distractors: ['carriage', 'tunnel', 'station'],
      },
      {
        word:        'journey',
        definition:  'A trip from one place to another, especially by transport',
        example:     'The ___ from London to Heathrow takes about 50 minutes on the Tube.',
        distractors: ['delay', 'platform', 'ticket'],
      },
      {
        word:        'carriage',
        definition:  'One section of a train — like a room on wheels with seats inside',
        example:     'Please move down inside the ___ to make space for other passengers.',
        distractors: ['platform', 'tunnel', 'journey'],
      },
      {
        word:        'delay',
        definition:  'When something is late and does not arrive at the expected time',
        example:     'We apologise for the ___ — the train will arrive in 8 minutes.',
        distractors: ['journey', 'signal', 'platform'],
      },
      {
        word:        'crowded',
        definition:  'Full of people — the opposite of empty',
        example:     'The Central Line is extremely ___ during rush hour every morning.',
        distractors: ['delayed', 'fast', 'busy'],
      },
      {
        word:        'underground',
        definition:  'Below the ground — tunnels and railways built beneath a city',
        example:     'London\'s ___ railway opened in 1863 and is the oldest in the world.',
        distractors: ['overground', 'subway', 'metro'],
      },
      {
        word:        'Oyster card',
        definition:  'The blue card Londoners use to pay for the Tube, buses and trains',
        example:     'Tap your ___ on the yellow reader before you go through the gate.',
        distractors: ['travel card', 'ticket', 'pass'],
      },
      {
        word:        'Mind the gap',
        definition:  'The warning to be careful of the space between the train and the platform',
        example:     '"___!" — you hear this announcement at every London Underground station.',
        distractors: ['Watch your step', 'Hold the door', 'Stand clear'],
      },
    ],

    // ── GRAMMAR ──────────────────────────────────────────────
    // topic: the grammar point covered in this lesson
    // rule: simple explanation shown to class before exercises
    // exercises: gap-fill questions testing the grammar point
    //   sentence: the sentence with ___ where the answer goes
    //   answer: the correct word/phrase
    //   wrong: 3 wrong options (make them believable — common errors)
    //   explain: one-line explanation shown after answering
    grammar: {
      topic: 'Superlatives',
      rule:  'Short adjectives (1-2 syllables): add -EST → old → the oldest. Long adjectives (3+ syllables): use MOST → the most famous. Always use THE before a superlative.',
      exercises: [
        {
          sentence: 'The London Underground is ___ underground railway in the world.',
          answer:   'the oldest',
          wrong:    ['the most old', 'the older', 'oldest'],
          explain:  '"Old" is short → use -EST → "the oldest". Never "most old".',
        },
        {
          sentence: 'The Tube map is one of ___ graphic designs in history.',
          answer:   'the most famous',
          wrong:    ['the famousest', 'the more famous', 'the most fame'],
          explain:  '"Famous" has 2 syllables → use MOST → "the most famous".',
        },
        {
          sentence: 'Which is ___ station on the London Underground?',
          answer:   'the busiest',
          wrong:    ['the most busy', 'the more busiest', 'busiest'],
          explain:  '"Busy" → "busiest" (y changes to i). Always add THE.',
        },
        {
          sentence: 'Beck\'s design was ___ idea in transport history.',
          answer:   'the best',
          wrong:    ['the most good', 'the goodest', 'the most better'],
          explain:  'Irregular superlative: good → better → THE BEST.',
        },
      ],
    },

    // ── GRAMMAR 2 ─────────────────────────────────────────────
    // Second grammar point — prepositions of time
    grammar2: {
      topic: 'Prepositions of time: IN / ON / AT',
      rule:  'IN = months, years, seasons (in 1863, in January). ON = days and dates (on Monday, on 10 January). AT = clock times (at 8am, at midnight).',
      exercises: [
        {
          sentence: 'The Underground opened ___ 10 January 1863.',
          answer:   'on',
          wrong:    ['in', 'at', 'during'],
          explain:  'Specific date → ON. "On 10 January 1863."',
        },
        {
          sentence: 'Harry Beck designed the map ___ 1931.',
          answer:   'in',
          wrong:    ['on', 'at', 'by'],
          explain:  'Year → IN. "In 1931."',
        },
        {
          sentence: 'The Night Tube runs ___ midnight on Fridays.',
          answer:   'at',
          wrong:    ['in', 'on', 'from'],
          explain:  'Clock time → AT. "At midnight."',
        },
        {
          sentence: 'The Tube is very crowded ___ rush hour.',
          answer:   'at',
          wrong:    ['in', 'on', 'during'],
          explain:  'Rush hour = a specific time period → AT. "At rush hour."',
        },
      ],
    },

    // ── SENTENCE BUILDER ────────────────────────────────────
    // Students tap words in the correct order
    // words: all the words shuffled (game shuffles them again)
    // answer: the correct sentence
    // hint: a small clue shown below
    sentences: [
      {
        words:  ['oldest', 'The', 'underground', 'in', 'the', 'Tube', 'the', 'world', 'is', 'railway'],
        answer: 'The Tube is the oldest underground railway in the world',
        hint:   '🌍 Superlative + fact about the Tube',
      },
      {
        words:  ['careful', 'space', 'be', 'train', 'the', 'the', 'of', 'and', 'platform', 'between'],
        answer: 'be careful of the space between the train and the platform',
        hint:   '📢 What does "Mind the gap" mean?',
      },
      {
        words:  ['the', 'card', 'tap', 'yellow', 'Oyster', 'your', 'on', 'reader'],
        answer: 'tap your Oyster card on the yellow reader',
        hint:   '💳 How do you pay for the Tube?',
      },
      {
        words:  ['Beck', 'map', 'Harry', 'the', 'like', 'drew', 'circuit', 'diagram', 'an', 'electrical'],
        answer: 'Harry Beck drew the map like an electrical circuit diagram',
        hint:   '🗺️ Who designed the Tube map and how?',
      },
    ],

    // ── WORD BUILDER ────────────────────────────────────────
    // Letters are scrambled — students rebuild the word
    // The game shows the definition as a clue
    // These should be vocab words from the lesson
    word_builder: [
      { word:'platform',  definition:'Where you wait for the train' },
      { word:'carriage',  definition:'One section of a train' },
      { word:'crowded',   definition:'Full of people' },
      { word:'journey',   definition:'A trip from A to B' },
      { word:'delay',     definition:'When the train is late' },
      { word:'oyster',    definition:'The card you tap to pay' },
    ],

    // ── TRUE / FALSE ─────────────────────────────────────────
    // Fun facts and deliberate mistakes — class shouts the answer
    // correct: true or false
    // reveal: the explanation shown after answering
    true_false: [
      {
        statement: 'The London Underground is the OLDEST underground railway in the world.',
        correct:   true,
        reveal:    '✅ TRUE! It opened on 10 January 1863 — over 160 years ago!',
      },
      {
        statement: 'The famous Tube map shows the REAL distances between stations.',
        correct:   false,
        reveal:    '❌ FALSE! The map is NOT geographically accurate — it\'s a design diagram. Harry Beck made it simple and clear, not accurate.',
      },
      {
        statement: 'There are 11 different lines on the London Underground.',
        correct:   true,
        reveal:    '✅ TRUE! 11 lines, each with its own colour — Central (red), Piccadilly (dark blue), Circle (yellow) and more.',
      },
      {
        statement: '"Mind the gap" means: be careful of the train door.',
        correct:   false,
        reveal:    '❌ FALSE! "Mind the gap" means be careful of the SPACE between the train and the PLATFORM — not the door!',
      },
      {
        statement: 'The Tube runs 24 hours every night of the week.',
        correct:   false,
        reveal:    '❌ FALSE! Most lines stop between midnight and 5am. The Night Tube only runs on Fridays and Saturdays on 5 lines.',
      },
      {
        statement: 'Harry Beck was paid five guineas (about £5) for designing the Tube map.',
        correct:   true,
        reveal:    '✅ TRUE! One of the most famous graphic designs in history — and he received just £5. Shocking!',
      },
      {
        statement: 'You say "the Underground" if you are a Londoner.',
        correct:   false,
        reveal:    '❌ FALSE! Londoners say "the TUBE". Tourists say "the Underground". Now you know which one to say! 😄',
      },
      {
        statement: 'The Oyster card is named after the phrase "the world is your oyster".',
        correct:   true,
        reveal:    '✅ TRUE! The name suggests the card opens up the whole city for you — like an oyster opening to reveal a pearl.',
      },
    ],

  },

  // ══════════════════════════════════════════════════════════
  // ADD NEW LESSONS HERE following the same structure above
  // Copy the entire block above and fill in your content
  // ══════════════════════════════════════════════════════════

  'sandwich-beginner': {
    id:    'sandwich-beginner',
    title: 'The Earl of Sandwich',
    level: 'Beginner',
    track: 'beginner',
    emoji: '🥪',
    badge: 'Sandwich Expert',

    vocab: [
      { word:'invention',  definition:'Something new that someone creates for the first time',       example:'The sandwich is probably the greatest ___ in food history.',           distractors:['discovery','idea','creation'] },
      { word:'nobleman',   definition:'A person from a high social class in history',                example:'The ___ refused to leave the gambling table to eat a proper meal.',    distractors:['merchant','soldier','servant'] },
      { word:'gambling',   definition:'Playing games for money',                                     example:'He loved ___ so much that he did not want to stop to eat dinner.',     distractors:['hunting','eating','sleeping'] },
      { word:'slice',      definition:'A flat piece cut from something larger',                      example:'He asked for a ___ of bread with meat inside.',                        distractors:['piece','chunk','block'] },
      { word:'filling',    definition:'The food that goes inside a sandwich',                        example:'What is your favourite sandwich ___? Ham? Cheese? Tuna?',              distractors:['topping','layer','bread'] },
      { word:'popular',    definition:'Liked by many people',                                        example:'The sandwich became so ___ that people named it after him.',           distractors:['famous','common','usual'] },
    ],

    grammar: {
      topic: 'Past Simple — regular verbs',
      rule:  'Regular verbs: add -ED in the past. work → worked, want → wanted, ask → asked. Spelling: if verb ends in E, just add D. love → loved.',
      exercises: [
        { sentence:'The Earl ___ to leave the gambling table.',  answer:'refused',  wrong:['refuse','was refusing','has refused'],  explain:'"Refuse" is regular → add D → "refused".' },
        { sentence:'He ___ a servant to bring him bread and meat.',  answer:'asked',  wrong:['ask','was asking','has asked'],  explain:'"Ask" is regular → add ED → "asked".' },
        { sentence:'The idea ___ very quickly across England.',  answer:'spread',  wrong:['spreaded','was spreading','has spread'],  explain:'"Spread" is irregular — no change: spread → spread.' },
        { sentence:'People ___ the sandwich after the Earl of Sandwich.',  answer:'named',  wrong:['name','was naming','has named'],  explain:'"Name" ends in E → add D only → "named".' },
      ],
    },

    grammar2: {
      topic: 'Past Simple — irregular verbs',
      rule:  'Some common verbs are irregular in the past. You must learn these: eat → ate, make → made, give → gave, become → became, take → took.',
      exercises: [
        { sentence:'The Earl ___ bread and meat at the gambling table.',  answer:'ate',  wrong:['eated','eat','has eaten'],  explain:'Irregular: eat → ATE.' },
        { sentence:'The sandwich ___ the most popular food in Britain.',  answer:'became',  wrong:['becomed','become','was become'],  explain:'Irregular: become → BECAME.' },
        { sentence:'His servant ___ him two slices of bread with beef inside.',  answer:'gave',  wrong:['gived','give','has given'],  explain:'Irregular: give → GAVE.' },
        { sentence:'The idea ___ off very quickly.',  answer:'took',  wrong:['taked','take','has took'],  explain:'Irregular: take → TOOK.' },
      ],
    },

    sentences: [
      { words:['the','asked','meat','of','slices','The','Earl','bread','between','two','for'], answer:'The Earl asked for meat between two slices of bread', hint:'🥪 The original sandwich order' },
      { words:['gambling','stop','to','did','not','He','want','to','eat'], answer:'He did not want to stop gambling to eat', hint:'🎲 Why he invented the sandwich' },
      { words:['popular','sandwich','The','so','became','very','quickly'], answer:'The sandwich became very popular so quickly', hint:'🌍 How fast did it spread?' },
    ],

    word_builder: [
      { word:'invention',  definition:'Something created for the first time' },
      { word:'nobleman',   definition:'A person from a high social class' },
      { word:'filling',    definition:'What goes inside a sandwich' },
      { word:'popular',    definition:'Liked by many people' },
      { word:'gambling',   definition:'Playing games for money' },
    ],

    true_false: [
      { statement:'The sandwich was invented by a cook in a London restaurant.',  correct:false,  reveal:'❌ FALSE! It was the Earl of Sandwich — a nobleman who did not want to stop gambling to eat a proper meal.' },
      { statement:'The Earl of Sandwich gave his name to the sandwich.',  correct:true,  reveal:'✅ TRUE! John Montagu, the 4th Earl of Sandwich, is the man behind the name.' },
      { statement:'The sandwich was invented in the 18th century.',  correct:true,  reveal:'✅ TRUE! Around 1762 — nearly 260 years ago!' },
      { statement:'"Filling" means the bread on the outside of a sandwich.',  correct:false,  reveal:'❌ FALSE! The filling is the food INSIDE — the ham, cheese, tuna etc. The bread is the outside.' },
    ],
  },

};

// Export for use in review game
if (typeof module !== 'undefined') module.exports = LESSON_DATA_REGISTRY;
