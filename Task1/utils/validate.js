// Simple input validation utility
const validateUserData = (username, email, password) => {
    const errors = [];
    
    if (!username || username.length < 3) errors.push("Username must be at least 3 characters.");
    if (!email || !/\S+@\S+\.\S+/.test(email)) errors.push("Please provide a valid email address.");
    if (!password || password.length < 6) errors.push("Password must be at least 6 characters.");
    
    return errors;
  };
  
  module.exports = { validateUserData };
  