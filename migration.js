import mongoose, { Schema }  from "mongoose";
import fs from "fs";

const userSchema = new mongoose.Schema({
    name : {
        type: String, 
        required: true 
    },
    location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
});

userSchema.index({ location: '2dsphere' });
const User = mongoose.model('User', userSchema); 


const stuffSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Stuff = mongoose.model('Stuff', stuffSchema); 

const connectToDatabase = async () => {
    try {
        await mongoose.connect("mongodb://dylan:interview@127.0.0.1:27017/hydrogen");
        console.log('🚀 mongodb connected.')
    }  catch (error) {
        console.error(`ERROR: ${error}`);
        console.log('🔴 mongodb not connected.')
    } 
}  

const main = async () => {

    try{
        const filepath = process.argv.slice(2).toString();

        if (!filepath || filepath.split('.').pop() != "json") {
            throw "Please provide a json file in argument of this script"
        }
    
        const data = await fs.promises.readFile(filepath);
        const parsedData = JSON.parse(data);
        

        connectToDatabase();

        for (const obj of parsedData) {
            const user = new User({
                name: obj.name,
                location: {
                    type: "Point",
                    coordinates: [obj.long, obj.lat]
                }
            });
            const newUser = await user.save();

            console.log(newUser);

            const stuff = new Stuff({
                user_id: newUser._id,
                description: obj.desc
            });

            await stuff.save();
        }

        await mongoose.connection.close();

        console.log("datas successfully imported");


    } catch(error) {
        console.error(error)
    }
}

main()