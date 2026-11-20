const links = {
 tram:'https://edinburghtrams.com/', airport:'https://www.edinburghairport.com/', airportTram:'https://www.edinburghairport.com/transport-links/trams',
 close:'https://www.realmarykingsclose.com/', market:'https://www.edinburghschristmas.com/', whisky:'https://www.scotchwhiskyexperience.co.uk/',
 weather:'https://www.metoffice.gov.uk/weather/forecast/gcvwr3zrw', museum:'https://www.nms.ac.uk/national-museum-of-scotland'
};
const place = (name, address, lat, lng, type='sight', site='') => ({name,address,point:[lat,lng],type,site});
const airport = place('Edinburgh Airport','Edinburgh Airport, EH12 9DN',55.9486,-3.3642,'tram',links.airport);
const home = place('Airbnb','14 Barony Street, Edinburgh EH3 6NX',55.95795,-3.19168,'stay');
const haymarket = place('Haymarket tram stop','Haymarket Terrace, Edinburgh',55.9458,-3.2183,'tram');
const dean = place('Dean Village','Dean Village, Edinburgh',55.952,-3.214);
const pantry = place('The Pantry','1 North West Circus Place, Edinburgh EH3 6ST',55.9562,-3.2077,'food','https://www.thepantryedinburgh.co.uk/');
const circus = place('Circus Lane','Circus Lane, Edinburgh',55.9552,-3.209);
const stephen = place('St Stephen Street','St Stephen Street, Edinburgh',55.9566,-3.2024);
const broughton = place('Broughton Street','Broughton Street, Edinburgh',55.9579,-3.1889);
const dirty = place("Dirty Dick’s Pub",'159 Rose Street, Edinburgh EH2 2NH',55.95096,-3.204,'food');
const close = place("The Real Mary King’s Close","2 Warriston’s Close, Edinburgh EH1 1PG",55.9507,-3.190,'sight',links.close);
const market = place('Edinburgh Christmas Market','East Princes Street Gardens, Edinburgh',55.951,-3.193,'sight',links.market);
const music = [
 place('Royal Mile Tavern','127 High Street, Edinburgh',55.9501,-3.1878,'music','https://www.royalmiletavern.com/'),
 place("The Captain’s Bar",'4 South College Street, Edinburgh',55.9472,-3.1863,'music','https://www.captainsedinburgh.com/'),
 place('Stramash','207 Cowgate, Edinburgh',55.9492,-3.1873,'music','https://stramashedinburgh.com/')
];
const coffee = [
 place('Room and Rumours','Arch 13, 25 East Market Street, Edinburgh',55.9511,-3.1853,'food','https://www.instagram.com/roomrumourscoffee/'),
 place('The Edinburgh Larder','15 Blackfriars Street, Edinburgh',55.9497,-3.1864,'food','https://www.edinburghlarder.co.uk/'),
 place('Greenwoods','61 Frederick Street, Edinburgh',55.9544,-3.2017,'food','https://greenwoods.eu/edinburgh/'),
 place('Hula','103–105 West Bow, Edinburgh',55.9485,-3.1938,'food','https://www.hula.co.uk/visit')
];
const grey = place('Greyfriars Kirkyard','Greyfriars Place, Edinburgh',55.9469,-3.191);
const museum = place('National Museum of Scotland','Chambers Street, Edinburgh',55.947,-3.190,'sight',links.museum);
const giles = place("St Giles’ Cathedral",'High Street, Edinburgh',55.9495,-3.1908,'sight','https://www.stgilescathedral.org.uk/');
const roast = place('The Auld Hundred','100 Rose Street, Edinburgh EH2 2NN',55.9522,-3.1996,'food','https://auldhundrededinburgh.com/');
const whisky = place('The Scotch Whisky Experience','354 Castlehill, Edinburgh EH1 2NE',55.9487,-3.199,'sight',links.whisky);
const hill = place('Calton Hill','Calton Hill, Edinburgh',55.9553,-3.1825);
const picardy = place('Picardy Place tram stop','Picardy Place, Edinburgh',55.9573,-3.1865,'tram',links.tram);
const activity = (id,start,end,title,spots,journey,copy,extra={}) => ({id,start,end,title,spots,journey,copy,...extra});
const days = [
 {name:'Saturday',date:'2026-11-21',label:'21 November',tag:'Riverside walks & festive lights',intro:'From Dean Village to the Christmas market, with an underground tour and a night of live music.',items:[
  activity('land','08:35','10:00','Arrive at Edinburgh Airport',[airport,haymarket],'Tram 25–30 min · Walk 15–20 min','After landing at 08:35, follow signs for the tram outside the terminal. Buy tickets before boarding, take a tram towards Newhaven and get off at Haymarket. Aim to reach Haymarket at 09:15–09:30, allowing time for disembarking. Keep tickets handy and check live departures. Walk from Haymarket to Dean Village.',{refs:[['Edinburgh Trams',links.tram],['Airport tram information',links.airportTram]],mode:'transit'}),
  activity('dean','10:00','11:00','Dean Village',[dean],'From Haymarket · 15–20 min walk · ~1.3 km','Explore this former milling village beside the Water of Leith. Look for Well Court, Dean Bridge, historic stone buildings and riverside viewpoints. Take bridge photos and follow the riverside path. Allow 45–60 minutes and take care on wet cobbles.'),
  activity('river','11:00','11:30','Water of Leith walk',[pantry],'From Dean Village · 20–25 min walk · ~1.3 km','Follow the riverside path towards Stockbridge, then head up to The Pantry. Check the walking directions for diversions.'),
  activity('pantry','11:30','12:00','Coffee and pastry at The Pantry',[pantry],'You’re already there','Grab coffee, a pastry or a light snack at this independent Stockbridge brunch café. Keep it short and check opening hours. A full lunch is planned for 14:30.',{badge:'Recommended'}),
  activity('newtown','12:00','13:30','Stockbridge & New Town',[circus,stephen,broughton],'Flexible walk · ~2 km','Start with a photo together on Circus Lane, a cobbled street of Georgian houses. Browse the independent shops and cafés of St Stephen Street, then explore Broughton Street’s shops, restaurants and pubs. Leave time for photos and gradually make your way back towards Barony Street.',{badge:'Optional'}),
  activity('checkin','14:00','14:30','Check in at the Airbnb',[home],'From Broughton Street · ~5 min walk','Follow the host’s check-in instructions, freshen up and get ready for lunch. You each have one backpack, so there’s no luggage collection on Sunday.',{badge:'Accommodation'}),
  activity('dirty','14:30','15:35','Lunch at Dirty Dick’s',[dirty],'From Barony Street · ~20 min walk · ~1.4 km','Sit down for a full pub lunch. Look out for haggis, neeps and tatties, steak pie, Scottish fish and chips, or haggis bon bons. Tell the staff about the 16:00 booking. Allow 60–65 minutes and leave by 15:35 for the 12–15 minute walk to the Close.',{badge:'Booked ✓'}),
  activity('close','16:00','17:15','The Real Mary King’s Close',[close],'From Dirty Dick’s · 12–15 min walk · ~1 km','Take a guided tour of preserved underground streets beneath the Royal Mile. Hear stories about former residents, overcrowding, plague and life in the closes. Allow 60–75 minutes. Arrive 10–15 minutes early, check your confirmation, and expect stairs, uneven surfaces and potential photography restrictions.',{badge:'Booked ✓'}),
  activity('market','17:15','19:15','Edinburgh Christmas Market',[market],'From the Close · ~5–10 min walk','Explore the wooden chalets after dark. Try bratwurst, hot chocolate, mulled wine or festive sweets, and look for views of the Castle and Scott Monument. The Big Wheel is optional. Dress warmly and expect crowds. Allow 1½–2 hours. Entry is generally free and rides and purchases cost extra. Check the organiser’s information for access, hours and changes.',{feature:'festive'}),
  activity('music','19:30','','Live music and drinks',music,'From the market · ~10–20 min walk','Choose a venue and check its actual Saturday programme. Live music and availability can change.',{badge:'Optional',choices:['Traditional central pub convenient after the market.','Intimate acoustic folk pub for a cosy evening.','Converted church with bands and dancing for a bigger night out.']})
 ]},
 {name:'Sunday',date:'2026-11-22',label:'22 November',tag:'Old Town & golden hour',intro:'Old Town lanes, a proper Sunday roast, Scotch whisky and twilight over the city.',items:[
  activity('wake','08:30','09:00','Wake up and get ready',[home],'Start at the Airbnb','Check out by 11:00. Take both backpacks when you leave for coffee so you can stay in town all day.'),
  activity('coffee','09:15','09:45','Coffee and pastry',coffee,'From Barony Street · ~12–20 min walk','Have a speciality coffee with a pastry or doughnut. Room and Rumours is the first choice. Check each café’s current opening hours before leaving.',{badge:'Recommended',choices:['First choice · speciality coffee and bakery.','Old Town café near the Royal Mile.','Breakfast café in the New Town.','Coffee and juice bar by Victoria Street.']}),
  activity('oldtown','09:45','11:15','Old Town sightseeing',[grey,museum,giles],'Flexible walk · ~1.5 km','Start at Greyfriars Kirkyard. Local legend says Greyfriars Bobby guarded his owner’s grave for years. The National Museum of Scotland has free general admission and galleries on Scottish history, science, nature and technology. Allow 30–45 minutes if you go in. Continue to St Giles’ Cathedral on the Royal Mile to see its crown-shaped tower. Pick the stops that fit the morning.',{badge:'Optional'}),
  activity('roast','11:30','13:15','Sunday roast at The Auld Hundred',[roast],'From St Giles’ · ~12–15 min walk','The itinerary window begins at 11:30. Your table for two is confirmed for 12:00. Allow 75 minutes for a sit-down roast in this traditional pub. Leave around 13:15 for the 15–20 minute walk to Castlehill. Explore the Royal Mile, look for Castle views and aim to arrive by 13:45.',{badge:'Booked ✓',refs:[['Walking directions to the whisky experience','https://www.google.com/maps/dir/?api=1&origin=100+Rose+Street+Edinburgh&destination=354+Castlehill+Edinburgh&travelmode=walking']]}),
  activity('whisky','14:00','15:15','The Scotch Whisky Experience',[whisky],'From The Auld Hundred · 15–20 min walk · ~1 km','Discover production, maturation, regional flavours and the whisky collection, with tasting according to your ticket. Arrive 10–15 minutes early and check the booking confirmation. Allow about 75 minutes, depending on your tour type.',{badge:'Booked ✓'}),
  activity('hill','15:15','16:45','Sunset on Calton Hill',[hill],'From Castlehill · 15–20 min walk plus climb · ~1.5 km','Walk towards Calton Hill from 15:15–15:35, then climb and pick a viewpoint by 15:50. Sunset is approximately 15:54 Edinburgh time. Enjoy twilight and photos from 16:00–16:45. Look for the Dugald Stewart, National and Nelson monuments, Edinburgh Castle and Arthur’s Seat. Wear comfortable shoes and watch for wind, steps and uneven ground. A late finish at the whisky tour shortens the viewing window.',{feature:'sunset'}),
  activity('picardy','16:45','17:40','Walk to Picardy Place',[picardy],'From Calton Hill · 15–20 min walk','Descend towards Picardy Place and find the tram platforms. Allow time to check the airport-bound departure and buy or validate tickets before boarding.'),
  activity('fly','17:40','18:30','Tram to Edinburgh Airport',[airport],'From Picardy Place · Tram 30–35 min','Board a tram displaying Edinburgh Airport. Aim to arrive by 18:30 for the 20:40 flight, allowing 2 hours 10 minutes at the airport. Check in online and review your airline’s baggage and security requirements.',{mode:'transit',refs:[['Edinburgh Trams',links.tram]]})
 ]}
];
const checklist = {
 'Before leaving':['Check Airbnb check-in instructions','Download Mary King’s Close tickets','Download Scotch Whisky Experience tickets','Check airline check-in','Check live tram times','Check Edinburgh weather','Check Saturday live music programme','Book Sunday roast at Hawksmoor if desired (optional alternative to the confirmed Auld Hundred booking)'],
 'Packing':['Passport / required travel identification','Phone and charging cable','Power bank','Warm coat','Comfortable walking shoes','Gloves and scarf','One backpack each','Bank card'],
 'During the weekend':['Visit Dean Village','Get a photograph together at Circus Lane','Try Scottish food at Dirty Dick’s','Explore the Christmas Market','Listen to live Scottish music','Complete the underground tour','Enjoy a Sunday roast','Taste Scotch whisky','Watch the sunset from Calton Hill']
};

