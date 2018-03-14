const AWS = require('aws-sdk')
const S3 = new AWS.S3()

const upload = () => {}
const download = (bucketName, key) => {
  let params = {
    Bucket: bucketName,
    Key: key
  };

  return new Promise((resolve, reject) => {
    S3.getObject(params, (err, data) => {
      if (err) reject(err);
      else resolve(data.Body.toString('utf8'));
    })
  });
}

module.exports = {
  upload: upload,
  download: download
}
