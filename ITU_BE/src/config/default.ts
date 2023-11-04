export const config = {
  auth: {
    secret: 'htfq4o3bcyriq4wyvtcbyrwqv3fy53bprogc',
    saltRounds: 10,
    createOptions: {
      expiresIn: 60 * 60,
      algorithm: 'HS256'
    },
    verifyOptions: {
      algorithm: 'HS256'
    }
  }
};
