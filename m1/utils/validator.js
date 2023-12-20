const Ajv = require("ajv");

module.exports = schema => async (req, res, next) => {
	const ajv = new Ajv({ allErrors: true });
	const validate = ajv.compile(schema);
	const valid = await validate(req.body);

	if (valid) {
		return next();
	}

	const errors = validate.errors.map(({ message }) => message).join(", ");
	const error = new Error(errors);
	error.status = 400;

	return next(error);
};
