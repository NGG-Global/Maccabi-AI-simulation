export type RoleType = "manager" | "participant" | "ai-agent" | "observer";

export type Role = {
  id: string;
  title: string;
  type: RoleType;
  focus: string;
  fullText: string;
  agentUrl?: string;
};

export const roles: Role[] = [
  {
    id: "meeting-manager",
    title: "מנהל/ת הישיבה",
    type: "manager",
    focus: "הובלת הדיון וקבלת החלטות",
    fullText: `התפקיד שלך
את/ה מוביל/ה ישיבת הנהלה העוסקת בזמינות תורים, עומסים, חוויית מטופל ותפקוד צוותים. לרשותך מגוון דוחות ונתונים- ועליך להוביל את הישיבה לקבלת החלטות מבוססות נתונים בזמן מוגבל.
המטרה: גיבוש 2–3 כיווני פעולה ישימים לשיפור השירות, זמינות התורים וחיזוק החוסן.
מקורות מידע לרשותך:
סקר חוסן ארגוני | דוח שביעות רצון מטופלים | דוח זמינות תורים | דוחות עומסים ותפעול
שאלות לדוגמה ל-Copilot:
פתח את דוח זמינות התורים וזקק לי את שלושת מוקדי העומס המרכזיים.
נתח את כלל הדוחות והצג לי אילו בעיות חוזרות בכמה מקומות במקביל.
על בסיס הנתונים, תעדף עבורי שלוש פעולות שיכולות לייצר שיפור בטווח של חודש.`,
  },
  {
    id: "participant-1",
    title: "משתתף/ת 1 — חוויית מטופל",
    type: "participant",
    focus: "חוויית מטופל",
    fullText: `התפקיד שלך
את/ה מביא/ה לישיבה את ההשפעה על חוויית השירות, זמני ההמתנה, תחושת הביטחון ורציפות הטיפול. המיקוד שלך: היכן עומסים ותהליכים פוגעים באמון ובאיכות השירות.
שאלות לדוגמה ל-Copilot:
פתח את דוח שביעות רצון המטופלים וזקק את מוקדי התסכול המרכזיים.
נתח האם קיימת קורלציה בין זמני המתנה לירידה בשביעות רצון.
אילו שלבים בתהליך השירות מייצרים הכי הרבה תלונות?
הצע שלוש פעולות שיכולות לשפר חוויית מטופל ללא תוספת כוח אדם.`,
  },
  {
    id: "participant-2",
    title: "משתתף/ת 2 — חוסן ועומסים",
    type: "participant",
    focus: "חוסן ועומסים",
    fullText: `התפקיד שלך
את/ה מביא/ה את הצד של העובדים: עומסים, שחיקה, מסוגלות ויכולת התמדה לאורך זמן. חשוב לך לזהות מתי שיפור בביצועים מגיע על חשבון חוסן ויציבות צוותית.
שאלות לדוגמה ל-Copilot:
פתח את דוח החוסן וזקק לי את סימני השחיקה המרכזיים.
אילו צוותים נמצאים בסיכון הגבוה ביותר לעומס מתמשך?
נתח האם קיימת עלייה בעומסים במקביל לירידה בשביעות רצון עובדים.
בנה תוכנית פעולה קצרה להפחתת עומסים בטווח המיידי.`,
  },
  {
    id: "participant-3",
    title: "משתתף/ת 3 — ביצועים ותפעול",
    type: "participant",
    focus: "ביצועים ותפעול",
    fullText: `התפקיד שלך
את/ה ממוקד/ת בזמינות השירות, תפקוד המערכת וניצול נכון של המשאבים. ברצונך לקדם פתרונות ישימים שישפרו זרימה תפעולית ויעילות עבודה.
שאלות לדוגמה ל-Copilot:
פתח את דוח זמינות התורים והצג היכן נמצאים צווארי הבקבוק המרכזיים.
אילו תהליכים מייצרים את העומס התפעולי הגבוה ביותר?
נתח אילו פעולות יכולות לשפר זמינות בטווח של 30 יום.
אילו משאבים מנוצלים בצורה לא מיטבית לפי הנתונים?`,
  },
  {
    id: "ai-wellbeing",
    title: "סוכן חוסן ורווחת עובדים — Well-being",
    type: "ai-agent",
    focus: "חוסן ורווחת עובדים",
    agentUrl: "https://chatgpt.com/g/g-6a2e4579cf5081919a5fe80aa6fd11d3-well-being-ai-yv-ts-khvsn-rgvny-lmkby",
    fullText: `התפקיד שלך
את/ה מייצג/ת סוכן AI המתמחה בעומסי עבודה, יכולת צוותית וביצועים בני-קיימא. תפקידך לסייע לצוות לשפר ביצועים תוך שמירה על חוסן אנושי לאורך זמן.
אופן הפעולה:
תוכל לבקש מה-AI תובנות, ניתוחים או המלצות.
הצף באופן יזום סיכונים של עומס ושחיקה כשהם עולים בדיון.
אינך מביע/ה דעה אישית — שתף/י רק את מה שה-AI מציע מזווית חוסן.
שאלות לדוגמה:
פתח את דוח החוסן וזקק אילו צוותים בסיכון הגבוה ביותר לשחיקה.
הצע 2–3 פעולות קצרות טווח לשיפור חוסן צוותי וקיימות עבודה.`,
  },
  {
    id: "ai-performance",
    title: "סוכן תפעול ודאטה — Performance",
    type: "ai-agent",
    focus: "תפעול ודאטה",
    agentUrl: "https://chatgpt.com/g/g-6a2e464dbf188191ab6f15a59f6057c3-performance-ai",
    fullText: `התפקיד שלך
את/ה מייצג/ת סוכן AI המתמקד בביצועים, תהליכי עבודה, תעדוף ויעילות תפעולית. תפקידך לסייע לצוות לזהות דרכים פרקטיות לשיפור ביצועים וזמינות.
אופן הפעולה:
הגב כשמשתתפים מפעילים את ה-AI ושואלים שאלות.
הצף תובנות והזדמנויות לשיפור כשעולים פערים בתהליכים ובתעדוף.
אינך מביע/ה דעה אישית — שתף/י רק מה שה-AI מציע מזווית ביצועים.
שאלות לדוגמה:
אילו שינויים בתהליכי העבודה יכולים לשפר זמינות תורים בטווח הקצר?
אילו פעולות יכולות לשפר ביצועים — מבלי להגדיל כוח אדם?`,
  },
  {
    id: "observer",
    title: "תצפיתן/ית",
    type: "observer",
    focus: "תצפית על ממשק אדם-AI",
    fullText: `התפקיד שלך
תפקידך לצפות בדיון מהצד ולהתמקד בממשק ובאינטגרציה שבין המנהלים האנושיים לבין סוכני ה-AI.
דגש קריטי:
הפוקוס שלך הוא: איך השולחן משתמש בסוכני ה-AI, כיצד מגיבים להמלצות שלהם, ואיך המידע הדיגיטלי משפיע על השיח הניהולי.
בסיום הסימולציה:
הובל/י את הדיון השולחני ושתף/י בתובנות שרשמת על השילוב בין האדם למכונה.`,
  },
];

