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
      example: 'Kane has scored all 23 of his Bundesliga penalties — he is ice-cool from the ___.',
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
      words:  ['the', 'missed', 'never', 'penalty', 'Kane', 'has', 'a', 'Bundesliga', 'in'],
      answer: 'Kane has never missed a penalty in the Bundesliga',
      hint:   '🎯 Harry Kane has a great record for something.',
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
      statement: 'Kane has missed several penalties in the Bundesliga.',
      correct:   false,
      reveal:    '❌ FALSE! He has scored all 23 of his Bundesliga penalties.',
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
        distractors: ['mince', 'mash', 'caramelise'],
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
        words:  ['should','lamb','traditional','If','want','you','mince','use','it','super','to','be'],
        answer: 'If you want it super traditional use lamb mince',
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
 
   };

window.LESSON_DATA_REGISTRY = LESSON_DATA_REGISTRY;

if (typeof module !== 'undefined') module.exports = LESSON_DATA_REGISTRY;
