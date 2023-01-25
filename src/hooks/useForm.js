import { useEffect, useMemo, useState } from 'react';

export const useForm = (initialForm = {}, formValidations = {}) => {
  // formState es el estado del formulario y setFormState es la función que lo actualiza
  // initialForm es el estado inicial del formulario y se le pasa como argumento al hook useForm desde los componentes que lo usan
  const [formState, setFormState] = useState(initialForm);
  const [formValidation, setFormValidation] = useState({});

  useEffect(() => {
    createValidators();
  }, [formState]);

  useEffect(() => {
    setFormState(initialForm);
  }, [initialForm]);

  const isFormValid = useMemo(() => {
    // si formValidation tiene algun valor que no sea null, es decir, si tiene algun mensaje de error, entonces el formulario no es válido
    // si formValidation no tiene ningun valor que no sea null, es decir, si no tiene ningun mensaje de error, entonces el formulario es válido
    return Object.values(formValidation).every((value) => value === null);
    // si el formulario es valido devuelve true, si no, devuelve false
    // y evalua si todos los valores de formValidation son null
  }, [formValidation]);

  // ahora se crea una función que actualiza el estado del formulario con los valores que se le pasan como argumento
  // target es el objeto que contiene el name y el value de cada input del formulario
  // y segun el name y el value de cada input del formulario se actualiza el estado del formulario
  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  const createValidators = () => {
    const formCheckValues = {};

    for (const formField of Object.keys(formValidations)) {
      // desestructuramos el array de formValidations que devuelve cada función de validación y el mensaje de error
      const [fn, errorMessage] = formValidations[formField];

      // ahora rellenamos el objeto formCheckValues con los valores de cada campo del formulario
      // osea emailValid, passwordValid, nameValid, etc
      // y cada una de esas propiedades tendra un valor booleano en caso de que la validación sea correcta
      // o un mensaje de error en caso de que la validación sea incorrecta
      // quedaria algo asi: { emailValid: true, passwordValid: 'El password debe tener al menos 6 caracteres', nameValid: true, etc }
      formCheckValues[`${formField}Valid`] = fn(formState[formField])
        ? null
        : errorMessage;
    }
    setFormValidation(formCheckValues);
  };

  return {
    ...formState, // esta propiedad contiene el email, el password, el displayName
    formState,
    onInputChange,
    onResetForm,
    ...formValidation, // esta propiedad contiene el emailValid, el passwordValid, el displayNameValid
    isFormValid,
  };
};
