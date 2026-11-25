/* ---------------- bonenkeuzehulp: van het land tot in je kop ----------------
   Een getekende wereldkaart die drie niveaus diep gaat: werelddeel, land,
   streek. Op elk niveau staat waar het bekend om staat en welke processen er
   gebruikt worden -- je kiest niet alleen een zak, je snapt achteraf ook
   waarom hij smaakt zoals hij smaakt.

   De landvormen zijn ruwe omtrekken op echte lengte- en breedtegraden. Geen
   atlas, wel herkenbaar. De hoogte is 1,9 keer uitgerekt, anders wordt de
   koffiegordel een streepje op een telefoon.                              */
const BP_REK=1.9;
const bpX=lon=>lon, bpY=lat=>-lat*BP_REK;

const BP_LANDEN=[
 {id:'elsalvador',deel:'amerika',naam:'El Salvador',pts:[[-90.1,14.1],[-87.7,14],[-87.7,13.15],[-89.7,13.15],[-90.1,13.8]]},
 {id:'jamaica',deel:'amerika',naam:'Jamaica',pts:[[-78.4,18.5],[-76.2,18.2],[-76.2,17.7],[-78.4,18]]},
 {id:'dominicaans',deel:'amerika',naam:'Dominicaanse Rep.',pts:[[-72,19.9],[-68.3,19],[-68.5,18.2],[-71.7,17.6],[-72,18.6]]},
 {id:'hawai',deel:'amerika',naam:'Hawaï',pts:[[-156.1,20],[-155,20.3],[-154.8,19.5],[-155.6,18.9],[-156.05,19.5]]},
 {id:'malawi',deel:'afrika',naam:'Malawi',pts:[[33.2,-9.6],[33,-12],[32.7,-13.6],[34.5,-16.2],[35.4,-16],[35.9,-14.3],[34.6,-11.6],[34,-9.5]]},
 {id:'zambia',deel:'afrika',naam:'Zambia',pts:[[22,-16.2],[25.3,-17.8],[28.9,-16],[30.4,-15.6],[33.7,-12.5],[33,-9.6],[30.5,-8.3],[29,-13.4],[24.5,-13],[22,-13]]},
 {id:'zimbabwe',deel:'afrika',naam:'Zimbabwe',pts:[[25.2,-17.8],[26,-19],[27.7,-20.1],[29.4,-22.2],[31.3,-22.4],[32.5,-21.3],[32.9,-19.7],[33,-16.6],[30.4,-15.6],[28.9,-16]]},
 {id:'kameroen',deel:'afrika',naam:'Kameroen',pts:[[8.5,4.6],[9.9,2.2],[16.1,2.3],[15,7.6],[15.7,9.9],[14.1,13.1],[13.2,12.4],[12.8,8.7],[10.7,6.9],[8.8,5.8]]},
 {id:'ivoorkust',deel:'afrika',naam:'Ivoorkust',pts:[[-8.6,10.5],[-6.2,10.7],[-2.5,9.5],[-2.8,5.1],[-4.6,5.1],[-7.5,4.4],[-8,6.4],[-8.6,7.7]]},
 {id:'yunnan',deel:'azie',naam:'Yunnan (China)',pts:[[97.5,25.5],[99,28.2],[100.2,29.2],[103,28.5],[106,27.5],[105.9,24.5],[104,22.5],[101.6,21.2],[99,22.5],[97.6,23.5]]},
 {id:'thailand',deel:'azie',naam:'Thailand',pts:[[97.4,18.6],[99.1,20.4],[100.5,20.3],[101.2,18.2],[103,18.4],[105.6,16],[103.6,14],[102.4,13.6],[100,13.4],[99.2,11],[98.3,8.2],[100.3,6.6],[101.9,6],[100.8,9.5],[99,14.5],[98.2,16.6]]},
 {id:'laos',deel:'azie',naam:'Laos',pts:[[100.1,20.3],[101.2,21.4],[102.1,22.5],[104,22.5],[104.8,20.4],[105.2,19],[106.5,17],[107.6,15.9],[107.4,14.5],[105.5,14],[105,15],[104,15.9],[102.1,18.1],[101.1,18.3],[100.6,19.5]]},
 {id:'myanmar',deel:'azie',naam:'Myanmar',pts:[[92.2,21.3],[93,23.7],[95,26.6],[97.4,28.5],[98.8,27.5],[98.7,24.1],[99.6,22.1],[100.2,21.5],[101.2,21.4],[100.2,20.4],[99,19.7],[98.5,16.8],[98.2,14.9],[99,13],[98.6,10],[97.6,16],[95.4,15.8],[94.2,16],[94,18],[93,19.5]]},
 {id:'filipijnen',deel:'azie',naam:'Filipijnen',pts:[[120,18.5],[121.9,18.3],[122.3,16.5],[121.5,14.2],[123,13],[124.2,11.5],[125.5,9.8],[126.5,7.2],[125.4,5.6],[123,6.5],[121.9,7],[122,9.5],[120.3,11.5],[119.9,14],[119.8,16.5]]},
 {id:'timor',deel:'azie',naam:'Oost-Timor',pts:[[124,-9.2],[125.1,-8.1],[126.6,-8.4],[127.3,-8.4],[126.9,-8.9],[125,-9.5]]},
 {id:'bali',deel:'azie',naam:'Bali',pts:[[114.45,-8.15],[115.7,-8.1],[115.6,-8.75],[114.55,-8.8]]},
 {id:'flores',deel:'azie',naam:'Flores',pts:[[119.9,-8.5],[121,-8.25],[122.4,-8.35],[123,-8.5],[122.3,-8.85],[120.8,-8.75],[119.9,-8.8]]},
 {id:'mexico',deel:'amerika',naam:'Mexico',pts:[[-117,32],[-109,31],[-97,26],[-97,18],[-91,18.5],[-88,21],[-87,17],[-94,16],[-96,15.5],[-104,19],[-106,23],[-112,29]]},
 {id:'guatemala',deel:'amerika',naam:'Guatemala',pts:[[-92.2,17.8],[-89,17.8],[-88.2,15.9],[-89.2,14],[-92.2,14.5]]},
 {id:'honduras',deel:'amerika',naam:'Honduras',pts:[[-89.3,16],[-83.2,15],[-83.4,13],[-87.8,13.2],[-89.2,14.4]]},
 {id:'nicaragua',deel:'amerika',naam:'Nicaragua',pts:[[-87.7,13.2],[-83.1,15],[-83.5,11],[-85.7,11],[-87.7,12.9]]},
 {id:'costarica',deel:'amerika',naam:'Costa Rica',pts:[[-85.9,11],[-82.6,9.6],[-82.9,8.1],[-85.6,9.8]]},
 {id:'panama',deel:'amerika',naam:'Panama',pts:[[-83,8.9],[-81.5,9.2],[-79,9.6],[-77.3,8.7],[-78.5,7.3],[-81,8],[-83,8.2]]},
 {id:'colombia',deel:'amerika',naam:'Colombia',pts:[[-77.4,8.5],[-71.5,12],[-67,6],[-67.3,1.2],[-69.5,-4],[-74,-2],[-78,0.5],[-79,2]]},
 {id:'ecuador',deel:'amerika',naam:'Ecuador',pts:[[-80.9,1.4],[-75.2,0.5],[-75.2,-4.5],[-80.2,-4.4]]},
 {id:'peru',deel:'amerika',naam:'Peru',pts:[[-81.3,-4.2],[-75,-4],[-70,-9.5],[-69,-13],[-68.9,-17],[-71.4,-17.7],[-76,-14],[-79,-8]]},
 {id:'bolivia',deel:'amerika',naam:'Bolivia',pts:[[-69.5,-10.5],[-65.3,-9.7],[-58.2,-19.9],[-62.3,-22],[-67.2,-22],[-69.6,-18]]},
 {id:'brazilie',deel:'amerika',naam:'Brazilië',pts:[[-73.9,-7.3],[-69.5,-1],[-64,1.9],[-60,4.5],[-51,4.2],[-49.9,-1],[-44,-2.5],[-38,-5],[-35,-9],[-39,-17],[-40,-21],[-48,-25],[-53,-33],[-57,-30],[-57.6,-25],[-54.6,-24],[-58,-20],[-58,-16],[-60,-15],[-65,-11],[-70,-11]]},
 {id:'ethiopie',deel:'afrika',naam:'Ethiopië',pts:[[34,8],[33,10],[36,14.5],[39,14.9],[43,12],[48,8],[44.5,4.9],[41,3.9],[36,4.5],[35,7]]},
 {id:'kenia',deel:'afrika',naam:'Kenia',pts:[[33.9,-1],[35,4.6],[41,3.9],[41.9,-1],[40.1,-2.5],[39,-4.7],[37.6,-3]]},
 {id:'tanzania',deel:'afrika',naam:'Tanzania',pts:[[29.6,-4.5],[30.8,-1],[34,-1],[37.6,-3],[39.5,-6.8],[40.4,-10.4],[37.5,-11.7],[33,-9.5],[30.7,-8.2],[29.4,-6.5]]},
 {id:'oeganda',deel:'afrika',naam:'Oeganda',pts:[[29.6,-1],[34,-1],[34.4,3.5],[31,3.8],[29.7,1.4]]},
 {id:'rwanda',deel:'afrika',naam:'Rwanda',pts:[[28.9,-1.1],[30.5,-1.1],[30.8,-2.4],[29,-2.8]]},
 {id:'burundi',deel:'afrika',naam:'Burundi',pts:[[29,-2.8],[30.8,-2.4],[30.6,-4.4],[29.2,-4.4]]},
 {id:'congo',deel:'afrika',naam:'DR Congo',pts:[[13,-5],[17,-8],[22,-11],[27,-11.5],[28.4,-13],[28.7,-4.6],[28.9,1.2],[27,5],[18,5],[16,-2]]},
 {id:'jemen',deel:'afrika',naam:'Jemen',pts:[[42.6,12.6],[52.2,15.5],[52.2,17.8],[44.5,17.5],[42.8,13.8]]},
 {id:'india',deel:'azie',naam:'India',pts:[[68.5,23.5],[72.8,19],[73.5,15],[77,8.1],[80.3,13],[84,18],[89,22],[88,26],[80,28],[74,31],[70,27]]},
 {id:'vietnam',deel:'azie',naam:'Vietnam',pts:[[102.2,22.3],[105.8,23.3],[108,21],[109.5,15],[109.3,11],[106.5,9.5],[104.9,10.5],[107,16],[105,20]]},
 {id:'sumatra',deel:'azie',naam:'Sumatra',pts:[[95.2,5.5],[97.5,5.2],[106,-5.5],[105,-6.2],[100.5,-2.5],[95.9,2.5]]},
 {id:'java',deel:'azie',naam:'Java',pts:[[105.5,-5.9],[114.5,-8],[114.4,-8.8],[106,-7.4]]},
 {id:'sulawesi',deel:'azie',naam:'Sulawesi',pts:[[119,1.5],[120.5,1],[121,-2],[124.5,-1.8],[125,-5.5],[120.5,-5.6],[119.5,-3],[118.8,-1]]},
 {id:'papoea',deel:'azie',naam:'Papoea-Nieuw-Guinea',pts:[[141,-2.7],[147,-6],[150,-10.5],[143,-9],[141,-6]]},
];
const BP_LAND=Object.fromEntries(BP_LANDEN.map(l=>[l.id,l]));
/* Groot eerst, klein daarna: anders verdwijnen Rwanda en Burundi onder de
   buurman die om ze heen ligt. */
function bpVlak(l){
  const xs=l.pts.map(p=>p[0]), ys=l.pts.map(p=>p[1]);
  return (Math.max(...xs)-Math.min(...xs))*(Math.max(...ys)-Math.min(...ys));
}
const BP_VOLGORDE=BP_LANDEN.slice().sort((a,b)=>bpVlak(b)-bpVlak(a));

/* De rest van de wereld, ruw en lichtgrijs. Puur om de kaart herkenbaar te
   maken: zonder Noord-Amerika en Euraziƫ eromheen zweven de koffielanden los
   in het niets en zie je niet waar je bent. */
const BP_ACHTER=[
 [[-168,66],[-140,70],[-95,70],[-80,62],[-64,47],[-70,42],[-75,35],[-81,25],[-97,26],[-104,19],[-106,23],[-117,32],[-125,40],[-125,49],[-135,58],[-160,60]],
 [[-17,15],[0,16],[15,32],[32,31],[35,23],[43,12],[51,12],[42,-2],[40,-16],[35,-24],[25,-34],[18,-34],[12,-18],[9,4],[-8,4]],
 [[-10,36],[3,52],[12,55],[30,60],[60,70],[100,75],[140,70],[135,55],[125,45],[122,31],[110,20],[100,10],[95,16],[92,22],[80,30],[70,35],[60,25],[52,30],[45,40],[36,36],[20,38],[10,37]],
 [[113,-22],[122,-18],[130,-12],[142,-11],[147,-20],[153,-28],[150,-38],[140,-38],[130,-32],[115,-34]],
];
/* Een paar landen zijn zo klein dat hun naam over de buren valt. Die duwen we
   een stukje weg; de maat staat in kaart-eenheden, dus hij schaalt mee. */
const BP_LBLPLEK={rwanda:[-5,-2.5],burundi:[-5,3],oeganda:[-1,-4],congo:[-5,3],
  tanzania:[2,3],kenia:[2.5,0],jemen:[2,-2],
  guatemala:[-4,-2.5],honduras:[4,-3.5],nicaragua:[5,1.5],costarica:[-6,3.5],
  panama:[6,4.5],ecuador:[-5,0.5],peru:[-2,2.5],colombia:[1,-1],
  java:[-6,3],sulawesi:[6,0.5],vietnam:[3,2],papoea:[0,3],
  elsalvador:[-6,2.5],jamaica:[0,4],dominicaans:[4,6],hawai:[0,3.5],mexico:[-9,4],
  malawi:[3,0],zambia:[-2,2],zimbabwe:[0,3],kameroen:[-4,0],ivoorkust:[0,3],
  laos:[3.5,-1],thailand:[-3.5,1],myanmar:[-3.5,0],yunnan:[0,-3.5],
  timor:[0,3],bali:[-3,-2.5],flores:[0,3],filipijnen:[4,-1]};

const BP_DELEN={
 amerika:{naam:'Midden- & Zuid-Amerika',kort:'Amerika',
  bekend:'De vertrouwde kant van de kaart. Nootachtig, chocolade, karamel, en een zuur dat zacht blijft — dit is waar de meeste mensen koffie leren drinken.',
  waarom:'Bijna alles wordt hier <b>washed</b> verwerkt: er is water genoeg, en de vruchtlaag gaat er meteen af. Dat geeft een schone, voorspelbare kop waarin je de streek proeft en niet het proces.',
  proc:'washed overheerst · honey vooral in Costa Rica en El Salvador · natural in opkomst in Brazilië',
  hoogte:'900–2200 m'},
 afrika:{naam:'Oost-Afrika & het Arabisch schiereiland',kort:'Afrika',
  bekend:'Hier komt koffie vandaan, en dat proef je. Bloemen, thee, citrus, rode bessen — een levendig zuur dat je op filter meteen herkent.',
  waarom:'Veel kleine boeren leveren aan een gezamenlijk wasstation, en die stations bepalen het proces. Ethiopië en Kenia zijn daardoor bekend om hun strakke <b>washed</b> lots, terwijl <b>natural</b> juist het fruit naar voren haalt.',
  proc:'washed en natural naast elkaar · honey zeldzaam · Jemen bijna altijd natural',
  hoogte:'1400–2300 m'},
 azie:{naam:'Zuidoost-Azië & Oceanië',kort:'Azië',
  bekend:'De aardse kant. Kruiden, tabak, cederhout, donkere chocolade — weinig zuur, veel <b>body</b>. Een kop die vult in plaats van prikkelt.',
  waarom:'Het klimaat is te vochtig om koffie in één keer droog te krijgen. Daarom bedachten ze hier <b>wet hulling</b> (giling basah): de bonen gaan half droog uit hun vlies. Dat geeft die typische aardse, zware smaak die je nergens anders vindt.',
  proc:'wet hulling in Indonesië · washed in India en Papoea · natural veel in Vietnam',
  hoogte:'800–1800 m'},
};

