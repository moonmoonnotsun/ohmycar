import { getChassis } from "@/data/chassis";
import { tx } from "@/data/loc";
import { chassisVerdict, variantVerdict } from "@/data/verdicts";
import type { Chassis, VariantBrief } from "@/data/types";
import { getPain, getVariant, painsForVariant, variantsFor } from "@/lib/catalog";
import { formatPlnBand } from "@/lib/links";
import type { Locale } from "@/lib/locale";

export type ChatContext = {
  locale: Locale;
  chassisSlug?: string;
  variantSlug?: string;
};

export type ChatRequest = ChatContext & { message: string };

export type ChatResponse = {
  reply: string;
  stub: true;
};

function has(q: string, words: string[]) {
  return words.some((word) => q.includes(word));
}

function say(locale: Locale, en: string, pl: string, ru: string): string {
  if (locale === "pl") return pl;
  if (locale === "ru") return ru;
  return en;
}

export function resolveChatTarget(ctx: ChatContext): { chassis?: Chassis; variant?: VariantBrief } {
  const chassis = ctx.chassisSlug ? getChassis(ctx.chassisSlug) : undefined;
  const variant = chassis && ctx.variantSlug ? getVariant(chassis.slug, ctx.variantSlug) : undefined;
  return { chassis, variant };
}

export function chatLabel(ctx: ChatContext): string {
  const { chassis, variant } = resolveChatTarget(ctx);
  if (variant) return `${variant.year} ${variant.model} ${variant.engine}`;
  if (chassis) return chassis.code;
  return "OhMyCar";
}

export function stubChatReply(req: ChatRequest): string {
  const q = req.message.trim().toLowerCase();
  const { locale } = req;
  const { chassis, variant } = resolveChatTarget(req);
  const foot = say(
    locale,
    "Hypothesis — not a substitute for an inspector.",
    "Hipoteza — nie podmienia rzeczoznawcy.",
    "Гипотеза — не заменяет эксперта.",
  );

  if (!q) {
    return say(locale, "Ask about the engine, rust, or PLN.", "Napisz pytanie o silnik, rdzę albo PLN.", "Спроси про мотор, ржавчину или PLN.");
  }

  if (variant && chassis) return variantReply(q, locale, chassis, variant, foot);
  if (chassis) return chassisReply(q, locale, chassis, foot);
  return homeReply(q, locale, foot);
}

