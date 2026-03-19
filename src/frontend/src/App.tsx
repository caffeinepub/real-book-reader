import { useGetBook } from "@/hooks/useQueries";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const queryClient = new QueryClient();

const TOTAL_PAGES = 60;
const MAX_SPREAD = 31;

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F0D060";
const GOLD_DIM = "rgba(212,175,55,0.55)";
const GOLD_FAINT = "rgba(212,175,55,0.18)";
const NAVY_DEEP = "#020C1B";
const NAVY_MID = "#0A1F3D";
const NAVY_LIGHT = "#0D2752";
const NAVY_COVER = "#071530";

const PHRASE_PAGES: { heading: string; lines: string[] }[] = [
  {
    heading: "Daily Phrases — Page 1",
    lines: [
      "DAILY USEABLE PHRASES (HINDI & ENGLISH)",
      "",
      "GREETINGS & INTRODUCTIONS:",
      "1.  Hello! / Hi!          — Namaste! / Hello!",
      "2.  Good morning!          — Subah ki shubhkamnaen!",
      "3.  Good evening!          — Shaam ki shubhkamnaen!",
      "4.  How are you?           — Aap kaise hain?",
      "5.  I am fine, thank you.  — Main theek hoon, shukriya.",
      "6.  What is your name?     — Aapka naam kya hai?",
      "7.  My name is Raj.        — Mera naam Raj hai.",
      "8.  Nice to meet you!      — Milke bahut khushi hui!",
      "9.  Goodbye!               — Alvida! / Phir milenge!",
      "10. See you tomorrow!      — Kal milte hain!",
      "",
      "DAILY LIFE PHRASES:",
      "11. Please sit down.       — Kripya baith jaiye.",
      "12. Wait a moment please.  — Ek pal ruko please.",
      "13. Come in please.        — Andar aao please.",
      "14. Please help me.        — Meri madad karo please.",
    ],
  },
  {
    heading: "Daily Phrases — Page 2",
    lines: [
      "15. Thank you very much.   — Bahut bahut shukriya.",
      "16. You're welcome.        — Koi baat nahi.",
      "17. Sorry / Excuse me.     — Maafi chahta hoon.",
      "18. I don't understand.    — Main samjha nahi.",
      "19. Please speak slowly.   — Dhire boliye please.",
      "20. Can you repeat please? — Dobara boliye please.",
      "",
      "ASKING QUESTIONS:",
      "21. Where is the bathroom? — Washroom kahan hai?",
      "22. What time is it?       — Kitne baje hain?",
      "23. How much does it cost? — Iska kya daam hai?",
      "24. Where are you going?   — Aap kahan ja rahe ho?",
      "25. What are you doing?    — Aap kya kar rahe ho?",
      "26. Who is calling?        — Kaun call kar raha hai?",
      "27. When will you come?    — Aap kab aoge?",
      "28. Why are you late?      — Aap late kyun aaye?",
      "29. Which is the best way? — Sabse accha rasta kaun sa?",
      "30. How far is it?         — Yahan se kitna door hai?",
      "",
    ],
  },
  {
    heading: "Daily Phrases — Page 3",
    lines: [
      "SHOPPING PHRASES:",
      "31. How much is this?      — Yeh kitne ka hai?",
      "32. It is too expensive.   — Yeh bahut mehnga hai.",
      "33. Can you give discount? — Kuch discount doge?",
      "34. I will take this.      — Mujhe yeh chahiye.",
      "35. Any other colour?      — Koi aur rang hai?",
      "36. Give me the bill.      — Bill dena please.",
      "37. I need a receipt.      — Mujhe receipt chahiye.",
      "38. Do you accept UPI?     — Kya aap UPI lete ho?",
      "39. Is this fresh?         — Kya yeh taaza hai?",
      "40. Pack this please.      — Pack kar do please.",
      "",
      "TRAVEL PHRASES:",
      "41. Where is the bus stop? — Bus stop kahan hai?",
      "42. One ticket to Delhi.   — Delhi ka ek ticket please.",
      "43. Which platform?        — Kaun sa platform hai?",
      "44. Is this seat empty?    — Kya yeh seat khaali hai?",
      "45. Stop here please.      — Yahan roko please.",
      "46. Turn left / right.     — Baayein / Daayein mudo.",
    ],
  },
  {
    heading: "Daily Phrases — Page 4",
    lines: [
      "47. Go straight.           — Seedha jaiye.",
      "48. I am lost.             — Mujhe raasta nahi pata.",
      "49. Call a doctor please.  — Doctor ko bulaiye please.",
      "50. I need help.           — Mujhe madad chahiye.",
      "",
      "FEELINGS & EXPRESSIONS:",
      "51. I am very happy today. — Aaj main bahut khush hoon.",
      "52. I am not feeling well. — Mujhe theek nahi lag raha.",
      "53. I am hungry.           — Mujhe bhookh lagi hai.",
      "54. I am thirsty.          — Mujhe pyaas lagi hai.",
      "55. I am tired.            — Main thaka hua hoon.",
      "56. I am scared.           — Mujhe darr lag raha hai.",
      "57. Don't worry, it's okay.— Chinta mat karo, sab theek hai.",
      "58. Very good! / Well done! — Bahut accha! / Shabash!",
      "59. I love you.            — Main tumse pyaar karta hoon.",
      "60. All the best!          — Aapko bahut shubhkamnaen!",
      "",
      "Practice these daily for best results!",
      "English + Hindi = Double Power!",
    ],
  },
];

// ─── Modal Auxiliary Pages 5, 6, 7 ───
const MODAL_PAGES: { heading: string; subheading: string; lines: string[] }[] =
  [
    {
      heading: "MODAL AUXILIARIES — PAGE 5",
      subheading: "Modal Sahayak Kriyaen — Pej 5",
      lines: [
        "MODAL AUXILIARIES / मोडल सहायक क्रियाएँ",
        "(Help express ability, permission, possibility)",
        "─────────────────────────────────────",
        "1. CAN — क्षमता / अनुमति (Ability / Permission)",
        "   I can speak English.",
        "   Main English bol sakta hoon.",
        "   Can you help me?",
        "   Kya aap meri madad kar sakte hain?",
        "─────────────────────────────────────",
        "2. COULD — विनम्र अनुरोध / भूत क्षमता",
        "   (Polite request / Past ability)",
        "   I could run fast in childhood.",
        "   Main bachpan mein tez daud sakta tha.",
        "   Could you please open the door?",
        "   Kya aap darwaza khol sakte hain?",
        "─────────────────────────────────────",
        "3. SHALL — प्रस्ताव / भविष्य (Offer / Future)",
        "   Shall I help you?",
        "   Kya main aapki madad karoon?",
        "   We shall meet again.",
        "   Hum dobara milenge.",
      ],
    },
    {
      heading: "MODAL AUXILIARIES — PAGE 6",
      subheading: "Modal Sahayak Kriyaen — Pej 6",
      lines: [
        "4. SHOULD — सलाह / कर्तव्य (Advice / Duty)",
        "   You should drink more water.",
        "   Aapko zyada paani peena chahiye.",
        "   She should study daily.",
        "   Use roz padhna chahiye.",
        "─────────────────────────────────────",
        "5. WILL — निश्चित भविष्य (Definite Future)",
        "   I will call you tomorrow.",
        "   Main kal aapko call karoonga.",
        "   It will rain today.",
        "   Aaj baarish hogi.",
        "─────────────────────────────────────",
        "6. WOULD — विनम्र अनुरोध / शर्त",
        "   (Polite request / Conditional)",
        "   Would you like some tea?",
        "   Kya aap chai lenge?",
        "   I would help if I had time.",
        "   Agar time hota to main madad karta.",
        "─────────────────────────────────────",
        "",
        "",
      ],
    },
    {
      heading: "MODAL AUXILIARIES — PAGE 7",
      subheading: "Modal Sahayak Kriyaen — Pej 7",
      lines: [
        "7. MAY — संभावना / अनुमति (Possibility / Permission)",
        "   It may rain this evening.",
        "   Shaam ko baarish ho sakti hai.",
        "   May I come in?",
        "   Kya main andar aa sakta hoon?",
        "─────────────────────────────────────",
        "8. MIGHT — कम संभावना (Less Possibility)",
        "   She might be at home.",
        "   Woh ghar par ho sakti hai.",
        "   I might join later.",
        "   Main baad mein aa sakta hoon.",
        "─────────────────────────────────────",
        "9. OUGHT TO — नैतिक कर्तव्य (Moral Duty)",
        "   You ought to respect elders.",
        "   Aapko bado ka aadhar karna chahiye.",
        "   We ought to keep our city clean.",
        "   Hume shehar saaf rakhna chahiye.",
        "─────────────────────────────────────",
        "NOTE: Modals never change form!",
        "याद: Modals ki spelling नहीं बदलती!",
      ],
    },
  ];