const BP_INFO={
 elsalvador:{hoogte:'1100–1800 m',var:'Bourbon, Pacas, Pacamara',
  bekend:'Het kleinste koffieland van Midden-Amerika, en het meest eigenzinnige. Waar de rest overstapte op nieuwe variëteiten hielden zij vast aan oude Bourbon, en hier werd Pacamara gekweekt — een reuzenboon die op cuppingtafels alles overstemt.',
  smaak:['karamel','rode appel','cacao','sinaasappel'],proc:['washed','honey','natural'],
  streken:[
   {n:'Apaneca-Ilamatepec',h:'1200–1800 m',ll:[-89.85,13.83],v:'Bourbon, Pacamara',t:'De vulkaanketen in het westen, het hoogste en bekendste gebied. Zoet en rond, met karamel en rode appel.',s:['karamel','rode appel','amandel']},
   {n:'Chalatenango',h:'1200–1600 m',ll:[-89,13.95],v:'Bourbon, Pacas',t:'Het noorden, tegen Honduras aan. Iets helderder en fruitiger, met citrus en steenfruit.',s:['sinaasappel','perzik','honing']},
   {n:'Tecapa-Chinameca',h:'1100–1500 m',ll:[-88.5,13.5],v:'Bourbon, Pacamara',t:'De oostelijke vulkanen, warm en vruchtbaar. Voller en chocoladiger, met een zachte afdronk.',s:['cacao','pruim','noot']}]},
 jamaica:{hoogte:'900–1700 m',var:'Typica (Jamaica Blue Mountain)',
  bekend:'Blue Mountain: een van de duurste en meest vervalste namen in koffie. Echt gecertificeerd komt in houten vaten en heeft een zeldzaam zachte, gebalanceerde kop — weinig zuur, veel zoet, geen scherpe randen.',
  smaak:['melkchocolade','noot','honing','zachte citrus'],proc:['washed'],
  streken:[
   {n:'Blue Mountain',h:'900–1700 m',ll:[-76.6,18.05],v:'Typica',t:'De oostelijke bergen boven Kingston, waar de mist bijna elke dag hangt. Traag rijpen, en daardoor die beroemde zachtheid: chocolade, noot en een heel milde zuurgraad.',s:['melkchocolade','hazelnoot','honing']},
   {n:'High Mountain',h:'500–900 m',ll:[-77.3,18.15],v:'Typica',t:'Lager en westelijker, buiten het beschermde gebied. Dezelfde stijl maar steviger van body, en een stuk betaalbaarder.',s:['cacao','karamel','noot']}]},
 dominicaans:{hoogte:'800–1600 m',var:'Typica, Caturra, Catuai',
  bekend:'Koffie sinds de achttiende eeuw, maar bijna alles wordt op het eiland zelf opgedronken — daardoor kom je het buiten de Cariben weinig tegen. Zacht, zoet en nootachtig, met een lage zuurgraad.',
  smaak:['cacao','noot','karamel','rijp fruit'],proc:['washed','natural'],
  streken:[
   {n:'Barahona',h:'800–1400 m',ll:[-71.1,18.25],v:'Typica',t:'Het zuidwesten, het hoogst en het bekendst. Voller en complexer dan de rest van het eiland, met cacao en rood fruit.',s:['cacao','rood fruit','karamel']},
   {n:'Jarabacoa',h:'900–1600 m',ll:[-70.63,19.12],v:'Caturra, Typica',t:'In de Cordillera Central, koel en groen. Zoet en zacht, met noot en een lichte citrus.',s:['hazelnoot','honing','citrus']},
   {n:'Ocoa',h:'800–1300 m',ll:[-70.5,18.55],v:'Typica, Catuai',t:'Kleine boeren in de bergen boven de zuidkust. Rond en mild, een makkelijke alledaagse kop.',s:['melkchocolade','amandel','appel']}]},
 hawai:{hoogte:'150–900 m',var:'Kona Typica, Caturra, Geisha',
  bekend:'Het enige koffiegebied van de Verenigde Staten, en een uitzondering op alle regels: hier groeit koffie láág, op jonge vulkanische grond met een wolkendek dat elke middag als vanzelf opkomt. Duur, want alles wordt met de hand geplukt tegen Amerikaans loon.',
  smaak:['macadamia','melkchocolade','bruine suiker','zachte citrus'],proc:['washed','natural'],
  streken:[
   {n:'Kona',h:'150–800 m',ll:[-155.9,19.6],v:'Kona Typica',t:'De westhelling van de Hualalai en Mauna Loa, een strook van dertig kilometer. Zacht en zoet, met macadamia en melkchocolade — bijna geen scherpte.',s:['macadamia','melkchocolade','bruine suiker']},
   {n:'Ka\'u',h:'500–900 m',ll:[-155.6,19.1],v:'Typica, Caturra',t:'Het zuiden, ooit suikerriet en nu koffie. Iets levendiger dan Kona, met meer fruit en citrus.',s:['sinaasappel','honing','cacao']}]},
 malawi:{hoogte:'1200–2000 m',var:'Geisha, Catimor, Agaro, Mundo Novo',
  bekend:'Klein en zacht, met een verrassing: Malawi was een van de eerste landen buiten Panama waar Geisha commercieel geplant werd. De rest is mild en thee-achtig, met een fijne body.',
  smaak:['zwarte thee','citroen','honing','amandel'],proc:['washed','natural'],
  streken:[
   {n:'Misuku Hills',h:'1700–2000 m',ll:[33.6,-9.9],v:'Geisha, Agaro',t:'Het uiterste noorden, tegen Tanzania aan en het hoogst van het land. Helder en bloemig, met citroen en zwarte thee.',s:['citroen','zwarte thee','jasmijn']},
   {n:'Viphya-noord',h:'1200–1700 m',ll:[33.8,-11.8],v:'Catimor, Geisha',t:'Het beboste plateau in het midden. Zachter en zoeter, met honing en steenfruit.',s:['honing','perzik','amandel']},
   {n:'Thyolo-Mulanje',h:'900–1300 m',ll:[35,-15.9],v:'Mundo Novo, Catimor',t:'Het zuiden, rond de Mulanje-berg, waar ook de thee groeit. Voller en nootachtiger.',s:['noot','cacao','zwarte thee']}]},
 zambia:{hoogte:'1200–1700 m',var:'Bourbon, Catimor, Java',
  bekend:'Grote landgoederen in het afgelegen noorden, dicht bij het Tanganyikameer. Lang nauwelijks te krijgen door de afstand tot een haven, maar wat eruit komt is schoon, zoet en verrassend fruitig.',
  smaak:['rood fruit','bruine suiker','citrus','cacao'],proc:['washed','natural'],
  streken:[
   {n:'Kasama',h:'1300–1700 m',ll:[31.2,-10.2],v:'Bourbon, Java',t:'Het hart van de Zambiaanse koffie, op het noordelijke plateau. Zoet en helder, met rood fruit en bruine suiker.',s:['rood fruit','bruine suiker','sinaasappel']},
   {n:'Isoka',h:'1400–1700 m',ll:[32.6,-10.1],v:'Bourbon, Catimor',t:'Tegen de Tanzaniaanse grens, iets hoger en koeler. Steviger van zuur, met citrus en cacao.',s:['citrus','cacao','pruim']}]},
 zimbabwe:{hoogte:'1000–1700 m',var:'Catimor, SL28, Caturra',
  bekend:'De koffie kwam bijna helemaal tot stilstand na de landhervormingen, en wordt sinds een paar jaar met kleine boeren weer opgebouwd. Wie hem vindt, krijgt een kop met stevig zuur en veel karakter.',
  smaak:['zwarte bes','sinaasappel','cacao','bruine suiker'],proc:['washed'],
  streken:[
   {n:'Chipinge',h:'1100–1700 m',ll:[32.6,-20.2],v:'SL28, Catimor',t:'De oostelijke hooglanden tegen Mozambique aan, met veel regen. Het bekendste van Zimbabwe: fel zuur, zwarte bes en een volle body.',s:['zwarte bes','sinaasappel','bruine suiker']},
   {n:'Honde Valley',h:'1000–1500 m',ll:[32.8,-18.6],v:'Catimor, Caturra',t:'Noordelijker, in de schaduw van de Nyanga-bergen. Zachter en zoeter, met cacao en steenfruit.',s:['cacao','perzik','honing']}]},
 kameroen:{hoogte:'1000–2000 m',var:'Java, Typica, Bourbon, robusta',
  bekend:'Arabica op de vulkanische hooglanden in het westen, robusta in het zuiden. Lang alleen bulk, maar de laatste jaren komen er coöperaties op die hun lots apart houden — en die zijn de moeite waard.',
  smaak:['cacao','specerij','rood fruit','noot'],proc:['washed','natural'],
  streken:[
   {n:'Bamboutos',h:'1400–2000 m',ll:[10.2,5.6],v:'Java, Typica',t:'Het westelijke hoogland, op oude vulkaangrond. Vol en zoet, met cacao en rood fruit.',s:['cacao','rood fruit','karamel']},
   {n:'Mount Cameroon',h:'1000–1500 m',ll:[9.3,4.3],v:'Typica, Bourbon',t:'Aan de voet van de actieve vulkaan, waar het het natst is van heel Afrika. Kruidig en vol, met een zachte zuurgraad.',s:['specerij','noot','pruim']},
   {n:'Boyo (Noordwest)',h:'1500–2000 m',ll:[10.3,6.2],v:'Java, Bourbon',t:'De hoogste percelen van het land, bij Belo en Fundong. Helderder en fruitiger dan de rest van Kameroen.',s:['citrus','rood fruit','honing']}]},
 ivoorkust:{hoogte:'300–700 m',var:'robusta (Kouilou), Arabusta',
  bekend:'Ooit de grootste robusta-producent ter wereld en nog altijd een zwaargewicht. Niet het land voor een heldere filterkop, maar zonder Ivoorkust zou de helft van de espressoblends anders smaken.',
  smaak:['donkere chocolade','hout','tabak','noot'],proc:['natural','washed'],
  streken:[
   {n:'Man',h:'400–700 m',ll:[-7.55,7.4],v:'robusta',t:'De westelijke bergen, het hoogste stukje van het land. Hier zit de meeste smaak: minder hout, meer cacao.',s:['cacao','noot','specerij']},
   {n:'Daloa',h:'250–450 m',ll:[-6.45,6.87],v:'robusta',t:'Het centrale bosgebied, de grootste productiestreek. Zwaar en vol, met tabak en donkere chocolade.',s:['tabak','donkere chocolade','hout']},
   {n:'Abengourou',h:'200–400 m',ll:[-3.5,6.7],v:'robusta, Arabusta',t:'Het oosten, tegen Ghana aan. Iets zachter, en waar geëxperimenteerd wordt met betere verwerking.',s:['noot','cacao','gedroogd fruit']}]},
 yunnan:{hoogte:'1000–1900 m',var:'Catimor, Typica, Bourbon, Geisha',
  bekend:'In dertig jaar van niets naar het grootste koffiegebied van Azië na Vietnam. Lang alleen volume voor de grote ketens, maar sinds kort komen er echt goede washed en natural lots uit — vaak nog een koopje, omdat de naam nog moet landen.',
  smaak:['bruine suiker','zwarte thee','pruim','noot'],proc:['washed','natural','honey'],
  streken:[
   {n:'Pu\'er',h:'1000–1600 m',ll:[100.97,22.82],v:'Catimor, Typica',t:'De grootste streek, ook bekend van de thee. Zoet en rond, met bruine suiker en gedroogd fruit.',s:['bruine suiker','pruim','noot']},
   {n:'Baoshan',h:'1200–1900 m',ll:[99.17,25.11],v:'Bourbon, Typica',t:'Het noorden, hoger en koeler, met de oudste aanplant van China. De helderste kop van Yunnan: zwarte thee en citrus.',s:['zwarte thee','citrus','honing']},
   {n:'Dehong',h:'1000–1500 m',ll:[98.58,24.44],v:'Catimor, Geisha',t:'Tegen Myanmar aan, warm en nat. Voller en fruitiger, en waar de meeste experimenten gebeuren.',s:['rood fruit','cacao','karamel']},
   {n:'Lincang',h:'1100–1700 m',ll:[100.09,23.88],v:'Catimor',t:'Tussen Pu\'er en Baoshan in, met steile percelen. Nootachtig en zacht, met een lange zoete afdronk.',s:['amandel','melkchocolade','honing']}]},
 thailand:{hoogte:'800–1600 m',var:'Catimor, Typica, Bourbon, Geisha',
  bekend:'Koffie kwam hier als vervanging voor papaver, in een koninklijk project om de opiumteelt te stoppen. Dat is gelukt: de noordelijke bergen leveren nu heldere, zoete arabica, en Doi Chaang is een naam op zich geworden.',
  smaak:['honing','sinaasappel','cacao','jasmijn'],proc:['washed','honey','natural'],
  streken:[
   {n:'Doi Chaang',h:'1200–1600 m',ll:[99.6,19.6],v:'Catimor, Typica',t:'Een dorp in Chiang Rai dat zijn eigen merk werd, met de boeren als mede-eigenaar. Zoet en gebalanceerd, met honing en sinaasappel.',s:['honing','sinaasappel','cacao']},
   {n:'Chiang Mai',h:'1000–1600 m',ll:[98.99,18.79],v:'Typica, Bourbon',t:'De bergen rond Doi Inthanon, het hoogste punt van Thailand. Helderder en bloemiger, met jasmijn en citrus.',s:['jasmijn','citroen','honing']},
   {n:'Nan',h:'900–1400 m',ll:[100.77,18.78],v:'Catimor, Geisha',t:'Het oosten, tegen Laos aan en pas net in beeld. Fruitig en zacht, met veel natural en honey.',s:['perzik','rood fruit','karamel']}]},
 laos:{hoogte:'1000–1350 m',var:'Typica, Bourbon, Catimor, robusta',
  bekend:'Bijna alles komt van één plek: het Bolaven-plateau, een oude vulkaankrater in het zuiden waar de Fransen de koffie brachten. Rijke rode grond, koele nachten, en een zoete kop met een volle body.',
  smaak:['cacao','karamel','gedroogd fruit','noot'],proc:['washed','natural','honey'],
  streken:[
   {n:'Bolaven-plateau',h:'1000–1350 m',ll:[106.3,15.1],v:'Typica, Bourbon, Catimor',t:'De krater zelf, rond Paksong. Diepe vulkanische grond en veel regen. Zoet en vol, met cacao en gedroogd fruit — en steeds meer mooie naturals.',s:['cacao','gedroogd fruit','karamel']},
   {n:'Xieng Khouang',h:'1000–1300 m',ll:[103.4,19.4],v:'Typica, Catimor',t:'Het noordelijke hoogland, klein en jong. Helderder en lichter van body dan het zuiden.',s:['citrus','honing','amandel']}]},
 myanmar:{hoogte:'1000–1600 m',var:'S795, Catuai, Caturra, Java',
  bekend:'Pas sinds een jaar of tien op de specialty-kaart, en het ging hard: kleine boeren in de Shan-heuvels leerden in korte tijd washed en natural verwerken. Bloemig, zoet en helder — verrassend dicht bij Ethiopië.',
  smaak:['jasmijn','sinaasappel','honing','zwarte thee'],proc:['washed','natural','honey'],
  streken:[
   {n:'Ywangan (Shan)',h:'1200–1600 m',ll:[96.5,21.2],v:'S795, Catuai',t:'Kalksteenheuvels op grote hoogte, met koele nachten. Het bloemigste van Myanmar: jasmijn, sinaasappel en een lange zoete afdronk.',s:['jasmijn','sinaasappel','honing']},
   {n:'Pyin Oo Lwin',h:'1000–1300 m',ll:[96.5,22.03],v:'Caturra, Catuai',t:'Een oude Britse bergplaats bij Mandalay, waar de eerste plantages stonden. Ronder en nootachtiger.',s:['amandel','cacao','karamel']},
   {n:'Chin Hills',h:'1200–1600 m',ll:[93.6,22.6],v:'Java, S795',t:'Het afgelegen westen, tegen India aan. Klein, hoog en kruidig, met donker fruit.',s:['specerij','pruim','zwarte thee']}]},
 filipijnen:{hoogte:'900–1800 m',var:'Typica, Bourbon, Excelsa, Liberica',
  bekend:'Het enige land waar alle vier de commerciële koffiesoorten groeien — arabica, robusta, excelsa én liberica, hier barako genoemd. De arabica uit de Cordillera is zacht en zoet; barako is een smaak die je nergens anders vindt.',
  smaak:['cacao','noot','specerij','gedroogd fruit'],proc:['washed','natural'],
  streken:[
   {n:'Benguet',h:'1000–1800 m',ll:[120.75,16.4],v:'Typica, Bourbon',t:'De Cordillera boven Baguio, het hoogste van het land. Zacht en zoet, met cacao en amandel.',s:['cacao','amandel','honing']},
   {n:'Sagada',h:'1200–1600 m',ll:[120.9,17.08],v:'Typica',t:'Kleine terrassen in de bergen, in de schaduw van pijnbomen. Helderder en fruitiger, met citrus en steenfruit.',s:['citrus','perzik','bloemig']},
   {n:'Mount Apo',h:'900–1400 m',ll:[125.27,6.99],v:'Typica, Bourbon',t:'Op Mindanao, aan de hoogste vulkaan van het land. Vol en kruidig, met gedroogd fruit.',s:['specerij','rozijn','cacao']}]},
 timor:{hoogte:'1000–1800 m',var:'Hibrido de Timor, Typica, Bourbon',
  bekend:'Een half eiland met een grote naam in de koffiewereld: hier ontstond spontaan de Hibrido de Timor, een kruising van arabica en robusta die tegen koffieroest kan. Bijna elke moderne variëteit heeft er iets van in zich. De koffie zelf groeit half wild in het bos.',
  smaak:['cacao','specerij','gedroogd fruit','noot'],proc:['washed','natural'],
  streken:[
   {n:'Ermera',h:'1200–1700 m',ll:[125.4,-8.72],v:'Hibrido de Timor, Typica',t:'De grootste koffiestreek, in de bergen boven Dili. Half wild onder schaduwbomen, bijna altijd biologisch omdat er nooit iets bijgekomen is. Vol en kruidig.',s:['cacao','specerij','noot']},
   {n:'Ainaro',h:'1300–1800 m',ll:[125.5,-8.99],v:'Typica, Bourbon',t:'Hoger en zuidelijker, tegen de bergrug aan. Helderder en zoeter, met gedroogd fruit en citrus.',s:['gedroogd fruit','citrus','honing']}]},
 bali:{hoogte:'1200–1600 m',var:'Typica, Kartika, S795',
  bekend:'Anders dan de rest van Indonesië: op Bali wordt vooral washed verwerkt, en de boeren werken in een subak abian — een traditioneel coöperatief systeem waarin ook koffie, sinaasappel en groente door elkaar staan. Dat proef je: schoon en zoet, met citrus.',
  smaak:['sinaasappel','cacao','honing','noot'],proc:['washed','natural','honey'],
  streken:[
   {n:'Kintamani',h:'1200–1600 m',ll:[115.36,-8.24],v:'Typica, Kartika',t:'Op de helling van de Batur-vulkaan, tussen de sinaasappelbomen. Die staan er niet toevallig: de citrus zit ook in de kop. Schoon, zoet en licht van body.',s:['sinaasappel','honing','cacao']}]},
 flores:{hoogte:'1200–1750 m',var:'Typica, S795, Juria',
  bekend:'Een vulkanisch eiland ten oosten van Bali, met koffie die in kleine tuinen tussen de dorpen groeit. Voller dan Bali, schoner dan Sumatra — voor veel mensen de fijnste Indonesische koffie om mee te beginnen.',
  smaak:['cacao','tabak','bruine suiker','specerij'],proc:['washed','wet hulling','natural'],
  streken:[
   {n:'Bajawa',h:'1200–1750 m',ll:[120.98,-8.7],v:'Typica, S795',t:'Het hoogland in het midden, op de flank van de Inerie-vulkaan. Zoet en vol, met cacao en bruine suiker, en net genoeg zuur om levendig te blijven.',s:['cacao','bruine suiker','sinaasappel']},
   {n:'Manggarai',h:'1100–1500 m',ll:[120.4,-8.6],v:'Juria, Typica',t:'Het westen, rond Ruteng. Kruidiger en aardser, dichter bij de Sumatra-stijl.',s:['specerij','tabak','pruim']}]},
 mexico:{hoogte:'900–1700 m',var:'Typica, Bourbon, Mundo Novo, Garnica',
  bekend:'De grootste producent van biologische koffie ter wereld, bijna allemaal kleine boeren in coöperaties. Zacht en nootachtig, met een lichte body — vaak onderschat, en daardoor vriendelijk geprijsd.',
  smaak:['amandel','melkchocolade','bruine suiker','appel'],proc:['washed','natural'],
  streken:[
   {n:'Chiapas',h:'1000–1700 m',ll:[-92.6,16.5],v:'Typica, Bourbon',t:'Tegen Guatemala aan, en dat proef je: het hoogste en helderste van Mexico, met citrus en cacao.',s:['citrus','cacao','amandel']},
   {n:'Oaxaca',h:'900–1650 m',ll:[-96.7,16.9],v:'Typica, Garnica',t:'Droge bergen, veel schaduwteelt. Zacht en zoet, met noot en een lichte bloemigheid.',s:['hazelnoot','honing','bloemig']},
   {n:'Veracruz',h:'800–1400 m',ll:[-97.6,18.9],v:'Bourbon, Mundo Novo',t:'De laagste en natste streek, dicht bij de Golf. Rond en mild, met chocolade en appel.',s:['melkchocolade','appel','karamel']}]},
 nicaragua:{hoogte:'1000–1700 m',var:'Caturra, Bourbon, Maragogype, Pacamara',
  bekend:'Het land van de reuzenbonen: Maragogype en Pacamara komen hiervandaan, met korrels twee keer zo groot als normaal. Zacht en zoet, met veel cacao.',
  smaak:['cacao','sinaasappel','karamel','noot'],proc:['washed','honey','natural'],
  streken:[
   {n:'Jinotega',h:'1100–1700 m',ll:[-86,13.1],v:'Caturra, Bourbon',t:'De grootste en hoogste streek, koel en bewolkt. Zoet en gebalanceerd, met cacao en citrus.',s:['cacao','sinaasappel','karamel']},
   {n:'Matagalpa',h:'1000–1500 m',ll:[-85.9,12.9],v:'Caturra, Maragogype',t:'Naast Jinotega, iets warmer. Voller en nootachtiger, met een zachte zuurgraad.',s:['noot','chocolade','honing']},
   {n:'Nueva Segovia',h:'1100–1650 m',ll:[-86.4,13.4],v:'Pacamara, Caturra',t:'Tegen Honduras aan, waar de wedstrijdkoffies vandaan komen. Fruitiger en helderder dan de rest van het land.',s:['perzik','citrus','bloemig']}]},
 panama:{hoogte:'1200–1900 m',var:'Geisha, Caturra, Typica, Catuai',
  bekend:'Klein land, grote naam. Hier werd Geisha ontdekt: een variëteit die naar jasmijn en bergamot smaakt en op veilingen de hoogste prijzen ter wereld haalt. De rest van Panama is ook goed, en een stuk betaalbaarder.',
  smaak:['jasmijn','bergamot','perzik','honing'],proc:['washed','natural','honey'],
  streken:[
   {n:'Boquete',h:'1200–1800 m',ll:[-82.44,8.78],v:'Geisha, Caturra',t:'Aan de voet van de Barú-vulkaan, met een mist die de kers langzaam laat rijpen. Hier komt de beroemdste Geisha vandaan: jasmijn, bergamot, bijna thee.',s:['jasmijn','bergamot','zwarte thee']},
   {n:'Volcán–Candela',h:'1200–1700 m',ll:[-82.63,8.83],v:'Geisha, Typica',t:'De andere kant van dezelfde vulkaan, droger en zonniger. Steviger van body, met steenfruit.',s:['perzik','honing','karamel']},
   {n:'Renacimiento',h:'1100–1500 m',ll:[-82.88,8.86],v:'Caturra, Catuai',t:'Het minst bekend en het meest betaalbaar. Zoet en rond, een goede kennismaking met Panama.',s:['cacao','sinaasappel','noot']}]},
 ecuador:{hoogte:'1200–2000 m',var:'Typica, Bourbon, Sidra, Caturra',
  bekend:'Klein maar eigenzinnig. Het enige land waar koffie op de evenaar én op grote hoogte groeit, en de bakermat van Sidra — een variëteit die je bijna nergens anders vindt.',
  smaak:['bloemig','tropisch fruit','honing','citrus'],proc:['washed','natural','honey'],
  streken:[
   {n:'Loja',h:'1400–2000 m',ll:[-79.2,-4],v:'Typica, Bourbon',t:'Het zuiden, tegen Peru aan. Hoog en koel, met een helder zuur en veel bloemen.',s:['bloemig','citroen','honing']},
   {n:'Pichincha',h:'1200–1900 m',ll:[-78.6,-0.2],v:'Sidra, Typica',t:'Pal op de evenaar, in de schaduw van de vulkanen. Hier komen de Sidra-lots vandaan: zoet, tropisch en heel aromatisch.',s:['tropisch fruit','jasmijn','perzik']},
   {n:'Zamora-Chinchipe',h:'1200–1800 m',ll:[-78.9,-4.1],v:'Typica, Caturra',t:'Aan de rand van het Amazonegebied, nat en groen. Voller en fruitiger, met een zachte afdronk.',s:['rood fruit','cacao','honing']}]},
 peru:{hoogte:'1200–1900 m',var:'Typica, Bourbon, Caturra, Catimor',
  bekend:'Veel kleine boeren, veel biologisch en fairtrade. Lang vooral bulk, maar de laatste jaren komen er steeds meer heldere, zoete lots uit die je zo naast een Colombiaan kunt zetten.',
  smaak:['noot','melkchocolade','sinaasappel','karamel'],proc:['washed','natural'],
  streken:[
   {n:'Cajamarca',h:'1500–1900 m',ll:[-78.5,-6.2],v:'Bourbon, Typica',t:'Het noorden, hoog en droog. De schoonste kop van Peru: citrus, bruine suiker en een nette body.',s:['sinaasappel','bruine suiker','amandel']},
   {n:'Amazonas',h:'1400–1900 m',ll:[-77.9,-5.9],v:'Typica, Caturra',t:'Naast Cajamarca, natter en groener. Zachter zuur, meer cacao en gedroogd fruit.',s:['cacao','rozijn','noot']},
   {n:'Cusco',h:'1200–1800 m',ll:[-72.5,-13],v:'Typica, Bourbon',t:'Diep in het zuiden, in de valleien onder Machu Picchu. Kruidig en vol, met een lange zoete afdronk.',s:['specerij','honing','walnoot']}]},
 bolivia:{hoogte:'1400–1900 m',var:'Typica, Caturra, Java, Geisha',
  bekend:'Klein en kwetsbaar: veel koffieland verdween naar andere gewassen. Wat er over is, is vaak bijzonder — delicaat, bloemig en zoet, met een fijne body.',
  smaak:['bloemig','honing','rood fruit','amandel'],proc:['washed','natural'],
  streken:[
   {n:'Caranavi',h:'1400–1750 m',ll:[-67.57,-15.84],v:'Typica, Java',t:'De bekendste streek, in de Yungas-vallei. Steile hellingen, kleine percelen. Bloemig en zoet, met een heldere zuurgraad.',s:['bloemig','honing','perzik']},
   {n:'Yungas',h:'1200–1700 m',ll:[-67.8,-16.3],v:'Typica, Caturra',t:'Het bredere gebied waar Caranavi in ligt, tussen de Andes en het Amazonegebied. Ronder en nootachtiger.',s:['amandel','cacao','sinaasappel']}]},
 oeganda:{hoogte:'1200–2200 m',var:'SL14, SL28, Nyasaland, robusta',
  bekend:'Na Ethiopië de grootste van Afrika, en het enige land waar robusta nog echt wild in het bos groeit. De arabica komt van de vulkanen: Mount Elgon en de Rwenzori.',
  smaak:['zwarte bes','cacao','sinaasappel','gedroogd fruit'],proc:['washed','natural'],
  streken:[
   {n:'Mount Elgon (Sipi)',h:'1600–2200 m',ll:[34.05,1.33],v:'SL14, SL28, Nyasaland',t:'Op de vulkaanhelling bij de Sipi-watervallen. Het bekendste van Oeganda: zwarte bes en cacao, met een stevige body.',s:['zwarte bes','cacao','sinaasappel']},
   {n:'Rwenzori',h:'1400–2000 m',ll:[30,0.4],v:'SL14, Bourbon',t:'De Maanbergen, aan de grens met Congo. Koeler en natter, met een zachtere zuurgraad en meer bloemen.',s:['bloemig','pruim','honing']},
   {n:'West Nile',h:'1200–1600 m',ll:[31.2,3],v:'Nyasaland, robusta',t:'Het droge noordwesten. Vol en kruidig, en hier vind je de wilde robusta die nergens anders zo groeit.',s:['specerij','tabak','donkere chocolade']}]},
 burundi:{hoogte:'1400–2000 m',var:'Red Bourbon, Jackson, Mibirizi',
  bekend:'De kleine broer van Rwanda, met hetzelfde systeem van gezamenlijke wasstations en dezelfde heldere, bloemige stijl. Vaak nog een tikje zoeter en fruitiger.',
  smaak:['rode bes','bloemig','zwarte thee','citroen'],proc:['washed','natural'],
  streken:[
   {n:'Kayanza',h:'1600–2000 m',ll:[29.63,-2.92],v:'Red Bourbon',t:'Het noorden, hoog en dichtbevolkt. De bekendste wasstations van het land staan hier. Helder, bloemig en zoet.',s:['rode bes','jasmijn','citroen']},
   {n:'Ngozi',h:'1500–1900 m',ll:[29.83,-2.9],v:'Red Bourbon, Jackson',t:'Naast Kayanza, iets lager. Ronder en zoeter, met steenfruit en karamel.',s:['perzik','karamel','sinaasappel']},
   {n:'Kirimiro',h:'1400–1800 m',ll:[29.9,-3.4],v:'Mibirizi, Bourbon',t:'Het centrale hoogland. Vol en kruidig, met een lange, zoete afdronk.',s:['specerij','honing','cacao']}]},
 congo:{hoogte:'1400–2000 m',var:'Bourbon, Rumangabo, Blue Mountain',
  bekend:'Aan het Kivumeer, tussen de vulkanen — op papier een van de beste plekken voor koffie ter wereld. Jarenlang onbereikbaar door conflict; nu bouwen coöperaties het weer op, en wat eruit komt is vol, zoet en verrassend fruitig.',
  smaak:['rood fruit','cacao','sinaasappel','bruine suiker'],proc:['washed','natural'],
  streken:[
   {n:'Zuid-Kivu',h:'1500–2000 m',ll:[28.5,-2.8],v:'Bourbon, Rumangabo',t:'Aan de westoever van het Kivumeer, waar het water de temperatuur dempt. Zoet en vol, met rood fruit en cacao.',s:['rood fruit','cacao','bruine suiker']},
   {n:'Noord-Kivu',h:'1400–1900 m',ll:[28.6,-1],v:'Bourbon, Blue Mountain',t:'In de schaduw van de Nyiragongo-vulkaan. Steviger van body, met citrus en een kruidige afdronk.',s:['sinaasappel','specerij','chocolade']},
   {n:'Ituri',h:'1300–1800 m',ll:[28.7,1],v:'Bourbon, robusta',t:'Het noorden, tegen Oeganda aan. Jonger en minder bekend, met een zachte, nootachtige kop.',s:['noot','honing','cacao']}]},
 jemen:{hoogte:'1500–2400 m',var:'Udaini, Dawairi, Tuffahi (oude landrassen)',
  bekend:'Waar koffie voor het eerst verhandeld werd — de haven Mokha gaf de mokka zijn naam. Op terrassen in de bergen, met bijna geen water, dus altijd natural en gedroogd op het dak. Wild, kruidig en onvergelijkbaar.',
  smaak:['gedroogd fruit','donkere chocolade','specerij','tabak'],proc:['natural'],
  streken:[
   {n:'Haraaz',h:'1800–2400 m',ll:[43.9,14.9],v:'Udaini, Dawairi',t:'Steile terrassen ten westen van Sanaa, tot boven de 2200 meter. Het meest verfijnde van Jemen: gedroogde vijg, kaneel en donkere chocolade.',s:['vijg','kaneel','donkere chocolade']},
   {n:'Bura\'a',h:'1500–2100 m',ll:[44.6,15.6],v:'Tuffahi, Udaini',t:'Een groen bergmassief in een droog land, met eigen mist. Zoeter en fruitiger, richting rode wijn.',s:['rode wijn','rozijn','specerij']},
   {n:'Yafa\'',h:'1600–2200 m',ll:[45.8,14.6],v:'Dawairi',t:'Het zuiden, afgelegen en klein. Aards en kruidig, met tabak en donker fruit.',s:['tabak','pruim','specerij']}]},
 vietnam:{hoogte:'500–1600 m',var:'robusta, Catimor, Typica, Bourbon',
  bekend:'De tweede grootste koffieproducent ter wereld, en veruit de grootste in robusta — die zit in bijna elke supermarktblend. Maar in de hooglanden rond Da Lat groeit inmiddels arabica die de moeite waard is, en boeren experimenteren volop met honey en natural.',
  smaak:['donkere chocolade','noot','specerij','karamel'],proc:['natural','washed','honey'],
  streken:[
   {n:'Da Lat (Lam Dong)',h:'1300–1600 m',ll:[108.45,11.94],v:'Catimor, Bourbon, Typica',t:'Het hoogste van Vietnam, koel en fris. Hier komt de arabica vandaan die het land op de kaart zet: zoet, met cacao en steenfruit.',s:['cacao','perzik','karamel']},
   {n:'Buon Ma Thuot',h:'500–800 m',ll:[108.05,12.67],v:'robusta',t:'De robusta-hoofdstad. Zwaar, bitterzoet en vol — de basis van het glas Vietnamese ijskoffie met gecondenseerde melk.',s:['donkere chocolade','noot','tabak']},
   {n:'Son La',h:'1000–1400 m',ll:[104,21.3],v:'Catimor, Typica',t:'Het verre noorden, tegen Laos aan. Jong, klein en verrassend helder voor Vietnam.',s:['citrus','honing','amandel']}]},
 java:{hoogte:'900–1600 m',var:'Typica, Ateng, S795',
  bekend:'Waar "a cup of java" vandaan komt. De oude plantages op de Ijen liggen er nog, en anders dan op Sumatra wordt hier meestal gewoon washed verwerkt — dus schoner en rustiger, met dezelfde kruidige ondergrond.',
  smaak:['specerij','cederhout','donkere chocolade','noot'],proc:['washed','wet hulling'],
  streken:[
   {n:'Ijen Plateau',h:'1000–1600 m',ll:[114.2,-8.06],v:'Typica, Ateng',t:'Oost-Java, op het vulkanische plateau met de zwavelmijn. De klassieke Java: kruidig, vol en laag in zuur, met cederhout.',s:['cederhout','specerij','chocolade']},
   {n:'Preanger (West-Java)',h:'900–1400 m',ll:[107.6,-7],v:'Typica, S795',t:'De oudste koffiestreek van Indonesië, aangelegd in de koloniale tijd. Zoeter en ronder dan Oost-Java.',s:['bruine suiker','noot','pruim']}]},
 papoea:{hoogte:'1300–1900 m',var:'Typica (Blue Mountain), Arusha, Bourbon',
  bekend:'Bijna alles komt van kleine "garden"-boeren met een paar honderd struiken achter het huis. Weinig techniek, veel karakter: een wilde, tropische kop die je nergens anders zo tegenkomt.',
  smaak:['tropisch fruit','cacao','specerij','gedroogd fruit'],proc:['washed','natural'],
  streken:[
   {n:'Eastern Highlands',h:'1400–1900 m',ll:[145.4,-6.08],v:'Typica, Arusha',t:'Rond Goroka, het hart van de Papoease koffie. Vol en fruitig, met cacao en een zachte zuurgraad.',s:['tropisch fruit','cacao','karamel']},
   {n:'Western Highlands',h:'1500–1900 m',ll:[144.3,-5.85],v:'Typica (Blue Mountain)',t:'Rond Mount Hagen, iets hoger en koeler. Helderder en zoeter, met citrus en bloemen.',s:['citrus','bloemig','honing']},
   {n:'Simbu',h:'1300–1900 m',ll:[145,-6.4],v:'Arusha, Bourbon',t:'De steilste valleien van het land, moeilijk bereikbaar. Kruidig en aards, met gedroogd fruit.',s:['specerij','rozijn','tabak']}]},
 guatemala:{hoogte:'1300–2000 m',var:'Bourbon, Caturra, Catuai, Pache',
  bekend:'Acht heel verschillende streken op een klein oppervlak. Van rokerig en vol tot bloemig en helder — Guatemala is eigenlijk acht landen in één.',
  smaak:['cacao','sinaasappel','karamel','rook'],proc:['washed','honey'],
  streken:[
   {n:'Antigua',h:'1500–1700 m',ll:[-90.73,14.56],v:'Bourbon, Caturra',t:'Tussen drie vulkanen, in een dal dat de warmte vasthoudt. Vol en rond, met cacao en een lichte rokerigheid.',s:['cacao','toffee','rook']},
   {n:'Huehuetenango',h:'1500–2000 m',ll:[-91.5,15.32],v:'Bourbon, Caturra',t:'Het hoogste van Guatemala, tegen Mexico aan. Droge wind uit Tehuantepec houdt de vorst weg, waardoor ze hier hoger kunnen planten dan waar dan ook. Fel en fruitig.',s:['sinaasappel','rode appel','honing']},
   {n:'Atitlán',h:'1500–1700 m',ll:[-91.2,14.7],v:'Bourbon, Typica',t:'Aan het meer, op vulkanische grond die veel voedsel vasthoudt. Voller en zoeter, met een duidelijke bloemige neus.',s:['bloemig','citrus','chocolade']},
   {n:'Cobán',h:'1300–1500 m',ll:[-90.37,15.47],v:'Caturra, Catuai',t:'Nat en bewolkt bijna het hele jaar. Drogen duurt lang, wat een zachtere zuurgraad geeft en een fruitig karakter.',s:['pruim','specerij','cacao']}]},
 costarica:{hoogte:'1000–1900 m',var:'Caturra, Catuai, Villa Sarchi, Geisha',
  bekend:'Het enige land dat bij wet alleen arabica toestaat. Veel boeren verwerken hun eigen oogst op een kleine micromill, en experimenteren daardoor volop met honey.',
  smaak:['honing','sinaasappel','amandel','rode appel'],proc:['washed','honey'],
  streken:[
   {n:'Tarrazú',h:'1200–1900 m',ll:[-84,9.65],v:'Caturra, Catuai',t:'De bekendste streek, hoog en koel. Helder zuur met een duidelijke zoetheid — netjes en betrouwbaar.',s:['sinaasappel','honing','amandel']},
   {n:'West Valley',h:'1000–1600 m',ll:[-84.4,10.05],v:'Villa Sarchi, Caturra',t:'Waar de meeste micromills staan, en waar honey het verst is doorgevoerd. Vaak zoeter en ronder dan Tarrazú.',s:['rode appel','karamel','abrikoos']},
   {n:'Brunca',h:'800–1300 m',ll:[-83,8.8],v:'Caturra, Catuai',t:'Zuidelijk en lager, tegen Panama aan. Zachter zuur, meer chocolade — een makkelijke kop.',s:['cacao','noot','honing']}]},
 honduras:{hoogte:'1100–1700 m',var:'Bourbon, Caturra, Catuai, Pacas',
  bekend:'Lang alleen bekend als bulkland, inmiddels een van de spannendste van Midden-Amerika. Goede prijs-kwaliteit, en steeds meer boeren die hun eigen lot apart houden.',
  smaak:['karamel','citrus','cacao','gedroogd fruit'],proc:['washed','honey','natural'],
  streken:[
   {n:'Marcala',h:'1300–1700 m',ll:[-88,14.15],v:'Bourbon, Pacas',t:'Hoog en droog, met een beschermde herkomstnaam. Zoet en helder, met citrus en karamel.',s:['citrus','karamel','honing']},
   {n:'Santa Bárbara',h:'1200–1700 m',ll:[-88.24,14.92],v:'Bourbon, Parainema, Pacas',t:'De streek waar de wedstrijdkoffies vandaan komen. Uitgesproken fruitig — perzik, abrikoos, soms tropisch.',s:['perzik','abrikoos','bloemig']},
   {n:'Copán',h:'1000–1500 m',ll:[-89.15,14.85],v:'Bourbon, Caturra',t:'Tegen Guatemala aan, op vulkanische grond. Voller en chocoladiger, met een zachte zuurgraad.',s:['cacao','pruim','noot']}]},
 colombia:{hoogte:'1200–2000 m',var:'Caturra, Castillo, Colombia, Typica',
  bekend:'Twee oogsten per jaar, dus vrijwel altijd verse koffie te krijgen. Evenwichtig: genoeg zuur om levendig te zijn, genoeg zoet om makkelijk weg te drinken.',
  smaak:['karamel','rode appel','citrus','noot'],proc:['washed','honey','natural'],
  streken:[
   {n:'Huila',h:'1300–2000 m',ll:[-75.5,2.5],v:'Caturra, Castillo',t:'De bekendste, en niet voor niets. Hoog, zuidelijk, met een fruitig zuur dat naar rode appel en tropisch fruit trekt.',s:['rode appel','karamel','tropisch fruit']},
   {n:'Nariño',h:'1600–2300 m',ll:[-77.3,1.2],v:'Caturra, Typica',t:'Vlak bij de evenaar maar heel hoog, dus koude nachten. De boon rijpt langzaam en wordt daardoor zoeter en complexer.',s:['limoen','bruine suiker','bloemig']},
   {n:'Tolima',h:'1300–1900 m',ll:[-75.2,4],v:'Caturra, Castillo',t:'Lang moeilijk bereikbaar, nu een van de spannendste streken. Zoet en zacht, met een romige body.',s:['honing','sinaasappel','cacao']},
   {n:'Antioquia',h:'1300–1800 m',ll:[-75.6,6.6],v:'Castillo, Colombia',t:'Rond Medellín, het hart van de oude koffiestreek. Klassiek en nootachtig — dit is de smaak die veel mensen "Colombiaans" noemen.',s:['noot','chocolade','karamel']}]},
 brazilie:{hoogte:'800–1350 m',var:'Yellow Bourbon, Mundo Novo, Catuai, Icatú',
  bekend:'Het grootste koffieland ter wereld, en de ruggengraat van bijna elke espressoblend. Laag zuur, veel zoet, veel body.',
  smaak:['pinda','chocolade','karamel'],proc:['natural','pulped natural','washed'],
  streken:[
   {n:'Cerrado Mineiro',h:'900–1250 m',ll:[-46.5,-18.5],v:'Mundo Novo, Catuai',t:'Vlak en droog, met een scherp gescheiden regen- en droogseizoen. Daardoor rijpt alles tegelijk en kan er machinaal geplukt worden. Heel constant.',s:['chocolade','noot','karamel']},
   {n:'Sul de Minas',h:'800–1350 m',ll:[-45.5,-21.5],v:'Yellow Bourbon, Catuai',t:'Heuvelachtig en iets koeler. Zoeter en ronder dan Cerrado, met meer fruit erin.',s:['karamel','sinaasappel','hazelnoot']},
   {n:'Mogiana',h:'900–1300 m',ll:[-47,-21],v:'Mundo Novo, Yellow Bourbon',t:'Rode, ijzerrijke grond langs de rivier. Geeft een volle kop met een zachte zuurgraad — geliefd als basis voor espresso.',s:['cacao','rode vruchten','noot']},
   {n:'Bahia',h:'700–1300 m',ll:[-41,-13],v:'Catuai, Icatú',t:'De nieuwkomer, met irrigatie en veel techniek. Schoner en helderder dan je van Brazilië verwacht.',s:['citrus','honing','amandel']}]},
 ethiopie:{hoogte:'1500–2200 m',var:'heirloom (landrassen), 74110, 74112',
  bekend:'De geboortegrond van arabica. Duizenden wilde variëteiten die nergens anders groeien — daarom smaakt Ethiopische koffie naar dingen die je bij andere landen niet tegenkomt.',
  smaak:['jasmijn','bergamot','blauwe bes','zwarte thee'],proc:['washed','natural'],
  streken:[
   {n:'Yirgacheffe',h:'1750–2200 m',ll:[38.2,6.16],v:'heirloom, 74110',t:'De klassieker onder de lichte filterkoffies. Washed is hier jasmijn, citroen en thee; natural gaat richting blauwe bes.',s:['jasmijn','citroen','zwarte thee']},
   {n:'Guji',h:'1800–2300 m',ll:[38.8,5.6],v:'heirloom, 74158',t:'Naast Sidamo, pas de laatste jaren apart verkocht. Vaak natural, en dan uitgesproken fruitig — aardbei, perzik, soms bijna wijnachtig.',s:['aardbei','perzik','cacaonib']},
   {n:'Sidamo',h:'1500–2200 m',ll:[38.5,6.7],v:'heirloom',t:'Groot gebied met veel kleine boeren. Zoet en gebalanceerd, met bloemen en citrus. Een goed startpunt als Ethiopië nieuw voor je is.',s:['bloemig','citroen','honing']},
   {n:'Harrar',h:'1400–2100 m',ll:[42.1,9.3],v:'heirloom (longberry)',t:'Droog oosten, waar altijd natural verwerkt wordt omdat er weinig water is. Zwaar fruit, bijna bosbes en rode wijn.',s:['bosbes','rode wijn','specerij']},
   {n:'Jimma',h:'1400–2000 m',ll:[36.8,7.7],v:'heirloom',t:'Westelijk en groen, met veel bos. Vroeger vooral bulk, nu ook mooie lots met een zachte, kruidige zoetheid.',s:['kruidig','honing','citrus']}]},
 kenia:{hoogte:'1400–2100 m',var:'SL28, SL34, Ruiru 11, Batian',
  bekend:'Het scherpste zuur op de kaart. Vulkanische grond en een veilingsysteem dat kwaliteit beloont — daardoor is de lat hier hoog.',
  smaak:['zwarte bes','grapefruit','tomaat','bruine suiker'],proc:['washed'],
  streken:[
   {n:'Nyeri',h:'1600–1900 m',ll:[36.95,-0.42],v:'SL28, SL34',t:'Aan de voet van Mount Kenya, op diepe rode grond. Het meest uitgesproken: zwarte bes, stevig zuur en veel body.',s:['zwarte bes','grapefruit','bruine suiker']},
   {n:'Kirinyaga',h:'1500–1900 m',ll:[37.3,-0.5],v:'SL28, SL34, Ruiru 11',t:'Dezelfde hooglanden, maar ronder en zoeter. Als Nyeri je te fel is, begin je hier.',s:['tomaat-zoet','rode appel','karamel']},
   {n:'Kiambu',h:'1400–1800 m',ll:[36.8,-1.1],v:'SL28, Batian',t:'Dicht bij Nairobi, met grotere landgoederen. Zachter en klassieker van smaak.',s:['pruim','cacao','citrus']},
   {n:'Embu',h:'1300–1800 m',ll:[37.45,-0.53],v:'SL28, Ruiru 11',t:'Kleiner en minder bekend. Steeds vaker experimenteert men hier met natural — ongewoon voor Kenia, en verrassend goed.',s:['aardbei','rum','bruine suiker']}]},
 tanzania:{hoogte:'1400–2000 m',var:'Bourbon, Kent, N39, Blue Mountain',
  bekend:'Twee gezichten: het noorden bij de Kilimanjaro lijkt op Kenia, het zuiden is zachter en zoeter. Ook het land van de peaberry — één ronde boon in plaats van twee platte.',
  smaak:['zwarte bes','citroen','cacao','gedroogde vijg'],proc:['washed','natural'],
  streken:[
   {n:'Kilimanjaro',h:'1400–1900 m',ll:[37.35,-3.07],v:'Bourbon, Kent',t:'Op de hellingen van de berg, op vulkanische grond. Fel en helder, het dichtst bij het Keniaanse profiel.',s:['zwarte bes','citroen','bruine suiker']},
   {n:'Mbeya',h:'1400–2000 m',ll:[33,-8.9],v:'Bourbon, N39',t:'Het zuidelijke hoogland. Zachter en zoeter, met steenfruit en cacao — een toegankelijke kop.',s:['perzik','cacao','honing']},
   {n:'Kigoma',h:'1200–1700 m',ll:[30,-4.9],v:'Bourbon',t:'Bij het Tanganyikameer, afgelegen en klein. Kruidig en vol, met gedroogd fruit.',s:['vijg','specerij','chocolade']}]},
 rwanda:{hoogte:'1500–2000 m',var:'Red Bourbon, Jackson',
  bekend:'Het land van de duizend heuvels, en van de wasstations: kleine boeren brengen hun kersen naar een gezamenlijk station, en dáár wordt de kwaliteit gemaakt.',
  smaak:['rode bes','bloemig','sinaasappel','zwarte thee'],proc:['washed','natural'],
  streken:[
   {n:'Nyamasheke',h:'1500–2000 m',ll:[29.15,-2.35],v:'Red Bourbon',t:'Aan het Kivumeer, waar het water de temperatuur dempt. Bloemig en delicaat, met rode bessen.',s:['rode bes','bloemig','zwarte thee']},
   {n:'Huye',h:'1600–2000 m',ll:[29.74,-2.6],v:'Red Bourbon, Jackson',t:'In het zuiden, op grote hoogte. Steviger en zoeter, met sinaasappel en karamel.',s:['sinaasappel','karamel','pruim']},
   {n:'Rulindo',h:'1500–1900 m',ll:[30,-1.75],v:'Red Bourbon',t:'Noordelijk en heuvelachtig. Schoon en helder, met een lange zoete afdronk.',s:['citroen','honing','bloemig']}]},
 sumatra:{hoogte:'1100–1600 m',var:'Ateng, Tim Tim, Gayo 1 & 2',
  bekend:'Aards, zwaar en laag in zuur. Dat komt niet van de boon maar van het proces: wet hulling geeft Sumatra zijn eigen handtekening.',
  smaak:['cederhout','tabak','donkere chocolade','specerij'],proc:['wet hulling','washed'],
  streken:[
   {n:'Gayo (Aceh)',h:'1100–1600 m',ll:[96.8,4.6],v:'Gayo 1 & 2, Ateng',t:'Het noordelijkste puntje, rond het Tawarmeer. Iets schoner dan de rest van Sumatra, met kruiden en donker fruit.',s:['specerij','pruim','cacao']},
   {n:'Lintong',h:'1100–1500 m',ll:[98.9,2.3],v:'Ateng, Tim Tim',t:'Bij het Tobameer. De klassieke Sumatra: dik, aards, cederhout en tabak. Weinig zuur, veel body.',s:['cederhout','tabak','aarde']}]},
 sulawesi:{hoogte:'1400–1900 m',var:'S795, Typica',
  bekend:'Schoner en helderder dan Sumatra, terwijl het dezelfde eilandenrij is. Een goede eerste stap in Indonesische koffie.',
  smaak:['specerij','donkere chocolade','noot'],proc:['wet hulling','washed'],
  streken:[
   {n:'Toraja',h:'1400–1900 m',ll:[119.9,-3],v:'S795, Typica',t:'Hoog in de bergen van het binnenland. Vol en zacht, met kaneel en donkere chocolade, en net iets meer zuur dan Sumatra.',s:['kaneel','chocolade','walnoot']}]},
 india:{hoogte:'900–1600 m',var:'S795, Kent, Selection 9, Cauvery',
  bekend:'Koffie die in de schaduw van peper- en kardemomstruiken groeit — en dat proef je. Weinig zuur, veel kruiden en body. Ook de thuisbasis van monsooned malabar, waar de bonen expres vochtig worden van de moesson.',
  smaak:['zwarte peper','cacao','kardemom','noot'],proc:['washed','natural'],
  streken:[
   {n:'Chikmagalur',h:'1000–1500 m',ll:[75.77,13.32],v:'S795, Kent',t:'Waar de Indiase koffie begon. Vol en kruidig, met cacao en een zachte zuurgraad.',s:['cacao','specerij','noot']},
   {n:'Coorg (Kodagu)',h:'900–1300 m',ll:[75.8,12.4],v:'S795, Selection 9',t:'De grootste streek, tussen peper en sinaasappelbomen. Zwaar en zoet, met een lange afdronk.',s:['zwarte peper','karamel','sinaasappel']},
   {n:'Araku',h:'900–1300 m',ll:[82.87,18.33],v:'S795, Cauvery',t:'Ver naar het noordoosten, een jong project met kleine boeren. Verrassend helder en bloemig voor India.',s:['bloemig','honing','citrus']}]},
};

