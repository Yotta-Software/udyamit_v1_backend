const fs=require('fs'),
      dotenv=require('dotenv'),
      mongoose=require('mongoose');
      // loading env vars
      dotenv.config();
      // load model
      const Digital=require('./models/DigitalLearning');
      const JOB = require('./models/Job');
      // connect with DB
      const connection = mongoose.connect( "mongodb://" +  process.env.DB_URL +"/" +process.env.DB_NAME +"?retryWrites=true",
       {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

     connection.then((success) => {
      console.log("db connected");
     })
     .catch((err) => {
      console.log("connection err ", err);
     });
      // read json files
      const digital = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf8'));
      const jobs = JSON.parse(fs.readFileSync(`${__dirname}/_data/jobs.json`,'utf8'));
      // Inserting dummy bootcamp
      const insertDummyData = async ()=>{
          try{
             const courses= await Digital.create(digital);
             const jobsArray=  await JOB.create(jobs);
              console.log('Dummy Bootcamps ,courses ,user are inserted ....');
              console.log('---- courses----',courses);
              console.log('--------------Job Array -------------',jobsArray);
              process.exit();
          }catch(err){
             console.error(err);
          }
      }

      const deleteBootcamps=async ()=>{
        try{
            await Digital.deleteMany();
            await JOB.deleteMany();
            console.log('.... db is clear .... ');
            process.exit();
        }catch(err){
           console.error(err);
        }
    }

    if(process.argv[2]=== "-i"){
        insertDummyData();
    }else if(process.argv[2]=== "-d"){
        deleteBootcamps();
    }