// ─── Primary Auxiliary Page 8 ───
const PRIMARY_AUX_PAGE = {
  heading: "PRIMARY AUXILIARIES — PAGE 8",
  subheading: "Prathmik Sahayak Kriyaen — Pej 8",
  lines: [
    "PRIMARY AUXILIARIES / प्राथमिक सहायक क्रियाएँ",
    "(Used to form tenses, questions, negatives)",
    "─────────────────────────────────────",
    "1. BE — होना (Am / Is / Are / Was / Were)",
    "   Used for continuous tenses & passive voice.",
    "   She is reading a book.",
    "   Woh kitaab padh rahi hai.",
    "   They were playing cricket.",
    "   Woh log cricket khel rahe the.",
    "─────────────────────────────────────",
    "2. DO — करना (Do / Does / Did)",
    "   Used for questions, negatives & emphasis.",
    "   Do you speak English?",
    "   Kya aap English bolte hain?",
    "   She does not eat meat.",
    "   Woh gosht nahi khati.",
    "─────────────────────────────────────",
    "3. HAVE — होना / पास होना (Have / Has / Had)",
    "   Used to form perfect tenses.",
  ],
};

const ARTICLES_PAGES: {
  heading: string;
  subheading: string;
  lines: string[];
}[] = [
  {
    heading: "ARTICLES — PAGE 9",
    subheading: "Articles — Pej 9",
    lines: [
      "ARTICLES / आर्टिकल्स (A, AN, THE)",
      "(Used before nouns to define them)",
      "─────────────────────────────────────",
      "1. A — (अनिश्चित / Indefinite Article)",
      "   Used before consonant sounds.",
      "   I saw a dog in the park.",
      "   Maine park mein ek kutta dekha.",
      "   She is a teacher.",
      "   Woh ek teacher hai.",
      "─────────────────────────────────────",
      "2. AN — (अनिश्चित / Indefinite Article)",
      "   Used before vowel sounds (a,e,i,o,u).",
      "   He ate an apple.",
      "   Usne ek seb khaya.",
      "   She is an honest girl.",
      "   Woh ek imaandaar ladki hai.",
      "─────────────────────────────────────",
      "NOTE: A/AN = किसी एक चीज़ के लिए",
      "Use A before consonant, AN before vowel!",
    ],
  },
  {
    heading: "ARTICLES — PAGE 10",
    subheading: "Articles — Pej 10",
    lines: [
      "3. THE — (निश्चित / Definite Article)",
      "   Used for specific/known things.",
      "   The sun rises in the east.",
      "   Surya poorab mein ugta hai.",
      "   Please close the door.",
      "   Kripya darwaza band karo.",
      "─────────────────────────────────────",
      "WHEN TO USE THE:",
      "   • Specific noun already known",
      "   • Unique things (sun, moon, sky)",
      "   • Superlatives: the best, the biggest",
      "─────────────────────────────────────",
      "QUICK COMPARISON / तुलना:",
      "   A cat = कोई एक बिल्ली",
      "   An elephant = कोई एक हाथी",
      "   The cat = वही बिल्ली (जो हम जानते हैं)",
      "─────────────────────────────────────",
      "NOTE: THE = एक निश्चित चीज़ के लिए!",
      "Practice: A/AN = any one, THE = that one!",
    ],
  },
];

const IMPERATIVE_PAGES: {
  heading: string;
  subheading: string;
  lines: string[];
}[] = [
  {
    heading: "IMPERATIVE SENTENCES — PAGE 11",
    subheading: "Imperative / Aadesh Wale Vakya",
    lines: [
      "IMPERATIVE SENTENCES / आदेश वाले वाक्य",
      "─────────────────────────────────────",
      "WHAT IS IMPERATIVE? / क्या है?",
      "   Sentences that give ORDER, REQUEST,",
      "   ADVICE, or INSTRUCTION are called",
      "   Imperative Sentences.",
      "   जो वाक्य आदेश, विनती, सलाह या",
      "   निर्देश देते हैं — वो Imperative हैं।",
      "─────────────────────────────────────",
      "FORMULA: Verb (base form) + Object",
      "   Subject (You) is always HIDDEN!",
      "   You is always the hidden subject.",
      "─────────────────────────────────────",
      "TYPE 1 — ORDER / आदेश देना:",
      "   Sit down! = बैठ जाओ!",
      "   Be quiet! = चुप रहो!",
      "   Stand up! = खड़े हो जाओ!",
      "   Close the door! = दरवाज़ा बंद करो!",
      "─────────────────────────────────────",
      "NOTE: Strong command = use (!) mark",
    ],
  },
  {
    heading: "IMPERATIVE SENTENCES — PAGE 12",
    subheading: "Imperative — Pg 12",
    lines: [
      "TYPE 2 — REQUEST / विनती करना:",
      "   Please help me. = कृपया मेरी मदद करो।",
      "   Please sit here. = कृपया यहाँ बैठिए।",
      "   Please be on time. = कृपया समय पर आएं।",
      "   TIP: Add 'Please' to make it polite!",
      "─────────────────────────────────────",
      "TYPE 3 — ADVICE / सलाह देना:",
      "   Work hard. = मेहनत करो।",
      "   Eat healthy food. = स्वस्थ खाना खाओ।",
      "   Sleep early. = जल्दी सो जाओ।",
      "   Exercise daily. = रोज़ व्यायाम करो।",
      "─────────────────────────────────────",
      "TYPE 4 — INSTRUCTION / निर्देश देना:",
      "   Open your books. = किताब खोलो।",
      "   Write your name. = अपना नाम लिखो।",
      "   Read the question. = सवाल पढ़ो।",
      "─────────────────────────────────────",
      "NOTE: Instructions are common in exams,",
      "      kitchens, classrooms & daily life!",
    ],
  },
  {
    heading: "IMPERATIVE SENTENCES — PAGE 13",
    subheading: "Imperative — Pg 13",
    lines: [
      "NEGATIVE IMPERATIVE / मना करना:",
      "   Formula: Do not / Don't + Verb",
      "─────────────────────────────────────",
      "   Don't shout. = चिल्लाओ मत।",
      "   Don't be late. = देरी मत करो।",
      "   Do not touch this. = इसे मत छुओ।",
      "   Don't waste time. = समय बर्बाद मत करो।",
      "─────────────────────────────────────",
      "QUICK SUMMARY / याद रखो:",
      "   ORDER    → Sit! Stand! Come here!",
      "   REQUEST  → Please help me.",
      "   ADVICE   → Work hard. Sleep early.",
      "   INSTRUCTION → Open your book.",
      "   NEGATIVE → Don't run. Don't shout.",
      "─────────────────────────────────────",
      "KEY RULE: Subject (YOU) is always",
      "   hidden in Imperative sentences!",
      "   Go! = (You) Go! / जाओ!",
      "─────────────────────────────────────",
      "Practice: Make 5 sentences of your own!",
    ],
  },
];