/* Waar een boon vandaan komt herkennen we aan de tekst op de zak. Ruw, maar
   goed genoeg: het gaat erom dat de kaart weet waar je al geweest bent. */
const BP_ALIAS={
 elsalvador:['el salvador','pacamara','apaneca'],jamaica:['jamaica','blue mountain'],
 dominicaans:['dominican','dominicaan','barahona','jarabacoa'],hawai:['hawaii','hawaï','kona'],
 malawi:['malawi','misuku'],zambia:['zambia','kasama'],zimbabwe:['zimbabwe','chipinge'],
 kameroen:['cameroon','kameroen','bamboutos'],ivoorkust:['ivory coast','ivoorkust','ivoire'],
 yunnan:['yunnan','baoshan','lincang','dehong'],thailand:['thailand','doi chaang','chiang'],
 laos:['laos','bolaven'],myanmar:['myanmar','burma','ywangan','shan'],
 filipijnen:['philippin','filipijn','benguet','sagada'],timor:['timor'],
 bali:['bali','kintamani'],flores:['flores','bajawa'],
 mexico:['mexico','chiapas','oaxaca','veracruz'],guatemala:['guatemala'],honduras:['honduras'],
 nicaragua:['nicaragua','jinotega','matagalpa'],costarica:['costa rica'],panama:['panama','boquete'],
 colombia:['colombia','colombie','colombië'],ecuador:['ecuador','loja'],peru:['peru','cajamarca'],
 bolivia:['bolivia','caranavi','yungas'],brazilie:['brazil','brazilie','brazilië'],
 ethiopie:['ethiopia','ethiopie','ethiopië','yirgacheffe','guji','sidamo','harrar','jimma'],
 kenia:['kenya','kenia','nyeri','kirinyaga','kiambu'],
 tanzania:['tanzania','kilimanjaro'],oeganda:['uganda','oeganda','elgon','sipi','rwenzori'],
 rwanda:['rwanda'],burundi:['burundi','kayanza','ngozi'],congo:['congo','kivu'],jemen:['yemen','jemen','mokha','haraaz','bura'],
 india:['india','chikmagalur','coorg','araku'],vietnam:['vietnam','da lat'],
 sumatra:['sumatra','aceh','gayo','lintong','mandheling'],java:['java','ijen','preanger'],
 sulawesi:['sulawesi','toraja'],papoea:['papua','papoea','goroka','hagen']};
