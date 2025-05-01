export class AppError extends Error {
    constructor(message, statusCode) {
    super(message)
     this.message = message;
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true; 
      Error.captureStackTrace(this, this.constructor);
    }   
    }
    


    export const handleError = (err, req, res, next) => {
       err.statusCode = err.statusCode || 500;
       err.status = err.status || 'error';

       if(!err.isOperational) {
        console.log('ERROR 💥', err);
          return res.status(500).json({
              status: 'error',
              message: 'Something went wrong!',
          });
        }

        if (process.env.NODE_ENV === 'development') {
           return res.status(err.statusCode).json({
               status: err.status,
               message: err.message,
               error: err,
               stack: err.stack,
           });
       }
         if (process.env.NODE_ENV === 'production') {
              // Log the error to a file or monitoring service
              console.error('ERROR 💥', err); // Log the error for debugging purposes
    
              // Send a generic error response to the client
              if (err.isOperational) {
                return res.status(err.statusCode).json({
                     status: err.status,
                     message: err.message,
                });
              }
         }

       return res.status(err.statusCode).json({
           status: err.status,
           message: err.message,
           error: err,
           stack: err.stack,
       });
    }