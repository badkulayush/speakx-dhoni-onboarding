"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Bell, CalendarCheck, Check, ChevronLeft, ChevronRight, CircleCheck, CircleHelp, Info, Mail, Mic, MoreVertical, ShieldCheck, SlidersHorizontal, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogClose, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog as DialogPrimitive, DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { BundledPortrait, SceneImage } from "./scene-image";
import { ContextBackdrop } from "./context-backdrop";
import { SupportContent, type SupportPanel } from "./support-content";

const scenes = [
  { image: "01_01_ptm.png", accent: "with confidence.", label: "Everyday conversations", alt: "MS Dhoni talking with parents in a classroom" },
  { image: "friends-family.png", accent: "with friends & family.", label: "Friends and family", alt: "MS Dhoni enjoying a conversation with friends and family over tea" },
  { image: "03_04_handshake.png", accent: "in interviews.", label: "Job interviews", alt: "MS Dhoni reaching out for a handshake" },
  { image: "04_05_whiteboard.png", accent: "at work.", label: "Office meetings", alt: "MS Dhoni presenting at an office whiteboard" },
  { image: "05_03_library.png", accent: "at college.", label: "College life", alt: "MS Dhoni holding books in a library" },
  { image: "06_06_airport.png", accent: "anywhere.", label: "Travel conversations", alt: "MS Dhoni with a passport at an airport" },
];

const concepts = [
  { value: "spotlight", label: "Spotlight" },
  { value: "framed", label: "Framed" },
  { value: "split", label: "Split" },
  { value: "sheet", label: "Action sheet" },
  { value: "login", label: "Login prompt" },
] as const;

const onboardingSteps = ["language", "sia", "level", "profile", "profession", "reason", "improve", "time", "coach", "ready"] as const;
type Concept = (typeof concepts)[number]["value"];
type FlowStep = "login" | "otp" | "notifications" | "language-more" | (typeof onboardingSteps)[number];
type Answers = Record<string, string | string[]>;