function bpLandVanBoon(b){
  if(!b)return null;
  const t=((b.origin||'')+' '+(b.name||'')+' '+(b.roasternotes||'')).toLowerCase();
  for(const id in BP_ALIAS)if(BP_ALIAS[id].some(a=>t.includes(a)))return id;
  return null;
}
function bpStreekVanBoon(b,landId){
  const inf=BP_INFO[landId]; if(!inf||!inf.streken)return null;
  const t=((b.origin||'')+' '+(b.name||'')).toLowerCase();
  const i=inf.streken.findIndex(st=>t.includes(st.n.toLowerCase().split(' ')[0]));
  return i>=0?i:null;
}
/* Je paspoort: elk land waar een boon vandaan kwam die op je plank stond of
   staat. Zo kleurt de kaart in naarmate je de wereld afgaat, en zie je in één
   oogopslag waar je nog nooit geweest bent. */
function bpGehad(){
  const uit=new Set();
  (state.beans||[]).forEach(b=>bpRegios(b).forEach(r=>uit.add(r.land)));
  return uit;
}
// landen waar alleen nog een wens ligt
function bpGewenst(){
  const uit=new Set();
  (state.wishlist||[]).forEach(w=>bpRegios(w).forEach(r=>uit.add(r.land)));
  return uit;
}
// en hetzelfde een niveau dieper: welke streken van dit land had je al?
function bpGehadStreken(landId){
  const uit=new Set();
  (state.beans||[]).forEach(b=>bpRegios(b).forEach(r=>{
    if(r.land===landId&&r.i!=null)uit.add(r.i);
  }));
  return uit;
}
function bpPaspoortRegel(){
  const el=document.getElementById('beanpick-sub'); if(!el)return;
  const n=bpGehad().size, totaal=Object.keys(BP_INFO).length;
  el.textContent=n
    ? (n+' van de '+totaal+' landen gehad — kijk waar je nog niet geweest bent')
    : 'de wereldkaart van de koffiegordel — land, streek, proces en variëteit';
}

const BP_PROCES={
 'washed':{u:'De vruchtlaag gaat er meteen af, vóór het drogen.',
   sm:'helder en rechtlijnig — je proeft de streek, niet het proces',
   mo:'lichter en schoner, vaak wat theeachtig'},
 'natural':{u:'De hele kers droogt om de boon heen.',
   sm:'veel meer fruit, zoeter, soms bijna wijnachtig',mo:'dikker en siroopachtig'},
 'honey':{u:'Het vruchtvlees blijft deels zitten tijdens het drogen.',
   sm:'tussen washed en natural in: zoeter, maar nog steeds helder',
   mo:'romiger, met een ronde afdronk'},
 'pulped natural':{u:'Braziliaanse variant van honey: schil eraf, plakkerig laagje eromheen.',
   sm:'zoet en nootachtig, weinig zuur',mo:'vol en zacht'},
 'wet hulling':{u:'Indonesisch (giling basah): het vlies gaat er half droog al af.',
   sm:'aards, kruidig, cederhout — heel weinig zuur',mo:'zwaar en dik, blijft lang hangen'},
};
const BP_BRAND={
 light:{t:'Houdt het zuur en het karakter van de streek overeind. Voor filter de gebruikelijke keuze.'},
 medium:{t:'Meer zoet en karamel, minder scherpte. Werkt op filter en espresso allebei.'},
 dark:{t:'Chocolade, noot en rook nemen het over. Van de herkomst blijft weinig over.'},
};

/* ---- variëteiten ----
   Wat er op de zak staat achter "variety". Je hoeft er niets mee te kiezen;
   tik er een aan en je leest in één regel wat het is. De sleutels worden in
   de naam gezocht, langste eerst, zodat "Red Bourbon" bij Bourbon uitkomt
   en "Yellow Bourbon" ook.                                                */
const BP_VAR={
 'Hibrido de Timor':'Spontane kruising van arabica en robusta op Oost-Timor. De basis van bijna elke variëteit die tegen koffieroest kan.',
 'Blue Mountain':'Typica-lijn uit Jamaica. Zacht en gebalanceerd, met weinig zuur.',
 'Kona Typica':'De Typica die sinds 1892 op Hawaï staat, aangepast aan lage hoogte.',
 'Yellow Bourbon':'Braziliaanse Bourbon met gele kersen. Zoeter en zachter van zuur.',
 'Red Bourbon':'De rode Bourbon, standaard in Rwanda en Burundi. Zoet en bloemig.',
 'Villa Sarchi':'Costaricaanse dwergmutatie van Bourbon. Zoet, met veel structuur.',
 'Mundo Novo':'Kruising van Typica en Bourbon uit Brazilië. Veel opbrengst, volle en zoete kop.',
 'Maragogype':'De olifantsboon: enorme korrels, milde en zachte kop.',
 'Pacamara':'Pacas × Maragogype. Reuzenbonen en een uitgesproken kop — kruidig, fruitig, soms wild.',
 'Parainema':'Hondurese Sarchimor-lijn die wedstrijden wint. Fruitig en schoon.',
 'Selection 9':'Indiase kruising van een Ethiopische lijn met Tafarikela. Vol en aromatisch.',
 'Ruiru 11':'Keniaanse kruising die tegen ziekte kan. Meer opbrengst, iets minder diepte dan SL28.',
 'Rumangabo':'Congolese Bourbon-selectie uit de Kivu-streek.',
 'Nyasaland':'Oost-Afrikaanse selectie uit de koloniale tijd. Taai en betrouwbaar.',
 'heirloom':'Verzamelnaam voor de duizenden wilde Ethiopische landrassen. Elke tuin is anders — daar komt die eigen smaak vandaan.',
 'Catimor':'Kruising met robusta erin, voor weerstand tegen roest. Veel opbrengst; op hoogte kan hij verrassend goed zijn.',
 'Castillo':'Colombiaanse kruising die tegen koffieroest kan. Betrouwbaar, en beter dan zijn reputatie.',
 'Colombia':'De kruising uit de jaren tachtig waar Castillo op voortbouwt. Roestbestendig en veel geplant.',
 'Bourbon':'Mutatie van Typica op Réunion. Zoeter en voller dan Typica, met meer body.',
 'Caturra':'Braziliaanse dwergmutatie van Bourbon. Compact, dus meer struiken per hectare; helder zuur, iets minder body.',
 'Catuai':'Kruising van Mundo Novo en Caturra. Houdt zich goed in wind en regen, zoet en gebalanceerd.',
 'Typica':'De oervorm waar bijna alles van afstamt. Weinig opbrengst, veel finesse: helder, zoet en schoon.',
 'Geisha':'Uit Ethiopië via Costa Rica beroemd geworden in Panama. Jasmijn, bergamot, thee — en de hoogste veilingprijzen.',
 'Pacas':'Salvadoraanse dwergmutatie van Bourbon, wat Caturra is voor Brazilië.',
 'SL28':'In de jaren dertig geselecteerd in Kenia. Diep zuur, zwarte bes, veel body — en weinig opbrengst.',
 'SL34':'Broer van SL28, iets voller en beter bestand tegen regen.',
 'SL14':'Oost-Afrikaanse selectie, gekozen op droogtebestendigheid.',
 'Batian':'Keniaanse kruising die qua smaak dicht bij SL28 komt, maar sneller draagt.',
 'Sidra':'Ecuadoraanse selectie uit Bourbon en Typica. Heel aromatisch en tropisch.',
 'Java':'Oude Ethiopische lijn die via Java in Latijns-Amerika belandde. Elegant en bloemig.',
 'S795':'Indiase kruising van Kent met een Liberica-hybride. Kruidig en vol, met weinig zuur.',
 'Kent':'Oude Indiase selectie, gekozen op weerstand tegen roest.',
 'Cauvery':'De Indiase Catimor. Veel geplant, netjes van smaak.',
 'Ateng':'Indonesische Catimor-lijn, aangepast aan het natte klimaat van Sumatra.',
 'Tim Tim':'Indonesische naam voor de Hibrido de Timor. Aards en vol.',
 'Gayo':'Selecties uit Aceh, gekweekt voor het natte hoogland.',
 'Kartika':'Indonesische Catimor-selectie, veel geplant op Bali.',
 'Juria':'Oude Typica-lijn die op Flores nog te vinden is.',
 'Arusha':'Typica-lijn uit Tanzania, ook veel geplant in Papoea.',
 'Jackson':'Bourbon-lijn die in Rwanda en Burundi naast Red Bourbon staat.',
 'Mibirizi':'Bourbon-selectie uit Rwanda, genoemd naar de missiepost waar hij ontstond.',
 'Udaini':'Jemenitisch landras, eeuwenoud en nergens anders te vinden.',
 'Dawairi':'Jemenitisch landras met kleine, dichte bonen.',
 'Tuffahi':'Jemenitisch landras; de naam betekent appel, naar de vorm van de kers.',
 'Agaro':'Ethiopische selectie die ook buiten Ethiopië geplant wordt.',
 'Icatú':'Braziliaanse kruising met robusta erin, gekweekt voor opbrengst.',
 'Garnica':'Mexicaanse kruising van Mundo Novo en Caturra.',
 'Pache':'Guatemalteekse Typica-mutatie, zacht en zoet.',
 'N39':'Tanzaniaanse selectie voor het zuidelijke hoogland.',
 'Arabusta':'Kruising van arabica en robusta, bedoeld voor lager gelegen gebieden.',
 'Liberica':'Een eigen soort naast arabica en robusta. Grote bonen, houtig en jackfruit-achtig.',
 'Excelsa':'Familie van Liberica. Zurig en fruitig, vaak in blends voor complexiteit.',
 'robusta':'Geen arabica maar canephora. Meer cafeïne, minder zuur, veel body en crema.',
 '74110':'Genummerde Ethiopische selectie uit Jimma, gekozen op weerstand tegen wortelziekte.',
 '74112':'Genummerde Ethiopische selectie uit Jimma, zusje van 74110.',
 '74158':'Genummerde Ethiopische selectie, veel geplant in Guji en Sidamo.',
};
const BP_VAR_SLEUTELS=Object.keys(BP_VAR).sort((a,b)=>b.length-a.length);
function bpVarUitleg(naam){
  const t=(naam||'').toLowerCase();
  const k=BP_VAR_SLEUTELS.find(x=>t.includes(x.toLowerCase()));
  return k?BP_VAR[k]:'';
}
let bpVarOpen=null;
function bpVarBlok(lijst){
  const namen=(lijst||'').split(',').map(x=>x.trim()).filter(Boolean);
  if(!namen.length)return '';
  const uitleg=bpVarOpen!=null?bpVarUitleg(namen[bpVarOpen]):'';
  return '<div class="bp-et">Variety</div><div class="bp-chips">'+
    namen.map((n,i)=>'<button class="bp-chip'+(bpVarOpen===i?' sel':'')+
      '" onclick="bpVarTik('+i+')">'+esc(n)+'</button>').join('')+'</div>'+
    (bpVarOpen!=null
      ? '<p class="bp-zacht" style="margin-top:7px">'+esc(uitleg||
          'Een lokale selectie; over deze naam heb ik nog geen uitleg.')+'</p>'
      : '<p class="bp-zacht" style="margin-top:7px">tik een naam aan voor wat het is</p>');
}
function bpVarTik(i){bpVarOpen=(bpVarOpen===i)?null:i;bpTeken(true);}
let bpNiv='wereld', bpDeel=null, bpLandId=null, bpStreek=null;
let bpProc=null, bpBrand=null, bpMeth=null;

