const Schemes = require('./scheme-model');

const checkSchemeId = (req, res, next) => {
  const { scheme_id } = req.params;
  Schemes.findById(scheme_id)
    .then(possibleScheme => {
      if (possibleScheme) {
        req.Scheme = possibleScheme;
        next();
      } else {
        next({ message: `scheme with scheme_id ${scheme_id} not found`, 
              status: 404 });
      }
    })
    .catch(next);
}

const validateScheme = (req, res, next) => {
  if (
    typeof req.body.scheme_name !== 'string' ||
    !isNaN(Number(req.body.scheme_name)) ||
    !(req.body.scheme_name) ||
    !req.body.scheme_name.trim()
  ) {
    next({ 
      message: 'invalid scheme_name',
      status: 400 });
  } else {
    next();
  }
};

const validateStep = (req, res, next) => {
  if (
    !(req.body.instructions) ||
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
