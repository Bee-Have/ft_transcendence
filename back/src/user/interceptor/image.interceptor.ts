import { HttpException } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
const multer  = require('multer')

export const ImageInterceptor = FileFieldsInterceptor(
	[{name: 'avatar', maxCount: 1 }],
{
	storage: multer.diskStorage({
		destination: process.env.AVATAR_DIRECTORY,
		filename: async function (req, file, cb){
			console.log(file)
			cb(null, (req.user.sub).toString() + '.jpeg')
		}
	}),
	limits: {
		fileSize: 100000,
		files: 1,
		fields: 0
	},
	fileFilter: function (req, file, cb)
	{
		if (file.mimetype !== 'image/jpeg')
			cb(new HttpException('wrong type must be .jpeg', 400), false)
		else
			cb(null, true)
	}
})