const HOMOPHONES_PAGES: {
  heading: string;
  subheading: string;
  lines: string[];
}[] = [
  {
    heading: "HOMOPHONES — PAGE 14",
    subheading: "Same Sound, Different Meaning",
    lines: [
      "HOMOPHONES / होमोफोन्स",
      "Same Sound — Different Spelling & Meaning",
      "एक जैसी आवाज़ — अलग spelling और मतलब",
      "─────────────────────────────────────",
      "1. HERE / HEAR",
      "   HERE = यहाँ (place/जगह)",
      "   Come here. = यहाँ आओ।",
      "   HEAR = सुनना (with ears/कानों से)",
      "   I can hear music. = मुझे संगीत सुनाई देता है।",
      "─────────────────────────────────────",
      "2. THERE / THEIR / THEY'RE",
      "   THERE = वहाँ (place) → Go there.",
      "   THEIR = उनका (belonging) → Their bag.",
      "   THEY'RE = They are → They're happy.",
      "─────────────────────────────────────",
      "3. TO / TOO / TWO",
      "   TO = के लिए / की ओर → Go to school.",
      "   TOO = भी / बहुत → I am too tired.",
      "   TWO = 2 (number) → I have two cats.",
    ],
  },
  {
    heading: "HOMOPHONES — PAGE 15",
    subheading: "Homophones — Pg 15",
    lines: [
      "4. RIGHT / WRITE / RITE",
      "   RIGHT = सही / दाएं → Turn right.",
      "   WRITE = लिखना → Write your name.",
      "   RITE = रस्म / ritual → A wedding rite.",
      "─────────────────────────────────────",
      "5. SEE / SEA",
      "   SEE = देखना → I can see the stars.",
      "   SEA = समुद्र → Fish live in the sea.",
      "─────────────────────────────────────",
      "6. SUN / SON",
      "   SUN = सूरज → The sun is bright.",
      "   SON = बेटा → He is my son.",
      "─────────────────────────────────────",
      "7. FLOWER / FLOUR",
      "   FLOWER = फूल → She likes flowers.",
      "   FLOUR = आटा → Add flour to the dough.",
      "─────────────────────────────────────",
      "8. KNOW / NO",
      "   KNOW = जानना → I know the answer.",
      "   NO = नहीं → No, I can't come.",
    ],
  },
  {
    heading: "HOMOPHONES — PAGE 16",
    subheading: "Homophones — Pg 16",
    lines: [
      "9. MEET / MEAT",
      "   MEET = मिलना → Let's meet tomorrow.",
      "   MEAT = मांस → He doesn't eat meat.",
      "─────────────────────────────────────",
      "10. BARE / BEAR",
      "   BARE = नंगा / खाली → bare hands.",
      "   BEAR = भालू / सहना → bear the pain.",
      "─────────────────────────────────────",
      "11. CELL / SELL",
      "   CELL = कोशिका / कमरा → blood cell.",
      "   SELL = बेचना → I sell vegetables.",
      "─────────────────────────────────────",
      "12. WEAK / WEEK",
      "   WEAK = कमज़ोर → He is very weak.",
      "   WEEK = सप्ताह → I'll come next week.",
      "─────────────────────────────────────",
      "13. PEACE / PIECE",
      "   PEACE = शान्ति → I want peace.",
      "   PIECE = टुकड़ा → Give me a piece.",
    ],
  },
  {
    heading: "HOMOPHONES — PAGE 17",
    subheading: "Homophones — Pg 17 (Summary)",
    lines: [
      "14. HAIR / HARE",
      "   HAIR = बाल → Her hair is long.",
      "   HARE = खरगोश → A hare runs fast.",
      "─────────────────────────────────────",
      "15. FAIR / FARE",
      "   FAIR = उचित / मेला → fair price.",
      "   FARE = किराया → What is the bus fare?",
      "─────────────────────────────────────",
      "16. WHOLE / HOLE",
      "   WHOLE = पूरा → Eat the whole apple.",
      "   HOLE = छेद → There is a hole here.",
      "─────────────────────────────────────",
      "QUICK TIPS / याद करने का तरीका:",
      "   • Read both words together in one line",
      "   • Write a sentence for each word",
      "   • Same sound ≠ Same meaning!",
      "─────────────────────────────────────",
      "NOTE: Homophones confuse even native",
      "   speakers — practice them daily!",
      "   रोज़ अभ्यास करो — गलती नहीं होगी!",
    ],
  },
];

const PHONICS_PAGES: {
  heading: string;
  subheading: string;
  lines: string[];
}[] = [
  {
    heading: "PHONICS — PAGE 18",
    subheading: "Phonics kya hota hai?",
    lines: [
      "PHONICS / फोनिक्स",
      "How Letters SOUND — अक्षर कैसे बोले जाते हैं",
      "─────────────────────────────────────",
      "WHAT IS PHONICS?",
      "   Phonics = Letters ki awaaz seekhna",
      "   हर अक्षर की अपनी एक आवाज़ होती है।",
      "   जब आवाज़ें मिलती हैं → शब्द बनता है!",
      "─────────────────────────────────────",
      "VOWELS / स्वर (A E I O U):",
      "   A = 'ae' → Apple, Ant, Add",
      "   E = 'eh' → Egg, End, Elephant",
      "   I = 'ih' → Ink, Ill, Into",
      "   O = 'oh' → Orange, On, Off",
      "   U = 'uh' → Under, Up, Umbrella",
      "─────────────────────────────────────",
      "CONSONANTS / व्यंजन:",
      "   B = 'buh' → Ball, Boy, Bus",
      "   C = 'kuh' → Cat, Cup, Cow",
      "   D = 'duh' → Dog, Door, Day",
      "NOTE: Vowels = आवाज़ की नींव!",
    ],
  },
  {
    heading: "PHONICS — PAGE 19",
    subheading: "Phonics Rules / नियम",
    lines: [
      "MORE CONSONANTS / और व्यंजन:",
      "   F = 'fuh' → Fish, Fan, Far",
      "   G = 'guh' → Goat, Go, Girl",
      "   H = 'huh' → Hat, Hot, He",
      "   J = 'juh' → Jam, Jar, Jump",
      "   K = 'kuh' → Kite, Key, King",
      "   L = 'luh' → Lamp, Leg, Love",
      "   M = 'muh' → Map, Man, Mug",
      "   N = 'nuh' → Net, Nose, Name",
      "─────────────────────────────────────",
      "BLENDS / मिली हुई आवाज़ें:",
      "   BL = Black, Blue, Blow",
      "   CL = Clock, Clap, Cloud",
      "   FL = Flag, Fly, Floor",
      "   ST = Star, Stop, Step",
      "   TR = Tree, Train, Try",
      "─────────────────────────────────────",
      "TIP: Blends = 2 letters, 2 sounds!",
      "   BL → B+L together, very fast!",
      "   अभ्यास करो: धीरे बोलो फिर तेज़!",
    ],
  },
  {
    heading: "PHONICS — PAGE 20",
    subheading: "Phonics — Digraphs & Silent Letters",
    lines: [
      "DIGRAPHS / दो अक्षर, एक आवाज़:",
      "   CH = Chair, Cheese, Child",
      "   SH = Ship, Shop, Shell",
      "   TH = This, That, Three",
      "   WH = When, Where, Which",
      "   PH = Phone, Photo = 'f' sound!",
      "─────────────────────────────────────",
      "SILENT LETTERS / खामोश अक्षर:",
      "   K is silent before N:",
      "   KNOW (= 'no'), KNIFE (= 'nife')",
      "   W is silent before R:",
      "   WRITE (= 'rite'), WRONG (= 'rong')",
      "   B is silent after M:",
      "   COMB (= 'come'), LAMB (= 'lam')",
      "─────────────────────────────────────",
      "QUICK SUMMARY / याद रखो:",
      "   Vowels = A E I O U → आवाज़ की base",
      "   Blends = 2 sounds fast together",
      "   Digraphs = 2 letters = 1 new sound",
      "   Silent = letter is there, no sound!",
      "Practice daily — pronunciation improve!",
    ],
  },
];

type PageType =
  | "cover"
  | "back-cover"
  | "inner"
  | "phrase"
  | "modal"
  | "primary-aux"
  | "articles"
  | "imperative"
  | "homophones"
  | "phonics"
  | "blank";

interface PageInfo {
  type: PageType;
  phraseIndex?: number;
  modalIndex?: number;
  primaryAuxIndex?: number;
  articlesIndex?: number;
  imperativeIndex?: number;
  homophonesIndex?: number;
  phonicsIndex?: number;
  num?: number;
  side?: "left" | "right";
}

type SpreadTuple = [PageInfo, PageInfo];

