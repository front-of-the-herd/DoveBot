const schoolKeywords = [
  'dovedale', 'school', 'term', 'holiday', 'uniform', 'lunch', 'dinner',
  'club', 'class', 'teacher', 'head', 'parent', 'pupil', 'student',
  'playground', 'assembly', 'homework', 'hours', 'time', 'contact',
  'phone', 'email', 'address', 'uniform', 'pe', 'sports', 'menu',
  'food', 'meal', 'breakfast', 'snack', 'eat', 'served', 'kitchen'
];

function isSchoolRelated(message) {
  const lowercaseMessage = message.toLowerCase();
  
  const hasSchoolKeyword = schoolKeywords.some(keyword => 
    lowercaseMessage.includes(keyword)
  );
  
  const schoolPatterns = [
    /what time/i,
    /when does/i,
    /school hours/i,
    /pick up/i,
    /drop off/i,
    /contact/i,
    /phone/i,
    /email/i,
    /what.*menu/i,
    /what.*food/i,
    /what.*served/i,
    /what.*eat/i,
    /what.*lunch/i,
    /what.*dinner/i,
    /what.*breakfast/i
  ];
  
  const hasSchoolPattern = schoolPatterns.some(pattern => 
    pattern.test(message)
  );
  
  return hasSchoolKeyword || hasSchoolPattern;
}

function sanitizeInput(input) {
  return input
    .replace(/[<>\"']/g, '')
    .trim()
    .substring(0, 500);
}

module.exports = {
  isSchoolRelated,
  sanitizeInput
};