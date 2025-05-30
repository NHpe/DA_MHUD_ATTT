import { connection, mongo } from 'mongoose';

export const getGridFsBucketFile = () => {
  return new mongo.GridFSBucket(connection.db, {
    bucketName: 'files',
  });
};