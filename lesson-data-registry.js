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
        distractors: ['delayed', 'fast', 'business'],
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
          wrong:    ['in', 'on', 'from'],
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
        words:  ['careful', 'space', 'be', 'train', 'the', 'the', 'of', 'and', 'the', 'platform', 'between'],
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



'ikea-effect-intermediate': {
 
    id:    'ikea-effect-intermediate',
    title: 'Why Do We Love Building IKEA Furniture?',
    level: 'Intermediate',
    track: 'intermediate',
    emoji: '🛋️',
    badge: 'Flat-Pack Expert',
 
    // ── VOCAB ──────────────────────────────────────────────────
    vocab: [
      {
        word:        'conventional',
        definition:  'Following the usual or expected way of doing things',
        example:     'IKEA is certainly not ___ — it asks customers to build their own furniture.',
        distractors: ['successful', 'Swedish', 'popular'],
      },
      {
        word:        'designated',
        definition:  'Officially assigned or set aside for a particular purpose',
        example:     'There is a ___ road that all customers must follow through the store.',
        distractors: ['secret', 'stupid', 'yellow-brick'],
      },
      {
        word:        'preassembled',
        definition:  'Already put together before the customer receives it',
        example:     'Unlike most furniture retailers that sell products ___, IKEA customers build their own.',
        distractors: ['discounted', 'broken', 'prepared'],
      },
      {
        word:        'phenomena',
        definition:  'Remarkable or observable events or facts - plural of phenomenon',
        example:     'Researchers noticed similar ___ in other products and businesses.',
        distractors: ['problems', 'solutions', 'strategies'],
      },
      {
        word:        'mass market appeal',
        definition:  'The quality of being attractive or popular to a very wide range of people',
        example:     'Today, IKEA is the very definition of ___ — students and millionaires both shop there.',
        distractors: ['online presence', 'brand loyalty', 'luxury status'],
      },
      {
        word:        'flat-packed',
        definition:  'Compressed into a thin flat box for efficient storage and shipping',
        example:     'Furniture could be ___ to massively reduce the cost of transportation.',
        distractors: ['recycled', 'hand-made', 'colour-coded'],
      },
      {
        word:        'democratic design',
        definition:  'The philosophy that well-designed products should be affordable for everyone',
        example:     'IKEA\'s long-term philosophy is called ___ — good design for all, not just the wealthy.',
        distractors: ['minimal design', 'sustainable design', 'Swedish style'],
      },
      {
        word:        'coined',
        definition:  'Invented or created a new word or phrase for the first time',
        example:     'The term "IKEA effect" was first ___ in 2011 by independent researchers.',
        distractors: ['discovered', 'rejected', 'published'],
      },
      {
        word:        'runaway success',
        definition:  'An overwhelming or unstoppable success that grows very fast',
        example:     'How have these retail strategies contributed to the company\'s ___?',
        distractors: ['global presence', 'profit margin', 'marketing budget'],
      },
      {
        word:        'obsession',
        definition:  'An extreme all-consuming focus on something',
        example:     'That ___ with low prices is a large part of why IKEA is the world\'s largest furniture retailer.',
        distractors: ['strategy', 'approach', 'ambition'],
      },
    ],
 
    // ── GRAMMAR 1: Reported Speech ─────────────────────────────
    grammar: {
      topic: 'Reported Speech — backshifting tenses',
      rule:  'When reporting what someone said, tenses shift back: present simple → past simple, will → would, can → could, must/have to → had to. Pronouns also change: I → he/she, we → they.',
      exercises: [
        {
          sentence: 'She said the store ___ not a grab-a-carton-of-milk-and-get-out kind of place.',
          answer:   'was',
          wrong:    ['is', 'has been', 'were'],
          explain:  '"is" → "was" — present simple shifts to past simple in reported speech.',
        },
        {
          sentence: 'He said the product ___ be just cool looking — it ___ be all of those things.',
          answer:   "couldn't / had to",
          wrong:    ["can't / has to", 'wouldn\'t / must', "didn't / needs to"],
          explain:  '"can\'t" → "couldn\'t" and "has to" → "had to" — modals backshift too.',
        },
        {
          sentence: 'He said lots of people ___ buy LED bulbs if they ___ achieve it.',
          answer:   'would / could',
          wrong:    ['will / can', 'shall / may', 'would / can'],
          explain:  '"will" → "would" and "can" → "could" — standard modal backshifts.',
        },
        {
          sentence: 'The narrator concluded that labour ___ to love.',
          answer:   'leads',
          wrong:    ['led', 'had led', 'would lead'],
          explain:  'General truths often stay in the present tense even in reported speech.',
        },
      ],
    },
 
    // ── GRAMMAR 2: Conditionals ────────────────────────────────
    grammar2: {
      topic: '2nd & 3rd Conditionals — imaginary situations',
      rule:  '2nd conditional (imaginary present): If + past simple → would + infinitive. 3rd conditional (imaginary past — didn\'t happen): If + past perfect → would have + past participle.',
      exercises: [
        {
          sentence: 'If Kamprad ___ flat-packing, IKEA ___ the world\'s largest furniture retailer.',
          answer:   "hadn't invented / wouldn't have become",
          wrong:    ["didn't invent / wouldn't become", "hadn't invented / won't have become", "wouldn't invent / wouldn't become"],
          explain:  '3rd conditional — imagining a different past. If + past perfect, would have + past participle.',
        },
        {
          sentence: 'If IKEA ___ customers to build furniture, people ___ it as much.',
          answer:   "didn't ask / wouldn't value",
          wrong:    ["hadn't asked / wouldn't value", "doesn't ask / won't value", "didn't ask / won't have valued"],
          explain:  '2nd conditional — imagining a hypothetical present. If + past simple, would + infinitive.',
        },
        {
          sentence: 'If researchers ___ the IKEA effect, companies ___ how to use it in marketing.',
          answer:   "hadn't identified / wouldn't know",
          wrong:    ["didn't identify / won't know", "haven't identified / don't know", "hadn't identified / won't know"],
          explain:  '3rd conditional — researchers DID identify it in 2011. If + past perfect, would + infinitive.',
        },
        {
          sentence: 'If IKEA ___ its prices, it ___ its mass market appeal.',
          answer:   "raised / would lose",
          wrong:    ["had raised / wouldn\'t have lost", "raises / will have lost", "raised / will lose"],
          explain:  '2nd conditional — imaginary present scenario. If + past simple, would + infinitive.',
        },
      ],
    },
 
    // ── SENTENCE BUILDER ──────────────────────────────────────
    sentences: [
      {
        words:  ['IKEA', 'not', 'is', 'certainly', 'conventional'],
        answer: 'IKEA is certainly not conventional',
        hint:   '🛋️ How does the video describe IKEA?',
      },
      {
        words:  ['labour', 'love', 'leads', 'to'],
        answer: 'labour leads to love',
        hint:   '🔨 The key idea of the IKEA effect',
      },
      {
        words:  ['design', 'should', 'everyone', 'for', 'good', 'be'],
        answer: 'good design should be for everyone',
        hint:   '📐 The idea behind democratic design',
      },
      {
        words:  ['the', 'invented', 'flat-pack', 'concept', 'Kamprad', 'Ingvar'],
        answer: 'Ingvar Kamprad invented the flat-pack concept',
        hint:   '📦 Who came up with the flat-pack idea?',
      },
    ],
 
    // ── WORD BUILDER ──────────────────────────────────────────
    word_builder: [
      { word:'conventional',  definition:'Following the usual or expected way' },
      { word:'designated',    definition:'Officially set aside for a purpose' },
      { word:'obsession',     definition:'An extreme focus on something' },
      { word:'phenomena',     definition:'Remarkable observable facts (plural)' },
      { word:'coined',        definition:'Invented a new word or phrase' },
    ],
 
    // ── TRUE / FALSE ──────────────────────────────────────────
    true_false: [
      {
        statement: 'IKEA\'s confusing floor plan is an ACCIDENT — not deliberate.',
        correct:   false,
        reveal:    '❌ FALSE! The winding layout is completely intentional — it forces customers to walk through the whole store and make impulse purchases.',
      },
      {
        statement: 'The IKEA effect means people VALUE things MORE when they build them themselves.',
        correct:   true,
        reveal:    '✅ TRUE! The more effort you put into something, the more you value it. Labour leads to love.',
      },
      {
        statement: 'IKEA was founded in DENMARK in 1943.',
        correct:   false,
        reveal:    '❌ FALSE! IKEA was founded in SWEDEN. The founder, Ingvar Kamprad, was Swedish.',
      },
      {
        statement: 'IKEA sometimes decides the PRICE of a product BEFORE designing it.',
        correct:   true,
        reveal:    '✅ TRUE! The $1 LED light bulb example — they set the price target first, then designed backward to achieve it.',
      },
      {
        statement: 'The term "IKEA effect" was invented by IKEA\'s own marketing department.',
        correct:   false,
        reveal:    '❌ FALSE! It was coined in 2011 by independent researchers — not by IKEA.',
      },
      {
        statement: 'An average IKEA store is about the size of FIVE American football fields.',
        correct:   true,
        reveal:    '✅ TRUE! Around 300,000 square feet — that\'s a lot of walking through meatballs and flat-pack boxes.',
      },
      {
        statement: '"CONVENTIONAL" means unusual or different from the expected way.',
        correct:   false,
        reveal:    '❌ FALSE! "Conventional" means FOLLOWING the usual way. UN-conventional means unusual. IKEA is unconventional.',
      },
      {
        statement: '"DEMOCRATIC DESIGN" means the public votes on which products IKEA makes.',
        correct:   false,
        reveal:    '❌ FALSE! Democratic design means well-designed products should be affordable for EVERYONE — not just the wealthy. It\'s a philosophy, not a voting system.',
      },
    ],
 
  },

   'royal-corgis-beginner': {
    id:    'royal-corgis-beginner',
    title: "The Queen's Corgis",
    level: 'Beginner',
    track: 'beginner',
    emoji: '🐾',
    badge: 'Royal Corgi Expert',
 
    vocab: [
      { word:'breed',     definition:'A particular type of dog or other animal', example:'The Pembroke Welsh Corgi is the ___ that Queen Elizabeth loved most.',  distractors:['palace','collar','kennel'] },
      { word:'loyal',     definition:'Always supporting and caring about someone', example:'Corgis are famous for being ___ — they always stayed close to the Queen.', distractors:['noisy','pampered','retired'] },
      { word:'companion', definition:'A friend or animal that spends a lot of time with you', example:"The Queen's corgis were her closest ___ for over 70 years.", distractors:['guard','servant','palace'] },
      { word:'palace',    definition:'A very large grand house where a king or queen lives', example:'The corgis slept inside Buckingham ___ — not outside in kennels.', distractors:['kennel','garden','cottage'] },
      { word:'inherit',   definition:'To receive something from someone after they die', example:"Many of the Queen's later corgis ___ their looks from Susan, her first dog.", distractors:['breed','pamper','retire'] },
      { word:'pampered',  definition:'Given too much care and comfort', example:'The royal corgis were completely ___ — silver bowls, royal chefs, their own room!', distractors:['retired','loyal','trained'] },
      { word:'royal',     definition:'Connected to a king or queen and their family', example:'The corgis had a very ___ life — better than most people in Britain!', distractors:['normal','simple','boring'] },
      { word:'retired',   definition:'Stopped working — usually because of old age', example:'When the corgis got old, they ___ and lived a quiet comfortable life.', distractors:['inherited','pampered','escaped'] },
    ],
 
    grammar: {
      topic: 'Past Simple — regular verbs',
      rule:  'Regular verbs: add -ED in the past. walk → walked, cook → cooked, receive → received. If the verb ends in E, just add D: receive → received, love → loved.',
      exercises: [
        { sentence:"Queen Elizabeth ___ her first corgi on her 18th birthday.", answer:'received', wrong:['receive','receiving','has received'], explain:'"Receive" is regular → add D → "received". Finished action in the past.' },
        { sentence:'Royal chefs ___ special meals for the corgis every day.', answer:'cooked', wrong:['cook','cooking','has cooked'], explain:'"Cook" is regular → add ED → "cooked".' },
        { sentence:'The Queen ___ her corgis everywhere — on holidays and in the car.', answer:'took', wrong:['take','taking','has taken'], explain:'"Take" is IRREGULAR → took.' },
        { sentence:"The corgis ___ in special wicker baskets inside the palace.", answer:'slept', wrong:['sleep','sleeping','has slept'], explain:'"Sleep" is IRREGULAR → sleep → slept. Must learn these!' },
      ],
    },
 
    grammar2: {
      topic: 'Past Simple — irregular verbs',
      rule:  'Some verbs are irregular — they do NOT add -ED. You must learn them. go → went, take → took, sleep → slept, eat → ate, have → had.',
      exercises: [
        { sentence:"The Queen ___ her corgis with her on her honeymoon!", answer:'took', wrong:['taked','take','has taken'], explain:'Irregular: take → TOOK. Never "taked"!' },
        { sentence:'The corgis ___ to Andrew and Sarah after the Queen died.', answer:'went', wrong:['goed','go','have gone'], explain:'Irregular: go → WENT. Never "goed"!' },
        { sentence:'Queen Elizabeth ___ over 30 corgis during her life.', answer:'had', wrong:['haved','have','has had'], explain:'Irregular: have → HAD. Very common — learn it!' },
        { sentence:"The royal corgis ___ from silver bowls every day.", answer:'ate', wrong:['eated','eat','has eaten'], explain:'Irregular: eat → ATE. Never "eated"!' },
      ],
    },
 
    sentences: [
      { words:['corgi','means','dog','Welsh','dwarf','in'], answer:'corgi means dwarf dog in Welsh', hint:'🏴󠁧󠁢󠁷󠁬󠁳󠁥 What does the word corgi mean?' },
      { words:['silver','ate','corgis','bowls','The','from','royal'], answer:'The royal corgis ate from silver bowls', hint:'🍽️ How did the corgis eat?' },
      { words:['companion','was','closest','The','her','corgi'], answer:'The corgi was her closest companion', hint:'🐾 What was the corgi to the Queen?' },
      { words:['Susan','first','corgi','called','was','Her'], answer:'Her first corgi was called Susan', hint:'🎂 What was the name of the first corgi?' },
    ],
 
    word_builder: [
      { word:'loyal',    definition:'Always on your side — a loyal friend' },
      { word:'palace',   definition:'Where a king or queen lives' },
      { word:'breed',    definition:'A type of dog or animal' },
      { word:'pampered', definition:'Given too much comfort and luxury' },
      { word:'inherit',  definition:'To receive something after someone dies' },
    ],
 
    true_false: [
      { statement:"Queen Elizabeth owned MORE THAN 30 corgis in her lifetime.", correct:true, reveal:"✅ TRUE! Over 30 corgis. Her first was Susan — a gift for her 18th birthday in 1944." },
      { statement:"The word CORGI comes from French and means 'small friend'.", correct:false, reveal:"❌ FALSE! Corgi comes from WELSH — cor (dwarf) + gi (dog). So corgi = dwarf dog!" },
      { statement:"The royal corgis slept OUTSIDE in kennels in the palace garden.", correct:false, reveal:"❌ FALSE! They slept INSIDE the palace — in their own room, in wicker baskets. Very pampered!" },
      { statement:"CORGIS are small dogs with short legs and a long body.", correct:true, reveal:"✅ TRUE! Corgis are small with short legs and a long body — and a very big personality!" },
      { statement:"Daniel Craig walked with the Queen's REAL corgis in the 2012 Olympics.", correct:true, reveal:"✅ TRUE! In the famous James Bond opening ceremony — with the real Queen and her real corgis!" },
      { statement:"PAMPERED means given too much care and luxury.", correct:true, reveal:"✅ TRUE! The royal corgis were completely pampered — silver bowls, royal chefs, their own bedroom. What a life!" },
      { statement:"After the Queen died, her corgis were given to a dog home.", correct:false, reveal:"❌ FALSE! They were given to Prince Andrew and Sarah Ferguson — still living in comfort!" },
      { statement:"INHERIT means to buy something expensive from a shop.", correct:false, reveal:"❌ FALSE! Inherit means to RECEIVE something from someone who died. 'She inherited the house from her grandmother.'" },
    ],
  },

   'crown-estate-intermediate': {
    id:    'crown-estate-intermediate',
    title: 'The Crown Estate — Who Really Owns Britain?',
    level: 'Intermediate',
    track: 'intermediate',
    emoji: '👑',
    badge: 'Crown Estate Expert',
 
    vocab: [
      { word:'estate',    definition:'A large area of land or property owned by one person or organisation', example:'The Crown ___ includes Regent Street, Windsor Great Park and half the seabed.', distractors:['revenue','surplus','grant'] },
      { word:'sovereign', definition:'A king or queen — the supreme ruler of a country', example:'The King receives money through the ___ Grant every year.', distractors:['treasury','portfolio','exempt'] },
      { word:'treasury',  definition:'The government department that manages a country\'s money and taxes', example:'All Crown Estate profits are paid directly to the ___.', distractors:['estate','sovereign','surplus'] },
      { word:'revenue',   definition:'Income earned by a government or company from taxes, sales or rents', example:'The ___ from offshore wind farm leases has increased dramatically.', distractors:['grant','exempt','portfolio'] },
      { word:'grant',     definition:'A sum of money given for a specific purpose, usually by a government', example:'The Sovereign ___ is set at 12% of Crown Estate profits.', distractors:['revenue','estate','surplus'] },
      { word:'exempt',    definition:'Not required to pay a tax or follow a rule that applies to others', example:'Some royal residences are ___ from certain categories of local taxation.', distractors:['sovereign','surplus','portfolio'] },
      { word:'portfolio', definition:'A collection of investments, properties or financial assets', example:'The Crown Estate\'s ___ includes central London properties and seabed leases.', distractors:['grant','revenue','treasury'] },
      { word:'surplus',   definition:'An amount left over after all costs and obligations have been met', example:'After the Sovereign Grant is paid, a significant ___ remains in the Treasury.', distractors:['estate','exempt','sovereign'] },
    ],
 
    grammar: {
      topic: 'Passive Voice — present passive',
      rule:  'Present passive: is/are + past participle. We use passive when the ACTION matters more than WHO does it. Essential in financial and legal English. "Profits are paid to the Treasury." "The estate is managed independently."',
      exercises: [
        { sentence:'Crown Estate profits ___ directly to the Treasury every year.',       answer:'are paid',    wrong:['pay','paid','have paid'],          explain:'Present passive: are + past participle. The profits receive the action — they are paid to the Treasury.' },
        { sentence:'The Crown Estate ___ by a board of independent commissioners.',        answer:'is managed',  wrong:['manages','managed','has managed'],  explain:'Present passive: is + past participle. The estate receives the action of management.' },
        { sentence:'Sections of the seabed ___ to energy companies for wind farms.',       answer:'are leased',  wrong:['lease','leased','have leased'],     explain:'Present passive: are + past participle. Current ongoing arrangement.' },
        { sentence:'The Sovereign Grant ___ as a percentage of Crown Estate profits.',     answer:'is calculated',wrong:['calculates','calculated','has calculated'],explain:'Present passive: is + past participle. A formula applied to the profits.' },
      ],
    },
 
    grammar2: {
      topic: 'Passive Voice — past passive',
      rule:  'Past passive: was/were + past participle. For completed actions in the past where the result matters more than the actor. "The deal was made in 1760." "The grant was raised to 25%." Extremely common in financial reports, legal history and official documents.',
      exercises: [
        { sentence:'The deal between George III and Parliament ___ in 1760.',               answer:'was made',    wrong:['makes','is made','has been made'],  explain:'Past passive: was + past participle. A completed historical event.' },
        { sentence:'The Sovereign Grant ___ to 25% to fund the Buckingham Palace renovation.',answer:'was raised', wrong:['raised','is raised','has raised'],  explain:'Past passive: was + past participle. A specific past decision.' },
        { sentence:'The total value of the Crown Estate ___ at £15.6 billion in 2023.',    answer:'was estimated',wrong:['estimated','is estimating','has estimated'],explain:'Past passive: was + past participle. Standard in financial reporting for valuations.' },
        { sentence:'George III ___ a fixed annual payment in exchange for the Crown lands.',answer:'was given',   wrong:['gave','gives','is given'],           explain:'Past passive: was + past participle. The King received the action.' },
      ],
    },
 
    sentences: [
      { words:['are','profits','paid','Crown','Estate','to','the','Treasury'], answer:'Crown Estate profits are paid to the Treasury', hint:'💷 Where do the profits go? (passive voice)' },
      { words:['belong','not','does','estate','the','King','to','the'],        answer:'the estate does not belong to the King',       hint:'👑 What is the key misconception about ownership?' },
      { words:['the','seabed','most','Crown','Estate','of','owns','the'],      answer:'the Crown Estate owns most of the seabed',    hint:'🌊 What surprising asset does the Crown Estate control?' },
      { words:['is','The','12%','Sovereign','Grant','profits','of'],           answer:'The Sovereign Grant is 12% of profits',       hint:'📊 What percentage does the King receive?' },
    ],
 
    word_builder: [
      { word:'sovereign', definition:'A king or queen — the supreme ruler' },
      { word:'treasury',  definition:'The government department for money and taxes' },
      { word:'revenue',   definition:'Income from taxes, rents or sales' },
      { word:'surplus',   definition:'What is left over after all costs are paid' },
      { word:'exempt',    definition:'Not required to pay a tax that others must pay' },
      { word:'portfolio', definition:'A collection of investments or properties' },
    ],
 
    true_false: [
      { statement:'The Crown Estate belongs PERSONALLY to King Charles III.',                          correct:false, reveal:'❌ FALSE! It belongs to the Crown — the institution — not the King personally. He cannot sell it or spend the profits.' },
      { statement:'Crown Estate profits go DIRECTLY to the Treasury — not to the King.',              correct:true,  reveal:'✅ TRUE! All profits go to the Treasury. The King receives a percentage back as the Sovereign Grant.' },
      { statement:'The standard Sovereign Grant rate is 12% of Crown Estate profits.',                correct:true,  reveal:'✅ TRUE! Normally 12%, temporarily raised to 25% for the Buckingham Palace renovation.' },
      { statement:'The Crown Estate owns almost HALF the seabed around England and Wales.',           correct:true,  reveal:'✅ TRUE! This is why offshore wind has made the Crown Estate so much more profitable.' },
      { statement:'REVENUE means the income earned BEFORE expenses are deducted.',                    correct:true,  reveal:'✅ TRUE! Revenue = total income. Profit = revenue minus expenses. Critical distinction in financial English.' },
      { statement:'EXEMPT means you must pay a HIGHER rate of tax than others.',                      correct:false, reveal:'❌ FALSE! Exempt means you do NOT have to pay a tax that applies to others. The opposite of exempt is liable.' },
      { statement:'The PASSIVE VOICE is commonly used in financial and legal English.',               correct:true,  reveal:'✅ TRUE! "Profits are paid", "the grant was raised", "the estate is managed" — passive focuses on WHAT happened, not WHO did it.' },
      { statement:'George III CREATED the Crown Estate in 1760 from nothing.',                        correct:false, reveal:'❌ FALSE! He surrendered existing Crown lands to Parliament in exchange for a guaranteed income. He gave it up — he didn\'t create it.' },
    ],
  },

   'saudi-machine-deal-tax': {
    id:    'saudi-machine-deal-tax',
    title: 'The Saudi Machine Deal',
    level: 'Tax English',
    track: 'tax',
    emoji: '🏭',
    badge: 'Cross-Border Deal Expert',
 
    vocab: [
      { word:'customs duty',            definition:'A tax charged by a country on goods imported from abroad', example:'Saudi Arabia charged 5% ___ on the machine when it arrived at Jeddah port.', distractors:['withholding tax','VAT','commissioning'] },
      { word:'permanent establishment', definition:'A fixed presence in a country that triggers local corporate tax liability', example:'After 12 months on-site, the engineer\'s presence could create a ___ in Saudi Arabia.', distractors:['PE threshold','contract splitting','title'] },
      { word:'withholding tax',         definition:'Tax deducted at source by the payer on payments to a non-resident', example:'Al-Salam deducted ___ before paying MaschinenbauTech\'s commissioning fee.', distractors:['customs duty','VAT','zero-rated'] },
      { word:'contract splitting',      definition:'Separating a deal into a goods contract and a services contract', example:'Their lawyer recommended ___ to separate the goods supply from the installation services.', distractors:['Incoterms','commissioning','title'] },
      { word:'VAT',                     definition:'Value Added Tax — a consumption tax charged at each stage of the supply chain', example:'Saudi Arabia introduced ___ in 2018, raising it to 15% in 2020.', distractors:['customs duty','withholding tax','PE threshold'] },
      { word:'commissioning',           definition:'The process of testing and verifying that an installed machine works correctly', example:'The ___ phase took 4 months longer than planned — pushing the engineer\'s total stay to 11 months.', distractors:['permanent establishment','contract splitting','title'] },
      { word:'Incoterms',               definition:'International rules defining when risk and costs transfer from seller to buyer', example:'Under DDP ___, MaschinenbauTech was responsible for all customs duties and delivery costs.', distractors:['customs duty','VAT','withholding tax'] },
      { word:'zero-rated',             definition:'VAT category where the rate is 0% — seller still recovers input VAT', example:'German exports are ___ — MaschinenbauTech charges 0% VAT on the sale.', distractors:['exempt','zero-charged','VAT-free'] },
      { word:'PE threshold',            definition:'The time period after which foreign activity becomes a permanent establishment', example:'The Saudi-German treaty sets the construction/installation ___ at 12 months.', distractors:['PE limit','customs threshold','VAT threshold'] },
      { word:'title',                   definition:'Legal ownership of goods — when it passes determines tax and liability', example:'The contract specified that ___ passed to the Saudi buyer when goods cleared customs.', distractors:['risk','Incoterms','invoice'] },
    ],
 
    grammar: {
      topic: 'Passive Voice — cross-border deal English',
      rule:  'In business, legal and tax English, passive voice focuses on WHAT happened rather than WHO did it. Essential for deal documentation, risk analysis and client advice. Present: is/are + past participle. Past: was/were + past participle. Future: will be + past participle.',
      exercises: [
        { sentence:'The machine ___ from Hamburg to Jeddah last month.', answer:'was shipped', wrong:['shipped','is shipping','has shipped'], explain:'Past passive: was + past participle. Focus on what happened to the machine.' },
        { sentence:'German exports ___ at 0% — no VAT charged to the buyer.',  answer:'are zero-rated', wrong:['zero-rate','were zero-rating','will zero-rate'], explain:'Present passive for a general legal rule about how exports are treated.' },
        { sentence:'Withholding tax ___ by the payer before transferring funds.', answer:'is deducted', wrong:['deducts','deducted','was deducting'], explain:'Present passive: standard ongoing procedure. The tax receives the action of deduction.' },
        { sentence:'If the engineer stays 12+ months, a PE ___ in Saudi Arabia.', answer:'will be created', wrong:['creates','created','is creating'], explain:'Future passive in a first conditional — describing what will happen IF a condition is met.' },
      ],
    },
 
    sentences: [
      { words:['is','withholding','deducted','tax','by','the','payer'], answer:'withholding tax is deducted by the payer', hint:'💶 Who deducts WHT — and how?' },
      { words:['are','exports','zero-rated','German','VAT','for'], answer:'German exports are zero-rated for VAT', hint:'🇩🇪 How does Germany treat export sales for VAT?' },
      { words:['the','months','threshold','PE','is','twelve'], answer:'the PE threshold is twelve months', hint:'⏱️ When does a permanent establishment get triggered?' },
      { words:['must','grossed','service','fee','the','be','up'], answer:'the service fee must be grossed up', hint:'💰 What should MaschinenbauTech do with their fees to account for WHT?' },
    ],
 
    word_builder: [
      { word:'incoterms',    definition:'International rules for who pays freight and customs' },
      { word:'commissioning',definition:'Testing that an installed machine works correctly' },
      { word:'threshold',    definition:'The limit at which a new rule or tax obligation kicks in' },
      { word:'withholding',  definition:'Keeping back part of a payment as tax' },
      { word:'splitting',    definition:'Dividing a contract into separate parts for different tax treatment' },
      { word:'zero-rated',   definition:'VAT at 0% — the seller still recovers input tax' },
    ],
 
    true_false: [
      { statement:'German exports are subject to German VAT at 19%.',                                correct:false, reveal:'❌ FALSE! Exports are zero-rated — 0% German VAT. The VAT question moves to the destination country (Saudi Arabia).' },
      { statement:'Under DDP Incoterms, the SELLER pays all customs duties.',                        correct:true,  reveal:'✅ TRUE! DDP = Delivered Duty Paid. Maximum seller responsibility — the seller absorbs all import costs.' },
      { statement:'Commissioning time does NOT count toward the PE threshold.',                      correct:false, reveal:'❌ FALSE! Every day on-site counts — installation, testing, commissioning, all of it. The clock measures total presence.' },
      { statement:'Withholding tax is deducted by the PAYER before making the payment.',             correct:true,  reveal:'✅ TRUE! The Saudi customer holds back the tax and pays it to the Saudi authority. The supplier receives the net amount.' },
      { statement:'Contract splitting is automatically illegal under international tax law.',         correct:false, reveal:'❌ FALSE! Contract splitting is legitimate when it reflects genuine commercial reality. Only artificial splits are challenged.' },
      { statement:'Zero-rated means the seller charges 0% VAT AND loses the right to reclaim input VAT.', correct:false, reveal:'❌ FALSE! Zero-rated means 0% output VAT but full input VAT recovery — unlike "exempt" which denies input VAT recovery.' },
      { statement:'The engineer meeting potential Saudi clients while on-site creates an agency PE risk.', correct:true, reveal:'✅ TRUE! Actively soliciting business can create an agency PE — completely independent of the installation time threshold.' },
      { statement:'To NET €300,000 after 5% withholding tax, the invoice should be €315,789.',       correct:true,  reveal:'✅ TRUE! Gross-up formula: net amount / (1 - WHT rate) = €300,000 / 0.95 = €315,789.' },
    ],
  },