function bpPad(l){return 'M'+l.pts.map(p=>bpX(p[0]).toFixed(1)+' '+bpY(p[1]).toFixed(1)).join('L')+'Z';}
function bpDoos(lijst,marge){
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  lijst.forEach(l=>l.pts.forEach(p=>{
    const x=bpX(p[0]),y=bpY(p[1]);
    if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y;
  }));
  const m=marge||0;
  return [x0-m,y0-m,(x1-x0)+m*2,(y1-y0)+m*2];
}
/* Het kijkvenster oprekken tot de verhouding van het kader, anders staat er
   links en rechts (of boven en onder) een brede lege rand. */
const BP_VERH=1.4;
function bpVerhouding(b){
  let [x,y,w,h]=b;
  if(w/h<BP_VERH){const nw=h*BP_VERH;x-=(nw-w)/2;w=nw;}
  else{const nh=w/BP_VERH;y-=(nh-h)/2;h=nh;}
  return [x,y,w,h];
}
const BP_VIEWS={
 wereld:bpVerhouding(bpDoos(BP_LANDEN,8)),
 amerika:bpVerhouding(bpDoos(BP_LANDEN.filter(l=>l.deel==='amerika'),5)),
 afrika:bpVerhouding(bpDoos(BP_LANDEN.filter(l=>l.deel==='afrika'),5)),
 azie:bpVerhouding(bpDoos(BP_LANDEN.filter(l=>l.deel==='azie'),5)),
};
/* Op landniveau zie je het hele land plus zijn streken. Niet strakker
   inzoomen op alleen het teeltgebied: de streken van Panama liggen binnen een
   halve graad van elkaar, en dan vult de landsvorm het hele kader en zie je
   niet meer wélk land je voor je hebt. Dat de stippen dicht op elkaar staan
   lost bpSpreid op. */
function bpLandView(id){
  let [x,y,w,h]=bpDoos([BP_LAND[id]],2.5);
  const st=(BP_INFO[id]&&BP_INFO[id].streken)||[];
  st.forEach(a=>{
    const px=bpX(a.ll[0]), py=bpY(a.ll[1]);
    if(px<x){w+=x-px;x=px;} if(px>x+w)w=px-x;
    if(py<y){h+=y-py;y=py;} if(py>y+h)h=py-y;
  });
  return bpVerhouding([x-1.5,y-1.5,w+3,h+3]);
}

let bpView=BP_VIEWS.wereld.slice(), bpTween=null;
function bpVenster(){
  // let op: het vijf-stappenscherm heeft óók een .bp-kaart, en die staat eerder
  // in het document. Zonder #bp-screen ervoor maat je de verkeerde kaart op
  const svg=document.querySelector('#bp-screen .bp-kaart'); if(!svg)return;
  svg.setAttribute('viewBox',bpView.map(n=>n.toFixed(2)).join(' '));
  bpMaten(svg);
}
/* Tekst en stippen staan in kaart-eenheden, maar moeten op het scherm altijd
   even groot zijn. Hoeveel schermpixels één eenheid is hangt van de zoom af,
   dus rekenen we dat na elke stap terug. */
function bpMaten(svg){
  const r=svg.getBoundingClientRect();
  // Staat de kaart nog niet in beeld, dan meet je nul. Daar stapte hij vroeger
  // uit -- en bleef de tekst op de standaardmaat staan. Die telt in kaart-
  // eenheden, dus op een ingezoomd land werd één streeknaam schermvullend.
  // Nu rekenen we door met een aanname, en meten we opnieuw zodra het wél kan.
  const breed=r.width||svg.clientWidth||(svg.parentElement&&svg.parentElement.clientWidth)||358;
  const hoog=r.height||svg.clientHeight||breed*0.62;
  const v=bpView, s=Math.min(breed/v[2], hoog/v[3]);
  if(!(s>0))return;
  if(!r.width){
    const n=(+svg.dataset.meet||0)+1;
    if(n<=20){svg.dataset.meet=n;requestAnimationFrame(()=>{if(svg.isConnected)bpMaten(svg);});}
  }else if(svg.dataset.meet)delete svg.dataset.meet;
  svg.querySelectorAll('.lbl').forEach(t=>{
    t.style.fontSize=((t.classList.contains('groot')?15.5:11.5)/s)+'px';
    t.style.strokeWidth=(2.8/s)+'px';
  });
  svg.querySelectorAll('.stip').forEach(c=>c.setAttribute('r',(9/s).toFixed(2)));
  svg.querySelectorAll('.nr').forEach(t=>{
    t.style.fontSize=(11/s)+'px'; t.setAttribute('dy',(3.8/s));
  });
  bpSpreid(svg,s);
  bpSpreidLabels(svg);
}
/* Midden-Amerika is zes kleine landen op een handbreedte. Hun namen vallen dan
   over elkaar, dus laten we ze elkaar verticaal wegduwen -- net als de
   streekstippen. De maten haalt hij uit de tekst zelf, dus dit klopt bij elke
   zoomstand en in elke taal. */
function bpSpreidLabels(svg){
  const l=[...svg.querySelectorAll('.lbl[data-y0]')];
  if(l.length<2)return;
  const items=l.map(t=>{
    let bb; try{bb=t.getBBox();}catch(e){bb={width:0,height:0};}
    return {t,x:+t.dataset.x0,y:+t.dataset.y0,w:bb.width,h:bb.height};
  });
  for(let ronde=0;ronde<30;ronde++){
    let bewogen=false;
    for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
      const a=items[i], c=items[j];
      const dx=Math.abs(a.x-c.x), dy=Math.abs(a.y-c.y);
      const nodigX=(a.w+c.w)/2*0.9, nodigY=(a.h+c.h)/2*1.1;
      if(dx<nodigX&&dy<nodigY){
        const duw=(nodigY-dy)/2+0.05;
        if(a.y<=c.y){a.y-=duw;c.y+=duw;}else{a.y+=duw;c.y-=duw;}
        bewogen=true;
      }
    }
    if(!bewogen)break;
  }
  items.forEach(it=>it.t.setAttribute('y',it.y));
}
/* Twee streken kunnen vijftien kilometer uit elkaar liggen. Op een telefoon
   vallen hun stippen dan over elkaar en kun je de achterste niet aantikken.
   Daarom duwen we ze net zo ver uit elkaar dat je ze allebei raakt. */
function bpSpreid(svg,s){
  const st=[...svg.querySelectorAll('.stip')]; if(st.length<2)return;
  const min=27/s, pos=st.map(c=>({x:+c.dataset.x0,y:+c.dataset.y0}));
  for(let ronde=0;ronde<40;ronde++){
    let bewogen=false;
    for(let i=0;i<pos.length;i++)for(let j=i+1;j<pos.length;j++){
      let dx=pos[j].x-pos[i].x, dy=pos[j].y-pos[i].y, d=Math.hypot(dx,dy);
      if(d<1e-6){dx=min/2;dy=0;d=min/2;}
      if(d<min){
        const duw=(min-d)/(2*d);
        pos[i].x-=dx*duw; pos[i].y-=dy*duw;
        pos[j].x+=dx*duw; pos[j].y+=dy*duw;
        bewogen=true;
      }
    }
    if(!bewogen)break;
  }
  st.forEach((c,i)=>{c.setAttribute('cx',pos[i].x);c.setAttribute('cy',pos[i].y);});
  svg.querySelectorAll('.nr').forEach(t=>{
    const p=pos[+t.dataset.i]; if(p){t.setAttribute('x',p.x);t.setAttribute('y',p.y);}
  });
  const naam=svg.querySelector('.lbl.groot[data-i]');
  if(naam){const p=pos[+naam.dataset.i];
    if(p){naam.setAttribute('x',p.x);naam.setAttribute('y',p.y-(15/s));}}
}
function bpZoom(doel){
  if(bpTween)cancelAnimationFrame(bpTween);
  const van=bpView.slice(), naar=doel.slice(), t0=performance.now(), duur=520;
  (function stap(nu){
    const f=Math.min(1,(nu-t0)/duur);
    const e=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;
    bpView=van.map((v,i)=>v+(naar[i]-v)*e);
    bpVenster();
    if(f<1)bpTween=requestAnimationFrame(stap); else bpTween=null;
  })(t0);
}

function bpKaartHTML(){
  const v=bpView, gehad=bpGehad(), gewenst=bpGewenst();
  let s='<svg class="bp-kaart" viewBox="'+v.join(' ')+'" preserveAspectRatio="xMidYMid meet">';
  s+='<rect class="zee" x="-200" y="-200" width="500" height="400"/>';
  s+='<rect class="band" x="-200" y="'+bpY(23.5)+'" width="500" height="'+(bpY(-23.5)-bpY(23.5))+'"/>';
  s+='<line class="lijn" x1="-200" y1="'+bpY(23.5)+'" x2="300" y2="'+bpY(23.5)+'"/>';
  s+='<line class="lijn eq" x1="-200" y1="0" x2="300" y2="0"/>';
  s+='<line class="lijn" x1="-200" y1="'+bpY(-23.5)+'" x2="300" y2="'+bpY(-23.5)+'"/>';
  BP_ACHTER.forEach(pl=>{
    s+='<path class="achter" d="M'+pl.map(p=>bpX(p[0]).toFixed(1)+' '+bpY(p[1]).toFixed(1)).join('L')+'Z"/>';
  });
  BP_VOLGORDE.forEach(l=>{
    let kl='land';
    if(bpNiv==='wereld'){ if(gehad.has(l.id))kl+=' had'; else if(gewenst.has(l.id))kl+=' wens'; }
    else if(l.deel!==bpDeel)kl+=' uit';
    else if(l.id===bpLandId)kl+=' sel';
    else if(gehad.has(l.id))kl+=' had';
    else if(gewenst.has(l.id))kl+=' wens';
    const klik=(bpNiv==='wereld')?("bpKies('deel','"+l.deel+"')")
              :(l.deel===bpDeel&&BP_INFO[l.id]?("bpKies('land','"+l.id+"')"):'');
    s+='<path class="'+kl+'" data-land="'+l.id+'" d="'+bpPad(l)+'"'+
       (klik?(' onclick="'+klik+'"'):'')+'></path>';
  });
  if(bpNiv==='wereld'){
    [['amerika',-62,27],['afrika',22,27],['azie',112,27]].forEach(function(a){
      s+='<text class="lbl groot" x="'+bpX(a[1])+'" y="'+bpY(a[2])+'">'+BP_DELEN[a[0]].kort+'</text>';
    });
  }else if(bpNiv==='deel'){
    BP_LANDEN.filter(l=>l.deel===bpDeel).forEach(l=>{
      const c=bpMidden(l), o=BP_LBLPLEK[l.id]||[0,0];
      const x=(+c[0]+o[0]), y=(+c[1]+o[1]);
      s+='<text class="lbl" x="'+x+'" y="'+y+'" data-x0="'+x+'" data-y0="'+y+'">'+
        esc(l.naam)+'</text>';
    });
  }else{
    const inf=BP_INFO[bpLandId], gehadSt=bpGehadStreken(bpLandId);
    (inf.streken||[]).forEach((st,i)=>{
      const x=bpX(st.ll[0]), y=bpY(st.ll[1]), aan=bpStreek===i;
      const wensSt=bpWensenVoor(bpLandId,i).length>0;
      s+='<circle class="stip'+(aan?' sel':(gehadSt.has(i)?' had':(wensSt?' wens':'')))+'" cx="'+x+'" cy="'+y+'" r="1" data-x0="'+x+
        '" data-y0="'+y+'" onclick="bpKies(\'streek\','+i+')"></circle>';
      s+='<text class="nr'+(aan?' aan':'')+'" x="'+x+'" y="'+y+'" data-i="'+i+
        '" onclick="bpKies(\'streek\','+i+')">'+(i+1)+'</text>';
      if(aan)s+='<text class="lbl groot" x="'+x+'" y="'+y+'" data-i="'+i+'">'+esc(st.n)+'</text>';
    });
  }
  return s+'</svg>';
}
/* Waar zit je? Dat moet je in één blik zien, ook als je even weg bent
   geweest. Vandaar dit bordje linksboven ín de kaart, naast de kop erboven. */
function bpPlek(){
  if(bpNiv==='wereld')return '<div class="bp-pad"><b>de wereld</b>'+
    '<span>'+Object.keys(BP_INFO).length+' landen met een verhaal</span></div>';
  if(bpNiv==='deel')return '<div class="bp-pad"><b>'+esc(BP_DELEN[bpDeel].kort)+'</b>'+
    '<span>pick a country</span></div>';
  const inf=BP_INFO[bpLandId];
  return '<div class="bp-pad"><b>'+esc(BP_LAND[bpLandId].naam)+'</b>'+
    '<span>'+esc(BP_DELEN[bpDeel].kort)+' · '+((inf.streken||[]).length)+' streken</span></div>';
}
function bpMidden(l){
  let sx=0,sy=0;
  l.pts.forEach(p=>{sx+=bpX(p[0]);sy+=bpY(p[1]);});
  return [(sx/l.pts.length).toFixed(1),(sy/l.pts.length).toFixed(1)];
}
function bpProcBlok(namen){
  return namen.map(n=>{
    const p=BP_PROCES[n]; if(!p)return '';
    return '<div class="bp-proc"><div class="n">'+esc(n)+'</div>'+
      '<div class="u">'+esc(p.u)+'<br><b>smaak</b> '+esc(p.sm)+' · <b>mondgevoel</b> '+esc(p.mo)+'</div></div>';
  }).join('');
}
function bpSmaken(a){return '<div class="bp-smaken">'+a.map(x=>'<span class="bp-smaak">'+esc(x)+'</span>').join('')+'</div>';}

/* Welke uitklappers openstaan. Uitleg hoort niet altijd in beeld te staan: wie hem
   één keer leest wil hem daarna niet meer zien, en wie hem nodig heeft weet nu waar
   hij zit. Eén sleutel per uitklapper, en hij blijft open tot je hem dichtdoet. */
const UIT={};
function uitklapHTML(id,kop,tekst,teken){
  const op=!!UIT[id];
  return '<button class="uitklapper" onclick="UIT[\''+id+'\']=!UIT[\''+id+'\'];'+teken+'">'+
    esc(kop)+'<span class="ll-arr">'+(op?'▾':'▸')+'</span></button>'+
    (op?('<div class="uitklap">'+tekst+'</div>'):'');
}

/* Kom je hier vanaf je bonenplank, dan wil je eerst zien waar je zelf al
   geweest bent — en pas daarna de rest van de wereld. */
function bpPlankBlok(){
  const totaal=Object.keys(BP_INFO).length, gehad=bpGehad();
  const bonen=(state.beans||[]).filter(b=>bpRegios(b).length);
  const wensen=(state.wishlist||[]).filter(w=>bpRegios(w).length);
  if(!bonen.length&&!wensen.length)return '';
  const chip=(o,fn)=>{
    const r=bpRegios(o)[0];
    return '<button class="bp-chip" onclick="'+fn+'(\''+o.id+'\')">'+
      esc(o.name||o.naam||bpRegioTekst(r))+
      '<em>'+esc(bpIsBlend(o)?'blend':bpRegioTekst(r))+'</em></button>';
  };
  /* Dichtgeklapt is dit één regel; wie zijn eigen plank zoekt vindt hem meteen, en
     wie de wereld af wil zoeken heeft er geen last van. */
  const op=!!UIT.plank;
  const tel=[bonen.length?(bonen.length+(bonen.length===1?' bean':' beans')):'',
             wensen.length?(wensen.length+' on your list'):''].filter(Boolean).join(' · ');
  let h='<div class="bp-blok vol"><button class="bp-klap" onclick="UIT.plank=!UIT.plank;bpTeken(true)">'+
    '<h3>Your shelf</h3><span class="tel">'+esc(tel)+'</span>'+
    '<span class="ll-arr">'+(op?'▾':'▸')+'</span></button>';
  if(!op)return h+'</div>';
  h+='<p class="bp-zacht">Tik een naam aan en de kaart zoomt naar zijn streek, met het '+
    'verhaal erbij.</p>';
  if(bonen.length)h+='<div class="bp-et">Beans you have</div><div class="bp-chips">'+
    bonen.map(b=>chip(b,'bpVanBoon')).join('')+'</div>';
  if(wensen.length)h+='<div class="bp-et">On your wishlist</div><div class="bp-chips">'+
    wensen.map(w=>chip(w,'bpVanWens')).join('')+'</div>';
  h+='<p class="bp-zacht" style="margin-top:9px">Nog nooit gehad: '+
    (totaal-gehad.size)+' van de '+totaal+' landen met een verhaal.</p></div>';
  return h;
}
function bpWereld(){
  const gehad=bpGehad();
  return '<div class="bp-kop"><div class="t">Coffee finder</div>'+
    '<button class="bp-terug" onclick="bpTerug()">‹ '+(bpVanaf==='beans'?'beans':'learn')+'</button></div>'+
    uitklapHTML('wereld','why coffee grows only there',
      'Koffie groeit alleen in de band rond de evenaar: warm genoeg, en nooit vorst. Elk stuk '+
      'van die gordel smaakt anders. Kies waar je nieuwsgierig naar bent, zoom door naar een land '+
      'en een streek, en je eindigt met een lijstje waarmee je de goede zak herkent.','bpTeken(true)')+
    fdBalkHTML()+
    '<div class="bp-doos">'+bpKaartHTML()+bpPlek()+
    '<div class="bp-tip">tik op een werelddeel om in te zoomen</div></div>'+
    '<div class="bp-legenda"><span><i></i> nog niet gehad</span>'+
    '<span><i class="had"></i> al eens gehad'+(gehad.size?(' ('+gehad.size+')'):'')+'</span>'+
    ((state.wishlist||[]).length?'<span><i class="wenskleur"></i> op je lijstje</span>':'')+'</div>'+
    fdUitBlokHTML()+
    bpPlankBlok()+
    Object.keys(BP_DELEN).map(d=>
      '<button class="bp-kies" onclick="bpKies(\'deel\',\''+d+'\')">'+
      '<span class="k1">'+esc(BP_DELEN[d].naam)+'</span>'+
      '<span class="k2">'+BP_DELEN[d].bekend+'</span></button>').join('');
}
function bpDeelScherm(){
  const D=BP_DELEN[bpDeel], gehad=bpGehad();
  const landen=BP_LANDEN.filter(l=>l.deel===bpDeel&&BP_INFO[l.id]);
  return '<div class="bp-kop"><div class="t">'+esc(D.naam)+'</div>'+
    '<button class="bp-terug" onclick="bpTerug()">‹ wereld</button></div>'+
    '<div class="bp-kruimel"><button onclick="bpTerug()">de wereld</button> › <b>'+
    esc(D.kort)+'</b></div>'+
    '<div class="bp-doos">'+bpKaartHTML()+bpPlek()+
    '<div class="bp-tip">tik op een land</div></div>'+
    '<div class="bp-blok vol"><h3>What this part is known for</h3>'+
    '<p>'+D.bekend+'</p><p>'+D.waarom+'</p>'+
    '<div class="bp-et">What you\'ll find here</div>'+
    '<p class="bp-zacht">'+D.proc+'<br>hoogte meestal '+D.hoogte+'</p></div>'+
    '<div class="bp-et">Countries with a story</div>'+
    landen.map(l=>{
      const inf=BP_INFO[l.id];
      return '<button class="bp-kies" onclick="bpKies(\'land\',\''+l.id+'\')">'+
        '<span class="k1">'+esc(l.naam)+(gehad.has(l.id)?' ✓':'')+'<em>'+esc(inf.hoogte)+'</em></span>'+
        '<span class="k2">'+esc(inf.smaak.slice(0,3).join(' · '))+'</span></button>';
    }).join('')+
    '<div class="bp-zacht" style="margin-top:9px">De lichtere landen op de kaart telen ook koffie. '+
    'Die krijgen hun eigen verhaal zodra we ze uitschrijven.</div>';
}
function bpLandScherm(){
  const L=BP_LAND[bpLandId], inf=BP_INFO[bpLandId], D=BP_DELEN[bpDeel];
  return '<div class="bp-kop"><div class="t">'+esc(L.naam)+'</div>'+
    '<button class="bp-terug" onclick="bpTerug()">‹ '+esc(D.kort)+'</button></div>'+
    '<div class="bp-kruimel"><button onclick="bpNaarWereld()">de wereld</button> › '+
    '<button onclick="bpKies(\'deel\',\''+bpDeel+'\')">'+esc(D.kort)+
    '</button> › <b>'+esc(L.naam)+'</b></div>'+
    '<div class="bp-doos">'+bpKaartHTML()+bpPlek()+
    '<div class="bp-tip">tap a numbered dot, or pick below</div></div>'+
    '<div class="bp-blok vol"><h3>What this country is known for</h3>'+
    '<p>'+inf.bekend+'</p>'+
    '<div class="bp-et">The notes the roaster puts on the bag</div>'+bpSmaken(inf.smaak)+
    '<div class="bp-et">Variety</div><p class="bp-zacht">'+esc(inf.var)+'</p>'+
    '<div class="bp-et">Altitude</div><p class="bp-zacht">'+esc(inf.hoogte)+
    ' — hoe hoger, hoe langzamer de kers rijpt. Dat maakt de boon dichter, zoeter en '+
    'levendiger van zuur.</p></div>'+
    '<div class="bp-blok"><h3>How the farmer dries it</h3>'+bpProcBlok(inf.proc)+'</div>'+
    (bpVoor?('<div class="bp-blok vol"><h3>Which region?</h3>'+
      '<p class="bp-zacht">Zegt de zak alleen het land, dan is dat ook goed.</p>'+
      '<div class="bp-knoppen"><button class="bp-knop leeg" onclick="bpNeemHerkomst(null)">'+
      'alleen '+esc(L.naam)+', geen streek</button></div></div>'):'')+
    '<div class="bp-et">The regions</div>'+
    (function(){const g=bpGehadStreken(bpLandId);
      return (inf.streken||[]).map((st,i)=>{
        const op=bpStreek===i;
        return '<div class="bp-streek'+(op?' op':'')+'">'+
          '<button class="bp-kies'+(op?' sel':'')+'" onclick="bpKies(\'streek\','+i+')">'+
          '<span class="k1"><span class="bp-bol">'+(i+1)+'</span>'+esc(st.n)+(g.has(i)?' ✓':'')+
          '<em>'+esc(st.h||inf.hoogte)+'</em></span>'+
          '<span class="k2">'+esc(st.s.join(' · '))+'</span></button>'+
          (op?bpStreekBlok():'')+'</div>';
      }).join('');})();
}
/* Wat er onder een aangetikte streek uitklapt. Bewust zonder eigen kaders:
   het zit al ín de streekkaart, en een kaart in een kaart leest niet. */
