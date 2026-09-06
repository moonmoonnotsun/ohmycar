import type { Chassis, Localized, VariantBrief } from "./types";
import { loc } from "./loc";

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
      "E90 is the fifth-generation 3 Series sedan (2005–2012) and the default used BMW on Polish classifieds. It is not one car: an N52 330i and an N47 320d live in different risk worlds, which is why the table splits year and engine. Independents, parts, and OTOMOTO volume are the good news — you can inspect and walk away. The bad news is winter rust on the rear subframe and sills, plus ELV/CAS lockouts that strand a healthy engine. Read the engine row before you book a viewing; the 330i badge does not tell you which night you will have.",
      "E90 to sedan serii 3 V (2005–2012) i domyślne używane BMW na polskich ogłoszeniach. To nie jedno auto: N52 330i i N47 320d żyją w innych światach ryzyka, dlatego tabela dzieli rok i silnik. Niezależni, części i wolumen na OTOMOTO są na plus — da się oglądać i odpuścić. Na minus zima: rdza na tylnej belce i progach oraz ELV/CAS, które unieruchamiają sprawny silnik. Czytaj wiersz silnika zanim umówisz oględziny; znaczek 330i nie mówi, jaki będziesz miał wieczór.",
      "E90 — седан пятого поколения 3 серии (2005–2012) и главное б/у BMW на польских объявлениях. Это не одна машина: N52 330i и N47 320d живут в разных мирах риска, поэтому таблица делит год и мотор. Независимые, запчасти и объём на OTOMOTO — плюс: можно смотреть и уходить. Минус — зимняя ржавчина заднего подрамника и порогов плюс ELV/CAS, которые оставляют на стоянке живой мотор. Читай строку мотора до записи на осмотр; шильдик 330i не говорит, какой у тебя будет вечер.",
    ),
    good: loc("Parts, workshops, and enough listings to refuse a rotten one.", "Części, warsztaty i dość ogłoszeń, żeby odpuścić zgniłe.", "Запчасти, сервисы и достаточно объявлений, чтобы отказаться от гнилого."),
    bad: loc("Subframe rust after Polish salt, and electronics that leave you stranded.", "Rdza belki po soli i elektronika, która zostawia Cię na parkingu.", "Ржавчина подрамника после польской соли и электрика, которая оставляет тебя на стоянке."),
  },
  e91: {
    summary: loc(
      "E91 is the Touring of the same E9x generation (2005–2012). Engines and 0–100 scores match the E90 sedan; the body is what changes the viewing. Load, tailgate, roof rails, and a longer rear mean more rust and more places for Polish winter to hide. It is still the practical 3 Series people actually use — dogs, IKEA, and a diesel. Do not buy it as “the same as a sedan but with a boot”: budget a lift, not a driveway glance. The N47 chain is not a Touring-only story, and an N52 Touring is still the calm petrol.",
      "E91 to Touring tej samej generacji E9x (2005–2012). Silniki i 0–100 jak w sedan E90; nadwozie zmienia oględziny. Ładunek, klapa, relingi i dłuższy tył to więcej rdzy i miejsc, gdzie chowa się polska zima. To wciąż praktyczna trójka, której ludzie naprawdę używają. Nie kupuj jej jako „sedan z bagażnikiem”: budżet na podnośnik, nie na spojrzenie na podjeździe. Łańcuch N47 nie jest historią tylko kombi, a N52 Touring nadal jest spokojną benzyną.",
    ),
    good: loc("Same drivetrains as the sedan, with a boot people in Poland actually need.", "Te same napędy co sedan, z bagażnikiem, którego w PL naprawdę trzeba."),
    bad: loc("More rust surface, tailgate drama, and easier to skip a proper lift.", "Więcej rdzy, klapa i łatwiej odpuścić podnośnik."),
  },
  e92: {
    summary: loc(
      "E92 is the coupe (2006–2013). It missed the first sedan year, so a 2005 briefing has no coupe child — that is not a missing page, it is a missing car. From 2006 the engines follow the E90 table: N52 is still the safe petrol, N47 is still the chain diesel. Frameless doors, a lower roof, and fewer cheap examples change listings, not the water pump. Rust still lives in the subframe. If you came here from a 330i N52 sedan, stay on that engine; the coupe is a body, not a different motor.",
      "E92 to coupe (2006–2013). Nie było go w pierwszym roku sedana, więc briefing 2005 nie ma dziecka coupe — to nie brakująca strona, tylko brakujące auto. Od 2006 silniki idą jak w tabeli E90: N52 to nadal spokojna benzyna, N47 nadal łańcuch. Bezramkowe drzwi i mniej tanich sztuk zmieniają ogłoszenia, nie pompę wody. Rdza i tak siedzi w belce. Jeśli wszedłeś z 330i N52 sedana, zostań przy tym silniku; coupe to nadwozie, nie inny motor.",
    ),
    good: loc("Same scored engines as E90 from 2006, often better kept than a taxi sedan.", "Od 2006 te same ocenione silniki co E90, często lepiej trzymane niż taxi-sedan."),
    bad: loc("No 2005 coupe. Fewer listings, frameless-door leaks, same subframe rust.", "Brak coupe z 2005. Mniej ogłoszeń, nieszczelne drzwi, ta sama belka."),
  },
  e93: {
    summary: loc(
      "E93 is the cabrio (2007–2013). The roof is the extra tax: hydraulics, fabric, and rattles that a sedan never bills you for. Drivetrains still copy the E90 table, so an N52 330i is the calm petrol and an N47 320d is still a chain diesel with a folding roof on top. It starts later than sedan and Touring; early years you loved on E90 may not exist here. Inspect the roof cycle and drains before you fall for the photo. Winter in Poland is harsher on a cabrio than the score admits.",
      "E93 to cabrio (2007–2013). Dach to dodatkowy podatek: hydraulika, materiał i stuki, których sedan nie wystawia. Napędy kopiują tabelę E90, więc N52 330i to spokojna benzyna, a N47 320d nadal łańcuch z dachem na górze. Start później niż sedan i Touring; wczesne lata z E90 mogą tu nie istnieć. Sprawdź cykl dachu i odpływy zanim kupisz zdjęcie. Zima w Polsce jest dla cabrio twardsza, niż mówi ocena.",
    ),
    good: loc(
      "Same engines as the sedan once the year exists, with a roof people actually want.",
      "Gdy rok istnieje — te same silniki co sedan, z dachem, którego ludzie chcą.",
      "Когда год существует — те же моторы, что у седана, с крышей, которую люди хотят.",
    ),
    bad: loc(
      "Roof leaks and rams, later start year, and salt on a body that does not like it.",
      "Dach, siłowniki, późniejszy start i sól na nadwoziu, które tego nie lubi.",
      "Крыша, гидроцилиндры, поздний старт и соль на кузове, которому это не нравится.",
    ),
  },
  e46: {
    summary: loc(
      "E46 is the fourth-generation 3 Series (1998–2006) and still a volume used BMW in Poland. It is not an E90: M54 petrols and M47/M57 diesels, cooling plastics, DISA, swirl flaps — not an N47 rear chain. Rust on the rear subframe and sills is the viewing killer after two decades of salt. Independents know every bolt. A cheap 330i M54 is a different night from a tired 320d with original flaps. Confirm the engine plate before you book.",
      "E46 to seria 3 IV (1998–2006) i nadal wolumenowe BMW w Polsce. To nie E90: benzyny M54 i diesle M47/M57, plastik chłodzenia, DISA, klapy — nie łańcuch N47 z tyłu. Rdza belki i progów zabija oględziny po dwóch dekadach soli. Niezależni znają każdą śrubę. Tanie 330i M54 to inny wieczór niż zmęczony 320d z oryginalnymi klapami. Potwierdź tabliczkę silnika zanim umówisz oględziny.",
      "E46 — четвёртая 3 серия (1998–2006) и всё ещё массовое б/у BMW в Польше. Это не E90: бензин M54 и дизели M47/M57, пластик охлаждения, DISA, вихревые заслонки — не задняя цепь N47. Ржавчина подрамника и порогов убивает осмотр после двух десятилетий соли. Независимые знают каждый болт. Дешёвая 330i M54 — другой вечер, чем усталый 320d с родными заслонками. Смотри шильдик мотора до записи на осмотр.",
    ),
    good: loc("Known engines, cheap parts, every independent in Poland has seen one.", "Znane silniki, tanie części, każdy niezależny w PL je widział.", "Известные моторы, дешёвые запчасти, каждый независимый в PL их видел."),
    bad: loc("Age rust and cooling plastics. Not an E90, not an N47 story.", "Rdza wieku i plastik chłodzenia. To nie E90 i nie historia N47.", "Возрастная ржавчина и пластик охлаждения. Не E90 и не история N47."),
  },
  f30: {
    summary: loc(
      "F30 is the sixth-generation 3 Series sedan (2012–2019). Do not read it as a late E90: N20 petrols, N47 then B47 320d, later B48. Early N20 chain/VANOS is the scare on petrol; N47 320d still carries the rear-chain tax into this chassis. B47 is not N47 — EGR and carbon, not the same write-off. F31 Touring shares the table. Polish miles are high. Open the engine row, not the 320d badge.",
      "F30 to sedan serii 3 VI (2012–2019). Nie czytaj go jako późne E90: benzyny N20, 320d N47 potem B47, później B48. Wczesny łańcuch/VANOS N20 straszy na benzynie; 320d N47 wciąga podatek łańcucha z tyłu na to podwozie. B47 to nie N47 — EGR i nagar, nie ta sama kasacja. F31 Touring dzieli tabelę. Polskie kilometry są wysokie. Otwórz wiersz silnika, nie znaczek 320d.",
      "F30 — шестой седан 3 серии (2012–2019). Не читай его как поздний E90: бензин N20, 320d N47 затем B47, позже B48. Ранняя цепь/VANOS N20 пугает на бензине; 320d N47 тащит налог задней цепи на это шасси. B47 — не N47: EGR и нагар, не тот же приговор. F31 Touring делит таблицу. Польский пробег высокий. Открой строку мотора, не шильдик 320d.",
    ),
    good: loc("Modern 3 Series volume, B48/B47 later years are calmer.", "Nowoczesny wolumen trójki, późniejsze B48/B47 spokojniejsze.", "Современный объём тройки, поздние B48/B47 спокойнее."),
    bad: loc("Early N20 and N47 320d still eat wallets. Not a safe E90 replacement.", "Wczesny N20 i 320d N47 nadal jedzą portfel. To nie bezpieczny zamiennik E90.", "Ранний N20 и 320d N47 всё ещё едят кошелёк. Не безопасная замена E90."),
  },
  f31: {
    summary: loc(
      "F31 is the F30 Touring (2012–2019). Engines and 0–100 match the sedan; the wagon eats salt in the tailgate, rails, and spare well. It is the practical 3 Series of this decade in Poland. Do not skip a lift because the photo looks family-friendly. N20 and N47 stories are the same as F30.",
      "F31 to Touring F30 (2012–2019). Silniki i 0–100 jak w sedan; kombi je sól w klapie, relingach i studzience koła. To praktyczna trójka tej dekady w PL. Nie odpuszczaj podnośnika, bo zdjęcie wygląda rodzinnie. Historie N20 i N47 jak w F30.",
      "F31 — Touring F30 (2012–2019). Моторы и 0–100 как у седана; универсал ест соль в крышке, рейлингах и нише запаски. Практичная тройка десятилетия в Польше. Не пропускай подъёмник из-за семейного фото. Истории N20 и N47 как у F30.",
    ),
    good: loc("Same scored engines as F30, with a boot Poland actually uses.", "Te same ocenione silniki co F30, z bagażnikiem, którego PL używa.", "Те же оценённые моторы, что F30, с багажником, который Польша реально использует."),
    bad: loc("More rust surface than the sedan. Same N20 / N47 risks.", "Więcej rdzy niż sedan. Te same ryzyka N20 / N47.", "Больше ржавчины, чем у седана. Те же риски N20 / N47."),
  },
  e60: {
    summary: loc(
      "E60 is the fifth-generation 5 Series sedan (2003–2010): iDrive, electronics, and a split engine world. M57 530d is the diesel people still recommend; N47 520d is the chain four; N62 V8 is a wallet. N52 530i is the calm petrol if cooling is honest. It is not an E39 and not an F10. Polish examples are cheap because electronics and rust scared buyers. Read the engine row; the 5 Series badge is not a briefing.",
      "E60 to sedan serii 5 V (2003–2010): iDrive, elektronika i rozdzielony świat silników. M57 530d to diesel, który ludzie nadal polecają; N47 520d to łańcuchowa czwórka; V8 N62 to portfel. N52 530i to spokojna benzyna, gdy chłodzenie jest uczciwe. To nie E39 i nie F10. Polskie sztuki są tanie, bo elektronika i rdza przestraszyły kupujących. Czytaj wiersz silnika; znaczek serii 5 to nie briefing.",
      "E60 — пятый седан 5 серии (2003–2010): iDrive, электрика и разные миры моторов. M57 530d — дизель, который всё ещё советуют; N47 520d — цепная четвёрка; V8 N62 — кошелёк. N52 530i — спокойный бензин при честном охлаждении. Это не E39 и не F10. Польские экземпляры дешевы, потому что электрика и ржавчина напугали покупателей. Читай строку мотора; шильдик 5 серии — не брифинг.",
    ),
    good: loc("M57 530d and N52 530i are usable 5 Series if the body is dry.", "M57 530d i N52 530i to używalna piątka, gdy nadwozie jest suche.", "M57 530d и N52 530i — живая пятёрка, если кузов сухой."),
    bad: loc("iDrive, rust, N47 520d, N62 V8. Cheap listing is usually earned.", "iDrive, rdza, 520d N47, V8 N62. Tanie ogłoszenie zwykle jest zasłużone.", "iDrive, ржавчина, 520d N47, V8 N62. Дешёвое объявление обычно заслужено."),
  },
  e61: {
    summary: loc(
      "E61 is the E60 Touring (2004–2010). Same engines as the sedan; more rust in the load area, tailgate, and self-levelling rear on tired examples. It is the family 5 Series of that era in Poland. Inspect the wagon bits before you enjoy the M57. N47 520d is still a chain four with a bigger body.",
      "E61 to Touring E60 (2004–2010). Te same silniki co sedan; więcej rdzy w ładunku, klapie i zmęczonym tyłem z poziomowaniem. To rodzinna piątka tamtej ery w PL. Sprawdź rzeczy kombi zanim polubisz M57. 520d N47 nadal jest łańcuchową czwórką w większym nadwoziu.",
      "E61 — Touring E60 (2004–2010). Те же моторы, что у седана; больше ржавчины в грузовом отсеке, крышке и усталой задней подвеске. Семейная пятёрка той эпохи в Польше. Смотри универсал, прежде чем влюбиться в M57. 520d N47 всё ещё цепная четвёрка в большом кузове.",
    ),
    good: loc("Same drivetrains as E60, with a boot people used for 20 years.", "Te same napędy co E60, z bagażnikiem używanym przez 20 lat.", "Те же агрегаты, что E60, с багажником, которым пользовались 20 лет."),
    bad: loc("Touring rust and air/self-level bits on top of E60 electronics.", "Rdza kombi i poziomowanie na górze elektroniki E60.", "Ржавчина универсала и пневмо/уровень поверх электрики E60."),
  },
  e39: {
    summary: loc(
      "E39 is the fourth-generation 5 Series (1995–2004) and the one forums still call the last analogue five. Cooling plastics, expansion tank, M54/M52 petrols, M57 530d — not iDrive, not N47. Age rust and neglected cooling write cars off cheaper than any chain. Parts are everywhere. A pretty 530d with original flaps and a cracked tank is not a bargain. Jack it.",
      "E39 to seria 5 IV (1995–2004) i ta, którą fora nadal nazywają ostatnią analogową piątką. Plastik chłodzenia, zbiornik, benzyny M54/M52, 530d M57 — nie iDrive, nie N47. Rdza wieku i zaniedbane chłodzenie kasują auta taniej niż jakikolwiek łańcuch. Części są wszędzie. Ładne 530d z oryginalnymi klapami i pękniętym zbiornikiem to nie okazja. Podnośnik.",
      "E39 — четвёртая 5 серия (1995–2004) и та, которую форумы всё ещё зовут последней аналоговой пятёркой. Пластик охлаждения, бачок, бензин M54/M52, 530d M57 — не iDrive, не N47. Возрастная ржавчина и заброшенное охлаждение убивают машины дешевле любой цепи. Запчасти везде. Красивая 530d с родными заслонками и треснувшим бачком — не выгодная сделка. Подъёмник.",
    ),
    good: loc("Simple, loved, parts and specialists on every industrial estate.", "Prosta, kochana, części i specjaliści na każdym osiedlu warsztatów.", "Простая, любимая, запчасти и специалисты на каждой промзоне."),
    bad: loc("30-year rust and cooling. The romance is not a score.", "30-letnia rdza i chłodzenie. Romans to nie ocena.", "Тридцатилетняя ржавчина и охлаждение. Романтика — не оценка."),
  },
  f10: {
    summary: loc(
      "F10 is the sixth-generation 5 Series sedan (2010–2017). N47 520d brings the rear chain into a bigger car; N57 530d is the six people actually want; N20 520i is the early petrol scare; N55 535i is the usable six. F11 Touring shares the table. It is not an E60 and not a G30. Polish 520d taxis exist. Open the engine, then the service book.",
      "F10 to sedan serii 5 VI (2010–2017). 520d N47 wnosi łańcuch z tyłu do większego auta; N57 530d to szóstka, której ludzie chcą; N20 520i to wczesny strach benzyny; N55 535i to używalna szóstka. F11 Touring dzieli tabelę. To nie E60 i nie G30. Polskie taxi 520d istnieją. Otwórz silnik, potem książkę.",
      "F10 — шестой седан 5 серии (2010–2017). 520d N47 приносит заднюю цепь в большую машину; N57 530d — шестёрка, которую хотят; N20 520i — ранний бензиновый страх; N55 535i — живая шестёрка. F11 Touring делит таблицу. Это не E60 и не G30. Польские такси 520d существуют. Открой мотор, потом сервисную книгу.",
    ),
    good: loc("N57 530d and N55 535i are the grown-up rows.", "N57 530d i N55 535i to dorosłe wiersze.", "N57 530d и N55 535i — взрослые строки."),
    bad: loc("N47 520d and early N20. A 5 Series badge does not cancel a chain.", "520d N47 i wczesny N20. Znaczek piątki nie kasuje łańcucha.", "520d N47 и ранний N20. Шильдик пятёрки не отменяет цепь."),
  },
  f11: {
    summary: loc(
      "F11 is the F10 Touring (2010–2017). Same engines as the sedan; more miles, more salt in the load bay. Poland’s default family 5 Series of that decade. N47 520d is still N47. Inspect the wagon and the chain story separately.",
      "F11 to Touring F10 (2010–2017). Te same silniki co sedan; więcej kilometrów, więcej soli w ładunku. Domyślna rodzinna piątka tamtej dekady w PL. 520d N47 nadal jest N47. Oglądaj kombi i historię łańcucha osobno.",
      "F11 — Touring F10 (2010–2017). Те же моторы, что у седана; больше пробега, больше соли в грузовом отсеке. Семейная пятёрка того десятилетия в Польше. 520d N47 всё ещё N47. Осматривай универсал и историю цепи отдельно.",
    ),
    good: loc("Same scored engines as F10, with a boot that worked for a decade.", "Te same ocenione silniki co F10, z bagażnikiem na dekadę.", "Те же оценённые моторы, что F10, с багажником на десятилетие."),
    bad: loc("Touring rust plus the same N47 / N20 rows.", "Rdza kombi plus te same wiersze N47 / N20.", "Ржавчина универсала плюс те же строки N47 / N20."),
  },
  e87: {
    summary: loc(
      "E87 is the first 1 Series hatch (2004–2011), rear-drive, and Poland’s cheap BMW. N47 120d is the same rear-chain diesel as the E90 320d, in a smaller, rustier shell. M47 118d is flaps, not that chain. N52 130i is the calm petrol. N46 118i wears guides. E81 three-door shares the table. Do not buy a 1 Series because it is “not a 3 Series” — N47 does not care about the badge.",
      "E87 to pierwszy hatch serii 1 (2004–2011), napęd na tył i tanie BMW w PL. 120d N47 to ten sam diesel z łańcuchem z tyłu co 320d E90, w mniejszej, bardziej rdzawej skorupie. 118d M47 to klapy, nie ten łańcuch. N52 130i to spokojna benzyna. N46 118i zużywa ślizgi. E81 trzydrzwiowy dzieli tabelę. Nie kupuj jedynki, bo „to nie trójka” — N47 nie obchodzi znaczek.",
      "E87 — первый хэтч 1 серии (2004–2011), задний привод и дешёвое BMW в Польше. 120d N47 — тот же дизель с задней цепью, что 320d E90, в меньшем, более ржавом кузове. 118d M47 — заслонки, не та цепь. N52 130i — спокойный бензин. N46 118i ест направляющие. Трёхдверный E81 делит таблицу. Не бери единицу, потому что «это не тройка» — N47 плевать на шильдик.",
    ),
    good: loc("Rear-drive hatch, N52 130i, cheap parts, known specialists.", "Hatch na tył, N52 130i, tanie części, znani specjaliści.", "Заднеприводный хэтч, N52 130i, дешёвые запчасти, знакомые специалисты."),
    bad: loc("N47 120d, rust, and interiors that look every Polish winter.", "120d N47, rdza i wnętrza, które pamiętają każdą polską zimę.", "120d N47, ржавчина и салоны, которые помнят каждую польскую зиму."),
  },
  e81: {
    summary: loc(
      "E81 is the three-door E87 (2007–2012). Engines match the five-door; fewer listings, same N47 120d. It is a body, not a different motor. Rust and chain stories do not get shorter with two fewer doors.",
      "E81 to trzydrzwiowe E87 (2007–2012). Silniki jak w pięciodrzwiowym; mniej ogłoszeń, ten sam 120d N47. To nadwozie, nie inny motor. Rdza i łańcuch nie robią się krótsze o dwoje drzwi.",
      "E81 — трёхдверный E87 (2007–2012). Моторы как у пятидверки; меньше объявлений, тот же 120d N47. Это кузов, не другой мотор. Ржавчина и цепь не короче на две двери.",
    ),
    good: loc("Same scored engines as E87, often a bit more toy than taxi.", "Te same ocenione silniki co E87, często bardziej zabawka niż taxi.", "Те же оценённые моторы, что E87, чаще игрушка, чем такси."),
    bad: loc("Fewer examples, same N47, same rust.", "Mniej sztuk, ten sam N47, ta sama rdza.", "Меньше машин, тот же N47, та же ржавчина."),
  },
  e70: {
    summary: loc(
      "E70 is the second X5 (2006–2013): heavy, xDrive, and expensive when neglected. M57 30d is the diesel people still buy; N57 40d is a later chain six; N62 48i is a V8 wallet; N55 35i is the petrol six. Transfer case chain is an SUV tax, not diesel vs petrol. It is not an E53 and not an F15. Polish miles and towing exist. Budget a lift and a figure-eight for the transfer case.",
      "E70 to drugi X5 (2006–2013): ciężki, xDrive i drogi, gdy zaniedbany. M57 30d to diesel, który ludzie nadal kupują; N57 40d to późniejsza łańcuchowa szóstka; N62 48i to portfel V8; N55 35i to benzynowa szóstka. Łańcuch rozdzielnicy to podatek SUV, nie diesel kontra benzyna. To nie E53 i nie F15. Polskie kilometry i holowanie istnieją. Budżet na podnośnik i ósemkę na rozdzielnicę.",
      "E70 — второй X5 (2006–2013): тяжёлый, xDrive и дорогой при забросе. M57 30d — дизель, который всё ещё берут; N57 40d — поздняя цепная шестёрка; N62 48i — кошелёк V8; N55 35i — бензиновая шестёрка. Цепь раздатки — налог SUV, не дизель против бензина. Это не E53 и не F15. Польский пробег и прицеп существуют. Бюджет на подъёмник и восьмёрку для раздатки.",
    ),
    good: loc("M57 30d and N55 35i are the usable rows if the case is quiet.", "M57 30d i N55 35i to używalne wiersze, gdy rozdzielnica milczy.", "M57 30d и N55 35i — живые строки, если раздатка тихая."),
    bad: loc("Transfer case, N62, rust underneath, running costs of a 5 Series on stilts.", "Rozdzielnica, N62, rdza spodu, koszty piątki na szczudłach.", "Раздатка, N62, ржавчина снизу, расходы пятёрки на ходулях."),
  },
  e53: {
    summary: loc(
      "E53 is the first X5 (1999–2006): body-on-frame flavour, M54 3.0i, M62 4.4i, M57 3.0d. Cooling, rust, and a transfer case — not N47. It is old, cheap on OTOMOTO, and expensive when the shell is rotten. Independents still know it. Do not buy it as a cute SUV; buy it as a 20-year-old truck that towed.",
      "E53 to pierwszy X5 (1999–2006): klimat ramy, M54 3.0i, M62 4.4i, M57 3.0d. Chłodzenie, rdza i rozdzielnica — nie N47. Stary, tani na OTOMOTO i drogi, gdy skorupa jest zgniła. Niezależni nadal go znają. Nie kupuj go jako uroczego SUV; kupuj jako 20-letnią ciężarówkę, która ciągnęła.",
      "E53 — первый X5 (1999–2006): ощущение рамы, M54 3.0i, M62 4.4i, M57 3.0d. Охлаждение, ржавчина и раздатка — не N47. Старый, дешёвый на OTOMOTO и дорогой, когда кузов гнилой. Независимые его ещё знают. Не бери как милый SUV; бери как 20-летний грузовик, который тягал.",
    ),
    good: loc("Simple petrol six, known diesel six, parts still exist.", "Prosta benzynowa szóstka, znana dieslowska, części nadal są.", "Простая бензиновая шестёрка, известный дизель, запчасти ещё есть."),
    bad: loc("Age rust, cooling, transfer case. A cheap X5 is usually a project.", "Rdza wieku, chłodzenie, rozdzielnica. Tanie X5 to zwykle projekt.", "Возрастная ржавчина, охлаждение, раздатка. Дешёвый X5 обычно проект."),
  },
  f20: {
    summary: loc(
      "F20 is the second 1 Series hatch (2011–2019), still rear-drive. N13 116i is not a safe cheap petrol. N47 118d is the chain diesel again. Later B47 120d is EGR/carbon, not N47. It is not an E87 and not the FWD F40. Polish 118d miles are taxi-shaped. Open the engine row before the city-car photo sells you.",
      "F20 to drugi hatch serii 1 (2011–2019), nadal na tył. N13 116i to nie bezpieczna tania benzyna. 118d N47 to znowu łańcuch. Późniejszy 120d B47 to EGR/nagar, nie N47. To nie E87 i nie FWD F40. Polskie kilometry 118d mają kształt taxi. Otwórz wiersz silnika, zanim zdjęcie city-cara Cię sprzeda.",
      "F20 — второй хэтч 1 серии (2011–2019), всё ещё задний привод. N13 116i — не безопасный дешёвый бензин. 118d N47 — снова цепь. Поздний 120d B47 — EGR/нагар, не N47. Это не E87 и не переднеприводный F40. Польский пробег 118d похож на такси. Открой строку мотора, пока фото городской машины тебя не купило.",
    ),
    good: loc("Rear-drive hatch of this decade; B47 later years are calmer.", "Hatch na tył tej dekady; późniejsze B47 spokojniejsze.", "Заднеприводный хэтч десятилетия; поздние B47 спокойнее."),
    bad: loc("N13 petrol and N47 118d. Small does not mean cheap to keep.", "Benzyna N13 i 118d N47. Małe nie znaczy tanie w utrzymaniu.", "Бензин N13 и 118d N47. Маленький не значит дешёвый в содержании."),
  },
  e83: {
    summary: loc(
      "E83 is the first X3 (2003–2010): compact SAV, M54 petrols, M47 2.0d, M57 3.0d. Transfer case, rust, cooling — not an N47 chain. It is the X5 people could park. Polish examples towed and sat in salt. A 3.0d with quiet case and dry sills is the row; a cheap 2.0d with original flaps is homework. Jack it and do a figure-eight.",
      "E83 to pierwsze X3 (2003–2010): kompaktowy SAV, benzyny M54, 2.0d M47, 3.0d M57. Rozdzielnica, rdza, chłodzenie — nie łańcuch N47. To X5, które dało się zaparkować. Polskie sztuki ciągnęły i stały w soli. 3.0d z cichą skrzynką i suchymi progami to wiersz; tanie 2.0d z oryginalnymi klapami to praca domowa. Podnośnik i ósemka.",
      "E83 — первый X3 (2003–2010): компактный SAV, бензин M54, 2.0d M47, 3.0d M57. Раздатка, ржавчина, охлаждение — не цепь N47. Это X5, который можно припарковать. Польские машины тягали и стояли в соли. 3.0d с тихой раздаткой и сухими порогами — строка; дешёвый 2.0d с родными заслонками — домашнее задание. Подъёмник и восьмёрка.",
    ),
    good: loc("M54 and M57 are known; size people in Poland actually use.", "M54 i M57 są znane; rozmiar, którego w PL naprawdę używają.", "M54 и M57 известны; размер, которым в Польше реально ездят."),
    bad: loc("Transfer case, rust, age. Not a cute crossover.", "Rozdzielnica, rdza, wiek. To nie ładne crossover.", "Раздатка, ржавчина, возраст. Не милый кроссовер."),
  },
};

