const {validationResult,check}=require('express-validator')

exports.registrationValidation=()=>[ 
    check("name","name is required").not().isEmpty(),
    check("email","email is required").not().isEmpty(),
    check("email","enter  a valid email").isEmail(),
    check("password","enter a valid password").isLength({min:6})
  ];

  exports.loginValidation=()=>[ 
    
    check("email","email is required").not().isEmpty(),
    check("email","enter  a valid email").isEmail(),
    check("password","enter a valid password").isLength({min:6})
  ];


exports.validation=(req,res,next)=>{ 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    next()
}