function getSpread(s: number): SpreadTuple {
  if (s === 0) return [{ type: "inner" }, { type: "cover" }];
  if (s === MAX_SPREAD) return [{ type: "back-cover" }, { type: "inner" }];
  const n = (s - 1) * 2 + 1;
  if (s === 1)
    return [
      { type: "phrase", phraseIndex: 0, num: 1, side: "left" },
      { type: "phrase", phraseIndex: 1, num: 2, side: "right" },
    ];
  if (s === 2)
    return [
      { type: "phrase", phraseIndex: 2, num: 3, side: "left" },
      { type: "phrase", phraseIndex: 3, num: 4, side: "right" },
    ];
  if (s === 3)
    return [
      { type: "modal", modalIndex: 0, num: 5, side: "left" },
      { type: "modal", modalIndex: 1, num: 6, side: "right" },
    ];
  if (s === 4)
    return [
      { type: "modal", modalIndex: 2, num: 7, side: "left" },
      { type: "primary-aux", primaryAuxIndex: 0, num: 8, side: "right" },
    ];
  if (s === 5)
    return [
      { type: "articles", articlesIndex: 0, num: 9, side: "left" },
      { type: "articles", articlesIndex: 1, num: 10, side: "right" },
    ];
  if (s === 6)
    return [
      { type: "imperative", imperativeIndex: 0, num: 11, side: "left" },
      { type: "imperative", imperativeIndex: 1, num: 12, side: "right" },
    ];
  if (s === 7)
    return [
      { type: "imperative", imperativeIndex: 2, num: 13, side: "left" },
      { type: "homophones", homophonesIndex: 0, num: 14, side: "right" },
    ];
  if (s === 8)
    return [
      { type: "homophones", homophonesIndex: 1, num: 15, side: "left" },
      { type: "homophones", homophonesIndex: 2, num: 16, side: "right" },
    ];
  if (s === 9)
    return [
      { type: "homophones", homophonesIndex: 3, num: 17, side: "left" },
      { type: "phonics", phonicsIndex: 0, num: 18, side: "right" },
    ];
  if (s === 10)
    return [
      { type: "phonics", phonicsIndex: 1, num: 19, side: "left" },
      { type: "phonics", phonicsIndex: 2, num: 20, side: "right" },
    ];
  return [
    { type: "blank", num: n, side: "left" },
    { type: "blank", num: n + 1, side: "right" },
  ];
}

function getLabel(s: number): string {
  if (s === 0) return "Cover";
  if (s === MAX_SPREAD) return "Back Cover";
  const n = (s - 1) * 2 + 1;
  if (s <= 2) return `Phrases — Pages ${n}–${n + 1}`;
  if (s === 3) return "Modal Auxiliaries — Pages 5–6";
  if (s === 4) return "Modal Auxiliaries p.7 & Primary Auxiliaries p.8";
  if (s === 5) return "Articles — Pages 9–10";
  if (s === 6) return "Imperative Sentences — Pages 11–12";
  if (s === 7) return "Imperative p.13 & Homophones p.14";
  if (s === 8) return "Homophones — Pages 15–16";
  if (s === 9) return "Homophones p.17 & Phonics p.18";
  if (s === 10) return "Phonics — Pages 19–20";
  return `Pages ${n}–${n + 1} of ${TOTAL_PAGES}`;
}

function InnerCover() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, ${NAVY_MID} 60%, ${NAVY_DEEP} 100%)`,
      }}
    />
  );
}

function CoverPage({ title }: { title: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(160deg, ${NAVY_COVER} 0%, ${NAVY_MID} 40%, ${NAVY_LIGHT} 70%, ${NAVY_COVER} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.015) 3px,rgba(255,255,255,0.015) 4px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "10px",
          border: `1px solid ${GOLD_DIM}`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "16px",
          border: "1px solid rgba(212,175,55,0.2)",
          pointerEvents: "none",
        }}
      />
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <div
          key={pos}
          style={{
            position: "absolute",
            ...(pos.includes("t") ? { top: "6px" } : { bottom: "6px" }),
            ...(pos.includes("l") ? { left: "6px" } : { right: "6px" }),
            width: "20px",
            height: "20px",
            borderTop: pos.includes("t") ? `2px solid ${GOLD_DIM}` : "none",
            borderBottom: pos.includes("b") ? `2px solid ${GOLD_DIM}` : "none",
            borderLeft: pos.includes("l") ? `2px solid ${GOLD_DIM}` : "none",
            borderRight: pos.includes("r") ? `2px solid ${GOLD_DIM}` : "none",
            pointerEvents: "none",
          }}
        />
      ))}
      <div
        style={{
          width: "12px",
          height: "12px",
          background: GOLD,
          transform: "rotate(45deg)",
          marginBottom: "14px",
          position: "relative",
          zIndex: 1,
          boxShadow: `0 0 12px ${GOLD_DIM}`,
        }}
      />
      <div
        style={{
          width: "80px",
          height: "1px",
          background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
          marginBottom: "12px",
          position: "relative",
          zIndex: 1,
        }}
      />
      <p
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          color: "rgba(212,175,55,0.65)",
          fontSize: "0.58rem",
          fontStyle: "italic",
          textAlign: "center",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          position: "relative",
          zIndex: 1,
          marginBottom: "10px",
        }}
      >
        A Complete Course
      </p>
      <h1
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          color: GOLD,
          fontSize: "clamp(1.05rem, 2.8vw, 1.6rem)",
          fontWeight: 700,
          textAlign: "center",
          textShadow: `0 2px 20px rgba(0,0,0,0.9), 0 0 30px ${GOLD_FAINT}`,
          letterSpacing: "0.1em",
          lineHeight: 1.35,
          position: "relative",
          zIndex: 1,
        }}
      >
        {title}
      </h1>
      <div
        style={{
          width: "80px",
          height: "1px",
          background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
          margin: "12px 0",
          position: "relative",
          zIndex: 1,
        }}
      />
      <p
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          color: "rgba(212,175,55,0.5)",
          fontSize: "0.62rem",
          fontStyle: "italic",
          textAlign: "center",
          letterSpacing: "0.2em",
          position: "relative",
          zIndex: 1,
        }}
      >
        30 Days · Beginner to Confident
      </p>
      <div
        style={{
          width: "10px",
          height: "10px",
          border: `1px solid ${GOLD_DIM}`,
          transform: "rotate(45deg)",
          marginTop: "14px",
          position: "relative",
          zIndex: 1,
        }}
      />
    </div>
  );
}

function BackCoverPage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(160deg, ${NAVY_COVER} 0%, ${NAVY_MID} 50%, ${NAVY_COVER} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "10px",
          border: "1px solid rgba(212,175,55,0.35)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "16px",
          border: "1px solid rgba(212,175,55,0.15)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: `1px solid ${GOLD_DIM}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "14px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            background: GOLD,
            borderRadius: "50%",
            boxShadow: `0 0 8px ${GOLD_DIM}`,
          }}
        />
      </div>
      <p
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          color: GOLD_DIM,
          fontSize: "1.1rem",
          fontStyle: "italic",
          textAlign: "center",
          letterSpacing: "0.3em",
          position: "relative",
          zIndex: 1,
          marginBottom: "24px",
        }}
      >
        Fin
      </p>
      <div
        style={{
          width: "60px",
          height: "1px",
          background: `linear-gradient(to right, transparent, ${GOLD_DIM}, transparent)`,
          marginBottom: "20px",
          position: "relative",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          border: `1px solid ${GOLD_DIM}`,
          borderRadius: "6px",
          padding: "12px 24px",
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            color: "rgba(212,175,55,0.5)",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Price
        </span>
        <span
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            color: GOLD,
            fontSize: "1.6rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            lineHeight: 1,
            textShadow: `0 0 12px ${GOLD_FAINT}`,
          }}
        >
          ₹80
        </span>
      </div>
    </div>
  );
}

