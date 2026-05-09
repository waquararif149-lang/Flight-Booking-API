export default class ApplicationError extends Error{
   constructor(message,code){
    super(message,code);
    this.code=code;
   }
}