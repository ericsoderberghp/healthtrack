const Firestore = require('@google-cloud/firestore');
const crypto = require('crypto');

const db = new Firestore();

const buildId = (name, email) =>
  encodeURIComponent(
    `${name}-${email.replace('@', '-')}`.replace(/\.|\s+/g, '-'),
  );

const hashPassword = (track) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha512', salt);
  hash.update(track.password);
  const hashedPassword = hash.digest('hex');
  track.password = { salt, hashedPassword };
  track.token = crypto.randomBytes(16).toString('hex');
};

const checkPassword = (track, password) => {
  const { salt, hashedPassword } = track.password;
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const hashed = hash.digest('hex');
  return hashedPassword === hashed;
};

const sanitize = (trackSnap) => {
  const track = trackSnap.data();
  track.id = trackSnap.id;
  delete track.password;
  return track;
};

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.tracks = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  const sanitizeAndReturn = (trackSnap) => res.json(sanitize(trackSnap));

  const getToken = () => {
    const authorization = req.get('Authorization');
    let token;
    if (authorization) {
      token = authorization.split(' ')[1];
    }
    return token;
  };

  if (req.method === 'GET') {
    const parts = req.url.split('/');
    const id = decodeURIComponent(parts[1]);

    const token = getToken();
    if (!token) return res.status(403).send('missing Authorization');

    const trackRef = db.collection('tracks').doc(id);
    return trackRef.get().then((trackSnap) => {
      if (!trackSnap.exists) return res.status(404).send();

      const track = trackSnap.data();
      if (track.token !== token)
        // && !checkPassword(track, token))
        return res.status(403).send('not authorized');

      return sanitizeAndReturn(trackSnap);
    });
  }

  if (req.method === 'POST') {
    const parts = req.url.split('/');
    if (parts[1] === 'get') {
      // get existing track given identity
      const identity = req.body;
      const { name, email, password } = identity;
      const id = buildId(name, email);
      const trackRef = db.collection('tracks').doc(id);
      return trackRef.get().then((trackSnap) => {
        if (!trackSnap.exists) return res.status(404).send();

        if (!password) return res.status(403).send('missing Authorization');

        const track = trackSnap.data();
        if (!checkPassword(track, password))
          return res.status(403).send('not authorized');

        return sanitizeAndReturn(trackSnap);
      });
    }

    // new track
    const track = req.body;
    const { name, email } = track;
    const id = buildId(name, email);
    track.id = id;
    track.createdAt = new Date().toISOString();
    const trackRef = db.collection('tracks').doc(id);
    return trackRef.get().then((trackSnap) => {
      if (trackSnap.exists) return res.status(400).send(`${id} already exists`);

      hashPassword(track);
      return trackRef
        .set(track)
        .then(() => trackRef.get())
        .then(sanitizeAndReturn);
    });
  }

  if (req.method === 'PUT') {
    const id = decodeURIComponent(req.path.split('/')[1]);
    const nextTrack = req.body;
    const token = getToken();
    if (!token) return res.status(403).send('missing Authorization');

    const trackRef = db.collection('tracks').doc(id);
    return trackRef.get().then((trackSnap) => {
      if (!trackSnap.exists) return res.status(404).send();

      const track = trackSnap.data();
      if (track.token !== token) return res.status(403).send('not authorized');

      // check if the password is being changed
      if (typeof nextTrack.password === 'string') hashPassword(nextTrack);
      else nextTrack.password = track.password;
      nextTrack.updatedAt = new Date().toISOString();

      return trackRef
        .update(nextTrack)
        .then(() => trackRef.get())
        .then(sanitizeAndReturn);
    });
  }

  if (req.method === 'DELETE') {
    const id = decodeURIComponent(req.path.split('/')[1]);
    const token = getToken();
    if (!token) return res.status(403).send('missing Authorization');

    const trackRef = db.collection('tracks').doc(id);
    return trackRef.get().then((trackSnap) => {
      if (!trackSnap.exists) return res.status(404).send();

      const track = trackSnap.data();
      if (track.token !== token) return res.status(403).send('not authorized');

      return trackRef.delete().then(() => res.status(204).send());
    });
  }

  res.status(405).send();
};
