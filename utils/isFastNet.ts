const isFastNet = (callback, options = {}) => {
  // eslint-disable-next-line no-underscore-dangle
  const _options = {
    timesToTest: 5,
    threshold: 1000,
    image: "https://ipfs.io/ipfs/QmX7cwxUov4R9L9bp81j9sEMyfjv3bnYJXPog4LwuhbswG/1.png", // link to ipfs, should be up for another decade
    allowEarlyExit: true,
    verbose: false,
  };

  Object.assign(_options, options);

  const arrTimes = [];
  let i = 0;
  const dummyImage = new Image();
  let isDismissed = false;

  // If verbose option is set, force allowEarlyExit to be false
  if (_options.verbose) {
    _options.allowEarlyExit = false;
  }

  // Recursively get average latency
  function testLatency(cb) {
    if (_options.allowEarlyExit) {
      setTimeout(() => {
        if (i === 0) {
          i = _options.timesToTest;
          isDismissed = true;
          cb(_options.threshold * 3 + 1);
        }
      }, _options.threshold * 3);
    }

    const startTime = new Date().getTime();
    if (i < _options.timesToTest - 1) {
      dummyImage.src = `${_options.image}?t=${startTime}`;
      dummyImage.onload = () => {
        const endTime = new Date().getTime();
        const timeTaken = endTime - startTime;
        arrTimes[i] = timeTaken;
        testLatency(cb);
        i += 1;
      };
    } else {
      /** calculate average */
      const sum = arrTimes.reduce((a, b) => a + b);
      const avg = sum / arrTimes.length;
      if (!isDismissed) {
        if (_options.verbose) {
          const objectToReturn = {
            averageLatency: avg,
            threshold: _options.threshold,
            latencyReadings: arrTimes,
          };
          cb(objectToReturn);
        } else {
          cb(avg);
        }
      }
    }
  }

  testLatency((avgInfo) => {
    if (_options.verbose) {
      // eslint-disable-next-line no-param-reassign
      avgInfo.isFast = avgInfo.averageLatency <= _options.threshold;
      callback(avgInfo);
    } else {
      callback(avgInfo <= _options.threshold);
    }
  });
};

export default isFastNet;
