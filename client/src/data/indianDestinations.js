/**
 * All 28 states + 8 Union Territories of India as YATRA destination categories.
 * Each entry lists popular tourist cities with example stops/attractions.
 */
export const INDIAN_DESTINATIONS = [
  {
    name: 'Andhra Pradesh',
    kind: 'state',
    cities: [
      { city: 'Visakhapatnam', stops: ['RK Beach', 'Kailasagiri', 'Submarine Museum', 'Araku Valley'] },
      { city: 'Tirupati', stops: ['Tirumala Temple', 'Sri Venkateswara National Park', 'Chandragiri Fort'] },
      { city: 'Vijayawada', stops: ['Kanaka Durga Temple', 'Prakasam Barrage', 'Undavalli Caves', 'Bhavani Island'] },
      { city: 'Amaravati', stops: ['Dhyana Buddha', 'Amaravati Stupa', 'Krishna Riverfront'] },
    ],
  },
  {
    name: 'Arunachal Pradesh',
    kind: 'state',
    cities: [
      { city: 'Tawang', stops: ['Tawang Monastery', 'Sela Pass', 'Nuranang Falls'] },
      { city: 'Itanagar', stops: ['Ita Fort', 'Ganga Lake', 'Buddhist Temple'] },
      { city: 'Ziro', stops: ['Ziro Valley', 'Talley Valley', 'Apatani villages'] },
    ],
  },
  {
    name: 'Assam',
    kind: 'state',
    cities: [
      { city: 'Guwahati', stops: ['Kamakhya Temple', 'Umananda Island', 'Assam State Museum'] },
      { city: 'Kaziranga', stops: ['One-horned rhino safari', 'Brahmaputra views', 'Tea estates'] },
      { city: 'Majuli', stops: ['River island', 'Satras', 'Mishing villages'] },
      { city: 'Dibrugarh', stops: ['Tea gardens', 'Brahmaputra ghats', 'Heritage bungalows'] },
    ],
  },
  {
    name: 'Bihar',
    kind: 'state',
    cities: [
      { city: 'Bodh Gaya', stops: ['Mahabodhi Temple', 'Bodhi Tree', 'Great Buddha Statue'] },
      { city: 'Patna', stops: ['Golghar', 'Patna Museum', 'Mahavir Mandir'] },
      { city: 'Nalanda', stops: ['Nalanda University ruins', 'Archaeological Museum'] },
      { city: 'Rajgir', stops: ['Vishwa Shanti Stupa', 'Hot springs', 'Griddhakuta Hill'] },
    ],
  },
  {
    name: 'Chhattisgarh',
    kind: 'state',
    cities: [
      { city: 'Raipur', stops: ['Mahant Ghasidas Museum', 'Nandan Van Zoo'] },
      { city: 'Jagdalpur', stops: ['Chitrakote Falls', 'Bastar Palace', 'Tirathgarh Falls'] },
      { city: 'Sirpur', stops: ['Laxman Temple', 'Buddhist sites', 'Surang Tila'] },
    ],
  },
  {
    name: 'Goa',
    kind: 'state',
    cities: [
      { city: 'North Goa', stops: ['Calangute', 'Baga', 'Fort Aguada', 'Anjuna Flea Market'] },
      { city: 'South Goa', stops: ['Palolem', 'Colva', 'Cabo de Rama', 'Dudhsagar'] },
      { city: 'Old Goa', stops: ['Basilica of Bom Jesus', 'Se Cathedral', 'Churches'] },
    ],
  },
  {
    name: 'Gujarat',
    kind: 'state',
    cities: [
      { city: 'Ahmedabad', stops: ['Sabarmati Ashram', 'Adalaj Stepwell', 'Old City'] },
      { city: 'Kutch', stops: ['White Rann', 'Bhuj', 'Mandvi Beach'] },
      { city: 'Gir', stops: ['Gir National Park', 'Somnath Temple', 'Diu'] },
      { city: 'Statue of Unity', stops: ['Sardar Sarovar', 'Valley of Flowers', 'Viewing gallery'] },
    ],
  },
  {
    name: 'Haryana',
    kind: 'state',
    cities: [
      { city: 'Gurugram', stops: ['Kingdom of Dreams', 'Cyber Hub', 'Sultanpur Bird Sanctuary'] },
      { city: 'Kurukshetra', stops: ['Brahma Sarovar', 'Jyotisar', 'Panorama'] },
      { city: 'Pinjore', stops: ['Pinjore Gardens', 'Heritage train'] },
    ],
  },
  {
    name: 'Himachal Pradesh',
    kind: 'state',
    cities: [
      { city: 'Shimla', stops: ['Mall Road', 'Jakhoo Temple', 'Kufri'] },
      { city: 'Manali', stops: ['Solang Valley', 'Rohtang', 'Hadimba Temple'] },
      { city: 'Dharamshala', stops: ['McLeod Ganj', 'Triund', 'Dalai Lama Temple'] },
      { city: 'Spiti', stops: ['Key Monastery', 'Chandratal', 'Kaza'] },
    ],
  },
  {
    name: 'Jharkhand',
    kind: 'state',
    cities: [
      { city: 'Ranchi', stops: ['Tagore Hill', 'Hundru Falls', 'Rock Garden'] },
      { city: 'Jamshedpur', stops: ['Jubilee Park', 'Dalma Wildlife', 'Dimna Lake'] },
      { city: 'Netarhat', stops: ['Sunrise Point', 'Koel View', 'Magnolia Point'] },
    ],
  },
  {
    name: 'Karnataka',
    kind: 'state',
    cities: [
      { city: 'Bengaluru', stops: ['Lalbagh', 'Cubbon Park', 'Bangalore Palace', 'Nandi Hills'] },
      { city: 'Mysuru', stops: ['Mysore Palace', 'Chamundi Hill', 'Brindavan Gardens'] },
      { city: 'Hampi', stops: ['Virupaksha Temple', 'Vittala Temple', 'Stone Chariot'] },
      { city: 'Coorg', stops: ['Abbey Falls', 'Dubare', 'Raja Seat'] },
    ],
  },
  {
    name: 'Kerala',
    kind: 'state',
    cities: [
      { city: 'Kochi', stops: ['Fort Kochi', 'Chinese nets', 'Mattancherry'] },
      { city: 'Alleppey', stops: ['Backwaters', 'Houseboats', 'Marari Beach'] },
      { city: 'Munnar', stops: ['Tea estates', 'Eravikulam', 'Mattupetty'] },
      { city: 'Wayanad', stops: ['Edakkal Caves', 'Banasura Sagar', 'Chembra Peak'] },
    ],
  },
  {
    name: 'Madhya Pradesh',
    kind: 'state',
    cities: [
      { city: 'Bhopal', stops: ['Upper Lake', 'Van Vihar', 'Taj-ul-Masajid'] },
      { city: 'Khajuraho', stops: ['Western Group temples', 'Sound & Light', 'Raneh Falls'] },
      { city: 'Gwalior', stops: ['Gwalior Fort', 'Jai Vilas Palace', 'Sas Bahu Temples'] },
      { city: 'Indore', stops: ['Rajwada', 'Sarafa Night Food', 'Patalpani'] },
    ],
  },
  {
    name: 'Maharashtra',
    kind: 'state',
    cities: [
      { city: 'Mumbai', stops: ['Gateway of India', 'Marine Drive', 'Elephanta', 'Juhu'] },
      { city: 'Pune', stops: ['Shaniwar Wada', 'Sinhagad', 'Aga Khan Palace'] },
      { city: 'Aurangabad', stops: ['Ajanta Caves', 'Ellora Caves', 'Bibi ka Maqbara'] },
      { city: 'Mahabaleshwar', stops: ['Viewpoints', 'Strawberries', 'Venna Lake'] },
    ],
  },
  {
    name: 'Manipur',
    kind: 'state',
    cities: [
      { city: 'Imphal', stops: ['Kangla Fort', 'Ima Keithel', 'Loktak Lake'] },
      { city: 'Moirang', stops: ['INA Memorial', 'Loktak phumdis', 'Sendra Island'] },
      { city: 'Ukhrul', stops: ['Shirui Lily', 'Khayang Peak'] },
    ],
  },
  {
    name: 'Meghalaya',
    kind: 'state',
    cities: [
      { city: 'Shillong', stops: ["Ward's Lake", 'Elephant Falls', 'Laitlum'] },
      { city: 'Cherrapunji', stops: ['Living root bridges', 'Nohkalikai Falls', 'Mawsmai Caves'] },
      { city: 'Dawki', stops: ['Umngot River', 'Border view'] },
    ],
  },
  {
    name: 'Mizoram',
    kind: 'state',
    cities: [
      { city: 'Aizawl', stops: ['Solomon Temple', 'Durtlang Hills', 'Heritage sites'] },
      { city: 'Reiek', stops: ['Reiek Peak', 'Mizo village experience'] },
      { city: 'Champhai', stops: ['Rih Dil', 'Myanmar border views'] },
    ],
  },
  {
    name: 'Nagaland',
    kind: 'state',
    cities: [
      { city: 'Kohima', stops: ['War Cemetery', 'Kisama Heritage Village', 'Dzükou Valley'] },
      { city: 'Dimapur', stops: ['Kachari Ruins', 'Hong Kong Market'] },
      { city: 'Mon', stops: ['Konyak headhunter heritage', 'Longwa village'] },
    ],
  },
  {
    name: 'Odisha',
    kind: 'state',
    cities: [
      { city: 'Puri', stops: ['Jagannath Temple', 'Puri Beach', 'Chilika'] },
      { city: 'Bhubaneswar', stops: ['Lingaraj Temple', 'Udayagiri', 'Nandankanan'] },
      { city: 'Konark', stops: ['Sun Temple', 'Chandrabhaga Beach'] },
      { city: 'Simlipal', stops: ['Tiger reserve', 'Barehipani Falls'] },
    ],
  },
  {
    name: 'Punjab',
    kind: 'state',
    cities: [
      { city: 'Amritsar', stops: ['Golden Temple', 'Jallianwala Bagh', 'Wagah Border'] },
      { city: 'Chandigarh (shared)', stops: ['Rock Garden', 'Sukhna Lake', 'Capitol Complex'] },
      { city: 'Anandpur Sahib', stops: ['Virasat-e-Khalsa', 'Gurdwara'] },
    ],
  },
  {
    name: 'Rajasthan',
    kind: 'state',
    cities: [
      { city: 'Jaipur', stops: ['Hawa Mahal', 'Amber Fort', 'City Palace', 'Jantar Mantar'] },
      { city: 'Udaipur', stops: ['Lake Pichola', 'City Palace', 'Monsoon Palace'] },
      { city: 'Jodhpur', stops: ['Mehrangarh', 'Blue City', 'Jaswant Thada'] },
      { city: 'Jaisalmer', stops: ['Fort', 'Sam dunes', 'Patwon ki Haveli'] },
    ],
  },
  {
    name: 'Sikkim',
    kind: 'state',
    cities: [
      { city: 'Gangtok', stops: ['MG Marg', 'Rumtek Monastery', 'Tsomgo Lake'] },
      { city: 'Pelling', stops: ['Khecheopalri Lake', 'Pemayangtse', 'Rabdentse'] },
      { city: 'Lachung', stops: ['Yumthang Valley', 'Zero Point', 'Hot springs'] },
    ],
  },
  {
    name: 'Tamil Nadu',
    kind: 'state',
    cities: [
      { city: 'Chennai', stops: ['Marina Beach', 'Kapaleeshwarar', 'Mahabalipuram'] },
      { city: 'Madurai', stops: ['Meenakshi Temple', 'Thirumalai Nayakkar'] },
      { city: 'Ooty', stops: ['Botanical Garden', 'Nilgiri toy train', 'Doddabetta'] },
      { city: 'Kanyakumari', stops: ['Vivekananda Rock', 'Sunrise/sunset', 'Thiruvalluvar'] },
    ],
  },
  {
    name: 'Telangana',
    kind: 'state',
    cities: [
      { city: 'Hyderabad', stops: ['Charminar', 'Golconda', 'Hussain Sagar', 'Ramoji Film City'] },
      { city: 'Warangal', stops: ['Thousand Pillar Temple', 'Warangal Fort', 'Bhadrakali'] },
      { city: 'Nagarjunasagar', stops: ['Dam', 'Buddhist island', 'Ethipothala'] },
    ],
  },
  {
    name: 'Tripura',
    kind: 'state',
    cities: [
      { city: 'Agartala', stops: ['Ujjayanta Palace', 'Neermahal', 'Sepahijala'] },
      { city: 'Unakoti', stops: ['Rock carvings', 'Pilgrimage trail'] },
      { city: 'Jampui Hills', stops: ['Orange festival', 'Sunrise views'] },
    ],
  },
  {
    name: 'Uttar Pradesh',
    kind: 'state',
    cities: [
      { city: 'Varanasi', stops: ['Ghats', 'Kashi Vishwanath', 'Ganga Aarti', 'Sarnath'] },
      { city: 'Agra', stops: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri'] },
      { city: 'Lucknow', stops: ['Bara Imambara', 'Chowk', 'Residency'] },
      { city: 'Prayagraj', stops: ['Triveni Sangam', 'Kumbh', 'Anand Bhavan'] },
    ],
  },
  {
    name: 'Uttarakhand',
    kind: 'state',
    cities: [
      { city: 'Rishikesh', stops: ['Laxman Jhula', 'Yoga ashrams', 'River rafting'] },
      { city: 'Haridwar', stops: ['Har Ki Pauri', 'Mansa Devi', 'Ganga Aarti'] },
      { city: 'Nainital', stops: ['Naini Lake', 'Snow View', 'Jim Corbett'] },
      { city: 'Mussoorie', stops: ['Gun Hill', 'Kempty Falls', 'Lal Tibba'] },
    ],
  },
  {
    name: 'West Bengal',
    kind: 'state',
    cities: [
      { city: 'Kolkata', stops: ['Howrah Bridge', 'Victoria Memorial', 'Dakshineswar'] },
      { city: 'Darjeeling', stops: ['Toy train', 'Tiger Hill', 'Tea estates'] },
      { city: 'Sundarbans', stops: ['Mangrove safari', 'Tiger reserve'] },
      { city: 'Digha', stops: ['Beach', 'Marine Aquarium', 'Udaipur Beach'] },
    ],
  },
  /* Union Territories */
  {
    name: 'Delhi',
    kind: 'ut',
    cities: [
      { city: 'New Delhi', stops: ['India Gate', 'Qutub Minar', 'Humayun Tomb', 'Lotus Temple'] },
      { city: 'Old Delhi', stops: ['Red Fort', 'Jama Masjid', 'Chandni Chowk'] },
      { city: 'South Delhi', stops: ['Hauz Khas', 'Qutub complex', 'Garden of Five Senses'] },
    ],
  },
  {
    name: 'Jammu & Kashmir',
    kind: 'ut',
    cities: [
      { city: 'Srinagar', stops: ['Dal Lake', 'Shalimar Bagh', 'Gulmarg day trip'] },
      { city: 'Pahalgam', stops: ['Betaab Valley', 'Aru', 'Lidder River'] },
      { city: 'Jammu', stops: ['Vaishno Devi base', 'Bagh-e-Bahu', 'Amar Mahal'] },
    ],
  },
  {
    name: 'Ladakh',
    kind: 'ut',
    cities: [
      { city: 'Leh', stops: ['Leh Palace', 'Shanti Stupa', 'Magnetic Hill'] },
      { city: 'Nubra', stops: ['Diskit Monastery', 'Sand dunes', 'Bactrian camels'] },
      { city: 'Pangong', stops: ['Pangong Lake', 'Chang La'] },
    ],
  },
  {
    name: 'Puducherry',
    kind: 'ut',
    cities: [
      { city: 'Pondicherry', stops: ['French Quarter', 'Promenade', 'Aurobindo Ashram'] },
      { city: 'Auroville', stops: ['Matrimandir', 'Visitor centre'] },
      { city: 'Karaikal', stops: ['Beach', 'Heritage temples'] },
    ],
  },
  {
    name: 'Andaman & Nicobar Islands',
    kind: 'ut',
    cities: [
      { city: 'Port Blair', stops: ["Cellular Jail", "Corbyn's Cove", 'Ross Island'] },
      { city: 'Havelock', stops: ['Radhanagar Beach', 'Elephant Beach', 'Scuba'] },
      { city: 'Neil Island', stops: ['Natural Bridge', 'Bharatpur Beach'] },
    ],
  },
  {
    name: 'Lakshadweep',
    kind: 'ut',
    cities: [
      { city: 'Agatti', stops: ['Lagoon', 'Coral reefs', 'Water sports'] },
      { city: 'Bangaram', stops: ['Private island', 'Snorkelling'] },
      { city: 'Kavaratti', stops: ['Mosque', 'Lagoon kayaking'] },
    ],
  },
  {
    name: 'Chandigarh',
    kind: 'ut',
    cities: [
      { city: 'Chandigarh', stops: ['Rock Garden', 'Sukhna Lake', 'Rose Garden', 'Capitol Complex'] },
      { city: 'Pinjore (nearby)', stops: ['Mughal Gardens', 'Heritage rail'] },
    ],
  },
  {
    name: 'Dadra & Nagar Haveli and Daman & Diu',
    kind: 'ut',
    cities: [
      { city: 'Silvassa', stops: ['Tribal culture', 'Vanganga Lake', 'Lion Safari'] },
      { city: 'Daman', stops: ['Fort', 'Jampore Beach', 'Church of Bom Jesus'] },
      { city: 'Diu', stops: ['Nagoa Beach', 'Diu Fort', 'Gangeshwar Temple'] },
    ],
  },
];
