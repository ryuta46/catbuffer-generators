/**
 * Generator utility class.
 */
export class GeneratorUtils {

	/**
     * Converts a (64bit) uint8 array into a number array.
     * @param {Uint8Array} input A uint8 array.
     * @returns {number[]} The uint64 representation of the input.
     */
    public static uint64FromBytes (input: Uint8Array) {
        if (8 !== input.length) {
            throw Error(`byte array has unexpected size '${input.length}'`);
        }
        return [GeneratorUtils.readUint32At(input, 0), GeneratorUtils.readUint32At(input, 4)];
	}
	
	public static readUint32At(bytes: Uint8Array, index: number) {
		return (bytes[index] + (bytes[index + 1] << 8) + (bytes[index + 2] << 16) + (bytes[index + 3] << 24)) >>> 0;
	} 
	/**
	 * Throws if the value is not true.
	 *
	 * @param expression Expression to check.
	 * @param message    Format string message.
	 * @param values     Format values.
	 */
	public static void isTrue(boolean expression, String message, Object... values) {
		if (!expression) {
			throw new IllegalArgumentException(String.format(message, values));
		}
	}

	/**
	 * Throws if the value is not false.
	 *
	 * @param expression Expression to check.
	 * @param message    Format string message.
	 * @param values     Format values.
	 */
	public static void isFalse(boolean expression, String message, Object... values) {
		isTrue(!expression, message, values);
	}

	/**
	 * Creates a bitwise representation for an EnumSet.
	 *
	 * @param enumClass Enum type.
	 * @param enumSet   EnumSet to convert to bit representation.
	 * @param <T>       Type of enum.
	 * @return          Long value of the EnumSet.
	 */
	public static <T extends Enum<T> & BitMaskable> long toLong(final Class<T> enumClass, final EnumSet<T> enumSet) {
		final T[] enumValues = enumClass.getEnumConstants();
		isFalse(enumValues.length > Long.SIZE, "The number of enum constants is greater than " + Long.SIZE);
		long result = 0;
		for (final T value : enumValues) {
			if (enumSet.contains(value)) {
				result += value.getValue();
			}
		}
		return result;
	}

	/**
	 * Creates a EnumSet from from a bit representation.
	 *
	 * @param enumClass    Enum class.
	 * @param bitMaskValue Bitmask value.
	 * @param <T>          Enum type.
	 * @return             EnumSet representing the long value.
	 */
	public static <T extends Enum<T> & BitMaskable> EnumSet<T> toSet(final Class<T> enumClass, final long bitMaskValue) {
		final EnumSet<T> results = EnumSet.noneOf(enumClass);
		for (final T constant : enumClass.getEnumConstants()) {
			if (0 != (constant.getValue() & bitMaskValue)) {
				results.add(constant);
			}
		}
		return results;
	}

	/**
	 * Gets a runtime exception to propagates from an exception.
	 *
	 * @param exception Exception to propagate.
	 * @param wrap      Function that wraps an exception in a runtime exception.
	 * @param <E>       Specific exception type.
	 * @return          RuntimeException to throw.
	 */
	public static <E extends RuntimeException>  RuntimeException getExceptionToPropagate(final Exception exception,
																						 final Function<Exception,	E> wrap) {
		if ((exception instanceof ExecutionException) && (RuntimeException.class.isAssignableFrom(exception.getCause().getClass()))) {
			return (RuntimeException) exception.getCause();
		}
		if (exception instanceof RuntimeException){
			return (RuntimeException) exception;
		}
		if (exception instanceof InterruptedException) {
			Thread.currentThread().interrupt();
			return new IllegalStateException(exception);
		}
		return wrap.apply(exception);
	}

	/**
	 * Gets a runtime exception to propagates from an exception.
	 *
	 * @param exception Exception to propagate.
	 * @param <E>       Specific exception type.
	 * @return          RuntimeException to throw.
	 */
	public static <E extends RuntimeException>  RuntimeException getExceptionToPropagate(final Exception exception) {
		return getExceptionToPropagate(exception, RuntimeException::new);
	}

	/**
	 * Propagates checked exceptions as a specific runtime exception.
	 *
	 * @param callable Function to call.
	 * @param wrap     Function that wraps an exception in a runtime exception.
	 * @param <T>      Return type.
	 * @param <E>      Specific exception type.
	 * @return         Function result.
	 */
	public static <T, E extends RuntimeException> T propagate(final Callable<T> callable, final Function<Exception, E> wrap) {
		try {
			return callable.call();
		} catch (final Exception e) {
			throw getExceptionToPropagate(e, wrap);
		}
	}

	/**
	 * Propagates checked exceptions as a runtime exception.
	 *
	 * @param callable Function to call.
	 * @param <T>      Function return type.
	 * @return         Function result.
	 */
	public static <T> T propagate(final Callable<T> callable) {
		return propagate(callable, RuntimeException::new);
	}

	/**
	 * Throwing consumer interface.
	 *
	 * @param <T> Input type.
	 * @param <E> Exception that is thrown.
	 */
	public interface ThrowingConsumer<T, E extends Exception> {

		/**
		 * Performs operation on the given argument.
		 *
		 * @param t  Input argument.
		 * @throws E Exception that is thrown.
		 */
		void accept(T t) throws E;
	}

	/**
	 * Serializes data using a helper function to write to the stream.
	 *
	 * @param consumer Helper function that writes data to DataOutputStream.
	 * @return         Byte array of data written.
	 */
	public static byte[] serialize(ThrowingConsumer<DataOutputStream, Exception> consumer) {
		return propagate(() -> {
			try (final ByteArrayOutputStream byteArrayStream = new ByteArrayOutputStream();
				final DataOutputStream dataOutputStream = new DataOutputStream(byteArrayStream)) {
				consumer.accept(dataOutputStream);
				return byteArrayStream.toByteArray();
			}
		});
	}
}
