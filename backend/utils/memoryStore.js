// In-Memory Database Fallback Store for ReWear Connect Backend

const initialDonors = [
  {
    _id: "usr_donor_100",
    name: "Navadeep",
    email: "navadeepasw@gmail.com",
    password: "password123",
    phone: "+91 98765 00000",
    role: "donor",
    isVerified: true,
    location: { address: "Pudukkottai Main Street", city: "Pudukkottai", state: "Tamil Nadu", pincode: "622001", coordinates: { latitude: 10.3833, longitude: 78.8167 } }
  },
  {
    _id: "usr_donor_101",
    name: "Karthik Subramanian",
    email: "karthik@example.com",
    password: "password123",
    phone: "+91 98765 11111",
    role: "donor",
    isVerified: true,
    location: { address: "42 Greenfield Ave, Indiranagar", city: "Pudukkottai", state: "Tamil Nadu", pincode: "622001", coordinates: { latitude: 10.3833, longitude: 78.8167 } }
  },
  {
    _id: "usr_donor_102",
    name: "Ananya Rao",
    email: "ananya@example.com",
    password: "password123",
    phone: "+91 98765 22222",
    role: "donor",
    isVerified: true,
    location: { address: "18 Sunset Blvd, Koramangala", city: "Bengaluru", state: "Karnataka", pincode: "560034", coordinates: { latitude: 12.9352, longitude: 77.6245 } }
  }
];



const initialOrgs = [
  {
    _id: "org_201",
    user: "usr_org_201",
    organizationName: "Hope Shelter Foundation",
    organizationType: "Shelter",
    description: "Emergency winter shelter and garment distribution center.",
    contactPerson: "Dr. Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh@hopeshelter.org",
    location: { address: "12 MG Road District", city: "Bengaluru", state: "Karnataka", pincode: "560001", coordinates: { latitude: 12.9750, longitude: 77.6010 } },
    verificationStatus: "Verified"
  },
  {
    _id: "org_202",
    user: "usr_org_202",
    organizationName: "Sunshine Children's Home",
    organizationType: "NGO",
    description: "Care center supporting 60+ underprivileged children.",
    contactPerson: "Sister Maria Joseph",
    phone: "+91 98450 12345",
    email: "maria@sunshinekids.org",
    location: { address: "4th Block Koramangala", city: "Bengaluru", state: "Karnataka", pincode: "560034", coordinates: { latitude: 12.9360, longitude: 77.6250 } },
    verificationStatus: "Verified"
  }
];

