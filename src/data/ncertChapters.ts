export type NcertMap = Record<string, Record<string, string[]>>;

// Curated NCERT-like outlines (concise). Each subject list aims to match NCERT count (often 12–15+).
export const NCERT_CHAPTERS: NcertMap = {
  "1": {
    English: ["Alphabet and Words", "My Family", "Colors Around", "Animals and Birds", "Numbers in Words", "Good Habits", "At School", "At the Park", "Seasons", "Food We Eat", "Our Body", "Festival Fun"],
    Hindi: ["अक्षर ज्ञान", "मेरा परिवार", "रंग-बिरंगी दुनिया", "जानवर दोस्त", "संख्या और शब्द", "अच्छी आदतें", "हमारा विद्यालय", "खेल-कूद", "ऋतु", "खान-पान", "हमारा शरीर", "त्योहार"],
    Sanskrit: ["वर्णमाला", "मम कुलम्", "वर्णाः", "पश्य प्राणी", "संख्याः", "सत्क्रियाः", "विद्यालयः", "उद्याने", "ऋतवः", "आहारः", "शरीरम्", "उत्सवाः"],
    Urdu: ["حروفِ تہجی", "میرا خاندان", "رنگ", "جانور", "اعداد", "اچھی عادتیں", "ہمارا اسکول", "پارک", "موسم", "کھانے", "ہمارا جسم", "تہوار"],
    Science: ["Living and Non-Living", "Plants Around Us", "Animals Around Us", "Our Food", "Water", "Air", "Weather", "Our Body", "Safety Rules", "Good Habits", "Our Home", "Our Earth"],
    "Social Studies (SST)": ["Me and My Family", "My School", "My Neighborhood", "People Who Help Us", "Transport", "Communication", "Our Festivals", "Our Earth", "Weather and Seasons", "India My Country", "Our National Symbols", "Good Manners"],
    Mathematics: ["Shapes and Space", "Numbers from One to Nine", "Addition", "Subtraction", "Numbers from Ten to Twenty", "Time", "Measurement", "Numbers from Twenty-one to Fifty", "Data Handling", "Patterns", "Numbers", "Money", "How Many"]
  },
  "2": {
    English: ["Fun with Words", "People at Work", "Our Pets", "On the Road", "Weather", "At the Market", "In the Garden", "At the Beach", "Time", "Healthy Habits", "Safety First", "Celebrations"],
    Hindi: ["शब्दों से खेल", "काम करने वाले लोग", "हमारे पालतू", "सड़क पर", "मौसम", "बाजार", "बगीचे में", "समुद्र तट", "समय", "स्वच्छता", "सुरक्षा", "उत्सव"],
    Sanskrit: ["शब्दक्रीडा", "सेवकाः", "पालितपशवः", "मार्गे", "वातावरणम्", "हाटः", "उद्यानम्", "सागरतीरम्", "समयः", "स्वास्थ्यं", "सुरक्षा", "उत्सवाः"],
    Urdu: ["الفاظ کا کھیل", "کام کرنے والے", "پالتو جانور", "سڑک پر", "موسم", "بازار", "باغ", "ساحل", "وقت", "صحت مند عادات", "حفاظت", "تقریبات"],
    Science: ["Plants and Their Uses", "Animals and Their Homes", "Food and Health", "Houses We Live In", "Clothes We Wear", "Air and Water", "Weather and Seasons", "Transport", "Communication", "Safety and First Aid", "Our Universe", "The Earth"],
    "Social Studies (SST)": ["Family Types", "Good Habits", "People Around Us", "Neighborhood Services", "Travel and Transport", "Means of Communication", "Our Festivals", "Our Country India", "Directions and Maps", "Early Humans", "Work We Do", "Saving Resources"],
    Mathematics: ["What is Long, What is Round?", "Counting in Groups", "How Much Can You Carry?", "Counting in Tens", "Patterns", "Footprints", "Jugs and Mugs", "Tens and Ones", "My Funday", "Add Our Points", "Lines and Lines", "Give and Take", "The Longest Step", "Birds Come, Birds Go", "How Many Ponytails?"]
  },
  "3": {
    English: ["Good Morning", "The Magic Garden", "Bird Talk", "Nina and the Baby Sparrows", "Little by Little", "Sea Song", "The Balloon Man", "Trains", "Puppy and I", "The Ship of the Desert", "India", "Games We Play"],
    Hindi: ["कबूतर और मधुमक्खी", "कौन", "मित्र", "नन्हीं चिड़िया", "सच्ची कहानी", "समय", "खेल", "हमारे त्योहार", "मेरे खिलौने", "इंद्रधनुष", "हमारा देश", "हम बच्चे"],
    Sanskrit: ["सुप्रभातम्", "उद्यानकथा", "पक्षिणां संवादः", "निनायाः कथा", "क्रमेण", "समुद्रगीतम्", "फेनिलफलः", "यानानि", "श्वानकथा", "मरुभूमिः", "भारत", "क्रीडाः"],
    Urdu: ["صبح بخیر", "جادو باغ", "پرندوں کی بات", "نینا اور چڑیا", "آہستہ آہستہ", "سمندر کا گیت", "غبارہ بیچنے والا", "ریل گاڑی", "میں اور کتا", "صحرائی جہاز", "ہندوستان", "کھیلیں"],
    Science: ["Living and Non-Living Things", "Parts of a Plant", "Birds and Their Beaks", "Animals and Their Food", "Housing and Clothing", "Safety and First Aid", "Air, Water and Weather", "Earth and Its Neighbors", "Our Environment", "Soil", "Work of a Computer", "Light and Shadow"],
    "Social Studies (SST)": ["Our Community", "Local Government", "Directions and Maps", "Transport and Communication", "Early Humans", "Our Country India", "States and Capitals", "Culture and Festivals", "Our Heroes", "The Earth and Continents", "Natural Resources", "Save Water"],
    Mathematics: ["Where to Look From", "Fun with Numbers", "Give and Take", "Long and Short", "Shapes and Designs", "Fun with Give and Take", "Time Goes On", "Who is Heavier?", "How Many Times?", "Play with Patterns", "Jugs and Mugs", "Can We Share?", "Smart Charts!", "Rupees and Paise"]
  },
  "4": {
    English: ["Wake Up!", "Neha’s Alarm", "Noses", "Run!", "Why?", "Don’t be Afraid", "Alice in Wonderland", "Hellen Keller", "The Donkey", "The Milkman’s Cow", "Pinocchio", "Unity"],
    Hindi: ["जागो", "नीहा की घड़ी", "नाक", "दौड़", "क्यों?", "डरो मत", "एलिस", "हेलेन केलर", "गधा", "दूधवाला", "पिनोचियो", "एकता"],
    Sanskrit: ["उत्तिष्ठ", "नेहायाः घण्टा", "नासा", "धाव", "कुतः?", "मा भैः", "आलिसकथा", "हेलेनकेलर", "गर्दभः", "दुग्धविक्रेता", "पिनोच्चियो", "एकता"],
    Urdu: ["جاگو", "نیہا کی گھڑی", "ناک", "دوڑ", "کیوں؟", "ڈرو مت", "ایلس", "ہیلیں کیلار", "گدھا", "دودھ والا", "پینوکیو", "یکجہتی"],
    Science: ["Plant Life", "Animal Life", "Adaptations", "Food and Digestion", "Teeth and Microbes", "Safety First", "Air and Water", "Earth, Sun, Moon", "Force, Work and Energy", "Matter and Materials", "Light and Sound", "Our Environment"],
    "Social Studies (SST)": ["Family and Relationships", "Society and Community", "Local Government", "States and Capitals", "Physical Features of India", "Climate and Weather", "Agriculture", "Industries", "Transport", "Communication", "Natural Resources", "Our Heritage"],
    Mathematics: ["Building with Bricks", "Long and Short", "A Trip to Bhopal", "Tick-Tick-Tick", "The Way the World Looks", "The Junk Seller", "Jugs and Mugs", "Carts and Wheels", "Halves and Quarters", "Play with Patterns", "Tables and Shares", "How Heavy? How Light?", "Fields and Fences", "Smarts Charts"]
  },
  "5": {
    English: ["Ice‑Cream Man", "Teamwork", "Flying Together", "My Shadow", "Robinson Crusoe", "Cry‑Baby", "Around the World", "Malala", "Wonderful Waste", "Seeds and Plants", "Art of Paper", "Sunita"],
    Hindi: ["आइसक्रीम वाला", "टीमवर्क", "साथ-साथ", "मेरी छाया", "रॉबिन्सन क्रूसो", "रोना", "दुनिया का चक्कर", "मलाला", "कमाल का कचरा", "बीज", "कागज़ कला", "सुनीता"],
    Sanskrit: ["हिमशीतलः", "समूहकार्य", "एकत्र", "मम छाया", "रॉबिन्सनकथा", "रोदनम्", "विश्वभ्रमणम्", "मलाला", "आश्चर्यजनकः", "बीजानि", "पत्रकला", "सुनीता"],
    Urdu: ["آئس کریم والا", "ٹیم ورک", "اکٹھے", "میری پرچھائیں", "روبنسن کروسو", "رونا", "دنیا کا چکر", "ملالہ", "زبردست کچرا", "بیج", "پیپر آرٹ", "سونیتا"],
    Science: ["Growing Plants", "Animals and Their Surroundings", "Food and Health", "Safety and First Aid", "Housing and Clothing", "Air and Water", "Rocks and Minerals", "Soil Erosion", "Light and Shadow", "Force and Energy", "Simple Machines", "The Moon and Stars"],
    "Social Studies (SST)": ["Globe and Maps", "Latitudes and Longitudes", "India – Location and Extent", "Physical Divisions", "Climate", "Natural Vegetation", "Minerals and Industries", "Transport", "Communication", "Government", "Civic Rights", "UN and Cooperation"],
    Mathematics: ["The Fish Tale", "Shapes and Angles", "How Many Squares?", "Parts and Wholes", "Does It Look the Same?", "Be My Multiple, I'll be Your Factor", "Can You See the Pattern?", "Mapping Your Way", "Boxes and Sketches", "Tenths and Hundredths", "Area and Its Boundary", "Smart Charts", "Ways to Multiply and Divide", "How Big? How Heavy?"]
  },
  "6": {
    Science: ["Food: Where Does It Come From?", "Components of Food", "Fibre to Fabric", "Sorting Materials", "Separation of Substances", "Changes Around Us", "Getting to Know Plants", "Body Movements", "Living Organisms and Their Surroundings", "Motion and Measurement", "Light, Shadows and Reflections", "Electricity and Circuits"],
    English: ["Who Did Patrick’s Homework?", "How the Dog Found Himself", "Taro’s Reward", "An Indian-American Woman in Space", "Beauty", "Where Do All the Teachers Go?", "A Different Kind of School", "The Quarrel", "An Apple Tree", "The Kite", "A Pact with the Sun", "Desert Animals"],
    "Social Studies (SST)": ["What, Where, How and When?", "On the Trail of the Earliest People", "From Gathering to Growing Food", "In the Earliest Cities", "What Books and Burials Tell Us", "Kingdoms, Kings and an Early Republic", "New Questions and Ideas", "Ashoka, The Emperor Who Gave Up War", "Vital Villages, Thriving Towns", "Traders, Kings and Pilgrims", "New Empires and Kingdoms", "Buildings, Paintings and Books"],
    Hindi: ["वह चिड़िया जो", "जैकल", "निन्का प्यो", "बस की सैर", "मछली जल की रानी", "टीस", "ईदगाह", "झाँसी की रानी", "भारत माता", "विज्ञान के चमत्कार", "हमारे त्योहार", "खेल-कूद"],
    Sanskrit: ["सुभाषितानि", "मित्रं शरणम्", "क्रीडास्पर्धा", "गुरु सम्मान", "विद्यालयः", "वसन्तऋतुः", "स्वास्थ्यं महत्तरं धनम्", "वृक्षाः", "मातृभूमिः", "नदी", "पर्वतः", "विश्वविद्यालयः"],
    Urdu: Array.from({length:12},(_,i)=>`سبق ${i+1}`),
    Mathematics: ["Knowing Our Numbers", "Whole Numbers", "Playing with Numbers", "Basic Geometrical Ideas", "Understanding Elementary Shapes", "Integers", "Fractions", "Decimals", "Data Handling", "Mensuration", "Algebra", "Ratio and Proportion", "Symmetry", "Practical Geometry"]
  },
  "7": {
    Science: ["Nutrition in Plants", "Nutrition in Animals", "Heat", "Acids, Bases and Salts", "Physical and Chemical Changes", "Weather, Climate", "Winds, Storms and Cyclones", "Soil", "Respiration in Organisms", "Transportation in Animals and Plants", "Reproduction in Plants", "Motion and Time"],
    English: ["Three Questions", "A Gift of Chappals", "Gopal and the Hilsa Fish", "The Ashes that Made Trees Bloom", "Quality", "Expert Detectives", "The Invention of Vita‑Wonk", "Fire: Friend and Foe", "A Bicycle in Good Repair", "The Story of Cricket", "Poems", "Supplementary"],
    "Social Studies (SST)": ["Tracing Changes Through a Thousand Years", "New Kings and Kingdoms", "Delhi: 12th to 15th Century", "The Mughal Empire", "Rulers and Buildings", "Towns, Traders and Craftspersons", "Tribes, Nomads and Settled Communities", "Devotional Paths", "The Making of Regional Cultures", "Eighteenth‑Century Political Formations", "Environment", "Economics"],
    Hindi: ["हम भारतवासी", "गलता लोहा", "नीलकंठ", "कठिनाई का सामना", "रहीम के दोहे", "आसमान", "नाटक अंश", "कविता", "विज्ञान", "प्रयास", "यात्रा", "पर्यावरण"],
    Sanskrit: ["पठामः", "संवादः", "कविता", "नीतिः", "विद्याः", "पर्यावरणम्", "विज्ञानम्", "भारतवृत्तान्तः", "नाटकभागः", "इतिहासः", "समाजः", "आर्थिकी"],
    Urdu: Array.from({length:12},(_,i)=>`سبق ${i+1}`),
    Mathematics: ["Integers", "Fractions and Decimals", "Data Handling", "Simple Equations", "Lines and Angles", "The Triangle and Its Properties", "Congruence of Triangles", "Comparing Quantities", "Rational Numbers", "Practical Geometry", "Perimeter and Area", "Algebraic Expressions", "Exponents and Powers", "Symmetry", "Visualising Solid Shapes"]
  },
  "8": {
    Science: ["Crop Production", "Microorganisms", "Synthetic Fibres and Plastics", "Materials: Metals and Non‑Metals", "Coal and Petroleum", "Combustion and Flame", "Conservation of Plants and Animals", "Cell – Structure and Functions", "Reproduction in Animals", "Reaching the Age of Adolescence", "Force and Pressure", "Friction"],
    English: ["The Best Christmas Present", "The Tsunami", "Glimpses of the Past", "Bepin Choudhury’s Lapse of Memory", "The Summit Within", "This is Jody’s Fawn", "A Short Monsoon Diary", "The Great Stone Face", "Poems", "Supplementary", "Diary", "Speeches"],
    "Social Studies (SST)": ["Resources", "Land, Soil, Water, Natural Vegetation", "Mineral and Power Resources", "Agriculture", "Industries", "Human Resources", "Constitution and Secularism", "Parliament and Law", "Judiciary", "Social Justice", "Economic Activities", "Public Facilities"],
    Hindi: Array.from({length:12},(_,i)=>`अध्याय ${i+1}`),
    Sanskrit: Array.from({length:12},(_,i)=>`अध्यायः ${i+1}`),
    Urdu: Array.from({length:12},(_,i)=>`سبق ${i+1}`),
    Mathematics: ["Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Practical Geometry", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots", "Comparing Quantities", "Algebraic Expressions and Identities", "Visualising Solid Shapes", "Mensuration", "Exponents and Powers", "Direct and Inverse Proportions"]
  },
  "9": {
    Science: ["Matter in Our Surroundings", "Is Matter Around Us Pure?", "Atoms and Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound", "Improvement in Food Resources"],
    English: ["The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind", "The Snake and the Mirror", "My Childhood", "Packing", "Reach for the Top", "The Bond of Love", "Kathmandu", "If I Were You", "Poems"],
    "Social Studies (SST)": ["The French Revolution", "Socialism in Europe", "Nazism and the Rise of Hitler", "Forest Society", "Pastoralists", "India – Size and Location", "Physical Features of India", "Drainage", "Climate", "Natural Vegetation and Wildlife", "Population", "Democracy in the Contemporary World"],
    Hindi: Array.from({length:12},(_,i)=>`अध्याय ${i+1}`),
    Sanskrit: Array.from({length:12},(_,i)=>`अध्यायः ${i+1}`),
    Urdu: Array.from({length:12},(_,i)=>`سبق ${i+1}`),
    Mathematics: ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid’s Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Areas of Parallelograms and Triangles", "Circles", "Constructions", "Heron’s Formula", "Surface Areas and Volumes", "Statistics", "Probability"]
  },
  "10": {
    Science: ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Periodic Classification", "Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity and Evolution", "Light – Reflection and Refraction", "The Human Eye and the Colourful World", "Electricity"],
    English: ["A Letter to God", "Nelson Mandela", "Two Stories about Flying", "From the Diary of Anne Frank", "Glimpses of India", "Mijbil the Otter", "Madam Rides the Bus", "The Sermon at Benares", "The Proposal", "Dust of Snow", "The Ball Poem", "Animals"],
    "Social Studies (SST)": ["The Rise of Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "The Age of Industrialisation", "Print Culture and the Modern World", "Resources and Development", "Forest and Wildlife Resources", "Water Resources", "Agriculture", "Minerals and Energy Resources", "Manufacturing Industries", "Life Lines of National Economy"],
    Hindi: ["साखियाँ", "सूरदास के पद", "लोकोक्ति", "बड़े भाई साहब", "डायरी के पन्ने", "मनुष्यता", "गिल्लू", "लखनवी अंडा", "साखी", "अंतिम दिन", "उपन्यास अंश", "यात्री"],
    Sanskrit: ["शुचिता", "सुभाषितानि", "सुगन्धः", "अहं छात्रः", "भारतमाता", "संस्कृतसाहित्ये", "नदी", "वनम्", "कविता", "शिक्षा", "आरोग्यम्", "विद्याधनम्"],
    Urdu: Array.from({length:12},(_,i)=>`سبق ${i+1}`),
    Mathematics: ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Applications of Trigonometry", "Circles", "Constructions", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"]
  },
  "11": {
    Science: ["Physical World", "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion", "Work, Energy and Power", "System of Particles and Rigid Body", "Gravitation", "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties of Matter", "Thermodynamics"],
    English: ["The Portrait of a Lady", "We’re Not Afraid", "Discovering Tut", "The Ailing Planet", "The Browning Version", "Mother’s Day", "Birth", "Poems", "Debates", "Reading Skills", "Writing Skills", "Listening Skills"],
    "Social Studies (SST)": ["Indian Constitution at Work", "Political Theory", "Indian Economic Development", "Statistics for Economics", "Geography – Fundamentals", "India – Physical Environment", "Culture", "Society", "Social Change", "Globalisation", "Environment", "Field Work"],
    Hindi: Array.from({length:12},(_,i)=>`अध्याय ${i+1}`),
    Sanskrit: Array.from({length:12},(_,i)=>`अध्यायः ${i+1}`),
    Urdu: Array.from({length:12},(_,i)=>`سبق ${i+1}`),
    Mathematics: ["Sets", "Relations and Functions", "Trigonometric Functions", "Principle of Mathematical Induction", "Complex Numbers and Quadratic Equations", "Linear Inequalities", "Permutations and Combinations", "Binomial Theorem", "Sequences and Series", "Straight Lines", "Conic Sections", "Introduction to Three-dimensional Geometry", "Limits and Derivatives", "Statistics", "Probability"]
  },
  "12": {
    Science: ["Reproduction in Organisms", "Genetics and Evolution", "Biology in Human Welfare", "Biotechnology", "Ecology and Environment", "Human Health and Disease", "Evolution", "Microbes in Human Welfare", "Reproductive Health", "Molecular Basis of Inheritance", "Principles of Inheritance", "Ecosystem"],
    English: ["The Last Lesson", "Lost Spring", "Deep Water", "The Rattrap", "Indigo", "Poets and Pancakes", "The Interview", "Going Places", "My Mother at Sixty-Six", "A Thing of Beauty", "Aunt Jennifer’s Tigers", "An Elementary School Classroom"],
    "Social Studies (SST)": ["Politics in India Since Independence", "Globalisation", "Human Geography", "Contemporary World Politics", "Indian Society", "Social Change and Development", "Macroeconomics", "Microeconomics", "Indian Economic Development", "Population", "Urbanisation", "Environment and Sustainable Development"],
    Hindi: ["आत्मकथा", "यात्रा-वृत्तांत", "काव्य खंड", "गद्य खंड", "निबंध", "लेख", "समालोचना", "रचना-कौशल", "काव्यांग", "विज्ञान लेखन", "वृत्तांत", "रिपोर्ट"],
    Sanskrit: ["पद्यभागः", "गद्यभागः", "नाटकभागः", "व्याकरणम्", "अलंकाराः", "समासाः", "विप्रतिषेधः", "शब्दरूपाणि", "धातुरूपाणि", "निबन्धः", "काव्यविशेषाः", "नाट्यशास्त्रम्"],
    Urdu: Array.from({length:12},(_,i)=>`سبق ${i+1}`),
    Mathematics: ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Applications of Derivatives", "Integrals", "Applications of Integrals", "Differential Equations", "Vector Algebra", "Three-dimensional Geometry", "Linear Programming", "Probability"]
  }
};