function PhrasePage({
  phraseIndex,
  side,
  num,
}: { phraseIndex: number; side: "left" | "right"; num?: number }) {
  const pg = PHRASE_PAGES[phraseIndex];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#FDFCF8",
        backgroundImage:
          "linear-gradient(transparent calc(100% - 1px), rgba(100,120,200,0.18) calc(100% - 1px))",
        backgroundSize: "100% 5%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          ...(side === "left" ? { left: "38px" } : { right: "38px" }),
          top: 0,
          bottom: 0,
          width: "1px",
          backgroundColor: "rgba(200,80,80,0.14)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          width: "100%",
          height: "5%",
          background: GOLD_FAINT,
          borderBottom: "1px solid rgba(212,175,55,0.28)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: side === "left" ? "44px" : "10px",
          paddingRight: side === "right" ? "44px" : "10px",
          zIndex: 2,
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: "8.5px",
            color: NAVY_MID,
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: "italic",
            letterSpacing: "0.12em",
            opacity: 0.7,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {pg.heading}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          padding: "2px 10px 26px 44px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 2,
          position: "relative",
        }}
      >
        {pg.lines.slice(0, 19).map((line, i) => {
          const isHeading =
            line === line.toUpperCase() &&
            line.trim().length > 3 &&
            !line.startsWith("0") &&
            !line.match(/^\d/);
          const isPhrase = line.match(/^\d/);
          return (
            <div
              key={`p${phraseIndex}-${line.slice(0, 10)}-${i}`}
              style={{ flex: 1, display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  fontSize: "clamp(6.5px, 1.4vw, 9px)",
                  fontFamily: '"Courier New", Courier, monospace',
                  fontWeight: isHeading ? 700 : 400,
                  color: isHeading
                    ? NAVY_MID
                    : isPhrase
                      ? "#1a1a2e"
                      : "#444460",
                  letterSpacing: isHeading ? "0.1em" : "0.02em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  borderBottom: isHeading
                    ? "1px solid rgba(212,175,55,0.35)"
                    : "none",
                  paddingBottom: isHeading ? "1px" : "0",
                }}
              >
                {line || "\u00a0"}
              </span>
            </div>
          );
        })}
      </div>
      {num !== undefined && (
        <div
          style={{
            position: "absolute",
            bottom: "7px",
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            zIndex: 3,
            userSelect: "none",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "18px",
              height: "1px",
              background: "rgba(212,175,55,0.4)",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "rgba(10,31,61,0.55)",
              fontFamily: '"Playfair Display", Georgia, serif',
              letterSpacing: "0.12em",
            }}
          >
            {num}
          </span>
          <span
            style={{
              display: "inline-block",
              width: "18px",
              height: "1px",
              background: "rgba(212,175,55,0.4)",
            }}
          />
        </div>
      )}
    </div>
  );
}

function ModalPage({
  modalIndex,
  side,
  num,
}: { modalIndex: number; side: "left" | "right"; num?: number }) {
  const pg = MODAL_PAGES[modalIndex];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#FDFCF8",
        backgroundImage:
          "linear-gradient(transparent calc(100% - 1px), rgba(100,120,200,0.18) calc(100% - 1px))",
        backgroundSize: "100% 5%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          ...(side === "left" ? { left: "38px" } : { right: "38px" }),
          top: 0,
          bottom: 0,
          width: "1px",
          backgroundColor: "rgba(200,80,80,0.14)",
          zIndex: 1,
        }}
      />
      {/* Gold header */}
      <div
        style={{
          width: "100%",
          height: "5%",
          background: "rgba(212,175,55,0.22)",
          borderBottom: "1px solid rgba(212,175,55,0.35)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          paddingRight: "10px",
          zIndex: 2,
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: "7px",
            color: NAVY_MID,
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            letterSpacing: "0.1em",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {pg.heading} | {pg.subheading}
        </span>
      </div>
      {/* Lines */}
      <div
        style={{
          flex: 1,
          padding: "2px 10px 26px 44px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 2,
          position: "relative",
        }}
      >
        {pg.lines.map((line, i) => {
          const isHindi = /[\u0900-\u097F]/.test(line);
          const isSeparator = line.startsWith("─");
          const isNumbered = /^\d+\./.test(line);
          const isIndented = line.startsWith("   ");
          const isNote = line.startsWith("NOTE") || line.startsWith("याद");
          const isHeading = isNumbered;
          return (
            <div
              key={`m${modalIndex}-${line.slice(0, 10)}-${i}`}
              style={{ flex: 1, display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  fontSize: isSeparator
                    ? "6px"
                    : isHindi
                      ? "clamp(5.5px, 1.2vw, 7.5px)"
                      : "clamp(6px, 1.3vw, 8px)",
                  fontFamily: isHindi
                    ? "'Noto Sans Devanagari', Arial, sans-serif"
                    : '"Courier New", Courier, monospace',
                  fontWeight: isHeading || isNote ? 700 : 400,
                  color: isHeading
                    ? NAVY_MID
                    : isHindi
                      ? "#2a1a5e"
                      : isSeparator
                        ? "rgba(212,175,55,0.5)"
                        : isNote
                          ? "#7a3000"
                          : isIndented
                            ? "#1a1a2e"
                            : "#1a1a2e",
                  letterSpacing: isHeading ? "0.06em" : "0.01em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  borderBottom: isHeading
                    ? "1px solid rgba(212,175,55,0.3)"
                    : "none",
                  paddingBottom: isHeading ? "1px" : "0",
                  paddingLeft: isIndented ? "4px" : "0",
                }}
              >
                {line || "\u00a0"}
              </span>
            </div>
          );
        })}
      </div>
      {num !== undefined && (
        <div
          style={{
            position: "absolute",
            bottom: "7px",
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            zIndex: 3,
            userSelect: "none",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "18px",
              height: "1px",
              background: "rgba(212,175,55,0.4)",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "rgba(10,31,61,0.55)",
              fontFamily: '"Playfair Display", Georgia, serif',
              letterSpacing: "0.12em",
            }}
          >
            {num}
          </span>
          <span
            style={{
              display: "inline-block",
              width: "18px",
              height: "1px",
              background: "rgba(212,175,55,0.4)",
            }}
          />
        </div>
      )}
    </div>
  );
}

function PrimaryAuxPage({
  side,
  num,
}: { side: "left" | "right"; num?: number }) {
  const pg = PRIMARY_AUX_PAGE;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#FDFCF8",
        backgroundImage:
          "linear-gradient(transparent calc(100% - 1px), rgba(100,120,200,0.18) calc(100% - 1px))",
        backgroundSize: "100% 5%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          ...(side === "left" ? { left: "38px" } : { right: "38px" }),
          top: 0,
          bottom: 0,
          width: "1px",
          backgroundColor: "rgba(200,80,80,0.14)",
          zIndex: 1,
        }}
      />
      {/* Gold header */}
      <div
        style={{
          width: "100%",
          height: "5%",
          background: "rgba(212,175,55,0.22)",
          borderBottom: "1px solid rgba(212,175,55,0.35)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          paddingRight: "10px",
          zIndex: 2,
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: "7px",
            color: NAVY_MID,
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            letterSpacing: "0.1em",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {pg.heading} | {pg.subheading}
        </span>
      </div>
      {/* Lines */}
      <div
        style={{
          flex: 1,
          padding: "2px 10px 26px 44px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 2,
          position: "relative",
        }}
      >
        {pg.lines.map((line, i) => {
          const isHindi = /[\u0900-\u097F]/.test(line);
          const isSeparator = line.startsWith("─");
          const isNumbered = /^\d+\./.test(line);
          const isIndented = line.startsWith("   ");
          const isNote = line.startsWith("NOTE") || line.startsWith("याद");
          const isHeading = isNumbered;
          return (
            <div
              key={`pa-${line.slice(0, 10)}-${i}`}
              style={{ flex: 1, display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  fontSize: isSeparator
                    ? "6px"
                    : isHindi
                      ? "clamp(5.5px, 1.2vw, 7.5px)"
                      : "clamp(6px, 1.3vw, 8px)",
                  fontFamily: isHindi
                    ? "'Noto Sans Devanagari', Arial, sans-serif"
                    : '"Courier New", Courier, monospace',
                  fontWeight: isHeading || isNote ? 700 : 400,
                  color: isHeading
                    ? NAVY_MID
                    : isHindi
                      ? "#2a1a5e"
                      : isSeparator
                        ? "rgba(212,175,55,0.5)"
                        : isNote
                          ? "#7a3000"
                          : "#1a1a2e",
                  letterSpacing: isHeading ? "0.06em" : "0.01em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  borderBottom: isHeading
                    ? "1px solid rgba(212,175,55,0.3)"
                    : "none",
                  paddingBottom: isHeading ? "1px" : "0",
                  paddingLeft: isIndented ? "4px" : "0",
                }}
              >
                {line || "\u00a0"}
              </span>
            </div>
          );
        })}
      </div>
      {num !== undefined && (
        <div
          style={{
            position: "absolute",
            bottom: "7px",
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            zIndex: 3,
            userSelect: "none",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "18px",
              height: "1px",
              background: "rgba(212,175,55,0.4)",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "rgba(10,31,61,0.55)",
              fontFamily: '"Playfair Display", Georgia, serif',
              letterSpacing: "0.12em",
            }}
          >
            {num}
          </span>
          <span
            style={{
              display: "inline-block",
              width: "18px",
              height: "1px",
              background: "rgba(212,175,55,0.4)",
            }}
          />
        </div>
      )}
    </div>
  );
}

