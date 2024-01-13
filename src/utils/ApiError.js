class apiError extends Error {
    constructor(
        stsatusCode,
        message= "something went wrong",
        errors=[],
        stack =''
    )
    {
        super(message);
        this.stsatusCode = stsatusCode;
        this.message = message;
        this.errors = this.errors;
        this.stack = stack;
        this.data = null;
        this.success = false;
        if(stack){
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export {apiError}