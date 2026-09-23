import type { Chassis, Localized, VariantBrief } from "./types";
import { loc } from "./loc";
import { getPain, painsForVariant, summarizeVariants, variantsFor } from "@/lib/catalog";
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
      "E90 is the fifth-generation 3 Series sedan (2005–2012). It is the most common used BMW on Polish classifieds. An N52 330i and an N47 320d have different risks, and N47 scores also change by year (worst chain window ~2007–2009). Independent workshops and parts are easy to find. Typical chassis issues: rear subframe rust after winter salt, and ELV/CAS that can prevent starting. Open the engine×year row before inspection.",
      "E90 to sedan serii 3 V generacji (2005–2012). To najczęstsze używane BMW na polskich ogłoszeniach. N52 330i i N47 320d mają inne ryzyka, a ocena N47 zmienia się też z rokiem (najgorsze okno łańcucha ~2007–2009). Warsztaty niezależne i części są łatwo dostępne. Typowe problemy podwozia: rdza tylnej belki po soli oraz ELV/CAS. Przed oględzinami otwórz wiersz silnik×rok.",
      "E90 — седан пятого поколения 3 серии (2005–2012). Это самое частое б/у BMW на польских объявлениях. У N52 330i и N47 320d разный риск, и балл N47 также меняется по году (худшее окно цепи ~2007–2009). Независимые сервисы и запчасти найти легко. Типичные проблемы шасси: ржавчина заднего подрамника после соли и ELV/CAS. До осмотра откройте строку мотор×год.",
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
      "E46 is the fourth-generation 3 Series (1998–2006) and is still common in Poland. Typical engines are M54 petrol and M47/M57 diesel, with cooling plastics, DISA, and swirl flaps as the shared job themes. After two decades of salt, check rear subframe and sills on a lift. Confirm the engine plate before inspection — M54 330i and M47 320d have different typical repairs.",
      "E46 to seria 3 IV generacji (1998–2006) i nadal jest częsta w Polsce. Typowe silniki to benzyna M54 oraz diesel M47/M57, a wspólne tematy napraw to plastik chłodzenia, DISA i klapy wirowe. Po dwóch dekadach soli sprawdź na podnośniku tylną belkę i progi. Przed oględzinami potwierdź tabliczkę silnika — M54 330i i M47 320d mają inne typowe naprawy.",
      "E46 — четвёртая 3 серия (1998–2006) и в Польше всё ещё частая. Типичные моторы — бензин M54 и дизели M47/M57; общие темы ремонта — пластик охлаждения, DISA и вихревые заслонки. После двух десятилетий соли на подъёмнике проверьте задний подрамник и пороги. До осмотра подтвердите шильдик мотора — у M54 330i и M47 320d разные типичные ремонты.",
    ),
    good: loc("Known engines, cheap parts, and many independent workshops in Poland.", "Znane silniki, tanie części i dużo warsztatów niezależnych w Polsce.", "Известные моторы, дешёвые запчасти и много независимых сервисов в Польше."),
    bad: loc("Age rust and cooling plastics often cost more than the engine job itself.", "Rdza wieku i plastik chłodzenia często kosztują więcej niż sama naprawa silnika.", "Возрастная ржавчина и пластик охлаждения часто стоят дороже самой работы по мотору."),
  },
  f30: {
    summary: loc(
      "F30 is the 3 Series sedan from 2012–2019. Petrol risks split early N20 timing chain (esp. 2012–2015) versus later years and B48; diesel splits N47 (chain + EGR by year) versus B47 EGR — two different 320d engines. Open the engine×year row before inspection; the badge does not name the motor.",
      "F30 to sedan serii 3 z lat 2012–2019. Benzyna: wczesny łańcuch N20 (zwł. 2012–2015) vs późniejsze lata i B48; diesel: N47 (łańcuch + EGR zależnie od roku) vs EGR B47 — dwa różne silniki 320d. Przed oględzinami otwórz wiersz silnika×rok; znaczek nie nazywa motoru.",
      "F30 — седан 3 серии 2012–2019. Бензин: ранняя цепь N20 (особ. 2012–2015) vs поздние годы и B48; дизель: N47 (цепь + EGR по году) vs EGR B47 — два разных мотора 320d. До осмотра откройте строку мотор×год; шильдик не указывает двигатель.",
    ),
    good: loc("Later B48 and B47 years carry lower typical risk than the early engines.", "Późniejsze lata B48 i B47 mają niższe typowe ryzyko niż wczesne silniki.", "Поздние годы B48 и B47 несут меньший типичный риск, чем ранние моторы."),
    bad: loc("Early N20 petrol and N47 320d still need budget for expensive typical repairs.", "Wczesna benzyna N20 i 320d N47 nadal wymagają budżetu na drogie typowe naprawy.", "Ранний бензин N20 и 320d N47 по‑прежнему требуют бюджета на дорогие типичные ремонты."),
  },
  f31: {
    summary: loc(
      "F31 is the F30 Touring with the same scored engines as the sedan. Polish salt hits the tailgate, roof rails, and spare-wheel well harder than on the F30. Inspect the wagon on a lift, then open the engine×year row — N20 and N47 risks do not change with the boot.",
      "F31 to Touring F30 z tymi samymi ocenionymi silnikami co sedan. Polska sól mocniej bije w klapę, relingi i wnękę koła zapasowego niż w F30. Oglądaj kombi na podnośniku, potem otwórz wiersz silnika×rok — ryzyka N20 i N47 nie zmieniają się z bagażnikiem.",
      "F31 — универсал F30 с теми же оценёнными моторами, что седан. Польская соль сильнее бьёт по крышке, рейлингам и нише запаски, чем на F30. Осматривайте универсал на подъёмнике, затем откройте строку мотор×год — риски N20 и N47 не меняются из‑за багажника.",
    ),
    good: loc("Same scored engines as F30, with a larger boot for Poland trips.", "Te same ocenione silniki co F30, z większym bagażnikiem na polskie trasy.", "Те же оценённые моторы, что F30, с большим багажником для польских поездок."),
    bad: loc("More salt rust than the sedan in the load area, plus the same N20 and N47 engine jobs.", "Więcej rdzy od soli niż sedan w bagażniku, plus te same naprawy N20 i N47.", "Больше солевой ржавчины, чем у седана в багажнике, плюс те же работы N20 и N47."),
  },
  e60: {
    summary: loc(
      "E60 is the fifth-generation 5 Series sedan (2003–2010), between E39 simplicity and F10. Typical engines: M57 530d, N47 520d, N52 530i, N62 V8. Electronics (iDrive) and rust are common reasons listings look cheap. Read the engine row; the 5 Series badge does not name the engine.",
      "E60 to sedan serii 5 V generacji (2003–2010), między prostotą E39 a F10. Typowe silniki: M57 530d, N47 520d, N52 530i, V8 N62. Elektronika (iDrive) i rdza to częste powody niskich cen. Czytaj wiersz silnika; znaczek serii 5 nie nazywa silnika.",
      "E60 — седан пятого поколения 5 серии (2003–2010), между простотой E39 и F10. Типичные моторы: M57 530d, N47 520d, N52 530i, V8 N62. Электрика (iDrive) и ржавчина — частые причины низкой цены. Читайте строку мотора; шильдик 5 серии не указывает мотор.",
    ),
    good: loc("M57 530d and N52 530i are the simpler engines when the body is dry.", "M57 530d i N52 530i to prostsze silniki, gdy nadwozie jest suche.", "M57 530d и N52 530i — более простые моторы, если кузов сухой."),
    bad: loc("iDrive faults and body rust show up early; N47 520d and N62 V8 add expensive engine bills. A low asking price often matches that repair list.", "Usterki iDrive i rdza nadwozia wychodzą wcześnie; 520d N47 i V8 N62 dokładają drogie naprawy silnika. Niska cena wywoławcza często odpowiada tej liście.", "Неисправности iDrive и ржавчина кузова проявляются рано; 520d N47 и V8 N62 добавляют дорогие счета по мотору. Низкая цена часто соответствует этому списку ремонтов."),
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
    good: loc("Simple engines, parts, and specialists are easy to find in Poland.", "Proste silniki, części i specjaliści są łatwo dostępni w Polsce.", "Простые моторы, запчасти и специалисты в Польше находятся легко."),
    bad: loc("Age rust and neglected cooling often outcost the engine job on a lift.", "Rdza wieku i zaniedbane chłodzenie często kosztują więcej niż naprawa silnika na podnośniku.", "Возрастная ржавчина и заброшенное охлаждение часто стоят дороже работы по мотору на подъёмнике."),
  },
  f10: {
    summary: loc(
      "F10 is the sixth-generation 5 Series sedan (2010–2017). N47 520d shares the rear timing chain with the E90 320d; N57 530d is the diesel six; early N20 520i carries a timing-chain risk; N55 535i is the petrol six. F11 Touring uses the same table. Open the engine row, then the service history — the badge does not name the motor.",
      "F10 to sedan serii 5 VI generacji (2010–2017). 520d N47 dzieli łańcuch z tyłu z 320d E90; N57 530d to dieslowska szóstka; wczesny N20 520i ma ryzyko łańcucha; N55 535i to benzynowa szóstka. F11 Touring korzysta z tej samej tabeli. Otwórz wiersz silnika, potem historię serwisową — znaczek nie nazywa motoru.",
      "F10 — седан шестого поколения 5 серии (2010–2017). У 520d N47 та же задняя цепь, что у 320d E90; N57 530d — дизельная шестёрка; ранний N20 520i несёт риск цепи; N55 535i — бензиновая шестёрка. F11 Touring использует ту же таблицу. Откройте строку мотора, затем сервисную историю — шильдик не указывает двигатель.",
    ),
    good: loc("N57 530d and N55 535i have lower typical risk than N47 520d.", "N57 530d i N55 535i mają niższe typowe ryzyko niż 520d N47.", "N57 530d и N55 535i имеют меньший типичный риск, чем 520d N47."),
    bad: loc("N47 520d and early N20 still need a chain budget; a 5 Series badge does not remove that job.", "520d N47 i wczesny N20 nadal wymagają budżetu na łańcuch; znaczek piątki nie usuwa tej naprawy.", "520d N47 и ранний N20 по‑прежнему требуют бюджета на цепь; шильдик пятёрки не убирает эту работу."),
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
    good: loc("It is a rear-drive hatch with an N52 130i option, cheap parts, and known specialists in Poland.", "To hatch na napęd tylny z opcją N52 130i, tanimi częściami i znanymi specjalistami w Polsce.", "Это заднеприводный хэтчбек с опцией N52 130i, дешёвыми запчастями и знакомыми специалистами в Польше."),
    bad: loc("N47 120d timing-chain risk, body rust, and worn interiors after Polish winters are the usual downsides.", "Ryzyko łańcucha 120d N47, rdza nadwozia i zużyte wnętrza po polskich zimach to typowe minusy.", "Риск цепи 120d N47, ржавчина кузова и изношенный салон после польских зим — типичные минусы."),
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
      "E70 is the second X5 (2006–2013): heavy, xDrive, expensive if neglected. M57 30d is the common diesel; N57 40d is a later chain six; N62 48i is a high-bill V8; N55 35i is the petrol six. The transfer-case chain is an xDrive repair on every fuel. Inspect on a lift and check the transfer case in tight turns before you open the engine row.",
      "E70 to drugi X5 (2006–2013): ciężki, xDrive, drogi gdy zaniedbany. M57 30d to częsty diesel; N57 40d to późniejsza szóstka z łańcuchem; N62 48i to V8 z wysokim rachunkiem; N55 35i to benzynowa szóstka. Łańcuch skrzynki rozdzielczej to naprawa xDrive przy każdym paliwie. Oglądaj na podnośniku i sprawdź skrzynkę na ciasnych manewrach, zanim otworzysz wiersz silnika.",
      "E70 — второй X5 (2006–2013): тяжёлый, xDrive, дорогой при забросе. M57 30d — частый дизель; N57 40d — поздняя шестёрка с цепью; N62 48i — V8 с высоким счётом; N55 35i — бензиновая шестёрка. Цепь раздатки — ремонт xDrive на любом топливе. Осматривайте на подъёмнике и проверьте раздатку на крутых манёврах, прежде чем открывать строку мотора.",
    ),
    good: loc("M57 30d and N55 35i stay workable when the transfer case is quiet on tight turns.", "M57 30d i N55 35i są do utrzymania, gdy skrzynka rozdzielcza jest cicha na ciasnych manewrach.", "M57 30d и N55 35i остаются рабочими, если раздатка тихая на крутых манёврах."),
    bad: loc("The transfer case, N62 V8, and underside rust drive high running costs when neglected.", "Skrzynka rozdzielcza, V8 N62 i rdza spodu windują koszty eksploatacji przy zaniedbaniu.", "Раздатка, V8 N62 и ржавчина снизу разгоняют расходы при забросе."),
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
      "F20 is the second 1 Series hatchback (2011–2019), still rear-wheel drive before the front-drive F40. N13 116i needs a timing budget; N47 118d is the chain diesel; later B47 120d shifts the typical cost to EGR and intake carbon. Open the engine×year row before the listing photo — small does not mean cheap to keep.",
      "F20 to drugi hatch serii 1 (2011–2019), nadal napęd na tył przed przednionapędowym F40. N13 116i wymaga budżetu na rozrząd; 118d N47 to diesel z łańcuchem; późniejszy 120d B47 przenosi typowy koszt na EGR i nagar w dolocie. Otwórz wiersz silnika×rok przed zdjęciem z ogłoszenia — małe nie znaczy tanie w utrzymaniu.",
      "F20 — второй хэтчбек 1 серии (2011–2019), всё ещё задний привод до переднеприводного F40. N13 116i требует бюджета на ГРМ; 118d N47 — дизель с цепью; поздний 120d B47 переносит типичные расходы на EGR и нагар во впуске. Откройте строку мотор×год до фото из объявления — маленький не значит дешёвый в содержании.",
    ),
    good: loc("It remains a rear-drive hatch; later B47 years carry lower typical chain risk.", "Nadal jest hatchbackiem z napędem na tył; późniejsze lata B47 mają niższe typowe ryzyko łańcucha.", "Это по‑прежнему заднеприводный хэтчбек; поздние годы B47 несут меньший типичный риск цепи."),
    bad: loc("N13 petrol and N47 118d still need real repair budgets; a small hatch is not cheap to keep.", "Benzyna N13 i 118d N47 nadal wymagają realnego budżetu napraw; mały hatchback nie jest tani w utrzymaniu.", "Бензин N13 и 118d N47 по‑прежнему требуют реального бюджета на ремонт; маленький хэтчбек не дёшев в содержании."),
  },
  e83: {
    summary: loc(
      "E83 is the first X3 (2003–2010): compact SAV with M54 petrol, M47 2.0d, and M57 3.0d. Shared risks are the transfer case, sill rust, and cooling plastics after Polish salt. Prefer a 3.0d with a quiet transfer case and dry sills. Inspect on a lift and check the transfer case in tight turns; open the engine row before you buy.",
      "E83 to pierwsze X3 (2003–2010): kompaktowy SAV z benzyną M54, 2.0d M47 i 3.0d M57. Wspólne ryzyka to skrzynka rozdzielcza, rdza progów i plastik chłodzenia po polskiej soli. Lepiej 3.0d z cichą skrzynką i suchymi progami. Oglądaj na podnośniku i sprawdź skrzynkę na ciasnych manewrach; przed zakupem otwórz wiersz silnika.",
      "E83 — первый X3 (2003–2010): компактный SAV с бензином M54, 2.0d M47 и 3.0d M57. Общие риски — раздатка, ржавчина порогов и пластик охлаждения после польской соли. Лучше 3.0d с тихой раздаткой и сухими порогами. Осматривайте на подъёмнике и проверьте раздатку на крутых манёврах; до покупки откройте строку мотора.",
    ),
    good: loc("M54 and M57 are known to Polish specialists, and the size is easy to park.", "M54 i M57 są znane polskim specjalistom, a rozmiar jest łatwy do parkowania.", "M54 и M57 знакомы польским специалистам, а размер легко парковать."),
    bad: loc("Budget the transfer case, sill rust, and age cooling before you trust a cheap listing.", "Zaplanuj budżet na skrzynkę rozdzielczą, rdzę progów i chłodzenie wieku, zanim zaufasz tanim ogłoszeniom.", "Заложите бюджет на раздатку, ржавчину порогов и возрастное охлаждение, прежде чем доверять дешёвому объявлению."),
  },
  // —— Wave 1a: AI briefs from warehouse fact packs (VERDICT_COPY_PLAN) ——
  g20: {
    summary: loc(
      "G20 is the seventh-generation 3 Series sedan (2019–). On this card the petrol rows are B48 (320i/330i) and B58 (M340i). Scores move with oil-filter housing themes: early B48 plastic housing cracks (~2017–2019 class on related cars) and late coolant-bushing SIB 11 10 25 on very new B48P years, while ordinary OFH gasket leaks stay common. Open the engine×year row — a 320i badge does not name B48 revisions.",
      "G20 to sedan serii 3 VII generacji (2019–). Na karcie benzyna to B48 (320i/330i) i B58 (M340i). Oceny ruszają tematami obudowy filtra oleju: wczesne pęknięcia plastiku B48 (~2017–2019) i późna tuleja chłodziwa SIB 11 10 25 na bardzo nowych B48P, a zwykła uszczelka OFH zostaje. Otwórz wiersz silnik×rok — znaczek 320i nie nazywa rewizji B48.",
      "G20 — седан седьмого поколения 3 серии (2019–). На карточке бензин B48 (320i/330i) и B58 (M340i). Оценки двигают темы корпуса масляного фильтра: ранние трещины пластика B48 (~2017–2019) и поздняя втулка ОЖ SIB 11 10 25 на очень новых B48P; обычная прокладка OFH остаётся. Откройте строку мотор×год — шильдик 320i не называет ревизии B48.",
    ),
    good: loc(
      "Later mid-cycle B48/B58 years without the early plastic-housing epidemic usually score calmer than the known OFH bump years.",
      "Późniejsze lata B48/B58 bez epidemii wczesnej plastikowej obudowy zwykle oceniają się spokojniej niż znane lata OFH.",
      "Поздние mid-cycle годы B48/B58 без эпидемии раннего пластикового корпуса обычно спокойнее известных лет OFH.",
    ),
    bad: loc(
      "Budget B48/B58 oil-filter housing leaks (gasket and, on dated windows, housing or bushing). Confirm oil on the undertray before you trust a clean engine bay photo.",
      "Zaplanuj budżet na wycieki OFH B48/B58 (uszczelka oraz w oknach dat — korpus lub tuleja). Sprawdź olej na osłonie spodniej, zanim zaufasz czystemu zdjęciu komory.",
      "Заложите бюджет на течи OFH B48/B58 (прокладка и в датных окнах — корпус или втулка). Проверьте масло на защите снизу, прежде чем верить чистому фото моторного отсека.",
    ),
  },
  g21: {
    summary: loc(
      "G21 is the G20 Touring with the same B48 and B58 scored engines. Polish salt hits the tailgate, rails, and spare well harder than on the sedan. Inspect the wagon on a lift, then open the engine×year row — OFH risk does not change with the boot.",
      "G21 to Touring G20 z tymi samymi ocenionymi B48 i B58. Polska sól mocniej bije w klapę, relingi i wnękę koła niż w sedan. Oglądaj kombi na podnośniku, potem otwórz wiersz silnik×rok — ryzyko OFH nie zmienia się z bagażnikiem.",
      "G21 — универсал G20 с теми же оценёнными B48 и B58. Польская соль сильнее бьёт по крышке, рейлингам и нише запаски, чем у седана. Осматривайте универсал на подъёмнике, затем откройте строку мотор×год — риск OFH не меняется из‑за багажника.",
    ),
    good: loc(
      "Same scored B48/B58 rows as G20, with a larger boot for Poland trips.",
      "Te same ocenione wiersze B48/B58 co G20, z większym bagażnikiem na polskie trasy.",
      "Те же оценённые строки B48/B58, что G20, с большим багажником для польских поездок.",
    ),
    bad: loc(
      "More salt rust in the load area than the sedan, plus the same OFH housing jobs.",
      "Więcej rdzy od soli w bagażniku niż sedan, plus te same naprawy OFH.",
      "Больше солевой ржавчины в багажнике, чем у седана, плюс те же работы OFH.",
    ),
  },
  g30: {
    summary: loc(
      "G30 is the seventh-generation 5 Series sedan (2017–2023). Engines on this card: B47 520d (EGR / AdBlue), B57 540d (EGR; MY 2017–18 cooler recall 22V-614 on VIN class), B48 530i (OFH early housing + gasket), B58 540i (OFH). Scores diverge by year on B48 and on early 540d — open the engine×year row before the listing badge sells you one story.",
      "G30 to sedan serii 5 VII generacji (2017–2023). Silniki na karcie: B47 520d (EGR / AdBlue), B57 540d (EGR; MY 2017–18 recall chłodnicy 22V-614 przy klasie VIN), B48 530i (wczesny korpus OFH + uszczelka), B58 540i (OFH). Oceny rozjeżdżają się rokiem na B48 i wczesnym 540d — otwórz wiersz silnik×rok, zanim znaczek sprzeda jedną historię.",
      "G30 — седан седьмого поколения 5 серии (2017–2023). Моторы на карточке: B47 520d (EGR / AdBlue), B57 540d (EGR; MY 2017–18 отзыв охладителя 22V-614 по VIN), B48 530i (ранний корпус OFH + прокладка), B58 540i (OFH). Оценки расходятся по году на B48 и раннем 540d — откройте строку мотор×год, прежде чем шильдик продаст одну историю.",
    ),
    good: loc(
      "Later B48 years after the early plastic OFH window and post-recall B57 rows usually sit calmer than 2017–18 housing / cooler years.",
      "Późniejsze lata B48 po oknie wczesnego plastiku OFH i wiersze B57 po recall zwykle są spokojniejsze niż lata 2017–18 korpusu / chłodnicy.",
      "Поздние годы B48 после окна раннего пластика OFH и строки B57 после отзыва обычно спокойнее лет 2017–18 корпуса / охладителя.",
    ),
    bad: loc(
      "Budget B47 EGR/AdBlue, B57 EGR (and VIN-check 22V-614 on early 540d), plus B48/B58 oil-filter housing work.",
      "Zaplanuj budżet na EGR/AdBlue B47, EGR B57 (i VIN 22V-614 na wczesnym 540d) oraz OFH B48/B58.",
      "Заложите бюджет на EGR/AdBlue B47, EGR B57 (и VIN 22V-614 на раннем 540d) плюс OFH B48/B58.",
    ),
  },
  g31: {
    summary: loc(
      "G31 is the G30 Touring with the same B47/B57/B48/B58 scored engines. Expect higher mileage and more salt in the load bay in Poland. Inspect the wagon body on a lift, then the engine×year row — diesel EGR and petrol OFH do not change with the boot.",
      "G31 to Touring G30 z tymi samymi ocenionymi B47/B57/B48/B58. W Polsce typowe są wyższe przebiegi i więcej soli w bagażniku. Oglądaj kombi na podnośniku, potem wiersz silnik×rok — EGR diesla i OFH benzyny nie zmieniają się z bagażnikiem.",
      "G31 — универсал G30 с теми же оценёнными B47/B57/B48/B58. В Польше типичны больший пробег и больше соли в багажнике. Осматривайте универсал на подъёмнике, затем строку мотор×год — EGR дизеля и OFH бензина не меняются из‑за багажника.",
    ),
    good: loc(
      "Same scored engines as G30, with Touring space for Poland trips.",
      "Te same ocenione silniki co G30, z przestrzenią Touring na polskie trasy.",
      "Те же оценённые моторы, что G30, с пространством Touring для польских поездок.",
    ),
    bad: loc(
      "More salt and mileage in the load area than the sedan, plus the same EGR and OFH jobs.",
      "Więcej soli i kilometrów w bagażniku niż sedan, plus te same naprawy EGR i OFH.",
      "Больше соли и пробега в багажнике, чем у седана, плюс те же работы EGR и OFH.",
    ),
  },
  f15: {
    summary: loc(
      "F15 is the third-generation X5 (2013–2018): heavy xDrive SAV. Engines on this card: N55 35i (water pump / OFH), N57 25d/30d (timing + EGR cooler window ~2013–2018), N63 50i (hot-V coolant pipes through mid-2010s, valve-stem oil 2017–19). Check the transfer case on tight turns before you open the engine row — xDrive repairs hit every fuel.",
      "F15 to trzecie X5 (2013–2018): ciężki SAV xDrive. Silniki na karcie: N55 35i (pompa wody / OFH), N57 25d/30d (łańcuch + okno chłodnicy EGR ~2013–2018), N63 50i (rury chłodzenia hot-V do połowy lat 2010, uszczelniacze 2017–19). Sprawdź skrzynkę rozdzielczą na ciasnych manewrach, zanim otworzysz wiersz silnika — naprawa xDrive trafia każde paliwo.",
      "F15 — третий X5 (2013–2018): тяжёлый SAV xDrive. Моторы на карточке: N55 35i (помпа / OFH), N57 25d/30d (цепь + окно охладителя EGR ~2013–2018), N63 50i (патрубки hot-V до середины 2010-х, колпачки 2017–19). Проверьте раздатку на крутых манёврах, прежде чем открывать строку мотора — ремонт xDrive бьёт по любому топливу.",
    ),
    good: loc(
      "N55 petrol rows without open cooler-pipe epidemics usually sit calmer than early N63 hot-V years when the transfer case is quiet.",
      "Wiersze N55 bez otwartej epidemii rur zwykle są spokojniejsze niż wczesne lata hot-V N63, gdy skrzynka jest cicha.",
      "Строки N55 без открытой эпидемии патрубков обычно спокойнее ранних лет hot-V N63, если раздатка тихая.",
    ),
    bad: loc(
      "Budget transfer-case wear, N57 EGR/timing, N55 cooling/OFH, and N63 valley pipes or valve stems by year.",
      "Zaplanuj budżet na skrzynkę rozdzielczą, EGR/łańcuch N57, chłodzenie/OFH N55 oraz rury lub uszczelniacze N63 zależnie od roku.",
      "Заложите бюджет на раздатку, EGR/цепь N57, охлаждение/OFH N55 и патрубки или колпачки N63 по году.",
    ),
  },
  f16: {
    summary: loc(
      "F16 is the second-generation X6 (2014–2019) on the same F15 drivetrain family. Engines on this card: N55, N57, N63 — same scored themes as X5 (pump/OFH, diesel EGR/timing, N63 hot-V). Coupe roof and fewer listings change the market, not the transfer case. Confirm the engine plate, then listen for xDrive shudder on tight turns.",
      "F16 to drugie X6 (2014–2019) na tej samej rodzinie napędu co F15. Silniki na karcie: N55, N57, N63 — te same ocenione tematy co X5 (pompa/OFH, EGR/łańcuch diesla, hot-V N63). Dach coupe i mniej ogłoszeń zmieniają rynek, nie skrzynkę rozdzielczą. Potwierdź tabliczkę silnika, potem posłuchaj drżenia xDrive na ciasnych manewrach.",
      "F16 — второй X6 (2014–2019) на той же семье привода, что F15. Моторы на карточке: N55, N57, N63 — те же оценённые темы, что X5 (помпа/OFH, EGR/цепь дизеля, hot-V N63). Крыша купе и меньше объявлений меняют рынок, не раздатку. Подтвердите шильдик мотора, затем послушайте дрожь xDrive на крутых манёврах.",
    ),
    good: loc(
      "Same scored N55/N57/N63 table as F15 when you want the coupe body.",
      "Ta sama oceniona tabela N55/N57/N63 co F15, gdy chcesz nadwozie coupe.",
      "Та же оценённая таблица N55/N57/N63, что F15, если нужен кузов купе.",
    ),
    bad: loc(
      "Transfer case, N57 EGR/timing, N55 cooling, and N63 hot-V bills — plus fewer clean listings than X5.",
      "Skrzynka rozdzielcza, EGR/łańcuch N57, chłodzenie N55 i rachunki hot-V N63 — plus mniej czystych ogłoszeń niż X5.",
      "Раздатка, EGR/цепь N57, охлаждение N55 и счета hot-V N63 — плюс меньше чистых объявлений, чем у X5.",
    ),
  },
  g05: {
    summary: loc(
      "G05 is the fourth-generation X5 (2018–). Engines on this card: B57 30d (EGR / intake carbon / AdBlue family) and B58 40i (OFH + transfer-case theme on xDrive). Scores stay flat where the same epidemic spans the years — still confirm VIN campaigns and a quiet transfer case before you buy mileage.",
      "G05 to czwarte X5 (2018–). Silniki na karcie: B57 30d (EGR / nagar / rodzina AdBlue) i B58 40i (OFH + temat skrzynki na xDrive). Oceny bywają płaskie, gdy ta sama epidemia obejmuje lata — i tak potwierdź kampanie VIN i cichą skrzynkę przed zakupem przebiegu.",
      "G05 — четвёртый X5 (2018–). Моторы на карточке: B57 30d (EGR / нагар / семья AdBlue) и B58 40i (OFH + тема раздатки на xDrive). Оценки бывают плоскими, когда одна эпидемия кроет годы — всё равно подтвердите кампании VIN и тихую раздатку до покупки пробега.",
    ),
    good: loc(
      "Modern B58 petrol rows can score calmly when OFH and transfer-case noise are absent on a test drive.",
      "Nowoczesne wiersze B58 potrafią ocenić się spokojnie, gdy na jeździe nie ma OFH i hałasu skrzynki.",
      "Современные строки B58 могут оцениваться спокойно, если на тесте нет OFH и шума раздатки.",
    ),
    bad: loc(
      "Budget B57 EGR/AdBlue on diesels and transfer-case / OFH checks on B58 xDrive.",
      "Zaplanuj budżet na EGR/AdBlue B57 przy dieslach oraz skrzynkę / OFH przy B58 xDrive.",
      "Заложите бюджет на EGR/AdBlue B57 у дизелей и раздатку / OFH у B58 xDrive.",
    ),
  },
  g06: {
    summary: loc(
      "G06 is the third-generation X6 (2019–) sharing G05’s B57/B58 scored themes. Coupe styling and fewer wagons on the market do not remove EGR, OFH, or transfer-case work. Treat it as an X5 drivetrain in a lower roof.",
      "G06 to trzecie X6 (2019–) dzielące ocenione tematy B57/B58 z G05. Stylizacja coupe i mniej aut na rynku nie usuwają EGR, OFH ani skrzynki. Traktuj jak napęd X5 w niższym dachu.",
      "G06 — третий X6 (2019–) с теми же оценёнными темами B57/B58, что G05. Стиль купе и меньше машин на рынке не убирают EGR, OFH и раздатку. Считайте приводом X5 в более низкой крыше.",
    ),
    good: loc(
      "Same B57/B58 evidence table as G05 when you want the coupe body.",
      "Ta sama tabela dowodów B57/B58 co G05, gdy chcesz coupe.",
      "Та же таблица доказательств B57/B58, что G05, если нужно купе.",
    ),
    bad: loc(
      "Same diesel EGR and petrol OFH/transfer-case bills as G05, with fewer clean examples.",
      "Te same rachunki EGR diesla i OFH/skrzynki benzyny co G05, przy mniejszej liczbie czystych egzemplarzy.",
      "Те же счета EGR дизеля и OFH/раздатки бензина, что G05, при меньшем числе чистых экземпляров.",
    ),
  },
  g07: {
    summary: loc(
      "G07 is the X7 (2019–) on the same modular diesel/petrol family as G05: B57 and B58 themes (EGR/AdBlue, OFH, transfer case). Three-row weight and tyres raise running cost even when the engine row looks calm. Inspect brakes, air suspension (if fitted), and xDrive behaviour before you celebrate a high score.",
      "G07 to X7 (2019–) na tej samej rodzinie diesla/benzyny co G05: tematy B57 i B58 (EGR/AdBlue, OFH, skrzynka). Trzy rzędy i opony podnoszą koszty nawet gdy wiersz silnika wygląda spokojnie. Sprawdź hamulce, pneumatykę (jeśli jest) i zachowanie xDrive, zanim ucieszysz się wysoką oceną.",
      "G07 — X7 (2019–) на той же семье дизеля/бензина, что G05: темы B57 и B58 (EGR/AdBlue, OFH, раздатка). Три ряда и шины поднимают расходы даже при спокойной строке мотора. Проверьте тормоза, пневмо (если есть) и поведение xDrive, прежде чем радоваться высокому баллу.",
    ),
    good: loc(
      "Shares the G05 evidence engines — you can compare 30d/40i rows with X5 before you pay X7 money.",
      "Dzieli ocenione silniki z G05 — możesz porównać wiersze 30d/40i z X5, zanim zapłacisz cenę X7.",
      "Делит оценённые моторы с G05 — сравните строки 30d/40i с X5, прежде чем платить деньги X7.",
    ),
    bad: loc(
      "B57 EGR/AdBlue, B58 OFH/transfer case, plus three-row wear items that scores do not fully price.",
      "EGR/AdBlue B57, OFH/skrzynka B58 plus zużycie trzech rzędów, którego oceny w pełni nie wyceniają.",
      "EGR/AdBlue B57, OFH/раздатка B58 плюс износ трёх рядов, который оценки полностью не оценивают.",
    ),
  },
  // —— Wave 1b: AI briefs from warehouse fact packs ——
  f25: {
    summary: loc(
      "F25 is the second-generation X3 (2010–2017): compact xDrive SAV. Engines on this card: N47 20d (timing chain by year — mid/late windows on this generation), N20 28i (chain esp. 2012–2015; early plastic OFH housing 2011–12 class), N55 35i (electric water pump / OFH gasket). Check the transfer case on tight turns before you open the engine×year row — xDrive wear hits every fuel.",
      "F25 to drugie X3 (2010–2017): kompaktowy SAV xDrive. Silniki na karcie: N47 20d (łańcuch zależnie od roku — okna mid/late w tej generacji), N20 28i (łańcuch zwł. 2012–2015; wczesny plastik OFH 2011–12), N55 35i (pompa wody / uszczelka OFH). Sprawdź skrzynkę rozdzielczą na ciasnych manewrach, zanim otworzysz wiersz silnik×rok — zużycie xDrive trafia każde paliwo.",
      "F25 — второй X3 (2010–2017): компактный SAV xDrive. Моторы на карточке: N47 20d (цепь по году — mid/late окна в этом поколении), N20 28i (цепь особ. 2012–2015; ранний пластик OFH 2011–12), N55 35i (помпа / прокладка OFH). Проверьте раздатку на крутых манёврах, прежде чем открывать строку мотор×год — износ xDrive бьёт по любому топливу.",
    ),
    good: loc(
      "N55 35i rows without open pump/OFH failures usually sit calmer than early N20 chain years when the transfer case is quiet.",
      "Wiersze N55 35i bez otwartej awarii pompy/OFH zwykle są spokojniejsze niż wczesne lata łańcucha N20, gdy skrzynka jest cicha.",
      "Строки N55 35i без открытой поломки помпы/OFH обычно спокойнее ранних лет цепи N20, если раздатка тихая.",
    ),
    bad: loc(
      "Budget transfer-case wear, N47 chain by year, N20 timing/OFH, and N55 water-pump jobs.",
      "Zaplanuj budżet na skrzynkę rozdzielczą, łańcuch N47 zależnie od roku, rozrząd/OFH N20 oraz pompę N55.",
      "Заложите бюджет на раздатку, цепь N47 по году, ГРМ/OFH N20 и помпу N55.",
    ),
  },
  g01: {
    summary: loc(
      "G01 is the third-generation X3 (2017–2024). Engines on this card: B47 20d (EGR / intake carbon; AdBlue/SCR on Euro 6), B48 30i (OFH gasket + early plastic housing ~2017–19), B58 M40i (OFH / transfer-case theme on xDrive). Scores can stay flat where the same epidemic spans the years — still confirm VIN campaigns, a quiet transfer case, and the engine plate before you buy mileage.",
      "G01 to trzecie X3 (2017–2024). Silniki na karcie: B47 20d (EGR / nagar; AdBlue/SCR na Euro 6), B48 30i (uszczelka OFH + wczesny plastik ~2017–19), B58 M40i (OFH / temat skrzynki na xDrive). Oceny bywają płaskie, gdy ta sama epidemia obejmuje lata — i tak potwierdź kampanie VIN, cichą skrzynkę i tabliczkę silnika przed zakupem przebiegu.",
      "G01 — третий X3 (2017–2024). Моторы на карточке: B47 20d (EGR / нагар; AdBlue/SCR на Euro 6), B48 30i (прокладка OFH + ранний пластик ~2017–19), B58 M40i (OFH / тема раздатки на xDrive). Оценки бывают плоскими, когда одна эпидемия кроет годы — всё равно подтвердите кампании VIN, тихую раздатку и шильдик мотора до покупки пробега.",
    ),
    good: loc(
      "Later B48 years after the early plastic OFH window and calm B58 rows usually beat neglected early diesels with open EGR bills.",
      "Późniejsze lata B48 po oknie wczesnego plastiku OFH i spokojne wiersze B58 zwykle biją zaniedbane wczesne diesle z otwartym rachunkiem EGR.",
      "Поздние годы B48 после окна раннего пластика OFH и спокойные строки B58 обычно лучше заброшенных ранних дизелей с открытым счётом EGR.",
    ),
    bad: loc(
      "Budget B47 EGR/AdBlue, B48 OFH (gasket and early housing), plus transfer-case checks on xDrive — including M40i.",
      "Zaplanuj budżet na EGR/AdBlue B47, OFH B48 (uszczelka i wczesny korpus) oraz skrzynkę na xDrive — także M40i.",
      "Заложите бюджет на EGR/AdBlue B47, OFH B48 (прокладка и ранний корпус) и раздатку на xDrive — включая M40i.",
    ),
  },
  g02: {
    summary: loc(
      "G02 is the second-generation X4 (2018–) sharing G01’s B47/B48/B58 scored themes. Coupe roof and fewer listings change the market, not EGR, OFH, or the transfer case. Treat it as an X3 drivetrain in a lower roof — confirm the engine plate, then listen for xDrive shudder on tight turns.",
      "G02 to drugie X4 (2018–) dzielące ocenione tematy B47/B48/B58 z G01. Dach coupe i mniej ogłoszeń zmieniają rynek, nie EGR, OFH ani skrzynkę. Traktuj jak napęd X3 w niższym dachu — potwierdź tabliczkę silnika, potem posłuchaj drżenia xDrive na ciasnych manewrach.",
      "G02 — второй X4 (2018–) с теми же оценёнными темами B47/B48/B58, что G01. Крыша купе и меньше объявлений меняют рынок, не EGR, OFH и раздатку. Считайте приводом X3 в более низкой крыше — подтвердите шильдик мотора, затем послушайте дрожь xDrive на крутых манёврах.",
    ),
    good: loc(
      "Same scored B47/B48/B58 table as G01 when you want the coupe body.",
      "Ta sama oceniona tabela B47/B48/B58 co G01, gdy chcesz nadwozie coupe.",
      "Та же оценённая таблица B47/B48/B58, что G01, если нужен кузов купе.",
    ),
    bad: loc(
      "Same diesel EGR and petrol OFH/transfer-case bills as G01, with fewer clean examples.",
      "Te same rachunki EGR diesla i OFH/skrzynki benzyny co G01, przy mniejszej liczbie czystych egzemplarzy.",
      "Те же счета EGR дизеля и OFH/раздатки бензина, что G01, при меньшем числе чистых экземпляров.",
    ),
  },
  f48: {
    summary: loc(
      "F48 is the second-generation X1 (2015–2022) on the UKL front-drive platform with optional xDrive. Engines on this card: B47 18d/20d (EGR / intake carbon; AdBlue on Euro 6) and B48 20i (OFH gasket family — and transfer-case checks when the listing is xDrive). A 20i badge does not remove OFH oil on the undertray; open the engine×year row before you trust a clean bay photo.",
      "F48 to drugie X1 (2015–2022) na platformie UKL z napędem na przód i opcją xDrive. Silniki na karcie: B47 18d/20d (EGR / nagar; AdBlue na Euro 6) oraz B48 20i (rodzina uszczelki OFH — i skrzynka, gdy ogłoszenie to xDrive). Znaczek 20i nie usuwa oleju OFH na osłonie; otwórz wiersz silnik×rok, zanim zaufasz czystemu zdjęciu komory.",
      "F48 — второй X1 (2015–2022) на платформе UKL с передним приводом и опцией xDrive. Моторы на карточке: B47 18d/20d (EGR / нагар; AdBlue на Euro 6) и B48 20i (семья прокладки OFH — и раздатка, если в объявлении xDrive). Шильдик 20i не убирает масло OFH на защите; откройте строку мотор×год, прежде чем верить чистому фото отсека.",
    ),
    good: loc(
      "Later B48 years without open OFH leaks and quiet xDrive usually sit calmer than high-mileage B47 rows with EGR symptoms.",
      "Późniejsze lata B48 bez otwartych wycieków OFH i ciche xDrive zwykle są spokojniejsze niż wysokoprzebiegowe B47 z objawami EGR.",
      "Поздние годы B48 без открытых течей OFH и тихий xDrive обычно спокойнее многопробежных B47 с симптомами EGR.",
    ),
    bad: loc(
      "Budget B47 EGR/AdBlue, B48 oil-filter housing gasket work, and transfer-case wear on xDrive examples.",
      "Zaplanuj budżet na EGR/AdBlue B47, uszczelkę OFH B48 oraz zużycie skrzynki na egzemplarzach xDrive.",
      "Заложите бюджет на EGR/AdBlue B47, прокладку OFH B48 и износ раздатки на экземплярах xDrive.",
    ),
  },
  f39: {
    summary: loc(
      "F39 is the first X2 (2018–2023): coupe-crossover sibling of F48 on UKL. Engines on this card: B38 18i and B48 20i (OFH gasket family), B47 20d (EGR / AdBlue). Fewer listings and the sloping roof change the market, not the scored faults. Confirm the engine plate, check oil on the undertray, and listen for xDrive shudder when fitted.",
      "F39 to pierwsze X2 (2018–2023): coupe-crossover siostrzane F48 na UKL. Silniki na karcie: B38 18i i B48 20i (rodzina uszczelki OFH), B47 20d (EGR / AdBlue). Mniej ogłoszeń i opadający dach zmieniają rynek, nie ocenione usterki. Potwierdź tabliczkę silnika, sprawdź olej na osłonie i posłuchaj drżenia xDrive, gdy jest.",
      "F39 — первый X2 (2018–2023): купе-кроссовер, сестра F48 на UKL. Моторы на карточке: B38 18i и B48 20i (семья прокладки OFH), B47 20d (EGR / AdBlue). Меньше объявлений и покатая крыша меняют рынок, не оценённые поломки. Подтвердите шильдик мотора, проверьте масло на защите и послушайте дрожь xDrive, если он есть.",
    ),
    good: loc(
      "Same B38/B48/B47 evidence family as F48 when you want the coupe-crossover body.",
      "Ta sama rodzina dowodów B38/B48/B47 co F48, gdy chcesz nadwozie coupe-crossover.",
      "Та же семья доказательств B38/B48/B47, что F48, если нужен кузов купе-кроссовер.",
    ),
    bad: loc(
      "OFH gasket work on B38/B48, B47 EGR/AdBlue, and fewer clean examples than X1.",
      "Uszczelka OFH na B38/B48, EGR/AdBlue B47 i mniej czystych egzemplarzy niż X1.",
      "Прокладка OFH на B38/B48, EGR/AdBlue B47 и меньше чистых экземпляров, чем у X1.",
    ),
  },
  f32: {
    summary: loc(
      "F32 is the first 4 Series coupe (2013–2020), sharing the F30 engine table. Engines on this card: N20 then B48 420i (chain on early N20 ~2013–15; OFH on B48), N55 435i (water pump / OFH), N47 then B47 420d (chain by year, then EGR). Frameless doors and fewer listings change the market, not the motor. Open the engine×year row — a 420i badge does not name N20 versus B48.",
      "F32 to pierwsze coupe serii 4 (2013–2020) dzielące tabelę silników z F30. Silniki na karcie: N20 potem B48 420i (łańcuch wczesnego N20 ~2013–15; OFH na B48), N55 435i (pompa / OFH), N47 potem B47 420d (łańcuch zależnie od roku, potem EGR). Bezramkowe drzwi i mniej ogłoszeń zmieniają rynek, nie motor. Otwórz wiersz silnik×rok — znaczek 420i nie nazywa N20 kontra B48.",
      "F32 — первое купе 4 серии (2013–2020) с таблицей моторов F30. Моторы на карточке: N20 затем B48 420i (цепь раннего N20 ~2013–15; OFH на B48), N55 435i (помпа / OFH), N47 затем B47 420d (цепь по году, затем EGR). Безрамные двери и меньше объявлений меняют рынок, не мотор. Откройте строку мотор×год — шильдик 420i не называет N20 против B48.",
    ),
    good: loc(
      "Later B48 and B47 years usually carry lower typical risk than early N20 chain and N47 420d rows.",
      "Późniejsze lata B48 i B47 zwykle mają niższe typowe ryzyko niż wczesny łańcuch N20 i wiersze 420d N47.",
      "Поздние годы B48 и B47 обычно несут меньший типичный риск, чем ранняя цепь N20 и строки 420d N47.",
    ),
    bad: loc(
      "Early N20 timing, N47 chain, N55 cooling/OFH, and B47 EGR still need real budgets — plus door seals on the coupe.",
      "Wczesny rozrząd N20, łańcuch N47, chłodzenie/OFH N55 i EGR B47 nadal wymagają realnego budżetu — plus uszczelki drzwi coupe.",
      "Ранний ГРМ N20, цепь N47, охлаждение/OFH N55 и EGR B47 по‑прежнему требуют реального бюджета — плюс уплотнители дверей купе.",
    ),
  },
  f36: {
    summary: loc(
      "F36 is the 4 Series Gran Coupé (2014–2021) on the same modular engines as F32/F30 without the N55 435i row on this card. Engines here: N20 then B48 420i, B47 420d. Four doors and a hatch change usability, not N20 chain or B47 EGR. Confirm the engine plate — early 420i is still N20.",
      "F36 to Gran Coupé serii 4 (2014–2021) na tych samych modularnych silnikach co F32/F30 bez wiersza N55 435i na tej karcie. Silniki tu: N20 potem B48 420i, B47 420d. Cztery drzwi i hatch zmieniają użyteczność, nie łańcuch N20 ani EGR B47. Potwierdź tabliczkę — wczesne 420i nadal jest N20.",
      "F36 — Gran Coupé 4 серии (2014–2021) на тех же модульных моторах, что F32/F30, без строки N55 435i на этой карточке. Моторы здесь: N20 затем B48 420i, B47 420d. Четыре двери и хэтч меняют удобство, не цепь N20 и не EGR B47. Подтвердите шильдик — ранний 420i по‑прежнему N20.",
    ),
    good: loc(
      "Later B48/B47 years match the calmer F30/F32 story, with four-door practicality.",
      "Późniejsze lata B48/B47 jak spokojniejsza historia F30/F32, z praktycznością czterech drzwi.",
      "Поздние годы B48/B47 как более спокойная история F30/F32, с практичностью четырёх дверей.",
    ),
    bad: loc(
      "Early N20 chain and B47 EGR bills — plus lift checks for salt on the hatch seals.",
      "Wczesny łańcuch N20 i rachunki EGR B47 — plus oględziny soli na uszczelkach hatcha na podnośniku.",
      "Ранняя цепь N20 и счета EGR B47 — плюс осмотр соли на уплотнениях хэтча на подъёмнике.",
    ),
  },
  f40: {
    summary: loc(
      "F40 is the third 1 Series hatch (2019–2024): front-wheel drive UKL, not the old rear-drive F20. Engines on this card: B38 118i and B48 120i (OFH gasket family; early B48 plastic housing ~2017–19 class on related cars), B47 118d (EGR / AdBlue). Small does not mean cheap to keep — open the engine×year row and check oil on the undertray before you buy.",
      "F40 to trzeci hatch serii 1 (2019–2024): napęd na przód UKL, nie stary napęd tylny F20. Silniki na karcie: B38 118i i B48 120i (rodzina uszczelki OFH; wczesny plastik B48 ~2017–19 na pokrewnych), B47 118d (EGR / AdBlue). Małe nie znaczy tanie w utrzymaniu — otwórz wiersz silnik×rok i sprawdź olej na osłonie przed zakupem.",
      "F40 — третий хэтчбек 1 серии (2019–2024): передний привод UKL, не старый задний F20. Моторы на карточке: B38 118i и B48 120i (семья прокладки OFH; ранний пластик B48 ~2017–19 на родственных), B47 118d (EGR / AdBlue). Маленький не значит дешёвый в содержании — откройте строку мотор×год и проверьте масло на защите до покупки.",
    ),
    good: loc(
      "Modern B48 rows without open OFH leaks can score calmly for city use when the service book is real.",
      "Nowoczesne wiersze B48 bez otwartych wycieków OFH potrafią ocenić się spokojnie do miasta, gdy książka serwisowa jest prawdziwa.",
      "Современные строки B48 без открытых течей OFH могут оцениваться спокойно для города, если сервисная книга настоящая.",
    ),
    bad: loc(
      "Budget B38/B48 OFH gasket work and B47 EGR/AdBlue — FWD packaging does not remove those jobs.",
      "Zaplanuj budżet na uszczelkę OFH B38/B48 i EGR/AdBlue B47 — układ FWD nie usuwa tych napraw.",
      "Заложите бюджет на прокладку OFH B38/B48 и EGR/AdBlue B47 — компоновка FWD не убирает эти работы.",
    ),
  },
  // —— Wave 2: remaining volume + M/Z/i/classics ——
  e36: {
    summary: loc(
      "E36 is the third-generation 3 Series (1990–2000). Engines on this card: M43 318i and M52 328i — shared theme is cooling plastics / water pump. After three decades of salt, check sills and rear subframe on a lift before you celebrate a clean engine bay. Confirm the engine plate; scored rows here are M43/M52.",
      "E36 to seria 3 III generacji (1990–2000). Silniki na karcie: M43 318i i M52 328i — wspólny temat to plastik chłodzenia / pompa wody. Po trzech dekadach soli sprawdź progi i tylną belkę na podnośniku. Potwierdź tabliczkę; ocenione wiersze tu to M43/M52.",
      "E36 — третья 3 серия (1990–2000). Моторы на карточке: M43 318i и M52 328i — общая тема пластик охлаждения / помпа. После трёх десятилетий соли проверьте пороги и задний подрамник на подъёмнике. Подтвердите шильдик; оценённые строки здесь M43/M52.",
    ),
    good: loc(
      "Known four- and six-cylinder rows with cheap cooling parts and many Polish specialists.",
      "Znane czwórki i szóstki z tanimi częściami chłodzenia i wieloma specjalistami w Polsce.",
      "Известные четвёрки и шестёрки с дешёвыми деталями охлаждения и многими специалистами в Польше.",
    ),
    bad: loc(
      "Age rust and neglected cooling plastics often outcost the engine job itself.",
      "Rdza wieku i zaniedbany plastik chłodzenia często kosztują więcej niż sama naprawa silnika.",
      "Возрастная ржавчина и заброшенный пластик охлаждения часто стоят дороже самой работы по мотору.",
    ),
  },
  "e36-compact": {
    summary: loc(
      "E36 Compact is the hatch sibling of the E36 (1994–2000). Scored engines follow the E36 cooling theme (M43/M52 class). Fewer listings do not change water-pump plastics or sill rust — inspect on a lift, then open the engine row.",
      "E36 Compact to hatch siostrzany E36 (1994–2000). Ocenione silniki jak temat chłodzenia E36 (klasa M43/M52). Mniej ogłoszeń nie zmienia plastiku pompy ani rdzy progów — oglądaj na podnośniku, potem otwórz wiersz silnika.",
      "E36 Compact — хэтч-сестра E36 (1994–2000). Оценённые моторы как тема охлаждения E36 (класс M43/M52). Меньше объявлений не меняет пластик помпы и ржавчину порогов — осмотр на подъёмнике, затем строка мотора.",
    ),
    good: loc(
      "Same cooling-scored family as E36 when you want the Compact body.",
      "Ta sama oceniona rodzina chłodzenia co E36, gdy chcesz nadwozie Compact.",
      "Та же оценённая семья охлаждения, что E36, если нужен кузов Compact.",
    ),
    bad: loc(
      "Fewer clean examples, same age rust and cooling bills as the sedan.",
      "Mniej czystych egzemplarzy, ta sama rdza wieku i rachunki chłodzenia co sedan.",
      "Меньше чистых экземпляров, та же возрастная ржавчина и счета охлаждения, что у седана.",
    ),
  },
  "e46-compact": {
    summary: loc(
      "E46 Compact is the hatch of the E46 generation (2000–2004). Engines and scored themes match the E46 sedan: M54 cooling plastics / DISA class, M47/M57 diesel jobs where fitted. Confirm the plate, then lift-check sills.",
      "E46 Compact to hatch generacji E46 (2000–2004). Silniki i ocenione tematy jak sedan E46: plastik chłodzenia M54 / DISA, diesle M47/M57 gdy są. Potwierdź tabliczkę, potem progi na podnośniku.",
      "E46 Compact — хэтч поколения E46 (2000–2004). Моторы и оценённые темы как седан E46: пластик охлаждения M54 / DISA, дизели M47/M57 если есть. Подтвердите шильдик, затем пороги на подъёмнике.",
    ),
    good: loc(
      "Same scored E46 engine family when you want the hatch body.",
      "Ta sama oceniona rodzina silników E46, gdy chcesz hatch.",
      "Та же оценённая семья моторов E46, если нужен хэтч.",
    ),
    bad: loc(
      "Age cooling and sill rust — fewer listings than the four-door.",
      "Chłodzenie wieku i rdza progów — mniej ogłoszeń niż czterodrzwiowe.",
      "Возрастное охлаждение и ржавчина порогов — меньше объявлений, чем у четырёхдверки.",
    ),
  },
  e71: {
    summary: loc(
      "E71 is the first X6 (2008–2014) on the E70 drivetrain family. Engines on this card: N55 35i (water pump / OFH), N57 30d (timing), N63 50i (hot-V coolant pipes through mid-2010s). Coupe roof changes the market, not the transfer case — listen for xDrive shudder on tight turns before you open the engine×year row.",
      "E71 to pierwsze X6 (2008–2014) na rodzinie napędu E70. Silniki na karcie: N55 35i (pompa / OFH), N57 30d (łańcuch), N63 50i (rury chłodzenia hot-V do połowy lat 2010). Dach coupe zmienia rynek, nie skrzynkę — posłuchaj drżenia xDrive na ciasnych manewrach, zanim otworzysz wiersz silnik×rok.",
      "E71 — первый X6 (2008–2014) на семье привода E70. Моторы на карточке: N55 35i (помпа / OFH), N57 30d (цепь), N63 50i (патрубки hot-V до середины 2010-х). Крыша купе меняет рынок, не раздатку — послушайте дрожь xDrive на крутых манёврах, прежде чем открывать строку мотор×год.",
    ),
    good: loc(
      "N55 rows without open cooling faults usually sit calmer than early N63 hot-V years when the transfer case is quiet.",
      "Wiersze N55 bez otwartych usterek chłodzenia zwykle są spokojniejsze niż wczesne lata hot-V N63, gdy skrzynka jest cicha.",
      "Строки N55 без открытых неисправностей охлаждения обычно спокойнее ранних лет hot-V N63, если раздатка тихая.",
    ),
    bad: loc(
      "Budget transfer-case wear, N57 timing, N55 pump/OFH, and N63 valley pipes by year.",
      "Zaplanuj budżet na skrzynkę, łańcuch N57, pompę/OFH N55 oraz rury N63 zależnie od roku.",
      "Заложите бюджет на раздатку, цепь N57, помпу/OFH N55 и патрубки N63 по году.",
    ),
  },
  e82: {
    summary: loc(
      "E82 is the 1 Series coupe (2007–2013), rear-drive. Engines on this card: N52 125i (water pump), N54 then N55 135i (HPFP/injectors on early N54 ~2007–10; pump/OFH on N55), N47 120d (timing chain by year). Confirm the 135i plate before you budget — frameless doors change the market, not the motor.",
      "E82 to coupe serii 1 (2007–2013), napęd na tył. Silniki na karcie: N52 125i (pompa), N54 potem N55 135i (HPFP/wtryski wczesnego N54 ~2007–10; pompa/OFH na N55), N47 120d (łańcuch zależnie od roku). Potwierdź tabliczkę 135i przed budżetem — bezramkowe drzwi zmieniają rynek, nie motor.",
      "E82 — купе 1 серии (2007–2013), задний привод. Моторы на карточке: N52 125i (помпа), N54 затем N55 135i (HPFP/форсунки раннего N54 ~2007–10; помпа/OFH на N55), N47 120d (цепь по году). Подтвердите шильдик 135i до бюджета — безрамные двери меняют рынок, не мотор.",
    ),
    good: loc(
      "N52 125i and later N55 135i usually carry lower typical drama than early N54 HPFP years when the body is dry.",
      "N52 125i i późniejsze N55 135i zwykle mają mniej typowego dramatu niż wczesne lata HPFP N54, gdy nadwozie jest suche.",
      "N52 125i и поздние N55 135i обычно несут меньше типичной драмы, чем ранние годы HPFP N54, если кузов сухой.",
    ),
    bad: loc(
      "N47 chain, early N54 HPFP/injectors, and N52/N55 cooling — plus door seals on the coupe.",
      "Łańcuch N47, wczesny HPFP/wtryski N54 oraz chłodzenie N52/N55 — plus uszczelki drzwi coupe.",
      "Цепь N47, ранний HPFP/форсунки N54 и охлаждение N52/N55 — плюс уплотнители дверей купе.",
    ),
  },
  e88: {
    summary: loc(
      "E88 is the 1 Series convertible (2007–2014) sharing the E82 engine table. Extra cost: roof hydraulics, fabric, and drains. N47 120d is still a chain diesel; N54 135i still needs the HPFP window check. Cycle the roof at inspection before you open the engine×year row.",
      "E88 to cabrio serii 1 (2007–2014) dzielące tabelę silników z E82. Dodatkowy koszt: hydraulika dachu, materiał i odpływy. 120d N47 nadal diesel z łańcuchem; 135i N54 nadal wymaga okna HPFP. Zrób cykl dachu na oględzinach, zanim otworzysz wiersz silnik×rok.",
      "E88 — кабриолет 1 серии (2007–2014) с таблицей моторов E82. Доп. расходы: гидравлика крыши, ткань и сливы. 120d N47 по‑прежнему дизель с цепью; 135i N54 по‑прежнему требует окна HPFP. Сделайте цикл крыши на осмотре, прежде чем открывать строку мотор×год.",
    ),
    good: loc(
      "Same scored engines as E82 once that year exists.",
      "Gdy rok istnieje — te same ocenione silniki co E82.",
      "Когда год существует — те же оценённые моторы, что E82.",
    ),
    bad: loc(
      "Roof leaks and rams, plus the same N47/N54 bills as the coupe.",
      "Nieszczelny dach i siłowniki plus te same rachunki N47/N54 co coupe.",
      "Течи крыши и цилиндры плюс те же счета N47/N54, что у купе.",
    ),
  },
  e84: {
    summary: loc(
      "E84 is the first X1 (2009–2015): compact SAV, often xDrive. Engines on this card: N47 18d/20d (timing chain by year), N20 20i (chain esp. 2011–15; early plastic OFH housing 2011–12 class), N52 28i (water pump). Check the transfer case on tight turns, then open the engine×year row.",
      "E84 to pierwsze X1 (2009–2015): kompaktowy SAV, często xDrive. Silniki na karcie: N47 18d/20d (łańcuch zależnie od roku), N20 20i (łańcuch zwł. 2011–15; wczesny plastik OFH 2011–12), N52 28i (pompa). Sprawdź skrzynkę na ciasnych manewrach, potem otwórz wiersz silnik×rok.",
      "E84 — первый X1 (2009–2015): компактный SAV, часто xDrive. Моторы на карточке: N47 18d/20d (цепь по году), N20 20i (цепь особ. 2011–15; ранний пластик OFH 2011–12), N52 28i (помпа). Проверьте раздатку на крутых манёврах, затем откройте строку мотор×год.",
    ),
    good: loc(
      "N52 28i rows without open pump faults usually sit calmer than early N47/N20 chain years when xDrive is quiet.",
      "Wiersze N52 28i bez otwartej awarii pompy zwykle są spokojniejsze niż wczesne lata łańcucha N47/N20, gdy xDrive jest ciche.",
      "Строки N52 28i без открытой поломки помпы обычно спокойнее ранних лет цепи N47/N20, если xDrive тихий.",
    ),
    bad: loc(
      "Budget N47 chain, N20 timing/OFH, N52 pump, and transfer-case wear on xDrive.",
      "Zaplanuj budżet na łańcuch N47, rozrząd/OFH N20, pompę N52 oraz skrzynkę na xDrive.",
      "Заложите бюджет на цепь N47, ГРМ/OFH N20, помпу N52 и раздатку на xDrive.",
    ),
  },
  f01: {
    summary: loc(
      "F01 is the fifth-generation 7 Series (2008–2015). Engines on this card: N57 730d (timing) and N63 750i (hot-V coolant pipes through mid-2010s). Air suspension and electronics stack on top of the engine row — open the engine×year score before you trust a cheap long-wheelbase listing.",
      "F01 to seria 7 V generacji (2008–2015). Silniki na karcie: N57 730d (łańcuch) i N63 750i (rury chłodzenia hot-V do połowy lat 2010). Pneumatyka i elektronika dokładają się do wiersza silnika — otwórz ocenę silnik×rok, zanim zaufasz taniemu LWB.",
      "F01 — пятое поколение 7 серии (2008–2015). Моторы на карточке: N57 730d (цепь) и N63 750i (патрубки hot-V до середины 2010-х). Пневмо и электрика добавляются к строке мотора — откройте оценку мотор×год, прежде чем верить дешёвому LWB.",
    ),
    good: loc(
      "N57 diesel rows without open timing noise usually beat early N63 hot-V years on running-cost honesty.",
      "Wiersze diesla N57 bez otwartego hałasu łańcucha zwykle biją wczesne lata hot-V N63 pod względem uczciwości kosztów.",
      "Строки дизеля N57 без открытого шума цепи обычно честнее ранних лет hot-V N63 по стоимости содержания.",
    ),
    bad: loc(
      "Budget N63 valley pipes, N57 timing, and luxury wear (air springs, modules) that scores do not fully price.",
      "Zaplanuj budżet na rury N63, łańcuch N57 i zużycie luksusu (miechy, moduły), którego oceny w pełni nie wyceniają.",
      "Заложите бюджет на патрубки N63, цепь N57 и износ люкса (пневмобаллоны, модули), который оценки полностью не оценивают.",
    ),
  },
  f22: {
    summary: loc(
      "F22 is the 2 Series coupe (2014–2021), rear-drive compact. Engines on this card: N20 then B48 220i (chain on early N20; OFH on B48), N55 230i (water pump / OFH), B47 220d (EGR). A 220i badge does not name N20 versus B48 — open the engine×year row before inspection.",
      "F22 to coupe serii 2 (2014–2021), kompakt na napęd tylny. Silniki na karcie: N20 potem B48 220i (łańcuch wczesnego N20; OFH na B48), N55 230i (pompa / OFH), B47 220d (EGR). Znaczek 220i nie nazywa N20 kontra B48 — otwórz wiersz silnik×rok przed oględzinami.",
      "F22 — купе 2 серии (2014–2021), компакт с задним приводом. Моторы на карточке: N20 затем B48 220i (цепь раннего N20; OFH на B48), N55 230i (помпа / OFH), B47 220d (EGR). Шильдик 220i не называет N20 против B48 — откройте строку мотор×год до осмотра.",
    ),
    good: loc(
      "Later B48 and B47 years usually carry lower typical risk than early N20 chain rows.",
      "Późniejsze lata B48 i B47 zwykle mają niższe typowe ryzyko niż wczesne wiersze łańcucha N20.",
      "Поздние годы B48 и B47 обычно несут меньший типичный риск, чем ранние строки цепи N20.",
    ),
    bad: loc(
      "Early N20 timing, N55 cooling/OFH, and B47 EGR still need real budgets.",
      "Wczesny rozrząd N20, chłodzenie/OFH N55 i EGR B47 nadal wymagają realnego budżetu.",
      "Ранний ГРМ N20, охлаждение/OFH N55 и EGR B47 по‑прежнему требуют реального бюджета.",
    ),
  },
  f26: {
    summary: loc(
      "F26 is the first X4 (2014–2018), coupe-SAV on the F25 family. Engines on this card: N20 20i (chain), N55 35i (water pump), N47 then B47 20d (chain, then EGR). Same transfer-case check as X3 — listen on tight turns, then open the engine×year row.",
      "F26 to pierwsze X4 (2014–2018), coupe-SAV na rodzinie F25. Silniki na karcie: N20 20i (łańcuch), N55 35i (pompa), N47 potem B47 20d (łańcuch, potem EGR). Ta sama kontrola skrzynki co X3 — posłuchaj na ciasnych manewrach, potem otwórz wiersz silnik×rok.",
      "F26 — первый X4 (2014–2018), купе-SAV на семье F25. Моторы на карточке: N20 20i (цепь), N55 35i (помпа), N47 затем B47 20d (цепь, затем EGR). Та же проверка раздатки, что у X3 — послушайте на крутых манёврах, затем откройте строку мотор×год.",
    ),
    good: loc(
      "Later B47 years and calm N55 rows usually beat early N20/N47 chain years when xDrive is quiet.",
      "Późniejsze lata B47 i spokojne N55 zwykle biją wczesne lata łańcucha N20/N47, gdy xDrive jest ciche.",
      "Поздние годы B47 и спокойные N55 обычно лучше ранних лет цепи N20/N47, если xDrive тихий.",
    ),
    bad: loc(
      "Transfer case, N20 chain, N47 chain / B47 EGR, and N55 pump bills — plus fewer clean listings than X3.",
      "Skrzynka, łańcuch N20, łańcuch N47 / EGR B47 i pompa N55 — plus mniej czystych ogłoszeń niż X3.",
      "Раздатка, цепь N20, цепь N47 / EGR B47 и помпа N55 — плюс меньше чистых объявлений, чем у X3.",
    ),
  },
  f33: {
    summary: loc(
      "F33 is the 4 Series convertible (2013–2020) sharing the F32 engine table (N20/B48, N55, N47/B47). Roof hydraulics and drains are extra cost on top of the same chain/EGR/OFH themes. Cycle the roof at inspection, then open the engine×year row.",
      "F33 to cabrio serii 4 (2013–2020) dzielące tabelę silników F32 (N20/B48, N55, N47/B47). Hydraulika dachu i odpływy to dodatkowy koszt obok tych samych tematów łańcucha/EGR/OFH. Zrób cykl dachu na oględzinach, potem otwórz wiersz silnik×rok.",
      "F33 — кабриолет 4 серии (2013–2020) с таблицей моторов F32 (N20/B48, N55, N47/B47). Гидравлика крыши и сливы — доп. расходы поверх тех же тем цепи/EGR/OFH. Сделайте цикл крыши на осмотре, затем откройте строку мотор×год.",
    ),
    good: loc(
      "Same scored engines as F32 once that year exists.",
      "Gdy rok istnieje — te same ocenione silniki co F32.",
      "Когда год существует — те же оценённые моторы, что F32.",
    ),
    bad: loc(
      "Roof leaks and rams, plus early N20 / N47 bills like the coupe.",
      "Nieszczelny dach i siłowniki plus rachunki wczesnego N20 / N47 jak w coupe.",
      "Течи крыши и цилиндры плюс счета раннего N20 / N47, как у купе.",
    ),
  },
  f34: {
    summary: loc(
      "F34 is the 3 Series Gran Turismo (2013–2019) on the F30 drivetrain. Same scored N20/B48 and N47/B47 themes as the sedan, with a hatch and higher roof. Open the engine×year row before inspection — the badge does not name the motor.",
      "F34 to Gran Turismo serii 3 (2013–2019) na napędzie F30. Te same ocenione tematy N20/B48 i N47/B47 co sedan, z hatchem i wyższym dachem. Otwórz wiersz silnik×rok przed oględzinami — znaczek nie nazywa motoru.",
      "F34 — Gran Turismo 3 серии (2013–2019) на приводе F30. Те же оценённые темы N20/B48 и N47/B47, что седан, с хэтчем и более высокой крышей. Откройте строку мотор×год до осмотра — шильдик не указывает двигатель.",
    ),
    good: loc(
      "Same scored engines as F30, with hatch practicality.",
      "Te same ocenione silniki co F30, z praktycznością hatcha.",
      "Те же оценённые моторы, что F30, с практичностью хэтча.",
    ),
    bad: loc(
      "Early N20 and N47 bills like the sedan, plus lift checks for hatch-seal salt.",
      "Rachunki wczesnego N20 i N47 jak sedan, plus oględziny soli na uszczelkach hatcha.",
      "Счета раннего N20 и N47 как у седана, плюс осмотр соли на уплотнениях хэтча.",
    ),
  },
  f44: {
    summary: loc(
      "F44 is the 2 Series Gran Coupé (2020–) on UKL front-drive. Engines on this card: B38 218i, B48 220i (OFH gasket family), B47 220d (EGR / AdBlue). Four doors do not remove oil on the undertray — open the engine×year row before you buy.",
      "F44 to Gran Coupé serii 2 (2020–) na napędzie UKL. Silniki na karcie: B38 218i, B48 220i (rodzina uszczelki OFH), B47 220d (EGR / AdBlue). Cztery drzwi nie usuwają oleju na osłonie — otwórz wiersz silnik×rok przed zakupem.",
      "F44 — Gran Coupé 2 серии (2020–) на UKL. Моторы на карточке: B38 218i, B48 220i (семья прокладки OFH), B47 220d (EGR / AdBlue). Четыре двери не убирают масло на защите — откройте строку мотор×год до покупки.",
    ),
    good: loc(
      "Modern B48 rows without open OFH leaks can score calmly when the service book is real.",
      "Nowoczesne wiersze B48 bez otwartych wycieków OFH potrafią ocenić się spokojnie przy prawdziwej książce serwisowej.",
      "Современные строки B48 без открытых течей OFH могут оцениваться спокойно при настоящей сервисной книге.",
    ),
    bad: loc(
      "Budget B38/B48 OFH gasket work and B47 EGR/AdBlue.",
      "Zaplanuj budżet na uszczelkę OFH B38/B48 i EGR/AdBlue B47.",
      "Заложите бюджет на прокладку OFH B38/B48 и EGR/AdBlue B47.",
    ),
  },
  f45: {
    summary: loc(
      "F45 is the 2 Series Active Tourer (2014–2021): front-drive MPV on UKL. Engines on this card: B38 218i, B48 220i (OFH gasket; early B48 plastic housing ~2017–19 class on related cars), B47 218d (EGR / AdBlue). Tall body changes usability, not the scored faults.",
      "F45 to Active Tourer serii 2 (2014–2021): MPV na napędzie UKL. Silniki na karcie: B38 218i, B48 220i (uszczelka OFH; wczesny plastik B48 ~2017–19 na pokrewnych), B47 218d (EGR / AdBlue). Wysokie nadwozie zmienia użyteczność, nie ocenione usterki.",
      "F45 — Active Tourer 2 серии (2014–2021): MPV на UKL. Моторы на карточке: B38 218i, B48 220i (прокладка OFH; ранний пластик B48 ~2017–19 на родственных), B47 218d (EGR / AdBlue). Высокий кузов меняет удобство, не оценённые поломки.",
    ),
    good: loc(
      "Later B48 years after early housing windows usually sit calmer than neglected B47 rows with EGR symptoms.",
      "Późniejsze lata B48 po oknach wczesnego korpusu zwykle są spokojniejsze niż zaniedbane B47 z objawami EGR.",
      "Поздние годы B48 после окон раннего корпуса обычно спокойнее заброшенных B47 с симптомами EGR.",
    ),
    bad: loc(
      "B38/B48 OFH and B47 EGR/AdBlue — FWD packaging does not remove those jobs.",
      "OFH B38/B48 i EGR/AdBlue B47 — układ FWD nie usuwa tych napraw.",
      "OFH B38/B48 и EGR/AdBlue B47 — компоновка FWD не убирает эти работы.",
    ),
  },
  g11: {
    summary: loc(
      "G11 is the sixth-generation 7 Series (2015–2022). Engines on this card: B57 730d (EGR / AdBlue family), B58 740i (OFH), N63 750i (coolant pipes / valve-stem themes by year). Luxury wear stacks on every fuel — confirm VIN campaigns and open the engine×year row.",
      "G11 to seria 7 VI generacji (2015–2022). Silniki na karcie: B57 730d (rodzina EGR / AdBlue), B58 740i (OFH), N63 750i (rury / uszczelniacze zależnie od roku). Zużycie luksusu dokładają się do każdego paliwa — potwierdź kampanie VIN i otwórz wiersz silnik×rok.",
      "G11 — шестое поколение 7 серии (2015–2022). Моторы на карточке: B57 730d (семья EGR / AdBlue), B58 740i (OFH), N63 750i (патрубки / колпачки по году). Износ люкса добавляется к любому топливу — подтвердите кампании VIN и откройте строку мотор×год.",
    ),
    good: loc(
      "B58 petrol rows without open OFH can look calmer than early N63 or neglected B57 EGR cars when modules behave.",
      "Wiersze B58 bez otwartego OFH mogą wyglądać spokojniej niż wczesne N63 lub zaniedbane B57 z EGR, gdy moduły działają.",
      "Строки B58 без открытого OFH могут выглядеть спокойнее ранних N63 или заброшенных B57 с EGR, если модули ведут себя.",
    ),
    bad: loc(
      "Budget B57 EGR/AdBlue, B58 OFH, N63 hot-V jobs by year, plus air suspension and electronics.",
      "Zaplanuj budżet na EGR/AdBlue B57, OFH B58, naprawy hot-V N63 zależnie od roku plus pneumatykę i elektronikę.",
      "Заложите бюджет на EGR/AdBlue B57, OFH B58, работы hot-V N63 по году плюс пневмо и электрику.",
    ),
  },
  g22: {
    summary: loc(
      "G22 is the second-generation 4 Series coupe (2020–). Engines on this card: B48 420i/430i (OFH gasket; early plastic housing class on related cars) and B58 M440i (OFH). Open the engine×year row — a 430i badge does not name B48 revisions.",
      "G22 to drugie coupe serii 4 (2020–). Silniki na karcie: B48 420i/430i (uszczelka OFH; klasa wczesnego plastiku na pokrewnych) i B58 M440i (OFH). Otwórz wiersz silnik×rok — znaczek 430i nie nazywa rewizji B48.",
      "G22 — второе купе 4 серии (2020–). Моторы на карточке: B48 420i/430i (прокладка OFH; класс раннего пластика на родственных) и B58 M440i (OFH). Откройте строку мотор×год — шильдик 430i не называет ревизии B48.",
    ),
    good: loc(
      "Later mid-cycle B48/B58 years without open OFH usually score calmer than known housing-bump years.",
      "Późniejsze lata mid-cycle B48/B58 bez otwartego OFH zwykle oceniają się spokojniej niż znane lata korpusu.",
      "Поздние mid-cycle годы B48/B58 без открытого OFH обычно спокойнее известных лет корпуса.",
    ),
    bad: loc(
      "Budget B48/B58 oil-filter housing leaks — confirm oil on the undertray before you trust a clean bay photo.",
      "Zaplanuj budżet na wycieki OFH B48/B58 — sprawdź olej na osłonie, zanim zaufasz czystemu zdjęciu komory.",
      "Заложите бюджет на течи OFH B48/B58 — проверьте масло на защите, прежде чем верить чистому фото отсека.",
    ),
  },
  g23: {
    summary: loc(
      "G23 is the G22 convertible with the same B48/B58 scored engines. Roof hydraulics and drains are extra; OFH risk does not change with the soft top. Cycle the roof, then open the engine×year row.",
      "G23 to cabrio G22 z tymi samymi ocenionymi B48/B58. Hydraulika dachu i odpływy są dodatkowe; ryzyko OFH nie zmienia się z dachem. Zrób cykl dachu, potem otwórz wiersz silnik×rok.",
      "G23 — кабриолет G22 с теми же оценёнными B48/B58. Гидравлика крыши и сливы дополнительные; риск OFH не меняется из‑за крыши. Сделайте цикл крыши, затем откройте строку мотор×год.",
    ),
    good: loc(
      "Same scored B48/B58 rows as G22 once that year exists.",
      "Gdy rok istnieje — te same ocenione wiersze B48/B58 co G22.",
      "Когда год существует — те же оценённые строки B48/B58, что G22.",
    ),
    bad: loc(
      "Roof wear plus the same OFH housing jobs as the coupe.",
      "Zużycie dachu plus te same naprawy OFH co coupe.",
      "Износ крыши плюс те же работы OFH, что у купе.",
    ),
  },
  g26: {
    summary: loc(
      "G26 is the 4 Series Gran Coupé (2021–) sharing G22’s B48/B58 themes. Four doors change usability, not OFH. Confirm the engine plate and check oil on the undertray.",
      "G26 to Gran Coupé serii 4 (2021–) dzielące tematy B48/B58 z G22. Cztery drzwi zmieniają użyteczność, nie OFH. Potwierdź tabliczkę i sprawdź olej na osłonie.",
      "G26 — Gran Coupé 4 серии (2021–) с темами B48/B58 как G22. Четыре двери меняют удобство, не OFH. Подтвердите шильдик и проверьте масло на защите.",
    ),
    good: loc(
      "Same B48/B58 evidence table as G22 with four-door practicality.",
      "Ta sama tabela dowodów B48/B58 co G22 z praktycznością czterech drzwi.",
      "Та же таблица доказательств B48/B58, что G22, с практичностью четырёх дверей.",
    ),
    bad: loc(
      "Same OFH bills as G22 — plus hatch-seal salt on a lift.",
      "Te same rachunki OFH co G22 — plus sól na uszczelkach hatcha na podnośniku.",
      "Те же счета OFH, что G22 — плюс соль на уплотнениях хэтча на подъёмнике.",
    ),
  },
  g60: {
    summary: loc(
      "G60 is the eighth-generation 5 Series sedan (2024–). Engines on this card: B48 520i and B58 540i — OFH gasket family (and late B48 coolant-bushing SIB class on very new related years). Too new for long fleet history; still confirm oil on the undertray and open the engine×year row.",
      "G60 to sedan serii 5 VIII generacji (2024–). Silniki na karcie: B48 520i i B58 540i — rodzina uszczelki OFH (i późna tuleja B48 SIB na bardzo nowych pokrewnych). Za nowe na długą historię floty; i tak sprawdź olej na osłonie i otwórz wiersz silnik×rok.",
      "G60 — седан восьмого поколения 5 серии (2024–). Моторы на карточке: B48 520i и B58 540i — семья прокладки OFH (и поздняя втулка B48 SIB на очень новых родственных). Слишком новые для длинной истории флота; всё равно проверьте масло на защите и откройте строку мотор×год.",
    ),
    good: loc(
      "Modern B58 rows can score calmly when OFH is dry and software campaigns are closed on VIN.",
      "Nowoczesne wiersze B58 potrafią ocenić się spokojnie, gdy OFH jest suche i kampanie software zamknięte na VIN.",
      "Современные строки B58 могут оцениваться спокойно, если OFH сухой и софт-кампании закрыты по VIN.",
    ),
    bad: loc(
      "Budget B48/B58 OFH checks — new does not mean leak-free.",
      "Zaplanuj budżet na kontrolę OFH B48/B58 — nowe nie znaczy bez wycieków.",
      "Заложите бюджет на проверку OFH B48/B58 — новое не значит без течей.",
    ),
  },
  u11: {
    summary: loc(
      "U11 is the third-generation X1 (2022–) on UKL. Engines on this card: B38 18i, B48 20i (OFH gasket family), B47 20d (EGR / AdBlue). Confirm the engine plate, check oil on the undertray, and listen for xDrive shudder when fitted.",
      "U11 to trzecie X1 (2022–) na UKL. Silniki na karcie: B38 18i, B48 20i (rodzina uszczelki OFH), B47 20d (EGR / AdBlue). Potwierdź tabliczkę, sprawdź olej na osłonie i posłuchaj drżenia xDrive, gdy jest.",
      "U11 — третий X1 (2022–) на UKL. Моторы на карточке: B38 18i, B48 20i (семья прокладки OFH), B47 20d (EGR / AdBlue). Подтвердите шильдик, проверьте масло на защите и послушайте дрожь xDrive, если он есть.",
    ),
    good: loc(
      "Modern B48 rows without open OFH can score calmly with a real service book.",
      "Nowoczesne wiersze B48 bez otwartego OFH potrafią ocenić się spokojnie przy prawdziwej książce.",
      "Современные строки B48 без открытого OFH могут оцениваться спокойно при настоящей книге.",
    ),
    bad: loc(
      "B38/B48 OFH and B47 EGR/AdBlue — plus transfer-case checks on xDrive.",
      "OFH B38/B48 i EGR/AdBlue B47 — plus skrzynka na xDrive.",
      "OFH B38/B48 и EGR/AdBlue B47 — плюс раздатка на xDrive.",
    ),
  },
  "e46-m3": {
    summary: loc(
      "E46 M3 (2000–2006) is the S54 inline-six M3. Sourced themes: VANOS seals/unit and preventative rod bearings. Confirm the engine plate and service history for VANOS work before you set a budget — age rust still ends more purchases than the motor itself.",
      "E46 M3 (2000–2006) to M3 z rzędową szóstką S54. Tematy ze źródłami: uszczelnienia/jednostka VANOS i profilaktyczne panewki. Potwierdź tabliczkę i historię VANOS przed budżetem — rdza wieku nadal kończy więcej zakupów niż sam silnik.",
      "E46 M3 (2000–2006) — M3 с рядной шестёркой S54. Темы по источникам: уплотнения/блок VANOS и профилактические вкладыши. Подтвердите шильдик и историю VANOS до бюджета — возрастная ржавчина срывает больше сделок, чем сам мотор.",
    ),
    good: loc(
      "S54 rows have sourced VANOS and bearing repair bands — specialists know the car in Poland.",
      "Wiersze S54 mają pasma VANOS i panewek ze źródłami — specjaliści w Polsce znają ten samochód.",
      "Строки S54 имеют полосы VANOS и вкладышей по источникам — специалисты в Польше знают эту машину.",
    ),
    bad: loc(
      "Budget VANOS and rod-bearing work, plus sill/subframe rust after salt.",
      "Zaplanuj budżet na VANOS i panewki plus rdzę progów/belki po soli.",
      "Заложите бюджет на VANOS и вкладыши плюс ржавчину порогов/подрамника после соли.",
    ),
  },
  "e60-m5": {
    summary: loc(
      "E60 M5 (2005–2010) is the S85 V10. Sourced themes: rod bearings, SMG III pump motor, and individual throttle actuators. Confirm SMG behaviour and bearing history before you buy — electronics and clutch packs stack on top of the engine row.",
      "E60 M5 (2005–2010) to V10 S85. Tematy ze źródłami: panewki, pompka SMG III i przepustnice ITB. Potwierdź zachowanie SMG i historię panewek przed zakupem — elektronika i sprzęgła dokładają się do wiersza silnika.",
      "E60 M5 (2005–2010) — V10 S85. Темы по источникам: вкладыши, насос SMG III и дроссели ITB. Подтвердите поведение SMG и историю вкладышей до покупки — электрика и сцепления добавляются к строке мотора.",
    ),
    good: loc(
      "Sourced repair bands exist for bearings, SMG pump, and ITB — you can budget from the card.",
      "Są pasma napraw ze źródłami dla panewek, pompki SMG i ITB — budżetujesz z karty.",
      "Есть полосы ремонта по источникам для вкладышей, насоса SMG и ITB — бюджет с карточки.",
    ),
    bad: loc(
      "Rod bearings, SMG pump, and throttle actuators — a cheap M5 often matches that list.",
      "Panewki, pompka SMG i przepustnice — tanie M5 często odpowiada tej liście.",
      "Вкладыши, насос SMG и дроссели — дешёвый M5 часто соответствует этому списку.",
    ),
  },
  "e9x-m3": {
    summary: loc(
      "E9x M3 (2007–2013) is the S65 V8. Sourced themes: rod bearings and individual throttle actuators. Confirm bearing service and ITB behaviour before inspection — subframe rust and ELV themes from the E90 family still apply on the body.",
      "E9x M3 (2007–2013) to V8 S65. Tematy ze źródłami: panewki i przepustnice ITB. Potwierdź serwis panewek i zachowanie ITB przed oględzinami — rdza belki i ELV z rodziny E90 nadal dotyczą nadwozia.",
      "E9x M3 (2007–2013) — V8 S65. Темы по источникам: вкладыши и дроссели ITB. Подтвердите сервис вкладышей и поведение ITB до осмотра — ржавчина подрамника и ELV семьи E90 по‑прежнему касаются кузова.",
    ),
    good: loc(
      "S65 bearing and ITB bands are sourced — specialists and parts exist in Poland.",
      "Pasma panewek i ITB S65 są ze źródłami — specjaliści i części są w Polsce.",
      "Полосы вкладышей и ITB S65 по источникам — специалисты и запчасти есть в Польше.",
    ),
    bad: loc(
      "Rod bearings and throttle actuators — plus E9x subframe rust after Polish salt.",
      "Panewki i przepustnice — plus rdza belki E9x po polskiej soli.",
      "Вкладыши и дроссели — плюс ржавчина подрамника E9x после польской соли.",
    ),
  },
  f80: {
    summary: loc(
      "F80 M3 (2014–2018) is the S55 twin-turbo six. Sourced themes: rod bearings and crank-hub slip (friction hub). Confirm hub/bearing history and listen for cold-start chatter before you open the wallet — OFH gasket leaks also appear on this family.",
      "F80 M3 (2014–2018) to biturbo S55. Tematy ze źródłami: panewki i poślizg piasty wału (friction hub). Potwierdź historię piasty/panewek i posłuchaj zimnego startu przed zakupem — wycieki uszczelki OFH też bywają w tej rodzinie.",
      "F80 M3 (2014–2018) — битурбо S55. Темы по источникам: вкладыши и проскальзывание ступицы коленвала (friction hub). Подтвердите историю ступицы/вкладышей и послушайте холодный старт до покупки — течи прокладки OFH тоже бывают в этой семье.",
    ),
    good: loc(
      "S55 bearing and crank-hub bands are sourced so you can compare years on the card.",
      "Pasma panewek i piasty S55 są ze źródłami — porównasz lata na karcie.",
      "Полосы вкладышей и ступицы S55 по источникам — сравните годы на карточке.",
    ),
    bad: loc(
      "Budget rod bearings and crank-hub work — a low asking price often matches unpaid labour.",
      "Zaplanuj budżet na panewki i piastę — niska cena często oznacza nieopłaconą robociznę.",
      "Заложите бюджет на вкладыши и ступицу — низкая цена часто значит неоплаченный труд.",
    ),
  },
  f82: {
    summary: loc(
      "F82 M4 (2014–2020) shares the F80 S55 themes: rod bearings and crank-hub slip. Coupe body and fewer listings change the market, not the friction hub. Confirm service history before a track-day story sells you the car.",
      "F82 M4 (2014–2020) dzieli tematy S55 z F80: panewki i poślizg piasty. Nadwozie coupe i mniej ogłoszeń zmieniają rynek, nie friction hub. Potwierdź historię serwisową, zanim historia torowa sprzeda ci auto.",
      "F82 M4 (2014–2020) делит темы S55 с F80: вкладыши и проскальзывание ступицы. Купе и меньше объявлений меняют рынок, не friction hub. Подтвердите сервисную историю, прежде чем трековая история продаст вам машину.",
    ),
    good: loc(
      "Same sourced S55 bearing/hub evidence as F80 when you want the coupe.",
      "Te same dowody panewek/piasty S55 co F80, gdy chcesz coupe.",
      "Те же доказательства вкладышей/ступицы S55, что F80, если нужно купе.",
    ),
    bad: loc(
      "Rod bearings and crank hub — plus fewer clean examples than the M3 sedan.",
      "Panewki i piasta — plus mniej czystych egzemplarzy niż sedan M3.",
      "Вкладыши и ступица — плюс меньше чистых экземпляров, чем у седана M3.",
    ),
  },
  f87: {
    summary: loc(
      "F87 M2 (2016–2021) spans N55 (early) and S55 (Competition / later). Scored themes: water pump/OFH on N55 rows; rod bearings and crank hub on S55. Confirm which motor is in the bay before you budget — the M2 badge does not name N55 versus S55.",
      "F87 M2 (2016–2021) obejmuje N55 (wczesne) i S55 (Competition / późniejsze). Tematy: pompa/OFH na N55; panewki i piasta na S55. Potwierdź motor w komorze przed budżetem — znaczek M2 nie nazywa N55 kontra S55.",
      "F87 M2 (2016–2021) охватывает N55 (ранние) и S55 (Competition / поздние). Темы: помпа/OFH на N55; вкладыши и ступица на S55. Подтвердите мотор в отсеке до бюджета — шильдик M2 не называет N55 против S55.",
    ),
    good: loc(
      "Later S55 rows with documented hub/bearing work can be budgeted from sourced bands.",
      "Późniejsze wiersze S55 z udokumentowaną piastą/panewkami da się budżetować z pasm ze źródłami.",
      "Поздние строки S55 с документированной ступицей/вкладышами можно бюджетировать по полосам из источников.",
    ),
    bad: loc(
      "N55 cooling/OFH or S55 bearings/hub — confirm the plate first.",
      "Chłodzenie/OFH N55 albo panewki/piasta S55 — najpierw tabliczka.",
      "Охлаждение/OFH N55 или вкладыши/ступица S55 — сначала шильдик.",
    ),
  },
  "f10-m5": {
    summary: loc(
      "F10 M5 (2011–2016) is the S63 V8. Sourced themes include rod bearings and early hot-V valve-stem oil smoke. Confirm bearing and oil-consumption history before a low asking price sells you the car.",
      "F10 M5 (2011–2016) to V8 S63. Tematy ze źródłami obejmują panewki i dymienie oleju z uszczelniaczy wczesnego hot-V. Potwierdź historię panewek i spalania oleju, zanim niska cena sprzeda ci auto.",
      "F10 M5 (2011–2016) — V8 S63. Темы по источникам включают вкладыши и дымление масла с колпачков раннего hot-V. Подтвердите историю вкладышей и расхода масла, прежде чем низкая цена продаст вам машину.",
    ),
    good: loc(
      "S63 bearing and valve-stem bands are sourced so you can compare years.",
      "Pasma panewek i uszczelniaczy S63 są ze źródłami — porównasz lata.",
      "Полосы вкладышей и колпачков S63 по источникам — сравните годы.",
    ),
    bad: loc(
      "Rod bearings and valve-stem oil use — budget before you buy mileage.",
      "Panewki i spalanie oleju z uszczelniaczy — budżet przed zakupem przebiegu.",
      "Вкладыши и расход масла с колпачков — бюджет до покупки пробега.",
    ),
  },
  f90: {
    summary: loc(
      "F90 M5 (2017–2023) continues the S63 V8 theme with sourced rod-bearing risk across the generation. Confirm bearing service and oil history; xDrive examples still need a quiet transfer-case check on tight turns.",
      "F90 M5 (2017–2023) kontynuuje temat V8 S63 ze źródłowym ryzykiem panewek w generacji. Potwierdź serwis panewek i historię oleju; xDrive nadal wymaga cichej skrzynki na ciasnych manewrach.",
      "F90 M5 (2017–2023) продолжает тему V8 S63 с риском вкладышей по источникам в поколении. Подтвердите сервис вкладышей и историю масла; xDrive по‑прежнему требует тихой раздатки на крутых манёврах.",
    ),
    good: loc(
      "Sourced S63 bearing bands let you compare this generation with F10 M5 honestly.",
      "Pasma panewek S63 ze źródłami pozwalają uczciwie porównać tę generację z F10 M5.",
      "Полосы вкладышей S63 по источникам позволяют честно сравнить это поколение с F10 M5.",
    ),
    bad: loc(
      "Rod bearings — and transfer-case wear on xDrive — before you trust a track-prep listing.",
      "Panewki — i skrzynka na xDrive — zanim zaufasz ogłoszeniu po torze.",
      "Вкладыши — и раздатка на xDrive — прежде чем верить объявлению после трека.",
    ),
  },
  "e30-m3": {
    summary: loc(
      "E30 M3 (1986–1991) is the S14 four-cylinder M3. Sourced theme on this card is classic cooling / water pump. After decades of salt, body rust and neglected cooling usually outcost engine work — inspect on a lift before you buy a project.",
      "E30 M3 (1986–1991) to M3 z czwórką S14. Temat ze źródłem na karcie to klasyczne chłodzenie / pompa. Po dekadach soli rdza nadwozia i zaniedbane chłodzenie zwykle kosztują więcej niż silnik — oglądaj na podnośniku przed projektem.",
      "E30 M3 (1986–1991) — M3 с четвёркой S14. Тема по источнику на карточке — классическое охлаждение / помпа. После десятилетий соли ржавчина кузова и заброшенное охлаждение обычно дороже мотора — осмотр на подъёмнике до проекта.",
    ),
    good: loc(
      "S14 cooling parts and specialists still exist for this classic.",
      "Części chłodzenia S14 i specjaliści nadal są dla tego klasyka.",
      "Детали охлаждения S14 и специалисты для этого классика ещё есть.",
    ),
    bad: loc(
      "Age rust and classic cooling — asking-price medians before ~2009 stay thin without a paid feed.",
      "Rdza wieku i klasyczne chłodzenie — mediany cen sprzed ~2009 są cienkie bez płatnego źródła.",
      "Возрастная ржавчина и классическое охлаждение — медианы цен до ~2009 тонкие без платного источника.",
    ),
  },
  "e39-m5": {
    summary: loc(
      "E39 M5 (1998–2003) is the S62 V8. Sourced theme: rod bearings. Confirm bearing service and cooling condition — E39 age rust and plastics still end purchases next to the motor.",
      "E39 M5 (1998–2003) to V8 S62. Temat ze źródłem: panewki. Potwierdź serwis panewek i stan chłodzenia — rdza wieku E39 i plastik nadal kończą zakupy obok silnika.",
      "E39 M5 (1998–2003) — V8 S62. Тема по источнику: вкладыши. Подтвердите сервис вкладышей и состояние охлаждения — возрастная ржавчина E39 и пластик по‑прежнему срывают сделки рядом с мотором.",
    ),
    good: loc(
      "S62 bearing bands are sourced so you can budget the known job.",
      "Pasma panewek S62 są ze źródłami — budżetujesz znaną naprawę.",
      "Полосы вкладышей S62 по источникам — бюджетируете известную работу.",
    ),
    bad: loc(
      "Rod bearings plus E39 cooling plastics and sill rust after salt.",
      "Panewki plus plastik chłodzenia E39 i rdza progów po soli.",
      "Вкладыши плюс пластик охлаждения E39 и ржавчина порогов после соли.",
    ),
  },
  "e82-1m": {
    summary: loc(
      "E82 1M (2011–2012) is the N54 limited coupe. Sourced theme matches early N54 HPFP / injector window. Confirm pump and injector history — the 1M badge does not remove the N54 fuel-system job.",
      "E82 1M (2011–2012) to limitowane coupe N54. Temat ze źródłem jak wczesne okno HPFP / wtrysków N54. Potwierdź historię pompy i wtrysków — znaczek 1M nie usuwa naprawy układu paliwowego N54.",
      "E82 1M (2011–2012) — лимитированное купе N54. Тема по источнику как раннее окно HPFP / форсунок N54. Подтвердите историю помпы и форсунок — шильдик 1M не убирает работу топливной системы N54.",
    ),
    good: loc(
      "HPFP/injector bands are sourced — you can price the known N54 work.",
      "Pasma HPFP/wtrysków są ze źródłami — wycenisz znaną naprawę N54.",
      "Полосы HPFP/форсунок по источникам — оцените известную работу N54.",
    ),
    bad: loc(
      "Budget HPFP and injectors — plus coupe door seals and limited supply.",
      "Zaplanuj budżet na HPFP i wtryski — plus uszczelki drzwi coupe i ograniczona podaż.",
      "Заложите бюджет на HPFP и форсунки — плюс уплотнители дверей купе и ограниченное предложение.",
    ),
  },
  f85: {
    summary: loc(
      "F85 X5 M (2015–2019) is the S63 SAV. Sourced headline on this card is transfer-case / xDrive wear (engine themes follow the S63 family). Listen for shudder on tight turns before you open the engine row.",
      "F85 X5 M (2015–2019) to SAV S63. Nagłówek ze źródłem na karcie to zużycie skrzynki / xDrive (tematy silnika jak rodzina S63). Posłuchaj drżenia na ciasnych manewrach, zanim otworzysz wiersz silnika.",
      "F85 X5 M (2015–2019) — SAV S63. Заголовок по источнику на карточке — износ раздатки / xDrive (темы мотора как семья S63). Послушайте дрожь на крутых манёврах, прежде чем открывать строку мотора.",
    ),
    good: loc(
      "You can compare S63 M SAV running costs against F86 using the same transfer-case check.",
      "Możesz porównać koszty M SAV S63 z F86 tą samą kontrolą skrzynki.",
      "Можно сравнить расходы M SAV S63 с F86 той же проверкой раздатки.",
    ),
    bad: loc(
      "Transfer-case wear plus S63 hot-V bills — heavy and expensive if neglected.",
      "Zużycie skrzynki plus rachunki hot-V S63 — ciężkie i drogie gdy zaniedbane.",
      "Износ раздатки плюс счета hot-V S63 — тяжёлые и дорогие при забросе.",
    ),
  },
  f86: {
    summary: loc(
      "F86 X6 M (2015–2019) shares F85’s S63 / transfer-case story in a coupe roof. Fewer listings change the market, not xDrive shudder or hot-V oil themes.",
      "F86 X6 M (2015–2019) dzieli historię S63 / skrzynki z F85 w dachu coupe. Mniej ogłoszeń zmienia rynek, nie drżenie xDrive ani tematy oleju hot-V.",
      "F86 X6 M (2015–2019) делит историю S63 / раздатки с F85 в крыше купе. Меньше объявлений меняют рынок, не дрожь xDrive и не темы масла hot-V.",
    ),
    good: loc(
      "Same transfer-case evidence as F85 when you want the coupe body.",
      "Te same dowody skrzynki co F85, gdy chcesz coupe.",
      "Те же доказательства раздатки, что F85, если нужно купе.",
    ),
    bad: loc(
      "Transfer case and S63 bills — plus fewer clean examples than X5 M.",
      "Skrzynka i rachunki S63 — plus mniej czystych egzemplarzy niż X5 M.",
      "Раздатка и счета S63 — плюс меньше чистых экземпляров, чем у X5 M.",
    ),
  },
  f97: {
    summary: loc(
      "F97 X3 M (2019–) is the S58 performance SAV. Sourced headline here is transfer-case / xDrive; rod-bearing themes exist on the S58 family. Confirm quiet xDrive and bearing history before you buy mileage.",
      "F97 X3 M (2019–) to sportowy SAV S58. Nagłówek ze źródłem to skrzynka / xDrive; tematy panewek są w rodzinie S58. Potwierdź ciche xDrive i historię panewek przed zakupem przebiegu.",
      "F97 X3 M (2019–) — спортивный SAV S58. Заголовок по источнику — раздатка / xDrive; темы вкладышей есть в семье S58. Подтвердите тихий xDrive и историю вкладышей до покупки пробега.",
    ),
    good: loc(
      "Modern S58 rows can be compared with G80/G82 using the same bearing evidence.",
      "Nowoczesne wiersze S58 da się porównać z G80/G82 tymi samymi dowodami panewek.",
      "Современные строки S58 можно сравнить с G80/G82 теми же доказательствами вкладышей.",
    ),
    bad: loc(
      "Transfer-case wear and S58 bearing budget before a track-prep listing.",
      "Zużycie skrzynki i budżet panewek S58 przed ogłoszeniem po torze.",
      "Износ раздатки и бюджет вкладышей S58 до объявления после трека.",
    ),
  },
  g80: {
    summary: loc(
      "G80 M3 (2021–) is the S58 sedan. Sourced theme: rod bearings. Confirm bearing service and software campaigns on VIN — too new for long fleet failure curves, but the bearing band is already on the card.",
      "G80 M3 (2021–) to sedan S58. Temat ze źródłem: panewki. Potwierdź serwis panewek i kampanie software na VIN — za nowe na długie krzywe awarii floty, ale pasmo panewek już jest na karcie.",
      "G80 M3 (2021–) — седан S58. Тема по источнику: вкладыши. Подтвердите сервис вкладышей и софт-кампании по VIN — слишком новые для длинных кривых отказов флота, но полоса вкладышей уже на карточке.",
    ),
    good: loc(
      "S58 bearing bands are sourced so you can budget before a high asking price.",
      "Pasma panewek S58 są ze źródłami — budżetujesz przed wysoką ceną.",
      "Полосы вкладышей S58 по источникам — бюджетируете до высокой цены.",
    ),
    bad: loc(
      "Rod bearings — new M cars still need a real inspection budget.",
      "Panewki — nowe M nadal wymagają realnego budżetu oględzin.",
      "Вкладыши — новые M по‑прежнему требуют реального бюджета на осмотр.",
    ),
  },
  g81: {
    summary: loc(
      "G81 is the G80 M3 Touring with the same S58 bearing theme. Salt and load-area rust add body checks; the motor risk does not change with the boot.",
      "G81 to Touring G80 M3 z tym samym tematem panewek S58. Sól i rdza bagażnika dodają oględziny nadwozia; ryzyko silnika nie zmienia się z bagażnikiem.",
      "G81 — универсал G80 M3 с той же темой вкладышей S58. Соль и ржавчина багажника добавляют осмотр кузова; риск мотора не меняется из‑за багажника.",
    ),
    good: loc(
      "Same S58 evidence as G80 with Touring space.",
      "Te same dowody S58 co G80 z przestrzenią Touring.",
      "Те же доказательства S58, что G80, с пространством Touring.",
    ),
    bad: loc(
      "Rod bearings plus more salt in the load bay than the sedan.",
      "Panewki plus więcej soli w bagażniku niż sedan.",
      "Вкладыши плюс больше соли в багажнике, чем у седана.",
    ),
  },
  g82: {
    summary: loc(
      "G82 M4 (2021–) shares G80’s S58 rod-bearing theme in a coupe. Confirm bearing history — the M4 badge does not remove that job.",
      "G82 M4 (2021–) dzieli temat panewek S58 z G80 w coupe. Potwierdź historię panewek — znaczek M4 nie usuwa tej naprawy.",
      "G82 M4 (2021–) делит тему вкладышей S58 с G80 в купе. Подтвердите историю вкладышей — шильдик M4 не убирает эту работу.",
    ),
    good: loc(
      "Same S58 bearing evidence as G80 when you want the coupe.",
      "Te same dowody panewek S58 co G80, gdy chcesz coupe.",
      "Те же доказательства вкладышей S58, что G80, если нужно купе.",
    ),
    bad: loc(
      "Rod bearings — plus fewer clean listings than the M3 sedan.",
      "Panewki — plus mniej czystych ogłoszeń niż sedan M3.",
      "Вкладыши — плюс меньше чистых объявлений, чем у седана M3.",
    ),
  },
  g87: {
    summary: loc(
      "G87 M2 (2023–) is the S58 compact coupe. Sourced theme: rod bearings. Too new for long history; still confirm hub/bearing chatter stories against the service book before you buy.",
      "G87 M2 (2023–) to kompaktowe coupe S58. Temat ze źródłem: panewki. Za nowe na długą historię; i tak konfrontuj historie hałasu piasty/panewek z książką serwisową przed zakupem.",
      "G87 M2 (2023–) — компактное купе S58. Тема по источнику: вкладыши. Слишком новые для длинной истории; всё равно сверяйте истории шума ступицы/вкладышей с сервисной книгой до покупки.",
    ),
    good: loc(
      "Same S58 bearing band family as G80/G82 on a smaller chassis.",
      "Ta sama rodzina pasm panewek S58 co G80/G82 na mniejszym podwoziu.",
      "Та же семья полос вкладышей S58, что G80/G82, на меньшем шасси.",
    ),
    bad: loc(
      "Rod bearings — new does not mean free of the known S58 job.",
      "Panewki — nowe nie znaczy wolne od znanej naprawy S58.",
      "Вкладыши — новое не значит без известной работы S58.",
    ),
  },
  g90: {
    summary: loc(
      "G90 M5 (2024–) uses S68. Sourced note on this card is too-new / limited field evidence — scores stay honest about thin history. Confirm campaigns on VIN and treat any “bulletproof” listing as marketing.",
      "G90 M5 (2024–) używa S68. Nota ze źródłem na karcie: zbyt nowe / mało dowodów z pola — oceny uczciwie mówią o cienkiej historii. Potwierdź kampanie na VIN i traktuj „niezniszczalne” ogłoszenia jako marketing.",
      "G90 M5 (2024–) использует S68. Заметка по источнику на карточке: слишком новые / мало полевых данных — оценки честно говорят о тонкой истории. Подтвердите кампании по VIN и считайте «неубиваемые» объявления маркетингом.",
    ),
    good: loc(
      "The card names S68 and the too-new limit so you do not invent a failure curve.",
      "Karta nazywa S68 i limit zbyt-nowe, żeby nie wymyślać krzywej awarii.",
      "Карточка называет S68 и лимит слишком-новые, чтобы не выдумывать кривую отказов.",
    ),
    bad: loc(
      "Thin sourced history — budget inspection and VIN campaigns, not folklore.",
      "Cienka historia ze źródłami — budżet na oględziny i kampanie VIN, nie folklor.",
      "Тонкая история по источникам — бюджет на осмотр и кампании VIN, не фольклор.",
    ),
  },
  i3: {
    summary: loc(
      "i3 (2013–2022) is BMW’s carbon-tub city EV. Sourced themes are HV battery generations: 60Ah (~2013–16), 94Ah (~2017–18), 120Ah (~2019–22). Confirm the battery capacity on the plate/VIN before you compare asking prices — REx cars add a small petrol maintainer, not a different HV story.",
      "i3 (2013–2022) to miejskie EV z wanną carbon. Tematy ze źródłami to generacje baterii HV: 60Ah (~2013–16), 94Ah (~2017–18), 120Ah (~2019–22). Potwierdź pojemność na tabliczce/VIN przed porównaniem cen — REx dokłada mały benzynowy dogrzewacz, nie inną historię HV.",
      "i3 (2013–2022) — городской EV с карбоновой ванной. Темы по источникам — поколения батареи HV: 60Ah (~2013–16), 94Ah (~2017–18), 120Ah (~2019–22). Подтвердите ёмкость на шильдике/VIN до сравнения цен — REx добавляет маленький бензиновый доводчик, не другую историю HV.",
    ),
    good: loc(
      "Later 120Ah rows usually have more usable range when the pack health report is clean.",
      "Późniejsze wiersze 120Ah zwykle mają więcej zasięgu, gdy raport zdrowia pakietu jest czysty.",
      "Поздние строки 120Ah обычно дают больше запаса хода при чистом отчёте здоровья пакета.",
    ),
    bad: loc(
      "HV battery replacement cost by generation — open the year row before you buy a cheap early 60Ah.",
      "Koszt wymiany baterii HV zależnie od generacji — otwórz wiersz roku, zanim kupisz tanie wczesne 60Ah.",
      "Стоимость замены батареи HV по поколению — откройте строку года, прежде чем купить дешёвый ранний 60Ah.",
    ),
  },
  i4: {
    summary: loc(
      "i4 (2021–) is the G26-based EV. Sourced theme: HV battery (eDrive pack). Too new for long failure curves; still confirm pack health, charge history, and VIN campaigns before you treat a high score as a blank cheque.",
      "i4 (2021–) to EV na bazie G26. Temat ze źródłem: bateria HV (pakiet eDrive). Za nowe na długie krzywe awarii; i tak potwierdź zdrowie pakietu, historię ładowania i kampanie VIN, zanim potraktujesz wysoką ocenę jak czek in blanco.",
      "i4 (2021–) — EV на базе G26. Тема по источнику: батарея HV (пакет eDrive). Слишком новые для длинных кривых отказов; всё равно подтвердите здоровье пакета, историю зарядки и кампании VIN, прежде чем считать высокий балл бланковым чеком.",
    ),
    good: loc(
      "Sourced HV pack bands exist so you can compare years without inventing petrol faults.",
      "Są pasma pakietu HV ze źródłami — porównasz lata bez wymyślania usterek benzyny.",
      "Есть полосы пакета HV по источникам — сравните годы без выдуманных бензиновых поломок.",
    ),
    bad: loc(
      "HV battery cost and thin field history — verify pack health before purchase.",
      "Koszt baterii HV i cienka historia z pola — sprawdź zdrowie pakietu przed zakupem.",
      "Стоимость батареи HV и тонкая полевая история — проверьте здоровье пакета до покупки.",
    ),
  },
  i8: {
    summary: loc(
      "i8 (2014–2020) pairs a B38 three-cylinder with an electric drive. Sourced petrol theme on this card follows the OFH gasket family on B38. Confirm hybrid battery/service history and oil on the undertray — exotic does not mean leak-free.",
      "i8 (2014–2020) łączy trójkę B38 z napędem elektrycznym. Temat benzyny ze źródłem na karcie to rodzina uszczelki OFH na B38. Potwierdź historię baterii hybrydy/serwisu i olej na osłonie — egzotyka nie znaczy bez wycieków.",
      "i8 (2014–2020) сочетает тройку B38 с электроприводом. Тема бензина по источнику на карточке — семья прокладки OFH на B38. Подтвердите историю батареи гибрида/сервиса и масло на защите — экзотика не значит без течей.",
    ),
    good: loc(
      "B38 OFH is a known, budgetable job when the hybrid side is healthy.",
      "OFH B38 to znana, budżetowalna naprawa, gdy strona hybrydy jest zdrowa.",
      "OFH B38 — известная, бюджетируемая работа, если гибридная сторона здорова.",
    ),
    bad: loc(
      "OFH leaks plus hybrid/electronics complexity and scarce clean examples.",
      "Wycieki OFH plus złożoność hybrydy/elektroniki i rzadkie czyste egzemplarze.",
      "Течи OFH плюс сложность гибрида/электрики и редкие чистые экземпляры.",
    ),
  },
  "e85-z4": {
    summary: loc(
      "E85 Z4 (2002–2008) roadster. Engines on this card: M54 3.0i (cooling plastics) and N52 3.0si (electric water pump). Soft-top drains and sill rust matter as much as the motor — cycle the roof and lift-check before you buy.",
      "E85 Z4 (2002–2008) roadster. Silniki na karcie: M54 3.0i (plastik chłodzenia) i N52 3.0si (elektryczna pompa). Odpływy dachu i rdza progów liczą się jak silnik — cykl dachu i podnośnik przed zakupem.",
      "E85 Z4 (2002–2008) родстер. Моторы на карточке: M54 3.0i (пластик охлаждения) и N52 3.0si (электрическая помпа). Сливы крыши и ржавчина порогов важны как мотор — цикл крыши и подъёмник до покупки.",
    ),
    good: loc(
      "M54/N52 cooling jobs are known to Polish specialists.",
      "Naprawy chłodzenia M54/N52 są znane polskim specjalistom.",
      "Работы по охлаждению M54/N52 знакомы польским специалистам.",
    ),
    bad: loc(
      "Cooling plastics/pump plus roof leaks and age rust.",
      "Plastik/pompa chłodzenia plus nieszczelny dach i rdza wieku.",
      "Пластик/помпа охлаждения плюс течи крыши и возрастная ржавчина.",
    ),
  },
  "e89-z4": {
    summary: loc(
      "E89 Z4 (2009–2016). Engines on this card: N52 sDrive30i (water pump), N54 sDrive35i (HPFP/injectors), N20 sDrive28i (timing chain). Confirm the plate — 35i is not the same as 28i — then cycle the roof and open the engine×year row.",
      "E89 Z4 (2009–2016). Silniki na karcie: N52 sDrive30i (pompa), N54 sDrive35i (HPFP/wtryski), N20 sDrive28i (łańcuch). Potwierdź tabliczkę — 35i to nie 28i — potem cykl dachu i wiersz silnik×rok.",
      "E89 Z4 (2009–2016). Моторы на карточке: N52 sDrive30i (помпа), N54 sDrive35i (HPFP/форсунки), N20 sDrive28i (цепь). Подтвердите шильдик — 35i не 28i — затем цикл крыши и строка мотор×год.",
    ),
    good: loc(
      "N52 rows without open pump faults usually sit calmer than early N54 HPFP years.",
      "Wiersze N52 bez otwartej awarii pompy zwykle są spokojniejsze niż wczesne lata HPFP N54.",
      "Строки N52 без открытой поломки помпы обычно спокойнее ранних лет HPFP N54.",
    ),
    bad: loc(
      "N54 HPFP/injectors, N20 chain, N52 pump — plus soft-top drains.",
      "HPFP/wtryski N54, łańcuch N20, pompa N52 — plus odpływy dachu.",
      "HPFP/форсунки N54, цепь N20, помпа N52 — плюс сливы крыши.",
    ),
  },
  z3: {
    summary: loc(
      "Z3 (1995–2002) roadster. Scored theme on this card follows E36-class cooling plastics on M52. Soft-top and sill rust dominate ownership cost — inspect on a lift and cycle the roof before you celebrate a clean bay.",
      "Z3 (1995–2002) roadster. Temat na karcie to plastik chłodzenia klasy E36 na M52. Dach i rdza progów dominują koszty — oglądaj na podnośniku i zrób cykl dachu, zanim ucieszysz się czystą komorą.",
      "Z3 (1995–2002) родстер. Тема на карточке — пластик охлаждения класса E36 на M52. Крыша и ржавчина порогов доминируют в расходах — осмотр на подъёмнике и цикл крыши, прежде чем радоваться чистому отсеку.",
    ),
    good: loc(
      "M52 cooling parts are cheap and well known.",
      "Części chłodzenia M52 są tanie i dobrze znane.",
      "Детали охлаждения M52 дешёвые и хорошо известны.",
    ),
    bad: loc(
      "Age rust, soft-top leaks, and neglected cooling plastics.",
      "Rdza wieku, nieszczelny dach i zaniedbany plastik chłodzenia.",
      "Возрастная ржавчина, течи крыши и заброшенный пластик охлаждения.",
    ),
  },
  "z3-m-coupe": {
    summary: loc(
      "Z3 M Coupe (1998–2002) uses S54 themes (VANOS). Rare body, same motor risks as E46 M3-class VANOS — confirm history, then inspect the unique coupe structure for rust.",
      "Z3 M Coupe (1998–2002) korzysta z tematów S54 (VANOS). Rzadkie nadwozie, te same ryzyka silnika co VANOS klasy E46 M3 — potwierdź historię, potem sprawdź unikalną strukturę coupe pod kątem rdzy.",
      "Z3 M Coupe (1998–2002) использует темы S54 (VANOS). Редкий кузов, те же риски мотора, что VANOS класса E46 M3 — подтвердите историю, затем осмотрите уникальную структуру купе на ржавчину.",
    ),
    good: loc(
      "Sourced S54 VANOS bands apply when budgeting the motor.",
      "Pasma VANOS S54 ze źródłami stosujesz przy budżecie silnika.",
      "Полосы VANOS S54 по источникам применяете при бюджете мотора.",
    ),
    bad: loc(
      "VANOS work plus rare-body rust and scarce parts for the shell.",
      "VANOS plus rdza rzadkiego nadwozia i rzadkie części skorupy.",
      "VANOS плюс ржавчина редкого кузова и редкие детали оболочки.",
    ),
  },
  e63: {
    summary: loc(
      "E63/E64 6 Series (2003–2010). Engines on this card: N52 630i (water pump), N62 650i (Valvetronic / coolant — early lever window on related N62), M57 635d (swirl flaps). Coupe/cabrio complexity stacks on the engine row.",
      "E63/E64 seria 6 (2003–2010). Silniki na karcie: N52 630i (pompa), N62 650i (Valvetronic / chłodzenie — wczesne okno dźwigni na pokrewnym N62), M57 635d (klapy wirowe). Złożoność coupe/cabrio dokładają się do wiersza silnika.",
      "E63/E64 6 серия (2003–2010). Моторы на карточке: N52 630i (помпа), N62 650i (Valvetronic / охлаждение — раннее окно рычагов на родственном N62), M57 635d (вихревые заслонки). Сложность купе/кабрио добавляется к строке мотора.",
    ),
    good: loc(
      "N52 rows without open pump faults usually sit calmer than early N62 Valvetronic years.",
      "Wiersze N52 bez otwartej awarii pompy zwykle są spokojniejsze niż wczesne lata Valvetronic N62.",
      "Строки N52 без открытой поломки помпы обычно спокойнее ранних лет Valvetronic N62.",
    ),
    bad: loc(
      "N62 Valvetronic/coolant, M57 swirl flaps, N52 pump — plus roof/electronics on cabrios.",
      "Valvetronic/chłodzenie N62, klapy M57, pompa N52 — plus dach/elektronika w cabrio.",
      "Valvetronic/охлаждение N62, заслонки M57, помпа N52 — плюс крыша/электрика у кабрио.",
    ),
  },
  e65: {
    summary: loc(
      "E65 7 Series (2001–2008) introduced iDrive complexity. Engine on this card: N62 745i (Valvetronic / coolant themes). Electronics and air suspension often outcost the motor — read the engine row, then budget modules.",
      "E65 seria 7 (2001–2008) wprowadziła złożoność iDrive. Silnik na karcie: N62 745i (tematy Valvetronic / chłodzenie). Elektronika i pneumatyka często kosztują więcej niż silnik — czytaj wiersz silnika, potem budżetuj moduły.",
      "E65 7 серия (2001–2008) ввела сложность iDrive. Мотор на карточке: N62 745i (темы Valvetronic / охлаждение). Электрика и пневмо часто дороже мотора — читайте строку мотора, затем бюджетируйте модули.",
    ),
    good: loc(
      "N62 jobs are documented so you are not inventing a mystery V8 bill.",
      "Naprawy N62 są udokumentowane — nie wymyślasz tajemniczego rachunku V8.",
      "Работы N62 документированы — вы не выдумываете таинственный счёт V8.",
    ),
    bad: loc(
      "N62 Valvetronic/coolant plus iDrive and air-suspension wear.",
      "Valvetronic/chłodzenie N62 plus iDrive i zużycie pneumatyki.",
      "Valvetronic/охлаждение N62 плюс iDrive и износ пневмо.",
    ),
  },
  f13: {
    summary: loc(
      "F13 6 Series (2011–2018). Engines on this card: N55 640i (water pump), N63 650i (hot-V coolant pipes), N57 640d (timing). Coupe complexity on top of F01-class engines — open the engine×year row before you buy.",
      "F13 seria 6 (2011–2018). Silniki na karcie: N55 640i (pompa), N63 650i (rury hot-V), N57 640d (łańcuch). Złożoność coupe na silnikach klasy F01 — otwórz wiersz silnik×rok przed zakupem.",
      "F13 6 серия (2011–2018). Моторы на карточке: N55 640i (помпа), N63 650i (патрубки hot-V), N57 640d (цепь). Сложность купе на моторах класса F01 — откройте строку мотор×год до покупки.",
    ),
    good: loc(
      "N55/N57 rows without open faults usually beat early N63 hot-V years.",
      "Wiersze N55/N57 bez otwartych usterek zwykle biją wczesne lata hot-V N63.",
      "Строки N55/N57 без открытых неисправностей обычно лучше ранних лет hot-V N63.",
    ),
    bad: loc(
      "N63 valley pipes, N57 timing, N55 pump — plus scarce clean coupes.",
      "Rury N63, łańcuch N57, pompa N55 — plus rzadkie czyste coupe.",
      "Патрубки N63, цепь N57, помпа N55 — плюс редкие чистые купе.",
    ),
  },
  g15: {
    summary: loc(
      "G15 8 Series (2018–). Engines on this card: B58 840i (OFH) and N63 850i (coolant pipes / valve-stem themes by year). Confirm the plate and open the engine×year row — luxury wear stacks on both.",
      "G15 seria 8 (2018–). Silniki na karcie: B58 840i (OFH) i N63 850i (rury / uszczelniacze zależnie od roku). Potwierdź tabliczkę i otwórz wiersz silnik×rok — zużycie luksusu dokładają się do obu.",
      "G15 8 серия (2018–). Моторы на карточке: B58 840i (OFH) и N63 850i (патрубки / колпачки по году). Подтвердите шильдик и откройте строку мотор×год — износ люкса добавляется к обоим.",
    ),
    good: loc(
      "B58 rows without open OFH can look calmer than early N63 years when modules behave.",
      "Wiersze B58 bez otwartego OFH mogą wyglądać spokojniej niż wczesne lata N63, gdy moduły działają.",
      "Строки B58 без открытого OFH могут выглядеть спокойнее ранних лет N63, если модули ведут себя.",
    ),
    bad: loc(
      "B58 OFH and N63 hot-V jobs — plus tyre and brake costs scores do not fully price.",
      "OFH B58 i naprawy hot-V N63 — plus opony i hamulce, których oceny w pełni nie wyceniają.",
      "OFH B58 и работы hot-V N63 — плюс шины и тормоза, которые оценки полностью не оценивают.",
    ),
  },
  g42: {
    summary: loc(
      "G42 2 Series coupe (2021–). Engines on this card: B48 220i (OFH) and B58 M240i (OFH). Open the engine×year row — the badge does not name B48 revisions.",
      "G42 coupe serii 2 (2021–). Silniki na karcie: B48 220i (OFH) i B58 M240i (OFH). Otwórz wiersz silnik×rok — znaczek nie nazywa rewizji B48.",
      "G42 купе 2 серии (2021–). Моторы на карточке: B48 220i (OFH) и B58 M240i (OFH). Откройте строку мотор×год — шильдик не называет ревизии B48.",
    ),
    good: loc(
      "Later B48/B58 years without open OFH usually score calmer than known housing-bump years.",
      "Późniejsze lata B48/B58 bez otwartego OFH zwykle oceniają się spokojniej niż znane lata korpusu.",
      "Поздние годы B48/B58 без открытого OFH обычно спокойнее известных лет корпуса.",
    ),
    bad: loc(
      "Budget B48/B58 OFH — check oil on the undertray before you trust a clean bay photo.",
      "Zaplanuj budżet na OFH B48/B58 — sprawdź olej na osłonie, zanim zaufasz czystemu zdjęciu komory.",
      "Заложите бюджет на OFH B48/B58 — проверьте масло на защите, прежде чем верить чистому фото отсека.",
    ),
  },
  g70: {
    summary: loc(
      "G70 7 Series (2022–). Engine on this card: B58 740i (OFH). Too new for long fleet curves; still confirm oil on the undertray and VIN campaigns before you celebrate a high score.",
      "G70 seria 7 (2022–). Silnik na karcie: B58 740i (OFH). Za nowe na długie krzywe floty; i tak potwierdź olej na osłonie i kampanie VIN, zanim ucieszysz się wysoką oceną.",
      "G70 7 серия (2022–). Мотор на карточке: B58 740i (OFH). Слишком новые для длинных кривых флота; всё равно подтвердите масло на защите и кампании VIN, прежде чем радоваться высокому баллу.",
    ),
    good: loc(
      "Modern B58 can score calmly when OFH is dry and modules behave.",
      "Nowoczesne B58 potrafi ocenić się spokojnie, gdy OFH jest suche i moduły działają.",
      "Современный B58 может оцениваться спокойно, если OFH сухой и модули ведут себя.",
    ),
    bad: loc(
      "OFH checks plus luxury electronics/air suspension that scores do not fully price.",
      "Kontrola OFH plus elektronika/pneumatyka luksusu, której oceny w pełni nie wyceniają.",
      "Проверка OFH плюс электрика/пневмо люкса, которые оценки полностью не оценивают.",
    ),
  },
  e12: {
    summary: loc(
      "E12 is the first 5 Series (1972–1981). Engines on this card: M30 528i — scored theme: classic cooling / water pump. After decades of salt, body rust and neglected cooling usually outcost the motor — inspect on a lift. Sourced scores stay thin; do not invent modern chain/EGR stories.",
      "E12 to pierwsza seria 5 (1972–1981). Silniki na karcie: M30 528i — temat: klasyczne chłodzenie / pompa wody. Po dekadach soli rdza nadwozia i zaniedbane chłodzenie zwykle kosztują więcej niż silnik — oglądaj na podnośniku. Oceny ze źródłami są cienkie; nie wymyślaj współczesnych historii łańcucha/EGR.",
      "E12 — первая 5 серия (1972–1981). Моторы на карточке: M30 528i — тема: классическое охлаждение / помпа. После десятилетий соли ржавчина кузова и заброшенное охлаждение обычно дороже мотора — осмотр на подъёмнике. Оценки по источникам тонкие; не выдумывайте современные истории цепи/EGR.",
    ),
    good: loc(
      "Cooling parts and classic specialists still exist when the shell is dry.",
      "Części chłodzenia i specjaliści klasyków nadal są, gdy skorupa jest sucha.",
      "Детали охлаждения и специалисты по классике ещё есть, если оболочка сухая.",
    ),
    bad: loc(
      "Age rust and classic cooling — asking medians before ~2009 stay thin without a paid feed.",
      "Rdza wieku i klasyczne chłodzenie — mediany cen sprzed ~2009 są cienkie bez płatnego źródła.",
      "Возрастная ржавчина и классическое охлаждение — медианы цен до ~2009 тонкие без платного источника.",
    ),
  },
  e21: {
    summary: loc(
      "E21 is the first 3 Series (1975–1983). Engines on this card: M20 320i — scored theme: classic cooling / water pump. After decades of salt, body rust and neglected cooling usually outcost the motor — inspect on a lift. Sourced scores stay thin; do not invent modern chain/EGR stories.",
      "E21 to pierwsza seria 3 (1975–1983). Silniki na karcie: M20 320i — temat: klasyczne chłodzenie / pompa wody. Po dekadach soli rdza nadwozia i zaniedbane chłodzenie zwykle kosztują więcej niż silnik — oglądaj na podnośniku. Oceny ze źródłami są cienkie; nie wymyślaj współczesnych historii łańcucha/EGR.",
      "E21 — первая 3 серия (1975–1983). Моторы на карточке: M20 320i — тема: классическое охлаждение / помпа. После десятилетий соли ржавчина кузова и заброшенное охлаждение обычно дороже мотора — осмотр на подъёмнике. Оценки по источникам тонкие; не выдумывайте современные истории цепи/EGR.",
    ),
    good: loc(
      "Cooling parts and classic specialists still exist when the shell is dry.",
      "Części chłodzenia i specjaliści klasyków nadal są, gdy skorupa jest sucha.",
      "Детали охлаждения и специалисты по классике ещё есть, если оболочка сухая.",
    ),
    bad: loc(
      "Age rust and classic cooling — asking medians before ~2009 stay thin without a paid feed.",
      "Rdza wieku i klasyczne chłodzenie — mediany cen sprzed ~2009 są cienkie bez płatnego źródła.",
      "Возрастная ржавчина и классическое охлаждение — медианы цен до ~2009 тонкие без платного источника.",
    ),
  },
  e23: {
    summary: loc(
      "E23 is the first modern 7 Series (1977–1986). Engines on this card: M30 735i — scored theme: classic cooling / water pump. After decades of salt, body rust and neglected cooling usually outcost the motor — inspect on a lift. Sourced scores stay thin; do not invent modern chain/EGR stories.",
      "E23 to pierwsza nowoczesna seria 7 (1977–1986). Silniki na karcie: M30 735i — temat: klasyczne chłodzenie / pompa wody. Po dekadach soli rdza nadwozia i zaniedbane chłodzenie zwykle kosztują więcej niż silnik — oglądaj na podnośniku. Oceny ze źródłami są cienkie; nie wymyślaj współczesnych historii łańcucha/EGR.",
      "E23 — первая современная 7 серия (1977–1986). Моторы на карточке: M30 735i — тема: классическое охлаждение / помпа. После десятилетий соли ржавчина кузова и заброшенное охлаждение обычно дороже мотора — осмотр на подъёмнике. Оценки по источникам тонкие; не выдумывайте современные истории цепи/EGR.",
    ),
    good: loc(
      "Cooling parts and classic specialists still exist when the shell is dry.",
      "Części chłodzenia i specjaliści klasyków nadal są, gdy skorupa jest sucha.",
      "Детали охлаждения и специалисты по классике ещё есть, если оболочка сухая.",
    ),
    bad: loc(
      "Age rust and classic cooling — asking medians before ~2009 stay thin without a paid feed.",
      "Rdza wieku i klasyczne chłodzenie — mediany cen sprzed ~2009 są cienkie bez płatnego źródła.",
      "Возрастная ржавчина и классическое охлаждение — медианы цен до ~2009 тонкие без платного источника.",
    ),
  },
  e24: {
    summary: loc(
      "E24 is the classic 6 Series coupe (1976–1989). Engines on this card: M30 635CSi — scored theme: classic cooling / water pump. After decades of salt, body rust and neglected cooling usually outcost the motor — inspect on a lift. Sourced scores stay thin; do not invent modern chain/EGR stories.",
      "E24 to klasyczne coupe serii 6 (1976–1989). Silniki na karcie: M30 635CSi — temat: klasyczne chłodzenie / pompa wody. Po dekadach soli rdza nadwozia i zaniedbane chłodzenie zwykle kosztują więcej niż silnik — oglądaj na podnośniku. Oceny ze źródłami są cienkie; nie wymyślaj współczesnych historii łańcucha/EGR.",
      "E24 — классическое купе 6 серии (1976–1989). Моторы на карточке: M30 635CSi — тема: классическое охлаждение / помпа. После десятилетий соли ржавчина кузова и заброшенное охлаждение обычно дороже мотора — осмотр на подъёмнике. Оценки по источникам тонкие; не выдумывайте современные истории цепи/EGR.",
    ),
    good: loc(
      "Cooling parts and classic specialists still exist when the shell is dry.",
      "Części chłodzenia i specjaliści klasyków nadal są, gdy skorupa jest sucha.",
      "Детали охлаждения и специалисты по классике ещё есть, если оболочка сухая.",
    ),
    bad: loc(
      "Age rust and classic cooling — asking medians before ~2009 stay thin without a paid feed.",
      "Rdza wieku i klasyczne chłodzenie — mediany cen sprzed ~2009 są cienkie bez płatnego źródła.",
      "Возрастная ржавчина и классическое охлаждение — медианы цен до ~2009 тонкие без платного источника.",
    ),
  },
  e28: {
    summary: loc(
      "E28 is the second 5 Series (1981–1988). Engines on this card: M30 528i — scored theme: classic cooling / water pump. After decades of salt, body rust and neglected cooling usually outcost the motor — inspect on a lift. Sourced scores stay thin; do not invent modern chain/EGR stories.",
      "E28 to druga seria 5 (1981–1988). Silniki na karcie: M30 528i — temat: klasyczne chłodzenie / pompa wody. Po dekadach soli rdza nadwozia i zaniedbane chłodzenie zwykle kosztują więcej niż silnik — oglądaj na podnośniku. Oceny ze źródłami są cienkie; nie wymyślaj współczesnych historii łańcucha/EGR.",
      "E28 — вторая 5 серия (1981–1988). Моторы на карточке: M30 528i — тема: классическое охлаждение / помпа. После десятилетий соли ржавчина кузова и заброшенное охлаждение обычно дороже мотора — осмотр на подъёмнике. Оценки по источникам тонкие; не выдумывайте современные истории цепи/EGR.",
    ),
    good: loc(
      "Cooling parts and classic specialists still exist when the shell is dry.",
      "Części chłodzenia i specjaliści klasyków nadal są, gdy skorupa jest sucha.",
      "Детали охлаждения и специалисты по классике ещё есть, если оболочка сухая.",
    ),
    bad: loc(
      "Age rust and classic cooling — asking medians before ~2009 stay thin without a paid feed.",
      "Rdza wieku i klasyczne chłodzenie — mediany cen sprzed ~2009 są cienkie bez płatnego źródła.",
      "Возрастная ржавчина и классическое охлаждение — медианы цен до ~2009 тонкие без платного источника.",
    ),
  },
  "e28-m5": {
    summary: loc(
      "E28 M5 is the first M5 (S38) (1985–1988). Engines on this card: S38 — scored theme: classic cooling / water pump. After decades of salt, body rust and neglected cooling usually outcost the motor — inspect on a lift. Sourced scores stay thin; do not invent modern chain/EGR stories.",
      "E28 M5 to pierwsze M5 (S38) (1985–1988). Silniki na karcie: S38 — temat: klasyczne chłodzenie / pompa wody. Po dekadach soli rdza nadwozia i zaniedbane chłodzenie zwykle kosztują więcej niż silnik — oglądaj na podnośniku. Oceny ze źródłami są cienkie; nie wymyślaj współczesnych historii łańcucha/EGR.",
      "E28 M5 — первый M5 (S38) (1985–1988). Моторы на карточке: S38 — тема: классическое охлаждение / помпа. После десятилетий соли ржавчина кузова и заброшенное охлаждение обычно дороже мотора — осмотр на подъёмнике. Оценки по источникам тонкие; не выдумывайте современные истории цепи/EGR.",
    ),
    good: loc(
      "Cooling parts and classic specialists still exist when the shell is dry.",
      "Części chłodzenia i specjaliści klasyków nadal są, gdy skorupa jest sucha.",
      "Детали охлаждения и специалисты по классике ещё есть, если оболочка сухая.",
    ),
    bad: loc(
      "Age rust and classic cooling — asking medians before ~2009 stay thin without a paid feed.",
      "Rdza wieku i klasyczne chłodzenie — mediany cen sprzed ~2009 są cienkie bez płatnego źródła.",
      "Возрастная ржавчина и классическое охлаждение — медианы цен до ~2009 тонкие без платного источника.",
    ),
  },
  e30: {
    summary: loc(
      "E30 is the second 3 Series (1983–1994). Engines on this card: M20 325i — scored theme: classic cooling / water pump. After decades of salt, body rust and neglected cooling usually outcost the motor — inspect on a lift. Sourced scores stay thin; do not invent modern chain/EGR stories.",
      "E30 to druga seria 3 (1983–1994). Silniki na karcie: M20 325i — temat: klasyczne chłodzenie / pompa wody. Po dekadach soli rdza nadwozia i zaniedbane chłodzenie zwykle kosztują więcej niż silnik — oglądaj na podnośniku. Oceny ze źródłami są cienkie; nie wymyślaj współczesnych historii łańcucha/EGR.",
      "E30 — вторая 3 серия (1983–1994). Моторы на карточке: M20 325i — тема: классическое охлаждение / помпа. После десятилетий соли ржавчина кузова и заброшенное охлаждение обычно дороже мотора — осмотр на подъёмнике. Оценки по источникам тонкие; не выдумывайте современные истории цепи/EGR.",
    ),
    good: loc(
      "Cooling parts and classic specialists still exist when the shell is dry.",
      "Części chłodzenia i specjaliści klasyków nadal są, gdy skorupa jest sucha.",
      "Детали охлаждения и специалисты по классике ещё есть, если оболочка сухая.",
    ),
    bad: loc(
      "Age rust and classic cooling — asking medians before ~2009 stay thin without a paid feed.",
      "Rdza wieku i klasyczne chłodzenie — mediany cen sprzed ~2009 są cienkie bez płatnego źródła.",
      "Возрастная ржавчина и классическое охлаждение — медианы цен до ~2009 тонкие без платного источника.",
    ),
  },
  e31: {
    summary: loc(
      "E31 is the 8 Series coupe (1989–1999). Engines on this card: M60 840i — scored theme: classic cooling / water pump. After decades of salt, body rust and neglected cooling usually outcost the motor — inspect on a lift. Sourced scores stay thin; do not invent modern chain/EGR stories.",
      "E31 to coupe serii 8 (1989–1999). Silniki na karcie: M60 840i — temat: klasyczne chłodzenie / pompa wody. Po dekadach soli rdza nadwozia i zaniedbane chłodzenie zwykle kosztują więcej niż silnik — oglądaj na podnośniku. Oceny ze źródłami są cienkie; nie wymyślaj współczesnych historii łańcucha/EGR.",
      "E31 — купе 8 серии (1989–1999). Моторы на карточке: M60 840i — тема: классическое охлаждение / помпа. После десятилетий соли ржавчина кузова и заброшенное охлаждение обычно дороже мотора — осмотр на подъёмнике. Оценки по источникам тонкие; не выдумывайте современные истории цепи/EGR.",
    ),
    good: loc(
      "Cooling parts and classic specialists still exist when the shell is dry.",
      "Części chłodzenia i specjaliści klasyków nadal są, gdy skorupa jest sucha.",
      "Детали охлаждения и специалисты по классике ещё есть, если оболочка сухая.",
    ),
    bad: loc(
      "Age rust and classic cooling — asking medians before ~2009 stay thin without a paid feed.",
      "Rdza wieku i klasyczne chłodzenie — mediany cen sprzed ~2009 są cienkie bez płatnego źródła.",
      "Возрастная ржавчина и классическое охлаждение — медианы цен до ~2009 тонкие без платного источника.",
    ),
  },
  e32: {
    summary: loc(
      "E32 is the second 7 Series (1986–1994). Engines on this card: M30 735i — scored theme: classic cooling / water pump. After decades of salt, body rust and neglected cooling usually outcost the motor — inspect on a lift. Sourced scores stay thin; do not invent modern chain/EGR stories.",
      "E32 to druga seria 7 (1986–1994). Silniki na karcie: M30 735i — temat: klasyczne chłodzenie / pompa wody. Po dekadach soli rdza nadwozia i zaniedbane chłodzenie zwykle kosztują więcej niż silnik — oglądaj na podnośniku. Oceny ze źródłami są cienkie; nie wymyślaj współczesnych historii łańcucha/EGR.",
      "E32 — вторая 7 серия (1986–1994). Моторы на карточке: M30 735i — тема: классическое охлаждение / помпа. После десятилетий соли ржавчина кузова и заброшенное охлаждение обычно дороже мотора — осмотр на подъёмнике. Оценки по источникам тонкие; не выдумывайте современные истории цепи/EGR.",
    ),
    good: loc(
      "Cooling parts and classic specialists still exist when the shell is dry.",
      "Części chłodzenia i specjaliści klasyków nadal są, gdy skorupa jest sucha.",
      "Детали охлаждения и специалисты по классике ещё есть, если оболочка сухая.",
    ),
    bad: loc(
      "Age rust and classic cooling — asking medians before ~2009 stay thin without a paid feed.",
      "Rdza wieku i klasyczne chłodzenie — mediany cen sprzed ~2009 są cienkie bez płatnego źródła.",
      "Возрастная ржавчина и классическое охлаждение — медианы цен до ~2009 тонкие без платного источника.",
    ),
  },
  e34: {
    summary: loc(
      "E34 is the third 5 Series (1988–1996). Engines on this card: M50 525i — scored theme: cooling plastics (E36-class). After decades of salt, body rust and neglected cooling usually outcost the motor — inspect on a lift. Sourced scores stay thin; do not invent modern chain/EGR stories.",
      "E34 to trzecia seria 5 (1988–1996). Silniki na karcie: M50 525i — temat: plastik chłodzenia (klasa E36). Po dekadach soli rdza nadwozia i zaniedbane chłodzenie zwykle kosztują więcej niż silnik — oglądaj na podnośniku. Oceny ze źródłami są cienkie; nie wymyślaj współczesnych historii łańcucha/EGR.",
      "E34 — третья 5 серия (1988–1996). Моторы на карточке: M50 525i — тема: пластик охлаждения (класс E36). После десятилетий соли ржавчина кузова и заброшенное охлаждение обычно дороже мотора — осмотр на подъёмнике. Оценки по источникам тонкие; не выдумывайте современные истории цепи/EGR.",
    ),
    good: loc(
      "Cooling parts and classic specialists still exist when the shell is dry.",
      "Części chłodzenia i specjaliści klasyków nadal są, gdy skorupa jest sucha.",
      "Детали охлаждения и специалисты по классике ещё есть, если оболочка сухая.",
    ),
    bad: loc(
      "Age rust and classic cooling — asking medians before ~2009 stay thin without a paid feed.",
      "Rdza wieku i klasyczne chłodzenie — mediany cen sprzed ~2009 są cienkie bez płatnego źródła.",
      "Возрастная ржавчина и классическое охлаждение — медианы цен до ~2009 тонкие без платного источника.",
    ),
  },
  "e34-m5": {
    summary: loc(
      "E34 M5 is the second M5 (S38) (1988–1995). Engines on this card: S38 — scored theme: classic cooling / water pump. After decades of salt, body rust and neglected cooling usually outcost the motor — inspect on a lift. Sourced scores stay thin; do not invent modern chain/EGR stories.",
      "E34 M5 to drugie M5 (S38) (1988–1995). Silniki na karcie: S38 — temat: klasyczne chłodzenie / pompa wody. Po dekadach soli rdza nadwozia i zaniedbane chłodzenie zwykle kosztują więcej niż silnik — oglądaj na podnośniku. Oceny ze źródłami są cienkie; nie wymyślaj współczesnych historii łańcucha/EGR.",
      "E34 M5 — второй M5 (S38) (1988–1995). Моторы на карточке: S38 — тема: классическое охлаждение / помпа. После десятилетий соли ржавчина кузова и заброшенное охлаждение обычно дороже мотора — осмотр на подъёмнике. Оценки по источникам тонкие; не выдумывайте современные истории цепи/EGR.",
    ),
    good: loc(
      "Cooling parts and classic specialists still exist when the shell is dry.",
      "Części chłodzenia i specjaliści klasyków nadal są, gdy skorupa jest sucha.",
      "Детали охлаждения и специалисты по классике ещё есть, если оболочка сухая.",
    ),
    bad: loc(
      "Age rust and classic cooling — asking medians before ~2009 stay thin without a paid feed.",
      "Rdza wieku i klasyczne chłodzenie — mediany cen sprzed ~2009 są cienkie bez płatnego źródła.",
      "Возрастная ржавчина и классическое охлаждение — медианы цен до ~2009 тонкие без платного источника.",
    ),
  },
  e38: {
    summary: loc(
      "E38 is the third 7 Series (1994–2001). Engines on this card: M62 740i — scored theme: cooling plastics (E39-class). After decades of salt, body rust and neglected cooling usually outcost the motor — inspect on a lift. Sourced scores stay thin; do not invent modern chain/EGR stories.",
      "E38 to trzecia seria 7 (1994–2001). Silniki na karcie: M62 740i — temat: plastik chłodzenia (klasa E39). Po dekadach soli rdza nadwozia i zaniedbane chłodzenie zwykle kosztują więcej niż silnik — oglądaj na podnośniku. Oceny ze źródłami są cienkie; nie wymyślaj współczesnych historii łańcucha/EGR.",
      "E38 — третья 7 серия (1994–2001). Моторы на карточке: M62 740i — тема: пластик охлаждения (класс E39). После десятилетий соли ржавчина кузова и заброшенное охлаждение обычно дороже мотора — осмотр на подъёмнике. Оценки по источникам тонкие; не выдумывайте современные истории цепи/EGR.",
    ),
    good: loc(
      "Cooling parts and classic specialists still exist when the shell is dry.",
      "Części chłodzenia i specjaliści klasyków nadal są, gdy skorupa jest sucha.",
      "Детали охлаждения и специалисты по классике ещё есть, если оболочка сухая.",
    ),
    bad: loc(
      "Age rust and classic cooling — asking medians before ~2009 stay thin without a paid feed.",
      "Rdza wieku i klasyczne chłodzenie — mediany cen sprzed ~2009 są cienkie bez płatnego źródła.",
      "Возрастная ржавчина и классическое охлаждение — медианы цен до ~2009 тонкие без платного источника.",
    ),
  },

  "e36-m3": {
    summary: loc(
      "E36 M3 is the second-generation M3 (1992–1999). In Europe you mostly meet S50 (early 3.0, later 3.2 with double VANOS); US cars use S52. Scores come from sourced cooling and VANOS repairs — not from inventing a market price. Confirm the engine code before you set a budget: double VANOS is a different bill than replacing aged cooling plastics. Body rust after road salt still ends more purchases than the engine itself.",
      "E36 M3 to druga generacja M3 (1992–1999). W Europie najczęściej spotkasz S50 (wczesne 3.0, później 3.2 z podwójnym VANOS); w USA jest S52. Oceny biorą się z udokumentowanych napraw chłodzenia i VANOS — nie z wymyślonej ceny rynkowej. Zanim ułożysz budżet, potwierdź kod silnika: podwójny VANOS to inny rachunek niż wymiana postarzałego plastiku chłodzenia. Rdza nadwozia po soli kończy więcej zakupów niż sam silnik.",
      "E36 M3 — второе поколение M3 (1992–1999). В Европе чаще всего S50 (ранний 3.0, позже 3.2 с двойным VANOS); в США — S52. Оценки из документированных ремонтов охлаждения и VANOS — не из выдуманной рыночной цены. Перед бюджетом подтвердите код мотора: двойной VANOS — другой счёт, чем замена состарившегося пластика охлаждения. Ржавчина кузова после соли срывает больше сделок, чем сам мотор.",
    ),
    good: loc(
      "S50 and S52 rows have sourced cooling and double-VANOS repair bands.",
      "Wiersze S50 i S52 mają pasma napraw chłodzenia i podwójnego VANOS ze źródłami.",
      "Строки S50 и S52 имеют полосы ремонта охлаждения и двойного VANOS по источникам.",
    ),
    bad: loc(
      "Age rust and, on European 3.2 cars, double VANOS. Asking-price medians before about 2009 stay empty without a paid market feed.",
      "Rdza wieku oraz — w europejskich 3.2 — podwójny VANOS. Mediany cen wywoławczych sprzed ok. 2009 zostają puste bez płatnego źródła rynku.",
      "Возрастная ржавчина и на европейских 3.2 — двойной VANOS. Медианы цен предложения до примерно 2009 пустые без платного рыночного источника.",
    ),
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
  g21: loc(
    "As a Touring, inspect on a lift: tailgate, rails, and salt in the load bay — same B48/B58 as G20.",
    "Jako Touring oglądaj na podnośniku: klapa, relingi i sól w bagażniku — te same B48/B58 co G20.",
    "Как универсал осматривайте на подъёмнике: крышка, рейлинги и соль в багажнике — те же B48/B58, что G20.",
  ),
  g31: loc(
    "As a Touring: more mileage and salt — same B47/B57/B48/B58 engines as the G30 sedan.",
    "Jako Touring: więcej kilometrów i soli — te same silniki B47/B57/B48/B58 co sedan G30.",
    "Как универсал: больше пробега и соли — те же моторы B47/B57/B48/B58, что седан G30.",
  ),
  f16: loc(
    "As an X6 coupe: fewer listings than X5 — same N55/N57/N63 and transfer-case checks as F15.",
    "Jako coupe X6: mniej ogłoszeń niż X5 — te same N55/N57/N63 i skrzynka co F15.",
    "Как купе X6: меньше объявлений, чем у X5 — те же N55/N57/N63 и раздатка, что F15.",
  ),
  g06: loc(
    "As an X6 coupe on the G05 family: same B57/B58 evidence, lower roof.",
    "Jako coupe X6 na rodzinie G05: te same dowody B57/B58, niższy dach.",
    "Как купе X6 на семье G05: те же доказательства B57/B58, ниже крыша.",
  ),
  g02: loc(
    "As an X4 coupe on the G01 family: same B47/B48/B58 evidence, lower roof.",
    "Jako coupe X4 na rodzinie G01: te same dowody B47/B48/B58, niższy dach.",
    "Как купе X4 на семье G01: те же доказательства B47/B48/B58, ниже крыша.",
  ),
  f36: loc(
    "As a Gran Coupé: four doors and a hatch — same N20/B48/B47 themes as the coupe, no N55 row on this card.",
    "Jako Gran Coupé: cztery drzwi i hatch — te same tematy N20/B48/B47 co coupe, bez wiersza N55 na tej karcie.",
    "Как Gran Coupé: четыре двери и хэтч — те же темы N20/B48/B47, что купе, без строки N55 на этой карточке.",
  ),
  f39: loc(
    "As an X2 coupe-crossover: fewer listings than X1 — same B38/B48/B47 themes as F48.",
    "Jako coupe-crossover X2: mniej ogłoszeń niż X1 — te same tematy B38/B48/B47 co F48.",
    "Как купе-кроссовер X2: меньше объявлений, чем у X1 — те же темы B38/B48/B47, что F48.",
  ),
  e88: loc(
    "As a convertible: cycle the roof and drains — same N52/N54/N55/N47 themes as the E82 coupe.",
    "Jako cabrio: cykl dachu i odpływy — te same tematy N52/N54/N55/N47 co coupe E82.",
    "Как кабриолет: цикл крыши и сливы — те же темы N52/N54/N55/N47, что купе E82.",
  ),
  f33: loc(
    "As a convertible: roof wear on top of the same F32 engine table.",
    "Jako cabrio: zużycie dachu obok tej samej tabeli silników F32.",
    "Как кабриолет: износ крыши поверх той же таблицы моторов F32.",
  ),
  f34: loc(
    "As a Gran Turismo: hatch practicality — same N20/B48/N47/B47 themes as F30.",
    "Jako Gran Turismo: praktyczność hatcha — te same tematy N20/B48/N47/B47 co F30.",
    "Как Gran Turismo: практичность хэтча — те же темы N20/B48/N47/B47, что F30.",
  ),
  g23: loc(
    "As a convertible on the G22 family: same B48/B58 OFH evidence, plus roof drains.",
    "Jako cabrio na rodzinie G22: te same dowody OFH B48/B58 plus odpływy dachu.",
    "Как кабриолет на семье G22: те же доказательства OFH B48/B58 плюс сливы крыши.",
  ),
  g26: loc(
    "As a Gran Coupé on the G22 family: same B48/B58 evidence, four doors.",
    "Jako Gran Coupé na rodzinie G22: te same dowody B48/B58, cztery drzwi.",
    "Как Gran Coupé на семье G22: те же доказательства B48/B58, четыре двери.",
  ),
  g81: loc(
    "As an M3 Touring: more salt in the load bay — same S58 bearing theme as G80.",
    "Jako Touring M3: więcej soli w bagażniku — ten sam temat panewek S58 co G80.",
    "Как универсал M3: больше соли в багажнике — та же тема вкладышей S58, что G80.",
  ),
  "e36-compact": loc(
    "As a Compact hatch: fewer listings — same M43/M52 cooling theme as E36.",
    "Jako hatch Compact: mniej ogłoszeń — ten sam temat chłodzenia M43/M52 co E36.",
    "Как хэтч Compact: меньше объявлений — та же тема охлаждения M43/M52, что E36.",
  ),
  "e46-compact": loc(
    "As a Compact hatch: fewer listings — same E46 cooling / diesel themes as the sedan.",
    "Jako hatch Compact: mniej ogłoszeń — te same tematy chłodzenia / diesla co sedan E46.",
    "Как хэтч Compact: меньше объявлений — те же темы охлаждения / дизеля, что седан E46.",
  ),

};