const initialDonations = [
  {
    _id: "don_101",
    donor: "usr_donor_101",
    clothingName: "Blue Casual Shirt",
    clothingType: "Shirt",
    genderSuitability: "Male",
    ageGroup: "Adult",
    size: "M",
    condition: "Excellent",
    quantity: 2,
    description: "100% cotton casual blue shirt, freshly washed and ironed.",
    images: ["/assets/blue_casual_shirt.jpg"],
    pickupLocation: { address: "14 Main Road, Anna Nagar", city: "Pudukkottai", state: "Tamil Nadu", pincode: "622001", coordinates: { latitude: 10.3833, longitude: 78.8167 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_102",
    donor: "usr_donor_102",
    clothingName: "Black Cotton T-Shirt",
    clothingType: "T-Shirt",
    genderSuitability: "Male",
    ageGroup: "Adult",
    size: "L",
    condition: "Good",
    quantity: 3,
    description: "Comfortable black crew neck tee in great condition.",
    images: ["/assets/black_tshirt.jpg"],
    pickupLocation: { address: "45 Bus Stand Street", city: "Pudukkottai", state: "Tamil Nadu", pincode: "622001", coordinates: { latitude: 10.3850, longitude: 78.8180 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_103",
    donor: "usr_donor_101",
    clothingName: "Blue Denim Jeans",
    clothingType: "Pants",
    genderSuitability: "Male",
    ageGroup: "Adult",
    size: "32",
    condition: "Excellent",
    quantity: 1,
    description: "Durable blue denim jeans with sturdy stitching.",
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "88 College Road", city: "Pudukkottai", state: "Tamil Nadu", pincode: "622003", coordinates: { latitude: 10.3800, longitude: 78.8200 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_104",
    donor: "usr_donor_102",
    clothingName: "Grey Sports Track Pants",
    clothingType: "Track Pants",
    genderSuitability: "Unisex",
    ageGroup: "Adult",
    size: "M",
    condition: "Good",
    quantity: 2,
    description: "Flexible cotton fleece track pants with elastic waistband.",
    images: ["/assets/grey_track_pants.jpg"],
    pickupLocation: { address: "12 Gandhi Nagar", city: "Pudukkottai", state: "Tamil Nadu", pincode: "622001", coordinates: { latitude: 10.3820, longitude: 78.8150 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_105",
    donor: "usr_donor_101",
    clothingName: "Boys Casual T-Shirt",
    clothingType: "T-Shirt",
    genderSuitability: "Male",
    ageGroup: "Child",
    size: "10-12 Years",
    condition: "Excellent",
    quantity: 2,
    description: "Soft organic cotton graphic tee for boys.",
    images: ["https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "29 Housing Board Colony", city: "Pudukkottai", state: "Tamil Nadu", pincode: "622002", coordinates: { latitude: 10.3870, longitude: 78.8130 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_106",
    donor: "usr_donor_102",
    clothingName: "Girls Pink Top",
    clothingType: "Top",
    genderSuitability: "Female",
    ageGroup: "Child",
    size: "8-10 Years",
    condition: "Excellent",
    quantity: 1,
    description: "Bright pink cotton summer top, clean and neatly folded.",
    images: ["/assets/pink_top.jpg"],
    pickupLocation: { address: "7 East Car Street", city: "Pudukkottai", state: "Tamil Nadu", pincode: "622001", coordinates: { latitude: 10.3840, longitude: 78.8190 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_107",
    donor: "usr_donor_101",
    clothingName: "Girls Comfortable Night Track",
    clothingType: "Track Pants",
    genderSuitability: "Female",
    ageGroup: "Teen",
    size: "M",
    condition: "Good",
    quantity: 2,
    description: "Soft cotton nightwear track pants for teen girls.",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "19 West Street", city: "Pudukkottai", state: "Tamil Nadu", pincode: "622001", coordinates: { latitude: 10.3860, longitude: 78.8170 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_108",
    donor: "usr_donor_102",
    clothingName: "Boys Blue Track Pants",
    clothingType: "Track Pants",
    genderSuitability: "Male",
    ageGroup: "Teen",
    size: "L",
    condition: "Excellent",
    quantity: 1,
    description: "Durable sports track pants for active teen boys.",
    images: ["/assets/blue_track_pants.jpg"],
    pickupLocation: { address: "53 New Street", city: "Pudukkottai", state: "Tamil Nadu", pincode: "622001", coordinates: { latitude: 10.3810, longitude: 78.8140 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_109",
    donor: "usr_donor_101",
    clothingName: "Men's White Formal Button-Down Shirt",
    clothingType: "Shirt",
    genderSuitability: "Male",
    ageGroup: "Adult",
    size: "L",
    condition: "Excellent",
    quantity: 3,
    description: "Crisp formal white cotton button-down shirt for interviews.",
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "42 Greenfield Ave, Indiranagar", city: "Bengaluru", state: "Karnataka", pincode: "560038", coordinates: { latitude: 12.9716, longitude: 77.5946 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_110",
    donor: "usr_donor_102",
    clothingName: "Men's Navy Blue Polo T-Shirt",
    clothingType: "T-Shirt",
    genderSuitability: "Male",
    ageGroup: "Adult",
    size: "M",
    condition: "Excellent",
    quantity: 2,
    description: "Classic collared polo t-shirt in deep navy blue.",
    images: ["https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "18 Sunset Blvd, Koramangala", city: "Bengaluru", state: "Karnataka", pincode: "560034", coordinates: { latitude: 12.9352, longitude: 77.6245 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_111",
    donor: "usr_donor_101",
    clothingName: "Men's Beige Cotton Chino Pants",
    clothingType: "Pants",
    genderSuitability: "Male",
    ageGroup: "Adult",
    size: "34",
    condition: "Excellent",
    quantity: 2,
    description: "Smart casual cotton chinos, neatly pressed.",
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "102 Lakeshore Dr, HSR Layout", city: "Bengaluru", state: "Karnataka", pincode: "560102", coordinates: { latitude: 12.9121, longitude: 77.6446 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_112",
    donor: "usr_donor_102",
    clothingName: "Men's Black Fleece Sports Track Pants",
    clothingType: "Track Pants",
    genderSuitability: "Male",
    ageGroup: "Adult",
    size: "L",
    condition: "Excellent",
    quantity: 2,
    description: "Thick thermal athletic track pants for cold weather.",
    images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "33 100ft Road, Indiranagar", city: "Bengaluru", state: "Karnataka", pincode: "560038", coordinates: { latitude: 12.9780, longitude: 77.6400 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_113",
    donor: "usr_donor_101",
    clothingName: "Boys Collared Cotton Shirt",
    clothingType: "Shirt",
    genderSuitability: "Male",
    ageGroup: "Child",
    size: "10-12 Years",
    condition: "Excellent",
    quantity: 3,
    description: "Smart check cotton shirt for young boys.",
    images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "15 Residency Rd, Ashok Nagar", city: "Bengaluru", state: "Karnataka", pincode: "560025", coordinates: { latitude: 12.9680, longitude: 77.5990 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_114",
    donor: "usr_donor_102",
    clothingName: "Boys Blue Denim Jeans",
    clothingType: "Pants",
    genderSuitability: "Male",
    ageGroup: "Child",
    size: "8-10 Years",
    condition: "Good",
    quantity: 2,
    description: "Sturdy blue denim pants with adjustable elastic waist.",
    images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "45 3rd Block, Koramangala", city: "Bengaluru", state: "Karnataka", pincode: "560034", coordinates: { latitude: 12.9320, longitude: 77.6210 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_115",
    donor: "usr_donor_101",
    clothingName: "Girls Floral Summer Dress",
    clothingType: "Dress",
    genderSuitability: "Female",
    ageGroup: "Child",
    size: "6-8 Years",
    condition: "Excellent",
    quantity: 2,
    description: "Vibrant cotton summer dress with soft cotton lining.",
    images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "21 12th Main, Indiranagar", city: "Bengaluru", state: "Karnataka", pincode: "560038", coordinates: { latitude: 12.9720, longitude: 77.6420 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_116",
    donor: "usr_donor_102",
    clothingName: "Girls Cozy Nightwear Pajama Set",
    clothingType: "Nightwear",
    genderSuitability: "Female",
    ageGroup: "Child",
    size: "10-12 Years",
    condition: "Excellent",
    quantity: 2,
    description: "Soft knitted night suit with long sleeves and printed pants.",
    images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "88 Sector 2, HSR Layout", city: "Bengaluru", state: "Karnataka", pincode: "560102", coordinates: { latitude: 12.9100, longitude: 77.6400 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_117",
    donor: "usr_donor_101",
    clothingName: "Teen Girls' Blue Denim Jacket",
    clothingType: "Jacket",
    genderSuitability: "Female",
    ageGroup: "Teen",
    size: "S",
    condition: "Excellent",
    quantity: 1,
    description: "Stylish washed denim jacket for teenage girls.",
    images: ["/assets/denim_jacket.jpg"],
    pickupLocation: { address: "104 Outer Circle, Whitefield", city: "Bengaluru", state: "Karnataka", pincode: "560066", coordinates: { latitude: 12.9680, longitude: 77.7490 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_118",
    donor: "usr_donor_102",
    clothingName: "Men's Full Sleeve Cotton T-Shirt",
    clothingType: "T-Shirt",
    genderSuitability: "Male",
    ageGroup: "Adult",
    size: "XL",
    condition: "Good",
    quantity: 2,
    description: "Warm long sleeve jersey knit t-shirt in grey maroon.",
    images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "12 100ft Ring Road, Banashankari", city: "Bengaluru", state: "Karnataka", pincode: "560085", coordinates: { latitude: 12.9254, longitude: 77.5468 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_119",
    donor: "usr_donor_101",
    clothingName: "Women's Casual Cotton Trousers",
    clothingType: "Pants",
    genderSuitability: "Female",
    ageGroup: "Adult",
    size: "M",
    condition: "Good",
    quantity: 2,
    description: "Comfortable stretch cotton trousers in beige khaki.",
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "90 Lakeview Enclave, Hebbal", city: "Bengaluru", state: "Karnataka", pincode: "560024", coordinates: { latitude: 13.0358, longitude: 77.5970 } },
    status: "Available",
    createdAt: new Date().toISOString()
  },
  {
    _id: "don_120",
    donor: "usr_donor_102",
    clothingName: "Unisex Cotton Loungewear Night Tracks",
    clothingType: "Track Pants",
    genderSuitability: "Unisex",
    ageGroup: "Adult",
    size: "XL",
    condition: "Good",
    quantity: 3,
    description: "Breathable cotton lounge pants for night relaxation.",
    images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop"],
    pickupLocation: { address: "29 Outer Ring Road, Bellandur", city: "Bengaluru", state: "Karnataka", pincode: "560103", coordinates: { latitude: 12.9279, longitude: 77.6770 } },
    status: "Available",
    createdAt: new Date().toISOString()
  }
];

const initialRequirements = [
  {
    _id: "req_301",
    organization: "org_201",
    clothingType: "Jacket",
    size: ["M", "L"],
    genderSuitability: "Male",
    ageGroup: "Adult",
    quantityRequired: 25,
    quantityFulfilled: 14,
    urgencyLevel: "Critical",
    description: "Night temperatures dropping sharply. Need insulated jackets for adult men.",
    status: "Active"
  },
  {
    _id: "req_302",
    organization: "org_202",
    clothingType: "Sweater",
    size: ["S"],
    genderSuitability: "Unisex",
    ageGroup: "Child",
    quantityRequired: 40,
    quantityFulfilled: 28,
    urgencyLevel: "High",
    description: "School sweaters and winter fleece coats for children.",
    status: "Active"
  }
];

const initialMatches = [];

class MemoryStore {
  constructor() {
    this.users = [...initialDonors];
    this.organizations = [...initialOrgs];
    this.donations = [...initialDonations];
    this.requirements = [...initialRequirements];
    this.matches = [...initialMatches];
    this.otps = [];
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
