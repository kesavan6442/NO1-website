// Temporary migration script to move data from MySQL to Firestore
// Run this with node migration.js

import mysql from 'mysql2/promise';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDq20OA9O8udzifd8hQUjh9h_PtqWnpgGM",
  authDomain: "number-one-4c024.firebaseapp.com",
  projectId: "number-one-4c024",
  storageBucket: "number-one-4c024.appspot.com",
  messagingSenderId: "813956898953",
  appId: "1:813956898953:web:9c7820c78864789886678"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ammapaiyan@07', 
    database: 'no1_events'
  });

  console.log('Connected to MySQL');

  // 1. Migrate Categories
  const [categories] = await connection.execute('SELECT * FROM categories');
  console.log(`Found ${categories.length} categories`);
  for (const cat of categories) {
    await setDoc(doc(db, "categories", String(cat.id)), {
      name: cat.name,
      cover_image: cat.cover_image
    });
    console.log(`Migrated Category: ${cat.name}`);
  }

  // 2. Migrate Services
  const [services] = await connection.execute('SELECT * FROM services');
  console.log(`Found ${services.length} services`);
  for (const s of services) {
    await setDoc(doc(db, "services", String(s.id)), {
      name: s.name,
      category: s.category,
      price: s.price,
      description: s.description,
      image: s.image
    });
    console.log(`Migrated Service: ${s.name}`);
  }

  // 3. Migrate Settings
  const [settings] = await connection.execute('SELECT * FROM settings LIMIT 1');
  if (settings.length > 0) {
    await setDoc(doc(db, "settings", "main"), settings[0]);
    console.log('Migrated Settings');
  }

  console.log('Migration complete!');
  process.exit();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