function bpStreekBlok(){
  const inf=BP_INFO[bpLandId], st=inf.streken[bpStreek], L=BP_LAND[bpLandId];
  const proc=(bpProc&&inf.proc.includes(bpProc))?bpProc:inf.proc[0];
  const br=bpBrand||'light', me=bpMeth||bpEersteMethode();
  return '<div class="bp-open">'+
    '<p>'+esc(st.t)+'</p>'+bpSmaken(st.s)+
    '<div class="bp-et">Altitude</div><p class="bp-zacht">'+esc(st.h||inf.hoogte)+
    ' — hoe hoger, hoe langzamer de kers rijpt. Dat maakt de boon dichter, zoeter en '+
    'levendiger van zuur.</p>'+
    bpVarBlok(st.v||inf.var)+

    '<div class="bp-deel"><h4>How do you want it?</h4>'+
    '<div class="bp-et">Process</div><div class="bp-chips">'+
    inf.proc.map(p=>'<button class="bp-chip'+(p===proc?' sel':'')+'" onclick="bpZet(\'proc\',\''+p+'\')">'+esc(p)+'</button>').join('')+
    '</div><p class="bp-zacht" style="margin-top:7px">'+esc(BP_PROCES[proc].u)+' Dat geeft een smaak die '+
    esc(BP_PROCES[proc].sm)+', en een mondgevoel dat '+esc(BP_PROCES[proc].mo)+' is.</p>'+
    '<div class="bp-et">Roast</div><div class="bp-chips">'+
    Object.keys(BP_BRAND).map(b=>'<button class="bp-chip'+(b===br?' sel':'')+'" onclick="bpZet(\'brand\',\''+b+'\')">'+b+'</button>').join('')+
    '</div><p class="bp-zacht" style="margin-top:7px">'+BP_BRAND[br].t+'</p>'+
    '<div class="bp-et">What you\'ll brew it on</div><div class="bp-chips">'+
    bpMethodes().map(m=>'<button class="bp-chip'+(m.id===me?' sel':'')+'" onclick="bpZet(\'meth\',\''+m.id+'\')">'+esc(m.name)+'</button>').join('')+
    '</div><p class="bp-zacht" style="margin-top:7px">'+bpMethodeTip(me,br)+'</p></div>'+

    '<div class="bp-deel"><h4>What to look for on the bag</h4>'+
    '<div class="bp-zak">'+
    '<em>land</em> '+esc(L.naam)+'<br>'+
    '<em>streek</em> '+esc(st.n)+'<br>'+
    '<em>proces</em> '+esc(proc)+'<br>'+
    '<em>variëteit</em> '+esc(st.v||inf.var)+'<br>'+
    '<em>branding</em> '+esc(br)+'<br>'+
    '<em>smaak</em> '+esc(st.s.join(', '))+'<br>'+
    '<em>gebrand</em> korter dan 3 weken geleden</div>'+
    '<div class="bp-zoek">🔍 '+esc(bpZoekregel())+'</div>'+
    '<div class="bp-knoppen">'+
    '<button class="bp-knop leeg" onclick="bpKopieer()">kopieer</button>'+
    '<button class="bp-knop leeg" onclick="bpZoekOpen()">zoek via Google</button></div>'+
    '<p class="bp-zacht" style="margin-top:9px">Wat er vandaag bij een brander op de plank '+
    'ligt weet de app niet — dat laatste klikje blijft van jou.</p>'+
    '<div class="bp-knoppen">'+(bpVoor
      ? '<button class="bp-knop" onclick="bpNeemHerkomst('+bpStreek+')">✓ deze is het</button>'
      : '<button class="bp-knop" onclick="bpOpLijst()">Add to wishlist</button>')+'</div>'+
    '</div>'+bpUitJeKast(bpLandId,bpStreek)+'</div>';
}
function bpMethodes(){
  const aan=(state.methods||[]).filter(m=>m.on);
  return aan.length?aan:[{id:'v60',name:'v60'}];
}
function bpEersteMethode(){
  const m=bpMethodes().find(x=>methodFamily(x)==='filter')||bpMethodes()[0];
  return m.id;
}
function bpZoekregel(){
  const inf=BP_INFO[bpLandId], st=inf.streken[bpStreek], L=BP_LAND[bpLandId];
  const proc=(bpProc&&inf.proc.includes(bpProc))?bpProc:inf.proc[0];
  const br=bpBrand||'light';
  return [L.naam,st.n,proc,(br==='dark'?'espresso':'filter'),'specialty koffie kopen'].join(' ');
}
function bpMethodeTip(id,br){
  const fam=methodFamily(id);
  const molen=(state.gear||[]).find(g=>g.kind==='grinder'&&(g.category===fam||g.category==='algemeen'));
  const opMolen=molen?(' op je '+esc(molen.name)):'';
  if(fam==='espresso')return br==='light'
    ? ('Een light gebrande boon op espresso vraagt fijner malen dan je gewend bent'+opMolen+
       ', en het zuur wordt scherper. Mooi als het lukt, maar reken op een paar shots afstellen.')
    : 'Op espresso komt hier vooral het zoete en de body naar voren. Makkelijk af te stellen.';
  if(id==='aeropress')return 'De AeroPress vergeeft veel: kortere contacttijd, dus het zuur blijft zacht. Een fijne manier om een nieuwe boon te leren kennen.';
  if(id==='chemex')return 'Het dikke filter houdt olie tegen. Dat geeft een heldere, bijna theeachtige kop — mooi bij bloemige koffie.';
  return 'Filter laat het meest van de herkomst horen. Voor een boon waar je nieuwsgierig naar bent is dit de eerlijkste keuze.';
}

/* ---- klikken ---- */
function bpKies(wat,waarde){
  if(wat==='deel'){bpDeel=waarde;bpLandId=null;bpStreek=null;bpNiv='deel';bpZoom(BP_VIEWS[bpDeel]);}
  else if(wat==='land'){
    if(!BP_INFO[waarde])return;
    bpLandId=waarde;bpStreek=null;bpProc=null;bpVarOpen=null;bpNiv='land';bpZoom(bpLandView(waarde));
  }else if(wat==='streek'){
    bpStreek=(bpStreek===waarde)?null:waarde;bpVarOpen=null;
  }
  bpTeken(wat==='streek');
}
function bpOpen(vanaf){bpVoor=null;bpVanaf=vanaf||'learn';go('beanpick');}
function bpNaarWereld(){
  bpNiv='wereld';bpDeel=null;bpLandId=null;bpStreek=null;bpZoom(BP_VIEWS.wereld);bpTeken();
}
function bpTerug(){
  if(bpNiv==='land'){bpNiv='deel';bpLandId=null;bpStreek=null;bpZoom(BP_VIEWS[bpDeel]);}
  else if(bpNiv==='deel'){bpNiv='wereld';bpDeel=null;bpZoom(BP_VIEWS.wereld);}
  else{go(bpVoor?'beanform':(bpVanaf==='beans'?'beans':'learn'));bpVoor=null;return;}
  bpTeken();
}
function bpZet(k,v){
  if(k==='proc')bpProc=v; else if(k==='brand')bpBrand=v; else bpMeth=v;
  bpTeken(true);
}
async function bpKopieer(){
  const t=bpZoekregel();
  try{await navigator.clipboard.writeText(t);toast('✓ zoekregel gekopieerd');}
  catch(e){toast(t);}
}
function bpZoekOpen(){
  const u='https://www.google.com/search?q='+encodeURIComponent(bpZoekregel());
  window.open(u,'_blank','noopener');
}
/* De uitkomst gaat op je plank te staan als wens. Koop je hem echt, dan staat
   alles al ingevuld en hoef je alleen de branddatum nog toe te voegen. */
/* ---------------- je lijstje ----------------
   Een wens is een zak die je nog niet hebt. Hij ontstaat aan het eind van de
   keuzehulp, of je vult hem zelf in als je er ergens een tegenkwam. In
   allebei de gevallen kun je hem toekennen aan een plek op de kaart, en dan
   staat hij daar tussen je eigen bonen.                                    */
function bpNieuweWens(){openBeanForm(true);}
function bpWijzigWens(id){
  const w=(state.wishlist||[]).find(x=>x.id===id); if(!w)return;
  openBeanForm(true);
  editingWens=id;
  const zet=(veld,val)=>{const el=document.getElementById(veld);if(el)el.value=val||'';};
  zet('b-name',w.naam||w.name||''); zet('b-roaster',w.brander);
  zet('b-url',w.url); zet('b-process',w.proces); zet('b-variety',w.variety);
  zet('b-altitude',w.altitude); zet('b-notes',w.notitie);
  zet('b-roasternotes',w.roasternotes||(w.smaak||[]).join(', '));
  const regs=bpRegios(w).map(r=>({land:r.land,i:r.i}));
  zet('b-origin',w.origin||regs.map(bpRegioTekst).join(' · '));
  beanFormRegions=regs; renderBeanHerkomst();
  beanFormRoast=w.brand||null; renderBeanRoast();
  renderBeanMode();
}
/* vanuit de kaart: de streek die je bekeek als wens wegschrijven */
function bpOpLijst(){
  const inf=BP_INFO[bpLandId], st=inf.streken[bpStreek], L=BP_LAND[bpLandId];
  const proc=(bpProc&&inf.proc.includes(bpProc))?bpProc:inf.proc[0];
  if(!Array.isArray(state.wishlist))state.wishlist=[];
  if(state.wishlist.some(w=>bpHoortBij(w,bpLandId,bpStreek))){
    toast('already on your list');return;
  }
  state.wishlist.push({id:uid(),naam:st.n+' · '+L.naam,brander:'',url:'',
    regions:[{land:bpLandId,i:bpStreek}],proces:proc,variety:st.v||inf.var,
    brand:bpBrand||'light',smaak:st.s.slice(),notitie:'',
    zoek:bpZoekregel(),at:Date.now()});
  save();toast('✓ added to your list');bpTeken(true);
}
function bpVanLijst(id){
  const w=(state.wishlist||[]).find(x=>x.id===id);
  if(w&&!confirm('“'+(w.naam||'deze wens')+'” van je lijstje halen?'))return;
  state.wishlist=(state.wishlist||[]).filter(x=>x.id!==id);
  save();renderBeans();toast('removed from your list');
}
/* "gekocht" is hetzelfde formulier, maar dan omgezet naar je plank. De wens
   blijft staan tot je opslaat, dus annuleren kost je niets. */
function bpGekocht(id){
  bpWijzigWens(id);
  if(editingWens!==id)return;
  beanZetMode(false);
  toast('from your list — add the roast date');
}
function bpWensDicht(){
  state.wensDicht=!state.wensDicht;save();renderBeans();
}
function bpWensHTML(){
  if(!featOn('beanpick'))return '';
  const lijst=state.wishlist||[];
  const kop='<button class="wens-kop" onclick="bpWensDicht()">'+
    '<span class="hand">Bean wishlist</span>'+
    '<span class="sd">'+(lijst.length?(lijst.length+' not bought yet'):'still empty')+'</span>'+
    '<span class="wens-arr">'+(state.wensDicht?'›':'⌄')+'</span></button>';
  if(state.wensDicht)return '<div class="sect wens-sect">'+kop+'</div>';
  if(!lijst.length)return '<div class="sect wens-sect">'+kop+'</div>'+
    '<div class="empty-note">nothing on your list yet. Spot a nice bag somewhere? '+
    'Put it here via New Bean — with the link.</div>';
  return '<div class="sect wens-sect">'+kop+'</div>'+
    lijst.map(w=>{
      const regs=bpRegios(w);
      const blend=regs.length>1;
      return '<div class="bean-card sketch soft wens-card">'+
      '<div class="bn hand">'+esc(w.naam||'zonder naam')+
        (blend?' <span class="wens-tag">blend</span>':'')+'</div>'+
      '<div class="bm">'+
        (w.brander?('van '+esc(w.brander)+'<br>'):'')+
        (regs.length?(regs.map(bpRegioTekst).map(esc).join(' · ')+'<br>'):'')+
        [w.proces,w.brand].filter(Boolean).map(esc).join(', ')+
        ((w.smaak||[]).length?(' · '+esc(w.smaak.join(', '))):'')+
        (w.variety?('<br>'+esc(w.variety)):'')+
        (w.notitie?('<br>'+esc(w.notitie)):'')+'</div>'+
      '<div class="wens-rij">'+
      '<button class="lp sel" onclick="bpGekocht(\''+w.id+'\')">gekocht ✓</button>'+
      (BrewSecurity.safeLink(w.url)?('<a class="lp" href="'+esc(BrewSecurity.safeLink(w.url))+'" target="_blank" rel="noopener">bekijk de zak ↗</a>'):'')+
      '<button class="lp" onclick="bpWijzigWens(\''+w.id+'\')">wijzig</button>'+
      '<button class="lp" onclick="bpVanLijst(\''+w.id+'\')">×</button>'+
      '</div></div>';
    }).join('');
}

/* ---------------- de boon en de kaart aan elkaar ----------------
   Een zak heeft niet altijd één herkomst. Een single origin komt van één
   streek, een blend van meer, en allebei moeten ze op de kaart terug te
   vinden zijn. Vandaar een lijstje herkomsten in plaats van één veld.

   Heb je nooit iets aangewezen, dan blijft de oude tekstherkenning het
   vangnet: dan leest de app de landnaam uit wat er op de zak staat.      */
function bpRegios(o){
  if(!o)return [];
  let ruw=Array.isArray(o.regions)?o.regions:(o.region?[o.region]:[]);
  const uit=[];
  ruw.forEach(r=>{
    if(!r||!BP_INFO[r.land])return;
    const inf=BP_INFO[r.land];
    const i=(r.i!=null&&inf.streken&&inf.streken[r.i])?r.i:null;
    if(!uit.some(x=>x.land===r.land&&x.i===i))uit.push({land:r.land,i,zelf:true});
  });
  if(uit.length)return uit;
  const land=bpLandVanBoon(o);
  if(!land||!BP_INFO[land])return [];
  return [{land,i:bpStreekVanBoon(o,land),zelf:false}];
}
function bpIsBlend(o){return bpRegios(o).length>1;}
function bpRegioTekst(r){
  const inf=BP_INFO[r.land]; if(!inf)return '';
  const st=(r.i!=null)?inf.streken[r.i]:null;
  return st?(st.n+' · '+BP_LAND[r.land].naam):BP_LAND[r.land].naam;
}
function bpRegioHoogte(r){
  const inf=BP_INFO[r.land]; if(!inf)return '';
  const st=(r.i!=null)?inf.streken[r.i]:null;
  return (st&&st.h)?st.h:inf.hoogte;
}
function bpRegioVar(r){
  const inf=BP_INFO[r.land]; if(!inf)return '';
  const st=(r.i!=null)?inf.streken[r.i]:null;
  return (st&&st.v)?st.v:inf.var;
}
function bpRegioSmaak(r){
  const inf=BP_INFO[r.land]; if(!inf)return [];
  const st=(r.i!=null)?inf.streken[r.i]:null;
  return st?st.s:inf.smaak;
}
// hoort deze boon of wens bij die plek? (i weglaten = ergens in dat land)
function bpHoortBij(o,landId,i){
  return bpRegios(o).some(r=>r.land===landId&&(i==null||r.i===i));
}
function bpBonenVoor(landId,i){
  return (state.beans||[]).filter(b=>bpHoortBij(b,landId,i));
}
function bpWensenVoor(landId,i){
  return (state.wishlist||[]).filter(w=>bpHoortBij(w,landId,i));
}
function bpScoreVan(b){
  const sc=(state.brews||[]).filter(x=>x.beanId===b.id&&x.score!=null&&x.score!=='')
    .map(x=>+x.score);
  if(!sc.length)return null;
  return (sc.reduce((a,c)=>a+c,0)/sc.length).toFixed(1).replace('.',',');
}
function bpSmaakVan(b){
  return [...new Set([].concat(...(state.brews||[]).filter(x=>x.beanId===b.id)
    .map(x=>x.tags||[])))];
}
/* Oude wensen bewaarden hun herkomst als losse namen. Die zoeken we één keer
   terug op, zodat ze ook op de kaart verschijnen. */
function bpMigreerWensen(){
  let veranderd=false;
  (state.wishlist||[]).forEach(w=>{
    if(Array.isArray(w.regions)||!w.land)return;
    const land=BP_LANDEN.find(l=>l.naam===w.land);
    if(land&&BP_INFO[land.id]){
      const st=(BP_INFO[land.id].streken||[]).findIndex(x=>x.n===w.streek);
      w.regions=[{land:land.id,i:st>=0?st:null}];
      if(!w.naam)w.naam=w.streek||land.naam;
      veranderd=true;
    }
  });
  if(veranderd)save();
}

/* ---- de kaart als invoermethode ----
   Vanuit het bonenformulier of het wensformulier open je de kaart om een
   streek aan te wijzen. bpVoor onthoudt waar je vandaan kwam.            */
let bpVoor=null;              // null als je gewoon rondkijkt, 'bean' als een formulier wacht
let bpVanaf='learn';          // waar je de kaart binnenkwam: 'beans' of 'learn'
let beanFormRegions=[];
function bpKiesHerkomstVoor(wat){
  bpVoor=wat||'bean'; bpVarOpen=null;
  const lijst=beanFormRegions;
  const r=lijst[lijst.length-1];
  if(r&&BP_INFO[r.land]){
    bpDeel=BP_LAND[r.land].deel; bpLandId=r.land; bpNiv='land';
    bpStreek=(r.i!=null)?r.i:null; bpView=bpLandView(r.land).slice();
  }else{
    bpNiv='wereld'; bpDeel=null; bpLandId=null; bpStreek=null;
    bpView=BP_VIEWS.wereld.slice();
  }
  go('beanpick');
}
function bpKiesHerkomst(){bpKiesHerkomstVoor('bean');}
function bpNeemHerkomst(i){
  const landId=bpLandId, inf=BP_INFO[landId];
  const nieuw={land:landId,i:(i!=null?i:null)};
  if(!beanFormRegions.some(r=>r.land===nieuw.land&&r.i===nieuw.i))beanFormRegions.push(nieuw);
  const eerste=(beanFormRegions.length===1);
  const el=id=>document.getElementById(id);
  const leegVul=(id,v)=>{const e=el(id);if(e&&!e.value.trim()&&v)e.value=v;};
  const o=el('b-origin');
  if(o)o.value=beanFormRegions.map(bpRegioTekst).join(' · ');
  if(eerste){
    leegVul('b-variety',bpRegioVar(nieuw));
    leegVul('b-altitude',String(bpRegioHoogte(nieuw)).replace(/\s*m$/,'').trim());
    if(inf.proc.length===1)leegVul('b-process',inf.proc[0]);
    leegVul('b-name',bpRegioTekst(nieuw));
  }
  bpVoor=null; go('beanform'); renderBeanHerkomst();
  toast('✓ herkomst erbij');
}
function bpHerkomstWeg(i){beanFormRegions.splice(i,1);renderBeanHerkomst();}
function renderBeanHerkomst(){
  const el=document.getElementById('b-herkomst');
  const veld=document.getElementById('b-herkomst-veld');
  if(!el||!veld)return;
  if(!featOn('beanpick')){veld.style.display='none';return;}
  veld.style.display='';
  el.innerHTML=bpHerkomstKiezer(beanFormRegions,'bpHerkomstWeg','bpKiesHerkomst');
}
/* Dezelfde kiezer voor een boon en voor een wens: een rijtje herkomsten met
   een kruisje, en een knop om er een bij te zoeken op de kaart. */
