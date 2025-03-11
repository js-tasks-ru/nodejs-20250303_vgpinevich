/**
 * @param num - number
 * @returns {TypeError|null} error if sum is not a number
 */
const validateNumber = (num) => {
  if (typeof num !== "number") {
    return new TypeError(`Expected numbers, but got ${typeof num}`);
  }

  return null;
};

/**
 * @param firstNumber
 * @param secondNumber
 * @returns sum of firstNumber and secondNumber
 * @throws {TypeError} if firstNumber or secondNumber is not a number
 */
export default function sum(firstNumber, secondNumber) {
  const error = validateNumber(firstNumber) || validateNumber(secondNumber);

  if (error) {
    throw error;
  }

  return firstNumber + secondNumber;
}
