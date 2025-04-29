import { FormEvent, forwardRef, useImperativeHandle, useRef } from "react"
import { FormHandle, FormProps } from "../types/globalTypes";


const Form = forwardRef<FormHandle, FormProps>(function Form({onSave, children, ...otherProps}, ref) {
    const form = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => {
        return {
            clear() {
                console.log('Clearing Form')
                form.current?.reset();
            },
        };
    }); 

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);
        onSave(data);
    }

    return (
        <form className="app-w-percent-100" onSubmit={handleSubmit} {...otherProps} ref={form}>
            {children}
        </form>
    )
})

export default Form;