const ENGINES: Record<string, Band[]> = {
  "318i-N46": [
    band(
      2005,
      2007,
      "Early {code} {model} years with the {engine} wear timing-chain guides — an expensive guide job on this four-cylinder. Confirm N46 on the plate so you do not mix it with the later N43 318i; both badges can look the same on the boot. Budget the guides and a lift check for early E90 rust before you buy.",
      "Wczesne lata {code} {model} z {engine} zużywają ślizgi łańcucha rozrządu — droga naprawa ślizgów na tej czwórce. Potwierdź N46 na tabliczce, żeby nie pomylić z późniejszym 318i N43; oba znaczki na klapie wyglądają tak samo. Przed zakupem zaplanuj budżet na ślizgi i oględziny rdzy wczesnego E90 na podnośniku.",
      "It is a simple naturally aspirated four with a known guide repair and common parts in Poland.",
      "To prosty wolnossący R4 ze znaną naprawą ślizgów i łatwymi częściami w Polsce.",
      "Timing-guide wear, oil consumption, and early E90 subframe rust are the usual bills.",
      "Zużycie ślizgów, spalanie oleju i rdza belki wczesnego E90 to typowe rachunki.",
      "Ранние годы {code} {model} с {engine} изнашивают направляющие цепи ГРМ — дорогой ремонт направляющих на этой четвёрке. Подтвердите N46 на шильдике, чтобы не перепутать с поздним 318i N43; оба шильдика на крышке выглядят одинаково. До покупки заложите бюджет на направляющие и осмотр ржавчины раннего E90 на подъёмнике.",
      "Это простой атмосферный R4 с известным ремонтом направляющих и обычными запчастями в Польше.",
      "Износ направляющих, расход масла и ржавчина подрамника раннего E90 — типичные счета.",
    ),
  ],
  "318i-N43": [
    band(
      2007,
      2011,
      "Direct-injection {engine} under the {model} badge is a different car from the earlier N46. Injectors and the NOx sensor are the typical expensive jobs; parts cost more than on an N52 six. Confirm N43 on the plate before you copy an N46 shopping list.",
      "Wtrysk bezpośredni {engine} pod znaczkiem {model} to inny samochód niż wcześniejsze N46. Wtryski i czujnik NOx to typowe drogie naprawy; części kosztują więcej niż przy szóstce N52. Potwierdź N43 na tabliczce, zanim skopiujesz listę zakupów spod N46.",
      "Later 318i years bring a bit more torque on paper and a known DI parts market in Poland.",
      "Późniejsze lata 318i dają na papierze trochę więcej momentu i znany rynek części DI w Polsce.",
      "Budget N43 injectors and NOx work; this is not the cheaper N46 petrol to keep.",
      "Zaplanuj budżet na wtryski i NOx N43; to nie tańsza w utrzymaniu benzyna N46.",
      "Непосредственный впрыск {engine} под шильдиком {model} — другая машина, чем ранний N46. Форсунки и датчик NOx — типичные дорогие работы; запчасти дороже, чем у шестёрки N52. Подтвердите N43 на шильдике, прежде чем копировать список покупок с N46.",
      "Поздние годы 318i дают на бумаге чуть больше момента и известный рынок DI-запчастей в Польше.",
      "Заложите бюджет на форсунки N43 и NOx; это не более дешёвый в содержании бензин N46.",
    ),
  ],
  "320i-N46": [
    band(
      2005,
      2007,
      "A {year} {model} with the {engine} shares the N46 family with 318i: timing-chain guides are the usual repair, not a high-pressure pump. It will not drive like a 330i six — do not pay N52 money for guide wear and early E90 rust. Check the guides and the subframe on a lift before inspection day ends.",
      "{year} {model} z {engine} dzieli rodzinę N46 z 318i: typowa naprawa to ślizgi łańcucha, nie pompa wysokiego ciśnienia. Nie pojedzie jak szóstka 330i — nie płać ceny N52 za zużyte ślizgi i rdzę wczesnego E90. Przed końcem oględzin sprawdź ślizgi i belkę na podnośniku.",
      "Independent workshops know the engine, and the 320i badge is easy to resell in Poland.",
      "Warsztaty niezależne znają silnik, a znaczek 320i łatwo odsprzedać w Polsce.",
      "Guide wear and typical E90 rust still apply; this is a four-cylinder, not a six.",
      "Zużycie ślizgów i typowa rdza E90 nadal obowiązują; to czwórka, nie szóstka.",
      "{year} {model} с {engine} делит семейство N46 с 318i: типичный ремонт — направляющие цепи, не ТНВД. Это не поедет как шестёрка 330i — не платите цену N52 за износ направляющих и ржавчину раннего E90. До конца осмотра проверьте направляющие и подрамник на подъёмнике.",
      "Независимые сервисы знают мотор, а шильдик 320i в Польше легко перепродать.",
      "Износ направляющих и типичная ржавчина E90 всё равно; это четвёрка, не шестёрка.",
    ),
  ],
  "320i-N43": [
    band(
      2007,
      2011,
      "From {year}, the {model} badge often sits on an {engine} with direct injection instead of the earlier N46. Injectors and NOx are the jobs to price; the calendar year alone does not prove the code. Confirm N43 on the VIN sticker before you buy.",
      "Od {year} znaczek {model} często siedzi na {engine} z wtryskiem bezpośrednim zamiast wcześniejszego N46. Wtryski i NOx to naprawy do wyceny; sam rok z kalendarza nie potwierdza kodu. Przed zakupem potwierdź N43 na naklejce VIN.",
      "Buyers who want the later 320i petrol badge still find parts and specialists in Poland.",
      "Kupujący późniejszą benzynę 320i nadal znajdują w Polsce części i specjalistów.",
      "Direct-injection four-cylinder bills stack up; N46 was the cheaper 320i to run day to day.",
      "Rachunki R4 z wtryskiem bezpośrednim się kumulują; tańszy w codziennym utrzymaniu 320i był N46.",
      "С {year} шильдик {model} часто стоит на {engine} с непосредственным впрыском вместо раннего N46. Форсунки и NOx — работы к оценке; одного календарного года недостаточно. До покупки подтвердите N43 на наклейке VIN.",
      "Покупатели позднего бензинового 320i по‑прежнему находят в Польше запчасти и специалистов.",
      "Счета четырёхцилиндрового DI накапливаются; более дешёвым в повседневном содержании 320i был N46.",
    ),
  ],
  "325i-N52": [
    band(
      2005,
      2007,
      "The smaller N52 six in a {year} {code} {model} usually fails on the electric water pump and thermostat, often with little warning — a cooling job, not engine-out. Subframe rust and CAS still apply like any E90. Treat the cooling system as the first inspection stop.",
      "Mniejsza szóstka N52 w {year} {code} {model} zwykle psuje się na elektrycznej pompie wody i termostacie, często bez ostrzeżenia — to naprawa chłodzenia, nie wyjęcie silnika. Rdza belki i CAS obowiązują jak w każdym E90. Na oględzinach zacznij od układu chłodzenia.",
      "It is a naturally aspirated inline-six with a known cooling job and common parts in Poland.",
      "To wolnossąca R6 ze znaną naprawą chłodzenia i powszechnymi częściami w Polsce.",
      "The pump can fail without warning, and rust plus ELV still hit every E90 body.",
      "Pompa może paść bez ostrzeżenia, a rdza i ELV nadal dotyczą każdego nadwozia E90.",
      "Меньшая шестёрка N52 в {year} {code} {model} обычно ломается на электрической помпе и термостате, часто почти без предупреждения — ремонт охлаждения, не снятие мотора. Ржавчина подрамника и CAS как у любого E90. На осмотре начните с системы охлаждения.",
      "Это атмосферная рядная шестёрка с известным ремонтом охлаждения и обычными запчастями в Польше.",
      "Помпа может отказать без предупреждения, а ржавчина и ELV всё равно бьют по любому кузову E90.",
    ),
  ],
  "325i-N53": [
    band(
      2007,
      2011,
      "Europe fitted direct injection on this naturally aspirated six: a {year} {model} with the {engine} is not the N52 water-pump story. Injectors and the high-pressure pump are the expensive jobs — confirm N53 on the plate. Check mixture faults and service history before you copy US N52 advice.",
      "Europa dała wtrysk bezpośredni na tej wolnossącej szóstce: {year} {model} z {engine} to nie historia pompy wody N52. Wtryski i pompa wysokiego ciśnienia to drogie naprawy — potwierdź N53 na tabliczce. Sprawdź błędy mieszanki i historię serwisową, zanim skopiujesz amerykańskie rady o N52.",
      "You still get a six-cylinder with more torque than N46 when the injection system is healthy.",
      "Nadal masz szóstkę z większym momentem niż N46, gdy układ wtrysku jest sprawny.",
      "Budget N53 injectors and the high-pressure pump; this is not the simpler N52 325i.",
      "Zaplanuj budżet na wtryski N53 i pompę wysokiego ciśnienia; to nie prostsze 325i N52.",
      "В Европе на этой атмосферной шестёрке стоял непосредственный впрыск: {year} {model} с {engine} — не история помпы N52. Форсунки и ТНВД — дорогие работы; подтвердите N53 на шильдике. Проверьте ошибки смеси и сервисную историю, прежде чем копировать американские советы про N52.",
      "Вы всё ещё получаете шестёрку с большим моментом, чем у N46, если впрыск в порядке.",
      "Заложите бюджет на форсунки N53 и ТНВД; это не более простой 325i N52.",
    ),
  ],
  "330i-N52": [
    band(
      2005,
      2007,
      "A {year} {code} {model} with the {engine} is the naturally aspirated six without a high-pressure pump. The usual failure is the electric water pump and thermostat — cooling work, not engine replacement. Parts and independent labour in Poland are easy; still inspect subframe rust and CAS. Do not confuse it with a later 330i N53.",
      "{year} {code} {model} z {engine} to wolnossąca szóstka bez pompy wysokiego ciśnienia. Typowa awaria to elektryczna pompa wody i termostat — chłodzenie, nie wymiana silnika. Części i niezależni w Polsce są łatwo dostępni; nadal sprawdź rdzę belki i CAS. Nie myl z późniejszym 330i N53.",
      "It is the simpler 330i six: cooling is a known job, not an engine-out invoice.",
      "To prostsza szóstka 330i: chłodzenie to znana naprawa, nie rachunek za wyjęcie silnika.",
      "The pump can fail without warning, and rust plus ELV still apply on every E90.",
      "Pompa może paść bez ostrzeżenia, a rdza i ELV nadal obowiązują na każdym E90.",
      "{year} {code} {model} с {engine} — атмосферная шестёрка без ТНВД. Обычный отказ — электрическая помпа и термостат: охлаждение, не замена мотора. Запчасти и независимые сервисы в Польше найти легко; всё равно проверьте ржавчину подрамника и CAS. Не путайте с поздней 330i N53.",
      "Это более простая шестёрка 330i: охлаждение — известный ремонт, не счёт за снятие мотора.",
      "Помпа может отказать без предупреждения, а ржавчина и ELV всё равно на любом E90.",
    ),
  ],
  "330i-N53": [
    band(
      2007,
      2011,
      "Same 330i badge as N52, different engine: the {engine} puts direct injection on this six and fails more expensively than a water pump. Confirm N53 in the engine code before you trust a “buy a 330i” list that meant N52. Budget injectors and the high-pressure pump, then check the subframe like any E90.",
      "Ten sam znaczek 330i co N52, inny silnik: {engine} daje wtrysk bezpośredni na tej szóstce i psuje się drożej niż pompa wody. Potwierdź N53 w kodzie silnika, zanim zaufasz liście „bierz 330i”, która miała na myśli N52. Zaplanuj budżet na wtryski i pompę wysokiego ciśnienia, potem sprawdź belkę jak w każdym E90.",
      "You keep the 330i badge with later injection and specialists who already know the DI jobs in Poland.",
      "Zostaje znaczek 330i z nowszym wtryskiem i specjalistami, którzy w Polsce już znają naprawy DI.",
      "N53 injectors and the high-pressure pump are the typical costs — this is not the N52 water-pump story.",
      "Wtryski N53 i pompa wysokiego ciśnienia to typowe koszty — to nie historia pompy wody N52.",
      "Тот же шильдик 330i, что у N52, другой мотор: {engine} даёт непосредственный впрыск на этой шестёрке и ломается дороже помпы. Подтвердите N53 в коде мотора, прежде чем верить списку «берите 330i», где имелся в виду N52. Заложите бюджет на форсунки и ТНВД, затем проверьте подрамник как у любого E90.",
      "Вы сохраняете шильдик 330i с более новым впрыском и специалистами в Польше, которые уже знают DI-работы.",
      "Форсунки N53 и ТНВД — типичные расходы; это не история помпы воды N52.",
    ),
  ],
  "335i-N54": [
    band(
      2006,
      2010,
      "Twin-turbo {engine} under a {year} {model} badge means high-pressure pump and piezo injectors first — hard starts and limp mode are common signs. Wastegates and cooling add cost on top. Confirm N54 rather than N55 before you copy a repair list; the pump and injector jobs differ.",
      "Biturbo {engine} pod znaczkiem {year} {model} oznacza najpierw pompę wysokiego ciśnienia i wtryski piezo — trudny rozruch i tryb awaryjny to częste objawy. Wastegate’y i chłodzenie dokładają kosztu. Potwierdź N54, a nie N55, zanim skopiujesz listę napraw; pompa i wtryski różnią się zakresem.",
      "Specialists in Poland know the N54 jobs, and parts for this fast E90 are still common.",
      "Specjaliści w Polsce znają naprawy N54, a części do tego szybkiego E90 nadal są dostępne.",
      "High-pressure pump, injectors, and turbo work dominate the bill on a neglected example.",
      "Pompa wysokiego ciśnienia, wtryski i turbiny dominują rachunek przy zaniedbanym egzemplarzu.",
      "Битурбо {engine} под шильдиком {year} {model} значит сначала ТНВД и пьезофорсунки — трудный запуск и аварийный режим частые признаки. Вестгейты и охлаждение добавляют стоимость. Подтвердите N54, а не N55, прежде чем копировать список ремонтов; насос и форсунки отличаются.",
      "Специалисты в Польше знают работы по N54, а запчасти для этого быстрого E90 всё ещё обычны.",
      "ТНВД, форсунки и турбины доминируют в счёте на заброшенном экземпляре.",
    ),
  ],
  "335i-N55": [
    band(
      2010,
      2012,
      "Later {model} years with the single-turbo {engine} usually cost less than N54, but the electric water pump and thermostat remain the everyday cooling jobs. Confirm N55 on the plate before you reuse an N54 HPFP shopping list. Check cooling health and service history at pre-inspection.",
      "Późniejsze lata {model} z jednoturbinowym {engine} zwykle kosztują mniej niż N54, ale elektryczna pompa wody i termostat zostają codziennymi naprawami chłodzenia. Potwierdź N55 na tabliczce, zanim użyjesz listy zakupów HPFP spod N54. Na oględzinach sprawdź chłodzenie i historię serwisową.",
      "You avoid most N54 high-pressure-pump drama while keeping a turbo six that specialists know.",
      "Unikasz większości dramatów z pompą wysokiego ciśnienia N54 i zostajesz przy turbosześci, którą znają specjaliści.",
      "Cooling and turbo work still exist; this is not a cheap naturally aspirated six to keep.",
      "Chłodzenie i turbo nadal istnieją; to nie tania wolnossąca szóstka w utrzymaniu.",
      "Поздние годы {model} с одной турбиной {engine} обычно дешевле N54, но электрическая помпа и термостат остаются повседневными работами по охлаждению. Подтвердите N55 на шильдике, прежде чем брать список HPFP от N54. На предпродажном осмотре проверьте охлаждение и сервисную историю.",
      "Вы избегаете большинства драм с ТНВД N54 и остаётесь с турбошестёркой, которую знают специалисты.",
      "Охлаждение и турбина всё равно есть; это не дешёвая атмосферная шестёрка в содержании.",
    ),
  ],
  "318d-M47": [
    band(
      2005,
      2007,
      "Before N47, a {year} {code} {model} with the {engine} fails on swirl flaps that can break into the intake — flap and EGR work, not a gearbox-end chain replacement. Confirm M47 so you do not assume every 318d is the later chain diesel. Inspect flaps and the subframe on a lift.",
      "Przed N47 {year} {code} {model} z {engine} psuje się na klapach wirowych, które potrafią wpaść do dolotu — naprawa klap i EGR, nie wymiana łańcucha od skrzyni. Potwierdź M47, żeby nie zakładać, że każdy 318d to późniejszy diesel z łańcuchem. Sprawdź klapy i belkę na podnośniku.",
      "Pre-N47 diesels keep known flap jobs and common parts without the rear-chain lottery.",
      "Diesle przed N47 mają znane naprawy klap i powszechne części bez loterii łańcucha z tyłu.",
      "Budget swirl flaps and E90 rust; later 318d N47 is a different failure mode.",
      "Zaplanuj budżet na klapy wirowe i rdzę E90; późniejszy 318d N47 to inny tryb awarii.",
      "До N47 {year} {code} {model} с {engine} ломается на вихревых заслонках, которые могут попасть во впуск — работа по заслонкам и EGR, не замена цепи со стороны коробки. Подтвердите M47, чтобы не считать каждый 318d поздним цепным дизелем. Проверьте заслонки и подрамник на подъёмнике.",
      "Дизели до N47 сохраняют известные работы по заслонкам и обычные запчасти без лотереи задней цепи.",
      "Заложите бюджет на вихревые заслонки и ржавчину E90; поздний 318d N47 — другой режим отказа.",
    ),
  ],
  "318d-N47": [
    band(
      2007,
      2010,
      "Early N47 under a {year} {model} badge puts the timing chain at the gearbox end; a jump often means replacing the engine. High mileage in Poland raises the odds on these years. Ask what was done to the chain — or price a replacement — before you celebrate a low asking price.",
      "Wczesny N47 pod znaczkiem {year} {model} trzyma łańcuch rozrządu od strony skrzyni; przeskok często oznacza wymianę silnika. Wysoki przebieg w Polsce podnosi ryzyko w tych latach. Przed radością z niskiej ceny pytaj, co zrobiono z łańcuchem — albo wycen wymianę.",
      "It is cheap to buy and cheap to fuel, with parts and diesel specialists everywhere in Poland.",
      "Tanio kupić i tanio pali, a części i specjaliści diesla są w Polsce wszędzie.",
      "The rear timing chain on early N47 can end in engine replacement when it is still original.",
      "Łańcuch z tyłu na wczesnym N47 może skończyć się wymianą silnika, gdy nadal jest oryginalny.",
      "Ранний N47 под шильдиком {year} {model} держит цепь ГРМ со стороны коробки; перескок часто означает замену мотора. Большой пробег в Польше повышает шансы в эти годы. Прежде чем радоваться низкой цене, спросите, что сделали с цепью — или заложите замену.",
      "Его дёшево купить и дёшево кормить, а запчасти и дизельные специалисты в Польше везде.",
      "Задняя цепь на раннем N47 может закончиться заменой мотора, если она ещё родная.",
    ),
    band(
      2011,
      2012,
      "Later {year} {model} cars still use {engine}: slightly lower typical chain risk than 2007–2010, not a free pass. The chain remains at the back of the engine, and Polish mileage is often high. Ask for a chain inspection; do not treat a 2011 318d as an M47 flap diesel.",
      "Późniejsze {year} {model} nadal mają {engine}: trochę niższe typowe ryzyko łańcucha niż 2007–2010, nie zwolnienie z ryzyka. Łańcuch nadal siedzi z tyłu silnika, a przebiegi w Polsce często są wysokie. Poproś o oględziny łańcucha; nie traktuj 318d z 2011 jak diesla M47 z klapami.",
      "A later N47 still runs cheap day to day with easy fuel economy on Polish roads.",
      "Późniejszy N47 nadal jest tani na co dzień i oszczędny w polskim ruchu.",
      "It is still a rear-chain diesel; “updated” on a listing is not proof the chain was repaired.",
      "Nadal jest dieslem z łańcuchem z tyłu; „poprawiony” w ogłoszeniu nie dowodzi naprawy łańcucha.",
      "Поздние {year} {model} по‑прежнему с {engine}: типичный риск цепи чуть ниже, чем 2007–2010, не индульгенция. Цепь всё ещё сзади мотора, а пробег в Польше часто большой. Попросите осмотр цепи; не считайте 318d 2011 года дизелем M47 с заслонками.",
      "Поздний N47 по‑прежнему дёшев каждый день и экономичен в польском трафике.",
      "Это по‑прежнему дизель с задней цепью; «обновлённый» в объявлении не доказывает ремонт цепи.",
    ),
  ],
  "320d-M47": [
    band(
      2005,
      2007,
      "A 2005–2007 {model} with the {engine} is the pre-N47 320d: swirl flaps are the typical fault, not a gearbox-end chain. Confirm M47 on the engine plate — a 2008 320d is a different motor. Price flap and EGR work, then check rust on a lift.",
      "{model} 2005–2007 z {engine} to 320d sprzed N47: typowa usterka to klapy wirowe, nie łańcuch od skrzyni. Potwierdź M47 na tabliczce silnika — 320d z 2008 to inny motor. Wycen klapy i EGR, potem sprawdź rdzę na podnośniku.",
      "You get the 320d badge without the N47 rear-chain lottery, and flap jobs are well known in Poland.",
      "Dostajesz znaczek 320d bez loterii łańcucha N47, a naprawy klap są w Polsce dobrze znane.",
      "Swirl flaps, EGR, and body rust still cost money on a high-mileage Polish example.",
      "Klapy wirowe, EGR i rdza nadwozia nadal kosztują przy wysokim przebiegu w Polsce.",
      "{model} 2005–2007 с {engine} — 320d до N47: типичная поломка — вихревые заслонки, не цепь со стороны коробки. Подтвердите M47 на шильдике — 320d 2008 года другой мотор. Оцените заслонки и EGR, затем ржавчину на подъёмнике.",
      "Вы получаете шильдик 320d без лотереи задней цепи N47, а работы по заслонкам в Польше хорошо известны.",
      "Вихревые заслонки, EGR и ржавчина кузова всё равно стоят денег на большом польском пробеге.",
    ),
  ],
  "320d-N47": [
    band(
      2007,
      2010,
      "This is the common E90 diesel in Poland and the reason year and engine split on this site: a {year} {model} with the {engine} puts the timing chain at the rear of the engine. Snap or jump often means replacing the motor, especially on early years with high mileage. A low asking price is not a saving if the chain is original — confirm it is not an M47 320d.",
      "To częsty diesel E90 w Polsce i powód, dla którego ten serwis dzieli rok i silnik: {year} {model} z {engine} trzyma łańcuch rozrządu z tyłu silnika. Pęknięcie albo przeskok często oznacza wymianę motoru, zwłaszcza we wczesnych latach z wysokim przebiegiem. Niska cena nie jest oszczędnością, gdy łańcuch jest oryginalny — potwierdź, że to nie 320d M47.",
      "It is everywhere on OTOMOTO, cheap to fuel, and diesel specialists know the chain job.",
      "Jest wszędzie na OTOMOTO, tanio pali, a specjaliści diesla znają naprawę łańcucha.",
      "The rear chain on early N47 is the higher-risk 320d story when service history is thin.",
      "Łańcuch z tyłu na wczesnym N47 to historia 320d o wyższym ryzyku, gdy historia serwisowa jest cienka.",
      "Это частый дизель E90 в Польше и причина, почему сайт делит год и мотор: {year} {model} с {engine} держит цепь ГРМ сзади двигателя. Обрыв или перескок часто означает замену мотора, особенно в ранние годы с большим пробегом. Низкая цена не экономия, если цепь родная — подтвердите, что это не 320d M47.",
      "Он везде на OTOMOTO, дёшево кормить, а дизельные специалисты знают работу по цепи.",
      "Задняя цепь на раннем N47 — история 320d с более высоким риском при тонкой сервисной истории.",
    ),
    band(
      2011,
      2012,
      "A later {year} {model} N47 320d still carries a gearbox-end chain — slightly lower typical risk than 2007–2010, not risk-free. Polish mileage is often still high. Ask what was done to the chain, or price a replacement, before you buy.",
      "Późniejszy {year} {model} 320d N47 nadal ma łańcuch od skrzyni — trochę niższe typowe ryzyko niż 2007–2010, nie bez ryzyka. Przebiegi w Polsce nadal często są wysokie. Przed zakupem pytaj, co zrobiono z łańcuchem, albo wycen wymianę.",
      "Many buyers still hunt this badge with a later year and day-to-day fuel economy.",
      "Wielu kupujących nadal szuka tego znaczka z późniejszym rokiem i codzienną oszczędnością paliwa.",
      "It remains an N47 chain diesel; a facelift listing is not proof of a repaired timing chain.",
      "Nadal jest dieslem z łańcuchem N47; ogłoszenie z liftem nie dowodzi naprawionego rozrządu.",
      "Поздний {year} {model} 320d N47 по‑прежнему с цепью со стороны коробки — типичный риск чуть ниже, чем 2007–2010, не без риска. Пробег в Польше часто всё ещё большой. До покупки спросите, что сделали с цепью, или заложите замену.",
      "Многие покупатели всё ещё ищут этот шильдик с более поздним годом и повседневной экономией топлива.",
      "Это по‑прежнему дизель с цепью N47; объявление с рестайлингом не доказывает отремонтированную цепь ГРМ.",
    ),
  ],
  "325d-M57": [
    band(
      2006,
      2010,
      "Six-cylinder {engine} under a {year} {model} badge fails on swirl flaps that can break into the intake — a different fault from an N47 rear chain. Injector and swirl work still costs real money. Confirm M57 so you do not buy a 320d with a 325d sticker.",
      "Dieslowska szóstka {engine} pod znaczkiem {year} {model} psuje się na klapach wirowych, które potrafią wpaść do dolotu — inna usterka niż łańcuch N47 z tyłu. Praca na wtryskach i klapach nadal kosztuje realne pieniądze. Potwierdź M57, żeby nie kupić 320d z naklejką 325d.",
      "The M57 six is stronger than a 320d and keeps known specialists and parts in Poland.",
      "Szóstka M57 jest mocniejsza niż 320d i ma w Polsce znanych specjalistów oraz części.",
      "Swirl flaps and diesel service bills still stack; this is not a cheap 320d to keep.",
      "Klapy wirowe i dieslowskie rachunki nadal się kumulują; to nie tani 320d w utrzymaniu.",
      "Шестицилиндровый {engine} под шильдиком {year} {model} ломается на вихревых заслонках, которые могут попасть во впуск — другая поломка, не задняя цепь N47. Работа по форсункам и заслонкам всё равно стоит реальных денег. Подтвердите M57, чтобы не купить 320d с наклейкой 325d.",
      "Шестёрка M57 сильнее 320d и сохраняет в Польше знакомых специалистов и запчасти.",
      "Вихревые заслонки и дизельные счета всё равно накапливаются; это не дешёвый 320d в содержании.",
    ),
  ],
  "330d-M57": [
    band(
      2005,
      2008,
      "Early 3.0 diesel six years on a {code} {model} mean swirl flaps and EGR, with common parts — not the later N57 chain story. It uses more fuel and costs more than a 320d to keep. Confirm M57 on the plate, then inspect flaps and the subframe before you buy.",
      "Wczesne lata diesla 3.0 R6 w {code} {model} oznaczają klapy wirowe i EGR przy powszechnych częściach — nie późniejszą historię łańcucha N57. Żwawiej pali i drożej utrzymuje się niż 320d. Potwierdź M57 na tabliczce, potem sprawdź klapy i belkę przed zakupem.",
      "Early 330d torque is easy to live with when flaps are done and specialists already know the job.",
      "Moment wczesnego 330d jest wygodny, gdy klapy są zrobione, a specjaliści już znają naprawę.",
      "Flap work, oil leaks, and E90 rust still add up on a neglected M57.",
      "Naprawa klap, wycieki oleju i rdza E90 nadal sumują się przy zaniedbanym M57.",
      "Ранние годы дизельной шестёрки 3.0 на {code} {model} значат вихревые заслонки и EGR при обычных запчастях — не позднюю историю цепи N57. Больше топлива и дороже в содержании, чем 320d. Подтвердите M57 на шильдике, затем проверьте заслонки и подрамник до покупки.",
      "Момент раннего 330d удобен, когда заслонки сделаны, а специалисты уже знают работу.",
      "Работа по заслонкам, течи масла и ржавчина E90 всё равно складываются на заброшенном M57.",
    ),
  ],
  "330d-N57": [
    band(
      2008,
      2012,
      "Later {year} {model} 330d cars use {engine}: a chain diesel with lower typical risk than N47, not zero. Timing noise and service history matter more than the badge. Check chain and intake first, then the subframe like any E90 — this is not the early M57 330d.",
      "Późniejsze {year} {model} 330d mają {engine}: diesel z łańcuchem o niższym typowym ryzyku niż N47, nie zerowym. Hałas rozrządu i historia serwisowa ważą więcej niż znaczek. Najpierw sprawdź łańcuch i dolot, potem belkę jak w każdym E90 — to nie wczesne 330d M57.",
      "You get a strong 3.0 with lower typical chain risk than an N47 320d and known parts supply.",
      "Dostajesz mocne 3.0 z niższym typowym ryzykiem łańcucha niż 320d N47 i znaną dostępnością części.",
      "It is still a chain diesel; thin history on timing work is the real downside.",
      "Nadal jest dieslem z łańcuchem; cienka historia prac przy rozrządzie to realny minus.",
      "Поздние {year} {model} 330d используют {engine}: дизель с цепью, типичный риск ниже, чем у N47, не нулевой. Шум ГРМ и сервисная история важнее шильдика. Сначала цепь и впуск, затем подрамник как у любого E90 — это не ранний M57 330d.",
      "Вы получаете сильный 3.0 с меньшим типичным риском цепи, чем у 320d N47, и известной доступностью запчастей.",
      "Это по‑прежнему дизель с цепью; тонкая история работ по ГРМ — реальный минус.",
    ),
  ],
  "335d-M57": [
    band(
      2006,
      2011,
      "Biturbo diesel six years mean swirl flaps plus more heat and more leaks on a {year} {code} {model}. Specialists in Poland know the jobs, and parts are not rare. Prefer stamped service history over a video of acceleration before you sign.",
      "Lata biturbo dieslowskiej szóstki oznaczają klapy wirowe plus więcej ciepła i wycieków w {year} {code} {model}. Specjaliści w Polsce znają naprawy, a części nie są rzadkie. Przed podpisem wol historię serwisową niż film z przyspieszenia.",
      "Fast diesel torque and a known M57 parts market still pull buyers who budget the jobs.",
      "Szybki dieslowski moment i znany rynek części M57 nadal przyciągają kupujących z budżetem na naprawy.",
      "Flaps, turbos, and leak repairs get expensive quickly when the car was neglected.",
      "Klapy, turbiny i naprawy wycieków szybko drożeją, gdy auto było zaniedbane.",
      "Годы битурбо дизельной шестёрки значат вихревые заслонки плюс больше тепла и течей на {year} {code} {model}. Специалисты в Польше знают работы, запчасти не редкость. Перед подписью лучше сервисная история, чем ролик разгона.",
      "Быстрый дизельный момент и известный рынок запчастей M57 всё ещё тянут покупателей с бюджетом на работы.",
      "Заслонки, турбины и ремонт течей быстро дорожают, если машину забросили.",
    ),
  ],
  "e46:330i-M54": [
    band(
      2000,
      2006,
      "E46 petrol six years centre on cooling plastics and DISA, not a rear timing chain. After two decades of Polish salt, subframe and sill rust often matter more than a tidy engine bay. Budget the cooling job and a lift inspection before you pay modern six-cylinder money.",
      "Lata benzynowej szóstki E46 kręcą się wokół plastiku chłodzenia i DISA, nie łańcucha z tyłu. Po dwóch dekadach polskiej soli rdza belki i progów często waży więcej niż czysta komora silnika. Przed zapłatą ceny współczesnej szóstki zaplanuj chłodzenie i oględziny na podnośniku.",
      "Parts are cheap, the jobs are known, and independent workshops still service M54 every week.",
      "Części są tanie, naprawy znane, a warsztaty niezależne nadal serwisują M54 co tydzień.",
      "Age rust and cooling plastics routinely outcost the DISA repair on a neglected shell.",
      "Rdza wieku i plastik chłodzenia regularnie kosztują więcej niż naprawa DISA na zaniedbanej karoserii.",
      "Годы бензиновой шестёрки E46 крутятся вокруг пластика охлаждения и DISA, не задней цепи. После двух десятилетий польской соли ржавчина подрамника и порогов часто важнее чистого моторного отсека. До цены современной шестёрки заложите охлаждение и осмотр на подъёмнике.",
      "Запчасти дешёвые, работы известны, и независимые сервисы всё ещё обслуживают M54 каждую неделю.",
      "Возрастная ржавчина и пластик охлаждения регулярно стоят дороже ремонта DISA на заброшенном кузове.",
    ),
  ],
  "e46:320d-M47": [
    band(
      1998,
      2005,
      "The common E46 diesel is swirl flaps and EGR on the {engine}, not a gearbox-end chain. Confirm M47 on the plate — later 3 Series 320d cars switched to N47. Price the flap job, then decide whether the body on a lift is worth saving.",
      "Częsty diesel E46 to klapy wirowe i EGR na {engine}, nie łańcuch od skrzyni. Potwierdź M47 na tabliczce — późniejsze 320d serii 3 przeszły na N47. Wycen klapy, a potem oceń, czy nadwozie na podnośniku warto ratować.",
      "It is a known, common diesel that stays cheap to fuel with parts everywhere in Poland.",
      "To znany, częsty diesel, który tanio pali i ma części wszędzie w Polsce.",
      "Flaps, EGR, and twenty-year rust often cost more than the engine bay suggests on paper.",
      "Klapy, EGR i dwudziestoletnia rdza często kosztują więcej, niż sugeruje czysta komora na papierze.",
      "Частый дизель E46 — вихревые заслонки и EGR на {engine}, не цепь со стороны коробки. Подтвердите M47 на шильдике — поздние 320d 3 серии перешли на N47. Оцените работу по заслонкам, затем решите, стоит ли спасать кузов на подъёмнике.",
      "Это известный, частый дизель, который дёшево кормить и у которого запчасти везде в Польше.",
      "Заслонки, EGR и двадцатилетняя ржавчина часто стоят дороже, чем подсказывает чистый моторный отсек на бумаге.",
    ),
  ],
  "f30:320i-N20": [
    band(
      2012,
      2016,
      "Early F30 petrol means N20 timing chain and VANOS, not the later B48. A cold-start rattle is a typical sign — ask what was done to the chain before you buy. Later calendar years improve the odds; they do not delete the job.",
      "Wczesna benzyna F30 to łańcuch i VANOS N20, nie późniejszy B48. Stuk na zimnym starcie to typowy objaw — przed zakupem pytaj, co zrobiono z łańcuchem. Późniejsze lata kalendarzowe poprawiają szanse; nie usuwają naprawy.",
      "Turbo fours are common on OTOMOTO, and chain specialists already know the N20 pattern.",
      "Turboczwórki są częste na OTOMOTO, a specjaliści od łańcucha już znają schemat N20.",
      "Budget N20 chain and VANOS work; this is not the later B48 petrol story.",
      "Zaplanuj budżet na łańcuch i VANOS N20; to nie późniejsza benzyna B48.",
      "Ранний бензин F30 — цепь и VANOS N20, не поздний B48. Стук на холодном запуске — типичный признак; до покупки спросите, что сделали с цепью. Поздние календарные годы улучшают шансы; они не отменяют работу.",
      "Турбочетвёрки часты на OTOMOTO, а специалисты по цепи уже знают схему N20.",
      "Заложите бюджет на цепь и VANOS N20; это не поздняя бензиновая история B48.",
    ),
  ],
  "f30:320d-N47": [
    band(
      2012,
      2015,
      "N47 still sits in an F30 body: rear timing chain, often with high Polish mileage. A facelift 3 Series does not move the chain off the gearbox end. Confirm it is not B47, then price a chain inspection before you buy.",
      "N47 nadal siedzi w nadwoziu F30: łańcuch z tyłu, często przy wysokim polskim przebiegu. Lift trójki nie przesuwa łańcucha znad skrzyni. Potwierdź, że to nie B47, potem wycen oględziny łańcucha przed zakupem.",
      "It is still the 320d many buyers search first on this generation, with easy day-to-day fuel use.",
      "Nadal jest 320d, którego wielu szuka najpierw w tej generacji, z tanim paliwem na co dzień.",
      "The rear chain remains the budget item; F30 sheet metal does not make N47 low-risk.",
      "Łańcuch z tyłu zostaje pozycją budżetową; blacha F30 nie czyni N47 niskim ryzykiem.",
      "N47 по‑прежнему в кузове F30: задняя цепь, часто при большом польском пробеге. Рестайлинг тройки не убирает цепь со стороны коробки. Подтвердите, что это не B47, затем заложите осмотр цепи до покупки.",
      "Это по‑прежнему 320d, который многие ищут первым в этом поколении, с дешёвым топливом на каждый день.",
      "Задняя цепь остаётся статьёй бюджета; кузов F30 не делает N47 низким риском.",
    ),
  ],
  "f30:320d-B47": [
    band(
      2015,
      2019,
      "Later {year} {model} diesels with the {engine} shift the story from rear chain to EGR cooler and intake carbon at high Polish mileage. Confirm B47 on the plate so you do not price an N47 engine swap by mistake. Check EGR symptoms and service stamps at pre-inspection.",
      "Późniejsze diesle {year} {model} z {engine} przesuwają historię z łańcucha z tyłu na chłodnicę EGR i nagar w dolocie przy wysokim polskim przebiegu. Potwierdź B47 na tabliczce, żeby przypadkiem nie wyceniać wymiany silnika jak przy N47. Na oględzinach sprawdź objawy EGR i stemple serwisowe.",
      "You get a later 320d with lower typical chain risk than N47 and a known EGR parts path.",
      "Dostajesz późniejszy 320d z niższym typowym ryzykiem łańcucha niż N47 i znaną ścieżką części EGR.",
      "EGR cooler and intake carbon still cost real money — cheaper than an N47 swap, not free.",
      "Chłodnica EGR i nagar w dolocie nadal kosztują realne pieniądze — taniej niż wymiana N47, nie za darmo.",
      "Поздние дизели {year} {model} с {engine} сдвигают историю с задней цепи на охладитель EGR и нагар во впуске при большом польском пробеге. Подтвердите B47 на шильдике, чтобы случайно не оценивать замену мотора как у N47. На осмотре проверьте симптомы EGR и сервисные отметки.",
      "Вы получаете поздний 320d с меньшим типичным риском цепи, чем у N47, и известным путём запчастей EGR.",
      "Охладитель EGR и нагар во впуске всё равно стоят реальных денег — дешевле замены N47, не бесплатно.",
    ),
  ],
  "e60:530d-M57": [
    band(
      2003,
      2010,
      "E60 diesel six buyers usually face swirl flaps on the {engine}, plus iDrive and salt rust on the body. Confirm M57 so you do not confuse it with a 520d N47 four. Read service history and put the car on a lift before you trust a cheap five-series listing.",
      "Kupujący dieslowską szóstkę E60 zwykle trafiają na klapy wirowe w {engine}, plus iDrive i rdzę soli na nadwoziu. Potwierdź M57, żeby nie pomylić z czwórką 520d N47. Przeczytaj historię serwisową i wstaw auto na podnośnik, zanim zaufasz taniemu ogłoszeniu piątki.",
      "M57 torque, common parts, and specialists who know flap work still make this the simpler E60 diesel.",
      "Moment M57, powszechne części i specjaliści od klap nadal czynią to prostszym dieslem E60.",
      "Flap work, iDrive faults, and body rust turn a neglected five into a long repair list.",
      "Naprawa klap, usterki iDrive i rdza nadwozia zamieniają zaniedbaną piątkę w długą listę napraw.",
      "Покупатели дизельной шестёрки E60 обычно встречаются с вихревыми заслонками на {engine}, плюс iDrive и солевая ржавчина на кузове. Подтвердите M57, чтобы не перепутать с четвёркой 520d N47. Прочитайте сервисную историю и поставьте машину на подъёмник, прежде чем доверять дешёвому объявлению пятёрки.",
      "Момент M57, обычные запчасти и специалисты по заслонкам всё ещё делают это более простым дизелем E60.",
      "Работа по заслонкам, неисправности iDrive и ржавчина кузова превращают заброшенную пятёрку в длинный список ремонтов.",
    ),
  ],
  "e60:520d-N47": [
    band(
      2007,
      2010,
      "N47 in a 5 Series keeps the same rear timing chain as the E90 320d, with more mass and often more miles in Poland. A cheap 520d listing is not a 530d six. Confirm N47 and price the chain before you buy.",
      "N47 w piątce trzyma ten sam łańcuch z tyłu co 320d E90, przy większej masie i często większym przebiegu w Polsce. Tanie ogłoszenie 520d to nie szóstka 530d. Potwierdź N47 i wycen łańcuch przed zakupem.",
      "It stays cheap to fuel and common on Polish classifieds when the chain story is honest.",
      "Nadal tanio pali i jest częste na polskich ogłoszeniach, gdy historia łańcucha jest uczciwa.",
      "A rear chain in a heavier car plus thin timing history is the bill that erases a low asking price.",
      "Łańcuch z tyłu w cięższym aucie plus cienka historia rozrządu to rachunek, który kasuje niską cenę wywoławczą.",
      "N47 в пятёрке держит ту же заднюю цепь, что у 320d E90, при большей массе и часто большем пробеге в Польше. Дешёвое объявление 520d — не шестёрка 530d. Подтвердите N47 и заложите цепь до покупки.",
      "Он по‑прежнему дёшево кормить и часто на польских объявлениях, если история цепи честная.",
      "Задняя цепь в более тяжёлой машине плюс тонкая история ГРМ — счёт, который съедает низкую цену.",
    ),
  ],
  "e39:530d-M57": [
    band(
      1998,
      2003,
      "E39 530d years mean M57 swirl flaps and cooling plastics after decades of salt. On a lift, rust and a cracked expansion tank often outcost the flap job. Inspect the subframe and cooling system before you celebrate a strong diesel pull.",
      "Lata 530d E39 oznaczają klapy wirowe M57 i plastik chłodzenia po dekadach soli. Na podnośniku rdza i pęknięty zbiornik wyrównawczy często kosztują więcej niż same klapy. Sprawdź belkę i chłodzenie, zanim ucieszysz się mocnym ciągiem diesla.",
      "Torque is strong, parts are still available, and Polish shops know the M57 flap routine.",
      "Moment jest mocny, części nadal są, a polskie warsztaty znają rutynę klap M57.",
      "Age rust and neglected cooling routinely beat the engine job on the final invoice.",
      "Rdza wieku i zaniedbane chłodzenie regularnie przebijają naprawę silnika na końcowym rachunku.",
      "Годы 530d E39 значат вихревые заслонки M57 и пластик охлаждения после десятилетий соли. На подъёмнике ржавчина и треснувший расширительный бачок часто стоят дороже самих заслонок. Проверьте подрамник и охлаждение, прежде чем радоваться сильной дизельной тяге.",
      "Момент сильный, запчасти ещё есть, и польские сервисы знают рутину заслонок M57.",
      "Возрастная ржавчина и заброшенное охлаждение регулярно обходят работу по мотору в итоговом счёте.",
    ),
  ],
  "f10:520d-N47": [
    band(
      2010,
      2014,
      "F10 520d with the {engine} is still a rear-chain four inside 5 Series running costs. Confirm N47 so you do not buy it as an N57 530d by badge alone. Price a chain inspection before a facelift photo sells you the car.",
      "520d F10 z {engine} to nadal czwórka z łańcuchem z tyłu wewnątrz kosztów piątki. Potwierdź N47, żeby nie kupić go jako 530d N57 samym znaczkiem. Wycen oględziny łańcucha, zanim zdjęcie z liftu sprzeda ci auto.",
      "It is the common F10 diesel: cheap to fuel when the timing story is documented.",
      "To częsty diesel F10: tanio pali, gdy historia rozrządu jest udokumentowana.",
      "N47 in a heavier five still needs a real chain budget; it is not the 530d six.",
      "N47 w cięższej piątce nadal wymaga realnego budżetu na łańcuch; to nie szóstka 530d.",
      "520d F10 с {engine} — по‑прежнему четвёрка с задней цепью внутри расходов пятёрки. Подтвердите N47, чтобы не купить его как 530d N57 по одному шильдику. Заложите осмотр цепи, прежде чем фото рестайлинга продаст вам машину.",
      "Это частый дизель F10: дёшево кормить, если история ГРМ задокументирована.",
      "N47 в более тяжёлой пятёрке всё равно требует реального бюджета на цепь; это не шестёрка 530d.",
    ),
  ],
  "f10:530d-N57": [
    band(
      2010,
      2017,
      "F10 diesel six years with the {engine} carry lower typical chain risk than N47, not zero — timing noise and service history matter. High mileage in Poland is common on these cars. Confirm it is not a 520d wearing a 530d badge, then listen to the chain at cold start.",
      "Lata dieslowskiej szóstki F10 z {engine} mają niższe typowe ryzyko łańcucha niż N47, nie zerowe — hałas rozrządu i historia serwisowa mają znaczenie. Wysoki przebieg w Polsce jest na tych autach częsty. Potwierdź, że to nie 520d ze znaczkiem 530d, potem posłuchaj łańcucha na zimnym starcie.",
      "The six is stronger than a 520d and usually cheaper in typical chain risk than N47 fours.",
      "Szóstka jest mocniejsza niż 520d i zwykle tańsza w typowym ryzyku łańcucha niż czwórki N47.",
      "It remains a chain diesel; missing timing history is the downside that shows up at inspection.",
      "Nadal jest dieslem z łańcuchem; brak historii rozrządu to minus, który wychodzi na oględzinach.",
      "Годы дизельной шестёрки F10 с {engine} несут меньший типичный риск цепи, чем N47, не нулевой — шум ГРМ и сервисная история важны. Большой пробег в Польше на этих машинах обычен. Подтвердите, что это не 520d с шильдиком 530d, затем послушайте цепь на холодном запуске.",
      "Шестёрка сильнее 520d и обычно дешевле по типичному риску цепи, чем четвёрки N47.",
      "Это по‑прежнему дизель с цепью; отсутствие истории ГРМ — минус, который всплывает на осмотре.",
    ),
  ],
  "e87:120d-N47": [
    band(
      2007,
      2011,
      "N47 in a 1 Series hatch keeps the same rear timing chain as the E90 320d, in a smaller body that rusts harder and lists cheaper. Confirm N47 rather than an M47 118d before you assume flaps instead of a chain. Budget the chain and a lift check for sill rust.",
      "N47 w hatchu serii 1 trzyma ten sam łańcuch z tyłu co 320d E90, w mniejszym nadwoziu, które mocniej rdzewieje i taniej wychodzi w ogłoszeniach. Potwierdź N47, a nie 118d M47, zanim założysz klapy zamiast łańcucha. Zaplanuj budżet na łańcuch i oględziny rdzy progów na podnośniku.",
      "It is a cheap BMW diesel hatch that is easy to find and cheap to fuel in Poland.",
      "To tani dieslowy hatch BMW, łatwy do znalezienia i tani w paliwie w Polsce.",
      "Rear-chain risk plus 1 Series rust after Polish winters is what a low price usually buys.",
      "Ryzyko łańcucha z tyłu plus rdza serii 1 po polskich zimach to to, co zwykle kupujesz w niskiej cenie.",
      "N47 в хэтчбеке 1 серии держит ту же заднюю цепь, что у 320d E90, в меньшем кузове, который ржавеет сильнее и дешевле в объявлениях. Подтвердите N47, а не 118d M47, прежде чем ждать заслонки вместо цепи. Заложите цепь и осмотр ржавчины порогов на подъёмнике.",
      "Это дешёвый дизельный хэтчбек BMW, который легко найти и дёшево кормить в Польше.",
      "Риск задней цепи плюс ржавчина 1 серии после польских зим — то, что обычно покупает низкая цена.",
    ),
  ],
  "e70:30d-M57": [
    band(
      2007,
      2010,
      "The common E70 diesel pairs M57 swirl flaps with an xDrive transfer case. Check tight-turn shudder and flap history with equal weight — SUV bills stack fast. Confirm M57 so you do not treat it as a later N57 40d by badge alone.",
      "Częsty diesel E70 łączy klapy wirowe M57 ze skrzynką rozdzielczą xDrive. Sprawdź drżenie na ciasnych manewrach i historię klap z równą wagą — rachunki SUV rosną szybko. Potwierdź M57, żeby nie traktować go jak późniejsze 40d N57 samym znaczkiem.",
      "Parts and diesel specialists know this generation’s 30d when the transfer case is quiet.",
      "Części i specjaliści diesla znają 30d tej generacji, gdy skrzynka rozdzielcza jest cicha.",
      "Transfer-case work on top of swirl flaps turns a neglected X5 into an expensive project.",
      "Naprawa skrzynki rozdzielczej na dodatek do klap wirowych zamienia zaniedbane X5 w drogi projekt.",
      "Частый дизель E70 сочетает вихревые заслонки M57 с раздаткой xDrive. Проверьте дрожь на крутых манёврах и историю заслонок с равным весом — счета SUV растут быстро. Подтвердите M57, чтобы не считать его поздним 40d N57 по одному шильдику.",
      "Запчасти и дизельные специалисты знают 30d этого поколения, если раздатка тихая.",
      "Работа по раздатке поверх вихревых заслонок превращает заброшенный X5 в дорогой проект.",
    ),
  ],
  "e53:3.0d-M57": [
    band(
      2001,
      2006,
      "First-generation X5 diesel years combine M57 swirl flaps with transfer-case wear and age rust after Polish salt. Cooling plastics and a rotten shell often outcost a tidy interior. Inspect the transfer case in tight turns and the underside on a lift before you buy.",
      "Lata pierwszego diesla X5 łączą klapy wirowe M57 ze zużyciem skrzynki rozdzielczej i rdzą wieku po polskiej soli. Plastik chłodzenia i zgniła karoseria często kosztują więcej niż czyste wnętrze. Przed zakupem sprawdź skrzynkę na ciasnych manewrach i spód na podnośniku.",
      "The known diesel six still has parts and workshops that service E53 every week in Poland.",
      "Znana dieslowska szóstka nadal ma części i warsztaty, które w Polsce serwisują E53 co tydzień.",
      "Transfer-case noise, underside rust, and neglected cooling turn a cheap listing into a project.",
      "Hałas skrzynki rozdzielczej, rdza spodu i zaniedbane chłodzenie zamieniają tanie ogłoszenie w projekt.",
      "Годы первого дизеля X5 сочетают вихревые заслонки M57 с износом раздатки и возрастной ржавчиной после польской соли. Пластик охлаждения и гнилой кузов часто стоят дороже чистого салона. До покупки проверьте раздатку на крутых манёврах и низ на подъёмнике.",
      "Известная дизельная шестёрка по‑прежнему имеет запчасти и сервисы, которые в Польше обслуживают E53 каждую неделю.",
      "Шум раздатки, ржавчина снизу и заброшенное охлаждение превращают дешёвое объявление в проект.",
    ),
  ],
  "f20:118d-N47": [
    band(
      2011,
      2015,
      "N47 in an F20 hatch keeps the same rear timing chain as a 320d, often with high city mileage in Poland. Later B47 120d is a different engine — confirm N47 on the plate. Price a chain inspection before a small listing photo sells you low risk.",
      "N47 w hatchu F20 trzyma ten sam łańcuch z tyłu co 320d, często przy wysokim przebiegu miejskim w Polsce. Późniejszy 120d B47 to inny silnik — potwierdź N47 na tabliczce. Wycen oględziny łańcucha, zanim małe zdjęcie z ogłoszenia sprzeda ci niskie ryzyko.",
      "It is a rear-drive 1 Series diesel that stays cheap to fuel when the chain story is clean.",
      "To dieslowa seria 1 na napęd tylny, która tanio pali, gdy historia łańcucha jest czysta.",
      "The N47 rear chain is still the budget item; this is not the later B47 EGR story.",
      "Łańcuch N47 z tyłu nadal jest pozycją budżetową; to nie późniejsza historia EGR B47.",
      "N47 в хэтчбеке F20 держит ту же заднюю цепь, что у 320d, часто при большом городском пробеге в Польше. Поздний 120d B47 — другой мотор; подтвердите N47 на шильдике. Заложите осмотр цепи, прежде чем маленькое фото из объявления продаст вам низкий риск.",
      "Это заднеприводный дизель 1 серии, который дёшево кормить, если история цепи чистая.",
      "Задняя цепь N47 по‑прежнему статья бюджета; это не поздняя история EGR B47.",
    ),
  ],
  "e83:3.0d-M57": [
    band(
      2003,
      2010,
      "First X3 diesel six years pair M57 swirl flaps with transfer-case wear and sill rust after salt. A quiet transfer case and dry sills matter more than strong pull on a rotten shell. Inspect on a lift and check tight-turn shudder before you buy.",
      "Lata pierwszej dieslowskiej szóstki X3 łączą klapy wirowe M57 ze zużyciem skrzynki rozdzielczej i rdzą progów po soli. Cicha skrzynka i suche progi ważą więcej niż mocny ciąg na zgniłej karoserii. Przed zakupem oglądaj na podnośniku i sprawdź drżenie na ciasnych manewrach.",
      "You get X3 utility and known M57 parts without stepping up to X5 running costs.",
      "Dostajesz użyteczność X3 i znane części M57 bez wchodzenia w koszty X5.",
      "Transfer-case repair, sill rust, and flap work stack quickly when the car sat in salt.",
      "Naprawa skrzynki rozdzielczej, rdza progów i klapy szybko się sumują, gdy auto stało w soli.",
      "Годы первой дизельной шестёрки X3 сочетают вихревые заслонки M57 с износом раздатки и ржавчиной порогов после соли. Тихая раздатка и сухие пороги важнее сильной тяги на гнилом кузове. До покупки осмотрите на подъёмнике и проверьте дрожь на крутых манёврах.",
      "Вы получаете практичность X3 и известные запчасти M57 без расходов уровня X5.",
      "Ремонт раздатки, ржавчина порогов и работа по заслонкам быстро складываются, если машина стояла в соли.",
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

function rowLabel(v: VariantBrief): string {
  const score = v.score != null ? ` · ${v.score.toFixed(0)}/100` : "";
  return `${v.year} ${v.model} ${v.engine}${score}`;
}

/** Prefer buyer-facing title scoped to engines actually on this chassis. */
function painLabelForCard(
  pain: NonNullable<ReturnType<typeof getPain>>,
  cardEngines: string[],
  lang: "en" | "pl" | "ru",
): string {
  const overlap = pain.engines.filter((e) => cardEngines.includes(e));
  const raw = pain.title[lang];
  const engHits = raw.match(/\b[NMBSH]A?\d{2}\b/g) ?? [];
  if (engHits.length >= 3 && overlap.length > 0) {
    const rest = raw.includes("—") ? raw.split("—").slice(1).join("—").trim() : pain.affects[lang];
    return `${overlap.join(" / ")} — ${rest}`;
  }
  return raw;
}

function enginesOnChassis(slug: string): string[] {
  return [...new Set(variantsFor(slug).map((v) => v.engine))].sort();
}

/** One representative pain per engine on the card (variant topPain). */
function headlinePainsByEngine(slug: string) {
  const out = new Map<string, NonNullable<ReturnType<typeof getPain>>>();
  for (const v of variantsFor(slug)) {
    if (out.has(v.engine)) continue;
    const pain = getPain(v.topPainId) ?? painsForVariant(v)[0];
    if (pain) out.set(v.engine, pain);
  }
  return out;
}

/**
 * Evidence-derived chassis briefing when no hand CHASSIS[] entry exists.
 * Claims only engines/pains/scores from the live catalog — no app meta as pros/cons.
 */
function deriveChassisVerdict(chassis: Chassis): Verdict {
  const variants = variantsFor(chassis.slug);
  const summary = summarizeVariants(variants);
  const engines = enginesOnChassis(chassis.slug);
  const engineList = engines.length ? engines.join(", ") : null;
  const byEng = headlinePainsByEngine(chassis.slug);
  const cardSet = engines;

  const conLabels: Localized[] = [];
  const seen = new Set<string>();
  for (const [, pain] of byEng) {
    if (seen.has(pain.id)) continue;
    seen.add(pain.id);
    conLabels.push(
      loc(
        painLabelForCard(pain, cardSet, "en"),
        painLabelForCard(pain, cardSet, "pl"),
        painLabelForCard(pain, cardSet, "ru"),
      ),
    );
    if (conLabels.length >= 3) break;
  }

  // Chassis-scoped packs (rust / ELV / etc.) if present on any variant year
  for (const v of variants.slice(0, 12)) {
    for (const p of painsForVariant(v)) {
      if (p.engines.length > 0) continue;
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      conLabels.push(loc(p.title.en, p.title.pl, p.title.ru));
      if (conLabels.length >= 3) break;
    }
    if (conLabels.length >= 3) break;
  }

  const best = summary?.best;
  const worst = summary?.worst;
  const hasScore = Boolean(summary?.hasScore && best?.score != null);
  const bestPain = best ? getPain(best.topPainId) : undefined;
  const worstPain = worst ? getPain(worst.topPainId) : undefined;

  const goodParts: Localized[] = [];
  if (hasScore && best && worst && best.slug !== worst.slug && (best.score ?? 0) - (worst.score ?? 0) >= 8) {
    goodParts.push(
      loc(
        `Higher-scoring rows exist on this card (best ${rowLabel(best)}). Compare engine×year before you buy.`,
        `Na karcie są lepsze wiersze (najlepszy ${rowLabel(best)}). Porównaj silnik×rok przed zakupem.`,
        `На карточке есть более сильные строки (лучшая ${rowLabel(best)}). Сравните мотор×год до покупки.`,
      ),
    );
  }
  if (engines.length >= 2) {
    goodParts.push(
      loc(
        `Several engines are scored on this generation (${engineList}) — pick the motor, not only the badge.`,
        `W tej generacji oceniono kilka silników (${engineList}) — wybieraj motor, nie tylko znaczek.`,
        `В этом поколении оценены несколько моторов (${engineList}) — выбирайте двигатель, не только шильдик.`,
      ),
    );
  }
  if (goodParts.length === 0) {
    goodParts.push(
      loc(
        "Generation and engines are named so you can open the matching fault list before inspection.",
        "Generacja i silniki są nazwane, żeby przed oględzinami otworzyć właściwą listę usterek.",
        "Поколение и моторы названы, чтобы до осмотра открыть нужный список поломок.",
      ),
    );
  }

  const badJoined = (lang: "en" | "pl" | "ru") => {
    const bits = conLabels.slice(0, 3).map((l) => l[lang]);
    if (bits.length === 0) {
      return lang === "pl"
        ? "Czytaj każdy wiersz silnika. Niska cena często oznacza nieopłaconą listę napraw."
        : lang === "ru"
          ? "Читайте каждую строку мотора. Низкая цена часто значит неоплаченный список ремонтов."
          : "Read each engine row. A low asking price often matches an unpaid repair list.";
    }
    if (lang === "pl") return `Zaplanuj budżet na: ${bits.join("; ")}.`;
    if (lang === "ru") return `Заложите бюджет на: ${bits.join("; ")}.`;
    return `Budget for: ${bits.join("; ")}.`;
  };

  const summaryLoc = hasScore && best
    ? loc(
        `${chassis.code} is ${chassis.name.en} (${chassis.years}). ${engineList ? `Engines on this card: ${engineList}. ` : ""}Best scored row: ${rowLabel(best)}${bestPain ? ` — mainly ${painLabelForCard(bestPain, cardSet, "en")}` : ""}.${
          worst && worst.slug !== best.slug && worst.score != null
            ? ` Higher risk: ${rowLabel(worst)}${worstPain ? ` — ${painLabelForCard(worstPain, cardSet, "en")}` : ""}.`
            : ""
        } Open the engine×year row before inspection — the badge does not name the motor.`
          .replace(/\s+/g, " ")
          .trim(),
        `${chassis.code} to ${chassis.name.pl} (${chassis.years}). ${engineList ? `Silniki na karcie: ${engineList}. ` : ""}Najlepszy wiersz: ${rowLabel(best)}${bestPain ? ` — głównie ${painLabelForCard(bestPain, cardSet, "pl")}` : ""}.${
          worst && worst.slug !== best.slug && worst.score != null
            ? ` Wyższe ryzyko: ${rowLabel(worst)}${worstPain ? ` — ${painLabelForCard(worstPain, cardSet, "pl")}` : ""}.`
            : ""
        } Przed oględzinami otwórz wiersz silnik×rok — znaczek nie nazywa motoru.`
          .replace(/\s+/g, " ")
          .trim(),
        `${chassis.code} — это ${chassis.name.ru} (${chassis.years}). ${engineList ? `Моторы на карточке: ${engineList}. ` : ""}Лучшая строка: ${rowLabel(best)}${bestPain ? ` — в основном ${painLabelForCard(bestPain, cardSet, "ru")}` : ""}.${
          worst && worst.slug !== best.slug && worst.score != null
            ? ` Выше риск: ${rowLabel(worst)}${worstPain ? ` — ${painLabelForCard(worstPain, cardSet, "ru")}` : ""}.`
            : ""
        } До осмотра откройте строку мотор×год — шильдик не указывает двигатель.`
          .replace(/\s+/g, " ")
          .trim(),
      )
    : loc(
        `${chassis.code} is ${chassis.name.en} (${chassis.years}). ${engineList ? `Typical engines: ${engineList}. ` : ""}We show a 0–100 score only after a sourced fault with a repair band exists.`,
        `${chassis.code} to ${chassis.name.pl} (${chassis.years}). ${engineList ? `Typowe silniki: ${engineList}. ` : ""}Ocenę 0–100 pokazujemy dopiero po usterce ze źródłem i pasmem naprawy.`,
        `${chassis.code} — это ${chassis.name.ru} (${chassis.years}). ${engineList ? `Типичные моторы: ${engineList}. ` : ""}Оценку 0–100 показываем только после поломки с источником и полосой ремонта.`,
      );

  return {
    summary: summaryLoc,
    good: goodParts[0],
    bad: loc(badJoined("en"), badJoined("pl"), badJoined("ru")),
  };
}

export function chassisVerdict(chassis: Chassis): Verdict {
  const hit = CHASSIS[chassis.slug];
  if (hit) return hit;
  return deriveChassisVerdict(chassis);
}

export function variantVerdict(variant: VariantBrief, chassis: Chassis, bodyWord: string): Verdict {
  const key = `${variant.model}-${variant.engine}`;
  const source = chassis.drivetrainOf ?? chassis.slug;
  const bands = source === "e90" ? ENGINES[key] : ENGINES[`${source}:${key}`];
  const hit =
    bands?.find((item) => variant.year >= item.from && variant.year <= item.to) ??
    bands?.[0];
  const tail = BODY_TAIL[chassis.slug] ?? loc("", "", "");
  if (!hit) return deriveVariantVerdict(variant, chassis, tail);
  return fillVerdict(hit, variant, bodyWord, tail);
}

/**
 * Evidence-derived variant briefing when no engine×year band exists.
 */
function deriveVariantVerdict(variant: VariantBrief, chassis: Chassis, tail: Localized): Verdict {
  const scoreLabel = variant.score != null ? `${variant.score.toFixed(1)} / 100` : "n/a";
  const pains = painsForVariant(variant);
  const pain = getPain(variant.topPainId) ?? pains[0];
  const chassisHit = CHASSIS[chassis.slug];
  const cardEngines = [variant.engine];
  const others = pains.filter((p) => p.id !== pain?.id).slice(0, 2);

  const yearNote = loc(
    "This year only uses faults that fall inside sourced production windows.",
    "Ten rok używa tylko usterek w sourced oknach produkcji.",
    "Этот год использует только поломки внутри sourced окон производства.",
  );

  const good =
    chassisHit?.good ??
    (variant.score != null && variant.score >= 70
      ? loc(
          `Evidence score ${scoreLabel} for this ${variant.engine} row — still confirm the headline fault on a test drive.`,
          `Ocena ze źródeł ${scoreLabel} dla tego wiersza ${variant.engine} — i tak potwierdź nagłówkową usterkę na jeździe próbnej.`,
          `Оценка из источников ${scoreLabel} для этой строки ${variant.engine} — всё равно подтвердите заголовочную поломку на тест-драйве.`,
        )
      : loc(
          `This ${variant.year} ${variant.model} ${variant.engine} has a sourced fault list — use it at inspection.`,
          `Ten ${variant.year} ${variant.model} ${variant.engine} ma listę usterek ze źródłami — użyj jej na oględzinach.`,
          `У этого ${variant.year} ${variant.model} ${variant.engine} есть список поломок с источниками — используйте его на осмотре.`,
        ));

  const bad = pain
    ? loc(
        [
          `At inspection check ${painLabelForCard(pain, cardEngines, "en")}.`,
          ...others.map((p) => `${painLabelForCard(p, cardEngines, "en")}.`),
          yearNote.en,
        ].join(" "),
        [
          `Na oględzinach sprawdź: ${painLabelForCard(pain, cardEngines, "pl")}.`,
          ...others.map((p) => `${painLabelForCard(p, cardEngines, "pl")}.`),
          yearNote.pl,
        ].join(" "),
        [
          `На осмотре проверьте: ${painLabelForCard(pain, cardEngines, "ru")}.`,
          ...others.map((p) => `${painLabelForCard(p, cardEngines, "ru")}.`),
          yearNote.ru,
        ].join(" "),
      )
    : loc(
        "Read the fault list. The badge does not name the engine.",
        "Czytaj listę usterek. Znaczek nie nazywa silnika.",
        "Читайте список поломок. Шильдик не указывает мотор.",
      );

  return {
    summary: loc(
      `The ${variant.year} ${variant.chassisCode} ${variant.model} ${variant.engine} evidence score is ${scoreLabel}. Main sourced fault: ${pain ? painLabelForCard(pain, cardEngines, "en") : "see fault list"}.${pain?.summary.en ? ` ${pain.summary.en}` : ""} ${chassisHit?.bad.en ?? ""} ${tail.en} ${yearNote.en}`
        .replace(/\s+/g, " ")
        .trim(),
      `${variant.year} ${variant.chassisCode} ${variant.model} ${variant.engine} — ocena ze źródeł ${scoreLabel}. Główna usterka: ${pain ? painLabelForCard(pain, cardEngines, "pl") : "patrz lista"}.${pain?.summary.pl ? ` ${pain.summary.pl}` : ""} ${chassisHit?.bad.pl ?? ""} ${tail.pl} ${yearNote.pl}`
        .replace(/\s+/g, " ")
        .trim(),
      `${variant.year} ${variant.chassisCode} ${variant.model} ${variant.engine} — оценка из источников ${scoreLabel}. Главная поломка: ${pain ? painLabelForCard(pain, cardEngines, "ru") : "смотрите список"}.${pain?.summary.ru ? ` ${pain.summary.ru}` : ""} ${chassisHit?.bad.ru ?? ""} ${tail.ru} ${yearNote.ru}`
        .replace(/\s+/g, " ")
        .trim(),
    ),
    good,
    bad,
  };
}

