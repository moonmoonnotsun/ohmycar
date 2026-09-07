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
    "Estimate — not confirmed by a mechanic.",
    "Szacunek — niepotwierdzony przez mechanika.",
    "Оценка — не подтверждена механиком.",
  );

  if (!q) {
    return say(locale, "Ask about the engine, rust, or PLN.", "Napisz pytanie o silnik, rdzę albo PLN.", "Напишите вопрос о моторе, ржавчине или PLN.");
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
          `${who} is N47. The chain sits at the gearbox end. A snap or jump often means replacing the engine — that is why the score is ${variant.score.toFixed(1)}. This is not M47 and not all E90 diesels.`,
          `${who} ma N47. Łańcuch siedzi od strony skrzyni. Pęknięcie albo przeskok często oznacza wymianę silnika — stąd ocena ${variant.score.toFixed(1)}. To nie M47 i nie wszystkie diesle E90.`,
          `${who} — это N47. Цепь со стороны коробки. Обрыв или перескок часто означает замену мотора — поэтому оценка ${variant.score.toFixed(1)}. Это не M47 и не все дизели E90.`,
        ) +
        " " +
        foot
      );
    }
    return (
      say(
        locale,
        `${who} is not an N47. The rear chain is the N47 318d/320d issue, not this engine. Main fault here: ${topTitle}.`,
        `${who} nie jest N47. Łańcuch z tyłu to usterka 320d/318d N47, nie tego silnika. Tu główna usterka: ${topTitle}.`,
        `${who} — не N47. Задняя цепь — поломка 320d/318d N47, не этого мотора. Главная поломка здесь: ${topTitle}.`,
      ) +
      " " +
      foot
    );
  }

  if (has(q, ["rdza", "rust", "belka", "subframe", "sól", "sol", "ржав", "подрам"])) {
    return (
      say(
        locale,
        `Rear subframe rust is a common reason to reject a car at inspection in Poland. It is not diesel versus petrol. On ${who} still check the welds; do not treat the ${variant.score.toFixed(1)} score as a pass.`,
        `Rdza tylnej belki to częsty powód odrzucenia auta na oględzinach w Polsce. To nie diesel kontra benzyna. Na ${who} i tak sprawdzaj spoiny; ocena ${variant.score.toFixed(1)} nie zastępuje oględzin.`,
        `Ржавчина заднего подрамника — частая причина отказаться от машины на осмотре в Польше. Это не дизель против бензина. На ${who} всё равно проверяйте швы; оценка ${variant.score.toFixed(1)} не заменяет осмотр.`,
      ) +
      " " +
      foot
    );
  }

  if (has(q, ["elv", "cas", "kierownic", "steering", "lock", "postój", "strand", "рул", "блок"])) {
    return (
      say(
        locale,
        `ELV/CAS can prevent starting even if the ${variant.engine} is sound. Electronics, not the engine. At inspection: the car should start from the key without extra steps.`,
        `ELV/CAS potrafi uniemożliwić rozruch, nawet gdy ${variant.engine} jest sprawny. To elektronika, nie silnik. Na oględzinach: auto powinno odpalić z kluczyka bez dodatkowych kroków.`,
        `ELV/CAS может не дать завестись, даже если ${variant.engine} исправен. Электрика, не мотор. На осмотре: машина должна завестись с ключа без дополнительных действий.`,
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
          `The electric water pump on ${variant.engine} often fails with little warning. On ${who} that is a typical bill (${money}), not engine-out.`,
          `Elektryczna pompka wody na ${variant.engine} często pada bez wcześniejszego objawu. Na ${who} to typowy rachunek (${money}), nie wyjęcie silnika.`,
          `Электрическая помпа на ${variant.engine} часто отказывает почти без предупреждения. На ${who} это типичный счёт (${money}), не снятие мотора.`,
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
        `Score ${variant.score.toFixed(1)} starts at 100 and subtracts catastrophe, 5-year fix, pain load, campaigns, and parts. Asking price never enters. Status: estimate. Main fault: ${topTitle}.`,
        `Ocena ${variant.score.toFixed(1)} startuje od 100 i odejmuje katastrofy, 5-letni remont, usterki, akcje i części. Cena zakupu nie wchodzi. Status: szacunek. Główna usterka: ${topTitle}.`,
        `Оценка ${variant.score.toFixed(1)} стартует со 100 и вычитает катастрофы, 5-летний ремонт, поломки, акции и запчасти. Цена покупки не входит. Статус: оценка. Главная поломка: ${topTitle}.`,
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
        `Typical repair on ${who}: ${money} (independent–ASO in the report). Main fault: ${topTitle}.${second ? ` Also check: ${second}.` : ""}`,
        `Typowy remont na ${who}: ${money} (niezależny–ASO w opisie). Główna usterka: ${topTitle}.${second ? ` Druga rzecz do sprawdzenia: ${second}.` : ""}`,
        `Типичный ремонт на ${who}: ${money} (независимый–ASO в описании). Главная поломка: ${topTitle}.${second ? ` Ещё проверьте: ${second}.` : ""}`,
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
            "This is one of the lower-risk engines in the family — still inspect it.",
            "To jeden z silników o niższym ryzyku w rodzinie — oględziny i tak obowiązkowe.",
            "Это один из моторов с более низким риском в семействе — осмотр всё равно обязателен.",
          )
        : variant.score >= 45
          ? say(
              locale,
              "Mid-table: buy the service history, not the photo.",
              "Środek tabeli: kupuj historią serwisową, nie zdjęciem.",
              "Середина таблицы: смотрите сервисную историю, не фото.",
            )
          : say(
              locale,
              "High risk. A low asking price is not a saving if the fault is original.",
              "Wysokie ryzyko. Niska cena nie jest oszczędnością, jeśli usterka jest oryginalna.",
              "Высокий риск. Низкая цена не экономия, если поломка родная.",
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
      `${first} Score ${variant.score.toFixed(1)}. Main fault: ${topTitle}.`,
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
        `${chassis.code} (${chassis.years}) is in the catalog, but there is no 0–100 table. We will not invent a score. Open a scored chassis if you want engine and PLN.`,
        `${chassis.code} (${chassis.years}) jest w katalogu, ale nie ma tabeli 0–100. Nie wymyślimy oceny. Wejdź w podwozie z tabelą, jeśli chcesz silnik i PLN.`,
        `${chassis.code} (${chassis.years}) есть в каталоге, но таблицы 0–100 нет. Оценку не выдумаем. Откройте шасси с таблицей, если нужен мотор и PLN.`,
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
        `Lowest typical risk on ${chassis.code}: ${best.year} ${best.model} ${best.engine} (${best.score.toFixed(1)}). That is not “no faults” — read that year’s report.`,
        `Najniższe typowe ryzyko na ${chassis.code}: ${best.year} ${best.model} ${best.engine} (${best.score.toFixed(1)}). To nie znaczy „bez usterek” — czytaj opis tego roku.`,
        `Самый низкий типичный риск на ${chassis.code}: ${best.year} ${best.model} ${best.engine} (${best.score.toFixed(1)}). Это не «без поломок» — читайте описание этого года.`,
      ) +
      " " +
      foot
    );
  }

  if (has(q, ["najgor", "worst", "n47", "unika", "avoid", "diesel", "худш", "избег", "дизел"])) {
    return (
      say(
        locale,
        `Highest risk on ${chassis.code}: ${worst.year} ${worst.model} ${worst.engine} (${worst.score.toFixed(1)}). N47 is not M47. Do not mix years.`,
        `Najwyższe ryzyko na ${chassis.code}: ${worst.year} ${worst.model} ${worst.engine} (${worst.score.toFixed(1)}). N47 to nie M47. Nie mieszaj lat.`,
        `Самый высокий риск на ${chassis.code}: ${worst.year} ${worst.model} ${worst.engine} (${worst.score.toFixed(1)}). N47 — не M47. Не путайте годы.`,
      ) +
      " " +
      foot
    );
  }

  if (has(q, ["rdza", "rust", "belka", "subframe", "ржав", "подрам"])) {
    return (
      say(
        locale,
        `On ${chassis.code} subframe rust is Polish winter, not the engine. Check welds at inspection.`,
        `Na ${chassis.code} rdza belki jest polską zimą, nie silnikiem. Sprawdzaj spoiny na oględzinach.`,
        `На ${chassis.code} ржавчина подрамника — польская зима, не мотор. Проверяйте швы на осмотре.`,
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
        "320d — несколько машин. E46 M47 — заслонки. E90/E87/F30 N47 — задняя цепь. Поздние F30/F20 B47 — EGR, не та цепь. Откройте шасси, прежде чем внести задаток.",
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
        "330i — четыре машины. E46 M54, E90 N52/N53, F30 N20/B48. Шильдик ничего не говорит. Откройте шасси и год.",
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
      "This is not a general chat for a VIN. Open E90, E46, F30, E60… and ask about that engine. Or type a chassis code in search.",
      "To nie ogólny czat od VIN. Wejdź w E90, E46, F30, E60… i pytaj o ten silnik. Albo wpisz kod podwozia w wyszukiwarkę.",
      "Это не общий чат по VIN. Откройте E90, E46, F30, E60… и спросите про этот мотор. Или введите код шасси в поиск.",
    ) +
    " " +
    foot
  );
}