'peptides-intermediate': {
 
  id:    'peptides-intermediate',
  title: 'Why Is Everyone Injecting Peptides?',
  level: 'Intermediate',
  track: 'intermediate',
  emoji: '💉',
  badge: 'Biohacker',
 
  // ── VOCAB ──────────────────────────────────────────────────
  vocab: [
    {
      word:        'synthetic',
      definition:  'Made artificially in a lab, not occurring naturally',
      example:     'Many peptides are ___ versions of molecules that already exist in your body.',
      distractors: ['unapproved', 'anecdotal', 'sterile'],
    },
    {
      word:        'unapproved',
      definition:  'Not officially authorised or permitted by a regulator',
      example:     'These are ___ drugs — the FDA has not tested or licensed them for human use.',
      distractors: ['synthetic', 'dosing', 'anecdotal'],
    },
    {
      word:        'anecdotal',
      definition:  'Based on personal stories, not scientific evidence',
      example:     'A lot of what\'s out there about these peptides is ___ — one person\'s experience, not a clinical trial.',
      distractors: ['unapproved', 'synthetic', 'gray market'],
    },
    {
      word:        'gray market',
      definition:  'A trade in goods that is legal but not officially regulated',
      example:     'People are turning to the ___ to buy peptides sold "for research use only".',
      distractors: ['sterility', 'dosing', 'advisory panel'],
    },
    {
      word:        'dosing',
      definition:  'The amount of a drug taken and how often it is taken',
      example:     'We don\'t know much about their safety, effectiveness or ___.',
      distractors: ['sterility', 'synthetic', 'unapproved'],
    },
    {
      word:        'cobbling together',
      definition:  'Putting something together in an improvised, unofficial way',
      example:     'People are ___ their own stack of three or four peptides from different online vendors.',
      distractors: ['dosing', 'anecdotal', 'gray market'],
    },
    {
      word:        'sterility',
      definition:  'The condition of being completely free from bacteria and germs',
      example:     'If peptides came from licensed manufacturers, they would be monitored for ___.',
      distractors: ['synthetic', 'dosing', 'advisory panel'],
    },
    {
      word:        'advisory panel',
      definition:  'A group of experts brought together to give official recommendations',
      example:     'The FDA is going to have an ___ meeting in July to discuss these peptides.',
      distractors: ['gray market', 'sterility', 'unapproved'],
    },
  ],
 
  // ── GRAMMAR 1: Reported Speech ─────────────────────────────
  grammar: {
    topic: 'Reported Speech — backshifting',
    rule:  'When we report what someone said, we shift tenses back: present simple → past simple, will → would, can → could, have to → had to. Pronouns also change.',
    exercises: [
      {
        sentence: 'The reporter said that they ___ unapproved drugs.',
        answer:   'were',
        wrong:    ['are', 'have been', 'will be'],
        explain:  '"are" → "were". Present simple always shifts to past simple in reported speech.',
      },
      {
        sentence: 'She said they ___ know if the peptides were safe.',
        answer:   "didn't",
        wrong:    ["don't", "haven't", "won't"],
        explain:  '"don\'t" → "didn\'t". The auxiliary verb also backshifts.',
      },
      {
        sentence: 'He said you ___ trust your supplier because it was unregulated.',
        answer:   'had to',
        wrong:    ['have to', 'must', 'should'],
        explain:  '"have to" → "had to" in reported speech. "Must" usually also becomes "had to" for obligation.',
      },
      {
        sentence: 'The journalist reported that the FDA ___ have an advisory panel meet.',
        answer:   'would',
        wrong:    ['will', 'shall', 'can'],
        explain:  '"will" → "would". One of the most important backshifts to learn.',
      },
    ],
  },
 
  // ── GRAMMAR 2: Modal Verbs of Speculation ─────────────────
  grammar2: {
    topic: 'Modal Verbs — expressing uncertainty (might / could / may)',
    rule:  'Use might, could, or may when something is possible but not certain. Use must when almost certain. Use can\'t when almost certainly not true. These are called epistemic modals — they describe what we KNOW.',
    exercises: [
      {
        sentence: 'MT-2 ___ increase the risk of melanoma — some studies suggest this.',
        answer:   'might',
        wrong:    ['must', 'will', 'can\'t'],
        explain:  '"Might" = possible but not certain. Perfect when the evidence is limited. "Must" would be too strong here.',
      },
      {
        sentence: 'The FDA ___ decide to restrict ALL peptides — but that seems unlikely.',
        answer:   'could',
        wrong:    ['will', 'must', 'should'],
        explain:  '"Could" = it\'s a theoretical possibility. Good when you want to acknowledge an option without committing to it.',
      },
      {
        sentence: 'This product ___ contain three different peptides — the labelling is unclear.',
        answer:   'may',
        wrong:    ['must', 'will', 'can'],
        explain:  '"May" = formal/neutral possibility. Very common in official language, reports and journalism. Similar to "might".',
      },
      {
        sentence: 'If the peptide is completely untested, there ___ be long-term effects we don\'t know about.',
        answer:   'could',
        wrong:    ['must', 'would', 'should'],
        explain:  '"Could be" = acknowledging a real unknown possibility. When we genuinely don\'t know, "could" is more honest than "must" or "will".',
      },
    ],
  },
 
  // ── SENTENCE BUILDER ──────────────────────────────────────
  sentences: [
    {
      words:  ['lot', 'evidence', 'A', 'is', 'anecdotal', 'about', 'peptides', 'of', 'the'],
      answer: 'A lot of the evidence about peptides is anecdotal',
      hint:   '🧪 How reliable is the evidence for unapproved peptides?',
    },
    {
      words:  ['we', 'safety', 'their', 'don\'t', 'know', 'about', 'much'],
      answer: 'we don\'t know much about their safety',
      hint:   '⚠️ What\'s the key problem with unapproved peptides?',
    },
    {
      words:  ['supplier', 'trust', 'your', 'to', 'have', 'You'],
      answer: 'You have to trust your supplier',
      hint:   '🏪 What does buying from the gray market require?',
    },
    {
      words:  ['advisory', 'have', 'panel', 'The', 'FDA', 'an', 'will', 'meeting'],
      answer: 'The FDA will have an advisory panel meeting',
      hint:   '🏛️ What is the FDA planning for July?',
    },
  ],
 
  // ── WORD BUILDER ──────────────────────────────────────────
  word_builder: [
    { word:'synthetic',   definition:'Made in a laboratory, not natural' },
    { word:'anecdotal',   definition:'Based on personal stories, not studies' },
    { word:'sterility',   definition:'Completely free from bacteria and germs' },
    { word:'unapproved',  definition:'Not licensed by an official authority' },
    { word:'advisory',    definition:'Giving recommendations but not deciding' },
  ],
 
  // ── TRUE / FALSE ──────────────────────────────────────────
  true_false: [
    {
      statement: 'Some peptides ARE used in FDA-approved medications like Ozempic.',
      correct:   true,
      reveal:    '✅ TRUE! GLP-1 drugs like Ozempic are based on a peptide that naturally exists in the body — just modified to be more effective. Not all peptides are unregulated.',
    },
    {
      statement: 'Buying unapproved peptides online is completely illegal under US law.',
      correct:   false,
      reveal:    '❌ FALSE! The grey market is legally ambiguous, not illegal. These peptides are sold "for research use only" — which is technically legal. The issue is that people are using them as drugs.',
    },
    {
      statement: 'MT-2 is used for tanning and may increase the risk of melanoma.',
      correct:   true,
      reveal:    '✅ TRUE! The video specifically warns that MT-2 can cause moles to grow larger, new moles to appear, and studies suggest a possible melanoma risk.',
    },
    {
      statement: '"ANECDOTAL" evidence comes from controlled clinical trials.',
      correct:   false,
      reveal:    '❌ FALSE! Anecdotal evidence comes from personal stories and individual experiences — NOT from controlled studies. It\'s the lowest form of scientific evidence.',
    },
    {
      statement: 'The FDA held an advisory panel to discuss peptides in January 2023.',
      correct:   false,
      reveal:    '❌ FALSE! The video says the FDA IS GOING TO have a panel meet in July (future tense). The 2023 date refers to when the FDA restricted certain peptides — not a panel meeting.',
    },
    {
      statement: '"GRAY MARKET" means a trade that is illegal and underground.',
      correct:   false,
      reveal:    '❌ FALSE! Gray (or grey) market sits between the legal market and the illegal black market. The products aren\'t banned — they\'re just being used outside the approved framework.',
    },
    {
      statement: 'People sometimes inject vials containing three different peptides mixed together.',
      correct:   true,
      reveal:    '✅ TRUE! The video says: "there might be three different peptides combined into one vial that you\'re buying on the internet." You may not know exactly what you\'re injecting.',
    },
    {
      statement: '"STERILITY" refers to the quality of being free from bacteria and germs.',
      correct:   true,
      reveal:    '✅ TRUE! Sterility is critical for anything injected into the body. One argument for regulated peptides is that licensed manufacturers are monitored for sterility.',
    },
  ],
 
},

   'phantom-parent-tax': {
 
  id:    'phantom-parent-tax',
  title: 'The Phantom Parent',
  level: 'Tax English',
  track: 'tax',
  emoji: '👻',
  badge: 'Phantom Parent',
 
  // ── VOCAB ──────────────────────────────────────────────────
  vocab: [
    {
      word:        'withholding tax',
      definition:  'Tax deducted by the payer at source before a payment reaches the recipient',
      example:     'Germany applied ___ of 25% to the dividend before transferring the net amount to Luxembourg.',
      distractors: ['beneficial owner', 'retention', 'deviation'],
    },
    {
      word:        'substance',
      definition:  'Evidence that a company has genuine economic activity — real staff, real decisions, real premises',
      example:     'LuxHolding could not demonstrate adequate ___ in Luxembourg because its directors all worked in Frankfurt.',
      distractors: ['plaintiff', 'deviation', 'directive'],
    },
    {
      word:        'beneficial owner',
      definition:  'The person or entity that genuinely receives and controls a payment — not merely a formal intermediary',
      example:     'The BZSt argued that LuxHolding was not the ___ of the dividend because it immediately passed funds upward.',
      distractors: ['plaintiff', 'shell company', 'substance'],
    },
    {
      word:        'shell company',
      definition:  'A company with no genuine business activity — exists on paper only, typically to hold assets or channel funds',
      example:     'A company with no employees, no dedicated office, and no real activity is typically described as a ___.',
      distractors: ['directive', 'plaintiff', 'substance'],
    },
    {
      word:        'abusive',
      definition:  'Describes an arrangement set up primarily to obtain a tax benefit that was not intended by the law',
      example:     'The BZSt concluded the structure was ___ under Section 50d paragraph 3 because it existed solely to route dividend income.',
      distractors: ['revoked', 'deviation', 'retention'],
    },
    {
      word:        'directive',
      definition:  'An EU law that member states must incorporate into national legislation — sets the goal but leaves method to each country',
      example:     'The EU Parent-Subsidiary ___ should exempt dividends between EU parent and subsidiary from withholding tax.',
      distractors: ['deviation', 'substance', 'withholding tax'],
    },
    {
      word:        'deviation',
      definition:  'A departure from the normal rule — applying conditions or restrictions beyond what a directive normally requires',
      example:     'LuxHolding argued that Section 50d paragraph 3 was an unlawful ___ from the Directive\'s clear exemption.',
      distractors: ['directive', 'abusive', 'refund'],
    },
    {
      word:        'plaintiff',
      definition:  'The party that brings a legal case — the one claiming that something wrong was done to them',
      example:     'Once LuxHolding commenced proceedings at the Finanzgericht, it became the formal ___ in the case.',
      distractors: ['beneficial owner', 'shell company', 'substance'],
    },
    {
      word:        'retention',
      definition:  'The act of keeping back money — in tax, withholding tax is a form of retention before payment reaches the recipient',
      example:     'The total ___ by Germany on the €9.2m dividend was approximately €2.5m including the solidarity surcharge.',
      distractors: ['refund', 'deviation', 'substance'],
    },
    {
      word:        'revoked',
      definition:  'Officially cancelled or taken back — a refund approval can be revoked if the authority later decides it was wrong',
      example:     'A refund that has already been granted can be ___ if the BZSt subsequently discovers the structure is abusive.',
      distractors: ['abusive', 'retention', 'beneficial owner'],
    },
    {
      word:        'refund',
      definition:  'Money returned after tax has been overpaid or incorrectly withheld — the taxpayer applies to reclaim it',
      example:     'Hartmann deducted withholding tax under domestic law, intending to apply for a ___ under the Directive.',
      distractors: ['retention', 'withholding tax', 'deviation'],
    },
    {
      word:        'reimburse',
      definition:  'To pay back money that was spent or withheld — used when correcting an earlier deduction or error',
      example:     'If the court rules in LuxHolding\'s favour, Germany will be required to ___ the full €2.3m plus interest.',
      distractors: ['revoke', 'withhold', 'retain'],
    },
  ],
 
  // ── GRAMMAR 1: Passive Voice ────────────────────────────────
  grammar: {
    topic: 'Passive Voice in tax and legal writing',
    rule:  'In legal and tax English, the passive voice (is/are/was/were + past participle) focuses on what happened rather than who did it. Essential for describing how rules operate, what was decided, and what was withheld. "The refund was denied." "Tax is deducted at source."',
    exercises: [
      {
        sentence: 'The withholding tax ___ from the dividend before LuxHolding received the net amount.',
        answer:   'was deducted',
        wrong:    ['deducted', 'is deducting', 'has been deducting'],
        explain:  'Past passive: was + past participle. The dividend received the action — it was deducted from.',
      },
      {
        sentence: 'The refund application ___ by the BZSt under Section 50d paragraph 3.',
        answer:   'was denied',
        wrong:    ['denied', 'has denied', 'is denying'],
        explain:  'Past passive for a completed official decision. "The BZSt denied it" → "It was denied" — the refund is the subject.',
      },
      {
        sentence: 'LuxHolding S.à r.l. ___ in Luxembourg as a holding company for the German group.',
        answer:   'was incorporated',
        wrong:    ['incorporated', 'has incorporated', 'is incorporating'],
        explain:  'Past passive for a completed historical act. The company received the action of incorporation.',
      },
      {
        sentence: 'Under the Parent-Subsidiary Directive, dividends ___ from withholding tax between EU parent and subsidiary.',
        answer:   'are exempted',
        wrong:    ['exempt', 'were exempting', 'have exempted'],
        explain:  'Present passive for a general ongoing legal rule. "The Directive exempts" → "dividends are exempted by the Directive".',
      },
      {
        sentence: 'A refund previously granted ___ if the authority subsequently discovers the structure to be abusive.',
        answer:   'can be revoked',
        wrong:    ['can revoke', 'could revoke', 'revokes'],
        explain:  'Modal passive: can + be + past participle. The refund is the subject receiving the possibility of revocation.',
      },
      {
        sentence: 'Post-hoc substance improvements generally ___ as evidence of what existed at the time of the transaction.',
        answer:   'are not accepted',
        wrong:    ['do not accept', 'have not accepted', 'were not accepting'],
        explain:  'Present passive negative for an ongoing legal principle. "Courts do not accept" → "improvements are not accepted".',
      },
    ],
  },
 
  // ── GRAMMAR 2: Third Conditional ───────────────────────────
  grammar2: {
    topic: 'Third Conditional — imagining different past outcomes',
    rule:  'Third conditional: If + past perfect → would have + past participle. Used in legal and advisory contexts to analyse what would have happened if facts had been different. "If LuxHolding had had substance, the refund would have been granted."',
    exercises: [
      {
        sentence: 'If LuxHolding ___ local directors in Luxembourg, the BZSt ___ the refund.',
        answer:   'had appointed / would have granted',
        wrong:    ['appointed / would grant', 'had appointed / would grant', 'appointed / would have granted'],
        explain:  'Third conditional: If + past perfect (had appointed), would have + past participle (would have granted). Imagining a different past.',
      },
      {
        sentence: 'If the board ___ in Luxembourg, the substance argument ___ much stronger.',
        answer:   'had met / would have been',
        wrong:    ['met / would be', 'had met / would be', 'met / would have been'],
        explain:  'Third conditional throughout. Both clauses refer to a past that did not happen — would have been is the correct result form.',
      },
      {
        sentence: 'If the directors ___ in Frankfurt, management and control ___ to be in Germany.',
        answer:   'hadn\'t been based / wouldn\'t have appeared',
        wrong:    ['weren\'t based / wouldn\'t appear', 'hadn\'t been based / wouldn\'t appear', 'weren\'t based / wouldn\'t have appeared'],
        explain:  'Negative third conditional. "Hadn\'t been based" is past perfect negative. "Wouldn\'t have appeared" is the conditional perfect result.',
      },
      {
        sentence: 'If LuxHolding ___ genuine substance from the start, this litigation ___ necessary.',
        answer:   'had established / would never have been',
        wrong:    ['established / would never be', 'had established / would never be', 'established / would never have been'],
        explain:  'Third conditional. The premise is clear: the substance was not established — hence the litigation. Both clauses reflect that alternative past.',
      },
    ],
  },
 
  // ── SENTENCE BUILDER ──────────────────────────────────────
  sentences: [
    {
      words:  ['denied', 'was', 'the', 'refund', 'by', 'BZSt', 'the'],
      answer: 'the refund was denied by the BZSt',
      hint:   '💼 How did Germany respond to LuxHolding\'s application?',
    },
    {
      words:  ['genuine', 'no', 'LuxHolding', 'had', 'substance', 'Luxembourg', 'in'],
      answer: 'LuxHolding had no genuine substance in Luxembourg',
      hint:   '🏗️ What was the core problem with the structure?',
    },
    {
      words:  ['the', 'beneficial', 'was', 'not', 'LuxHolding', 'owner'],
      answer: 'LuxHolding was not the beneficial owner',
      hint:   '⚖️ What legal argument did the BZSt make?',
    },
    {
      words:  ['tax', 'was', 'deducted', 'source', 'at', 'withholding'],
      answer: 'withholding tax was deducted at source',
      hint:   '💶 How was the tax applied to the dividend?',
    },
    {
      words:  ['the', 'anti-abuse', 'proportionate', 'must', 'be', 'provision'],
      answer: 'the anti-abuse provision must be proportionate',
      hint:   '📜 What constraint does EU law place on Germany\'s Section 50d?',
    },
  ],
 
  // ── WORD BUILDER ──────────────────────────────────────────
  word_builder: [
    { word:'withholding',  definition:'Keeping back part of a payment as tax before it reaches the recipient' },
    { word:'beneficial',   definition:'Genuinely receiving and controlling something — not just formally holding it' },
    { word:'plaintiff',    definition:'The party that brings a legal case' },
    { word:'deviation',    definition:'A departure from the normal rule' },
    { word:'subsidiary',   definition:'A company owned or controlled by a larger parent company' },
    { word:'incorporated', definition:'Formally registered as a legal company' },
  ],
 
  // ── TRUE / FALSE ──────────────────────────────────────────
  true_false: [
    {
      statement: 'LuxHolding\'s three directors all lived and worked in Luxembourg.',
      correct:   false,
      reveal:    '❌ FALSE! All three directors were German nationals living and working in Frankfurt. The board met in Frankfurt too. This is one of the clearest substance failures in the case.',
    },
    {
      statement: 'The EU Parent-Subsidiary Directive says dividends between EU parent and subsidiary should be exempt from withholding tax.',
      correct:   true,
      reveal:    '✅ TRUE! This is LuxHolding\'s strongest legal card. The Directive\'s primary rule is unambiguous — no withholding tax where a parent holds 10%+ of an EU subsidiary.',
    },
    {
      statement: 'Germany\'s anti-abuse rule in Section 50d paragraph 3 is automatically incompatible with EU law.',
      correct:   false,
      reveal:    '❌ FALSE! The ECJ accepts anti-abuse rules. The Directive itself (Article 1(2)) permits them. The question is whether Section 50d is proportionate — it must not go further than necessary to prevent abuse.',
    },
    {
      statement: 'A refund initially denied can be reconsidered if new evidence relates to the facts at the time of the original transaction.',
      correct:   true,
      reveal:    '✅ TRUE! The court can consider evidence about what genuinely existed at the time the dividend was paid. Post-dispute improvements are different — those don\'t help.',
    },
    {
      statement: 'Adding substance after the dividend was paid fixes the problem retroactively.',
      correct:   false,
      reveal:    '❌ FALSE! Retrospective substance is not generally accepted. The tax analysis looks at the facts at the time the payment was made — Year 3 when the dividend was paid, not Year 4 when improvements were made.',
    },
    {
      statement: '"PLAINTIFF" means the party that defends itself against a legal claim.',
      correct:   false,
      reveal:    '❌ FALSE! The plaintiff BRINGS the case. The party defending itself is the defendant. LuxHolding is the plaintiff because it is the one challenging the BZSt\'s refusal.',
    },
    {
      statement: '"SUBSTANCE" in tax law refers to genuine economic activity — real staff, real premises, real decision-making.',
      correct:   true,
      reveal:    '✅ TRUE! Substance is the evidence that a company really operates where it says it does. Without it, a holding company looks like a "letterbox" — present only on paper.',
    },
    {
      statement: 'LuxHolding\'s shared serviced office — used by 40 other holding companies — was strong evidence of genuine substance.',
      correct:   false,
      reveal:    '❌ FALSE! A shared serviced address with dozens of other companies is a classic red flag — strong evidence of MISSING substance, not genuine presence.',
    },
    {
      statement: 'The "beneficial owner" test asks whether a company genuinely controls the funds it receives, not just formally holds them.',
      correct:   true,
      reveal:    '✅ TRUE! Beneficial ownership is about real economic control. If LuxHolding immediately passed dividends upward with no discretion, the BZSt argues it was merely a conduit — not a genuine owner.',
    },
    {
      statement: 'A "deviation" from an EU Directive is always unlawful.',
      correct:   false,
      reveal:    '❌ FALSE! Deviations are permitted if they are proportionate and serve a legitimate purpose (like preventing abuse). The question is whether Germany\'s deviation goes further than necessary — not whether deviation itself is always wrong.',
    },
  ],
 
},

   'weekly-drop-issue-006': {
  title: 'The Weekly Drop - Issue 006 - Harry Kane: From Nowhere to Bayern',
  level: 'All Levels',
  vocab: [
    {
      word: 'loan spell',
      definition: 'A temporary period when a footballer plays for a different club to gain experience',
      example: 'Kane spent a difficult ___ at Norwich City, where injury disrupted his season.',
      distractors: ['transfer', 'hat-trick', 'penalty spot']
    },
    {
      word: 'perseverance',
      definition: 'Continuing to try despite difficulties, setbacks, or failure',
      example: 'His ___ through four loan clubs is what eventually brought him to the top.',
      distractors: ['defending', 'ambition', 'reputation']
    },
    {
      word: 'transfer',
      definition: 'The permanent move of a footballer from one club to another, usually for a fee',
      example: 'Kane\'s ___ from Tottenham to Bayern Munich cost around €100 million.',
      distractors: ['loan spell', 'contract', 'release']
    },
    {
      word: 'top scorer',
      definition: 'The player who has scored the most goals in a competition or season',
      example: 'He won the Bundesliga ___ award in both of his first two seasons in Germany.',
      distractors: ['armband', 'captain', 'hat-trick']
    },
    {
      word: 'penalty spot',
      definition: 'The marked point 11 metres from the goal from which a penalty kick is taken',
      example: 'Kane had scored all 23 of his Bundesliga penalties — he was ice-cool from the ___.',
      distractors: ['loan spell', 'transfer', 'top scorer']
    },
    {
      word: 'hat-trick',
      definition: 'Three goals scored by the same player in a single match',
      example: 'Kane scored his eleventh ___ for Bayern in all competitions against Dinamo Zagreb.',
      distractors: ['penalty spot', 'armband', 'resilience']
    },
    {
      word: 'armband',
      definition: 'The captain\'s band worn on the upper arm; to wear the armband means to be captain',
      example: 'Kane has worn the ___ for England since 2018, under three different managers.',
      distractors: ['transfer', 'hat-trick', 'top scorer']
    },
    {
      word: 'resilience',
      definition: 'The ability to recover quickly from setbacks — injuries, rejection, failure',
      example: 'Coaches point to Kane as a model of ___, having bounced back from every setback.',
      distractors: ['hair', 'ambition', 'loyalty']
    },
  ],
  grammar: {
    topic: 'Past simple — regular and irregular verbs',
    rule: 'The past simple is used for finished actions in the past. Regular verbs add -ed (joined, scored, signed). Irregular verbs change completely (broke, became, went, scored). The past simple does not change for different subjects (I joined / he joined / they joined).',
    exercises: [
      {
        sentence: 'Kane ___ the Tottenham academy at the age of nine in 2004.',
        answer: 'joined',
        wrong: ['joins', 'has joined'],
        explain: 'Regular past simple: join → joined. The action is finished and in the past.'
      },
      {
        sentence: 'He ___ a bone in his foot during his second appearance for Norwich.',
        answer: 'broke',
        wrong: ['breaked', 'has broken'],
        explain: 'Irregular past simple: break → broke. Never "breaked" — this is a common mistake.'
      },
      {
        sentence: 'In 2014/15, he ___ the first Spurs player to score 30 goals since Gary Lineker.',
        answer: 'became',
        wrong: ['becomes', 'becomed'],
        explain: 'Irregular past simple: become → became. "Becomed" does not exist in English.'
      },
      {
        sentence: 'Kane ___ six goals at the 2018 World Cup, winning the Golden Boot.',
        answer: 'scored',
        wrong: ['score', 'was scoring'],
        explain: 'Regular past simple: score → scored. We use simple past (not was scoring) for a completed total.'
      },
      {
        sentence: 'After his loan spell at Leicester, Kane ___ back to Tottenham determined to fight for his place.',
        answer: 'went',
        wrong: ['goed', 'was gone'],
        explain: 'Irregular past simple: go → went. "Goed" is a very common learner error — go is irregular.'
      },
    ]
  },
      // ── SENTENCE BUILDER ──────────────────────────────────────
  sentences: [
     {
      words:  ['grew', 'London', 'in', 'Kane', 'Harry', 'east', 'in', 'up', 'Walthamstow'],
      answer: 'Harry Kane grew up in Walthamstow in east London',
      hint:   '👦🏻 Where did Harry Kane live as a child?',
    },
      {
      words:  ['Golden', 'World', 'with', 'the', 'Kane', 'won', 'Cup', 'Boot', 'goals', '2018', 'six'],
      answer: 'Kane won the 2018 World Cup Golden Boot with six goals.',
      hint:   '🥅 What did Harry win in 2018, and why?',
    },
     {
      words:  ['the', 'missed', 'never', 'penalty', 'Kane', 'had', 'a', 'Bundesliga', 'in'],
      answer: 'Kane had never missed a penalty in the Bundesliga',
      hint:   '🎯 Harry Kane had a great record for something until very recently.',
    },
     {
      words:  ['million', 'cost', 'transfer', 'Munich', 'hundred', 'to', 'euros', 'His', 'Bayern', 'one', 'around'],
      answer: 'His transfer to Bayern Munich cost around one hundred million euros.',
      hint:   '💰 What was the price of one Harry Kane to Germany?',
    },
     {
      words:  ['play', 'Kane', 'Hotspur', 'used', 'Harry', 'to', 'for', 'Tottenham'],
      answer: 'Harry Kane used to play for Tottenham Hotspur.',
      hint:   '🐓 Where was Harry before Bayern Munich?',
    },
    
  ],
  word_builder: [
    { word:'persevere',   definition:'To continue even in difficult circumstances' },
    { word:'resilient',   definition:'Able to recover easily and quickly from unpleasant or damaging events' },
    { word:'score',       definition:'To gain a goal or a point' },
    { word:'transfer',    definition:'To move from one place to another' },
  ],

 true_false: [
    {
      statement: 'Harry Kane had four loan spells before joining Tottenham\'s first team.',
      correct:   true,
      reveal:    '✅ TRUE! Leyton Orient, Millwall, Norwich City and Leicester City.',
    },
    {
      statement: 'Kane has a near 100% penalty scoring record in the Bundesliga.',
      correct:   true,
      reveal:    '✅ TRUE! He only recently missed after scoring all 23 of his Bundesliga penalties.',
    },
    {
      statement: 'Kane won the Bundesliga top scorer award in both his first two seasons.',
      correct:   true,
      reveal:    '❌ FALSE! He is the first player in Bundesliga history to achieve this.',
    },
    {
      statement: 'Kane has been England captain since 2022.',
      correct:   false,
      reveal:    '❌ FALSE! He has been England captain since 2018.',
    },
   ],
   },

     'shepherds-pie-intermediate': {
 
    // ── IDENTITY ─────────────────────────────────────────────
    id:    'shepherds-pie-intermediate',
    title: "How to Make an Authentic Shepherd's Pie",
    level: 'Intermediate',
    track: 'intermediate',
    emoji: '🥧',
    badge: 'Master Chef',
 
    // ── VOCAB ────────────────────────────────────────────────
    vocab: [
      {
        word:        'mince',
        definition:  'Meat that has been finely chopped or ground into small pieces',
        example:     'For a proper Shepherd\'s Pie, you need lamb ___ — not beef.',
        distractors: ['sear', 'double cream', 'mash'],
      },
      {
        word:        'sear',
        definition:  'To cook the surface of meat at high heat to brown it and develop flavour',
        example:     'The chef will ___ the lamb first to give it a caramelised colour.',
        distractors: ['mince', 'mash', 'boil'],
      },
      {
        word:        'caramelise',
        definition:  'To heat food until the natural sugars turn brown and develop a richer flavour',
        example:     'Cook the onions slowly until they ___ and turn golden and sweet.',
        distractors: ['mince', 'sear', 'mash'],
      },
      {
        word:        'mash',
        definition:  'To crush cooked food, especially potatoes, into a soft, smooth mixture',
        example:     'It\'s best to ___ the potatoes by hand rather than using an electric mixer.',
        distractors: ['sear', 'caramelise', 'layer'],
      },
      {
        word:        'double cream',
        definition:  'Very thick, rich cream with a high fat content, used in cooking and baking',
        example:     'Add a splash of ___ to the mashed potato for extra richness.',
        distractors: ['mince', 'tomato paste', 'egg yolk'],
      },
      {
        word:        'authentic',
        definition:  'Genuine and true to the original — not a copy or a simplified version',
        example:     'If you want an ___ Shepherd\'s Pie, use lamb mince, not beef.',
        distractors: ['traditional', 'popular', 'simple'],
      },
      {
        word:        'rigmarole',
        definition:  'A long and unnecessarily complicated process or procedure',
        example:     'The younger generation can\'t be fussed to go through the ___ of buying ingredients and preparing everything.',
        distractors: ['tradition', 'challenge', 'process'],
      },
      {
        word:        'consensus',
        definition:  'A general agreement among a group of people',
        example:     'There is a ___ that Shepherd\'s Pie has roots in both Britain and Ireland.',
        distractors: ['tradition', 'compromise', 'argument'],
      },
    ],
 
    // ── GRAMMAR 1: Passive Voice ─────────────────────────────
    grammar: {
      topic: 'Passive Voice — recipe and instructional English',
      rule:  'In recipe English, we use passive voice because the food (not the cook) is the subject. Form: is / are + past participle. "The potatoes are peeled." "The lamb is seared." This makes instructions sound objective and professional.',
      exercises: [
        {
          sentence: 'The potatoes ___ before the mash is prepared.',
          answer:   'are peeled and boiled',
          wrong:    ['peeled and boiled', 'peel and boil', 'is peeled and boiled'],
          explain:  'Present passive: are + past participle. The potatoes receive the action — they don\'t peel themselves! "Are peeled and boiled" — plural subject.'
        },
        {
          sentence: 'The lamb ___ at high heat to develop flavour and colour.',
          answer:   'is seared',
          wrong:    ['sears', 'was searing', 'has seared'],
          explain:  'Present passive: is + past participle. The lamb receives the action of searing. Recipe present passive describes a standard step.'
        },
        {
          sentence: 'The pie ___ in two layers — first the sauce, then the mash.',
          answer:   'is made',
          wrong:    ['makes', 'is making', 'has been making'],
          explain:  'Present passive: is + past participle. The pie is the subject receiving the action of being assembled.'
        },
        {
          sentence: 'The dish ___ at 180°C for approximately 15 minutes.',
          answer:   'is baked',
          wrong:    ['bakes', 'was baking', 'has baked'],
          explain:  'Present passive for a recipe instruction. "Is baked" — the dish receives the action of baking. Very standard in recipe writing.'
        },
      ],
    },
 
    // ── GRAMMAR 2: Second Conditional ────────────────────────
    grammar2: {
      topic: 'Second Conditional — warnings, advice and hypotheticals',
      rule:  'Second conditional: If + past simple → would + infinitive. Used for hypothetical situations, warnings and advice. "If you added too much milk, the mash would split." Formal English prefers "were" (not "was") in the if clause for hypotheticals.',
      exercises: [
        {
          sentence: 'If you ___ too much milk, the mash ___ watery.',
          answer:   'added / would become',
          wrong:    ['add / will become', 'had added / would have become', 'added / becomes'],
          explain:  'Second conditional: if + past simple (added) → would + infinitive (would become). A hypothetical warning — not a guaranteed fact.'
        },
        {
          sentence: 'If Shepherd\'s Pie ___ made with beef, it ___ a Cottage Pie.',
          answer:   'were / would be',
          wrong:    ['is / will be', 'was / would have been', 'had been / would be'],
          explain:  'Second conditional: "were" (formal subjunctive) + would + infinitive. Hypothetical — the pie is being discussed as a lamb dish, not a beef one.'
        },
        {
          sentence: 'If the chef ___ an electric mixer, the mash ___ too lumpy.',
          answer:   'used / would be',
          wrong:    ['had used / would have been', 'uses / will be', 'was using / were'],
          explain:  'Second conditional: if + past simple (used) → would + infinitive (would be). Advice/warning about a method the chef recommends against.'
        },
        {
          sentence: 'If you ___ lamb, you ___ making the authentic version.',
          answer:   'chose / would be',
          wrong:    ['choose / will be', 'had chosen / would have been', 'chose / are'],
          explain:  'Second conditional: if + past simple (chose) → would + infinitive (would be). Confirming the correct choice in a hypothetical frame.'
        },
      ],
    },
 
    // ── SENTENCE BUILDER ────────────────────────────────────
    sentences: [
      {
        words:  ['lamb','traditional','If','want','you','mince','use','it','super','to','be'],
        answer: 'If you want it to be super traditional use lamb mince',
        hint:   '🐑 The chef\'s clear recommendation about which meat to use'
      },
      {
        words:  ['leaves','electric','An','too','them','often','mixer','lumpy'],
        answer: 'An electric mixer often leaves them too lumpy',
        hint:   '🥔 Why the chef prefers to mash by hand'
      },
      {
        words:  ['were','accepted','cheap','Potatoes','as','widely','food','a','filling'],
        answer: 'Potatoes were widely accepted as a cheap filling food',
        hint:   '🌍 How potatoes became important in European cooking'
      },
      {
        words:  ['the','sauce','mash','is','The','over','spread'],
        answer: 'The mash is spread over the sauce',
        hint:   '🥧 How the two layers of Shepherd\'s Pie are assembled'
      },
      {
        words:  ['it','been','think','a','in','I','consensus','there','is','both','that','has'],
        answer: 'I think there is a consensus that it has been in both',
        hint:   '🇬🇧🇮🇪 The chef\'s view on whether it\'s British or Irish'
      },
    ],
 
    // ── WORD BUILDER ────────────────────────────────────────
    word_builder: [
      { word:'authentic',   definition:'Genuine and true to the original tradition' },
      { word:'caramelise',  definition:'To heat food until sugars turn brown and sweet' },
      { word:'consensus',   definition:'A general agreement among a group of people' },
      { word:'rigmarole',   definition:'An unnecessarily long and complicated process' },
      { word:'mince',       definition:'Finely ground or chopped meat' },
      { word:'sear',        definition:'To cook meat quickly at high heat to brown the surface' },
    ],
 
    // ── TRUE / FALSE ─────────────────────────────────────────
    true_false: [
      {
        statement: 'Shepherd\'s Pie should technically be made with lamb, because a shepherd looks after sheep.',
        correct:   true,
        reveal:    '✅ TRUE! The word "shepherd" = someone who looks after sheep. So Shepherd\'s Pie = lamb. If you use beef, it\'s technically called Cottage Pie.'
      },
      {
        statement: 'Cottage Pie and Shepherd\'s Pie are the same dish with the same ingredients.',
        correct:   false,
        reveal:    '❌ FALSE! The key difference is the meat. Shepherd\'s Pie = lamb. Cottage Pie = beef. Same mashed potato top, different filling.'
      },
      {
        statement: 'Potatoes were used in European cooking long before the 18th century.',
        correct:   false,
        reveal:    '❌ FALSE! Potatoes came from the Americas and were NOT widely accepted in Europe as a cheap filling food until the 18th century.'
      },
      {
        statement: 'The first written record of "cottage pie" dates from 1791.',
        correct:   true,
        reveal:    '✅ TRUE! It appears in the diary of English Parson James Woodforde in 1791 — and it was made with beef, not lamb.'
      },
      {
        statement: 'An electric mixer is the preferred tool for making the best mashed potato.',
        correct:   false,
        reveal:    '❌ FALSE! The chef clearly says it\'s best to mash by hand. An electric mixer often leaves the mash too lumpy.'
      },
      {
        statement: 'In the Irish version of the recipe, Guinness is sometimes added.',
        correct:   true,
        reveal:    '✅ TRUE! One speaker says: "In the Irish recipe, a lot of the time they put Guinness in there." This is one way the Irish version is said to differ from the British one.'
      },
      {
        statement: '"Caramelise" and "sear" mean exactly the same thing.',
        correct:   false,
        reveal:    '❌ FALSE! "Sear" means cooking at high heat to brown the surface. "Caramelise" specifically refers to sugars turning brown and developing a sweeter flavour. They overlap but are not the same.'
      },
      {
        statement: 'The chef says cheese is traditionally used as a topping on Shepherd\'s Pie.',
        correct:   false,
        reveal:    '❌ FALSE! The chef says cheese is NOT traditionally used. Egg yolk is acceptable, but cheese is not part of the classic recipe.'
      },
    ],
 
  },
   'merger-machine-tax': {
 
    // ── IDENTITY ─────────────────────────────────────────────
    id:    'merger-machine-tax',
    title: 'The Merger Machine',
    level: 'Tax English',
    track: 'tax',
    emoji: '🏦',
    badge: 'Deal Maker',
 
    // ── VOCAB ────────────────────────────────────────────────
    vocab: [
      {
        word:        'due diligence',
        definition:  'The investigation a buyer does before a deal — checking finances, tax, legal issues, and any hidden risks',
        example:     'TechCorp\'s ___ team uncovered €18m of unrecognised deferred tax liabilities in RivalSoft\'s accounts.',
        distractors: ['tax covenant', 'completion accounts', 'earn-out'],
      },
      {
        word:        'indemnity',
        definition:  'A promise by the seller to pay the buyer if a specific problem arises after the deal closes',
        example:     'TechCorp demanded an ___ from FounderCo covering any pre-completion tax liability that arose after the deal closed.',
        distractors: ['warranty', 'tax covenant', 'earn-out'],
      },
      {
        word:        'tax covenant',
        definition:  'A contractual promise about tax — often that the seller will cover any tax liabilities from before the sale',
        example:     'The ___ in the SPA required FounderCo to cover any tax liability of RivalSoft that arose before completion.',
        distractors: ['indemnity', 'warranty', 'deferred tax'],
      },
      {
        word:        'goodwill',
        definition:  'The amount paid for a business above the value of its identifiable assets — often includes brand, customers, and reputation',
        example:     'TechCorp paid €480m for RivalSoft. The premium above asset value sits on the balance sheet as ___.',
        distractors: ['deferred tax', 'uplift', 'step-up'],
      },
      {
        word:        'deferred tax',
        definition:  'Tax that is owed but not yet paid — it appears on the balance sheet as a liability',
        example:     'The accountants found €18m of ___ liabilities that had not been fully recognised in RivalSoft\'s accounts.',
        distractors: ['goodwill', 'indemnity', 'earn-out'],
      },
      {
        word:        'earn-out',
        definition:  'A payment to the seller that depends on future performance — if profits hit a target, the seller gets more money',
        example:     'FounderCo negotiated a €40m ___ payable in year three if EBITDA hit €60m.',
        distractors: ['indemnity', 'tax covenant', 'completion accounts'],
      },
      {
        word:        'step-up',
        definition:  'An increase in the tax value of an asset when it changes ownership — reduces future taxable gains',
        example:     'In an asset deal, TechCorp could have got a ___ in the tax base of RivalSoft\'s IT assets — but a share deal does not allow this.',
        distractors: ['uplift', 'goodwill', 'hive-down'],
      },
      {
        word:        'hive-down',
        definition:  'Moving assets from a parent company into a subsidiary before a sale — often used to structure a deal more efficiently',
        example:     'The tax advisors proposed a ___ of RivalSoft\'s main business into a new subsidiary before TechCorp acquired it.',
        distractors: ['carve-out', 'step-up', 'earn-out'],
      },
      {
        word:        'completion accounts',
        definition:  'The final accounts prepared on the day a deal closes — they show the exact financial position at completion',
        example:     '___ prepared at midnight on the closing date confirmed the exact cash, debt and working capital position of RivalSoft.',
        distractors: ['due diligence', 'tax covenant', 'warranty'],
      },
      {
        word:        'warranty',
        definition:  'A statement made by the seller that something is true — if it is wrong, the buyer can claim compensation',
        example:     'FounderCo gave TechCorp a ___ that RivalSoft\'s tax returns were accurate and there were no open investigations.',
        distractors: ['indemnity', 'tax covenant', 'earn-out'],
      },
      {
        word:        'carve-out',
        definition:  'A part of a business that is excluded or separated from a transaction',
        example:     'The parties agreed a ___ of RivalSoft\'s legacy hardware division, which would not be included in the deal.',
        distractors: ['hive-down', 'step-up', 'earn-out'],
      },
      {
        word:        'uplift',
        definition:  'An increase in value — tax uplift means the taxable base of an asset is increased, reducing future tax',
        example:     'TechCorp\'s model assumed a tax ___ on RivalSoft\'s IP assets — but the share deal structure made this unavailable.',
        distractors: ['step-up', 'goodwill', 'deferred tax'],
      },
    ],
 
    // ── GRAMMAR 1: Passive Voice ──────────────────────────────
    // M&A and tax documents rely heavily on passive voice
    grammar: {
      topic: 'Passive Voice in deal and tax documentation',
      rule:  'In deal documentation and tax advice, passive voice focuses on what happened — not who did it. Form: is/are/was/were + past participle. "The price was agreed." "Tax is deducted." "Goodwill is recorded." Very common in SPAs, due diligence reports and tax opinions.',
      exercises: [
        {
          sentence: 'The €18m deferred tax liability ___ in RivalSoft\'s accounts before due diligence.',
          answer:   'had not been recognised',
          wrong:    ['was not recognising', 'did not recognise', 'has not recognised'],
          explain:  'Past perfect passive: had not been + past participle. The liability existed before the investigation — it just wasn\'t shown.',
        },
        {
          sentence: 'TechCorp\'s goodwill of €480m ___ on the balance sheet as a non-deductible intangible.',
          answer:   'will be recorded',
          wrong:    ['records', 'is recording', 'was recording'],
          explain:  'Future passive: will be + past participle. This is what will happen after the deal closes.',
        },
        {
          sentence: 'The tax covenant ___ for at least four years to cover the German assessment period.',
          answer:   'should be extended',
          wrong:    ['should extend', 'must extending', 'is extending'],
          explain:  'Modal passive: should be + past participle. Advice — the covenant ought to receive the action of being extended.',
        },
        {
          sentence: 'Under § 8c KStG, loss carry-forwards ___ when more than 50% of shares change hands.',
          answer:   'can be cancelled',
          wrong:    ['can cancel', 'are cancelling', 'have cancelled'],
          explain:  'Modal passive for a general legal rule: can be + past participle. The losses receive the action — they can be cancelled by the rule.',
        },
        {
          sentence: 'The earn-out payment ___ as employment income if the founder remains an employee.',
          answer:   'may be recharacterised',
          wrong:    ['may recharacterise', 'is recharacterising', 'could have recharacterised'],
          explain:  'Modal passive: may be + past participle. The payment is the subject — it might receive the action of recharacterisation.',
        },
      ],
    },
 
    // ── GRAMMAR 2: Third Conditional ─────────────────────────
    grammar2: {
      topic: 'Third Conditional — deal analysis and hypothetical advice',
      rule:  'Third conditional: If + past perfect → would have + past participle. In M&A, used constantly to analyse what would have been different if the structure had been different. "If TechCorp had chosen an asset deal, it would have obtained a tax step-up."',
      exercises: [
        {
          sentence: 'If TechCorp ___ an asset deal, it ___ a step-up in the tax base of RivalSoft\'s assets.',
          answer:   'had chosen / would have obtained',
          wrong:    ['chose / would obtain', 'had chosen / would obtain', 'chose / would have obtained'],
          explain:  'Third conditional: If + past perfect (had chosen) → would have + past participle (would have obtained). The deal was a share deal — this imagines the alternative.',
        },
        {
          sentence: 'If the founder ___ any post-completion role, the earn-out recharacterisation risk ___ much lower.',
          answer:   'had not accepted / would have been',
          wrong:    ['didn\'t accept / would be', 'had not accepted / would be', 'didn\'t accept / would have been'],
          explain:  'Third conditional negative: If + past perfect negative → would have + past participle. Imagining a different set of facts.',
        },
        {
          sentence: 'If TechCorp ___ the deferred tax liabilities, it ___ €18m more than the business was worth.',
          answer:   'hadn\'t discovered / would have paid',
          wrong:    ['didn\'t discover / would pay', 'hadn\'t discovered / would pay', 'didn\'t discover / would have paid'],
          explain:  'Third conditional: the discovery was the key value-protecting action. Without it, TechCorp would have overpaid.',
        },
        {
          sentence: 'If FounderCo ___ a longer covenant, TechCorp ___ better protection against year-four tax assessments.',
          answer:   'had agreed / would have had',
          wrong:    ['agreed / would have', 'had agreed / would have', 'agreed / would have had'],
          explain:  'Third conditional for a negotiation counterfactual. FounderCo refused the longer covenant — this imagines the outcome if they had agreed.',
        },
      ],
    },
 
    // ── SENTENCE BUILDER ────────────────────────────────────
    sentences: [
      {
        words:  ['deal', 'asset', 'a', 'step-up', 'allows', 'in', 'tax', 'the', 'base', 'buyer', 'an', 'the'],
        answer: 'an asset deal allows the buyer a step-up in the tax base',
        hint:   '🏗️ Why might TechCorp prefer an asset deal to a share deal?',
      },
      {
        words:      ['founder', 'the', 'stays', 'if', 'earn-out', 'employed', 'the', 'be', 'recharacterised', 'may'],
        answer:     'if the founder stays employed the earn-out may be recharacterised',
        altAnswers: ['the earn-out may be recharacterised if the founder stays employed'],
        hint:       '⚠️ The key earn-out tax risk — what triggers it?',
      },
      {
        words:  ['period', 'the', 'years', 'German', 'is', 'assessment', 'four', 'standard'],
        answer: 'the standard German assessment period is four years',
        hint:   '📅 Why TechCorp needs more than a three-year indemnity',
      },
      {
        words:  ['company', 'indemnity', 'future', 'us', 'any', 'gave', 'losses', 'cover', 'an', 'the', 'to'],
        answer: 'the company gave us an indemnity to cover any future losses',
        hint:   '⚖️ Start with the group of people who are providing the protection',
      },
    ],
 
    // ── WORD BUILDER ────────────────────────────────────────
    word_builder: [
      { word:'indemnity',   definition:'A promise to pay if a specific loss arises' },
      { word:'covenant',    definition:'A contractual promise — often about tax obligations' },
      { word:'diligence',   definition:'Careful investigation before making a commitment' },
      { word:'goodwill',    definition:'The premium paid above the value of identifiable assets' },
      { word:'completion',  definition:'The moment a deal formally closes and ownership transfers' },
      { word:'warranty',    definition:'A factual statement that gives rise to a claim if untrue' },
    ],
 
    // ── TRUE / FALSE ─────────────────────────────────────────
    true_false: [
      {
        statement: 'In a share deal, the buyer can obtain a step-up in the tax base of the target\'s assets.',
        correct:   false,
        reveal:    '❌ FALSE! A step-up in basis is only available in an asset deal. In a share deal, the buyer inherits the existing tax base — no reset. This is one of the biggest tax disadvantages of share deals for buyers.',
      },
      {
        statement: 'Goodwill on an asset purchase in Germany can be amortised for tax over 15 years.',
        correct:   true,
        reveal:    '✅ TRUE! Goodwill arising on an asset deal IS tax-deductible in Germany — amortised over 15 years. This is exactly why buyers often prefer asset deals, and why sellers resist them.',
      },
      {
        statement: 'A tax indemnity and a tax warranty give the buyer exactly the same level of protection.',
        correct:   false,
        reveal:    '❌ FALSE! An indemnity is pound-for-pound — if the liability arises, the seller pays, full stop. A warranty requires the buyer to PROVE loss. Indemnities are much stronger protection, especially for known tax risks.',
      },
      {
        statement: 'If an earn-out payment is linked to a founder\'s continued employment, it may be taxed at income tax rates rather than capital gains rates.',
        correct:   true,
        reveal:    '✅ TRUE! This is a classic M&A tax trap. German tax authorities look at economic reality — if the payment is really for services, it gets taxed as employment income (up to 45%), not as a capital gain (flat 25%).',
      },
      {
        statement: 'Under § 8c KStG, German loss carry-forwards are always fully preserved when shares change hands.',
        correct:   false,
        reveal:    '❌ FALSE! § 8c KStG can cancel loss carry-forwards when more than 50% of shares change hands. There ARE exceptions (the hidden reserves clause, the restructuring clause) — but losses are absolutely not automatically preserved.',
      },
      {
        statement: 'Completion accounts determine the final purchase price by showing exact cash, debt and working capital at closing.',
        correct:   true,
        reveal:    '✅ TRUE! This is exactly what completion accounts do. They can lead to price adjustments up or down versus the agreed headline price — so they are always heavily negotiated.',
      },
      {
        statement: '"Earn-out" means TechCorp gets money back if RivalSoft misses its targets.',
        correct:   false,
        reveal:    '❌ FALSE! An earn-out is additional money paid TO THE SELLER if targets are hit — it\'s not a refund mechanism for the buyer. It bridges the gap between what buyer and seller think the business is currently worth.',
      },
      {
        statement: 'A tax covenant in an SPA is different from a warranty — it operates on an indemnity basis.',
        correct:   true,
        reveal:    '✅ TRUE! A tax covenant is effectively a specific tax indemnity — if a pre-completion tax liability arises, the seller pays pound-for-pound, without the buyer needing to prove consequential loss. Much stronger than a general warranty.',
      },
    ],
 
  },

   'weekly-drop-issue-007': {
  id:    'weekly-drop-issue-007',
  title: "The Weekly Drop - Issue 007 - The €10M Gift: One Man vs Munich's Housing Crisis",
  level: 'All Levels',
  track: 'weekly-drop',
  emoji: '🏠',
  badge: 'Good Neighbour',

  vocab: [
    { word:'housing crisis',       definition:'A situation where there are not enough affordable homes for people who need them.',          example:'Germany faces a serious ___ with a shortage of around 1.4 million homes.',           distractors:['donation','plot','non-profit'] },
    { word:'donation',             definition:'Something given freely without expecting payment in return.',                               example:'Otto\'s ___ of his land to the foundation was worth around €10 million.',             distractors:['housing crisis','soaring','plot'] },
    { word:'affordable housing',   definition:'Homes with rents or prices low enough for people on modest incomes to afford.',            example:'The foundation will build around 20 units of ___ on the donated land.',              distractors:['non-profit','multi-generational','soaring'] },
    { word:'non-profit',           definition:'An organisation that does not aim to make money for owners or shareholders.',              example:'The ___ foundation will reinvest any surplus back into creating more homes.',          distractors:['affordable housing','plot','social responsibility'] },
    { word:'social responsibility',definition:'The duty to act in a way that benefits society, not just yourself.',                       example:'His decision is a powerful example of ___ in the property market.',                   distractors:['donation','soaring','non-profit'] },
    { word:'soaring',              definition:'Rising very fast and steeply — used for prices, demand or costs.',                        example:'___ rents mean young families can no longer afford to live in Munich.',               distractors:['housing crisis','multi-generational','plot'] },
    { word:'multi-generational',   definition:'Involving or designed for people of different ages living or working together.',           example:'The project promotes ___ living — young adults, families and older residents together.',distractors:['affordable housing','soaring','non-profit'] },
    { word:'plot',                 definition:'A piece of land, especially one intended for building on.',                                example:'Otto\'s 3,000 m² ___ in Munich is estimated to be worth around €10 million.',         distractors:['donation','housing crisis','social responsibility'] },
    { word:'priced out',           definition:'When prices rise so high that someone can no longer afford to live somewhere.',            example:'Young families are being ___ of Munich by soaring rents.',                           distractors:['soaring','plot','non-profit'] },
  ],

  grammar: {
    topic: 'Passive Voice — present and past passive in news English',
    rule:  'Present passive: is/are + past participle. Past passive: was/were + past participle. In news and report writing, passive focuses on what happened rather than who did it. "The land was donated." "Homes are planned." Very common in journalism and social policy writing.',
    exercises: [
      { sentence:'The 3,000 m² plot ___ to a non-profit foundation by Otto Gugger.',  answer:'was donated',    wrong:['donated','is donating','has donated'],           explain:'Past passive: was + past participle. The plot received the action — it was donated.' },
      { sentence:'Around 20 affordable homes ___ on the site over the coming years.',  answer:'are planned',    wrong:['plan','were planning','have planned'],           explain:'Present passive for an ongoing arrangement: are + past participle.' },
      { sentence:'Young families ___ of Munich by soaring rents every year.',          answer:'are being priced out', wrong:['price out','were priced out','have priced out'], explain:'Present continuous passive: are being + past participle. An ongoing current process.' },
      { sentence:'Germany ___ short of around 1.4 million homes.',                    answer:'is estimated to be', wrong:['estimates','was estimating','has estimated'], explain:'Passive with infinitive: is estimated to be — very common in journalism for reported figures.' },
    ],
  },

  grammar2: {
    topic: 'Collocations — verbs that go with nouns in housing/economics news',
    rule:  'In economics and news English, certain verbs collocate (go together) with certain nouns. "Prices REACH a level." "Costs DRIVE a shortage." "A decision STANDS AS an example." Learning these verb+noun pairs makes your English sound natural and professional.',
    exercises: [
      { sentence:'Rents for small apartments can ___ €1,500 per month in Munich.',         answer:'reach',  wrong:['arrive at','come to','touch'],    explain:'"Reach" is the standard collocation with prices and levels. Not "arrive" or "come to" in formal written English.' },
      { sentence:'Rising construction costs have ___ Germany\'s housing shortage.',        answer:'driven', wrong:['caused','made','done'],            explain:'"Drive" is the journalistic verb for forces that produce crises and trends. More powerful than "cause" alone.' },
      { sentence:'His contribution ___ a powerful example of social responsibility.',      answer:'stands as', wrong:['is like','looks like','seems'], explain:'"Stand as" means to serve as an example or symbol. Fixed phrase — very common in opinion and analysis writing.' },
      { sentence:'The foundation will ___ an impact on the community\'s future.',          answer:'make',   wrong:['do','take','give'],               explain:'"Make an impact" is the standard collocation. "Make a difference" also works. Never "do an impact".' },
    ],
  },

  sentences: [
    { words:['plot','donated','Otto','his','foundation','to','a','non-profit'],           answer:'Otto donated his plot to a non-profit foundation',          hint:'🏠 What did Otto Gugger do with his land?' },
    { words:['housing','a','human','basic','serve','should','need','as'],                 answer:'housing should serve as a basic human need',                hint:'💬 What does Otto believe about housing?' },
    { words:['out','young','priced','being','of','Munich','are','families'],              answer:'young families are being priced out of Munich',             hint:'📈 What is happening to families because of soaring rents?' },
    { words:['million','Germany','short','1.4','homes','is','of'],                        answer:'Germany is short of 1.4 million homes',                     hint:'🏗️ What is the scale of Germany\'s housing shortage?' },
  ],

  word_builder: [
    { word:'donation',      definition:'Giving something freely without expecting payment' },
    { word:'affordable',    definition:'Cheap enough for people on modest incomes' },
    { word:'generational',  definition:'Relating to people of a particular age group' },
    { word:'soaring',       definition:'Rising very fast and steeply' },
    { word:'non-profit',    definition:'Not aiming to make money for owners' },
    { word:'responsibility',definition:'A duty to act well toward others' },
  ],

  true_false: [
    { statement:'Otto Gugger sold his land to a property developer for €10 million.',                              correct:false, reveal:'❌ FALSE! He DONATED it — gave it away freely. He received nothing financially. That is what makes the story remarkable.' },
    { statement:'The foundation "Daheim im Viertel" means roughly "At Home in the Neighbourhood" in German.',      correct:true,  reveal:'✅ TRUE! "Daheim" = at home, "im Viertel" = in the neighbourhood. A name that perfectly captures the community spirit of the project.' },
    { statement:'Germany currently has a shortage of around 1.4 million homes.',                                   correct:true,  reveal:'✅ TRUE! Rising construction costs and insufficient building have made Germany\'s housing crisis worse year by year.' },
    { statement:'"Soaring" means falling quickly.',                                                                correct:false, reveal:'❌ FALSE! "Soaring" means rising very fast and steeply — like a bird going UP. "Plummeting" is the opposite and means falling sharply.' },
    { statement:'The project plans to include multi-generational living — people of all ages together.',            correct:true,  reveal:'✅ TRUE! "Multi-generational" means different generations — young adults, families and older people — sharing communal spaces.' },
    { statement:'"Priced out" means you negotiated a lower price than the asking price.',                          correct:false, reveal:'❌ FALSE! "Priced out" means prices rose so HIGH that you can NO LONGER afford something. The opposite of a good deal.' },
    { statement:'A non-profit organisation distributes its profits to shareholders.',                               correct:false, reveal:'❌ FALSE! Non-profit means any surplus is reinvested into the mission — not paid to shareholders or owners. That is the whole point.' },
    { statement:'"Stand as" means to serve as an example or symbol of something.',                                 correct:true,  reveal:'✅ TRUE! "His decision stands as a powerful example of social responsibility." A very useful phrase for formal writing and analysis.' },
  ],
},

   'worldcup2026-intermediate': {
  id:    'worldcup2026-intermediate',
  title: 'World Cup 2026: Bigger, Bolder, Better?',
  level: 'Intermediate',
  track: 'intermediate',
  emoji: '⚽',
  badge: 'World Cup Expert',

  vocab: [
    { word:'expand',         definition:'To make something larger or wider in size, scope, or number',                   example:'FIFA voted to ___ the tournament from 32 to 48 teams.',                            distractors:['reduce','format','govern'] },
    { word:'format',         definition:'The way something is organised or arranged — its structure',                    example:'Under the new ___, there will be 104 matches at this World Cup.',                    distractors:['expand','knockout','decider'] },
    { word:'knockout phase', definition:'The part of a tournament where losing a match means elimination',               example:'The top teams move into a new 32-team ___ ___.',                                    distractors:['group stage','final round','league phase'] },
    { word:'compact',        definition:'Small and efficient — taking up less space than expected',                      example:'That is a huge change from the ___ 2022 tournament in Qatar.',                      distractors:['expanded','crowded','organised'] },
    { word:'host cities',      definition:'A city officially chosen to hold a major event',                               example:'The games will be played across 16 ___ ___ in three countries.',                    distractors:['final venue','stadium city','home ground'] },
    { word:'governing body', definition:'The official organisation responsible for controlling a sport or activity',     example:'Football\'s ___ ___ voted to expand the tournament.',                               distractors:['host country','advisory panel','home nation'] },
    { word:'realistically',  definition:'In a practical way that is actually possible, not just theoretical',           example:'A fan could ___ attend two or three matches in a single day in Qatar.',              distractors:['theoretically','officially','approximately'] },
    { word:'decider',        definition:'The final match or event that determines who wins overall',                     example:'By the time we get to the ___ at MetLife Stadium, the champions will have played eight matches.', distractors:['final stage','knockout','decider round'] },
  ],

  grammar: {
    topic: 'Passive Voice — present, past and future passive',
    rule:  'Present passive: is/are + past participle. Past passive: was/were + past participle. Future passive: will be + past participle. Use passive when what happened matters more than who did it — essential in news, sports journalism and official announcements.',
    exercises: [
      { sentence:'The tournament ___ from 32 to 48 teams in 2026.',         answer:'was expanded',    wrong:['expanded','are expanded','expands'],           explain:'Past passive: was + past participle. The tournament received the action.' },
      { sentence:'48 teams ___ into 12 groups of four.',                    answer:'will be split',   wrong:['split','are splitting','will split'],                explain:'Future passive: will be + past participle. The tournament hasn\'t happened yet.' },
      { sentence:'The final ___ at MetLife Stadium on July the 19th.',      answer:'will be played',  wrong:['plays','is played','will play'],                     explain:'Future passive for a scheduled event. The final receives the action of being played.' },
      { sentence:'Qatar 2022 ___ as a very compact, geographically small tournament.', answer:'is remembered', wrong:['remembered','was remembering','has remembered'], explain:'Present passive for a general ongoing truth or reputation.' },
    ],
  },

  grammar2: {
    topic: 'Future Perfect — will have + past participle',
    rule:  'Future perfect: will have + past participle. We use it for an action that will be COMPLETED before a specific future point. "By the time the final is played, the champions will have played eight matches." Very useful for sports commentary and results.',
    exercises: [
      { sentence:'By July 19th, the champions ___ eight matches.',                    answer:'will have played',   wrong:['will play','played','have played'],             explain:'Future perfect: will have + past participle. Completed before a future point.' },
      { sentence:'By the end of the group stage, each team ___ at least three games.',answer:'will have played',   wrong:['will play','plays','has played'],               explain:'Future perfect. Three games = completed before the end of the group stage.' },
      { sentence:'By the time you read this, FIFA ___ the host cities already.',      answer:'will have announced',wrong:['will announce','announced','has announced'],     explain:'Future perfect for something completed before a future reading moment.' },
      { sentence:'Argentina ___ seven matches by the time they won Qatar 2022.',             answer:'had played',         wrong:['will have played','played','have played'],      explain:'Past perfect (not future perfect) — this refers to a completed past event before another past event.' },
    ],
  },

  sentences: [
    { words:['voted','FIFA','the','expand','to','tournament'], answer:'FIFA voted to expand the tournament', hint:'🏛️ What decision did FIFA make?' },
    { words:['matches','104','will','there','be'], answer:'there will be 104 matches', hint:'📊 How many games in total?' },
    { words:['eight','will','played','champions','have','The','matches'], answer:'The champions will have played eight matches', hint:'🏆 How many matches does the winner need to play?' },
    { words:['three','in','hosted','is','The','countries','tournament'], answer:'The tournament is hosted in three countries', hint:'🌎 Where is the 2026 World Cup?' },
  ],

  word_builder: [
    { word:'knockout',   definition:'Losing means you are eliminated — you are out' },
    { word:'compact',    definition:'Small and neatly packed — very close together' },
    { word:'governing',  definition:'Controlling and managing officially' },
    { word:'decider',    definition:'The match that determines the final winner' },
    { word:'expand',     definition:'To make larger or wider' },
    { word:'format',     definition:'The structure or layout of something' },
  ],

  true_false: [
    { statement:'The World Cup 2026 will feature 48 teams — 16 more than in 2022.',              correct:true,  reveal:'✅ TRUE! FIFA expanded from 32 to 48 teams. That is exactly 16 extra countries.' },
    { statement:'There will be FEWER matches at World Cup 2026 than at Qatar 2022.',              correct:false, reveal:'❌ FALSE! There will be 104 matches — 40 MORE than Qatar 2022. More teams = more games.' },
    { statement:'The 2026 World Cup is co-hosted by three countries: USA, Mexico and Canada.',    correct:true,  reveal:'✅ TRUE! 16 host cities spread across three countries — a first for the World Cup.' },
    { statement:'In Qatar 2022, a fan could realistically watch three matches in one day.',        correct:true,  reveal:'✅ TRUE! Qatar is tiny — all stadiums were very close together. That unique situation is gone in 2026.' },
    { statement:'The 48 teams will be divided into 8 groups of six.',                            correct:false, reveal:'❌ FALSE! It is 12 groups of four. 48 ÷ 4 = 12. The top two from each group plus the eight best third-place teams advance.' },
    { statement:'The World Cup 2026 final will be held at MetLife Stadium.',                     correct:true,  reveal:'✅ TRUE! MetLife Stadium in New York / New Jersey — on July 19th.' },
    { statement:'Spain are the bookmakers\' favourites to win the 2026 World Cup.',              correct:true,  reveal:'✅ TRUE! Spain are listed at 5/1 — the shortest odds, making them the favourite ahead of France at 6/1.' },
    { statement:'The 2026 World Cup champions will play SEVEN matches — the same as in 2022.',   correct:false, reveal:'❌ FALSE! They will play EIGHT — one more than before, because of the new round of 32. Argentina won Qatar 2022 playing seven.' },
  ],
},

   'worldcup2026-beginner': {
 
  id:    'worldcup2026-beginner',
  title: 'World Cup 2026: The Biggest Ever!',
  level: 'Beginner',
  track: 'beginner',
  emoji: '⚽',
  badge: 'Football Fan',
 
  vocab: [
    { word:'team',      definition:'A group of players who play together',                            example:'England is a very good ___ with excellent players.',                    distractors:['match','stadium','trophy'] },
    { word:'match',     definition:'A game between two teams',                                        example:'Spain plays France in a very important ___ tonight.',                  distractors:['team','score','final'] },
    { word:'stadium',   definition:'A large sports ground with seats for people to watch',            example:'The fans go to the ___ to watch the game.',                            distractors:['team','platform','match'] },
    { word:'final',     definition:'The last and most important match in a competition',              example:'Spain and France play in the World Cup ___ on July 19th.',             distractors:['match','score','team'] },
    { word:'favourite', definition:'The team or person that people think will win',                   example:'Spain is the ___ to win the 2026 World Cup.',                          distractors:['score','host','team'] },
    { word:'score',     definition:'The number of goals each team has in a match',                   example:'The ___ is 2-1 to England at half time.',                              distractors:['match','final','trophy'] },
    { word:'host',      definition:'A country or city that organises a big event',                   example:'The USA, Mexico and Canada ___ the World Cup in 2026.',                distractors:['score','team','trophy'] },
    { word:'trophy',    definition:'A prize — usually a cup or medal — for the winner',              example:'The winning team lifts the World Cup ___.',                            distractors:['score','final','match'] },
  ],
 
  grammar: {
    topic: 'There is / There are',
    rule:  'Use THERE IS for one thing: "There IS one final." Use THERE ARE for more than one: "There ARE 48 teams." For sports teams, use ARE (they are a group of people): "Spain ARE the favourites."',
    exercises: [
      { sentence:'___ 48 teams in the World Cup.',             answer:'There are',   wrong:['There is','They are','It are'],         explain:'"48 teams" is plural — more than one — so we use THERE ARE.' },
      { sentence:'The final ___ at MetLife Stadium.',          answer:'is',          wrong:['are','have','is being'],                explain:'The final = one thing → IS. "The final IS at MetLife Stadium."' },
      { sentence:'Spain ___ the favourites to win.',           answer:'are',         wrong:['is','has','were'],                      explain:'Spain = a team = a group of people → ARE. "Spain ARE the favourites."' },
      { sentence:'___ only one trophy — the World Cup.',       answer:'There is',    wrong:['There are','They is','It have'],        explain:'One trophy = singular → THERE IS.' },
      { sentence:'The World Cup ___ in three countries.',      answer:'is',          wrong:['are','have','is being'],                explain:'The World Cup = one event → IS. Even though three countries are involved.' },
    ],
  },
 
  grammar2: {
    topic: 'Prepositions with dates and places: IN / ON / AT',
    rule:  'Use ON with dates and days: "The final IS ON July 19th." Use IN with countries and cities: "The tournament is IN the USA." Use AT with specific venues: "The final is AT MetLife Stadium."',
    exercises: [
      { sentence:'The final is ___ July 19th.',                answer:'on',          wrong:['in','at','by'],                        explain:'Specific date → ON. "The final is ON July 19th."' },
      { sentence:'The World Cup is ___ the USA, Mexico and Canada.', answer:'in',   wrong:['on','at','from'],                      explain:'Countries → IN. "The tournament is IN three countries."' },
      { sentence:'The final is ___ MetLife Stadium.',          answer:'at',          wrong:['in','on','from'],                      explain:'Specific venue → AT. "The final is AT MetLife Stadium."' },
      { sentence:'Argentina won ___ 2022.',                    answer:'in',          wrong:['on','at','by'],                        explain:'Year → IN. "Argentina won IN 2022."' },
    ],
  },
 
  sentences: [
    { words:['48','are','World','There','teams','Cup','the','in'],                      answer:'There are 48 teams in the World Cup',                  hint:'⚽ How many teams? Use "there are".' },
    { words:['in','countries','is','played','tournament','three','The'],                answer:'The tournament is played in three countries',          hint:'🌎 Where is the World Cup?' },
    { words:['final','is','The','July','on','19th'],                                   answer:'The final is on July 19th',                           hint:'📅 When is the final? Use "is on" + date.' },
    { words:['favourites','are','to','Spain','win','the'],                             answer:'Spain are the favourites to win',                     hint:'🏆 Who do people think will win?' },
  ],
 
  word_builder: [
    { word:'trophy',    definition:'A prize for the winner' },
    { word:'stadium',   definition:'A large sports ground with seats' },
    { word:'favourite', definition:'The team people think will win' },
    { word:'match',     definition:'A game between two teams' },
    { word:'final',     definition:'The last and most important match' },
  ],
 
  true_false: [
    { statement:'There are 48 teams in the 2026 World Cup.',                                    correct:true,  reveal:'✅ TRUE! In 2022, there were 32 teams. Now there are 48 — that is 16 more countries!' },
    { statement:'The World Cup 2026 is only in the USA.',                                      correct:false, reveal:'❌ FALSE! Three countries are hosts: the USA, Mexico AND Canada. 16 cities across three countries!' },
    { statement:'Spain are the favourites to win the 2026 World Cup.',                          correct:true,  reveal:'✅ TRUE! Spain are the number one favourites. Their odds are 5/1.' },
    { statement:'There are 200 matches in the 2026 World Cup.',                                correct:false, reveal:'❌ FALSE! There are 104 matches — not 200. In 2022, there were only 64 matches.' },
    { statement:'The World Cup final is on July 19th.',                                        correct:true,  reveal:'✅ TRUE! The final is on July 19th, 2026, at MetLife Stadium in New York.' },
    { statement:'Argentina won the World Cup in 2022.',                                        correct:true,  reveal:'✅ TRUE! Argentina beat France in the 2022 final in Qatar. Messi finally won his World Cup trophy!' },
    { statement:'Kylian Mbappé is the favourite to score the most goals.',                     correct:true,  reveal:'✅ TRUE! Mbappé is the favourite top scorer at 6/1. Better odds than Ronaldo at 22/1.' },
    { statement:'The World Cup trophy weighs 6 kilograms.',                                    correct:true,  reveal:'✅ TRUE! The World Cup trophy is solid gold and weighs 6 kilograms. Very heavy to lift!' },
  ],
 
},

   'worldcup2026-kids': {
  id:    'worldcup2026-kids',
  title: 'World Cup 2026: The Biggest Ever!',
  level: 'Kids',
  track: 'kids',
  emoji: '⚽',
  badge: 'Football Kid',

  vocab: [
    { word:'team',      definition:'A group of players who play together',                   example:'Brazil is a very good ___ with amazing players.',           distractors:['match','stadium','trophy'] },
    { word:'match',     definition:'A game between two teams',                               example:'Spain plays France in a big ___ tonight.',                  distractors:['team','score','final'] },
    { word:'stadium',   definition:'A big sports building with lots of seats for fans',      example:'The fans go to the ___ to watch the game.',                 distractors:['team','platform','match'] },
    { word:'final',     definition:'The last and most important match in a competition',     example:'The World Cup ___ is on July 19th in New York.',             distractors:['match','score','team'] },
    { word:'favourites', definition:'The team or person that people think will win',          example:'Spain are the ___ to win the 2026 World Cup.',             distractors:['score','host','team'] },
    { word:'host',      definition:'A country or city that organises a big event',           example:'The USA, Mexico and Canada ___ the World Cup in 2026.',     distractors:['score','team','trophy'] },
    { word:'trophy',    definition:'A golden prize — the cup the winner holds up!',         example:'The winning team lifts the World Cup ___.',                  distractors:['score','final','match'] },
    { word:'goal',      definition:'When the ball goes in the net — 1 point!',              example:'Messi scored a brilliant ___ in the final.',                 distractors:['match','team','fan'] },
  ],

  grammar: {
    topic: 'There is / There are',
    rule:  'Use THERE IS for one thing: "There IS one final." Use THERE ARE for more than one: "There ARE 48 teams." For teams and countries, use ARE: "Spain ARE the favourites."',
    exercises: [
      { sentence:'___ 48 teams in the World Cup.',          answer:'There are',  wrong:['There is','They are','It is'],    explain:'"48 teams" is more than one, so we use THERE ARE.' },
      { sentence:'The final ___ at MetLife Stadium.',       answer:'is',         wrong:['are','have','am'],                explain:'The final = one event, so we use IS.' },
      { sentence:'Spain ___ the favourites to win.',       answer:'are',        wrong:['is','has','was'],                 explain:'Spain = a team = a group of people, so we use ARE.' },
      { sentence:'___ only one golden trophy.',             answer:'There is',   wrong:['There are','They are','It are'],  explain:'One trophy = THERE IS.' },
    ],
  },

  grammar2: {
    topic: 'Prepositions: IN / ON / AT with dates and places',
    rule:  'ON + dates and days: "The final is ON July 19th." IN + countries and cities: "The tournament is IN the USA." AT + venues: "The final is AT MetLife Stadium."',
    exercises: [
      { sentence:'The final is ___ July 19th.',                    answer:'on',  wrong:['in','at','by'],    explain:'Date → ON. "The final is ON July 19th."' },
      { sentence:'The World Cup is ___ the USA, Mexico and Canada.',answer:'in',  wrong:['on','at','from'],  explain:'Countries → IN. "The tournament is IN three countries."' },
      { sentence:'The final is ___ MetLife Stadium.',              answer:'at',  wrong:['in','on','for'],   explain:'Specific venue → AT. "The final is AT MetLife Stadium."' },
      { sentence:'Argentina won ___ 2022.',                        answer:'in',  wrong:['on','at','by'],    explain:'Year → IN. "Argentina won IN 2022."' },
    ],
  },

  sentences: [
    { words:['are','48','There','in','teams','Cup','World','the'],    answer:'There are 48 teams in the World Cup',   hint:'⚽ Use "There are" — it\'s more than one!' },
    { words:['are','favourites','Spain','the','to','win'],           answer:'Spain are the favourites to win',      hint:'💃🏽 Spain ARE — they are a group!' },
    { words:['final','is','New','in','The','York'],                   answer:'The final is in New York',              hint:'🗽 The final IS in...' },
    { words:['won','Cup','2022','in','World','Argentina','the'],      answer:'Argentina won the World Cup in 2022',   hint:'🥇 Argentina WON...' },
  ],

  word_builder: [
    { word:'trophy',    definition:'The golden prize for the winner' },
    { word:'stadium',   definition:'A big sports building with seats' },
    { word:'favourite', definition:'The team people think will win' },
    { word:'match',     definition:'A game between two teams' },
    { word:'final',     definition:'The last, most important match' },
    { word:'goal',      definition:'When the ball goes in the net' },
  ],

  true_false: [
    { statement:'There are 48 teams in the 2026 World Cup.',                    correct:true,  reveal:'✅ TRUE! 48 teams! That is 16 more than 2022. More football! ⚽' },
    { statement:'The 2026 World Cup is only in the USA.',                       correct:false, reveal:'❌ FALSE! THREE countries: USA 🗽, Mexico 🌮🌶️ and Canada 🍁!' },
    { statement:'Argentina won the World Cup in 2022.',                         correct:true,  reveal:'✅ TRUE! Messi lifted the golden trophy! 🥇🏆' },
    { statement:'The World Cup final is in London.',                            correct:false, reveal:'❌ FALSE! The final is in NEW YORK 🗽 at MetLife Stadium!' },
    { statement:'Brazil has won the World Cup 5 times.',                        correct:true,  reveal:'✅ TRUE! Brazil 🌅🌴 are the most successful team EVER! ⚽⚽⚽⚽⚽' },
    { statement:'There are 200 matches in the 2026 World Cup.',                correct:false, reveal:'❌ FALSE! There are 104 matches — not 200!' },
    { statement:'Japan fans clean up the stadium after every match.',           correct:true,  reveal:'✅ TRUE! Japan fans 🥢🍜 are famous for cleaning up. Amazing!' },
    { statement:'The World Cup final is on July 19th.',                        correct:true,  reveal:'✅ TRUE! July 19th, 2026 — mark it in your calendar! 📅' },
  ],
},