function variantReply(q: string, locale: Locale, chassis: Chassis, variant: VariantBrief, foot: string): string {
  const top = getPain(variant.topPainId);
  const pains = painsForVariant(variant);
  const verdict = variantVerdict(variant, chassis, "");
  const money = formatPlnBand(variant.expectedRepairPln, locale);
  const who = `${variant.year} ${chassis.code} ${variant.model} ${variant.engine}`;
  const topTitle = top ? tx(top.title, locale) : "—";

  if (has(q, ["n47", "łańcuch", "lancuch", "chain", "timing", "цеп", "грм"])) {
    if (variant.engine === "N47") {
      return (
        say(
          locale,
          `${who} is N47. The chain sits at the gearbox end. Snap or jump often writes the engine off — that is why the score is ${variant.score.toFixed(1)}. This is not M47 and not “all E90”.`,
          `${who} ma N47. Łańcuch siedzi od strony skrzyni. Pęknięcie albo przeskok często kończy silnik — stąd ocena ${variant.score.toFixed(1)}. To nie M47 i nie „wszystkie E90”.`,
          `${who} — это N47. Цепь со стороны коробки. Обрыв или перескок часто заканчивается мотором — поэтому оценка ${variant.score.toFixed(1)}. Это не M47 и не «все E90».`,
        ) +
        " " +
        foot
      );
    }
    return (
      say(
        locale,
        `${who} is not an N47. The rear chain is the N47 318d/320d story, not this row. Headline fault here: ${topTitle}.`,
        `${who} nie jest N47. Łańcuch z tyłu to historia 320d/318d N47, nie tego wiersza. Tu główna usterka: ${topTitle}.`,
        `${who} — не N47. Задняя цепь — история 320d/318d N47, не этой строки. Главная поломка здесь: ${topTitle}.`,
      ) +
      " " +
      foot
    );
  }

  if (has(q, ["rdza", "rust", "belka", "subframe", "sól", "sol", "ржав", "подрам"])) {
    return (
      say(
        locale,
        `Rear subframe rust is a viewing killer in Poland, not diesel vs petrol. On ${who} still check the welds before you fall for the ${variant.score.toFixed(1)} score.`,
        `Rdza tylnej belki to usterka oględzinowa w Polsce, nie diesel kontra benzyna. Na ${who} i tak sprawdzaj spoiny, zanim pokochasz ocenę ${variant.score.toFixed(1)}.`,
        `Ржавчина заднего подрамника — убийца осмотра в Польше, не дизель против бензина. На ${who} всё равно смотри швы, прежде чем влюбиться в оценку ${variant.score.toFixed(1)}.`,
      ) +
      " " +
      foot
    );
  }

  if (has(q, ["elv", "cas", "kierownic", "steering", "lock", "postój", "strand", "рул", "блок"])) {
    return (
      say(
        locale,
        `ELV/CAS can strand a healthy engine. Electronics, not the ${variant.engine}. At a viewing: it must start from the key without drama.`,
        `ELV/CAS potrafi unieruchomić sprawny silnik. To elektronika, nie ${variant.engine}. Na oględzinach: auto musi odpalić z kluczyka bez kombinowania.`,
        `ELV/CAS может оставить на стоянке живой мотор. Электрика, не ${variant.engine}. На осмотре: машина должна завестись с ключа без танцев.`,
      ) +
      " " +
      foot
    );
  }

  if (has(q, ["pomp", "thermostat", "n52", "chłodz", "cool", "охлажд", "помп"])) {
    if (variant.engine === "N52" || variant.engine === "N54" || variant.engine === "N55") {
      return (
        say(
          locale,
          `The electric water pump on ${variant.engine} dies with little warning. On ${who} that is a typical bill (${money}), not an engine-out.`,
          `Elektryczna pompka wody na ${variant.engine} pada bez wielkiego warningu. Na ${who} to typowy rachunek (${money}), nie wyjęcie silnika.`,
          `Электрическая помпа на ${variant.engine} умирает почти без предупреждения. На ${who} это типичный счёт (${money}), не снятие мотора.`,
        ) +
        " " +
        foot
      );
    }
  }

  if (has(q, ["ocen", "score", "0–100", "0-100", "niezawod", "reliab", "оцен", "надёж", "надеж"])) {
    return (
      say(
        locale,
        `Score ${variant.score.toFixed(1)} starts at 100 and subtracts catastrophe, 5-year fix, pain load, campaigns, and parts. Asking price never enters. Status: hypothesis. Headline fault: ${topTitle}.`,
        `Ocena ${variant.score.toFixed(1)} startuje od 100 i odejmuje katastrofy, 5-letni remont, usterki, akcje i części. Cena zakupu nie wchodzi. Status: hipoteza. Główna usterka: ${topTitle}.`,
        `Оценка ${variant.score.toFixed(1)} стартует со 100 и вычитает катастрофы, 5-летний ремонт, поломки, акции и запчасти. Цена покупки не входит. Статус: гипотеза. Главная поломка: ${topTitle}.`,
      ) +
      " " +
      foot
    );
  }

  if (has(q, ["remont", "napraw", "koszt", "ile", "repair", "fix", "pln", "zł", "zl", "ремонт", "скольк", "цен"])) {
    const second = pains[1] ? tx(pains[1].title, locale) : "";
    return (
      say(
        locale,
        `Typical repair on ${who}: ${money} (independent–ASO in the briefing). Headline fault: ${topTitle}.${second ? ` Also check: ${second}.` : ""}`,
        `Typowy remont na ${who}: ${money} (niezależny–ASO w briefingu). Główna usterka: ${topTitle}.${second ? ` Druga rzecz do sprawdzenia: ${second}.` : ""}`,
        `Типичный ремонт на ${who}: ${money} (независимый–ASO в брифинге). Главная поломка: ${topTitle}.${second ? ` Ещё проверь: ${second}.` : ""}`,
      ) +
      " " +
      foot
    );
  }

  if (has(q, ["kupow", "brać", "brac", "buy", "should", "warto", "worth", "deposit", "zadatek", "брать", "покупа", "стоит"])) {
    const tone =
      variant.score >= 70
        ? say(
            locale,
            "This is one of the calmer rows in the family — still inspect it.",
            "To jeden z spokojniejszych wierszy w rodzinie — oględziny i tak obowiązkowe.",
            "Одна из спокойных строк в семействе — осмотр всё равно обязателен.",
          )
        : variant.score >= 45
          ? say(
              locale,
              "Mid-table: buy the service history, not the photo.",
              "Środek tabeli: kupuj historią serwisową, nie zdjęciem.",
              "Середина таблицы: бери сервисную историю, не фото.",
            )
          : say(
              locale,
              "High risk. A low asking price is not a bargain if the fault is original.",
              "Wysokie ryzyko. Niska cena nie jest okazją, jeśli usterka jest oryginalna.",
              "Высокий риск. Низкая цена не выгода, если поломка родная.",
            );
    return `${tone} ${tx(verdict.good, locale)} ${tx(verdict.bad, locale)} ${foot}`;
  }

  const first = tx(verdict.summary, locale)
    .split(/(?<=[.!?])\s+/)
    .slice(0, 2)
    .join(" ");
  return (
    say(
      locale,
      `${first} Score ${variant.score.toFixed(1)}. Headline fault: ${topTitle}.`,
      `${first} Ocena ${variant.score.toFixed(1)}. Główna usterka: ${topTitle}.`,
      `${first} Оценка ${variant.score.toFixed(1)}. Главная поломка: ${topTitle}.`,
    ) +
    " " +
    foot
  );
}