function bpHerkomstKiezer(lijst,wegFn,kiesFn){
  let h='';
  if(!lijst.length){
    h+='<div class="bh-rij"><div class="bh-uit"><span>weet je waar hij vandaan komt? '+
      'Wijs het aan op de kaart, dan vult de app de rest voor je in.</span></div></div>';
  }else{
    if(lijst.length>1)h+='<div class="bh-blend">blend — '+lijst.length+' herkomsten</div>';
    h+=lijst.map((r,i)=>'<div class="bh-rij"><div class="bh-uit"><b>'+esc(bpRegioTekst(r))+
      '</b><span>'+esc(bpRegioHoogte(r))+' · '+esc(bpRegioSmaak(r).join(', '))+'</span></div>'+
      '<button type="button" class="bh-knop" onclick="'+wegFn+'('+i+')">×</button></div>').join('');
  }
  h+='<div class="bh-rij" style="margin-top:6px"><button type="button" class="bh-knop aan" '+
    'onclick="'+kiesFn+'()">'+(lijst.length?'＋ another origin':'pick on the map')+'</button></div>';
  return h;
}


/* ---- wat de kaart over jouw zak vertelt, op de bonenplank ---- */
function bpHerkomstBlok(b){
  if(!featOn('beanpick'))return '';
  const regs=bpRegios(b); if(!regs.length)return '';
  const geproefd=bpSmaakVan(b);
  const belooft=[...new Set([].concat(...regs.map(bpRegioSmaak)))];
  const gok=regs.some(r=>!r.zelf);
  return '<div class="bk-herkomst">'+
    '<div class="n hand">'+(regs.length>1?'blend — ':'')+
    regs.map(r=>esc(bpRegioTekst(r))).join(' · ')+
    (gok?' <span class="bp-zacht">(uit de tekst op de zak)</span>':'')+'</div>'+
    '<div class="r">'+regs.map(r=>esc(bpRegioHoogte(r))).join(' · ')+'<br>'+
    '<b>de streek belooft</b> '+esc(belooft.join(', '))+
    (geproefd.length?('<br><b>jij proefde</b> '+esc(geproefd.join(', '))):'')+'</div>'+
    '<div class="wens-rij" style="margin-top:8px">'+
    regs.map((r,i)=>'<button class="lp" onclick="event.stopPropagation();bpVanBoon(\''+
      b.id+'\','+i+')">'+(regs.length>1?esc(bpRegioTekst(r)):'bekijk op de kaart')+
      ' →</button>').join('')+'</div></div>';
}

/* ---- je plank als kaartje boven de bonenlijst, en de deur naar de kaart ---- */
function bpPlankKaartHTML(){
  if(!featOn('beanpick'))return '';
  const punten=[];
  const zet=(o,soort)=>{
    bpRegios(o).forEach(r=>{
      const st=(r.i!=null)?BP_INFO[r.land].streken[r.i]:null;
      const x=st?bpX(st.ll[0]):+bpMidden(BP_LAND[r.land])[0];
      const y=st?bpY(st.ll[1]):+bpMidden(BP_LAND[r.land])[1];
      punten.push({x,y,id:o.id,soort});
    });
  };
  (state.beans||[]).forEach(b=>zet(b,'mijn'));
  (state.wishlist||[]).forEach(w=>zet(w,'wens'));
  const landen=new Set();
  (state.beans||[]).forEach(b=>bpRegios(b).forEach(r=>landen.add(r.land)));
  const v=bpDoos(BP_LANDEN,6);
  let sv='<svg viewBox="'+v.join(' ')+'" preserveAspectRatio="xMidYMid meet">';
  sv+='<rect class="band" x="-200" y="'+bpY(23.5)+'" width="500" height="'+(bpY(-23.5)-bpY(23.5))+'"/>';
  BP_ACHTER.forEach(pl=>{
    sv+='<path class="achter" d="M'+pl.map(q=>bpX(q[0]).toFixed(1)+' '+bpY(q[1]).toFixed(1)).join('L')+'Z"/>';
  });
  BP_LANDEN.forEach(l=>{sv+='<path class="achter" d="'+bpPad(l)+'"/>';});
  punten.forEach(p=>{
    sv+='<circle class="'+p.soort+'" cx="'+p.x+'" cy="'+p.y+'" r="4.5" onclick="event.stopPropagation();'+
      (p.soort==='mijn'?('bpVanBoon(\''+p.id+'\')'):('bpVanWens(\''+p.id+'\')'))+'"/>';
  });
  sv+='</svg>';
  return '<button class="plank-kaart" onclick="bpOpen(\'beans\')">'+sv+'</button>';
}

/* ---- uit je eigen kast ----
   Onderaan een streek: wat jij van hier al hebt staan, en wat er nog op je
   lijstje wacht. Een blend duikt hier bij elk van zijn herkomsten op, met
   erbij waar hij verder nog vandaan komt.                                  */
function bpUitJeKast(landId,i){
  if(i==null)return '';
  const bonen=bpBonenVoor(landId,i), wensen=bpWensenVoor(landId,i);
  const elders=bpBonenVoor(landId,null).length-bonen.length;
  if(!bonen.length&&!wensen.length){
    return '<div class="bp-mijn"><div class="bp-et">From your shelf</div>'+
      '<p class="bp-zacht">Hier heb je nog niets van staan.'+
      (elders?(' Wel '+elders+' zak'+(elders===1?'':'ken')+' van elders uit '+
        esc(BP_LAND[landId].naam)+'.'):'')+'</p></div>';
  }
  const ander=(o)=>{
    const rest=bpRegios(o).filter(r=>!(r.land===landId&&r.i===i));
    return rest.length?('ook uit '+rest.map(bpRegioTekst).join(' · ')):'';
  };
  let h='<div class="bp-mijn"><div class="bp-et">From your shelf</div>';
  h+=bonen.map(b=>{
    const sc=bpScoreVan(b), n=(state.brews||[]).filter(x=>x.beanId===b.id).length;
    const regel=[b.roaster,b.process,b.variety].filter(Boolean).join(' · ');
    const staat=(b.inStock===false)?'op is op':(sc?('jij gaf hem '+sc):
      (n?(n+' brew'+(n===1?'':'s')):'nog niet gezet'));
    return '<button class="bp-mijnkaart" onclick="bpNaarBoon(\''+b.id+'\')">'+
      '<span class="mn hand">'+esc(b.name)+
      (bpIsBlend(b)?' <span class="wens-tag">blend</span>':'')+'</span>'+
      '<span class="mr">'+[regel,ander(b),staat].filter(Boolean).map(esc).join(' — ')+
      '</span></button>';
  }).join('');
  h+=wensen.map(w=>{
    const regel=[w.brander,w.proces,w.brand].filter(Boolean).join(' · ');
    return '<button class="bp-mijnkaart wens" onclick="bpWijzigWens(\''+w.id+'\')">'+
      '<span class="mn hand">'+esc(w.naam||'zonder naam')+
      ' <span class="wens-tag">op je lijstje</span>'+
      (bpIsBlend(w)?' <span class="wens-tag">blend</span>':'')+'</span>'+
      '<span class="mr">'+[regel,ander(w)].filter(Boolean).map(esc).join(' — ')+
      '</span></button>';
  }).join('');
  if(elders>0)h+='<p class="bp-zacht">En '+elders+' zak'+(elders===1?'':'ken')+
    ' van elders uit '+esc(BP_LAND[landId].naam)+'.</p>';
  return h+'</div>';
}
/* De weg terug: van de kaart naar de kaart van die boon op je plank. */
function bpNaarBoon(id){
  const b=beanById(id); if(!b)return;
  if(!expandedBeans.has(id))expandedBeans.add(id);
  if(b.inStock===false)extraKastOpen=true;
  go('beans');
  setTimeout(()=>{
    const el=document.querySelector('.bean-card[data-bean="'+id+'"]');
    if(el)el.scrollIntoView({behavior:'smooth',block:'center'});
  },60);
}

/* ---- de terugweg: van een boon op je plank naar zijn plek op de kaart ---- */
function bpVanBoon(beanId,idx){
  const b=beanById(beanId); if(!b)return;
  bpNaarPlek(bpRegios(b)[idx||0],'van deze boon weet ik het land nog niet');
}
function bpVanWens(wensId,idx){
  const w=(state.wishlist||[]).find(x=>x.id===wensId); if(!w)return;
  bpNaarPlek(bpRegios(w)[idx||0],'van deze wens weet ik het land nog niet');
}
/* Eén plek op de kaart openen, gebruikt door beide terugwegen hierboven. */
function bpNaarPlek(r,klacht){
  if(!r||!BP_INFO[r.land]){toast(klacht);return;}
  bpVoor=null; bpVanaf='beans'; bpDeel=BP_LAND[r.land].deel; bpLandId=r.land; bpNiv='land';
  bpStreek=(r.i!=null)?r.i:null; bpProc=null; bpVarOpen=null;
  bpView=bpLandView(r.land).slice();
  bpNaarStreek=(bpStreek!=null);
  go('beanpick');
}
/* ================= coffee finder: zoeken en filteren =================
   Twee manieren om bij een streek te komen zonder eerst de kaart af te struinen:
   je typt wat je zoekt, of je laat vijf vragen de 119 streken uitdunnen.

   De hele kern is dat de 57 losse smaakwoorden uit BP_INFO op zeven families
   gelegd worden. Zonder die ordening kun je niet filteren -- 'cacao',
   'chocolade' en 'donkere chocolade' zijn voor een zoeker hetzelfde woord.  */
const FD_FAM={
  fris:  {n:'fresh fruit',   u:'citrus en rood fruit',
          w:['sinaasappel','citroen','citrus','limoen','grapefruit','bergamot','zachte citrus',
             'rood fruit','rode bes','zwarte bes','aardbei','bosbes','blauwe bes','rode vruchten',
             'rode appel','appel','tomaat','tomaat-zoet']},
  steen: {n:'stone fruit',   u:'perzik, pruim, tropisch',
          w:['perzik','abrikoos','pruim','tropisch fruit','rijp fruit','vijg','gedroogd fruit',
             'gedroogde vijg','rozijn','rode wijn','rum']},
  bloem: {n:'floral & tea',  u:'jasmijn, zwarte thee',
          w:['bloemig','jasmijn','zwarte thee']},
  zoet:  {n:'sweet & caramel',u:'honing, bruine suiker',
          w:['honing','bruine suiker','karamel','toffee']},
  choc:  {n:'chocolate',     u:'cacao tot donkere chocolade',
          w:['cacao','chocolade','donkere chocolade','melkchocolade','cacaonib']},
  noot:  {n:'nutty',         u:'amandel, hazelnoot',
          w:['noot','amandel','hazelnoot','macadamia','walnoot','pinda']},
  kruid: {n:'spice & wood',  u:'specerij, tabak, rook',
          w:['specerij','kaneel','kardemom','zwarte peper','kruidig','tabak','cederhout',
             'hout','rook','aarde']},
};
const FD_FAMS=Object.keys(FD_FAM);
const FD_WOORD={};
FD_FAMS.forEach(f=>FD_FAM[f].w.forEach(w=>{FD_WOORD[w]=f;}));
/* het smaakwiel waarmee je je brews tagt, in dezelfde zeven families */
const FD_WIEL={berry:'fris',citrus:'fris',floral:'bloem',honey:'zoet',caramel:'zoet',
  choc:'choc',nutty:'noot',spice:'kruid'};
/* hoe levendig smaakt een familie? 0 = rond en zacht, 1 = fel en helder */
const FD_ZUUR={fris:1,bloem:.9,steen:.6,zoet:.35,noot:.2,choc:.15,kruid:.3};

/* de 119 streken één keer plat, met hun families en een schatting van hoe
   levendig ze smaken (uit de smaakwoorden en de teelthoogte) */
let FD_STREKEN=null;
function fdStreken(){
  if(FD_STREKEN)return FD_STREKEN;
  FD_STREKEN=[];
  Object.keys(BP_INFO).forEach(land=>{
    const inf=BP_INFO[land], L=BP_LAND[land]; if(!L)return;
    (inf.streken||[]).forEach((st,i)=>{
      const fams=[...new Set((st.s||[]).map(w=>FD_WOORD[w]).filter(Boolean))];
      const h=(String(st.h||inf.hoogte).match(/\d+/g)||['1500']).map(Number);
      const hoog=h.reduce((a,b)=>a+b,0)/h.length;
      let zuur=fams.length?fams.reduce((a,f)=>a+FD_ZUUR[f],0)/fams.length:.5;
      zuur=Math.max(0,Math.min(1,zuur*.7+((hoog-900)/1400)*.3));
      FD_STREKEN.push({land,i,naam:st.n,landnaam:L.naam,deel:L.deel,h:st.h||inf.hoogte,
        hoog,t:st.t,s:st.s||[],v:st.v||inf.var,proc:inf.proc,fams,zuur});
    });
  });
  return FD_STREKEN;
}

/* ---- wat de app al van je weet, zodat de eerste twee vragen ingevuld staan ---- */
function fdMijnMethode(){
  const aan=(state.methods||[]).filter(m=>m.on);
  const esp=aan.some(m=>methodFamily(m)==='espresso');
  const fil=aan.some(m=>methodFamily(m)==='filter');
  return (esp&&fil)?'allebei':esp?'espresso':'filter';
}
function fdMijnSmaken(){
  const tel={};
  (state.brews||[]).forEach(b=>{
    if(b.score!=null&&+b.score<7.5)return;
    (b.tags||[]).forEach(t=>{
      let f=FD_WIEL[t];
      if(!f)for(const k in WHEEL_SUB)if((WHEEL_SUB[k]||[]).includes(t))f=FD_WIEL[k];
      if(f)tel[f]=(tel[f]||0)+1;
    });
  });
  const uit=Object.keys(tel).sort((a,b)=>tel[b]-tel[a]).slice(0,2);
  return uit.length?uit:['fris','zoet'];
}

/* ---- de stand van de zoeker ---- */
let fdQ='', fdAI=false, fdStap=0, fdBezig=false;
/* het laatste AI-antwoord blijft staan zolang je niets nieuws typt -- ook als je
   ondertussen ergens anders in de app kijkt en terugkomt */
let fdAntw=null, fdTerug=null;
let fdA={meth:null,fams:null,zuur:null,proc:'egaal',avontuur:null};
function fdReset(){
  fdStap=0;
  fdA={meth:fdMijnMethode(),fams:fdMijnSmaken(),zuur:null,proc:'egaal',avontuur:null};
}

const FD_STAPPEN=[
  {k:'meth',v:'Where will you brew it?',
   w:'Dit bepaalt welke branding en welke streken passen — daar begint elke goede koffiezoeker mee.',
   o:[{v:'filter',n:'filter',u:'V60, Chemex, Aeropress — helderheid en zuur mogen er zijn'},
      {v:'espresso',n:'espresso',u:'onder druk: je wilt body, zoet en weinig scherpte'},
      {v:'allebei',n:'both',u:'een zak die op allebei werkt'}]},
  {k:'fams',v:'Which way, taste-wise?',
   w:'Kies er één tot drie. Dit is de grofste zeef: hij haalt er meteen driekwart uit.',
   soort:'fam'},
  {k:'zuur',v:'How bright may it be?',
   w:'Niet hoe donker de branding is, maar wat je in de kop proeft. Hoogte en proces bepalen dit het meest.',
   o:[{v:'zacht',n:'soft and round',u:'laag zuur, veel body — chocolade en noot'},
      {v:'balans',n:'balanced',u:'zoet met een randje, het veilige midden'},
      {v:'fel',n:'lively and bright',u:'citrus die prikt, thee-achtig, hoog gegroeid'}]},
  {k:'proc',v:'What sounds interesting?',
   w:'Het proces op de boerderij verandert de smaak meer dan welk land ook.',
   o:[{v:'washed',n:'washed',u:'schoon en rechtlijnig — je proeft de streek zelf'},
      {v:'natural',n:'natural',u:'de kers droogt om de boon: fruit, wijn, meer body'},
      {v:'honey',n:'honey',u:'ertussenin — zoeter, zachter zuur'},
      {v:'egaal',n:'no preference',u:'laat de smaak beslissen'}]},
  {k:'avontuur',v:'Familiar, or something new?',
   w:'Vertrouwd blijft bij landen die al eens op je plank stonden, nieuw zoekt er juist '+
     'buiten, en verras springt naar een werelddeel waar je nog nooit zat. De app kijkt '+
     'daarvoor naar je eigen bonen en brews — heb je er nog geen, dan telt deze vraag niet mee.',
   o:[{v:'vertrouwd',n:'keep it familiar',u:'een streek in een land dat je al kent'},
      {v:'nieuw',n:'something new',u:'een land dat je nog niet had'},
      {v:'verras',n:'surprise me',u:'een werelddeel waar je nog nooit zat'}]},
];

/* ---- de score. Elke regel is uit te leggen; wat dat niet is, telt niet mee ---- */
function fdScore(st){
  const r=[]; let p=0;
  const raak=st.fams.filter(f=>(fdA.fams||[]).includes(f));
  if((fdA.fams||[]).length){
    p+=raak.length*3;
    if(raak.length)r.push(raak.map(f=>FD_FAM[f].n).join(' en ')+' zit erin');
  }
  if(fdA.zuur){
    const doel=fdA.zuur==='zacht'?.15:fdA.zuur==='balans'?.5:.85;
    const af=Math.abs(st.zuur-doel); p+=(1-af)*3;
    if(af<.18)r.push(fdA.zuur==='fel'?'hoog gegroeid en levendig'
      :fdA.zuur==='zacht'?'rond, weinig zuur':'mooi in balans');
  }
  if(fdA.proc!=='egaal'){
    if(st.proc.includes(fdA.proc)){p+=2;r.push(fdA.proc+' komt hier vandaan');}
    else p-=2;
  }
  if(fdA.meth==='espresso')p+=(1-st.zuur)*2;
  else if(fdA.meth==='filter')p+=st.zuur*2;
  const had=bpGehad().has(st.land);
  if(fdA.avontuur==='vertrouwd'){p+=had?2:-1;if(had)r.push('een land dat je al kent');}
  if(fdA.avontuur==='nieuw'){p+=had?-2:2;if(!had)r.push('nog nooit op je plank gehad');}
  if(fdA.avontuur==='verras'){
    const delen=new Set([...bpGehad()].map(l=>(BP_LAND[l]||{}).deel));
    p+=delen.has(st.deel)?-2:3;
    if(!delen.has(st.deel))r.push('een werelddeel waar je nog nooit zat');
  }
  return {p,r};
}
function fdRang(){return fdStreken().map(st=>Object.assign({st},fdScore(st))).sort((a,b)=>b.p-a.p);}
function fdOver(){
  const f=fdA.fams||[];
  if(!f.length)return fdStreken().length;
  return fdStreken().filter(st=>st.fams.some(x=>f.includes(x))).length;
}

/* ---- zoeken zonder AI: alles wat de app al heeft staan ---- */
function fdZoek(q){
  const t=(q||'').toLowerCase().trim();
  const hoogte=(t.match(/boven\s*(\d{3,4})|(\d{3,4})\s*m\+/)||[]).filter(Boolean)[1];
  // woorden van één of twee letters slaan we over: een losse "m" zit in bijna elke
  // beschrijving en maakt de uitslag waardeloos
  const woorden=t.split(/[\s,]+/).filter(w=>w.length>2&&!/^\d+$/.test(w)&&w!=='boven');
  if(!woorden.length&&!hoogte)return [];
  return fdStreken().map(st=>{
    let p=0; const r=[]; let alles=true;
    woorden.forEach(w=>{
      let q2=0;
      if(st.landnaam.toLowerCase().includes(w)){q2+=5;r.push('land');}
      if(st.naam.toLowerCase().includes(w)){q2+=6;r.push('streek');}
      if(st.s.some(x=>x.toLowerCase().includes(w))){q2+=4;r.push('smaak');}
      const fam=FD_FAMS.find(f=>FD_FAM[f].n.toLowerCase().includes(w)||FD_FAM[f].u.includes(w));
      if(fam&&st.fams.includes(fam)){q2+=4;r.push('smaakfamilie');}
      if(st.proc.some(x=>x.includes(w))){q2+=3;r.push('proces');}
      if((st.v||'').toLowerCase().includes(w)){q2+=3;r.push('variëteit');}
      if(!q2&&st.t.toLowerCase().includes(w)){q2+=1;r.push('beschrijving');}
      if(!q2)alles=false;
      p+=q2;
    });
    // elk woord moet ergens raken: "natural ethiopië" is een eis, geen wens
    if(!alles)return {st,p:0,r:[]};
    if(hoogte){ if(st.hoog>=+hoogte){p+=3;r.push('hoogte');} else return {st,p:0,r:[]}; }
    return {st,p,r:[...new Set(r)]};
  }).filter(x=>x.p>0).sort((a,b)=>b.p-a.p);
}

