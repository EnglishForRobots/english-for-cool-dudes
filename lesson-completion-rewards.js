/* ═══════════════════════════════════════════════════════════════
   lesson-completion-rewards.js  v3.0
   EFCD — drop this into every lesson page

   What's new in v3.0:
   - Auto-activates class SRS when a class completes a lesson
   - Populates efcd_srs_class_items with first review scheduled
     for the next day — no teacher action required
   - Requires srs-engine.js + lesson-data-registry.js on lesson pages
═══════════════════════════════════════════════════════════════ */

'use strict';

(function () {

  const SUPABASE_URL = 'https://knwgmrgwbpchqyqxbxea.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtud2dtcmd3YnBjaHF5cXhieGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDkyODgsImV4cCI6MjA3ODA4NTI4OH0.qnp2ScwSE77_idmPhpLE98sr46WvLpKtg6refFfC7s8';

  /* ═══════════════════════════════════════════════════════════════
     LESSON VOCAB REGISTRY
  ═══════════════════════════════════════════════════════════════ */
  const LESSON_VOCAB_REGISTRY = {

    'royal-corgis-beginner': {
      title:   "The Queen's Corgis",
      level:   'Beginner',
      grammar: 'Past Simple — regular and irregular verbs',
      vocab: [
        { word:'breed',     definition:'A particular type of dog or other animal' },
        { word:'loyal',     definition:'Always supporting and caring about someone' },
        { word:'companion', definition:'A friend or animal that spends a lot of time with you' },
        { word:'palace',    definition:'A very large grand house where a king or queen lives' },
        { word:'inherit',   definition:'To receive something from someone after they die' },
        { word:'pampered',  definition:'Given too much care and comfort — treated like royalty' },
        { word:'royal',     definition:'Connected to a king or queen and their family' },
        { word:'retired',   definition:'Stopped working — usually because of old age' },
      ],
    },

    'london-underground-beginner': {
      title:   'The London Underground',
      level:   'Beginner',
      grammar: 'Superlatives (the oldest), prepositions of time (in/on/at)',
      vocab: [
        { word:'platform',     definition:'The area at a station where you wait for the train' },
        { word:'journey',      definition:'A trip from one place to another by transport' },
        { word:'carriage',     definition:'One section of a train' },
        { word:'delay',        definition:'When something is late' },
        { word:'crowded',      definition:'Full of people — the opposite of empty' },
        { word:'underground',  definition:'Below the ground — tunnels beneath the city' },
        { word:'Oyster card',  definition:'The blue card used to pay for the Tube and buses' },
        { word:'Mind the gap', definition:'Be careful of the space between the train and the platform' },
      ],
    },

    'sandwich-beginner': {
      title: 'The Earl of Sandwich', level: 'Beginner',
      grammar: 'Past simple — regular and irregular verbs',
      vocab: [
        { word:'invention', definition:'Something new that someone creates for the first time' },
        { word:'nobleman',  definition:'A person from a high social class in history' },
        { word:'gambling',  definition:'Playing games for money' },
        { word:'slice',     definition:'A flat piece cut from something larger' },
        { word:'filling',   definition:'The food that goes inside a sandwich' },
        { word:'popular',   definition:'Liked by many people' },
      ],
    },

    'coffee-beginner': {
      title: 'The Legend of Coffee', level: 'Beginner',
      grammar: 'Past simple — regular and irregular verbs',
      vocab: [
        { word:'legend',    definition:'An old story that may or may not be true' },
        { word:'goat',      definition:'A farm animal with horns' },
        { word:'energetic', definition:'Full of energy, very active' },
        { word:'monastery', definition:'A building where monks live and work' },
        { word:'berries',   definition:'Small round fruits that grow on bushes' },
        { word:'trade',     definition:'Buying and selling goods between countries' },
      ],
    },

    'chineserobotsbeginner': {
      title: 'Robots on Chinese TV', level: 'Beginner',
      grammar: 'Passive voice (was made, were shown, is used)',
      vocab: [
        { word:'robot',       definition:'A machine that can move and do tasks automatically' },
        { word:'performance', definition:'An event where people show a skill to an audience' },
        { word:'artificial',  definition:'Made by humans, not natural' },
        { word:'demonstrate', definition:'To show how something works' },
        { word:'advanced',    definition:'At a high level — more developed than others' },
        { word:'technology',  definition:'Scientific knowledge used to make useful things' },
      ],
    },

    'pancakedaybeginner': {
      title: 'Pancake Day', level: 'Beginner',
      grammar: "Can and can't for ability",
      vocab: [
        { word:'Shrove Tuesday', definition:'The day before Lent begins — Pancake Day in Britain' },
        { word:'batter',         definition:'The liquid mixture used to make pancakes' },
        { word:'toss',           definition:'To throw something up in the air and catch it' },
        { word:'tradition',      definition:'A custom passed down through generations' },
        { word:'topping',        definition:'Something you put on top of food' },
        { word:'lemon',          definition:'A yellow citrus fruit with sour juice' },
      ],
    },

    'fuggereibeginner': {
      title: 'The Fuggerei', level: 'Beginner',
      grammar: 'Must and have to, passive voice',
      vocab: [
        { word:'social housing', definition:'Cheap or free homes provided for people who need them' },
        { word:'rent',           definition:'Money paid regularly to live in a building' },
        { word:'condition',      definition:'A rule you must follow to get something' },
        { word:'merchant',       definition:'A person who buys and sells goods for profit' },
        { word:'charity',        definition:'Giving help or money to people who need it' },
        { word:'prayer',         definition:'Words spoken to God — a religious practice' },
      ],
    },

    'carnivalbeginner': {
      title: 'Carnival and Satire', level: 'Beginner',
      grammar: 'Can/must/passive — permission and obligation',
      vocab: [
        { word:'satire',     definition:'Using humour to criticise powerful people' },
        { word:'float',      definition:'A decorated vehicle in a parade' },
        { word:'politician', definition:'A person who works in government' },
        { word:'costume',    definition:'Special clothes worn for a celebration or performance' },
        { word:'parade',     definition:'A public celebration where people march through the streets' },
        { word:'criticise',  definition:'To say what is wrong or bad about something' },
      ],
    },

    'flyingtaxisbeginner': {
      title: 'Flying Cars', level: 'Beginner',
      grammar: 'Future forms — will and going to',
      vocab: [
        { word:'air taxi',  definition:'A small aircraft that carries passengers like a taxi' },
        { word:'prototype', definition:'The first version of something new being tested' },
        { word:'emission',  definition:'Gas or pollution released into the air' },
        { word:'urban',     definition:'Related to cities and towns' },
        { word:'passenger', definition:'A person travelling in a vehicle' },
        { word:'regulate',  definition:'To control something with rules and laws' },
      ],
    },

    'whyeaster': {
      title: 'Why Easter?', level: 'Beginner',
      grammar: 'Present simple for facts and habits',
      vocab: [
        { word:'resurrection',  definition:'Coming back to life after death — in Christian belief' },
        { word:'symbol',        definition:'An object that represents something else' },
        { word:'celebrate',     definition:'To do something special for a happy occasion' },
        { word:'chocolate egg', definition:'An egg-shaped chocolate treat given at Easter' },
        { word:'spring',        definition:'The season after winter when plants start to grow' },
        { word:'religious',     definition:'Connected to belief in God or a religion' },
      ],
    },

    'fiveamazinglives': {
      title: 'Five Amazing Lives', level: 'Beginner',
      grammar: 'Present perfect vs past simple',
      vocab: [
        { word:'lifestyle',   definition:'The way a person lives their life' },
        { word:'adventurous', definition:'Willing to try new and exciting things' },
        { word:'inspire',     definition:'To make someone want to do something great' },
        { word:'challenge',   definition:'Something difficult that requires effort' },
        { word:'achieve',     definition:'To succeed in doing something difficult' },
        { word:'volunteer',   definition:'To do work without being paid, to help others' },
      ],
    },

    'pandas': {
      title: 'Pandas', level: 'Beginner',
      grammar: 'Comparatives and superlatives',
      vocab: [
        { word:'endangered',   definition:'At risk of dying out completely — very few left' },
        { word:'habitat',      definition:'The natural environment where an animal lives' },
        { word:'bamboo',       definition:'A tall plant that giant pandas eat' },
        { word:'conservation', definition:'Protecting animals and nature from harm' },
        { word:'breed',        definition:'To produce babies — especially in a protected programme' },
        { word:'extinct',      definition:'No longer existing — all of a species have died' },
      ],
    },

    'artemis': {
      title: 'Artemis 2: Mission Complete', level: 'Beginner',
      grammar: 'Past simple and past continuous',
      vocab: [
        { word:'spacecraft', definition:'A vehicle designed to travel in space' },
        { word:'orbit',      definition:'To travel in a curved path around a planet or moon' },
        { word:'astronaut',  definition:'A person trained to travel in space' },
        { word:'mission',    definition:'An important task or journey with a specific goal' },
        { word:'launch',     definition:'To send a rocket or spacecraft into space' },
        { word:'gravity',    definition:'The force that pulls objects towards the Earth' },
      ],
    },

    'ikea-effect-intermediate': {
      title:   'Why Do We Love Building IKEA Furniture?',
      level:   'Intermediate',
      grammar: 'Reported speech (backshift), 2nd and 3rd conditionals',
      vocab: [
        { word:'conventional',       definition:'Following the usual or expected way of doing things' },
        { word:'designated',         definition:'Officially assigned or set aside for a particular purpose' },
        { word:'preassembled',       definition:'Already put together before the customer receives it' },
        { word:'phenomena',          definition:'Remarkable or observable events or facts' },
        { word:'mass market appeal', definition:'The quality of being attractive to a very wide range of people' },
        { word:'flat-packed',        definition:'Compressed into a thin flat box for shipping' },
        { word:'democratic design',  definition:'The philosophy that well-designed products should be affordable for everyone' },
        { word:'coined',             definition:'Invented or created a new word or phrase for the first time' },
        { word:'runaway success',    definition:'An overwhelming or unstoppable success' },
        { word:'obsession',          definition:'An extreme all-consuming focus on something' },
      ],
    },

    'bookshop-intermediate': {
      title: 'Running a Bookshop', level: 'Intermediate',
      grammar: 'Present perfect continuous, passive voice',
      vocab: [
        { word:'curate',      definition:'To carefully select and organise a collection' },
        { word:'proceeds',    definition:'Money made from a sale or event' },
        { word:'browsing',    definition:'Looking through things casually without a specific goal' },
        { word:'independent', definition:'Not part of a large chain — owned by one person' },
        { word:'stock',       definition:'The goods a shop has available to sell' },
        { word:'loyal',       definition:'Faithful and consistently supportive' },
      ],
    },

    'cadbury-business': {
      title: 'The Cadbury Story', level: 'Business',
      grammar: 'Reported speech, passive voice in business context',
      vocab: [
        { word:'acquisition', definition:'When one company buys another company' },
        { word:'brand',       definition:'The name, design and reputation of a product or company' },
        { word:'revenue',     definition:'The total money a company earns from its sales' },
        { word:'workforce',   definition:'All the people employed by a company' },
        { word:'merger',      definition:'When two companies join to become one' },
        { word:'shareholder', definition:'A person who owns part of a company' },
      ],
    },

    'saudi-machine-deal-tax': {
      title:   'The Saudi Machine Deal',
      level:   'Tax English',
      grammar: 'Passive Voice — past, present and future passive in cross-border deal English',
      vocab: [
        { word:'customs duty',            definition:'A tax charged by a country on goods imported from abroad' },
        { word:'permanent establishment', definition:'A fixed presence in a country that triggers local corporate tax liability' },
        { word:'withholding tax',         definition:'Tax deducted at source by the payer on payments to a non-resident' },
        { word:'contract splitting',      definition:'Separating a deal into a goods contract and a services contract to manage tax exposure' },
        { word:'VAT',                     definition:'Value Added Tax — a consumption tax charged at each stage of the supply chain' },
        { word:'commissioning',           definition:'The process of testing and verifying that an installed machine works correctly' },
        { word:'title',                   definition:'Legal ownership of goods — when title passes determines when tax obligations arise' },
        { word:'Incoterms',               definition:'International rules defining when risk and responsibility transfer from seller to buyer' },
        { word:'PE threshold',            definition:'The time period after which foreign activity becomes a permanent establishment' },
        { word:'zero-rated',              definition:'VAT category where the rate is 0% — seller can still reclaim input VAT' },
      ],
    },

    'crown-estate-intermediate': {
      title:   'The Crown Estate — Who Really Owns Britain?',
      level:   'Intermediate',
      grammar: 'Passive Voice — present and past passive in financial English',
      vocab: [
        { word:'estate',    definition:'A large area of land or property owned by one person or organisation' },
        { word:'sovereign', definition:'A king or queen — the supreme ruler of a country' },
        { word:'treasury',  definition:"The government department that manages a country's money and taxes" },
        { word:'revenue',   definition:'Income earned by a government or company from taxes, sales or rents' },
        { word:'grant',     definition:'A sum of money given for a specific purpose, usually by a government' },
        { word:'exempt',    definition:'Not required to pay a tax or follow a rule that applies to others' },
        { word:'portfolio', definition:'A collection of investments, properties or financial assets' },
        { word:'surplus',   definition:'An amount left over after all costs and obligations have been met' },
      ],
    },

    'restructuring-tax': {
      title: 'The Restructuring', level: 'Tax',
      grammar: 'Conditional sentences in professional context',
      vocab: [
        { word:'restructuring',   definition:'Reorganising a company to make it more efficient' },
        { word:'withholding tax', definition:'Tax deducted at source before payment reaches you' },
        { word:'liability',       definition:'A legal responsibility to pay money owed' },
        { word:'deductible',      definition:'An expense that can be subtracted from taxable income' },
        { word:'subsidiary',      definition:'A company owned or controlled by a larger company' },
        { word:'compliance',      definition:'Following the rules and laws that apply to you' },
      ],
    },

     'peptides-intermediate': {
  title:   'Why Is Everyone Injecting Peptides?',
  level:   'Intermediate',
  grammar: 'Reported speech (backshift), modal verbs of speculation (might / could / may)',
  vocab: [
    { word:'synthetic',         definition:'Made artificially in a lab, not occurring naturally' },
    { word:'unapproved',        definition:'Not officially authorised or permitted by a regulator' },
    { word:'anecdotal',         definition:'Based on personal stories, not scientific evidence' },
    { word:'gray market',       definition:'A trade in goods that is legal but not officially regulated' },
    { word:'dosing',            definition:'The amount of a drug taken and how often it is taken' },
    { word:'cobbling together', definition:'Putting something together in an improvised, unofficial way' },
    { word:'sterility',         definition:'The condition of being completely free from bacteria and germs' },
    { word:'advisory panel',    definition:'A group of experts brought together to give official recommendations' },
  ],
},

     'phantom-parent-tax': {
  title:   'The Phantom Parent',
  level:   'Tax English',
  grammar: 'Passive voice in legal/tax writing; third conditional for hypothetical case analysis',
  vocab: [
    { word:'withholding tax',  definition:'Tax deducted by the payer at source before a payment reaches the recipient' },
    { word:'refund',           definition:'Money returned after tax has been overpaid or incorrectly withheld' },
    { word:'substance',        definition:'Evidence that a company has genuine economic activity — real staff, real decisions, real premises' },
    { word:'abusive',          definition:'Describes an arrangement set up primarily to obtain a tax benefit not intended by the law' },
    { word:'directive',        definition:'An EU law that member states must incorporate into national legislation' },
    { word:'beneficial owner', definition:'The entity that genuinely receives and controls a payment — not merely a formal intermediary' },
    { word:'shell company',    definition:'A company with no genuine business activity — exists on paper only' },
    { word:'deviation',        definition:'A departure from the normal rule — applying conditions beyond what a directive requires' },
    { word:'reimburse',        definition:'To pay back money that was spent or withheld' },
    { word:'retention',        definition:'The act of keeping back money — withholding tax is a form of retention' },
    { word:'revoked',          definition:'Officially cancelled or taken back — a refund approval can be revoked' },
    { word:'plaintiff',        definition:'The party that brings a legal case — claiming something wrong was done to them' },
  ],
},

     'weekly-drop-issue-006': {
  title:   'The Weekly Drop — Issue 006 — Harry Kane: From Nowhere to Bayern',
  level:   'All Levels',
  grammar: 'Past simple (regular and irregular verbs); reported speech with backshift',
  vocab: [
    { word: 'loan spell',    definition: 'A temporary period when a footballer plays for a different club to gain experience' },
    { word: 'perseverance',  definition: 'Continuing to try despite difficulties, setbacks, or failure — not giving up' },
    { word: 'transfer',      definition: 'The permanent move of a footballer from one club to another, usually for a fee' },
    { word: 'top scorer',    definition: 'The player who scores the most goals in a competition or season' },
    { word: 'penalty spot',  definition: 'The marked point 11 metres from the goal from which a penalty kick is taken' },
    { word: 'hat-trick',     definition: 'Three goals scored by the same player in a single match' },
    { word: 'armband',       definition: 'The band worn on the upper arm to show who is captain of the team' },
    { word: 'resilience',    definition: 'The ability to recover and keep going after setbacks, injuries, or failure' },
  ],
},

     'shepherds-pie-intermediate': {
    title:   "How to Make an Authentic Shepherd's Pie",
    level:   'Intermediate',
    grammar: 'Passive voice in recipe English (is/are + past participle); second conditional for warnings and hypotheticals (If + past simple → would + infinitive)',
    vocab: [
      { word:'mince',        definition:'Meat that has been finely chopped or ground into small pieces' },
      { word:'sear',         definition:'To cook the surface of meat at high heat to brown it and develop flavour' },
      { word:'caramelise',   definition:'To heat food until the natural sugars turn brown and develop a richer flavour' },
      { word:'mash',         definition:'To crush cooked food, especially potatoes, into a soft, smooth mixture' },
      { word:'double cream', definition:'Very thick, rich cream with a high fat content, used in cooking and baking' },
      { word:'authentic',    definition:'Genuine and true to the original — not a copy or a simplified version' },
      { word:'rigmarole',    definition:'A long and unnecessarily complicated process or procedure' },
      { word:'consensus',    definition:'A general agreement among a group of people' },
    ],
  },

     'merger-machine-tax': {
      title:   'The Merger Machine',
      level:   'Tax English',
      grammar: 'Passive voice in deal and tax documentation; third conditional for hypothetical deal analysis',
      vocab: [
        { word:'due diligence',      definition:'The investigation a buyer does before a deal — checking finances, tax, legal issues, and any hidden risks' },
        { word:'indemnity',          definition:'A promise by the seller to pay the buyer if a specific problem arises after the deal closes' },
        { word:'tax covenant',       definition:'A contractual promise about tax — often that the seller will cover any tax liabilities from before the sale' },
        { word:'goodwill',           definition:'The amount paid for a business above the value of its identifiable assets' },
        { word:'deferred tax',       definition:'Tax that is owed but not yet paid — it appears on the balance sheet as a liability' },
        { word:'earn-out',           definition:'A payment to the seller that depends on future performance of the target business' },
        { word:'step-up',            definition:'An increase in the tax value of an asset when it changes ownership — reduces future taxable gains' },
        { word:'hive-down',          definition:'Moving assets from a parent company into a subsidiary before a sale' },
        { word:'completion accounts',definition:'The final accounts prepared on the day a deal closes — show the exact financial position at completion' },
        { word:'warranty',           definition:'A statement made by the seller that something is true — if wrong, the buyer can claim compensation' },
        { word:'carve-out',          definition:'A part of a business that is excluded or separated from a transaction' },
        { word:'uplift',             definition:'An increase in value — tax uplift means the taxable base of an asset is increased, reducing future tax' },
      ],
    },

     'weekly-drop-issue-007': {
  title:   "The Weekly Drop — Issue 007 — The €10M Gift: One Man vs Munich's Housing Crisis",
  level:   'All Levels',
  grammar: 'Passive voice in news English (was donated, are planned); collocations in housing and economics journalism (reach, drive, stand as, make an impact)',
  vocab: [
    { word:'housing crisis',        definition:'A situation where there are not enough affordable homes for people who need them' },
    { word:'donation',              definition:'Something given freely without expecting payment in return' },
    { word:'affordable housing',    definition:'Homes with rents or prices low enough for people on modest incomes' },
    { word:'non-profit',            definition:'An organisation that does not aim to make money for owners or shareholders' },
    { word:'social responsibility', definition:'The duty to act in a way that benefits society, not just yourself' },
    { word:'soaring',               definition:'Rising very fast and steeply — used for prices, demand or costs' },
    { word:'multi-generational',    definition:'Involving people of different ages living or working together' },
    { word:'plot',                  definition:'A piece of land, especially one intended for building on' },
    { word:'priced out',            definition:'When prices rise so high that someone can no longer afford to live somewhere' },
  ],
},

     'worldcup2026-intermediate': {
  title:   'World Cup 2026: Bigger, Bolder, Better?',
  level:   'Intermediate',
  grammar: 'Passive voice (past, present and future passive); future perfect (will have + past participle)',
  vocab: [
    { word:'expand',         definition:'To make something larger or wider in size, scope, or number' },
    { word:'format',         definition:'The way something is organised or arranged — its structure' },
    { word:'knockout phase', definition:'The stage of a tournament where one loss means elimination' },
    { word:'compact',        definition:'Small and efficient — taking up less space than expected' },
    { word:'host city',      definition:'A city officially chosen to hold a major event' },
    { word:'governing body', definition:'The official organisation responsible for controlling a sport or activity' },
    { word:'realistically',  definition:'In a practical way that is actually possible, not just theoretical' },
    { word:'decider',        definition:'The final match or event that determines who wins overall' },
  ],
},

     'worldcup2026-beginner': {
  title:   'World Cup 2026: The Biggest Ever!',
  level:   'Beginner',
  grammar: 'There is / There are; prepositions with dates and places (on / in / at)',
  vocab: [
    { word:'team',      definition:'A group of players who play together' },
    { word:'match',     definition:'A game between two teams' },
    { word:'stadium',   definition:'A large sports ground with seats for people to watch' },
    { word:'final',     definition:'The last and most important match in a competition' },
    { word:'favourite', definition:'The team or person that people think will win' },
    { word:'score',     definition:'The number of goals each team has in a match' },
    { word:'host',      definition:'A country or city that organises a big event' },
    { word:'trophy',    definition:'A prize — usually a cup or medal — for the winner' },
  ],
},

     'worldcup2026-kids': {
  title:   'World Cup 2026: The Biggest Ever!',
  level:   'Kids',
  grammar: 'There is / There are; prepositions with dates and places (on / in / at)',
  vocab: [
    { word:'team',      definition:'A group of players who play together' },
    { word:'match',     definition:'A game between two teams' },
    { word:'stadium',   definition:'A big sports building with seats for fans' },
    { word:'final',     definition:'The last and most important match' },
    { word:'favourite', definition:'The team or person people think will win' },
    { word:'host',      definition:'A country that organises a big event' },
    { word:'trophy',    definition:'A golden prize for the winner' },
    { word:'goal',      definition:'When the ball goes in the net — 1 point!' },
  ],
},


'weekly-drop-issue-008': {
  title:   "The Weekly Drop — Issue 008 — The £1.7bn Bid: Frasers vs Hugo Boss",
  level:   'All Levels',
  grammar: 'True/False statements (beginner → upper-int); Fix the Mistake (word choice in business reporting); Fill the Gap (collocations & idioms in M&A news)',
  vocab: [
    { word:'takeover',             definition:'When one company buys enough shares to gain control of another company.' },
    { word:'shareholder',          definition:'A person or company that owns shares in a business.' },
    { word:'premium',              definition:'An amount paid above the normal or current market price.' },
    { word:'bid',                  definition:'A formal offer to buy shares or a company at a specific price.' },
    { word:'regulators',           definition:'Government bodies that supervise and approve business activity, including mergers.' },
    { word:'supervisory board',    definition:'In German company law, the board that monitors management (Aufsichtsrat).' },
    { word:'conflict of interest', definition:'When personal or professional interests could unfairly influence a decision.' },
    { word:'brand equity',         definition:'The commercial value of a brand based on perception, recognition and trust.' },
  ],
},

     'china-ai-classrooms': {
  title:   'AI in the Classroom: Smart Schools or Surveillance?',
  level:   'Upper-Intermediate',
  grammar: 'Reported speech (backshift); modal verbs of speculation (might/could/may)',
  vocab: [
    { word:'surveillance',   definition:'The close watching of someone\u2019s behaviour, often without them having much say in it' },
    { word:'susceptible to', definition:'Easily affected or influenced by something, often in a negative way' },
    { word:'alarmed',        definition:'Made to feel worried or frightened that something might be wrong' },
    { word:'consent',        definition:'Permission for something to happen, given freely and willingly' },
    { word:'algorithm',      definition:'A set of rules a computer follows to process data or solve a problem' },
    { word:'artifact',       definition:'An unwanted error or distortion in a signal or measurement, not a true reading' },
    { word:'anatomize',      definition:'To examine something in extremely fine, separated-out detail, piece by piece' },
    { word:'glimpse',        definition:'A brief or partial view of something, suggesting more than it fully reveals' },
  ],
},

     'e-invoice-era-tax': {
      title:   'The E-Invoice Era',
      level:   'Tax English',
      grammar: 'Modal verbs of obligation (must / have to / don\'t have to); First conditional for compliance predictions',
      vocab: [
        { word:'e-invoice',            definition:'A structured, machine-readable electronic invoice — not a PDF or scan' },
        { word:'XRechnung',            definition:'The German pure-XML e-invoice standard used in B2B and B2G transactions' },
        { word:'ZUGFeRD',              definition:'A hybrid e-invoice format — a readable PDF with embedded XML data' },
        { word:'structured format',    definition:'A file format computers can read and process automatically, like XML' },
        { word:'EN 16931',             definition:'The European standard defining the rules for valid electronic invoices' },
        { word:'receiving obligation', definition:'The legal requirement to be able to receive e-invoices from January 2025' },
        { word:'sending obligation',   definition:'The legal requirement to send e-invoices, phasing in from 2027/2028' },
        { word:'transition period',    definition:'The window where old and new invoicing rules run in parallel' },
        { word:'Wachstumschancengesetz', definition:'The 2024 German law that introduced the B2B e-invoicing mandate' },
        { word:'VAT compliance',       definition:'Making sure invoices meet all required VAT rules and formats' },
      ],
    },

     'weekly-drop-issue-009': {
  title:   "The Weekly Drop — Issue 009 — The Mega-Merger: SpaceX, Tesla and Elon Musk's Empire",
  level:   'All Levels',
  grammar: 'True/False; Fix the Mistake (word choice in business reporting); Word Match (M&A/business terms); Beat the Clock mixed-level quiz',
  vocab: [
    { word:'merger',             definition:'When two companies combine to form one single company.' },
    { word:'speculation',        definition:'Discussion or guessing about something that has not been confirmed.' },
    { word:'conglomerate',       definition:'A large company made up of several different businesses.' },
    { word:'synergies',          definition:'The extra benefits created when two things work together.' },
    { word:'stake',              definition:'A share or percentage of ownership in a company.' },
    { word:'valuation',          definition:'The estimated total worth of a company.' },
    { word:'cash flow positive', definition:'When a company brings in more cash than it spends.' },
    { word:'diluted',            definition:"When a shareholder's ownership percentage decreases." },
  ],
},
 

  };

  /* ─── SUPABASE CLIENT ───────────────────────────────────────── */
  async function getSB () {
    let attempts = 0;
    while (!window.supabase && attempts < 30) {
      await new Promise(r => setTimeout(r, 100));
      attempts++;
    }
    if (!window.supabase) return null;
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      global: { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY } }
    });
  }

  function hour ()      { return new Date().getHours(); }
  function dayOfWeek () { return new Date().getDay(); }

  /* ─── MOMENT REWARDS ────────────────────────────────────────── */
  const MOMENT_REWARDS = [
    { id:'dawn_patrol',      test: () => hour() >= 5 && hour() < 7,              emoji:'🌅', title:'Dawn Patrol!',        msg:'Before 7am and already doing English lessons. That is extraordinary.',                                      color:'#FF9600', shadow:'#D97800' },
    { id:'early_bird',       test: () => hour() >= 7 && hour() < 9,              emoji:'🐦', title:'Early Bird!',          msg:'Lesson done before 9am. You chose English over scrolling. That is the difference.',                        color:'#FFC800', shadow:'#E5B400' },
    { id:'morning_hero',     test: () => hour() >= 9 && hour() < 12,             emoji:'☀️', title:'Morning Hero!',        msg:'Productive morning energy. Sharp mind, sharp English.',                                                     color:'#1CB0F6', shadow:'#1899D6' },
    { id:'lunchtime_legend', test: () => hour() >= 12 && hour() < 14,            emoji:'🥪', title:'Lunchtime Legend!',    msg:'You used your lunch break to learn English. Lunchtime Legend is not a title we hand out lightly.',           color:'#FF9600', shadow:'#D97800' },
    { id:'afternoon_cool',   test: () => hour() >= 14 && hour() < 17,            emoji:'😎', title:'Afternoon Cool Dude!', msg:'The afternoon slump is real. Scientists confirmed it. You ignored it completely.',                          color:'#58CC02', shadow:'#58A700' },
    { id:'golden_hour',      test: () => hour() >= 17 && hour() < 20,            emoji:'🌅', title:'Golden Hour!',         msg:'End of the working day and you still found energy for a lesson.',                                           color:'#CE82FF', shadow:'#A559D9' },
    { id:'night_owl',        test: () => hour() >= 20 && hour() < 23,            emoji:'🦉', title:'Night Owl!',           msg:'It is evening, most people have switched off, and here you are.',                                           color:'#4B4B8F', shadow:'#2E2E6B' },
    { id:'midnight_scholar', test: () => hour() >= 23 || hour() < 5,             emoji:'🌙', title:'Midnight Scholar!',    msg:'It is the middle of the night and you just finished an English lesson. Respect.',                           color:'#1a2e5a', shadow:'#0d1a3a' },
    { id:'monday_crusher',   test: () => dayOfWeek() === 1,                       emoji:'💪', title:'Monday Crusher!',      msg:'Monday. The hardest day. You did a lesson anyway.',                                                          color:'#1CB0F6', shadow:'#1899D6' },
    { id:'friday_legend',    test: () => dayOfWeek() === 5,                       emoji:'🎉', title:'Friday Legend!',       msg:'It is Friday and instead of winding down you did an English lesson.',                                        color:'#CE82FF', shadow:'#A559D9' },
    { id:'weekend_warrior',  test: () => dayOfWeek() === 0 || dayOfWeek() === 6, emoji:'🎮', title:'Weekend Warrior!',     msg:'The weekend. Most people are resting. You are learning.',                                                   color:'#2BDECC', shadow:'#1FBFAF' },
    { id:'perfectionist',    test: (d) => d.perfectScore === true,                emoji:'💯', title:'Perfectionist!',       msg:'Every. Single. Answer. Correct. That is not luck — that is knowing your stuff.',                           color:'#58CC02', shadow:'#58A700' },
    { id:'hot_streak',       test: (d) => d.bestCombo >= 10,                      emoji:'🔥', title:'On Fire!',             msg:'10 correct in a row. Your brain was in a different gear today.',                                            color:'#FF4B4B', shadow:'#EA2B2B' },
    { id:'speed_learner',    test: (d) => d.completionTime && d.completionTime < 300, emoji:'⚡', title:'Speed Learner!',   msg:'That was fast. Either you knew everything or you are just built different.',                               color:'#FFC800', shadow:'#E5B400' },
    { id:'lesson_complete',  test: () => true,                                    emoji:'🌟', title:'Lesson Complete!',     msg:'Another lesson done. Every lesson is a tiny version of you becoming a better version of you.',              color:'#58CC02', shadow:'#58A700' },
  ];

  function fireReward (lessonData) {
    const reward = MOMENT_REWARDS.find(r => r.test(lessonData));
    if (!reward) return;
    let msg = reward.msg;
    if (reward.id === 'hot_streak' && lessonData.bestCombo) {
      msg = `${lessonData.bestCombo} correct in a row. Your brain was in a different gear today.`;
    }
    setTimeout(() => {
      if (window.EFCD_FX?.milestone) {
        window.EFCD_FX.milestone(reward.emoji, reward.title, msg, reward.color, reward.shadow);
        window.EFCD_FX.confetti();
      } else {
        _fallbackOverlay(reward, msg);
      }
    }, 800);
  }

  function _fallbackOverlay (reward, msg) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Nunito,system-ui,sans-serif;';
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:24px;padding:36px 28px;max-width:380px;width:100%;text-align:center;border:3px solid ${reward.color};border-bottom:8px solid ${reward.shadow};">
        <div style="font-size:72px;line-height:1;margin-bottom:12px">${reward.emoji}</div>
        <div style="font-size:26px;font-weight:900;color:${reward.shadow};margin-bottom:10px">${reward.title}</div>
        <div style="font-size:14px;font-weight:700;color:#4B4B4B;line-height:1.6;margin-bottom:24px">${msg}</div>
        <button style="width:100%;padding:14px;background:${reward.color};color:#fff;border:none;border-radius:16px;font-size:16px;font-weight:900;cursor:pointer;font-family:inherit;" onclick="this.closest('div[style]').parentElement.remove()">Keep going! 🚀</button>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    setTimeout(() => overlay.remove(), 5000);
  }

  /* ─── CLASS BRIDGE ──────────────────────────────────────────── */
  async function submitToClass (lessonData) {
    const classId    = localStorage.getItem('efcd_class_id');
    const presentRaw = localStorage.getItem('efcd_present_names');
    if (!classId) return null;

    const client = await getSB();
    if (!client) return null;

    try {
      // Get session ID
      let sessionId = localStorage.getItem('efcd_session_id');
      if (!sessionId) {
        const { data: sessions } = await client
          .from('efcd_sessions')
          .select('id')
          .eq('class_id', classId)
          .is('ended_at', null)
          .order('started_at', { ascending: false })
          .limit(1);
        sessionId = sessions?.[0]?.id;
      }
      if (!sessionId) return null;

      // Get class details
      const { data: classes } = await client
        .from('efcd_classes')
        .select('id, name, team_name')
        .eq('id', classId)
        .limit(1);
      const cls = classes?.[0];
      if (!cls) return null;

      const displayName  = cls.team_name || cls.name;
      const presentNames = JSON.parse(presentRaw || '[]').filter(n => n !== 'the class');
      const xp           = lessonData.xp || 0;

      // Insert score
      await client.from('efcd_scores').insert({
        student_id:   'class_' + classId,
        student_name: displayName,
        class_id:     classId,
        session_id:   sessionId,
        correct:      lessonData.correctAnswers || 0,
        answered:     lessonData.totalAnswers   || 0,
        xp:           xp,
        date:         new Date().toISOString().split('T')[0],
      });

      // Award lesson badge to all present students
      if (presentNames.length > 0) {
        const { data: students } = await client
          .from('efcd_students')
          .select('id, name')
          .eq('class_id', classId);
        const present = (students || []).filter(s => presentNames.includes(s.name));
        if (present.length > 0) {
          await client.from('efcd_badges').insert(
            present.map(s => ({
              student_id:   s.id,
              student_name: s.name,
              class_id:     classId,
              badge_key:    'lesson_' + (lessonData.lessonId || 'complete'),
              badge_emoji:  lessonData.badgeIcon || '🏅',
              badge_label:  lessonData.badgeName || 'Lesson Complete',
              is_manual:    false,
              session_id:   sessionId,
            }))
          );
        }
      }

      // ── VOCAB SAVE ────────────────────────────────────────────
      const lessonId      = lessonData.lessonId || '';
      const registryEntry = LESSON_VOCAB_REGISTRY[lessonId] || null;
      const vocabToSave   = lessonData.vocabulary?.length
        ? lessonData.vocabulary
        : registryEntry?.vocab || [];

      if (vocabToSave.length > 0) {
        await fetch(SUPABASE_URL + '/rest/v1/efcd_lesson_vocab', {
          method: 'POST',
          headers: {
            'Content-Type':  'application/json',
            'apikey':        SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Prefer':        'return=minimal',
          },
          body: JSON.stringify({
            class_id:      classId,
            session_id:    sessionId,
            lesson_id:     lessonId,
            lesson_title:  lessonData.lessonTitle  || registryEntry?.title   || '',
            lesson_level:  lessonData.lessonLevel  || registryEntry?.level   || '',
            vocab:         vocabToSave,
            grammar_focus: lessonData.grammarFocus || registryEntry?.grammar || null,
            completed_at:  new Date().toISOString(),
          }),
        });
      }

      // ── AUTO-ACTIVATE CLASS SRS ───────────────────────────────
      // When a class completes a lesson for the first time, populate
      // efcd_srs_class_items so the teacher can run a group SRS
      // review session the next time the class meets.
      //
      // Requires on the lesson page (in this order):
      //   <script src="/srs-engine.js"></script>
      //   <script src="/xp.js"></script>
      //   <script src="/lesson-data-registry.js"></script>
      //   <script src="/lesson-completion-rewards.js"></script>
      try {
        if (window.EFCD_SRS && lessonId) {
          const reg = window.LESSON_DATA_REGISTRY?.[lessonId];
          if (reg) {
            const srsItems = window.EFCD_SRS.ITEMS.extract(reg, lessonId);

            if (srsItems.length > 0) {
              // Only activate once — check if already exists
              const { data: existing } = await client
                .from('efcd_srs_class_items')
                .select('id')
                .eq('class_id', classId)
                .eq('lesson_id', lessonId)
                .limit(1);

              if (!existing?.length) {
                // Schedule first review for tomorrow
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const firstReview = tomorrow.toISOString().split('T')[0];

                await client.from('efcd_srs_class_items').insert(
                  srsItems.map(item => ({
                    class_id:        classId,
                    lesson_id:       lessonId,
                    item_key:        item.key,
                    item_type:       item.type,
                    status:          'active',
                    interval_days:   1,
                    ease_factor:     2.5,
                    review_count:    0,
                    next_review_at:  firstReview,
                    created_at:      new Date().toISOString(),
                  }))
                );

                console.log(`🧠 Class SRS activated — ${classId} — ${lessonId} — ${srsItems.length} items, first review ${firstReview}`);
              }
            }
          }
        }
      } catch (srsErr) {
        // Non-fatal — lesson completion still succeeds if SRS fails
        console.warn('Class SRS auto-activate error:', srsErr.message);
      }
      // ── END AUTO-ACTIVATE CLASS SRS ───────────────────────────

      console.log('✅ EFCD v3.0: submitted for', displayName,
        '— correct:', lessonData.correctAnswers,
        '— XP:', xp,
        '— vocab words:', vocabToSave.length);

      return {
        inClass:     true,
        displayName,
        presentNames,
        xp,
        correct:     lessonData.correctAnswers || 0,
        submitted:   true,
      };

    } catch (err) {
      console.warn('EFCD Class Bridge error:', err.message);
      return null;
    }
  }

  /* ─── SESSION VALIDATOR ─────────────────────────────────────── */
  async function validateClassSession (pillElementId) {
    const classId = localStorage.getItem('efcd_class_id');
    if (!classId) return { wasActive: false, cleared: false };
    try {
      const client = await getSB();
      if (!client) return { wasActive: false, cleared: false };
      const { data } = await client
        .from('efcd_classes')
        .select('is_active')
        .eq('id', classId)
        .single();
      if (!data || !data.is_active) {
        localStorage.removeItem('efcd_class_id');
        localStorage.removeItem('efcd_session_id');
        localStorage.removeItem('efcd_present_names');
        if (pillElementId) {
          const pill = document.getElementById(pillElementId);
          if (pill) pill.classList.remove('show');
        }
        return { wasActive: false, cleared: true };
      }
      return { wasActive: true, cleared: false };
    } catch (e) {
      return { wasActive: false, cleared: false };
    }
  }

  /* ─── PUBLIC API ─────────────────────────────────────────────── */
  async function onLessonComplete (lessonData) {
    fireReward(lessonData);
    const classResult = await submitToClass(lessonData);

    // Award XP to logged-in individual user
    if (window.EFCD_XP) {
      try {
        await window.EFCD_XP.onLessonComplete({
          lessonId:       lessonData.lessonId       || '',
          correctAnswers: lessonData.correctAnswers  || 0,
          totalAnswers:   lessonData.totalAnswers    || 0,
        });
      } catch(e) {
        console.warn('XP award error:', e.message);
      }
    }

    return classResult;
  }

  window.EFCD_Rewards = {
    onLessonComplete,
    fireReward,
    submitToClass,
    validateClassSession,
    LESSON_VOCAB_REGISTRY,
  };

  console.log('🎉 EFCD Rewards v3.0 loaded — class SRS auto-activate enabled');

})();