export const reflectionQuestions: string[] = [
  "באיזו מידה ה-AI תמך בקבלת החלטות איכותית?",
  "אילו תובנות עלו מהנתונים שלא הייתם מזהים ללא שימוש ב-AI?",
  "מתי הרגשתם שה-AI תרם לדיון, ומתי יצר מורכבות או עומס?",
  "אילו חששות והזדמנויות עלו לכם סביב שילוב AI בניהול צוותים ותהליכים?",
  "מה נדרש ממנהל כדי להוביל בצורה אפקטיבית בסביבה מבוססת דאטה ו-AI?",
];

export type InsightCard = {
  category: "ai" | "human" | "combined";
  title: string;
  description: string;
};

export const insightCards: InsightCard[] = [
  {
    category: "ai",
    title: "ניתוח וזיהוי דפוסים",
    description: "AI מספק ניתוח נתונים, זיהוי דפוסים ועיבוד מהיר",
  },
  {
    category: "ai",
    title: "מידע ותשובות מבוססות נתונים",
    description: "AI מספק תשובות מבוססות נתונים והוכחות",
  },
  {
    category: "ai",
    title: "המלצות ותמיכה בהחלטות",
    description: "AI מספק תובנות והמלצות לתמיכה בהחלטות אנושיות",
  },
  {
    category: "human",
    title: "מודעות והבנה",
    description: "המנהל מספק הבנה הקשרית ומפרש את המשמעות",
  },
  {
    category: "human",
    title: "שאלות משמעותיות",
    description: "המנהל שואל שאלות ומערער על הנחות יסוד",
  },
  {
    category: "human",
    title: "אמפתיה וערכים",
    description: "מנהלים מובילים באמפתיה וערכים",
  },
  {
    category: "combined",
    title: "תובנה עמוקה יותר",
    description: "שילוב של הקשר אנושי וידע מבוסס נתונים",
  },
  {
    category: "combined",
    title: "החלטות טובות יותר",
    description: "שילוב בין שיקול דעת אנושי לבינה חכמה ומהירה",
  },
  {
    category: "combined",
    title: "ניהול מיטבי",
    description: "מנהיגת שמבוססת על חכמה מודעות ואמפתיה בעידן הAI",
  },
];

