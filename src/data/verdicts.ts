import type { Chassis, Localized, VariantBrief } from "./types";
import { loc } from "./loc";
import { getPain } from "@/lib/catalog";
import { volumeEngineVerdicts } from "./volumeEngineVerdicts";

export type Verdict = {
  summary: Localized;
  good: Localized;
  bad: Localized;
};

type Band = {
  from: number;
  to: number;
  summary: Localized;
  good: Localized;
  bad: Localized;
};

function band(from: number, to: number, en: string, pl: string, enGood: string, plGood: string, enBad: string, plBad: string, ru = en, ruGood = enGood, ruBad = enBad): Band {
  return {
    from,
    to,
    summary: loc(en, pl, ru),
    good: loc(enGood, plGood, ruGood),
    bad: loc(enBad, plBad, ruBad),
  };
}

const CHASSIS: Record<string, Verdict> = {
  e90: {
    summary: loc(
      "E90 is the fifth-generation 3 Series sedan (2005–2012). It is the most common used BMW on Polish classifieds. An N52 330i and an N47 320d have different risks, so the table splits year and engine. Independent workshops and parts are easy to find. Typical problems: rear subframe rust after winter salt, and ELV/CAS that can prevent starting. Read the engine row before inspection; the 330i badge does not name the engine.",
      "E90 to sedan serii 3 V generacji (2005–2012). To najczęstsze używane BMW na polskich ogłoszeniach. N52 330i i N47 320d mają inne ryzyka, dlatego tabela dzieli rok i silnik. Warsztaty niezależne i części są łatwo dostępne. Typowe problemy: rdza tylnej belki po soli oraz ELV/CAS, które mogą uniemożliwić rozruch. Czytaj wiersz silnika przed oględzinami; znaczek 330i nie nazywa silnika.",
      "E90 — седан пятого поколения 3 серии (2005–2012). Это самое частое б/у BMW на польских объявлениях. У N52 330i и N47 320d разный риск, поэтому таблица делит год и мотор. Независимые сервисы и запчасти найти легко. Типичные проблемы: ржавчина заднего подрамника после соли и ELV/CAS, из‑за которых машина может не завестись. Читайте строку мотора до осмотра; шильдик 330i не указывает мотор.",
    ),
    good: loc("Parts, workshops, and enough listings to skip a rusty example.", "Części, warsztaty i dość ogłoszeń, żeby odpuścić rdzewiejące egzemplarze.", "Запчасти, сервисы и достаточно объявлений, чтобы отказаться от ржавого экземпляра."),
    bad: loc("Subframe rust after Polish salt, and electronics that can prevent starting.", "Rdza belki po soli i elektronika, która może uniemożliwić rozruch.", "Ржавчина подрамника после польской соли и электрика, из‑за которой машина может не завестись."),
  },
  e91: {
    summary: loc(
      "E91 is the Touring of the same E9x generation (2005–2012). Engines and 0–100 scores match the E90 sedan. The wagon body adds rust on the tailgate, roof rails, and rear floor. Inspect it on a lift. The N47 timing chain is the same as on the sedan. An N52 Touring is still the simpler petrol option.",
      "E91 to Touring tej samej generacji E9x (2005–2012). Silniki i oceny 0–100 jak w sedan E90. Nadwozie kombi dodaje rdzę na klapie, relingach i podłodze bagażnika. Oglądaj na podnośniku. Łańcuch N47 jest ten sam co w sedan. N52 Touring nadal jest prostszą benzyną.",
      "E91 — универсал того же поколения E9x (2005–2012). Моторы и оценки 0–100 как у седана E90. Кузов универсала добавляет ржавчину на крышке, рейлингах и полу багажника. Осматривайте на подъёмнике. Цепь N47 та же, что у седана. N52 Touring по‑прежнему более простой бензин.",
    ),
    good: loc("Same engines as the sedan, with a larger boot.", "Te same silniki co sedan, z większym bagażnikiem.", "Те же моторы, что у седана, с большим багажником."),
    bad: loc("More rust than the sedan. Inspect on a lift.", "Więcej rdzy niż sedan. Oglądaj na podnośniku.", "Больше ржавчины, чем у седана. Осматривайте на подъёмнике."),
  },
  e92: {
    summary: loc(
      "E92 is the coupe (2006–2013). There is no 2005 coupe; that is not a missing page. From 2006 the engines follow the E90 table: N52 is the simpler petrol, N47 is the chain diesel. Frameless doors and fewer listings change the market, not the water pump. Subframe rust is the same as on the sedan. The coupe is a body, not a different engine.",
      "E92 to coupe (2006–2013). Nie było coupe z 2005 — to nie brakująca strona. Od 2006 silniki jak w tabeli E90: N52 to prostsza benzyna, N47 to diesel z łańcuchem. Bezramkowe drzwi i mniej ogłoszeń zmieniają rynek, nie pompę wody. Rdza belki jak w sedan. Coupe to nadwozie, nie inny silnik.",
      "E92 — купе (2006–2013). Купе 2005 года не было — это не отсутствующая страница. С 2006 моторы как в таблице E90: N52 — более простой бензин, N47 — дизель с цепью. Безрамные двери и меньше объявлений меняют рынок, не помпу. Ржавчина подрамника как у седана. Купе — кузов, не другой мотор.",
    ),
    good: loc("Same scored engines as E90 from 2006.", "Od 2006 te same ocenione silniki co E90.", "С 2006 те же оценённые моторы, что у E90."),
    bad: loc("No 2005 coupe. Fewer listings, door leaks, same subframe rust.", "Brak coupe z 2005. Mniej ogłoszeń, nieszczelne drzwi, ta sama belka.", "Нет купе 2005 года. Меньше объявлений, течи дверей, тот же подрамник."),
  },
  e93: {
    summary: loc(
      "E93 is the convertible (2007–2013). Extra cost: roof hydraulics, fabric, and leaks that a sedan does not have. Engines follow the E90 table: N52 330i is the simpler petrol, N47 320d is still a chain diesel. Production starts later than sedan and Touring. Check the roof cycle and drains at inspection. Polish winter is harder on a convertible.",
      "E93 to cabrio (2007–2013). Dodatkowy koszt: hydraulika dachu, materiał i nieszczelności, których sedan nie ma. Silniki jak w tabeli E90: N52 330i to prostsza benzyna, N47 320d nadal diesel z łańcuchem. Produkcja startuje później niż sedan i Touring. Na oględzinach sprawdź cykl dachu i odpływy. Polska zima jest dla cabrio trudniejsza.",
      "E93 — кабриолет (2007–2013). Дополнительные расходы: гидравлика крыши, ткань и течи, которых нет у седана. Моторы как в таблице E90: N52 330i — более простой бензин, N47 320d — по‑прежнему дизель с цепью. Производство началось позже седана и универсала. На осмотре проверьте цикл крыши и сливы. Польская зима для кабриолета тяжелее.",
    ),
    good: loc(
      "Same engines as the sedan once that year exists.",
      "Gdy rok istnieje — te same silniki co sedan.",
      "Когда год существует — те же моторы, что у седана.",
    ),
    bad: loc(
      "Roof leaks and rams, later start year, more rust from salt.",
      "Nieszczelny dach, siłowniki, późniejszy start i więcej rdzy od soli.",
      "Течи крыши, гидроцилиндры, поздний старт и больше ржавчины от соли.",
    ),
  },
  e46: {
    summary: loc(
      "E46 is the fourth-generation 3 Series (1998–2006). It is still common in Poland. It is not an E90: petrol M54, diesel M47/M57, cooling plastics, DISA, swirl flaps — not an N47 rear chain. After two decades of salt, check rear subframe and sills on a lift. Confirm the engine plate before inspection. M54 330i and M47 320d have different typical repairs.",
      "E46 to seria 3 IV generacji (1998–2006). Nadal częsta w Polsce. To nie E90: benzyna M54, diesel M47/M57, plastik chłodzenia, DISA, klapy wirowe — nie łańcuch N47 z tyłu. Po dwóch dekadach soli sprawdź na podnośniku tylną belkę i progi. Przed oględzinami potwierdź tabliczkę silnika. M54 330i i M47 320d mają inne typowe naprawy.",
      "E46 — четвёртая 3 серия (1998–2006). В Польше всё ещё частая. Это не E90: бензин M54, дизели M47/M57, пластик охлаждения, DISA, вихревые заслонки — не задняя цепь N47. После двух десятилетий соли на подъёмнике проверьте задний подрамник и пороги. До осмотра подтвердите шильдик мотора. У M54 330i и M47 320d разные типичные ремонты.",
    ),
    good: loc("Known engines, cheap parts, many independent workshops.", "Znane silniki, tanie części, dużo warsztatów niezależnych.", "Известные моторы, дешёвые запчасти, много независимых сервисов."),
    bad: loc("Age rust and cooling plastics. Not an E90 and not an N47 timing chain.", "Rdza wieku i plastik chłodzenia. To nie E90 i nie łańcuch N47.", "Возрастная ржавчина и пластик охлаждения. Не E90 и не цепь N47."),
  },
  f30: {
    summary: loc(
      "F30 is the 3 Series sedan from 2012–2019. It is not a late E90. Petrol: early N20 timing chain, later B48. Diesel: N47 chain, then B47 EGR — two different 320d engines. Open the engine row before inspection.",
      "F30 to sedan serii 3 z lat 2012–2019. To nie późne E90. Benzyna: wczesny łańcuch N20, potem B48. Diesel: łańcuch N47, potem EGR B47 — dwa różne silniki 320d. Przed oględzinami otwórz wiersz silnika.",
      "F30 — седан 3 серии 2012–2019. Это не поздний E90. Бензин: ранняя цепь N20, затем B48. Дизель: цепь N47, затем EGR B47 — два разных мотора 320d. До осмотра откройте строку мотора.",
    ),
    good: loc("Later B48 and B47 years have lower typical risk.", "Późniejsze lata B48 i B47 mają niższe typowe ryzyko.", "Поздние годы B48 и B47 имеют меньший типичный риск."),
    bad: loc("Early N20 and N47 320d still have expensive typical repairs.", "Wczesny N20 i 320d N47 nadal mają drogie typowe naprawy.", "Ранний N20 и 320d N47 по‑прежнему имеют дорогие типичные ремонты."),
  },
  f31: {
    summary: loc(
      "F31 is the F30 Touring. Same engines as the sedan. More rust: tailgate, roof rails, spare-wheel well. Same N20 and N47 risks.",
      "F31 to Touring F30. Te same silniki co sedan. Więcej rdzy: klapa, relingi, wnęka koła zapasowego. Te same ryzyka N20 i N47.",
      "F31 — универсал F30. Те же моторы, что у седана. Больше ржавчины: крышка, рейлинги, ниша запаски. Те же риски N20 и N47.",
    ),
    good: loc("Same scored engines as F30, with a larger boot.", "Te same silniki co F30, z większym bagażnikiem.", "Те же моторы, что F30, с большим багажником."),
    bad: loc("More rust than the sedan. Same N20 and N47 risks.", "Więcej rdzy niż sedan. Te same N20 i N47.", "Больше ржавчины, чем у седана. Те же N20 и N47."),
  },
  e60: {
    summary: loc(
      "E60 is the fifth-generation 5 Series sedan (2003–2010). Typical engines: M57 530d, N47 520d, N52 530i, N62 V8. It is not an E39 and not an F10. Electronics (iDrive) and rust are common reasons listings are cheap. Read the engine row; the 5 Series badge does not name the engine.",
      "E60 to sedan serii 5 V generacji (2003–2010). Typowe silniki: M57 530d, N47 520d, N52 530i, V8 N62. To nie E39 i nie F10. Elektronika (iDrive) i rdza to częste powody niskich cen. Czytaj wiersz silnika; znaczek serii 5 nie nazywa silnika.",
      "E60 — седан пятого поколения 5 серии (2003–2010). Типичные моторы: M57 530d, N47 520d, N52 530i, V8 N62. Это не E39 и не F10. Электрика (iDrive) и ржавчина — частые причины низкой цены. Читайте строку мотора; шильдик 5 серии не указывает мотор.",
    ),
    good: loc("M57 530d and N52 530i are the simpler engines if the body is dry.", "M57 530d i N52 530i to prostsze silniki, gdy nadwozie jest suche.", "M57 530d и N52 530i — более простые моторы, если кузов сухой."),
    bad: loc("iDrive, rust, N47 520d, N62 V8. A low price often matches the repair list.", "iDrive, rdza, 520d N47, V8 N62. Niska cena często odpowiada liście napraw.", "iDrive, ржавчина, 520d N47, V8 N62. Низкая цена часто соответствует списку ремонтов."),
  },
  e61: {
    summary: loc(
      "E61 is the E60 Touring (2004–2010). Same engines as the sedan. Extra rust in the load area and tailgate. Self-levelling rear suspension fails on high-mileage examples. Inspect the wagon body before the engine. N47 520d is still a chain four-cylinder.",
      "E61 to Touring E60 (2004–2010). Te same silniki co sedan. Więcej rdzy w bagażniku i na klapie. Tylne poziomowanie psuje się przy wysokim przebiegu. Najpierw oglądaj nadwozie kombi, potem silnik. 520d N47 nadal jest czterocylindrowym dieslem z łańcuchem.",
      "E61 — универсал E60 (2004–2010). Те же моторы, что у седана. Больше ржавчины в багажнике и на крышке. Задняя система уровня ломается при большом пробеге. Сначала осматривайте кузов универсала, затем мотор. 520d N47 по‑прежнему четырёхцилиндровый дизель с цепью.",
    ),
    good: loc("Same engines as E60, with a larger boot.", "Te same silniki co E60, z większym bagażnikiem.", "Те же моторы, что E60, с большим багажником."),
    bad: loc("More rust than the sedan, plus self-levelling and E60 electronics.", "Więcej rdzy niż sedan, plus poziomowanie i elektronika E60.", "Больше ржавчины, чем у седана, плюс система уровня и электрика E60."),
  },
  e39: {
    summary: loc(
      "E39 is the fourth-generation 5 Series (1995–2004). Typical repairs: cooling plastics, expansion tank, M54/M52 petrol, M57 530d. No iDrive and no N47. After 20–30 years, rust and neglected cooling cost more than most engine jobs. Parts are widely available. Inspect on a lift; a clean listing with original swirl flaps and a cracked tank is not a low-risk car.",
      "E39 to seria 5 IV generacji (1995–2004). Typowe naprawy: plastik chłodzenia, zbiornik wyrównawczy, benzyna M54/M52, 530d M57. Brak iDrive i N47. Po 20–30 latach rdza i zaniedbane chłodzenie kosztują więcej niż większość napraw silnika. Części są łatwo dostępne. Oglądaj na podnośniku; czyste ogłoszenie z oryginalnymi klapami i pękniętym zbiornikiem to nie niskie ryzyko.",
      "E39 — четвёртая 5 серия (1995–2004). Типичные ремонты: пластик охлаждения, расширительный бачок, бензин M54/M52, 530d M57. Нет iDrive и нет N47. Через 20–30 лет ржавчина и заброшенное охлаждение стоят дороже большинства работ по мотору. Запчасти широко доступны. Осматривайте на подъёмнике; чистое объявление с родными заслонками и треснувшим бачком — не низкий риск.",
    ),
    good: loc("Simple engines, parts and specialists are easy to find.", "Proste silniki, części i specjaliści są łatwo dostępni.", "Простые моторы, запчасти и специалисты находятся легко."),
    bad: loc("Age rust and cooling plastics. Forum reputation is not a score.", "Rdza wieku i plastik chłodzenia. Opinia z forum to nie ocena.", "Возрастная ржавчина и пластик охлаждения. Репутация на форуме — не оценка."),
  },
  f10: {
    summary: loc(
      "F10 is the sixth-generation 5 Series sedan (2010–2017). N47 520d has the same rear timing chain as the E90 320d. N57 530d is the six-cylinder diesel. Early N20 520i has a timing-chain risk. N55 535i is the petrol six. F11 Touring uses the same table. It is not an E60 and not a G30. Open the engine row, then the service history.",
      "F10 to sedan serii 5 VI generacji (2010–2017). 520d N47 ma ten sam łańcuch z tyłu co 320d E90. N57 530d to dieslowska szóstka. Wczesny N20 520i ma ryzyko łańcucha rozrządu. N55 535i to benzynowa szóstka. F11 Touring korzysta z tej samej tabeli. To nie E60 i nie G30. Otwórz wiersz silnika, potem historię serwisową.",
      "F10 — седан шестого поколения 5 серии (2010–2017). У 520d N47 та же задняя цепь ГРМ, что у 320d E90. N57 530d — шестицилиндровый дизель. У раннего N20 520i есть риск цепи ГРМ. N55 535i — бензиновая шестёрка. F11 Touring использует ту же таблицу. Это не E60 и не G30. Откройте строку мотора, затем сервисную историю.",
    ),
    good: loc("N57 530d and N55 535i have lower typical risk than N47 520d.", "N57 530d i N55 535i mają niższe typowe ryzyko niż 520d N47.", "N57 530d и N55 535i имеют меньший типичный риск, чем 520d N47."),
    bad: loc("N47 520d and early N20. A 5 Series badge does not remove the chain.", "520d N47 i wczesny N20. Znaczek piątki nie usuwa łańcucha.", "520d N47 и ранний N20. Шильдик пятёрки не убирает цепь."),
  },
  f11: {
    summary: loc(
      "F11 is the F10 Touring (2010–2017). Same engines as the sedan. Higher mileage and more salt in the load bay are typical in Poland. N47 520d is still N47. Inspect the wagon body and the engine separately.",
      "F11 to Touring F10 (2010–2017). Te same silniki co sedan. W Polsce typowe są wyższe przebiegi i więcej soli w bagażniku. 520d N47 nadal jest N47. Oglądaj nadwozie kombi i silnik osobno.",
      "F11 — универсал F10 (2010–2017). Те же моторы, что у седана. В Польше типичны больший пробег и больше соли в багажнике. 520d N47 по‑прежнему N47. Осматривайте кузов универсала и мотор отдельно.",
    ),
    good: loc("Same scored engines as F10, with a larger boot.", "Te same ocenione silniki co F10, z większym bagażnikiem.", "Те же оценённые моторы, что F10, с большим багажником."),
    bad: loc("More rust than the sedan, plus the same N47 and N20 engines.", "Więcej rdzy niż sedan plus te same silniki N47 i N20.", "Больше ржавчины, чем у седана, плюс те же моторы N47 и N20."),
  },
  e87: {
    summary: loc(
      "E87 is the first 1 Series hatchback (2004–2011), rear-wheel drive. N47 120d uses the same rear timing chain as the E90 320d, in a smaller body that rusts more. M47 118d has swirl flaps, not that chain. N52 130i is the simpler petrol. N46 118i wears timing guides. E81 three-door uses the same table. A 1 Series badge does not change N47.",
      "E87 to pierwszy hatch serii 1 (2004–2011), napęd na tył. 120d N47 ma ten sam łańcuch z tyłu co 320d E90, w mniejszym nadwoziu, które bardziej rdzewieje. 118d M47 ma klapy wirowe, nie ten łańcuch. N52 130i to prostsza benzyna. N46 118i zużywa ślizgi rozrządu. E81 trzydrzwiowy korzysta z tej samej tabeli. Znaczek serii 1 nie zmienia N47.",
      "E87 — первый хэтчбек 1 серии (2004–2011), задний привод. У 120d N47 та же задняя цепь ГРМ, что у 320d E90, в меньшем кузове, который ржавеет сильнее. У 118d M47 вихревые заслонки, не эта цепь. N52 130i — более простой бензин. N46 118i изнашивает направляющие ГРМ. Трёхдверный E81 использует ту же таблицу. Шильдик 1 серии не меняет N47.",
    ),
    good: loc("Rear-drive hatch, N52 130i, cheap parts, known specialists.", "Hatch na tył, N52 130i, tanie części, znani specjaliści.", "Заднеприводный хэтчбек, N52 130i, дешёвые запчасти, знакомые специалисты."),
    bad: loc("N47 120d, rust, and worn interiors after Polish winters.", "120d N47, rdza i zużyte wnętrza po polskich zimach.", "120d N47, ржавчина и изношенный салон после польских зим."),
  },
  e81: {
    summary: loc(
      "E81 is the three-door E87 (2007–2012). Engines match the five-door. Fewer listings, same N47 120d. It is a body, not a different engine. Rust and the timing chain do not change with two fewer doors.",
      "E81 to trzydrzwiowe E87 (2007–2012). Silniki jak w pięciodrzwiowym. Mniej ogłoszeń, ten sam 120d N47. To nadwozie, nie inny silnik. Rdza i łańcuch rozrządu nie zmieniają się przez dwoje drzwi mniej.",
      "E81 — трёхдверный E87 (2007–2012). Моторы как у пятидверки. Меньше объявлений, тот же 120d N47. Это кузов, не другой мотор. Ржавчина и цепь ГРМ не меняются из‑за двух дверей меньше.",
    ),
    good: loc("Same scored engines as E87.", "Te same ocenione silniki co E87.", "Те же оценённые моторы, что E87."),
    bad: loc("Fewer examples, same N47, same rust.", "Mniej egzemplarzy, ten sam N47, ta sama rdza.", "Меньше машин, тот же N47, та же ржавчина."),
  },
  e70: {
    summary: loc(
      "E70 is the second X5 (2006–2013): heavy, xDrive, expensive if neglected. M57 30d is the common diesel. N57 40d is a later chain six. N62 48i is a V8 with high repair cost. N55 35i is the petrol six. The transfer-case chain is an xDrive repair, not diesel versus petrol. It is not an E53 and not an F15. Inspect on a lift and check the transfer case in tight turns.",
      "E70 to drugi X5 (2006–2013): ciężki, xDrive, drogi gdy zaniedbany. M57 30d to częsty diesel. N57 40d to późniejsza szóstka z łańcuchem. N62 48i to V8 z wysokim kosztem napraw. N55 35i to benzynowa szóstka. Łańcuch skrzynki rozdzielczej to naprawa xDrive, nie diesel kontra benzyna. To nie E53 i nie F15. Oglądaj na podnośniku i sprawdź skrzynkę na ciasnych manewrach.",
      "E70 — второй X5 (2006–2013): тяжёлый, xDrive, дорогой при забросе. M57 30d — частый дизель. N57 40d — поздняя шестёрка с цепью. N62 48i — V8 с высокой стоимостью ремонта. N55 35i — бензиновая шестёрка. Цепь раздаточной коробки — ремонт xDrive, не дизель против бензина. Это не E53 и не F15. Осматривайте на подъёмнике и проверьте раздатку на крутых манёврах.",
    ),
    good: loc("M57 30d and N55 35i if the transfer case is quiet.", "M57 30d i N55 35i, gdy skrzynka rozdzielcza jest cicha.", "M57 30d и N55 35i, если раздатка тихая."),
    bad: loc("Transfer case, N62, underside rust, high running costs.", "Skrzynka rozdzielcza, N62, rdza spodu, wysokie koszty eksploatacji.", "Раздатка, N62, ржавчина снизу, высокие расходы на содержание."),
  },
  e53: {
    summary: loc(
      "E53 is the first X5 (1999–2006). Typical engines: M54 3.0i, M62 4.4i, M57 3.0d. Typical repairs: cooling, rust, transfer case — not N47. It is old and cheap on OTOMOTO; a rusty body is expensive. Independent workshops still know it. Treat it as a 20-year-old SUV that often towed, not as a small crossover.",
      "E53 to pierwszy X5 (1999–2006). Typowe silniki: M54 3.0i, M62 4.4i, M57 3.0d. Typowe naprawy: chłodzenie, rdza, skrzynka rozdzielcza — nie N47. Stary i tani na OTOMOTO; zardzewiałe nadwozie jest drogie. Warsztaty niezależne nadal go znają. Traktuj jak 20-letniego SUV-a, który często ciągnął przyczepę, nie jak mały crossover.",
      "E53 — первый X5 (1999–2006). Типичные моторы: M54 3.0i, M62 4.4i, M57 3.0d. Типичные ремонты: охлаждение, ржавчина, раздатка — не N47. Старый и дешёвый на OTOMOTO; ржавый кузов дорогой. Независимые сервисы его ещё знают. Рассматривайте как 20-летний SUV, который часто тягал прицеп, а не как маленький кроссовер.",
    ),
    good: loc("Simple petrol six, known diesel six, parts still exist.", "Prosta benzynowa szóstka, znana dieslowska, części nadal są.", "Простая бензиновая шестёрка, известный дизель, запчасти ещё есть."),
    bad: loc("Age rust, cooling, transfer case. A cheap X5 is often a project.", "Rdza wieku, chłodzenie, skrzynka rozdzielcza. Tanie X5 to często projekt.", "Возрастная ржавчина, охлаждение, раздатка. Дешёвый X5 часто проект."),
  },
  f20: {
    summary: loc(
      "F20 is the second 1 Series hatchback (2011–2019), still rear-wheel drive. N13 116i is not a cheap, simple petrol. N47 118d is the chain diesel again. Later B47 120d has EGR and intake carbon, not N47. It is not an E87 and not the front-drive F40. Open the engine row before the listing photo.",
      "F20 to drugi hatch serii 1 (2011–2019), nadal napęd na tył. N13 116i to nie tania, prosta benzyna. 118d N47 to znowu diesel z łańcuchem. Późniejszy 120d B47 ma EGR i nagar w dolocie, nie N47. To nie E87 i nie przednionapędowe F40. Otwórz wiersz silnika przed zdjęciem z ogłoszenia.",
      "F20 — второй хэтчбек 1 серии (2011–2019), всё ещё задний привод. N13 116i — не дешёвый простой бензин. 118d N47 — снова дизель с цепью. Поздний 120d B47 имеет EGR и нагар во впуске, не N47. Это не E87 и не переднеприводный F40. Откройте строку мотора до фото из объявления.",
    ),
    good: loc("Rear-drive hatch; later B47 years have lower typical chain risk.", "Hatch na tył; późniejsze B47 mają niższe typowe ryzyko łańcucha.", "Заднеприводный хэтчбек; поздние B47 имеют меньший типичный риск цепи."),
    bad: loc("N13 petrol and N47 118d. Small does not mean cheap to keep.", "Benzyna N13 i 118d N47. Małe nie znaczy tanie w utrzymaniu.", "Бензин N13 и 118d N47. Маленький не значит дешёвый в содержании."),
  },
  e83: {
    summary: loc(
      "E83 is the first X3 (2003–2010): compact SAV, M54 petrol, M47 2.0d, M57 3.0d. Typical repairs: transfer case, rust, cooling — not an N47 chain. Polish examples often towed and sat in salt. Prefer a 3.0d with a quiet transfer case and dry sills. Inspect on a lift and check the transfer case in tight turns.",
      "E83 to pierwsze X3 (2003–2010): kompaktowy SAV, benzyna M54, 2.0d M47, 3.0d M57. Typowe naprawy: skrzynka rozdzielcza, rdza, chłodzenie — nie łańcuch N47. Polskie egzemplarze często ciągnęły przyczepę i stały w soli. Lepiej 3.0d z cichą skrzynką i suchymi progami. Oglądaj na podnośniku i sprawdź skrzynkę na ciasnych manewrach.",
      "E83 — первый X3 (2003–2010): компактный SAV, бензин M54, 2.0d M47, 3.0d M57. Типичные ремонты: раздатка, ржавчина, охлаждение — не цепь N47. Польские экземпляры часто тягали прицеп и стояли в соли. Лучше 3.0d с тихой раздаткой и сухими порогами. Осматривайте на подъёмнике и проверьте раздатку на крутых манёврах.",
    ),
    good: loc("M54 and M57 are known; size that is easy to park in Poland.", "M54 i M57 są znane; rozmiar łatwy do parkowania w Polsce.", "M54 и M57 известны; размер, который в Польше легко парковать."),
    bad: loc("Transfer case, rust, age. Not a new crossover.", "Skrzynka rozdzielcza, rdza, wiek. To nie nowy crossover.", "Раздатка, ржавчина, возраст. Не новый кроссовер."),
  },
};

