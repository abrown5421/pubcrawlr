import { ComponentPropsWithoutRef, FormEvent, forwardRef, useImperativeHandle, useRef } from "react";

export type FormHandle = {
    clear: () => void;
};

type FormProps = ComponentPropsWithoutRef<'form'> & {
    onSave: (value: FormData) => void;  
};

const Form = forwardRef<FormHandle, FormProps>(function Form({ onSave, children, ...otherProps }, ref) {
    const form = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => {
        return {
            clear() {
                console.log('Clearing Form');
                form.current?.reset();
            },
        };
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData) as FormData;  
        onSave(data); 
    }

    return (
        <form onSubmit={handleSubmit} {...otherProps} ref={form}>
            {children}
        </form>
    );
});

export default Form;