const BODY_TAIL: Record<string, Localized> = {
  e90: loc(
    "As a sedan it is the easiest E9x to inspect and to resell on OTOMOTO.",
    "Jako sedan jest najłatwiejszym E9x do oględzin i odsprzedaży na OTOMOTO.",
  ),
  e91: loc(
    "As a Touring, budget a lift: tailgate, rails, and subframe rust after Polish salt.",
    "Jako Touring weź podnośnik: klapa, relingi i belka po polskiej soli.",
  ),
  e92: loc(
    "As a coupe, frameless doors and listings change — the water pump and subframe do not.",
    "Jako coupe zmieniają się drzwi i ogłoszenia — nie pompa wody ani belka.",
  ),
  e93: loc(
    "As a cabrio, cycle the roof and check drains; the engine story is the same, the leak budget is not.",
    "Jako cabrio zrób cykl dachu i odpływy; historia silnika ta sama, budżet na przecieki nie.",
    "Как кабриолет прогони крышу и сливы; история мотора та же, бюджет на течи нет.",
  ),
  f31: loc(
    "As a Touring, budget a lift: tailgate, rails, and salt in the load bay.",
    "Jako Touring weź podnośnik: klapa, relingi i sól w ładunku.",
    "Как Touring закладывай подъёмник: крышка, рейлинги и соль в грузовом отсеке.",
  ),
  e61: loc(
    "As a Touring, check the load area and self-levelling before you enjoy the engine row.",
    "Jako Touring sprawdź ładunek i poziomowanie zanim polubisz wiersz silnika.",
    "Как Touring смотри грузовой отсек и уровень, прежде чем влюбиться в строку мотора.",
  ),
  f11: loc(
    "As a Touring, more miles and more salt — same engines as the F10 sedan.",
    "Jako Touring: więcej kilometrów i soli — te same silniki co sedan F10.",
    "Как Touring: больше пробега и соли — те же моторы, что седан F10.",
  ),
  e81: loc(
    "As a three-door, fewer listings — same N47 and rust as the five-door.",
    "Jako trzydrzwiowe: mniej ogłoszeń — ten sam N47 i rdza co pięciodrzwiowe.",
    "Как трёхдверка: меньше объявлений — тот же N47 и ржавчина, что у пятидверки.",
  ),
};

