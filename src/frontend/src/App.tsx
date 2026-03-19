import { useGetBook } from "@/hooks/useQueries";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const queryClient = new QueryClient();

const TOTAL_PAGES = 60;
const MAX_SPREAD = 31;

// ─── Premium colour tokens ───
const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F0D060";
const GOLD_DIM = "rgba(212,175,55,0.55)";
const GOLD_FAINT = "rgba(212,175,55,0.18)";
const NAVY_DEEP = "#020C1B";
const NAVY_MID = "#0A1F3D";
const NAVY_LIGHT = "#0D2752";
const NAVY_COVER = "#071530";

// ─── 60 Daily Phrases – Hindi & English ───
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

// Spread 0        → Cover
// Spread 1        → Pages 1-2  (Phrases page 1 & 2)
// Spread 2        → Pages 3-4  (Phrases page 3 & 4)
// Spreads 3-30    → Blank pages
// Spread 31       → Back cover

type PageType = "cover" | "back-cover" | "inner" | "phrase" | "blank";

interface PageInfo {
  type: PageType;
  phraseIndex?: number; // 0-3
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
  return [
    { type: "blank", num: n, side: "left" },
    { type: "blank", num: n + 1, side: "right" },
  ];
}

function getLabel(s: number): string {
  if (s === 0) return "Cover";
  if (s === MAX_SPREAD) return "Back Cover";
  const n = (s - 1) * 2 + 1;
  if (s <= 2) return `Phrases — Pages ${n}\u2013${n + 1}`;
  return `Pages ${n}\u2013${n + 1} of ${TOTAL_PAGES}`;
}

// ─── Page Components ───

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
}: {
  phraseIndex: number;
  side: "left" | "right";
  num?: number;
}) {
  const pg = PHRASE_PAGES[phraseIndex];
  const lines = pg.lines;

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
      {/* Red margin line */}
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
      {/* Gold header band */}
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
        {lines.slice(0, 19).map((line) => {
          const isHeading =
            line === line.toUpperCase() &&
            line.trim().length > 3 &&
            !line.startsWith("0") &&
            !line.match(/^\d/);
          const isPhrase = line.match(/^\d/);
          return (
            <div
              key={String(phraseIndex) + line.slice(0, 15)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
              }}
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
                  textDecoration: isHeading ? "none" : "none",
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

      {/* Page number */}
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

function BlankPage({
  num,
  side,
}: {
  num?: number;
  side: "left" | "right";
}) {
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
}: {
  page: PageInfo | null;
  side: "left" | "right";
  title: string;
}) {
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
  }>({
    active: false,
    from: 0,
    to: 0,
    dir: "next",
  });

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
      {/* Header */}
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

      {/* Book */}
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
            {/* Left page */}
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

            {/* Spine */}
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

            {/* Right page */}
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

            {/* Flip animation */}
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

      {/* Navigation */}
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
