const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto');

const storage = new Storage();
const bucket = storage.bucket('tracks');

const hashPassword = (track) => {
  if (track.password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHmac('sha512', salt);
    hash.update(track.password);
    const hashedPassword = hash.digest('hex');
    track.password = { salt, hashedPassword };
  }
};

const checkPassword = (track, password) => {
  const { salt, hashedPassword } = track.password;
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const hashed = hash.digest('hex');
  return hashedPassword === hashed;
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
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  if (req.method === 'GET') {
    const parts = req.url.split('/');
    const id = decodeURIComponent(parts[1]);
    const authorization = req.get('Authorization');
    let password;
    if (authorization) {
      const encoded = authorization.split(' ')[1];
      const buffer = Buffer.from(encoded, 'base64');
      password = buffer.toString();
    }

    // get the track in question, no matter the sub-paths
    const file = bucket.file(`${id}.json`);
    return file
      .download()
      .then((data) => {
        const track = JSON.parse(data[0]);
        if (track.password && (!password || !checkPassword(track, password))) {
          return res.header('WWW-Authenticate', 'Basic').status(401).send();
        }

        track.id = id;
        return track;
      })
      .then((track) => {
        res.status(200).type('json').send(JSON.stringify(track));
      })
      .catch((e) => res.status(400).send(e.message));
  }

  if (req.method === 'POST') {
    const parts = req.url.split('/');
    const authorization = req.get('Authorization');
    let password;
    if (authorization) {
      const encoded = authorization.split(' ')[1];
      const buffer = Buffer.from(encoded, 'base64');
      password = buffer.toString();
    }

    if (parts.length === 2) {
      // new track
      const track = req.body;
      const id = encodeURIComponent(
        `${track.name}-${track.email.replace('@', '-')}`.replace(
          /\.|\s+/g,
          '-',
        ),
      );
      const file = bucket.file(`${id}.json`);

      return file
        .download()
        .then((data) => {
          const existingTrack = JSON.parse(data[0]);

          if (
            existingTrack.password &&
            (!password || !checkPassword(existingTrack, password))
          ) {
            return res.header('WWW-Authenticate', 'Basic').status(401).send();
          }

          hashPassword(track);
          file
            .save(JSON.stringify(track), { resumable: false })
            .then(() => res.status(200).type('text').send(id))
            .catch((e) => res.status(500).send(e.message));
        })
        .catch(() => {
          // doesn't exist yet, add it
          hashPassword(track);
          file
            .save(JSON.stringify(track), { resumable: false })
            .then(() => res.status(201).type('text').send(id))
            .catch((e) => res.status(500).send(e.message));
        });
    }
  }

  if (req.method === 'DELETE') {
    const file = bucket.file(`${req.url}.json`);
    return file.delete().then(() => res.status(200).send());
  }

  res.status(405).send();
};
