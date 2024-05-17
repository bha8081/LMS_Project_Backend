import Course from "../models/course.modules.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

// All Courses
const getAllCourses = async function(req, res, next)
{
    // We can also use try-catch.
    try {
        const courses = await Course.find({}).select('-lectures');

        res.status(200).json({
            success: true,
            message: "All courses",
            courses,
        });
    } catch (e) {
        return next(
            new AppError(e.message, 500)
        )
    }


}

// Get Lectures By Couser Id.
const getLecturesByCourseId = async function(req, res, next)
{
    try {
        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return next(
                new AppError("Invalid course Id", 400)
            )
        }

        res.status(200).json({
            success: true,
            message: "Course lectures fetched successfully",
            lectures: course.lectures
        });
    } catch (e) {
        return next(
            new AppError(e.message, 500)
        )
    }
}

//  Crerate Course
const createCourse = async (req, res, next) => {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
        return next(
            new AppError("All fields are required", 400)
        )
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail: {
            public_id: "Dummy",
            secure_url: "Dummy",
        },
    });

    if (!course) {
        return next(
            new AppError("Course could not created, please try again", 400)
        )
    }

    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "LMS"
            });
            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }
    
            // remove file
            fs.rm(`uploads/${req.file.filename}`);
        } catch (e) {
            return next(
                new AppError(e.message, 500)
            )
        }

    }

    await course.save();

    res.status(200).json({
        success: true,
        message: "Course created successfully",
        course,
    });

}

// Update Course.
const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            {
                runValidators: true
            }
        );

        if (!course) {
            return next(
                new AppError('Course with given id does not exist', 500)
            )
        }

        res.status(200).json({
            success: true,
            message: 'Course updated successfully!',
            course
        })
    } catch(e) {
        return next(
            new AppError(e.message, 500)
        )
    }
}

// Remove Course.
const removeCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return next(
                new AppError('Course with given id does not exist', 500)
            )
        }

        await Course.findByIdAndDelete(id );

        res.status(200).json({
            success: true,
            message:'Course delete successfully!!'
        })

    } catch(e) {
        return next(
            new AppError(e.message, 500)
        )
    }
}

// Add Lecture.
const addLectureToCourseById = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { id } = req.params;
    
        if (!title || !description) {
            return next(
                new AppError('Title and Description are required', 400)
            )
        }
    
        const course = await Course.findById(id);
    
        if (!course) {
            return next(
                new AppError('Invalid course id or course not found.', 400)
            )
        }
    
        const lectureData = {
            title,
            description,
            lecture: {}
        };
    
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: "LMS"
                });
                if (result) {
                    lectureData.lecture.public_id = result.public_id;
                    lectureData.lecture.secure_url = result.secure_url;
                }
        
                // remove file
                fs.rm(`uploads/${req.file.filename}`);
            } catch (e) {
                return next(
                    new AppError(e.message, 500)
                )
            }
        }
        
        course.lectures.push(lectureData);
    
        course.numberOfLectures = course.lectures.length;
    
        await course.save();
    
        res.status(200).json({
            success: true,
            message: 'Lecture successfully added to the course',
            course
        })
    } catch(e) {
        return next(
            new AppError(e.message, 500)
        )
    }

}

export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById
}