import React from 'react';
import { Formik, Form, Field } from 'formik';
import styles from './MessageForm.module.sass';

function MessageForm ({ onSubmit }) {
  return (
    <Formik initialValues={{ body: '' }} onSubmit={onSubmit}>
      {() => (
        <Form className={styles.form}>
          <Field
            className={styles.input}
            name='body'
            placeholder='Write something in space...'
            autoComplete='off'
          ></Field>
          <button type='submit' className={styles.btnSend}>
            Send
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default MessageForm;