export default function Home() {
  const [concept, setConcept] = useState<Concept>(() => {
    if (typeof window !== "undefined") {
      const requested = new URLSearchParams(window.location.search).get("variant");
      if (concepts.some(item => item.value === requested)) return requested as Concept;
    }
    return "spotlight";
  });
  const [active, setActive] = useState(0);
  const [flow, setFlow] = useState<FlowStep | null>(null);
  const [returning, setReturning] = useState(false);
  const [skipLogin, setSkipLogin] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [phonePortal, setPhonePortal] = useState<HTMLDivElement | null>(null);
  const [phoneScale, setPhoneScale] = useState(.8);
  const [dragging, setDragging] = useState(false);
  const [drag, setDrag] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialogState] = useState<SupportPanel>("about");
  const [dialogOpen, setDialogOpen] = useState(false);
  const startX = useRef(0);
  const usesCard = concept === "framed";
  const usesContext = concept === "sheet";
  const usesLoginPrompt = concept === "login" || concept === "sheet";
  const playing = !flow && !dragging && !menuOpen && !dialogOpen;

  const go = (index: number) => {
    setActive((index + scenes.length) % scenes.length);
  };
  const beginFlow = (isReturning: boolean) => {
    setReturning(isReturning);
    setSkipLogin(!isReturning);
    setFlow(isReturning ? "login" : "language");
  };
  const setDialog = (value: SupportPanel | null) => {
    if (value) setDialogState(value);
    setDialogOpen(value !== null);
  };
  useEffect(() => {
    const resize = () => setPhoneScale(Math.min(1, (window.innerWidth - 32) / 414, Math.max(360, window.innerHeight - 268) / 868));
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setTheme(preference.matches ? "dark" : "light");
    updateTheme();
    preference.addEventListener("change", updateTheme);
    return () => preference.removeEventListener("change", updateTheme);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setActive(index => (index + 1) % scenes.length), 5000);
    return () => window.clearTimeout(timer);
  }, [active, playing]);

  return <Tabs value={concept} onValueChange={value => setConcept(value as Concept)} className="preview-studio concepts-studio">
    <div className="variation-picker concept-picker">
      <p>First screen concepts · two user paths</p>
      <TabsList aria-label="First screen concepts" className="variation-tabs concept-tabs">
        {concepts.map(item => <TabsTrigger key={item.value} value={item.value}>{item.label}</TabsTrigger>)}
      </TabsList>
    </div>
    <div className="phone-space" style={{ "--phone-scale": phoneScale } as CSSProperties}>
      <div className="phone-frame">
        <span className="hardware-button mute" aria-hidden="true" /><span className="hardware-button volume" aria-hidden="true" /><span className="hardware-button power" aria-hidden="true" />
        <div className="phone-screen" ref={setPhonePortal}>
          <div className="phone-status" aria-hidden="true"><span>9:41</span><div className="dynamic-island" /><div className="status-icons"><span>●●●</span></div></div>
          <TabsContent value={concept} className="phone-content">
            <main className={`onboarding variation-${usesCard ? "card" : "background"} concept-${concept}`}>
              {usesContext && <ContextBackdrop active={active} imageMode="normal" />}
              {!usesCard && !usesContext && <div className="full-background" aria-hidden="true"><BundledPortrait />
                {scenes.map((scene, index) => <div key={scene.image} className={`background-scene ${active === index ? "active" : ""}`}><SceneImage src={scene.image === "friends-family.png" ? "/images/context/friends-family.png" : `/images/${scene.image}`} alt="" mode="normal" kind={scene.image === "friends-family.png" ? "context" : "poster"} priority={index === 0} /></div>)}
                <div className="full-background-shade" />
              </div>}
              <header className="topbar"><img className="wordmark" src="/speakx.svg" alt="SpeakX" width="120" height="32" /><DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}><DropdownMenuTrigger asChild><Button variant="ghost" className="icon-button" aria-label="More options"><MoreVertical /></Button></DropdownMenuTrigger><DropdownMenuPortal container={phonePortal}><DropdownMenuPrimitive.Content align="end" className="options-menu"><DropdownMenuItem onSelect={() => setDialog("contact")}><Mail />Contact us</DropdownMenuItem><DropdownMenuItem onSelect={() => setDialog("faq")}><CircleHelp />FAQ</DropdownMenuItem><DropdownMenuItem onSelect={() => setDialog("privacy")}><ShieldCheck />Privacy Policy</DropdownMenuItem><DropdownMenuItem onSelect={() => setDialog("about")}><Info />About us</DropdownMenuItem></DropdownMenuPrimitive.Content></DropdownMenuPortal></DropdownMenu></header>
              <section className="carousel" aria-roledescription="carousel" aria-label="Find your confidence with SpeakX">
                <div className={`hero-card ${dragging ? "is-dragging" : ""}`} tabIndex={0} aria-label={`${scenes[active].label}. Slide ${active + 1} of ${scenes.length}. Use left and right arrows to browse.`}
                  onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); go(active + (event.key === "ArrowRight" ? 1 : -1)); } }}
                  onPointerDown={event => { startX.current = event.clientX; setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); }}
                  onPointerMove={event => { if (dragging) setDrag((event.clientX - startX.current) * .18); }}
                  onPointerUp={event => { const distance = event.clientX - startX.current; if (Math.abs(distance) > 40) go(active + (distance < 0 ? 1 : -1)); setDragging(false); setDrag(0); }}
                  onPointerCancel={() => { setDragging(false); setDrag(0); }}>
                  {usesCard && <div className="scenes" style={{ transform: `translateX(${drag}px)` }}><BundledPortrait card />{scenes.map((scene, index) => <div key={scene.image} className={`scene ${active === index ? "active" : ""}`}><div className="photo"><SceneImage src={`/images/card/${scene.image}`} alt={scene.alt} mode="normal" kind="card" priority={index === 0} /></div></div>)}<div className="photo-shade" /></div>}
                  <div className="hero-title"><p className="hero-kicker">{usesLoginPrompt ? "Trusted by 1 crore+ learners" : "Everyday English, made practical"}</p><h1>Speak English<span key={active}>{scenes[active].accent}</span></h1></div>
                  <button className="edge-arrow previous" aria-label="Previous slide" onClick={() => go(active - 1)}><ChevronLeft /></button><button className="edge-arrow next" aria-label="Next slide" onClick={() => go(active + 1)}><ChevronRight /></button>
                </div>
                <div className="carousel-controls"><div className="pagination" aria-label="Choose a slide">{scenes.map((scene, index) => <button key={scene.image} aria-label={`Show ${scene.label}`} aria-current={index === active ? "true" : undefined} className={`dot ${index === active ? "selected" : ""}`} onClick={() => go(index)}><span /></button>)}</div></div>
              </section>
              <footer className="entry-actions"><Button className="primary-cta" onClick={() => beginFlow(false)}>Get started <ArrowRight /></Button><Button variant="secondary" className="account-cta" onClick={() => beginFlow(true)}>{usesLoginPrompt ? <>Already a SpeakX user. <span className="account-login-link">Log in?</span></> : "I already have an account"}</Button>{!usesLoginPrompt && <p className="trust-note">Trusted by <strong>1 crore+ learners</strong></p>}</footer>
              {flow && <OnboardingFlow step={flow} returning={returning} skipLogin={skipLogin} theme={theme} onStep={setFlow} onClose={() => setFlow(null)} />}
              <Dialog open={dialogOpen} onOpenChange={open => { if (!open) setDialog(null); }}><DialogPortal container={phonePortal}><DialogOverlay className="phone-overlay" /><DialogPrimitive.Content className={`onboarding-dialog ${dialog === "privacy" ? "privacy-dialog" : ""}`} data-slot="dialog-content"><SupportContent key={dialog} panel={dialog} /><DialogClose asChild><button className="dialog-dismiss" aria-label="Close"><X /></button></DialogClose></DialogPrimitive.Content></DialogPortal></Dialog>
            </main>
          </TabsContent>
          <div className="home-indicator" aria-hidden="true" />
        </div>
      </div>
    </div>
  </Tabs>;
}