function ArticlesPage({
  articlesIndex,
  side,
  num,
}: { articlesIndex: number; side: "left" | "right"; num?: number }) {
  const pg = ARTICLES_PAGES[articlesIndex];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#FDFCF8",
        backgroundImage:
          "linear-gradient(transparent calc(100% - 1px), rgba(100,120,200,0.18) calc(100% - 1px))",
        backgroundSize: "100% 5%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          ...(side === "left" ? { left: "38px" } : { right: "38px" }),
          top: 0,
          bottom: 0,
          width: "1px",
          backgroundColor: "rgba(200,80,80,0.14)",
          zIndex: 1,
        }}
      />
      {/* Gold header */}
      <div
        style={{
          width: "100%",
          height: "5%",
          background: "rgba(212,175,55,0.22)",
          borderBottom: "1px solid rgba(212,175,55,0.35)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          paddingRight: "10px",
          zIndex: 2,
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: "7px",
            color: NAVY_MID,
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            letterSpacing: "0.1em",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {pg.heading} | {pg.subheading}
        </span>
      </div>
      {/* Lines */}
      <div
        style={{
          flex: 1,
          padding: "2px 10px 26px 44px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 2,
          position: "relative",
        }}
      >
        {pg.lines.map((line, i) => {
          const isHindi = /[\u0900-\u097F]/.test(line);
          const isSeparator = line.startsWith("─");
          const isNumbered = /^\d+\./.test(line);
          const isIndented = line.startsWith("   ");
          const isNote =
            line.startsWith("NOTE") ||
            line.startsWith("WHEN") ||
            line.startsWith("QUICK") ||
            line.startsWith("Practice");
          const isHeading = isNumbered;
          return (
            <div
              key={`art-${articlesIndex}-${line.slice(0, 8)}-${i}`}
              style={{ flex: 1, display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  fontSize: isSeparator
                    ? "6px"
                    : isHeading
                      ? "7.5px"
                      : isNote
                        ? "7px"
                        : isIndented
                          ? "6.8px"
                          : "7px",
                  color: isSeparator
                    ? "rgba(212,175,55,0.5)"
                    : isHeading
                      ? NAVY_DEEP
                      : isNote
                        ? "#8B0000"
                        : isHindi
                          ? "#4a3000"
                          : NAVY_MID,
                  fontFamily: isHindi
                    ? '"Noto Sans Devanagari", sans-serif'
                    : '"Playfair Display", Georgia, serif',
                  fontWeight: isHeading || isNote ? 700 : 400,
                  lineHeight: 1,
                  letterSpacing: isHeading ? "0.04em" : "0.01em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {line}
              </span>
            </div>
          );
        })}
      </div>
      {/* Page number */}
      {num !== undefined && (
        <div
          style={{
            position: "absolute",
            bottom: "6px",
            ...(side === "left" ? { left: "10px" } : { right: "10px" }),
            fontSize: "7px",
            color: "rgba(212,175,55,0.7)",
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 600,
            zIndex: 3,
          }}
        >
          — {num} —
        </div>
      )}
    </div>
  );
}

function ImperativePage({
  imperativeIndex,
  side,
  num,
}: { imperativeIndex: number; side: "left" | "right"; num?: number }) {
  const pg = IMPERATIVE_PAGES[imperativeIndex];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#FDFCF8",
        backgroundImage:
          "linear-gradient(transparent calc(100% - 1px), rgba(100,120,200,0.18) calc(100% - 1px))",
        backgroundSize: "100% 5%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          ...(side === "left" ? { left: "38px" } : { right: "38px" }),
          top: 0,
          bottom: 0,
          width: "1px",
          backgroundColor: "rgba(200,80,80,0.14)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          width: "100%",
          height: "5%",
          background: "rgba(212,175,55,0.22)",
          borderBottom: "1px solid rgba(212,175,55,0.35)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          paddingRight: "10px",
          zIndex: 2,
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: "7px",
            color: NAVY_MID,
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            letterSpacing: "0.1em",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {pg.heading} | {pg.subheading}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          padding: "2px 10px 26px 44px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 2,
          position: "relative",
        }}
      >
        {pg.lines.map((line, i) => {
          const isHindi = /[\u0900-\u097F]/.test(line);
          const isSep = line.startsWith("─");
          const isHead =
            line.startsWith("TYPE") ||
            line.startsWith("WHAT") ||
            line.startsWith("FORMULA") ||
            line.startsWith("NEGATIVE") ||
            line.startsWith("QUICK") ||
            line.startsWith("KEY RULE");
          const isNote =
            line.startsWith("NOTE") ||
            line.startsWith("TIP") ||
            line.startsWith("Practice");
          const isIndent = line.startsWith("   ");
          return (
            <div
              key={`imp-${imperativeIndex}-${line.slice(0, 8)}-${i}`}
              style={{ flex: 1, display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  fontSize: isSep
                    ? "6px"
                    : isHead
                      ? "7.5px"
                      : isNote
                        ? "7px"
                        : isIndent
                          ? "6.8px"
                          : "7px",
                  color: isSep
                    ? "rgba(212,175,55,0.5)"
                    : isHead
                      ? NAVY_DEEP
                      : isNote
                        ? "#8B0000"
                        : isHindi
                          ? "#4a3000"
                          : NAVY_MID,
                  fontFamily: isHindi
                    ? '"Noto Sans Devanagari", sans-serif'
                    : '"Playfair Display", Georgia, serif',
                  fontWeight: isHead || isNote ? 700 : 400,
                  lineHeight: 1,
                  letterSpacing: isHead ? "0.04em" : "0.01em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {line}
              </span>
            </div>
          );
        })}
      </div>
      {num !== undefined && (
        <div
          style={{
            position: "absolute",
            bottom: "6px",
            ...(side === "left"
              ? { left: "50%", transform: "translateX(-50%)" }
              : { right: "50%", transform: "translateX(50%)" }),
            fontSize: "7px",
            color: "rgba(212,175,55,0.7)",
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 600,
            zIndex: 3,
          }}
        >
          — {num} —
        </div>
      )}
    </div>
  );
}

function HomophonesPage({
  homophonesIndex,
  side,
  num,
}: { homophonesIndex: number; side: "left" | "right"; num?: number }) {
  const pg = HOMOPHONES_PAGES[homophonesIndex];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#FDFCF8",
        backgroundImage:
          "linear-gradient(transparent calc(100% - 1px), rgba(100,120,200,0.18) calc(100% - 1px))",
        backgroundSize: "100% 5%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          ...(side === "left" ? { left: "38px" } : { right: "38px" }),
          top: 0,
          bottom: 0,
          width: "1px",
          backgroundColor: "rgba(200,80,80,0.14)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          width: "100%",
          height: "5%",
          background: "rgba(212,175,55,0.22)",
          borderBottom: "1px solid rgba(212,175,55,0.35)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          paddingRight: "10px",
          zIndex: 2,
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: "7px",
            color: NAVY_MID,
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            letterSpacing: "0.1em",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {pg.heading} | {pg.subheading}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          padding: "2px 10px 26px 44px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 2,
          position: "relative",
        }}
      >
        {pg.lines.map((line, i) => {
          const isHindi = /[\u0900-\u097F]/.test(line);
          const isSep = line.startsWith("─");
          const isNum = /^\d+\./.test(line);
          const isHead =
            isNum || line.startsWith("QUICK") || line.startsWith("NOTE");
          const isNote = line.startsWith("NOTE") || line.startsWith("TIP");
          const isIndent = line.startsWith("   ");
          return (
            <div
              key={`hom-${homophonesIndex}-${line.slice(0, 8)}-${i}`}
              style={{ flex: 1, display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  fontSize: isSep
                    ? "6px"
                    : isHead
                      ? "7.5px"
                      : isNote
                        ? "7px"
                        : isIndent
                          ? "6.8px"
                          : "7px",
                  color: isSep
                    ? "rgba(212,175,55,0.5)"
                    : isHead && !isNote
                      ? NAVY_DEEP
                      : isNote
                        ? "#8B0000"
                        : isHindi
                          ? "#4a3000"
                          : NAVY_MID,
                  fontFamily: isHindi
                    ? '"Noto Sans Devanagari", sans-serif'
                    : '"Playfair Display", Georgia, serif',
                  fontWeight: isHead || isNote ? 700 : 400,
                  lineHeight: 1,
                  letterSpacing: isHead ? "0.04em" : "0.01em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {line}
              </span>
            </div>
          );
        })}
      </div>
      {num !== undefined && (
        <div
          style={{
            position: "absolute",
            bottom: "6px",
            ...(side === "left"
              ? { left: "50%", transform: "translateX(-50%)" }
              : { right: "50%", transform: "translateX(50%)" }),
            fontSize: "7px",
            color: "rgba(212,175,55,0.7)",
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 600,
            zIndex: 3,
          }}
        >
          — {num} —
        </div>
      )}
    </div>
  );
}

