import React from 'react';
import { Formik, Form, Field } from 'formik';

function MessageForm ({ onSubmit }) {
  return (
    <Formik initialValues={{ body: '' }} onSubmit={onSubmit}>
      {() => (
        <Form>
          <Field name='body'></Field>
          <button type='submit'>Send</button>
        </Form>
      )}
    </Formik>
  );
}

export default MessageForm;