const BODY_TAIL: Record<string, Localized> = {
  e90: loc(
    "As a sedan it is the easiest E9x to inspect and to resell on OTOMOTO.",
    "Jako sedan jest najłatwiejszym E9x do oględzin i odsprzedaży na OTOMOTO.",
    "Как седан это самый простой E9x для осмотра и перепродажи на OTOMOTO.",
  ),
  e91: loc(
    "As a Touring, inspect on a lift: tailgate, rails, and subframe rust after Polish salt.",
    "Jako Touring oglądaj na podnośniku: klapa, relingi i belka po polskiej soli.",
    "Как универсал осматривайте на подъёмнике: крышка, рейлинги и подрамник после польской соли.",
  ),
  e92: loc(
    "As a coupe, frameless doors and listings change — the water pump and subframe do not.",
    "Jako coupe zmieniają się drzwi i ogłoszenia — nie pompa wody ani belka.",
    "Как купе меняются двери и объявления — не помпа и не подрамник.",
  ),
  e93: loc(
    "As a convertible, cycle the roof and check drains; the engine is the same, leak repairs are extra.",
    "Jako cabrio zrób cykl dachu i sprawdź odpływy; silnik ten sam, naprawy nieszczelności są dodatkowe.",
    "Как кабриолет прогоните крышу и проверьте сливы; мотор тот же, ремонт течей — отдельно.",
  ),
  f31: loc(
    "As a Touring, inspect on a lift: tailgate, rails, and salt in the load bay.",
    "Jako Touring oglądaj na podnośniku: klapa, relingi i sól w bagażniku.",
    "Как универсал осматривайте на подъёмнике: крышка, рейлинги и соль в багажнике.",
  ),
  e61: loc(
    "As a Touring, check the load area and self-levelling before the engine row.",
    "Jako Touring sprawdź bagażnik i poziomowanie przed wierszem silnika.",
    "Как универсал проверьте багажник и систему уровня до строки мотора.",
  ),
  f11: loc(
    "As a Touring: more mileage and more salt — same engines as the F10 sedan.",
    "Jako Touring: więcej kilometrów i soli — te same silniki co sedan F10.",
    "Как универсал: больше пробега и соли — те же моторы, что седан F10.",
  ),
  e81: loc(
    "As a three-door: fewer listings — same N47 and rust as the five-door.",
    "Jako trzydrzwiowe: mniej ogłoszeń — ten sam N47 i rdza co pięciodrzwiowe.",
    "Как трёхдверка: меньше объявлений — тот же N47 и ржавчина, что у пятидверки.",
  ),
};

