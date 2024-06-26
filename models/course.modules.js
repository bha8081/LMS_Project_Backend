import { model, Schema } from "mongoose";

// course schema
const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minLenght: [8, 'Title must be at least 8 characters'],
        maxLength: [150, 'Title should be less than 150 characters'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minLenght: [20, 'Description must be at least 20 characters'],
        maxLength: [200, 'Description should be less than 200 characters'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    lectures: [
        {
            title: String,
            description: String,
            lecture: {
                public_id: {
                    type: String,
                    required: false
                },
                secure_url: {
                    type: String,
                    required: false
                }
            }
        }
    ],
    numberOfLectures: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Course = model("Course", courseSchema);

export default Course;