'weekly-drop-issue-008': {
  id:    'weekly-drop-issue-008',
  title: "The Weekly Drop - Issue 008 - The £1.7bn Bid: Frasers vs Hugo Boss",
  level: 'All Levels',
  track: 'weekly-drop',
  emoji: '👔',
  badge: 'Deal Watcher',

  vocab: [
    { word:'takeover',             definition:'When one company buys enough shares to gain control of another company, usually offering a price above market value.', example:'Frasers launched a formal ___ bid for Hugo Boss.',                       distractors:['premium','regulators','shareholder'] },
    { word:'shareholder',          definition:'A person or company that owns shares (a percentage) in a business.',                                                  example:'Frasers is Hugo Boss\'s largest ___, with over 26%.',                    distractors:['takeover','regulators','brand equity'] },
    { word:'premium',              definition:'An amount paid above the normal or current market price.',                                                            example:'The offer included a 4.3% ___ over the closing price.',                 distractors:['shareholder','conflict of interest','regulators'] },
    { word:'bid',                  definition:'A formal offer to buy shares or a company at a specific price.',                                                       example:'Frasers\' ___ values Hugo Boss at around €1.98bn.',                      distractors:['premium','supervisory board','brand equity'] },
    { word:'regulators',           definition:'Government bodies that supervise and approve business activity, including mergers and acquisitions.',                 example:'The deal must be cleared by ___ before it can close.',                  distractors:['shareholder','takeover','conflict of interest'] },
    { word:'supervisory board',    definition:'In German company law, the board that monitors and oversees management — separate from the management board.',        example:'Michael Murray sits on Hugo Boss\'s ___.',                                distractors:['regulators','brand equity','bid'] },
    { word:'conflict of interest', definition:'A situation where a person\'s personal or professional interests could unfairly influence their decisions.',          example:'Murray\'s dual role created a ___, so he was excluded from the talks.', distractors:['premium','supervisory board','takeover'] },
    { word:'brand equity',         definition:'The commercial value of a brand based on consumer perception, recognition and trust — not just its financial assets.', example:'Hugo Boss has strong ___ built up over decades.',                        distractors:['bid','shareholder','regulators'] },
  ],

  true_false: [
    { statement:'Frasers Group owns Sports Direct.',                                                                  correct:true,  reveal:'True! Frasers Group is Mike Ashley\'s retail empire, which owns Sports Direct, Game, and is now bidding for Hugo Boss.' },
    { statement:'Frasers is offering €38 per share for the Hugo Boss shares it does not yet own.',                     correct:true,  reveal:'True! Frasers already owns just over 26% and is offering €38/share for the remaining ~74%.' },
    { statement:'Hugo Boss immediately accepted the takeover offer from Frasers.',                                     correct:false, reveal:'False — Hugo Boss said it was only "reviewing the proposal." Shares jumped to nearly €40, suggesting investors expected a higher bid.' },
    { statement:'Frasers\' CEO Michael Murray took part in the board discussion about the takeover bid.',              correct:false, reveal:'False! Because Murray sits on Hugo Boss\'s supervisory board, he had a conflict of interest and was excluded from the discussion.' },
    { statement:'Hugo Boss share prices fell after Frasers announced its bid.',                                        correct:false, reveal:'False — they rose almost 10% to €39.90, signalling investors expected a higher offer or a bidding war.' },
  ],

  fix_mistakes: [
    { sentence:'Frasers Group, which already owns a MAJORITY stake of 26% in Hugo Boss, launched a full takeover bid to acquire the rest.', wrong:'majority', correct:'minority', explain:'Owning 26% is less than half — that\'s a minority stake, not a majority.' },
    { sentence:'The offer represented a DISCOUNT of 4.3% to Hugo Boss\'s closing price on Wednesday.',                                        wrong:'discount', correct:'premium',  explain:'Frasers offered MORE than the market price — that\'s a premium, not a discount.' },
    { sentence:'Frasers said the deal was subject to approval from COMPETITORS before it could close.',                                       wrong:'competitors', correct:'regulators', explain:'Government regulators — not other companies — approve big takeover deals.' },
    { sentence:'The company said it wanted to increase its investment in Hugo Boss to create value for its EMPLOYEES.',                       wrong:'employees', correct:'shareholders', explain:'"Creating value for shareholders" is the standard corporate phrase — employees are workers, not owners.' },
  ],

  gap_fill: [
    { before:'Frasers already held just over 26% of Hugo Boss ahead of the bid, making it the company\'s ', blank:'largest',              after:' shareholder.',                                              options:['main','largest','majority','primary'] },
    { before:'Hugo Boss shares were trading almost 10% ',                                                  blank:'up',                   after:' on Thursday morning following the announcement.',          options:['high','up','risen','above'] },
    { before:'Frasers said it remained ',                                                                  blank:'supportive',           after:' of the current Hugo Boss management team and their strategy.', options:['positive','confident','supportive','in favour of'] },
    { before:'The rise in Hugo Boss\'s share price suggested investors expected a higher offer to ',       blank:'come',                  after:' from either Frasers or a rival bidder.',                    options:['come','appear','emerge','arrive'] },
    { before:'Because Murray sat on Hugo Boss\'s supervisory board, he faced a ',                          blank:'conflict of interest', after:' and was excluded from the bid discussions.',                 options:['problem of loyalty','conflict of interest','personal issue','legal barrier'] },
    { before:'Frasers suggested it was not looking to ',                                                   blank:'rock the boat',        after:' — and would keep the existing management in place.',        options:['move the ship','keep afloat','kick the bucket','rock the boat'] },
  ],

  idioms_wild: [
    { phrase:'rock the boat',       meaning:'To cause trouble or disturb a stable situation, often by making controversial changes.' },
    { phrase:'in someone\'s sights', meaning:'When something or someone is being clearly targeted or aimed for.' },
    { phrase:'rife',                meaning:'Widespread and very common, often used for rumours or something negative.' },
  ],
},


