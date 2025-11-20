const FieldError  = ({message}:{message:string}) => {
  return <div className="w-full p-2 bg-red-100 border border-red-500 text-red-950 font-bold">
    {message}
  </div>
}

export default FieldError;
