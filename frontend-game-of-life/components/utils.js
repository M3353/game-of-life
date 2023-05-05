function getS3FileURL(key) {
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com/${key}`;
}
module.exports = {
  getS3FileURL,
};
