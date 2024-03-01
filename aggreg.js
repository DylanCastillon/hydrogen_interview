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

const User = mongoose.model('User', userSchema); 

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
        connectToDatabase();

        const data = await User.aggregate([
            {
                $geoNear: {
                    near: {type: "Point", coordinates:[7.289429, 43.675819]},
                    distanceField: "dist.calculated",
                    includeLocs: "dist.location",
                }
            },
            {
                $lookup: {
                    from: "stuffs",
                    localField:"_id",
                    foreignField:"user_id",
                    pipeline:[{$project:{description:1}}],
                    as: "userstuff"
                }
            },
            {
                $replaceRoot: { 
                    newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$userstuff", 0 ] }, "$$ROOT" ] }
                }
            },
            {
                $project: {
                    __v:0,
                    userstuff:0,
                    dist: 0,
                }
            },
            {
                $set: {
                    location: "$location.coordinates"
                }
            },
        ]);
    
        await mongoose.connection.close();
    
        console.log(data);
    
        await fs.promises.writeFile("./output.json", JSON.stringify(data, null, 4));
    
    } catch (error) {
        console.error(error)
    }
}

main()