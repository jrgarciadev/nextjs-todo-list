export function decodeValue(val) {
  // Try to parse as json
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch (e) {
      console.log('(decodeValue) not_parse_value');
    }
  }

  // Return as is
  return val;
}

export function encodeValue(val) {
  if (typeof val === 'string') {
    return val;
  }
  return JSON.stringify(val);
}