const ENGINES: Record<string, Band[]> = {
  "318i-N46": [
    band(
      2005,
      2007,
      "The {year} {code} {model} with the {engine} is the early four-cylinder petrol, not the later N43. Timing-chain guides wear; the repair is expensive, not an N47 engine replacement. Do not mix it with a 320i N43 because both badges can say 318i.",
      "{year} {code} {model} z {engine} to wczesny benzynowy R4, nie późniejszy N43. Ślizgi łańcucha się zużywają; naprawa jest droga, nie wymiana silnika jak przy N47. Nie mieszaj z 320i N43 tylko dlatego, że na klapie też jest 318i.",
      "Simple naturally aspirated four. Guides are a known job.",
      "Prosty wolnossący R4. Ślizgi to znana naprawa.",
      "Not an N52. Guides, oil consumption, and early E90 rust.",
      "To nie N52. Ślizgi, zużycie oleju i rdza wczesnego E90.",
      "{year} {code} {model} с {engine} — ранний четырёхцилиндровый бензин, не поздний N43. Направляющие цепи ГРМ изнашиваются; ремонт дорогой, не замена мотора как у N47. Не путайте с 320i N43 только потому, что на крышке тоже 318i.",
      "Простой атмосферный R4. Направляющие — известный ремонт.",
      "Не N52. Направляющие, расход масла и ржавчина раннего E90.",
    ),
  ],
  "318i-N43": [
    band(
      2007,
      2011,
      "The {year} {code} {model} with the {engine} is a direct-injection four-cylinder, not the earlier N46. Injectors and the NOx sensor are typical expensive repairs. Parts cost more than on N52. Confirm N43 on the plate.",
      "{year} {code} {model} z {engine} to R4 z wtryskiem bezpośrednim, nie wcześniejszy N46. Wtryski i czujnik NOx to typowe drogie naprawy. Części droższe niż przy N52. Potwierdź N43 na tabliczce.",
      "Later 318i. More torque than N46 on paper.",
      "Późniejszy 318i. Na papierze więcej momentu niż N46.",
      "Direct-injection injectors and NOx. Not the cheaper N46 petrol.",
      "Wtryski DI i NOx. To nie tańsza benzyna N46.",
      "{year} {code} {model} с {engine} — четырёхцилиндровый мотор с непосредственным впрыском, не ранний N46. Форсунки и датчик NOx — типичные дорогие ремонты. Запчасти дороже, чем у N52. Подтвердите N43 на шильдике.",
      "Поздний 318i. На бумаге больше момента, чем у N46.",
      "Форсунки непосредственного впрыска и NOx. Не более дешёвый бензин N46.",
    ),
  ],
  "320i-N46": [
    band(
      2005,
      2007,
      "The {year} {code} {model} with the {engine} is the same N46 family as 318i, with a 320i badge. Timing-chain guides are the typical repair, not a high-pressure pump. It will not feel like a 330i. Do not pay N52 money for an N46 320i.",
      "{year} {code} {model} z {engine} to ta sama rodzina N46 co 318i, ze znaczkiem 320i. Ślizgi łańcucha to typowa naprawa, nie pompa wysokiego ciśnienia. Nie pojedzie jak 330i. Nie płać ceny N52 za 320i N46.",
      "Known engine, easy for independent workshops, 320i badge is easy to sell.",
      "Znany silnik, łatwy dla niezależnych, znaczek 320i łatwo sprzedać.",
      "Guides and typical E90 rust. It is not a six-cylinder.",
      "Ślizgi i typowa rdza E90. To nie szóstka.",
      "{year} {code} {model} с {engine} — то же семейство N46, что 318i, с шильдиком 320i. Типичный ремонт — направляющие цепи, не ТНВД. Это не 330i. Не платите цену N52 за 320i N46.",
      "Известный мотор, удобен независимым сервисам, шильдик 320i легко продать.",
      "Направляющие и типичная ржавчина E90. Это не шестицилиндровый.",
    ),
  ],
  "320i-N43": [
    band(
      2007,
      2011,
      "The {year} {code} {model} with the {engine} replaced N46 with direct injection. Injectors and NOx are typical repairs. Confirm N43 on the VIN sticker; the year alone is not enough.",
      "{year} {code} {model} z {engine} zastąpił N46 wtryskiem bezpośrednim. Wtryski i NOx to typowe naprawy. Potwierdź N43 na naklejce VIN; sam rok nie wystarczy.",
      "The later 320i petrol if you want that badge.",
      "Późniejszy 320i benzyna, jeśli chcesz ten znaczek.",
      "Direct-injection four-cylinder bills. N46 was the cheaper 320i to run.",
      "Rachunki R4 z wtryskiem bezpośrednim. Tańszy w utrzymaniu 320i to był N46.",
      "{year} {code} {model} с {engine} заменил N46 непосредственным впрыском. Форсунки и NOx — типичные ремонты. Подтвердите N43 на наклейке VIN; одного года недостаточно.",
      "Поздний бензиновый 320i, если нужен этот шильдик.",
      "Счета четырёхцилиндрового мотора с непосредственным впрыском. Более дешёвый в содержании 320i был N46.",
    ),
  ],
  "325i-N52": [
    band(
      2005,
      2007,
      "The {year} {code} {model} with the {engine} is the smaller N52 six-cylinder. Typical repair: electric water pump and thermostat, often with little warning. No high-pressure pump and no N47 chain. Subframe rust and CAS still apply. The engine family is the same idea as 330i N52.",
      "{year} {code} {model} z {engine} to mniejsza szóstka N52. Typowa naprawa: elektryczna pompa wody i termostat, często bez wcześniejszego objawu. Brak pompy wysokiego ciśnienia i łańcucha N47. Rdza belki i CAS nadal obowiązują. Rodzina silnika jest ta sama co 330i N52.",
      "Naturally aspirated inline-six. Cooling job is known and parts are common.",
      "Wolnossąca R6. Naprawa chłodzenia jest znana, części łatwe.",
      "Pump can fail without warning. Rust and ELV like every E90.",
      "Pompa może paść bez ostrzeżenia. Rdza i ELV jak w każdym E90.",
      "{year} {code} {model} с {engine} — меньшая шестицилиндровая N52. Типичный ремонт: электрическая помпа и термостат, часто почти без предупреждения. Нет ТНВД и нет цепи N47. Ржавчина подрамника и CAS всё равно. Семейство мотора то же, что у 330i N52.",
      "Атмосферная рядная шестёрка. Ремонт охлаждения известен, запчасти обычные.",
      "Помпа может отказать без предупреждения. Ржавчина и ELV как у любого E90.",
    ),
  ],
  "325i-N53": [
    band(
      2007,
      2011,
      "The {year} {code} {model} with the {engine} is not N52. Europe used direct injection on this naturally aspirated six; injectors and the high-pressure pump are typical expensive repairs. US cars kept N52 longer — do not copy advice from forums that never had N53. Check mixture faults and service history.",
      "{year} {code} {model} z {engine} to nie N52. Europa dostała wtrysk bezpośredni na tej wolnossącej szóstce; wtryski i pompa wysokiego ciśnienia to typowe drogie naprawy. USA trzymało N52 dłużej — nie kopiuj rad z forów, które N53 nie miały. Sprawdź błędy mieszanki i historię serwisową.",
      "Still a six-cylinder. More torque than N46 if it is in good condition.",
      "Nadal szóstka. Więcej momentu niż N46, gdy jest sprawna.",
      "N53 injectors and high-pressure pump. This is not the N52 325i.",
      "Wtryski i pompa N53. To nie 325i N52.",
      "{year} {code} {model} с {engine} — это не N52. В Европе на этой атмосферной шестёрке был непосредственный впрыск; форсунки и ТНВД — типичные дорогие ремонты. В США дольше ставили N52 — не копируйте советы с форумов, где N53 не было. Проверьте ошибки смеси и сервисную историю.",
      "По-прежнему шестицилиндровый. Больше момента, чем у N46, если мотор в порядке.",
      "Форсунки N53 и ТНВД. Это не 325i N52.",
    ),
  ],
  "330i-N52": [
    band(
      2005,
      2007,
      "The {year} {code} {model} with the {engine} is a naturally aspirated inline-six without a high-pressure pump. Typical repair: electric water pump and thermostat — a cooling job, not engine replacement. Parts and independent labour in Poland are easy. Subframe rust and CAS still apply. Do not confuse it with a later 330i N53.",
      "{year} {code} {model} z {engine} to wolnossąca R6 bez pompy wysokiego ciśnienia. Typowa naprawa: elektryczna pompa wody i termostat — chłodzenie, nie wymiana silnika. Części i niezależni w Polsce są łatwo dostępni. Rdza belki i CAS nadal obowiązują. Nie myl z późniejszym 330i N53.",
      "The simpler six. Cooling is a known job, not engine-out.",
      "Prostsza szóstka. Chłodzenie to znana naprawa, nie wyjęcie silnika.",
      "Pump can fail without warning; rust and ELV on every E90.",
      "Pompa może paść bez ostrzeżenia; rdza i ELV na każdym E90.",
      "{year} {code} {model} с {engine} — атмосферная рядная шестёрка без ТНВД. Типичный ремонт: электрическая помпа и термостат — охлаждение, не замена мотора. Запчасти и независимые сервисы в Польше найти легко. Ржавчина подрамника и CAS всё равно. Не путайте с поздней 330i N53.",
      "Более простая шестёрка. Охлаждение — известный ремонт, не снятие мотора.",
      "Помпа может отказать без предупреждения; ржавчина и ELV на любом E90.",
    ),
  ],
  "330i-N53": [
    band(
      2007,
      2011,
      "The {year} {code} {model} with the {engine} uses the same 330i badge as N52 and is a different engine. Direct injection on this six fails more expensively than a water pump. Forums that say “buy a 330i” often mean N52. Confirm N53 on the engine code. Budget injectors and the high-pressure pump.",
      "{year} {code} {model} z {engine} nosi ten sam znaczek 330i co N52 i jest innym silnikiem. Wtrysk bezpośredni na tej szóstce psuje się drożej niż pompa wody. Fora „bierz 330i” często mają na myśli N52. Potwierdź N53 w kodzie silnika. Zaplanuj budżet na wtryski i pompę wysokiego ciśnienia.",
      "The 330i badge with later injection.",
      "Znaczek 330i z nowszym wtryskiem.",
      "N53 is not N52. Injectors and the high-pressure pump are typical costs.",
      "N53 to nie N52. Wtryski i pompa wysokiego ciśnienia to typowe koszty.",
      "{year} {code} {model} с {engine} носит тот же шильдик 330i, что N52, и это другой мотор. Непосредственный впрыск на этой шестёрке ломается дороже помпы. Форумы «берите 330i» часто имеют в виду N52. Подтвердите N53 в коде мотора. Заложите бюджет на форсунки и ТНВД.",
      "Шильдик 330i с более новым впрыском.",
      "N53 — не N52. Форсунки и ТНВД — типичные расходы.",
    ),
  ],
  "335i-N54": [
    band(
      2006,
      2010,
      "The {year} {code} {model} with the {engine} is the twin-turbo petrol six. Typical repairs: high-pressure pump and piezo injectors; hard starts and limp mode are common signs. Wastegates and cooling add cost. Do not mix it with N55 335i — different pump, different list.",
      "{year} {code} {model} z {engine} to benzynowa szóstka biturbo. Typowe naprawy: pompa wysokiego ciśnienia i wtryski piezo; trudny rozruch i tryb awaryjny to częste objawy. Wastegate’y i chłodzenie dodają kosztu. Nie mieszaj z 335i N55 — inna pompa, inna lista.",
      "The fast E90. Parts are common; specialists know the jobs.",
      "Szybkie E90. Części są; specjaliści znają naprawy.",
      "High-pressure pump, injectors, turbos. This is not an N52 with a 335i badge.",
      "Pompa wysokiego ciśnienia, wtryski, turbiny. To nie N52 ze znaczkiem 335i.",
      "{year} {code} {model} с {engine} — бензиновая битурбо-шестёрка. Типичные ремонты: ТНВД и пьезофорсунки; трудный запуск и аварийный режим — частые признаки. Вестгейты и охлаждение добавляют стоимость. Не путайте с 335i N55 — другой насос, другой список.",
      "Быстрый E90. Запчасти обычные; специалисты знают работы.",
      "ТНВД, форсунки, турбины. Это не N52 с шильдиком 335i.",
    ),
  ],
  "335i-N55": [
    band(
      2010,
      2012,
      "The {year} {code} {model} with the {engine} is the later single-turbo 335i. Lower typical cost than N54, not an N52. Water pump and thermostat remain typical. Confirm N55, not N54, before you copy a repair list.",
      "{year} {code} {model} z {engine} to późniejsze 335i z jedną turbiną. Niższy typowy koszt niż N54, to nie N52. Pompa wody i termostat zostają typowe. Potwierdź N55, nie N54, zanim skopiujesz listę napraw.",
      "Less high-pressure-pump cost than N54. Still a six-cylinder turbo.",
      "Mniej kosztów pompy wysokiego ciśnienia niż N54. Nadal turbosześć.",
      "Not cheap, not N52. Cooling and turbo still exist.",
      "Nie tanio, nie N52. Chłodzenie i turbo nadal są.",
      "{year} {code} {model} с {engine} — поздняя 335i с одной турбиной. Типичные расходы ниже, чем у N54, это не N52. Помпа и термостат по‑прежнему типичны. Подтвердите N55, не N54, прежде чем копировать список ремонтов.",
      "Меньше расходов на ТНВД, чем у N54. По-прежнему турбошестёрка.",
      "Не дёшево, не N52. Охлаждение и турбина всё равно есть.",
    ),
  ],
  "318d-M47": [
    band(
      2005,
      2007,
      "The {year} {code} {model} with the {engine} is the early four-cylinder diesel before N47. Swirl flaps can break into the intake — that is this repair, not a timing-chain engine replacement. Do not assume every 318d is N47.",
      "{year} {code} {model} z {engine} to wczesny dieslowski R4 przed N47. Klapy wirowe potrafią wpaść do dolotu — to ta naprawa, nie wymiana silnika przez łańcuch. Nie zakładaj, że każdy 318d to N47.",
      "Pre-N47 diesel. Flaps are a job, rarely engine-out.",
      "Diesel przed N47. Klapy to naprawa, rzadko wyjęcie silnika.",
      "Swirl flaps and E90 rust. Later 318d N47 is a different risk.",
      "Klapy i rdza E90. Późniejszy 318d N47 to inne ryzyko.",
      "{year} {code} {model} с {engine} — ранний четырёхцилиндровый дизель до N47. Вихревые заслонки могут попасть во впуск — это этот ремонт, не замена мотора из‑за цепи. Не считайте, что каждый 318d — N47.",
      "Дизель до N47. Заслонки — ремонт, редко снятие мотора.",
      "Вихревые заслонки и ржавчина E90. Поздний 318d N47 — другой риск.",
    ),
  ],
  "318d-N47": [
    band(
      2007,
      2010,
      "The {year} {code} {model} with the {engine} is the early N47 chain diesel. The chain sits at the gearbox end; a jump often means replacing the engine. This is not all E90 diesels. Early years and high mileage raise the risk. Ask about chain work before buying.",
      "{year} {code} {model} z {engine} to wczesny diesel N47 z łańcuchem. Łańcuch siedzi od strony skrzyni; przeskok często oznacza wymianę silnika. To nie wszystkie diesle E90. Wczesne lata i wysoki przebieg podnoszą ryzyko. Przed zakupem pytaj o naprawę łańcucha.",
      "Cheap to buy, low fuel use, parts are everywhere.",
      "Tanio kupić, mało pali, części wszędzie.",
      "Rear chain. Early N47 can end in engine replacement.",
      "Łańcuch z tyłu. Wczesny N47 może skończyć się wymianą silnika.",
      "{year} {code} {model} с {engine} — ранний дизель N47 с цепью. Цепь со стороны коробки; перескок часто означает замену мотора. Это не все дизели E90. Ранние годы и большой пробег повышают риск. Перед покупкой спросите про работу по цепи.",
      "Дёшево купить, мало топлива, запчасти везде.",
      "Задняя цепь. Ранний N47 может закончиться заменой мотора.",
    ),
    band(
      2011,
      2012,
      "The {year} {code} {model} with the {engine} is still N47 — later, slightly lower typical risk, not risk-free. The chain remains at the back of the engine. High mileage in Poland is common. Do not treat a 2011 318d as an M47. Ask for a chain inspection.",
      "{year} {code} {model} z {engine} to nadal N47 — późniejszy, trochę niższe typowe ryzyko, nie bez ryzyka. Łańcuch nadal z tyłu silnika. Wysoki przebieg w Polsce jest częsty. Nie traktuj 318d z 2011 jak M47. Poproś o oględziny łańcucha.",
      "Later N47. Still a cheap diesel to run day to day.",
      "Późniejszy N47. Nadal tani diesel na co dzień.",
      "Still a rear chain. “Updated” is not “repaired”.",
      "Nadal łańcuch z tyłu. „Poprawiony” to nie „naprawiony”.",
      "{year} {code} {model} с {engine} — по‑прежнему N47: поздний, типичный риск чуть ниже, не без риска. Цепь по‑прежнему сзади мотора. Большой пробег в Польше обычен. Не считайте 318d 2011 года M47. Попросите осмотр цепи.",
      "Поздний N47. По-прежнему дешёвый дизель на каждый день.",
      "По-прежнему задняя цепь. «Обновлённый» — не «отремонтированный».",
    ),
  ],
  "320d-M47": [
    band(
      2005,
      2007,
      "The {year} {code} {model} with the {engine} is the 320d before N47. Swirl flaps are the typical fault, not a gearbox-end chain. Confirm M47, not N47, on the engine plate. A 2005–2007 320d is not the same engine as a 2008 320d.",
      "{year} {code} {model} z {engine} to 320d sprzed N47. Klapy wirowe to typowa usterka, nie łańcuch od skrzyni. Potwierdź M47, nie N47, na tabliczce. 320d 2005–2007 to nie ten sam silnik co 320d 2008.",
      "The 320d without the N47 chain.",
      "320d bez łańcucha N47.",
      "Flaps, EGR, rust. Later 320d N47 can mean engine replacement.",
      "Klapy, EGR, rdza. Późniejszy 320d N47 może oznaczać wymianę silnika.",
      "{year} {code} {model} с {engine} — 320d до N47. Типичная поломка — вихревые заслонки, не цепь со стороны коробки. Подтвердите M47, не N47, на шильдике. 320d 2005–2007 — не тот же мотор, что 320d 2008.",
      "320d без цепи N47.",
      "Заслонки, EGR, ржавчина. Поздний 320d N47 может означать замену мотора.",
    ),
  ],
  "320d-N47": [
    band(
      2007,
      2010,
      "The {year} {code} {model} with the {engine} is the common E90 diesel in Poland and the reason this site splits year and engine. Timing chain at the rear of the engine; snap or jump often means replacing the motor. Early N47 plus high mileage raises the risk. A low asking price is not a saving if the chain is original. This is not an M47 320d.",
      "{year} {code} {model} z {engine} to częsty diesel E90 w Polsce i powód, dla którego ten serwis dzieli rok i silnik. Łańcuch z tyłu silnika; pęknięcie albo przeskok często oznacza wymianę motoru. Wczesny N47 plus wysoki przebieg podnosi ryzyko. Niska cena nie jest oszczędnością, gdy łańcuch jest oryginalny. To nie 320d M47.",
      "Common on OTOMOTO, cheap to fuel, known specialists.",
      "Częsty na OTOMOTO, tanio pali, znani specjaliści.",
      "Rear chain on early N47. This is the higher-risk 320d.",
      "Łańcuch z tyłu na wczesnym N47. To 320d o wyższym ryzyku.",
      "{year} {code} {model} с {engine} — частый дизель E90 в Польше и причина, почему сайт делит год и мотор. Цепь сзади мотора; обрыв или перескок часто означает замену двигателя. Ранний N47 плюс большой пробег повышает риск. Низкая цена не экономия, если цепь родная. Это не 320d M47.",
      "Частый на OTOMOTO, дёшево кормить, знакомые специалисты.",
      "Задняя цепь на раннем N47. Это 320d с более высоким риском.",
    ),
    band(
      2011,
      2012,
      "The {year} {code} {model} with the {engine} is a later N47 320d — still a chain diesel, slightly lower typical risk than 2007–2010. The chain is still at the gearbox end. Mileage in Poland is still often high. Ask what was done to the chain, or price a replacement before buying.",
      "{year} {code} {model} z {engine} to późniejszy 320d N47 — nadal diesel z łańcuchem, trochę niższe typowe ryzyko niż 2007–2010. Łańcuch nadal od skrzyni. Przebiegi w Polsce nadal często wysokie. Pytaj, co zrobiono z łańcuchem, albo wycen wymianę przed zakupem.",
      "The 320d many buyers still look for, with a later year.",
      "320d, którego wielu nadal szuka, z późniejszym rokiem.",
      "Still N47. A facelift 320d is not a synonym for low risk.",
      "Nadal N47. Lift 320d to nie synonim niskiego ryzyka.",
      "{year} {code} {model} с {engine} — поздний 320d N47: по‑прежнему дизель с цепью, типичный риск чуть ниже, чем 2007–2010. Цепь по‑прежнему со стороны коробки. Пробег в Польше по‑прежнему часто большой. Спросите, что сделали с цепью, или заложите замену до покупки.",
      "320d, который многие всё ещё ищут, с более поздним годом.",
      "По-прежнему N47. Рестайлинг 320d — не синоним низкого риска.",
    ),
  ],
  "325d-M57": [
    band(
      2006,
      2010,
      "The {year} {code} {model} with the {engine} is the six-cylinder diesel with swirl flaps, not the N47 four. Flaps can break off into the intake; that is a different fault from a rear chain. Injector and swirl work still costs money. Confirm M57 — a 325d is not a 320d with a sticker.",
      "{year} {code} {model} z {engine} to dieslowska szóstka z klapami, nie czwórka N47. Klapy potrafią wpaść do dolotu; to inna usterka niż łańcuch z tyłu. Wtryski i klapy to nadal koszt. Potwierdź M57 — 325d to nie 320d z naklejką.",
      "M57 six. Stronger than 320d, without the N47 chain.",
      "Szóstka M57. Mocniejsza niż 320d, bez łańcucha N47.",
      "Swirl flaps and diesel bills. Not a cheap 320d.",
      "Klapy i dieslowskie naprawy. To nie tani 320d.",
      "{year} {code} {model} с {engine} — шестицилиндровый дизель с вихревыми заслонками, не четвёрка N47. Заслонки могут попасть во впуск; это другая поломка, не задняя цепь. Форсунки и заслонки всё равно стоят денег. Подтвердите M57 — 325d не 320d с наклейкой.",
      "Шестёрка M57. Сильнее 320d, без цепи N47.",
      "Вихревые заслонки и дизельные счета. Не дешёвый 320d.",
    ),
  ],
  "330d-M57": [
    band(
      2005,
      2008,
      "The {year} {code} {model} with the {engine} is the early 3.0 diesel six — swirl flaps, not N47. Parts are common. It uses more fuel and costs more than a 320d. Do not mix it with N57 330d; different chain, different years.",
      "{year} {code} {model} z {engine} to wczesny diesel 3.0 R6 — klapy, nie N47. Części są. Żwawiej pali i drożej niż 320d. Nie mieszaj z 330d N57; inny łańcuch, inne lata.",
      "The early 330d. Torque without the N47 chain.",
      "Wczesny 330d. Moment bez łańcucha N47.",
      "Flaps, leaks, rust. A neglected M57 is still expensive.",
      "Klapy, wycieki, rdza. Zaniedbane M57 nadal jest drogie.",
      "{year} {code} {model} с {engine} — ранний дизель 3.0 R6: заслонки, не N47. Запчасти обычные. Больше топлива и дороже 320d. Не путайте с 330d N57; другая цепь, другие годы.",
      "Ранний 330d. Момент без цепи N47.",
      "Заслонки, течи, ржавчина. Заброшенный M57 всё равно дорогой.",
    ),
  ],
  "330d-N57": [
    band(
      2008,
      2012,
      "The {year} {code} {model} with the {engine} is the later 330d. N57 is a chain diesel with lower typical risk than N47, not zero risk. Timing noise and service history matter. It is not the M57 330d from 2005. Check chain and intake, then the subframe like any E90.",
      "{year} {code} {model} z {engine} to późniejszy 330d. N57 to diesel z łańcuchem o niższym typowym ryzyku niż N47, nie zerowym. Hałas rozrządu i historia serwisowa mają znaczenie. To nie M57 330d z 2005. Sprawdź łańcuch i dolot, potem belkę jak w każdym E90.",
      "Strong 3.0, lower typical chain risk than N47 320d.",
      "Mocne 3.0, niższe typowe ryzyko łańcucha niż 320d N47.",
      "Still a chain diesel. Not the early M57 330d.",
      "Nadal diesel z łańcuchem. To nie wczesne M57 330d.",
      "{year} {code} {model} с {engine} — поздний 330d. N57 — дизель с цепью, типичный риск ниже, чем у N47, не нулевой. Шум ГРМ и сервисная история важны. Это не M57 330d 2005 года. Проверьте цепь и впуск, затем подрамник как у любого E90.",
      "Сильный 3.0, типичный риск цепи ниже, чем у 320d N47.",
      "По-прежнему дизель с цепью. Не ранний M57 330d.",
    ),
  ],
  "335d-M57": [
    band(
      2006,
      2011,
      "The {year} {code} {model} with the {engine} is the twin-turbo diesel six — swirl flaps plus more heat and more leaks. Specialists in Poland know it; parts are not rare. It is not an N47 four and not a 335i. Prefer service history over a video of acceleration.",
      "{year} {code} {model} z {engine} to biturbo dieslowska szóstka — klapy plus więcej ciepła i wycieków. Specjaliści w Polsce ją znają; części nie są rzadkie. To nie czwórka N47 i nie 335i. Historia serwisowa jest ważniejsza niż film z przyspieszenia.",
      "The fast diesel E90. M57, not N47.",
      "Szybki diesel E90. M57, nie N47.",
      "Flaps, turbos, bills. Neglect is expensive.",
      "Klapy, turbiny, rachunki. Zaniedbanie jest drogie.",
      "{year} {code} {model} с {engine} — битурбо дизельная шестёрка: заслонки плюс больше тепла и течей. Специалисты в Польше её знают; запчасти не редкость. Это не четвёрка N47 и не 335i. Сервисная история важнее ролика разгона.",
      "Быстрый дизель E90. M57, не N47.",
      "Заслонки, турбины, счета. Заброс дорогой.",
    ),
  ],
  "e46:330i-M54": [
    band(
      2000,
      2006,
      "The {year} {code} {model} with the {engine} is the E46 petrol six: cooling plastics and DISA, not an N47 chain. The car is old. Subframe rust matters more than a tidy engine bay. Do not pay E90 N52 money for an M54 with a damaged cylinder head.",
      "{year} {code} {model} z {engine} to benzynowa szóstka E46: plastik chłodzenia i DISA, nie łańcuch N47. Auto jest stare. Rdza belki waży więcej niż czysta komora. Nie płać ceny N52 E90 za M54 z uszkodzoną głowicą.",
      "The E46 six. Parts, known jobs.",
      "Szóstka E46. Części, znane naprawy.",
      "Age rust and cooling. This is not a young car.",
      "Rdza wieku i chłodzenie. To nie młode auto.",
      "{year} {code} {model} с {engine} — бензиновая шестёрка E46: пластик охлаждения и DISA, не цепь N47. Машина старая. Ржавчина подрамника важнее чистого моторного отсека. Не платите цену N52 E90 за M54 с повреждённой головкой.",
      "Шестёрка E46. Запчасти, известные работы.",
      "Возрастная ржавчина и охлаждение. Это не молодая машина.",
    ),
  ],
  "e46:320d-M47": [
    band(
      1998,
      2005,
      "The {year} {code} {model} with the {engine} is the common E46 diesel: swirl flaps, not a gearbox-end chain. Confirm M47 on the plate — later 3 Series 320d is N47. Flaps and EGR cost money; a rusty body can cost more than the engine.",
      "{year} {code} {model} z {engine} to częsty diesel E46: klapy, nie łańcuch od skrzyni. Potwierdź M47 na tabliczce — późniejsze 320d to N47. Klapy i EGR kosztują; zardzewiałe nadwozie może kosztować więcej niż silnik.",
      "The 320d before N47. Known, common, cheap to fuel.",
      "320d sprzed N47. Znany, częsty, tanio pali.",
      "Flaps, rust, high miles. Not a late E90 320d.",
      "Klapy, rdza, wysokie przebiegi. To nie późne 320d E90.",
      "{year} {code} {model} с {engine} — частый дизель E46: заслонки, не цепь со стороны коробки. Подтвердите M47 на шильдике — поздние 320d это N47. Заслонки и EGR стоят денег; ржавый кузов может стоить дороже мотора.",
      "320d до N47. Известен, частый, дёшево кормить.",
      "Заслонки, ржавчина, большой пробег. Не поздний 320d E90.",
    ),
  ],
  "f30:320i-N20": [
    band(
      2012,
      2016,
      "The {year} {code} {model} with the {engine} is the early F30 petrol: N20 timing chain and VANOS, not a B48. A rattle at start is a typical sign. Later years are better, not risk-free. This is not an E90 320i N43/N46. Ask what was done to the chain.",
      "{year} {code} {model} z {engine} to wczesna benzyna F30: łańcuch i VANOS N20, nie B48. Stuk przy starcie to typowy objaw. Późniejsze lata są lepsze, nie bez ryzyka. To nie 320i E90 N43/N46. Pytaj, co zrobiono z łańcuchem.",
      "Turbo four, common on OTOMOTO.",
      "Turboczwórka, częsta na OTOMOTO.",
      "N20 chain. This is not the later B48 330i.",
      "Łańcuch N20. To nie późniejsze 330i B48.",
      "{year} {code} {model} с {engine} — ранний бензин F30: цепь и VANOS N20, не B48. Стук на запуске — типичный признак. Поздние годы лучше, не без риска. Это не 320i E90 N43/N46. Спросите, что сделали с цепью.",
      "Турбочетвёрка, частая на OTOMOTO.",
      "Цепь N20. Это не поздняя 330i B48.",
    ),
  ],
  "f30:320d-N47": [
    band(
      2012,
      2015,
      "The {year} {code} {model} with the {engine} is still N47 in an F30 body — rear chain, often high mileage in Poland. A facelift 3 Series does not remove the gearbox-end chain. This is not B47. Price a chain job before buying.",
      "{year} {code} {model} z {engine} to nadal N47 w nadwoziu F30 — łańcuch z tyłu, w Polsce często wysoki przebieg. Lift trójki nie usuwa łańcucha od skrzyni. To nie B47. Wycen naprawę łańcucha przed zakupem.",
      "The 320d many buyers search first on this generation.",
      "320d, którego wielu szuka najpierw w tej generacji.",
      "Still N47. F30 is not a synonym for a low-risk 320d.",
      "Nadal N47. F30 to nie synonim niskiego ryzyka 320d.",
      "{year} {code} {model} с {engine} — по‑прежнему N47 в кузове F30: задняя цепь, в Польше часто большой пробег. Рестайлинг тройки не убирает цепь со стороны коробки. Это не B47. Заложите работу по цепи до покупки.",
      "320d, который многие ищут первым в этом поколении.",
      "По-прежнему N47. F30 — не синоним низкого риска 320d.",
    ),
  ],
  "f30:320d-B47": [
    band(
      2015,
      2019,
      "The {year} {code} {model} with the {engine} is B47, not N47. The timing chain is less of a problem; the EGR cooler and intake carbon are typical costs at high mileage in Poland. Confirm B47 on the plate.",
      "{year} {code} {model} z {engine} to B47, nie N47. Łańcuch rozrządu psuje się rzadziej; chłodnica EGR i nagar w dolocie to typowe koszty przy wysokim przebiegu w Polsce. Potwierdź B47 na tabliczce.",
      "Later 320d. Lower typical chain risk than N47.",
      "Późniejszy 320d. Niższe typowe ryzyko łańcucha niż N47.",
      "EGR and carbon. Not an N47 engine replacement — still not free.",
      "EGR i nagar. To nie wymiana silnika jak N47 — nadal nie za darmo.",
      "{year} {code} {model} с {engine} — это B47, не N47. Цепь ГРМ ломается реже; охладитель EGR и нагар во впуске — типичные расходы при большом пробеге в Польше. Подтвердите B47 на шильдике.",
      "Поздний 320d. Типичный риск цепи ниже, чем у N47.",
      "EGR и нагар. Не замена мотора как у N47 — всё равно не бесплатно.",
    ),
  ],
  "e60:530d-M57": [
    band(
      2003,
      2010,
      "The {year} {code} {model} with the {engine} is the E60 diesel six: M57, swirl flaps, not N47. iDrive and rust still apply. Confirm M57 — a 520d N47 is a different engine. Check service history and a dry subframe.",
      "{year} {code} {model} z {engine} to dieslowska szóstka E60: M57, klapy, nie N47. iDrive i rdza nadal obowiązują. Potwierdź M57 — 520d N47 to inny silnik. Sprawdź historię serwisową i suchą belkę.",
      "The simpler E60 diesel. Strong, known, parts exist.",
      "Prostszy diesel E60. Mocny, znany, części są.",
      "Flaps, electronics, rust. Neglect is a 5 Series bill.",
      "Klapy, elektronika, rdza. Zaniedbanie to rachunek piątki.",
      "{year} {code} {model} с {engine} — дизельная шестёрка E60: M57, заслонки, не N47. iDrive и ржавчина всё равно. Подтвердите M57 — 520d N47 другой мотор. Проверьте сервисную историю и сухой подрамник.",
      "Более простой дизель E60. Сильный, известный, запчасти есть.",
      "Заслонки, электрика, ржавчина. Заброс — счёт пятёрки.",
    ),
  ],
  "e60:520d-N47": [
    band(
      2007,
      2010,
      "The {year} {code} {model} with the {engine} is N47 in a 5 Series — same rear chain as the E90 320d, more mass, often more miles. A cheap 520d is not a 530d. Confirm N47. Price the chain before buying.",
      "{year} {code} {model} z {engine} to N47 w piątce — ten sam łańcuch z tyłu co 320d E90, więcej masy, często więcej kilometrów. Tanie 520d to nie 530d. Potwierdź N47. Wycen łańcuch przed zakupem.",
      "Cheap to fuel, common on Polish classifieds.",
      "Tanio pali, częste na polskich ogłoszeniach.",
      "Rear chain in a bigger, heavier car.",
      "Łańcuch z tyłu w większym, cięższym aucie.",
      "{year} {code} {model} с {engine} — N47 в пятёрке: та же задняя цепь, что у 320d E90, больше массы, часто больше пробега. Дешёвый 520d — не 530d. Подтвердите N47. Заложите цепь до покупки.",
      "Дёшево кормить, часто на польских объявлениях.",
      "Задняя цепь в более тяжёлой машине.",
    ),
  ],
  "e39:530d-M57": [
    band(
      1998,
      2003,
      "The {year} {code} {model} with the {engine} is the E39 530d: M57, swirl flaps, cooling plastics, not N47. After this age, rust often costs more than the engine. Inspect the subframe and the expansion tank.",
      "{year} {code} {model} z {engine} to 530d E39: M57, klapy, plastik chłodzenia, nie N47. W tym wieku rdza często kosztuje więcej niż silnik. Sprawdź belkę i zbiornik wyrównawczy.",
      "The 530d of this generation. Torque, parts.",
      "530d tej generacji. Moment, części.",
      "Rust and cooling. Forum reputation is not a score.",
      "Rdza i chłodzenie. Opinia z forum to nie ocena.",
      "{year} {code} {model} с {engine} — 530d E39: M57, заслонки, пластик охлаждения, не N47. В этом возрасте ржавчина часто стоит дороже мотора. Проверьте подрамник и расширительный бачок.",
      "530d этого поколения. Момент, запчасти.",
      "Ржавчина и охлаждение. Репутация на форуме — не оценка.",
    ),
  ],
  "f10:520d-N47": [
    band(
      2010,
      2014,
      "The {year} {code} {model} with the {engine} is N47 520d in an F10 — rear chain, 5 Series running costs. This is not N57 530d. A facelift five does not remove the gearbox-end chain.",
      "{year} {code} {model} z {engine} to 520d N47 w F10 — łańcuch z tyłu, koszty piątki. To nie 530d N57. Lift piątki nie usuwa łańcucha od skrzyni.",
      "The common F10 diesel. Cheap to fuel.",
      "Częsty diesel F10. Tanio pali.",
      "N47 in a heavier car. Not the 530d.",
      "N47 w cięższym aucie. To nie 530d.",
      "{year} {code} {model} с {engine} — 520d N47 в F10: задняя цепь, расходы пятёрки. Это не 530d N57. Рестайлинг пятёрки не убирает цепь со стороны коробки.",
      "Частый дизель F10. Дёшево кормить.",
      "N47 в более тяжёлой машине. Это не 530d.",
    ),
  ],
  "f10:530d-N57": [
    band(
      2010,
      2017,
      "The {year} {code} {model} with the {engine} is the F10 six-cylinder diesel: N57, lower typical chain risk than N47, not zero. High mileage in Poland is common. Timing noise and history matter. This is not a 520d with a 530d badge.",
      "{year} {code} {model} z {engine} to dieslowska szóstka F10: N57, niższe typowe ryzyko łańcucha niż N47, nie zerowe. Wysoki przebieg w Polsce jest częsty. Hałas rozrządu i historia mają znaczenie. To nie 520d ze znaczkiem 530d.",
      "The F10 diesel six. Stronger than 520d, lower typical chain risk than N47.",
      "Dieslowska szóstka F10. Mocniejsza niż 520d, niższe typowe ryzyko łańcucha niż N47.",
      "Still a chain diesel. Service history matters.",
      "Nadal diesel z łańcuchem. Historia serwisowa ma znaczenie.",
      "{year} {code} {model} с {engine} — шестицилиндровый дизель F10: N57, типичный риск цепи ниже, чем у N47, не нулевой. Большой пробег в Польше обычен. Шум ГРМ и история важны. Это не 520d с шильдиком 530d.",
      "Дизельная шестёрка F10. Сильнее 520d, типичный риск цепи ниже, чем у N47.",
      "По-прежнему дизель с цепью. Сервисная история важна.",
    ),
  ],
  "e87:120d-N47": [
    band(
      2007,
      2011,
      "The {year} {code} {model} with the {engine} is N47 in a 1 Series — same rear chain as the E90 320d, smaller hatch that rusts more, cheaper listing. Small does not mean low risk. Confirm N47, not M47 118d.",
      "{year} {code} {model} z {engine} to N47 w serii 1 — ten sam łańcuch z tyłu co 320d E90, mniejszy hatch, który bardziej rdzewieje, tańsze ogłoszenie. Małe nie znaczy niskie ryzyko. Potwierdź N47, nie 118d M47.",
      "Cheap BMW diesel hatch. Common in Poland.",
      "Tani dieslowy hatch BMW. Częsty w Polsce.",
      "N47 chain in a rusting 1 Series body.",
      "Łańcuch N47 w rdzewiejącym nadwoziu serii 1.",
      "{year} {code} {model} с {engine} — N47 в 1 серии: та же задняя цепь, что у 320d E90, меньший хэтчбек, который ржавеет сильнее, дешевле объявление. Маленький не значит низкий риск. Подтвердите N47, не 118d M47.",
      "Дешёвый дизельный хэтчбек BMW. Частый в Польше.",
      "Цепь N47 в ржавеющем кузове 1 серии.",
    ),
  ],
  "e70:30d-M57": [
    band(
      2007,
      2010,
      "The {year} {code} {model} with the {engine} is the common E70 diesel: M57 six, swirl flaps, plus transfer case. Check the transfer case in tight turns as well as the engine. This is not N57 40d and not a 5 Series.",
      "{year} {code} {model} z {engine} to częsty diesel E70: szóstka M57, klapy plus skrzynka rozdzielcza. Sprawdź skrzynkę na ciasnych manewrach tak samo jak silnik. To nie 40d N57 i nie piątka.",
      "The common X5 diesel of this generation.",
      "Częsty diesel X5 tej generacji.",
      "Transfer case and SUV bills on top of flaps.",
      "Skrzynka rozdzielcza i koszty SUV plus klapy.",
      "{year} {code} {model} с {engine} — частый дизель E70: шестёрка M57, заслонки плюс раздатка. Проверьте раздатку на крутых манёврах так же, как мотор. Это не 40d N57 и не пятёрка.",
      "Частый дизель X5 этого поколения.",
      "Раздатка и расходы SUV плюс заслонки.",
    ),
  ],
  "e53:3.0d-M57": [
    band(
      2001,
      2006,
      "The {year} {code} {model} with the {engine} is the first X5 diesel: M57, flaps, transfer case, age rust. Cooling and the body matter more than a tidy interior. Not an E70.",
      "{year} {code} {model} z {engine} to pierwszy diesel X5: M57, klapy, skrzynka rozdzielcza, rdza wieku. Chłodzenie i nadwozie ważą więcej niż czyste wnętrze. To nie E70.",
      "Known six, parts exist.",
      "Znana szóstka, części są.",
      "Rust, transfer case, cooling. A cheap E53 is often a project.",
      "Rdza, skrzynka rozdzielcza, chłodzenie. Tanie E53 to często projekt.",
      "{year} {code} {model} с {engine} — первый дизель X5: M57, заслонки, раздатка, возрастная ржавчина. Охлаждение и кузов важнее чистого салона. Не E70.",
      "Известная шестёрка, запчасти есть.",
      "Ржавчина, раздатка, охлаждение. Дешёвый E53 часто проект.",
    ),
  ],
  "f20:118d-N47": [
    band(
      2011,
      2015,
      "The {year} {code} {model} with the {engine} is N47 in an F20 — rear chain, often high city mileage. Later B47 120d is a different engine. Confirm N47. Small hatch, same chain as a 320d.",
      "{year} {code} {model} z {engine} to N47 w F20 — łańcuch z tyłu, często wysoki przebieg miejski. Późniejszy 120d B47 to inny silnik. Potwierdź N47. Mały hatch, ten sam łańcuch co 320d.",
      "Cheap to fuel, rear-drive 1 Series diesel.",
      "Tanio pali, dieslowa seria 1 na tył.",
      "N47 chain. Not the later B47.",
      "Łańcuch N47. To nie późniejsze B47.",
      "{year} {code} {model} с {engine} — N47 в F20: задняя цепь, часто большой городской пробег. Поздний 120d B47 — другой мотор. Подтвердите N47. Маленький хэтчбек, та же цепь, что у 320d.",
      "Дёшево кормить, заднеприводный дизель 1 серии.",
      "Цепь N47. Это не поздний B47.",
    ),
  ],
  "e83:3.0d-M57": [
    band(
      2003,
      2010,
      "The {year} {code} {model} with the {engine} is the first X3 diesel six: M57, flaps, transfer case, rust. A quiet transfer case and dry sills matter more than strong pull on a rusty body.",
      "{year} {code} {model} z {engine} to pierwsza dieslowska szóstka X3: M57, klapy, skrzynka rozdzielcza, rdza. Cicha skrzynka i suche progi ważą więcej niż mocny ciąg na zardzewiałym nadwoziu.",
      "The X3 that tows without X5 money.",
      "X3, które ciągnie bez kosztów X5.",
      "Transfer case, rust, flaps. Not a new crossover.",
      "Skrzynka rozdzielcza, rdza, klapy. To nie nowy crossover.",
      "{year} {code} {model} с {engine} — первая дизельная шестёрка X3: M57, заслонки, раздатка, ржавчина. Тихая раздатка и сухие пороги важнее сильной тяги на ржавом кузове.",
      "X3, который тянет без расходов X5.",
      "Раздатка, ржавчина, заслонки. Не новый кроссовер.",
    ),
  ],
  ...volumeEngineVerdicts,
};