function chassisReply(q: string, locale: Locale, chassis: Chassis, foot: string): string {
  const rows = variantsFor(chassis.slug);
  const verdict = chassisVerdict(chassis);

  if (!rows.length) {
    return (
      say(
        locale,
        `${chassis.code} (${chassis.years}) is in the catalog, but there is no signed 0–100 table. We will not invent a score. Open a scored chassis if you want engine and PLN.`,
        `${chassis.code} (${chassis.years}) jest w katalogu, ale nie ma podpisanej tabeli 0–100. Nie zmyślimy oceny. Wejdź w podwozie z tabelą, jeśli chcesz silnik i PLN.`,
        `${chassis.code} (${chassis.years}) есть в каталоге, но подписанной таблицы 0–100 нет. Оценку не выдумаем. Открой шасси с таблицей, если нужен мотор и PLN.`,
      ) +
      " " +
      foot
    );
  }

  const best = rows.reduce((a, b) => (a.score >= b.score ? a : b));
  const worst = rows.reduce((a, b) => (a.score <= b.score ? a : b));

  if (has(q, ["najlep", "best", "n52", "spokoj", "лучш", "спокой"])) {
    return (
      say(
        locale,
        `Calmest row on ${chassis.code}: ${best.year} ${best.model} ${best.engine} (${best.score.toFixed(1)}). That is not “no faults” — read that year’s briefing.`,
        `Najspokojniejszy wiersz na ${chassis.code}: ${best.year} ${best.model} ${best.engine} (${best.score.toFixed(1)}). To nie znaczy „bez usterek” — czytaj briefing tego roku.`,
        `Самая спокойная строка на ${chassis.code}: ${best.year} ${best.model} ${best.engine} (${best.score.toFixed(1)}). Это не «без поломок» — читай брифинг этого года.`,
      ) +
      " " +
      foot
    );
  }

  if (has(q, ["najgor", "worst", "n47", "unika", "avoid", "diesel", "худш", "избег", "дизел"])) {
    return (
      say(
        locale,
        `Highest risk on ${chassis.code}: ${worst.year} ${worst.model} ${worst.engine} (${worst.score.toFixed(1)}). N47 is not M47. Do not blend years.`,
        `Najwyższe ryzyko na ${chassis.code}: ${worst.year} ${worst.model} ${worst.engine} (${worst.score.toFixed(1)}). N47 to nie M47. Nie mieszaj lat.`,
        `Самый высокий риск на ${chassis.code}: ${worst.year} ${worst.model} ${worst.engine} (${worst.score.toFixed(1)}). N47 — не M47. Не мешай годы.`,
      ) +
      " " +
      foot
    );
  }

  if (has(q, ["rdza", "rust", "belka", "subframe", "ржав", "подрам"])) {
    return (
      say(
        locale,
        `On ${chassis.code} subframe rust is Polish winter, not the engine. Check welds at the viewing.`,
        `Na ${chassis.code} rdza belki jest polską zimą, nie silnikiem. Sprawdzaj spoiny na oględzinach.`,
        `На ${chassis.code} ржавчина подрамника — польская зима, не мотор. Смотри швы на осмотре.`,
      ) +
      " " +
      foot
    );
  }

  const first = tx(verdict.summary, locale)
    .split(/(?<=[.!?])\s+/)
    .slice(0, 2)
    .join(" ");
  return `${first} ${foot}`;
}

