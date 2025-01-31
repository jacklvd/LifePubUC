import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
    title: {
        require: true,
        type: String
    },
    description: {
        type: String
    },
    images: [{
        type: String,
        validate: {
          validator: function(v: any) {
            return /^https?:\/\/.+/.test(v);
          },
          message: (props: { value: string; }) => `${props.value} is not a valid URL!`
        }
      }],
    location: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    }

})

export default eventSchema;