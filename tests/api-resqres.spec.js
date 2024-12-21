const {test, expect} = require("@playwright/test");
const {Ajv} = require("ajv");
const { request } = require("http");

const ajv = new Ajv();

test('GET reqres.in', async ({request})=> {
    const response = await request.get('https://reqres.in/api/users/2');

    expect(response.status()).toBe(200);

    const responseData = await response.json();

    expect(responseData.data.id).toBe(2);
    expect(responseData.data.email).toBe("janet.weaver@reqres.in");
    expect(responseData.data.first_name).toBe("Janet");
    expect(responseData.data.last_name).toBe("Weaver");
    expect(responseData.data.avatar).toBe("https://reqres.in/img/faces/2-image.jpg");
    expect(responseData.support.url).toBe("https://contentcaddy.io?utm_source=reqres&utm_medium=json&utm_campaign=referral");
    expect(responseData.support.text).toBe("Tired of writing endless social media content? Let Content Caddy generate it for you.");

    const valid = ajv.validate(require('./jsonschema/get-object-schema-reqres.json'), responseData);

    if(!valid){
        console.log("AJV Validation Errors:", ajv.errorsText());
    }

    expect(valid).toBe(true);
});

test('POST reqres.in', async({ request }) => {
    const body = {
        name : "morpheus",
        job : "leader",
    }

    const response = await request.post('https://reqres.in/api/users', {
        data : body,
    })
    // console.log(response.status());
    // console.log(await response.json());

    const responseData = await response.json();
    expect(responseData.name).toBe(body.name);
    expect(responseData.job).toBe(body.job);
    expect(responseData).toHaveProperty("id");
    expect(responseData).toHaveProperty("createdAt");

    const valid = ajv.validate(require('./jsonschema/post-object-schema-reqres.json'), responseData);

    if (!valid) {
        console.log("AJV Validation Errors:", ajv.errorsText());
    }

    expect(valid).toBe(true);
});

test('PUT reqres.in', async({ request }) => {
    const userId = 2;
    const body = {
        name : "morpheus",
        job : "zion resident"
    }

    const response = await request.put('https://reqres.in/api/users/${userId}', {
        data : body,
    })

    const responseData = await response.json();

    expect(responseData.name).toBe(body.name);
    expect(responseData.job).toBe(body.job);
    expect(responseData).toHaveProperty("updatedAt");

    const valid = ajv.validate(require('./jsonschema/put-object-schema-reqres.json'), responseData);

    if (!valid) {
        console.log("AJV Validation Errors:", ajv.errorsText());
    }

    expect(valid).toBe(true);
});

test('DELETE reqres.in', async({ request }) => {
    const userId = 2;

    const response = await request.delete('https://reqres.in/api/users/${userId}');

    expect(response.status()).toBe(204);
})