'china-ai-classrooms': {
  id:    'china-ai-classrooms',
  title: 'AI in the Classroom: Smart Schools or Surveillance?',
  level: 'Upper-Intermediate',
  track: 'intermediate',
  emoji: '🧠',
  badge: 'AI Classroom Analyst',

  vocab: [
    { word:'surveillance',   definition:'The close watching of someone\u2019s behaviour, often without them having much say in it', example:'A network of cameras with facial recognition helps police monitor citizens through ___.', distractors:['consent','algorithm','glimpse'] },
    { word:'susceptible to', definition:'Easily affected or influenced by something, often in a negative way', example:'EEG is very ___ artifacts, so if you are fidgety, the signal is affected.', distractors:['alarmed by','consented to','glimpsed by'] },
    { word:'alarmed',        definition:'Made to feel worried or frightened that something might be wrong', example:'These gadgets have ___ Chinese netizens, who are raising privacy concerns online.', distractors:['anatomized','consented','surveilled'] },
    { word:'consent',        definition:'Permission for something to happen, given freely and willingly', example:'Schools say it wasn\u2019t hard getting parental ___ to enrol kids in the programme.', distractors:['surveillance','algorithm','artifact'] },
    { word:'algorithms',      definition:'A set of rules a computer follows to process data or solve a problem', example:'The programme is supposed to boost grades while also feeding powerful ___.', distractors:['consent','glimpse','surveillance'] },
    { word:'artifact',       definition:'An unwanted error or distortion in a signal or measurement, not a true reading', example:'EEG is susceptible to ___ — if the electrodes don\u2019t have good contact, it affects the signal.', distractors:['algorithm','consent','glimpse'] },
    { word:'anatomize',      definition:'To examine something in extremely fine, separated-out detail, piece by piece', example:'If you\u2019re trying to assess an individual student in a classroom, you really can\u2019t ___ it.', distractors:['surveil','consent to','alarm'] },
    { word:'glimpse',        definition:'A brief or partial view of something, suggesting more than it fully reveals', example:'Some schools offer a ___ of what the future of high-tech education might look like.', distractors:['artifact','algorithm','consent'] },
  ],

 
  grammar: {
    topic: 'Modal Verbs of Speculation — might / could / may',
    rule:  'Use might, could, or may when something is possible but not certain. Use must when almost certain.',
    exercises: [
      { sentence:'EEG data ___ be distorted if a student is fidgety.', answer:'might', wrong:['must','will',"can't"], explain:'"Might" = possible but not certain — fits limited evidence.' },
      { sentence:'The FDA-style panel ___ recommend stricter rules — but that\u2019s not guaranteed.', answer:'could', wrong:['will','must','should'], explain:'"Could" = a theoretical possibility, not a certainty.' },
      { sentence:'This device ___ contain sensors that aren\u2019t clearly explained to parents.', answer:'may', wrong:['must','will','can'], explain:'"May" = formal/neutral possibility, common in journalism.' },
      { sentence:'If the system is untested, there ___ be long-term effects we don\u2019t know about.', answer:'could', wrong:['must','would','should'], explain:'"Could be" = acknowledging a genuine unknown.' },
    ],
  },

  sentences: [
    { words:['three','has','headband','electrodes','The'], answer:'The headband has three electrodes', hint:'🧠 How many sensors does the device use?' },
    { words:['parents','sent','is','to','data','The'], answer:'The data is sent to parents', hint:'📲 Who receives the concentration reports?' },
    { words:['susceptible','EEG','artifacts','to','is'], answer:'EEG is susceptible to artifacts', hint:'🔬 What does the neuroscientist warn about?' },
    { words:['200','could','million','affected','students','be'], answer:'200 million students could be affected', hint:'🌏 What is the scale of this story?' },
  ],

  word_builder: [
    { word:'surveillance', definition:'Close watching of behaviour, often without consent' },
    { word:'consent',      definition:'Permission given freely for something to happen' },
    { word:'algorithm',    definition:'A set of computer rules for processing data' },
    { word:'alarmed',      definition:'Made to feel worried that something is wrong' },
    { word:'glimpse',      definition:'A brief, partial view of something bigger' },
  ],

  true_false: [
    { statement:'The headbands measure concentration using sensors on the wrists.', correct:false, reveal:'❌ FALSE! Three electrodes — two behind the ears and one on the forehead.' },
    { statement:'The data is sent only to the teacher, never to parents.', correct:false, reveal:'❌ FALSE! It goes to the teacher AND to parents, including a parents\u2019 chat group.' },
    { statement:'A neuroscientist says EEG is a new technology with still fairly little research behind it.', correct:true, reveal:'✅ TRUE! Theodore Zanto (UCSF) says this explicitly.' },
    { statement:'Fidgeting or poor electrode contact can distort the EEG signal.', correct:true, reveal:'✅ TRUE! That distortion is called an "artifact".' },
    { statement:'Every student interviewed said they loved the headbands.', correct:false, reveal:'❌ FALSE! One student said his parents punish him for low scores.' },
    { statement:'The expert says it is easy to isolate one student\u2019s data in a busy classroom.', correct:false, reveal:'❌ FALSE! He says you really can\u2019t "anatomize" it cleanly.' },
    { statement:'Roughly 200 million students could potentially be affected by this push.', correct:true, reveal:'✅ TRUE! That\u2019s the scale mentioned in the video.' },
  ],
},

   'e-invoice-era-tax': {

    // ── IDENTITY ─────────────────────────────────────────────
    id:    'e-invoice-era-tax',
    title: 'The E-Invoice Era',
    level: 'Tax English',
    track: 'tax',
    emoji: '🧾',
    badge: 'Compliance Pro',

    // ── VOCAB ────────────────────────────────────────────────
    vocab: [
      { word:'e-invoice',           definition:'A structured electronic invoice — not a PDF or scan, but a machine-readable file that systems can process automatically', example:'A normal PDF does not count as an ___ — it must be a structured format like XML.', distractors:['structured format','transition period','VAT compliance'] },
      { word:'XRechnung',           definition:'The German standard for electronic invoices in B2B and B2G transactions — a structured XML format', example:'___ is pure XML — there is no PDF layer, so a human cannot read it without special software.', distractors:['ZUGFeRD','EN 16931','sending obligation'] },
      { word:'ZUGFeRD',             definition:'A hybrid German e-invoice format — it embeds machine-readable XML data inside a normal PDF', example:'___ lets a human read the PDF while a computer reads the embedded XML.', distractors:['XRechnung','receiving obligation','Wachstumschancengesetz'] },
      { word:'structured format',   definition:'A file format that computers can read and process automatically — like XML, unlike a scanned image or PDF', example:'A PDF is not a ___ — even a beautiful one is just an image to a machine.', distractors:['transition period','EN 16931','VAT compliance'] },
      { word:'EN 16931',            definition:'The European standard that defines the rules for electronic invoices — all valid e-invoices in Germany must comply with this', example:'Both XRechnung and ZUGFeRD comply with ___.', distractors:['Wachstumschancengesetz','sending obligation','receiving obligation'] },
      { word:'receiving obligation',definition:'The legal requirement to be able to receive e-invoices — applies to all German B2B companies from January 2025', example:'The ___ began on 1 January 2025 — even for small companies.', distractors:['sending obligation','transition period','VAT compliance'] },
      { word:'sending obligation',  definition:'The legal requirement to send e-invoices — phases in from 2027 for large companies and 2028 for smaller ones', example:'Large companies must meet the ___ from 2027.', distractors:['receiving obligation','EN 16931','structured format'] },
      { word:'transition period',   definition:'The window of time while old and new systems run in parallel — paper or PDF invoices may still be accepted under certain conditions', example:'During the ___, paper invoices may still be accepted if the recipient agrees.', distractors:['receiving obligation','XRechnung','VAT compliance'] },
      { word:'Wachstumschancengesetz', definition:'The German Growth Opportunities Act (2024) — the law that introduced the mandatory B2B e-invoicing framework in Germany', example:'The ___ amended the German VAT Act to introduce the e-invoicing mandate.', distractors:['EN 16931','ZUGFeRD','transition period'] },
      { word:'VAT compliance',      definition:'Making sure invoices follow the rules for VAT — including the right format, the right data fields, and the right deadlines', example:'Getting the e-invoice format wrong is also a ___ failure.', distractors:['structured format','sending obligation','e-invoice'] },
    ],

    // ── GRAMMAR 1: Modal verbs of obligation ───────────────────
    grammar: {
      topic: 'Modal verbs of obligation — must / have to / don\'t have to',
      rule:  'MUST / HAVE TO express a legal or strong obligation. MUST often signals a rule imposed by the speaker or a strict legal requirement; HAVE TO is more neutral and very common for external rules like laws. DON\'T HAVE TO means there is no obligation — it is optional, not forbidden.',
      exercises: [
        {
          sentence: 'All German B2B companies ___ be able to receive e-invoices from 2025.',
          answer:   'have to',
          wrong:    ['can', 'might', 'should'],
          explain:  'A legal requirement imposed by law → HAVE TO (or MUST). "Can" suggests ability, not obligation.',
        },
        {
          sentence: 'Small companies ___ send e-invoices until 2028 — they only need to receive them for now.',
          answer:   'don\'t have to',
          wrong:    ['mustn\'t', 'can\'t', 'shouldn\'t'],
          explain:  '"Don\'t have to" = no obligation yet. "Mustn\'t" would mean it is forbidden — which is wrong here.',
        },
        {
          sentence: 'A valid e-invoice ___ follow the EN 16931 standard — there is no way around this.',
          answer:   'must',
          wrong:    ['could', 'may', 'might'],
          explain:  '"Must" for a strict legal requirement with no exceptions — stronger than "should".',
        },
        {
          sentence: 'During the transition period, a supplier ___ send paper invoices if the customer agrees.',
          answer:   'can still',
          wrong:    ['must still', 'has to still', 'mustn\'t'],
          explain:  '"Can" expresses permission/possibility, not obligation — paper is allowed under conditions, not required.',
        },
      ],
    },

    // ── GRAMMAR 2: First Conditional ──────────────────────────
    grammar2: {
      topic: 'First Conditional — predicting compliance outcomes',
      rule:  'First conditional: If + present simple → will + infinitive. Used to predict what will happen if a real, likely condition is met. Very common in compliance advice: "If a company sends a PDF, it will not meet the requirement."',
      exercises: [
        {
          sentence: 'If a company ___ only PDFs, it ___ the e-invoicing requirement.',
          answer:   'sends / will not meet',
          wrong:    ['sends / would not meet', 'will send / will not meet', 'sent / will not meet'],
          explain:  'First conditional: if + present simple (sends), will + infinitive (will not meet). A real likely outcome.',
        },
        {
          sentence: 'If a business ___ over €800,000 turnover, it ___ to send e-invoices from 2027.',
          answer:   'has / will need',
          wrong:    ['had / will need', 'has / would need', 'will have / will need'],
          explain:  'First conditional: if + present simple (has), will + infinitive (will need). Describes a real rule with a clear trigger.',
        },
        {
          sentence: 'If the software already ___ ZUGFeRD, the client ___ to switch it on.',
          answer:   'supports / will just need',
          wrong:    ['supported / will just need', 'will support / will just need', 'supports / would just need'],
          explain:  'First conditional for a likely, practical outcome — the client simply needs to enable an existing feature.',
        },
        {
          sentence: 'If a freelancer ___ to receive an e-invoice, their accounting system ___ it correctly.',
          answer:   'needs / will have to process',
          wrong:    ['needed / will have to process', 'needs / would have to process', 'will need / will have to process'],
          explain:  'First conditional describing the practical consequence of the receiving obligation.',
        },
      ],
    },

    // ── SENTENCE BUILDER ──────────────────────────────────────
    sentences: [
      {
        words:  ['receive', 'must', 'companies', 'be', 'to', 'able', 'e-invoices', 'All'],
        answer: 'All companies must be able to receive e-invoices',
        hint:   '📬 What does the receiving obligation require?',
      },
      {
        words:  ['not', 'A', 'a', 'PDF', 'structured', 'is', 'format'],
        answer: 'A PDF is not a structured format',
        hint:   '🧾 Why doesn\'t a nice PDF count as an e-invoice?',
      },
      {
        words:  ['embeds', 'XML', 'a', 'PDF', 'inside', 'ZUGFeRD'],
        answer: 'ZUGFeRD embeds XML inside a PDF',
        hint:   '💻 What makes ZUGFeRD a hybrid format?',
      },
      {
        words:  ['from', 'send', 'must', 'companies', 'e-invoices', 'Large', '2027'],
        answer: 'Large companies must send e-invoices from 2027',
        hint:   '📅 What is the sending deadline for big companies?',
      },
    ],

    // ── WORD BUILDER ────────────────────────────────────────
    word_builder: [
      { word:'structured',  definition:'A format computers can read automatically' },
      { word:'receiving',   definition:'Being able to accept and process e-invoices' },
      { word:'transition',  definition:'A window where old and new rules overlap' },
      { word:'compliance',  definition:'Following the rules correctly' },
      { word:'mandate',     definition:'An official legal requirement' },
      { word:'structured',  definition:'A format computers can read automatically' },
    ],

    // ── TRUE / FALSE ─────────────────────────────────────────
    true_false: [
      { statement:'All German B2B companies, including small ones, must be able to receive e-invoices from 1 January 2025.', correct:true,  reveal:'✅ TRUE! The receiving obligation applies regardless of company size — small businesses are not exempt.' },
      { statement:'A well-formatted PDF with all the right VAT data counts as a valid e-invoice.',                            correct:false, reveal:'❌ FALSE! A PDF is not a structured format — even a perfect one cannot be processed automatically by a machine.' },
      { statement:'ZUGFeRD is pure XML with no PDF layer at all.',                                                            correct:false, reveal:'❌ FALSE! That describes XRechnung. ZUGFeRD is the hybrid format — a readable PDF with XML embedded inside it.' },
      { statement:'Companies with turnover above €800,000 must start sending e-invoices from 2027.',                         correct:true,  reveal:'✅ TRUE! Smaller companies get an extra year — until 2028 — but larger ones must comply from 2027.' },
      { statement:'The Wachstumschancengesetz is the law behind Germany\'s e-invoicing mandate.',                             correct:true,  reveal:'✅ TRUE! This 2024 law amended the German VAT Act to introduce the new e-invoicing rules.' },
    ],

  },

   'weekly-drop-issue-009': {
  id:    'weekly-drop-issue-009',
  title: "The Weekly Drop - Issue 009 - The Mega-Merger: SpaceX, Tesla and Elon Musk's Empire",
  level: 'All Levels',
  track: 'weekly-drop',
  emoji: '🚀',
  badge: 'Mega-Deal Maker',

  vocab: [
  { word:'merger',             definition:'When two companies combine to form one single company.',                        example:'Investors are speculating about a possible ___ between SpaceX and Tesla.',       distractors:['lawsuit','bailout','dividend'] },
  { word:'speculation',        definition:'Discussion or guessing about something that has not been confirmed.',           example:"There is a lot of ___ in the markets about Musk's next move.",                   distractors:['confirmation','regulation','taxation'] },
  { word:'conglomerate',       definition:'A large company made up of several different businesses, often in unrelated industries.', example:'Merging SpaceX and Tesla would create a powerful ___.',                          distractors:['subsidiary','monopoly','franchise'] },
  { word:'synergies',          definition:'The extra benefits created when two things work together.',                     example:"Analysts say there are real ___ between SpaceX's rockets and Tesla's batteries.", distractors:['penalties','liabilities','disputes'] },
  { word:'stake',              definition:'A share or percentage of ownership in a company.',                              example:'Tesla already holds a ___ in SpaceX.',                                            distractors:['lease','patent','license'] },
  { word:'valuation',          definition:'The estimated total worth of a company.',                                       example:"SpaceX's ___ passed $1 trillion after its IPO.",                                  distractors:['turnover','overhead','payroll'] },
  { word:'cash flow positive', definition:'When a company brings in more cash than it spends.',                            example:'Unlike SpaceX, Tesla has been ___ for years.',                                    distractors:['debt-free','tax-exempt','asset-backed'] },
  { word:'diluted',            definition:"When a shareholder's percentage of ownership decreases because a company issues new shares.", example:'Tesla investors worry their shares could be ___ if the merger goes ahead.',       distractors:['frozen','audited','insured'] },
],

  true_false: [
    { statement:'SpaceX recently became a publicly traded company through an IPO.',                                  correct:true,  reveal:'True! SpaceX went public with an IPO that raised over $85 billion — now valued at more than $1 trillion.' },
    { statement:'SpaceX is now worth less money than Tesla.',                                                        correct:false, reveal:'False! SpaceX is worth over $1 trillion — over a trillion dollars more than Tesla.' },
    { statement:"Tesla's stock price has gone up significantly this year.",                                          correct:false, reveal:'False — Tesla stock is down around 10% this year, partly because self-driving and robotics ambitions have stalled.' },
    { statement:'SpaceX President Gwynne Shotwell completely ruled out a merger with Tesla.',                        correct:false, reveal:'False! She said a merger "could actually make Elon\'s life a little easier," without ruling it out.' },
    { statement:'SpaceX and Tesla currently have no business relationship at all.',                                  correct:false, reveal:'False! SpaceX is one of Tesla\'s largest customers — buying Megapack batteries and Cybertrucks, and co-building a $55bn chip factory.' },
  ],

  fix_mistakes: [
    { sentence:'"SpaceX posted a <u>profit</u> of $4.9 billion last year, mainly due to the enormous costs of its AI expansion."', hint:'If costs were enormous, the company almost certainly lost money. What\'s the opposite of "profit"?', opts:['profit → REVENUE','profit → BUDGET','profit → LOSS'], correct:2, fb:'LOSS — SpaceX posted a $4.9bn loss, driven by heavy AI investment.' },
    { sentence:'"Tesla, on the other hand, has been <u>cash flow negative</u> for years and sits on a $45 billion cash reserve."', hint:'A $45bn reserve built up over years means more money coming in than going out.', opts:['cash flow negative → DEBT FREE','cash flow negative → CASH FLOW POSITIVE','cash flow negative → OVERVALUED'], correct:1, fb:'CASH FLOW POSITIVE — bringing in more cash than you spend.' },
    { sentence:'"A merger would allow Musk to <u>reduce</u> his control of more of the AI ecosystem, according to analyst Dan Ives."', hint:'Why would a CEO want LESS control over a valuable, fast-growing area?', opts:['reduce → INCREASE','reduce → SELL OFF','reduce → IGNORE'], correct:0, fb:'INCREASE — Ives argued the merger would let Musk consolidate and expand his grip on AI.' },
    { sentence:'"Tesla\'s move from Texas to Delaware has made it significantly <u>easier</u> for shareholders to pursue lawsuits."', hint:'Check the direction of the move, and whether legal challenges got easier or harder.', opts:['easier → SIMPLER','easier → MOST CHALLENGING','easier → MORE CHALLENGING'], correct:2, fb:'Moving FROM Delaware TO Texas made it MORE CHALLENGING for shareholders to sue.' },
  ],

  word_match: [
    { term:'IPO',                 def:"A company's first sale of shares to the public" },
    { term:'shareholder lawsuit', def:'Legal action brought by investors against a company' },
    { term:'governance',          def:'The system of rules and oversight that controls a company' },
    { term:'lock-up period',      def:'A set time after an IPO when insiders cannot sell shares' },
    { term:'robotaxi',            def:'A self-driving vehicle that operates as a taxi service' },
    { term:'compensation package',def:'The total pay and benefits awarded to an executive' },
  ],

  beat_clock: [
    { level:'h1', label:'🟢 Beginner',    q:'SpaceX recently had its IPO on a:', opts:['Friday','Monday','Weekend'], correct:0 },
    { level:'h1', label:'🟢 Beginner',    q:'"Speculation" means:', opts:['Confirmed fact','Guessing or discussion','A type of contract'], correct:1 },
    { level:'h1', label:'🟢 Beginner',    q:'SpaceX President is named:', opts:['Gwynne Shotwell','Dan Ives','Ross Gerber'], correct:0 },
    { level:'h2', label:'🟡 A2',          q:'A "stake" in a company means:', opts:['A type of meeting','A legal penalty','A share of ownership'], correct:2 },
    { level:'h2', label:'🟡 A2',          q:"Tesla's cash reserve is approximately:", opts:['$4.9 billion','$506 million','$45 billion'], correct:2 },
    { level:'h2', label:'🟡 A2',          q:'"Synergies" between two companies means:', opts:['Combined benefits working together','Legal disputes','Separate, unrelated operations'], correct:0 },
    { level:'h3', label:'🔴 Upper Int',   q:'A "conglomerate" is best described as:', opts:['One company in a single industry','A government regulator','A large firm spanning several different businesses'], correct:2 },
    { level:'h3', label:'🔴 Upper Int',   q:'If a shareholder\'s stake is "diluted," their ownership percentage:', opts:['Increases','Stays exactly the same','Decreases'], correct:2 },
    { level:'h4', label:'🏆 Advanced',    q:'"Cash flow positive" means a company:', opts:['Has filed for bankruptcy','Brings in more cash than it spends','Has no employees'], correct:1 },
    { level:'h4', label:'🏆 Advanced',    q:'In the article, Ross Gerber calls Tesla:', opts:['"The crown jewel"','"The second child we don\'t want to talk about"','"A safe long-term bet"'], correct:1 },
  ],
},

   'gut-genug-beginner': {
  id:    'gut-genug-beginner',
  title: 'Du bist gut genug — You Are Good Enough!',
  level: 'Beginner',
  track: 'beginner',
  emoji: '🎵',
  badge: 'Gut Genug Star',

  vocab: [
    { word:'popular',   definition:'Liked by many people',                                          example:'The song is very ___ — millions of people listen to it.',          distractors:['famous','common','expensive'] },
    { word:'share',     definition:'To send something to other people online',                       example:'People ___ the video on TikTok and Instagram every day.',           distractors:['watch','upload','find'] },
    { word:'melody',    definition:'The main tune of a song — the part you sing',                    example:'The ___ is simple and beautiful — easy to sing along to.',          distractors:['lyrics','chorus','bridge'] },
    { word:'mishear',   definition:'To hear words incorrectly and understand the wrong thing',       example:'Many people ___ the words and think it says "Doobie Scoot Canoe."', distractors:['misread','misuse','mistranslate'] },
    { word:'comment',   definition:'A message you write online about something',                     example:'Heidi Klum wrote a ___ about the song on Instagram.',               distractors:['post','story','review'] },
    { word:'pressure',  definition:'The feeling that you must be perfect or do something difficult', example:'Shirin David sings about the ___ to look perfect all the time.',   distractors:['stress','anger','sadness'] },
    { word:'algorithm', definition:'The rules an app uses to decide what to show you',               example:'The ___ shows the song to more people when they like it.',          distractors:['database','programme','playlist'] },
    { word:'message',   definition:'The main idea or meaning of a song, film or book',              example:'The ___ of the song is: you are good enough.',                     distractors:['title','theme','story'] },
  ],

  grammar: {
    topic: 'Present simple — facts and routines',
    rule:  'Use present simple for facts that are always true and things that happen regularly. He/she/it + verb + -s. "The song IS popular." "She SINGS about pressure." "The algorithm SHOWS it to more people."',
    exercises: [
      { sentence:'"Gut genug" ___ "good enough" in English.',          answer:'means',  wrong:['mean','is meaning','meant'],   explain:'"Mean" is a state verb — it does not use -ing. Singular subject "Gut genug" = it → means.' },
      { sentence:'Millions of people ___ the song on social media.',   answer:'share',  wrong:['shares','is sharing','shared'], explain:'"Millions of people" = they → base form, no -s. Regular present simple for habits.' },
      { sentence:'The algorithm ___ the song to more and more people.',answer:'shows',  wrong:['show','is showing','showed'],   explain:'"The algorithm" = it → add -s. Present simple for how apps always work.' },
      { sentence:'Shirin David ___ about the pressure to be perfect.', answer:'sings',  wrong:['sing','is singing','sang'],    explain:'"Shirin David" = she → add -s. Present simple for facts about the song.' },
    ],
  },

  grammar2: {
    topic: 'Past simple — regular and irregular verbs',
    rule:  'Past simple for finished actions in the past. Regular: add -ED. Irregular: must learn. make → made, become → became, write → wrote.',
    exercises: [
      { sentence:'Three artists ___ the song together.',              answer:'made',   wrong:['make','maked','have made'],     explain:'Irregular: make → MADE. The song was finished in the past.' },
      { sentence:'Heidi Klum ___ a comment online about the song.',   answer:'wrote',  wrong:['write','writed','has written'], explain:'Irregular: write → WROTE. She wrote it once in the past.' },
      { sentence:'The song ___ very popular all over the world.',     answer:'became', wrong:['become','becomed','has become'],explain:'Irregular: become → BECAME. A change that happened in the past.' },
      { sentence:'Many English speakers ___ the German words.',       answer:'misheard',wrong:['mishear','misheared','have misheard'], explain:'"Mishear" is irregular (like "hear"): hear → heard → misheard.' },
    ],
  },

  sentences: [
    { words:['say','The','words','enough','you','are','good','song'], answer:'The song words say you are good enough',          hint:'🎵 What is the message of the song?' },
    { words:['speak','love','even','who','German','don\'t','people','it'], answer:'people love it even who don\'t speak German', hint:'🌍 Who enjoys the song around the world?' },
    { words:['Doobie','Canoe','Scoot','think','people','it','says','Many'], answer:'Many people think it says Doobie Scoot Canoe', hint:'😂 What do English speakers mishear?' },
    { words:['like','algorithm','shows','people','more','When','it','to','they','the'], answer:'When they like it the algorithm shows it to more people', hint:'📱 How does the song reach new people?' },
  ],

  word_builder: [
    { word:'popular',   definition:'Liked by many people' },
    { word:'melody',    definition:'The main tune of a song' },
    { word:'pressure',  definition:'The feeling that you must be perfect' },
    { word:'algorithm', definition:'The rules an app uses to show you things' },
    { word:'mishear',   definition:'To hear something incorrectly' },
    { word:'comment',   definition:'A message written online' },
  ],

  true_false: [
    { statement:'"Gut genug" was made by one solo artist.',                                   correct:false, reveal:'❌ FALSE! Three artists made it together: KitschKrieg, Blumengarten and Shirin David. A collaboration!' },
    { statement:'"Gut genug" means "good enough" in English.',                                correct:true,  reveal:'✅ TRUE! "Gut" = good. "Genug" = enough. Four simple words with a powerful message.' },
    { statement:'Many English speakers correctly understand all the German words.',            correct:false, reveal:'❌ FALSE! Many mishear "Du bist gut genug" and think it says "Doobie Scoot Canoe" — which is very funny!' },
    { statement:'Heidi Klum is one of the three artists who made the song.',                  correct:false, reveal:'❌ FALSE! She is a German TV star. She only wrote a comment about the song online.' },
    { statement:'The algorithm helps the song reach more people when they like and share it.',correct:true,  reveal:'✅ TRUE! The more people interact with it, the more TikTok and Instagram show it to new people.' },
    { statement:'Shirin David sings about the pressure to look perfect.',                     correct:true,  reveal:'✅ TRUE! Her part of the song is about the difficult feeling that you must always be perfect.' },
    { statement:'The message of the song is "you are not good enough."',                     correct:false, reveal:'❌ FALSE! The message is the OPPOSITE — "Du bist gut genug" means "You ARE good enough." A positive message!' },
    { statement:'The song is only popular in Germany because it is in German.',              correct:false, reveal:'❌ FALSE! It is popular all over the world — even people who do not speak German love it!' },
  ],
},

   'gut-genug': {
  id:    'gut-genug',
  title: 'Du bist gut genug — You Are Good Enough! (Intermediate)',
  level: 'Intermediate',
  track: 'intermediate',
  emoji: '🎵',
  badge: 'Viral English Expert',

  vocab: [
    { word:'go viral',    definition:'To spread very quickly across the internet, reaching millions of people',              example:'The song didn\'t need radio to ___ ___ — TikTok did it in days.',           distractors:['get famous','go global','trend up'] },
    { word:'transcend',   definition:'To go beyond the usual limits of something',                                           example:'The melody ___ language — people feel it without understanding the words.', distractors:['translate','replace','include'] },
    { word:'traction',    definition:'The process of gaining popularity or making progress',                                 example:'The song has been gaining ___ globally, even outside German-speaking countries.', distractors:['attention','streams','fans'] },
    { word:'resonate',    definition:'To have a strong, meaningful personal impact on someone',                              example:'The message of self-acceptance really ___ with listeners worldwide.',          distractors:['relate','respond','react'] },
    { word:'mishear',     definition:'To hear words incorrectly, understanding the wrong thing',                             example:'Many English speakers ___ "Du bist gut genug" as "Doobie Scoot Canoe."',    distractors:['misread','misquote','misuse'] },
    { word:'algorithm',   definition:'The rules a platform uses to decide what content to show users',                      example:'The ___ tracks how users respond and pushes popular content further.',        distractors:['database','playlist','feed'] },
    { word:'reassurance', definition:'Something that removes doubt or worry and makes someone feel better',                  example:'The chorus offers ___ — a reminder that you don\'t need to be perfect.',    distractors:['validation','confidence','comfort'] },
    { word:'engagement',  definition:'How users interact with content — likes, comments, shares, watch time',               example:'High ___ signals to the platform to push the content to more feeds.',         distractors:['views','followers','reach'] },
  ],

  grammar: {
    topic: 'Present simple vs past simple — facts, processes and events',
    rule:  'Present simple: facts that are always true, and how systems work in general. "The algorithm TRACKS engagement." Past simple: completed events. "Heidi Klum COMMENTED on the song." Present perfect: past action with current relevance. "The song HAS BEEN gaining traction."',
    exercises: [
      { sentence:'The hook ___ in your head from the very first listen.',                       answer:'sticks',           wrong:['stuck','is sticking','has stuck'],    explain:'"Stick in your head" — present simple for a general fact about how the song works.' },
      { sentence:'When users share a video, the algorithm ___ it to more people.',              answer:'pushes',           wrong:['pushed','is pushing','had pushed'],   explain:'Present simple for how a system always works — not a specific past event.' },
      { sentence:'Heidi Klum\'s comment ___ immediate debate and confusion online.',            answer:'caused',           wrong:['causes','is causing','has caused'],   explain:'Past simple — a completed event in the past.' },
      { sentence:'The song ___ global traction since it went viral in early 2026.',            answer:'has been gaining', wrong:['gained','gains','was gaining'],       explain:'Present perfect continuous — started in the past, still happening now.' },
    ],
  },

  grammar2: {
    topic: 'Contrast connectors — despite / even though / without',
    rule:  'DESPITE + noun or gerund (-ing). EVEN THOUGH + subject + verb (full clause). WITHOUT + noun or gerund. Common mistake: "Despite they don\'t understand" ❌ → "Despite not understanding" ✅ or "Even though they don\'t understand" ✅.',
    exercises: [
      { sentence:'___ not understanding the words, millions of people love and share the song.',answer:'Despite',     wrong:['Even though','Although','Without'],   explain:'"Despite" + gerund (not understanding). No subject needed after "despite".' },
      { sentence:'___ many listeners don\'t speak German, the message comes across immediately.',answer:'Even though', wrong:['Despite','Without','However'],         explain:'"Even though" + full clause (subject + verb). Introduces a surprising contrast.' },
      { sentence:'The song crossed language barriers ___ anyone translating it.',              answer:'without',     wrong:['despite','even though','although'],    explain:'"Without" + gerund — no translation was needed or done.' },
      { sentence:'___ the Heidi Klum controversy, the song\'s popularity continued to grow.', answer:'Despite',     wrong:['Even though','Without','Although'],    explain:'"Despite" + noun phrase. The controversy didn\'t stop the growth.' },
    ],
  },

  sentences: [
    { words:['viral','go','the','to','need','didn\'t','radio','song','The'],       answer:'The song didn\'t need radio to go viral',            hint:'📱 How did the song spread without traditional media?' },
    { words:['attention','language','to','pays','algorithm','no','The'],           answer:'The algorithm pays no attention to language',         hint:'🤖 What does the algorithm actually track?' },
    { words:['Klum','wrote','comment','a','Heidi','only','his','loved','part','she'], answer:'Heidi Klum wrote a comment she loved only his part', hint:'💬 What was Heidi Klum\'s controversial reaction?' },
    { words:['barriers','language','transcends','The','melody'],                   answer:'The melody transcends language barriers',             hint:'🌍 Why do people love it without understanding it?' },
  ],

  word_builder: [
    { word:'viral',       definition:'Spreading extremely fast online' },
    { word:'transcend',   definition:'To go beyond the usual limits' },
    { word:'traction',    definition:'Growing popularity or momentum' },
    { word:'algorithm',   definition:'The rules that decide what you see online' },
    { word:'resonate',    definition:'To connect deeply with someone' },
    { word:'engagement',  definition:'How users interact with content' },
  ],

  true_false: [
    { statement:'"Gut genug" is a collaboration between a Berlin producer collective, an indie duo, and a rapper.',       correct:true,  reveal:'✅ TRUE! KitschKrieg (producers), Blumengarten (indie duo) and Shirin David (rapper). Three different acts.' },
    { statement:'The song went viral mainly because an American DJ remixed it and put it on Spotify.',                   correct:false, reveal:'❌ FALSE! The article says nothing about a remix. It spread organically — users used the sound in their own videos, and the algorithm amplified it.' },
    { statement:'Social media algorithms spread content based on engagement, not the language of the song.',              correct:true,  reveal:'✅ TRUE! Platforms track watch time, likes, shares, and comments — not whether the song is in German, English or Swahili.' },
    { statement:'Heidi Klum praised both Blumengarten and Shirin David equally in her comment.',                         correct:false, reveal:'❌ FALSE! She said "I love only his part" — which sparked debate. Many saw it as a dig at Shirin David.' },
    { statement:'Shirin David\'s verse directly addresses the pressure to look perfect and appear successful.',           correct:true,  reveal:'✅ TRUE! Her verse mentions constant judgment and the struggle to stay confident — connected to the world of Germany\'s Next Top Model.' },
    { statement:'The article says songs in foreign languages never succeeded globally before social media.',              correct:false, reveal:'❌ FALSE! The article says they "rarely" broke out globally — not "never". Important difference! K-pop existed before the algorithm era.' },
    { statement:'The word "mishear" means to deliberately change the lyrics when you sing along.',                       correct:false, reveal:'❌ FALSE! "Mishear" means to accidentally hear the wrong words. "Mis-" = doing something wrongly. You mishear — you don\'t choose to.' },
    { statement:'"Gain traction" means to start making progress and becoming more widely known.',                        correct:true,  reveal:'✅ TRUE! "Gain traction" describes a gradual build-up of momentum. "The idea is gaining traction" = more people are paying attention to it.' },
  ],
},

   /* ═══════════════════════════════════════════════════════════════
   ADD TO lesson-data-registry.js
   Key: 'airbnb-problem-tax'
═══════════════════════════════════════════════════════════════ */

  'airbnb-problem-tax': {

    id:    'airbnb-problem-tax',
    title: 'The Airbnb Problem',
    level: 'Tax English',
    track: 'tax',
    emoji: '🏖️',
    badge: 'Rental Income Expert',

    // ── VOCAB ────────────────────────────────────────────────
    vocab: [
      {
        word:        'rental income',
        definition:  'Money you earn from renting out a property — even for just a few nights. In most countries, this is taxable income.',
        example:     'You must declare all ___ to the tax office, even from short Airbnb stays.',
        distractors: ['source country', 'platform reporting', 'DAC7'],
      },
      {
        word:        'source country',
        definition:  'The country where the money is earned — e.g. if you rent out a flat in Italy, Italy is the source country, even if you live in Germany.',
        example:     'Italy is the ___ because the rented property is located there.',
        distractors: ['residence country', 'tax treaty', 'double taxation'],
      },
      {
        word:        'residence country',
        definition:  'The country where you live and pay your main taxes. You may owe tax here on your worldwide income, including rental income from abroad.',
        example:     'Germany is Henrik\'s ___ — so Germany taxes his worldwide income.',
        distractors: ['source country', 'letting allowance', 'DAC7'],
      },
      {
        word:        'double taxation',
        definition:  'When the same income is taxed twice — once in the source country and once in the residence country. Tax treaties exist to prevent this.',
        example:     'A ___ agreement stops Marco paying full tax in both Italy and Germany.',
        distractors: ['platform reporting', 'short-term rental', 'letting allowance'],
      },
      {
        word:        'tax treaty',
        definition:  'An agreement between two countries that decides which country has the right to tax which income — so the same money is not taxed twice.',
        example:     'The German-Italian ___ gives Italy the primary right to tax rental income.',
        distractors: ['double taxation', 'source country', 'DAC7'],
      },
      {
        word:        'platform reporting',
        definition:  'Since 2023, platforms like Airbnb and Booking.com must automatically share host earnings data with EU tax authorities.',
        example:     '___ means Airbnb sends your income data directly to the tax office — you cannot hide it.',
        distractors: ['tax treaty', 'letting allowance', 'principal residence'],
      },
      {
        word:        'letting allowance',
        definition:  'A tax-free amount you can earn from renting before you owe income tax. In the UK, the Rent-a-Room Scheme allows up to £1,000 per year tax-free.',
        example:     'Sarah earned £920 — under the UK ___ — so she owes no tax.',
        distractors: ['rental income', 'double taxation', 'short-term rental'],
      },
      {
        word:        'short-term rental',
        definition:  'Renting out a property for a short period — typically less than 30 days at a time. Tax rules for short-term rentals are often stricter.',
        example:     'Airbnb and Booking.com are the main platforms for ___ accommodation.',
        distractors: ['letting allowance', 'residence country', 'principal residence'],
      },
      {
        word:        'principal residence',
        definition:  'Your main home — the place where you actually live. Renting out your principal residence is treated differently from renting a second property.',
        example:     'Sarah rents a room in her own home, which is her ___ — this qualifies for the UK letting allowance.',
        distractors: ['source country', 'platform reporting', 'rental income'],
      },
      {
        word:        'DAC7',
        definition:  'An EU directive that came into force in January 2023, requiring digital platforms to report seller and host income to tax authorities across the EU.',
        example:     'Since ___ came into force, Booking.com must report every host\'s earnings to the EU tax authorities.',
        distractors: ['tax treaty', 'short-term rental', 'letting allowance'],
      },
    ],

    // ── GRAMMAR 1: Passive Voice ──────────────────────────────
    grammar: {
      topic: 'Passive Voice in tax advice and compliance English',
      rule:  'Passive voice (is/are/was/were + past participle) focuses on what happened, not who did it. Essential in tax advice: "Tax is deducted at source." "The income must be declared." "Earnings are reported automatically." Very common in legal and compliance contexts.',
      exercises: [
        {
          sentence: 'Since 2023, host earnings ___ automatically to EU tax authorities by platforms like Airbnb.',
          answer:   'are reported',
          wrong:    ['report', 'reported', 'have reported'],
          explain:  'Present passive: are + past participle. The earnings receive the action of reporting — Airbnb is not mentioned as the subject.',
        },
        {
          sentence: 'In an asset deal — sorry, in a rental deal — the income ___ first in the source country.',
          answer:   'is taxed',
          wrong:    ['taxes', 'taxed', 'has taxed'],
          explain:  'Present passive: is + past participle. A general ongoing legal rule — the income receives the action of taxation.',
        },
        {
          sentence: 'Under DAC7, Booking.com ___ to collect and share host earnings data.',
          answer:   'is required',
          wrong:    ['requires', 'required', 'was requiring'],
          explain:  'Present passive for an ongoing legal obligation: is required. The platform receives the obligation.',
        },
        {
          sentence: 'A credit for Italian tax paid ___ by Germany under the bilateral treaty.',
          answer:   'is given',
          wrong:    ['gives', 'was giving', 'has given'],
          explain:  'Present passive: is + past participle. Germany gives it — but the focus is on the credit (what is received), not Germany.',
        },
      ],
    },

    // ── GRAMMAR 2: First Conditional ─────────────────────────
    grammar2: {
      topic: 'First Conditional — predicting tax outcomes for clients',
      rule:  'First conditional: If + present simple → will + infinitive. Used to advise clients about real, likely outcomes. "If you rent your flat, you will need to declare the income." Very common in professional tax advice.',
      exercises: [
        {
          sentence: 'If a host ___ their earnings, the tax office ___ them automatically via DAC7.',
          answer:   'doesn\'t declare / will receive',
          wrong:    ['didn\'t declare / would receive', 'doesn\'t declare / would receive', 'won\'t declare / will receive'],
          explain:  'First conditional: if + present simple (doesn\'t declare) → will + infinitive (will receive). A real, likely outcome.',
        },
        {
          sentence: 'If Marco ___ tax in Italy, Germany ___ him a credit for the amount paid.',
          answer:   'pays / will give',
          wrong:    ['paid / would give', 'pays / would give', 'will pay / will give'],
          explain:  'First conditional for a real scenario. If + present simple (pays) → will + infinitive (will give).',
        },
        {
          sentence: 'If Sarah ___ under £1,000 from renting her room, she ___ to file a tax return.',
          answer:   'earns / won\'t need',
          wrong:    ['earned / wouldn\'t need', 'earns / wouldn\'t need', 'will earn / won\'t need'],
          explain:  'First conditional: if + present simple (earns) → won\'t + infinitive. A real, favourable outcome under the UK scheme.',
        },
        {
          sentence: 'If Henrik ___ to declare the Swedish rental income, Germany ___ him interest and penalties.',
          answer:   'fails / will charge',
          wrong:    ['failed / would charge', 'fails / would charge', 'will fail / will charge'],
          explain:  'First conditional for a warning: if + present simple (fails) → will + infinitive (will charge).',
        },
      ],
    },

    // ── SENTENCE BUILDER ────────────────────────────────────
    sentences: [
      {
        words:  ['source', 'the', 'tax', 'Italy', 'is', 'and', 'country', 'right', 'has', 'the', 'first', 'to'],
        answer: 'Italy is the source country and has the first right to tax',
        hint:   '🇮🇹 Which country gets to tax rental income from a flat in Rome?',
      },
      {
        words:  ['share', 'DAC7', 'platforms', 'host', 'automatically', 'requires', 'to', 'data', 'earnings'],
        answer: 'DAC7 requires platforms to automatically share host earnings data',
        hint:   '📱 What does the EU directive require Airbnb and Booking.com to do?',
      },
      {
        words:  ['worldwide', 'Germany', 'residents', 'income', 'taxes', 'their', 'on'],
        answer: 'Germany taxes residents on their worldwide income',
        hint:   '🌍 Why does Germany want to know about Henrik\'s Swedish cabin?',
      },
      {
        words:  ['prevents', 'the', 'same', 'taxed', 'treaty', 'the', 'income', 'being', 'twice', 'tax'],
        answer: 'the tax treaty prevents the same income being taxed twice',
        hint:   '🤝 What is the main purpose of a double taxation agreement?',
      },
    ],

    // ── WORD BUILDER ────────────────────────────────────────
    word_builder: [
      { word:'principal',   definition:'Your main home — the place where you actually live' },
      { word:'residence',   definition:'The country where you live and pay your main taxes' },
      { word:'declaration', definition:'A formal report to the tax office of income earned' },
      { word:'reporting',   definition:'Automatically sharing host data with tax authorities' },
      { word:'allowance',   definition:'A tax-free amount before you owe income tax' },
      { word:'treaty',      definition:'An agreement between two countries on taxing rights' },
    ],

    // ── TRUE / FALSE ─────────────────────────────────────────
    true_false: [
      {
        statement: 'Since January 2023, Airbnb is required to report host earnings to EU tax authorities under DAC7.',
        correct:   true,
        reveal:    '✅ TRUE! DAC7 came into force on 1 January 2023. Platforms must collect and share host data automatically — the "Airbnb doesn\'t report" myth is dead.',
      },
      {
        statement: 'If you rent your Italian flat while living in Germany, only Germany can tax the income.',
        correct:   false,
        reveal:    '❌ FALSE! Italy (the source country) has the first right to tax rental income from an Italian property. Germany may also tax it as worldwide income — but the treaty prevents real double taxation.',
      },
      {
        statement: 'The UK Rent-a-Room Scheme allows up to £1,000 of gross rental income from your own home, tax-free.',
        correct:   true,
        reveal:    '✅ TRUE! And you don\'t even need to file a return if you earn under this amount from renting a room in your principal residence.',
      },
      {
        statement: 'A tax treaty makes all cross-border rental income completely tax-free.',
        correct:   false,
        reveal:    '❌ FALSE! A tax treaty prevents DOUBLE taxation — not all taxation. You still owe tax somewhere; the treaty just prevents paying the full rate in two countries.',
      },
      {
        statement: 'German tax residents must declare rental income from properties abroad, not just in Germany.',
        correct:   true,
        reveal:    '✅ TRUE! Germany taxes worldwide income. Whether the cabin is in Sweden or the flat is in France — Germany wants to know. A treaty credit prevents you paying full tax twice.',
      },
      {
        statement: '"Short-term rental" usually means a tenancy of less than 30 days at a time.',
        correct:   true,
        reveal:    '✅ TRUE! Airbnb-style lets (a few nights, a few weeks) are typically defined as short-term. They often face stricter rules than long-term lets in many EU countries.',
      },
      {
        statement: 'Platform reporting means the host must manually upload their earnings to the tax office each year.',
        correct:   false,
        reveal:    '❌ FALSE! Platform reporting means the PLATFORM (Airbnb, Booking.com etc.) sends the data automatically. Hosts have no control over it — it happens whether they like it or not.',
      },
      {
        statement: '"Source country" means the country where you live and pay your main taxes.',
        correct:   false,
        reveal:    '❌ FALSE! That\'s the RESIDENCE country. The source country is where the INCOME is earned — i.e. where the property is. Two different things!',
      },
    ],

  },

   'weekly-drop-issue-010': {
    id:    'weekly-drop-issue-010',
    title: 'The Weekly Drop — Issue 010 — The Pizza Wars: Why Pizza Hut Got Sold',
    level: 'All Levels',
    track: 'weekly-drop',
    emoji: '🍕',
    badge: 'Pizza War Pro',

    vocab: [
      { word:'iconic',          definition:'Very famous and widely recognised — considered a symbol of something',                    example:'Pizza Hut is one of the most ___ restaurant brands in the world.',               distractors:['popular','profitable','global'] },
      { word:'spun off',        definition:'When a company separates one part of its business into a new, independent company',       example:'PepsiCo ___ its restaurant brands, which became Yum! Brands in 1997.',             distractors:['bought out','merged','franchised'] },
      { word:'private equity',  definition:'Investment firms that buy companies to make them more profitable',                        example:'___ firm LongRange Capital is paying $1.5 billion for Pizza Hut\'s international operations.', distractors:['central bank','hedge fund','stock exchange'] },
      { word:'divest',          definition:'When a company sells off a part of its business',                                        example:'Yum! Brands decided to ___ Pizza Hut and focus on KFC and Taco Bell.',              distractors:['acquire','franchise','rebrand'] },
      { word:'stagnate',        definition:'To stop growing — sales become flat',                                                    example:'The dine-in pizza market began to ___ as delivery services took over.',             distractors:['collapse','recover','expand'] },
      { word:'nimble',          definition:'Quick to adapt to changing conditions',                                                  example:'In China, Pizza Hut was ___ enough to adapt its menu for local tastes.',           distractors:['dominant','cautious','corporate'] },
      { word:'diluted',          definition:'To weaken something by spreading it thinner',                                            example:'Delivery apps ___ Pizza Hut\'s dominance by giving customers more choices.',        distractors:['boosted','challenged','replaced'] },
      { word:'administration',  definition:'UK legal process to rescue or wind down an insolvent company',                           example:'Many Pizza Hut UK franchise sites went into ___ during the COVID-19 pandemic.',   distractors:['liquidation','privatisation','regulation'] },
    ],

    grammar: {
      topic: 'Past simple — regular and irregular verbs',
      rule:  'Past simple for finished actions. Regular: add -ED (decided, stagnated). Irregular: must learn (sell → sold, buy → bought, become → became, spin → spun). The form does not change for different subjects.',
      exercises: [
        { sentence:'PepsiCo ___ Pizza Hut for $320 million in 1977.',                  answer:'bought',  wrong:['buyed','buy','has bought'],      explain:'Irregular: buy → bought. Never "buyed" — this is a very common mistake.' },
        { sentence:'In 1997, PepsiCo ___ its restaurant brands into a new company.',   answer:'spun off',wrong:['spinned off','spin off','has spun off'], explain:'Irregular: spin → spun. "Spinned" does not exist.' },
        { sentence:'Domino\'s ___ its delivery model to beat Pizza Hut in the US.',    answer:'used',    wrong:['use','was using','has used'],     explain:'Regular past simple: use → used. Completed strategy in the past.' },
        { sentence:'Pizza Hut ___ the biggest pizza chain on the planet in the 2000s.',answer:'became',  wrong:['becomed','become','was become'],  explain:'Irregular: become → became. Never "becomed".' },
      ],
    },

    grammar2: {
      topic: 'Passive Voice — present and past passive in business news',
      rule:  'Present passive: is/are + past participle. Past passive: was/were + past participle. In business news, passive focuses on what happened rather than who did it. "Pizza Hut was sold." "The deal is structured as two separate payments."',
      exercises: [
        { sentence:'Pizza Hut ___ by Yum! Brands for $2.7 billion in 2026.',           answer:'was sold',    wrong:['sold','is sold','has sold'],            explain:'Past passive: was + past participle. The deal is complete — use past.' },
        { sentence:'The international operations ___ to LongRange Capital.',           answer:'are being sold', wrong:['sold','are sold','were sold'],         explain:'Present passive continuous for an ongoing deal being completed now.' },
        { sentence:'Pizza Hut ___ in Wichita, Kansas by two brothers in 1958.',        answer:'was founded',  wrong:['founded','was founding','has founded'], explain:'Past passive for a historical fact: was + past participle.' },
        { sentence:'In China, Pizza Hut\'s menu ___ to suit local customers.',         answer:'has been adapted', wrong:['adapted','was adapting','is adapting'], explain:'Present perfect passive: has been + past participle — result of a past change still relevant now.' },
      ],
    },

    sentences: [
      { words:['bought','1977','PepsiCo','for','in','Pizza','Hut','million','$320'],            answer:'PepsiCo bought Pizza Hut for $320 million in 1977',          hint:'💰 What was the price of Pizza Hut in 1977?' },
      { words:['dine-in','Pizza','Hut','known','was','for','restaurants'],                      answer:'Pizza Hut was known for dine-in restaurants',                hint:'🪑 What was Pizza Hut famous for?' },
      { words:['in','is','the','Pizza','brand','China','casual','Hut','biggest','dining'],      answer:'Pizza Hut is the biggest casual dining brand in China',      hint:'🇨🇳 How big is Pizza Hut in China?' },
      { words:['on','focus','Bell','to','KFC','Yum!','Taco','and','wants'],                     answer:'Yum! wants to focus on KFC and Taco Bell', altAnswers:['Yum! wants to focus on Taco Bell and KFC'],                 hint:'🍗 What does Yum! Brands want to do after the sale?' },
    ],

    word_builder: [
      { word:'divest',    definition:'To sell off part of your business' },
      { word:'stagnate',  definition:'To stop growing — flat sales' },
      { word:'iconic',    definition:'Famous enough to be a symbol of something bigger' },
      { word:'nimble',    definition:'Quick to adapt to change' },
      { word:'dilute',    definition:'To weaken by spreading thinner' },
    ],

    true_false: [
      { statement:'Pizza Hut was founded in the United Kingdom.',                                   correct:false, reveal:'❌ FALSE! Pizza Hut was founded in Wichita, Kansas — in the United States — by two brothers in 1958.' },
      { statement:'Yum! Brands is selling Pizza Hut for a total of $2.7 billion.',                  correct:true,  reveal:'✅ TRUE! $1.5 billion to LongRange Capital (non-China) + $1.2 billion to Yum China = $2.7 billion total.' },
      { statement:'Domino\'s success came mainly from its dine-in restaurant model.',               correct:false, reveal:'❌ FALSE! Domino\'s was built on DELIVERY, not dine-in. That is exactly why it beat Pizza Hut as the market shifted.' },
      { statement:'Pizza Hut is actually doing very well in China.',                                correct:true,  reveal:'✅ TRUE! Pizza Hut is the largest casual dining brand in mainland China with $2.3 billion in annual sales.' },
      { statement:'"Divest" means to buy a new business.',                                          correct:false, reveal:'❌ FALSE! "Divest" is the opposite — it means to SELL OFF a part of your business. Yum! is divesting Pizza Hut.' },
      { statement:'A company that has "stagnated" is growing very quickly.',                        correct:false, reveal:'❌ FALSE! "Stagnate" means to STOP growing. A stagnating market has flat sales and no expansion.' },
      { statement:'In 2025, Yum! Brands first announced it was considering selling Pizza Hut.',     correct:true,  reveal:'✅ TRUE! They revealed the potential sale in November 2025 — after several quarters of declining US same-store sales.' },
      { statement:'"Administration" in the UK is similar to bankruptcy protection in the US.',      correct:true,  reveal:'✅ TRUE! When a company goes into administration in the UK, an administrator takes over to try to rescue it — similar to Chapter 11 bankruptcy protection in the US.' },
    ],
  },
 
   };

window.LESSON_DATA_REGISTRY = LESSON_DATA_REGISTRY;

if (typeof module !== 'undefined') module.exports = LESSON_DATA_REGISTRY;
