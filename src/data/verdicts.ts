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
      "E46 is the fourth-generation 3 Series (1998–2006) and is still common in Poland. Typical engines are M54 petrol and M47/M57 diesel, with cooling plastics, DISA, and swirl flaps as the shared job themes. After two decades of salt, check rear subframe and sills on a lift. Confirm the engine plate before inspection — M54 330i and M47 320d have different typical repairs.",
      "E46 to seria 3 IV generacji (1998–2006) i nadal jest częsta w Polsce. Typowe silniki to benzyna M54 oraz diesel M47/M57, a wspólne tematy napraw to plastik chłodzenia, DISA i klapy wirowe. Po dwóch dekadach soli sprawdź na podnośniku tylną belkę i progi. Przed oględzinami potwierdź tabliczkę silnika — M54 330i i M47 320d mają inne typowe naprawy.",
      "E46 — четвёртая 3 серия (1998–2006) и в Польше всё ещё частая. Типичные моторы — бензин M54 и дизели M47/M57; общие темы ремонта — пластик охлаждения, DISA и вихревые заслонки. После двух десятилетий соли на подъёмнике проверьте задний подрамник и пороги. До осмотра подтвердите шильдик мотора — у M54 330i и M47 320d разные типичные ремонты.",
    ),
    good: loc("Known engines, cheap parts, and many independent workshops in Poland.", "Znane silniki, tanie części i dużo warsztatów niezależnych w Polsce.", "Известные моторы, дешёвые запчасти и много независимых сервисов в Польше."),
    bad: loc("Age rust and cooling plastics often cost more than the engine job itself.", "Rdza wieku i plastik chłodzenia często kosztują więcej niż sama naprawa silnika.", "Возрастная ржавчина и пластик охлаждения часто стоят дороже самой работы по мотору."),
  },
  f30: {
    summary: loc(
      "F30 is the 3 Series sedan from 2012–2019. Petrol risks split early N20 timing chain versus later B48; diesel splits N47 chain versus B47 EGR — two different 320d engines. Open the engine×year row before inspection; the badge does not name the motor.",
      "F30 to sedan serii 3 z lat 2012–2019. Benzyna dzieli się na wczesny łańcuch N20 i późniejszy B48; diesel na łańcuch N47 i EGR B47 — dwa różne silniki 320d. Przed oględzinami otwórz wiersz silnika×rok; znaczek nie nazywa motoru.",
      "F30 — седан 3 серии 2012–2019. Бензин делится на раннюю цепь N20 и поздний B48; дизель — на цепь N47 и EGR B47: два разных мотора 320d. До осмотра откройте строку мотор×год; шильдик не указывает двигатель.",
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
    good: loc("It remains a rear-drive hatch; later B47 years carry lower typical chain risk.", "Nadal jest hatch na napęd tylny; późniejsze lata B47 mają niższe typowe ryzyko łańcucha.", "Это по‑прежнему заднеприводный хэтчбек; поздние годы B47 несут меньший типичный риск цепи."),
    bad: loc("N13 petrol and N47 118d still need real repair budgets; a small hatch is not cheap to keep.", "Benzyna N13 i 118d N47 nadal wymagają realnego budżetu napraw; mały hatch nie jest tani w utrzymaniu.", "Бензин N13 и 118d N47 по‑прежнему требуют реального бюджета на ремонт; маленький хэтчбек не дёшев в содержании."),
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
  const scoreLabel =
    variant.score != null ? `${variant.score.toFixed(0)} / 100` : "n/a";
  const pain = getPain(variant.topPainId);
  const chassisHit = CHASSIS[chassis.slug];
  const sourceHint = pain?.sources[0]?.label ?? "warehouse sources";
  return {
    summary: loc(
      `The ${variant.year} ${variant.chassisCode} ${variant.model} ${variant.engine} evidence score is ${scoreLabel}. Main sourced fault: ${pain?.title.en ?? "see fault list"} (${sourceHint}). ${pain?.summary.en ?? ""} ${chassisHit?.bad.en ?? ""} ${tail.en}`
        .replace(/\s+/g, " ")
        .trim(),
      `${variant.year} ${variant.chassisCode} ${variant.model} ${variant.engine} — ocena ze źródeł ${scoreLabel}. Główna usterka ze źródłem: ${pain?.title.pl ?? "patrz lista"} (${sourceHint}). ${pain?.summary.pl ?? ""} ${chassisHit?.bad.pl ?? ""} ${tail.pl}`
        .replace(/\s+/g, " ")
        .trim(),
      `${variant.year} ${variant.chassisCode} ${variant.model} ${variant.engine} — оценка из источников ${scoreLabel}. Главная поломка с источником: ${pain?.title.ru ?? "смотрите список"} (${sourceHint}). ${pain?.summary.ru ?? ""} ${chassisHit?.bad.ru ?? ""} ${tail.ru}`
        .replace(/\s+/g, " ")
        .trim(),
    ),
    good: chassisHit?.good ?? loc("Sourced fault list is available.", "Jest lista usterek ze źródłami.", "Есть список поломок с источниками."),
    bad: pain
      ? loc(
          `Check ${pain.title.en} at inspection (see sources on the fault card).`,
          `Na oględzinach sprawdź: ${pain.title.pl} (źródła na karcie usterki).`,
          `На осмотре проверьте: ${pain.title.ru} (источники на карточке поломки).`,
        )
      : loc("Read the fault list. The badge does not name the engine.", "Czytaj listę usterek. Znaczek nie nazywa silnika.", "Читайте список поломок. Шильдик не указывает мотор."),
  };
}