function fill(template: string, variant: VariantBrief, bodyWord: string): string {
  return template
    .replaceAll("{year}", String(variant.year))
    .replaceAll("{model}", variant.model)
    .replaceAll("{engine}", variant.engine)
    .replaceAll("{code}", variant.chassisCode)
    .replaceAll("{body}", bodyWord);
}

function fillVerdict(base: Verdict, variant: VariantBrief, bodyWord: string, tail: Localized): Verdict {
  return {
    summary: loc(
      `${fill(base.summary.en, variant, bodyWord)} ${tail.en}`,
      `${fill(base.summary.pl, variant, bodyWord)} ${tail.pl}`,
      `${fill(base.summary.ru, variant, bodyWord)} ${tail.ru}`,
    ),
    good: loc(
      fill(base.good.en, variant, bodyWord),
      fill(base.good.pl, variant, bodyWord),
      fill(base.good.ru, variant, bodyWord),
    ),
    bad: loc(
      fill(base.bad.en, variant, bodyWord),
      fill(base.bad.pl, variant, bodyWord),
      fill(base.bad.ru, variant, bodyWord),
    ),
  };
}

export function chassisVerdict(chassis: Chassis): Verdict {
  const hit = CHASSIS[chassis.slug];
  if (hit) return hit;
  const engines = chassis.engines?.length ? chassis.engines.join(", ") : null;
  return {
    summary: loc(
      `${chassis.code} is ${chassis.name.en} (${chassis.years}). This card exists so you do not mix it with another generation that shares a badge. We have not published a 0–100 table for this chassis, and we will not invent a score. ${engines ? `Typical engines on the card: ${engines}.` : "Engine rows will appear here when the report is ready."} Start from the chassis code, not from 330i on the boot.`,
      `${chassis.code} to ${chassis.name.pl} (${chassis.years}). Ta karta jest po to, żeby nie pomylić go z inną generacją o tym samym znaczku. Nie opublikowaliśmy tabeli 0–100 dla tego podwozia i nie wymyślimy oceny. ${engines ? `Typowe silniki na karcie: ${engines}.` : "Wiersze silników pojawią się, gdy opis będzie gotowy."} Zaczynaj od kodu podwozia, nie od 330i na klapie.`,
      `${chassis.code} — это ${chassis.name.ru} (${chassis.years}). Карточка нужна, чтобы не перепутать поколение с другим с тем же шильдиком. Таблицы 0–100 для этого шасси мы не публиковали и оценку не выдумаем. ${engines ? `Типичные моторы на карточке: ${engines}.` : "Строки моторов появятся, когда описание будет готово."} Начинайте с кода шасси, не с 330i на крышке.`,
    ),
    good: loc(
      "The generation is named, so it will not be mixed with the next one.",
      "Generacja jest nazwana, więc nie pomyli się z następną.",
      "Поколение названо, его не перепутают со следующим.",
    ),
    bad: loc(
      "No 0–100 table yet. Do not treat the card as a full report.",
      "Nie ma jeszcze tabeli 0–100. Nie traktuj karty jako pełnego opisu.",
      "Таблицы 0–100 ещё нет. Не считайте карточку полным описанием.",
    ),
  };
}

