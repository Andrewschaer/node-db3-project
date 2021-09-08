const Schemes = require('./scheme-model');
/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = (req, res, next) => {
  const { id } = req.params;
  Schemes.findById(id)
    .then(possibleScheme => {
      if (possibleScheme) {
        req.Scheme = possibleScheme;
        next();
      } else {
        next({ message: `scheme with scheme_id ${id} not found`, 
              status: 404 });
      }
    })
    .catch(next);
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  if (
    req.body.scheme_name === undefined ||
    !req.body.scheme_name.trim() ||
    typeof req.body.scheme_name !== 'string'
  ) {
    next({ 
      message: 'invalid scheme_name',
      status: 400 });
  } else {
    next();
  }
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  if (
    req.body.instructions === undefined ||
    !req.body.instructions.trim() ||
    typeof req.body.instructions !== 'string' ||
    typeof req.body.step_number !== 'number' ||
    req.body.step_number < 1
  ) {
    next({ 
      message: 'invalid step',
      status: 400 });
  } else {
    next();
  }
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
