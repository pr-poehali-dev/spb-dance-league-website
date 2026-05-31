import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────
type Section = "home" | "about" | "clubs" | "judges" | "events" | "schedule" | "documents" | "contacts";

interface Judge {
  id: number;
  name: string;
  category: string;
  club: string;
  license: string;
  since: string;
}

interface Club {
  id: number;
  name: string;
  director: string;
  address: string;
  members: number;
  since: string;
  styles: string[];
}

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  status: "upcoming" | "past";
  type: string;
}

interface Document {
  id: number;
  title: string;
  category: string;
  date: string;
  size: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const JUDGES: Judge[] = [
  { id: 1, name: "Иванова Елена Сергеевна", category: "Судья 1-й категории", club: "Невский Стиль", license: "SPB-J-001", since: "2015" },
  { id: 2, name: "Петров Дмитрий Александрович", category: "Судья Всероссийской категории", club: "Северная Звезда", license: "SPB-J-002", since: "2012" },
  { id: 3, name: "Смирнова Ольга Владимировна", category: "Судья 1-й категории", club: "Балтика Данс", license: "SPB-J-003", since: "2018" },
  { id: 4, name: "Козлов Михаил Игоревич", category: "Судья Международной категории", club: "Класс-Премиум", license: "SPB-J-004", since: "2010" },
  { id: 5, name: "Николаева Светлана Петровна", category: "Судья 1-й категории", club: "Эдельвейс", license: "SPB-J-005", since: "2017" },
  { id: 6, name: "Федоров Андрей Николаевич", category: "Судья 2-й категории", club: "Невский Стиль", license: "SPB-J-006", since: "2020" },
];

const CLUBS: Club[] = [
  { id: 1, name: "Невский Стиль", director: "Карпова Татьяна Юрьевна", address: "Невский пр., 82", members: 145, since: "2003", styles: ["Стандарт", "Латина"] },
  { id: 2, name: "Северная Звезда", director: "Орлов Виктор Семёнович", address: "ул. Восстания, 15", members: 98, since: "2007", styles: ["Стандарт", "Латина", "Хип-хоп"] },
  { id: 3, name: "Балтика Данс", director: "Серова Ирина Константиновна", address: "Московский пр., 193", members: 210, since: "1998", styles: ["Стандарт", "Латина"] },
  { id: 4, name: "Класс-Премиум", director: "Громов Алексей Павлович", address: "Литейный пр., 27", members: 73, since: "2011", styles: ["Стандарт"] },
  { id: 5, name: "Эдельвейс", director: "Лебедева Наталья Ивановна", address: "Садовая ул., 50", members: 120, since: "2005", styles: ["Латина", "Хип-хоп"] },
  { id: 6, name: "Перспектива", director: "Тихонов Борис Андреевич", address: "пр. Просвещения, 77", members: 85, since: "2014", styles: ["Стандарт", "Латина"] },
];

const EVENTS: Event[] = [
  { id: 1, title: "Кубок Санкт-Петербурга 2026", date: "14 июня 2026", location: "ДК им. Горького", status: "upcoming", type: "Турнир" },
  { id: 2, title: "Открытый чемпионат СПТЛ", date: "28 июня 2026", location: "Ледовый дворец", status: "upcoming", type: "Чемпионат" },
  { id: 3, title: "Летние встречи", date: "12 июля 2026", location: "Таврический дворец", status: "upcoming", type: "Фестиваль" },
  { id: 4, title: "Весенний кубок 2026", date: "18 апреля 2026", location: "ДК Выборгский", status: "past", type: "Турнир" },
  { id: 5, title: "Зимний фестиваль танца", date: "25 февраля 2026", location: "Зал Октябрьский", status: "past", type: "Фестиваль" },
];

const SCHEDULE = [
  { month: "Июнь 2026", events: ["14.06 — Кубок Санкт-Петербурга", "28.06 — Открытый чемпионат СПТЛ"] },
  { month: "Июль 2026", events: ["12.07 — Летние встречи (Фестиваль)", "19.07 — Турнир молодёжи"] },
  { month: "Август 2026", events: ["09.08 — Летний кубок", "23.08 — Открытые старты СПТЛ"] },
  { month: "Сентябрь 2026", events: ["06.09 — Кубок открытия сезона", "20.09 — Чемпионат лиги (1 этап)"] },
  { month: "Октябрь 2026", events: ["11.10 — Кубок осени", "25.10 — Чемпионат лиги (2 этап)"] },
  { month: "Ноябрь 2026", events: ["08.11 — Гран-при СПТЛ", "22.11 — Финал чемпионата лиги"] },
];

const DOCUMENTS: Document[] = [
  { id: 1, title: "Устав Санкт-Петербургской Танцевальной Лиги", category: "Уставные документы", date: "01.01.2024", size: "245 КБ" },
  { id: 2, title: "Положение о судействе СПТЛ", category: "Регламенты", date: "15.03.2024", size: "118 КБ" },
  { id: 3, title: "Положение о проведении соревнований", category: "Регламенты", date: "15.03.2024", size: "203 КБ" },
  { id: 4, title: "Требования к квалификации судей", category: "Регламенты", date: "10.02.2024", size: "89 КБ" },
  { id: 5, title: "Форма заявки на вступление клуба в СПТЛ", category: "Заявления и формы", date: "01.01.2024", size: "44 КБ" },
  { id: 6, title: "Форма заявки на аккредитацию судьи", category: "Заявления и формы", date: "01.01.2024", size: "38 КБ" },
  { id: 7, title: "Протокол общего собрания СПТЛ 2024", category: "Протоколы", date: "20.12.2024", size: "176 КБ" },
  { id: 8, title: "Финансовый отчёт СПТЛ за 2024 год", category: "Финансовые документы", date: "31.01.2025", size: "312 КБ" },
];

// ─── QR Code Component ───────────────────────────────────────────────────────
function QRCode({ value }: { value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="qr-placeholder" title={`QR: ${value}`} />
      <span className="text-[9px] font-ibm text-gray-500 tracking-wider">{value}</span>
    </div>
  );
}

// ─── Navigation ──────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: "home", label: "Главная" },
  { id: "about", label: "О лиге" },
  { id: "clubs", label: "Клубы" },
  { id: "judges", label: "Судьи" },
  { id: "events", label: "События" },
  { id: "schedule", label: "График турниров" },
  { id: "documents", label: "Документы" },
  { id: "contacts", label: "Контакты" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Index() {
  const [active, setActive] = useState<Section>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [judgeSearch, setJudgeSearch] = useState("");
  const [clubSearch, setClubSearch] = useState("");
  const [docCategory, setDocCategory] = useState("Все");
  const [selectedJudge, setSelectedJudge] = useState<Judge | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const navigate = (section: Section) => {
    setActive(section);
    setMenuOpen(false);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredJudges = JUDGES.filter(j =>
    j.name.toLowerCase().includes(judgeSearch.toLowerCase()) ||
    j.category.toLowerCase().includes(judgeSearch.toLowerCase()) ||
    j.club.toLowerCase().includes(judgeSearch.toLowerCase())
  );

  const filteredClubs = CLUBS.filter(c =>
    c.name.toLowerCase().includes(clubSearch.toLowerCase()) ||
    c.director.toLowerCase().includes(clubSearch.toLowerCase())
  );

  const docCategories = ["Все", ...Array.from(new Set(DOCUMENTS.map(d => d.category)))];
  const filteredDocs = docCategory === "Все" ? DOCUMENTS : DOCUMENTS.filter(d => d.category === docCategory);

  return (
    <div className="min-h-screen bg-sptl-light font-ibm flex flex-col" ref={topRef}>

      {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
      <div className="bg-sptl-dark text-white py-1.5 px-4 text-center text-[10px] tracking-widest font-ibm font-light">
        ОФИЦИАЛЬНЫЙ САЙТ САНКТ-ПЕТЕРБУРГСКОЙ ТАНЦЕВАЛЬНОЙ ЛИГИ
      </div>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header className="bg-white border-b-2 border-sptl-dark sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <button onClick={() => navigate("home")} className="flex items-center gap-4 group">
              <img
                src="https://cdn.poehali.dev/projects/f401a539-cf32-4ac0-b4b5-972c26c82b1e/bucket/d0b2598a-b0e6-4360-b683-4b7f3c8c4443.png"
                alt="СПТЛ"
                className="h-12 w-auto object-contain"
              />
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`nav-link px-3 py-5 font-oswald text-xs tracking-widest uppercase transition-colors
                    ${active === item.id ? "text-sptl-red" : "text-sptl-dark hover:text-sptl-red"}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-sptl-dark"
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-sptl-dark border-t border-gray-800">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`block w-full text-left px-6 py-3.5 font-oswald text-sm tracking-widest uppercase border-b border-gray-800
                  ${active === item.id ? "text-sptl-red bg-black/20" : "text-white hover:text-sptl-red"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <main className="flex-1">

        {/* ════ HOME ════════════════════════════════════════════════════ */}
        {active === "home" && (
          <div>
            {/* Hero */}
            <section className="relative min-h-[520px] flex items-center overflow-hidden"
              style={{ background: "linear-gradient(120deg, #111111 0%, #C0202A 55%, #f5f0ee 100%)" }}>
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }}
              />

              <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-10">
                <div className="max-w-2xl">
                  <div className="font-oswald text-sptl-red text-xs tracking-[0.3em] mb-4 animate-fade-in">
                    ОСНОВАНА В 2025 ГОДУ · САНКТ-ПЕТЕРБУРГ
                  </div>
                  <h1 className="font-oswald text-5xl md:text-7xl font-bold text-white leading-none tracking-wide mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    ТАНЦЕВАЛЬНАЯ<br />
                    <span className="text-sptl-red">ЛИГА</span>
                  </h1>
                  <p className="font-ibm text-gray-300 text-lg leading-relaxed mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    Официальная организация, объединяющая ведущие танцевальные клубы<br className="hidden md:block" /> Санкт-Петербурга и регулирующая соревновательную деятельность.
                  </p>
                  <div className="flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <button onClick={() => navigate("clubs")} className="bg-sptl-red text-white font-oswald px-8 py-3 text-sm tracking-widest uppercase hover:bg-red-700 transition-colors">
                      КЛУБЫ ЛИГИ
                    </button>
                    <button onClick={() => navigate("events")} className="border border-white text-white font-oswald px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-sptl-dark transition-colors">
                      СОБЫТИЯ
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-8 hidden xl:block">
                <img
                  src="https://cdn.poehali.dev/projects/f401a539-cf32-4ac0-b4b5-972c26c82b1e/bucket/d0b2598a-b0e6-4360-b683-4b7f3c8c4443.png"
                  alt=""
                  className="w-96 h-32 object-contain filter invert opacity-10"
                />
              </div>
            </section>

            {/* Stats */}
            <section className="bg-white border-y border-gray-200">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
                  {[
                    { num: "1", label: "Год деятельности" },
                    { num: "6", label: "Клубов в составе" },
                    { num: "610", label: "Спортсменов" },
                    { num: "11", label: "Турниров в год" },
                  ].map((s, i) => (
                    <div key={i} className="py-8 px-6 text-center">
                      <div className="font-oswald text-4xl font-bold text-sptl-red mb-1">{s.num}</div>
                      <div className="font-ibm text-xs text-gray-500 tracking-wider uppercase">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Quick sections */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
              <h2 className="font-oswald text-3xl font-semibold text-sptl-dark mb-2 tracking-wide sptl-line">РАЗДЕЛЫ САЙТА</h2>
              <p className="text-gray-500 text-sm mb-10 mt-4">Вся необходимая информация о деятельности лиги</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
                {[
                  { id: "about" as Section, icon: "Info", title: "О ЛИГЕ", desc: "История, миссия, руководство и структура организации" },
                  { id: "clubs" as Section, icon: "Building2", title: "КЛУБЫ", desc: "Официальные члены лиги — адреса, руководители, стили" },
                  { id: "judges" as Section, icon: "UserCheck", title: "СУДЬИ", desc: "База судей с лицензиями и персональными QR-кодами" },
                  { id: "events" as Section, icon: "Calendar", title: "СОБЫТИЯ", desc: "Анонсы предстоящих и архив прошедших мероприятий" },
                  { id: "schedule" as Section, icon: "CalendarDays", title: "ГРАФИК ТУРНИРОВ", desc: "Расписание соревнований на текущий сезон" },
                  { id: "documents" as Section, icon: "FileText", title: "ДОКУМЕНТЫ", desc: "Регламенты, уставы, формы заявлений и протоколы" },
                ].map(item => (
                  <button key={item.id} onClick={() => navigate(item.id)}
                    className="sptl-card bg-white p-8 text-left group">
                    <Icon name={item.icon} size={28} className="text-sptl-red mb-4 group-hover:scale-110 transition-transform" />
                    <div className="font-oswald text-lg font-semibold text-sptl-dark mb-2 tracking-wide">{item.title}</div>
                    <div className="font-ibm text-sm text-gray-500 leading-relaxed">{item.desc}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Upcoming events preview */}
            <section className="bg-sptl-dark py-16">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <div className="font-oswald text-sptl-red text-xs tracking-[0.3em] mb-2">БЛИЖАЙШИЕ СОБЫТИЯ</div>
                    <h2 className="font-oswald text-3xl font-semibold text-white tracking-wide">ПРЕДСТОЯЩИЕ ТУРНИРЫ</h2>
                  </div>
                  <button onClick={() => navigate("schedule")} className="text-sptl-red font-oswald text-xs tracking-widest hover:text-red-400 transition-colors hidden sm:block">
                    ВЕСЬ ГРАФИК →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-700">
                  {EVENTS.filter(e => e.status === "upcoming").map(ev => (
                    <div key={ev.id} className="bg-sptl-dark p-6 border-t-2 border-transparent hover:border-sptl-red transition-colors">
                      <div className="font-oswald text-sptl-red text-xs tracking-widest mb-3">{ev.type.toUpperCase()}</div>
                      <div className="font-oswald text-white text-lg mb-2 leading-snug">{ev.title}</div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                        <Icon name="Calendar" size={12} />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Icon name="MapPin" size={12} />
                        <span>{ev.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ════ ABOUT ═══════════════════════════════════════════════════ */}
        {active === "about" && (
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
            <div className="mb-2 text-sptl-red font-oswald text-xs tracking-[0.3em]">О ЛИГЕ</div>
            <h1 className="font-oswald text-4xl font-bold text-sptl-dark mb-2 tracking-wide sptl-line">САНКТ-ПЕТЕРБУРГСКАЯ ТАНЦЕВАЛЬНАЯ ЛИГА</h1>
            <div className="h-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-oswald text-lg font-semibold text-sptl-dark tracking-wide mb-3 uppercase">История</h3>
                <p className="font-ibm text-gray-600 text-sm leading-relaxed mb-4">
                  Санкт-Петербургская Танцевальная Лига основана в 2025 году группой ведущих педагогов и руководителей танцевальных клубов города. За более чем два десятилетия лига стала ведущей организацией в сфере спортивных бальных танцев Северо-Западного региона России.
                </p>
                <p className="font-ibm text-gray-600 text-sm leading-relaxed">
                  Лига является членом Всероссийской Федерации Танцевального Спорта и ведёт активную работу по развитию танцевального спорта, подготовке судей и организации соревновательной деятельности.
                </p>
              </div>
              <div>
                <h3 className="font-oswald text-lg font-semibold text-sptl-dark tracking-wide mb-3 uppercase">Миссия</h3>
                <p className="font-ibm text-gray-600 text-sm leading-relaxed mb-4">
                  Объединение танцевальных клубов Санкт-Петербурга, стандартизация соревновательной деятельности, подготовка квалифицированных судей и популяризация спортивных бальных танцев.
                </p>
                <ul className="space-y-2">
                  {[
                    "Организация городских и региональных соревнований",
                    "Аккредитация и профессиональная подготовка судей",
                    "Регулирование клубного членства и стандартов",
                    "Взаимодействие с федеральными структурами",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-sptl-red mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 bg-white border border-gray-200">
              <div className="bg-sptl-dark px-6 py-4">
                <h3 className="font-oswald text-white text-lg tracking-wide">РУКОВОДСТВО ЛИГИ</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { role: "Президент лиги", name: "Александров Виктор Михайлович", phone: "+7 (812) 000-00-01" },
                  { role: "Вице-президент", name: "Воронова Надежда Борисовна", phone: "+7 (812) 000-00-02" },
                  { role: "Главный секретарь", name: "Зайцев Константин Леонидович", phone: "+7 (812) 000-00-03" },
                  { role: "Председатель судейской коллегии", name: "Козлов Михаил Игоревич", phone: "+7 (812) 000-00-04" },
                ].map((p, i) => (
                  <div key={i} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-oswald text-xs text-sptl-red tracking-widest uppercase mb-1">{p.role}</div>
                      <div className="font-ibm text-sm font-medium text-sptl-dark">{p.name}</div>
                    </div>
                    <div className="font-ibm text-sm text-gray-500">{p.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ CLUBS ═══════════════════════════════════════════════════ */}
        {active === "clubs" && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="mb-2 text-sptl-red font-oswald text-xs tracking-[0.3em]">СОСТАВ ЛИГИ</div>
            <h1 className="font-oswald text-4xl font-bold text-sptl-dark mb-2 tracking-wide sptl-line">КЛУБЫ</h1>
            <div className="h-6" />
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по названию или директору..."
                  value={clubSearch}
                  onChange={e => setClubSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm font-ibm focus:outline-none focus:border-sptl-red bg-white"
                />
              </div>
              <div className="font-ibm text-sm text-gray-500 flex items-center">
                {filteredClubs.length} клубов в базе
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-gray-200">
              {filteredClubs.map(club => (
                <div key={club.id} className="sptl-card bg-white p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-sptl-dark flex items-center justify-center text-white font-oswald text-lg font-bold flex-shrink-0">
                      {club.name.charAt(0)}
                    </div>
                    <span className="font-oswald text-xs text-sptl-red border border-sptl-red px-2 py-0.5 tracking-wider">
                      С {club.since}
                    </span>
                  </div>
                  <h3 className="font-oswald text-xl font-semibold text-sptl-dark tracking-wide mb-1">{club.name}</h3>
                  <div className="font-ibm text-xs text-gray-500 mb-3">Руководитель: {club.director}</div>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-ibm">
                      <Icon name="MapPin" size={12} className="text-sptl-red flex-shrink-0" />
                      {club.address}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-ibm">
                      <Icon name="Users" size={12} className="text-sptl-red flex-shrink-0" />
                      {club.members} спортсменов
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {club.styles.map(s => (
                      <span key={s} className="bg-sptl-light text-sptl-dark text-[10px] font-ibm px-2 py-0.5 tracking-wider uppercase border border-gray-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ JUDGES ══════════════════════════════════════════════════ */}
        {active === "judges" && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="mb-2 text-sptl-red font-oswald text-xs tracking-[0.3em]">РЕЕСТР</div>
            <h1 className="font-oswald text-4xl font-bold text-sptl-dark mb-2 tracking-wide sptl-line">СУДЬИ ЛИГИ</h1>
            <div className="h-6" />

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по имени, категории, клубу..."
                  value={judgeSearch}
                  onChange={e => setJudgeSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm font-ibm focus:outline-none focus:border-sptl-red bg-white"
                />
              </div>
              <div className="font-ibm text-sm text-gray-500 flex items-center">
                {filteredJudges.length} судей в реестре
              </div>
            </div>

            {/* Judge modal */}
            {selectedJudge && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedJudge(null)}>
                <div className="bg-white max-w-md w-full shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
                  <div className="bg-sptl-dark px-6 py-4 flex items-center justify-between">
                    <div className="font-oswald text-white tracking-wide">КАРТОЧКА СУДЬИ</div>
                    <button onClick={() => setSelectedJudge(null)} className="text-gray-400 hover:text-white">
                      <Icon name="X" size={18} />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-4 mb-6">
                      <div className="w-16 h-16 bg-sptl-dark flex items-center justify-center text-white font-oswald text-2xl font-bold flex-shrink-0">
                        {selectedJudge.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-oswald text-xs text-sptl-red tracking-widest mb-1">{selectedJudge.category.toUpperCase()}</div>
                        <h2 className="font-oswald text-xl font-semibold text-sptl-dark leading-snug">{selectedJudge.name}</h2>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <Icon name="Building2" size={14} className="text-sptl-red" />
                        <span className="font-ibm text-gray-600">{selectedJudge.club}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Icon name="Hash" size={14} className="text-sptl-red" />
                        <span className="font-ibm text-gray-600 font-medium">Лицензия: {selectedJudge.license}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Icon name="Calendar" size={14} className="text-sptl-red" />
                        <span className="font-ibm text-gray-600">В реестре с {selectedJudge.since} года</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-5">
                      <div className="font-oswald text-xs tracking-widest text-gray-400 mb-3">ПЕРСОНАЛЬНЫЙ QR-КОД</div>
                      <div className="flex items-center gap-6">
                        <QRCode value={selectedJudge.license} />
                        <div className="text-xs text-gray-400 font-ibm leading-relaxed">
                          QR-код содержит данные лицензии судьи для быстрой проверки на соревнованиях
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-sptl-dark">
                      <th className="text-left px-4 py-3 font-oswald text-xs text-white tracking-widest uppercase">Ф.И.О.</th>
                      <th className="text-left px-4 py-3 font-oswald text-xs text-white tracking-widest uppercase hidden md:table-cell">Категория</th>
                      <th className="text-left px-4 py-3 font-oswald text-xs text-white tracking-widest uppercase hidden lg:table-cell">Клуб</th>
                      <th className="text-left px-4 py-3 font-oswald text-xs text-white tracking-widest uppercase hidden sm:table-cell">Лицензия</th>
                      <th className="text-center px-4 py-3 font-oswald text-xs text-white tracking-widest uppercase">QR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJudges.map((judge, i) => (
                      <tr key={judge.id}
                        className={`border-b border-gray-100 hover:bg-sptl-light cursor-pointer transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                        onClick={() => setSelectedJudge(judge)}>
                        <td className="px-4 py-4">
                          <div className="font-ibm text-sm font-medium text-sptl-dark">{judge.name}</div>
                          <div className="font-ibm text-xs text-gray-400 md:hidden mt-0.5">{judge.category}</div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="font-ibm text-xs text-sptl-red border border-sptl-red/40 px-2 py-0.5 whitespace-nowrap">{judge.category}</span>
                        </td>
                        <td className="px-4 py-4 font-ibm text-sm text-gray-500 hidden lg:table-cell">{judge.club}</td>
                        <td className="px-4 py-4 font-ibm text-xs text-gray-400 font-mono hidden sm:table-cell">{judge.license}</td>
                        <td className="px-4 py-4 text-center">
                          <button className="text-sptl-red hover:text-red-700 transition-colors" title="Показать QR-код">
                            <Icon name="QrCode" size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-gray-400 font-ibm mt-3">Нажмите на строку для просмотра карточки судьи с QR-кодом</p>
          </div>
        )}

        {/* ════ EVENTS ══════════════════════════════════════════════════ */}
        {active === "events" && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="mb-2 text-sptl-red font-oswald text-xs tracking-[0.3em]">АНОНСЫ И АРХИВ</div>
            <h1 className="font-oswald text-4xl font-bold text-sptl-dark mb-2 tracking-wide sptl-line">СОБЫТИЯ</h1>
            <div className="h-8" />

            <h2 className="font-oswald text-xl font-semibold text-sptl-dark tracking-wide mb-4 flex items-center gap-3">
              <span className="w-3 h-3 bg-sptl-red inline-block" />
              ПРЕДСТОЯЩИЕ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 mb-12">
              {EVENTS.filter(e => e.status === "upcoming").map(ev => (
                <div key={ev.id} className="sptl-card bg-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-oswald text-xs text-sptl-red border border-sptl-red px-2 py-0.5 tracking-wider">{ev.type.toUpperCase()}</span>
                    <Icon name="ChevronRight" size={16} className="text-gray-300" />
                  </div>
                  <h3 className="font-oswald text-lg font-semibold text-sptl-dark tracking-wide mb-4 leading-snug">{ev.title}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-ibm">
                      <Icon name="Calendar" size={12} className="text-sptl-red flex-shrink-0" />
                      {ev.date}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-ibm">
                      <Icon name="MapPin" size={12} className="text-sptl-red flex-shrink-0" />
                      {ev.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="font-oswald text-xl font-semibold text-gray-400 tracking-wide mb-4 flex items-center gap-3">
              <span className="w-3 h-3 bg-gray-300 inline-block" />
              ПРОШЕДШИЕ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
              {EVENTS.filter(e => e.status === "past").map(ev => (
                <div key={ev.id} className="bg-white p-5 flex items-center gap-4 border-l-4 border-gray-200 hover:border-gray-400 transition-colors">
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon name="Trophy" size={18} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-oswald text-sm text-gray-600 mb-1">{ev.title}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-ibm">
                      <span>{ev.date}</span>
                      <span>{ev.location}</span>
                    </div>
                  </div>
                  <span className="font-oswald text-xs text-gray-400 tracking-wider">{ev.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ SCHEDULE ════════════════════════════════════════════════ */}
        {active === "schedule" && (
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
            <div className="mb-2 text-sptl-red font-oswald text-xs tracking-[0.3em]">СЕЗОН 2026</div>
            <h1 className="font-oswald text-4xl font-bold text-sptl-dark mb-2 tracking-wide sptl-line">ГРАФИК ТУРНИРОВ</h1>
            <div className="h-8" />
            <div className="space-y-px">
              {SCHEDULE.map((month, i) => (
                <div key={i} className="bg-white flex">
                  <div className="bg-sptl-dark w-36 sm:w-44 flex-shrink-0 flex items-center justify-center p-4">
                    <div className="font-oswald text-white text-xs sm:text-sm tracking-wider text-center leading-snug">{month.month}</div>
                  </div>
                  <div className="flex-1 divide-y divide-gray-50">
                    {month.events.map((ev, j) => (
                      <div key={j} className="flex items-center gap-4 px-6 py-4 hover:bg-sptl-light transition-colors group">
                        <div className="w-2 h-2 bg-sptl-red flex-shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="font-ibm text-sm text-sptl-dark">{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-white border border-gray-200 p-5">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={16} className="text-sptl-red flex-shrink-0 mt-0.5" />
                <p className="font-ibm text-sm text-gray-500 leading-relaxed">
                  Расписание может изменяться. Следите за актуальными анонсами в разделе «События». По вопросам участия обращайтесь к секретарю лиги.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ════ DOCUMENTS ═══════════════════════════════════════════════ */}
        {active === "documents" && (
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
            <div className="mb-2 text-sptl-red font-oswald text-xs tracking-[0.3em]">НОРМАТИВНАЯ БАЗА</div>
            <h1 className="font-oswald text-4xl font-bold text-sptl-dark mb-2 tracking-wide sptl-line">ДОКУМЕНТЫ</h1>
            <div className="h-8" />

            <div className="flex flex-wrap gap-2 mb-8">
              {docCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setDocCategory(cat)}
                  className={`font-oswald text-xs px-4 py-2 tracking-wider transition-colors
                    ${docCategory === cat ? "bg-sptl-dark text-white" : "bg-white border border-gray-300 text-sptl-dark hover:border-sptl-dark"}`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-px">
              {filteredDocs.map(doc => (
                <div key={doc.id} className="bg-white p-5 flex items-center gap-4 hover:bg-sptl-light transition-colors group cursor-pointer border-l-4 border-transparent hover:border-sptl-red">
                  <div className="w-10 h-10 bg-sptl-light flex items-center justify-center flex-shrink-0">
                    <Icon name="FileText" size={18} className="text-sptl-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-ibm text-sm font-medium text-sptl-dark mb-1 group-hover:text-sptl-red transition-colors truncate">{doc.title}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-ibm">
                      <span className="bg-gray-100 px-2 py-0.5">{doc.category}</span>
                      <span>{doc.date}</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                  <Icon name="Download" size={16} className="text-gray-300 group-hover:text-sptl-red transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ CONTACTS ════════════════════════════════════════════════ */}
        {active === "contacts" && (
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
            <div className="mb-2 text-sptl-red font-oswald text-xs tracking-[0.3em]">СВЯЗАТЬСЯ С НАМИ</div>
            <h1 className="font-oswald text-4xl font-bold text-sptl-dark mb-2 tracking-wide sptl-line">КОНТАКТЫ</h1>
            <div className="h-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {[
                  { icon: "MapPin", label: "Адрес", value: "Санкт-Петербург,\nул. Примерная, д. 1, оф. 101" },
                  { icon: "Phone", label: "Телефон", value: "+7 (812) 000-00-00" },
                  { icon: "Mail", label: "Электронная почта", value: "info@sptl-dance.ru" },
                  { icon: "Clock", label: "Режим работы", value: "Пн–Пт: 10:00 – 19:00\nСб: 10:00 – 15:00" },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-sptl-dark flex items-center justify-center flex-shrink-0">
                      <Icon name={c.icon} size={18} className="text-sptl-red" />
                    </div>
                    <div>
                      <div className="font-oswald text-xs text-gray-400 tracking-widest mb-1 uppercase">{c.label}</div>
                      <div className="font-ibm text-sm text-sptl-dark whitespace-pre-line">{c.value}</div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <div className="font-oswald text-xs text-gray-400 tracking-widest mb-3 uppercase">Социальные сети</div>
                  <div className="flex gap-3">
                    {[
                      { icon: "MessageCircle", label: "ВКонтакте" },
                      { icon: "Send", label: "Telegram" },
                    ].map((s, i) => (
                      <button key={i} className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-xs font-ibm hover:border-sptl-dark hover:text-sptl-dark transition-colors text-gray-500">
                        <Icon name={s.icon} size={14} />
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200">
                <div className="bg-sptl-dark px-6 py-4">
                  <h3 className="font-oswald text-white tracking-wide">НАПИСАТЬ НАМ</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="font-oswald text-xs text-gray-500 tracking-widest block mb-1.5 uppercase">Имя</label>
                    <input type="text" placeholder="Ваше имя" className="w-full border border-gray-300 px-3 py-2.5 text-sm font-ibm focus:outline-none focus:border-sptl-red transition-colors" />
                  </div>
                  <div>
                    <label className="font-oswald text-xs text-gray-500 tracking-widest block mb-1.5 uppercase">Электронная почта</label>
                    <input type="email" placeholder="email@example.com" className="w-full border border-gray-300 px-3 py-2.5 text-sm font-ibm focus:outline-none focus:border-sptl-red transition-colors" />
                  </div>
                  <div>
                    <label className="font-oswald text-xs text-gray-500 tracking-widest block mb-1.5 uppercase">Сообщение</label>
                    <textarea rows={4} placeholder="Ваш вопрос или обращение..." className="w-full border border-gray-300 px-3 py-2.5 text-sm font-ibm focus:outline-none focus:border-sptl-red transition-colors resize-none" />
                  </div>
                  <button className="w-full bg-sptl-red text-white font-oswald py-3 text-sm tracking-widest uppercase hover:bg-red-700 transition-colors">
                    ОТПРАВИТЬ СООБЩЕНИЕ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-sptl-dark mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.poehali.dev/projects/f401a539-cf32-4ac0-b4b5-972c26c82b1e/bucket/d0b2598a-b0e6-4360-b683-4b7f3c8c4443.png"
                alt="СПТЛ"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {NAV_ITEMS.map(item => (
                <button key={item.id} onClick={() => navigate(item.id)}
                  className="font-oswald text-[10px] text-gray-500 hover:text-sptl-red tracking-widest uppercase transition-colors">
                  {item.label}
                </button>
              ))}
            </div>
            <div className="font-ibm text-xs text-gray-600 text-center md:text-right">
              © 2025–2026 СПТЛ<br />Все права защищены
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 py-2 text-center">
          <span className="font-ibm text-[10px] text-gray-700 tracking-widest">САНКТ-ПЕТЕРБУРГ · РОССИЯ</span>
        </div>
      </footer>
    </div>
  );
}