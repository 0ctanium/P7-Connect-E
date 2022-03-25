import AWS from 'aws-sdk'

export const s3 = new AWS.S3({
  accessKeyId: process.env.OWN_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.OWN_AWS_SECRET_ACCESS_KEY
})
