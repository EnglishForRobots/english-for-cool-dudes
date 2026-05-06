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
        distractors: ['secret', 'one-way', 'famous'],
      },
      {
        word:        'preassembled',
        definition:  'Already put together before the customer receives it',
        example:     'Unlike most furniture retailers that sell products ___, IKEA customers build their own.',
        distractors: ['discounted', 'delivered', 'designed'],
      },
      {
        word:        'phenomena',
        definition:  'Remarkable or observable events or facts — plural of phenomenon',
        example:     'Researchers noticed a similar ___ in other products and businesses.',
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
        distractors: ['pre-ordered', 'hand-made', 'colour-coded'],
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
          answer:   'raised / would lose',
          wrong:    ['had raised / would have lost', 'raises / will lose', 'raised / will lose'],
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
        { sentence:'The Queen ___ her corgis everywhere — on holidays and in the car.', answer:'loved', wrong:['love','loving','has loved'], explain:'"Love" ends in E → add D only → "loved".' },
        { sentence:"The corgis ___ in special wicker baskets inside the palace.", answer:'slept', wrong:['sleep','sleeping','has slept'], explain:'"Sleep" is IRREGULAR → sleep → slept. Must learn these!' },
      ],
    },
 
    grammar2: {
      topic: 'Past Simple — irregular verbs',
      rule:  'Some verbs are irregular — they do NOT add -ED. You must learn them. go → went, take → took, sleep → slept, eat → ate, have → had.',
      exercises: [
        { sentence:"The Queen ___ her corgis with her on her honeymoon!", answer:'took', wrong:['taked','take','has taken'], explain:'Irregular: take → TOOK. Never "taked"!' },
        { sentence:'The corgis ___ to Buckingham Palace after the Queen died.', answer:'went', wrong:['goed','go','have gone'], explain:'Irregular: go → WENT. Never "goed"!' },
        { sentence:'Queen Elizabeth ___ over 30 corgis during her life.', answer:'had', wrong:['haved','have','has had'], explain:'Irregular: have → HAD. Very common — learn it!' },
        { sentence:"The royal corgis ___ from silver bowls every day.", answer:'ate', wrong:['eated','eat','has eaten'], explain:'Irregular: eat → ATE. Never "eated"!' },
      ],
    },
 
    sentences: [
      { words:['corgi','means','dog','Welsh','dwarf','in'], answer:'corgi means dwarf dog in Welsh', hint:'🏴󠁧󠁢󠁷󠁬󠁳󠁥 What does the word corgi mean?' },
      { words:['silver','ate','corgis','bowls','The','from','royal'], answer:'The royal corgis ate from silver bowls', hint:'🍽️ How did the corgis eat?' },
      { words:['companion','was','closest','The','her','Queen','corgi'], answer:'The corgi was her closest companion', hint:'🐾 What was the corgi to the Queen?' },
      { words:['Susan','first','corgi','birthday','was','18th','Her','her'], answer:'Her first corgi was Susan her 18th birthday', hint:'🎂 What was the name of the first corgi?' },
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
   };

window.LESSON_DATA_REGISTRY = LESSON_DATA_REGISTRY;

if (typeof module !== 'undefined') module.exports = LESSON_DATA_REGISTRY;
