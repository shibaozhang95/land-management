let validation = function (requestType, requestBody) {
  
  let validationResult;
  switch(requestType) {
    case 'create_user':
      validationResult = validateCreateAdmin(requestBody)
      break;
    case 'create_native_title':
      validationResult = validationCreateNativeTitle(requestBody)
      break;
    default:
  }

  return validationResult;
}

function validateCreateAdmin(requestBody) {
  let newRequestBody = {};

  if (requestBody.username && typeof(requestBody.username) == 'string') {
    newRequestBody.username = requestBody.username;
  }
  else {
    return {
      code: -1,
      errMsg: 'username error'
    }
  }

  if (requestBody.password && typeof(requestBody.username) == 'string') {
    newRequestBody.password = requestBody.password;
  }
  else {
    return {
      code: -1,
      errMsg: 'password error'
    }
  }

  if (requestBody.user_type != undefined && typeof(requestBody.user_type) == 'number') {
    newRequestBody.user_type = requestBody.user_type;
  }
  else {
    return {
      code: -1,
      errMsg: 'user type error'
    }
  }

  return {
    code: 0,
    data: newRequestBody
  }
}

function validationCreateNativeTitle(requestBody){
let newRequestBody = {};

if(requestBody.agreement_type != undefined && typeof(requestBody.agreement_type) == 'number') {
  newRequestBody.agreement_type = requestBody.agreement_type;
}
else {
  return {
    code: -1,
    errMsg: 'agreement type error'
  }
}

if(requestBody.plot_id != undefined && typeof(requestBody.plot_id) == 'string') {
  newRequestBody.plot_id = requestBody.plot_id;
}
else {
  return {
    code: -1,
    errMsg: 'plot_id error'
  }
}

if(requestBody.address != undefined && typeof(requestBody.address) == 'string') {
  newRequestBody.address = requestBody.address;
}
else {
  return {
    code: -1,
    errMsg: 'address error'
  }
}

if(requestBody.owner != undefined && typeof(requestBody.owner) == 'string') {
  newRequestBody.owner = requestBody.owner;
}
else {
  return {
    code: -1,
    errMsg: 'owner error'
  }
}

if(requestBody.coordinates != undefined && typeof(requestBody.coordinates) == 'array') {
  newRequestBody.coordinates = requestBody.coordinates;
}
else {
  return {
    code: -1,
    errMsg: 'coordinates error'
  }
}


  return{
    code: 0,
    data: newRequestBody
  }
}
module.exports = validation
