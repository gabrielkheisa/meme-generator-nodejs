const sanitizeInput = (text) => {
  const allowedCharacters = /^[A-Za-z0-9\s,]$/;
  const sanitizedText = text.replace(/[^A-Za-z0-9\s,]/g, '');
  return sanitizedText;
};

const input = "<script>alert('Hello, world 123!');</script>";
const sanitizedOutput = sanitizeInput(input);
console.log(sanitizedOutput); // Output: scriptalert(Hello, world!)