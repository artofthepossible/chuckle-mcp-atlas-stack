import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const jokes = [
  { setup: 'What did the container say to the other container?', punchline: 'You are always so full of yourself!', times_displayed: 0 },
  { setup: 'Why did the container go to the party?', punchline: 'Because it was a great way to package itself!', times_displayed: 0 },
  { setup: 'What do you call a container that is always making jokes?', punchline: 'A box of laughs!', times_displayed: 0 },
  { setup: 'Why did the container fail at school?', punchline: 'It just couldn\'t contain its excitement for the next subject!', times_displayed: 0 },
  { setup: 'What do you call a container that loves to sing?', punchline: 'A note-worthy box!', times_displayed: 0 },
  { setup: 'Why did the container always get invited to the cookouts?', punchline: 'Because it was great at keeping things fresh!', times_displayed: 0 },
  { setup: 'Why was the container so good at math?', punchline: 'It was always able to compute what it contained!', times_displayed: 0 },
  { setup: 'What\'s a container\'s favorite type of music?', punchline: 'Anything with a good track record!', times_displayed: 0 },
  { setup: 'Why was the container nervous?', punchline: 'Because it was worried it would be shipped off!', times_displayed: 0 },
  { setup: 'What did the box say to the bottle?', punchline: 'You always seem to have things bottled up!', times_displayed: 0 },
  { setup: 'Why did the container join the gym?', punchline: 'To get some solid exercise!', times_displayed: 0 },
  { setup: 'Why did the container break up with the jar?', punchline: 'Because it could not handle the pressure!', times_displayed: 0 },
  { setup: 'What did one container say to the other on a road trip?', punchline: 'I think we are going to need more storage space!', times_displayed: 0 },
  { setup: 'What is a container favorite exercise?', punchline: 'Stacking!', times_displayed: 0 },
  { setup: 'Why was the container so calm?', punchline: 'It knew how to keep its contents cool.', times_displayed: 0 },
  { setup: 'How do containers handle stress?', punchline: 'They contain themselves!', times_displayed: 0 },
  { setup: 'What did the container say at the comedy club?', punchline: 'I\'m just here to contain the laughs!', times_displayed: 0 },
  { setup: 'Why didn\'t the container go to the beach?', punchline: 'It didn\'t want to get too packed!', times_displayed: 0 },
  { setup: 'What\'s a container\'s favorite board game?', punchline: 'Clue — they love solving the mystery of what\'s inside!', times_displayed: 0 },
  { setup: 'What\'s the container\'s favorite type of holiday?', punchline: 'Shipping day!', times_displayed: 0 },
  { setup: 'Why did the container get a promotion?', punchline: 'Because it was always packed with potential!', times_displayed: 0 },
  { setup: 'Why did the container bring a flashlight?', punchline: 'It didn\'t want to get lost in storage!', times_displayed: 0 },
  { setup: 'What do you call a container with great fashion?', punchline: 'A stylish storage solution!', times_displayed: 0 },
  { setup: 'Why was the container so good at solving puzzles?', punchline: 'It had a knack for fitting things together!', times_displayed: 0 },
  { setup: 'What did the container say to the delivery truck?', punchline: 'Let\'s roll, I\'ve got stuff to do!', times_displayed: 0 },
  { setup: 'What\'s a container\'s favorite TV show?', punchline: 'Storage Wars!', times_displayed: 0 },
  { setup: 'Why do containers make terrible secret agents?', punchline: 'Because they\'re always leaking information!', times_displayed: 0 },
  { setup: 'What did the container say after a workout?', punchline: 'I\'m feeling boxed out!', times_displayed: 0 },
  { setup: 'Why did the container feel so successful?', punchline: 'It always knew how to package itself for success!', times_displayed: 0 },
  { setup: 'What do containers talk about at parties?', punchline: 'The best ways to store their secrets!', times_displayed: 0 },
  { setup: 'Why did the container refuse to leave the store?', punchline: 'It was afraid of being shipped out!', times_displayed: 0 },
  { setup: 'Why did the Docker container go to therapy?', punchline: 'It had too many layers to unpack!', times_displayed: 0 },
  { setup: 'What do you call a Docker container that tells jokes?', punchline: 'A comic-tainer!', times_displayed: 0 },
  { setup: 'Why did the MongoDB database break up with the container?', punchline: 'It needed more space to scale!', times_displayed: 0 },
  { setup: 'What\'s a container\'s favorite dance move?', punchline: 'The Docker shuffle!', times_displayed: 0 },
  { setup: 'Why don\'t containers ever get lost?', punchline: 'They always know their port!', times_displayed: 0 },
  { setup: 'What did the Redis cache say to the slow database?', punchline: 'I\'ll just store that for you... in a flash!', times_displayed: 0 },
  { setup: 'Why was the container always happy?', punchline: 'Because it lived a containerized life!', times_displayed: 0 },
  { setup: 'What do you call a container that loves music?', punchline: 'A Docker Beats!', times_displayed: 0 },
  { setup: 'Why did the microservice join the comedy club?', punchline: 'To improve its container-to-container communication!', times_displayed: 0 }
];

async function seedDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('docker-chuckles-dev');
    const jokesCollection = db.collection('jokes');

    // Check if collection exists and has data
    const count = await jokesCollection.countDocuments();
    
    if (count === 0) {
      console.log('Seeding database with jokes...');
      const result = await jokesCollection.insertMany(jokes);
      console.log(`Successfully inserted ${result.insertedCount} jokes`);
    } else {
      console.log(`Database already contains ${count} jokes. Skipping seed.`);
    }

    // Create index on times_displayed for efficient queries
    await jokesCollection.createIndex({ times_displayed: 1 });
    console.log('Created index on times_displayed');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
