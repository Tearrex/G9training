// is this a development build? (too much trouble with env)
const dev = true;
export const fSettings = {
	// training route
	maintenance: false,
	// rest api
	serverDomain: !dev ? "https://gonz9training.com" : "https://localhost:3001",
	// google recaptcha
	siteKey: "6LdwgdUeAAAAAE_mJ31VovJV10YrXdHgT5Cz4YeE",
};
