
//-----------hitesh version------------------

// const asyncHandler = (requestHandler) => {
//     (req, res, next) => {
//         Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
//     }
// }

//----------------error free according to chatgpt----------------









// asyncHandler is a higher-order function.
// It accepts a route handler function (usually async)
// and returns a new function that wraps it with
// automatic Promise error handling.
const asyncHandler = (requestHandler) =>

    // This returned function is the actual Express middleware.
    // Express will call this function when a request hits the route.
    // It receives (req, res, next) from Express.
    (req, res, next) =>

        // Promise.resolve ensures that whatever requestHandler returns
        // (value, promise, or async result) is treated as a Promise.
        // If requestHandler throws inside an async function,
        // it becomes a rejected Promise automatically.
        Promise

            // requestHandler is your actual controller function.
            // It is executed here when the request comes in.
            .resolve(requestHandler(req, res, next))

            // If the returned Promise is rejected,
            // .catch(next) forwards the error to Express.
            // Calling next(error) tells Express to skip normal flow
            // and move to the error-handling middleware.
            .catch(next);


// Exporting asyncHandler so it can be used in route files
// to wrap multiple controllers and avoid repetitive try/catch blocks.
export { asyncHandler };












//==============================ANOTHER WAY TO WRITE asyncHANDLER================
//const asyncHandler=()=>{}
//const asyncHandler=(func)=>()=>{}
//const asyncHandler= (func) => async () =>{}


// const asyncHandler = (fn) => async (req,res,next) => {
//     try {
//         await fn(req, res, next)
//     }
//     catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
    
// }














/*
======================== COMPLETE FLOW + DOUBT CLARIFICATION ========================

🔹 1️⃣ What Happens When Server Starts?

- asyncHandler(controller) runs immediately during route registration.
- It DOES NOT execute the controller.
- It RETURNS a new wrapped middleware function.
- Express stores that wrapped function.
- ❗ No Promise is created at this stage.
- ❗ Controller does NOT run at server start.

-------------------------------------------------------------------------------

🔹 2️⃣ When a Request Hits the Route

- Express calls the wrapped function with (req, res, next).
- Only now does requestHandler (your controller) execute.
- ❗ Promise is created ONLY at this moment.

-------------------------------------------------------------------------------

🔹 3️⃣ If Controller is Async and Throws

Example:
    const controller = async () => {
        throw new Error("Fail");
    };

- Inside async, "throw" becomes Promise.reject(error).
- It does NOT throw synchronously.
- It returns a rejected Promise.
- ❗ Doubt resolved: async throw ≠ normal throw.
  It becomes a rejected Promise.

-------------------------------------------------------------------------------

🔹 4️⃣ Why Promise.resolve() Is Used

- If controller returns a value → it becomes Promise.resolve(value).
- If controller returns a Promise → Promise.resolve adopts it.
- If controller returns Promise.reject → it stays rejected.
- ❗ Doubt resolved: Promise.resolve does NOT wrap promises twice.
  It adopts the state of the given promise (called promise flattening).

-------------------------------------------------------------------------------

🔹 5️⃣ How .catch(next) Works

- If the Promise rejects → .catch(next) runs.
- .catch(next) is shorthand for:
      .catch(error => next(error))

- ❗ Doubt resolved: next(error) does NOT throw.
  It signals Express to move to error-handling middleware.

-------------------------------------------------------------------------------

🔹 6️⃣ What next(error) Actually Does

- Stops normal middleware flow.
- Skips remaining route logic.
- Jumps to error middleware:
      app.use((err, req, res, next) => { ... })

- If no custom error middleware exists,
  Express uses its default error handler.

-------------------------------------------------------------------------------

🔹 7️⃣ What Happens With Synchronous Throw?

Example:
    const controller = () => {
        throw new Error("Fail");
    };

- This throws immediately.
- Promise.resolve never executes.
- .catch(next) does NOT catch this.
- Express itself catches synchronous throws internally.
- ❗ Doubt resolved: sync throw and rejected Promise are different mechanisms.

-------------------------------------------------------------------------------

🔹 8️⃣ Why We Cannot "Just Throw Everything"

- Async operations (DB, network, files) are Promise-based.
- Async functions always return Promises.
- Throw inside async becomes Promise rejection.
- Express does not automatically catch rejected Promises.
- Therefore we must forward them using .catch(next).

-------------------------------------------------------------------------------

🔹 9️⃣ What asyncHandler Does NOT Do

- Does NOT execute controller early.
- Does NOT create Promises at startup.
- Does NOT apply to startup functions like connectDB().
- Only wraps Express route/middleware functions.

-------------------------------------------------------------------------------

FINAL MENTAL MODEL:

Request Hits Route
        ↓
Wrapped Function Executes
        ↓
Controller Runs
        ↓
If Promise Rejects
        ↓
.catch(next)
        ↓
next(error)
        ↓
Express Error Middleware
        ↓
Client Receives Error Response

===============================================================================
*/