/* ---- met AI: hij vult alleen de filters in. Het antwoord komt nog steeds uit
   diezelfde 119 streken, niet uit het model. ---- */
/* ---- waar een antwoord naartoe mag verwijzen ----
   Alleen deze plekken. Verzint de AI een andere bestemming, dan valt de link eruit
   en blijft de tekst gewoon staan. */
const FD_DOELEN={
  dialin:'dial in', form:'log a brew', brews:'your brews', beans:'your beans',
  methods:'brew methods', recipe:'recipes', gallery:'pouring shapes', cupping:'cupping',
  learn:'learn', 'learn-filter':'filter lesson', 'learn-barista':'barista lesson',
  'learn-academy':'academy', 'learn-latte':'latte art', profile:'profile',
  choosebean:'which bean', finder:'the five steps',
};

/* De 119 streken als menukaart voor de AI. Hij mag alleen kiezen wat hier staat,
   en wat hij noemt controleren we daarna nog een keer tegen BP_INFO. */
function fdMenu(){
  return fdStreken().map(st=>st.land+':'+st.i+' | '+st.naam+' ('+st.landnaam+') | '+st.h+
    ' | '+st.s.join(', ')+' | '+st.proc.join('/')).join('\n');
}
/* Wat de app al van je weet. Zonder dit kan hij "als mijn oude El Salvador" niet lezen. */
function fdIk(){
  const r=[];
  const bonen=(state.beans||[]).slice(0,12).map(b=>{
    const st=bpRegios(b).map(bpRegioTekst).join(' · ');
    return (b.name||'?')+(st?(' — '+st):'')+(b.process?(' — '+b.process):'')+
      (b.roastLevel?(' — '+b.roastLevel):'');
  });
  if(bonen.length)r.push('Op je plank: '+bonen.join(' | '));
  const wens=(state.wishlist||[]).slice(0,8).map(w=>w.naam||w.name).filter(Boolean);
  if(wens.length)r.push('Op je wenslijstje: '+wens.join(', '));
  const brews=(state.brews||[]).slice(0,10).map(b=>{
    const m=methodById(b.method);
    return (m?m.name:'?')+' · '+(b.beans||'?')+' · '+(b.dose||'?')+' g · '+(b.time||'?')+
      (b.temp?(' · '+b.temp+'°C'):'')+(b.score?(' · '+b.score+'/10'):'');
  });
  if(brews.length)r.push('Je laatste brews (nieuwste eerst): '+brews.join(' | '));
  const had=[...bpGehad()].map(id=>BP_LAND[id]?BP_LAND[id].naam:id);
  if(had.length)r.push('Landen die al eens op je plank stonden: '+had.join(', '));
  return r.length?r.join('\n'):'De app is nog leeg: geen bonen, geen brews.';
}

/* Wat er terugkomt is niet te vertrouwen tot het gecontroleerd is: elke streek moet
   bestaan, elke link moet naar een bestaande pagina wijzen. */
function fdKeur(d){
  const soort=['kaart','uitleg','tekst'].includes(d.soort)?d.soort:'tekst';
  const streken=(Array.isArray(d.streken)?d.streken:[]).map(x=>{
    const [land,i]=String(x&&x.streek||'').split(':');
    const inf=BP_INFO[land];
    if(!inf||!inf.streken||!inf.streken[+i])return null;
    return {land, i:+i, waarom:String(x.waarom||'').slice(0,160)};
  }).filter(Boolean).slice(0,5);
  return {
    soort: streken.length?soort:(soort==='kaart'?'tekst':soort),
    zin: String(d.zin||'').slice(0,400),
    uitleg: (Array.isArray(d.uitleg)?d.uitleg:[]).map(p=>String(p||'').slice(0,600)).slice(0,4),
    streken,
    vervolg: (Array.isArray(d.vervolg)?d.vervolg:[]).map(v=>String(v||'').slice(0,80))
      .filter(Boolean).slice(0,3),
    links: (Array.isArray(d.links)?d.links:[]).map(l=>({
      tekst:String(l&&l.tekst||''), naar:String(l&&l.naar||'')
    })).filter(l=>l.tekst&&FD_DOELEN[l.naar]).slice(0,3),
  };
}

async function fdAIZoek(){
  const t=fdQ.trim();
  if(!t||!aiReady())return;
  fdBezig=true; fdAntw=null; fdSchilder();
  try{
    const prompt=
      'Je bent de koffiegids in een app met een getekende wereldkaart. Iemand vraagt:\n"'+t+'"\n\n'+
      'DIT WEET DE APP VAN HEM:\n'+fdIk()+'\n\n'+
      'DE STREKEN DIE DE APP KENT (id | streek (land) | hoogte | smaakwoorden | processen):\n'+
      fdMenu()+'\n\n'+
      'Antwoord in het Nederlands, in de toon van een rustige vakman: kort, concreet, geen '+
      'verkooppraat. Geef ALLEEN JSON terug, zonder tekst eromheen:\n'+
      '{"soort":"kaart|uitleg|tekst","zin":"","uitleg":[],"streken":[{"streek":"land:0","waarom":""}],'+
      '"vervolg":[],"links":[{"tekst":"","naar":""}]}\n\n'+
      'soort = "kaart" als streken het antwoord zijn, "uitleg" als hij iets wil begrijpen '+
      '(geef dan ook streken als voorbeeld), "tekst" als er geen streek bij hoort.\n'+
      'zin = één of twee zinnen, het antwoord zelf. Mag <b>…</b> bevatten voor nadruk.\n'+
      'uitleg = nul tot vier alinea\'s, alleen bij soort "uitleg" of "tekst".\n'+
      'streken = nul tot drie ids LETTERLIJK uit de lijst hierboven, elk met een eigen reden '+
      'waarom juist die past bij zijn vraag. Verzin geen ids.\n'+
      'vervolg = nul tot drie korte vervolgvragen die hij zou kunnen stellen.\n'+
      'links = verwijs je in je tekst naar een plek in de app, zet die hier neer. tekst = de '+
      'letterlijke woorden zoals ze in zin of uitleg staan; naar = een van: '+
      Object.keys(FD_DOELEN).join(', ')+'.\n'+
      'Weet je iets niet (prijzen, winkels, voorraad — de app kent geen webshops), zeg dat '+
      'ronduit en beantwoord de helft die je wel kunt.';
    fdAntw=fdKeur(extractJSON(await askAI([{role:'user',content:prompt}],1600,'finder')));
    if(!fdAntw.zin&&!fdAntw.uitleg.length&&!fdAntw.streken.length)fdAntw=null;
  }catch(e){ fdAntw={soort:'tekst',zin:'Daar kwam ik niet uit. Probeer het anders te vragen, '+
    'of zoek gewoon op een woord.',uitleg:[],streken:[],vervolg:[],links:[]}; }
  fdBezig=false; fdSchilder();
}

/* ---- de zoekbalk op het wereldscherm ---- */
function fdBalkHTML(){
  if(!featOn('finder'))return '';
  const vraagbaar=featOn('finderai');
  return '<div class="fd-zoek"><input id="fd-veld" value="'+esc(fdQ)+'" '+
    'placeholder="'+(fdAI?'ask me anything about coffee…':'country, region, taste, process…')+'" '+
    'oninput="fdTik(this.value)"'+(fdAI?' onkeydown="if(event.key===\'Enter\')fdAIZoek()"':'')+'>'+
    (fdQ?'<button class="wis" onclick="fdTik(\'\')">×</button>':'')+'</div>'+
    (vraagbaar?('<div class="fd-ai"><button class="'+(fdAI?'aan':'')+'" onclick="fdAIAan()">'+
      (fdAI?'AI on':'AI off')+'</button>'+
      (fdAI?'stel een hele vraag en druk op enter':'zoekt in 119 streken, ook zonder internet')+
      '</div>'):'');
}
/* Het antwoord staat ónder de kaart, niet erboven: eerst zie je waar het over gaat,
   daarna waarom. Anders duwt een lang antwoord de kaart van het scherm af. */
function fdUitBlokHTML(){
  if(!featOn('finder'))return '';
  return '<div class="fd-uit" id="fd-uit">'+fdUitHTML()+'</div>'+
    '<button class="bp-knop" style="width:100%;margin-bottom:14px" onclick="fdOpen()">'+
    'find my bag — 5 steps ›</button>';
}
/* De onderstreepte woorden in een antwoord aantikbaar maken. Alleen de eerste keer
   dat ze voorkomen, en alleen buiten een tag -- anders sloopt hij zijn eigen <b>. */
function fdLinks(html,links){
  (links||[]).forEach((l,n)=>{
    const naald=l.tekst.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const re=new RegExp('(?![^<]*>)'+naald,'i');
    if(!re.test(html))return;
    html=html.replace(re,m=>'<button class="fd-link" onclick="fdGaNaar(\''+l.naar+'\')">'+m+'</button>');
  });
  return html;
}
function fdAntwHTML(){
  const a=fdAntw;
  const label={kaart:'de kaart als antwoord',uitleg:'uitleg, met de kaart erbij',
               tekst:'gewoon antwoord'}[a.soort];
  let h='<span class="fd-soort">'+esc(label)+'</span>';
  if(a.zin)h+='<div class="fd-zin">'+fdLinks(a.zin,a.links)+'</div>';
  if(a.uitleg.length)h+='<div class="fd-lap">'+
    a.uitleg.map(p=>'<p>'+fdLinks(p,a.links)+'</p>').join('')+'</div>';
  h+=a.streken.map(x=>{
    const inf=BP_INFO[x.land], st=inf.streken[x.i];
    return '<button class="fd-res" onclick="fdNaar(\''+x.land+'\','+x.i+')">'+
      '<span class="n">'+esc(st.n)+'</span>'+
      '<span class="l">'+esc(BP_LAND[x.land].naam)+' · '+esc(st.h||inf.hoogte)+'</span>'+
      '<span class="s">'+esc((st.s||[]).join(' · '))+'</span>'+
      (x.waarom?('<span class="m">'+esc(x.waarom)+'</span>'):'')+'</button>';
  }).join('');
  if(a.vervolg.length)h+='<div class="fd-verder">'+a.vervolg.map(v=>
    '<button onclick="fdVraag('+JSON.stringify(v).replace(/"/g,'&quot;')+')">'+
    esc(v)+'</button>').join('')+'</div>';
  return h;
}
function fdUitHTML(){
  if(fdBezig)return '<div class="fd-niks"><span class="spin"></span> de AI leest je vraag…</div>';
  if(fdAntw)return fdAntwHTML();
  if(!fdQ.trim())return '';
  const rij=fdZoek(fdQ);
  if(!rij.length)return '<div class="fd-niks">Niets gevonden. Probeer een smaakwoord '+
    'zoals <b>jasmijn</b> of <b>cacao</b>.</div>';
  return '<div class="fd-niks" style="padding:2px 0 8px">'+rij.length+' streken gevonden</div>'+
    rij.slice(0,12).map(x=>
      '<button class="fd-res" onclick="fdNaar(\''+x.st.land+'\','+x.st.i+')">'+
      '<span class="n">'+esc(x.st.naam)+'</span>'+
      '<span class="l">'+esc(x.st.landnaam)+' · '+esc(x.st.h)+'</span>'+
      '<span class="s">'+esc(x.st.s.join(' · '))+'</span>'+
      '<span class="m">raak op '+x.r.join(', ')+'</span></button>').join('');
}
/* alleen het resultaatvak en de kaartkleuren bijwerken -- het hele scherm
   opnieuw tekenen zou de cursor uit het zoekveld gooien */
function fdSchilder(){
  const uit=document.getElementById('fd-uit');
  if(uit)uit.innerHTML=fdUitHTML();
  // een AI-antwoord wijst zijn eigen landen aan; anders doet het gewone zoeken dat
  const raak=new Set(fdAntw?fdAntw.streken.map(x=>x.land)
    :(fdQ.trim()?fdZoek(fdQ).slice(0,14).map(x=>x.st.land):[]));
  document.querySelectorAll('#bp-screen .bp-kaart path[data-land]').forEach(el=>{
    el.classList.toggle('raak',raak.has(el.getAttribute('data-land')));
  });
}
function fdTik(v){
  fdQ=v; fdAntw=null;
  const veld=document.getElementById('fd-veld');
  if(veld&&veld.value!==v)veld.value=v;
  fdSchilder();
  // het kruisje verschijnt pas bij de volgende hele tekening
  if(!v&&veld)bpTeken(true);
}
/* Een vervolgvraag aantikken stelt hem meteen. */
function fdVraag(v){
  fdQ=v; fdAntw=null; bpTeken(true); fdAIZoek();
}
/* Een verwijzing in het antwoord: open die plek, en onthoud waar je vandaan kwam.
   Zonder de terugweg ben je je antwoord kwijt zodra je ergens gaat kijken. */
function fdGaNaar(naar){
  if(!FD_DOELEN[naar])return;
  fdTerug={van:'beanpick'};
  go(naar);
  fdPil();
}
function fdTerugNaarAntwoord(){
  fdTerug=null;
  bpNiv='wereld'; bpDeel=null; bpLandId=null; bpStreek=null;
  bpView=BP_VIEWS.wereld.slice();
  go('beanpick');
  fdPil();
}
function fdPilWeg(){ fdTerug=null; fdPil(); }
/* Het balkje boven de tabbalk. Eén element, dat komt en gaat. */
function fdPil(){
  let el=document.getElementById('fd-pil');
  const toon=!!fdTerug&&currentPage!=='beanpick'&&currentPage!=='finder';
  if(!toon){ if(el)el.remove(); return; }
  if(!el){
    el=document.createElement('div');
    el.id='fd-pil'; el.className='fd-pil';
    el.innerHTML='<span onclick="fdTerugNaarAntwoord()">‹ back to your answer</span>'+
      '<button class="weg" onclick="fdPilWeg()" aria-label="sluiten">×</button>';
    document.querySelector('.phone').appendChild(el);
  }
}
function fdAIAan(){
  if(!fdAI&&!aiReady()){toast('turn on AI under profile');return;}
  fdAI=!fdAI; bpTeken(true);
}
function fdNaar(land,i){
  bpVoor=null; bpVanaf=bpVanaf||'beans';
  bpDeel=BP_LAND[land].deel; bpLandId=land; bpNiv='land'; bpStreek=i; bpVarOpen=null;
  bpView=bpLandView(land).slice(); bpNaarStreek=true;
  bpTeken();
}

/* ---- het scherm met de vijf stappen ---- */
function fdOpen(){fdReset();go('finder');}
function fdTeken(behoudScroll){
  const el=document.getElementById('fd-screen'); if(!el)return;
  const y=el.scrollTop;
  el.innerHTML=(fdStap<5)?fdStapHTML():fdTopHTML();
  el.scrollTop=behoudScroll?y:0;
}
function fdKaartje(landen,top){
  const set=new Set(landen||[]), t=new Set(top||[]);
  const v=BP_VIEWS.wereld;
  let s='<svg class="bp-kaart" viewBox="'+v.join(' ')+'" preserveAspectRatio="xMidYMid meet">';
  s+='<rect class="band" x="-200" y="'+bpY(23.5)+'" width="500" height="'+(bpY(-23.5)-bpY(23.5))+'"/>';
  BP_ACHTER.forEach(pl=>{
    s+='<path class="achter" d="M'+pl.map(q=>bpX(q[0]).toFixed(1)+' '+bpY(q[1]).toFixed(1)).join('L')+'Z"/>';
  });
  BP_VOLGORDE.forEach(l=>{
    const kl='land'+(t.has(l.id)?' sel':set.has(l.id)?' raak':'');
    s+='<path class="'+kl+'" d="'+bpPad(l)+'"></path>';
  });
  return '<div class="bp-doos">'+s+'</svg></div>';
}
function fdStapHTML(){
  const S=FD_STAPPEN[fdStap];
  const rij=fdRang(), raak=[...new Set(rij.slice(0,18).map(x=>x.st.land))];
  let keuze='';
  if(S.soort==='fam'){
    keuze='<div class="fd-fam">'+FD_FAMS.map(f=>
      '<button class="'+((fdA.fams||[]).includes(f)?'sel':'')+'" onclick="fdFam(\''+f+'\')">'+
      FD_FAM[f].n+'<em>'+FD_FAM[f].u+'</em></button>').join('')+'</div>';
  }else{
    keuze=S.o.map(o=>'<button class="fd-keus'+(fdA[S.k]===o.v?' sel':'')+'" onclick="fdKies(\''+
      S.k+'\',\''+o.v+'\')"><span class="vk">'+(fdA[S.k]===o.v?'✓':'○')+'</span>'+
      '<span><b>'+o.n+'</b><em>'+o.u+'</em></span></button>').join('');
  }
  return '<div class="bp-kop"><div class="t">Step '+(fdStap+1)+' of 5</div>'+
    '<button class="bp-terug" onclick="'+(fdStap?'fdStap--;fdTeken()':'go(\'beanpick\')')+
    '">‹ '+(fdStap?'back':'map')+'</button></div>'+
    '<div class="fd-balk">'+FD_STAPPEN.map((_,i)=>
      '<i class="'+(i<=fdStap?'op':'')+'"></i>').join('')+'</div>'+
    fdKaartje(raak,[])+
    '<div class="fd-teller">'+fdOver()+' of the 119 regions still fit</div>'+
    '<div class="fd-vraag">'+S.v+'</div>'+
    uitklapHTML('waarom','why we ask this',S.w,'fdTeken(true)')+
    keuze+
    '<button class="bp-knop" style="width:100%;margin-top:6px" onclick="fdVerder()">'+
    (fdStap===4?'show my top 3 ›':'next ›')+'</button>';
}
function fdTopHTML(){
  const rij=fdRang().slice(0,3), landen=rij.map(x=>x.st.land);
  return '<div class="bp-kop"><div class="t">Your top 3</div>'+
    '<button class="bp-terug" onclick="fdStap=4;fdTeken()">‹ steps</button></div>'+
    '<div class="bp-let">Uit 119 streken, op wat je net koos.</div>'+
    fdKaartje(landen,landen)+
    rij.map((x,i)=>'<div class="fd-res'+(i?'':' top1')+'"><span class="nr">'+(i+1)+'</span>'+
      '<span class="n">'+esc(x.st.naam)+'</span>'+
      '<span class="l">'+esc(x.st.landnaam)+' · '+esc(x.st.h)+'</span>'+
      '<span class="s">'+esc(x.st.s.join(' · '))+'</span>'+
      '<span class="m">'+esc(x.r.slice(0,3).join(' · ')||'past het dichtst bij je antwoorden')+
      '</span><div class="wens-rij">'+
      '<button class="lp sel" onclick="fdNaarStreek(\''+x.st.land+'\','+x.st.i+')">'+
      'bekijk op de kaart →</button></div></div>').join('')+
    '<button class="bp-knop leeg" style="width:100%;margin-top:6px" onclick="fdStap=1;fdTeken()">'+
    'try something else</button>';
}
function fdNaarStreek(land,i){
  if(fdA.proc!=='egaal'&&BP_INFO[land].proc.includes(fdA.proc))bpProc=fdA.proc;
  fdNaar(land,i); go('beanpick');
}
function fdKies(k,v){fdA[k]=v;fdTeken(true);}
function fdFam(f){
  const l=fdA.fams||(fdA.fams=[]), i=l.indexOf(f);
  if(i>=0)l.splice(i,1); else if(l.length<3)l.push(f);
  fdTeken(true);
}
function fdVerder(){ if(fdStap<4)fdStap++; else fdStap=5; fdTeken(); }

let bpNaarStreek=false;   // net binnengekomen bij een streek: schuif hem in beeld
function bpTeken(behoudScroll){
  const el=document.getElementById('bp-screen'); if(!el)return;
  const y=behoudScroll?el.scrollTop:0;
  el.innerHTML=(bpNiv==='wereld')?bpWereld():(bpNiv==='deel'?bpDeelScherm():bpLandScherm());
  el.scrollTop=y;
  bpVenster();
  if(bpNiv==='wereld'&&(fdAntw||fdQ.trim()))fdSchilder();
  if(bpNaarStreek){
    bpNaarStreek=false;
    const op=el.querySelector('.bp-streek.op');
    if(op)setTimeout(()=>op.scrollIntoView({behavior:'smooth',block:'start'}),120);
  }
}