function OnboardingFlow({ step, returning, skipLogin, theme, onStep, onClose }: { step: FlowStep; returning: boolean; skipLogin: boolean; theme: "light" | "dark"; onStep: (step: FlowStep | null) => void; onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [answers, setAnswers] = useState<Answers>({ time: "📱|15-30 minutes" });
  const [name, setName] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const contentLocale = resolveContentLocale(answers.language);
  const progressIndex = onboardingSteps.indexOf((step === "language-more" ? "language" : step) as (typeof onboardingSteps)[number]);
  const next = () => {
    if (step === "login") return onStep("otp");
    if (step === "otp") return onStep(returning ? "ready" : "notifications");
    if (step === "notifications") return onStep("language");
    if (step === "language-more") return onStep("sia");
    const current = onboardingSteps.indexOf(step as (typeof onboardingSteps)[number]);
    if (current === onboardingSteps.length - 1) return onClose();
    onStep(onboardingSteps[current + 1]);
  };
  const back = () => {
    if (step === "login") return onClose();
    if (step === "otp") return onStep("login");
    if (step === "notifications") return onStep("otp");
    if (step === "language-more") return onStep("language");
    const current = onboardingSteps.indexOf(step as (typeof onboardingSteps)[number]);
    if (current === 0 && skipLogin) return onClose();
    onStep(current === 0 ? "notifications" : onboardingSteps[current - 1]);
  };
  const select = (key: string, value: string, multi = false) => setAnswers(current => {
    if (!multi) {
      if (key === "language") {
        const locale = resolveContentLocale(value);
        return { ...current, language: value, time: onboardingCopy[locale].questions.time.options[1] };
      }
      return { ...current, [key]: value };
    }
    const selected = (current[key] as string[] | undefined) ?? [];
    return { ...current, [key]: selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value] };
  });

  let content: React.ReactNode;
  if (step === "login") content = <LoginScreen phone={phone} setPhone={setPhone} returning={returning} onContinue={next} />;
  else if (step === "otp") content = <OtpScreen otp={otp} setOtp={setOtp} onContinue={next} />;
  else if (step === "notifications") content = <NotificationScreen onContinue={next} />;
  else if (step === "language-more") content = <MoreLanguagesScreen selected={answers.language} onSelect={value => select("language", value)} onContinue={next} />;
  else if (step === "profile") content = <ProfileScreen title={onboardingCopy[contentLocale].profileTitle} namePlaceholder={profileCopy[contentLocale].namePlaceholder} genderOptions={profileCopy[contentLocale].genderOptions} name={name} setName={setName} answers={answers} select={select} onContinue={next} />;
  else if (step === "sia") content = <SiaScreen copy={onboardingCopy[contentLocale].sia} onContinue={next} />;
  else if (step === "ready") content = <ReadyScreen returning={returning} onContinue={next} />;
  else if (step === "language") content = <QuestionScreen kind="language" title="Which language do you speak at home?" subtitle="" options={languageOptions} selected={answers.language} multi={false} onSelect={value => select("language", value)} onOtherLanguages={() => onStep("language-more")} onContinue={next} />;
  else {
    const config = onboardingCopy[contentLocale].questions[step as QuestionStep];
    content = <QuestionScreen kind={step as QuestionStep} title={config.title} subtitle="" options={config.options} selected={answers[step]} multi={questionRules[step as QuestionStep].multi} onSelect={value => select(step, value, questionRules[step as QuestionStep].multi)} onContinue={next} />;
  }
  const isOnboarding = progressIndex >= 0;
  return <section className={`flow-screen flow-${step} ${isOnboarding ? `flow-theme-${theme}` : ""} ${step === "language" ? "flow-language" : ""}`} aria-label="Onboarding flow">
    {progressIndex >= 0 && <div className="flow-progress" aria-label={`Onboarding step ${progressIndex + 1} of ${onboardingSteps.length - 1}`}><button aria-label="Go back" onClick={back}><ArrowLeft /></button><span><i style={{ width: `${((progressIndex + 1) / (onboardingSteps.length - 1)) * 100}%` }} /></span><button type="button" className="flow-sound-toggle" aria-label={soundEnabled ? "Mute audio" : "Turn sound on"} aria-pressed={soundEnabled} onClick={() => setSoundEnabled(value => !value)}>{soundEnabled ? <Volume2 /> : <VolumeX />}</button></div>}
    {progressIndex < 0 && <button className="flow-back" aria-label="Go back" onClick={back}><ArrowLeft /></button>}
    {content}
  </section>;
}

const languageOptions = ["हिंदी / Hindi", "தமிழ் / Tamil", "తెలుగు / Telugu", "मराठी / Marathi", "ಕನ್ನಡ / Kannada", "বাংলা / Bengali", "I speak another language"];
const questionRules = { level: { multi: false }, profession: { multi: false }, reason: { multi: true }, improve: { multi: true }, time: { multi: false }, coach: { multi: false } } as const;
type QuestionStep = keyof typeof questionRules;
type ContentLocale = "en" | "hi" | "ta" | "te" | "kn" | "ml";
type LocalizedQuestion = { title: string; options: string[] };
type SiaCopy = { headline: string; subhead: string; tagline: string; benefits: [string, string, string, string] };
type LocalizedCopy = { profileTitle: string; sia: SiaCopy; questions: Record<QuestionStep, LocalizedQuestion> };

function resolveContentLocale(language: string | string[] | undefined): ContentLocale {
  const choice = Array.isArray(language) ? language[0] : language ?? "";
  if (choice.includes("Hindi")) return "hi";
  if (choice.includes("Tamil")) return "ta";
  if (choice.includes("Telugu")) return "te";
  if (choice.includes("Kannada")) return "kn";
  if (choice.includes("Malayalam")) return "ml";
  return "en";
}