// ─── Observation Form ────────────────────────────────────────────────────────

export type ObservationFocusRow = {
  observed: string;
  guidingQuestion: string;
};

export type ObservationRating = {
  label: string;
};

export type ObservationMoment = {
  behavior: string;
  meaning: string;
};

export type ObservationFormContent = {
  title: string;
  purpose: string;
  focusSectionTitle: string;
  focusTableHeaders: [string, string, string];
  focusRows: ObservationFocusRow[];
  ratingSectionTitle: string;
  ratingScale: string[];
  ratingTableHeaders: [string, string, string, string, string, string];
  ratingRows: ObservationRating[];
  momentsSectionTitle: string;
  momentHeaders: [string, string];
  summarySectionTitle: string;
  summaryFields: string[];
  overallEvaluationQuestion: string;
  overallEvaluationOptions: string[];
  observerInstruction: string;
};

export const observationFormContent: ObservationFormContent = {
  title: "דף תצפית – התנסות ניהולית עתיד קרוב",
  purpose:
    "מטרת התצפית: לבחון כיצד השולחן משתמש בסוכני AI\nכיצד מגיבים להמלצות שלהם, וכיצד מידע דיגיטלי משפיע על השיח הניהולי וקבלת ההחלטות",
  focusSectionTitle: "1. מיקוד התצפית",
  focusTableHeaders: ["מה נצפה?", "שאלות מכוונות לצופה", "תיעוד קצר / ציטוטים"],
  focusRows: [
    {
      observed: "שימוש בסוכני AI",
      guidingQuestion:
        "מתי פונים לסוכן? מי יוזם? האם\nהשימוש ממוקד או כללי?",
    },
    {
      observed: "השפעת המידע הדיגיטלי",
      guidingQuestion:
        "האם הנתונים משנים סדרי\nעדיפויות, עמדות או החלטות?",
    },
    {
      observed: "שיח ניהולי",
      guidingQuestion:
        "האם השיחה הופכת מבוססת\nנתונים? האם יש מתחים בין ניסיון\nאנושי להמלצת AI?",
    },
  ],
  ratingSectionTitle: "2. מדדי הערכה במהלך הסימולציה",
  ratingScale: ["1 נמוך", "2", "3", "4", "5 גבוה"],
  ratingTableHeaders: ["מדד", "1 נמוך", "2", "3", "4", "5 גבוה"],
  ratingRows: [
    { label: "שילוב AI בדיון" },
    { label: "חשיבה\nביקורתית כלפי\nהמלצות AI" },
    { label: "שיתוף פעולה בין\nמשתתפים" },
    { label: "קבלת החלטות\nמבוססת מידע" },
    { label: "איזון בין אדם\nלמכונה" },
  ],
  momentsSectionTitle: "3. רגעים משמעותיים לזיהוי",
  momentHeaders: [
    "רגע / התנהגות שנצפתה",
    "מה זה מלמד על השילוב בין האדם למכונה?",
  ],
  summarySectionTitle: "4. סיכום התצפית והערכת השילוב בין אדם למכונה",
  summaryFields: [
    "נקודת חוזק מרכזית בשימוש ב-AI",
    "אתגר / סיכון שעלה בשילוב AI",
  ],
  overallEvaluationQuestion: "הערכה כוללת: עד כמה השילוב היה אפקטיבי?",
  overallEvaluationOptions: ["נמוך", "בינוני", "גבוה"],
  observerInstruction:
    "הנחיה לצופה: התמקד/י בהתנהגויות נצפות ובציטוטים קצרים, ולא בפרשנות כללית בלבד.",
};

// ─── Simulation Phases ────────────────────────────────────────────────────────

export type Phase = {
  id: string;
  title: string;
  duration: number;
  description: string;
};

export const simulationPhases: Phase[] = [
  {
    id: "opening",
    title: "פתיחה והסבר המשימה",
    duration: 10,
    description: "הצגת הסימולציה, מטרות המפגש וחלוקת תפקידים",
  },
  {
    id: "roles",
    title: "חלוקה לתפקידים",
    duration: 5,
    description: "קריאת כרטיסיות התפקיד והכנה לסימולציה",
  },
  {
    id: "simulation",
    title: "סימולציה בשולחנות",
    duration: 40,
    description: "ניהול ישיבת הצוות הדמויה בשולחנות הקטנים",
  },
  {
    id: "reflection",
    title: "עיבוד ורפלקציה בשולחנות הקטנים",
    duration: 15,
    description: "דיון מונחה בקבוצות קטנות סביב חוויית העבודה לצד AI",
  },
  {
    id: "closing",
    title: "אינטגרציה קצרה וסגירה",
    duration: 10,
    description: "שיתוף תובנות במליאה וסיכום המפגש",
  },
];
