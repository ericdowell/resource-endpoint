import React from 'react'

/** useFormChange */
export type FormChangeEvent = React.ChangeEvent<
  HTMLFieldSetElement & HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement
>
