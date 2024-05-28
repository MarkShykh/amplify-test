import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Patient: a
    .model({
      name: a.string(),
      surname: a.string(),
      dob: a.date(),
      address: a.string(),
      phone: a.string(),
      measurements: a.hasOne("BioResults", "id"),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  BioResults: a
    .model({
      bloodPressure: a.string(),
      odometerValue: a.string(),
      glucose: a.string(),
      bpm: a.string(),
      patientId: a.belongsTo("Patient", "id"),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
