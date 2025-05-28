class ApiResponse {
  static success(status, message, data) {
    return {
      success: true,
      status,
    //   timestamp: new Date().toISOString(),
      message,
      ...(data !== null && { data })
    };
  }

  static error(status, message, error, code) {
    return {
      success: false,
      status,
    //   timestamp: new Date().toISOString(),
      message,
      ...(error !== null && { error }),
      ...(code !== null && { code })
    };
  }
}

module.exports = ApiResponse;