function PhonicsPage({
  phonicsIndex,
  side,
  num,
}: { phonicsIndex: number; side: "left" | "right"; num?: number }) {
  const pg = PHONICS_PAGES[phonicsIndex];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#FDFCF8",
        backgroundImage:
          "linear-gradient(transparent calc(100% - 1px), rgba(100,120,200,0.18) calc(100% - 1px))",
        backgroundSize: "100% 5%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          ...(side === "left" ? { left: "38px" } : { right: "38px" }),
          top: 0,
          bottom: 0,
          width: "1px",
          backgroundColor: "rgba(200,80,80,0.14)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          width: "100%",
          height: "5%",
          background: "rgba(212,175,55,0.22)",
          borderBottom: "1px solid rgba(212,175,55,0.35)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          paddingRight: "10px",
          zIndex: 2,
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: "7px",
            color: NAVY_MID,
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            letterSpacing: "0.1em",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {pg.heading} | {pg.subheading}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          padding: "2px 10px 26px 44px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 2,
          position: "relative",
        }}
      >
        {pg.lines.map((line, i) => {
          const isHindi = /[\u0900-\u097F]/.test(line);
          const isSep = line.startsWith("─");
          const isHead =
            line.startsWith("WHAT") ||
            line.startsWith("VOWELS") ||
            line.startsWith("CONSONANTS") ||
            line.startsWith("MORE") ||
            line.startsWith("BLENDS") ||
            line.startsWith("DIGRAPHS") ||
            line.startsWith("SILENT") ||
            line.startsWith("QUICK");
          const isNote =
            line.startsWith("NOTE") ||
            line.startsWith("TIP") ||
            line.startsWith("Practice");
          const isIndent = line.startsWith("   ");
          return (
            <div
              key={`ph-${phonicsIndex}-${line.slice(0, 8)}-${i}`}
              style={{ flex: 1, display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  fontSize: isSep
                    ? "6px"
                    : isHead
                      ? "7.5px"
                      : isNote
                        ? "7px"
                        : isIndent
                          ? "6.8px"
                          : "7px",
                  color: isSep
                    ? "rgba(212,175,55,0.5)"
                    : isHead
                      ? NAVY_DEEP
                      : isNote
                        ? "#8B0000"
                        : isHindi
                          ? "#4a3000"
                          : NAVY_MID,
                  fontFamily: isHindi
                    ? '"Noto Sans Devanagari", sans-serif'
                    : '"Playfair Display", Georgia, serif',
                  fontWeight: isHead || isNote ? 700 : 400,
                  lineHeight: 1,
                  letterSpacing: isHead ? "0.04em" : "0.01em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {line}
              </span>
            </div>
          );
        })}
      </div>
      {num !== undefined && (
        <div
          style={{
            position: "absolute",
            bottom: "6px",
            ...(side === "left"
              ? { left: "50%", transform: "translateX(-50%)" }
              : { right: "50%", transform: "translateX(50%)" }),
            fontSize: "7px",
            color: "rgba(212,175,55,0.7)",
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 600,
            zIndex: 3,
          }}
        >
          — {num} —
        </div>
      )}
    </div>
  );
}

function BlankPage({ num, side }: { num?: number; side: "left" | "right" }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#FAF9F6",
        backgroundImage:
          "linear-gradient(transparent calc(100% - 1px), rgba(110,110,170,0.18) calc(100% - 1px))",
        backgroundSize: "100% 5%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          ...(side === "left" ? { left: "38px" } : { right: "38px" }),
          top: 0,
          bottom: 0,
          width: "1px",
          backgroundColor: "rgba(200,80,80,0.12)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "5%",
          background: GOLD_FAINT,
          borderBottom: "1px solid rgba(212,175,55,0.2)",
          zIndex: 1,
        }}
      />
      {num !== undefined && (
        <div
          style={{
            position: "absolute",
            bottom: "9px",
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            zIndex: 2,
            userSelect: "none",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "18px",
              height: "1px",
              background: "rgba(212,175,55,0.35)",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "rgba(10,31,61,0.45)",
              fontFamily: '"Playfair Display", Georgia, serif',
              letterSpacing: "0.12em",
            }}
          >
            {num}
          </span>
          <span
            style={{
              display: "inline-block",
              width: "18px",
              height: "1px",
              background: "rgba(212,175,55,0.35)",
            }}
          />
        </div>
      )}
    </div>
  );
}

function PageContent({
  page,
  side,
  title,
}: { page: PageInfo | null; side: "left" | "right"; title: string }) {
  if (!page) return <InnerCover />;
  switch (page.type) {
    case "cover":
      return <CoverPage title={title} />;
    case "back-cover":
      return <BackCoverPage />;
    case "inner":
      return <InnerCover />;
    case "phrase":
      return (
        <PhrasePage
          phraseIndex={page.phraseIndex ?? 0}
          side={page.side ?? side}
          num={page.num}
        />
      );
    case "modal":
      return (
        <ModalPage
          modalIndex={page.modalIndex ?? 0}
          side={page.side ?? side}
          num={page.num}
        />
      );
    case "primary-aux":
      return <PrimaryAuxPage side={page.side ?? side} num={page.num} />;
    case "articles":
      return (
        <ArticlesPage
          articlesIndex={page.articlesIndex ?? 0}
          side={page.side ?? side}
          num={page.num}
        />
      );
    case "imperative":
      return (
        <ImperativePage
          imperativeIndex={page.imperativeIndex ?? 0}
          side={page.side ?? side}
          num={page.num}
        />
      );
    case "homophones":
      return (
        <HomophonesPage
          homophonesIndex={page.homophonesIndex ?? 0}
          side={page.side ?? side}
          num={page.num}
        />
      );
    case "phonics":
      return (
        <PhonicsPage
          phonicsIndex={page.phonicsIndex ?? 0}
          side={page.side ?? side}
          num={page.num}
        />
      );
    case "blank":
      return <BlankPage num={page.num} side={page.side ?? side} />;
    default:
      return <InnerCover />;
  }
}