export function variantVerdict(variant: VariantBrief, chassis: Chassis, bodyWord: string): Verdict {
  const key = `${variant.model}-${variant.engine}`;
  const source = chassis.drivetrainOf ?? chassis.slug;
  const bands = source === "e90" ? ENGINES[key] : ENGINES[`${source}:${key}`];
  const hit =
    bands?.find((item) => variant.year >= item.from && variant.year <= item.to) ??
    bands?.[0];
  const tail = BODY_TAIL[chassis.slug] ?? loc("", "", "");
  if (!hit) return composedVerdict(variant, chassis, bodyWord, tail);
  return fillVerdict(hit, variant, bodyWord, tail);
}

function composedVerdict(
  variant: VariantBrief,
  chassis: Chassis,
  _bodyWord: string,
  tail: Localized,
): Verdict {
  const score = variant.score.toFixed(0);
  const pain = getPain(variant.topPainId);
  const chassisHit = CHASSIS[chassis.slug];
  return {
    summary: loc(
      `The ${variant.year} ${variant.chassisCode} ${variant.model} ${variant.engine} scores ${score} / 100 (estimate). Main fault: ${pain?.title.en ?? "see the fault list"}. ${pain?.summary.en ?? "Use the scored row and the fault list."} ${chassisHit?.bad.en ?? ""} ${tail.en}`
        .replace(/\s+/g, " ")
        .trim(),
      `${variant.year} ${variant.chassisCode} ${variant.model} ${variant.engine} ma ocenę ${score} / 100 (szacunek). Główna usterka: ${pain?.title.pl ?? "patrz lista usterek"}. ${pain?.summary.pl ?? "Użyj wiersza z oceną i listy usterek."} ${chassisHit?.bad.pl ?? ""} ${tail.pl}`
        .replace(/\s+/g, " ")
        .trim(),
      `${variant.year} ${variant.chassisCode} ${variant.model} ${variant.engine} — оценка ${score} / 100 (оценка). Главная поломка: ${pain?.title.ru ?? "смотрите список поломок"}. ${pain?.summary.ru ?? "Смотрите строку с оценкой и список поломок."} ${chassisHit?.bad.ru ?? ""} ${tail.ru}`
        .replace(/\s+/g, " ")
        .trim(),
    ),
    good: chassisHit?.good ?? loc("It has a scored row.", "Ma wiersz z oceną.", "Есть строка с оценкой."),
    bad: pain
      ? loc(
          `Budget ${pain.title.en} before you buy.`,
          `Wycen: ${pain.title.pl} — przed zakupem.`,
          `Заложите ${pain.title.ru} до покупки.`,
        )
      : loc("Read the fault list. The badge does not name the engine.", "Czytaj listę usterek. Znaczek nie nazywa silnika.", "Читайте список поломок. Шильдик не указывает мотор."),
  };
}