const ENGINES: Record<string, Band[]> = {
  "318i-N46": [
    band(
      2005,
      2007,
      "The {year} {code} {model} with the {engine} is the early four-cylinder petrol, not the later N43. Chain guides wear; it is an annoying bill, not an N47 write-off. It is cheaper to buy than an N52 six and feels like it. Cooling and rust still apply. Do not mix it with a 320i N43 just because both say 318i on the boot.",
      "{year} {code} {model} z {engine} to wczesny benzynowy R4, nie późniejszy N43. Ślizgi łańcucha się zużywają; to irytujący rachunek, nie kasacja jak N47. Taniej niż N52 i tak też jedzie. Chłodzenie i rdza nadal obowiązują. Nie mieszaj z 320i N43 tylko dlatego, że na klapie też jest 318i.",
      "Simple NA four, cheap to buy, guides are a known job.",
      "Prosty wolnossący R4, tanio kupić, ślizgi to znany etat.",
      "Not an N52. Guides, oil, and it is still an early E90 in Polish salt.",
      "To nie N52. Ślizgi, olej i wczesne E90 w polskiej soli.",
    ),
  ],
  "318i-N43": [
    band(
      2007,
      2011,
      "The {year} {code} {model} with the {engine} is direct-injection four-cylinder, not the earlier N46. Injectors and the NOx sensor can eat a viewing budget faster than the badge suggests. It is not the “safe small petrol”. Parts are worse than N52. If you wanted cheap running, look at N46 or a six.",
      "{year} {code} {model} z {engine} to R4 z wtryskiem bezpośrednim, nie wcześniejszy N46. Wtryski i NOx zjedzą budżet oględzin szybciej, niż obiecuje znaczek. To nie „bezpieczna mała benzyna”. Części gorsze niż przy N52. Chcesz tanio jeździć — N46 albo szóstka.",
      "Later 318i, more torque than N46 on paper.",
      "Późniejszy 318i, na papierze więcej momentu niż N46.",
      "DI injectors and NOx. This is not the cheap petrol people remember.",
      "Wtryski DI i NOx. To nie ta tania benzyna, którą ludzie pamiętają.",
    ),
  ],
  "320i-N46": [
    band(
      2005,
      2007,
      "The {year} {code} {model} with the {engine} is the same N46 family as 318i, with a nicer badge. Chain guides are the headline, not HPFP. It is a reasonable first E90 if the cooling and subframe are honest. It will not feel like a 330i. Do not pay N52 money for an N46 320i.",
      "{year} {code} {model} z {engine} to ta sama rodzina N46 co 318i, z ładniejszym znaczkiem. Ślizgi łańcucha są nagłówkiem, nie HPFP. To rozsądne pierwsze E90, jeśli chłodzenie i belka są uczciwe. Nie pojedzie jak 330i. Nie płać ceny N52 za 320i N46.",
      "Known engine, independent-friendly, badge is easy to sell.",
      "Znany silnik, przyjazny niezależnym, znaczek łatwo sprzedać.",
      "Guides and the usual E90 rust. It is not a six.",
      "Ślizgi i zwykła rdza E90. To nie szóstka.",
    ),
  ],
  "320i-N43": [
    band(
      2007,
      2011,
      "The {year} {code} {model} with the {engine} swapped the simple N46 for direct injection. Injectors and NOx are the briefing, not “it is just a 320i”. Running costs can surprise someone who left an N46. Specialists exist in Poland, but the job is not a water pump. Confirm it is N43 on the VIN sticker before you fall for the year.",
      "{year} {code} {model} z {engine} zamienił prostego N46 na wtrysk bezpośredni. Wtryski i NOx są briefingiem, nie „to tylko 320i”. Koszty zaskoczą kogoś po N46. Specjaliści w PL są, ale to nie pompa wody. Sprawdź N43 na naklejce VIN zanim kupisz rok.",
      "The later 320i petrol if you insist on the badge.",
      "Późniejszy 320i benzyna, jeśli koniecznie ten znaczek.",
      "DI four-cylinder bills. N46 was the calmer 320i.",
      "Rachunki R4 DI. Spokojniejszy 320i to był N46.",
    ),
  ],
  "325i-N52": [
    band(
      2005,
      2007,
      "The {year} {code} {model} with the {engine} is the smaller N52 six — almost the 330i story with less badge tax. Electric water pump and thermostat are the typical bill, with little warning. It does not have HPFP or N47 chain drama. Subframe rust and CAS still apply. If you can stretch to 330i N52, the engine family is the same idea.",
      "{year} {code} {model} z {engine} to mniejsza szóstka N52 — prawie historia 330i, bez podatku za znaczek. Elektryczna pompa wody i termostat to typowy rachunek, bez ostrzeżenia. Nie ma HPFP ani łańcucha N47. Belka i CAS nadal obowiązują. Jeśli dasz radę na 330i N52, rodzina silnika jest ta sama.",
      "NA inline-six, cheap-ish cooling job, easy specialists.",
      "Wolnossąca R6, względnie tania pompa, łatwi specjaliści.",
      "Pump dies without a speech. Rust and ELV like every E90.",
      "Pompa umiera bez przemowy. Rdza i ELV jak w każdym E90.",
    ),
  ],
  "325i-N53": [
    band(
      2007,
      2011,
      "The {year} {code} {model} with the {engine} is not the N52. Europe got direct injection on the NA six; injectors and HPFP are an expensive pair. The US kept N52 longer — do not import advice from forums that never had N53. This is a 325i that can bill like a problem child. Check mixture faults and service history, not just the badge.",
      "{year} {code} {model} z {engine} to nie N52. Europa dostała wtrysk bezpośredni na wolnossącej szóstce; wtryski i HPFP to droga para. USA trzymało N52 dłużej — nie importuj rad z forów, które N53 nie miały. To 325i, które potrafi wystawić rachunek jak problemowe dziecko. Mieszanka i historia serwisowa, nie sam znaczek.",
      "Still a six, more punch than N46 if it is healthy.",
      "Nadal szóstka, więcej wigoru niż N46, gdy jest zdrowa.",
      "N53 injectors/HPFP. This is not the beloved N52 325i.",
      "Wtryski/HPFP N53. To nie ukochane 325i N52.",
    ),
  ],
  "330i-N52": [
    band(
      2005,
      2007,
      "The {year} {code} {model} with the {engine} is the briefing this family is built around: a naturally aspirated inline-six without HPFP drama. It still eats electric water pumps and thermostats, so a cooling bill is normal, not a catastrophe. Parts and independent labour in Poland are easy, which is why the score stays high. It is not a free used BMW — subframe rust and CAS still apply. Do not confuse it with a later 330i N53.",
      "{year} {code} {model} z {engine} to briefing, pod który zbudowana jest ta rodzina: wolnossąca R6 bez dramatu HPFP. Nadal zjada elektryczne pompy wody i termostaty, więc rachunek za chłodzenie jest normalny, nie katastrofa. Części i niezależni w PL są łatwi, dlatego ocena zostaje wysoko. To nie darmowe BMW — belka i CAS nadal obowiązują. Nie myl z późniejszym 330i N53.",
      "The calm six. Cooling is a job, not an engine-out.",
      "Spokojna szóstka. Chłodzenie to etat, nie wyjęcie silnika.",
      "Pump without warning; rust and ELV on every E90.",
      "Pompa bez ostrzeżenia; rdza i ELV na każdym E90.",
    ),
  ],
  "330i-N53": [
    band(
      2007,
      2011,
      "The {year} {code} {model} with the {engine} wears the same 330i badge as the N52 and is a different car. Direct injection on the NA six fails more expensively than a water pump. Forums that say “just get a 330i” often mean N52. Confirm N53 on the engine code before you copy that advice. Budget injectors and HPFP, then decide if the badge is worth it.",
      "{year} {code} {model} z {engine} nosi ten sam znaczek 330i co N52 i jest innym autem. Wtrysk bezpośredni na wolnossącej szóstce psuje się drożej niż pompa wody. Fora „bierz 330i” często mają na myśli N52. Potwierdź N53 w kodzie silnika zanim skopiujesz tę radę. Budżet na wtryski i HPFP, potem zdecyduj, czy znaczek jest tego wart.",
      "The 330i badge, more modern injection if you like that.",
      "Znaczek 330i, nowocześniejszy wtrysk, jeśli to lubisz.",
      "N53 is not N52. Injectors and HPFP can eat the viewing budget.",
      "N53 to nie N52. Wtryski i HPFP zjedzą budżet oględzin.",
    ),
  ],
  "335i-N54": [
    band(
      2006,
      2010,
      "The {year} {code} {model} with the {engine} is the twin-turbo that made E90 fast and expensive. HPFP and piezo injectors are the pair; hard starts and limp mode are the symptoms. Wastegates and cooling join the list. It is a joy when sorted and a specialist hobby when not. Do not mix it with N55 335i — different pump, different briefing.",
      "{year} {code} {model} z {engine} to biturbo, które zrobiło E90 szybkim i drogim. HPFP i piezo-wtryski to para; trudny rozruch i tryb awaryjny to objawy. Dochodzą wastegate’y i chłodzenie. Frajda, gdy ogarnięte; hobby specjalisty, gdy nie. Nie mieszaj z 335i N55 — inna pompa, inny briefing.",
      "The fast E90. Parts are common; the scene knows the jobs.",
      "Szybkie E90. Części są; scena zna etaty.",
      "HPFP, injectors, turbos. This is not an N52 with a 335i badge.",
      "HPFP, wtryski, turbiny. To nie N52 ze znaczkiem 335i.",
    ),
  ],
  "335i-N55": [
    band(
      2010,
      2012,
      "The {year} {code} {model} with the {engine} is the later single-turbo 335i, calmer than N54 but not an N52. Water pump and thermostat remain typical. It still wants a specialist who has seen N55, not a “any BMW” oil change. Index 2010–2012 cars are newer and dearer on OTOMOTO. Confirm N55, not N54, before you copy a forum shopping list.",
      "{year} {code} {model} z {engine} to późniejsze 335i z jedną turbiną, spokojniejsze niż N54, ale to nie N52. Pompa wody i termostat zostają typowe. Nadal chce specjalistę, który widział N55, nie „dowolne BMW”. Lata 2010–2012 są nowsze i droższe na OTOMOTO. Potwierdź N55, nie N54, zanim skopiujesz listę z forum.",
      "Less HPFP horror than N54, still a proper six.",
      "Mniej horroru HPFP niż N54, nadal prawdziwa szóstka.",
      "Not cheap, not N52. Cooling and turbo still exist.",
      "Nie tanio, nie N52. Chłodzenie i turbo nadal są.",
    ),
  ],
  "318d-M47": [
    band(
      2005,
      2007,
      "The {year} {code} {model} with the {engine} is the early four-cylinder diesel before N47. Swirl flaps can break into the intake — that is this briefing, not a timing-chain write-off. It is the cheaper diesel badge. Maintenance history matters more than a shiny bumper. Do not assume every 318d is N47.",
      "{year} {code} {model} z {engine} to wczesny dieslowski R4 przed N47. Klapy wirowe potrafią wpaść do dolotu — to ten briefing, nie kasacja na łańcuchu. To tańszy znaczek diesla. Historia serwisowa ważniejsza niż zderzak. Nie zakładaj, że każdy 318d to N47.",
      "Pre-N47 diesel. Flaps are a job, not usually an engine-out.",
      "Diesel przed N47. Klapy to etat, rzadko wyjęcie silnika.",
      "Swirl flaps and E90 rust. Later 318d N47 is a different risk.",
      "Klapy i rdza E90. Późniejszy 318d N47 to inne ryzyko.",
    ),
  ],
  "318d-N47": [
    band(
      2007,
      2010,
      "The {year} {code} {model} with the {engine} is the early N47 chain diesel. The chain sits at the gearbox end; when it jumps, the engine is often a write-off. This is not “all E90 diesels”. Early years and high mileage are the danger zone. A cheap 318d on OTOMOTO is often this car. Listen, ask for chain work, or walk.",
      "{year} {code} {model} z {engine} to wczesny diesel N47 z łańcuchem. Łańcuch siedzi od skrzyni; gdy przeskoczy, często kończy się silnikiem do wymiany. To nie „wszystkie diesle E90”. Wczesne lata i wysoki przebieg to strefa zagrożenia. Tani 318d na OTOMOTO często jest tym autem. Słuchaj, pytaj o łańcuch albo idź.",
      "Cheap to buy, sips fuel, parts are everywhere.",
      "Tanio kupić, mało pali, części wszędzie.",
      "Rear chain. Early N47 can end the car.",
      "Łańcuch z tyłu. Wczesny N47 potrafi skończyć auto.",
    ),
    band(
      2011,
      2012,
      "The {year} {code} {model} with the {engine} is still N47 — later, slightly less infamous, not innocent. The chain remains at the back of the engine. High mileage in Poland is the default, not the exception. Do not treat a 2011 318d as an M47. Budget a chain inspection or a specialist who will refuse the car.",
      "{year} {code} {model} z {engine} to nadal N47 — późniejszy, trochę mniej osławiony, nie niewinny. Łańcuch nadal z tyłu silnika. Wysoki przebieg w PL to default, nie wyjątek. Nie traktuj 318d z 2011 jak M47. Budżet na oględziny łańcucha albo specjalistę, który auto odrzuci.",
      "Later N47, still a cheap diesel to run day to day.",
      "Późniejszy N47, nadal tani diesel na co dzień.",
      "Still a rear chain. “Updated” is not “sorted”.",
      "Nadal łańcuch z tyłu. „Poprawiony” to nie „ogarnięty”.",
    ),
  ],
  "320d-M47": [
    band(
      2005,
      2007,
      "The {year} {code} {model} with the {engine} is the pre-N47 320d people actually recommend when they say “early diesel”. Swirl flaps are the fault, not a gearbox-end chain. It is the volume diesel of the first years. Confirm M47, not N47, on the engine plate. A 2005–2007 320d is not the same briefing as a 2008 320d.",
      "{year} {code} {model} z {engine} to 320d sprzed N47, które ludzie polecają, gdy mówią „wczesny diesel”. Klapy wirowe są usterką, nie łańcuch od skrzyni. To wolumenowy diesel pierwszych lat. Potwierdź M47, nie N47, na tabliczce. 320d 2005–2007 to nie ten sam briefing co 320d 2008.",
      "The 320d without the N47 chain story.",
      "320d bez historii łańcucha N47.",
      "Flaps, EGR, rust. Later 320d N47 is the one that writes engines off.",
      "Klapy, EGR, rdza. Późniejszy 320d N47 to ten, który kasuje silniki.",
    ),
  ],
  "320d-N47": [
    band(
      2007,
      2010,
      "The {year} {code} {model} with the {engine} is Poland’s default E90 diesel and the reason this site splits year and engine. Timing chain at the rear of the engine; snap or jump and the motor is often scrap. Early N47 plus taxi miles is the nightmare combo. A low asking price is not a bargain if the chain is original. This is not an M47 320d and not “all E90”.",
      "{year} {code} {model} z {engine} to domyślny diesel E90 w Polsce i powód, dla którego ten serwis dzieli rok i silnik. Łańcuch z tyłu silnika; pęknięcie albo przeskok często kończy motor. Wczesny N47 plus kilometry taxi to koszmar. Niska cena nie jest okazją, gdy łańcuch jest oryginalny. To nie 320d M47 i nie „wszystkie E90”.",
      "Everywhere on OTOMOTO, cheap to fuel, known specialists.",
      "Wszędzie na OTOMOTO, tanio pali, znani specjaliści.",
      "Rear chain on early N47. This is the high-risk 320d.",
      "Łańcuch z tyłu na wczesnym N47. To wysokoryzykowny 320d.",
    ),
    band(
      2011,
      2012,
      "The {year} {code} {model} with the {engine} is a later N47 320d — still a chain diesel, slightly less infamous than 2007–2010. The chain is still at the gearbox end. Polish mileage is still high. Do not buy it because a forum said “updated chain”. Ask what was done, or price a replacement before you fall in love with the listing.",
      "{year} {code} {model} z {engine} to późniejszy 320d N47 — nadal diesel z łańcuchem, trochę mniej osławiony niż 2007–2010. Łańcuch nadal od skrzyni. Polskie przebiegi nadal wysokie. Nie kupuj, bo forum rzekło „poprawiony łańcuch”. Pytaj, co zrobiono, albo wycen wymianę zanim zakochasz się w ogłoszeniu.",
      "The 320d people still want, with a later year on the door.",
      "320d, którego ludzie nadal chcą, z późniejszym rokiem na drzwiach.",
      "Still N47. “Facelift 320d” is not a synonym for safe.",
      "Nadal N47. „Lift 320d” to nie synonim bezpiecznego.",
    ),
  ],
  "325d-M57": [
    band(
      2006,
      2010,
      "The {year} {code} {model} with the {engine} is the six-cylinder diesel with swirl flaps, not the N47 four. Flaps can break off into the intake; that is a different fault from a rear chain. It tows and motorways better than a 320d. Injector and swirl work is still money. Confirm M57 — a 325d is not a 320d with a sticker.",
      "{year} {code} {model} z {engine} to dieslowska szóstka z klapami, nie czwórka N47. Klapy potrafią wpaść do dolotu; to inna usterka niż łańcuch z tyłu. Lepiej ciągnie i jedzie w trasę niż 320d. Wtryski i klapy to nadal pieniądze. Potwierdź M57 — 325d to nie 320d z naklejką.",
      "M57 six. Stronger than 320d, without N47’s chain fame.",
      "Szóstka M57. Mocniejsza niż 320d, bez sławy łańcucha N47.",
      "Swirl flaps and diesel bills. Not a cheap 320d.",
      "Klapy i dieslowskie rachunki. To nie tani 320d.",
    ),
  ],
  "330d-M57": [
    band(
      2005,
      2008,
      "The {year} {code} {model} with the {engine} is the early 3.0 diesel six — swirl flaps, not N47. It is the E90 that makes motorway sense if the flaps and history are clean. Parts are common. It is thirstier and dearer than a 320d. Do not blend it with N57 330d; different chain story, different years.",
      "{year} {code} {model} z {engine} to wczesny diesel 3.0 R6 — klapy, nie N47. To E90, które ma sens w trasie, gdy klapy i historia są czyste. Części są. Żwawiej pali i drożej niż 320d. Nie mieszaj z 330d N57; inna historia łańcucha, inne lata.",
      "The classic 330d. Muscle without N47 panic.",
      "Klasyczny 330d. Mięśnie bez paniki N47.",
      "Flaps, leaks, rust. A neglected M57 is still expensive.",
      "Klapy, wycieki, rdza. Zaniedbane M57 nadal jest drogie.",
    ),
  ],
  "330d-N57": [
    band(
      2008,
      2012,
      "The {year} {code} {model} with the {engine} is the later 330d. N57 is a chain diesel, milder than N47, not a teddy bear. Timing noise and service history matter. It is not the M57 330d from 2005. In Poland this is a high-mileage motorway tool. Check chain and intake, then the subframe like any E90.",
      "{year} {code} {model} z {engine} to późniejszy 330d. N57 to diesel z łańcuchem, łagodniejszy niż N47, nie pluszak. Hałas rozrządu i historia serwisowa mają znaczenie. To nie M57 330d z 2005. W PL to narzędzie na trasę z wysokim przebiegiem. Łańcuch i dolot, potem belka jak w każdym E90.",
      "Strong 3.0, less infamous than N47 320d.",
      "Mocne 3.0, mniej osławione niż 320d N47.",
      "Still a chain diesel. Not the early M57 330d.",
      "Nadal diesel z łańcuchem. To nie wczesne M57 330d.",
    ),
  ],
  "335d-M57": [
    band(
      2006,
      2011,
      "The {year} {code} {model} with the {engine} is the twin-turbo diesel six — swirl flaps plus more heat and more things to leak. It is quick and thirsty for a 3 Series. Specialists in Poland know it; parts are not exotic. It is not an N47 four and not a 335i. Buy the history, not the acceleration clip.",
      "{year} {code} {model} z {engine} to biturbo dieslowska szóstka — klapy plus więcej ciepła i wycieków. Szybka i żarłoczna jak na trójkę. Specjaliści w PL ją znają; części nie są egzotyką. To nie czwórka N47 i nie 335i. Kup historię, nie klip z przyspieszenia.",
      "The fast diesel E90. M57, not N47.",
      "Szybki diesel E90. M57, nie N47.",
      "Flaps, turbos, bills. Neglect is expensive.",
      "Klapy, turbiny, rachunki. Zaniedbanie jest drogie.",
    ),
  ],
  "e46:330i-M54": [
    band(
      2000,
      2006,
      "The {year} {code} {model} with the {engine} is the E46 petrol people still recommend: cooling plastics and DISA, not an N47 chain. It is old. Rust on the subframe matters more than a tidy engine bay. Independents know every hose. Do not pay E90 N52 money for an M54 with a cooked head.",
      "{year} {code} {model} z {engine} to benzyna E46, którą ludzie nadal polecają: plastik chłodzenia i DISA, nie łańcuch N47. Jest stare. Rdza belki waży więcej niż ładna komora. Niezależni znają każdy przewód. Nie płać ceny N52 E90 za M54 z ugotowaną głowicą.",
      "The classic E46 six. Parts, feel, known jobs.",
      "Klasyczna szóstka E46. Części, czucie, znane etaty.",
      "Age rust and cooling. This is not a young car.",
      "Rdza wieku i chłodzenie. To nie młode auto.",
      "{year} {code} {model} с {engine} — бензин E46, который всё ещё советуют: пластик охлаждения и DISA, не цепь N47. Машина старая. Ржавчина подрамника важнее чистого моторного отсека. Независимые знают каждый шланг. Не плати деньги N52 E90 за M54 с поведённой головой.",
      "Классическая шестёрка E46. Запчасти, характер, известные работы.",
      "Возрастная ржавчина и охлаждение. Это не молодая машина.",
    ),
  ],
  "e46:320d-M47": [
    band(
      1998,
      2005,
      "The {year} {code} {model} with the {engine} is the E46 volume diesel: swirl flaps, not a gearbox-end chain. Confirm M47 on the plate — later 3 Series 320d is N47. It towed, taxied, and sat in salt. Flaps and EGR are money; a rotten shell is the real write-off.",
      "{year} {code} {model} z {engine} to wolumenowy diesel E46: klapy, nie łańcuch od skrzyni. Potwierdź M47 na tabliczce — późniejsze 320d to N47. Ciągnął, jeździł w taxi i stał w soli. Klapy i EGR to pieniądze; zgniła skorupa kasuje auto naprawdę.",
      "The 320d before N47. Known, everywhere, cheap to fuel.",
      "320d sprzed N47. Znany, wszędzie, tanio pali.",
      "Flaps, rust, high miles. Not a late E90 320d.",
      "Klapy, rdza, wysokie przebiegi. To nie późne 320d E90.",
      "{year} {code} {model} с {engine} — массовый дизель E46: заслонки, не цепь со стороны коробки. Подтверди M47 на шильдике — поздние 320d это N47. Тягал, таксовал и стоял в соли. Заслонки и EGR — деньги; гнилой кузов списывает машину по-настоящему.",
      "320d до N47. Известен, везде, дёшево кормить.",
      "Заслонки, ржавчина, большой пробег. Не поздний 320d E90.",
    ),
  ],
  "f30:320i-N20": [
    band(
      2012,
      2016,
      "The {year} {code} {model} with the {engine} is the F30 petrol scare: early N20 chain and VANOS, not a B48. Rattle at start is the tell. Later years are calmer, not safe. This is not an E90 320i N43/N46. Ask what was done to the chain before you like the listing.",
      "{year} {code} {model} z {engine} to strach benzyny F30: wczesny łańcuch i VANOS N20, nie B48. Stuk przy starcie. Późniejsze lata spokojniejsze, nie bezpieczne. To nie 320i E90 N43/N46. Pytaj, co zrobiono z łańcuchem, zanim polubisz ogłoszenie.",
      "Turbo four, cheap to tax, everywhere on OTOMOTO.",
      "Turboczwórka, tani w podatku, wszędzie na OTOMOTO.",
      "N20 chain. This is not the later B48 330i.",
      "Łańcuch N20. To nie późniejsze 330i B48.",
      "{year} {code} {model} с {engine} — бензиновый страх F30: ранняя цепь и VANOS N20, не B48. Стук на запуске. Поздние годы спокойнее, не безопасны. Это не 320i E90 N43/N46. Спроси, что сделали с цепью, прежде чем понравится объявление.",
      "Турбочетвёрка, дешёвый налог, везде на OTOMOTO.",
      "Цепь N20. Это не поздняя 330i B48.",
    ),
  ],
  "f30:320d-N47": [
    band(
      2012,
      2015,
      "The {year} {code} {model} with the {engine} is still N47 in an F30 shell — rear chain, high Polish miles, taxi-shaped. A facelift 3 Series does not cancel the gearbox-end chain. This is not B47. Price a chain job or walk.",
      "{year} {code} {model} z {engine} to nadal N47 w skorupie F30 — łańcuch z tyłu, polskie kilometry, kształt taxi. Lift trójki nie kasuje łańcucha od skrzyni. To nie B47. Wycen łańcuch albo odejdź.",
      "The 320d people search first on this generation.",
      "320d, którego ludzie szukają najpierw w tej generacji.",
      "Still N47. F30 is not a synonym for safe 320d.",
      "Nadal N47. F30 to nie synonim bezpiecznego 320d.",
      "{year} {code} {model} с {engine} — всё ещё N47 в кузове F30: задняя цепь, польский пробег, форма такси. Рестайлинг тройки не отменяет цепь со стороны коробки. Это не B47. Оцени работу по цепи или уходи.",
      "320d, который ищут первым в этом поколении.",
      "Всё ещё N47. F30 — не синоним безопасного 320d.",
    ),
  ],
  "f30:320d-B47": [
    band(
      2015,
      2019,
      "The {year} {code} {model} with the {engine} is B47, not N47. The chain story is milder; EGR cooler and intake carbon are the Poland-mileage tax. Do not buy it because a forum said “updated 320d”. Confirm B47 on the plate.",
      "{year} {code} {model} z {engine} to B47, nie N47. Łańcuch łagodniejszy; chłodnica EGR i nagar to podatek od polskich kilometrów. Nie kupuj, bo forum rzekło „poprawiony 320d”. Potwierdź B47 na tabliczce.",
      "Later 320d. The one people mean when they say the diesel got better.",
      "Późniejszy 320d. Ten, który ludzie mają na myśli, gdy diesel „się poprawił”.",
      "EGR and carbon. Not an N47 write-off — still not free.",
      "EGR i nagar. Nie kasacja N47 — nadal nie za darmo.",
      "{year} {code} {model} с {engine} — это B47, не N47. Цепь мягче; охладитель EGR и нагар — налог на польский пробег. Не бери, потому что форум сказал «обновлённый 320d». Подтверди B47 на шильдике.",
      "Поздний 320d. Тот, который имеют в виду, когда дизель «починили».",
      "EGR и нагар. Не приговор N47 — всё равно не бесплатно.",
    ),
  ],
  "e60:530d-M57": [
    band(
      2003,
      2010,
      "The {year} {code} {model} with the {engine} is the E60 diesel people still recommend: M57 six, swirl flaps, not N47. iDrive and rust still apply. It is a 5 Series that tows. Confirm M57 — a 520d N47 is a different night. Buy the history and a dry subframe.",
      "{year} {code} {model} z {engine} to diesel E60, który ludzie nadal polecają: szóstka M57, klapy, nie N47. iDrive i rdza nadal obowiązują. To piątka, która ciągnie. Potwierdź M57 — 520d N47 to inny wieczór. Kup historię i suchą belkę.",
      "The usable E60 diesel. Strong, known, parts exist.",
      "Używalny diesel E60. Mocny, znany, części są.",
      "Flaps, electronics, rust. Neglect is a 5 Series bill.",
      "Klapy, elektronika, rdza. Zaniedbanie to rachunek piątki.",
      "{year} {code} {model} с {engine} — дизель E60, который всё ещё советуют: шестёрка M57, заслонки, не N47. iDrive и ржавчина всё равно. Это пятёрка, которая тянет. Подтверди M57 — 520d N47 другой вечер. Бери историю и сухой подрамник.",
      "Живой дизель E60. Сильный, известный, запчасти есть.",
      "Заслонки, электрика, ржавчина. Заброс — счёт пятёрки.",
    ),
  ],
  "e60:520d-N47": [
    band(
      2007,
      2010,
      "The {year} {code} {model} with the {engine} is N47 in a 5 Series — same rear chain as the E90 320d, more mass, more miles. A cheap 520d is not a bargain 530d. Confirm N47. Price the chain before you like the iDrive demo.",
      "{year} {code} {model} z {engine} to N47 w piątce — ten sam łańcuch z tyłu co 320d E90, więcej masy, więcej kilometrów. Tanie 520d to nie okazja na 530d. Potwierdź N47. Wycen łańcuch zanim polubisz dema iDrive.",
      "Cheap to fuel, common on Polish classifieds.",
      "Tanio pali, częste na polskich ogłoszeniach.",
      "Rear chain in a bigger, heavier car.",
      "Łańcuch z tyłu w większym, cięższym aucie.",
      "{year} {code} {model} с {engine} — N47 в пятёрке: та же задняя цепь, что у 320d E90, больше массы и пробега. Дешёвый 520d — не выгодный 530d. Подтверди N47. Оцени цепь, прежде чем понравится демо iDrive.",
      "Дёшево кормить, часто на польских объявлениях.",
      "Задняя цепь в более тяжёлой машине.",
    ),
  ],
  "e39:530d-M57": [
    band(
      1998,
      2003,
      "The {year} {code} {model} with the {engine} is the E39 530d: M57, swirl flaps, cooling plastics, not N47. Age rust writes these off. It is the diesel five people romanticise. Jack the subframe and look at the tank. A pretty listing with original flaps is homework.",
      "{year} {code} {model} z {engine} to 530d E39: M57, klapy, plastik chłodzenia, nie N47. Rdza wieku kasuje te auta. To diesel, który ludzie romantyzują. Podnośnik, belka, zbiornik. Ładne ogłoszenie z oryginalnymi klapami to praca domowa.",
      "The classic 530d. Torque, parts, analogue 5 Series.",
      "Klasyczny 530d. Moment, części, analogowa piątka.",
      "Rust and cooling. Romance is not a score.",
      "Rdza i chłodzenie. Romans to nie ocena.",
      "{year} {code} {model} с {engine} — 530d E39: M57, заслонки, пластик охлаждения, не N47. Возрастная ржавчина списывает эти машины. Это дизель, который романтизируют. Подъёмник, подрамник, бачок. Красивое объявление с родными заслонками — домашнее задание.",
      "Классический 530d. Момент, запчасти, аналоговая пятёрка.",
      "Ржавчина и охлаждение. Романтика — не оценка.",
    ),
  ],
  "f10:520d-N47": [
    band(
      2010,
      2014,
      "The {year} {code} {model} with the {engine} is N47 520d in an F10 — rear chain, taxi miles, 5 Series running costs. This is not N57 530d. A facelift five does not cancel the gearbox-end chain.",
      "{year} {code} {model} z {engine} to 520d N47 w F10 — łańcuch z tyłu, kilometry taxi, koszty piątki. To nie 530d N57. Lift piątki nie kasuje łańcucha od skrzyni.",
      "The volume F10 diesel people can still afford to fuel.",
      "Wolumenowy diesel F10, który da się jeszcze tanio palić.",
      "N47 in a heavier car. Not the 530d.",
      "N47 w cięższym aucie. To nie 530d.",
      "{year} {code} {model} с {engine} — 520d N47 в F10: задняя цепь, таксомоторный пробег, расходы пятёрки. Это не 530d N57. Рестайлинг пятёрки не отменяет цепь со стороны коробки.",
      "Массовый дизель F10, который ещё можно дёшево кормить.",
      "N47 в более тяжёлой машине. Это не 530d.",
    ),
  ],
  "f10:530d-N57": [
    band(
      2010,
      2017,
      "The {year} {code} {model} with the {engine} is the F10 six people want: N57, milder chain than N47, not a teddy bear. High Polish miles. Timing noise and history matter. This is not a 520d with a 530d badge.",
      "{year} {code} {model} z {engine} to szóstka F10, której ludzie chcą: N57, łańcuch łagodniejszy niż N47, nie pluszak. Polskie przebiegi. Hałas rozrządu i historia mają znaczenie. To nie 520d z znaczkiem 530d.",
      "The grown-up F10 diesel. Stronger than 520d, less infamous than N47.",
      "Dorosły diesel F10. Mocniejszy niż 520d, mniej osławiony niż N47.",
      "Still a chain diesel. Service history or walk.",
      "Nadal diesel z łańcuchem. Historia serwisowa albo odejdź.",
      "{year} {code} {model} с {engine} — шестёрка F10, которую хотят: N57, цепь мягче N47, не плюшевый мишка. Польский пробег. Шум ГРМ и история важны. Это не 520d с шильдиком 530d.",
      "Взрослый дизель F10. Сильнее 520d, менее печально знаменит, чем N47.",
      "Всё ещё цепной дизель. Сервисная история или уходи.",
    ),
  ],
  "e87:120d-N47": [
    band(
      2007,
      2011,
      "The {year} {code} {model} with the {engine} is N47 in a 1 Series — same rear chain as the E90 320d, rustier hatch, cheaper listing. Small does not mean safe. Confirm N47, not M47 118d.",
      "{year} {code} {model} z {engine} to N47 w jedynce — ten sam łańcuch z tyłu co 320d E90, bardziej rdzawy hatch, tańsze ogłoszenie. Małe nie znaczy bezpieczne. Potwierdź N47, nie 118d M47.",
      "Cheap BMW diesel hatch. Everywhere in Poland.",
      "Tani dieslowy hatch BMW. Wszędzie w Polsce.",
      "N47 chain in a rotting 1 Series shell.",
      "Łańcuch N47 w rdzewiejącej skorupie jedynki.",
      "{year} {code} {model} с {engine} — N47 в единице: та же задняя цепь, что у 320d E90, более ржавый хэтч, дешевле объявление. Маленький не значит безопасный. Подтверди N47, не 118d M47.",
      "Дешёвый дизельный хэтч BMW. Везде в Польше.",
      "Цепь N47 в гниющем кузове единицы.",
    ),
  ],
  "e70:30d-M57": [
    band(
      2007,
      2010,
      "The {year} {code} {model} with the {engine} is the E70 diesel people still buy: M57 six, swirl flaps, plus transfer case. It towed. A quiet figure-eight matters as much as the engine. This is not N57 40d and not a 5 Series.",
      "{year} {code} {model} z {engine} to diesel E70, który ludzie nadal kupują: szóstka M57, klapy plus rozdzielnica. Ciągnął. Cicha ósemka waży tyle co silnik. To nie 40d N57 i nie piątka.",
      "The usable X5 diesel of this generation.",
      "Używalny diesel X5 tej generacji.",
      "Transfer case and SUV bills on top of flaps.",
      "Rozdzielnica i rachunki SUV na górze klap.",
      "{year} {code} {model} с {engine} — дизель E70, который всё ещё берут: шестёрка M57, заслонки плюс раздатка. Тягал. Тихая восьмёрка весит столько же, сколько мотор. Это не 40d N57 и не пятёрка.",
      "Живой дизель X5 этого поколения.",
      "Раздатка и счета SUV поверх заслонок.",
    ),
  ],
  "e53:3.0d-M57": [
    band(
      2001,
      2006,
      "The {year} {code} {model} with the {engine} is the first X5 diesel: M57, flaps, transfer case, age rust. It is a truck. Cooling and the shell matter more than a tidy interior. Not an E70.",
      "{year} {code} {model} z {engine} to pierwszy diesel X5: M57, klapy, rozdzielnica, rdza wieku. To ciężarówka. Chłodzenie i skorupa ważą więcej niż ładne wnętrze. To nie E70.",
      "Known six, parts exist, the X5 people could afford.",
      "Znana szóstka, części są, X5, na które było stać.",
      "Rust, case, cooling. A cheap E53 is a project.",
      "Rdza, rozdzielnica, chłodzenie. Tanie E53 to projekt.",
      "{year} {code} {model} с {engine} — первый дизель X5: M57, заслонки, раздатка, возрастная ржавчина. Это грузовик. Охлаждение и кузов важнее красивого салона. Не E70.",
      "Известная шестёрка, запчасти есть, X5, на который хватало денег.",
      "Ржавчина, раздатка, охлаждение. Дешёвый E53 — проект.",
    ),
  ],
  "f20:118d-N47": [
    band(
      2011,
      2015,
      "The {year} {code} {model} with the {engine} is N47 in an F20 — rear chain, city miles that are often taxi miles. Later B47 120d is a different engine. Confirm N47. Small hatch, same chain tax as a 320d.",
      "{year} {code} {model} z {engine} to N47 w F20 — łańcuch z tyłu, miejskie kilometry często taxi. Późniejszy 120d B47 to inny silnik. Potwierdź N47. Mały hatch, ten sam podatek łańcucha co 320d.",
      "Cheap to fuel, rear-drive 1 Series diesel.",
      "Tanio pali, dieslowa jedynka na tył.",
      "N47 chain. Not the later B47.",
      "Łańcuch N47. To nie późniejsze B47.",
      "{year} {code} {model} с {engine} — N47 в F20: задняя цепь, городской пробег часто таксомоторный. Поздний 120d B47 — другой мотор. Подтверди N47. Маленький хэтч, тот же налог цепи, что у 320d.",
      "Дёшево кормить, заднеприводный дизель 1 серии.",
      "Цепь N47. Это не поздний B47.",
    ),
  ],
  "e83:3.0d-M57": [
    band(
      2003,
      2010,
      "The {year} {code} {model} with the {engine} is the first X3 diesel six: M57, flaps, transfer case, rust. Size people in Poland actually park. A quiet case and dry sills beat a strong motorway pull on a rotten shell.",
      "{year} {code} {model} z {engine} to pierwsza dieslowska szóstka X3: M57, klapy, rozdzielnica, rdza. Rozmiar, który w PL da się zaparkować. Cicha skrzynka i suche progi biją mocny ciąg na zgniłej skorupie.",
      "The X3 that tows without X5 money.",
      "X3, które ciągnie bez pieniędzy X5.",
      "Case, rust, flaps. Not a cute crossover.",
      "Rozdzielnica, rdza, klapy. To nie ładne crossover.",
      "{year} {code} {model} с {engine} — первая дизельная шестёрка X3: M57, заслонки, раздатка, ржавчина. Размер, который в Польше реально паркуют. Тихая раздатка и сухие пороги бьют сильную тягу на гнилом кузове.",
      "X3, который тянет без денег X5.",
      "Раздатка, ржавчина, заслонки. Не милый кроссовер.",
    ),
  ],
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
      `${chassis.code} is ${chassis.name.en} (${chassis.years}). This card exists so you do not blend it with another generation that shares a badge. We have not signed a 0–100 table for this chassis, and we will not invent a score. ${engines ? `Typical engines on the card: ${engines}.` : "Engine rows will land here when the briefing is ready."} Start from the chassis code, not from 330i on the boot.`,
      `${chassis.code} to ${chassis.name.pl} (${chassis.years}). Ta karta jest po to, żeby nie zmieszać go z inną generacją o tym samym znaczku. Nie podpisaliśmy tabeli 0–100 dla tego podwozia i nie zmyślimy oceny. ${engines ? `Typowe silniki na karcie: ${engines}.` : "Wiersze silników wpadną, gdy briefing będzie gotowy."} Zaczynaj od kodu podwozia, nie od 330i na klapie.`,
      `${chassis.code} — это ${chassis.name.ru} (${chassis.years}). Карточка нужна, чтобы не смешать поколение с другим с тем же шильдиком. Таблицы 0–100 для этого шасси мы не подписывали и оценку не выдумаем. ${engines ? `Типичные моторы на карточке: ${engines}.` : "Строки моторов появятся, когда брифинг будет готов."} Начинай с кода шасси, не с 330i на крышке.`,
    ),
    good: loc(
      "The generation is named, so it will not be mixed with the next one.",
      "Generacja jest nazwana, więc nie zmiesza się z następną.",
      "Поколение названо, его не смешают со следующим.",
    ),
    bad: loc(
      "No signed 0–100 yet. Do not treat the card as a full briefing.",
      "Nie ma jeszcze podpisanego 0–100. Nie traktuj karty jako pełnego briefingu.",
      "Подписанного 0–100 ещё нет. Не считай карточку полным брифингом.",
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
  const tail = BODY_TAIL[chassis.slug] ?? loc("", "");
  if (!hit) {
    return {
      summary: loc(
        `The ${variant.year} ${variant.chassisCode} ${variant.model} ${variant.engine} is in the table, but this paragraph is still a stub. Use the score and the fault list, not a fake review. ${tail.en}`,
        `${variant.year} ${variant.chassisCode} ${variant.model} ${variant.engine} jest w tabeli, ale ten akapit jest jeszcze zaślepką. Użyj oceny i listy usterek, nie fałszywej recenzji. ${tail.pl}`,
        `${variant.year} ${variant.chassisCode} ${variant.model} ${variant.engine} есть в таблице, но этот абзац ещё заглушка. Смотри оценку и список поломок, не фальшивый обзор. ${tail.ru}`,
      ),
      good: loc("It has a scored row.", "Ma wiersz z oceną.", "Есть строка с оценкой."),
      bad: loc("The prose briefing is not finished.", "Tekstowy briefing nie jest skończony.", "Текстовый брифинг не закончен."),
    };
  }
  return fillVerdict(hit, variant, bodyWord, tail);
}