function BookReader() {
  const [spread, setSpread] = useState(0);
  const [anim, setAnim] = useState<{
    active: boolean;
    from: number;
    to: number;
    dir: "next" | "prev";
  }>({ active: false, from: 0, to: 0, dir: "next" });

  const { data: book } = useGetBook();
  const bookTitle =
    book?.title ?? "Thirty Days Complete English Learning Course";

  const triggerFlip = useCallback(
    (dir: "next" | "prev") => {
      if (anim.active) return;
      const to = dir === "next" ? spread + 1 : spread - 1;
      if (to < 0 || to > MAX_SPREAD) return;
      setAnim({ active: true, from: spread, to, dir });
    },
    [spread, anim.active],
  );

  const handleAnimComplete = useCallback(() => {
    setSpread(anim.to);
    setAnim((prev) => ({ ...prev, active: false }));
  }, [anim.to]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") triggerFlip("next");
      if (e.key === "ArrowLeft") triggerFlip("prev");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [triggerFlip]);

  const { active, from, to, dir } = anim;
  const [srcLeft, srcRight] = getSpread(active ? from : spread);
  const [tgtLeft, tgtRight] = getSpread(active ? to : spread);

  const bgLeft =
    active && dir === "next"
      ? srcLeft
      : active && dir === "prev"
        ? tgtLeft
        : srcLeft;
  const bgRight =
    active && dir === "next"
      ? tgtRight
      : active && dir === "prev"
        ? srcRight
        : srcRight;
  const flipFront = active ? (dir === "next" ? srcRight : srcLeft) : null;
  const flipBack = active ? (dir === "next" ? tgtLeft : tgtRight) : null;

  const displaySpread = active ? to : spread;
  const progress = (displaySpread / MAX_SPREAD) * 100;
  const canPrev = !anim.active && spread > 0;
  const canNext = !anim.active && spread < MAX_SPREAD;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: `radial-gradient(ellipse at 50% 25%, ${NAVY_MID} 0%, ${NAVY_DEEP} 55%, #010810 100%)`,
        padding: "24px 16px",
      }}
    >
      <header className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <BookOpen size={18} style={{ color: GOLD_DIM }} />
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: GOLD,
              fontSize: "clamp(0.9rem, 2.5vw, 1.4rem)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textShadow: `0 0 20px ${GOLD_FAINT}`,
            }}
          >
            {bookTitle}
          </h1>
          <BookOpen
            size={18}
            style={{ color: GOLD_DIM, transform: "scaleX(-1)" }}
          />
        </div>
        <p
          style={{
            color: "rgba(212,175,55,0.45)",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {getLabel(displaySpread)}
        </p>
      </header>

      <main>
        <div style={{ perspective: "1800px", perspectiveOrigin: "50% 45%" }}>
          <div
            className="relative"
            style={{
              width: "min(680px, calc(100vw - 32px))",
              height: "min(480px, calc((100vw - 32px) * 0.706))",
              display: "flex",
              boxShadow: `0 40px 100px rgba(0,0,0,0.95), 0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px ${GOLD_FAINT}, 0 0 60px rgba(10,31,61,0.5)`,
              borderRadius: "2px 4px 4px 2px",
            }}
            data-ocid="book.panel"
          >
            <div
              style={{
                width: "50%",
                height: "100%",
                overflow: "hidden",
                borderRadius: "2px 0 0 2px",
                boxShadow: "inset -8px 0 24px rgba(0,0,0,0.35)",
                flexShrink: 0,
              }}
            >
              <PageContent page={bgLeft} side="left" title={bookTitle} />
            </div>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: "10px",
                transform: "translateX(-50%)",
                zIndex: 20,
                background: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, ${NAVY_DEEP} 30%, #0d2052 50%, ${NAVY_DEEP} 70%, rgba(0,0,0,0.7) 100%)`,
                boxShadow:
                  "0 0 20px rgba(0,0,0,0.9), 2px 0 8px rgba(0,0,0,0.5), -2px 0 8px rgba(0,0,0,0.5)",
              }}
            />
            <div
              style={{
                width: "50%",
                height: "100%",
                overflow: "hidden",
                borderRadius: "0 4px 4px 0",
                boxShadow: "inset 8px 0 24px rgba(0,0,0,0.2)",
                flexShrink: 0,
              }}
            >
              <PageContent page={bgRight} side="right" title={bookTitle} />
            </div>
            {active && flipFront && (
              <motion.div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  ...(dir === "next"
                    ? { right: 0, width: "50%" }
                    : { left: 0, width: "50%" }),
                  transformOrigin:
                    dir === "next" ? "left center" : "right center",
                  transformStyle: "preserve-3d" as const,
                  zIndex: 30,
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: dir === "next" ? -180 : 180 }}
                transition={{ duration: 0.65, ease: [0.42, 0, 0.28, 1.0] }}
                onAnimationComplete={handleAnimComplete}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    overflow: "hidden",
                    boxShadow:
                      dir === "next"
                        ? "inset 8px 0 24px rgba(0,0,0,0.2), -4px 0 20px rgba(0,0,0,0.5)"
                        : "inset -8px 0 24px rgba(0,0,0,0.35), 4px 0 20px rgba(0,0,0,0.5)",
                  }}
                >
                  <PageContent
                    page={flipFront}
                    side={dir === "next" ? "right" : "left"}
                    title={bookTitle}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      ...(dir === "next"
                        ? { left: 0, width: "24px" }
                        : { right: 0, width: "24px" }),
                      background:
                        dir === "next"
                          ? "linear-gradient(to right, rgba(0,0,0,0.25), transparent)"
                          : "linear-gradient(to left, rgba(0,0,0,0.25), transparent)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    transform:
                      dir === "next" ? "rotateY(180deg)" : "rotateY(-180deg)",
                    overflow: "hidden",
                    boxShadow:
                      dir === "next"
                        ? "inset -8px 0 24px rgba(0,0,0,0.3)"
                        : "inset 8px 0 24px rgba(0,0,0,0.2)",
                  }}
                >
                  <PageContent
                    page={flipBack}
                    side={dir === "next" ? "left" : "right"}
                    title={bookTitle}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <nav className="mt-8 flex items-center gap-6">
        <button
          onClick={() => triggerFlip("prev")}
          disabled={!canPrev}
          type="button"
          data-ocid="book.pagination_prev"
          aria-label="Previous page"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: `1px solid ${canPrev ? GOLD_DIM : "rgba(212,175,55,0.15)"}`,
            background: canPrev ? GOLD_FAINT : "rgba(212,175,55,0.04)",
            color: canPrev ? GOLD : "rgba(212,175,55,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: canPrev ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            flexShrink: 0,
            boxShadow: canPrev ? `0 0 12px ${GOLD_FAINT}` : "none",
          }}
        >
          <ChevronLeft size={22} />
        </button>
        <div style={{ textAlign: "center", minWidth: "200px" }}>
          <p
            style={{
              color: "rgba(212,175,55,0.6)",
              fontSize: "0.78rem",
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: "italic",
              letterSpacing: "0.05em",
              marginBottom: "8px",
            }}
          >
            {getLabel(displaySpread)}
          </p>
          <div
            style={{
              width: "100%",
              height: "3px",
              background: "rgba(212,175,55,0.1)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: `linear-gradient(to right, #a07830, ${GOLD}, ${GOLD_LIGHT})`,
                borderRadius: "2px",
                transition: "width 0.4s ease",
                boxShadow: `0 0 8px ${GOLD_DIM}`,
              }}
            />
          </div>
          <p
            style={{
              color: "rgba(212,175,55,0.3)",
              fontSize: "0.68rem",
              marginTop: "5px",
              letterSpacing: "0.08em",
            }}
          >
            {displaySpread} / {MAX_SPREAD}
          </p>
        </div>
        <button
          onClick={() => triggerFlip("next")}
          disabled={!canNext}
          type="button"
          data-ocid="book.pagination_next"
          aria-label="Next page"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: `1px solid ${canNext ? GOLD_DIM : "rgba(212,175,55,0.15)"}`,
            background: canNext ? GOLD_FAINT : "rgba(212,175,55,0.04)",
            color: canNext ? GOLD : "rgba(212,175,55,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: canNext ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            flexShrink: 0,
            boxShadow: canNext ? `0 0 12px ${GOLD_FAINT}` : "none",
          }}
        >
          <ChevronRight size={22} />
        </button>
      </nav>

      <p
        style={{
          marginTop: "12px",
          fontSize: "0.72rem",
          color: "rgba(212,175,55,0.3)",
          letterSpacing: "0.08em",
        }}
      >
        ← → arrow keys to turn pages
      </p>

      <footer
        style={{
          marginTop: "20px",
          fontSize: "0.72rem",
          color: "rgba(212,175,55,0.25)",
        }}
      >
        &copy; {new Date().getFullYear()}. Built with{" "}
        <span style={{ color: GOLD_DIM }}>♥</span> using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "rgba(212,175,55,0.4)", textDecoration: "none" }}
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BookReader />
    </QueryClientProvider>
  );
}