const onboardingCopy: Record<ContentLocale, LocalizedCopy> = {
  en: {
    profileTitle: "Tell us about yourself",
    sia: { headline: "Hi, I'm Sia.", subhead: "Your 24×7 English coach.", tagline: "Let's build your learning plan.", benefits: ["Personalised learning", "Real-life practice", "Instant feedback", "On your schedule"] },
    questions: {
      level: { title: "How would you describe your current level of English?", options: ["I am new to English", "I know some common english words", "I can do basic conversations", "I can talk about various topics", "I can discuss big topics in detail"] },
      profession: { title: "What is your profession?", options: ["💼|Business Owner", "👩‍🏫|Teacher", "🎓|Student", "🏠|Home Maker", "👔|Working Professional"] },
      reason: { title: "What is your primary reason to learn to speak English?", options: ["🎉|Just for fun", "👥|Speak with friends/family", "👨‍💻|Clear job interviews", "🏢|Get promoted at office", "✈️|Travel abroad", "🎓|Higher education", "🗣️|Everyday English"] },
      improve: { title: "What's the hardest part of learning English?", options: ["📚|Understanding grammar rules", "🤔|Keep forgetting words", "👂|Understanding English speakers", "✍️|Correct sentence formation", "😰|Freeze while speaking English"] },
      time: { title: "How much time will you take out daily for your learning journey?", options: ["⏰|5-10 minutes", "📱|15-30 minutes", "💻|30-60 minutes", "🚀|More than 1 hour", "🤷|Flexible"] },
      coach: { title: "How do you want me to support you in your journey?", options: ["🔥|Pushy reminders", "🔔|Gentle notifications", "🤫|Quiet mode", "⚡|Strict coach", "🔍|Other"] },
    },
  },
  hi: {
    profileTitle: "Apne baare mein bataiye",
    sia: { headline: "Hi, main Sia hoon.", subhead: "Aapki 24×7 English coach.", tagline: "Chaliye aapka learning plan banate hain.", benefits: ["Aapke liye personalised", "Real-life practice", "Turant feedback", "Aapke time par"] },
    questions: {
      level: { title: "Aapka English level kya hai?", options: ["Main english mein abhi beginner hoon", "Mujhe kuch common English words aate hain", "Basic conversation mujhse ho jaati hai", "Alag-alag topics par baat karne mein comfortable hoon", "English fluently bolne mein koi dikkat nahin"] },
      profession: { title: "Aapka profession kya hai?", options: ["💼|Business Owner", "👩‍🏫|Teacher", "🎓|Student", "🏠|Home Maker", "👔|Working Professional"] },
      reason: { title: "Aap English bolna kyun seekhna chahte ho?", options: ["🎉|Bas maze ke liye", "👥|Doston/family ke saath English mein baat karna", "👨‍💻|Job interviews clear karna", "🏢|Office mein promotion paana", "✈️|Videsh jaana / Travel", "🎓|Higher education / Padhai", "🗣️|Rozmarra ki English"] },
      improve: { title: "English seekhne mein sabse mushkil kya lagta hai?", options: ["📚|Grammar rules samajhna", "🤔|Words bhool jaata hoon", "👂|English bolne walon ko samajhna", "✍️|Sahi sentence banana", "😰|English bolte waqt atak jaana"] },
      time: { title: "Aap rozana seekhne ke liye kitna samay de sakte hain?", options: ["⏰|5-10 minute", "📱|15-30 minute", "💻|30-60 minute", "🚀|1 ghante se zyada", "🤷|Jaise mann kare / Flexible"] },
      coach: { title: "Main aapki journey mein aapko kaise support karun?", options: ["🔥|Baar-baar yaad dilao", "🔔|Gentle notifications", "🤫|Bilkul disturb mat karo", "⚡|Strict coach bano", "🔍|Kuch aur"] },
    },
  },
  ta: {
    profileTitle: "உங்களைப் பற்றி சொல்லுங்கள்",
    sia: { headline: "Hi, நான் Sia.", subhead: "உங்கள் 24×7 English coach.", tagline: "உங்கள் learning plan-ஐ உருவாக்கலாம்.", benefits: ["உங்களுக்கான personalised", "Real-life practice", "உடனடி feedback", "உங்கள் நேரத்தில்"] },
    questions: {
      level: { title: "உங்கள் தற்போதைய English level-ஐ எப்படி சொல்வீர்கள்?", options: ["நான் English-ல் புதியவன்", "எனக்கு சில common English words தெரியும்", "Basic conversations என்னால் பேச முடியும்", "பல்வேறு topics பற்றி பேசுவது எனக்கு comfortable", "English fluently பேசுவதில் எந்த சிக்கலும் இல்லை"] },
      profession: { title: "உங்கள் தொழில் என்ன?", options: ["💼|வணிக உரிமையாளர்", "👩‍🏫|ஆசிரியர்", "🎓|மாணவர்", "🏠|இல்லத்தரசி", "👔|பணிபுரிபவர்"] },
      reason: { title: "English பேச கற்றுக்கொள்ள நீங்கள் ஏன் விரும்புகிறீர்கள்?", options: ["🎉|வெறும் சுவாரஸ்யத்திற்கு", "👥|நண்பர்கள்/குடும்பத்துடன் ஆங்கிலத்தில் பேசுவது", "👨‍💻|வேலை நேர்காணல்களில் தேர்ச்சி", "🏢|அலுவலகத்தில் பதவி உயர்வு பெறுவது", "✈️|வெளிநாட்டு பயணம்", "🎓|உயர்கல்வி", "🗣️|அன்றாட ஆங்கிலம்"] },
      improve: { title: "ஆங்கிலம் கற்பதில் கடினமான பகுதி எது?", options: ["📚|இலக்கண விதிகளைப் புரிந்துகொள்வது", "🤔|வார்த்தைகளை மறந்துவிடுகிறேன்", "👂|ஆங்கிலம் பேசுபவர்களைப் புரிந்துகொள்வது", "✍️|சரியான வாக்கிய அமைப்பு", "😰|ஆங்கிலம் பேசும்போது தயங்குதல்"] },
      time: { title: "உங்கள் learning journey-க்கு தினமும் எவ்வளவு நேரம் ஒதுக்குவீர்கள்?", options: ["⏰|5-10 நிமிடங்கள்", "📱|15-30 நிமிடங்கள்", "💻|30-60 நிமிடங்கள்", "🚀|1 மணி நேரத்திற்கு மேல்", "🤷|எனக்கு தோன்றும்போது"] },
      coach: { title: "உங்கள் journey-ல் நான் உங்களுக்கு எப்படி support செய்ய வேண்டும்?", options: ["🔥|கடுமையான நினைவூட்டல்கள்", "🔔|மென்மையான அறிவிப்புகள்", "🤫|அமைதி முறை", "⚡|கண்டிப்பான பயிற்சியாளர்", "🔍|மற்றவை"] },
    },
  },
  te: {
    profileTitle: "మీ గురించి చెప్పండి",
    sia: { headline: "Hi, నేను Sia.", subhead: "మీ 24×7 English coach.", tagline: "మీ learning plan తయారు చేద్దాం.", benefits: ["మీ కోసం personalised", "Real-life practice", "వెంటనే feedback", "మీ సమయంలో"] },
    questions: {
      level: { title: "మీ ప్రస్తుత English level ఎలా ఉందని చెప్తారు?", options: ["నేను English లో beginner ని", "నాకు కొన్ని common English words తెలుసు", "Basic conversations నేను చేయగలను", "వేర్వేరు topics పై మాట్లాడటం నాకు comfortable", "English fluently మాట్లాడటంలో ఏ ఇబ్బంది లేదు"] },
      profession: { title: "మీ వృత్తి ఏమిటి?", options: ["💼|వ్యాపార యజమాని", "👩‍🏫|ఉపాధ్యాయుడు", "🎓|విద్యార్థి", "🏠|గృహిణి", "👔|ఉద్యోగి"] },
      reason: { title: "English మాట్లాడటం నేర్చుకోవాలని మీరు ఎందుకు అనుకుంటున్నారు?", options: ["🎉|సరదాగా", "👥|స్నేహితులు/కుటుంబంతో ఇంగ్లీష్‌లో మాట్లాడడం", "👨‍💻|ఉద్యోగ ఇంటర్వ్యూలు క్లియర్ చేయడం", "🏢|ఆఫీస్‌లో ప్రమోషన్ పొందడం", "✈️|విదేశ ప్రయాణం", "🎓|ఉన్నత విద్య", "🗣️|రోజువారీ ఇంగ్లీష్"] },
      improve: { title: "ఇంగ్లీష్ నేర్చుకోవడంలో అత్యంత కష్టమైన భాగం ఏది?", options: ["📚|వ్యాకరణ నియమాలను అర్థం చేసుకోవడం", "🤔|పదాలను మర్చిపోవడం", "👂|ఇంగ్లీష్ మాట్లాడేవారిని అర్థం చేసుకోవడం", "✍️|సరైన వాక్య నిర్మాణం", "😰|ఇంగ్లీష్ మాట్లాడేటప్పుడు భయపడటం"] },
      time: { title: "మీ learning journey కోసం రోజూ ఎంత సమయం కేటాయిస్తారు?", options: ["⏰|5-10 నిమిషాలు", "📱|15-30 నిమిషాలు", "💻|30-60 నిమిషాలు", "🚀|1 గంట కంటే ఎక్కువ", "🤷|నాకు అనిపించినప్పుడు"] },
      coach: { title: "మీ journey లో నేను మీకు ఎలా support చేయాలి?", options: ["🔥|గట్టి జ్ఞాపకాలు", "🔔|మెల్లని అధిసూచనలు", "🤫|నిశ్శబ్ద మోడ్", "⚡|కఠినమైన కోచ్", "🔍|ఇతరం"] },
    },
  },
  kn: {
    profileTitle: "ನಿಮ್ಮ ಬಗ್ಗೆ ಹೇಳಿ",
    sia: { headline: "Hi, ನಾನು Sia.", subhead: "ನಿಮ್ಮ 24×7 English coach.", tagline: "ನಿಮ್ಮ learning plan ಮಾಡೋಣ.", benefits: ["ನಿಮಗಾಗಿ personalised", "Real-life practice", "ತಕ್ಷಣ feedback", "ನಿಮ್ಮ ಸಮಯದಲ್ಲಿ"] },
    questions: {
      level: { title: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ English level ಅನ್ನು ಹೇಗೆ ಹೇಳುತ್ತೀರಿ?", options: ["ನಾನು English ನಲ್ಲಿ beginner", "ನನಗೆ ಕೆಲವು common English words ಗೊತ್ತು", "Basic conversations ನನ್ನಿಂದ ಆಗುತ್ತದೆ", "ಬೇರೆ ಬೇರೆ topics ಬಗ್ಗೆ ಮಾತನಾಡಲು comfortable ಆಗಿದ್ದೇನೆ", "English fluently ಮಾತನಾಡಲು ಯಾವ ತೊಂದರೆ ಇಲ್ಲ"] },
      profession: { title: "ನಿಮ್ಮ ವೃತ್ತಿ ಏನು?", options: ["💼|ವ್ಯಾಪಾರ ಮಾಲೀಕ", "👩‍🏫|ಶಿಕ್ಷಕ", "🎓|ವಿದ್ಯಾರ್ಥಿ", "🏠|ಗೃಹಿಣಿ", "👔|ಉದ್ಯೋಗಿ"] },
      reason: { title: "English ಮಾತನಾಡಲು ಕಲಿಯಲು ನೀವು ಏಕೆ ಬಯಸುತ್ತೀರಿ?", options: ["🎉|ಕೇವಲ ಮಜಾಕ್ಕಾಗಿ", "👥|ಸ್ನೇಹಿತರು/ಕುಟುಂಬದೊಂದಿಗೆ ಇಂಗ್ಲೀಷ್‌ನಲ್ಲಿ ಮಾತನಾಡುವುದು", "👨‍💻|ಉದ್ಯೋಗ ಸಂದರ್ಶನಗಳನ್ನು ಪಾಸ್ ಮಾಡುವುದು", "🏢|ಆಫೀಸ್‌ನಲ್ಲಿ ಪ್ರಮೋಷನ್ ಪಡೆಯುವುದು", "✈️|ವಿದೇಶ ಪ್ರಯಾಣ", "🎓|ಉನ್ನತ ಶಿಕ್ಷಣ", "🗣️|ದೈನಂದಿನ ಇಂಗ್ಲೀಷ್"] },
      improve: { title: "ಇಂಗ್ಲಿಷ್ ಕಲಿಯುವಲ್ಲಿ ಅತ್ಯಂತ ಕಷ್ಟಕರ ಭಾಗ ಯಾವುದು?", options: ["📚|ವ್ಯಾಕರಣ ನಿಯಮಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು", "🤔|ಪದಗಳನ್ನು ಮರೆಯುತ್ತೇನೆ", "👂|ಇಂಗ್ಲಿಷ್ ಮಾತನಾಡುವವರನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು", "✍️|ಸರಿಯಾದ ವಾಕ್ಯ ರಚನೆ", "😰|ಇಂಗ್ಲಿಷ್ ಮಾತನಾಡುವಾಗ ಭಯಪಡುವುದು"] },
      time: { title: "ನಿಮ್ಮ learning journey ಗಾಗಿ ಪ್ರತಿದಿನ ಎಷ್ಟು ಸಮಯ ಮೀಸಲಿಡುತ್ತೀರಿ?", options: ["⏰|5-10 ನಿಮಿಷ", "📱|15-30 ನಿಮಿಷ", "💻|30-60 ನಿಮಿಷ", "🚀|1 ಗಂಟೆಗಿಂತ ಹೆಚ್ಚು", "🤷|ನನಗೆ ಅನಿಸಿದಂತೆ"] },
      coach: { title: "ನಿಮ್ಮ journey ನಲ್ಲಿ ನಾನು ನಿಮಗೆ ಹೇಗೆ support ಮಾಡಬೇಕು?", options: ["🔥|ಒತ್ತಾಯದ ಜ್ಞಾಪನೆಗಳು", "🔔|ಮೃದುವಾದ ಅಧಿಸೂಚನೆಗಳು", "🤫|ಶಾಂತ ಮೋಡ್", "⚡|ಕಠಿಣ ಕೋಚ್", "🔍|ಇತರೆ"] },
    },
  },
  ml: {
    profileTitle: "നിങ്ങളെക്കുറിച്ച് പറയൂ",
    sia: { headline: "Hi, ഞാൻ Sia.", subhead: "നിങ്ങളുടെ 24×7 English coach.", tagline: "നിങ്ങളുടെ learning plan ഉണ്ടാക്കാം.", benefits: ["നിങ്ങൾക്കായി personalised", "Real-life practice", "ഉടൻ feedback", "നിങ്ങളുടെ സമയത്ത്"] },
    questions: {
      level: { title: "നിങ്ങളുടെ ഇപ്പോഴത്തെ English level എങ്ങനെ പറയും?", options: ["ഞാൻ English-ൽ beginner ആണ്", "എനിക്ക് ചില common English words അറിയാം", "Basic conversations എനിക്ക് നടത്താൻ കഴിയും", "വിവിധ topics-നെ കുറിച്ച് സംസാരിക്കാൻ comfortable ആണ്", "English fluently സംസാരിക്കാൻ ഒരു ബുദ്ധിമുട്ടും ഇല്ല"] },
      profession: { title: "നിങ്ങളുടെ തൊഴിൽ എന്താണ്?", options: ["💼|ബിസിനസ് ഉടമ", "👩‍🏫|അധ്യാപകൻ", "🎓|വിദ്യാർത്ഥി", "🏠|വീട്ടമ്മ", "👔|ജോലിക്കാരൻ"] },
      reason: { title: "English സംസാരിക്കാൻ പഠിക്കാൻ നിങ്ങൾ എന്തുകൊണ്ട് ആഗ്രഹിക്കുന്നു?", options: ["🎉|രസത്തിന് വേണ്ടി", "👥|സുഹൃത്തുക്കൾ/കുടുംബവുമായി ഇംഗ്ലീഷിൽ സംസാരിക്കുക", "👨‍💻|ജോലി ഇന്റർവ്യൂകൾ പാസാക്കുക", "🏢|ഓഫീസിൽ പ്രമോഷൻ നേടുക", "✈️|വിദേശ യാത്ര", "🎓|ഉന്നത വിദ്യാഭ്യാസം", "🗣️|ദൈനംദിന ഇംഗ്ലീഷ്"] },
      improve: { title: "ഇംഗ്ലീഷ് പഠിക്കുന്നതിലെ ഏറ്റവും ബുദ്ധിമുട്ടുള്ള ഭാഗം ഏതാണ്?", options: ["📚|വ്യാകരണ നിയമങ്ങൾ മനസ്സിലാക്കൽ", "🤔|വാക്കുകൾ മറന്നുപോകുന്നു", "👂|ഇംഗ്ലീഷ് സംസാരിക്കുന്നവരെ മനസ്സിലാക്കൽ", "✍️|ശരിയായ വാക്യഘടന", "😰|ഇംഗ്ലീഷ് സംസാരിക്കുമ്പോൾ വിറയ്ക്കൽ"] },
      time: { title: "നിങ്ങളുടെ learning journey-ക്കായി ദിവസവും എത്ര സമയം നീക്കിവയ്ക്കും?", options: ["⏰|5-10 മിനിറ്റ്", "📱|15-30 മിനിറ്റ്", "💻|30-60 മിനിറ്റ്", "🚀|1 മണിക്കൂറിൽ കൂടുതൽ", "🤷|എനിക്ക് തോന്നുന്ന പോലെ"] },
      coach: { title: "നിങ്ങളുടെ journey-യിൽ ഞാൻ നിങ്ങളെ എങ്ങനെ support ചെയ്യണം?", options: ["🔥|നിർബന്ധിത ഓർമ്മപ്പെടുത്തലുകൾ", "🔔|സൗമ്യമായ അറിയിപ്പുകൾ", "🤫|ശാന്ത മോഡ്", "⚡|കർശന കോച്ച്", "🔍|മറ്റുള്ളവ"] },
    },
  },
};

const profileCopy: Record<ContentLocale, { namePlaceholder: string; genderOptions: [string, string] }> = {
  en: { namePlaceholder: "Type your name here", genderOptions: ["Male", "Female"] },
  hi: { namePlaceholder: "Yahan apna naam likhen", genderOptions: ["Male", "Female"] },
  ta: { namePlaceholder: "உங்கள் பெயரை இங்கே தட்டச்சு செய்யுங்கள்", genderOptions: ["ஆண்", "பெண்"] },
  te: { namePlaceholder: "మీ పేరు ఇక్కడ టైప్ చేయండి", genderOptions: ["పురుషుడు", "స్త్రీ"] },
  kn: { namePlaceholder: "ಇಲ್ಲಿ ನಿಮ್ಮ ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ", genderOptions: ["ಪುರುಷ", "ಮಹಿಳೆ"] },
  ml: { namePlaceholder: "നിങ്ങളുടെ പേര് ഇവിടെ ടൈപ്പ് ചെയ്യുക", genderOptions: ["പുരുഷൻ", "സ്ത്രീ"] },
};

function LoginScreen({ phone, setPhone, returning, onContinue }: { phone: string; setPhone: (value: string) => void; returning: boolean; onContinue: () => void }) {
  return <div className="login-screen"><div className="flow-heading"><h2><em>{returning ? "Welcome" : "Login"}</em>{returning ? " back" : " for"}<br />{returning ? "Let’s continue learning" : "Personalized Learning"}</h2></div><label className="phone-field"><span>+91</span><b /> <input value={phone} onChange={event => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" autoComplete="tel" placeholder="Enter Mobile Number" aria-label="Mobile number" /></label><Button className="flow-cta" disabled={phone.length !== 10} onClick={onContinue}>Get OTP</Button><label className="whatsapp-optin"><input type="checkbox" defaultChecked /> <span>Get lesson reminders & updates on WhatsApp</span></label><p className="flow-legal">By continuing, you agree to our <a>Privacy Policy</a> and <a>Terms & Conditions</a></p></div>;
}

function OtpScreen({ otp, setOtp, onContinue }: { otp: string; setOtp: (value: string) => void; onContinue: () => void }) {
  return <div className="otp-screen"><div className="flow-heading"><h2>Enter the OTP</h2><p>We sent a 4-digit code to your mobile number.</p></div><input className="otp-field" value={otp} onChange={event => setOtp(event.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" autoComplete="one-time-code" placeholder="•  •  •  •" aria-label="One-time password" /><button className="resend">Resend OTP in 00:30</button><Button className="flow-cta" disabled={otp.length !== 4} onClick={onContinue}>Verify & continue</Button></div>;
}

function NotificationScreen({ onContinue }: { onContinue: () => void }) {
  return <div className="notification-screen"><Bell className="bell-mark" /><h2>Keep your learning on track</h2><p>Get a reminder when it’s time for your next lesson.</p><div className="permission-card"><Bell /><strong>“SpeakX” would like to send you notifications</strong><Button className="permission-allow" onClick={onContinue}>Allow</Button><button onClick={onContinue}>Don’t allow</button></div><Button className="flow-cta" onClick={onContinue}>Continue</Button></div>;
}

function QuestionScreen({ kind, title, subtitle, options, selected, multi, onSelect, onOtherLanguages, onContinue }: { kind: "language" | QuestionStep; title: string; subtitle: string; options: string[]; selected: string | string[] | undefined; multi: boolean; onSelect: (value: string) => void; onOtherLanguages?: () => void; onContinue: () => void }) {
  const values = Array.isArray(selected) ? selected : selected ? [selected] : [];
  return <div className={`question-screen question-${kind} ${!title ? "question-without-title" : ""}`}><div className="question-copy">{title && <h2>{title}</h2>}{subtitle && <p>{subtitle}</p>}</div><div className="choice-list" role={multi ? "group" : "radiogroup"}>{options.map(option => { const [emoji, label] = option.includes("|") ? option.split("|", 2) : ["", option]; const isOtherLanguages = option === "I speak another language"; const chosen = values.includes(option); return <button key={option} className={`${chosen ? "selected" : ""} ${isOtherLanguages ? "other-language" : multi ? "multi-choice" : "single-choice"}`} onClick={() => isOtherLanguages && onOtherLanguages ? onOtherLanguages() : onSelect(option)} aria-pressed={chosen}><span>{emoji && <b aria-hidden="true">{emoji}</b>}{label}</span><i>{isOtherLanguages ? <ChevronRight /> : chosen && (multi ? <Check /> : <b />)}</i></button>; })}</div>{stepHelp(title)}<Button className="flow-cta" disabled={!values.length} onClick={onContinue}>Continue</Button></div>;
}

const otherLanguages = [
  ["Afrikaans"], ["Shqip", "Albanian"], ["العربية", "Arabic"], ["Armenian"], ["中文", "Chinese"], ["English"], ["Eesti", "Estonian"], ["Français", "French"], ["Deutsch", "German"], ["ગુજરાતી", "Gujarati"], ["日本語", "Japanese"], ["한국어", "Korean"], ["മലയാളം", "Malayalam"], ["नेपाली", "Nepali"], ["ଓଡ଼ିଆ", "Odia"], ["ਪੰਜਾਬੀ", "Punjabi"], ["Русский", "Russian"], ["Español", "Spanish"], ["اُردُو", "Urdu"],
] as const;

function MoreLanguagesScreen({ selected, onSelect, onContinue }: { selected: string | string[] | undefined; onSelect: (value: string) => void; onContinue: () => void }) {
  const choice = Array.isArray(selected) ? selected[0] : selected;
  return <div className="more-languages-screen"><div className="question-copy"><h2>Which language do you speak at home?</h2></div><div className="more-language-scroll"><div className="more-language-list" role="radiogroup">{otherLanguages.map(([native, english]) => { const value = english ? `${native}|${english}` : native; const chosen = choice === value; return <button key={value} className={chosen ? "selected" : ""} onClick={() => onSelect(value)} aria-pressed={chosen}><span><b>{native}</b>{english && <em>/ {english}</em>}</span><i>{chosen && <b />}</i></button>; })}</div></div><Button className="flow-cta" disabled={!choice} onClick={onContinue}>Continue</Button></div>;
}

function stepHelp(title: string) {
  return title.startsWith("How much time") ? <p className="time-help">Small, daily practice creates lasting confidence.</p> : null;
}

function ProfileScreen({ title, namePlaceholder, genderOptions, name, setName, answers, select, onContinue }: { title: string; namePlaceholder: string; genderOptions: [string, string]; name: string; setName: (value: string) => void; answers: Answers; select: (key: string, value: string) => void; onContinue: () => void }) {
  const gender = answers.gender as string | undefined;
  const age = answers.age as string | undefined;
  return <div className="profile-screen"><div className="question-copy"><h2>{title}</h2></div><label className="text-field">Your name<input value={name} onChange={event => setName(event.target.value)} placeholder={namePlaceholder} /></label><p className="field-label">Gender</p><div className="inline-options">{genderOptions.map(option => <button key={option} className={gender === option ? "selected" : ""} onClick={() => select("gender", option)}>{option}</button>)}</div><p className="field-label">Select Age</p><div className="age-options">{["<18", "18-25", "26-30", "31-40", "41-50", "50+"].map(option => <button key={option} className={age === option ? "selected" : ""} onClick={() => select("age", option)}>{option}</button>)}</div><Button className="flow-cta" disabled={!name || !gender || !age} onClick={onContinue}>Continue</Button></div>;
}

function SiaScreen({ copy, onContinue }: { copy: SiaCopy; onContinue: () => void }) {
  const benefits = [[SlidersHorizontal, copy.benefits[0]], [Mic, copy.benefits[1]], [CircleCheck, copy.benefits[2]], [CalendarCheck, copy.benefits[3]]] as const;
  return <div className="sia-screen"><img className="sia-portrait" src="/images/sia/sia.png" alt="Sia, SpeakX English coach" /><h2>{copy.headline}</h2><strong>{copy.subhead}</strong><p>{copy.tagline}</p><div className="sia-benefits">{benefits.map(([Icon, label]) => <div key={label}><span><Icon /></span><small>{label}</small></div>)}</div><Button className="flow-cta" onClick={onContinue}>Continue</Button></div>;
}

function ReadyScreen({ returning, onContinue }: { returning: boolean; onContinue: () => void }) {
  return <div className="ready-screen"><div className="ready-tick"><Check /></div><h2>{returning ? "You’re signed in." : "Your learning plan is ready."}</h2><p>{returning ? "Pick up from where you left off." : "We’ve tailored your first lessons to your goals."}</p><Button className="flow-cta" onClick={onContinue}>{returning ? "Continue learning" : "Start learning"} <ArrowRight /></Button></div>;
}
