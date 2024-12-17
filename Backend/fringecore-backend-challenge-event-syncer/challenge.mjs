// In-memory event storage and pending requests
const eventStore = {}; // { key: { events: [event], consumers: { groupId: Set } } }
const pendingRequests = {}; // { key: [resolve-functions] }

const EVENT_EXPIRY_TIME = 2 * 60 * 1000; // 2 minutes
const POLLING_TIMEOUT = 30 * 1000; // 30 seconds


function cleanUpExpiredEvents() {
  const now = Date.now();
  for (const key in eventStore) {
    eventStore[key].events = eventStore[key].events.filter(
      (event) => now - event.timestamp < EVENT_EXPIRY_TIME
    );
    if (eventStore[key].events.length === 0) {
      delete eventStore[key];
    }
  }
}

setInterval(cleanUpExpiredEvents, 30 * 1000);

/**
 * Blocking GET function
 * @param {string} key
 * @param {string} groupId
 * @returns {Promise<Array>} - Events for the given key and groupId
 */
export async function blockingGet(key, groupId) {
  if (!key || !groupId) {
    throw new Error("Missing key or groupId");
  }

  if (!eventStore[key]) {
    eventStore[key] = { events: [], consumers: {} };
  }

  if (!eventStore[key].consumers[groupId]) {
    eventStore[key].consumers[groupId] = new Set();
  }

  const unconsumedEvents = eventStore[key].events.filter(
    (_, index) => !eventStore[key].consumers[groupId].has(index)
  );


  if (unconsumedEvents.length > 0) {
    const result = unconsumedEvents.map((event) => event.data);
    unconsumedEvents.forEach((_, index) => eventStore[key].consumers[groupId].add(index));
    return result;
  }

  return new Promise((resolve) => {
    if (!pendingRequests[key]) {
      pendingRequests[key] = [];
    }

    pendingRequests[key].push((newEvents) => {
      const result = newEvents.map((event) => event.data);
      newEvents.forEach((_, index) => eventStore[key].consumers[groupId].add(index));
      resolve(result);
    });

    setTimeout(() => resolve([]), POLLING_TIMEOUT);
  });
}

/**
 * Push function
 * @param {string} key
 * @param {Object} data - Event data
 */
export async function push(key, data) {
  if (!key || !data) {
    throw new Error("Missing key or data");
  }

  if (!eventStore[key]) {
    eventStore[key] = { events: [], consumers: {} };
  }

  const newEvent = { data, timestamp: Date.now() };
  eventStore[key].events.push(newEvent);

  if (pendingRequests[key]) {
    const resolvers = pendingRequests[key];
    delete pendingRequests[key];

    resolvers.forEach((resolve) => resolve([newEvent]));
  }
}