function homeReply(q: string, locale: Locale, foot: string): string {
  if (has(q, ["320d", "n47", "diesel", "дизел"])) {
    return (
      say(
        locale,
        "320d is several cars. E46 M47 is flaps. E90/E87/F30 N47 is the rear chain. Later F30/F20 B47 is EGR, not that chain. Open a chassis before you put a deposit.",
        "320d to kilka aut. E46 M47 to klapy. E90/E87/F30 N47 to łańcuch z tyłu. Późniejsze F30/F20 B47 to EGR, nie ten łańcuch. Wejdź w podwozie, zanim dasz zadatek.",
        "320d — несколько машин. E46 M47 — заслонки. E90/E87/F30 N47 — задняя цепь. Поздние F30/F20 B47 — EGR, не та цепь. Открой шасси, прежде чем внести задаток.",
      ) +
      " " +
      foot
    );
  }
  if (has(q, ["330i", "n52", "n53"])) {
    return (
      say(
        locale,
        "330i is four cars. E46 M54, E90 N52/N53, F30 N20/B48. The badge is not an identity. Open a chassis and a year.",
        "330i to cztery auta. E46 M54, E90 N52/N53, F30 N20/B48. Znaczek nic nie mówi. Otwórz podwozie i rok.",
        "330i — четыре машины. E46 M54, E90 N52/N53, F30 N20/B48. Шильдик ничего не говорит. Открой шасси и год.",
      ) +
      " " +
      foot
    );
  }
  if (has(q, ["ocen", "score", "0-100", "0–100", "оцен"])) {
    return (
      say(
        locale,
        "0–100 starts at 100. We subtract catastrophe, 5-year fix, pain, campaigns, parts. Listing price never enters.",
        "0–100 startuje od 100. Odejmujemy katastrofy, 5-letni remont, usterki, akcje, części. Cena ogłoszenia nie wchodzi.",
        "0–100 стартует со 100. Вычитаем катастрофы, 5-летний ремонт, поломки, акции, запчасти. Цена объявления не входит.",
      ) +
      " " +
      foot
    );
  }
  return (
    say(
      locale,
      "This is not ChatGPT for a VIN. Open E90, E46, F30, E60… and ask about that row. Or type a chassis code in search.",
      "To nie ChatGPT od VIN. Wejdź w E90, E46, F30, E60… i pytaj o ten wiersz. Albo wpisz kod podwozia w wyszukiwarkę.",
      "Это не ChatGPT по VIN. Открой E90, E46, F30, E60… и спроси про эту строку. Или введи код шасси в поиск.",
    ) +
    " " +
    foot
  );
}
