const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Donation = require('../models/Donation');
const Organization = require('../models/Organization');
const Requirement = require('../models/Requirement');
const Match = require('../models/Match');
const { evaluateMatch } = require('../services/matchingService');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/circular_threads';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany();
    await Donation.deleteMany();
    await Organization.deleteMany();
    await Requirement.deleteMany();
    await Match.deleteMany();
    console.log('[Seed] Cleared existing data.');

    // 1. Create Admin User
    const adminUser = await User.create({
      name: 'ReWear Connect Admin',
      email: 'admin@rewearconnect.org',
      password: 'adminpassword123',
      phone: '+91 99999 00000',
      role: 'admin',
      isVerified: true
    });

    // 2. Create 5 Donors
    const donors = await User.create([
      {
        name: 'Navadeep Sharma',
        email: 'navadeep@example.com',
        password: 'password123',
        phone: '+91 98765 11111',
        role: 'donor',
        location: { address: '42 Greenfield Ave, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038', coordinates: { latitude: 12.9716, longitude: 77.5946 } }
      },
      {
        name: 'Ananya Rao',
        email: 'ananya@example.com',
        password: 'password123',
        phone: '+91 98765 22222',
        role: 'donor',
        location: { address: '18 Sunset Blvd, Koramangala', city: 'Bengaluru', state: 'Karnataka', pincode: '560034', coordinates: { latitude: 12.9352, longitude: 77.6245 } }
      },
      {
        name: 'Vikram Malhotra',
        email: 'vikram@example.com',
        password: 'password123',
        phone: '+91 98765 33333',
        role: 'donor',
        location: { address: '102 Lakeshore Dr, HSR Layout', city: 'Bengaluru', state: 'Karnataka', pincode: '560102', coordinates: { latitude: 12.9121, longitude: 77.6446 } }
      },
      {
        name: 'Priya Nair',
        email: 'priya@example.com',
        password: 'password123',
        phone: '+91 98765 44444',
        role: 'donor',
        location: { address: '88 Palm Meadows, Whitefield', city: 'Bengaluru', state: 'Karnataka', pincode: '560066', coordinates: { latitude: 12.9698, longitude: 77.7500 } }
      },
      {
        name: 'Rahul Sen',
        email: 'rahul@example.com',
        password: 'password123',
        phone: '+91 98765 55555',
        role: 'donor',
        location: { address: '15 Residency Rd, Ashok Nagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560025', coordinates: { latitude: 12.9680, longitude: 77.5990 } }
      }
    ]);

    // 3. Create 5 Organization Users & Profiles
    const orgUsers = await User.create([
      { name: 'Dr. Rajesh Kumar', email: 'rajesh@hopeshelter.org', password: 'password123', phone: '+91 98765 43210', role: 'organization', isVerified: true },
      { name: 'Sister Maria Joseph', email: 'maria@sunshinekids.org', password: 'password123', phone: '+91 98450 12345', role: 'organization', isVerified: true },
      { name: 'Amitabh Banerjee', email: 'amitabh@stjude.org', password: 'password123', phone: '+91 97112 88900', role: 'organization', isVerified: true },
      { name: 'Savitha Sharma', email: 'savitha@shantieldercare.org', password: 'password123', phone: '+91 94480 55432', role: 'organization', isVerified: true },
      { name: 'Green Threads Director', email: 'contact@greenthreads.org', password: 'password123', phone: '+91 91234 56789', role: 'organization', isVerified: false }
    ]);

    const orgs = await Organization.create([
      {
        user: orgUsers[0]._id,
        organizationName: 'Hope Shelter Foundation',
        organizationType: 'Shelter',
        description: 'Providing emergency shelter and warm apparel to unhoused individuals.',
        contactPerson: 'Dr. Rajesh Kumar',
        phone: '+91 98765 43210',
        email: 'rajesh@hopeshelter.org',
        location: { address: '12 MG Road District', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', coordinates: { latitude: 12.9750, longitude: 77.6010 } },
        verificationStatus: 'Verified'
      },
      {
        user: orgUsers[1]._id,
        organizationName: "Sunshine Children's Home",
        organizationType: 'NGO',
        description: 'Orphanage and education center supporting children aged 5-14.',
        contactPerson: 'Sister Maria Joseph',
        phone: '+91 98450 12345',
        email: 'maria@sunshinekids.org',
        location: { address: '4th Block Koramangala', city: 'Bengaluru', state: 'Karnataka', pincode: '560034', coordinates: { latitude: 12.9360, longitude: 77.6250 } },
        verificationStatus: 'Verified'
      },
      {
        user: orgUsers[2]._id,
        organizationName: 'St. Jude Community Outreach Center',
        organizationType: 'Community Center',
        description: 'Support center for low-income migrant workers and families.',
        contactPerson: 'Amitabh Banerjee',
        phone: '+91 97112 88900',
        email: 'amitabh@stjude.org',
        location: { address: 'Whitefield Main Rd', city: 'Bengaluru', state: 'Karnataka', pincode: '560066', coordinates: { latitude: 12.9690, longitude: 77.7480 } },
        verificationStatus: 'Verified'
      },
      {
        user: orgUsers[3]._id,
        organizationName: 'Shanti Elder Care Home',
        organizationType: 'Shelter',
        description: 'Residential home for elderly senior citizens.',
        contactPerson: 'Savitha Sharma',
        phone: '+91 94480 55432',
        email: 'savitha@shantieldercare.org',
        location: { address: '9th Block Jayanagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560069', coordinates: { latitude: 12.9240, longitude: 77.5910 } },
        verificationStatus: 'Verified'
      },
      {
        user: orgUsers[4]._id,
        organizationName: 'Green Threads Collective',
        organizationType: 'Charity',
        description: 'Upcycling and eco-fashion redistribution network.',
        contactPerson: 'Green Threads Director',
        phone: '+91 91234 56789',
        email: 'contact@greenthreads.org',
        location: { address: 'Electronic City Phase 1', city: 'Bengaluru', state: 'Karnataka', pincode: '560100', coordinates: { latitude: 12.8450, longitude: 77.6600 } },
        verificationStatus: 'Pending'
      }
    ]);

    // 4. Create 10 Clothing Donations
    const donations = await Donation.create([
      {
        donor: donors[0]._id,
        clothingName: 'Navy Blue Winter Jacket',
        clothingType: 'Jacket',
        genderSuitability: 'Male',
        ageGroup: 'Adult',
        size: 'M',
        condition: 'Excellent',
        quantity: 1,
        description: 'Clean insulated puffer jacket ready for winter night shelter delivery.',
        images: ['https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop'],
        pickupLocation: donors[0].location,
        status: 'Available'
      },
      {
        donor: donors[1]._id,
        clothingName: "Children's Warm Fleece Sweaters (Set of 3)",
        clothingType: 'Sweater',
        genderSuitability: 'Unisex',
        ageGroup: 'Child',
        size: 'S',
        condition: 'Excellent',
        quantity: 3,
        description: 'Soft wool fleece sweaters for primary school children.',
        images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop'],
        pickupLocation: donors[1].location,
        status: 'Available'
      },
      {
        donor: donors[2]._id,
        clothingName: "Men's Denim Jeans",
        clothingType: 'Jeans',
        genderSuitability: 'Male',
        ageGroup: 'Adult',
        size: 'L',
        condition: 'Good',
        quantity: 2,
        description: 'Durable blue denim jeans in good structural condition.',
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop'],
        pickupLocation: donors[2].location,
        status: 'Available'
      },
      {
        donor: donors[3]._id,
        clothingName: "Women's Cotton Summer Dresses",
        clothingType: 'Dress',
        genderSuitability: 'Female',
        ageGroup: 'Adult',
        size: 'M',
        condition: 'Excellent',
        quantity: 4,
        description: 'Lightweight organic cotton dresses with floral patterns.',
        images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop'],
        pickupLocation: donors[3].location,
        status: 'Delivered'
      },
      {
        donor: donors[4]._id,
        clothingName: 'Teen Graphic T-Shirts Bundle',
        clothingType: 'T-Shirt',
        genderSuitability: 'Unisex',
        ageGroup: 'Teen',
        size: 'S',
        condition: 'Good',
        quantity: 5,
        description: 'Pure cotton graphic tees suitable for teenagers.',
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'],
        pickupLocation: donors[4].location,
        status: 'Matched'
      },
      {
        donor: donors[0]._id,
        clothingName: 'Woolen Shawls & Scarves for Seniors',
        clothingType: 'Other',
        genderSuitability: 'Unisex',
        ageGroup: 'Senior',
        size: 'XL',
        condition: 'Excellent',
        quantity: 3,
        description: 'Warm cozy woolen shawls for senior citizen care.',
        images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop'],
        pickupLocation: donors[0].location,
        status: 'Available'
      },
      {
        donor: donors[1]._id,
        clothingName: "Men's Casual Button Down Shirts",
        clothingType: 'Shirt',
        genderSuitability: 'Male',
        ageGroup: 'Adult',
        size: 'L',
        condition: 'Good',
        quantity: 3,
        description: 'Formal and casual shirts in great condition.',
        images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop'],
        pickupLocation: donors[1].location,
        status: 'Available'
      },
      {
        donor: donors[2]._id,
        clothingName: "Children's Winter Shoes & Sneakers",
        clothingType: 'Shoes',
        genderSuitability: 'Unisex',
        ageGroup: 'Child',
        size: 'S',
        condition: 'Good',
        quantity: 2,
        description: 'Sturdy rubber sole sneakers for kids.',
        images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b762?q=80&w=800&auto=format&fit=crop'],
        pickupLocation: donors[2].location,
        status: 'Available'
      },
      {
        donor: donors[3]._id,
        clothingName: 'Heavy Fleece Hooded Sweatshirt',
        clothingType: 'Sweater',
        genderSuitability: 'Male',
        ageGroup: 'Adult',
        size: 'XL',
        condition: 'Excellent',
        quantity: 1,
        description: 'Thick gray fleece pullover hoodie.',
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop'],
        pickupLocation: donors[3].location,
        status: 'Available'
      },
      {
        donor: donors[4]._id,
        clothingName: "Women's Denim Pants & Trousers",
        clothingType: 'Pants',
        genderSuitability: 'Female',
        ageGroup: 'Adult',
        size: 'M',
        condition: 'Fair',
        quantity: 2,
        description: 'Usable cotton trousers with minor wear.',
        images: ['https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=800&auto=format&fit=crop'],
        pickupLocation: donors[4].location,
        status: 'Available'
      }
    ]);

    // 5. Create 10 Clothing Requirements
    const reqs = await Requirement.create([
      {
        organization: orgs[0]._id,
        clothingType: 'Jacket',
        size: ['M', 'L'],
        genderSuitability: 'Male',
        ageGroup: 'Adult',
        quantityRequired: 25,
        quantityFulfilled: 14,
        urgencyLevel: 'Critical',
        description: 'Night temperatures dropping sharply. Need insulated jackets for adult men.'
      },
      {
        organization: orgs[1]._id,
        clothingType: 'Sweater',
        size: ['S'],
        genderSuitability: 'Unisex',
        ageGroup: 'Child',
        quantityRequired: 40,
        quantityFulfilled: 28,
        urgencyLevel: 'High',
        description: 'School sweaters and winter fleece coats for children.'
      },
      {
        organization: orgs[2]._id,
        clothingType: 'Jeans',
        size: ['M', 'L'],
        genderSuitability: 'Male',
        ageGroup: 'Adult',
        quantityRequired: 30,
        quantityFulfilled: 10,
        urgencyLevel: 'Medium',
        description: 'Durable jeans and work trousers for day laborers.'
      },
      {
        organization: orgs[3]._id,
        clothingType: 'Other',
        size: ['XL', 'XXL'],
        genderSuitability: 'Unisex',
        ageGroup: 'Senior',
        quantityRequired: 20,
        quantityFulfilled: 8,
        urgencyLevel: 'High',
        description: 'Cozy woolen shawls and blankets for senior citizens.'
      },
      {
        organization: orgs[0]._id,
        clothingType: 'Shirt',
        size: ['L', 'XL'],
        genderSuitability: 'Male',
        ageGroup: 'Adult',
        quantityRequired: 35,
        quantityFulfilled: 15,
        urgencyLevel: 'Medium',
        description: 'Clean collared shirts for interview preparation.'
      },
      {
        organization: orgs[1]._id,
        clothingType: 'Shoes',
        size: ['S', 'M'],
        genderSuitability: 'Unisex',
        ageGroup: 'Child',
        quantityRequired: 25,
        quantityFulfilled: 5,
        urgencyLevel: 'Critical',
        description: 'Footwear needed for primary school children.'
      },
      {
        organization: orgs[2]._id,
        clothingType: 'Dress',
        size: ['S', 'M', 'L'],
        genderSuitability: 'Female',
        ageGroup: 'Adult',
        quantityRequired: 25,
        quantityFulfilled: 20,
        urgencyLevel: 'Low',
        description: 'Casual dresses for women attending community center workshops.'
      },
      {
        organization: orgs[3]._id,
        clothingType: 'Sweater',
        size: ['XL', 'XXL'],
        genderSuitability: 'Unisex',
        ageGroup: 'Senior',
        quantityRequired: 15,
        quantityFulfilled: 2,
        urgencyLevel: 'High',
        description: 'Soft front-button sweaters for senior residents.'
      },
      {
        organization: orgs[4]._id,
        clothingType: 'Pants',
        size: ['M', 'L'],
        genderSuitability: 'Female',
        ageGroup: 'Adult',
        quantityRequired: 20,
        quantityFulfilled: 0,
        urgencyLevel: 'Medium',
        description: 'Trousers for textile repair & redistribution.'
      },
      {
        organization: orgs[0]._id,
        clothingType: 'T-Shirt',
        size: ['S', 'M', 'L'],
        genderSuitability: 'Unisex',
        ageGroup: 'Teen',
        quantityRequired: 30,
        quantityFulfilled: 12,
        urgencyLevel: 'Low',
        description: 'Casual t-shirts for youth shelter residents.'
      }
    ]);

    // 6. Generate initial matches using Smart Matching Algorithm
    for (const donation of donations) {
      for (const reqItem of reqs) {
        const org = orgs.find(o => o._id.toString() === reqItem.organization.toString());
        if (!org) continue;

        const evalResult = evaluateMatch(donation, reqItem, org);

        if (evalResult.matchScore >= 60) {
          await Match.create({
            donation: donation._id,
            organization: org._id,
            requirement: reqItem._id,
            matchScore: evalResult.matchScore,
            reasoning: evalResult.reasoning,
            compatibilityScores: evalResult.compatibilityScores,
            distance: evalResult.distance,
            status: donation.status === 'Delivered' ? 'Delivered' : donation.status === 'Matched' ? 'Accepted' : 'Recommended'
          });
        }
      }
    }

    console.log('[Seed] Database seeded successfully with Donors, NGOs, Donations, Requirements, and Matches!');
    process.exit(0);
  } catch (error) {
    if (error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      console.log('---------------------------------------------------------------------------------');
      console.log('[Seed Info] Local MongoDB instance is not active on mongodb://127.0.0.1:27017.');
      console.log('[Seed Info] The backend server will automatically run using its built-in in-memory dataset!');
      console.log('---------------------------------------------------------------------------------');
      process.exit(0);
    }
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedData();

