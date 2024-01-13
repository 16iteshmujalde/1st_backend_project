class ApiResponse{
    constructor(statusCode, data, message="success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.sussess = statusCode  <400        
    }
}
export {ApiResponse}