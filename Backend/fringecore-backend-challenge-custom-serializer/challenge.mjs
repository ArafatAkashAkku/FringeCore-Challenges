const data = [
  42,
  "alexanderThomas",
  {
    vehicle: "sedan",
    animal: "elephant",
    ecosystem: {
      sound: "rustling",
      primaryResource: "water",
      biodiversityResearch: [
        {
          researcher: "DrEmilyRamirez",
          observation: "migratorySurvey",
        },
        "conservationData",
      ],
    },
  },
  ["riverValley", "mountainRange", "desertPlain", "coastalRegion"],
];

const customSerializer = (data) => {
  // Implement the custom serializer here
  if (typeof data === "number") {
    return `num:${data}`;
  } else if (typeof data === "string") {
    if (data.length > 2) {
      return `str:${data[0]}${data.length - 2}${data[data.length - 1]}`;
    } else {
      return `str:${data}`;
    }
  } else if (Array.isArray(data)) {
    return `arr:${data.map(customSerializer).join("")}`;
  } else if (typeof data === "object" && data !== null) {
    try {
      return `obj:${Object.values(data).map(customSerializer).join("")}`;
    } catch (error) {
      return "err:unknown";
    }
  } else {
    return "err:unknown";
  }
};

const encodedData = customSerializer(data);
console.log(encodedData);
